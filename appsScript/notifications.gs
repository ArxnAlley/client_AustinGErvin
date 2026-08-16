/* ============================================================
   NOTIFICATION

   One email, to one address. Written to be read on a phone, in a
   hurry, by somebody who is deciding whether to call this person
   back today.

   The subject carries the name, so a full inbox is still
   scannable. The phone number is the first line of the body and
   is a tel: link, so it is one tap from the notification.
============================================================ */


/* Apps Script's own date formatting, in the firm's timezone —
   not the server's, and not the visitor's. Austin reads these in
   Portsmouth. */

function formatStamp(date)
{

    return Utilities.formatDate(date, TIME_ZONE, "EEEE d MMMM yyyy 'at' h:mm a");

}


/* (740) 529-1420 from 7405291420, when there are exactly ten
   digits to work with. Anything else is passed through as typed —
   an international number reformatted by guesswork is worse than
   one left alone. */

function prettyPhone(digits, original)
{

    if (digits.length === 10)
    {

        return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);

    }

    if (digits.length === 11 && digits.charAt(0) === '1')
    {

        return '(' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7);

    }

    return original;

}


/**
 * Sends the lead. Throws on failure so the caller can return a
 * real error rather than telling the visitor it worked.
 */

function sendConsultationEmail(lead)
{

    const display = prettyPhone(lead.phoneDigits, lead.phone);

    const stamp = formatStamp(lead.submittedAt);

    const subject = SUBJECT_PREFIX + ' — ' + lead.name;

    /* ── Plain text ──

       Sent as the alternative body, and it is the one that shows
       in a notification preview. Front-load the number. */

    const plain = [
        SUBJECT_PREFIX.toUpperCase(),
        '',
        'Name    ' + lead.name,
        'Phone   ' + display,
        'Email   ' + (lead.email || 'not supplied'),
        '',
        'Reason for contacting',
        '---------------------',
        lead.reason,
        '',
        'Submitted ' + stamp,
        '',
        '--',
        'Sent by the consultation form on austingervin.com.',
        'This message was not reviewed before sending. Treat the sender as unverified.'
    ].join('\n');

    /* ── HTML ──

       Every visitor-supplied value goes through escapeHtml. The
       reason keeps its paragraph breaks, so a message written in
       three paragraphs arrives as three paragraphs. */

    const reasonHtml = escapeHtml(lead.reason)
        .split('\n')
        .map(function (line) { return line.trim() === '' ? '' : '<p style="margin:0 0 12px;">' + line + '</p>'; })
        .join('');

    const emailRow = lead.email
        ? '<tr><td style="padding:6px 16px 6px 0;color:#6A6C72;font-size:13px;letter-spacing:.06em;text-transform:uppercase;">Email</td>'
            + '<td style="padding:6px 0;font-size:16px;"><a href="mailto:' + encodeURI(lead.email) + '" style="color:#8A6A33;">' + escapeHtml(lead.email) + '</a></td></tr>'
        : '<tr><td style="padding:6px 16px 6px 0;color:#6A6C72;font-size:13px;letter-spacing:.06em;text-transform:uppercase;">Email</td>'
            + '<td style="padding:6px 0;font-size:16px;color:#6A6C72;">Not supplied</td></tr>';

    const html = [
        '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0B0B0D;">',

        '<div style="background:#0B0B0D;padding:20px 24px;">',
        '<p style="margin:0;color:#C19E61;font-size:13px;letter-spacing:.18em;text-transform:uppercase;">' + escapeHtml(SUBJECT_PREFIX) + '</p>',
        '<p style="margin:6px 0 0;color:#F6F5F3;font-size:22px;">' + escapeHtml(lead.name) + '</p>',
        '</div>',

        '<div style="padding:24px;background:#FAF8F5;">',

        '<table style="width:100%;border-collapse:collapse;">',
        '<tr><td style="padding:6px 16px 6px 0;color:#6A6C72;font-size:13px;letter-spacing:.06em;text-transform:uppercase;">Phone</td>',
        '<td style="padding:6px 0;font-size:18px;"><a href="tel:' + escapeHtml(lead.phoneDigits) + '" style="color:#8A6A33;font-weight:600;">' + escapeHtml(display) + '</a></td></tr>',
        emailRow,
        '<tr><td style="padding:6px 16px 6px 0;color:#6A6C72;font-size:13px;letter-spacing:.06em;text-transform:uppercase;">Received</td>',
        '<td style="padding:6px 0;font-size:14px;color:#6A6C72;">' + escapeHtml(stamp) + '</td></tr>',
        '</table>',

        '<p style="margin:22px 0 8px;color:#6A6C72;font-size:13px;letter-spacing:.06em;text-transform:uppercase;">Reason for contacting</p>',
        '<div style="padding:16px;background:#FFFFFF;border-left:3px solid #C19E61;font-size:16px;line-height:1.6;">' + reasonHtml + '</div>',

        '</div>',

        '<div style="padding:16px 24px;background:#F0EDE7;color:#6A6C72;font-size:12px;line-height:1.6;">',
        'Sent by the consultation form on austingervin.com. This message was not reviewed before sending &mdash; treat the sender as unverified. Submitting the form does not create an attorney&ndash;client relationship.',
        '</div>',

        '</div>'
    ].join('');

    /* replyTo only when an address was supplied and parsed. A
       replyTo pointing at nothing turns "Reply" into a bounce. */

    const options = {

        name: 'Austin G. Ervin Website',
        htmlBody: html

    };

    if (lead.email)
    {

        options.replyTo = lead.email;

    }

    MailApp.sendEmail(RECIPIENT, subject, plain, options);

}
