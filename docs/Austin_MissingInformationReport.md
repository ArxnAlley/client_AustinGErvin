# Austin G. Ervin — Missing Information Report

**Generated:** July 31, 2026 · **Milestone:** M0
**Method:** Produced by running the framework validator against generated data. **Not compiled by hand.**
**Reproduce:** `cd nuloLegalFramework && node bin/validateClient.js ../ClientSites/client_AustinGErvin ./schemas`

---

# 0. How This Was Produced

Every fact the research verifies was written into `data/`. **Every fact it does not verify was deliberately left out**, so the gap surfaces as a validation failure rather than as a judgement call.

One principle governed the whole conversion:

| Situation | Action | Result |
|---|---|---|
| Research verifies the fact | Populate it, with a `verification` object citing the source | Passes |
| Research does not verify it | **Omit the field entirely** | **Fails validation — appears in §2** |
| Fact known, asset or file missing | Keep the reference | Passes schema; appears in §3 |
| Research is partial | Populate with `verified: false` and a note | Passes, and **never renders** (LEG-001) |

Nothing was invented to make validation pass.

## 0.1 Current state

```
Sources loaded          16 of 16
Schema coverage        100%
Errors                  34
Warnings                 0
Distinct missing fields   8   across 6 files
Rule citations checked  154   ·  MNT-008 violations: 0
```

**`theme.json` validates completely** — schema, plus ACC-002 computed contrast, ACC-003 token contract, DS-005 scene coverage, and MNT-004 z-index scale. **M1 is unblocked.**

---

# 1. What Was Successfully Derived

No client input was required for any of this.

| File | Content | Source |
|---|---|---|
| `firm.json` | Legal name, entity type, NAP references, attorney of record, `narrativeMode: urgent` (derived: 6 of 8 areas are emergency/high urgency) | Avvo · Martindale · Facebook · Scioto County directory |
| `attorneys.json` | Full name, J.D. 2022 University of Dayton, OH 2022 + KY 2023 active admissions — each with a verification object | Avvo · Martindale · LinkedIn |
| `locations.json` | 602 Chillicothe Street, Suite 206, Portsmouth, OH 45662 · (740) 529-1420 | Five independent sources agree |
| `practiceAreas.json` | 8 Tier 1 areas, 3-cluster hierarchy, urgency classification, search terms | Research practice portfolio table |
| `clusters.json` | Criminal Defense · Family Law · Estate Planning | Derived from practice mix |
| `serviceAreas.json` | 6 counties — Scioto, Adams, Pike, Lawrence (OH); Greenup, Boyd (KY) with seats and tiers | GBP excerpt · Facebook · county data |
| `jurisdictions.json` | OH and KY with bar names, advertising rule citations, and the OVI/DUI terminology map | Ohio and Kentucky bar rules |
| `faqs.json` | 12 questions across 5 practice areas, 4 flagged for the homepage | Research FAQ bank |
| `compliance.json` | 3 disclaimers, 8 prohibited terms with reasons, 12-month cadence, legal-review paths | Ohio R. 7.1 · Kentucky SCR 3.130-7 |
| `seo.json` | Title and description patterns, readability targets, 15-term legal allowlist | Research SEO section |
| `navigation.json` | 4 primary items. **Mega menu correctly absent** — 8 areas is below the ≥9 threshold | Framework derivation |
| `theme.json` | Full token system, 14 palette primitives, 13 semantic tokens × 3 scenes, type scale, motion, z-index | Phase 1 §10 · Phase 2 §I.9–I.11 |

---

# 2. Missing — Surfaced by Validation

**34 errors. 8 distinct fields.** Each maps to a known open question.

## 2.1 Blocking — client decision required

| # | Field | Question | Why it blocks | Owner |
|---|---|---|---|---|
| **1** | `firm.voice` | **Q14 — does the firm speak as "I" or "we"?** | **Highest-reach item in the project.** CON-002 enforces pronoun consistency sitewide; this changes every string on every page. Nothing final can be written until it is answered. | Client |
| **2** | `locations[0].hours` | **Q5 — actual office hours** | Cannot be null by design. The Design Review Board found missing availability is the single highest-friction gap for the emergency visitor. **Research found conflicting values** — the GBP excerpt says "Open 24 hours" while other directories show weekday schedules. Both cannot be true. | Client |
| **3** | `locations[0].afterHoursPolicy` | **Q5** | Renders adjacent to every phone CTA (CON-006). For a practice that is 75% emergency/high urgency, this is a primary conversion surface. | Client |
| **4** | `contact.consultationModel` | **Q4 — free, flat, paid, or varies?** | Derives every CTA on the site. The research is explicit that this market is price-sensitive and that cost uncertainty is a top hesitation trigger. | Client |
| **5** | `contact.consultationCopy` | **Q4** | The human phrasing of #4. | Client |
| **6** | `contact.responseTimePromise` | **Q5 / operational** | Consumed by the Process section, which is non-optional. **This is an operational commitment the framework cannot verify** — it requires written confirmation before publication. | Client |
| **7** | `attorneys[0].role` | **New — ownership structure** | Research states plainly: *"Exact ownership structure: Unknown. The name strongly suggests a solo-owned LLC, but that should not be stated as fact."* `partner` vs `sole` is a factual claim about the business. | Client |

