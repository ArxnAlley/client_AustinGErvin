# Project State — Austin G. Ervin, Attorney at Law

**This file is current truth, not history.** It is overwritten at every
closeout. For why something is the way it is, read
`docs/engineeringJournal.md`. For what is still wrong, read
`docs/technicalDebt.md`.

**Last closeout:** 2026-08-16
**Branch:** `main` · **HEAD:** `6e3c9f7` · **Origin:** `origin/main` at `e6066d9`
**Working tree at closeout:** clean · **8 commits ahead of origin, unpushed**

---

## 1 · Identity

| | |
|---|---|
| Client | Austin G. Ervin, Attorney at Law, LLC |
| Location | 602 Chillicothe Street, Suite 206, Portsmouth, Ohio 45662 |
| Phone | (740) 529-1420 |
| Lead email | `austinervin.esq@gmail.com` (consultation form recipient) |
| Service area | Southern Ohio and northeastern Kentucky |
| Admissions | Ohio 2022, Kentucky 2023 · J.D. University of Dayton, 2022 |
| Repository | `ClientSites/client_AustinGErvin` (own git repo) |
| Remote | `https://github.com/ArxnAlley/client_AustinGErvin.git` |
| Framework | Nulo Legal Framework `nlf@1.x`, tier 1 (`nlf.config.json`) |

---

## 2 · Phase

**Homepage V2.1 is built, critiqued, corrected and committed. The
consultation intake system is built and tested but NOT CONNECTED.**

The site is one long-form homepage plus three legal pages. The one
thing standing between it and a working contact channel is deploying
the Apps Script — see §12.

---

## 3 · Stack and tooling — read this before assuming anything

- **Hand-authored static site.** HTML + CSS + vanilla JS.
- **No `package.json`. No npm scripts, no lint, no test suite.** Node
  is invoked directly.
- Executables in-repo: `scripts/buildReviews.mjs` only.
- The framework lives outside this repo at
  `c:/Dev/NuloWorkspace/nuloLegalFramework` and supplies the validator.

### Commands that are real

```bash
# render the review data into index.html (safe, idempotent)
node scripts/buildReviews.mjs

# validate the content model (read-only)
cd ../../nuloLegalFramework
node bin/validateClient.js ../ClientSites/client_AustinGErvin ./schemas

# measure the design system (read-only)
node bin/measureDesignSystem.js ../ClientSites/client_AustinGErvin
```

### Command that must never be run against this working tree

```
node bin/buildSite.js ../ClientSites/client_AustinGErvin ./schemas
```

It regenerates six stylesheets **into `css/`** and overwrites the
hand-authored `styleIndex.css` and `tokens.css`. It destroyed both on
2026-08-15. See TD-001.

---

## 4 · Page architecture (`index.html`, 2,523 lines)

| Order | Element | Scene | Anchor | State |
|---|---|---|---|---|
| — | `header.siteHeader` | inherits | — | AE shield + wordmark lockup |
| 1 | `section.chapterHero` | `dark` | `#heroHeadline` | Complete, frozen |
| 2 | `section.chapterMessage` | `dusk` | `#message` | Complete; film frame awaits video |
| 3 | `section.chapterPractice` | `dark` | `#practice` | Complete, 12 areas |
| 4 | `section.chapterAttorney` | `stone` | `#attorney` | Complete |
| 5 | `section.chapterProcess` | `light` | `#processHeading` | Complete |
| 6 | `section.chapterReviews` | `stone` | `#reviews` | Complete |
| 7 | `section.chapterClose` | `dark` | `#faq` / `#contact` | FAQ answers are placeholders |
| — | `footer.siteFooter` | `dark` | `#legalNotice` | Complete |

Scenes are per-section `data-scene`, so the descent renders with
JavaScript disabled.

**Interior pages:** `legal/privacyPolicy.html`,
`legal/termsOfUse.html`, `legal/accessibility.html`. Nothing else.

---

## 5 · Brand system

- **AE shield is the primary emblem.** Cut from the supplied
  `potentialFavicon.png` to `aeShield_web.webp` (272×320).
- **Wordmark** cut from the supplied `secondLogo.png` to
  `aeWordmark_web.webp` (1100×170).
- Desktop navigation is shield left + wordmark right as one lockup,
  wrapped in a single Home link. Header height 97px, unchanged.
