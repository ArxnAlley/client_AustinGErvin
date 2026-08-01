# Austin G. Ervin, Attorney at Law — Production Build Plan

**Prepared by:** Nulo Studio — Principal Engineer
**Date:** July 31, 2026
**Status:** **The transition document.** Planning is complete; this governs production.
**Supersedes for build sequencing:** nothing. It sequences work already specified elsewhere.

> **This document adds no new design and no new architecture.** Every dimension, token, timing value, and behaviour it references is already specified in `Austin_Phase1_ImplementationPlan.md`, `Austin_Phase2_HomepageSpecification.md`, `Austin_MotionLanguage.md`, `NLF_RuleRegistry.md`, and `NLF_SchemaSpecification.md`. Its only job is to state **what gets built, in what order, and what stops the build.**

---

# 0. Reconciliations Before Work Begins

Four discrepancies surfaced while reviewing the source documents. Each is resolved here rather than discovered at milestone six.

## 0.1 There is no Video section — and video is prohibited

The requested component order lists **Video**. The approved homepage is **14 sections, S01–S14** (frozen decision A6), and none is video. The only occurrence of the word in any Austin specification is in `Austin_MotionLanguage.md` §10, in the **prohibitions** table:

> *"Video backgrounds — Expensive, distracting, and hostile to this audience's connections."*

A video section would also breach **PERF-006** (≤600KB page weight), **PERF-003** (zero third-party requests), and the LCP target of <1.2s on rural 4G — the network reality this audience actually has.

**Resolution: excluded from the build.** If video is genuinely new scope, it is a change to a frozen decision and needs an explicit call, not a silent insertion. **This is the one item in this plan awaiting your decision; nothing else is blocked by it.**

## 0.2 The requested component list is a subset of the approved sections

Four approved sections were absent from the requested order. All are built.

| Approved section | In requested list | Note |
|---|---|---|
| S03 Mega Menu | ✗ | **Deferred to Tier 2 anyway** — see §0.3 |
| S06 Positioning Statement | ✗ | **Owns the light → dusk scene transition.** Structural. |
| S08 Process | ✗ | **Non-optional** (frozen A10). The competitive moat — see §7.2 |
| S11 Service Areas | ✗ | Local SEO spine |

## 0.3 The mega menu does not ship at Tier 1

Framework v1.1 keys the mega panel on **item count ≥ 9** at depth 0–1. Austin's Tier 1 inventory is **8 practice areas**, which is below the threshold.

**S03 is not built at Tier 1.** "Practice Areas" ships as a plain link to the hub. The panel activates at Tier 2 (15 areas). This is owed correction 12 in `project_next_session.md` and was explicitly decided rather than drifted into — lowering the threshold to preserve the spec would be FR-04 recurring.

## 0.4 The source structure is the framework's, not Phase 1 §16's

`Austin_Phase1_ImplementationPlan.md` §16 describes hand-authored HTML — one file per page. That was correct for a one-off client build and was **formally reversed** when the objective became "framework" (`project_memory.md` §2.7). Frozen decisions **F1** (content-as-data), **F2** (Eleventy), and **F7** (versioned dependency) govern.

**The emitted URLs are exactly Phase 1 §16's. The source that produces them is not.** §1 gives both.

---

# 1. Folder Architecture

## 1.1 The client repository — the only files that differ between firms

