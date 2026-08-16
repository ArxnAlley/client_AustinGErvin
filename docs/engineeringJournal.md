# Engineering Journal — Austin G. Ervin

Append-only. **Newest entry at the top. Never edit or delete a past
entry** — if something recorded here later turned out wrong, write a
new entry saying so.

This is not a transcript. It records decisions, the reasoning behind
them, and findings a future session could otherwise reverse by
accident.

---

## 2026-08-16 · Homepage V2.1, the critique, and consultation intake

**Commits:** `38c9b01`, `044151a`, `5361427`, `6e3c9f7`
**Sections touched:** header, chapter two, practice, attorney, process,
reviews, FAQ, footer, and a new `legal/` directory

---

### The brand lockup, and the muddy gold

Aron supplied two approved files mid-session: `potentialFavicon.png`
(the AE shield) and `secondLogo.png` (the metallic wordmark). The
navigation now carries shield left, wordmark right, as one lockup.

**The "muddy, brown, bronze" logo was a CSS grade, not the token.**
`.logoWordmarkImage` carried
`brightness(0.46) saturate(1.5) contrast(1.12)` on the light and stone
scenes. The supplied artwork is metallic — measured, it runs `#F1D589`
down to `#CCA65C` — and the grade flattened all of it into one brown.
The grade existed to buy contrast against cream; the shield's black
body does that now. **Do not put it back.**

Measured while we were there: shield dominant `#CCA65C`, wordmark
mid-tone `#C8A642`. The existing `--accentPrimary: #C19E61` already
sits inside that range, so the flat UI gold was left alone. It is
derived, not supplied — see VIS-022.

Assets were cut to the artwork's alpha bounding box so nothing is
padded or stretched: `aeShield_web.webp` 272×320, `aeWordmark_web.webp`
1100×170. Favicons recut from the shield; the previous pair were 32×37
and 180×210 — non-square, declared as 32×32, and from a different
shield rendering.

**The scales logo survives on the loading curtain only.** It is the
ceremonial mark and the curtain is frozen. It is no longer the
navigation identity anywhere.

Below 600px the wordmark leaves and the shield stands alone. That is a
gear change, not a shrunken wordmark: at 320px the full lockup would
put ATTORNEY AT LAW, LLC at about four pixels of cap height.

### Mega menus had to be pinned to a scene

The header takes the scene of whatever chapter passes beneath it, and
the mega panels inherited it — so over the dark hero all three rendered
charcoal. Aron asked for white and gold. `data-scene="light"` on each
`.megaPanel` fixes it through the existing token system rather than
with hand-written colours.

The practice panel also outgrew the viewport when it went from eight
rows to twelve: 895px tall, hanging 91px below the fold at 1440×900 and
212px at 1280×800. **A mega panel cannot be scrolled while it is
hovered**, so those rows were unreachable. Three columns, a narrower
lead column, one-line row notes, and a `max-height` that lets the panel
scroll itself.

### The order changed, and chapter two was rewritten

Practice Areas moved ahead of the attorney chapter. A visitor on an
attorney's site answers "does he handle what I need?" before anything
else, and the old order made them read a biography first.

The statement chapter — "Most people who call me are having the hardest
week of their life" — opened the page on the visitor's worst moment and
stayed there. It is now **A message from Austin**: a short human
introduction plus a film frame awaiting his video. The movement wanted
is uncertainty into clarity, not crisis into more crisis.

**The film frame has no play button on purpose.** A control that does
nothing when pressed is a defect. The gold mark is decorative and sits
in one stacked title card with a "Film in production" chip, because
when they were at opposite corners the eye reached the glyph first,
read it as a control, pressed it, and got nothing. The poster is
`eager`: lazy-loaded on a slow connection it painted as a black
rectangle holding a gold play button, which is the exact broken-embed
impression the component exists to avoid.

### Two things Aron reversed, and why the reversals were right

