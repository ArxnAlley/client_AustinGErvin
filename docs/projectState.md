# Project State — Austin G. Ervin, Attorney at Law

**This file is current truth, not history.** It is overwritten at every
closeout. For why something is the way it is, read
`docs/engineeringJournal.md`. For what is still wrong, read
`docs/technicalDebt.md`.

**Last closeout:** 2026-08-15
**Branch:** `main` · **HEAD:** `edd0640` · **Origin:** `origin/main` at `e6066d9`
**Working tree at closeout:** clean

---

## 1 · Identity

| | |
|---|---|
| Client | Austin G. Ervin, Attorney at Law, LLC |
| Practice | Criminal defense, family law, estate matters |
| Location | 602 Chillicothe Street, Suite 206, Portsmouth, Ohio 45662 |
| Phone | (740) 529-1420 |
| Service area | Southern Ohio and northeastern Kentucky |
| Admissions | Ohio 2022, Kentucky 2023 · J.D. University of Dayton, 2022 |
| Repository | `ClientSites/client_AustinGErvin` (own git repo) |
| Remote | `https://github.com/ArxnAlley/client_AustinGErvin.git` |
| Framework | Nulo Legal Framework `nlf@1.x`, tier 1 (`nlf.config.json`) |

---

## 2 · Phase

**Homepage V2 is built and committed. V2.1 refinement has not started.**

The homepage is a single long-form page in six chapters plus header and
footer. There is exactly one page — `index.html`. No interior pages
exist yet.

V2 delivered the art direction, the social proof system, and the review
system. V2.1 is a content, hierarchy and completeness pass — see §12.

---

## 3 · Stack and tooling — read this before assuming anything

- **Hand-authored static site.** HTML + CSS + vanilla JS.
- **No `package.json` in this repository. No npm scripts, no lint, no
  test suite.** Node is invoked directly.
- The only executable in-repo is `scripts/buildReviews.mjs`.
- The framework lives outside this repo at
  `c:/Dev/NuloWorkspace/nuloLegalFramework` and supplies the validator.

### Commands that are real

```bash
# render the review data into index.html (safe, idempotent)
node scripts/buildReviews.mjs

# validate the content model (read-only)
cd ../../nuloLegalFramework
node bin/validateClient.js ../ClientSites/client_AustinGErvin ./schemas
```

### Command that must never be run against this working tree

```
node bin/buildSite.js ../ClientSites/client_AustinGErvin ./schemas
```

It regenerates six stylesheets **into `css/`** and overwrites the
hand-authored `styleIndex.css` and `tokens.css`. It destroyed both on
2026-08-15; they were recovered from the agent harness's file history,
not from git. See TD-001 and the journal entry for that date.

---

## 4 · Page architecture (`index.html`, 88,943 bytes)

| Order | Element | Scene | Anchor | State |
|---|---|---|---|---|
| — | `header.siteHeader` | inherits | — | Complete, frozen |
| 1 | `section.chapterHero` | `dark` | `#heroHeadline` | Complete |
| 2 | `section.chapterStatement` | `dusk` | `#statementHeading` | **Copy to be reworked in V2.1** |
| 3 | `section.chapterAttorney` | `stone` | `#attorney` | Needs redesign in V2.1 |
| 4 | `section.chapterPractice` | `dark` | `#practice` | Works; tab affordance to be fixed |
| 5 | `section.chapterProcess` | `light` | `#processHeading` | Needs containment redesign |
| 6 | `section.chapterReviews` | `stone` | `#reviews` | Complete |
| 7 | `section.chapterClose` | `dark` | `#faq` | FAQ mechanics to be fixed |
| — | `footer.siteFooter` | `dark` | — | **Incomplete** |

Scenes are declared per section via `data-scene`, so the light→dark
descent renders correctly with JavaScript disabled.

---

## 5 · Navigation — complete, frozen

- Sticky `header.siteHeader`, wordmark `theTwo_Logo_web.webp`, phone,
  and a gold "Request a consultation" button.
- Three mega menus: **Practice Areas**, **About**, **Questions**.
  `aria-expanded` maintained, keyboard loop implemented, `inert` on
  closed panels.