```
client_AustinGErvin/
│
├── nlf.config.json                 Pins nlf@1.x. MNT-007.
│
├── data/                           ← 17 JSON sources
│   ├── theme.json                  Brand contract. 20 rules enforce it.
│   ├── firm.json                   Legal identity, NAP of record
│   ├── attorneys.json              Austin — credentials, admissions
│   ├── practiceAreas.json          8 at Tier 1
│   ├── clusters.json               criminal · family · estate
│   ├── locations.json              Suite 206
│   ├── serviceAreas.json           6 counties, tier-phased
│   ├── jurisdictions.json          OH, KY — terminology + ad rules
│   ├── testimonials.json           Gated on Q8
│   ├── caseResults.json            Empty at Tier 1
│   ├── faqs.json
│   ├── navigation.json
│   ├── seo.json
│   ├── contact.json
│   ├── social.json
│   ├── compliance.json
│   └── industries.json             Absent — no cost when absent
│
├── content/                        ← Markdown prose, front-mattered
│   ├── attorneys/austin-g-ervin.md
│   ├── practiceAreas/*.md          8 files
│   ├── faqs/*.md
│   ├── serviceAreas/*.md           Tier 2/3
│   ├── disclaimers/*.md
│   └── pages/*.md                  Legal + utility pages
│
├── assets/                         ← Source assets, pre-optimisation
│   ├── images/                     Originals ≥2400px long edge
│   ├── fonts/                      Subset woff2 only
│   ├── icons/iconSprite.svg        One sprite, symbol-referenced
│   ├── logos/                      SVG, currentColor (R2)
│   ├── favicons/
│   └── social/                     og images 1200×630
│
├── docs/                           ← This folder
│
└── _site/                          ← Generated. Never edited. Git-ignored.
```

## 1.2 The emitted site — unchanged from Phase 1 §16

```
_site/
├── index.html · 404.html · thank-you/
├── robots.txt · sitemap.xml · site.webmanifest
├── about/ · attorney/ · contact/ · faq/
├── practice-areas/
│   ├── index.html
│   └── criminal-defense/ · ovi-dui/ · family-law/ · divorce/
│       child-custody/ · protection-orders/ · estate-planning/ · probate/
├── service-areas/                  Tier 2/3
├── disclaimer/ · privacy-policy/ · accessibility-statement/
├── css/
│   ├── tokens.css        Layer 0 — generated from theme.json
│   ├── base.css          Layer 1 — reset, root type, focus, print
│   ├── layout.css        Layer 2 — container, grid, section, flow
│   ├── components.css    Layer 3 — reusable components
│   ├── styleIndex.css    Layer 4 — homepage compositions
│   ├── stylePages.css    Layer 4 — interior compositions
│   └── utilities.css     Layer 5 — escape hatches
├── js/
│   ├── siteJS.js         Nav, mega menu, mobile menu, accordions, reveals, form
│   └── indexJS.js        Scene observer, hero parallax, loading curtain
├── graphics/             logos · images · icons · favicons · social
└── fonts/                inter-variable-subset · cormorant-600 · cormorant-500
```

**`tokens.css` is generated from `theme.json`, never hand-edited.** That is what makes ACC-002's contrast gate meaningful — the values the validator checks are the values that ship.

## 1.3 Exploration artefacts

`graphics/logos/TPLogo1.png`, `logo1.png`, `theOne_Logo.png`, `theTwo_Logo.png`, `potentialFavicon.png` move to `assets/_source/`. **They are not deleted** — they are the fidelity reference for the SVG redraw (R2).

---

# 2. Build Order

## 2.1 The governing principle

> **Build the spine before the surface, and the risky before the visible.**

Sections are *not* built in visual order. They are built so that every milestone produces something that runs, and so the two genuinely uncertain systems — the scene descent and the computed navigation — are proven while they are still cheap to change.

## 2.2 Order and rationale

| # | Built | Why here |
|---|---|---|
| 1 | **`theme.json`** | Every rule that governs appearance enforces against it. It is the only source with a schema and a working validator today, so the first thing built is also the first thing *verified*. |
| 2 | **`tokens.css`** | Generated from `theme.json`. Nothing can be styled before tokens exist, and hand-writing them would break the chain that makes ACC-002 real. |
| 3 | **base + layout** | The 1240px container and 12-column grid are the alignment spine. Every section's left edge derives from them. |
| 4 | **Global chrome** (S01, S02, S14) | Present on all 25 pages. Also where **RES-002**'s computed nav width is proven — the one framework mechanism that is sound in principle and unbuilt. |
| 5 | **Light scene** (S04, S05) | Establishes the hero type scale at its most extreme (104px → 46px). If the type system survives the hero, it survives everything. |
| 6 | **Scene system + first transition** (S06) | The highest technical risk in the project (P6). Proven with two real scenes, not stubs, and on real mid-range hardware. |
| 7 | **Dusk** (S07, S08) → **second transition** (S09) → **dark** (S10–S12) → **conversion** (S13) | The descent completes in order once the mechanism is proven. |
| 8 | **Motion** | Last, deliberately — §4.1. |
| 9 | **SEO, interior templates, QA, launch** | — |