- **Below 600px the wordmark leaves and the shield stands alone.**
- **No CSS filter on either logo.** The grade that used to darken the
  wordmark on light and stone scenes is gone and must not return.
- Favicons (`favicon_32.png` 32×32, `favicon_180.png` 180×180) are cut
  from the shield.
- The scales logo (`theOne_Logo_web.webp`) survives **on the loading
  curtain only**.
- All three mega menus carry `data-scene="light"` so they are white and
  gold on every chapter, three columns, capped to the room under the
  bar and self-scrolling.

---

## 6 · Practice areas — twelve, confirmed by Austin 2026-08-16

| Criminal & Traffic (4) | Family & Juvenile (5) | Civil & Planning (3) |
|---|---|---|
| Criminal Defense | Divorce | Personal Injury |
| DUI / OVI Defense | Child Custody | Evictions |
| Traffic Offenses | Juvenile Law | Wills & Probate |
| Expungements & Record Sealing | Guardianships | |
| | Adoptions | |

- **Estate Planning and Protection Orders are withdrawn.** Neither is
  on Austin's confirmed list. Protection Orders is probably an omission
  rather than a decision — ASK-019.
- The list is hand-maintained in **four places**: the section, the
  Practice Areas mega menu, the mobile accordion, the footer column.
  All four are in parity. Nothing enforces it — DATA-021.
- Tabs are CSS-only radios; inputs must stay siblings of both the strip
  and the panels or `~` stops reaching. Each input carries an explicit
  `aria-label`.
- One `View all practice areas` link, pointing at `#practice` because
  no such page exists — TD-020.

---

## 7 · Consultation intake — BUILT, NOT LIVE

**Form** at `#contact`, inside the close chapter. Name, phone, optional
email, reason. Every "Request a consultation" control on the site
already pointed at `#contact`, so all of them reach it with no routing
code.

**Backend** in `appsScript/` — five files plus `README.md`. Website →
Apps Script web app → email to `austinervin.esq@gmail.com`. Nothing is
stored.

- Transport is `text/plain` carrying JSON (Apps Script cannot answer a
  CORS preflight) and the envelope carries the status (Apps Script
  always returns HTTP 200).
- No API key. The server revalidates everything.
- Honeypot, 3-second timing gate, link check, duplicate suppression,
  hourly ceiling. All fail silently except the ceiling.

**`CONSULTATION_ENDPOINT` in `js/consultationJS.js` is an empty
string.** With it empty the form refuses, tells the visitor to
telephone, and logs a console error. It never claims a false success.

---

## 8 · Review system — unchanged this session

- `data/reviews.json` is the single source of truth;
  `scripts/buildReviews.mjs` renders it. Verified idempotent at
  closeout.
- **Six written reviews. That is the entire supplied corpus.**
- Hero: three cream cards — **Logan Gullett, D G, Cynthia Book**.
  Google mark + five stars top-left, badge at 32px inset.
- Marquee: two tracks, top right→left, bottom left→right, both
  carrying all six in different orders. Measured ±66px per 2.5s;
  hovering the region pauses both.
- `rating: 5` on all six is an **approved assumption, not supplied
  data**.
- Marquee "Read full review" opens a native `<dialog>` and pauses both
  tracks. A record with `truncated: true` and a `sourceUrl` renders a
  "View on Google" link instead; none currently are.

---

## 9 · Responsive and accessibility

**Responsive — verified by measurement.** No page-level horizontal
overflow at 320, 375, 390, 430, 600, 768, 834, 1024, 1200, 1280, 1440,
1600, 1920. Hero cards recompose 1 → 2+1 → 3.

**Accessibility — verified where claimed.** Present: `lang`, skip link,
one `<h1>`, `aria-expanded` on disclosure controls, `inert` +
`aria-hidden` on marquee clones, `role="img"` on star rows, native
`<details>` for mobile nav and FAQ, full `prefers-reduced-motion` path,
visible focus rings on every control added this session, form fields
all labelled at 16px, no target under 44px, honeypot out of the tab
order.

Measured contrast on every text style changed this session: all at or
above 4.5:1 body / 3:1 large.

**Not done:** no screen-reader pass, no independent audit. **Do not
claim WCAG conformance** — `legal/accessibility.html` correctly does
not.

---

## 10 · Validation at closeout

```
node bin/validateClient.js ../ClientSites/client_AustinGErvin ./schemas
→ 37 errors · 0 warnings
```

