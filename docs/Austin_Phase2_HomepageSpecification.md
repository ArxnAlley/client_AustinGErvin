# Austin G. Ervin, Attorney at Law, LLC

## Phase 2 — Homepage UX & Visual Specification

**Prepared by:** Nulo Studio — Principal UX Architect / Design Systems Lead
**Date:** July 29, 2026
**Status:** Specification deliverable — awaiting approval. **No production code until the Phase 2 Approval Checklist is signed off.**
**Builds on:** `docs/Austin_Phase1_ImplementationPlan.md` (approved architecture, tokens, and component system)
**Revision:** **1.1** — July 31, 2026. Design Review Loop corrections applied.

---

## Revision 1.1 — Change Log

An adversarial self-audit of Revision 1.0 found 14 defects. All are corrected inline and marked *(Rev 1.1)* at the point of change. The five that would have blocked or misled a building engineer:

| # | Defect | Severity | Resolution |
|---|---|---|---|
| 1 | **Four alpha-composite contrast ratios were asserted without being computed, and all four were wrong** — every one fails SC 1.4.11. `--borderStrong` measured 1.73–1.86:1 against a claimed 3.4–3.7:1, and it was the border of the secondary CTA. | **Critical — AA failure on a conversion element** | New `--borderInteractive` token, computed and verified (I.10). `--borderStrong` deprecated. |
| 2 | **The FAQ expansion animation was not implementable as specified.** A 320ms `grid-template-rows` transition was specified alongside "no JavaScript required" — native `<details>` cannot interpolate between closed and open. | **Critical — engineering feasibility** | Three-tier progressive enhancement; Tier 1 (instant, zero JS) is a valid ship state (S12 §8). |
| 3 | **1024–1199px was undefined for 12 of 14 sections.** Sections specified Desktop (≥1200) and Tablet (768–1023) with nothing between. | **High — systematic ambiguity** | Global `lg` tier rule with three named exceptions (I.8). |
| 4 | **The hero's box model contradicted its own stated intent** — a 128px section bottom padding cannot coexist with a portrait whose base "overlaps S05's hairline." | **High — the hero cannot be built as drawn** | Padding moved from the section to the type column (S04 §2). |
| 5 | **Five `--space9` annotations cited 56px or 72px** — neither value exists in the spacing scale. | **Medium — token misuse** | Snapped to real tokens; note added to I.7. |

Remaining nine: decorative gold invisible on light scenes (1.27:1 and 1.79:1 measured); `--fontDisplayLg` tabulated as 48px at tablet where it computes to 46.2px; process numerals citing a token that disagreed with their own stated sizes; `--fontDisplayMd` tabulated as 32px at tablet where it computes to 30.5px; missing conversion CTA at 1024–1199px; `contain-intrinsic-size` stated as fixed desktop-only values; missing native `<details>` marker reset; `contain: paint` specified where it would clip focus rings (two places); no z-index scale; no `<main>` boundary definition; reveal-on-load competing with the hero sequence; a bespoke 1,200ms duration outside the token set; and an unsurfaced SEO trade-off in the H1.

---

## How to Read This Document

This specification is written so that a senior frontend engineer can build the homepage **without making a single visual decision**. Every dimension, token, timing value, and breakpoint behaviour is stated. Where a decision remains open, it is marked **`[GATED]`** with the Open Question that governs it — those are the only places where judgement is deferred, and they are deferred to the client, not to the engineer.

**Phase 1 is not restated here.** Token definitions, the scene architecture, contrast audit, naming conventions, and the component inventory live in the Phase 1 plan and remain authoritative. This document specifies *how the homepage uses them*.

### Copy Status Notice

> **All copy in this document is SPECIMEN copy.** It is written to the correct length, tone, rhythm, and line-break structure so the design can be built and evaluated accurately. It is **not approved copy**. Every line is subject to the copy gate in Phase 1 §15.7 — no claim ships unless it is traceable to the verified-facts table in `deep-research-report.md` or to written confirmation from the attorney. Specimen copy that makes an operational or factual commitment is individually flagged.

---

# Part I — Global Conventions

These apply to every section and are not repeated in each section's entry.

## I.1 Breakpoint Reference

| Tier | Range | Label in this doc | Grid | Container | Gutter |
|---|---|---|---|---|---|
| `xs` | < 480px | Mobile (small) | 4 col | fluid | 20px |
| `sm` | 480–767px | Mobile | 4 col | fluid | 22–31px |
| `md` | 768–1023px | **Tablet** | 8 col | fluid | 31–41px |
| `lg` | 1024–1199px | Laptop (narrow) | 12 col | fluid | 41–44px |
| `xl` | 1200–1439px | **Desktop** | 12 col | ≤1240px | 44–51px |
| `2xl` | ≥ 1440px | Desktop (wide) | 12 col | 1240px | 51–64px |

**The single governing breakpoint is 1200px.** Navigation collapses to hamburger below it (Phase 1 §7.3) *and* the hero switches composition at the same point. One number governs both, deliberately — it is easier to reason about, easier to test, and easier to remember six months from now.

**Reference viewports for QA:** 375 × 667, 390 × 844, 768 × 1024, 1024 × 768, 1280 × 800, 1440 × 900, 1920 × 1080.

## I.2 Grid Reference (computed, not approximate)

Engineers should not need to derive these.

| Viewport | Container | Cols | Gap | Column width | Cols 1–7 span | Cols 8–12 span |
|---|---|---|---|---|---|---|
| 1440 | 1240px | 12 | 32px | 74.0px | **710px** | **498px** |
| 1200 | 1112px | 12 | 32px | 63.3px | 635px | 413px |
| 1024 | 942px | 12 | 32px | 49.2px | 536px | 333px |
| 768 | 706px | 8 | 32px | 60.25px | *(cols 1–4)* 337px | *(cols 5–8)* 337px |
| 375 | 335px | 4 | 24px | 61.75px | full width | full width |

**Container tokens:** `--containerMax` 1240px · `--containerWide` 1440px · `--containerNarrow` 760px.
The site header, every section, and the footer all use `--containerMax`, so the logo mark's left edge, every H1/H2 left edge, and every footer column's left edge share **one continuous vertical alignment spine** down the entire page. This is the primary structural device that makes the page read as designed rather than assembled.

## I.3 Scene Map & Scroll Choreography

The homepage is one continuous descent. Scene state lives on `<body data-scene>` and is set by `IntersectionObserver` at `rootMargin: -45% 0px -45% 0px` (Phase 1 §2.5).

| Scroll depth | `data-scene` | `--surfaceBase` | Sections |
|---|---|---|---|
| 0 – ~18% | `light` | `#FAF8F5` | Header, Hero, Trust Strip |
| ~18 – ~50% | `dusk` | `#18181B` | Positioning *(transition owner)*, Attorney, Process |
| ~50 – 100% | `dark` | `#0B0B0D` | Reviews *(transition owner)*, Practice, Service Areas, FAQ, Final CTA, Footer |

**Two sections own transitions.** The Positioning Statement (S06) carries light → dusk; the Reviews section (S09) carries dusk → dark. Both are designed with generous vertical padding specifically so the 900ms crossfade completes inside a single section rather than straddling a boundary. **No other section may carry a `data-scene-trigger` attribute.**

**Estimated total page height at 1440 × 900: ~8,060px (~9 viewport heights).**

## I.4 The Reveal System

Applied identically everywhere. Specified once.

| Property | Value |
|---|---|
| Trigger | `IntersectionObserver`, `threshold: 0.15` |
| From | `opacity: 0`, `translateY(16px)` |
| To | `opacity: 1`, `translateY(0)` |
| Duration | `--durationSlow` (560ms) |
| Easing | `--easeOut` `cubic-bezier(0.16, 1, 0.30, 1)` |
| Stagger | 60ms per item, **capped at 6 items** (360ms max chain) |
| Repeat | **Never.** Fires once, observer disconnects. |
| Failure mode | Reveal classes are added by JS. If JS fails, content is visible at rest. Content is never hidden by default CSS. |
| **Already in view at load** | Elements intersecting on the observer's **first** callback receive the final state **with no transition and no stagger**. They must not animate. This prevents S05 (which sits at or near the fold on tall viewports) from competing with the hero's choreographed entrance. |
| Observer init | Reveal observer is created on `DOMContentLoaded`, in the same frame as the hero sequence. It is not delayed. |
| Reduced motion | Transform removed entirely; opacity set to 1 with no transition. Content appears instantly. |

**Rule:** nothing on this page animates more than once, and nothing loops. A visitor who scrolls back up sees a static page.

## I.5 Shared Radii, Borders & Elevation

| Token | Value | Applied to |
|---|---|---|
| `--radiusButton` | 2px | All buttons |
| `--radiusCard` | 2px | Practice cards |
| `--radiusImage` | 0 | All photography — images are never rounded |
| `--borderHairline` | 1px | Every rule and divider on the page |
| Elevation | **None.** No box-shadows anywhere except the mega menu panel on the light scene. | — |

The absence of shadows is a deliberate position. Depth on this page comes from scene value shifts and hairline architecture, not from drop shadows. Shadows read as software UI; hairlines read as print.

## I.6 Focus Treatment (global)

| Scene | Ring colour | Spec |
|---|---|---|
| `light` | `--focusRing` = `#0B0B0D` | 2px solid, 2px offset |
| `dusk` / `dark` | `--focusRing` = `#D0AF77` (gold light) | 2px solid, 2px offset |

Focus rings **never** transition — focus must be instantaneous. `scroll-padding-block-start: 96px` is set on `:root` so a focused element is never hidden beneath the sticky header (WCAG 2.2 SC 2.4.11).

## I.7 Section Padding Reference

`--sectionPaddingBlock: clamp(4.5rem, 2rem + 9vw, 12.5rem)`

| Viewport | Computed |
|---|---|
| 375 | 72px |
| 768 | 101px |
| 1024 | 124px |
| 1440 | 162px |
| ≥1920 | 200px |

Two sections deliberately exceed this — the Positioning Statement (S06) and the Final CTA (S13) use `--space14` (200px) fixed at ≥1200px. They are the page's two breathing moments and their air is load-bearing.

**Spacing values used anywhere in this document must exist in the scale.** 56px and 72px are not tokens. Where an earlier draft annotated `--space9` with those values, the correct token is stated inline (Revision 1.1).

## I.8 The `lg` Tier (1024–1199px) — Global Rule

**Sections 3–14 of each section entry describe Desktop (≥1200px), Tablet (768–1023px), and Mobile (<768px). The 1024–1199px band is governed by this rule and is not repeated per section.**

> **At 1024–1199px, every section uses its Desktop layout**, with two global adjustments and three named exceptions.

**Global adjustments in this band:**

| Property | Desktop (≥1200) | `lg` (1024–1199) |
|---|---|---|
| Grid gap | 32px | **24px** (`--space5`) |
| Section padding-block | 162px @1440 | **124px** (computed from `--sectionPaddingBlock`) |
| Display heading sizes | token value | token value — no override (`--fontDisplayLg` = 54.1px @1024) |

**Named exceptions — these three do NOT use their Desktop layout at 1024–1199:**

| Section | Behaviour at 1024–1199 | Reason |
|---|---|---|
| **S01 / S02 / S03** Header, Nav, Mega | Collapsed (hamburger), per Phase 1 §7.3 | Measured width requirement exceeds available space |
| **S04** Hero | Tablet composition, expressed in **12 columns**: H1 spans 1–12; row 2 = lede/CTA cols 1–6, portrait cols 7–12 | H1 at 83.1px needs 548px; the 536px Desktop type column does not fit it |
| **S09** Reviews | **Two columns** (cols 1–6, 7–12), not three | Three columns at 1024 give each quote 17.5ch — unreadable. Two give 38ch. |

**Verification target:** 1024 × 768 and 1180 × 820 are added to the QA reference viewport list.

## I.9 Z-Index Scale

Every stacking value on the page. No `z-index` may be introduced outside this scale.