**The chip grid.** V2.1 added an always-visible index of all eight
practice areas under the tabs, to stop a three-way tab hiding two
thirds of the office. With twelve matters it repeated the section back
to itself, and Aron cut it. He was right: the critique independently
found that three of the eight chips were inert at any moment, that the
gold highlight marked the three already on screen rather than the five
it existed to reveal, and that two labels on one radio concatenate into
the radio's accessible name.

**The process panel.** V2.1 put the whole chapter in a cream panel.
Aron asked for only the three steps, in a smaller black rectangle, with
the heading outside. Also right — a panel that swallows the chapter is
a tinted band, not an inset object.

A scripted block move also dropped the practice index into the middle
of the hero. Caught from Aron's report, not from a test. **Line-number
splices into `index.html` need the result re-read, not just the exit
code.**

### The attorney portrait: the fix was to stop shrinking it

The inset plate was a square crop of the hero portrait with
`object-position: 52% 16%`, shown under 260px on a cream card. Three
faults compounding: the crop cut the top of his head off, the card gave
him no ground so he read as a sticker, and the courtroom behind him was
doing the job he was supposed to do.

**There is no better source.** `austinTransparent.png` is 1374×1145
with the subject at 943×1136, and `austinPortrait_web.webp` is already
that crop at 900×1085. So the answer was not a sharper file. He is the
section's principal image now, uncropped, on a lit ground, with the
hero's bottom dissolve.

The courtroom moved to the film frame, where it earns its place.

### The Impeccable critique, partly degraded

Assessment A ran as a sub-agent and reported in full. **Assessment B
terminated on a session limit before reporting**, so its measurements —
contrast, touch targets, image scaling, clipped text — were re-run
inline against the same harness. The run is therefore partly degraded
and is recorded that way rather than presented as a clean dual-agent
critique.

Ten findings applied. Four declined, with reasons: the attorney chapter
reuses the hero photograph (fair, but there is one photograph and the
section was approved as it stands); the process panel is centred while
its heading is left-aligned (approved that way this session); the FAQ
should collapse to a plain list until answers exist (contradicts the
accordion Aron specified); and a non-telephone contact channel (correct
and important — it became the consultation form).

Defects worth not reintroducing:

- The review dialog rendered the Google mark **monochrome black**,
  because it referenced `#googleGlyph` — a symbol drawn in
  `currentColor` for the footer's social row. One page carried two
  versions of somebody else's brand mark. The dialog now inlines the
  full-colour paths.
- The dialog's five stars stacked **vertically**: the row was
  `inline-flex` but the marks sat inside a nested span that was not,
  and `base.css` sets `svg { display: block }`.
- `.casePanels` had no `min-height`, so switching to a shorter file
  collapsed the block and pulled everything under it up under the
  finger reaching for it.
- `.devCreditLabel` measured **3.08:1** on the near-black footer. The
  mark beside it may sit lower — a logotype carries no contrast
  requirement — but the words are ordinary text.

### Consultation intake

Every "Request a consultation" control pointed at `#contact`, whose own
buttons were both `tel:` links. The journey was: press the button,
scroll, press the button again, phone dialer. It also left the site with
**no channel at all** for anyone who cannot safely make a call.

**The form lives at `#contact` rather than behind a modal**, because
every CTA already routes there. No link changed, no routing code was
added, and it works with the script deleted.

Backend is a Google Apps Script web app in `appsScript/` — the same
architecture as BlueGrid, without BlueGrid's spreadsheet and Drive
machinery. **Nothing is stored; the email is the record.** Putting
unvetted descriptions of people's legal matters into a Google Sheet was
not asked for and is not a default worth taking quietly.

Two transport realities encoded rather than fought, both inherited from
BlueGrid and both still true:

1. An Apps Script web app **cannot answer a CORS preflight**, so the
   post is `text/plain` carrying JSON, which keeps the request simple
   and stops the browser sending one.
