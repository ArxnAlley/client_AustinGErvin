# Technical Debt — Austin G. Ervin

Open work only. **Completed work does not belong here** — when an item
is done, delete it and record the decision in
`docs/engineeringJournal.md`.

**Reviewed:** 2026-08-15 · **Open:** 16

**ID prefixes** — `TD` process/tooling · `VIS` visual · `RES` responsive ·
`A11Y` accessibility · `SEO` · `PERF` · `DATA` · `LEGAL` · `ASK` awaiting
someone.

**Severity** — `P0` blocks work or risks loss · `P1` visible on the live
page · `P2` quality · `P3` nice to have.

---

## P0

### TD-001 · The framework site build overwrites the authored stylesheets
**Status:** open — mitigated by documentation only
**Area:** tooling / build

`nuloLegalFramework/bin/buildSite.js` calls `generateStyles`, which
writes six stylesheets **into `client_AustinGErvin/css/`**. Two of them
— `styleIndex.css` and `tokens.css` — are hand-authored in this
repository. Running the build destroys them with no prompt.

**Evidence:** on 2026-08-15 it replaced `styleIndex.css` (76,245 bytes,
4,941 lines) with 24,516 bytes of framework output, and `tokens.css`
(9,032) with 9,244. Git held only the framework version, because V2 had
never been committed. Recovered from
`~/.claude/file-history/2df35a0d…/9598b8692cf78c4a@v13` and
`7bb4fee91eeaada3@v2`. Full account in the journal.

**Contributing trap:** `base.css`, `layout.css`, `components.css` and
`utilities.css` carry a `FRAMEWORK FILE — COPIED, NOT AUTHORED HERE`
banner and genuinely are generated. `styleIndex.css` and `tokens.css`
carry no such marker and sit in the same directory.

**Next action:** decide the permanent fix with Aron. Options, cheapest
first — (a) rename the authored files so they cannot collide with
generator output; (b) have `generateStyles` refuse to overwrite a file
lacking the framework banner; (c) emit generated styles to a separate
directory. Until then the guardrail is `docs/sessionCloseout.md` §0.1
plus committing early.

---

## P1 — visible on the page

### VIS-002 · Austin's inset plate in the About section is blurry and badly cropped
**Status:** open · **Area:** `section.chapterAttorney`

`austinPortrait_web.webp` is reused as a small inset plate. It is a
900×1085 asset produced for the hero, being displayed far smaller and
cropped in a way that reads as poor quality next to the rest of the page.

**Evidence:** raised directly by Aron; visible at 1440 px in the
attorney chapter.
**Next action:** part of the V2.1 About redesign — either source a
proper crop at the display size, or remove the plate. Needs a
higher-resolution portrait from Austin if it is kept (see ASK-013).

### VIS-003 · Practice Area tabs do not read as interactive
**Status:** open · **Area:** `section.chapterPractice`

CSS-only radio tabs work correctly but give no affordance that they can
be clicked, and the `01 / 02 / 03` numbering reads as a list index
rather than as controls.

**Next action:** V2.1 items 9–11 — add a real interactive affordance,
drop the numbering, keep every practice area discoverable. Do not break
the no-JS behaviour: the inputs must stay siblings of both the tab strip
and the panels or `~` stops reaching (see journal).

### VIS-004 · FAQ accordion behaviour is incomplete
**Status:** open · **Area:** `section.chapterClose`

Eight `.faqItem` entries. No `+` / `−` control, nothing open on load,
and multiple items can be open at once.

**Next action:** V2.1 items 14–16. Keep whatever native semantics exist
— the mobile nav uses `<details>` deliberately for keyboard and
screen-reader behaviour.

### VIS-005 · Footer is incomplete
**Status:** open · **Area:** `footer.siteFooter`

Present: wordmark, address, phone, four in-page links, attorney
advertising disclaimer, copyright.
Missing: legal / privacy / terms links, verified social links, Nulo
Studio developer credit, and a proper quick-links structure.

**Next action:** V2.1 item 17. Blocked in part on ASK-011 (social URLs)
and ASK-012 (privacy/terms copy) — build the structure, leave verified
content as marked TODOs rather than inventing links.

### VIS-006 · Accent gold is a placeholder, not Austin's brand gold
**Status:** open · **Area:** `css/tokens.css`

`--accentPrimary: #C19E61` is used in all three scenes and drives every
gold element on the page — CTA, stars, rules, card top edges.