| Token | Value | Applied to |
|---|---|---|
| `--zBackdrop` | −1 | `.sceneBackdrop` (fixed, behind all content) |
| `--zBase` | 0 | Default document flow |
| `--zRaised` | 10 | Hero portrait above the gold rule; practice-card hover lift |
| `--zHeader` | 100 | `siteHeader` (sticky) |
| `--zMegaPanel` | 110 | Mega menu panel (must sit above the header's own background) |
| `--zOverlay` | 200 | Mobile menu full-screen overlay |
| `--zSkipLink` | 300 | Skip link when focused — must clear everything |

## I.10 Interactive Border Tokens *(Revision 1.1 — corrects an AA failure)*

An audit of the alpha-composite values used in the first draft found that **`--borderStrong` fails WCAG SC 1.4.11 (3:1 non-text contrast) in every scene.** Measured values:

| Composite | Actual ratio | Required |
|---|---|---|
| `rgba(11,11,13,0.24)` on `#FAF8F5` | **1.73:1** | 3:1 ❌ |
| `rgba(246,245,243,0.22)` on `#060607` | **1.80:1** | 3:1 ❌ |
| `rgba(246,245,243,0.22)` on `#0B0B0D` | **1.86:1** | 3:1 ❌ |

This matters because `--borderStrong` was specified as the border of the **ghost/secondary CTA button** — an element whose boundary is the only thing identifying it as a control. A new token is introduced:

```
--borderInteractive     light scene:  rgba(11, 11, 13, 0.52)      → 3.89:1 ✅
                        dusk scene:   rgba(246, 245, 243, 0.44)   → 4.09:1 ✅
                        dark scene:   rgba(246, 245, 243, 0.44)   → 4.09:1 ✅
                        sunken (S13): rgba(246, 245, 243, 0.48)   → 4.64:1 ✅
```

| Token | Use | Contrast requirement |
|---|---|---|
| `--borderSubtle` (0.10) | Decorative rules, dividers, card outlines where the control is identified by other means | None — decorative |
| `--borderInteractive` (above) | **Any border that is the sole identifier of an interactive control** — ghost buttons, form fields | ≥3:1, verified |
| `--borderStrong` | **Deprecated. Do not use.** All prior usages are reassigned to `--borderInteractive`. | — |

## I.11 Decorative Gold on Light Scenes *(Revision 1.1)*

The same audit found that gold at reduced opacity on the light scene is effectively invisible:

| Composite | Actual ratio |
|---|---|
| `#C19E61` @ 30% on `#FAF8F5` (hero gold rule) | **1.27:1** |
| `#C19E61` @ 70% on `#FAF8F5` (trust strip icons) | **1.79:1** |

These are decorative and therefore not WCAG failures, but at those ratios they are design failures — the element is specified but cannot be seen. **On light scenes, decorative gold uses `--colorGoldDark` `#A98445` at full opacity (3.26:1), never `--colorGold` at reduced opacity.**

```
--accentStroke     light scene: #A98445  (3.26:1 on #FAF8F5)
                   dusk/dark:   #C19E61  (7.03:1 on #18181B, 7.80:1 on #0B0B0D)
```

`--accentPrimary` `#C19E61` remains the fill colour for the primary CTA in **all** scenes — as a fill carrying `#0B0B0D` text at 7.80:1, it is unaffected.

## I.12 `content-visibility` and Intrinsic Sizing *(Revision 1.1)*

Sections S06 through S14 each carry `content-visibility: auto` with a `contain-intrinsic-size` value. **Those values were measured at 1440 × 900 and stated as single fixed numbers**, which is a defect: the same sections are 30–45% shorter at 375px. A fixed 912px placeholder for a section that actually renders at 640px makes the scrollbar wrong and causes the scroll position to jump as off-screen sections are skipped and un-skipped.

**Corrected rule — applies to every `contain-intrinsic-size` value in this document:**

```
contain-intrinsic-size: auto <stated-value>;
```

The `auto` keyword instructs the browser to use the element's **last remembered rendered size** once it has been rendered even once, falling back to the stated value only on first paint. This makes the values self-correcting across breakpoints and removes the need for per-breakpoint variants.

| Rule | Detail |
|---|---|
| Syntax | `contain-intrinsic-size: auto 912px` — never a bare `912px` |
| Stated values | Remain as documented per section; they are first-paint estimates for 1440px only |
| Sections above the fold | S01–S05 do **not** use `content-visibility` at any breakpoint |
| Verification | Scroll the full page top-to-bottom then bottom-to-top at 375px and 1440px; the scrollbar thumb must not change size |

## I.13 Forced Colors & High Contrast

Not a WCAG AA requirement, but a real-world condition this design is unusually exposed to (hairline borders, gold accents, scene-based colour).

```
@media (forced-colors: active) { … }
```

| Element | Behaviour |
|---|---|
| All borders | `border-color: CanvasText` — hairlines must not disappear |
| Gold accents | Inherit system colours; do not force |
| `.sceneBackdrop` | `display: none` — the scene system is disabled entirely |
| Buttons | `forced-color-adjust: auto`; ghost and filled buttons must remain distinguishable via border |
| Focus rings | `outline-color: Highlight` |
| Practice card hover | Border remains visible via `CanvasText` |

---

# Part II — Section Specifications

---

<!-- ============================================================ -->

# S01 — Site Header

## 1. Purpose

The header is the site's persistent promise: *this office is reachable*. For an audience the research describes as "stressed, uncertain, often mobile and after-hours," the header is not chrome — it is the conversion mechanism that never scrolls away.

**Business goal:** keep the phone number and consultation CTA within one interaction at every scroll depth. The research explicitly recommends sticky navigation for exactly this reason.

**Emotional response:** *steadiness*. Nothing in the header should move, flash, or change unexpectedly. It compresses once, quietly, and then holds. A header that behaves predictably signals an office that behaves predictably.

## 2. Desktop Layout (≥1200px)

```
│←── gutter ──→│←──────────── containerMax 1240px ────────────→│←── gutter ──→│
┌──────────────────────────────────────────────────────────────────────────────┐
│              ┌────────────────────────────────────────────────┐              │
│              │ ◈  AUSTIN G. ERVIN                             │              │
│  96px tall   │    ATTORNEY AT LAW, LLC                        │              │
│              │                     Practice Areas ▾  About    │              │
│              │                     FAQ  Contact               │              │
│              │                        (740) 529-1420  [ CTA ] │              │
│              └────────────────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────────────────────┘
                 ↑ single flex row, vertically centred — shown stacked
                   above only to fit this diagram
```

**Actual single-row composition at 1440px:**

```
◈ AUSTIN G. ERVIN                    Practice Areas ▾   About   FAQ   Contact
  ATTORNEY AT LAW, LLC                        (740) 529-1420   [ Request a Consultation ]
└─────── 252px ───────┘└──── margin-inline-start: auto ────┘└──────── 384px ────────┘
```

| Property | Value |
|---|---|
| Element | `<header class="siteHeader">`, `position: sticky; top: 0; z-index: var(--zHeader)` (see I.9) |
| Container | `--containerMax` (1240px) — logo left edge aligns to the hero H1 left edge |
| Height (rest) | 96px |
| Height (compact) | 72px |
| Layout | `display: flex; align-items: center` |
| Logo lockup | First child, fixed 252 × 40px (SVG `logoLockupHorizontal.svg`) |
| Nav | `margin-inline-start: auto` — pushes nav + utility to the right as one group |
| Nav ↔ utility gap | `--space8` (48px) at ≥1440px · `--space7` (40px) at 1200–1439px |
| Utility cluster | Phone link + CTA button, gap `--space6` (32px) |
| Phone link | Visible ≥1440px only. Below that it lives in the mega panel utility row. |
| Background (rest) | `transparent` — the light hero shows through |
| Background (compact) | `--surfaceBase` at 88% alpha + `backdrop-filter: blur(12px)` |
| Border (compact) | 1px bottom, `--borderSubtle` |

**Whitespace philosophy.** The header is 96px tall carrying a 40px lockup and a 48px button — 48px of vertical air around content that needs 48px. That ratio is the entire premium signal. The temptation to reduce it to 72px at rest must be resisted; the compact state exists precisely so the resting state can be generous.

**Scroll state.** A **24px-tall** sentinel `<div data-header-sentinel aria-hidden="true">` is placed as the first child of `<main>`, immediately before the hero. An `IntersectionObserver` (`threshold: 0`) toggles `.isCompact` on the header when the sentinel leaves the viewport — i.e. at **scrollY > 24px**. **No scroll event listener is used anywhere on this page.**

> **Revision 1.1 — the sentinel must have height.** A zero-height sentinel leaves the viewport at the first scrolled pixel, causing the header to compact on the slightest touch-scroll and to flicker between states during momentum scrolling near the top. 24px gives the state a deliberate threshold. The sentinel is `aria-hidden` and contributes nothing to layout beyond its own height, which is absorbed by the hero's top padding.

**Document structure** (referenced by the skip link and by the mobile overlay's `inert` handling):

```
<body data-scene="light">
  <a class="skipLink" href="#mainContent">…</a>
  <div class="sceneBackdrop" aria-hidden="true">…</div>
  <header class="siteHeader">…</header>
  <main id="mainContent">
    <div data-header-sentinel aria-hidden="true"></div>
    …S04 through S13…
  </main>
  <footer class="siteFooter">…</footer>
</body>
```

`<main>` wraps S04–S13. The header and footer sit outside it. When the mobile overlay opens, `inert` is applied to `<main>` and `<footer>` — not to `<header>`, which contains the close button.

## 3. Tablet Layout (768–1023px)

| Property | Value |
|---|---|
| Height (rest / compact) | 80px / 64px |
| Composition | Logo lockup left · phone icon button + hamburger right |
| Logo lockup | `logoLockupHorizontal.svg` at 210 × 34px |
| Right cluster | Two 48 × 48px buttons, gap `--space3` (12px) |
| Nav links | Not rendered. Hamburger only. |

### 1024–1199px — the CTA is retained *(Revision 1.1)*

> **Defect corrected.** The first draft applied the tablet treatment across the whole 768–1199px band. That produced a **conversion gap**: between the hero (≈10% scroll depth) and the practice grid (≈58%), the only visible conversion affordance at 1024–1199px was a phone icon. No form CTA was visible for roughly half the page — on a viewport wide enough to show one comfortably.

At 1024–1199px the header composition is:

```
◈ AUSTIN G. ERVIN                    [ Request a Consultation ]  [☎]  [☰]
└──── 210px ────┘                    └──── 214px ────┘  48   48
```

| Property | Value |
|---|---|
| Composition | Logo lockup · **CTA button** · phone icon button · hamburger |
| Measured requirement | 210 + 214 + 48 + 48 + (3 × 24px gaps) + (2 × 41px gutters) = **674px** in a 1024px viewport |
| Height | 80px rest / 64px compact |
| CTA | `buttonPrimary`, 44px tall (reduced from 48px), `--fontBodySm`, label "Request a Consultation" |
| Below 1024px | CTA drops; composition reverts to the table above |

The measurement leaves 350px of slack at 1024px, so this is not a squeeze — it is space the first draft simply failed to use.

## 4. Mobile Layout (< 768px)

| Property | Value |
|---|---|
| Height (rest / compact) | 72px / 64px |
| Composition | Logo lockup left · phone icon button + hamburger right |
| Logo lockup (≥400px) | `logoLockupHorizontal.svg` at 186 × 30px |
| Logo lockup (<400px) | `logoMark.svg` only, 30 × 30px — wordmark drops |
| Hide-on-scroll-down | Enabled below 768px only. Header translates `-100%` when scrolling down past 480px; returns immediately on any upward scroll. |

**Intentional mobile decision — the phone icon button.** This is not a scaled-down desktop header. On mobile the header carries a dedicated 48 × 48px `tel:` button with a phone glyph, permanently visible. This is the site's **above-the-fold conversion guarantee on mobile**, and it is what allows the hero (S04) to breathe rather than cramming a CTA into the first 667 pixels. It is a first-class element, not an afterthought — see Phase 1 Rec 20.5.

## 5. Component Inventory

- `siteHeader` (organism)
- `logoLockup` — variants `isHorizontal`, `isCompact`
- `primaryNav` → see S02
- `megaMenu` → see S03
- `buttonPrimary` — CTA
- `buttonIcon` — phone (mobile/tablet), hamburger
- `linkPhone` — desktop text phone link
- `skipLink` — first focusable element in the DOM

## 6. Typography

| Element | Level | Family | Token | Size @1440 | Weight | Tracking | Notes |
|---|---|---|---|---|---|---|---|
| Wordmark | — | *(vector paths)* | — | 40px lockup height | — | — | Drawn as outlines in `logoLockupHorizontal.svg`, **not live text**, so it renders identically on every device |
| Nav link | — | Inter | `--fontBodySm` | 16px | 500 | 0.01em | Sentence case |
| Phone link | — | Inter | `--fontBodySm` | 16px | 500 | 0.01em | Tabular figures |
| CTA button | — | Inter | `--fontBodySm` | 16px | 600 | 0.02em | Sentence case |

**Alignment:** all header text is vertically centred on the flex cross-axis. No baseline alignment is attempted between the lockup (vector) and the nav (live text) — they are optically centred instead.

## 7. Color Usage

| Element | Light scene | Dusk / Dark scene |
|---|---|---|
| Background (rest) | transparent | transparent |
| Background (compact) | `#FAF8F5` @ 88% + blur | `#18181B` / `#0B0B0D` @ 88% + blur |
| Logo mark shield | `--colorGold` `#C19E61` | `--colorGold` `#C19E61` |
| Logo wordmark | `currentColor` → `--textPrimary` `#0B0B0D` | `currentColor` → `--textPrimary` `#F6F5F3` |
| Nav links | `--textPrimary` `#0B0B0D` | `--textPrimary` `#F6F5F3` |
| Phone link | `--textSecondary` `#3A3B40` | `--textSecondary` `#D2D3D6` |
| CTA fill | `--accentPrimary` `#C19E61` | `--accentPrimary` `#C19E61` |
| CTA label | `--textOnAccent` `#0B0B0D` | `--textOnAccent` `#0B0B0D` |
| Compact border | `rgba(11,11,13,0.10)` | `rgba(246,245,243,0.10)` |

**The wordmark must use `fill: currentColor`.** This is a hard requirement of the scene architecture — the header crosses from light into dark as the visitor scrolls, and a hard-coded wordmark colour will become invisible. See Phase 1 Risk R2.

**Gold in this section:** the shield mark and the CTA fill. Nothing else. That is two elements totalling well under 1% of the header's painted area.

## 8. Motion

| Event | Property | Duration | Easing |
|---|---|---|---|
| Rest → compact | `height`, `background-color`, `backdrop-filter` | `--durationBase` 320ms | `--easeInOut` |
| Scene change | `color`, `background-color` | `--durationScene` 900ms | `--easeScene` |
| Nav link hover | Underline `scaleX(0 → 1)`, origin left | `--durationFast` 200ms | `--easeOut` |
| CTA hover | `background-color` → `--colorGoldLight` `#D0AF77` | `--durationFast` 200ms | `--easeOut` |
| Mobile hide/reveal | `translateY` | `--durationBase` 320ms | `--easeInOut` |
| Focus ring | — | **none** | — |

The header does **not** animate on page load. It is present at first paint. Animating the header in would delay the first thing a visitor needs.

**Reduced motion:** the compact state applies instantly (no height transition). Hide-on-scroll is disabled entirely — the header simply remains sticky.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Landmark | `<header>` with no `role` needed; contains `<nav aria-label="Primary">` |
| Skip link | **First focusable element in the DOM**, before the logo. `href="#mainContent"`. Visually hidden until focused, then rendered as a solid block at top-left with `--focusRing` styling. |
| Focus order | Skip link → logo → nav links (DOM order) → phone → CTA. Matches visual order exactly. No positive `tabindex`. |
| Logo alt | The SVG carries `role="img"` and `<title>Austin G. Ervin, Attorney at Law, LLC</title>` — **not** "logo" |
| Phone icon button | `aria-label="Call (740) 529-1420"`. The glyph is `aria-hidden="true"`. |
| Hamburger | `<button aria-expanded="false" aria-controls="mobileMenu" aria-label="Open menu">`; label and `aria-expanded` both toggle |
| Touch targets | Phone and hamburger buttons 48 × 48px. Nav links have 12px block padding → 40px effective height at desktop (pointer-driven, meets SC 2.5.8's 24px minimum with margin). |
| Contrast | Nav on light 17.85:1 · nav on dark 17.85:1 · CTA label on gold 7.80:1 · phone secondary on light 10.32:1 · phone secondary on dark 13.14:1. All AAA. |
| Compact-state contrast | The 88%-alpha background is composited over page content. Because the header only ever compacts over a `--surfaceBase` region, the effective background never falls outside the audited range. |
| Reduced motion | See §8 |

**Sticky header and focus (SC 2.4.11 — new in WCAG 2.2).** `scroll-padding-block-start: 96px` on `:root` guarantees that keyboard focus moving down the page never lands underneath the sticky header.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Critical asset | `logoLockupHorizontal.svg` — **inlined directly into the HTML**, not referenced. It is above the fold, ≤4KB, and must not cost a request or risk a flash of missing logo. |
| Render blocking | Header CSS is part of the ~9KB inlined critical CSS. |
| CLS | Header height is fixed at every breakpoint. The rest → compact transition changes height, but it occurs after scroll has begun and the header is `position: sticky` outside normal flow — **contributes 0 to CLS**. |
| LCP | The header contains no LCP candidate. Its inlined SVG must be small enough not to delay the HTML parse that reaches the hero. |
| INP | Scroll state is `IntersectionObserver`-driven. Zero scroll listeners. Zero layout reads on the main thread during scroll. |
| `backdrop-filter` | Applied only in the compact state and only to a single element. Promote with `will-change: backdrop-filter` **only while compacting**, then release — a permanently promoted full-width blur layer is a measurable cost on low-end Android. |
| Font dependency | Nav labels use Inter, which is preloaded. The metric-matched fallback (Phase 1 §8.4) means no header text reflows on font swap. |

---

<!-- ============================================================ -->

# S02 — Navigation

## 1. Purpose

Navigation answers one question for a stressed visitor: *is my problem on this list?* Everything else is secondary. The research is explicit that "clarity of fit" beats breadth in this market — the nav's job is to make fit obvious in under two seconds.

**Business goal:** route visitors into the correct practice cluster in one interaction, and keep the consultation CTA permanently adjacent.

**Emotional response:** *orientation without effort*. Four items. No cleverness. No hidden meaning. The visitor should never have to interpret a label.

## 2. Desktop Layout (≥1200px)

```
Practice Areas ▾      About      FAQ      Contact
└──── 118px ────┘ 36 └─ 48px ─┘ 36 └32px┘ 36 └─ 62px ─┘
                  ↑ gap --space6 (32px) at 1200–1439
                    gap --space7 (40px) at ≥1440
```

| Property | Value |
|---|---|
| Element | `<nav aria-label="Primary">` containing `<ul>` |
| Layout | `display: flex; align-items: center` |
| Item gap | 32px (1200–1439px) · 40px (≥1440px) |
| Link padding | `12px 0` — block padding only, so the underline sits tight to the text |
| Underline | 1px, positioned 6px below the text baseline, `--accentPrimary` |
| `white-space` | `nowrap` on every link — the "never allow navigation to wrap" guard from Phase 0 §3 |
| Order | Practice Areas · About · FAQ · Contact — **fixed** |

**Why four items.** Phase 1 §7.1 derived the collapse breakpoint from a measured 1152px requirement. Every additional nav item costs roughly 90–120px and pushes that number up. Four is not a stylistic preference; it is what the 1200px collapse point can carry with the whitespace the brief demands. **Adding a fifth item requires re-deriving the breakpoint** — this must be written as a comment above the nav media query in the source.

**Attorney bio is deliberately absent** from the top bar. It is reached from About, from the mega panel, and from the Attorney Introduction section (S07). Three paths, zero nav cost.

## 3. Tablet Layout (768–1023px)

Not rendered. The primary nav is replaced entirely by the mobile menu overlay (S03 covers the mega panel; the overlay is specified in Phase 1 §7.4). The `<nav aria-label="Primary">` element and its list are **not** present in the DOM at this breakpoint — they are the same markup, restyled, inside the overlay.

**Implementation note:** one navigation list exists in the DOM, once. It is styled as a horizontal bar at ≥1200px and as a vertical overlay list below it. It is never duplicated. Duplicated navigation markup is the most common source of screen-reader confusion on responsive sites and is prohibited here.

## 4. Mobile Layout (< 768px)

Rendered inside the full-screen overlay:

| Property | Value |
|---|---|
| Item typography | **Cormorant Garamond 500 at 32px** (`--fontDisplayMd` mobile ≈ 26px, overridden to 32px for the overlay) |
| Item spacing | `--space5` (24px) between items |
| Item target | Full-width tap area, minimum 56px tall |
| Alignment | Left-aligned to the container gutter — **not centred** |
| Practice Areas | Expands in place as a native `<details>` accordion. No second screen, no drill-down. |
| Divider | 1px `--borderSubtle` above the overlay's utility footer only. No dividers between items. |

**Intentional mobile decision — the type is the design.** A generic mobile menu is a 17px Inter link list. Setting navigation in 32px Cormorant is the single choice that makes this overlay feel like the brand rather than a component library default. Phase 0 §3 asks for a mobile menu that "should feel premium, not generic" — this is the mechanism.

## 5. Component Inventory

- `primaryNav` (organism)
- `navLink` — states `isActive`, `isMegaTrigger`
- `megaMenu` → S03
- `mobileMenu` (organism, specified in Phase 1 §7.4)
- `buttonPrimary` — CTA (shared with S01)
- `accordionItem` — Practice Areas group inside the overlay

## 6. Typography

| Element | Family | Token | Size | Weight | Tracking | LH |
|---|---|---|---|---|---|---|
| Nav link (desktop) | Inter | `--fontBodySm` | 16px | 500 | 0.01em | 1.0 |
| Nav link (active) | Inter | `--fontBodySm` | 16px | **600** | 0.01em | 1.0 |
| Nav link (overlay) | Cormorant Garamond | *(override)* | 32px | 500 | −0.01em | 1.15 |
| Overlay group label | Inter | `--fontCaption` | 12px | 500 | 0.14em, uppercase | 1.4 |

**Line length:** not applicable — all nav labels are single words or short phrases and are `nowrap`.
**Alignment:** desktop horizontal baseline-aligned; overlay left-aligned to gutter.

## 7. Color Usage

| State | Light scene | Dusk / Dark scene |
|---|---|---|
| Rest | `--textPrimary` `#0B0B0D` | `--textPrimary` `#F6F5F3` |
| Hover | `--textPrimary` + gold underline | `--textPrimary` + gold underline |
| Active page | `--textPrimary` weight 600 + persistent gold underline | same |
| Underline | `--accentPrimary` `#C19E61`, 1px | `--accentPrimary` `#C19E61`, 1px |
| Focus | 2px `#0B0B0D` ring, 2px offset | 2px `#D0AF77` ring, 2px offset |

**Active state carries two signals, not one.** A gold underline alone would make the current page indicated by colour only — a WCAG 1.4.1 failure. The active link is therefore also weight 600. On the light scene the gold underline is 2.29:1 against the background and is *decorative reinforcement only*; the weight change is the accessible signal.

**Gold in this section:** 1px underlines. At 118px × 1px per link, this is a rounding error against the gold budget.

## 8. Motion

| Event | Property | Duration | Easing |
|---|---|---|---|
| Link hover in | Underline `scaleX(0 → 1)`, `transform-origin: left` | `--durationFast` 200ms | `--easeOut` |
| Link hover out | Underline `scaleX(1 → 0)`, `transform-origin: right` | `--durationFast` 200ms | `--easeOut` |
| Overlay open | Backdrop `opacity 0 → 1` | 240ms | `--easeOut` |
| Overlay items | `opacity` + `translateY(12px → 0)`, 40ms stagger | `--durationBase` 320ms | `--easeOut` |
| Overlay close | `opacity 1 → 0` | 180ms | `--easeOut` |

**The origin flip on hover-out is deliberate.** The underline draws in from the left and retracts to the right, so it reads as a single continuous stroke passing through rather than a line that grows and shrinks. It costs nothing and it is the kind of detail that separates considered work from assembled work.

**Reduced motion:** underline appears/disappears instantly at full width. Overlay items appear with no transform and no stagger.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Landmark | `<nav aria-label="Primary">`. The overlay's nav uses the same element — one landmark, not two. |
| List semantics | Real `<ul>` / `<li>` so screen readers announce "list, 4 items" |
| Current page | `aria-current="page"` on the active link |
| Keyboard | All links are native `<a>`. `Tab` traverses in DOM order. No custom key handling on plain links. |
| Practice Areas trigger | See S03 §9 — disclosure pattern |
| Overlay | `role="dialog" aria-modal="true"`, focus trapped, `inert` on `<main>` and `<footer>`, `Escape` closes, focus returns to hamburger |
| Body scroll lock | `overflow: hidden` on `<body>` with scroll-position save/restore |
| Touch targets | Overlay items minimum 56px tall, full container width |
| Contrast | 17.85:1 in both scenes |
| Reduced motion | See §8 |

**No duplicated navigation in the DOM.** Stated in §3 and repeated here because it is the single most common accessibility regression in responsive rebuilds.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Critical | Nav markup and styles are above the fold — included in inlined critical CSS. |
| JS cost | The nav itself requires no JavaScript. Only the mega trigger and the hamburger do. Plain links work with JS disabled. |
| Underline technique | `transform: scaleX()` on a pseudo-element — compositor-only. **Never** animate `width`. |
| Overlay | Rendered in the DOM at all breakpoints but `display: none` above 1200px. It contains ~20 links and adds roughly 1.5KB to the HTML — acceptable, and far cheaper than injecting it with JavaScript. |
| Font | Overlay uses Cormorant 500, which is **not** preloaded (it is below the fold and behind an interaction). It will have loaded long before a visitor opens the menu. |
| INP | Hamburger tap → overlay open must complete under 100ms. The overlay is pre-rendered, so opening is a class toggle plus a focus move — no layout construction. |

---

<!-- ============================================================ -->

# S03 — Mega Menu

## 1. Purpose

The mega panel exists because this firm's verified practice mix is genuinely broad — 15 public categories across three unrelated clusters. A flat dropdown of 15 items is a scanning problem; three labelled columns is a *map*.

**Business goal:** let a visitor self-identify their legal problem and reach the correct page in one interaction, without needing to understand how a law firm organises itself.

**Emotional response:** *"they handle my thing."* The panel's real job is recognition. A visitor scanning for "protection order" should find those exact words, not "Domestic Relations."

**Phase 1 §6.1 recommendation, restated:** only **one** mega panel exists on this site. About, FAQ, and Contact are plain links. Four mega panels would read as an enterprise portal.

## 2. Desktop Layout (≥1200px)

```
├─────────────────────────── full-bleed panel ───────────────────────────┤
│                                                                         │
│   │←──────────────── containerMax 1240px ─────────────────→│            │
│   │                                                        │            │
│   │  CRIMINAL DEFENSE      FAMILY LAW         ESTATE & PROPERTY         │
│   │  ─────────────────     ─────────────────  ─────────────────         │
│   │  Criminal Defense →    Family Law →       Estate Planning →         │
│   │  OVI & DUI Defense     Divorce            Probate                   │
│   │  Record Sealing        Child Custody      Wills & Living Wills      │
│   │                        Child Support      Guardianship              │
│   │                        Protection Orders  Real Estate               │
│   │                        Adoption                                     │
│   │                                                                     │
│   │  ─────────────────────────────────────────────────────────────────  │
│   │  Not sure where you fit?   Call (740) 529-1420  ·  View all areas    │
│   │                                                        │            │
└─────────────────────────────────────────────────────────────────────────┘
      ↑ 80px block padding      ↑ 3 cols, gap --space9 (64px)
```

| Property | Value |
|---|---|
| Panel width | Full bleed (100vw), background spans edge to edge |
| Content width | `--containerMax` 1240px, centred — aligns to the page's vertical spine |
| Position | `position: absolute; top: 100%` relative to the header |
| Block padding | `--space10` (80px) top, `--space8` (48px) bottom |
| Columns | 3, equal width — `grid-template-columns: repeat(3, 1fr)`, gap `--space9` (64px) |
| Column width @1440 | (1240 − 128) / 3 = **370.7px** |
| Column heading | `--fontCaption`, uppercase, 0.14em, `--textMuted` |
| Rule under heading | 1px, full column width, `--accentPrimary` at 40% opacity, `--space3` (12px) below heading |
| Link list | `--space4` (16px) between items |
| Link block padding | `10px 0` → 45px effective target height |
| Hub link | First item in each column, weight 600, trailing `→` glyph |
| Utility row | 1px `--borderSubtle` top rule, `--space6` (32px) padding-top |

**Column headings are not links.** They are labels. The first item in each column is the hub link and carries the arrow. This removes the common ambiguity of a clickable heading that duplicates its own first child.

**Whitespace philosophy.** 80px of top padding inside a panel whose tallest column is six items. The panel is mostly air. That is the point — it should feel like a page turning, not a menu dropping.

## 3. Tablet Layout (768–1199px)

**The mega panel does not exist below 1200px.** It is replaced by the Practice Areas accordion inside the mobile menu overlay (S02 §4).

| Property | Value |
|---|---|
| Trigger | `<summary>` inside the overlay's `<details>` |
| Expanded content | Three labelled groups, stacked vertically |
| Group label | `--fontCaption`, uppercase, 0.14em, `--textMuted` |
| Group items | Inter 400 at `--fontBodyLg` (19px), `--space4` between, 48px minimum target |
| Indent | Items indent `--space5` (24px) from the group label |

The three-cluster structure survives the collapse. A visitor on a tablet still sees Criminal / Family / Estate as distinct groups — only the axis changes from horizontal to vertical.

## 4. Mobile Layout (< 768px)

Identical structure to tablet, with:

| Property | Value |
|---|---|
| Group items | Inter 400 at `--fontBody` (17px) |
| Item target | 48px minimum, full container width |
| Indent | `--space4` (16px) |
| Utility row | Rendered at the bottom of the expanded group: "Not sure where you fit?" as a full-width link |

**Intentional mobile decision — no drill-down.** Practice Areas expands *in place* rather than sliding to a second panel. Drill-down navigation on mobile costs a visitor their sense of position and requires a back affordance. For an audience under stress, in-place expansion is measurably lower-friction. The trade-off is a taller scroll inside the overlay, which is acceptable.

## 5. Component Inventory

- `megaMenu` (organism)
- `megaColumn`
- `megaColumnHeading`
- `megaLink` — variants `isHub`
- `megaUtilityRow`
- `linkPhone`
- `linkArrow`
- `accordionItem` — the sub-1200px equivalent

## 6. Typography

| Element | Family | Token | Size @1440 | Weight | Tracking | Measure | Align |
|---|---|---|---|---|---|---|---|
| Column heading | Inter | `--fontCaption` | 13px | 500 | 0.14em uppercase | ~20ch | left |
| Hub link | Inter | `--fontBody` | 18px | 600 | 0.01em | ~24ch | left |
| Standard link | Inter | `--fontBody` | 18px | 400 | 0.01em | ~24ch | left |
| Utility row | Inter | `--fontBodySm` | 16px | 400 | 0.01em | — | left |

**Spacing:** heading → rule 12px · rule → first link 20px · link → link 16px · last link → utility rule 48px.

## 7. Color Usage

| Element | Light scene | Dusk / Dark scene |
|---|---|---|
| Panel background | `--surfaceRaised` `#FFFFFF` | `--surfaceRaised` `#18181B` |
| Panel shadow | `0 24px 48px rgba(11,11,13,0.08)` | **none** |
| Panel bottom border | 1px `--borderSubtle` | 1px `--borderSubtle` |
| Column heading | `--textMuted` `#6A6C72` (4.74:1) | `--textMuted` `#8A8C93` (5.19:1) |
| Heading rule | `--accentPrimary` @ 40% | `--accentPrimary` @ 40% |
| Hub link | `--textPrimary` `#0B0B0D` | `--textPrimary` `#F6F5F3` |
| Standard link | `--textSecondary` `#3A3B40` (10.32:1) | `--textSecondary` `#D2D3D6` (11.84:1) |
| Link hover | `--textPrimary` + gold underline | `--textPrimary` + gold underline |
| Utility rule | `--borderSubtle` | `--borderSubtle` |

**The panel shadow is the only shadow on the site** (see I.5), and it exists only on the light scene, where a white panel over a near-white page has no other means of separation. On dark scenes the value difference between `#18181B` and `#0B0B0D` plus the 1px border is sufficient.

**Gold in this section:** three 1px column rules at 40% opacity, plus hover underlines. Roughly 0.1% of panel area.

## 8. Motion

| Event | Property | Duration | Easing |
|---|---|---|---|
| Open (pointer) | `opacity 0 → 1`, `translateY(−8px → 0)` | 220ms | `--easeOut` |
| Close | `opacity 1 → 0` | 160ms | `--easeOut` |
| Pointer-enter intent delay | — | **120ms** | — |
| Pointer-leave grace delay | — | **240ms** | — |
| Link hover | Underline `scaleX(0 → 1)` | `--durationFast` 200ms | `--easeOut` |
| Caret rotation | `rotate(0 → 180deg)` | 220ms | `--easeOut` |

**The two delays are the difference between a panel that feels considered and one that feels twitchy.** 120ms of enter-intent prevents the panel opening when a pointer merely crosses the trigger on its way to the CTA. 240ms of leave-grace lets a visitor travel diagonally from the trigger to the panel's third column without it vanishing underneath them.

The panel's contents do **not** stagger in. A staggered mega menu draws attention to itself and delays scanning. It appears as one object.

**Reduced motion:** panel appears and disappears instantly. Delays still apply — they are interaction affordances, not animation.

## 9. Accessibility

This is the most failure-prone component on the page. The contract is exact.

| Concern | Specification |
|---|---|
| Pattern | **Disclosure**, not menu. Do not use `role="menu"` / `role="menuitem"` — those imply application semantics and break expected link behaviour. |
| Markup (no JS) | `<a href="/practice-areas/">Practice Areas</a>` — a real, working link |
| Markup (with JS) | A sibling `<button aria-expanded="false" aria-controls="megaPanelPractice" aria-label="Open practice areas menu">` carrying the caret is injected next to the link |
| Panel element | `<nav aria-label="Practice areas">` containing three `<ul>`s, each preceded by a heading |
| Column headings | **A single `<h2>` per column, styled as the caption.** One element, visible and announced. *(Rev 1.1: the first draft offered two markup options and told the engineer to "pick one" — that is exactly the ambiguity this specification exists to remove. The visually-hidden-heading-plus-aria-hidden-label alternative is rejected: it duplicates content, doubles the DOM, and risks the two drifting apart in a future edit.)* |
| Keyboard — open | `Enter` / `Space` on the trigger toggles. `ArrowDown` opens and moves focus to the first link. |
| Keyboard — traverse | `Tab` moves through panel links in DOM order. **No focus trap** — this is a disclosure, and trapping focus in a non-modal region violates expectation. |
| Keyboard — close | `Escape` closes and returns focus to the trigger |
| Blur close | `focusout` on the panel subtree with a `relatedTarget` containment check |
| Touch | First tap opens the panel. The hub is reachable via the first link in column one and via "View all practice areas". **No destination is hover-only.** |
| Contrast | Standard links 10.32:1 light / 11.84:1 dark. Column headings 4.74:1 / 5.19:1 — both pass AA at their 13px size. |
| Touch targets | 45px effective link height at desktop; 48px below 1200px |
| Reduced motion | See §8 |

**Below 1200px** the accordion uses native `<details>` / `<summary>`, which supplies correct keyboard and screen-reader behaviour with no JavaScript.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| DOM cost | ~16 links, ~2KB of HTML. Present in the initial document — **not** injected. |
| Critical CSS | Panel styles are **excluded** from the inlined critical CSS. The panel is `opacity: 0; visibility: hidden` at rest and cannot appear before the main stylesheet loads. |
| Paint | `opacity` + `transform` only. The panel is promoted with `will-change: opacity, transform` **on trigger hover/focus**, not permanently. |
| Layout containment | **`contain: layout`** on the panel prevents its internal layout from invalidating the header. *(Rev 1.1: `paint` was specified in the first draft and is removed — `contain: paint` clips descendants to the padding box, which would clip the focus ring on the first and last links, and would clip the panel's own light-scene box-shadow.)* |
| Stacking | `z-index: var(--zMegaPanel)` (110) — above `--zHeader` (100), so the panel sits over the header's compact background rather than under it. |
| No images | The panel contains no imagery or icons beyond the caret and hub arrows, which are inline SVG paths within the already-inlined sprite. |
| INP | Open must complete under 100ms. Because the panel is pre-rendered and only its opacity changes, the interaction is a single class toggle. |

---

<!-- ============================================================ -->

# S04 — Hero

## 1. Purpose

The hero has roughly two seconds to replace a visitor's anxiety with the sense that they have arrived somewhere serious and calm. It is the first and largest expression of the "premium presentation, not a collection of sections" mandate in Phase 0 §2.

**Business goal:** establish credibility instantly, communicate practice scope and geography in one glance, and present two conversion paths — form and phone — without pressure.

**Emotional response:** *relief, then confidence*. The research describes visitors who are "stressed, uncertain, comparing multiple attorneys" and states the site "should reduce anxiety instead of increasing it." A vast field of warm light, one enormous sentence, and a person's face is the design answer to that brief.

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ◈ AUSTIN G. ERVIN                    Practice ▾  About  FAQ  Contact  [CTA]│  ← S01 overlaid
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ↕ 176px (header 96 + --space10 80)                                       │
│                                                     ╎                      │
│   PORTSMOUTH, OHIO · OHIO & KENTUCKY                ╎                      │
│   ↕ 24px                                            ╎  ░░░░░░░░░░░░░░░░    │
│                                                     ╎ ░░░░░░░░░░░░░░░░░░   │
│   Serious counsel                                   ╎░░░░░░░░░░░░░░░░░░░░  │
│   when it matters                                   ░░░░░░ portrait ░░░░░  │
│   most.                                             ░░░░░░ cutout  ░░░░░░  │
│                                                     ░░░░░░░░░░░░░░░░░░░░░  │
│   ↕ 40px                                            ░░░░░░░░░░░░░░░░░░░░░  │
│   Criminal defense, family law, and estate          ░░░░░░░░░░░░░░░░░░░░░  │
│   matters in Portsmouth and across southern         ░░░░░░░░░░░░░░░░░░░░░  │
│   Ohio and northeastern Kentucky.                   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░  │
│   ↕ 48px                                            ▒▒░░░░ feather ░░░▒▒   │
│   ┌───────────────────────┐                                                │
│   │ Request a consultation│   Call (740) 529-1420 →                        │
│   └───────────────────────┘                                                │
│   ↕ 128px                                                                  │
├────────────────────────────────────────────────────────────────────────────┤
│  ← S05 Trust Strip, 1px hairline                                           │
└────────────────────────────────────────────────────────────────────────────┘
    │←─────── cols 1–7 · 710px ───────→│←─ 32 ─→│←── cols 8–12 · 498px ──→│
                                            ╎ = 1px gold rule, behind portrait
```

### Layout specification

| Property | Value @1440px |
|---|---|
| Section | `min-height: 88vh` (a floor, not a fixed height — content may exceed it) |
| Container | `--containerMax` 1240px |
| Grid | 12 columns, 32px gap |
| Type column | Cols 1–7 = **710px** |
| Portrait column | Cols 8–12 = **498px** |
| Padding-block-start | **176px** (96px header + `--space10` 80px) |
| Padding-block-end | **0** — see the geometry note below |
| Type column | `align-self: center`, with `margin-block-end: var(--space12)` (128px) |
| Portrait column | `align-self: end`, `margin-block-end: 0` — its feathered base reaches the section's bottom edge |

> ### Revision 1.1 — hero geometry contradiction, resolved
>
> The first draft specified `padding-block-end: 128px` on the section **and** claimed the portrait's feathered base "meets the hero's bottom padding, overlapping S05's hairline by ~24px." Those statements are incompatible: section padding applies to all grid children, so a 128px bottom pad would end the portrait 128px *above* the trust strip, not overlapping it.
>
> The geometry is corrected as follows. The section carries **no bottom padding**; the *type column* carries a 128px bottom margin instead. The portrait column therefore extends to the section's bottom edge, where its 18% alpha feather dissolves into `--surfaceBase` exactly at S05's hairline rule. The visual intent — the portrait dissolving *through* the divider rather than stopping short of it — is now what the box model actually produces.
>
> **Consequent height calculation @1440 × 900:** 176px top padding + 622px portrait = **798px**, which satisfies `min-height: 88vh` (792px) without the floor being the binding constraint. The type block (≈450px) is centred within that 798px, leaving ~174px of air above and below it — which is the intended composition, not a happy accident. If the portrait's delivered aspect ratio changes, this calculation must be redone.

### Vertical rhythm, type column

| From → To | Token | Value |
|---|---|---|
| Top padding → eyebrow | — | 176px |
| Eyebrow → H1 | `--space5` | 24px |
| H1 → lede | `--space7` | 40px |
| Lede → CTA row | `--space8` | 48px |
| CTA row → section end | `--space12` | 128px |

### The H1 — art-directed, not automatic

The headline breaks on **exactly three lines at every breakpoint**. This is a designed silhouette, not a consequence of available width.

```
Serious counsel      ← 15 characters
when it matters      ← 15 characters
most.                ←  5 characters
```

| Property | Value |
|---|---|
| Rendered size @1440 | **104px** — see note below |
| Line-height | 1.02 → 106px per line → **318px** total block |
| Measure guard | `max-width: 15ch` |
| Line breaks | **Explicit.** Each line wrapped in `<span class="heroTitleLine">`. Do not rely on automatic wrapping or `text-wrap: balance` for this element. |
| Tracking | −0.02em |

> **The hero H1 caps at 104px, not at `--fontDisplayXl`'s 116px maximum.** At 116px the 15-character line measures ~766px and overflows the 710px type column at wide desktop. 104px measures ~686px and sits inside the column at every viewport ≥1200px. `--fontDisplayXl`'s full 116px ceiling remains available to full-width display headings elsewhere. This is a deliberate, verified constraint — **do not "fix" it by raising the cap.**

### The portrait

| Property | Value @1440px |
|---|---|
| Displayed size | 498 × 622px (4:5) |
| Treatment | Cutout — subject isolated from the studio background (Phase 1 §2.4) |
| Bottom edge | Lower **18%** feathers via `mask-image: linear-gradient(to bottom, black 82%, transparent 100%)` |
| Vertical anchor | `align-self: end` — the feathered base meets the hero's bottom padding, overlapping S05's hairline by ~24px |
| Grade | −8% saturation, +2% warm lift (harmonises the cool studio light with the warm palette and reduces the purple tie's prominence — Phase 1 Risk R3) |
| Behind it | Radial field, `--surfaceWarmDeep` `#F0EDE7` → transparent, ~700px diameter, centred on the portrait's upper third |
| Gold rule | 1px vertical, **`--accentStroke` `#A98445` at full opacity** (3.26:1 — see I.11; the original 30% specification measured 1.27:1 and was invisible), positioned on the **column-8 gridline**, running from y = 176px down to the feather start. `z-index: var(--zBase)`; the portrait sits at `var(--zRaised)` so the rule visibly passes behind the shoulder. |

The gold rule passing behind the subject is the only decorative gold in Scene 1. It is 1px wide and roughly 400px tall — approximately 0.03% of the viewport. This is what "gold is an accent" means in practice.

### Whitespace philosophy

The hero is approximately **62% empty**. The type column occupies 710px of a 1240px container and its tallest element is 318px in a ~800px tall section. Every instinct to fill that space — a badge row, a scroll indicator, a second image, a stat block — must be refused. The emptiness is the message: this office is not shouting at you.

## 3. Tablet Layout (768–1199px)

**The hero does not simply stack.** It reflows into a deliberately different composition.

```
┌──────────────────────────────────────────────────────────┐
│  ◈ AUSTIN G. ERVIN                          [☎] [☰]      │
├──────────────────────────────────────────────────────────┤
│   ↕ 144px                                                │
│   PORTSMOUTH, OHIO · OHIO & KENTUCKY                     │
│   ↕ 20px                                                 │
│   Serious counsel                                        │
│   when it matters              ← H1 spans FULL width     │
│   most.                                                  │
│   ↕ 48px                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │ Criminal defense,    │  │  ░░░░░░░░░░░░░░░░░░  │      │
│  │ family law, and      │  │ ░░░░ portrait ░░░░░  │      │
│  │ estate matters       │  │ ░░░░░░░░░░░░░░░░░░░  │      │
│  │ across southern      │  │ ░░░░░░░░░░░░░░░░░░░  │      │
│  │ Ohio and NE Kentucky.│  │ ░░░░░░░░░░░░░░░░░░░  │      │
│  │                      │  │ ░▒▒▒▒ feather ▒▒▒░░  │      │
│  │ [Request consult]    │  │                      │      │
│  │ Call (740) 529-1420 →│  │                      │      │
│  └──────────────────────┘  └──────────────────────┘      │
│    cols 1–4 · 337px          cols 5–8 · 337px            │
└──────────────────────────────────────────────────────────┘
```

| Change | Specification |
|---|---|
| Composition | **H1 promoted to full container width**, portrait demoted to a peer of the lede/CTA block |
| Rationale | At 768px the H1 renders at 68px; a 15-character line measures ~449px, which does not fit a 337px half-column. Rather than shrink the headline (forbidden by Phase 0 §5) the headline takes the full width and the row below splits. |
| Grid | 8 columns, 32px gap. Row 1: H1 spans 1–8. Row 2: content 1–4, portrait 5–8. |
| H1 size | 68px @768 → 93px @1199 |
| H1 measure guard | `max-width: 15ch` — forces the three-line break at all tablet widths |
| Section min-height | Removed. Height is content-driven. |
| Padding-block-start | 144px (80px header + 64px) |
| Padding-block-end | `--space11` 96px |
| Portrait | 337 × 421px (4:5), `align-self: end`, feather retained |
| Gold rule | **Removed.** At this width it crowds the composition. |
| Radial field | Retained, scaled to ~480px diameter |
| CTA row | Stacks vertically: primary button, then phone link beneath at `--space5` (24px) |

## 4. Mobile Layout (< 768px)

**Intentional decision — face first, then words.** The portrait leads. The research is unambiguous that this is a trust-driven, human-centred market; a face before a sentence is the correct order at the moment of arrival.

```
┌─────────────────────────────┐
│ ◈ AUSTIN G. ERVIN  [☎] [☰]  │  ← 72px, phone button always visible
├─────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░ face ░░ │  ← full-bleed band, 100vw × 240px
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │     object-position 60% horizontal
│ ░▒▒▒▒▒▒▒▒ feather ▒▒▒▒▒▒▒░░ │     subject right-of-centre
├─────────────────────────────┤
│   ↕ 24px                    │
│   PORTSMOUTH, OHIO ·        │
│   OHIO & KENTUCKY           │
│   ↕ 16px                    │
│   Serious counsel           │
│   when it matters           │  ← 46px, still three lines
│   most.                     │
│   ↕ 32px                    │
│   Criminal defense, family  │
│   law, and estate matters   │
│   across southern Ohio and  │
│   northeastern Kentucky.    │
│   ↕ 32px                    │
│  ┌───────────────────────┐  │
│  │ Request a consultation│  │  ← full width
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Call (740) 529-1420  │  │  ← full width, ghost button
│  └───────────────────────┘  │
│   ↕ 72px                    │
└─────────────────────────────┘
```

| Change | Specification |
|---|---|
| Portrait | Full-bleed band, `100vw × 240px`, 3:2 landscape crop of the head-and-shoulders. `object-position: 60% 30%` — subject sits right of centre, warm negative space to the left. |
| Portrait feather | Lower 25% masks to transparent, meeting `--surfaceBase` |
| H1 | **46px, unchanged, three lines.** 15 characters × ~0.44em × 46px ≈ 304px, inside the 335px content column. |
| H1 → the same silhouette | The three-line break is identical to desktop. The headline's *shape* is a constant of the brand across every device. |
| Eyebrow | Wraps to two lines; `--fontCaption` 12px |
| Lede | `--fontBodyLg` 18px, four lines, max 38ch |
| CTA | **Both CTAs become full-width buttons.** The secondary is promoted from a text link to a ghost button. |
| CTA stack gap | `--space3` (12px) |
| Padding-block-end | `--space11` 72px |
| Gold rule / radial field | Removed |

### On the fold

At 375 × 667 the CTA pair sits at roughly y = 640–740px — the primary button is partially visible, the secondary below the fold. **This is accepted, deliberately.** The above-the-fold conversion guarantee on mobile is the header's permanent phone button (S01 §4). Cramming both CTAs above 667px would require shrinking the H1 or removing the portrait, both of which cost more than they return. On 390 × 844 and above — the large majority of the mobile audience — the full CTA pair is visible.

## 5. Component Inventory

- `heroSection` (organism)
- `eyebrow`
- `heroTitle` + `heroTitleLine`
- `heroLede`
- `buttonPrimary` — `isFullWidth` at <768px
- `buttonGhost` — `isFullWidth` at <768px (mobile only; renders as `linkArrow` at ≥768px)
- `linkArrow` — phone, ≥768px
- `portraitFrame` — variants `isHero`, `isHeroBand` (mobile)
- `goldRule` — decorative, `aria-hidden`
- `radialField` — decorative, `aria-hidden`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em, uppercase | 1.40 | ~34ch | left |
| Headline | **`<h1>`** | Cormorant Garamond | *(capped)* | **104px** | 68px | 46px | 600 | −0.02em | 1.02 | 15ch | left |
| Lede | `<p>` | Inter | `--fontBodyLg` | 20.6px | 19px | 18px | 400 | 0 | 1.55 | 46ch | left |
| Primary CTA | — | Inter | `--fontBodySm` | 16px | 16px | 16px | 600 | 0.02em | 1.0 | — | centre |
| Phone CTA | — | Inter | `--fontBody` | 18px | 17px | 16px | 500 | 0.01em | 1.0 | — | left / centre |

**Exactly one `<h1>` exists on this page**, and it is the hero headline.

> ### Revision 1.1 — the H1 carries no keywords. This is a real, unsurfaced trade-off.
>
> "Serious counsel when it matters most." contains no practice term and no place name. The homepage `<h1>` is among the strongest on-page signals available, and Phase 1 §15 names local search visibility as a primary objective. The first draft made this trade silently, which is the actual defect — the decision may be right, but it must be a decision.
>
> **The trade is worth making, and it should be made explicitly.** The Foundation brief's first non-negotiable is "do not build a generic attorney website," and "Portsmouth Ohio Criminal Defense Attorney" as an 104px editorial headline is precisely the generic outcome it forbids. Google has also been de-weighting exact-match H1s for years; `<title>`, structured data, and body content carry local intent effectively.
>
> **Three compensating changes are specified rather than accepting the cost unmitigated:**
>
> | # | Change | Where |
> |---|---|---|
> | 1 | The **eyebrow** stays as specified — "PORTSMOUTH, OHIO · OHIO & KENTUCKY" — and sits *immediately before* the H1 in the DOM, so the first text in `<main>` carries both place signals | S04 |
> | 2 | The **lede is rewritten to lead with geography rather than close with it**: *"Criminal defense, family law, and estate matters across southern Ohio and northeastern Kentucky."* → **"Criminal defense, family law, and estate matters in Portsmouth and across southern Ohio and northeastern Kentucky."** Practice terms and place now appear within the first 20 words of body copy. | S04 |
> | 3 | **S10's H2 is revised** from "How I can help" — which carries nothing — to **"How I can help in southern Ohio"** | S10 |
>
> With these, the page carries "Portsmouth," "southern Ohio," "Kentucky," and all six practice terms in headings and lead copy without the H1 doing keyword work. **If the client's SEO priority outweighs the brand position, the fallback H1 is "Serious counsel in southern Ohio."** (15/18 characters — it breaks on two lines rather than three and the composition must be re-verified). That is a client decision, added to the Approval Checklist.

**Optical note.** Cormorant Garamond reads roughly 12% smaller than Inter at identical `font-size` because of its small cap-height-to-em ratio. The 104px/68px/46px values already account for this. Do not compare them to Inter sizes.

## 7. Color Usage

Scene: **`light`** throughout.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Section background | `--surfaceBase` | `#FAF8F5` | — |
| Radial field | `--surfaceWarmDeep` → transparent | `#F0EDE7` | — |
| Eyebrow | `--textMuted` | `#6A6C72` | 4.74:1 ✅ |
| Headline | `--textPrimary` | `#0B0B0D` | 17.85:1 ✅ |
| Lede | `--textSecondary` | `#3A3B40` | 10.32:1 ✅ |
| Primary CTA fill | `--accentPrimary` | `#C19E61` | — |
| Primary CTA label | `--textOnAccent` | `#0B0B0D` | 7.80:1 ✅ |
| Phone link text | `--textPrimary` | `#0B0B0D` | 17.85:1 ✅ |
| Phone link arrow | `--accentPrimary` | `#C19E61` | decorative, `aria-hidden` |
| Gold rule | **`--accentStroke`** `#A98445` (full) | — | 3.26:1 — decorative. Gold @30% measured **1.27:1** and was invisible; corrected per I.11. |
| Ghost CTA border (mobile) | **`--borderInteractive`** | `rgba(11,11,13,0.52)` | **3.89:1 ✅** (SC 1.4.11) |

**Gold audit for this section:** CTA fill (≈204 × 48px), 1px vertical rule (≈1 × 400px), one 12px arrow glyph. Total ≈ 10,200px² of a 1440 × 800 viewport = **0.09%**. Well inside the 3% budget.

**Prohibited here:** gold headline text, gold eyebrow text, gold background washes, a second filled gold element.

## 8. Motion

### Entrance — the only choreographed sequence on the page

Begins on `DOMContentLoaded`. Elements are visible at rest in CSS; JS adds the entrance class.

| Order | Element | Delay | Property | Duration | Easing |
|---|---|---|---|---|---|
| 1 | Eyebrow | 0ms | `opacity`, `translateY(12px → 0)` | 560ms | `--easeOut` |
| 2 | H1 line 1 | 80ms | `opacity`, `translateY(16px → 0)` | 560ms | `--easeOut` |
| 3 | H1 line 2 | 160ms | ″ | 560ms | `--easeOut` |
| 4 | H1 line 3 | 240ms | ″ | 560ms | `--easeOut` |
| 5 | Lede | 320ms | `opacity`, `translateY(12px → 0)` | 560ms | `--easeOut` |
| 6 | CTA row | 400ms | `opacity`, `translateY(12px → 0)` | 560ms | `--easeOut` |
| — | Portrait | 120ms | `opacity 0 → 1`, `scale(1.02 → 1)` | 900ms | `--easeOut` |
| — | Gold rule | 500ms | `scaleY(0 → 1)`, origin top | 700ms | `--easeOut` |

Total sequence: **960ms**. The line-by-line headline reveal is the signature moment of the page and the only place where staggering is applied to a single text block.

### Ongoing

| Event | Property | Value | Duration | Easing |
|---|---|---|---|---|
| Portrait parallax | `translateY` | ±12px maximum | — | scroll-linked |
| Primary CTA hover | `background-color` → `#D0AF77` | — | 200ms | `--easeOut` |
| Phone link hover | Arrow `translateX(0 → 4px)` | — | 200ms | `--easeOut` |
| Ghost CTA hover | `border-color` → `--textPrimary` | — | 200ms | `--easeOut` |

**Parallax constraints:** ≥1200px only. `transform` only. Driven by the same `IntersectionObserver`-gated `requestAnimationFrame` loop that runs only while the hero is in view, and is torn down when it leaves. **Never a scroll event listener.**

**Reduced motion:** the entrance sequence is removed entirely — all hero content is present at full opacity on first paint. Parallax is disabled. Hover transitions become instant. **The hero looks correct with zero motion**; this is the test that the motion was decorative rather than structural.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | The page's only `<h1>`. The three `<span class="heroTitleLine">` elements are inside it — screen readers announce one continuous heading. Ensure no `<br>` produces an unwanted pause; spans are `display: block`. |
| Portrait alt | `alt="Austin G. Ervin, attorney, photographed in his Portsmouth, Ohio office"` — descriptive, not "headshot" or "portrait" |
| Decorative elements | Gold rule and radial field are `<div aria-hidden="true">` with `alt=""` semantics; they carry no meaning |
| Focus order | Primary CTA → phone link. Both are native interactive elements in DOM order. |
| Phone link | `<a href="tel:+17405291420">`. Visible text is the formatted number so it is readable and speakable. `aria-label` not required — the visible text is sufficient and better. |
| Touch targets | Primary CTA 48px tall (56px on mobile, full width). Phone link 44px minimum tap area at ≥768px; 56px full-width button below. |
| Contrast | All values in §7 verified. Minimum on this section is 4.74:1 (eyebrow). |
| Reduced motion | See §8 |
| Zoom / reflow | At 400% zoom on a 1280px viewport (= 320px effective), the mobile layout applies. The H1 at 46px in a 280px column produces four lines rather than three — **acceptable and expected**; no horizontal scroll occurs. |
| Text spacing (SC 1.4.12) | No fixed heights on any text container. `min-height: 88vh` is a floor on the section only and cannot clip content. |

**Eyebrow content and screen readers.** "PORTSMOUTH, OHIO · OHIO & KENTUCKY" is styled uppercase via CSS `text-transform`, **not** typed in capitals. Some screen readers spell out typed all-caps text letter by letter. The middot separator is `·` (U+00B7) with surrounding spaces; it announces as a pause rather than a word.

## 10. Performance Considerations

**This section owns the page's LCP.** Everything here is critical path.

| Item | Specification |
|---|---|
| LCP candidate | Either the H1 or the portrait, depending on viewport. **Both are optimised as if they were the LCP.** |
| Portrait loading | `fetchpriority="high"`, **`loading="eager"`** — never lazy. `decoding="sync"`. |
| Portrait preload | `<link rel="preload" as="image" imagesrcset="…" imagesizes="…">` in `<head>` |
| Portrait formats | AVIF → WebP → JPEG via `<picture>`. Widths 480 / 768 / 1200 / 1600 / 2400. |
| Portrait budget | ≤ 90KB for the served variant at 1440px |
| Explicit dimensions | `width` and `height` attributes on every `<img>`, plus CSS `aspect-ratio`. **Primary CLS control.** |
| Font preload | Cormorant Garamond 600 and Inter variable — both appear in the hero, both preloaded, both metric-matched (Phase 1 §8.4) so the swap produces **zero shift**. |
| Critical CSS | Hero styles are the bulk of the ~9KB inlined critical CSS. |
| JS on critical path | **None.** The entrance sequence runs after `DOMContentLoaded` and cannot delay LCP. Content is visible before JS executes. |
| Parallax cost | `transform` only; rAF loop gated by `IntersectionObserver` and destroyed when the hero exits. Disabled below 1200px, where it would cost most and return least. |
| Mask/feather cost | `mask-image` with a linear gradient is GPU-composited. Verify on a mid-range Android device — if it forces a software path, fall back to a pre-baked alpha channel in the AVIF/WebP source. |
| Radial field | A CSS `radial-gradient`, not an image. Zero bytes, zero requests. |

> **Blocked on Phase 1 Risk R1.** The largest supplied portrait is 400 × 400px; this specification requires ≥2400px. The layout is engineered so that a higher-resolution file is a drop-in replacement with no CSS change, but **the hero cannot be built to this specification until professional photography is delivered.**

---

<!-- ============================================================ -->

# S05 — Trust Strip

## 1. Purpose

Three verified facts, placed exactly where a visitor's eye lands after finishing the hero. The research found the firm's prestige signals are "thin" and that trust must come from "clarity, licensure, education, reviews, and local credibility" rather than manufactured legacy. This strip is that principle compressed into one line.

**Business goal:** convert the hero's emotional impression into concrete, checkable credibility before the visitor scrolls into the darker, more considered part of the page.

**Emotional response:** *quiet confirmation*. Not a badge row, not trust seals, not "25 years of experience." Three plain statements a visitor can verify.

## 2. Desktop Layout (≥1200px)

```
├─────────────────────── 1px --borderSubtle ────────────────────────┤
│                                                                   │
│  ⚖ LICENSED IN OHIO &   ▣ DOWNTOWN PORTSMOUTH  ◷ FREE INITIAL     │
│    KENTUCKY               OFFICE                 CONSULTATION     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
   │←── cols 1–4 ──→│   │←── cols 5–8 ──→│   │←── cols 9–12 ──→│
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Top border | 1px `--borderSubtle` `rgba(11,11,13,0.10)`, full container width |
| Padding-block | `--space8` (48px) top and bottom |
| Grid | 3 equal columns — `repeat(3, 1fr)`, gap `--space9` (64px) |
| Item layout | Icon + label, horizontal, `align-items: start`, gap `--space3` (12px) |
| Icon size | 20 × 20px |
| Label | Two lines maximum |
| Total height | ~114px |

**Relationship to the hero.** This strip is not a separate band with its own background — it shares the hero's `light` scene and sits directly against it, separated only by a hairline. The hero portrait's feather overlaps this rule by ~24px, so the portrait appears to dissolve *through* the divider. That overlap is what makes the two sections read as one environment rather than two stacked blocks.

## 3. Tablet Layout (768–1023px)

Unchanged in structure — three columns survive comfortably at 706px (235px each).

| Change | Specification |
|---|---|
| Grid gap | `--space6` (32px) |
| Padding-block | `--space7` (40px) |
| Column width | ~214px |
| Label | Two to three lines; `--fontCaption` at 12px |

## 4. Mobile Layout (< 768px)

**Intentional decision — the strip becomes a checklist, not three cramped columns.** Three items across a 335px container yields ~96px each, which forces four-line labels at 11px. That is worse than useless. Instead the strip rotates 90° into a vertical list, which reads as *verification* — a form of content mobile users already understand.

```
├──────────────────────────────┤
│  ⚖  Licensed in Ohio &       │
│     Kentucky                 │
├──────────────────────────────┤   ← 1px --borderSubtle between rows
│  ▣  Downtown Portsmouth      │
│     office                   │
├──────────────────────────────┤
│  ◷  Free initial             │
│     consultation             │
└──────────────────────────────┘
```

| Change | Specification |
|---|---|
| Layout | Vertical stack, one item per row |
| Row separator | 1px `--borderSubtle` between rows (not above the first or below the last) |
| Row padding-block | `--space4` (16px) |
| Typography | **`--fontBodySm` 15px, sentence case** — not uppercase. At mobile sizes, tracked uppercase micro-type is a legibility cost with no aesthetic return. |
| Icon | 18 × 18px, `--space3` (12px) gap |
| Section padding-block | `--space7` (40px) top, `--space8` (48px) bottom |

## 5. Component Inventory

- `trustStrip` (organism)
- `trustItem` (molecule)
- `iconScale`, `iconBuilding`, `iconClock` — from `iconSprite.svg`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Align |
|---|---|---|---|---|---|---|---|---|---|---|
| Item label | `<p>` | Inter | `--fontCaption` | 13px | 12px | **15px** *(`--fontBodySm`)* | 500 | 0.14em uppercase → **0 sentence case at <768** | 1.40 → 1.50 | left |

**Measure:** ~26ch desktop, ~30ch mobile.
**Spacing:** icon → label 12px. Between items: 64px horizontal (desktop), 32px vertical + rule (mobile).

The deliberate typographic switch at 768px — from tracked uppercase caption to sentence-case body — is one of the clearest examples in this document of *not* simply stacking. The content is identical; the treatment is chosen for the context.

## 7. Color Usage

Scene: **`light`**.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | `--surfaceBase` | `#FAF8F5` | — |
| Top border | `--borderSubtle` | `rgba(11,11,13,0.10)` | — |
| Icon | **`--accentStroke`** | **`#A98445`** (full opacity) | 3.26:1 — decorative, `aria-hidden`. Gold @70% measured **1.79:1** and was effectively invisible; corrected per I.11. |
| Label | `--textSecondary` | `#3A3B40` | 10.32:1 ✅ |
| Mobile row rules | `--borderSubtle` | `rgba(11,11,13,0.10)` | — |

**Gold audit:** three 20 × 20px icons = 1,200px². Approximately 0.008% of the viewport. The icons are decorative reinforcement — each label is fully meaningful without its icon, satisfying WCAG 1.4.1.

**No badges, no seals, no coloured pills.** The research explicitly warns against "billboard-lawyer" presentation. Three hairline-separated statements in the body colour is the correct register.

## 8. Motion

| Event | Property | Duration | Easing |
|---|---|---|---|
| Entrance | Standard reveal (I.4), **60ms stagger across the three items** | 560ms | `--easeOut` |
| Hover | **None.** These are not interactive. | — | — |

The strip has no hover state because it contains no links. If a future revision links these items (e.g. "Downtown Portsmouth office" → `/contact/`), a hover treatment must be added at that time — but at launch they are statements, not controls, and must not appear clickable.

**Reduced motion:** items present at full opacity, no transform, no stagger.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Semantics | `<ul>` with three `<li>` — screen readers announce "list, 3 items" |
| Heading | None. This strip has no heading and needs none; it is a continuation of the hero's region. |
| Icons | Inline `<svg aria-hidden="true" focusable="false">`. Every label is complete without its icon. |
| Focus | No focusable content. The strip is skipped in the tab order, correctly. |
| Contrast | 10.32:1 — the highest-contrast small text on the page, deliberately, because it carries verification claims |
| Touch targets | Not applicable — no interactive elements |
| Reduced motion | See §8 |
| Text spacing | No fixed heights. Rows grow with content. |

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** All three icons are `<use>` references into the inlined `iconSprite.svg`. Zero additional requests. |
| Position | Directly below the fold at most viewports — **excluded** from critical CSS, but visible within one scroll increment, so it must not depend on a slow-loading resource. |
| CLS | Fixed by content; no images to shift. The 1px border adds no measurable layout cost. |
| Rendering | `content-visibility: auto` with `contain-intrinsic-size: 0 114px` is **not** applied here — the section is too close to the fold and the intrinsic-size guess would risk a shift. Apply it from S06 onward. |
| Font | Inter only, already loaded for the hero. No new font weight is introduced. |

> **`[GATED — Q4]`** The third item, "Free initial consultation," asserts a fee model that has not been confirmed. If consultations are not free, this item must be replaced — recommended alternative: "Direct access to your attorney," which is verified-safe and reinforces the responsiveness theme. **Do not ship the free-consultation claim without written confirmation.**

---

<!-- ============================================================ -->

# S06 — Positioning Statement

## 1. Purpose

This is the page's pivot. Everything above it is introduction; everything below it is substance. It is also the section that physically carries the visitor from daylight into the darker, more focused environment — Scene 1 becomes Scene 2 inside this section's scroll range.

**Business goal:** establish the firm's human positioning in a single sentence, and directly neutralise the most damaging finding in the research — a public review describing communication as "nearly nonexistent." The supporting paragraph is where the site promises the opposite.

**Emotional response:** *being understood*. This is the only moment on the page that speaks to how the visitor feels rather than what the firm does. It should land like someone lowering their voice.

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   ↕ 200px  (--space14)                                         │
│                                                                │
│                        THE PRACTICE                            │
│                        ↕ 40px                                  │
│                                                                │
│                       Most people                              │
│                       who call me                              │
│                     are having the                             │
│                      hardest week                              │
│                      of their life.                            │
│                                                                │
│                        ↕ 56px                                  │
│                                                                │
│           You don't need to understand the law.                │
│          You need someone who does, who answers                │
│         the phone, and who tells you the truth                 │
│                 about where you stand.                         │
│                                                                │
│   ↕ 200px  (--space14)                                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
        │←────────── centred, max 480px ──────────→│
                  scene transition occurs across this range
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px, content centred within it |
| Statement max-width | **480px** — deliberately narrow |
| Paragraph max-width | 520px (~52ch) |
| Alignment | **Centred** — the only centred section above the FAQ |
| Padding-block | `--space14` (**200px**) top and bottom |
| Eyebrow → statement | `--space7` (40px) |
| Statement → paragraph | `--space9` (**64px** — corrected from 56px, which is not a token) |
| Total height | ~912px |

**Why 480px wide at 67px type.** The statement is monumental through *line-stacking*, not through raw size. Five short lines in a narrow column create a vertical column of text that reads as deliberate and slow. A wider measure at the same size would produce two or three long lines and lose the effect entirely. The narrowness is the design.

**Why centred.** Every other section on this page is left-aligned to the vertical spine. Centring this one — and only this one plus the FAQ — makes it read as an interruption in the page's rhythm. That interruption is what marks it as the pivot.

**Whitespace philosophy.** 400px of combined vertical padding around ~440px of content. This section is more than half empty by area and it is the single most expensive use of space on the page. It is also the one the brief most directly asks for: *"Huge breathing room."*

### The statement — art-directed line breaks

```
Most people          ← 11
who call me          ← 11
are having the       ← 14
hardest week         ← 12
of their life.       ← 14
```

Five `<span class="statementLine">` elements. Longest line ≈ 14 × 0.44 × 67px ≈ 413px, inside the 480px column. **Line breaks are explicit and must not be left to automatic wrapping.**

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Statement size | **46px** (`--fontDisplayLg` @768 — corrected from 48px in Rev 1.1) |
| Statement max-width | 360px |
| Paragraph max-width | 460px |
| Line breaks | **Same five lines**, preserved |
| Padding-block | `--space12` (128px) top and bottom |
| Alignment | Centred, unchanged |
| Eyebrow → statement | `--space6` (32px) |
| Statement → paragraph | `--space8` (48px) |

## 4. Mobile Layout (< 768px)

**Intentional decision — the statement stays large and keeps all five lines.** The temptation on mobile is to reduce this to 24px and let it wrap into a paragraph. That would delete the section's entire reason for existing. Phase 0 §5 is explicit: *"Still large and impactful. Do not shrink headings excessively."*

| Change | Specification |
|---|---|
| Statement size | **34px** (`--fontDisplayLg` @375) |
| Statement max-width | 280px |
| Line breaks | **Same five lines.** At 34px, "are having the" ≈ 210px — comfortably inside 280px. |
| Statement block height | 5 × 36px = 180px |
| Alignment | **Centred**, unchanged — this is the one place where centred type survives the drop to mobile because the lines are short by design |
| Paragraph | `--fontBody` 17px, max 34ch, **left-aligned** — centred body copy at four-plus lines is a readability cost |
| Padding-block | `--space11` (96px) top and bottom |
| Eyebrow → statement | `--space5` (24px) |
| Statement → paragraph | `--space7` (40px) |

The mixed alignment — centred statement over left-aligned paragraph — is deliberate. The statement is a display object; the paragraph is something to be read.

## 5. Component Inventory

- `positioningSection` (organism)
- `statementBlock` (organism)
- `statementLine`
- `eyebrow`
- `sceneBackdrop` — this section is one of only two `data-scene-trigger` owners

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | centre |
| Statement | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | **67px** | 48px | 34px | 600 | −0.02em | 1.06 | 14ch | centre |
| Paragraph | `<p>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 400 | 0 | 1.60 | 52ch | centre → **left <768** |

**Hierarchy note.** The statement is an `<h2>` rendered at `--fontDisplayLg` (67px), not at `--fontDisplayXl`. The hero H1 at 104px remains unambiguously dominant. Elevating this statement to display-XL size would flatten the page's heading hierarchy for a purely emotional gain — the narrow measure and the surrounding air achieve the same weight without breaking the type system.

## 7. Color Usage

**This section changes scene mid-scroll.** Both states are specified.

| Element | Scene `light` (entry) | Scene `dusk` (exit) |
|---|---|---|
| Background | `--surfaceBase` `#FAF8F5` | `--surfaceBase` `#18181B` |
| Eyebrow | `--textMuted` `#6A6C72` (4.74:1) | `--textMuted` `#8A8C93` (5.19:1) |
| Statement | `--textPrimary` `#0B0B0D` (17.85:1) | `--textPrimary` `#F6F5F3` (17.85:1) |
| Paragraph | `--textSecondary` `#3A3B40` (10.32:1) | `--textSecondary` `#D2D3D6` (11.84:1) |

**No gold appears in this section at all.** It is the only content section on the page with zero accent usage. The restraint is intentional — this is the quietest moment in the experience.

### Mid-transition contrast guarantee

The single real risk in a scroll-driven colour inversion is an intermediate frame where text and background are both mid-tone and contrast collapses. This is designed out:

1. Foreground and background transition on **the same duration** (`--durationScene` 900ms) and **the same easing** (`--easeScene`, a symmetrical curve).
2. Because both endpoints are high-contrast pairs and both channels move in lockstep along a symmetrical curve, the ratio is **monotonic across the transition** — it dips at the midpoint but never below the AA threshold for the 67px display text.
3. The paragraph, being the smallest text in the section, is the binding constraint. **This must be verified empirically during implementation** by sampling computed colours at 10% increments through the transition and confirming ≥4.5:1 at every sample.

This verification is an explicit item on the Phase 2 Approval Checklist.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Eyebrow | `opacity`, `translateY(12px → 0)` | 0ms | 560ms | `--easeOut` |
| Reveal | Statement line 1 | `opacity`, `translateY(16px → 0)` | 80ms | 560ms | `--easeOut` |
| Reveal | Statement line 2 | ″ | 160ms | 560ms | `--easeOut` |
| Reveal | Statement line 3 | ″ | 240ms | 560ms | `--easeOut` |
| Reveal | Statement line 4 | ″ | 320ms | 560ms | `--easeOut` |
| Reveal | Statement line 5 | ″ | 400ms | 560ms | `--easeOut` |
| Reveal | Paragraph | `opacity`, `translateY(12px → 0)` | 520ms | 560ms | `--easeOut` |
| **Scene** | `.sceneLayer` | `opacity` crossfade | — | **900ms** | `--easeScene` |
| Scene | All text | `color` | — | **900ms** | `--easeScene` |

**This section and the hero are the only two places on the page where a text block staggers line by line.** They bookend the light scene — the hero opens it, the statement closes it. Nothing else on the page uses this treatment, which is what preserves its impact.

**Scene trigger:** `data-scene-trigger="dusk"` on this section. Fires when the section's midpoint crosses the viewport's midpoint (`rootMargin: -45% 0px -45% 0px`). The 200px padding on both sides guarantees the 900ms crossfade completes well inside the section's own scroll range.

**Reduced motion:** all reveals removed; content at rest. **The scene still changes**, but the crossfade duration drops to **200ms**, not 1ms.

> *(Rev 1.1: the first draft specified 1ms. That is wrong here. A 1ms snap between `#FAF8F5` and `#18181B` is a near-full-viewport luminance inversion; a user scrolling quickly back and forth across the trigger point would produce a repeated hard flash — the precise sensory event `prefers-reduced-motion` exists to prevent, and an avoidable brush with WCAG 2.3.1. 200ms is below the threshold at which the change reads as "animation" but above the threshold at which it reads as a strobe.)*

The same 200ms floor applies to the dusk → dark transition in S09.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>`. Follows the hero `<h1>` with no skipped level. |
| Line spans | Five `<span class="statementLine">` inside the `<h2>`, `display: block`. Screen readers announce one continuous heading — verify no spurious pauses in NVDA and VoiceOver. |
| Focus | No focusable content in this section |
| Contrast | Endpoints verified in §7. **Mid-transition contrast requires empirical verification** — see §7 and the Approval Checklist. |
| Reduced motion | Scene change is instant; reveals removed. See §8. |
| Touch targets | Not applicable |
| Text spacing | No fixed heights. At SC 1.4.12 spacing values the five-line statement grows to ~520px; the section's padding absorbs it with no clipping. |
| Zoom | At 400% the statement renders at 34px in a ~280px column — the mobile treatment. No horizontal scroll. |

**Screen-reader experience of the scene change.** Because the transition is purely visual and involves no DOM change, content reordering, or `aria-live` announcement, a screen-reader user experiences no disruption. This is correct — the cinematic system is an enhancement for sighted users and must remain invisible to assistive technology.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** This section is pure type. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 912px` — the first section on the page to use it. The intrinsic size is measured, not guessed. |
| Scene crossfade cost | `opacity` on three stacked `.sceneLayer` elements in a `position: fixed` backdrop — **compositor-only**, no repaint of page content. See Phase 1 §2.5. |
| Text colour transition | `color` transitions on text **do** repaint. This section contains ~60 words, so the repaint area is small. This is why the scene transitions are assigned to the two most type-sparse sections on the page. |
| `will-change` | Applied to `.sceneLayer` permanently (three small fixed elements) — acceptable and necessary. **Not** applied to text. |
| Layer promotion risk | Verify on a mid-range Android device that the fixed backdrop does not force the whole page onto a software paint path. Phase 1 Risk R9. |
| Font | Cormorant Garamond 600 — already loaded for the hero. No new weight. |
| CLS | Zero. No images, no late-loading content, no fixed heights. |

> **`[GATED — Q13, Q14]`** The statement is written in the first person singular ("who call me"). This depends on Q14 (is there staff beyond the attorney?) — if the firm presents as "we," the entire page's voice changes and this line becomes "who call us," which is materially weaker. It also anticipates Q13 (personal origin story). **The voice decision must be made before copy is finalised, and it affects every section.**

<!-- ============================================================ -->

# S07 — Attorney Introduction

## 1. Purpose

The research is emphatic that this is an attorney-centred brand with thin institutional prestige: no verified awards, no memberships, no peer endorsements, relatively recent licensure. The correct response is not to manufacture prestige — it is to make the verified facts unmissable and let the person carry the credibility.

**Business goal:** convert curiosity into trust using only checkable facts, and route interested visitors to the full biography.

**Emotional response:** *this is a real person, in a real office, with real credentials.* The section should feel like being introduced to someone, not reading a CV.

## 2. Desktop Layout (≥1200px)

Deliberately **mirrored** from the hero — image left, content right. The hero put the portrait on the right; this section puts it on the left. That alternation is the page's structural rhythm.

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 162px                                                              │
│                                                                        │
│  ┌────────────────────┐        THE ATTORNEY                            │
│  │░░░░░░░░░░░░░░░░░░░░│        ↕ 24px                                  │
│  │░░░░░░░░░░░░░░░░░░░░│                                                │
│  │░░ Austin at desk ░░│        Austin G. Ervin                         │
│  │░░  environmental ░░│        ↕ 32px                                  │
│  │░░░░ portrait ░░░░░░│        Licensed in Ohio and Kentucky, with     │
│  │░░░░░░░░░░░░░░░░░░░░│        an office on Chillicothe Street in      │
│  │░░░░░░░░░░░░░░░░░░░░│        downtown Portsmouth.                    │
│  │░░░░░░░░░░░░░░░░░░░░│        ↕ 48px                                  │
│  │░░░░░░░░░░░░░░░░░░░░│        ──────────────────────────────          │
│  │░░░░░░░░░░░░░░░░░░░░│        OHIO BAR                                │
│  │░░░░░░░░░░░░░░░░░░░░│        Admitted 2022                           │
│  │░░░░░░░░░░░░░░░░░░░░│        ──────────────────────────────          │
│  └────────────────────┘        KENTUCKY BAR                            │
│    cols 1–5 · 498px            Admitted 2023                           │
│                                ──────────────────────────────          │
│                                JURIS DOCTOR                            │
│                                University of Dayton School of Law, 2022│
│                                ──────────────────────────────          │
│                                OFFICE                                  │
│                                602 Chillicothe Street, Suite 206       │
│                                ↕ 40px                                  │
│                                Read the full biography →               │
│   ↕ 162px                                                              │
└────────────────────────────────────────────────────────────────────────┘
                                │←──── cols 7–12 · 604px ────→│
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Grid | 12 columns, 32px gap |
| Image column | Cols 1–5 = **498px** |
| Content column | Cols 7–12 = **604px** |
| Empty column | Col 6 is left empty — a 74px gutter of pure air between image and text |
| Image aspect | 4:5 → 498 × 622px |
| Vertical alignment | Both columns `align-self: center` |
| Padding-block | `--sectionPaddingBlock` = 162px |
| Total height | ~946px |

**Column 6 is intentionally empty.** A 32px grid gap between a photograph and a text block is not enough separation at this scale; the eye reads them as one object. Sacrificing a full column produces a 106px channel that lets both sides breathe. This is the kind of decision that must be specified rather than left to an engineer's judgement — the instinct will be to close the gap.

### The credential list

Four rows. Each is a verified fact from `deep-research-report.md`.

| Row | Label (caption) | Value (bodyLg) | Verification |
|---|---|---|---|
| 1 | OHIO BAR | Admitted 2022 | ✅ Avvo, Martindale |
| 2 | KENTUCKY BAR | Admitted 2023 | ✅ Avvo, Martindale |
| 3 | JURIS DOCTOR | University of Dayton School of Law, 2022 | ✅ Avvo, LinkedIn |
| 4 | OFFICE | 602 Chillicothe Street, Suite 206, Portsmouth | ✅ Avvo, Martindale, Facebook, Scioto County directory |

| Property | Value |
|---|---|
| Structure | `<dl>` — definition list; label is `<dt>`, value is `<dd>` |
| Row separator | 1px `--borderSubtle` **above** each row, including the first |
| Row padding-block | `--space4` (16px) |
| Label → value | `--space1` (4px) |
| Layout | Stacked (label above value), **not** two-column — two-column key/value tables read as a data table, not a credential |

**Undergraduate education is deliberately absent.** The research verified it only partially (Shawnee State 2020 baccalaureate, major inferred but not confirmed) and explicitly warns it "should be confirmed directly with the attorney before it is put on a live website." It is `[GATED — Q6]` and may be added as a fifth row once confirmed.

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Grid | 8 columns. Image cols 1–4 (337px), content cols 5–8 (337px). |
| Empty column | **Removed** — at 706px there is no width to spare. Gap reverts to `--space6` (32px). |
| Image | 337 × 421px (4:5) |
| Heading | 48px (`--fontDisplayLg` @768) |
| Credential list | Unchanged structure; value text wraps to two lines for row 3 |
| Padding-block | 101px |
| Alignment | Both columns `align-self: start` — at this narrower ratio, top-aligning reads better than centring |

## 4. Mobile Layout (< 768px)

**Intentional decision — the image goes full-bleed and the credentials become the section's spine.**

```
├──────────────────────────────┤
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░ Austin at desk ░░░░░░░░│  ← full-bleed, 100vw × 420px
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     escapes the container gutter
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├──────────────────────────────┤
│   ↕ 40px                     │
│   THE ATTORNEY               │
│   ↕ 16px                     │
│   Austin G. Ervin            │  ← 34px
│   ↕ 24px                     │
│   Licensed in Ohio and       │
│   Kentucky, with an office   │
│   on Chillicothe Street in   │
│   downtown Portsmouth.       │
│   ↕ 40px                     │
│  ─────────────────────────   │
│   OHIO BAR                   │
│   Admitted 2022              │
│  ─────────────────────────   │
│   KENTUCKY BAR               │
│   Admitted 2023              │
│  ─────────────────────────   │
│   JURIS DOCTOR               │
│   University of Dayton       │
│   School of Law, 2022        │
│  ─────────────────────────   │
│   OFFICE                     │
│   602 Chillicothe Street,    │
│   Suite 206                  │
│   ↕ 32px                     │
│   Read the full biography →  │
└──────────────────────────────┘
```

| Change | Specification |
|---|---|
| Image | **Full-bleed**, `100vw` wide, 420px tall, 16:9-ish crop. Breaks the container gutter deliberately — the only full-bleed image on mobile besides the hero band. |
| Image order | First. Face before facts, consistent with the hero's mobile logic. |
| Image → content | `--space7` (40px) |
| Heading | 34px (`--fontDisplayLg` @375) |
| Credential rows | Unchanged — the hairline-separated list is already mobile-native and needs no adaptation. This is the one component in the section that survives unaltered. |
| Padding-block | 72px, but **0 top** — the image sits directly against the previous section |
| `linkArrow` | 48px minimum tap target, full-width tap area |

## 5. Component Inventory

- `attorneySection` (organism)
- `eyebrow`
- `credentialList` (molecule) + `credentialItem`
- `linkArrow`
- `portraitFrame` — variant `isEnvironmental`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Name | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | **67px** | 48px | 34px | 600 | −0.02em | 1.06 | 12ch | left |
| Intro paragraph | `<p>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 400 | 0 | 1.60 | 44ch | left |
| Credential label | `<dt>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Credential value | `<dd>` | Inter | `--fontBody` | 18px | 17px | 17px | 400 | 0 | 1.50 | 46ch | left |
| Link | `<a>` | Inter | `--fontBody` | 18px | 17px | 17px | 500 | 0.01em | 1.0 | — | left |

**The name is the heading.** "Austin G. Ervin" set at 67px in Cormorant is the section's H2. This is more effective than a descriptive heading like "About the Attorney" — the name *is* the brand, and setting it at display scale is the single strongest trust move available to a solo practice.

## 7. Color Usage

Scene: **`dusk`**.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | `--surfaceBase` | `#18181B` | — |
| Eyebrow | `--textMuted` | `#8A8C93` | 5.19:1 ✅ |
| Name | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Intro paragraph | `--textSecondary` | `#D2D3D6` | 11.84:1 ✅ |
| Credential label | `--textMuted` | `#8A8C93` | 5.19:1 ✅ |
| Credential value | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Row rules | `--borderSubtle` | `rgba(246,245,243,0.10)` | — |
| Link text | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Link arrow | `--accentPrimary` | `#C19E61` | 7.03:1 ✅ |
| Link underline (hover) | `--accentPrimary` | `#C19E61` | — |

**Gold audit:** one 14px arrow glyph plus a hover underline. Approximately 0.002% of the section. This is the most restrained gold usage on the page and it is correct — the credentials must carry no decoration whatsoever, because decoration on a credential reads as compensation.

**Photograph treatment:** the environmental portrait is graded to match the dusk scene — slightly reduced highlights so the image's white balance does not fight the `#18181B` field. No duotone, no colour overlay, no gold tint. The photograph stays a photograph.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Image | `opacity 0 → 1`, `scale(1.03 → 1)` | 0ms | 900ms | `--easeOut` |
| Reveal | Eyebrow | `opacity`, `translateY(16px → 0)` | 120ms | 560ms | `--easeOut` |
| Reveal | Name | ″ | 180ms | 560ms | `--easeOut` |
| Reveal | Paragraph | ″ | 240ms | 560ms | `--easeOut` |
| Reveal | Credential rows | ″, 60ms stagger, 4 items | 300ms | 560ms | `--easeOut` |
| Reveal | Link | ″ | 560ms | 560ms | `--easeOut` |
| Hover | Link arrow | `translateX(0 → 4px)` | — | 200ms | `--easeOut` |
| Hover | Link text | Underline `scaleX(0 → 1)` | — | 200ms | `--easeOut` |

**The image's `scale(1.03 → 1)` is the only scale animation on the page.** It gives the photograph a settling quality — as though it has just come to rest — without the visitor being able to name what happened. It is 3% over 900ms, which is below the threshold of conscious perception but above the threshold of felt quality. Do not increase it.

**No parallax in this section.** Parallax is reserved for the hero. Applying it here would make the page feel gimmicky rather than composed.

**Reduced motion:** all reveals removed, image at rest with no scale, hover transitions instant.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>` — "Austin G. Ervin". Correct level after the hero `<h1>` and the S06 `<h2>`. |
| Image alt | `alt="Austin G. Ervin at his desk in his Portsmouth, Ohio office"` — describes the scene, not the file |
| Credential semantics | `<dl>` / `<dt>` / `<dd>`. Screen readers announce these as term/definition pairs, which is precisely what a credential is. Do not use a `<table>` — this is not tabular data. |
| Focus | One focusable element: the biography link. Sits last in the section's DOM order, matching visual order. |
| Link text | "Read the full biography" — a complete, self-describing accessible name. **Never** "Read more" or "Learn more." |
| Arrow glyph | `aria-hidden="true"`, inside the link |
| Contrast | Minimum in this section is 5.19:1 (eyebrow and credential labels at 12–13px). All pass AA. |
| Touch targets | Link 48px minimum on mobile, full-width tap area |
| Reduced motion | See §8 |
| Text spacing | `<dl>` rows have no fixed height; long values wrap freely |

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Image | `loading="lazy"`, `decoding="async"`. Below the fold at every viewport. |
| Image formats | AVIF → WebP → JPEG. Widths 480 / 768 / 1200 / 1600. |
| Image budget | ≤ 110KB for the served variant at 1440px (498 × 622 @2x) |
| Explicit dimensions | `width="498" height="622"` plus CSS `aspect-ratio: 4/5`. Mobile variant `aspect-ratio: 16/10`. **Two different aspect ratios means two `<source>` entries with `media` conditions** — do not crop with `object-fit` alone at this size difference, it wastes bytes. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 946px` |
| CLS | Controlled by explicit dimensions on both aspect-ratio variants. The full-bleed mobile image is the highest CLS risk on the page — verify its reserved space at 375, 390, and 430px widths. |
| Font | No new families or weights. |
| DOM | ~20 elements. Negligible. |

> **`[GATED — Q7]`** If the attorney confirms professional memberships, federal court admissions, or certifications, they become additional `credentialItem` rows. The component is designed to scale to seven rows without layout change. Beyond seven, the list should split into two columns at ≥1200px.

---

<!-- ============================================================ -->

# S08 — Process Section

## 1. Purpose

**This is the most strategically important section on the homepage**, and it exists because of a single finding in the research: a publicly visible review describing this firm's communication as *"nearly nonexistent."* The research also identifies responsiveness as the strongest *positive* review theme. Those two facts define a precise opportunity — state plainly what happens after someone makes contact.

**Business goal:** remove the single largest hesitation in this market ("what happens next, and will anyone call me back?"), and neutralise the most damaging public criticism by making the opposite an explicit, on-record promise.

**Emotional response:** *predictability*. The visitor should finish this section knowing exactly what the next 48 hours look like. For someone whose life has just become unpredictable, that is the most valuable thing the page can offer.

**Phase 1 §2.2 stated this section is non-optional. That position is restated here without qualification.**

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 162px                                                              │
│                                                                        │
│   WHAT HAPPENS NEXT                                                    │
│   ↕ 24px                                                               │
│   After you reach out                                                  │
│   ↕ 80px                                                               │
│                                                                        │
│  ──────────────────  ──────────────────  ──────────────────            │
│                                                                        │
│  01                  02                  03                            │
│  ↕ 24px                                                                │
│  You call or         We talk about       You decide what               │
│  send a message      your situation      happens next                  │
│  ↕ 16px                                                                │
│  You reach me at     A straightforward   If I'm the right fit,         │
│  (740) 529-1420 or   conversation about  we start. If I'm not,         │
│  through the form    what you're facing, I'll tell you who is.         │
│  on this site.       your options, and                                 │
│                      what it will cost.                                │
│                                                                        │
│   ↕ 162px                                                              │
└────────────────────────────────────────────────────────────────────────┘
   │←─ cols 1–4 ─→│ 32 │←─ cols 5–8 ─→│ 32 │←─ cols 9–12 ─→│
        370px               370px               370px
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Grid | 3 equal columns — `repeat(3, 1fr)`, gap `--space6` (32px) |
| Column width | (1240 − 64) / 3 = **392px** |
| Heading block | Left-aligned, spans cols 1–6, max 12ch |
| Heading → steps | `--space10` (80px) |
| Step rule | 1px `--borderSubtle`, **full column width, above the numeral** |
| Rule → numeral | `--space5` (24px) |
| Numeral → step heading | `--space5` (24px) |
| Step heading → body | `--space4` (16px) |
| Padding-block | 162px |
| Total height | ~644px |

**The horizontal rules are the section's architecture.** Three 392px hairlines at the same y-coordinate create a strong horizontal datum that the numerals hang beneath. Without them the three columns float; with them the section reads as a designed table of contents. They are not decoration — remove them and the composition collapses.

**Numerals are set in Cormorant at display scale**, which is the only place on the page where the display face is used for something other than a heading. At 67px in gold they function as typographic ornament with semantic backing — the `<ol>` provides real sequence, so the numerals can be `aria-hidden` without information loss.

## 3. Tablet Layout (768–1023px)

**Intentional decision — the three-across grid is abandoned at tablet, not at mobile.**

At 706px, three columns yield 214px each. The step body at 17px would run to ~24 characters per line, producing five- and six-line paragraphs that destroy the section's clean rhythm. Rather than accept that, the layout switches to vertical earlier than most sections.

```
┌──────────────────────────────────────────┐
│   WHAT HAPPENS NEXT                      │
│   After you reach out                    │
│   ↕ 56px                                 │
│  ──────────────────────────────────────  │
│  01   You call or send a message         │
│       ↕ 12px                             │
│       You reach me at (740) 529-1420 or  │
│       through the form on this site.     │
│   ↕ 40px                                 │
│  ──────────────────────────────────────  │
│  02   We talk about your situation       │
│       ...                                │
└──────────────────────────────────────────┘
   └48┘ └────── content, 8-col width ─────┘
```

| Change | Specification |
|---|---|
| Layout | Vertical stack |
| Numeral | Moves **inline-left**, 48px column, baseline-aligned with the step heading |
| Numeral size | 40px (`--fontDisplayMd` @768 rounded up) |
| Rule | 1px, full container width, above each step |
| Step gap | `--space7` (40px) |
| Body measure | ~54ch — a substantial improvement over the 24ch a 3-across grid would force |
| Heading size | **46px** (`--fontDisplayLg` @768 — corrected from 48px in Rev 1.1) |
| Padding-block | 101px |

## 4. Mobile Layout (< 768px)

Same vertical structure as tablet, tightened.

| Change | Specification |
|---|---|
| Numeral | Inline-left, 40px column, 32px size |
| Numeral → content | `--space4` (16px) |
| Step gap | `--space6` (32px) |
| Rule | Full container width above each step |
| Step heading | `--fontHeadingSm` 20px, weight 600 |
| Body | `--fontBody` 17px, ~34ch |
| Heading size | 34px |
| Padding-block | 72px |
| Phone number in step 1 | Rendered as a live `tel:` link — **the only inline link inside body copy anywhere on this page** |

**Intentional mobile decision — step 1's phone number becomes tappable.** On desktop it is plain text, because a visitor with a mouse is not going to click a phone number in a paragraph. On mobile it is the single most useful inline element in the section. This is a real behavioural difference between contexts, not a stylistic variation.

## 5. Component Inventory

- `processSection` (organism)
- `eyebrow`
- `processStep` (molecule) — variants `isHorizontal` (≥1024px), `isStacked` (<1024px)
- `processNumeral` — decorative
- `linkPhone` — mobile only, inline

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Section heading | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | 67px | 48px | 34px | 600 | −0.02em | 1.06 | 12ch | left |
| Numeral | `<span>` | Cormorant Garamond | **`--fontProcessNumeral`** | **67px** | 40px | 32px | 500 | 0 | 1.0 | — | left |

> **Revision 1.1 — the numeral needs its own token.** The first draft cited `--fontDisplayLg` while tabulating 40px @768 and 32px @375. `--fontDisplayLg` actually computes to **46.2px @768** and **34px @375**, so the citation and the values disagreed — an engineer using the token would have got a numeral 15% larger than specified at tablet. The intent is real (the numeral should shrink faster than a heading, because at tablet and mobile it moves inline-left into a fixed 48px/40px column and must fit it), so the correct fix is a dedicated token, not a corrected citation:
>
> ```
> --fontProcessNumeral: clamp(2rem, 1.588rem + 1.757vw, 4.1875rem);
> ```
> Computes to **32px @375 · 41.5px @768 · 67px @1440**, matching the specified column widths at every tier.
| Step heading | **`<h3>`** | Inter | `--fontHeadingSm` | 23.5px | 21px | 20px | 600 | 0 | 1.25 | 22ch | left |
| Step body | `<p>` | Inter | `--fontBody` | 18px | 17px | 17px | 400 | 0 | 1.65 | 34ch → 54ch tablet | left |

**Numeral weight is 500, not 600.** The section heading and the numerals share a size at desktop; dropping the numerals a weight keeps the heading dominant and prevents the numbers from competing with the content they label.

## 7. Color Usage

Scene: **`dusk`**.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | `--surfaceBase` | `#18181B` | — |
| Eyebrow | `--textMuted` | `#8A8C93` | 5.19:1 ✅ |
| Section heading | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Step rule | `--borderSubtle` | `rgba(246,245,243,0.10)` | — |
| **Numeral** | `--accentPrimary` | `#C19E61` | 7.03:1 ✅ (decorative) |
| Step heading | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Step body | `--textSecondary` | `#D2D3D6` | 11.84:1 ✅ |
| Inline phone link (mobile) | `--textPrimary` + gold underline | `#F6F5F3` | 17.85:1 ✅ |

**Gold audit:** three numerals at approximately 45 × 67px each = 9,045px². In a 1240 × 644px section that is **1.1%** — the single largest gold usage on the page, and comfortably inside the 3% budget. The numerals are set at **full `--accentPrimary`, not a reduced opacity.** Fading them would be the obvious instinct; it would also make them look accidental. Gold at 7.03:1 on charcoal is a strong, confident value and the numerals should own it.

**No filled elements, no cards, no boxes.** The section is rules and type only. Boxing these three steps would make them look like pricing tiers.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Eyebrow | `opacity`, `translateY(16px → 0)` | 0ms | 560ms | `--easeOut` |
| Reveal | Heading | ″ | 60ms | 560ms | `--easeOut` |
| Reveal | Step rule 1 | `scaleX(0 → 1)`, origin left | 180ms | 700ms | `--easeOut` |
| Reveal | Step rule 2 | ″ | 240ms | 700ms | `--easeOut` |
| Reveal | Step rule 3 | ″ | 300ms | 700ms | `--easeOut` |
| Reveal | Step 1 content | `opacity`, `translateY(16px → 0)` | 300ms | 560ms | `--easeOut` |
| Reveal | Step 2 content | ″ | 360ms | 560ms | `--easeOut` |
| Reveal | Step 3 content | ″ | 420ms | 560ms | `--easeOut` |
| Hover | **None** | — | — | — | — |

**The rules draw before the content arrives.** Each 392px hairline scales in from its left edge over 700ms, and the step content fades up as the rule completes. The effect is of a structure being ruled out and then filled in — appropriate for a section about process. It is also the only place on the page where a line is animated.

`scaleX` on a 1px pseudo-element is compositor-only. **Never animate `width`.**

**No hover states.** Nothing in this section is interactive at desktop. The mobile phone link is the sole exception and uses the standard link underline treatment.

**Reduced motion:** rules present at full width, content at rest, no stagger.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>` for the section, `<h3>` for each step. No level skipped. |
| List semantics | **`<ol>`** — this is an ordered process and the order is meaningful. Screen readers announce "list, 3 items" and the position of each. |
| Numerals | `<span aria-hidden="true">`. The `<ol>` already conveys sequence; announcing "01" before "You call or send a message" would be redundant. |
| Focus | Zero focusable elements at ≥768px. One (the phone link) below 768px. |
| Phone link | `<a href="tel:+17405291420">` with the formatted number as visible text |
| Contrast | Minimum 5.19:1 (eyebrow). The gold numerals at 7.03:1 exceed AA even though, being decorative, they are not required to. |
| Touch targets | Mobile phone link: the inline link is given `display: inline-block` with vertical padding to reach a 44px tap height without disrupting the paragraph's line rhythm. |
| Reduced motion | See §8 |
| Text spacing | No fixed heights. At SC 1.4.12 values the three columns grow independently; the grid handles unequal column heights natively. |

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** Type and hairlines only. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 644px` |
| Animation cost | Six compositor-only animations (`opacity`, `transform`). No layout, no paint beyond the text. |
| CLS | Zero. No images, no late content. |
| Font | Cormorant 500 is introduced here for the numerals — it is the third and final font file, and it is **not** preloaded (this section is deep below the fold and the file will have loaded long before). |
| DOM | ~18 elements. |

> **`[GATED — Q5]`** Step 1's specimen copy does not currently promise a response time. An earlier draft read "If I can't answer, you'll hear back the same business day" — **that is an operational commitment and has been removed pending Q5** (actual office hours and after-hours intake process). A response-time promise is the single highest-value sentence available to this section, and it is strongly recommended once the attorney can commit to it. Do not reinstate it without written confirmation.
>
> **`[GATED — Q4]`** Step 2's "what it will cost" implies fee transparency at consultation. Confirm this matches the actual consultation model.

---

<!-- ============================================================ -->

# S09 — Reviews

## 1. Purpose

Social proof, handled honestly. The research is blunt about the constraint here: the accessible review corpus is limited and inconsistent across platforms (Google 4.8/46, Birdeye 4.7/48, Avvo 5.0/1, Martindale 1.0/1), and it warns explicitly that the site "should not try to overplay universal acclaim."

**Business goal:** provide third-party validation at the moment a comparing visitor needs it, without making claims that a skeptical reader could disprove in one search.

**Emotional response:** *corroboration*. Not excitement. Two or three real voices saying what the site has already promised, in words the firm did not write.

**This section also carries the dusk → dark transition** — the second and final scene change.

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 162px                                                              │
│                                                                        │
│   IN THEIR WORDS                          4.8 out of 5 · 46 Google     │
│                                           reviews →                    │
│   ↕ 72px                                                               │
│  ──────────────────  ──────────────────  ──────────────────            │
│   ↕ 32px                                                               │
│  "He treated us       "Responded in a     "Straightforward             │
│   like we were        timely manner       and knew exactly             │
│   part of his         and was prepared    what he was                  │
│   own family."        for trial."         doing."                      │
│                                                                        │
│   ↕ 32px                                                               │
│   — SARAH M.          — J. R.             — MICHAEL T.                 │
│   GOOGLE REVIEW       AVVO REVIEW         GOOGLE REVIEW                │
│                                                                        │
│   ↕ 162px                                                              │
└────────────────────────────────────────────────────────────────────────┘
   │←─ cols 1–4 ─→│ 32 │←─ cols 5–8 ─→│ 32 │←─ cols 9–12 ─→│
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Grid | 3 equal columns, gap `--space6` (32px), each 392px |
| Header row | Eyebrow left (cols 1–6), rating badge right (cols 9–12), baseline-aligned |
| Header → quotes | `--space9` (**64px** — corrected from 72px, which is not a token) |
| Quote rule | 1px `--borderSubtle`, full column width, above each quote |
| Rule → quote | `--space6` (32px) |
| Quote → attribution | `--space6` (32px) |
| Padding-block | 162px |
| Total height | ~704px |

**No cards.** Quotes sit on the section background beneath hairlines, exactly as the process steps do. This deliberately continues S08's architecture — the two sections read as a matched pair, which reinforces the connection between *what we promise* and *what clients say happened*.

**Two-quote fallback.** If only two permission-cleared quotes are available, the grid becomes two columns spanning cols 1–6 and 7–12 (604px each). The component must support both without a layout rewrite. **Do not pad to three with a weak quote.**

### The rating badge

| Property | Value |
|---|---|
| Content | "4.8 out of 5 · 46 Google reviews" |
| Source attribution | **Mandatory and explicit.** The platform is named in the badge text itself. |
| Link | Wraps to the Google Business Profile, `target="_blank" rel="noopener"` |
| Typography | `--fontBodySm` 16px, weight 500 |
| Star glyphs | **None.** Five gold stars would be the obvious choice and it is the wrong one — star rows are the visual language of e-commerce and review-farm widgets, and they undercut the register this page has established. The number, stated plainly, is more credible. |

## 3. Tablet Layout (768–1023px)

**Intentional decision — single column, not two-up.**

At 706px, a two-column layout gives each quote 337px. A 32px Cormorant quote in 337px runs to ~21 characters per line, producing six- and seven-line quotes with heavy rag. Quotes need measure more than they need adjacency.

| Change | Specification |
|---|---|
| Layout | Single column, full container width |
| Quote measure | ~44ch at 32px — a substantial improvement |
| Quote size | 32px (`--fontDisplayMd` @768) |
| Quote gap | `--space9` (64px) |
| Rule | 1px, full container width, above each quote |
| Header row | Eyebrow and rating badge stack; badge below eyebrow at `--space3` (12px) |
| Padding-block | 101px |
| Quote count | If three quotes exist, all three render. The section grows taller; that is acceptable. |

## 4. Mobile Layout (< 768px)

| Change | Specification |
|---|---|
| Layout | Single column |
| Quote size | **26px** (`--fontDisplayMd` @375) — quotes remain in the display face and remain large |
| Quote measure | ~26ch |
| Quote gap | `--space8` (48px) |
| Attribution | `--fontCaption` 12px, uppercase, tracked |
| Rating badge | Full-width row directly beneath the eyebrow, with the link arrow right-aligned |
| Padding-block | 72px |
| Quote count | **Two maximum on mobile.** If three exist, the third is `display: none` below 768px. |

**Intentional mobile decision — the third quote is suppressed.** Three long quotes on a phone is 500+ pixels of testimonial in a page that still has four sections to go. Two is sufficient corroboration; the third is available on the desktop experience and on `/about/`. This is a considered editing decision, not a technical limitation.

## 5. Component Inventory

- `reviewsSection` (organism)
- `eyebrow`
- `reviewCard` (molecule) — despite the name, renders as a rule-and-type block, not a boxed card
- `ratingBadge` (molecule)
- `linkArrow`
- `sceneBackdrop` — second and final `data-scene-trigger` owner

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Rating badge | `<a>` | Inter | `--fontBodySm` | 16px | 16px | 15px | 500 | 0.01em | 1.40 | — | right → left |
| **Quote** | `<blockquote>` | Cormorant Garamond | `--fontDisplayMd` | **38px** | **30.5px** | 26px | 500 | −0.01em | 1.20 | 22ch → 44ch tablet | left |

*(Tablet value corrected from 32px in Revision 1.1 — `--fontDisplayMd` computes to 30.5px at 768px, not 32px. The measure figures are unaffected.)*
| Attribution | `<cite>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |

**Quotes are set in Cormorant, not Inter.** This is the only body-adjacent content on the page set in the display face, and it is justified: a quotation is a voice, and the display face gives it presence. It is also short — 8 to 14 words — so Cormorant's readability limitations at length do not apply. The 26px mobile minimum stays above the 24px floor established in Phase 1 §8.1.

**Quotation marks are typed characters** (`"` U+201C / `"` U+201D), part of the quote text, not CSS pseudo-elements. Oversized decorative quote marks are explicitly excluded — they are a stock-template signature.

## 7. Color Usage

**This section changes scene mid-scroll: `dusk` → `dark`.**

| Element | Scene `dusk` (entry) | Scene `dark` (exit) | Contrast |
|---|---|---|---|
| Background | `#18181B` | `#0B0B0D` | — |
| Eyebrow | `--textMuted` `#8A8C93` | `--textMuted` `#8A8C93` | 5.19:1 → 5.76:1 ✅ |
| Rating badge | `--textSecondary` `#D2D3D6` | `--textSecondary` `#D2D3D6` | 11.84:1 → 13.14:1 ✅ |
| Badge arrow | `--accentPrimary` `#C19E61` | `--accentPrimary` `#C19E61` | 7.03:1 → 7.80:1 ✅ |
| Quote | `--textPrimary` `#F6F5F3` | `--textPrimary` `#F6F5F3` | 17.85:1 both ✅ |
| Attribution | `--textMuted` `#8A8C93` | `--textMuted` `#8A8C93` | 5.19:1 → 5.76:1 ✅ |
| Rules | `--borderSubtle` | `--borderSubtle` | — |

**This transition is safer than S06's.** Both endpoints share identical foreground tokens — only the background darkens from `#18181B` to `#0B0B0D`. Contrast *increases* monotonically through the transition rather than dipping. No empirical mid-transition verification is required here, unlike S06.

**Gold audit:** one 12px arrow glyph in the rating badge. Effectively zero.

**Scene trigger placement:** `data-scene-trigger="dark"` sits on this section. The 162px padding on each side ensures the 900ms crossfade completes inside the section.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Eyebrow | `opacity`, `translateY(16px → 0)` | 0ms | 560ms | `--easeOut` |
| Reveal | Rating badge | ″ | 60ms | 560ms | `--easeOut` |
| Reveal | Quote rules | `scaleX(0 → 1)`, origin left, 60ms stagger | 180ms | 700ms | `--easeOut` |
| Reveal | Quotes | `opacity`, `translateY(16px → 0)`, 80ms stagger | 300ms | **700ms** | `--easeOut` |
| Hover | Badge arrow | `translateX(0 → 4px)` | — | 200ms | `--easeOut` |
| **Scene** | `.sceneLayer` | `opacity` crossfade | — | 900ms | `--easeScene` |

**Quotes fade in over 700ms rather than the standard 560ms.** They are the slowest reveal on the page. Testimonials that snap into place feel like advertising; testimonials that arrive slowly feel like recollection. The 140ms difference is not consciously perceptible but it changes the section's temperature.

**Reduced motion:** all reveals removed; scene crossfade drops to 1ms.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | **This section has no visible heading.** It requires a `<h2 class="visuallyHidden">Client reviews</h2>` so the document outline remains complete and screen-reader users can navigate by heading. |
| Quote semantics | `<blockquote>` containing `<p>`, followed by `<figcaption>` with `<cite>`. Wrap the pair in `<figure>`. |
| Attribution | `<cite>` contains the reviewer identifier and platform. Note that `<cite>` conventionally marks a *work*, not a person — using it for the platform name ("Google Review") is the more correct reading, with the reviewer name as plain text. |
| Rating badge link | Accessible name: "4.8 out of 5 from 46 Google reviews — read reviews on Google". The visible text is shorter; use `aria-label` to supply the fuller name, ensuring the visible text is contained within it (SC 2.5.3 Label in Name). |
| External link | `target="_blank" rel="noopener noreferrer"` plus a visually hidden "(opens in a new tab)" |
| Focus | One focusable element: the rating badge |
| Contrast | Minimum 5.19:1 (attribution, 12–13px) |
| Touch targets | Badge link 44px minimum tap height on mobile |
| Reduced motion | See §8 |
| Hidden third quote | `display: none` removes it from the accessibility tree entirely on mobile — correct. Do not use `visibility: hidden` or opacity, which would leave it focusable or announced. |

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** No reviewer avatars, no platform logos, no star graphics. |
| Third-party widgets | **Prohibited.** No Google Reviews embed, no Birdeye widget, no Trustpilot script. Reviews are static, permission-cleared HTML. Phase 1 §14.6. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 704px` |
| Scene crossfade | Same compositor-only mechanism as S06. This section contains ~50 words, keeping the `color` repaint area small. |
| CLS | Zero. |
| Font | Cormorant 500 (shared with S08 numerals). No new file. |
| DOM | ~16 elements. |

> **`[GATED — Q8]` — this section cannot be built without client input.** Every quote requires documented written permission (Phase 1 Risk R7). Attribution is first name and last initial only.
>
> **`[GATED]` — the rating figure must be re-verified at build time and monitored after launch.** The research found 4.8/46 (Google, client-supplied) and 4.7/48 (Birdeye) on different dates. A stale rating on a live site is an advertising-accuracy problem under Ohio R. 7.1.
>
> **Empty-state requirement (Phase 1 Rec 20.6).** If Q8 returns no permission-cleared quotes, this section must not simply be deleted — that leaves a structural gap between the process section and the practice grid. The specified alternative is a **verification block**: the same three-column, rule-and-type architecture, populated with "Licensed in Ohio since 2022 / Licensed in Kentucky since 2023 / No disciplinary record" — each with its public source named. This must be designed and approved alongside the primary treatment, not improvised at build time.

<!-- ============================================================ -->

# S10 — Practice Areas

## 1. Purpose

**This is the homepage's primary conversion surface.** Every preceding section builds the credibility that makes a visitor willing to click here; every following section is reinforcement. The research identifies "clarity of fit" as the decisive competitive factor in this crowded market — a visitor scanning this grid should find the words for their exact problem within two seconds.

**Business goal:** route visitors into the correct practice-area page, which is where conversion actually happens. Secondary goal: demonstrate breadth without appearing unfocused.

**Emotional response:** *recognition, then relief.* "That's my situation, and he handles it."

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 162px                                                              │
│   PRACTICE AREAS                                                       │
│   ↕ 24px                                                               │
│   How I can help in southern Ohio        ← Rev 1.1, see S04 §6         │
│   ↕ 72px                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ ⚖            │  │ ⚑            │  │ ⌂            │                  │
│  │              │  │              │  │              │                  │
│  │ Criminal     │  │ OVI & DUI    │  │ Family Law   │                  │
│  │ Defense      │  │ Defense      │  │              │                  │
│  │              │  │              │  │              │                  │
│  │ Misdemeanor  │  │ Impaired     │  │ Divorce,     │                  │
│  │ and felony   │  │ driving      │  │ custody,     │                  │
│  │ charges.     │  │ charges.     │  │ support.     │                  │
│  │            → │  │            → │  │            → │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Protection   │  │ Estate       │  │ Probate      │                  │
│  │ Orders       │  │ Planning     │  │              │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│   ↕ 32px                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Not sure where you fit?  Call (740) 529-1420 or send a message → │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│   ↕ 162px                                                              │
└────────────────────────────────────────────────────────────────────────┘
   │← cols 1–4 →│ 32 │← cols 5–8 →│ 32 │← cols 9–12 →│
       392px             392px             392px
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Grid | `repeat(3, 1fr)`, gap `--space6` (32px) |
| Card width | **392px** |
| Card min-height | **260px** |
| Card padding | `--space6` (32px) |
| Rows | 2 rows × 3 cards = 6 practice cards |
| Triage tile | Full width (spans all 12 cols), `--space6` (32px) below the grid, 88px tall |
| Heading → grid | `--space10` (**80px** — corrected from `--space9` (72px), which is not a token) |
| Padding-block | 162px |
| Total height | ~1,100px |

### The six cards

| # | Practice area | Destination | Justification |
|---|---|---|---|
| 1 | Criminal Defense | `/practice-areas/criminal-defense/` | Core keyword cluster; highest urgency |
| 2 | OVI & DUI Defense | `/practice-areas/ovi-dui/` | Core cluster; the research's highest-opportunity SEO term |
| 3 | Family Law | `/practice-areas/family-law/` | Hub for divorce/custody/support |
| 4 | Protection Orders | `/practice-areas/protection-orders/` | Core cluster; highest urgency in the research |
| 5 | Estate Planning | `/practice-areas/estate-planning/` | Core cluster; strong older-demographic fit |
| 6 | Probate | `/practice-areas/probate/` | Core cluster; post-death action intent |

**Ordering is `[GATED — Q1]`.** The sequence above follows the research's core keyword-cluster priority, alternating urgency (criminal/family) with planning (estate/probate) so the grid reads as a balanced practice rather than a criminal-defense shop. If the attorney identifies different revenue priorities, the order changes — but the *count stays at six.* A seventh card creates an orphan row.

### Card anatomy

```
┌────────────────────────────┐
│ ⚖  ← 28px icon, gold       │
│    ↕ 32px                  │
│ Criminal Defense           │  ← h3, Inter 600, 23.5px
│    ↕ 12px                  │
│ Misdemeanor and felony     │  ← 16px, --textSecondary
│ charges in Scioto County   │     max 2 lines, ~30ch
│ and southern Ohio.         │
│    ↕ auto (pushes down)    │
│                          → │  ← 16px arrow, gold, bottom-right
└────────────────────────────┘
```

**This is the only section on the page that uses boxes**, and the exception is justified: a grid of discrete, comparable choices is exactly the case where a bounded container aids scanning. Everywhere else on this page, boxing content would be decoration; here it is function.

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Grid | `repeat(2, 1fr)`, gap `--space5` (24px) |
| Card width | (706 − 24) / 2 = **341px** |
| Card min-height | 220px |
| Card padding | `--space5` (24px) |
| Rows | 3 rows × 2 cards |
| Body copy | Retained, ~28ch |
| Triage tile | Full container width, 80px tall |
| Heading size | **46px** (`--fontDisplayLg` @768 — corrected from 48px in Rev 1.1) |
| Padding-block | 101px |

## 4. Mobile Layout (< 768px)

**Intentional decision — cards collapse into list rows, not narrow cards.**

Six full-width cards at 260px each is 1,560px of scrolling for what is fundamentally a menu. A stressed visitor on a phone needs to scan six options, not read six paragraphs. The cards therefore become compact rows.

```
├──────────────────────────────┤
│ ⚖  Criminal Defense       →  │  ← 76px tall
├──────────────────────────────┤
│ ⚑  OVI & DUI Defense      →  │
├──────────────────────────────┤
│ ⌂  Family Law             →  │
├──────────────────────────────┤
│ ⛨  Protection Orders      →  │
├──────────────────────────────┤
│ ✎  Estate Planning        →  │
├──────────────────────────────┤
│ ⚱  Probate                →  │
├──────────────────────────────┤
│                              │
│  Not sure where you fit?     │
│  Call (740) 529-1420  →      │
└──────────────────────────────┘
```

| Change | Specification |
|---|---|
| Layout | Vertical list, full container width |
| Row height | **76px** |
| Row structure | Icon (24px) · title · arrow, `align-items: center` |
| Icon → title gap | `--space4` (16px) |
| Borders | 1px `--borderSubtle` **between** rows only — no box outline, no fill |
| Body copy | `display: none` |
| Title | `--fontHeadingSm` 20px, weight 600 |
| Total height | 6 × 76 = 456px — versus 1,560px if the cards were preserved |
| Triage tile | Below the list, `--space6` (32px) gap, stacked text + link |
| Padding-block | 72px |

**On hiding the body copy.** Each row's accessible name is the practice-area title, which is complete and unambiguous ("Criminal Defense"). The suppressed sentence is supplementary detail, not information required to make the choice. The text remains in the DOM (it costs ~180 bytes total) and remains indexable. This is an acceptable and deliberate use of `display: none` — it is not hiding content from one audience while showing it to another.

## 5. Component Inventory

- `practiceSection` (organism)
- `practiceGrid` (organism)
- `practiceCard` (molecule) — variants `isRow` (<768px)
- `practiceCardTitle`, `practiceCardBody`, `practiceCardIcon`, `practiceCardArrow`
- `triageTile` (molecule)
- `eyebrow`
- `linkPhone`
- Icons from `iconSprite.svg`: `iconScale`, `iconVehicle`, `iconHome`, `iconShieldSmall`, `iconDocument`, `iconUrn`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Section heading | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | 67px | 48px | 34px | 600 | −0.02em | 1.06 | 12ch | left |
| Card title | **`<h3>`** | **Inter** | `--fontHeadingSm` | 23.5px | 21px | 20px | 600 | 0 | 1.25 | 16ch | left |
| Card body | `<p>` | Inter | `--fontBodySm` | 16px | 15px | — | 400 | 0 | 1.55 | 30ch | left |
| Triage text | `<p>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 400 | 0 | 1.50 | 46ch | left |

**Card titles are set in Inter, not Cormorant** — a deliberate departure from the page's pattern of setting headings in the display face. Practice-area names are functional wayfinding read under stress, and Inter at 600 scans measurably faster than a high-contrast serif at the same size. Premium here means *legible*, not *decorative*. This is the correct trade and it should not be "corrected" during implementation.

## 7. Color Usage

Scene: **`dark`**.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Section background | `--surfaceBase` | `#0B0B0D` | — |
| Card background | `--surfaceRaised` | `#18181B` | — |
| Card border | `--borderSubtle` | `rgba(246,245,243,0.10)` | — |
| Card border (hover) | `--accentPrimary` **@ 100%** | `#C19E61` | **7.03:1** vs card fill ✅ (at 50% it is 2.71:1 — corrected) |
| Card icon | `--accentPrimary` | `#C19E61` | 6.07:1 on `#18181B` ✅ |
| Card title | `--textPrimary` | `#F6F5F3` | 13.90:1 on `#18181B` ✅ |
| Card body | `--textSecondary` | `#D2D3D6` | 10.23:1 on `#18181B` ✅ |
| Card arrow | `--accentPrimary` | `#C19E61` | 6.07:1 ✅ |
| Triage tile background | `transparent`, 1px **`--borderInteractive`** | `rgba(246,245,243,0.44)` | **4.09:1 ✅** (Rev 1.1 — the tile is a control; its border is its only boundary) |
| Mobile row rules | `--borderSubtle` | — | — |

**Gold audit — the page's densest gold usage:** six 28px icons (4,704px²) + six 16px arrows (1,536px²) + one triage arrow ≈ **6,400px²** in a 1240 × 1,100px section = **0.47%**. Adding the hover border of a single card at any moment adds ~0.06%. Total stays under 0.6%, well inside the 3% budget.

**Cards use `--surfaceRaised` (`#18181B`) on a `--surfaceBase` (`#0B0B0D`) section.** The value difference is subtle by design — the cards should feel lifted, not stamped. Combined with the 1px border this is sufficient separation without shadows.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Eyebrow | `opacity`, `translateY(16px → 0)` | 0ms | 560ms | `--easeOut` |
| Reveal | Heading | ″ | 60ms | 560ms | `--easeOut` |
| Reveal | Cards 1–6 | ″, **60ms stagger, capped at 6** | 180ms | 560ms | `--easeOut` |
| Reveal | Triage tile | ″ | 540ms | 560ms | `--easeOut` |
| Hover | Card | `translateY(0 → −2px)` | — | 200ms | `--easeOut` |
| Hover | Card border | `border-color` → `--accentPrimary` (full) | — | 200ms | `--easeOut` |
| Hover | Card arrow | `translateX(0 → 4px)` | — | 200ms | `--easeOut` |
| Focus-within | Card | Focus ring on the card, not the text | — | none | — |

**The six-card stagger is exactly at the cap** established in I.4 — 6 × 60ms = 360ms total chain. A seventh card would exceed it and the last card would appear to lag. This is a second, independent reason the grid holds at six.

**Hover lift is 2px, not 4px or 8px.** At 4px the cards bounce; at 2px they acknowledge. Combined with the border colour change and the arrow travel, three simultaneous 200ms changes produce a clearly-felt but quiet response.

**Reduced motion:** reveals removed. Hover retains the border colour change and arrow travel (both non-motion-sensitive) but drops the `translateY` lift.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>` section, `<h3>` per card |
| List semantics | `<ul>` of `<li>`, each containing one card. Announces "list, 6 items". |
| **Whole-card click** | Implemented with a **stretched link**: the `<a>` wraps only the card title, and a `::after` pseudo-element with `position: absolute; inset: 0` extends its hit area over the card. The card itself is **not** an `<a>` and contains no nested interactive elements. This yields one link with one accessible name — "Criminal Defense" — and no nested-link trap. **The card must carry `position: relative`** so the pseudo-element resolves against it. *(Rev 1.1: the first draft relied on `contain: layout` implicitly establishing a containing block. It does, but depending on that is fragile — if containment is ever removed for debugging, every card's hit area silently expands to the viewport. Declare `position: relative` explicitly.)* |
| Overflow | The card must **not** use `overflow: hidden`, and its containment must be `contain: layout style` — **never** `contain: paint`. Either would clip the `outline-offset: 2px` focus ring. |
| Card focus | The link receives focus; the card is styled with `:focus-within` so the visible focus ring surrounds the **card**, not the title text. `outline-offset: 2px` on the card. |
| Icons | `<svg aria-hidden="true" focusable="false">`. Each card's title is fully meaningful without its icon. |
| Arrows | `aria-hidden="true"` |
| Focus order | Cards in DOM order (left-to-right, top-to-bottom), then the triage tile. Matches visual order at every breakpoint — the mobile list uses the same DOM order. |
| Contrast | Minimum 6.07:1 (icons/arrows on card fill). Hover border 3.9:1 against the card, meeting SC 1.4.11. |
| **Hover state is not the only affordance** | The arrow glyph is present at rest, so the card's interactivity is evident without hovering (SC 1.4.13 does not strictly apply, but the principle does). |
| Touch targets | Desktop cards 392 × 260px. Mobile rows 76px tall × full width — far above the 24px SC 2.5.8 minimum and above the 44px comfort threshold. |
| Reduced motion | See §8 |
| Text spacing | Cards use `min-height`, never `height`. At SC 1.4.12 values, cards grow and the grid rows equalise naturally. |

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** Six icons are `<use>` references into the already-inlined `iconSprite.svg` — zero requests. |
| Icon sprite | Must be inlined in the document (not an external file) because these icons appear on every page and an external sprite costs a request plus a potential flash of missing icons. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 1100px` |
| Card containment | `contain: layout style` on each card — prevents a hover state from invalidating layout beyond the card |
| Animation cost | Hover animates `transform` and `border-color`. `border-color` triggers paint on the card only (contained). Acceptable. |
| CLS | Zero. Cards use `min-height`; the grid is defined before content loads. |
| Font | No new families or weights. |
| DOM | ~60 elements — the heaviest section on the page, and still trivial. |
| Mobile body copy | Hidden via `display: none`, not removed. ~180 bytes total. Not worth conditional rendering. |

> **`[GATED — Q1]`** Card order and selection. The six above follow research-derived priority; the attorney's revenue priorities may reorder them.
>
> **`[GATED — Q2]`** Personal Injury is deliberately **absent** from the homepage grid. The research flags PI as the most competitive category in this market (Kisling, Nestico & Redick runs a dedicated Scioto County landing page) and warns against a thin PI presence. If Q2 confirms PI as a genuine growth focus, it replaces one of the six — most likely Probate — rather than becoming a seventh card.

---

<!-- ============================================================ -->

# S11 — Service Areas

## 1. Purpose

The research is unambiguous that this is "a practical multi-county search market rather than a Portsmouth-only market," and that local search intent here is county-driven. This section makes the firm's geography explicit and, secondarily, seeds the internal links that will support county landing pages in Tier 2/3.

**Business goal:** confirm jurisdictional fit for visitors outside Portsmouth (roughly half the addressable market), and surface the dual-state licensure that the research identifies as the firm's strongest verified differentiator.

**Emotional response:** *proximity*. "He practices where my case is." For a visitor in Ironton or Ashland, this is the section that decides whether they keep reading.

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 162px                                                              │
│                                                                        │
│  WHERE I PRACTICE                    ┌───────────────────────────────┐ │
│  ↕ 24px                              │  OHIO          KENTUCKY       │ │
│                                      │  ───────────   ───────────    │ │
│  Southern Ohio and                   │  Scioto        Greenup        │ │
│  northeastern                        │  County        County         │ │
│  Kentucky                            │                               │ │
│  ↕ 32px                              │  Adams         Boyd           │ │
│                                      │  County        County         │ │
│  Licensed in both states,            │                               │ │
│  with an office in downtown          │  Pike                         │ │
│  Portsmouth.                         │  County                       │ │
│  ↕ 40px                              │                               │ │
│  ┌───────────────────┐               │  Lawrence                     │ │
│  │   ╱‾‾╲   ╭──╮     │               │  County                       │ │
│  │  ╱ OH  ╲╱   │     │  ← line map   │                               │ │
│  │ │   ●    KY │     │    1px stroke └───────────────────────────────┘ │
│  │  ╲___╱ ╲___╱      │    Portsmouth ● in gold                         │
│  └───────────────────┘                                                 │
│   ↕ 162px                                                              │
└────────────────────────────────────────────────────────────────────────┘
   │←──── cols 1–5 · 498px ────→│  32  │←──── cols 7–12 · 604px ────→│
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Left column | Cols 1–5 = **498px** — eyebrow, heading, paragraph, line map |
| Right column | Cols 7–12 = **604px** — county lists |
| Empty column | Col 6, matching S07's channel treatment |
| County lists | Two sub-columns within the right column, `repeat(2, 1fr)`, gap `--space8` (48px) |
| State heading | `--fontCaption`, uppercase, with a 1px `--borderSubtle` rule beneath |
| County item spacing | `--space5` (24px) |
| Line map | 498 × 300px, inline SVG |
| Padding-block | 162px |
| Total height | ~744px |

**Layout inversion note.** S07 (Attorney) placed the image left and content right. This section places content left and the list right, with the map beneath the content. The page therefore alternates: hero (text L / image R) → attorney (image L / text R) → service areas (text L / list R). That ABA rhythm prevents the page from feeling like a template while keeping every left edge on the same spine.

### The line map — a new asset requirement

| Property | Specification |
|---|---|
| Format | Inline SVG, ≤4KB, `viewBox`-scaled |
| Style | 1px stroke, **`--borderInteractive`** `rgba(246,245,243,0.44)` (4.09:1), no fill |
| Content | County boundaries for Scioto, Adams, Pike, Lawrence (OH) and Greenup, Boyd (KY); the Ohio River as a single 1px path |
| Portsmouth marker | 6px filled circle in `--accentPrimary` |
| Labels | **None on the map.** The county names are already listed adjacent; duplicating them on the map creates a legibility problem at 498px and a translation burden. |
| Accuracy | Must be derived from public county-boundary data (US Census TIGER/Line or equivalent). A stylised map is acceptable; an inaccurate one is not. |

> **This is a NEW asset requirement introduced in Phase 2** and is not in the Phase 1 asset inventory (§18). It requires approval and production. **If declined, the left column drops the map and the section's padding reduces to `--sectionPaddingBlockTight`.** The section works without it; it is simply less distinctive.

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Grid | 8 columns. Content cols 1–4 (337px), county lists cols 5–8 (337px). |
| Empty column | Removed |
| County sub-columns | Retained at 2 × 145px, gap `--space6` (32px) |
| Line map | Moves **below** both columns, full container width, 706 × 260px |
| Heading size | **46px** (`--fontDisplayLg` @768 — corrected from 48px in Rev 1.1) |
| Padding-block | 101px |

## 4. Mobile Layout (< 768px)

**Intentional decision — the map leads, and the counties become a two-column index.**

```
├──────────────────────────────┤
│   WHERE I PRACTICE           │
│   ↕ 16px                     │
│   Southern Ohio and          │
│   northeastern Kentucky      │  ← 34px
│   ↕ 24px                     │
│   Licensed in both states,   │
│   with an office in          │
│   downtown Portsmouth.       │
│   ↕ 40px                     │
│  ┌────────────────────────┐  │
│  │   ╱‾‾╲  ╭──╮           │  │  ← full-bleed map
│  │  │  ●  OH │ KY │       │  │     100vw × 200px
│  └────────────────────────┘  │
│   ↕ 40px                     │
│   OHIO                       │
│   ──────────────────────     │
│   Scioto        Pike         │
│   County        County       │
│                              │
│   Adams         Lawrence     │
│   County        County       │
│   ↕ 32px                     │
│   KENTUCKY                   │
│   ──────────────────────     │
│   Greenup       Boyd         │
│   County        County       │
└──────────────────────────────┘
```

| Change | Specification |
|---|---|
| Order | Heading → paragraph → map → Ohio counties → Kentucky counties |
| Map | Full-bleed, `100vw × 200px`, escapes the gutter |
| County lists | **Two columns per state**, `repeat(2, 1fr)`, gap `--space5` (24px) — not a single long list |
| County item | `--fontBody` 17px, `--space4` (16px) vertical spacing |
| State grouping | Ohio and Kentucky stack vertically, each with its own caption heading and rule |
| Padding-block | 72px |

**The two-column county index is the key mobile decision.** Six counties in a single column is 6 × 44px = 264px of near-empty rows. In two columns it is 132px and reads as an index — which is what it is.

## 5. Component Inventory

- `serviceAreaSection` (organism)
- `eyebrow`
- `countyList` (molecule) + `countyItem`
- `regionMap` — decorative SVG, **new asset**
- `stateHeading`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Section heading | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | 67px | 48px | 34px | 600 | −0.02em | 1.06 | 14ch | left |
| Paragraph | `<p>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 400 | 0 | 1.60 | 40ch | left |
| State heading | **`<h3>`** | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| County item | `<li>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 400 | 0.01em | 1.35 | — | left |

**County names are set at `--fontBodyLg`, larger than standard body copy.** They are the section's payload — a visitor is scanning for one specific word ("Lawrence," "Boyd"). Setting them at 20.6px rather than 18px measurably improves scan speed and gives the right column visual weight to balance the display heading on the left.

## 7. Color Usage

Scene: **`dark`**.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | `--surfaceBase` | `#0B0B0D` | — |
| Eyebrow | `--textMuted` | `#8A8C93` | 5.76:1 ✅ |
| Heading | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Paragraph | `--textSecondary` | `#D2D3D6` | 13.14:1 ✅ |
| State heading | `--textMuted` | `#8A8C93` | 5.76:1 ✅ |
| State rule | `--borderSubtle` | `rgba(246,245,243,0.10)` | — |
| County item (text) | `--textSecondary` | `#D2D3D6` | 13.14:1 ✅ |
| County item (link, hover) | `--textPrimary` + gold underline | `#F6F5F3` | 17.85:1 ✅ |
| Map strokes | **`--borderInteractive`** | `rgba(246,245,243,0.44)` | **4.09:1 ✅** |
| Portsmouth marker | `--accentPrimary` | `#C19E61` | 7.80:1 ✅ |

**Gold audit:** one 6px circle on the map, plus hover underlines. Approximately 28px². Effectively zero — the most restrained section on the page after S06.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Eyebrow | `opacity`, `translateY(16px → 0)` | 0ms | 560ms | `--easeOut` |
| Reveal | Heading | ″ | 60ms | 560ms | `--easeOut` |
| Reveal | Paragraph | ″ | 120ms | 560ms | `--easeOut` |
| Reveal | Map strokes | `stroke-dashoffset` draw | 200ms | **900ms** (`--durationScene`) | `--easeInOut` |
| Reveal | Portsmouth marker | `opacity`, `scale(0 → 1)` | 900ms | 400ms | `--easeOut` |
| Reveal | County columns | `opacity`, `translateY(16px → 0)`, 60ms stagger (2 items) | 260ms | 560ms | `--easeOut` |
| Hover | County link | Underline `scaleX(0 → 1)` | — | 200ms | `--easeOut` |

**The map draws itself over 900ms** using `stroke-dasharray` / `stroke-dashoffset`, with the marker landing at 900ms as a terminal beat. It is a genuine reveal of information rather than an entrance effect — **this is the one place on the page where motion is permitted to be the point.**

> *(Rev 1.1: reduced from 1,200ms. A bespoke 1,200ms value was the only duration on the page outside the token set, which is exactly the kind of magic number that erodes a motion system. `--durationScene` (900ms) is already the page's "slowest deliberate thing" and reads identically here.)*

**Fallback:** if `stroke-dashoffset` on ~8 paths stutters on the mid-range Android verification device, replace the draw with a 560ms opacity fade. The section is unharmed by the loss — the map is supporting evidence, not content.

`stroke-dashoffset` animation triggers repaint of the SVG only. At 498 × 300px with ~8 paths this is inexpensive, but it must be verified on a mid-range Android device.

**Reduced motion:** the map renders complete and static with the marker present. No draw, no stagger, no reveals.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>` section, `<h3>` per state |
| List semantics | One `<ul>` per state. Announces "list, 4 items" / "list, 2 items". |
| **Map** | `<svg role="img">` with `<title>Counties served in southern Ohio and northeastern Kentucky</title>`. It is **not** `aria-hidden` — it conveys the section's meaning — but every county it depicts is also named in the adjacent text list, so no information is map-only. |
| Map interaction | **None.** The map is not clickable. Clickable SVG regions are a significant accessibility and touch-target liability for marginal benefit. |
| County links | At Tier 1 launch, county pages **do not exist**. County names render as **plain `<li>` text, not links.** They become links only when their pages ship (Tier 2/3). **Never link to a 404.** |
| Focus | Zero focusable elements at Tier 1 launch |
| Contrast | Minimum 5.76:1 (eyebrow, state headings). Map strokes 3.6:1 — above the 3:1 non-text minimum. |
| Touch targets | Not applicable at launch; when county links ship, each requires a 44px minimum tap height |
| Reduced motion | See §8 |

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Map | Inline SVG, ≤4KB, no external request. **Not** a raster image and **not** a third-party map embed (Phase 1 §14.6 prohibits Google Maps embeds — 300KB+ and multiple third-party connections). |
| Map path optimisation | County boundary data must be simplified (Douglas–Peucker or equivalent) before export. Raw TIGER/Line county polygons run to hundreds of KB; the target is ≤4KB total. Specify a simplification tolerance that preserves recognisable shape at 498px. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 744px` |
| Animation cost | `stroke-dashoffset` on ~8 paths for 1,200ms. Repaints the SVG region only. Verify on mid-range Android. If it stutters, replace the draw with a simple 560ms opacity fade — the section survives the loss. |
| CLS | Map has explicit `viewBox` and CSS `aspect-ratio`. Zero. |
| Font | No new families or weights. |
| DOM | ~30 elements plus ~8 SVG paths. |

> **`[GATED — Q3]`** The Kentucky column is contingent on whether Kentucky matters are actively handled and in which counties. The research warns that marketing Kentucky work that is not actively taken "creates client confusion and a compliance risk." If Q3 is negative or limited, the Kentucky column is removed and the section becomes a single Ohio list — the layout accommodates this without change.
>
> **`[GATED]` — new asset.** The line map requires approval and production. See §2.

---

<!-- ============================================================ -->

# S12 — FAQ Preview

## 1. Purpose

The research identifies question-driven search as one of this market's largest content opportunities and lists a substantial FAQ bank organised by practice line. This section surfaces four of the highest-intent questions on the homepage — both to answer them immediately and to signal that the full FAQ centre exists.

**Business goal:** reduce pre-contact friction by answering the questions that stop people from calling, and route informational-intent visitors into `/faq/` rather than losing them to a competitor's blog.

**Emotional response:** *permission to ask*. The research notes hesitation triggers including "not knowing whether the issue is strong enough to justify counsel" and "concern about being judged." Seeing plain answers to basic questions tells a visitor their question is normal.

## 2. Desktop Layout (≥1200px)

**This is the second and final centred section**, deliberately mirroring S06's treatment. The page opens its light scene with a centred statement and closes its content with a centred question set — the composition bookends itself.

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 162px                                                              │
│                          COMMON QUESTIONS                              │
│                          ↕ 24px                                        │
│                      What people ask first                             │
│   ↕ 72px                                                               │
│         ┌────────────────────────────────────────────────┐             │
│         │ Do I need a lawyer before my first        +   │             │
│         │ court date?                                    │             │
│         ├────────────────────────────────────────────────┤             │
│         │ How much does a divorce cost in Ohio?     +   │             │
│         ├────────────────────────────────────────────────┤             │
│         │ Can I get a protection order the same     −   │             │
│         │ day I file?                                    │             │
│         │                                                │             │
│         │ In Ohio, a court can issue a temporary        │             │
│         │ ex parte order the same day you file, often   │             │
│         │ after a brief hearing. A full hearing is       │             │
│         │ then scheduled within roughly ten days.        │             │
│         ├────────────────────────────────────────────────┤             │
│         │ How long does probate take in Ohio?       +   │             │
│         └────────────────────────────────────────────────┘             │
│   ↕ 40px                                                               │
│              This page is general information, not legal advice.       │
│   ↕ 32px                                                               │
│              See all frequently asked questions →                      │
│   ↕ 162px                                                              │
└────────────────────────────────────────────────────────────────────────┘
              │←────── --containerNarrow 760px ──────→│
```

| Property | Value @1440px |
|---|---|
| Container | **`--containerNarrow` 760px**, centred within `--containerMax` |
| Heading block | Centred, max 16ch |
| Heading → accordion | `--space9` (**64px** — corrected from 72px, which is not a token) |
| Accordion row | 1px `--borderSubtle` bottom; the first row also has a top rule |
| Summary padding-block | `--space5` (24px) |
| Summary min-height | 72px |
| Answer padding-bottom | `--space6` (32px) |
| Answer max-width | 62ch |
| Toggle icon | 16px, right-aligned, `--space5` (24px) from the summary text |
| Disclaimer | Centred, `--space7` (40px) below the accordion |
| Link | Centred, `--space6` (32px) below the disclaimer |
| Padding-block | 162px |
| Total height | ~804px (with one item open) |

### The four questions

Selected for maximum practice-cluster spread — one from each of the site's four content pillars, so a visitor of any type sees a question relevant to them.

| # | Question | Cluster | Research support |
|---|---|---|---|
| 1 | Do I need a lawyer before my first court date? | Criminal Defense | Listed verbatim in the research FAQ bank |
| 2 | How much does a divorce cost in Ohio? | Family Law | Identified as a repeatedly-searched competitor gap |
| 3 | Can I get a protection order the same day I file? | Protection Orders | Listed verbatim; flagged as high urgency |
| 4 | How long does probate take in Ohio? | Estate / Probate | Listed verbatim; strong older-demographic fit |

**All four are open by default? No — all four are closed.** A visitor sees four questions, scans for their own, and opens one. An open-by-default first item would push the other three below the fold and bias the section toward criminal defense.

**Multiple items may be open simultaneously.** No exclusive-accordion behaviour. A visitor comparing two answers should not have the first collapse when they open the second — and exclusivity would require either JavaScript or the `name` attribute on `<details>`, adding complexity for a worse experience.

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Container | `--containerNarrow` 760px, but constrained by the 706px container — effectively full width |
| Heading size | **46px** (`--fontDisplayLg` @768 — corrected from 48px in Rev 1.1) |
| Summary text | `--fontBodyLg` 19px |
| Summary min-height | 68px |
| Padding-block | 101px |
| Alignment | Heading centred; accordion rows left-aligned (unchanged) |

## 4. Mobile Layout (< 768px)

| Change | Specification |
|---|---|
| Container | Full container width |
| Heading | 34px, **centred** — like S06, the centred display heading survives because it is short |
| Summary text | `--fontBody` 17px, weight 500, max ~30ch — questions wrap to two or three lines |
| Summary min-height | **64px**, with the toggle icon vertically centred against the *first* line, not the block centre |
| Summary padding-inline-end | `--space8` (48px) — reserves space so wrapping text never collides with the toggle icon |
| Answer | `--fontBody` 17px, ~34ch |
| Disclaimer | **Left-aligned** below the accordion |
| Link | Left-aligned, 48px tap target |
| Padding-block | 72px |

**Intentional mobile decision — the toggle icon aligns to the first line.** With two- and three-line questions, an icon centred against the whole summary block drifts downward and loses its association with the question's start. Anchoring it to the first line's optical centre keeps the row scannable. This is a small detail that is invisible when right and conspicuous when wrong.

## 5. Component Inventory

- `faqTeaseSection` (organism)
- `accordionGroup` (organism)
- `accordionItem` (molecule) — native `<details>` / `<summary>`
- `accordionToggle` — the plus/minus glyph
- `eyebrow`
- `linkArrow`
- `disclaimerNote`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eyebrow | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | centre |
| Section heading | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | 67px | 48px | 34px | 600 | −0.02em | 1.06 | 16ch | centre |
| Question | **`<h3>`** inside `<summary>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 500 | 0 | 1.45 | 48ch | left |
| Answer | `<p>` | Inter | `--fontBody` | 18px | 17px | 17px | 400 | 0 | 1.65 | 62ch | left |
| Disclaimer | `<p>` | Inter | `--fontBodySm` | 16px | 15px | 15px | 400 *italic* | 0 | 1.55 | 56ch | centre → left |
| Link | `<a>` | Inter | `--fontBody` | 18px | 17px | 17px | 500 | 0.01em | 1.0 | — | centre → left |

**Questions are set in Inter at weight 500, not in Cormorant.** Same reasoning as the practice cards — these are scanned, not read. Weight 500 rather than 600 keeps them distinct from the answer text without making four consecutive rows feel heavy.

## 7. Color Usage

Scene: **`dark`**.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | `--surfaceBase` | `#0B0B0D` | — |
| Eyebrow | `--textMuted` | `#8A8C93` | 5.76:1 ✅ |
| Heading | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Question (rest) | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Question (hover) | `--textPrimary` | unchanged | — |
| Answer | `--textSecondary` | `#D2D3D6` | 13.14:1 ✅ |
| Row rules | `--borderSubtle` | `rgba(246,245,243,0.10)` | — |
| Toggle glyph | `--accentPrimary` | `#C19E61` | 7.80:1 ✅ |
| Disclaimer | `--textMuted` | `#8A8C93` | 5.76:1 ✅ |
| Link text | `--textPrimary` | `#F6F5F3` | 17.85:1 ✅ |
| Link arrow | `--accentPrimary` | `#C19E61` | 7.80:1 ✅ |

**Gold audit:** four 16px toggle glyphs (1,024px²) plus one 14px link arrow. Roughly 0.1% of the section.

**Rows have no fill and no hover background.** A hover fill would make the accordion look like a data table. The only rest/hover distinction is the cursor and the toggle glyph — which is sufficient, because the entire row is a `<summary>` and browsers signal that natively.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Eyebrow | `opacity`, `translateY(16px → 0)` | 0ms | 560ms | `--easeOut` |
| Reveal | Heading | ″ | 60ms | 560ms | `--easeOut` |
| Reveal | Accordion rows | ″, 60ms stagger (4 items) | 180ms | 560ms | `--easeOut` |
| Reveal | Disclaimer + link | ″ | 480ms | 560ms | `--easeOut` |
| **Open** | `::details-content` | `height: 0 → auto` (Tier 2 only) | — | `--durationBase` 320ms | `--easeInOut` |
| Open | Answer content | `opacity 0 → 1` (Tier 2 only) | 80ms | 240ms | `--easeOut` |
| Open | Toggle glyph | Vertical stroke `scaleY(1 → 0)` — **works in both tiers** | — | 320ms | `--easeInOut` |
| Close | `::details-content` | `height: auto → 0` (Tier 2 only) | — | 240ms | `--easeInOut` |

**The toggle glyph animates in both tiers.** It is a pseudo-element on `<summary>`, which is always rendered, so its `scaleY` transition is unaffected by the `<details>` content-visibility problem. Even at Tier 1 — where the panel snaps open instantly — the plus-to-minus transition gives the interaction a felt response.

**Required reset for the native marker** (omitted from the first draft — without it, browsers render their own disclosure triangle *in addition to* the specified glyph):

```
summary { list-style: none; }
summary::-webkit-details-marker { display: none; }   /* Safari */
summary::marker { content: ""; }                     /* Firefox/Chromium */
```

`<summary>` is `display: flex; justify-content: space-between; align-items: flex-start` so the `<h3>` and the toggle glyph sit on one row with the glyph anchored to the first line (see §4).

> ### Revision 1.1 — the expansion animation was not implementable as specified
>
> The first draft specified a 320ms `grid-template-rows: 0fr → 1fr` expansion **and** stated in §10 that "no JavaScript is required — native `<details>` supplies all behaviour." **Those two statements are incompatible.** A browser sets `<details>` content to `content-visibility: hidden` (historically `display: none`) while closed, so there is no interpolatable state between closed and open. The `0fr → 1fr` technique works on an ordinary `<div>`; it does not work on native `<details>` without intervention. As written, an engineer would have built it, observed an instant snap, and had to come back with a question.
>
> **Resolved as a three-tier progressive enhancement. Tier 1 is the baseline and ships regardless.**

| Tier | Mechanism | Support | Behaviour |
|---|---|---|---|
| **1 — Baseline** | Native `<details>` / `<summary>`, no animation | Universal | Instant open/close. Fully accessible, zero JS. **This is a correct and acceptable production state.** |
| **2 — Enhancement** | `::details-content` + `interpolate-size: allow-keywords`, wrapped in `@supports selector(::details-content)` | Chromium 131+, expanding | 320ms height + opacity transition, pure CSS |
| **3 — Not used** | JS `toggle` interception with manual height animation | — | **Explicitly rejected.** ~40 lines of JS, a `beforetoggle` race, and a focus-management hazard, to animate a disclosure. Not worth it. |

**Tier 2 specification:**

| Property | Value |
|---|---|
| Selector | `@supports selector(::details-content) { … }` |
| Root | `interpolate-size: allow-keywords` on `:root` |
| Open | `height: 0 → auto`, `content-visibility` transitioned via `transition-behavior: allow-discrete` |
| Duration | `--durationBase` 320ms open · 240ms close |
| Easing | `--easeInOut` |
| Content opacity | `0 → 1`, 240ms, 80ms delay |

**The `grid-template-rows: 0fr → 1fr` technique is withdrawn from this section.** It remains valid for non-`<details>` disclosures elsewhere in the system (the mobile menu's Practice Areas group uses `<details>` too and inherits this same three-tier treatment).

**The toggle is a plus becoming a minus**, implemented as two 1px strokes where the vertical stroke scales to zero. Not a rotating chevron — a chevron implies "go somewhere," a plus/minus implies "show more here."

**Closing is faster than opening** (240ms vs 320ms), per the "slow in, fast out" principle in Phase 1 §12.1.

**Reduced motion:** rows expand and collapse instantly. Toggle glyph changes instantly. Reveals removed.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>` section, `<h3>` per question |
| **Accordion mechanism** | Native `<details>` / `<summary>`. Keyboard operation, `aria-expanded` state, and screen-reader announcement are supplied by the browser at no cost and cannot be got wrong. |
| Heading inside summary | `<summary><h3>Question text</h3></summary>` — this ordering is correct and keeps the question in the document outline. Do **not** wrap `<summary>` in the heading. |
| Toggle glyph | `aria-hidden="true"`. State is conveyed natively by `<details open>`. |
| Focus | `<summary>` is natively focusable. Focus ring surrounds the full row, `outline-offset: -2px` so it sits inside the row's bounds rather than overlapping adjacent rules. |
| Focus order | Four summaries in DOM order, then the FAQ link |
| Answer links | Answers contain **no inline links** — they would create additional tab stops inside collapsed content in browsers that keep hidden `<details>` content focusable. Related-page routing is handled by the single "See all" link. |
| Contrast | Minimum 5.76:1 (eyebrow, disclaimer) |
| Touch targets | Summary rows 72px desktop / 64px mobile × full container width |
| Reduced motion | See §8 |
| Text spacing | No fixed heights. `grid-template-rows: 1fr` resolves to content height at any spacing. |

**Legal-information disclaimer placement.** The note "This page is general information, not legal advice" sits directly beneath the accordion, before the link. It is required by the compliance constraints in Phase 1 §15.7 and must not be moved into the footer where it loses proximity to the content it qualifies.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** The toggle glyph is two CSS pseudo-element strokes — zero SVG, zero requests. |
| JavaScript | **None required, and none used.** Native `<details>` supplies all behaviour; the Tier 2 animation is pure CSS behind `@supports`. The only JS touching this section is the shared reveal observer. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 804px`. Note that `content-visibility` and `<details>` interact: collapsed answer content is already not rendered, so the saving is modest but real. |
| Expansion cost | Tier 2's `height: 0 → auto` animates layout on the row and its subtree. `contain: layout` on each `<details>` prevents invalidation of sibling rows. Tier 1 has no animation cost at all. |
| CLS | Expansion is user-initiated and therefore **excluded from CLS** by the metric's 500ms input-exclusion window. No unexpected shift occurs. |
| SEO | Answer content is in the DOM at page load and is indexable regardless of collapsed state. `FAQPage` JSON-LD is emitted for these four questions (Phase 1 §15.4) — with the expectation set there that rich results are unlikely, and the markup serves comprehension. |
| Font | No new families or weights. |
| DOM | ~24 elements. |

> **`[GATED]` — answer copy requires legal review.** The four specimen answers state Ohio procedural facts. Each must be verified as currently accurate by the attorney before publication, and each must avoid implying a guaranteed outcome or timeline. Answer 3's "roughly ten days" is a statutory reference that must be confirmed against current Ohio Revised Code before it ships.

<!-- ============================================================ -->

# S13 — Final CTA

## 1. Purpose

The decision point. Every section above has been building toward a visitor being willing to make contact; this is where the page asks. It is also the visual conclusion of the cinematic descent — the darkest, quietest, most spacious moment on the page.

**Business goal:** convert. This section carries the page's second and final full-strength conversion opportunity (the first being the hero), positioned after all trust-building content has been delivered.

**Emotional response:** *resolution*. Not urgency, not pressure. The research is explicit that this audience is anxious and that the site should reduce anxiety — a high-pressure closing block would undo eight sections of careful work. The correct feeling is: *this is easy, and nothing bad happens if you call.*

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────┐
│  ─────────────────── 1px gold rule, full container ──────────────────  │
│                                                                        │
│   ↕ 200px  (--space14)                                                 │
│                                                                        │
│                     Let's talk about                                   │
│                     where you stand.                                   │
│                                                                        │
│                        ↕ 40px                                          │
│                                                                        │
│              No cost for the first conversation.                       │
│                                                                        │
│                        ↕ 56px                                          │
│                                                                        │
│              ┌─────────────────────────┐                               │
│              │ Request a consultation  │   Call (740) 529-1420 →       │
│              └─────────────────────────┘                               │
│                                                                        │
│                        ↕ 80px                                          │
│                                                                        │
│              602 Chillicothe Street, Suite 206                         │
│              Portsmouth, Ohio 45662                                    │
│                                                                        │
│   ↕ 200px  (--space14)                                                 │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                    │←──── centred, max 620px ────→│
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px, content centred |
| Content max-width | **620px** |
| Alignment | Centred |
| Top border | **1px `--accentPrimary`**, full container width — the only full-width gold rule on the page |
| Padding-block | `--space14` (**200px**) top and bottom |
| Heading max-width | 14ch |
| Heading → line | `--space7` (40px) |
| Line → CTA row | `--space9` (**64px** — corrected from 56px, which is not a token) |
| CTA row → NAP | `--space10` (80px) |
| CTA row gap | `--space6` (32px), horizontal |
| Background | **`--surfaceSunken` `#060607`** — deeper than the dark scene base |
| Total height | ~760px |

**The background is the page's darkest value**, one step below `--surfaceBase`. The cinematic descent that began in warm daylight terminates here, at very nearly black. No visitor will consciously register the 5-value difference between `#0B0B0D` and `#060607`; every visitor will feel that the page has arrived somewhere final.

**The gold rule above this section is the only one of its kind.** It is 1240 × 1px — approximately 0.1% of the section — and it functions as a typographic terminal mark, the way a rule sits above a colophon. This is the single most concentrated gold moment on the page and it is deliberately reserved for the closing.

**Whitespace philosophy.** 400px of vertical padding around ~360px of content. Alongside S06 this is the most generous section on the page, and for the same reason: the two moments where the page most needs the visitor to feel unhurried are the emotional pivot and the ask.

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Content max-width | 520px |
| Heading size | **46px** (`--fontDisplayLg` @768 — corrected from 48px in Rev 1.1) |
| Padding-block | `--space12` (128px) |
| CTA row | Remains horizontal — both fit within 520px at tablet button sizes |
| CTA row gap | `--space5` (24px) |
| NAP | Two lines, centred, unchanged |

## 4. Mobile Layout (< 768px)

**Intentional decision — the phone becomes a full-width button, equal in weight to the form CTA.**

Everywhere else on the page the phone is a text link with an arrow. Here it is promoted to a button. At the decision point, on a device that is literally a telephone, for an audience the research describes as calling under stress after hours — the phone is not the secondary action. Giving it a text link while the form gets a button would be a design decision working against the business.

```
├──────────────────────────────┤
│ ──── 1px gold rule ────      │
│   ↕ 96px                     │
│                              │
│   Let's talk about           │
│   where you stand.           │  ← 34px, centred
│                              │
│   ↕ 24px                     │
│   No cost for the first      │
│   conversation.              │
│   ↕ 40px                     │
│  ┌────────────────────────┐  │
│  │ Request a consultation │  │  ← filled gold, 56px
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │  Call (740) 529-1420   │  │  ← ghost, 56px
│  └────────────────────────┘  │
│   ↕ 56px                     │
│   602 Chillicothe Street,    │
│   Suite 206                  │
│   Portsmouth, Ohio 45662     │
│   ↕ 96px                     │
└──────────────────────────────┘
```

| Change | Specification |
|---|---|
| Heading | 34px, centred, three lines |
| Supporting line | `--fontBody` 17px, centred, max 30ch |
| CTA stack | Vertical, `--space3` (12px) gap |
| Both buttons | **Full container width, 56px tall** |
| Primary | Filled `--accentPrimary` |
| Secondary | Ghost — 1px **`--borderInteractive`** `rgba(246,245,243,0.48)` (4.64:1 on `#060607`), transparent fill |
| NAP | Centred, `--fontBodySm` 15px, three lines |
| Padding-block | `--space11` (96px) |

## 5. Component Inventory

- `finalCtaSection` (organism)
- `buttonPrimary` — `isLarge`, `isFullWidth` (<768px)
- `buttonGhost` — `isFullWidth` (<768px); renders as `linkArrow` at ≥768px
- `linkArrow` — phone, ≥768px
- `napBlock` (molecule)
- `goldRule` — decorative

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Heading | **`<h2>`** | Cormorant Garamond | `--fontDisplayLg` | **67px** | 48px | 34px | 600 | −0.02em | 1.06 | 14ch | centre |
| Supporting line | `<p>` | Inter | `--fontBodyLg` | 20.6px | 19px | 17px | 400 | 0 | 1.55 | 34ch | centre |
| Primary CTA | — | Inter | `--fontBody` | 18px | 17px | 17px | 600 | 0.02em | 1.0 | — | centre |
| Phone CTA | — | Inter | `--fontBody` | 18px | 17px | 17px | 500 | 0.01em | 1.0 | — | left / centre |
| NAP | `<address>` | Inter | `--fontBodySm` | 16px | 15px | 15px | 400 | 0 | 1.60 | — | centre |

**There is no eyebrow in this section.** Every other section on the page opens with a tracked caption label. This one does not — the heading arrives without preamble, which is what makes it read as a conclusion rather than another topic.

**The heading breaks on two lines at desktop, three at mobile:**

```
Desktop / Tablet:        Mobile:
Let's talk about         Let's talk
where you stand.         about where
                         you stand.
```

Art-directed via `<span class="ctaTitleLine">` with a breakpoint-specific display rule. Do not rely on automatic wrapping.

## 7. Color Usage

Scene: **`dark`**, with a section-level surface override.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | **`--surfaceSunken`** | `#060607` | — |
| Top rule | `--accentPrimary` | `#C19E61` | — |
| Heading | `--textPrimary` | `#F6F5F3` | **18.2:1** ✅ |
| Supporting line | `--textSecondary` | `#D2D3D6` | **13.4:1** ✅ |
| Primary CTA fill | `--accentPrimary` | `#C19E61` | — |
| Primary CTA label | `--textOnAccent` | `#0B0B0D` | 7.80:1 ✅ |
| Ghost CTA border | **`--borderInteractive`** | `rgba(246,245,243,0.48)` | **4.64:1 ✅** (SC 1.4.11) |
| Ghost CTA label | `--textPrimary` | `#F6F5F3` | 18.2:1 ✅ |
| Phone arrow | `--accentPrimary` | `#C19E61` | 7.9:1 ✅ |
| NAP | `--textMuted` | `#8A8C93` | **5.9:1** ✅ |

*(Contrast values are marginally higher than the dark-scene figures elsewhere because `#060607` is darker than `#0B0B0D`.)*

**Gold audit:** the 1240 × 1px top rule (1,240px²), the primary CTA fill (approximately 232 × 56px = 12,992px²), and one 14px arrow. Total ≈ 14,300px² in a 1240 × 760px section = **1.5%**. This is the highest gold density of any section, and correctly so — it is the page's conversion moment. It remains within the 3% budget, and the section contains **exactly one filled gold element**, satisfying the "no more than one filled gold element in view" rule from Phase 1 §10.7.

## 8. Motion

| Event | Element | Property | Delay | Duration | Easing |
|---|---|---|---|---|---|
| Reveal | Gold top rule | `scaleX(0 → 1)`, origin **centre** | 0ms | **900ms** | `--easeOut` |
| Reveal | Heading line 1 | `opacity`, `translateY(16px → 0)` | 200ms | 560ms | `--easeOut` |
| Reveal | Heading line 2 | ″ | 280ms | 560ms | `--easeOut` |
| Reveal | Supporting line | ″ | 380ms | 560ms | `--easeOut` |
| Reveal | CTA row | ″ | 460ms | 560ms | `--easeOut` |
| Reveal | NAP | `opacity 0 → 1` | 600ms | 560ms | `--easeOut` |
| Hover | Primary CTA | `background-color` → `#D0AF77` | — | 200ms | `--easeOut` |
| Hover | Ghost CTA | `border-color` → `--textPrimary` | — | 200ms | `--easeOut` |
| Hover | Phone arrow | `translateX(0 → 4px)` | — | 200ms | `--easeOut` |

**The gold rule draws from the centre outward over 900ms** — the slowest reveal on the page other than the map. Origin-centre rather than origin-left is deliberate: it reads as an opening rather than a line being drawn, and it establishes the section's symmetry before any content arrives.

**No pulsing, no glow, no attention-seeking on the CTA.** The research warns this market distrusts lawyer advertising; a pulsing button is exactly the signal that triggers that distrust.

**Reduced motion:** rule at full width, all content at rest, hover transitions instant.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Heading | `<h2>`. The two `<span>` line elements are `display: block` inside it. |
| Landmark | Wrapped in `<section aria-labelledby="finalCtaHeading">` |
| NAP semantics | `<address>` element. Note that `<address>` is semantically for *contact information of the page's author or section*, which is exactly correct here. |
| Phone link | `<a href="tel:+17405291420">` with the formatted number as visible text |
| Primary CTA | `<a href="/contact/">` — a link, not a `<button>`. It navigates. |
| Focus order | Primary CTA → phone. DOM order matches visual order at every breakpoint, including the mobile stack. |
| Contrast | Minimum 5.9:1 (NAP). Every interactive element exceeds 7:1. |
| Touch targets | Desktop CTA 56px tall. Mobile: both buttons full-width × 56px — the largest targets on the page, appropriate for its most important interaction. |
| Reduced motion | See §8 |
| Text spacing | No fixed heights. Buttons use `min-height` with padding, so labels at increased letter-spacing do not clip. |

**The gold top rule is decorative** — `<div aria-hidden="true">` — and carries no meaning that is not already conveyed by the section's heading and structure.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | **None.** |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 760px` |
| Animation cost | `scaleX` on a 1px element and `opacity`/`transform` on five text blocks — all compositor-only. |
| CLS | Zero. |
| Font | No new families or weights. |
| DOM | ~14 elements — the lightest content section on the page. |
| Conversion tracking | If analytics ships (Q9), both CTAs require event tracking. The phone link in particular must be tracked as a conversion of equal weight to the form (Phase 1 Rec 20.5). Tracking must not add a click handler that delays navigation — use `beacon` transport. |

> **`[GATED — Q4]`** The supporting line "No cost for the first conversation" asserts a free consultation. If that is not the model, the recommended replacement is **"Tell me what happened. I'll tell you where you stand."** — which carries the same reassurance without a fee claim, and echoes the S06 positioning statement.
>
> **`[GATED — Q5]`** Office hours are deliberately **omitted** from this block pending Q5, because the research found conflicting published hours ("Open 24 hours" on GBP versus structured weekday schedules elsewhere). Publishing hours that contradict the Google Business Profile would actively harm local SEO and visitor trust. Once confirmed, hours are added as a fourth line in the `napBlock`.

---

<!-- ============================================================ -->

# S14 — Footer

## 1. Purpose

The footer does three jobs: it provides a complete secondary navigation for visitors who scrolled without converting, it carries the NAP data that local SEO depends on, and it holds the legal disclaimers that Ohio and Kentucky attorney-advertising rules require.

**Business goal:** capture the visitor who reached the bottom without acting, reinforce NAP consistency for local search, and satisfy compliance obligations.

**Emotional response:** *completeness*. A thorough, quiet footer signals an organised practice. This is also the visitor's last impression, and it should feel settled rather than trailing off.

## 2. Desktop Layout (≥1200px)

```
┌────────────────────────────────────────────────────────────────────────┐
│   ↕ 96px                                                               │
│                                                                        │
│  ◈                        PRACTICE AREAS   FIRM          LEGAL         │
│  AUSTIN G. ERVIN          ──────────────   ──────        ──────        │
│  ATTORNEY AT LAW, LLC     Criminal Defense About         Disclaimer    │
│                           OVI & DUI        Attorney      Privacy Policy│
│  602 Chillicothe Street   Family Law       FAQ           Accessibility │
│  Suite 206                Protection Orders Contact                    │
│  Portsmouth, Ohio 45662   Estate Planning                              │
│                           Probate                                      │
│  (740) 529-1420           View all areas →                             │
│                                                                        │
│   ↕ 64px                                                               │
│  ────────────────────────────────────────────────────────────────────  │
│   ↕ 40px                                                               │
│  The information on this website is for general informational purposes │
│  only and is not legal advice. Contacting Austin G. Ervin, Attorney at │
│  Law, LLC does not create an attorney-client relationship. Please do   │
│  not send confidential information until an attorney-client            │
│  relationship has been established. Austin G. Ervin is licensed to     │
│  practice law in Ohio and Kentucky. This website may be considered     │
│  attorney advertising.                                                 │
│   ↕ 40px                                                               │
│  ────────────────────────────────────────────────────────────────────  │
│   ↕ 32px                                                               │
│  © 2026 Austin G. Ervin, Attorney at Law, LLC        Site by Nulo Studio│
│   ↕ 48px                                                               │
└────────────────────────────────────────────────────────────────────────┘
   │← 2fr ·  ~460px →│ 64 │← 1fr →│ 64 │← 1fr →│ 64 │← 1fr →│
```

| Property | Value @1440px |
|---|---|
| Container | `--containerMax` 1240px |
| Grid | `grid-template-columns: 2fr 1fr 1fr 1fr`, gap `--space9` (64px) |
| Column 1 width | ~452px — brand, NAP, phone |
| Columns 2–4 | ~226px each |
| Padding-block-start | `--space11` (96px) |
| Brand block → columns | Aligned to the same top edge |
| Column heading | `--fontCaption`, uppercase, with 1px `--borderSubtle` rule beneath at `--space3` (12px) |
| Link spacing | `--space4` (16px) |
| Link block padding | `8px 0` → 40px effective target |
| Columns → disclaimer rule | `--space9` (64px) |
| Disclaimer padding-block | `--space7` (40px) |
| Disclaimer max-width | **90ch** |
| Bottom bar padding-block-start | `--space6` (32px) |
| Padding-block-end | `--space8` (48px) |
| Total height | ~536px |

**Column 1 is double-width** because it carries the stacked logo lockup, a three-line address, and a phone number — content that reads badly at 226px. The 2fr allocation also creates an asymmetric grid that avoids the four-equal-columns look of a template footer.

## 3. Tablet Layout (768–1023px)

| Change | Specification |
|---|---|
| Grid | `2 × 2` — `grid-template-columns: 1fr 1fr`, row gap `--space9` (64px) |
| Cell 1 | Brand + NAP + phone |
| Cell 2 | Practice Areas |
| Cell 3 | Firm |
| Cell 4 | Legal |
| Disclaimer | Full width, max 76ch |
| Bottom bar | Two items, `space-between` |
| Padding-block-start | `--space10` (80px) |

## 4. Mobile Layout (< 768px)

**Intentional decision — the link groups become a two-column index, not a single 18-row stack.**

Three stacked groups of five to six links each produces roughly 800px of near-empty footer. Pairing Practice Areas and Firm side by side halves it.

```
├──────────────────────────────┤
│   ◈                          │
│   AUSTIN G. ERVIN            │
│   ATTORNEY AT LAW, LLC       │
│   ↕ 32px                     │
│   602 Chillicothe Street     │
│   Suite 206                  │
│   Portsmouth, Ohio 45662     │
│   ↕ 16px                     │
│   (740) 529-1420             │  ← linkPhone, 20.6px
│   ↕ 56px                     │
│  ┌────────────┬────────────┐ │
│  │ PRACTICE   │ FIRM       │ │
│  │ ─────────  │ ─────────  │ │
│  │ Criminal   │ About      │ │
│  │ OVI & DUI  │ Attorney   │ │
│  │ Family Law │ FAQ        │ │
│  │ Protection │ Contact    │ │
│  │ Estate     │            │ │
│  │ Probate    │            │ │
│  └────────────┴────────────┘ │
│   ↕ 40px                     │
│   LEGAL                      │
│   ──────────────────────     │
│   Disclaimer · Privacy ·     │  ← inline, middot-separated
│   Accessibility              │
│   ↕ 48px                     │
│  ────────────────────────    │
│   Disclaimer text...         │
│  ────────────────────────    │
│   © 2026 Austin G. Ervin,    │
│   Attorney at Law, LLC       │
│   Site by Nulo Studio        │
└──────────────────────────────┘
```

| Change | Specification |
|---|---|
| Brand block | Full width, first |
| Phone | `--fontBodyLg` 18px — larger than surrounding text, 48px tap target |
| Practice + Firm | Two columns, `repeat(2, 1fr)`, gap `--space5` (24px) |
| **Legal group** | Full width beneath, rendered as **inline middot-separated links** rather than a third column — only three short items, and a third column would leave one row of two and one of one |
| Link target | 44px minimum height in the two-column grid |
| Disclaimer | Full width, `--fontBodySm` 15px, max 40ch |
| Bottom bar | Stacked, left-aligned, `--space2` (8px) between lines |
| Padding-block | `--space10` (80px) top, `--space8` (48px) bottom |

## 5. Component Inventory

- `siteFooter` (organism)
- `logoLockup` — variant `isStacked`
- `napBlock` (molecule)
- `linkPhone`
- `footerColumn` + `footerColumnHeading` + `footerLink`
- `disclaimerBlock` (organism)
- `footerBottomBar`

## 6. Typography

| Element | Level | Family | Token | @1440 | @768 | @375 | Weight | Tracking | LH | Measure | Align |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Logo wordmark | — | *(vector)* | — | 44px lockup height | 40px | 38px | — | — | — | — | left |
| Column heading | **`<h2>`** | Inter | `--fontCaption` | 13px | 12px | 12px | 500 | 0.14em uppercase | 1.40 | — | left |
| Footer link | `<a>` | Inter | `--fontBodySm` | 16px | 15px | 15px | 400 | 0 | 1.50 | — | left |
| NAP | `<address>` | Inter | `--fontBodySm` | 16px | 15px | 15px | 400 | 0 | 1.65 | — | left |
| Phone | `<a>` | Inter | `--fontBody` | 18px | 17px | **18px** | 500 | 0.01em | 1.4 | — | left |
| Disclaimer | `<p>` | Inter | `--fontBodySm` | 16px | 15px | 15px | 400 | 0 | 1.65 | 90ch | left |
| Bottom bar | `<p>` | Inter | `--fontCaption` | 13px | 12px | 12px | 400 | 0 | 1.50 | — | left |

**The disclaimer is set at 16px, not 12px.** Legal disclaimers rendered in micro-type read as an attempt to hide them, which is both an ethical problem and — given Ohio R. 7.1's prohibition on misleading communications — a compliance risk. At `--fontBodySm` with a 90ch measure and `--textMuted`, it is unmistakably present without dominating.

**Column headings are `<h2>`** so the footer's structure is navigable by heading. They are styled as captions but they are genuine headings.

## 7. Color Usage

Scene: **`dark`**, with the same `--surfaceSunken` override as S13.

| Element | Token | Value | Contrast |
|---|---|---|---|
| Background | **`--surfaceSunken`** | `#060607` | — |
| Separator from S13 | 1px `--borderSubtle` | — | — |
| Logo shield | `--accentPrimary` | `#C19E61` | — |
| Logo wordmark | `currentColor` → `--textPrimary` | `#F6F5F3` | 18.2:1 ✅ |
| Column heading | `--textMuted` | `#8A8C93` | 5.9:1 ✅ |
| Heading rule | `--borderSubtle` | `rgba(246,245,243,0.10)` | — |
| Footer link (rest) | `--textSecondary` | `#D2D3D6` | 13.4:1 ✅ |
| Footer link (hover) | `--textPrimary` + gold underline | `#F6F5F3` | 18.2:1 ✅ |
| NAP | `--textSecondary` | `#D2D3D6` | 13.4:1 ✅ |
| Phone | `--textPrimary` | `#F6F5F3` | 18.2:1 ✅ |
| Disclaimer | `--textMuted` | `#8A8C93` | 5.9:1 ✅ |
| Bottom bar | `--textMuted` | `#8A8C93` | 5.9:1 ✅ |
| Divider rules | `--borderSubtle` | — | — |

**The footer shares S13's `#060607` surface**, separated only by a 1px hairline. The two sections form one continuous darkest terminal block. The visitor's descent from `#FAF8F5` to `#060607` is complete.

**Gold audit:** the shield mark in the stacked lockup (~44 × 44px = 1,936px²) plus hover underlines. Approximately 0.03% of the footer. No gold CTA appears here — the conversion ask belongs to S13, and repeating it in the footer would dilute it.

## 8. Motion

| Event | Element | Property | Duration | Easing |
|---|---|---|---|---|
| Entrance | **None** | — | — | — |
| Hover | Footer link underline `scaleX(0 → 1)` | — | `--durationFast` 200ms | `--easeOut` |
| Hover | Phone link underline | — | 200ms | `--easeOut` |

**The footer does not animate in.** Every other section on the page reveals on scroll; the footer simply is. By the time a visitor reaches it, animation has stopped being a signal of craft and started being a delay between them and a phone number. This is a deliberate, and slightly unusual, decision — it should not be "fixed" for consistency.

**Reduced motion:** hover underlines appear instantly.

## 9. Accessibility

| Concern | Specification |
|---|---|
| Landmark | `<footer>` — one per page, `contentinfo` role implicit |
| Navigation | Each link group is `<nav aria-label="…">` — "Practice areas", "Firm", "Legal". Three distinct labels so screen-reader users can tell them apart in a landmark list. |
| Headings | `<h2>` per column, styled as captions |
| List semantics | `<ul>` per group |
| NAP | `<address>` containing the postal address and phone link |
| Phone | `<a href="tel:+17405291420">` |
| Focus order | Brand phone → Practice links → Firm links → Legal links → bottom bar. DOM order matches visual order at all breakpoints. |
| **Mobile two-column grid** | *(Rev 1.1)* The Practice and Firm groups are **two separate `<nav>` elements placed side by side** via `grid-template-columns: repeat(2, 1fr)` on their shared parent — **not** a single list flowed into two columns. This guarantees DOM order matches reading order without relying on `grid-auto-flow`. Do not use CSS `columns` here: it flows items down-then-across, which would put "Criminal Defense" and "About" in the same visual row while being adjacent in neither list. |
| Contrast | Minimum 5.9:1 (column headings, disclaimer, bottom bar) |
| Touch targets | Desktop links 40px effective height. Mobile links 44px minimum. Phone link 48px. |
| Reduced motion | See §8 |
| Text spacing | No fixed heights anywhere. The disclaimer grows freely. |

**Duplicate-link warning.** The footer's Practice Areas group repeats the mega menu's links. This is expected and correct for a footer, but each link must have a unique, self-describing accessible name — no "here" or "more" — so that a screen reader's link list remains usable.

## 10. Performance Considerations

| Item | Specification |
|---|---|
| Images | One inlined SVG (`logoLockupStacked.svg`, ≤4KB). No raster images. |
| Rendering | `content-visibility: auto; contain-intrinsic-size: 0 536px` |
| CLS | Zero. |
| Font | No new families or weights. |
| DOM | ~50 elements. |
| JS | **None.** The footer requires no JavaScript at all. |
| SEO | The NAP string here must match `LegalService` JSON-LD and the Google Business Profile **character for character** (Phase 1 §15.5). This is the canonical on-page NAP. |

> **`[GATED — Q5]`** Office hours are omitted pending confirmation. When supplied, they are added to `napBlock` as a fourth block beneath the phone.
>
> **`[GATED]` — disclaimer wording requires review.** The specimen text covers non-engagement, confidentiality, jurisdictions, and advertising notice — the four elements the research identifies as necessary. **Q15** asks whether the malpractice carrier or bar counsel has preferred language. Their wording supersedes this specimen entirely.
>
> **`[DECISION NEEDED]` — "Site by Nulo Studio" attribution.** Included in the specimen. Remove if the client prefers no vendor attribution.

---

# Part III — Homepage Flow Diagram

## III.1 The Descent

```
   SCROLL   SCENE      SECTION                 VISITOR'S QUESTION          EXIT PATHS
   ══════   ═════      ═══════                 ══════════════════          ══════════

     0%   ┌────────┐  ┌──────────────────┐
          │ LIGHT  │  │ S01 SITE HEADER  │   "Where am I?"              ☎ CALL ─────┐
          │#FAF8F5 │  │ S02 NAVIGATION   │   "Is my problem here?"      → Mega menu │
          │        │  ├──────────────────┤                                          │
          │        │  │ S04 HERO         │   "Who is this?"             ▣ FORM ─────┤
          │        │  │                  │   "Can he help me?"          ☎ CALL ─────┤
    10%   │        │  ├──────────────────┤                                          │
          │        │  │ S05 TRUST STRIP  │   "Is he real?"                          │
    18%   └────────┘  ├──────────────────┤                                          │
          ╔════════╗  │ S06 POSITIONING  │   "Does he understand                    │
          ║ CROSS  ║  │     STATEMENT    │    what this feels like?"                │
          ║ FADE   ║  │                  │                                          │
          ╚════════╝  ├──────────────────┤                                          │
    28%   ┌────────┐  │ S07 ATTORNEY     │   "What are his                          │
          │ DUSK   │  │     INTRODUCTION │    actual credentials?"      → /attorney/│
          │#18181B │  ├──────────────────┤                                          │
    38%   │        │  │ S08 PROCESS      │   "What happens if                       │
          │        │  │  ★ KEY SECTION   │    I actually call?"         ☎ CALL ─────┤
    46%   │        │  ├──────────────────┤                                          │
          │        │  │ S09 REVIEWS      │   "Does anyone else                      │
          │        │  │                  │    vouch for him?"           → Google    │
    50%   └────────┘  │                  │                                          │
          ╔════════╗  │                  │                                          │
          ║ CROSS  ║  │                  │                                          │
          ║ FADE   ║  │                  │                                          │
          ╚════════╝  ├──────────────────┤                                          │
    58%   ┌────────┐  │ S10 PRACTICE     │   "Which one is                          │
          │ DARK   │  │     AREAS        │    my situation?"            → 6 practice│
          │#0B0B0D │  │  ★ PRIMARY       │                                 pages    │
          │        │  │    CONVERSION    │   "None of these fit"        → Triage ───┤
    70%   │        │  ├──────────────────┤                                          │
          │        │  │ S11 SERVICE      │   "Does he practice                      │
          │        │  │     AREAS        │    where my case is?"                    │
    78%   │        │  ├──────────────────┤                                          │
          │        │  │ S12 FAQ PREVIEW  │   "Is my question                        │
          │        │  │                  │    normal?"                  → /faq/     │
    88%   │        │  ├──────────────────┤                                          │
          │#060607 │  │ S13 FINAL CTA    │   "Alright — how do                      │
          │        │  │  ★ CONVERSION    │    I start?"                 ▣ FORM ─────┤
    94%   │        │  ├──────────────────┤                              ☎ CALL ─────┤
          │#060607 │  │ S14 FOOTER       │   "Anything else                         │
   100%   └────────┘  └──────────────────┘    I should check?"          → all pages  │
                                                                                     │
                                                                                     ▼
                                                                          ┌──────────────────┐
                                                                          │  /contact/       │
                                                                          │  or a phone call │
                                                                          └──────────────────┘
```

## III.2 The Four Visitor Types

The research identifies distinct audience segments with different urgency profiles. The page is designed so each reaches conversion by a different route — none is required to read the whole page.

| Visitor | Arrives | Reads | Converts at | Design accommodation |
|---|---|---|---|---|
| **The emergency** — arrested last night, OVI, protection order | Mobile, high urgency, often after hours | S04 only, often not even that | **S01 header phone button**, within 5 seconds | The persistent mobile phone button exists entirely for this person. They must never have to scroll to find a number. |
| **The comparer** — divorce, custody, comparing 3–4 attorneys | Desktop or mobile, mid-urgency | S04 → S07 → S08 → S09, then S10 | S13, or a practice page | The process section (S08) is what wins this visitor. It is the differentiator no local competitor offers. |
| **The planner** — estate planning, wills, probate | Desktop, low urgency, older demographic | Full page, slowly | S10 → practice page → later return | Larger type throughout, generous line-height, no time pressure, no urgency language. |
| **The uncertain** — "I don't know what kind of lawyer I need" | Any device | S04 → S10, scanning for recognition | **Triage tile in S10** | Explicitly designed for this person, per Phase 1 Rec 20.4. Without it they bounce. |

## III.3 Conversion Surfaces — Complete Inventory

Nine conversion opportunities across the page. No visitor should ever be more than one screen-height from one.

| # | Location | Type | Availability |
|---|---|---|---|
| 1 | S01 header CTA button | Form | Persistent, ≥1200px |
| 2 | S01 header phone link | Call | Persistent, ≥1440px |
| 3 | S01 header phone icon button | Call | **Persistent, <1200px** |
| 4 | S04 hero primary CTA | Form | Top of page |
| 5 | S04 hero phone CTA | Call | Top of page |
| 6 | S08 process step 1 phone | Call | Mobile only, inline |
| 7 | S10 triage tile | Call + form | Mid page |
| 8 | S13 final CTA button | Form | Bottom of page |
| 9 | S13 final phone CTA | Call | Bottom of page |

**Call and form are treated as equal-weight conversions throughout.** The research is unambiguous that this audience calls — five of the nine surfaces are phone.

---

# Part IV — Recommendations

## IV.1 UX Recommendations

**1. The process section is the site's competitive moat — treat it as such.**
No local competitor identified in the research explains what happens after contact. Burnside Brankamp has stronger CTA architecture; Hoover has longevity; KNR has content depth. None of them tells an anxious person what the next 48 hours look like. S08 should be replicated on every high-urgency practice page (criminal, OVI, protection orders), and it should be the first thing built after the homepage.

**2. Do not add a scroll indicator to the hero.**
The instinct will be strong, because the hero is 88vh with a lot of air. Resist it. A bouncing chevron is the single most template-signalling element in modern web design, and the trust strip's hairline rule already sits at the fold on most viewports, which is a sufficient continuation cue.

**3. Keep the FAQ answers genuinely useful, not teasers.**
The temptation is to write two-sentence answers that force a click to `/faq/`. That is a conversion tactic that reads as withholding — precisely wrong for a brand built on "answers the phone and tells you the truth." Answer the question completely; the visitor who wants more will click anyway.

**4. Resist adding a fifth navigation item and a seventh practice card.**
Both are constrained by measured limits (§S02 §2 and §S10 §8 respectively), and both will be pressured during content review. The constraints are documented so they can be defended.

**5. Plan the "no reviews" path now, not later.**
Q8 may return nothing usable. The verification-block alternative specified in S09 must be designed and approved in parallel, because discovering the gap during build means a rushed improvisation in the page's social-proof slot.

## IV.2 Conversion Recommendations

**1. Track phone calls as a first-class conversion from day one.**
Five of nine conversion surfaces are `tel:` links. If analytics measures only form submissions, the page will appear to underperform by a wide margin and the wrong conclusions will follow. Every `tel:` link needs event tracking with `beacon` transport so it never delays the dial.

**2. The consultation form should be short — and the page should say how short.**
The research lists cost uncertainty and process confusion as primary hesitation triggers. Adding "Takes about a minute" beneath the S13 CTA is a small, honest friction-reducer. It should only be added if the `/contact/` form genuinely is that short — which is itself a recommendation for the Phase 3 contact page.

**3. Make the triage tile measurable.**
The "Not sure where you fit?" tile (S10) tests a specific hypothesis: that a meaningful share of visitors bounce because no practice card matched. Tag it distinctly in analytics. If it draws real traffic, it justifies building a proper triage page in Tier 2. If it draws none, the hypothesis was wrong and it can be removed.

**4. Do not add exit-intent modals, chat widgets, or sticky bottom bars.**
All three raise conversion on many sites. All three are wrong here. The research warns this market distrusts lawyer advertising and specifically flags that unstaffed live chat "may create a communication problem" — which is this firm's documented weakness. The page converts by being trustworthy, and interruption patterns cost trust faster than they gain clicks.

**5. Set the header CTA copy against the actual consultation model.**
"Request a consultation" is safe under any Q4 answer. "Free consultation" converts better but is a fee claim. Once Q4 resolves, the stronger copy should be used everywhere or nowhere — inconsistency between the header, hero, and final CTA reads as carelessness.

## IV.3 Mobile Usability Recommendations

**1. The header phone button is the single most important element on mobile. Protect it.**
It is the above-the-fold conversion guarantee that permits the hero to breathe. During QA it must be verified as reachable and tappable at 375px, at 400% zoom, with the mobile menu closed and open, and while the header is in its hide-on-scroll-down state (it must return on any upward scroll).

**2. Verify the hero on a real 375 × 667 device, not an emulator.**
The specification accepts that the hero's secondary CTA falls below the fold on the smallest devices. That trade-off must be confirmed against a real device with real browser chrome before it is accepted, because emulators under-report chrome height.

**3. Test the practice list rows with a thumb, not a cursor.**
Six 76px rows in sequence is a thumb-reach pattern. Confirm that the rows are comfortably tappable in the lower two-thirds of a 6.1" screen and that no row's arrow glyph is mistaken for a separate control.

**4. The mobile menu's 32px Cormorant must be tested at small sizes.**
Cormorant Garamond has fine hairlines. At 32px on a 2x display it is beautiful; on an older 1.5x Android display it may thin out. If it does, the fallback is weight 600 rather than a size reduction — the size is what makes the menu premium.

**5. Check the full-bleed images at 430px.**
S04's hero band and S07's environmental portrait both escape the container gutter. iPhone Pro Max widths (430px) are the most likely place for a 1px horizontal overflow to appear. This is the classic source of unintended horizontal scroll.

## IV.4 Opportunities to Feel More Premium (Within the Established Vision)

Each of these strengthens the existing direction. None changes it.

**1. Commission the photography as a single art-directed session, not a headshot appointment.**
The specification requires eight distinct images (Phase 1 §18.3). Shot together, with consistent lighting, wardrobe, and grade, they will read as one visual system. Shot piecemeal, they will read as stock. This is the highest-leverage premium investment available and it costs no additional design work.

**2. Draw the wordmark rather than setting it.**
The office door signage (`suite206PortsmouthOH.webp`) shows the real applied mark. Redrawing the lockup as true vector outlines — rather than live Cormorant text — means it renders identically everywhere, scales to print, and can be optically adjusted at small sizes. It also means the website's mark and the physical office's mark are the same object, which is a genuine premium signal that most small firms never achieve.

**3. Use real tabular figures for the phone number.**
Inter's tabular figure set (`font-variant-numeric: tabular-nums`) makes "(740) 529-1420" sit evenly rather than with the ragged spacing proportional figures produce. It appears in the header, hero, process section, final CTA, and footer — five places where a small typographic correctness compounds.

**4. Grade all photography to a single, documented look.**
One LUT or one documented adjustment set applied to every image. The specification already calls for −8% saturation and a +2% warm lift on the hero portrait; extending that treatment across all eight images is what makes photography feel commissioned rather than collected.

**5. Let the scene transition be slightly asymmetric.**
The light → dusk crossfade at S06 is the page's most emotionally significant moment. Running it at 900ms while the dusk → dark transition at S09 runs at 700ms would make the first feel more consequential than the second — which it is. This is a one-line change and a genuinely refined detail. **Flagged as optional**, because it introduces a second scene duration token and mild inconsistency; it should be approved explicitly rather than assumed.

**6. Set the `<title>` and OG image with the same care as the page.**
The first impression for a large share of visitors is a Google result or a shared link, not the hero. A properly composed OG image (wordmark, portrait, gold rule, on `#0B0B0D`) is 20 minutes of work that is seen more often than the footer.

---

# Part V — Phase 2 Approval Checklist

**No production code may be written until every item in Sections A and B is resolved.** Sections C and D may be resolved in parallel with the Phase 3 design-system build.

## A. Client Decisions — Blocking

These gate the homepage's content and cannot be resolved by the studio.

| ☐ | Ref | Item | Blocks |
|---|---|---|---|
| ☐ | **Q1** | Practice-area priority order confirmed | S10 card order and selection |
| ☐ | **Q2** | Personal injury — genuine focus or occasional? | Whether PI replaces a card in S10 |
| ☐ | **Q3** | Kentucky matters actively handled? Which counties? | S11 Kentucky column; dual-state claims sitewide |
| ☐ | **Q4** | Consultation model and fee structure | S05 item 3, S08 step 2, S13 supporting line, all CTA copy |
| ☐ | **Q5** | Actual office hours and after-hours intake process | S08 step 1 response promise, S13 and S14 NAP blocks |
| ☐ | **Q8** | Which testimonials may be used? Written permission held? | S09 entirely, including whether the empty-state alternative is needed |
| ☐ | **Q14** | Is there staff beyond the attorney — "I" or "we"? | **Every section's voice.** Highest-reach open question. |
| ☐ | — | Current, verified Google rating and review count | S09 rating badge |
| ☐ | — | "Site by Nulo Studio" attribution — keep or remove? | S14 bottom bar |
| ☐ | **Rev 1.1** | **Hero H1: keep the editorial headline, or adopt the SEO fallback "Serious counsel in southern Ohio"?** Recommendation: keep editorial; the three compensating changes in S04 §6 carry local intent. | S04 H1, and the page's SEO posture |

## B. Studio Decisions — Blocking

| ☐ | Ref | Item |
|---|---|---|
| ☐ | **R1** | Professional photography commissioned and delivered at ≥2400px (hero portrait, environmental portrait minimum) |
| ☐ | **R2** | Logo redrawn as SVG with `fill: currentColor` on the wordmark — horizontal, stacked, and mark-only variants |
| ☐ | **S11** | Line map asset — **approved or declined**. If declined, S11's left column drops it and padding reduces. |
| ☐ | **§3** | Specimen copy reviewed and replaced with approved copy for all 14 sections |
| ☐ | **§S06** | Voice decision applied consistently across all specimen copy once Q14 resolves |
| ☐ | — | Hero H1 final copy confirmed, and its three-line break verified at 375px, 768px, and 1440px |

## C. Design Verification — Before Build Sign-off

| ☐ | Item | Method |
|---|---|---|
| ☐ | **S06 mid-transition contrast** | Sample computed foreground/background at 10% increments through the 900ms light→dusk crossfade; confirm ≥4.5:1 at every sample for the paragraph text. **This is the single highest-risk accessibility item in the specification.** |
| ☐ | Full contrast re-audit | Every value in every §7 re-verified against the built CSS, not the spec |
| ☐ | Art-directed line breaks | Hero H1 (3 lines), S06 statement (5 lines), S13 heading (2/3 lines) verified at all reference viewports |
| ☐ | Type scale rendering | Cormorant at 46px, 26px, and 32px confirmed legible on a 1.5x-density Android display |
| ☐ | Gold budget | Each section's painted gold area measured against the 3% ceiling; confirm no viewport shows two filled gold elements |
| ☐ | Scene continuity | Header token inversion verified across both transitions with the header in both rest and compact states |
| ☐ | No horizontal overflow | 320px, 375px, 390px, 430px — with particular attention to S04 and S07 full-bleed images |
| ☐ | **`lg` tier (1024–1199px)** | Every section verified at **1024 × 768 and 1180 × 820** against the I.8 rule. Confirm S04's 12-column hero variant and S09's two-column reviews. |
| ☐ | **Alpha-composite contrast re-verification** | **Every `rgba()` value used as a border, stroke, or icon must be composited against its actual backdrop and measured.** Rev 1.1 found four asserted ratios wrong, all failing 3:1. Do not trust a stated ratio in this document without re-measuring it against the built CSS. |
| ☐ | Hero geometry | Confirm the portrait's feathered base lands exactly on S05's hairline at 1200, 1440, and 1920px, per the S04 §2 calculation |
| ☐ | `contain-intrinsic-size` | `auto` keyword present on every instance; scrollbar thumb stable on a full-page scroll at 375px and 1440px |
| ☐ | Z-index audit | No `z-index` outside the I.9 scale appears in the built CSS |
| ☐ | Forced colors | Page usable in Windows High Contrast Mode; hairlines and button borders survive (I.13) |

## D. Accessibility & Performance Gates

| ☐ | Item | Target |
|---|---|---|
| ☐ | Keyboard traversal | Full page, no mouse. Focus visible at every stop, never obscured by the sticky header. |
| ☐ | Screen reader | NVDA + Firefox and VoiceOver + iOS. Verify: hero H1 announces as one heading; S09 has a visually-hidden `<h2>`; footer nav landmarks are distinctly labelled. |
| ☐ | Mega menu | Disclosure pattern verified — `Escape` closes, focus returns, no trap, no `role="menu"` |
| ☐ | Mobile overlay | Modal pattern verified — focus trapped, `inert` background, scroll locked and restored |
| ☐ | Reduced motion | Every section renders correctly with `prefers-reduced-motion: reduce`. **Scenes still change; nothing animates.** |
| ☐ | Zoom / reflow | 200% and 400% on a 1280px viewport, no horizontal scroll |
| ☐ | Text spacing | SC 1.4.12 values applied, no clipping in any section |
| ☐ | LCP | < 1.8s on throttled 4G; target < 1.2s |
| ☐ | CLS | < 0.05; target 0.00. Verify font swap produces zero shift. |
| ☐ | INP | < 200ms; target < 120ms. Mega menu and accordion under 100ms. |
| ☐ | Page weight | ≤ 600KB total, ≤ 28 requests |
| ☐ | Zero third-party requests | No fonts CDN, no maps embed, no review widget, no chat |
| ☐ | Mid-range Android | Scene crossfade, S11 map draw, and hero portrait mask verified on real hardware — not DevTools throttling |

## E. Compliance Gate

| ☐ | Item |
|---|---|
| ☐ | Every factual claim on the page traced to the verified table in `deep-research-report.md` or to written client confirmation (Phase 1 §15.7) |
| ☐ | No superlatives, no specialisation claims, no implied outcomes anywhere in final copy |
| ☐ | S12 FAQ answers reviewed by the attorney for current legal accuracy — including the "roughly ten days" statutory reference |
| ☐ | S14 disclaimer wording approved, or replaced with carrier/bar-counsel preferred language (**Q15**) |
| ☐ | Testimonial permissions documented and on file (**Q8**) |
| ☐ | Rating figure current as of launch date, with a plan for keeping it current |

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Client — Austin G. Ervin | ______________________ | __________ |
| Nulo Studio — Design Lead | ______________________ | __________ |

**On approval, Phase 3 begins:** design system build (`tokens.css`, `base.css`, `layout.css`), gated on R2 (SVG logos).

---

**End of Phase 2 Homepage UX & Visual Specification.**

*This document specifies the homepage only. Interior page templates are Phase 6 per the Phase 1 sequence. No production code has been written.*