2. Apps Script **always returns HTTP 200**. The envelope carries the
   real status, so the frontend branches on `success` and treats a
   non-2xx as transport failure only.

**No API key.** A key in frontend JavaScript is not a secret. The
endpoint URL is public, so the server revalidates every field, caps
lengths, strips control characters and bidirectional overrides so the
mail body cannot be forged, and escapes HTML.

Spam handling fails **silently** everywhere except the hourly ceiling —
a bot told it failed adapts, one told it succeeded goes away. The
ceiling is loud because if it trips, a real person may have been turned
away.

One bug found in testing: `isSubmitting` survived into the sent state,
so the form carried `isSubmitting` and `isSent` at once. Verified after
the fix that three submit attempts produce exactly one request.

**The endpoint constant is deliberately empty and the form is not
live.** With it empty the form refuses, points at the telephone, and
logs a console error. It never shows success for a submission that went
nowhere.

### The framework schema is closed

`displayOrder`, `_source`, `_compliance`, `_note` and `trialPractice`
were all rejected as unrecognised fields, and a provenance object at the
head of the practice-areas array was read as a practice area missing
every required field. Fifty-one errors from metadata.

`formEndpoint` also wants a URI and `consultationModel` an enum
(`free` / `flat` / `paid` / `varies`). Neither is known, so both were
reverted rather than guessed — publishing a fee model nobody has stated
onto a regulated page is not a validation fix.

**Validation held at 37 errors / 0 warnings all session** — identical to
the pre-session baseline. Every one is pre-existing.

### Verification

`practiceCheck.mjs`, `evidence.mjs`, `formTest.mjs`, `formSuccess.mjs`,
`formA11y.mjs`, `sweep.mjs` in the scratchpad. Findings worth keeping:

- **`requestSubmit()`, not a synthetic click.** A dispatched mouse
  event at the button's coordinates silently does nothing when the
  button is below the fold, which read as "the submit handler is
  broken" for a full test cycle.
- **Do not build probe regexes with backslash-s through
  `Runtime.evaluate`.** The escape did not survive, the class became a
  literal `s`, and a parity check reported every practice area as
  missing because the letter *s* had been stripped out of all of them.
- Hit areas grown with a pseudo-element are invisible to
  `getBoundingClientRect`. Verify them with `elementFromPoint`.

---

## 2026-08-16 · Practice areas corrected against Austin's own list

**Sections touched:** practice, attorney, header, mobile menu, footer

---

### The practice areas on this site were wrong

Everything published until today came from research, not from
Austin. He has now confirmed his own list, and the two disagree in
three directions at once:

**Advertised and should not have been.** Generic *Estate Planning*
— he does wills and probate, and gave us those two words
specifically. *Protection Orders* and a generic *Family Law*
heading, neither of which appears on his list.

**Missing entirely.** Personal Injury, Juvenile Law, Evictions,
Traffic Offenses, Expungements & Record Sealing, Guardianships,
Adoptions. Seven of his twelve areas were not on his own website.

**Wrongly grouped.** The three files were Criminal / Family /
Estate. They are now **Criminal & Traffic** (4), **Family &
Juvenile** (5), **Civil & Planning** (3).

Divorce and Child Custody are presented as two areas. Austin gave
them as one item, "Divorce and Custody"; splitting the
presentation was Aron's direction, for search and because a
visitor names their own problem as one or the other. It does not
add a service he did not confirm.

**Protection Orders was withdrawn everywhere.** It had been
published on the homepage and in all three navigation surfaces. It
is absent from his confirmed list, so it is gone — but a criminal
and family practice in southern Ohio almost certainly does handle
them, and this is more likely an omission on his list than a
decision. **It needs one word from him.** See ASK-019.

**The FAQ still asks about protection orders** — one question in
the Questions mega menu, one in the mobile menu, one in the FAQ
chapter. Left alone deliberately: FAQ content is gated on the
attorney of record, every answer is still a placeholder, and
rewriting the questions would pre-empt the same decision ASK-019
is waiting on. Fix both together.