## 2.3 Why the hero is not first

The hero is the most visible section and the LCP owner, which argues for building it first. It is built **fifth** because:

- Its portrait is **blocked on R1** and does not exist at any usable resolution
- Its structure can be built and verified with a placeholder; its image is a swap, not a rebuild
- Measuring LCP against a nearly-empty page is meaningless — the budget only means something once there is a page

**Building the hero early and its image late is the correct split.** Building the whole hero last would delay the type system that everything else inherits.

---

# 3. Component Order

Mapped from the requested order onto the approved component inventory (`Austin_Phase1_ImplementationPlan.md` §11). Primitives precede the molecules that consume them; molecules precede organisms.

| # | Component | Layer | Milestone | Depends on |
|---|---|---|---|---|
| 1 | `buttonPrimary`, `buttonGhost`, `buttonText`, `linkArrow`, `eyebrow`, `divider`, `visuallyHidden` | Primitive | M1 | tokens |
| 2 | `iconShield` + `iconSprite.svg` | Primitive | M1 | R2 |
| 3 | `logoLockup` | Molecule | M2 | **R2** |
| 4 | **`siteHeader`, `primaryNav`, `mobileMenu`** | Organism | M2 | logoLockup, RES-002 |
| 5 | **`siteFooter`**, `disclaimerBlock` | Organism | M2 | NAP from `locations[primaryLocation]` |
| 6 | **`heroSection`** | Organism | M3 | **R1** for the portrait |
| 7 | **`trustItem` → trust strip** | Molecule → Organism | M3 | Verified claims only (LEG-001) |
| 8 | `sceneBackdrop` | Organism | M4 | tokens, IntersectionObserver |
| 9 | `statementBlock` (S06) | Organism | M4 | Owns light → dusk |
| 10 | **`attorneySection`** + `credentialItem` | Organism | M5 | **R1** for bio portrait |
| 11 | `processStep` → **`processSection`** | Molecule → Organism | M5 | `contact.responseTimePromise` |
| 12 | **`reviewCard` → `reviewsSection`** | Molecule → Organism | M6 | **Q8.** Falls back to verification block at n=0 |
| 13 | **`practiceCard` → `practiceGrid`** | Molecule → Organism | M7 | Most-reused component in the system |
| 14 | `countyLink` → `serviceAreaSection` | Molecule → Organism | M7 | — |
| 15 | **`accordionItem` → `accordionGroup`** (FAQ) | Molecule → Organism | M7 | Native `<details>` |
| 16 | **`finalCtaSection`** | Organism | M8 | Sunken surface — see §7.5 |
| 17 | `formField` → `contactForm` | Molecule → Organism | M11 | **R5** form endpoint |
| 18 | `breadcrumbNav`, `pageHero` | Molecule / Organism | M11 | Interior pages |
| 19 | **Motion layer** | Cross-cutting | M9 | Everything above |
| 20 | **Accessibility gate** | Cross-cutting | M12 | Everything |
| 21 | **SEO + structured data** | Cross-cutting | M10 | `data/` complete |
| 22 | **Performance gate** | Cross-cutting | M12 | Everything |

**`ratingBadge` is not built at Tier 1.** It requires a verified, permission-cleared aggregate rating, and LEG-006 fails it past 90 days. It ships when Q8 is answered and a rating is captured, not before.

**Correction owed:** Phase 1 §11.1 specifies `buttonGhost` with `--borderStrong`, which is **deprecated** — it measured 1.73–1.86:1 and fails SC 1.4.11 in every scene. **`buttonGhost` uses `--borderInteractive`.** Phase 2 §I.10 already corrected this; the Phase 1 component table was not updated.