**Identical to the pre-session baseline.** Every one pre-existing:

| Source | Errors | Missing |
|---|---|---|
| `data/faqs.json` | 24 | `lastReviewed`, `reviewedBy` on 12 entries |
| `data/contact.json` | 4 | `formEndpoint`, `consultationModel`, `consultationCopy`, `responseTimePromise` |
| `data/theme.json` | 3 | Font subsets never produced (TYP-008) |
| `data/locations.json` | 3 | `hours`, `afterHoursPolicy`, `mapsUrl` |
| `data/seo.json` | 1 | `domain` |
| `data/firm.json` | 1 | `voice` |
| `data/attorneys.json` | 1 | `role` |

`data/reviews.json` reports NOT YET VALIDATED — no schema exists.
Expected, not a regression.

`measureDesignSystem.js`: 7 checks, all PASS.

There is no lint step and no test suite in this repository.

---

## 11 · Assets in use

| Path | Use |
|---|---|
| `graphics/logos/aeShield_web.webp` | Nav, mobile menu, footer, legal pages |
| `graphics/logos/aeWordmark_web.webp` | Nav, footer, curtain, legal pages |
| `graphics/logos/theOne_Logo_web.webp` | Loading curtain mark only |
| `graphics/logos/favicon_32.png`, `favicon_180.png` | Icons, cut from the shield |
| `graphics/logos/devCredit/nuloStudioCredit.png` | Footer credit (byte-identical to BlueGrid's) |
| `graphics/images/heroValley_web.webp` + `_mobile` | Hero backdrop |
| `graphics/images/austinPortrait_web.webp` | Hero **and** attorney chapter |
| `graphics/images/courtroom_web.webp` | Film frame poster, chapter two |
| `graphics/images/architecture_web.webp` | Practice backdrop |
| `graphics/images/regionMap_web.webp` | Service-area map |

`graphics/images/austinCutout.webp` is the **rejected** algorithmic
cutout. Do not wire it back in.
`graphics/images/stockPhotos/` — nine of thirteen rejected on
inspection. Do not reach for them.

---

## 12 · The next task

**Deploy the consultation Apps Script.** It is the only thing between
this site and a working contact channel, and everything it needs is
written down.

1. Open `appsScript/README.md`.
2. Follow steps 1–6 to deploy the web app from the account that should
   send the mail.
3. Step 7: paste the `/exec` URL into `CONSULTATION_ENDPOINT` at the
   top of `js/consultationJS.js`.
4. Step 8: submit the real form, wait more than 3 seconds before
   pressing submit, and confirm the email arrives.

**Do not describe the form as live until an email actually arrives.**

After that, in priority order: FAQ answers (CONTENT-025), then Austin's
video for the film frame, then SEO once a domain exists.

---

## 13 · Blocked / waiting

### Waiting on Austin
- **Does he handle protection orders?** (ASK-019) — withdrawn this
  session; three FAQ entries still ask about them.
- Has the 2026 trial school been **completed**? (ASK-020)
- A substantiable jury-trial figure (ASK-021)
- The introduction **video** for chapter two
- **Review text** for five known names and the Carlous Hutchison negative
- Confirmation of per-review star ratings
- A **domain**, so SEO can exist at all
- Verified **social URLs**, office hours, after-hours policy, Maps URL
- **Privacy and terms copy**, or approval to draft

### Waiting on Aron
- **Deploy the Apps Script** (ASK-022) — blocks the form
- Permanent fix for the build-overwrite hazard (ASK-015)
- Whether marquee cards should carry the star badge (ASK-016)
- Whether to write a schema for `data/reviews.json` (ASK-017)
- Who signs off FAQ content, and on what date (ASK-018)

### Blockers
- **The consultation form cannot send until it is deployed.** Nothing
  else is blocked; every other open item degrades gracefully.

---

## 14 · Resume point

**Everything is committed. Working tree clean at `6e3c9f7`.**
`main` is **8 commits ahead of `origin/main`** and has **not** been
pushed. Do not push without Aron asking.

**Start here next session:**

1. Read `docs/technicalDebt.md` — TD-001 is a process guardrail you
   must understand before running anything.
2. Open `appsScript/README.md`.
3. **First action: step 1 of that file — create the Apps Script project
   from the Google account that should send the mail.** The deployment
   is the task; no code needs to change except one string in
   `js/consultationJS.js` at step 7.