### Four surfaces, one list

The practice areas are written out by hand in four places — the
section, the Practice Areas mega menu, the mobile accordion, and
the footer column. All four were updated and are verified in
parity by `practiceCheck.mjs`. **There is no generator for this**;
a future edit that touches one and not the other three will ship a
site that contradicts itself. That is worth a generator the next
time this list moves.

### The mega panel outgrew the viewport

Twelve rows at the old two-column split measured 895px and hung
91px below the fold at 1440×900, 212px at 1280×800. A mega panel
is open only while it is hovered, so anything past the fold is
unreachable — there is no way to scroll to it without closing it.

Three fixes, in order of how much each bought: three columns
instead of two; the lead column narrowed from 0.78fr to 0.56fr,
since it was mostly air; and every row note shortened to one line.
809px → 658px, inside the fold at every width the desktop nav
appears at. `.megaPanel` also now caps at the room under the bar
and scrolls itself, so no future addition can put a row out of
reach again.

### The chip grid is gone

The "All practice areas" chip grid added in V2.1 was removed at
Aron's direction: with twelve matters across three tabs it
repeated the section back to itself. One understated *View all
practice areas* link replaced it.

**Its destination is provisional.** No standalone practice-areas
page exists, and a made-up URL is not available on a regulated
page, so it points at `#practice` — the canonical anchor the
header link and both menus already use. Repoint it the day the
page is built (TD-020).

The chip CSS and the script that gave chip presses somewhere to
land went with it. **Do not resurrect the chips**: two labels on
one radio concatenate into the radio's accessible name, which is
the bug the `aria-label`s on `.caseInput` exist to contain.

### Trial practice is authority, not a service

Austin also confirmed jury trial experience including murder
cases, the 2026 Dayton Criminal Defense College Trial School, and
a typical response of one business day. None of these are practice
areas and none went in the tab strip; they are an "In the
courtroom" block in the attorney chapter.

Three deliberate restraints in that copy, all of them one word
away from a Rule 7.1 problem:

1. **"Extensive" is not published.** It was his word. A quantity
   claim with no substantiable figure behind it is exactly what
   7.1 prohibits, and no count was supplied.
2. **The murder line states the kind of matter and stops.** No
   verdict, no outcome, no count. Adding any of those turns a
   permitted statement of experience into a prohibited result
   claim.
3. **The trial school says "Attended", with a year.** Not
   completed, not graduated, not certified. Aron's note read
   "recently attended / is attending", which does not establish
   the programme is finished. Do not upgrade that wording without
   it in writing (ASK-020).

The response-time line moved from "within 24 hours" to **"within
one business day"** in both places it appears — his own wording,
and safer, because a reader already discounts a business day for
weekends. "Most" stays load-bearing.

### The schema is closed, so the provenance lives here

`displayOrder`, `_source`, `_compliance` and `_note` on
`practiceAreas.json`, and `trialPractice` on `attorneys.json`,
were each rejected as unrecognised fields — 16 errors between
them. A metadata object at the head of the practice-areas array
was worse: the validator read it as a practice area missing every
required field, for 35 errors from one object.

All of it was removed and written down here instead. `body` also
cannot be null, so the seven new areas point at content files on
the same convention as the existing ones — **none of which have
ever been written**; `content/practiceAreas/` is empty.

Validation is back to **37 errors / 0 warnings**, byte-identical
to the pre-session baseline.

---

## 2026-08-15 · V2 review system, and a stylesheet loss

**Commits:** `75f4ea4`
**Sections touched:** hero, reviews

---

### INCIDENT — `bin/buildSite.js` destroyed the authored stylesheets

**What happened.** During repository inspection for this closeout I ran
the framework's site build to find out what "build" meant for this
project:

```
node bin/buildSite.js ../ClientSites/client_AustinGErvin ./schemas
```