---

# 4. Animation Integration

Motion is specified completely in `Austin_MotionLanguage.md`. This section states only **when it enters and what it depends on.**

## 4.1 Motion is the last layer, and that is a requirement

> **The mute test** (`Austin_MotionLanguage.md`, frozen M-series): *remove the entire motion system and the site must be complete, correct, and still clearly premium.*

Building motion last is how the mute test is guaranteed rather than hoped for. If the site is finished before motion is added, motion **cannot** be load-bearing. If motion is built alongside, it silently becomes structural and the test becomes unprovable.

**Motion never gates content. Deleting the motion layer must break nothing except the appearance of motion.**

## 4.2 Entry points

| Motion | Enters at | Depends on | Performance note |
|---|---|---|---|
| **Loading curtain** (§6) | M9 | Header, hero, monogram SVG (**R2**) | First-visit only, time-boxed, escapable. **Phone renders above the curtain and is interactive from frame 1.** |
| **Monogram travel** (§6) | M9 | Curtain, `logoLockup` | `transform` only. The signature moment — the mark takes its seat in the header. |
| **Hero entrance** (§7) | M9 | Hero complete, fonts loaded | Must not compete with LCP. Fires after the LCP image decodes. |
| **Scroll reveals** (§8) | M9 | All sections | `IntersectionObserver` only (**PERF-008**). Fires once, observers disconnect. Elements already in view at first observation get final state with **no** transition. |
| **Scene descent** (§10) | **M4** — the exception | `sceneBackdrop`, both triggers | The only motion built early, because it *is* the architecture rather than a layer over it. Opacity-only crossfade. |
| **Component motion** (§9) | M9 | Each component | `transform`/`opacity` only (**MOT-001**). No motion on any CTA. |
| **Hero parallax** (§10) | M9 | Hero, R1 | **One element only.** No multi-layer parallax. |

## 4.3 Loading order at runtime

```
1. HTML parses; phone link is in the DOM and tappable
2. Critical CSS applies; curtain paints above everything
3. Fonts preload (≤2 files); metric-matched fallbacks prevent shift
4. LCP image decodes
5. Curtain lifts — on asset-ready, on any input, or on hard time-box
6. Monogram travels into the header
7. Hero entrance sequence
8. IntersectionObservers attach; scroll reveals become live
```

**There is no failure mode in which a visitor is held on the loading screen.** Asset failure lifts it immediately. Deep links, repeat visits, slow connections, data-saver, and `prefers-reduced-motion` skip it entirely.

## 4.4 Performance constraints

- **`transform` and `opacity` only.** Never `width`, `height`, `top`, `box-shadow` (MOT-001).
- **All durations from `theme.motion`.** A bespoke value fails the build (MOT-002).
- **Zero scroll listeners** (PERF-008).
- **JS budget ≤10KB gzipped**, motion included (PERF-002).
- **Reduced motion:** all motion removed; scene changes persist at a **200ms floor, never 1ms** — a near-instant full-viewport luminance inversion strobes, which is the exact event the preference exists to prevent (ACC-007, schema-enforced as `const: 200`).

---

# 5. Responsive Strategy

Six tiers, from `Austin_Phase2_HomepageSpecification.md` §I.1. **Every component defines all six** (RES-001).

| Requested name | Tier | Range | Grid | Container | Gutter |
|---|---|---|---|---|---|
| **Desktop (wide)** | `2xl` | ≥1440px | 12 col | 1240px | 51–64px |
| **Desktop** | `xl` | 1200–1439px | 12 col | ≤1240px | 44–51px |
| **Laptop** | `lg` | 1024–1199px | 12 col | fluid | 41–44px |
| **Tablet** | `md` | 768–1023px | 8 col | fluid | 31–41px |
| **Large Mobile** | `sm` | 480–767px | 4 col | fluid | 22–31px |
| **Small Mobile** | `xs` | <480px | 4 col | fluid | 20px |

## 5.1 One governing breakpoint

**1200px.** Navigation collapses to the hamburger below it *and* the hero switches composition at the same point. One number governs both, deliberately.

