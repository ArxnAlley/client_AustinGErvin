# Austin G. Ervin, Attorney at Law, LLC

## Phase 1 — Architecture, Design System & Implementation Plan

**Prepared by:** Nulo Studio — Principal UX Architect / Technical Lead
**Date:** July 28, 2026
**Status:** Planning deliverable — awaiting approval. **No production code will be written until this document is approved.**

---

### Source Documents Consumed

| Document | Role in this plan |
|---|---|
| `Austin_ProjectFoundation.md` | Primary source of truth — brand vision, scenes, palette, typography, non-negotiables |
| `Austin_Phase0_ArchitectureBrief.md` | Navigation philosophy, hero direction, motion rules, deliverable list |
| `ChatGPT_DeepResearch_WorkingCopy.md` | Business goals, audience, trust signals, content strategy |
| `deep-research-report.md` (66 KB, full export) | **Verified facts**, NAP, practice list, geography, SEO clusters, FAQ bank, compliance constraints |
| `agents.md` / `codeStyle.md` | Engineering standards, naming, formatting, file structure |
| `graphics/` (10 files, audited) | Current asset inventory and readiness assessment |

> **Note on document reconciliation:** `ChatGPT_DeepResearch_WorkingCopy.md` states it is a reconstruction that "should later be replaced with the full exported Deep Research report." That full export is already present in the project root as `deep-research-report.md`. I have treated the full report as authoritative for **facts** (NAP, licensure, practice areas, geography) and the working copy as authoritative for **framing**. Where the Foundation and Phase 0 briefs speak to design, they override both. **Recommendation:** retire the working copy into `docs/archive/` after approval to prevent future drift.

---

# 1. Overall Website Architecture

## 1.1 Architectural Decision

**Static, multi-page (MPA), hand-authored HTML + CSS + vanilla JavaScript. No framework. No runtime dependencies.**

This is not a default — it is the correct answer for this specific project, and it aligns with the existing Nulo Workspace architecture (`codeStyle.md` file structure, and every shipped client site in `ClientSites/`). Per `agents.md`, technologies are not to be migrated without instruction.

| Requirement | Why static MPA wins |
|---|---|
| Local SEO across ~25 service + county pages | Each page is a real URL with its own `<title>`, meta, H1, and JSON-LD. No hydration, no client-side routing, no crawl ambiguity. |
| LCP under 1.2s on rural 4G | Pre-rendered HTML from CDN edge. No framework parse/execute cost before first paint. |
| Audience arrives stressed, on mobile, at 11pm | Content renders with JavaScript disabled or failed. Phone number is a plain `<a href="tel:">` in the DOM. |
| Attorney advertising compliance | Copy is auditable in flat files. No dynamic assembly that could produce an unreviewed claim. |
| Long-term maintainability by the studio | Matches ecosystem conventions; any Nulo developer can open it and work. |
| Hosting flexibility | Deploys to any static host. No Node runtime, no build server. |

## 1.2 The Central Architectural Idea: Scene-Scoped Design Tokens

The Foundation brief requires "one continuous cinematic experience" moving light → dusk → dark. The naive implementation is to write every component twice (`.practiceCard` and `.practiceCardDark`). That approach doubles the CSS, doubles the bug surface, and collapses the moment a fourth scene is needed.

**Instead: components consume semantic tokens only, and scenes redefine those tokens.**

```css
/* A component never names a colour. It names a role. */
.practiceCard
{

    background: var(--surfaceRaised);

    color: var(--textPrimary);

    border: 1px solid var(--borderSubtle);

}

/* A scene redefines the roles. Every component inside adapts automatically. */
[data-scene="light"]
{

    --surfaceRaised: #FFFFFF;

    --textPrimary: #0B0B0D;

    --borderSubtle: rgba(11, 11, 13, 0.10);

}

[data-scene="dark"]
{

    --surfaceRaised: #18181B;

    --textPrimary: #F6F5F3;

    --borderSubtle: rgba(246, 245, 243, 0.10);

}
```

**Consequences of this decision:**

- Any component can be placed in any scene, on any page, with zero variant code.
- The light → dark transition is a data-attribute change, not a stylesheet swap.
- Adding a future scene (e.g. a warm "dusk" for practice-area heroes) costs one token block.
- Interior pages get the cinematic system for free without re-authoring components.
- CSS volume drops by an estimated 35–40% versus a variant-class approach.

This is the highest-leverage engineering decision in the plan and everything downstream depends on it.

## 1.3 Layer Model

Strict one-directional dependency. A lower layer never references a higher one.

```
Layer 0  tokens.css        Primitives → semantics → scene maps. No selectors that paint.
Layer 1  base.css          Reset, root typography, focus, motion prefs, print.
Layer 2  layout.css        Container, grid, section rhythm, stack primitives.
Layer 3  components.css    All reusable components. Token-consuming only.
Layer 4  styleIndex.css    Homepage-only compositions (scene backdrop, hero).
Layer 4  stylePages.css    Interior-page compositions (article, practice, county).
Layer 5  utilities.css     Narrow escape hatches (visuallyHidden, textBalance).
```

**JavaScript mirrors this:**

```
js/siteJS.js     Loaded on every page: navigation, mega menu, mobile menu,
                 accordions, reveal observer, focus management, form.
js/indexJS.js    Homepage only: scene observer, hero parallax.
```

Both are `type="module"`, `defer`, and dependency-free.

## 1.4 Progressive Enhancement Contract

| Layer | Guarantee |
|---|---|
| HTML alone | All content readable. All links navigable. Phone and address usable. Form submits natively to endpoint. |
| HTML + CSS | Full visual design. Scenes render at their static resting state. Accordions open (`<details>`). |
| HTML + CSS + JS | Scene crossfade, reveal animation, mega menu panel, mobile drawer, parallax, client-side validation. |

**Rule:** JavaScript may never be the only path to content. The mega menu's trigger is a real link to `/practice-areas/`; the panel is an enhancement. Accordions are native `<details>`/`<summary>` upgraded in place.

## 1.5 Rendering & Delivery

- **Critical CSS** for the above-the-fold light hero inlined in `<head>` (target ≤ 9 KB).
- Remaining CSS loaded via a single `<link>` — HTTP/2 multiplexed, long-cached, hashed filename.
- **No render-blocking JavaScript.** All scripts `defer`.
- Fonts self-hosted, `preload`ed for the two families in the LCP element only.
- No third-party scripts on the critical path (see §14.6 for the analytics position).

---

# 2. Homepage Blueprint

## 2.1 Narrative Intent

The homepage is a single continuous descent from daylight into focus. It is not a stack of sections; it is three environments that a visitor moves through. The emotional arc, mapped to the research finding that visitors are "stressed, uncertain, comparing attorneys":

| Scene | Environment | Emotional job | Question answered |
|---|---|---|---|
| **1 — Light** | Warm white, airy, enormous whitespace | *Relief.* This is calm and serious. | "Who is this, and can he help me?" |
| **2 — Dusk** | Gradual descent to charcoal | *Confidence.* This person is real and credentialed. | "Why should I trust him?" |
| **3 — Dark** | Full black, focused, gold accents | *Decision.* I can see exactly what I need. | "What does he do, and how do I start?" |

The transition is continuous and scroll-linked. There is no hard seam between scenes.

## 2.2 Section-by-Section Blueprint

| # | Section | Scene | Content | Components | Motion |
|---|---|---|---|---|---|
| 0 | `siteHeader` | inherits | Logo lockup, nav, phone, CTA | `siteHeader`, `primaryNav`, `megaMenu`, `buttonPrimary` | Compresses on scroll; tokens invert with scene |
| 1 | `heroSection` | Light | Editorial H1, one-line lede, dual CTA, portrait | `heroSection`, `buttonPrimary`, `buttonGhost`, `portraitFrame` | Staged entrance; portrait parallax ≤12px |
| 2 | `trustStrip` | Light | Licensure OH 2022 / KY 2023 · Portsmouth office · Free consultation | `trustStrip`, `trustItem` | Fade-up, 60ms stagger |
| 3 | `positioningSection` | Light → Dusk | Large editorial statement + short paragraph. First tonal descent begins here. | `statementBlock` | Line-by-line reveal |
| 4 | `attorneySection` | Dusk | Austin intro, verified credentials, link to full bio | `attorneySection`, `credentialList`, `linkArrow` | Image reveal + text fade-up |
| 5 | `processSection` | Dusk | **"What happens after you call"** — 3 steps | `processSection`, `processStep` | Sequential stagger |
| 6 | `reviewsSection` | Dusk → Dark | 2–3 permission-cleared quotes + aggregate rating | `reviewCard`, `ratingBadge` | Slow fade |
| 7 | `practiceSection` | Dark | Practice areas grid — the site's primary conversion surface | `practiceGrid`, `practiceCard` | Staggered reveal, gold hairline on hover |
| 8 | `serviceAreaSection` | Dark | Counties served, OH + KY, links to county pages | `serviceAreaSection`, `countyList` | Fade |
| 9 | `faqTeaseSection` | Dark | 4 highest-intent questions + link to FAQ centre | `accordionGroup`, `accordionItem` | Height transition |
| 10 | `finalCtaSection` | Dark | Single decisive CTA, phone, hours, address | `finalCtaSection`, `buttonPrimary` | Gold underline draw |
| 11 | `siteFooter` | Dark | Nav columns, NAP, disclaimer, legal links | `siteFooter`, `disclaimerBlock` | None |

### Design note on §5 — `processSection`

This section is a direct, deliberate answer to the single most damaging finding in the research: the visible negative review describing communication as *"nearly nonexistent."* A three-step "what happens after you call" block converts the firm's greatest reputational vulnerability into an explicit on-site promise. It also matches the strongest positive review theme (responsiveness). **This section should be considered non-optional.**

## 2.3 Hero Composition

```
┌──────────────────────────────────────────────────────────────┐
│  [shield] AUSTIN G. ERVIN          Practice ▾  About  FAQ    │
│           Attorney at Law, LLC     (740) 529-1420  [Consult] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   PORTSMOUTH, OHIO · OHIO & KENTUCKY          ░░░░░░░░░░░    │
│                                               ░░ portrait ░  │
│   Serious counsel                             ░░░░░░░░░░░░   │
│   when it matters                             ░░░░░░░░░░░░   │
│   most.                                       ░░░░░░░░░░░░   │
│                                               ░░░░░░░░░░░░   │
│   Criminal defense, family law, and estate    ░░░░░░░░░░░░   │
│   matters across southern Ohio and            ░░░░░░░░░░░░   │
│   northeastern Kentucky.                      ░░░░░░░░░░░░   │
│                                                              │
│   [ Request a consultation ]  Call (740) 529-1420 →          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
        58% type column              42% portrait column
```

**Specification:**

- **Grid:** 12-column. Type occupies 1–7, portrait occupies 8–12 at ≥1024px. Stacks vertically below 1024px with portrait **above** the headline on mobile (face-first establishes trust before copy).
- **Eyebrow:** 13px Inter, uppercase, 0.14em tracking, `--textMuted`. Carries the two highest-value local SEO signals (city + dual-state) without keyword stuffing the H1.
- **H1:** Cormorant Garamond 600, `--fontDisplayXl`, line-height 1.02, max 14ch measure. Three lines desktop, three lines mobile. Copy is placeholder pending approval.
- **Lede:** Inter 400, `--fontBodyLg`, `--textSecondary`, max 46ch.
- **CTA pair:** filled gold primary + ghost/underlined secondary. On mobile the secondary becomes a full-width `tel:` link — this audience calls.
- **Portrait treatment:** see §2.4.
- **Whitespace:** hero occupies `min-height: 88vh` at ≥1024px (never `100vh` — it hides the scroll affordance). Top padding clears the header by `--space10`.