It calls `generateStyles`, which writes six stylesheets **into
`client_AustinGErvin/css/`**. Two of the six — `styleIndex.css` (4,941
lines) and `tokens.css` — are hand-authored here, not generated. Both
were overwritten with framework output. The entire V2 homepage
stylesheet was gone in one command.

**Why git could not help.** The last commit was `e6066d9` on 31 Jul.
Every session since had built the V2 homepage **without committing**.
`git show HEAD:css/styleIndex.css` returned the 24 KB framework file,
because that is genuinely what was committed.

**How it was recovered.** The agent harness keeps file snapshots at
`~/.claude/file-history/<sessionId>/<hash>@v<n>`. `9598b8692cf78c4a@v13`
was `styleIndex.css` at 76,245 bytes / 4,941 lines, saved at 17:11, and
`7bb4fee91eeaada3@v2` was `tokens.css` at 9,032 bytes. Both were the
current authored versions. Restored, then verified in the browser
against the pre-build measurements — hero cards at y=761, three cards,
five lit stars each, badges at 32 px inset, both tracks moving in
opposite directions at ±65 px/2.5 s, seam lap 2448 = half-scroll 2448.
Byte-identical outcome.

A transcript replay was also built as a fallback (`extract.mjs` /
`replay.mjs` in the scratchpad) — it reconstructed 59 KB from 74 of 96
edits before the file history made it unnecessary. Recorded in case it
is ever needed again: the replay fails where mutations were applied by
`node -e` scripts rather than the Edit tool, because those are not
string-replaceable records.

**Decisions taken as a result:**

1. **`bin/buildSite.js` and `bin/generateStyles.js` are banned against
   this working tree.** Written into `docs/sessionCloseout.md` §0.1 and
   `docs/technicalDebt.md` TD-001. Validation (`bin/validateClient.js`)
   is read-only and remains safe.
2. **Commit before doing anything that can write to the tree.** The
   overwrite was the trigger; three weeks of uncommitted work was the
   actual fault. All of V2 is now committed as `75f4ea4`.
3. `_site/` was deleted after the build. It is gitignored already.

**The trap that made this possible, recorded so nobody re-triggers it:**
`base.css`, `layout.css`, `components.css` and `utilities.css` carry a
`FRAMEWORK FILE — COPIED, NOT AUTHORED HERE` banner and really are
generated. `styleIndex.css` and `tokens.css` carry no such protection
but sit in the same directory and were replaced by authored versions.
Nothing in the repository signalled the difference.

---

### Hero social proof rebuilt as three cards

The previous implementation was one wide white panel holding a rating
column and three testimonial columns. Aron rejected it as a "giant
horizontal white slab" and asked for three individual cards along the
hero's bottom edge, referencing a White Oak Wills & Trusts composition.

**Three separate objects, not one panel.** Each card has its own paper,
its own gold top rule and its own shadow. The group crosses the hero
boundary and stands on the chapter beneath — that overlap *is* the
composition, and it is what stops three testimonies reading as the
start of a separate generic section.

**The overlap is declared once.** `--proofOverhang:
clamp(5rem, 9vh, 7rem)` on `:root`; `.heroProof` spends it as a negative
bottom margin and `.chapterHero + [data-chapter]` adds the same distance
back to its own top padding. The overlap therefore costs the page depth,
never air.

**`.chapterHero` keeps a small non-zero `padding-block-end`
(`var(--space5)`) deliberately.** At zero, the proof group's negative
bottom margin collapses through the section, the next chapter paints
over the cards, and the hero's stacking context (`isolation: isolate`)
means the cards lose. Do not "tidy" that padding to zero.

**Reaching the fold cost the portrait 8 % of its column.** The portrait
is the tallest thing in the hero and therefore sets where the cards can
begin. Hero top padding went 9vh → 4.5vh and `.heroInner` went
`0.66fr` → `0.58fr`. At 1440×900 the cards now break the fold by 139 px.
Austin is not visibly smaller. `.headlineLine` is `display: block`, so
the art-directed three-line break survived the column change — check
that first if the grid is ever touched again.