**It is derived, not chosen** (RES-002). The computed nav width is measured from Austin's actual lockup, labels, CTA copy, and glyph advance widths, and re-derived whenever nav items change. The framework's model reproduces Phase 2's independent hand measurement to within 3px (1149 vs 1152).

## 5.2 The `lg` tier is not an afterthought

1024–1199px was undefined for **12 of 14 sections** in the first Phase 2 draft — the single largest systematic gap the design review found. §I.8 now carries a global `lg` rule with three named exceptions. **Every section is verified at 1024px explicitly**, not interpolated.

## 5.3 Mobile is composed, not stacked

- Practice cards become **76px list rows**, not shrunken cards — a list row scans measurably faster under stress (frozen A11)
- Hero H1 stays **≥44px** (RES-008). Display headings stay large on mobile.
- Primary CTA above the fold at 375×667 **with browser chrome** (RES-005)
- No horizontal overflow at 320/375/390/430 (RES-006); reflow to 320px; usable at 400% zoom (RES-007)

**QA viewports:** 375×667, 390×844, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080.

---

# 6. Asset Checklist

**Measured July 31, 2026** by reading image headers directly — not taken from prior documents, two of which recorded these incorrectly.

## 6.1 Available

| Asset | Measured | Usable for |
|---|---|---|
| `images/AustinGErvin_AttorneyAtLaw.jpg` | **400×400**, 19KB | Reference only |
| `images/owner_AustinGErvin.webp` | **659×510**, 24KB | Reference only |
| `images/suite206PortsmouthOH.webp` | **382×510**, 26KB | **Fidelity reference for the SVG redraw** — shows the firm's real applied signage |
| `images/suite206_PortsmouthOH.webp` | **382×510**, 21KB | Duplicate |
| `logos/logo1.png` | **1254×1254**, 862KB | Redraw source |
| `logos/theOne_Logo.png` | **1024×1024**, 1.40MB | Redraw source |
| `logos/theTwo_Logo.png` | **1024×1024**, 1.37MB | Redraw source |
| `logos/TPLogo1.png` | **1024×1024**, 1.42MB | Redraw source |
| `logos/potentialFavicon.png` | **1024×1024**, 1.34MB | Favicon redraw source |
| `logos/ogLogo.webp` | **500×500**, 18KB | Below the 1200×630 og requirement |

> **Two corrections to the record.** `project_current_state.md` §9.4 states the WebP portrait is 147×254 — it is **659×510**. It also states there are two logo PNGs at 1024px — there are **five**, one of which is 1254px. Neither error changes the conclusion: **R1 and R2 both still block.**

## 6.2 Missing — required before implementation

| ID | Asset | Blocks | Owner |
|---|---|---|---|
| **R2** | **Logo as SVG** — mark, horizontal lockup, stacked lockup, wordmark. Wordmark must use `fill: currentColor` (**MNT-010**, build-enforced) | `logoLockup`, `siteHeader`, `siteFooter`, favicon, loading curtain monogram | **Studio** |
| — | `iconSprite.svg` — one sprite, symbol-referenced | `iconShield`, `trustItem`, `practiceCard` | Studio |
| — | Subset `woff2` — Inter variable, Cormorant 500/600 | `tokens.css`, all typography | Studio |

**R2 is the hard one.** A hardcoded wordmark fill becomes invisible as the header crosses light → dark. It does not merely look wrong; **it breaks the scene system**, which is the site's central device. The build fails on it by rule.

## 6.3 Missing — required before launch

| ID | Asset | Requirement | Owner |
|---|---|---|---|
| **R1** | **Hero portrait** | **≥2400px long edge.** Largest available is 659×510 — **27% of the required resolution.** Not fixable in code. | **Client** |
| **R3** | Bio portrait, environmental | ≥2400px | Client |
| — | Office photography | Exterior, interior | Client |
| — | `ogDefault.jpg` | 1200×630 | Studio |
| — | Favicon set | `.ico`, `.svg` (shield only), 180/192/512 PNG | Studio |
| — | All Tier 1 copy | **12,000–15,000 words**, compliant | Client / Studio |

