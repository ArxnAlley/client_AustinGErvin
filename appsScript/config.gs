/* ============================================================
   CONFIG — Austin G. Ervin consultation intake

   The only file anyone should need to edit after deployment.
============================================================ */


/* Where the lead goes. Austin's address, confirmed by Aron. */

const RECIPIENT = 'austinervin.esq@gmail.com';


/* What lands in his inbox subject line. The name is appended so a
   full inbox is still scannable. */

const SUBJECT_PREFIX = 'New Consultation Request';


/* Shown in the timestamp and used for every date this script
   formats. Matches appsscript.json. */

const TIME_ZONE = 'America/New_York';


/* ── Limits ──

   Caps, not preferences. Anything over these is either a mistake
   or an attack, and either way it is not something Austin needs
   to read. Text past a cap is truncated, not rejected, so a
   genuine long message still arrives.

   `reasonMax` is generous on purpose: someone describing a
   custody matter at midnight should not lose their third
   paragraph to a validator. */

const LIMITS = {

    nameMin: 2,
    nameMax: 120,

    phoneDigitsMin: 10,
    phoneDigitsMax: 15,
    phoneMax: 40,

    emailMax: 254,

    reasonMin: 10,
    reasonMax: 4000

};


/* ── Spam controls ──

   None of these are strong on their own. Together they stop the
   volume that actually shows up at a small firm's contact form:
   drive-by bots that post instantly and repeat.

   minFillSeconds  a human cannot read four fields and write a
                   paragraph in under this. The browser stamps the
                   render time; a bot that posts the form the
                   instant it parses it fails here.

   duplicateWindowSeconds
                   the same phone number twice inside this window
                   is a double-click that got past the button
                   guard, or a retry loop. The second one is
                   accepted and silently dropped rather than
                   erroring, because telling a real person "you
                   already did that" when they are not sure the
                   first one worked is its own kind of failure.

   maxPerHour      a global ceiling. If this trips, something is
                   wrong that Austin should not be paying for in
                   inbox volume. */

const SPAM = {

    minFillSeconds: 3,

    maxFillSeconds: 60 * 60 * 6,

    duplicateWindowSeconds: 120,

    maxPerHour: 40

};


/* Error codes the website can branch on. The message a visitor
   sees is written in the page, not here — this is for the log and
   for the envelope. */

const ERROR_CODES = {

    badRequest: 'BAD_REQUEST',
    validation: 'VALIDATION_FAILED',
    rateLimited: 'RATE_LIMITED',
    serverError: 'SERVER_ERROR'

};