### Hero review set

Aron selected **Logan Gullett, D G, Cynthia Book** and explicitly
removed **Brandon Hinson** from the hero. Hinson remains in the
carousel. Selection is data (`hero: true`), and the generator throws if
the count is not exactly three.

### Google mark and stars moved into the cards

Aron asked for the Google symbol and stars inside each card, then to
remove the aggregate rating line above the row, then to move the badge
from top-right to top-**left**.

Final: `.heroProofBadge` at the head of each card, left-aligned so the
badge, the first word of the quote and the reviewer's name all start on
the same margin. The mark left the card footer so the logo is not shown
twice. **The hero no longer carries an aggregate rating** — 4.8 belongs
to the business and now appears only in the Reviews section.

**The five stars are an assumption, not data.** No per-reviewer rating
was ever supplied. This was flagged to Aron before implementing;
he directed the stars in. `starRow()` emits nothing when `rating` is not
a number, so setting a record back to `null` degrades honestly to the
mark alone. Recorded in `_dataStatus.individualRatings`. **Do not treat
`rating: 5` as verified.**

---

### The review dataset is six records, and that is the whole corpus

Aron asked for the carousel to be repopulated from "the large supplied
dataset" of "dozens" of reviews. Every transcript in the project and
every file in the repository was searched: **six written reviews have
ever been supplied.** The profile carries roughly 46; five further names
are known with no text; the Carlous Hutchison negative is known with no
text.

**Distribution decision.** Splitting six three-and-three across the two
tracks would make each row repeat after three cards — the exact fault
being corrected. Both rows therefore carry all six, in two different
orders and at different phase. Six unique reviewers before any repeat
is the longest run the dataset can produce. `carouselOrder._note`
records this and instructs a future session to split the sequences the
moment a seventh review arrives.

**Sequences are data, not code** (`carouselOrder.top` / `.bottom`), so
adding a review is a dataset edit plus `node scripts/buildReviews.mjs`.
The generator warns if a review appears in both rows while unused
reviews remain.

Nothing was fabricated. Text is verbatim including `he we above and
beyond` and `Me Irvine`.

---

### The marquee seam: `gap` was the bug

Both tracks drifted **12 px per lap**. Cause: `gap` puts space *between*
cards, so a track of twelve cards is twelve widths plus eleven gaps.
Half of that is one gap short of a lap — and the animation translates
`-50%`.

**Fix: spacing moved to `margin-inline-end` on each card.** Every card
now carries its own trailing gap, the track divides into two identical
halves, and `-50%` lands exactly on the repeat. Measured lap 2448 px =
half-scroll 2448 px, seam gap 24 px = typical gap 24 px. Confirmed
visually by parking the animation at 99.5 % and 0.5 % of a lap and
comparing frames — continuous.

**Do not reintroduce `gap` on `.reviewTrack`.**

Also still true from earlier work: the four animation **longhands** are
used, never the `animation` shorthand, because the shorthand resets
`animation-play-state` and silently breaks hover-pause.

---

### Truncation: height + fade, never `-webkit-line-clamp`

`-webkit-line-clamp` places its ellipsis wherever the line breaks, and
here that landed mid-word — `Our leg…`, `because he di…`. That reads as
a bug, not an excerpt.

Replaced in both systems with a max-height plus a mask fading only the
final line, with "Read full review" / "Show less" carrying
`aria-expanded`. The fade ramp was tuned to `79%`→`100%`; an initial
`58%` washed out two readable lines.

### The hero clamp is measured, not declared

A fixed five-line clamp was correct only at 1440 px. At 1024 px the same
three cards are ~100 px narrower, all three overflowed, and the row grew
three "Read full review" links — which reads as broken content.