**Evidence:** Aron flagged that the logo gold does not match Austin's
actual brand gold.
**Next action:** one-token change once the real hex arrives (ASK-007).
Check `--accentStroke` at the same time (`#A98445` light, `#C19E61`
dusk/dark). Re-check contrast after the change.

### DATA-007 · Per-review star ratings are assumed, not supplied
**Status:** open · **Area:** `data/reviews.json`

All six records carry `rating: 5`. No per-reviewer rating was ever
supplied. Aron was told before implementation and directed the stars in.

**Risk:** the site displays a specific factual claim about six named
individuals' reviews on a regulated attorney page.
**Next action:** confirm against the live Google profile (ASK-009). The
generator emits no stars when `rating` is `null`, so reverting any
record is a one-value change plus `node scripts/buildReviews.mjs`.

---

### TD-020 · "View all practice areas" has no page to point at
**Status:** open · **Area:** `section.chapterPractice`

The chip grid was replaced with a single `View all practice areas`
link. No standalone practice-areas page exists, so it points at
`#practice` — the anchor the header link and both menus already
use. It is not broken and it is not invented, but it is
self-referential.

**Next action:** repoint it at the practice-areas page when one is
built. That page is also where the eight practice-area content
files should land — `content/practiceAreas/` is empty and always
has been, while twelve records now name a body path.

### DATA-021 · The practice list is written out by hand in four places
**Status:** open · **Area:** `index.html`, `data/practiceAreas.json`

The twelve areas appear in the practice section, the Practice
Areas mega menu, the mobile accordion and the footer column. All
four are hand-maintained and were brought into parity on
2026-08-16. Nothing enforces it.

**Risk:** an edit that touches one surface and not the other three
ships a site that contradicts itself about what the office does —
on a regulated page.
**Next action:** extend `scripts/buildReviews.mjs`, or add a
sibling generator, to render all four from
`data/practiceAreas.json`. Verify with the parity probe recorded
in the journal until then.

## P2 — quality

### DATA-008 · Review corpus is six of roughly forty-six
**Status:** open · **Area:** `data/reviews.json`

Six written reviews exist in the dataset. The Google profile carries
roughly 46. Five names are known with no text (Melissa Stiles, Colin
Ahad, Nate Brillhart, Kristen Grooms, Courtney Cunningham) and the
Carlous Hutchison negative is known with no text.

**Consequence:** both marquee rows must carry all six, so a viewer sees
six unique reviewers before any repeat. With more, the rows should be
split into disjoint sequences.
**Next action:** collect the remaining text (ASK-008). Then split
`carouselOrder.top` / `.bottom` and re-run the generator.

### DATA-009 · `data/reviews.json` has no schema
**Status:** open · **Area:** validation

The validator reports it as "NOT YET VALIDATED — no schema exists for
these sources". Nothing enforces the record shape, so a malformed entry
would only surface as a broken render.

**Next action:** write `reviews.schema.json` in the framework, or
decide explicitly that reviews stay unvalidated (ASK-014).

### SEO-010 · No SEO implementation
**Status:** open · **Area:** `index.html`, `data/seo.json`

`<title>` and `lang="en"` are set. There is no canonical URL, no
sitemap, no robots directive, no Open Graph, no JSON-LD `LegalService`
or `Attorney` markup.

**Root cause:** `data/seo.json` has no `domain` and none has been
supplied (ASK-010). Most of this cannot be written without it.
**Next action:** implement once the domain exists. Note the compliance
constraint — structured data must not carry outcome or success claims.

### A11Y-011 · Accessibility is verified only where claimed
**Status:** open · **Area:** whole page

Implemented and verified: skip link, `lang`, single `<h1>`,
`aria-expanded` on every disclosure control, `inert` + `aria-hidden` on
marquee clones, `role="img"` with a text label on star rows, native
`<details>` for mobile nav, and a complete `prefers-reduced-motion` path.

Not done: no screen-reader pass, no end-to-end keyboard traversal audit,
no independent contrast audit across all four scenes.

**Next action:** schedule a real audit before launch. Until then **do
not claim WCAG conformance** anywhere.

### PERF-012 · Font subsets declared but never produced
**Status:** open · **Area:** `data/theme.json`, `css/tokens.css`

`theme.json` declares `inter-variable-subset.woff2`,
`cormorantGaramond-500-subset.woff2` and `-600-subset.woff2`. None
exist, so the validator cannot measure the font budget (3 × TYP-008).
The `@font-face` rules pointing at them were removed from `tokens.css`
— an `@font-face` whose `src` 404s still claims the family name and
competes with the real face loaded in `index.html`.

