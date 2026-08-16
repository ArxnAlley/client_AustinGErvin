/* ============================================================
   VALIDATION AND SANITIZATION

   Two jobs, kept separate on purpose:

     validateSubmission   decides whether this is a real enquiry
     sanitizeText         decides what is safe to put in an email

   The browser also validates, and the browser's validation is a
   courtesy to the visitor. This one is the real gate: a form post
   can be made with curl, and everything below assumes it was.
============================================================ */


/* The two character ranges this file strips, declared as ASCII
   strings and compiled with the RegExp constructor.

   Written directly into a regex literal, these ranges put raw
   control bytes into the source file itself — invisible in every
   editor, mangled by copy-paste, and impossible to review in a
   diff. As a string, every escape is legible.

   C0 and C1, sparing tab (0009) and newline (000A) only.
   Carriage return is NOT spared: a stray \r in what becomes a mail
   header line is how header injection starts. */

const CONTROL_RANGE = '\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F';

/* Zero-width characters and bidirectional overrides: invisible in
   an inbox, and used to disguise text. */

const INVISIBLE_RANGE = '\u200B-\u200F\u202A-\u202E\u2060\uFEFF';


/* Strips the characters that have no business in a name or a
   message, collapses runaway whitespace, and truncates.

   Control characters are removed rather than escaped because
   there is no legitimate reason for one to arrive in a contact
   form, and a stray \r\n in a header line is how header injection
   starts. */

function sanitizeText(value, maxLength)
{

    if (typeof value !== 'string')
    {

        return '';

    }

    let clean = value;

    clean = clean.replace(new RegExp('[' + CONTROL_RANGE + ']', 'g'), '');

    clean = clean.replace(new RegExp('[' + INVISIBLE_RANGE + ']', 'g'), '');

    /* No more than two consecutive newlines, and no runs of
       spaces. Preserves paragraphs, kills padding. */
    clean = clean.replace(/[ \t]{2,}/g, ' ');
    clean = clean.replace(/\n{3,}/g, '\n\n');

    clean = clean.trim();

    if (clean.length > maxLength)
    {

        clean = clean.slice(0, maxLength).trim() + '…';

    }

    return clean;

}


/* Escapes for the HTML body of the notification. The visitor's
   words are attacker-controlled text being placed in a document —
   treat them that way even though the only reader is Austin. */

function escapeHtml(value)
{

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

}


/* Digits only, for counting. Formatting is the visitor's business
   — (740) 529-1420 and 7405291420 are the same number and both
   are accepted. */

function phoneDigits(value)
{

    return String(value || '').replace(/\D/g, '');

}


/* Deliberately permissive. A regex that tries to be RFC 5322 is
   either wrong or unreadable, and this field is OPTIONAL — the
   cost of rejecting a valid unusual address is losing a client,
   and the cost of accepting an invalid one is a bounced reply. */

function looksLikeEmail(value)
{

    if (!value)
    {

        return true;

    }

    if (value.length > LIMITS.emailMax)
    {

        return false;

    }

    return /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value);

}


/**
 * Returns { ok: true, lead } or { ok: false, code, message, field }.
 *
 * The message is for the log and for a developer. The website
 * shows its own wording; it never renders a server string to a
 * visitor.
 */

function validateSubmission(payload)
{

    if (!payload || typeof payload !== 'object')
    {

        return { ok: false, code: ERROR_CODES.badRequest, message: 'No payload.' };

    }

    /* ── Honeypot ──

       A field named `company`, hidden from sight and from
       assistive technology, and never filled by a person. If it
       has anything in it, this is a bot.

       It reports SUCCESS. A bot that is told it failed adapts;
       one that is told it succeeded goes away. Nothing is sent. */

    if (typeof payload.company === 'string' && payload.company.trim() !== '')
    {

        return { ok: false, code: 'HONEYPOT', message: 'Honeypot filled.', silent: true };

    }

    /* ── Timing ──

       The page stamps `renderedAt` when the form is drawn. Too
       fast is a script; absurdly slow is a stale tab that has been
       open since yesterday, which is usually a replayed payload. */

    const elapsed = Number(payload.elapsedSeconds);

    if (isFinite(elapsed) && elapsed >= 0)
    {

        if (elapsed < SPAM.minFillSeconds)
        {

            return { ok: false, code: 'TOO_FAST', message: 'Submitted in ' + elapsed + 's.', silent: true };

        }

        if (elapsed > SPAM.maxFillSeconds)
        {

            return { ok: false, code: 'STALE', message: 'Form open ' + elapsed + 's.', silent: true };

        }

    }

    /* ── Required fields ── */

    const name = sanitizeText(payload.name, LIMITS.nameMax);

    if (name.length < LIMITS.nameMin)
    {

        return { ok: false, code: ERROR_CODES.validation, field: 'name', message: 'Name too short.' };

    }

    const phoneRaw = sanitizeText(payload.phone, LIMITS.phoneMax);
    const digits = phoneDigits(phoneRaw);

    if (digits.length < LIMITS.phoneDigitsMin || digits.length > LIMITS.phoneDigitsMax)
    {

        return { ok: false, code: ERROR_CODES.validation, field: 'phone', message: 'Phone has ' + digits.length + ' digits.' };

    }

    const reason = sanitizeText(payload.reason, LIMITS.reasonMax);

    if (reason.length < LIMITS.reasonMin)
    {

        return { ok: false, code: ERROR_CODES.validation, field: 'reason', message: 'Reason too short.' };

    }

    /* ── Optional field ── */

    const email = sanitizeText(payload.email, LIMITS.emailMax);

    if (email && !looksLikeEmail(email))
    {

        return { ok: false, code: ERROR_CODES.validation, field: 'email', message: 'Email not parseable.' };

    }

    /* A link in every field is a pattern no genuine enquiry has.
       One link in the reason is fine — someone pasting a docket
       URL is legitimate. */

    const linkCount = (reason.match(/https?:\/\//gi) || []).length
        + (name.match(/https?:\/\//gi) || []).length;

    if (linkCount > 3)
    {

        return { ok: false, code: 'LINK_SPAM', message: linkCount + ' links.', silent: true };

    }

    return {

        ok: true,

        lead: {
            name: name,
            phone: phoneRaw,
            phoneDigits: digits,
            email: email,
            reason: reason,
            submittedAt: new Date()
        }

    };

}


/* ============================================================
   RATE LIMITING

   CacheService rather than PropertiesService: it expires on its
   own, it is fast, and losing the contents on a cache eviction
   degrades to "one extra email", which is the correct failure.
============================================================ */


/**
 * True when this submission should be dropped as a duplicate.
 * Keyed on the phone number, because that is the field a person
 * retyping the form will keep identical.
 */

function isDuplicate(digits)
{

    const cache = CacheService.getScriptCache();

    const key = 'dup_' + digits;

    if (cache.get(key))
    {

        return true;

    }

    cache.put(key, '1', SPAM.duplicateWindowSeconds);

    return false;

}


/**
 * A ceiling on the whole script, not per visitor — Apps Script
 * never sees a client IP, so per-visitor limiting is not
 * available and pretending otherwise would be theatre.
 */

function underHourlyLimit()
{

    const cache = CacheService.getScriptCache();

    const key = 'rate_' + Utilities.formatDate(new Date(), TIME_ZONE, 'yyyyMMddHH');

    const current = Number(cache.get(key) || 0);

    if (current >= SPAM.maxPerHour)
    {

        return false;

    }

    cache.put(key, String(current + 1), 3600);

    return true;

}