**R3 (secondary):** the existing portrait's purple tie is near-complementary to gold and will fight the accent discipline. In preference order: reshoot with navy/charcoal/burgundy · grade to desaturate · crop tighter.

## 6.4 Optional enhancement

| Asset | Note |
|---|---|
| Region map (S11) | 4KB budget against simplified county boundaries. **The section is specified to work without it. Decline if the budget cannot be met.** |
| Courthouse / Portsmouth context photography | Local-context content, Tier 2/3 |
| `ogPracticeAreas.jpg` | Per-cluster og images |

---

# 7. Risk Assessment

## 7.1 Implementation risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| **I1** | **The scene system stutters on low-end Android.** A fixed backdrop with crossfading layers is the site's central device and its least certain one. | **High** | Opacity-only crossfade, `IntersectionObserver`, verified on **real mid-range hardware — not DevTools throttling**. Proven at M4, not M12. |
| **I2** | **RES-002's computed nav width is unproven in code.** It requires reading glyph advance widths from subset `woff2`. Sound in principle, never built. | **High** | Prototype at M2. Fallback: a per-firm manual measurement recorded in `theme.json` with a documented derivation. |
| **I3** | **The framework has no template layer.** Only the validation layer exists. Austin's build creates `templates/`, `components/`, and `styles/`. | **Medium** | Expected, not a surprise — this build is what brings them into existence. Scope it into M1–M8 rather than treating it as overhead. |
| **I4** | **Mid-transition contrast (S06).** The one accessibility property that cannot be verified from a specification. | **Medium** | Sample computed colours at 10% increments through the 900ms crossfade; confirm ≥4.5:1 at every sample. Already on the Phase 2 checklist. |
| **I5** | `::details-content` FAQ enhancement targets a young API. | Low | **Tier 1 (instant, zero JS) is a valid ship state.** Verify it is genuinely acceptable rather than a fallback nobody inspects. |

## 7.2 Content risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| **C1** | **Copy is the critical path and has not started.** 12,000–15,000 words of jurisdiction-accurate, compliant legal copy. **Copy determines the launch date, not code.** | **High** | Begin in parallel at M0. Per-page status tracking. Ship Tier 1 only when every page meets its module contract. |
| **C2** | **Q14 — does the firm speak as "I" or "we"?** Highest-reach open question; it changes every string. | **High** | `firm.voice` resolves it as data (CON-002). Populating `data/` at M0 surfaces it as a concrete validation failure rather than an email thread. |
| **C3** | **Q5 — hours and after-hours process.** The single highest-friction gap for the emergency visitor. | **High** | `locations.hours` **cannot be null** — the build fails without an answer. |
| **C4** | Q1–Q4, Q8 — practice priority, PI focus, Kentucky, fees, testimonials | Medium | Each maps to a required field. All surface at M0. |
| **C5** | **`responseTimePromise` is an operational commitment** the framework cannot verify. | Medium | **Requires written client confirmation before publication.** |

## 7.3 Asset risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| **A1** | **R1 photography does not arrive.** The hero cannot be built to specification at 659×510. | **High** | **Escalate as a commercial blocker, not a technical one.** No code path fixes it. |
| **A2** | **R2 SVG logos do not arrive.** Blocks the scene system, not just the logo. | **High** | Studio-owned. The office-door photo is the fidelity reference. |
| **A3** | Font byte budget vs Cormorant subsetting — **≤160KB total, ≤70KB per file** (TYP-008) | Medium | Measure at M1. Evaluate the variable cut. Budget is schema-enforced. |
| **A4** | Logo art carries a **"FORESTRV" typo** in a sibling project's asset set — verify Austin's wordmark spelling against the door signage before redraw | Low | Check at redraw time. |

