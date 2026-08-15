# Engineering Journal — Austin G. Ervin

Append-only. **Newest entry at the top. Never edit or delete a past
entry** — if something recorded here later turned out wrong, write a
new entry saying so.

This is not a transcript. It records decisions, the reasoning behind
them, and findings a future session could otherwise reverse by
accident.

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