## 2.4 Portrait Treatment (Critical)

The portrait is the hero focal point per the brief. The supplied asset is technically inadequate (see §19, Risk R1) and the treatment must be designed to both flatter the subject and survive the resolution constraint.

**Specified treatment:**

1. **Cutout mask.** Subject isolated from the existing seamless white studio background. The raw rectangular photo must not sit as a visible box in the hero — that reads as a template.
2. **Warm neutral field.** Behind the cutout, a soft radial field in `--surfaceWarm` (#FAF8F5 → #F0EDE7) so the light scene has depth rather than flat white.
3. **Gold hairline geometry.** A single 1px gold arc or vertical rule behind the shoulder — the only gold in Scene 1 besides the CTA. Restraint is the point.
4. **Grade.** Slight desaturation (−8%) and a +2% warm lift to harmonise the cool studio lighting with the warm palette, and to reduce the prominence of the purple tie (see Risk R3).
5. **Bottom feather.** The portrait's lower edge feathers into the scene background so Scene 1 flows into Scene 2 without a cut.
6. **Delivery.** AVIF + WebP + JPEG fallback, `srcset` at 1x/2x, explicit `width`/`height`, `fetchpriority="high"`, **not** lazy-loaded (it is the LCP element).

## 2.5 Scene Transition Mechanics

The transition must be genuinely continuous, must not repaint the document on every scroll frame, and must not depend on a scroll event listener.

**Implementation:**

```html
<body data-scene="light">

    <div class="sceneBackdrop" aria-hidden="true">
        <div class="sceneLayer" data-layer="light"></div>
        <div class="sceneLayer" data-layer="dusk"></div>
        <div class="sceneLayer" data-layer="dark"></div>
    </div>
```

- `.sceneBackdrop` is `position: fixed; inset: 0; z-index: -1`.
- The three `.sceneLayer` elements are stacked and **crossfaded by `opacity` only** — a compositor-only property. No layout, no paint of page content.
- The `dusk` layer is a vertical gradient (`--colorWhite` → `--colorCharcoal`) which supplies the "gradual darkening" the brief calls for.
- An `IntersectionObserver` with `rootMargin: '-45% 0px -45% 0px'` watches `[data-scene-trigger]` sections and sets `document.body.dataset.scene`. This fires only at boundaries — typically 4 times per full-page scroll, versus ~200 scroll events.
- Token inversion for content is driven by the same `body[data-scene]` attribute, with a 600ms `color`/`background-color` transition on the token-consuming elements.

**Why not `animation-timeline: scroll()`:** browser support is still uneven across the Android/Safari mix this rural audience skews toward. The plan is IntersectionObserver as the reliable baseline, with scroll-driven animation added behind `@supports (animation-timeline: scroll())` as a pure enhancement in a later phase.

**Reduced motion:** `prefers-reduced-motion: reduce` sets crossfade duration to 1ms. Scenes still change — the design intent survives — but nothing animates.

---

# 3. Complete Sitemap

Phased by conversion value and content-production cost. **Tier 1 is the launch scope.**

## Tier 1 — Launch (16 pages)

```
/                                          Homepage
/about/                                    About the Firm
/attorney/                                 Austin G. Ervin — full biography
/practice-areas/                           Practice Areas hub
    /practice-areas/criminal-defense/      Criminal Defense hub
    /practice-areas/ovi-dui/               OVI / DUI / DWI
    /practice-areas/family-law/            Family Law hub
    /practice-areas/divorce/               Divorce & Separation
    /practice-areas/child-custody/         Child Custody
    /practice-areas/protection-orders/     Protection Orders
    /practice-areas/estate-planning/       Estate Planning hub
    /practice-areas/probate/               Probate
/faq/                                      FAQ centre
/contact/                                  Contact & consultation request
/thank-you/                                Form confirmation (noindex)
/404.html                                  Not found
```

## Tier 2 — Depth (10 pages)

```
    /practice-areas/child-support/
    /practice-areas/adoption/
    /practice-areas/domestic-violence/
    /practice-areas/guardianship/
    /practice-areas/wills-living-wills/
    /practice-areas/real-estate/
    /practice-areas/personal-injury/       ← gated on Open Question Q4
/service-areas/                            Service area hub
    /service-areas/scioto-county/
    /service-areas/portsmouth/
```

## Tier 3 — Local & Editorial SEO

```
    /service-areas/adams-county/
    /service-areas/pike-county/
    /service-areas/lawrence-county/
    /service-areas/greenup-county-ky/      ← gated on Open Question Q3
    /service-areas/boyd-county-ky/         ← gated on Open Question Q3
/resources/                                Article index
    /resources/{article-slug}/             Educational articles
```

## Legal & Utility (Tier 1 — required at launch)

```
/disclaimer/                               Legal disclaimer & non-engagement
/privacy-policy/
/accessibility-statement/
/sitemap.xml
/robots.txt
```

> **Compliance note:** `/disclaimer/` is not optional. Ohio Prof. Cond. R. 7.1/7.2 and Kentucky SCR 3.130-7.01–7.60 govern attorney advertising; the research explicitly flags that a site must not imply that form submission creates an attorney-client relationship. The disclaimer must be linked from the footer of **every** page and restated inline adjacent to every form.

## URL Convention — Decision Required

Ecosystem precedent (`client_740Eatz`) uses camelCase HTML filenames (`accessibilityStatement.html`). For this project I am recommending **lowercase hyphenated directory URLs** instead:

| Factor | camelCase `.html` | Hyphenated directories |
|---|---|---|
| Ecosystem consistency | ✅ Matches precedent | ❌ Deviation |
| Google URL guidance | ⚠️ Hyphens explicitly recommended | ✅ |
| Case-sensitivity duplicate-content risk | ⚠️ Real on case-sensitive hosts | ✅ None |
| Future-proof (extension-free) | ❌ | ✅ |

**Recommendation:** adopt hyphenated directory URLs **for HTML routes only**, because SEO is a stated primary objective and this is a 25+ page content site (unlike the single-page precedents). **CSS and JS filenames remain camelCase** per `codeStyle.md` (`styleIndex.css`, `indexJS.js`). This deviation requires explicit approval — see Open Question Q10.

---

# 4. Information Architecture

## 4.1 Model: Hub and Spoke

```
                         ┌─────────────┐
                         │  Homepage   │
                         └──────┬──────┘
        ┌───────────────┬───────┴───────┬───────────────┐
        ▼               ▼               ▼               ▼
   ┌─────────┐   ┌─────────────┐  ┌──────────┐   ┌──────────┐
   │ Attorney│   │  Practice   │  │   FAQ    │   │ Contact  │
   │  /About │   │    Areas    │  │  Centre  │   │          │
   └─────────┘   └──────┬──────┘  └──────────┘   └──────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐   ┌─────────────┐  ┌──────────┐
   │ Criminal│   │   Family    │  │  Estate  │   ← three hubs
   │ Defense │   │     Law     │  │ Planning │
   └────┬────┘   └──────┬──────┘  └─────┬────┘
        │               │               │
    ┌───┴───┐     ┌─────┼─────┐    ┌────┴────┐
    ▼       ▼     ▼     ▼     ▼    ▼         ▼
   OVI   Record Divorce Custody  Probate  Guardianship
        Sealing        Support             Wills
                     Protection
                       Orders
```

Every practice page is reachable in **≤ 2 clicks** from the homepage via the mega menu, and **≤ 3 clicks** via crawlable in-body links.

## 4.2 Content Model per Page Type

Each template has a fixed module contract. This is what makes 25 pages maintainable and prevents thin content — the research explicitly warns "avoid thin content."

**Practice Area Page** (minimum 700 words):

1. Scene-aware page hero — H1, one-sentence positioning, breadcrumb
2. "What this covers" — plain-English scope
3. "What to do right now" — urgency guidance *(criminal/OVI/protection orders only)*
4. Process overview — numbered steps
5. Jurisdiction note — Ohio procedure; Kentucky procedure where applicable
6. Related FAQs — 4–6 items, native `<details>`, `FAQPage` schema
7. Related practice areas — internal link cluster
8. Consultation CTA
9. Inline non-engagement disclaimer

**County / City Page** (minimum 500 words):

1. Hero — "{Service focus} in {County} County, Ohio"
2. Local context — courthouse, seat, geography (factual only)
3. Services offered in that county — links to practice pages
4. Local FAQ
5. NAP + map + CTA

**Article Page:** H1, published/updated dates, author (Person schema → Austin), body with H2/H3, related practice links, CTA, disclaimer.

## 4.3 Internal Linking Rules

| Rule | Requirement |
|---|---|
| Hub → spoke | Every hub links to all its spokes |
| Spoke → hub | Every spoke links up via breadcrumb **and** in-body |
| Spoke ↔ sibling | Minimum 2 contextual sibling links per page |
| Cross-cluster | Protection Orders ↔ Custody ↔ Divorce ↔ Domestic Violence must interlink (research explicitly calls for heavy cross-linking here) |
| County → practice | Every county page links to ≥ 4 practice pages |
| Every page → conversion | Every page links to `/contact/` and exposes a `tel:` link |
| Orphan policy | Zero orphan pages. Every URL in `sitemap.xml` must have ≥ 1 in-body inbound link. |

## 4.4 Breadcrumbs

Present on every page except the homepage. Rendered as `<nav aria-label="Breadcrumb">` with an ordered list, and mirrored in `BreadcrumbList` JSON-LD.

```
Home / Practice Areas / Criminal Defense / OVI & DUI Defense
```

---

# 5. Navigation Architecture

## 5.1 Desktop Structure (per Phase 0 brief)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [◈] AUSTIN G. ERVIN      Practice Areas ▾  About  FAQ  Contact         │
│     Attorney at Law, LLC              (740) 529-1420  [ Consultation ] │
└────────────────────────────────────────────────────────────────────────┘
  ← logo lockup, far left      ← links centre/right    ← phone   ← CTA far right
```

Exactly as specified in Phase 0 §3: shield mark far left, wordmark to its right, links centre/right, primary CTA far right.

## 5.2 Primary Navigation Inventory

Deliberately capped at **four link items**. Every additional item costs horizontal room and pushes the collapse breakpoint upward.

| Item | Type | Destination |
|---|---|---|
| Practice Areas | Mega menu trigger + real link | `/practice-areas/` |
| About | Link | `/about/` |
| FAQ | Link | `/faq/` |
| Contact | Link | `/contact/` |
| (740) 529-1420 | `tel:` link, ≥1440px only | — |
| Request a Consultation | `buttonPrimary` | `/contact/` |

*Attorney bio is reached from About and from the mega menu footer, not from the top bar — this keeps the bar at four items.*

## 5.3 Header Behaviour

| State | Trigger | Behaviour |
|---|---|---|
| `isAtTop` | scrollY < 24px | Transparent background, full 96px height, inherits scene tokens |
| `isCompact` | scrollY ≥ 24px | Height → 72px, backdrop `blur(12px)` + scene-tinted 88%-opacity fill, 1px bottom hairline |
| `isHidden` | scrolling down, scrollY > 480px | Translates up (mobile only — reclaims vertical space) |
| Revealed | any upward scroll | Returns immediately |

Header is `position: sticky; top: 0`. Sticky navigation is explicitly recommended by the research ("persistent access to phone and consultation CTA will help conversion"). Scroll state is read via a passive `IntersectionObserver` sentinel, **not** a scroll listener.

**Scene awareness:** the header consumes the same tokens as the body, so its text and logo invert automatically as the visitor descends from light into dark. The logo must therefore be an SVG with `fill: currentColor` on its wordmark (see §18.2 and Risk R2).

---

# 6. Mega Menu Recommendation

## 6.1 Recommendation: **Yes — a single mega panel on "Practice Areas."**

The research supports this conditionally: *"Practice-area mega menu — Yes, if the page inventory is full enough."* At Tier 1 the inventory is 8 practice pages across 3 clusters; at Tier 2 it is 15. That is past the threshold where a flat dropdown becomes a scanning problem.

Only **one** menu is a mega panel. All other nav items are plain links. A site with four top-level items and four mega panels feels like an enterprise portal, not a premium practice.

## 6.2 Panel Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  CRIMINAL DEFENSE        FAMILY LAW            ESTATE & PROPERTY         │
│  ─────────────────       ─────────────         ──────────────────        │
│  Criminal Defense →      Family Law →          Estate Planning →         │
│  OVI / DUI Defense       Divorce               Probate                   │
│  Record Sealing          Child Custody         Wills & Living Wills      │
│                          Child Support         Guardianship              │
│                          Protection Orders     Real Estate               │
│                          Adoption                                        │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│  Not sure where you fit?  Call (740) 529-1420  ·  View all practice areas │
└──────────────────────────────────────────────────────────────────────────┘
```

- Full-bleed panel, content constrained to the container. Three columns at ≥1200px.
- Cluster headings are **not** links — they are labels; the first item in each column is the hub link. This avoids the common ambiguity of a clickable heading that duplicates its first child.
- Utility row at the bottom directly serves the research finding that many visitors arrive thinking *"I'm not sure what kind of lawyer I need."*
- Gold used only for the 1px column rules and the hover underline. Nothing else.

## 6.3 Interaction & Accessibility Specification

This is where most mega menus fail. The contract:

| Concern | Specification |
|---|---|
| Trigger element | `<button aria-expanded="false" aria-controls="megaPanelPractice">` — **not** a `<div>` |
| No-JS fallback | Trigger is wrapped so the text "Practice Areas" is a real `<a href="/practice-areas/">`; the disclosure button is injected by JS |
| Open on pointer | `mouseenter` with **120ms intent delay** to prevent accidental opens on pass-through |
| Close on pointer | `mouseleave` with **240ms grace delay** to survive diagonal travel to the panel |
| Open on keyboard | `Enter`/`Space` toggles; `ArrowDown` opens and moves focus to first item |
| Keyboard traversal | `Tab` moves through panel links in DOM order — **no focus trap** (this is a disclosure, not a dialog) |
| Close on keyboard | `Escape` closes and returns focus to the trigger |
| Close on blur | Closing when focus leaves the panel subtree, via `focusout` + `relatedTarget` check |
| Touch | First tap opens the panel; the hub link is reachable via the "View all practice areas" item. No hover-only paths. |
| Motion | Panel fades + translates down 8px over 220ms. Reduced motion → opacity only, 1ms. |
| Screen reader | Panel is a `<nav aria-label="Practice areas">` containing grouped lists with `<h2 class="visuallyHidden">` per column |

**Hard rule:** no navigation destination may be reachable *only* by hover. This is a WCAG 2.1 (2.5.1 / 1.4.13) and a mobile-reality requirement.

---

# 7. Responsive Navigation Strategy

## 7.1 The Collapse Breakpoint — Derived, Not Guessed

Phase 0 §3 states: *"Never allow navigation to wrap"* and *"Whitespace is preferred over squeezing links."* The collapse point is therefore a measurement, not a preference.

**Measured horizontal requirement** (Inter 15px / 0.01em tracking, measured at the specified type scale):

| Element | Width |
|---|---|
| Shield mark (40px) + 12px gap + wordmark | 252px |
| "Practice Areas ▾" | 118px |
| "About" | 48px |
| "FAQ" | 36px |
| "Contact" | 62px |
| 3 inter-link gaps @ 36px | 108px |
| Phone "(740) 529-1420" | 122px |
| CTA button "Request a Consultation" | 214px |
| Logo→links gap + links→utility gap @ 48px | 96px |
| Container gutters (2 × 48px) | 96px |
| **Total, all elements** | **1152px** |
| **Total, phone hidden** | **1006px** |

Comfortable presentation requires breathing room above the minimum, not a flush fit at the minimum.

## 7.2 Navigation Tiers

| Viewport | Tier | Composition |
|---|---|---|
| **≥ 1440px** | Full | Lockup + 4 links + phone link + CTA. 48px gaps. Generous. |
| **1200–1439px** | Condensed | Lockup + 4 links + CTA. Phone drops to the mega panel and the header's mobile row. Gaps 36px. |
| **1024–1199px** | **Collapsed** | Lockup + phone icon button + hamburger. |
| **768–1023px** | Collapsed | Same. |
| **< 768px** | Collapsed | Same; wordmark switches to compact single-line variant. |
| **< 400px** | Collapsed | Shield mark only + phone icon + hamburger. |

## 7.3 The Decision: **Navigation collapses to a hamburger below 1200px.**

**Rationale.** At 1024px the full navigation fits in 1006px of a 1024px viewport — a 18px margin of error. That is technically non-wrapping but visually cramped, and it directly violates the brief's "whitespace is preferred over squeezing links." Collapsing at 1200px keeps the desktop bar genuinely spacious in every state it is shown, and it is a common and well-accepted pattern for premium editorial sites. The 1200–1439px condensed tier exists specifically so that laptop users still get a full horizontal bar rather than being pushed to a hamburger at 1366px — the most common laptop width in this market.

**Guard rail.** If a fifth navigation item is ever added, the collapse breakpoint must be re-derived. This is documented in the codebase as a comment above the nav media query, not left to memory.

## 7.4 Mobile Menu — "Premium, not generic" (Phase 0 §3)

A generic mobile menu is a white sheet with a stacked link list. This one is designed as an intentional environment:

- **Presentation:** full-screen overlay in `--colorBlack`, not a slide-in tray. The visitor arrives in Scene 3's environment regardless of scroll position — the brand's dark register.
- **Entrance:** overlay fades in (240ms); items stage in with a 40ms stagger, `translateY(12px)` → 0. Total under 400ms.
- **Type:** navigation items in **Cormorant Garamond 500 at 32–36px** — editorial, not UI. This single choice is what separates it from a generic menu.
- **Structure:** Practice Areas expands in-place as an accordion (native `<details>`, styled) rather than pushing to a second screen. No nested navigation depth.
- **Footer of overlay:** phone (large, tappable), address, hours, and the consultation CTA as a full-width button.
- **Gold:** a single hairline rule between sections. Nothing else.

**Accessibility contract for the overlay** (this *is* a modal, unlike the mega panel):

| Requirement | Implementation |
|---|---|
| Role | `role="dialog" aria-modal="true" aria-label="Site menu"` |
| Focus | Moved to the close button on open; **trapped** within the overlay |
| Return | Focus returns to the hamburger button on close |
| Dismissal | `Escape`, close button, and overlay backdrop click |
| Background | `<body>` receives `overflow: hidden` with scroll-position restoration on close |
| Inert background | `inert` attribute applied to `<main>` and `<footer>` while open |
| Button label | `aria-expanded` toggled; `aria-label="Open menu"` / `"Close menu"` |
| Target size | Hamburger and close: 48 × 48px minimum |

---

# 8. Typography System

## 8.1 Families

| Role | Family | Weights | Usage |
|---|---|---|---|
| Display | **Cormorant Garamond** | 500, 600 | H1–H3, pull quotes, mobile menu items, statistics |
| Body / UI | **Inter** | 400, 500, 600 | Body, lede, labels, navigation, buttons, captions, all UI |

### Critical constraints on Cormorant Garamond

Cormorant is a high-contrast display serif with a small cap-height-to-em ratio and very thin hairlines. Used carelessly it looks fragile and fails contrast perception. Enforced rules:

1. **Never below 24px.** Below that its hairlines break down on standard-density displays.
2. **Never weight 300.** Minimum 500. The Foundation's "editorial feel" comes from *scale and whitespace*, not from thin weight.
3. **Never for body copy.** Long-form legal reading is Inter's job. This is both a readability and an accessibility position.
4. **Optical compensation.** Cormorant reads ~12% smaller than Inter at identical `font-size`. Display sizes below are already compensated.
5. **Line-height 1.02–1.10** at display sizes. Anything looser dissolves the editorial density.

## 8.2 Type Scale

Fluid via `clamp()`, interpolating between a 375px and a 1600px viewport. The four device tiers requested in the brief are the *computed* values at representative widths.

| Token | Mobile 375px | Tablet 768px | Laptop 1280px | Desktop 1600px+ | Family / Weight | LH |
|---|---|---|---|---|---|---|
| `--fontDisplayXl` | 46px | 68px | 100px | 116px | Cormorant 600 | 1.02 |
| `--fontDisplayLg` | 34px | 48px | 63px | 72px | Cormorant 600 | 1.06 |
| `--fontDisplayMd` | 26px | 32px | 38px | 40px | Cormorant 600 | 1.12 |
| `--fontHeadingSm` | 20px | 21px | 23px | 24px | Inter 600 | 1.25 |
| `--fontBodyLg` | 18px | 19px | 20px | 21px | Inter 400 | 1.55 |
| `--fontBody` | 17px | 17px | 18px | 18px | Inter 400 | 1.65 |
| `--fontBodySm` | 15px | 15px | 16px | 16px | Inter 400 | 1.60 |
| `--fontCaption` | 12px | 12px | 13px | 13px | Inter 500 | 1.40 |

**Declarations:**

```css
--fontDisplayXl:  clamp(2.875rem, 1.536rem + 5.714vw, 7.25rem);
--fontDisplayLg:  clamp(2.125rem, 1.398rem + 3.102vw, 4.5rem);
--fontDisplayMd:  clamp(1.625rem, 1.357rem + 1.143vw, 2.5rem);
--fontHeadingSm:  clamp(1.25rem,  1.173rem + 0.327vw, 1.5rem);
--fontBodyLg:     clamp(1.125rem, 1.068rem + 0.245vw, 1.3125rem);
--fontBodySm:     clamp(0.9375rem, 0.918rem + 0.082vw, 1rem);
--fontCaption:    clamp(0.75rem,  0.735rem + 0.065vw, 0.8125rem);
/* --fontBody steps at 1024px rather than interpolating — body text should
   not shift by fractions of a pixel during a resize. */
```

**Mobile hero verification:** 46px Cormorant 600 at 1.02 line-height, in a 335px content column (375px − 2×20px gutters), yields ~13 characters per line. A three-line H1 occupies 141px of vertical space. This satisfies "still large and impactful — do not shrink headings excessively" while leaving room for the lede and both CTAs above the fold on a 667px-tall device.

## 8.3 Measure, Tracking, and Rendering

| Property | Value |
|---|---|
| Body measure | `max-width: 68ch` (legal content is dense; 68ch is the upper bound of comfortable) |
| Display measure | `max-width: 14ch` (H1) / `18ch` (H2) — forces the editorial line breaks the design depends on |
| Display tracking | `-0.02em` — Cormorant sets loose at large sizes |
| Body tracking | `0` |
| Eyebrow / caption tracking | `0.14em`, uppercase |
| Balance | `text-wrap: balance` on all display headings; `text-wrap: pretty` on body (both progressive, no fallback needed) |
| Hyphenation | Off for display. On for body **below 480px only**, to prevent rivers in narrow legal prose. |
| Antialiasing | `-webkit-font-smoothing: antialiased` on dark scenes only — it thins glyphs, which helps on dark and harms on light |

## 8.4 Font Loading Strategy

| Step | Specification |
|---|---|
| Hosting | **Self-hosted.** No Google Fonts CDN — it is a third-party connection on the critical path and a GDPR/privacy consideration. |
| Format | `woff2` only. |
| Subsetting | Latin + Latin-Extended punctuation. Cuts Cormorant by ~60%. |
| Files | Inter variable (400–600) — 1 file. Cormorant 600 — 1 file. Cormorant 500 — 1 file. **3 files, ~118 KB total.** |
| Preload | Cormorant 600 and Inter variable only (both appear in the hero). Cormorant 500 loads normally. |
| Display | `font-display: swap` |
| CLS prevention | Fallback stacks declared with `size-adjust`, `ascent-override`, and `descent-override` metric overrides so the swap produces **zero layout shift**. This is the single most important CLS control on the site. |

```css
@font-face
{

    font-family: 'CormorantFallback';

    src: local('Times New Roman');

    size-adjust: 108%;

    ascent-override: 92%;

    descent-override: 28%;

}
```

*(Override percentages to be measured against the final subset files during implementation.)*

---

# 9. Spacing System

## 9.1 Scale

4px base unit. Non-linear at the top — large gaps need coarse steps, not fine ones.

| Token | px | rem | Typical use |
|---|---|---|---|
| `--space1` | 4 | 0.25 | Icon-to-label |
| `--space2` | 8 | 0.5 | Tight inline groups |
| `--space3` | 12 | 0.75 | Chip / small button padding |
| `--space4` | 16 | 1 | Default element gap |
| `--space5` | 24 | 1.5 | Card interior padding (mobile) |
| `--space6` | 32 | 2 | Card interior padding (desktop), grid gap |
| `--space7` | 40 | 2.5 | Heading → body |
| `--space8` | 48 | 3 | Sub-block separation |
| `--space9` | 64 | 4 | Block separation |
| `--space10` | 80 | 5 | Major block separation |
| `--space11` | 96 | 6 | Section padding (mobile) |
| `--space12` | 128 | 8 | Section padding (tablet) |
| `--space13` | 160 | 10 | Section padding (laptop) |
| `--space14` | 200 | 12.5 | Section padding (desktop) — the "huge breathing room" |

## 9.2 Section Rhythm

Whitespace is the primary carrier of "premium" in this design. It is a token, not an improvisation.

```css
--sectionPaddingBlock: clamp(4.5rem, 2rem + 9vw, 12.5rem);
--sectionPaddingBlockTight: clamp(3rem, 1.5rem + 5.5vw, 7.5rem);
```

| Viewport | Computed section padding |
|---|---|
| 375px | 72px |
| 768px | 101px |
| 1024px | 124px |
| 1440px | 162px |
| 1920px+ | 200px |

## 9.3 Containers and Gutters

| Token | Value | Use |
|---|---|---|
| `--containerMax` | 1240px | Default content container |
| `--containerWide` | 1440px | Practice grid, mega panel, full-bleed sections |
| `--containerNarrow` | 760px | Article body, FAQ, long-form legal copy |
| `--containerGutter` | `clamp(1.25rem, 0.5rem + 3vw, 4rem)` | 20px mobile → 64px desktop |

## 9.4 Grid

| Viewport | Columns | Gap |
|---|---|---|
| < 640px | 4 | `--space5` (24) |
| 640–1023px | 8 | `--space6` (32) |
| ≥ 1024px | 12 | `--space6` (32) |
| ≥ 1440px | 12 | `--space7` (40) |

## 9.5 Vertical Rhythm Rule

Spacing between elements is owned by the **parent**, never by the child's margin. Implemented with a flow primitive:

```css
.flow > * + *
{

    margin-block-start: var(--flowSpace, var(--space4));

}
```

This eliminates the entire class of margin-collapse bugs and makes any component safely portable between contexts — which the scene system depends on.

---

# 10. Color Token System

## 10.1 Three-Layer Architecture

```
Layer 1  Primitives   Raw brand values. Named by what they ARE. Never used by components.
Layer 2  Semantics    Named by ROLE. This is the only layer components may reference.
Layer 3  Scene maps   Per-scene reassignment of Layer 2. Where the cinematic system lives.
```

## 10.2 Layer 1 — Primitives (from the Foundation brief, unmodified)

```css
--colorGold:        #C19E61;
--colorGoldDark:    #A98445;
--colorGoldLight:   #D0AF77;
--colorBlack:       #0B0B0D;
--colorCharcoal:    #18181B;
--colorSurface:     #242529;
--colorWhite:       #F6F5F3;
--colorText:        #D2D3D6;
--colorMuted:       #8A8C93;
```

## 10.3 Derived Primitives — Required for Accessibility

The supplied palette is designed for dark environments and is complete for Scenes 2–3. **Scene 1 (light) requires derived values**, because the brand gold fails contrast on a light background. These are additions, not changes — no supplied value is altered.

```css
--colorGoldInk:     #8A6A33;   /* Gold for TEXT on light scenes */
--colorMutedInk:    #6A6C72;   /* Muted text on light scenes */
--surfaceWarm:      #FAF8F5;   /* Warm off-white for hero field depth */
--surfaceWarmDeep:  #F0EDE7;   /* Hero radial field terminus */
```

## 10.4 Measured Contrast Audit

Ratios computed per WCAG 2.x relative-luminance formula. **This audit is why the derived tokens exist.**

### Dark scenes (Scene 2 & 3) — the supplied palette performs well

| Foreground | Background | Ratio | Body (4.5) | Large (3.0) |
|---|---|---|---|---|
| `--colorWhite` #F6F5F3 | `--colorBlack` #0B0B0D | **17.85:1** | ✅ AAA | ✅ AAA |
| `--colorText` #D2D3D6 | `--colorBlack` | **13.14:1** | ✅ AAA | ✅ AAA |
| `--colorGold` #C19E61 | `--colorBlack` | **7.80:1** | ✅ AAA | ✅ AAA |
| `--colorMuted` #8A8C93 | `--colorBlack` | **5.76:1** | ✅ AA | ✅ AAA |
| `--colorText` | `--colorCharcoal` #18181B | **11.84:1** | ✅ AAA | ✅ AAA |
| `--colorGold` | `--colorCharcoal` | **7.03:1** | ✅ AAA | ✅ AAA |
| `--colorMuted` | `--colorCharcoal` | **5.19:1** | ✅ AA | ✅ AAA |
| `--colorGold` | `--colorSurface` #242529 | **6.07:1** | ✅ AA | ✅ AAA |
| `--colorText` | `--colorSurface` | **10.23:1** | ✅ AAA | ✅ AAA |
| `--colorWhite` | `--colorSurface` | **13.90:1** | ✅ AAA | ✅ AAA |

### Light scene (Scene 1) — two failures found and resolved

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--colorGold` #C19E61 | `--colorWhite` #F6F5F3 | **2.31:1** | ❌ **Fails all text use** |
| `--colorGoldDark` #A98445 | `--colorWhite` | **3.17:1** | ⚠️ Large text & UI only |
| `--colorGoldInk` #8A6A33 *(derived)* | `--colorWhite` | **4.60:1** | ✅ AA body text |
| `--colorBlack` #0B0B0D | `--colorWhite` | **17.85:1** | ✅ AAA |
| `--colorMuted` #8A8C93 | `--colorWhite` | **3.08:1** | ❌ Fails body |
| `--colorMutedInk` #6A6C72 *(derived)* | `--colorWhite` | **4.82:1** | ✅ AA body text |

**Governing rules produced by this audit:**

1. `--colorGold` may **never** be used for text on a light background. On Scene 1 it is permitted only for: filled-button backgrounds (with `--colorBlack` text on top — 7.8:1), 1px decorative rules, and icon accents that are not the sole carrier of meaning.
2. Gold **text** on light scenes uses `--colorGoldInk`.
3. `--colorGoldDark` (3.17:1) is permitted for display text ≥ 24px on light, and for focus-ring/border use (meets the 3:1 non-text requirement of WCAG 1.4.11).
4. `--colorMuted` is a dark-scene token only.

*This audit is exactly why "gold is an accent" is the correct brand instruction — the palette enforces it mathematically.*

## 10.5 Layer 2 — Semantic Tokens

```css
--surfaceBase          --textPrimary         --accentPrimary
--surfaceRaised        --textSecondary       --accentHover
--surfaceSunken        --textMuted           --accentOn      /* text ON accent */
--surfaceInverse       --textOnAccent        --borderSubtle
--surfaceOverlay       --textLink            --borderStrong
                       --textLinkHover       --focusRing
```

## 10.6 Layer 3 — Scene Maps

```css
[data-scene="light"]
{

    --surfaceBase:     var(--surfaceWarm);
    --surfaceRaised:   #FFFFFF;
    --surfaceSunken:   var(--surfaceWarmDeep);
    --textPrimary:     var(--colorBlack);
    --textSecondary:   #3A3B40;
    --textMuted:       var(--colorMutedInk);
    --textLink:        var(--colorGoldInk);
    --accentPrimary:   var(--colorGold);
    --textOnAccent:    var(--colorBlack);
    --borderSubtle:    rgba(11, 11, 13, 0.10);
    --borderStrong:    rgba(11, 11, 13, 0.24);
    --focusRing:       var(--colorBlack);

}

[data-scene="dusk"]
{

    --surfaceBase:     var(--colorCharcoal);
    --surfaceRaised:   var(--colorSurface);
    --textPrimary:     var(--colorWhite);
    --textSecondary:   var(--colorText);
    --textMuted:       var(--colorMuted);
    --textLink:        var(--colorGold);
    --accentPrimary:   var(--colorGold);
    --textOnAccent:    var(--colorBlack);
    --borderSubtle:    rgba(246, 245, 243, 0.10);
    --borderStrong:    rgba(246, 245, 243, 0.22);
    --focusRing:       var(--colorGoldLight);

}

[data-scene="dark"]
{

    --surfaceBase:     var(--colorBlack);
    --surfaceRaised:   var(--colorCharcoal);
    --surfaceSunken:   #060607;
    /* ...remaining tokens as dusk... */

}
```

**Note the `--focusRing` inversion.** A gold focus ring is invisible on light (2.29:1) and beautiful on dark (7.8:1). Scene-scoping the focus ring is not a nicety — it is the difference between a keyboard-accessible site and an inaccessible one.

## 10.7 Gold Budget

To hold the "gold is an accent" non-negotiable to something enforceable:

> **Gold may occupy no more than ~3% of any viewport's painted area, and no more than one *filled* gold element may be visible at a time.**

Permitted: primary CTA fill, 1px rules and dividers, link underlines, active nav indicator, icon accents, numeric step markers, focus ring (dark scenes). Prohibited: section backgrounds, large fills, body text, more than one filled CTA in view, gold-on-gold.

---

# 11. Component Hierarchy

Naming follows `codeStyle.md`: camelCase classes, `is*`/`has*` state classes.

## 11.1 Primitives (Layer 3 — `components.css`)

| Component | Variants | Notes |
|---|---|---|
| `buttonPrimary` | `isFullWidth`, `isLarge` | Gold fill, `--textOnAccent`. Min target 48px. |
| `buttonGhost` | `isFullWidth` | 1px `--borderStrong`, transparent fill |
| `buttonText` | — | Underline-on-hover link button |
| `linkArrow` | — | Text + animated arrow; arrow is `aria-hidden` |
| `eyebrow` | — | Uppercase tracked caption |
| `iconShield` | `isSmall`, `isLarge` | Inline SVG, `currentColor` |
| `divider` | `isGold` | 1px rule |
| `visuallyHidden` | — | Standard clip pattern |

## 11.2 Molecules

| Component | Used on | Key detail |
|---|---|---|
| `logoLockup` | Header, footer, mobile menu | `isHorizontal` / `isStacked` / `isCompact`. SVG, `currentColor`. |
| `practiceCard` | Home, practice hub, county pages | Whole card clickable via a stretched-link pseudo-element on the title anchor — keeps one accessible name, not a nested-link trap |
| `reviewCard` | Home, reviews | Uses `<blockquote>` + `<cite>` |
| `processStep` | Home, practice pages | Numbered; number is decorative, step has a real heading |
| `credentialItem` | Attorney, about | Verified facts only |
| `trustItem` | Trust strip | Icon + label |
| `accordionItem` | FAQ, practice, mobile menu | Native `<details>`/`<summary>`, JS-enhanced height transition |
| `countyLink` | Service areas | — |
| `formField` | Contact | Label, input, hint, error region (`aria-live="polite"`) |
| `breadcrumbNav` | All interior pages | `<nav aria-label="Breadcrumb">` + JSON-LD |
| `ratingBadge` | Home, reviews | **Only with verified, permission-cleared source** |

## 11.3 Organisms

| Component | Scope | Notes |
|---|---|---|
| `siteHeader` | Global | Sticky, scene-aware, compresses on scroll |
| `primaryNav` | Global | Desktop bar |
| `megaMenu` | Global | Disclosure panel (§6) |
| `mobileMenu` | Global | Full-screen modal (§7.4) |
| `heroSection` | Home | LCP owner |
| `pageHero` | Interior | Compact hero + breadcrumb |
| `statementBlock` | Home, about | Large editorial pull statement |
| `attorneySection` | Home | Portrait + credentials |
| `processSection` | Home, practice | 3-step |
| `practiceGrid` | Home, hub | Responsive card grid |
| `reviewsSection` | Home | Quote set |
| `serviceAreaSection` | Home, service areas | County list |
| `accordionGroup` | FAQ, practice | Wraps `accordionItem` + `FAQPage` schema |
| `finalCtaSection` | All | Conversion block |
| `contactForm` | Contact, practice | Progressive enhancement + non-engagement notice |
| `siteFooter` | Global | Nav columns, NAP, disclaimer |
| `sceneBackdrop` | Home | Fixed crossfade layer (§2.5) |
| `disclaimerBlock` | Global | Compliance text |

## 11.4 Templates

`templateHome` · `templatePracticeHub` · `templatePracticeDetail` · `templateCounty` · `templateArticle` · `templateLegal` · `templateContact` · `templateUtility` (404 / thank-you)

## 11.5 Reuse Discipline

**Rule of Three:** a pattern appearing three times becomes a component. Twice, it stays local. This prevents premature abstraction while guaranteeing the practice-area pages (which are structurally identical) share one implementation.

---

# 12. Animation Philosophy

## 12.1 Principles

> **Motion in this project exists to make the experience feel considered — never to draw attention to itself.**

Derived from Phase 0 §7 ("motion should reinforce professionalism; avoid flashy effects"):

1. **Motion clarifies, never decorates.** Every animation answers "what changed?" or "where did this come from?"
2. **Nothing bounces.** No elastic, no overshoot, no spring. These read as playful; this brand is calm.
3. **Once, not repeatedly.** Reveals fire a single time. Nothing loops. Nothing pulses. Nothing demands attention while being read.
4. **Slow in, fast out.** Entrances 500–700ms; dismissals 180–240ms. Waiting to leave feels sluggish.
5. **Compositor only.** `transform` and `opacity`. Never animate `width`, `height`, `top`, or `box-shadow`.
6. **Motion is a courtesy, not a gate.** Content is never invisible pending an animation. Reveal states are applied by JS, so a JS failure leaves content visible.

## 12.2 Motion Tokens

```css
--durationInstant:  120ms;   /* State flips */
--durationFast:     200ms;   /* Hover, dismissal */
--durationBase:     320ms;   /* Panels, accordions */
--durationSlow:     560ms;   /* Reveals */
--durationScene:    900ms;   /* Scene crossfade */

--easeOut:    cubic-bezier(0.16, 1, 0.30, 1);    /* Default entrance */
--easeInOut:  cubic-bezier(0.65, 0, 0.35, 1);    /* Bidirectional */
--easeScene:  cubic-bezier(0.45, 0, 0.55, 1);    /* Scene — symmetrical, no acceleration character */
```

## 12.3 Motion Inventory

| Pattern | Spec |
|---|---|
| Section reveal | `opacity 0→1`, `translateY(16px)→0`, `--durationSlow`, `--easeOut`, IO threshold 0.15, fires once |
| Stagger | 60ms per item, capped at 6 items (360ms total) |
| Hero entrance | Eyebrow → H1 → lede → CTAs → portrait, 80ms apart, begins on `DOMContentLoaded` |
| Portrait parallax | `translateY` ±12px max, ≥1024px only, `transform` only |
| Scene crossfade | Layer `opacity`, `--durationScene`, `--easeScene` |
| Header compress | `height` + `background` over `--durationBase` |
| Mega panel | `opacity` + `translateY(8px)`, 220ms in / 160ms out |
| Mobile overlay | Backdrop 240ms; items 40ms stagger |
| Accordion | `grid-template-rows: 0fr → 1fr`, `--durationBase` (the modern zero-JS-height technique) |
| Card hover | `translateY(-2px)` + gold hairline opacity, `--durationFast` |
| Link underline | `scaleX(0)→(1)`, `transform-origin` left, `--durationFast` |
| Focus ring | **No transition.** Focus must be instant. |

## 12.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce)
{

    *,
    *::before,
    *::after
    {

        animation-duration: 0.01ms !important;

        animation-iteration-count: 1 !important;

        transition-duration: 0.01ms !important;

        scroll-behavior: auto !important;

    }

}
```

Plus targeted handling: parallax disabled entirely; reveal transforms removed (opacity retained at full, no fade-in delay); scene changes still occur, instantaneously. **The design intent survives without motion** — this is the test of whether the motion was decorative.

---

# 13. Accessibility Strategy

**Target: WCAG 2.2 Level AA, fully conformant.** Selected AAA criteria met where the palette already delivers them.

The Foundation lists "Accessible" as a non-negotiable. For a law firm this is also a commercial and legal exposure question — public-accommodation website claims are an active litigation category.

## 13.1 Structure & Semantics

| Requirement | Implementation |
|---|---|
| Landmarks | One `<header>`, `<nav aria-label>` per nav, one `<main id="mainContent">`, `<footer>`. Complementary regions labelled. |
| Skip link | First focusable element → `#mainContent`. Visible on focus, gold on dark / black on light. |
| Headings | Exactly one `<h1>` per page. No skipped levels. Verified per template, not per page. |
| Lists | Navigation, practice grids, and county lists are real `<ul>` — screen readers announce item counts. |
| Language | `<html lang="en">` |
| Page titles | Unique, front-loaded with the distinguishing term |

## 13.2 Keyboard

| Requirement | Implementation |
|---|---|
| Full operability | Every interactive element reachable and operable by keyboard |
| Focus visible (2.4.7) | 2px solid `--focusRing` + 2px offset. **Never `outline: none` without replacement.** |
| Focus not obscured (2.4.11 — new in 2.2) | Sticky header uses `scroll-padding-block-start: 96px` so focused elements never hide beneath it |
| Focus order (2.4.3) | DOM order matches visual order. No positive `tabindex`. |
| Mega menu | Disclosure pattern, no trap, `Escape` closes (§6.3) |
| Mobile menu | Modal pattern, focus trapped, `inert` background (§7.4) |
| Accordions | Native `<details>` — keyboard support is free and correct |

## 13.3 Contrast & Colour

- Full audit in §10.4. All text combinations meet **4.5:1** minimum; most exceed 7:1.
- Non-text contrast (1.4.11): borders, focus rings, and form field boundaries meet **3:1** — verified for both scenes.
- **Colour is never the sole carrier of meaning** (1.4.1). Form errors carry an icon + text, not just red. Active nav state carries an underline, not just gold.
- **Scene transition contrast guarantee:** because tokens are scene-scoped, no element can enter an intermediate state where its text and background are both mid-tone. Text colour and background colour transition on the same timing function and duration, so contrast is monotonic across the transition. This is a real risk in scroll-driven colour designs and it is designed out.

## 13.4 Forms

| Requirement | Implementation |
|---|---|
| Labels | Persistent visible `<label for>`. **No placeholder-as-label.** |
| Required fields | `required` + `aria-required`, marked in text not just asterisk colour |
| Errors (3.3.1) | Inline, text + icon, associated via `aria-describedby`, summarised in an `aria-live="polite"` region |
| Error suggestion (3.3.3) | Messages say how to fix, not just what is wrong |
| Autocomplete (1.3.5) | `autocomplete="name"`, `"tel"`, `"email"` on the relevant fields |
| Redundant entry (3.3.7 — new in 2.2) | No information requested twice |
| Grouping | `<fieldset>` + `<legend>` for radio groups |
| Non-engagement notice | Visible adjacent to the submit control — a compliance *and* usability requirement |

## 13.5 Target Size & Input

- WCAG 2.2 SC 2.5.8 requires 24×24px minimum. **This project uses 48×48px** for all primary targets and 44×44px minimum for inline text links in tap-dense areas.
- Pointer gestures (2.5.1): no path-based or multipoint gestures anywhere.
- Dragging movements (2.5.7 — new in 2.2): none used.

## 13.6 Media & Motion

| Requirement | Implementation |
|---|---|
| Alt text policy | Portrait: descriptive. Office: descriptive. Decorative gold geometry and icons paired with text: `alt=""` + `aria-hidden="true"`. **Logo alt = "Austin G. Ervin, Attorney at Law, LLC"** — not "logo". |
| Reduced motion (2.3.3) | §12.4 |
| Flashing (2.3.1) | Nothing flashes. Not applicable by design. |

## 13.7 Reflow & Zoom

- **Reflow (1.4.10):** content reflows to a 320px-wide viewport with no horizontal scroll. Verified at 400% zoom on a 1280px viewport.
- **Text spacing (1.4.12):** layout survives line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12em, word-spacing 0.16em. No fixed-height text containers anywhere — this is why §9.5's flow primitive matters.
- Root font-size in `rem` throughout. No `px` font sizes that would defeat browser text-size preferences.

## 13.8 Verification Plan

| Stage | Method |
|---|---|
| Authoring | ESLint-jsx-a11y-equivalent discipline via manual checklist per component |
| Automated | axe-core DevTools + Lighthouse a11y on every template |
| Manual keyboard | Full traversal of every template, no mouse |
| Screen reader | NVDA + Firefox (Windows) and VoiceOver + Safari (iOS) on homepage, practice page, and contact form |
| Zoom | 200% and 400% |
| Contrast | Values in §10.4 re-verified against final CSS |

**`/accessibility-statement/` will document the conformance target, known limitations, and a contact route for accessibility problems.**

---

# 14. Performance Strategy

## 14.1 Budgets (enforced, not aspirational)

| Metric | Budget | Target |
|---|---|---|
| **LCP** (mobile, 4G) | < 2.0s | < 1.2s |
| **CLS** | < 0.05 | 0.00 |
| **INP** | < 200ms | < 120ms |
| **TTFB** | < 500ms | < 300ms |
| FCP | < 1.5s | < 0.9s |
| Homepage total transfer | ≤ 600 KB | ≤ 420 KB |
| Homepage requests | ≤ 28 | ≤ 20 |
| CSS (gzip) | ≤ 18 KB | ≤ 14 KB |
| JS (gzip) | ≤ 10 KB | ≤ 7 KB |
| Fonts total | ≤ 130 KB | ≤ 118 KB |
| Hero image | ≤ 140 KB | ≤ 90 KB |
| Lighthouse (all 4 categories) | ≥ 95 | 100 |

Rationale for strictness: the research characterises this audience as mobile, often rural southern Ohio / northeastern Kentucky, frequently searching under stress and after hours. Network conditions are not a hypothetical constraint here.

## 14.2 LCP Strategy

The LCP element will be either the hero H1 or the portrait. Both are optimised:

- Portrait: `fetchpriority="high"`, **not** lazy-loaded, `preload` hinted, AVIF-first with WebP and JPEG fallback via `<picture>`.
- H1: its font (Cormorant 600) is preloaded and has metric-matched fallback overrides, so it paints immediately in fallback and swaps with zero shift.
- Critical CSS for the hero is inlined; nothing above the fold waits on the external stylesheet.
- No JavaScript executes before LCP.

## 14.3 Image Strategy

| Rule | Detail |
|---|---|
| Formats | AVIF → WebP → JPEG, via `<picture>` |
| Responsive | `srcset` + `sizes` at 480 / 768 / 1200 / 1600 / 2400 widths |
| Dimensions | Explicit `width` and `height` on **every** image — this is the primary CLS control |
| Aspect ratio | `aspect-ratio` in CSS as a second guard |
| Lazy | `loading="lazy"` on everything below the fold; **never** on the hero |
| Decoding | `decoding="async"` on non-critical images |
| Compression | AVIF q≈55, WebP q≈78 — verified visually, not assumed |

## 14.4 CSS Strategy

- Single concatenated production stylesheet, hashed filename, `Cache-Control: max-age=31536000, immutable`.
- ~9 KB critical CSS inlined for the hero.
- No CSS-in-JS, no runtime style computation, no unused framework CSS (there is no framework).
- `content-visibility: auto` with `contain-intrinsic-size` on below-fold sections — measurable rendering win on long pages at effectively zero cost.

## 14.5 JavaScript Strategy

- Two modules, `defer`, zero dependencies, target ≤ 7 KB gzipped combined.
- All observers passive; **no scroll event listeners anywhere** (IntersectionObserver only).
- All resize handling debounced at 150ms.
- Event delegation for the practice grid and accordion groups rather than per-node listeners.
- No polyfills — `IntersectionObserver`, `<details>`, CSS custom properties, and `clamp()` are universally supported in the target matrix.

## 14.6 Third-Party Policy

**Default position: zero third-party requests.**

| Service | Position |
|---|---|
| Google Fonts | ❌ Self-hosted instead |
| Google Analytics | ⚠️ **Open Question Q9.** If required, load on `requestIdleCallback` after LCP. Cost: ~45 KB + a third-party connection. Recommend Cloudflare Web Analytics (privacy-preserving, no cookie banner, ~0 KB) instead. |
| Google Maps embed | ❌ **Do not embed.** A live embed costs 300 KB+ and multiple third-party connections. Use a static map image linking out to Google Maps — visually identical, ~15 KB. |
| Live chat | ❌ Not at launch. The research flags it as conditional and warns it "may create a communication problem" if unstaffed — which is precisely this firm's known weakness. |
| Review widgets | ❌ Render reviews as static, permission-cleared HTML. |

## 14.7 Delivery

- Static host with global CDN (Cloudflare Pages recommended — consistent with ecosystem practice).
- Brotli compression.
- HTTP/2 or HTTP/3.
- Immutable hashed assets; `no-cache` on HTML with ETag revalidation.
- Security headers: `Content-Security-Policy` (tight — self only), `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying unused features.

---

# 15. SEO Strategy

Built directly on the verified keyword clusters in `deep-research-report.md` §"SEO Research".

## 15.1 Technical Foundation

| Item | Specification |
|---|---|
| URLs | Lowercase, hyphenated, directory-style, ≤ 3 segments (§3) |
| Canonical | Self-referencing `<link rel="canonical">` on every page |
| Sitemap | `sitemap.xml`, `lastmod` maintained, referenced from `robots.txt` |
| Robots | Allow all; disallow `/thank-you/` |
| Noindex | `/thank-you/`, `/404.html` |
| Structured data | §15.4 |
| Core Web Vitals | §14.1 — a direct ranking factor |
| Mobile | Mobile-first indexing; identical content across viewports |
| HTTPS | Enforced, HSTS |
| Breadcrumbs | Rendered + `BreadcrumbList` markup |

## 15.2 Metadata Patterns

| Template | Title pattern (≤ 60 chars) |
|---|---|
| Home | `Portsmouth OH Attorney | Austin G. Ervin, Attorney at Law` |
| Practice hub | `Practice Areas | Austin G. Ervin, Portsmouth OH` |
| Practice detail | `{Service} Lawyer in Portsmouth, OH | Austin G. Ervin` |
| OVI page | `OVI & DUI Lawyer in Portsmouth, OH | Austin G. Ervin` |
| County | `{County} County {Service} Lawyer | Austin G. Ervin` |
| Attorney | `Austin G. Ervin — Ohio & Kentucky Attorney | Portsmouth` |
| FAQ | `Legal FAQ — Ohio & Kentucky | Austin G. Ervin` |
| Contact | `Contact | Austin G. Ervin, Attorney at Law, Portsmouth OH` |

Meta descriptions: 140–155 characters, written per page, containing the primary term and a call to action. Never auto-generated, never duplicated.

## 15.3 On-Page Term Strategy

**The OVI/DUI/DWI nuance is the single most actionable SEO finding in the research.** Ohio's statutory term is *OVI*; the public overwhelmingly searches *DUI*. The implementation:

- URL: `/practice-areas/ovi-dui/`
- H1: "OVI and DUI Defense in Portsmouth, Ohio"
- H2s covering: "What is the difference between OVI, DUI, and DWI in Ohio?", licence consequences, first offence, refusal
- Body copy leads with OVI (correct, authoritative) while naturally using DUI/DWI (matches search demand)
- Meta description carries all three terms

Kentucky and Ohio content stays on **separate pages** — the research is explicit that procedure and terminology differ and that merged pages create cross-state confusion.

## 15.4 Structured Data Stack

Per the research's recommended schema stack. All JSON-LD, all in `<head>`.

**Sitewide** (`LegalService` — verified NAP only):

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": "https://{domain}/#practice",
  "name": "Austin G. Ervin, Attorney at Law, LLC",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "602 Chillicothe Street, Suite 206",
    "addressLocality": "Portsmouth",
    "addressRegion": "OH",
    "postalCode": "45662",
    "addressCountry": "US"
  },
  "telephone": "+1-740-529-1420",
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Scioto County, Ohio" },
    { "@type": "AdministrativeArea", "name": "Adams County, Ohio" },
    { "@type": "AdministrativeArea", "name": "Pike County, Ohio" },
    { "@type": "AdministrativeArea", "name": "Lawrence County, Ohio" }
  ],
  "priceRange": "$$"
}
```

| Type | Placement |
|---|---|
| `LegalService` + `LocalBusiness` | Sitewide |
| `Attorney` / `Person` | Attorney bio page, linked to the LegalService `@id` |
| `Organization` (logo, sameAs) | Sitewide — disambiguates brand and logo |
| `BreadcrumbList` | Every interior page |
| `WebSite` | Homepage |
| `FAQPage` | FAQ centre + each practice page's FAQ block |
| `Service` | Each practice-area page |

> **Expectation setting:** the research correctly notes Google has narrowed FAQ rich results largely to government and health sites. FAQ markup is implemented for **semantic comprehension and entity clarity**, not on the expectation of rich snippets.

**`sameAs` must list only profiles the attorney confirms he controls** — Facebook, LinkedIn, Avvo, Martindale, Google Business Profile.

## 15.5 Local SEO

| Action | Detail |
|---|---|
| NAP consistency | The exact string in §15.4 is the canonical NAP. It appears in the footer of every page, in schema, and in GBP — character-for-character identical. |
| **Citation cleanup** | The research found real conflicts: Experience.com lists phone **(740) 456-7723**, and a Birdeye-adjacent listing shows **Suite #224** instead of Suite 206. Hours conflict across sources. **These must be corrected before or in parallel with launch** — inconsistent NAP actively suppresses local ranking. This is a client-side task, not a build task, and it needs an owner. |
| GBP alignment | Site categories, services, and hours must match GBP exactly. |
| County pages | Genuinely distinct content per county — courthouse context, local specifics. **No templated spinning.** Thin duplicated county pages are a penalty risk, which is why they are Tier 2/3, not launch. |
| Embedded NAP | Address marked up in the footer with microdata-compatible structure |

## 15.6 Content & Editorial

Priority publishing order, drawn from the research's highest-opportunity list:

1. Ohio OVI: what happens after arrest / licence consequences
2. Ohio protection orders: types and how to file
3. Divorce cost and timeline in Ohio
4. Ohio record sealing and expungement eligibility
5. Probate: what an executor should do first
6. Kentucky divorce separation requirement *(gated on Q3)*

Every article: original, jurisdiction-specific, plain-English, dated, linked to its practice hub, and carrying the legal-information disclaimer.

## 15.7 Advertising Compliance (Hard Constraints)

Governed by Ohio Prof. Cond. R. 7.1 / 7.2 and Kentucky SCR 3.130-7.01–7.60. These are **build rules**, not suggestions:

| Prohibited | Required |
|---|---|
| "Best," "top," "#1," or any unverifiable superlative | Non-engagement disclaimer adjacent to every form |
| Claims of specialisation or certification not held | Legal-information-not-advice notice on educational content |
| Implying past results predict future outcomes | Attorney identification and office location |
| Awards, memberships, or admissions not verified (§19 R6) | Testimonials used only with documented permission |
| Implying form submission creates an attorney-client relationship | Accurate description of jurisdictions where licensed |

**Copy gate:** no page ships until its claims are traceable to the verified-facts table in `deep-research-report.md` or to written confirmation from the attorney.

---

# 16. Folder Structure

```
client_AustinGErvin/
│
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
│
├── about/index.html
├── attorney/index.html
├── contact/index.html
├── faq/index.html
├── thank-you/index.html
│
├── practice-areas/
│   ├── index.html
│   ├── criminal-defense/index.html
│   ├── ovi-dui/index.html
│   ├── family-law/index.html
│   ├── divorce/index.html
│   ├── child-custody/index.html
│   ├── protection-orders/index.html
│   ├── estate-planning/index.html
│   └── probate/index.html
│
├── service-areas/           ← Tier 2/3
│   ├── index.html
│   └── scioto-county/index.html
│
├── resources/               ← Tier 3
│   └── index.html
│
├── disclaimer/index.html
├── privacy-policy/index.html
├── accessibility-statement/index.html
│
├── css/
│   ├── tokens.css           Layer 0 — primitives, semantics, scene maps
│   ├── base.css             Layer 1 — reset, root type, focus, print
│   ├── layout.css           Layer 2 — container, grid, section, flow
│   ├── components.css       Layer 3 — all reusable components
│   ├── styleIndex.css       Layer 4 — homepage compositions
│   ├── stylePages.css       Layer 4 — interior page compositions
│   └── utilities.css        Layer 5 — escape hatches
│
├── js/
│   ├── siteJS.js            Global: nav, mega menu, mobile menu,
│   │                        accordions, reveals, form
│   └── indexJS.js           Homepage: scene observer, hero parallax
│
├── graphics/
│   ├── logos/
│   │   ├── logoMark.svg              Shield + scales, currentColor
│   │   ├── logoLockupHorizontal.svg  Nav lockup
│   │   ├── logoLockupStacked.svg     Footer / mobile
│   │   └── logoWordmark.svg
│   ├── images/
│   │   ├── portraitAustinHero.avif|.webp|.jpg     (+ 5 srcset widths)
│   │   ├── portraitAustinBio.avif|.webp|.jpg
│   │   ├── officeExterior.*
│   │   ├── officeInterior.*
│   │   ├── officeDoor.*
│   │   └── portsmouthContext.*
│   ├── icons/
│   │   └── iconSprite.svg            Single sprite, symbol-referenced
│   ├── favicons/
│   │   ├── favicon.ico
│   │   ├── favicon.svg               Shield only, per Foundation §Logo System
│   │   ├── appleTouchIcon.png        180×180
│   │   ├── icon192.png
│   │   └── icon512.png
│   └── social/
│       ├── ogDefault.jpg             1200×630
│       └── ogPracticeAreas.jpg
│
├── fonts/
│   ├── inter-variable-subset.woff2
│   ├── cormorantGaramond-600-subset.woff2
│   └── cormorantGaramond-500-subset.woff2
│
├── docs/
│   ├── Austin_Phase1_ImplementationPlan.md    ← this document
│   ├── contentInventory.md                    Page-by-page copy status
│   ├── designSystem.md                        Token + component reference
│   ├── accessibilityAudit.md
│   ├── deploymentGuide.md
│   └── archive/
│       └── ChatGPT_DeepResearch_WorkingCopy.md
│
├── Austin_ProjectFoundation.md
├── Austin_Phase0_ArchitectureBrief.md
├── deep-research-report.md
├── agents.md
├── claude.md
└── codeStyle.md
```

**Note:** `graphics/qrCodes/` and `graphics/favicons/` already exist and are empty; `graphics/TPLogo1.png`, `logo1.png`, and `potentialFavicon.png` are exploration artefacts and should be moved to `graphics/_source/` rather than deleted, so the originals remain available for the SVG redraw.

---

# 17. Component Naming Conventions

Extends `codeStyle.md` (camelCase classes/IDs, `is*` state classes) with the structure a 25-page component system needs.

## 17.1 Class Naming

| Kind | Pattern | Example |
|---|---|---|
| Component root | `componentName` | `.practiceCard` |
| Component element | `componentNameElement` | `.practiceCardTitle`, `.practiceCardIcon` |
| Variant | `componentNameIsVariant` | `.buttonPrimaryIsLarge` |
| State (toggled by JS) | `isState` / `hasState` | `.isOpen`, `.isActive`, `.hasError` |
| Layout primitive | `layoutName` | `.container`, `.grid`, `.flow`, `.stack` |
| Utility | `utilityName` | `.visuallyHidden`, `.textBalance` |

```html
<article class="practiceCard isFeatured">

    <h3 class="practiceCardTitle">
        Criminal Defense
    </h3>

    <p class="practiceCardBody">
        ...
    </p>

</article>
```

**Depth limit:** component element names are one level deep. `.practiceCardTitleTextSpan` is a signal that the component should be decomposed.

## 17.2 JavaScript Hooks — the Decoupling Rule

> **JavaScript must never select an element by its styling class.**

All JS targeting uses `data-` attributes:

```html
<button
    class="navToggle"
    data-nav-toggle
    aria-expanded="false"
    aria-controls="mobileMenu"
>
```

```javascript
const navToggleButton = document.querySelector('[data-nav-toggle]');
```

**Why this is non-negotiable:** it means a designer can rename or restructure a class without breaking behaviour, and a developer can see at a glance which elements carry behaviour. In a hand-authored 25-page static site with no compiler to catch a broken selector, this convention is the main defence against silent runtime breakage.

**Reserved data attributes:** `data-nav-toggle`, `data-mega-trigger`, `data-mega-panel`, `data-mobile-menu`, `data-accordion`, `data-reveal`, `data-reveal-group`, `data-scene-trigger`, `data-scene-layer`, `data-parallax`, `data-form`, `data-field`.

## 17.3 CSS Custom Property Naming

| Layer | Pattern | Example |
|---|---|---|
| Primitive | `--colorName` | `--colorGold` |
| Semantic | `--roleName` | `--surfaceRaised`, `--textMuted` |
| Scale | `--scaleN` | `--space6`, `--fontDisplayXl` |
| Motion | `--durationName`, `--easeName` | `--durationSlow`, `--easeOut` |
| Component-local | `--componentNameProperty` | `--practiceCardPadding` |

## 17.4 JavaScript Naming

Per `codeStyle.md`: descriptive camelCase variables, action-oriented functions.

| Kind | Pattern | Example |
|---|---|---|
| Element reference | `{noun}Element` / `{noun}Button` | `mobileMenuElement`, `navToggleButton` |
| Collection | plural + type | `revealElements`, `accordionItems` |
| Boolean state | `is*` / `has*` | `isMobileMenuOpen` |
| Function | verb + noun | `openMobileMenu()`, `initialiseSceneObserver()` |
| Constant | `SCREAMING_SNAKE` | `SCENE_OBSERVER_MARGIN` |
| Init | `initialise{System}()` | `initialiseMegaMenu()` |

## 17.5 File & Section Conventions

- CSS and JS filenames: **camelCase**, per existing ecosystem precedent.
- HTML routes: **lowercase-hyphenated directories**, pending approval (Q10).
- Every major section in every file opens with the `codeStyle.md` banner:

```css
/* ============================================================
   PRACTICE CARD
============================================================ */
```

---

# 18. Asset Organization

## 18.1 Current Asset Audit

Measured, not estimated:

| File | Dimensions | Size | Verdict |
|---|---|---|---|
| `owner_AustinGErvin.webp` | **147 × 254** | 23.5 KB | ❌ Unusable — GBP thumbnail |
| `AustinGErvin_AttorneyAtLaw.jpg` | **400 × 400** | 19.3 KB | ❌ Too small for hero (need ≥ 2400px) |
| `suite206PortsmouthOH.webp` | **126 × 254** | 25.9 KB | ❌ Unusable |
| `suite206_PortsmouthOH.webp` | **126 × 254** | 20.5 KB | ❌ Unusable; also a near-duplicate |
| `theOne_Logo.png` | 1024 × 1024 | 1.37 MB | ❌ Raster, baked grey background, glow effect |
| `theTwo_Logo.png` | 1024 × 1024 | 1.34 MB | ❌ Raster, baked gradient background |
| `TPLogo1.png` | 1024 × 1024 | 1.39 MB | Exploration artefact |
| `logo1.png` | 1254 × 1254 | 842 KB | Exploration artefact |
| `potentialFavicon.png` | 1024 × 1024 | 1.31 MB | Source for favicon redraw |
| `ogLogo.webp` | 244 × 244 | 18.1 KB | Too small for OG (need 1200 × 630) |

**Conclusion: not one currently supplied asset is production-ready.** See Risks R1 and R2 — these are the two hard blockers on the build.

One useful discovery: `suite206PortsmouthOH.webp` shows the firm's **actual applied logo** on the office door — a shield-and-scales mark above a stacked "AUSTIN G. ERVIN / ATTORNEY AT LAW, LLC" wordmark. This confirms the lockup direction in the Foundation brief and should be used as the reference for the SVG redraw, so the website mark matches the physical office signage.

## 18.2 Logo System Requirements

Per Foundation §Logo System, delivered as **SVG**:

| File | Composition | Use |
|---|---|---|
| `logoMark.svg` | Shield + scales only | Favicon source, compact header, footer mark |
| `logoLockupHorizontal.svg` | Mark + wordmark to its right | Desktop header (per Phase 0 §3) |
| `logoLockupStacked.svg` | Mark above wordmark | Footer, mobile menu — matches office door |
| `logoWordmark.svg` | Wordmark only | Print, OG images |

**Mandatory SVG properties:**

1. **No baked background.** Current PNGs carry grey gradients that make them unusable on both light and dark scenes.
2. **No glow or drop shadow baked in.** The current mark's neon glow contradicts "calm, confident, intentional."
3. **`fill="currentColor"` on the wordmark**, so it inverts automatically as the header crosses from Scene 1 into Scene 3. This is required by the scene architecture.
4. Gold applied via a CSS custom property, not a hard-coded hex, so the accent stays token-governed.
5. Optimised (SVGO), ≤ 4 KB each, `viewBox` set, no embedded raster.
6. Minimum clear space = 0.5 × mark height. Minimum mark size = 28px.

## 18.3 Photography Requirements

Per the research's photography priority table:

| Asset | Priority | Minimum resolution | Purpose |
|---|---|---|---|
| Hero portrait | **Essential** | 2400 × 3000, uncompressed source | Hero focal point |
| Bio portrait | Essential | 1600 × 2000 | Attorney page |
| Attorney at desk | Essential | 2400 × 1600 | About, process |
| Office exterior / entry | Essential | 2400 × 1600 | Local credibility, GBP alignment |
| Conference / consultation room | High | 2400 × 1600 | Reduces anxiety, sets expectations |
| Downtown Portsmouth context | High | 2400 × 1600 | Local identity |
| Courthouse-adjacent environmental | High | 2400 × 1600 | Legal context |
| Attorney with documents | High | 2400 × 1600 | Competence signal |

**Direction for the shoot:** neutral warm lighting, shallow depth of field, no harsh flash, no stock-library composition, muted wardrobe that harmonises with the gold accent (see Risk R3). The visual system should read "clean, grounded, local, and confident" — the research's exact words.

## 18.4 Naming & Delivery Conventions

```
{subject}{Context}{Variant}.{ext}
portraitAustinHero.avif
portraitAustinHero-1200.webp
officeExteriorDusk.jpg
```

- camelCase, descriptive, no spaces, no dates.
- Every raster ships as AVIF + WebP + JPEG.
- Responsive widths: 480, 768, 1200, 1600, 2400.
- Originals archived in `graphics/_source/` (git-ignored if the project is versioned).
- Icons in a single `iconSprite.svg`, referenced by `<use>` — one request for all icons.

## 18.5 Favicon & Social Set

| File | Size | Notes |
|---|---|---|
| `favicon.svg` | vector | Shield only, per Foundation. Modern browsers prefer this. |
| `favicon.ico` | 32 × 32 | Legacy fallback |
| `appleTouchIcon.png` | 180 × 180 | Solid background — iOS does not honour transparency |
| `icon192.png` / `icon512.png` | — | `site.webmanifest` |
| `ogDefault.jpg` | 1200 × 630 | Wordmark + portrait + gold rule on black |

---

# 19. Risks & Open Questions

## 19.1 Risks

### R1 — Portrait resolution is a hard blocker on the hero *(Critical)*

The hero's stated focal point is Austin's portrait. The largest supplied portrait is **400 × 400px**; the WebP is **147 × 254px**. A full-bleed hero portrait needs **≥ 2400px** on its long edge to render on a 2× display. Upscaling will look soft and amateur — the precise opposite of "premium," and it would undermine the trust the hero exists to build.

- **Impact:** Scene 1 cannot be built to specification.
- **Mitigation:** commission a professional headshot session (the research already lists this as Essential priority).
- **Interim path:** build the hero with a treated, tightly-cropped version of the 400px asset at a deliberately reduced display size, with the layout engineered so a higher-resolution file is a drop-in replacement. **This is a temporary state, not a launch state.**
- **Owner:** client. **Needed before:** Phase 3.

### R2 — Logo assets are raster with baked backgrounds *(Critical)*

Both logo files are 1024px PNGs (~1.35 MB each) with grey gradient backgrounds and glow effects baked in. They cannot be placed on a light hero or a black footer, cannot invert with the scene system, cannot scale for print, and would alone blow the entire page-weight budget.

- **Impact:** the navigation lockup — the first element a visitor sees — cannot be built correctly.
- **Mitigation:** redraw as SVG (§18.2), using the office-door signage as the fidelity reference.
- **Effort:** ~4–6 hours of vector work.
- **Owner:** Nulo Studio, on approval.

### R3 — Purple tie conflicts with the gold accent *(Medium)*

The portrait's purple tie is the most saturated colour in the frame and sits directly against a gold-accented, warm-neutral palette. Purple and gold are near-complementary; the tie will pull attention from the headline and dilute the "gold is the only accent" discipline.

- **Mitigation, in order of preference:** (1) shoot new photography with navy, charcoal, or burgundy; (2) grade the existing image to desaturate the tie; (3) crop tighter to reduce its area.
- **Owner:** client (shoot) or Nulo Studio (grade).

### R4 — Content volume is the true critical path *(High)*

Tier 1 requires roughly **12,000–15,000 words** of original, jurisdiction-accurate, ethically compliant legal copy. Copy — not code — will determine the launch date. Thin or duplicated practice pages carry a real ranking penalty, which is exactly what the research warns against.

- **Mitigation:** begin copy in parallel with the build, not after it. Maintain `docs/contentInventory.md` with per-page status. Launch Tier 1 only when every Tier 1 page meets its word-count and module contract.

### R5 — No form backend exists *(High)*

A static site cannot process a form. The consultation form is the primary conversion mechanism and currently has nowhere to submit.

- **Options:** (a) Cloudflare Worker + email relay — consistent with ecosystem practice, full control, recommended; (b) a third-party form service — fastest, adds a third-party dependency; (c) `mailto:` — **not acceptable**, it fails silently for many users.
- **Additional consideration:** prospective-client intake may contain sensitive facts. Submissions must travel over HTTPS to an endpoint the attorney controls, and the non-engagement notice must appear before submission. Spam protection should be a honeypot plus timing check first; a CAPTCHA only if abuse proves it necessary (CAPTCHAs cost accessibility and conversion).
- **Owner:** decision needed from client before Phase 3.

### R6 — Unverifiable claims are a compliance exposure *(High)*

The research explicitly could not verify: bar memberships, awards, federal admissions, peer endorsements, publications, community service, staff, and case results. Ohio R. 7.1 and Kentucky SCR 3.130-7 prohibit false or misleading communications.

- **Mitigation:** the copy gate in §15.7 — every claim traceable to the verified table or to written client confirmation. Where a trust signal is absent, the site compensates with clarity, responsiveness, and education rather than manufactured prestige. This is also the research's own strategic recommendation.

### R7 — Testimonials require documented permission *(Medium)*

Review quotes are planned for the homepage. Using client statements in advertising without permission creates both an ethics and a confidentiality problem.

- **Mitigation:** written permission per quote, held on file. Attribution by first name and initial only. Aggregate ratings cited only with a named, verifiable source.

### R8 — NAP inconsistencies actively suppress local ranking *(Medium)*

The research found a conflicting phone number on Experience.com **(740) 456-7723** and a conflicting suite number **#224** on a Birdeye-adjacent listing, plus widely varying hours across sources.

- **Mitigation:** a citation cleanup pass, owned by the client, running in parallel with the build. Launching a technically excellent site on top of contradictory citations wastes much of the local SEO benefit.

### R9 — Scene system on low-end devices *(Low)*

A fixed full-viewport backdrop with crossfading layers can stutter on older Android hardware.

- **Mitigation:** opacity-only crossfade on `will-change`-hinted layers (compositor path); `IntersectionObserver` rather than scroll listeners; instant scene switching under `prefers-reduced-motion`. Verify on a real mid-range Android device, not only in DevTools throttling.

### R10 — Multi-page CSS/JS drift *(Low, long-term)*

Twenty-five hand-authored HTML files sharing a header and footer means twenty-five places to update a navigation link.

- **Mitigation now:** strict template discipline, one canonical header/footer block documented in `docs/designSystem.md`, and a pre-launch consistency check.
- **Mitigation later:** see Recommendation 20.1.

## 19.2 Open Questions Requiring Attorney Confirmation

Prioritised. **Q1–Q5 block Phase 2 (content architecture).**

| # | Question | Blocks | Why it matters |
|---|---|---|---|
| **Q1** | Which practice areas are the highest priority for revenue and growth? | Homepage, nav order, mega menu | Determines what occupies the primary conversion surface. The research explicitly flags this as unknown. |
| **Q2** | Is personal injury a genuine growth focus, or occasional work? | Whether `/practice-areas/personal-injury/` is built | PI is the most competitive category in the market (KNR runs a dedicated Scioto County page). A thin PI page loses; a serious one is a major investment. |
| **Q3** | Are Kentucky matters actively handled today — and in which counties and courts? | All KY pages and county pages | Dual-state licensure is the strongest verified differentiator, but marketing Kentucky work that is not actively taken creates client confusion and a compliance risk. |
| **Q4** | What is the consultation model and fee structure? Are consultations free? | Every CTA on the site | Competitors advertise "free consultation" prominently. CTA copy cannot be finalised without this. |
| **Q5** | What are the actual office hours and after-hours intake process? | Header, footer, contact, schema, GBP | Sources currently conflict between "Open 24 hours" and weekday schedules. |
| **Q6** | Exact undergraduate institution and degree? | Attorney bio | Research verified only *partially* — Shawnee State 2020 baccalaureate, major inferred but not confirmed. Must not be published unverified. |
| **Q7** | Any professional memberships, awards, federal admissions, or certifications? | Credentials blocks, trust signals | None publicly verifiable. If they exist, they materially strengthen the site. |
| **Q8** | Which testimonials may be used, and is written permission available? | Reviews section | See R7. |
| **Q9** | Analytics preference — Google Analytics, Cloudflare Web Analytics, or none? | Performance budget, privacy policy, cookie banner requirement | GA requires a consent mechanism; Cloudflare Web Analytics does not. |
| **Q10** | Approve hyphenated directory URLs over ecosystem camelCase filenames? | Entire folder structure | See §3. SEO-motivated deviation from precedent; needs an explicit decision because it is difficult to reverse after indexing. |
| **Q11** | What is the domain? Has it been purchased? | Canonical URLs, schema `@id`, OG tags, sitemap | The research found no existing website. Every absolute URL depends on this. |
| **Q12** | Firm founding / LLC formation date? | About page, "years serving" language | Unverified. Cannot be stated without confirmation. |
| **Q13** | Personal origin story — why law, why Portsmouth? | About page | The About page cannot be meaningful without it, and it is the strongest available differentiator against generic competitors. |
| **Q14** | Is there any staff beyond the attorney? | Whether the site says "I" or "we" | Affects voice on every page. Saying "our team" when there is no team is misleading. |
| **Q15** | Has malpractice carrier or bar counsel provided disclaimer language preferences? | `/disclaimer/`, form notices | Better to adopt preferred wording now than to retrofit it. |

---

# 20. Recommendations

These strengthen the implementation. **None alters the established vision** — each serves the Foundation's stated non-negotiables more completely.

### 20.1 Adopt an HTML partial-include step *(recommended, requires approval)*

Twenty-five pages sharing a header, footer, and schema block is the project's main long-term maintenance liability (R10). A minimal build step — Eleventy, or even a ~40-line Node script — would let the header exist once.

**However:** `agents.md` is explicit that folder structures and technologies are not to be migrated without instruction, and the ecosystem is deliberately build-free. **My recommendation is to build Tier 1 with hand-authored HTML as planned, and revisit this only if Tier 2/3 proceeds** (at which point the page count roughly doubles and the calculus changes). Flagging it now so the decision is deliberate rather than inherited. The folder structure in §16 is compatible with either path.

### 20.2 Make the scene system serve interior pages too *(no approval needed)*

The cinematic light→dark descent is specified for the homepage. Because scenes are token-scoped, interior pages get a simplified version essentially free: light page hero → dark conversion footer. This makes the whole site feel like one continuous experience rather than a cinematic homepage bolted to conventional subpages — which is the Foundation's actual intent, extended honestly.

### 20.3 Build the "What happens after you call" block as a core component

Already in the homepage blueprint (§2.2 §5), but worth stating as a recommendation: this single module converts the firm's most visible reputational weakness into an explicit promise, and it should also appear on every high-urgency practice page (criminal, OVI, protection orders). It is the highest-ROI content module in the plan.

### 20.4 Add a "Not sure what you need?" triage path

The research repeatedly surfaces *"I'm not sure what kind of lawyer I need"* as a real search state, and General Practice is listed as a public category. A short, calm triage entry — in the mega menu footer and as a homepage practice-grid tile — captures visitors who would otherwise bounce because no card matched their situation. **Not** a multi-step wizard at launch; one plain, human link.

### 20.5 Treat the phone number as a first-class UI element

For criminal, OVI, and protection-order visitors, the phone *is* the conversion. Specify: `tel:` link in the header at ≥1440px, a persistent phone icon button in the collapsed header at all smaller widths, large tappable phone in the mobile menu, and phone in every section CTA. Track it as a conversion equal to the form.

### 20.6 Design an empty state for the reviews section

If Q8 returns no permission-cleared testimonials, the homepage needs a designed alternative in that slot — a credentials/verification block — rather than a hole in the layout. Planning it now costs nothing; discovering it during the build costs a redesign.

### 20.7 Ship `docs/designSystem.md` alongside the code

A living token and component reference makes the system usable by the next developer and by the client's future vendors. It also makes the "reusable production-ready components" non-negotiable verifiable rather than asserted.

### 20.8 Archive the working-copy research document

`ChatGPT_DeepResearch_WorkingCopy.md` states it should be replaced by the full export, which is already present. Moving it to `docs/archive/` removes a real risk that a future session treats the summary as authoritative over the verified full report.

### 20.9 Sequence the citation cleanup with the build

R8's NAP corrections are client-side work with a lead time (directory edits can take days to propagate). Starting them at the same time as the build means the site launches into a clean citation environment rather than fighting contradictory data for its first indexed months.

---

# Proposed Phase Sequence

| Phase | Deliverable | Gate |
|---|---|---|
| **1** | This document | **Approval required** |
| 2 | Content architecture: page-by-page copy briefs, `docs/contentInventory.md` | Requires answers to Q1–Q5 |
| 3 | Design system build: `tokens.css`, `base.css`, `layout.css`, type scale, contrast verification | Requires R2 (SVG logos) |
| 4 | Component library: all Layer 3 components, documented in `docs/designSystem.md` | — |
| 5 | Homepage build: three scenes, full responsive, a11y verified | Requires R1 (photography) |
| 6 | Interior templates: practice hub, practice detail, contact, FAQ, legal | Requires Phase 2 copy |
| 7 | Tier 1 page population, schema, sitemap, metadata | — |
| 8 | QA: a11y audit, performance audit, cross-browser, real-device testing | — |
| 9 | Launch: DNS, headers, form endpoint, analytics, GBP alignment | Requires Q11, R5 |
| 10 | Tier 2/3 expansion | Post-launch |

---

**End of Phase 1 planning document.**

*No production code will be written until this plan is approved. Open Questions Q1–Q5 should be routed to the attorney in parallel with review of this document, as they gate Phase 2.*