## 2.2 Blocking — studio or commercial decision

| # | Field | Question | Owner |
|---|---|---|---|
| **8** | `contact.formEndpoint` | **R5 — which form provider?** A static site has no same-origin handler, so this cannot be deferred to build time. | Client / Studio |
| **9** | `seo.domain` | **No domain exists.** The research confirms no branded domain was found anywhere. Every absolute URL, the canonical tag, `sitemap.xml`, and JSON-LD depend on it. | Client |
| **10** | `locations[0].mapsUrl` | Makes the address tappable. Derivable from the Google Business Profile once access is granted. | Studio |

## 2.3 Blocking — legal review not yet performed

| # | Field | Count | Meaning |
|---|---|---|---|
| **11** | `faqs[].lastReviewed` + `faqs[].reviewedBy` | **24 errors across 12 FAQs** | **No FAQ has been reviewed by the attorney.** 8 of the 12 carry `citesStatute: true`, which puts them in LEG-007's strict staleness tier. This is not a data-entry gap — it is the governance model reporting that a required legal review has not happened. |

**This is the compliance gate working exactly as designed.** The framework will not let statute-citing content publish without a named attorney reviewer and a review date.

---

# 3. Missing — Not Yet Detectable by Validation

Referenced by data, absent from disk. **33 files.** These pass schema validation because the *reference* is well-formed; only the *file* is missing. Asset and content validators are not yet implemented.

| Kind | Missing | Classification | Owner |
|---|---|---|---|
| **Logo SVGs** (`mark`, `lockupHorizontal`, `lockupStacked`) | 3 | **Required before implementation (R2)** | Studio |
| **Fonts** (Inter variable, Cormorant 500/600, subset woff2) | 3 | **Required before implementation** | Studio |
| **Icon sprite** | 1 | **Required before implementation** | Studio |
| **Hero portrait** ≥2400px | 1 | **Required before launch (R1)** | Client |
| **og image** 1200×630 | 1 | Required before launch | Studio |
| **Practice area bodies** | 8 | Required before launch | Client / Studio |
| **FAQ answers** | 12 | Required before launch | Client / Studio |
| **Attorney biography** | 1 | Required before launch | Client / Studio |
| **Disclaimers** | 4 | **Required before launch — legal** | Attorney |

## 3.1 The two hard asset blockers, measured

| ID | Requirement | Actual | Gap |
|---|---|---|---|
| **R1** | Hero portrait ≥2400px long edge | **659×510** (`owner_AustinGErvin.webp`) | **27% of required resolution.** Not fixable in code. |
| **R2** | Logo as SVG with `fill: currentColor` | Five PNGs, 1024–1254px, 0.86–1.42MB, grey gradient and glow baked in | **Breaks the scene system**, not just the logo — a hardcoded wordmark fill goes invisible as the header crosses light to dark. MNT-010 fails the build. |

---

# 4. Deliberately Empty — Not Missing

| File | State | Why |
|---|---|---|
| `testimonials.json` | `[]` | **Q8 — which testimonials may be used, and is written permission held?** LEG-002 fails the build on any testimonial without documented permission. The reviews section has a designed zero-state (verification block), so the homepage composes correctly at n=0. |
| `caseResults.json` | `[]` | Research verified no case results. LEG-009 would require documented permission plus a no-guarantee disclaimer. |
| `social.json` | `[]` | Platform presence is confirmed (Facebook, LinkedIn, Avvo, Martindale) but **no profile URLs appear in the research.** `sameAs` is an ownership assertion — an unverified URL is a misrepresentation risk (SEO-013). |
| `industries.json` | absent | Optional second taxonomy. Absent costs nothing. |

---

# 5. Decisions Made During Conversion

Recorded because each is a judgement a future engineer would otherwise have to re-derive.