## 7.4 Browser risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| **B1** | `content-visibility` + `contain-intrinsic-size` support variance | Medium | §I.12 uses the `auto` keyword. Progressive — absence costs performance, not correctness. |
| **B2** | `@font-face` metric override support (`size-adjust`, `ascent-override`) | Medium | Schema requires all four overrides. Absence degrades to a layout shift, not a broken page. |
| **B3** | `forced-colors` — hairlines and control borders must survive | Medium | ACC-012. Tested explicitly, not assumed. |
| **B4** | `:focus-visible` in older Safari | Low | Focus ring never removed without replacement (ACC-004). |
| **B5** | Native `<details>` cannot interpolate height | Low | Known and designed around — see I5. |

## 7.5 Accessibility risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| **X1** | **The light-scene sunken surface was never contrast-audited.** Phase 1 computed every token against `#F6F5F3`; `--surfaceSunken` on light is `#F0EDE7`, which is darker. The validator finds **five failures**: `focusRing` and `accentStroke` at **2.95:1** against a 3:1 floor, `textLink` at 4.28:1, `textSecondary`/`textMuted` at **4.49:1** against 4.5:1. | **High** | **`focusRing` at 2.95:1 is a keyboard-accessibility defect.** Resolve at M1 by deepening the affected tokens **or** by establishing that no control or text renders on the light sunken surface. Regression test already exists. |
| **X2** | **The 65+ estate-planning audience is served worst by this design.** Tracked-uppercase captions carrying real information, plus a light-on-dark lower half that produces halation with cataracts or astigmatism. Each element passes AA; together they tire this reader. | **High** | Caption tier raised to 14px, informational captions at `--textSecondary`, 17px floor on dark scenes. **Verify with a real reader, not a simulator.** |
| **X3** | **axe catches ~40% of WCAG issues.** A green CI badge creates false confidence. | **High** | Manual keyboard, screen-reader, and zoom audit is a **release gate**, not a one-time event (FR-09). |
| **X4** | Mid-transition contrast | Medium | See I4. |
| **X5** | Reduced-motion scene floor implemented as 1ms "for accessibility" | Low | Schema-enforced `const: 200`. Cannot regress. |

## 7.6 One programme risk, stated once

**P3 / FR-04 — encoding Profiles A–E as CI fixtures was scheduled *before* client work and is being deferred by this transition.** It is the only stated mitigation for "the reference implementation becomes the framework," a risk that already materialised **five times** in v1.0.

**This does not block Austin and should not.** The recommendation is that the five fixtures land **alongside** M1–M8 rather than after launch — each is data-only and costs hours, not days. Flagged once, not repeated.

---

# 8. Implementation Milestones

Fourteen milestones. **Every one produces working software** that can be opened in a browser or run in CI.

| # | Milestone | Ships | Gate |
|---|---|---|---|
| **M0** | **Foundation & validation** | `client_AustinGErvin/` scaffolded; `data/` populated from `deep-research-report.md`; `theme.json` authored; validation layer runs green | Schema + ACC-002 pass. **Q1–Q5, Q8, Q14 surface as enumerable failures.** |
| **M1** | **Design system** | `tokens.css` generated; `base.css`, `layout.css`; a blank page with correct type, spacing, and grid at all six tiers | **X1 resolved.** Font budget measured ≤160KB. |
| **M2** | **Global chrome** | `siteHeader`, `primaryNav`, `mobileMenu`, `siteFooter` on every page | **RES-002 computed nav proven in code.** Nav never wraps at any tier. |
| **M3** | **Light scene** | S04 Hero (placeholder portrait), S05 Trust Strip | Hero H1 breaks on exactly three lines at every breakpoint, 46px → 104px. |
| **M4** | **Scene system** | `sceneBackdrop`, IntersectionObserver, S06 Positioning owning light → dusk | **I1 verified on real mid-range Android.** DS-003: exactly two triggers. |
| **M5** | **Dusk scene** | S07 Attorney, S08 Process | Process section present and non-optional. |
| **M6** | **Second transition** | S09 Reviews owning dusk → dark; verification-block fallback at n=0 | I4 sampled at 10% increments through the crossfade. |
| **M7** | **Dark scene body** | S10 Practice Areas, S11 Service Areas, S12 FAQ | Practice cards → 76px rows on mobile. FAQ works with zero JS. |
| **M8** | **Conversion** | S13 Final CTA | **Homepage structurally complete and correct with zero motion — the mute test passes here.** |
| **M9** | **Motion layer** | All 15 motion sections applied | Deleting the motion layer leaves a complete site. Phone live during the curtain. |
| **M10** | **SEO & structured data** | JSON-LD from the same data that renders; `sitemap.xml`; NAP identical in footer, schema, and GBP export | SEO-005, SEO-007. Zero orphan pages. |
| **M11** | **Interior templates** | Practice hub + 8 detail pages, about, attorney, contact, FAQ, legal, 404, thank-you | DS-002: **one** scene transition per interior page, not three. |
| **M12** | **Performance & accessibility gate** | Lighthouse, axe, manual keyboard + screen reader + zoom, real-device | LCP <1.8s / CLS <0.05 / INP <200ms on throttled 4G. Page ≤600KB. **X3 manual audit signed off.** |
| **M13** | **Launch readiness** | DNS, headers, form endpoint, analytics, GBP alignment, citation cleanup, rank baseline | Final compliance sign-off by the attorney of record. |