- Wordmark hides below 480 px so the menu control fits a 320 px screen.
- Mobile menu uses native `<details>` accordions.
- Hover arrows are an authored `#arrowGlyph` SVG symbol — 30
  pseudo-element arrows were replaced because they clipped.

---

## 6 · Review system — complete

### 6.1 Data

`data/reviews.json` is the single source of truth.
`scripts/buildReviews.mjs` renders it into `index.html` between
`<!-- BUILD:heroReviews -->` and `<!-- BUILD:reviewMarquee -->`.

- **Six written reviews. That is the entire supplied corpus.** The
  Google profile carries roughly 46; only six have ever had their text
  handed over.
- Text is **verbatim**, spelling included.
- Five names are known without text: Melissa Stiles, Colin Ahad, Nate
  Brillhart, Kristen Grooms, Courtney Cunningham.
- A negative review by **Carlous Hutchison** is known to exist. No text
  was supplied, so no record exists. It must be added when its text
  arrives and must not be omitted for being negative.
- `rating: 5` on all six is an **approved assumption, not supplied
  data** — recorded in `_dataStatus.individualRatings`.

### 6.2 Hero social proof (System A)

- Three individual cream cards on the hero's lower edge: **Logan
  Gullett, D G, Cynthia Book**. Brandon Hinson is deliberately not one
  of them.
- Google mark + five gold stars top-**left** of each card; footer reads
  `GOOGLE REVIEW` with no second mark.
- Gold top rule, deep shadow, cards cross the hero boundary by
  `--proofOverhang` (`clamp(5rem, 9vh, 7rem)`); `.chapterHero +
  [data-chapter]` adds the same distance back to its own top padding.
- **There is no aggregate rating line in the hero.** Removed at Aron's
  instruction; the verified 4.8 lives in the Reviews section.
- Cards break the fold by 139 px at 1440×900.
- Columns: 1 below 680 px · 2+1 from 680 px · 3 from 1024 px.

### 6.3 Review marquee (System B)

- Two tracks. Top runs **right → left**, bottom **left → right**.
- Sequences are data (`carouselOrder.top` / `.bottom`), two different
  orders, six unique reviewers each. Both rows carry all six because
  six is the whole corpus — splitting three-and-three would repeat
  every third card. **Split the sequences when a seventh review
  arrives.**
- Seamless loop is arithmetic: each card carries
  `margin-inline-end`, **not** track `gap`, so the track divides
  exactly in two and `-50%` lands on the repeat. Measured: lap 2448 px
  = half-scroll 2448 px.
- Hover over the region pauses **both** tracks; `:focus-within` and a
  held finger do the same. Speed derives from content width at
  26 px/s (currently 94 s per lap).
- The aggregate `G 4.8 ★★★★★ GOOGLE RATING` badge sits above the tracks.

### 6.4 Truncation

Both systems use a **height cap plus a fade**, never `-webkit-line-clamp`
— the clamp put its ellipsis mid-word (`Our leg…`, `because he di…`).
An accessible "Read full review" / "Show less" button carries
`aria-expanded`.

The hero cap is **measured, not declared**: `fitHeroQuotes()` takes the
median natural height of the three quotes at the current width and
applies it via `--heroQuoteCap`, recomputed on resize, and only while
the three form a row. A fixed five-line clamp was wrong at 1024 px,
where all three cards overflowed it.

---

## 7 · Hero composition

- Backdrop: `heroValley_web.webp` (mobile variant at ≤700 px), graded
  `brightness(0.46) saturate(0.5) contrast(1.1)` with a ramp to solid
  at the foot.
- Portrait: `austinPortrait_web.webp`, 900×1085, 189 KB, derived from
  the supplied `austinTransparent.png` and cropped to its alpha bounding
  box. Matte measured at 681,393 semi-transparent pixels, mean edge
  luminance 93, 11 % light contamination — the earlier algorithmic key
  was 336 / 198 / 98 % and was rejected as a scissor edge.
- Headline is art-directed to exactly three lines via `.headlineLine`
  block spans.
