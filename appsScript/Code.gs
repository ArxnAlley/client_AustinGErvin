/* ============================================================
   AUSTIN G. ERVIN — CONSULTATION INTAKE
   Google Apps Script web app · Nulo Studio

   Receives the consultation form from austingervin.com and emails
   the lead to the address in config.gs. Nothing is stored: there
   is no spreadsheet, no Drive folder, and no copy of anybody's
   matter sitting in a Google account. The email is the record.

   Deployment steps are in README.md. Do not tell anyone the form
   is live until step 6 of that file has actually been run.

   Two transport realities this file encodes rather than fights:

     1. An Apps Script web app cannot answer a CORS preflight. The
        website therefore posts Content-Type text/plain carrying
        JSON, which keeps the request "simple" so no preflight is
        sent. The body is still JSON and is parsed as such below.

     2. Apps Script always returns HTTP 200, whatever happens. The
        envelope carries the real status:
            { success: true,  data: {...} }
            { success: false, error: { code, message } }
        The website branches on `success`, never on the HTTP code.
============================================================ */


/* ============================================================
   RESPONSES
============================================================ */

function jsonResponse(payload)
{

    return ContentService
        .createTextOutput(JSON.stringify(payload))
        .setMimeType(ContentService.MimeType.JSON);

}


function successResponse(data)
{

    return jsonResponse({ success: true, data: data || {} });

}


function errorResponse(code, message)
{

    return jsonResponse({ success: false, error: { code: code, message: message } });

}


function logError(where, error)
{

    console.error(where + ': ' + (error && error.stack ? error.stack : error));

}


/* ============================================================
   BODY PARSING

   Accepts the text/plain-carrying-JSON the website sends, and
   also a normal form post, so the endpoint can be exercised with
   curl during setup without pretending to be the site.
============================================================ */

function parseRequestBody(request)
{

    if (!request)
    {

        return {};

    }

    if (request.postData && request.postData.contents)
    {

        try
        {

            return JSON.parse(request.postData.contents);

        }
        catch (parseError)
        {

            /* Fall through to form parameters rather than failing:
               a hand-made test post is more likely malformed JSON
               than malicious. */

        }

    }

    return (request.parameter) ? request.parameter : {};

}


/* ============================================================
   GET

   A health check, and nothing else. Deploying a web app and
   visiting the URL should say something other than an error page,
   so Aron can confirm the deployment before wiring the site to
   it. It deliberately reports nothing about configuration.
============================================================ */

function doGet()
{

    return successResponse({

        service: 'Austin G. Ervin consultation intake',
        status: 'ready',
        time: Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX")

    });

}


/* ============================================================
   POST — the only route that does anything
============================================================ */

function doPost(request)
{

    try
    {

        const payload = parseRequestBody(request);

        const result = validateSubmission(payload);

        /* A silent rejection is one where telling the truth helps
           only the sender: a tripped honeypot, a sub-three-second
           fill, a link farm. It reports success and sends nothing.
           A bot that is told it failed adapts. */

        if (!result.ok && result.silent)
        {

            console.log('Silently dropped: ' + result.code + ' — ' + result.message);

            return successResponse({ received: true });

        }

        if (!result.ok)
        {

            return errorResponse(result.code, result.message);

        }

        const lead = result.lead;

        /* A duplicate is almost always a real person who was not
           sure the first one went through. Accept it, do not send
           twice, and do not tell them off. */

        if (isDuplicate(lead.phoneDigits))
        {

            console.log('Duplicate within window, not re-sent: ' + lead.phoneDigits);

            return successResponse({ received: true, duplicate: true });

        }

        if (!underHourlyLimit())
        {

            /* This one is NOT silent. If the ceiling trips, a real
               enquiry may have been turned away, and the visitor
               needs to know to telephone instead. */

            console.warn('Hourly ceiling reached — submission refused.');

            return errorResponse(ERROR_CODES.rateLimited, 'Too many submissions this hour.');

        }

        sendConsultationEmail(lead);

        console.log('Consultation request sent for ' + lead.name);

        return successResponse({ received: true });

    }
    catch (postError)
    {

        logError('doPost', postError);

        return errorResponse(ERROR_CODES.serverError, 'Unexpected server error.');

    }

}


/* ============================================================
   SELF TEST

   Run this from the Apps Script editor after deploying, BEFORE
   putting the URL into the website. It exercises the real path —
   validation, sanitization and MailApp — so a failure here is a
   failure the website would have had.

   It sends a genuine email to RECIPIENT, marked as a test.
============================================================ */

function runSelfTest()
{

    const cases = [

        { label: 'valid', payload: {
            name: 'Test Submission (ignore)',
            phone: '(740) 555-0100',
            email: 'test@example.com',
            reason: 'This is a self-test from the Apps Script editor. No reply is needed.',
            elapsedSeconds: 45
        }, expect: 'send' },

        { label: 'missing name', payload: {
            name: '', phone: '7405550100', reason: 'Long enough to pass the reason check.', elapsedSeconds: 45
        }, expect: 'reject' },

        { label: 'short phone', payload: {
            name: 'Someone', phone: '12345', reason: 'Long enough to pass the reason check.', elapsedSeconds: 45
        }, expect: 'reject' },

        { label: 'honeypot', payload: {
            name: 'Bot', phone: '7405550100', reason: 'Long enough to pass the reason check.', company: 'Acme', elapsedSeconds: 45
        }, expect: 'silent' },

        { label: 'too fast', payload: {
            name: 'Bot', phone: '7405550100', reason: 'Long enough to pass the reason check.', elapsedSeconds: 1
        }, expect: 'silent' }

    ];

    const lines = [];

    for (const testCase of cases)
    {

        const outcome = validateSubmission(testCase.payload);

        let actual;

        if (outcome.ok) { actual = 'send'; }
        else if (outcome.silent) { actual = 'silent'; }
        else { actual = 'reject'; }

        const pass = actual === testCase.expect;

        lines.push((pass ? 'PASS' : 'FAIL') + '  ' + testCase.label
            + '  expected ' + testCase.expect + ', got ' + actual
            + (outcome.message ? '  (' + outcome.message + ')' : ''));

    }

    /* Only after the validation table passes does it touch mail —
       otherwise a broken validator sends the test email anyway and
       the run looks healthier than it is. */

    const allPassed = lines.every(function (line) { return line.indexOf('PASS') === 0; });

    if (allPassed)
    {

        const probe = validateSubmission(cases[0].payload);

        sendConsultationEmail(probe.lead);

        lines.push('PASS  email sent to ' + RECIPIENT + ' — check that inbox now');

    }
    else
    {

        lines.push('SKIPPED email: fix the failures above first');

    }

    const report = lines.join('\n');

    console.log(report);

    return report;

}
