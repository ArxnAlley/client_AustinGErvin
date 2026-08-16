/* ============================================================
   CONSULTATION FORM

   Posts the intake form to the Google Apps Script web app in
   appsScript/. There is no third-party form service in this
   project and there should not be one: a legal enquiry naming a
   charge or a custody dispute is not something to route through
   a vendor nobody has a contract with.

   ── THE ONE THING TO EDIT AFTER DEPLOYMENT ──

   `CONSULTATION_ENDPOINT`, immediately below. Paste the /exec URL
   from the Apps Script deployment. Until it is filled in the form
   refuses to pretend: it says so in the status line, tells the
   visitor to telephone, and logs a loud console error. It never
   shows a success message for a submission that went nowhere.

   Nothing secret lives in this file, and nothing secret should.
   The endpoint URL is visible to anyone who reads the page, which
   is why the server validates every field itself and does not
   trust a single thing the browser sends — see
   appsScript/validation.gs.

   Transport: the request is Content-Type text/plain carrying
   JSON. That is not a mistake. An Apps Script web app cannot
   answer a CORS preflight, and text/plain keeps the request
   "simple" so the browser never sends one. The server parses the
   body as JSON.

   Apps Script also always returns HTTP 200. The envelope carries
   the real status, so this file branches on `success` in the
   parsed body and treats a non-2xx as a transport failure only.
============================================================ */