- Hero grid is `minmax(0, 1fr) minmax(0, 0.58fr)` at ≥900 px — the
  portrait column was narrowed from 0.66 so the proof cards reach the
  fold.

---

## 8 · Other sections — as-built

**Statement (ch. 2)** — "Most people who call me / are having the
hardest / week of their life." plus a supporting paragraph. Functional,
but the tone is the first thing V2.1 changes.

**Attorney (ch. 3)** — warm stone scene. `courtroom_web.webp` as the
stage, with `austinPortrait_web.webp` reused as a small inset plate
captioned "Austin G. Ervin / Portsmouth". Credentials (Ohio 2022,
Kentucky 2023, J.D. Dayton 2022, office address) were moved here out of
the hero. **The inset plate is the known visual defect** — see TD-002.

**Practice (ch. 4)** — CSS-only case-file tabs on three radio inputs
(`caseCriminal`, `caseFamily`, `caseEstate`), no-JS safe. The inputs are
siblings of both the tab strip and the panels so `~` reaches. Tabs are
labelled `01 / 02 / 03` and do not read as interactive — see TD-003.

**Process (ch. 5)** — three numbered steps ("You call the office", "We
talk about what happened", "You get the next step in writing") plus a
service-area block with `regionMap_web.webp` behind it. Presented as a
flat list; V2.1 contains it in a floating rectangle.

**Close / FAQ (ch. 7)** — eight `.faqItem` entries and a final CTA.
Mechanics need work — see TD-004.

**Footer** — wordmark, address, phone, four in-page links, the attorney
advertising disclaimer, and copyright. **No legal/privacy/terms links,
no social links, no Nulo Studio credit.** See TD-005.

---

## 9 · Responsive, accessibility, SEO

**Responsive — verified.** No page-level horizontal overflow at 320,
360, 375, 390, 430, 600, 680, 768, 834, 1024, 1180, 1280, 1440, 1600 or
1920. Hero cards recompose 1 → 2+1 → 3 columns. Marquee cards are
`clamp(268px, 74vw, 384px)`.

**Accessibility — partial, verified where claimed.**
Present: `lang="en"`, skip link, one `<h1>`, `aria-expanded` on all
disclosure controls, `inert` + `aria-hidden` on marquee clones so a
testimonial is never announced twice, `role="img"` with a text label on
every star row, native `<details>` for mobile nav, and a full
`prefers-reduced-motion` path that disables both tracks, drops the edge
mask, hides clones and leaves each track hand-scrollable to the last
review.
Not done: no screen-reader pass, no full keyboard traversal audit, no
independent contrast audit. Do not claim WCAG conformance.

**SEO — minimal.** `<title>` and a `lang` attribute are set.
`data/seo.json` is missing `domain`, so no canonical, no sitemap, no
robots, no JSON-LD. No domain has been supplied.

---

## 10 · Assets in use

| Path | Use |
|---|---|
| `graphics/images/heroValley_web.webp` + `_mobile` | Hero backdrop |
| `graphics/images/austinPortrait_web.webp` | Hero portrait **and** attorney inset |
| `graphics/images/austinTransparent.png` | Supplied master for the portrait |
| `graphics/images/courtroom_web.webp` | Attorney chapter stage |
| `graphics/images/regionMap_web.webp` | Service-area map |
| `graphics/images/architecture_web.webp` | Practice chapter backdrop (`index.html:993`) |
| `graphics/logos/theTwo_Logo_web.webp` | Header + footer wordmark |
| `graphics/logos/theOne_Logo_web.webp` | Loading screen |
| `graphics/logos/favicon_32.png`, `favicon_180.png` | Icons |

`graphics/images/stockPhotos/` holds the untouched stock library. Of
thirteen, **nine were rejected on inspection** — including `lawPhoto3`
(Turkish law books) and `notGuiltyVerdict_lawPhoto6`, which implies a
case outcome and is a compliance risk. Do not reach for them.

`graphics/images/austinCutout.webp` is the **rejected** algorithmic
cutout. Superseded. Do not wire it back in.

---

## 11 · Validation status (run at closeout, 2026-08-15)

```
node bin/validateClient.js ../ClientSites/client_AustinGErvin ./schemas
→ Sources loaded 17 · Schema coverage 94% · 37 errors · 0 warnings
```

All 37 are pre-existing content-model gaps, none introduced by V2:

| Source | Errors | Missing |
|---|---|---|
| `data/faqs.json` | 24 | `lastReviewed`, `reviewedBy` on 12 entries |
| `data/contact.json` | 4 | `formEndpoint`, `consultationModel`, +2 |
| `data/locations.json` | 3 | `hours`, `afterHoursPolicy`, `mapsUrl` |
| `data/attorneys.json` | 1 | `role` |
| `data/firm.json` | 1 | `voice` |
| `data/seo.json` | 1 | `domain` |
| `data/theme.json` | 3 (TYP-008) | Font subsets never produced |

`data/reviews.json` reports as **NOT YET VALIDATED** — no schema exists
for it. Expected, not a regression.

There is no lint step and no test suite in this repository.

---

## 12 · The next task — Homepage V2.1 refinement pass

**Not started. None of this is implemented.** This is the whole of the
next session's brief, as directed by Aron.

**Content and hierarchy**
1. Rework the post-hero statement copy — currently too negative.
2. Introduce a premium **Austin video placeholder**.
3. Improve overall homepage information hierarchy.
4. Get **Practice Areas to appear earlier** in the page.
5. Work in **~24-hour response messaging** where appropriate —
   **without** turning it into an unsupported guarantee.

**About Austin**
6. Redesign and strengthen the section.
7. **Fix or remove the blurry / badly cropped Austin inset plate** (TD-002).
8. Site the credentials properly within the redesign.

**Practice Areas**
9. Make the tabs obviously interactive (TD-003).
10. Remove the confusing `01 / 02 / 03` numbering.
11. Keep every practice area discoverable.

**Process**
12. Redesign into a contained / floating rectangle.

**Reviews**
13. Improve the "Read full review" behaviour.

**FAQ** (TD-004)
14. `+` / `−` controls.
15. First item open by default.
16. One open at a time.

**Footer** (TD-005)
17. Complete the legal/professional footer: quick links, verified
    social links, legal / privacy / terms, copyright, Nulo Studio
    developer credit.

**Brand**
18. Correct the logo gold to Austin's **actual brand gold**. Currently
    `--accentPrimary: #C19E61` everywhere; the real value has not been
    supplied (TD-006).

---

## 13 · Blocked / waiting

### Waiting on Austin
- The **real brand gold** hex.
- **Review text** for the five known names, and for the Carlous
  Hutchison negative.
- **Confirmation of the per-review star ratings** currently assumed as 5.
- **Video** (or approval of a placeholder treatment) for item 2.
- A **domain**, so SEO can be implemented at all.
- **Verified social profile URLs** for the footer.
- Office **hours**, after-hours policy, and a Google Maps URL.
- A **form endpoint** for the consultation request.
- Privacy policy and terms copy, or approval to draft them.
- A **higher-resolution portrait crop** if the inset is to be kept.

### Waiting on Aron
- Approval of the V2.1 direction before implementation begins.
- Decision on whether the marquee cards should also carry the
  star badge (the hero cards do; the two systems are deliberately
  distinct).
- Whether to write a schema for `data/reviews.json`.

### Blockers
- None blocking V2.1 layout work. Every item above degrades gracefully
  — the brand gold is a one-token change once supplied, and the video
  can be built as a placeholder.

---

## 14 · Resume point

**Everything is committed. The working tree is clean at `edd0640`.**
`main` is **2 commits ahead of `origin/main`** and has **not** been
pushed. Do not push without Aron asking.

**Start here next session:**

1. Read `docs/technicalDebt.md` — TD-001 is a process guardrail you
   must understand before running anything.
2. Open `index.html` at `section.chapterStatement` (line ~857) and
   `docs/projectState.md` §12.
3. **First task: item 1 of the V2.1 list — rework the post-hero
   statement copy.** It is the highest-impact change, it is
   self-contained, and it unblocks the hierarchy work in items 3 and 4.