**M8 is the most important checkpoint in this plan.** A complete, correct, premium-feeling homepage with no motion whatsoever. If it does not feel premium at M8, motion will not rescue it — and the mute test will have told us something true and cheap.

---

# 9. Success Criteria

A production-ready Austin website is one where **every one of these is true and verified, not asserted.**

## 9.1 Compliance — the framework's differentiating commitment

- [ ] **The build fails on any compliance violation.** Not warns.
- [ ] Every published claim traces to the verified-facts table or to written client confirmation
- [ ] No unverified claim renders in any template (**LEG-001**)
- [ ] No testimonial without documented permission (**LEG-002**)
- [ ] No practice area marketed into a jurisdiction with no admitted attorney (**LEG-004**)
- [ ] Attorney of record identified in the footer with office address (**LEG-011**)
- [ ] Undergraduate degree, awards, memberships, federal admissions, case results, years-in-practice: **absent unless confirmed**

## 9.2 Accessibility

- [ ] **WCAG 2.2 AA verified by manual audit**, not only axe
- [ ] Every contrast ratio **computed against its actual backdrop**, including alpha composites and the light sunken surface
- [ ] Full keyboard traversal; focus never lost, never invisible, never animated
- [ ] Screen-reader pass on the homepage and one practice page
- [ ] Usable at 400% zoom; reflows to 320px
- [ ] `prefers-reduced-motion` honoured with the 200ms scene floor

## 9.3 Performance — on the network this audience has

- [ ] LCP **<1.8s** (target <1.2s), CLS **<0.05** (target 0.00), INP **<200ms** on throttled 4G
- [ ] Page ≤600KB, ≤28 requests; CSS ≤18KB gzip; JS ≤10KB gzip; fonts ≤160KB
- [ ] **Zero third-party requests**
- [ ] Verified on real mid-range hardware

## 9.4 Correctness

- [ ] Every section defined at all six tiers, `lg` included
- [ ] Content renders with JavaScript disabled or failed
- [ ] **The phone number is reachable within ~3 seconds in every state, on every device, including during the loading curtain**
- [ ] The mute test passes
- [ ] NAP identical character-for-character in footer, JSON-LD, and GBP export

## 9.5 The framework test

- [ ] **Zero Austin-specific values in framework defaults.** Everything client-specific lives in `client_AustinGErvin/data/`.
- [ ] A second firm could be built by changing `data/`, `content/`, `assets/`, and `theme.json` — and nothing else

## 9.6 The human test

> **A frightened person, on a phone, at 11pm, on rural 4G, finds the phone number in under three seconds — and feels that the person behind it is competent, reachable, and safe.**

Everything above is in service of that sentence. If a decision improves a metric and damages that sentence, the metric loses.

---

**End of Production Build Plan.** Start at M0: scaffold the client site, populate `data/`, author `theme.json`, and run the validator.