| # | Decision | Reasoning |
|---|---|---|
| **1** | **All 8 practice areas set `homepagePriority: null`** | Q1 (priority order) is unanswered. Setting an order would fabricate a client decision. **Consequence: the homepage practice grid has no cards until Q1 is answered.** A research-derived default is proposed in §6. |
| **2** | **All practice areas scoped to `["OH"]` only** | Kentucky admission is verified, so LEG-004 would permit KY. But **Q3 asks whether Kentucky matters are actively handled**, and marketing work not actually taken is a compliance risk the research flags directly. Conservative until Q3. |
| **3** | **`narrativeMode: urgent`** | Derived, not chosen: 6 of 8 published areas carry `emergency` or `high` urgency (75%), above the 60% threshold. |
| **4** | **Undergraduate degree stored with `verified: false`** | The canonical LEG-001 case. It is safe to store and **impossible to publish accidentally** — no template will render it. |
| **5** | **`surfaceSunken.light` bound to `@warm`, not `@warmDeep`** | Resolves risk X1. `#F0EDE7` caused five contrast failures including `focusRing` at 2.95:1 — a keyboard-accessibility defect. The light scene (Header, Hero, Trust Strip) has **no sunken region**; `--surfaceWarmDeep` remains in the palette for the hero radial field, which is a decorative gradient rather than a component surface. **No approved token value was altered.** |
| **6** | **Mega menu absent from `navigation.json`** | 8 areas is below the ≥9 threshold. Correct per the framework and per Build Plan §0.3. |
| **7** | **Exploration artefacts moved to `assets/_source/`** | Preserved as the fidelity reference for the SVG redraw rather than deleted. |

---

# 6. Proposed Defaults — For Confirmation or Rejection

Offered so the client answers by **correcting a draft rather than composing from a blank page.** None of these is in the data; all require confirmation.

## 6.1 Q1 — practice area priority

Derived from the research's own SEO and urgency analysis:

| Priority | Area | Rationale from research |
|---|---|---|
| 0 | Criminal Defense | Highest-intent, urgent, mobile, after-hours |
| 1 | OVI / DUI | "Immediate emergency-intent" |
| 2 | Protection Orders | "Highly urgent and emotionally charged" |
| 3 | Divorce | Strong local demand |
| 4 | Child Custody | "High-intent; fear-driven; often local" |
| 5 | Estate Planning | Serves the 20%+ 65-and-over county demographic |

Family Law and Probate would remain off the homepage and live on the hub.

## 6.2 Q5 — hours

The research found a **direct conflict**: the GBP excerpt says "Open 24 hours" while Experience.com and other directories show weekday schedules. **The GBP listing is very likely wrong** and should be corrected in parallel with launch — it also carries a conflicting phone number, `(740) 456-7723`, and a Birdeye-adjacent listing shows Suite `#224` rather than 206.

Two structures are supported. If the office keeps weekday hours but takes emergency calls after hours, the correct model is a per-day schedule **plus** an `afterHoursPolicy` that says so — not `24-7`.

---

# 7. What Unblocks What

| Answer | Immediately unblocks |
|---|---|
| **Q14 — voice** | All copy on all 25 pages |
| **Q5 — hours + after-hours** | `locations.json` validates · CON-006 phone-adjacent message resolves · the emergency visitor's primary question is answered |
| **Q4 — consultation model** | `contact.json` validates · every CTA on the site |
| **R2 — SVG logos** | `logoLockup` · `siteHeader` · `siteFooter` · favicon · loading curtain · **the scene system** |
| **Fonts + icon sprite** | M1 completes; M2 can begin |
| **Q1 — priority order** | The homepage practice grid renders cards |
| **R1 — photography** | The hero can be built to specification |
| **Attorney review of 12 FAQs** | 24 of the 34 errors clear at once |

**Answering Q14, Q5, and Q4 alone clears 7 of the 8 distinct missing fields** and leaves only `seo.domain`.

---

# 8. M0 Completion Status

| Deliverable | Status |
|---|---|
| Project scaffold created | ✅ `data/` · `content/` · `assets/` · `nlf.config.json` |
| Research converted into framework data | ✅ 16 sources generated; zero manual transcription |
| Schema coverage | ✅ **100%** — 16 of 16 sources |
| Validator passing wherever possible | ✅ `theme.json` fully green including computed contrast; 34 errors, all genuine missing facts |
| Rule closure | ✅ 154 citations checked, **0 MNT-008 violations** |
| Missing Information Report | ✅ This document, generated from validator output |
| Repository ready for M1 | ✅ **Yes** — `theme.json` validates, so `tokens.css` can be generated |

**M1 is not blocked by anything in §2.** It is blocked only by fonts and the icon sprite (§3), both studio-owned.

---

**End of Missing Information Report.** Re-run the validator after any answer lands; this report regenerates from its output.
