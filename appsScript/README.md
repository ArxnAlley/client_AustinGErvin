# Consultation intake — Apps Script

Receives the consultation form from the website and emails the lead
to Austin. **Nothing is stored** — no spreadsheet, no Drive folder,
no copy of anybody's matter sitting in a Google account. The email
is the record.

**The form is not live until step 7 is done and step 8 passes.**
Until then the website shows an honest failure and tells the visitor
to telephone. Do not tell Austin it is working before that.

---

## Files

| File | What it does |
|---|---|
| `Code.gs` | `doPost` / `doGet`, the response envelope, and `runSelfTest` |
| `config.gs` | **Recipient address, limits, spam thresholds.** The only file you should need to edit |
| `validation.gs` | Validates and sanitizes; duplicate and rate limiting |
| `notifications.gs` | Builds and sends the email |
| `appsscript.json` | Manifest — scopes and web app access |

---

## Deployment

### 1 · Create the project

Go to <https://script.google.com> → **New project**.

Sign in as the account that should **send** the mail. Whatever
account you deploy from is the account the email comes *from* —
`executeAs: USER_DEPLOYING` in the manifest. If Austin should
appear as the sender, deploy from Austin's Google account, not
yours.

Rename it something recognisable: `Austin G. Ervin — Consultation
Intake`.

### 2 · Show the manifest

**Project Settings** (gear, left sidebar) → tick **"Show
`appsscript.json` manifest file in editor"**.

### 3 · Paste the files in

In the editor, create one file per source file in this folder and
paste the contents. File → New → Script file, for each of:

- `Code.gs`
- `config.gs`
- `validation.gs`
- `notifications.gs`

Then open the `appsscript.json` that is now visible and replace its
whole contents with the one from this folder.

Apps Script has no module system — every `.gs` file shares one
global scope, so the order does not matter and there are no imports
to wire.

Delete the default `myFunction()` stub if it is still there.

### 4 · Check the recipient

Open `config.gs` and confirm the first line:

```js
const RECIPIENT = 'austinervin.esq@gmail.com';
```

Change it here and nowhere else if it is ever wrong.

### 5 · Authorize

Select `runSelfTest` in the function dropdown → **Run**.

Google will ask for permission the first time. The scope is
`script.send_mail` and nothing else — it cannot read your Drive,
your mail, or your calendar.

You will hit **"Google hasn't verified this app"**. That is
expected for a private script. Click **Advanced** → **Go to
&lt;project name&gt; (unsafe)** → **Allow**. It is your own script.

Read the execution log. You want five `PASS` lines and a sixth
saying the email was sent, then **check that inbox**. If a test
fails, fix it before deploying — a broken validator that deploys
cleanly is worse than one that will not run.

### 6 · Deploy as a web app

**Deploy** → **New deployment** → gear icon → **Web app**.

| Setting | Value |
|---|---|
| Description | `Consultation intake v1` |
| Execute as | **Me** *(the account that sends the mail)* |
| Who has access | **Anyone** |

**"Anyone" is required and is not a mistake.** The website posts
from a visitor's browser with no Google account. "Anyone with
Google account" will reject every real submission. The endpoint
accepts only the four form fields, validates all of them, and can
do nothing but send one email to one hard-coded address.

Click **Deploy**, then **copy the Web app URL**. It ends in
`/exec`:

```
https://script.google.com/macros/s/AKfycb................/exec
```

Paste that URL into a browser now. You should see:

```json
{"success":true,"data":{"service":"Austin G. Ervin consultation intake","status":"ready", ...}}
```

If you see an error page instead, the deployment is wrong — do not
continue.

### 7 · Put the URL into the website

Open `js/consultationJS.js` and find, near the top:

```js
const CONSULTATION_ENDPOINT = '';
```

Paste the URL between the quotes:

```js
const CONSULTATION_ENDPOINT = 'https://script.google.com/macros/s/AKfycb................/exec';
```

That is the only change the website needs. Nothing else in the
site references the endpoint.

### 8 · Test it for real

Open the published site, scroll to **Tell me what happened**, and
submit the form with your own name and phone number.

You should see, in order:

1. the button change to **Sending…**
2. a green confirmation that the request was sent
3. **the email in Austin's inbox**, within a few seconds

Wait a full 5 seconds between loading the page and pressing submit.
Faster than 3 seconds is treated as a bot and dropped silently —
you will see the success message and no email will arrive. That is
the anti-spam timing gate doing its job, not a bug.

**Only after the email actually arrives is the form live.**

---

## Redeploying after a change

Apps Script does *not* pick up edits automatically for an existing
deployment URL.

**Deploy** → **Manage deployments** → pencil icon → **Version:
New version** → **Deploy**.

The URL stays the same, so the website needs no change. If you
instead create a *new deployment*, you get a *new URL* and must
repeat step 7.

---

## What the visitor's browser can see

All of it. The endpoint URL is in a JavaScript file anyone can
read. That is normal and is why the server trusts nothing:

- every field is validated again server-side
- lengths are capped and text is sanitized
- control characters and bidirectional overrides are stripped, so
  the email body cannot be forged
- there is no API key, because a key in frontend JavaScript is not
  a secret — it is a speed bump that looks like security

The endpoint's entire capability is: send one email, to one
address, that is compiled into the script.

---

## Spam handling

| Control | Where | What happens |
|---|---|---|
| Honeypot (`company`) | Both | Reports success, sends nothing |
| Fill time under 3s | Both | Reports success, sends nothing |
| Form open over 6h | Server | Reports success, sends nothing |
| More than 3 links | Server | Reports success, sends nothing |
| Same phone within 2 min | Server | Reports success, sends once |
| More than 40/hour | Server | **Returns an error**, so the visitor is told to telephone |

Everything except the hourly ceiling fails *silently* on purpose. A
bot told it failed adapts; one told it succeeded goes away. The
ceiling is the exception, because if it trips a real person may
have been turned away and needs to know.

Thresholds live in `SPAM` in `config.gs`.

---

## Troubleshooting

**Nothing arrives, and the site says it sent.**
Almost always the timing gate — you submitted in under 3 seconds.
Try again more slowly. Otherwise open **Executions** in the Apps
Script editor: a silent drop is logged with its reason.

**The site says it could not be sent.**
Open the browser console. `CONSULTATION_ENDPOINT is empty` means
step 7 was missed. A CORS or network error usually means the
deployment access is not set to **Anyone**.

**Emails arrive from the wrong address.**
The sender is whoever deployed it. Redeploy from Austin's account.

**"Service invoked too many times".**
A consumer Gmail account can send roughly 100 emails a day from
Apps Script. If a small firm's contact form hits that, it is an
attack — lower `maxPerHour` in `config.gs`.

---

## Not built, on purpose

- **No spreadsheet.** Not asked for, and it would put unvetted
  descriptions of people's legal matters into a Google Sheet.
  Adding one later is a `SpreadsheetApp` call in `notifications.gs`.
- **No autoresponder to the visitor.** An automatic reply from an
  attorney's office is very easy to read as an acceptance of the
  matter. That needs Austin's sign-off on the wording first.
- **No file upload.** Deliberate. "Do not include confidential or
  time-sensitive information" and an attachment field contradict
  each other.