**Next action:** produce the subsets (Latin + Latin-Extended
punctuation), restore the `@font-face` rules, re-run validation.

### TD-013 · Content-model gaps failing validation
**Status:** open · **Area:** `data/`

34 schema errors, all pre-existing and none introduced by V2:

| Source | Errors | Missing |
|---|---|---|
| `faqs.json` | 24 | `lastReviewed`, `reviewedBy` on 12 entries |
| `contact.json` | 4 | `formEndpoint`, `consultationModel`, +2 |
| `locations.json` | 3 | `hours`, `afterHoursPolicy`, `mapsUrl` |
| `attorneys.json` | 1 | `role` |
| `firm.json` | 1 | `voice` |
| `seo.json` | 1 | `domain` |

`faqs.json` is 24 of the 34 and is mechanical — the FAQ review metadata
needs a reviewer name and a date. The rest need facts from Austin
(ASK-011, ASK-013).
**Next action:** clear `faqs.json` once Aron confirms who signs off FAQ
content and on what date.

### LEGAL-014 · No privacy policy or terms
**Status:** open · **Area:** site

The attorney advertising disclaimer is present and correct. There is no
privacy policy and no terms page, and the footer is due to link to both.

**Next action:** Austin's call whether to supply or approve drafted
copy (ASK-012). Do not publish links to pages that do not exist.

---

## P3

### VIS-015 · Superseded asset still committed
**Status:** open · **Area:** `graphics/images/`

`austinCutout.webp` is the **rejected** algorithmic portrait cutout,
superseded by `austinPortrait_web.webp`. It is referenced nowhere and is
kept only as evidence for the matte comparison recorded in the journal.

**Next action:** delete once V2.1 ships. It must never be wired back in
— see the journal's portrait-matte entry for the measurements.

### RES-016 · Responsive verified by measurement, not by device
**Status:** open · **Area:** whole page

No page-level horizontal overflow at 15 widths from 320 to 1920, and the
hero cards recompose 1 → 2+1 → 3 correctly. All of it was measured in
headless Chrome.

Not covered: real iOS/Android Safari and Chrome, dynamic viewport units
against mobile browser chrome, and touch behaviour on the marquee
(pointerdown-to-pause is implemented but has never been touched by a
finger).

**Next action:** device pass before launch.

---

## Awaiting someone

### Waiting on Austin

| ID | Item | Blocks |
|---|---|---|
| ASK-007 | Real brand gold hex | VIS-006 |
| ASK-008 | Review text for the five known names, and the Carlous Hutchison negative | DATA-008 |
| ASK-009 | Confirmation of per-review star ratings | DATA-007 |
| ASK-010 | Domain | SEO-010 |
| ASK-011 | Verified social URLs, office hours, after-hours policy, Maps URL, form endpoint | VIS-005, TD-013 |
| ASK-012 | Privacy policy and terms copy, or approval to draft | LEGAL-014 |
| ASK-013 | Higher-resolution portrait crop; video for the V2.1 placeholder | VIS-002 |
| ASK-019 | **Does Austin handle protection orders?** They were published on the homepage and in all three menus until 2026-08-16 and were withdrawn because they are absent from his confirmed list. A criminal and family practice in southern Ohio almost certainly does handle them, so this reads as an omission rather than a decision. Three FAQ entries still ask about them and were left alone pending his answer. | practice areas, FAQ |
| ASK-020 | **Has the 2026 Dayton Criminal Defense College Trial School been completed?** The site says "Attended", with the year, and deliberately does not say completed, graduated or certified. Upgrade the wording only on written confirmation. | attorney chapter |
| ASK-021 | **A figure for jury trial experience he can substantiate.** His word was "extensive"; it is not published, because an unsubstantiated quantity claim is what Ohio Prof. Cond. R. 7.1 prohibits. | attorney chapter |

### Waiting on Aron

| ID | Item | Blocks |
|---|---|---|
| ASK-014 | Approve the V2.1 direction before implementation | all of V2.1 |
| ASK-015 | Permanent fix for the build-overwrite hazard | TD-001 |
| ASK-016 | Whether marquee cards should also carry the star badge (hero cards do; the two systems are deliberately distinct) | — |
| ASK-017 | Whether to write a schema for `data/reviews.json` | DATA-009 |
| ASK-018 | Who signs off FAQ content, and on what date | TD-013 |