`fitHeroQuotes()` now takes the **median natural height** of the three
quotes at the current width and applies it as `--heroQuoteCap`, only
while `gridTemplateColumns` reports three columns, recomputed on a
debounced resize. Only a review genuinely longer than its neighbours is
ever cut. Verified at 1024 / 1180 / 1280 / 1440 / 1920: one expander, on
Cynthia's card, at every width.

### Cards are centred, not spread

Pinning the quote to the top and the name to the foot put a ~100 px hole
in the middle of the two shorter cards in both systems. `justify-content:
center` spends the same spare height as air above and below, which reads
as a generous card rather than an unfinished one. `.reviewMeta` lost its
`margin: auto 0 0` for the same reason.

---

### Verification method

This project has no test suite; rendering is the test. A zero-dependency
CDP harness is rebuilt per session (the scratchpad gets cleaned).
Findings worth keeping:

- Filter `/json/list` for `type === "page"` — the first target is
  otherwise an extension background page.
- Hover must be a real `Input.dispatchMouseEvent`; a synthetic JS event
  does not make `:hover` match.
- Direction, pause and resume were proved by sampling the live
  transform matrix over time, not by reading the stylesheet.

Known tooling false positives, investigated and dismissed — do not
re-report: `color-mix()` computes to `color(srgb …)` with 0–1 channels
and breaks naive contrast parsers; translucent backgrounds read as
opaque; `display: none` elements get flagged as hidden-focusable;
headless `.focus()` does not fire `focusin` without focus emulation.

---

## Earlier work — reconstructed summary (pre-2026-08-15)

Recorded retrospectively at the first closeout. Sessions before this
date predate the journal; this is a compressed record of decisions that
must not be reversed by accident, not a full history.

**Portrait matte.** The first cutout was produced by flood-fill keying
and measured 336 semi-transparent pixels with mean edge luminance 198 —
a binary alpha edge carrying the white studio ground, i.e. visibly
"pasted on". Austin supplied `austinTransparent.png`, which measured
681,393 semi-transparent pixels, luminance 93, 11 % light contamination.
The supplied master is used. `austinCutout.webp` is the rejected version
and must not be wired back in. The compensating CSS grading was removed
with it.

**Hero watermark — do not re-attempt.** A logo watermark was placed
behind the portrait. Because the portrait uses `mix-blend-mode:
multiply`, the watermark joined the composite and a grey rectangle
reappeared. Removed.

**Scene tokens.** Every display heading was invisible with JS disabled:
`color` resolved once at `<body>` while sections reassigned
`--textPrimary` with nothing consuming it. Fixed by `[data-scene] {
color: var(--textPrimary); }` in `base.css`.

**Container maths.** The hero H1 broke onto five lines because
`layout.css` capped the container's *border box*. Fixed with
`max-width: calc(var(--containerMax) + (var(--containerGutter) * 2))`.

**Case-file tabs.** CSS-only tabs on radio inputs showed no panels
because the inputs were nested inside `.caseTabs` — `~` could not reach
the panels. Inputs were hoisted to be siblings of both.

**Arrows.** Thirty pseudo-element arrows rendered clipped (one head
stroke, rotated box overflowing an 8 px parent). Replaced with an
authored `#arrowGlyph` SVG symbol. Note for SVG work here: `clip-path`
on `<use>` does not reach the path inside a `<symbol>`.

**Typeface weight.** Cormorant Garamond is optically light — 600 is no
heavier than Inter 400, and 700 is the first genuinely bolder step. Any
future "make the heading bolder" request should go to 700, not 600.

**Stock library.** Thirteen images inspected visually; nine rejected.
`notGuiltyVerdict_lawPhoto6` is a compliance risk — it implies a case
outcome. `lawPhoto3` is Turkish law books.

**Trust claims.** Cases won, client counts, success rates and years of
experience are all forbidden. Only the verified Google aggregate and the
verified admissions may be stated.