(function ()
{

    'use strict';


    /* ------------------------------------------------------------
       PASTE THE DEPLOYED WEB APP URL HERE

       It looks like:
       https://script.google.com/macros/s/AKfycb.../exec

       Leave it as an empty string until the Apps Script is
       actually deployed. An empty string is honest; a wrong URL
       silently loses enquiries.
    ------------------------------------------------------------ */

    const CONSULTATION_ENDPOINT = '';


    const form = document.querySelector('[data-consultForm]');

    if (!form)
    {

        return;

    }

    const submitButton = form.querySelector('[data-consultSubmit]');

    const submitLabel = form.querySelector('[data-submitLabel]');

    const status = form.querySelector('[data-consultStatus]');

    const PHONE_NUMBER = '(740) 529-1420';

    /* Stamped when the form is drawn, sent with the payload, and
       used by the server to reject a post that arrived faster than
       a person could have typed it. */
    const renderedAt = Date.now();

    let submitting = false;

    let succeeded = false;


    /* ============================================================
       STATUS

       One line, one job. `tone` drives the colour and nothing
       else; the wording is always explicit about what did or did
       not happen.
    ============================================================ */

    function setStatus(message, tone)
    {

        status.textContent = message || '';

        status.classList.remove('isError', 'isSuccess', 'isWorking');

        if (message && tone)
        {

            status.classList.add(tone);

        }

    }


    /* ============================================================
       FIELD VALIDATION

       Deliberately close to the server's rules in
       appsScript/validation.gs. The server is the gate; this is
       the courtesy, and it exists so a visitor is told about a
       missing digit before they wait on a round trip rather than
       after.

       Keep the two in step. Where they differ, the server wins and
       the visitor sees a generic failure, which is the worst of
       both.
    ============================================================ */

    const RULES = {

        name: function (value)
        {

            if (value.trim().length < 2)
            {

                return 'Please enter your name.';

            }

            return '';

        },

        phone: function (value)
        {

            const digits = value.replace(/\D/g, '');

            if (digits.length === 0)
            {

                return 'Please enter a phone number.';

            }

            if (digits.length < 10)
            {

                return 'That number looks too short — please include the area code.';

            }

            if (digits.length > 15)
            {

                return 'That number looks too long.';

            }

            return '';

        },

        /* Optional. Empty is valid; malformed is not. */
        email: function (value)
        {

            const trimmed = value.trim();

            if (trimmed === '')
            {

                return '';

            }

            if (!/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(trimmed))
            {

                return 'Please check this email address, or leave it blank.';

            }

            return '';

        },

        reason: function (value)
        {

            const trimmed = value.trim();

            if (trimmed.length === 0)
            {

                return 'Please tell Austin what this is about.';

            }

            if (trimmed.length < 10)
            {

                return 'A sentence or two is enough, but please add a little more.';

            }

            return '';

        }

    };


    function fieldFor(name)
    {

        return form.querySelector('[name="' + name + '"]');

    }


    function errorFor(name)
    {

        return form.querySelector('[data-errorFor="' + name + '"]');

    }


    function showFieldError(name, message)
    {

        const input = fieldFor(name);

        const slot = errorFor(name);

        if (!input || !slot)
        {

            return;

        }

        slot.textContent = message;

        input.classList.toggle('isInvalid', Boolean(message));

        /* aria-invalid is set only when it is true. An
           `aria-invalid="false"` on every field is noise. */
        if (message)
        {

            input.setAttribute('aria-invalid', 'true');

        }
        else
        {

            input.removeAttribute('aria-invalid');

        }

    }


    /**
     * Validates one field. Returns true when it is clean.
     */
    function validateField(name)
    {

        const input = fieldFor(name);

        if (!input || !RULES[name])
        {

            return true;

        }

        const message = RULES[name](input.value);

        showFieldError(name, message);

        return message === '';

    }


    /**
     * Validates all of them and moves focus to the first problem.
     * Returns true when the form can be sent.
     */
    function validateForm()
    {

        const names = Object.keys(RULES);

        let firstBad = null;

        for (const name of names)
        {

            if (!validateField(name) && !firstBad)
            {

                firstBad = name;

            }

        }

        if (firstBad)
        {

            const input = fieldFor(firstBad);

            if (input)
            {

                input.focus();

            }

            setStatus('Please check the highlighted fields.', 'isError');

            return false;

        }

        return true;

    }


    /* Re-validate on blur, but only once a field has been left —
       telling somebody their name is too short while they are
       typing the second letter is the classic version of this
       mistake. Clearing an error as soon as it is fixed is the
       other half. */

    for (const name of Object.keys(RULES))
    {

        const input = fieldFor(name);

        if (!input)
        {

            continue;

        }

        input.addEventListener('blur', function ()
        {

            validateField(name);

        });

        input.addEventListener('input', function ()
        {

            if (input.classList.contains('isInvalid'))
            {

                validateField(name);

            }

        });

    }


    /* ============================================================
       STATES
    ============================================================ */

    function startSubmitting()
    {

        submitting = true;

        form.classList.add('isSubmitting');

        submitButton.disabled = true;

        submitLabel.textContent = 'Sending…';

        setStatus('Sending your request…', 'isWorking');

    }


    function stopSubmitting()
    {

        submitting = false;

        form.classList.remove('isSubmitting');

        submitButton.disabled = false;

        submitLabel.textContent = 'Request a Consultation';

    }


    /* The success state is deliberately narrow. It confirms that
       the request was sent and that somebody will be in touch. It
       does NOT say the matter has been accepted, that Austin is
       representing anyone, or anything else that could be read as
       an engagement — the form's own disclaimer says the opposite
       three lines below it, and the two must not contradict. */

    function showSuccess()
    {

        succeeded = true;

        /* Clear the in-flight state before setting the sent one.
           Without this the form ends up carrying `isSubmitting`
           AND `isSent` at once, which is two states claiming the
           same element. The button stays disabled — that is the
           sent state's doing, not the submitting state's. */
        submitting = false;

        form.classList.remove('isSubmitting');

        form.classList.add('isSent');

        submitButton.disabled = true;

        submitLabel.textContent = 'Request sent';

        setStatus(
            'Thank you — your request has been sent. Most inquiries receive a '
            + 'response within one business day. If your matter is urgent, please '
            + 'call ' + PHONE_NUMBER + '.',
            'isSuccess'
        );

    }


    function showFailure(reason)
    {

        stopSubmitting();

        setStatus(
            (reason || 'Your request could not be sent.')
            + ' Please call ' + PHONE_NUMBER + ' and we will take the details over the phone.',
            'isError'
        );

    }


    /* ============================================================
       SUBMIT
    ============================================================ */

    form.addEventListener('submit', function (event)
    {

        event.preventDefault();

        /* Duplicate-submit prevention, both directions: a second
           press while the first is in flight, and any press after
           one has succeeded. The disabled button covers a mouse;
           these cover a fast double-tap and a resubmitted form. */

        if (submitting || succeeded)
        {

            return;

        }

        if (!validateForm())
        {

            return;

        }

        if (!CONSULTATION_ENDPOINT)
        {

            /* The one failure mode worth being loud about. Nothing
               was sent, so nothing may claim it was. */

            console.error(
                'Austin: CONSULTATION_ENDPOINT is empty in js/consultationJS.js — this '
                + 'submission was NOT sent and NO email was delivered. Paste the deployed '
                + 'Apps Script /exec URL into that constant. See appsScript/README.md.'
            );

            showFailure('The form is not connected yet.');

            return;

        }

        startSubmitting();

        const payload = {

            name: fieldFor('name').value,
            phone: fieldFor('phone').value,
            email: fieldFor('email').value,
            reason: fieldFor('reason').value,
            company: (fieldFor('company') || { value: '' }).value,
            elapsedSeconds: Math.round((Date.now() - renderedAt) / 1000)

        };

        fetch(CONSULTATION_ENDPOINT, {

            method: 'POST',

            /* text/plain on purpose — see the header of this file. */
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },

            body: JSON.stringify(payload)

        })
            .then(function (response)
            {

                if (!response.ok)
                {

                    throw new Error('Transport failed with status ' + response.status);

                }

                return response.json();

            })
            .then(function (result)
            {

                /* Success is claimed only inside the success branch
                   of the parsed envelope. A non-2xx threw above, a
                   rejected payload lands here with success:false,
                   and a dropped connection lands in .catch. There is
                   no path that shows the success message without the
                   server having said so. */

                if (result && result.success)
                {

                    showSuccess();

                    return;

                }

                const code = result && result.error ? result.error.code : '';

                if (code === 'RATE_LIMITED')
                {

                    showFailure('The form is temporarily unavailable.');

                    return;

                }

                if (code === 'VALIDATION_FAILED' && result.error.field)
                {

                    stopSubmitting();

                    showFieldError(result.error.field, 'Please check this field.');

                    const input = fieldFor(result.error.field);

                    if (input)
                    {

                        input.focus();

                    }

                    setStatus('Please check the highlighted field.', 'isError');

                    return;

                }

                showFailure('Your request could not be sent.');

            })
            .catch(function (networkError)
            {

                console.error('Austin: consultation submit failed —', networkError);

                showFailure('Your request could not be sent.');

            });

    });

}());
