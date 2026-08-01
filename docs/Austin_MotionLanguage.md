# Austin G. Ervin, Attorney at Law, LLC

## Motion Language — Production Specification

**Prepared by:** Nulo Studio — Principal Motion Architect
**Date:** July 31, 2026
**Status:** Production specification. Single source of truth for all motion.
**Framework:** Nulo Legal Framework v1.1 (frozen)
**Governs:** Every animation, transition, reveal, interaction, loading sequence, and page transition on the site.

---

## Relationship to Existing Specifications

| Document | Relationship |
|---|---|
| `Austin_ProjectFoundation.md` | Source of the restraint mandate — *"motion should be subtle," "avoid excessive animation."* This document is the disciplined expression of that instruction. |
| `Austin_Phase0_ArchitectureBrief.md` | Source of the permitted vocabulary — *"fades, reveals, parallax where appropriate, subtle image movement, restrained hover states."* |
| `Austin_Phase1_ImplementationPlan.md` §12 | Establishes motion tokens and the reduced-motion contract. **Token names and numeric values remain owned there.** This document governs their *behaviour*, not their values. |
| `Austin_Phase2_HomepageSpecification.md` | Specifies per-section motion. **Where this document and Phase 2 differ, this document governs**, and every difference is itemised in §15. |
| NLF v1.1 | Motion roles are part of the component contract. Nothing here is Austin-specific unless explicitly marked. |

**One prior decision is changed by this document** — the header's entrance behaviour, consequent to the introduction of the loading sequence. Recorded in §15.

---

# 1. Motion Philosophy

## 1.1 The emotional purpose

A visitor arrives at this site because something in their life has gone wrong, or is about to. They are frightened, or grieving, or angry, or simply tired. They have already looked at three other attorney websites that felt like brochures.

**Motion exists here to communicate one thing before a single word is read: someone competent is in control.**

This is the visual equivalent of a professional's bearing. A good attorney does not rush into a room. They do not fidget. They do not perform. They move deliberately, they settle, and their calm becomes yours. Every motion decision in this document is an attempt to give the interface that same bearing.

## 1.2 The governing paradox

> **The visitor should remember how the site felt and be unable to describe a single animation.**

Motion that is noticed has failed. Motion that is *felt* has succeeded. The difference is not subtlety for its own sake — it is the difference between a website that performs confidence and one that possesses it.

When a visitor tells a friend about this site, the correct sentence is *"it felt serious."* The incorrect sentence is *"it had this cool thing where the logo…"*

## 1.3 Motion as evidence

In a market where every competitor's site is an unmodified template, the fact that this one moves *correctly* is itself a trust signal. A visitor cannot evaluate an attorney's legal skill from a website. They can, unconsciously, evaluate whether anyone took care.

Motion is the most legible available proxy for care. A hover state timed to the Fast band rather than twice that will never be consciously noticed, and will be felt by everyone. **This is the commercial argument for the entire document.**

## 1.4 What motion is not permitted to do

| Prohibited role | Why |
|---|---|
| Entertain | The visitor is not here to be entertained |
| Demonstrate technical capability | This is a law firm, not a studio showreel |
| Compensate for weak content | Motion cannot make a thin page substantial |
| Create urgency | The research warns this audience distrusts pressure |
| Delay information | Never. See §12.2. |

---

# 2. Motion Principles

Seven principles. Every motion decision resolves to one of them. A motion that serves none is deleted.

## 2.1 Hierarchy — *movement is scarce*

Not everything moves. Movement is a finite resource allocated by importance, and spending it evenly spends it wastefully.

On any given screen, **at most one thing should be the reason the eye moves.** When two elements animate simultaneously, they must be part of one gesture, not two competing ones.

**Test:** if every element on a screen animates on entry, none of them mattered.

## 2.2 Weight — *elements have mass*

Large objects move slowly. Small objects move quickly. A full-viewport environmental change and a hover underline cannot share a duration, because in the physical world they could not share a mass.

Nothing snaps. Nothing is weightless. Objects arrive with momentum and **settle** — they come to rest the way a heavy door closes, decisively but without impact.

**This is the single most important principle for achieving a premium register.** Cheap motion is fast and light. Expensive motion is slow and heavy.

## 2.3 Timing — *response is the user's, presentation is the brand's*

The most useful timing heuristic in this system:

> **Motion the user causes must be fast. Motion the page causes may be slow.**

A hover, a tap, a toggle — these are conversations. Any delay reads as the interface being slow to understand. These must feel instantaneous.

A reveal, a scene change, an entrance — these are the page presenting itself. Here, speed reads as anxiety. These may take their time, and should.

## 2.4 Attention — *direct once, then release*

Motion may point the eye at something exactly once, and must then get out of the way.

Nothing loops. Nothing pulses. Nothing repeats to reclaim attention. An element that must animate continuously to be noticed has a hierarchy problem that motion cannot solve.

**Nothing animates while it is being read.** Once text is in the reading zone, motion in the reading zone stops.

## 2.5 Continuity — *nothing teleports*

Objects arrive from somewhere and depart to somewhere. State changes are transitions, not substitutions.

This principle produces the site's signature moment — the loading monogram does not vanish and get replaced by a header logo. It *travels there.* The visitor understands where the interface came from, and the transition explains the layout rather than merely decorating it.

**Corollary:** a reversed gesture must reverse. Scrolling up must undo scrolling down coherently.

## 2.6 Depth — *value and timing, never shadow*

Depth in this system is produced by two devices only:

1. **Differential timing** — nearer things move sooner and further; distant things move later and less
2. **Value separation** — the scene surfaces establish planes

Depth is **never** produced by drop shadows, 3D transforms, perspective, or layered parallax. Those read as software UI. This site reads as print that happens to move.

## 2.7 Purpose — *answer a question or be deleted*

Every motion must answer one of exactly two questions:

- **"What changed?"** — state, position, availability
- **"Where did this come from?"** — origin, relationship, hierarchy

A motion that answers neither is decoration. **Decoration is deleted, not reduced.**

---

# 3. Motion Categories

Seven categories. Every motion in the system belongs to exactly one, and inherits that category's timing band, curve family, and constraints.

## 3.1 Hero Motion

**Purpose:** the site's opening statement. The only choreographed multi-element sequence in the system.

| Property | Value |
|---|---|
| Frequency | Once per session, on the homepage only |
| Duration band | Slow → Scene |
| Curve family | Entrance |
| Elements | 8–10, staged |
| Repeat | Never. Returning to the homepage in-session does not replay it. |

**Hard constraint:** the hero's content is fully present and readable before its motion begins. The sequence stages *emphasis*, never *availability*.

## 3.2 Scene Motion

**Purpose:** the light → dusk → dark descent. The environment changing around the visitor.

| Property | Value |
|---|---|
| Frequency | Twice on the homepage; once on interior pages |
| Duration band | Scene |
| Curve family | Environmental |
| Trigger | Scroll position, at designated sections only |
| Reversible | Yes, fully and symmetrically |

**Defining characteristic:** in scene motion, **the content does not move — the world changes around it.** This is what separates a cinematic descent from a parallax gimmick, and it is also what makes the effect vestibular-safe (§11.5).

## 3.3 Structural Motion

**Purpose:** content arriving as the visitor reaches it. The system's workhorse — roughly 80% of all motion instances.

| Property | Value |
|---|---|
| Frequency | Once per element, per session |
| Duration band | Slow |
| Curve family | Entrance |
| Stagger | Permitted, strictly capped |
| Repeat | Never — an element that has arrived stays arrived |

**Hard constraint:** structural motion is an enhancement layered onto content that is already present. It never gates visibility.

## 3.4 Interactive Motion

**Purpose:** the interface responding to the visitor. Hovers, focus, presses, toggles, disclosures.

| Property | Value |
|---|---|
| Frequency | Unlimited — user-initiated |
| Duration band | Instant → Base |
| Curve family | Response, State |
| Interruptible | **Always.** A new input overrides the current motion immediately. |

**Hard constraint:** the visitor must never wait for interactive motion to complete before acting again. Interactive motion that blocks input is a defect.

## 3.5 Environmental Motion

**Purpose:** ambient atmosphere. The only category permitted to run continuously — and the first removed under any constraint.

| Property | Value |
|---|---|
| Frequency | Continuous, where permitted at all |
| Duration band | Sustained |
| Curve family | Environmental |
| Amplitude | Below the threshold of conscious perception |
| Availability | Desktop, fine pointer, full-motion mode, capable device |

**Hard constraint:** environmental motion is entirely optional. Its complete absence must be undetectable to a visitor who has not seen it. Governed in full by §10.

## 3.6 Loading Motion

**Purpose:** to convert an unavoidable technical moment into an intentional brand moment.

| Property | Value |
|---|---|
| Frequency | First homepage entry per session only |
| Duration band | Curtain, hard time-boxed |
| Curve family | Entrance, Environmental |
| Escapable | Always — by input, by timeout, by failure |

Governed in full by §6.

## 3.7 Page Transition Motion

**Purpose:** to make navigation between documents feel like movement within one continuous space rather than a series of page loads.

| Property | Value |
|---|---|
| Frequency | Every internal navigation after the first |
| Duration band | Fast (exit) → Base (entry) |
| Curve family | Exit, Entrance |
| Constraint | **Must never delay navigation.** |

Governed in full by §9.14.

---

# 4. Motion Timing System

## 4.1 The ladder

Seven named bands. Numeric values are owned by the design system; this document defines what each band *means* and when it applies.

| Token | Band | Perceptual character | Applied to |
|---|---|---|---|
| **Instant** | ~1 frame–2 frames | Below conscious perception. Feels like it was always so. | Focus indicators, state flips, toggle marks |
| **Fast** | Short | Feels immediate. The interface understood you at once. | Hover, press, dismissal, arrow travel |
| **Base** | Moderate | Feels responsive but considered. Something opened. | Panels, accordions, menu items, page entry |
| **Slow** | Extended | Feels deliberate. Something presented itself. | Content reveals, image settles |
| **Scene** | Long | Feels atmospheric. The environment shifted. | Scene descent, gold rule draw, region map |
| **Curtain** | Long | Feels like a threshold. You have entered. | Loading lift and monogram travel |
| **Sustained** | Very long, continuous | Imperceptible as motion. Felt as life. | Ambient environmental only |

## 4.2 Why the bands differ

Each band's duration is derived from the *relationship* it expresses, not from aesthetic preference.

| Band | Why this duration |
|---|---|
| **Instant** | Focus and state are not animations — they are facts. A visitor tabbing through the page must never wait to learn where they are. Any perceptible delay on a focus indicator is an accessibility failure, not a style choice. |
| **Fast** | This is conversational latency. Beyond roughly a quarter-second, a response to direct input stops feeling like a response and starts feeling like a lag. Hover states live here because hovering is the visitor asking a question. |
| **Base** | Long enough to show *where a thing came from* — which is the entire informational value of the motion — and short enough that a visitor who already knows where it came from is not made to wait. |
| **Slow** | Reveals are the page's own presentation, not a reply to the visitor. Speed here reads as eagerness, and eagerness undermines the brand. This band is where "expensive" lives. |
| **Scene** | An environmental change involving the whole viewport must move slowly or it registers as a flash. The mass principle (§2.2) at maximum scale. |
| **Curtain** | A threshold must feel crossed, not skipped. Shorter and the sequence reads as a glitch; longer and it reads as an obstacle. |
| **Sustained** | Ambient motion must be slower than attention. If a visitor can track it, it is too fast and becomes a distraction. |

## 4.3 Composition rules

| Rule | Detail |
|---|---|
| **Stagger** | Fixed short interval between siblings. **Capped at 6 elements.** Beyond that the last element lags visibly and the group stops reading as one gesture. |
| **Total sequence ceiling** | No orchestrated sequence exceeds the Curtain band end-to-end, excepting the hero entrance, which is the single permitted exception. |
| **Overlap** | Sequential elements overlap rather than queueing. A gesture is continuous, not a series of discrete events. |
| **Asymmetry** | Entrances are longer than exits — consistently, everywhere. Arriving is earned; leaving is granted. |
| **No nesting** | A staggered group may not contain another staggered group. Two levels of stagger reads as a cascade, which is a startup pattern. |

---

# 5. Motion Curves

Curves are defined by **behaviour only**. Numeric values are owned by the design system.

## 5.1 The four permitted curves

The system permits exactly four. A fifth curve is a design failure, not a requirement.

### Entrance curve

**Behaviour:** decisive departure, long settle. The object begins moving immediately and with conviction, covers most of its distance early, then eases into rest over a comparatively long tail. **It does not overshoot. It does not bounce. It arrives and stops.**

**Reference feeling:** a well-engineered car door closing. Weight, control, no rebound.

**Used by:** all entrances, all reveals, the hero sequence, the curtain lift.

### Exit curve

**Behaviour:** gentle release, prompt finish. The object lets go softly and completes quickly. It never lingers, and it never accelerates hard enough to feel ejected.

**Reference feeling:** stepping back from something, not being pushed from it.

**Used by:** dismissals, panel closes, overlay exits, page exit.

### Response curve

**Behaviour:** near-symmetrical, minimal character. Fast at both ends. The curve has no personality because the motion is not expressive — it is an acknowledgement.

**Reference feeling:** a switch, not a gesture.

**Used by:** hover, press, focus-adjacent states, toggle marks.

### Environmental curve

**Behaviour:** almost linear, with imperceptibly soft ends. No detectable acceleration anywhere. The change is felt as a condition rather than an event.

**Reference feeling:** light changing in a room over a minute.

**Used by:** scene descent, ambient motion, long rule draws.

## 5.2 Prohibited curve behaviours

| Prohibited | Why |
|---|---|
| **Overshoot / back** | An object that passes its target and returns has cartoon physics. Reads as playful. |
| **Elastic / spring** | Oscillation implies looseness. This brand's core promise is steadiness. |
| **Bounce** | Never, in any amplitude, on any element. |
| **Anticipation** | An object that pulls back before moving forward is animation-school vocabulary. It is charming and it is wrong here. |
| **Hard linear** | Reads as mechanical and cheap on anything except very long environmental change. |
| **Stepped / staccato** | Deliberate frame-dropping as a style is a tech-demo signature. |

## 5.3 Curve discipline

| Rule | Detail |
|---|---|
| **One curve per property per element lifetime** | An element that enters on the Entrance curve does not exit on it. It exits on Exit. But it never enters on two different curves in different contexts. |
| **Curves are not tuned per component** | A component that "needs" its own curve is describing a hierarchy problem. |
| **Direction determines curve, not element** | The same card uses Entrance when arriving and Exit when leaving. |

---

# 6. Loading Experience

## 6.1 Position

A loading screen is normally a confession that a site is slow. This one is engineered to be the opposite: **a deliberate threshold that also happens to conceal the ugliest moment in any web page's life** — the instant when fonts swap, the hero image decodes, and the layout settles.

Without a curtain, the visitor watches that happen. With one, they watch a brand mark being inscribed, and arrive at a page that is already resolved.

> **The curtain is not a cost paid for load time. It is a trade: an unavoidable ugly moment exchanged for an intentional beautiful one.**

## 6.2 The hard constraint that shapes everything

The research characterises a substantial share of this audience as people contacting an attorney in an emergency — frequently at night, frequently on a phone, frequently having just been arrested.

> **A person in crisis must never be made to watch an animation to reach a phone number.**

This single sentence governs every rule below. The curtain is elaborate in its best case and instantly escapable in every other case.

## 6.3 Composition

The curtain occupies the full viewport in the **warm near-white field of Scene 1** — the same surface the hero occupies. There is no black screen, no white flash, no colour the site does not otherwise use. The visitor is already inside the brand's world before anything moves.

At centre: **the AE monogram shield**, drawn in gold at a restrained scale — large enough to be the subject, small enough not to be a splash screen.

Beneath it, a single hairline rule in gold serves as the only progress expression.

**Nothing else appears. No firm name, no tagline, no spinner, no percentage.**

## 6.4 The sequence

| # | Stage | Behaviour | Band | Curve |
|---|---|---|---|---|
| 1 | **Field** | The warm field is present at first paint. It is the page's own background, not an overlay that must arrive. No flash of any kind. | — | — |
| 2 | **Inscription** | The shield's outline draws as a single continuous stroke, as though being engraved. One stroke, one direction, no retracing. | Scene | Environmental |
| 3 | **Letterform** | The Æ resolves inside the completed shield — appearing at rest rather than moving into place. | Slow | Entrance |
| 4 | **Progress** | The hairline rule beneath the mark extends in proportion to genuine critical-asset progress. **It is honest.** It never fakes advancement, and never completes before the assets do. | Sustained | Environmental |
| 5 | **Lift** | The field dissolves upward, revealing the resolved hero beneath. The field does not fade — it *rises*, so the hero is uncovered rather than cross-faded. | Curtain | Entrance |
| 6 | **Travel** | Simultaneously, the monogram travels from centre to its position in the site header, scaling down as it goes, and **becomes the header logo.** | Curtain | Entrance |

## 6.5 The travel — the system's signature moment

Stage 6 is the one motion on this site permitted to be memorable, and it earns that permission by being *explanatory* rather than decorative.

The visitor does not see a loading screen disappear and a header appear. They see **one object move from the centre of their attention to its resting place in the interface.** The header is not introduced; it is arrived at. The logo is not presented; it is recognised, because the visitor watched it take its seat.

This satisfies the Continuity principle (§2.5) completely: nothing teleports, nothing is substituted, and the transition teaches the layout.

**It also renders the loading screen non-discardable.** A curtain that merely fades is overhead. A curtain that delivers the logo into place is part of the page's construction.

## 6.6 Behaviour by condition

### Fast connection

Critical assets resolve before the inscription completes. The sequence still plays to a **minimum threshold** so it reads as intentional rather than as a flicker, then lifts.

A curtain that appears and vanishes in under a beat is worse than no curtain — it registers as a rendering fault. The minimum exists to protect against that, and is short.

### Slow connection

The sequence plays and the progress rule advances honestly. At a **hard ceiling**, the curtain lifts **regardless of asset state.**

The hero renders with whatever has resolved — the metric-matched font fallback, the low-resolution image placeholder — and completes in place. **The ceiling is absolute.** No condition extends it.

### Very slow connection or explicit data-saving preference

**The curtain does not run at all.** Where load is genuinely expensive, a loading sequence is an insult. The visitor goes directly to content.

### Failure

If any critical asset errors, the curtain lifts **immediately** — no minimum, no completion of the inscription. The site renders in its degraded-but-correct state.

**The curtain never becomes a trap.** There is no failure mode in which a visitor is held on the loading screen.

### Interruption

**Any input dismisses the curtain immediately** — pointer, key, touch, or scroll intent. The lift and travel play at accelerated pace rather than being cut, so the header logo still arrives correctly.

A visitor who wants in is let in.

## 6.7 The phone affordance during loading

**Non-negotiable, and the most important rule in this section.**

The header's phone affordance renders **above the curtain**, is fully interactive **from the first frame**, and is reachable by pointer, touch, and keyboard while the curtain is displayed.

A visitor in crisis reaches the phone number during the loading sequence, without dismissing it, without waiting for it, and without knowing they did anything unusual.

The curtain covers the *experience*. It never covers the *lifeline*.

## 6.8 Frequency

| Condition | Curtain |
|---|---|
| First homepage entry, this session | ✅ Runs |
| Repeat homepage visit, same session | ❌ Never |
| Return to homepage via internal navigation | ❌ Never — page transition applies instead |
| **Direct entry to any interior page** | ❌ **Never** |
| Browser back/forward | ❌ Never |

**The deep-link exclusion matters commercially.** A visitor arriving from a search result for "Portsmouth OVI lawyer" lands on a practice-area page with intent and urgency. They receive no curtain. The curtain is an *arrival* experience, and arriving mid-site is a different act.

## 6.9 Accessibility and reduced motion

| Condition | Behaviour |
|---|---|
| **Reduced motion** | No inscription, no travel, no lift. The mark is presented statically for a brief hold, then removed by a plain opacity change. The threshold is preserved; the movement is not. |
| **Screen reader** | The curtain is not announced. It is not a dialog, does not take focus, and does not trap it. Focus order begins at the skip link, exactly as it would without a curtain. |
| **Keyboard** | Tab dismisses the curtain and places focus on the skip link. A keyboard user is never stranded behind it. |
| **Progress semantics** | The progress rule is decorative. Assistive technology receives no progress announcements, because a visually-hidden progress commentary would be noise, not information. |
| **Vestibular** | The lift is a single-direction dissolve of modest amplitude. No zoom, no rotation, no parallax, no camera metaphor. |

---

# 7. Hero Entrance

## 7.1 Principle

The hero entrance is the site's only choreographed multi-element sequence. It exists to make the first screen feel *composed* rather than *loaded* — the difference between a curtain rising on a set and a page appearing.

**Governing constraint:** every element in the hero is present, laid out, and readable before the sequence begins. The sequence stages **emphasis**, never **availability**. A visitor whose motion fails entirely sees a complete, correct hero.

## 7.2 The ordered sequence

Continuous from the curtain's lift — there is no pause between them. The visitor experiences one gesture from threshold to hero.

| # | Element | Behaviour | Band | Rationale |
|---|---|---|---|---|
| 1 | **Ambient field** | Already present, inherited from the curtain. The warm radial depth behind the portrait column is established before anything else moves. | — | The world exists before its contents |
| 2 | **Curtain lift** | The field rises, uncovering the hero. | Curtain | §6.4 stage 5 |
| 3 | **Portrait** | Resolves as the field clears — settling into place with a barely-perceptible scale reduction, as though coming to rest. **It does not fade in from nothing**; it was always there, and is revealed. | Scene | Face first. The research is unambiguous that this is a trust-driven, human market. |
| 4 | **Monogram travel** | The mark arrives in the header. | Curtain | §6.5 |
| 5 | **Navigation** | The wordmark and nav links settle in behind the arriving monogram, in reading order. | Base | The header is *assembled around* the logo that just landed |
| 6 | **Eyebrow** | Rises and resolves. | Slow | Establishes place and jurisdiction before the claim |
| 7 | **Headline line 1** | Rises and resolves. | Slow | — |
| 8 | **Headline line 2** | Follows. | Slow | — |
| 9 | **Headline line 3** | Follows. | Slow | The three-line stagger is the sequence's centrepiece |
| 10 | **Lede** | Rises and resolves. | Slow | — |
| 11 | **Primary CTA** | Rises and resolves. | Slow | Conversion arrives last among content — it is a conclusion, not an interruption |
| 12 | **Secondary CTA** | Follows immediately. | Slow | — |
| 13 | **Gold rule** | Draws downward behind the portrait, from top toward the feathered base. | Scene | The final stroke. The composition is signed. |
| 14 | **Ambient lighting** | Begins only after all content has settled. | Sustained | Atmosphere is the last thing to arrive and the first thing removed |

## 7.3 Why this order

| Decision | Reasoning |
|---|---|
| **Portrait before headline** | The audience is choosing a person, not a service. A face establishes trust faster than a sentence, and the portrait is what the curtain was waiting for. |
| **Navigation after portrait** | The header is not urgent — the phone affordance was already live during the curtain. Letting the hero establish itself first keeps the opening focused on the person rather than the chrome. |
| **Headline line by line** | The single most expressive moment in the sequence. Three lines arriving in sequence read as a statement being composed. All three at once reads as a page loading. |
| **CTAs last among content** | A conversion element that arrives before the argument is a sales pitch. Arriving after, it is an offer. |
| **Gold rule after everything** | It is punctuation. Punctuation comes last. |
| **Ambient lighting genuinely last** | It must be removable without disturbing anything, which requires that nothing depend on it. |

## 7.4 Return visits

On any homepage entry after the first in a session, **the entrance does not play.** The hero is present, complete, at rest, from the first frame.

Motion that repeats becomes furniture, and furniture that moves becomes irritating. The entrance is a first impression, and first impressions happen once.

---

# 8. Scroll Philosophy

## 8.1 Scenes, not sections

The homepage is not a stack of panels. It is **one continuous space that the visitor descends through**, and the light changes as they go.

This distinction is not rhetorical. It determines the mechanics:

| Section thinking | Scene thinking *(this site)* |
|---|---|
| Each block has its own background | The environment is continuous and changes gradually |
| Transitions happen at boundaries | Changes complete *mid-section*, where no boundary is perceived |
| Content animates into place | The world changes around content that is already placed |
| The page is assembled | The page is traversed |

## 8.2 How scenes enter and exit

**Scenes do not enter or exit. They become one another.**

There is no moment at which the light scene ends and the dusk scene begins. There is a region of the page — deliberately the most type-sparse region available — across which the environment resolves from one state to the next. A visitor scrolling at natural pace passes through the change without locating it.

| Rule | Detail |
|---|---|
| **Change completes within one section** | Never straddles a boundary, where the visitor would perceive the seam |
| **Change is assigned to sparse regions** | The two transition-owning sections are the two most text-light on the page. Less text means less repainting and, more importantly, less reading interrupted. |
| **Content holds still** | Content does not move during a scene change. Only the environment changes value. |
| **Fully reversible** | Scrolling up restores the previous scene with identical timing. No hysteresis, no one-way narrative. |
| **Never chained** | A fast scroll through two transition points resolves to the final state directly rather than queueing both. |

## 8.3 The visitor owns the scroll

**Absolute prohibitions:**

| Prohibited | Why |
|---|---|
| **Scroll hijacking** | Overriding scroll velocity or distance is the single most-hated pattern in "cinematic" web design |
| **Scroll snapping** | Removes the visitor's ability to stop where they wish |
| **Forced pacing** | Requiring a fixed scroll distance to advance a narrative traps fast readers |
| **Pinned sections** | A section that holds while content changes beneath is a presentation, not a page |
| **Scrubbed timelines** | Complex animations tied to scroll position rewind on direction change, which is disorienting and reads as broken |
| **Smooth-scroll on anchors** | Animated scrolling disorients keyboard users and can outrun the focus indicator |

**The visitor's scroll input is never modified, delayed, amplified, or interpreted.** Motion responds to where they are. It never decides where they should be.

## 8.4 Interior pages

Interior pages carry a single scene change — light content resolving to a dark conversion zone at the page's close. The same rules apply at reduced scale.

The three-scene descent is **homepage-only**. Repeated on every page it becomes wallpaper and stops meaning anything.

---

# 9. Component Motion

Every component's motion, by trigger. Components inherit their category's timing band and curve unless noted.

## 9.1 Site Header

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| First load | Assembled around the arriving monogram (§7.2) | Curtain | Entrance |
| Return visit | Present at rest, no motion | — | — |
| Scroll past threshold | Compresses: height reduces, a scene-tinted backdrop resolves behind it, a hairline appears beneath | Base | Response |
| Return to top | Expands, reversing symmetrically | Base | Response |
| Scene change | Text and mark colours resolve with the environment | Scene | Environmental |
| Mobile, scrolling down | Withdraws upward | Base | Exit |
| Mobile, any upward scroll | Returns immediately | Base | Entrance |

**Prohibited:** the header never animates on return visits, never bounces on compression, never changes height on hover.

## 9.2 Primary Navigation

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Link hover | A hairline underline draws from the leading edge | Fast | Response |
| Link hover out | The underline retracts to the *trailing* edge | Fast | Response |
| Active page | Underline present at rest, no motion | — | — |
| Focus | Indicator appears instantly | Instant | — |

**The origin flip on hover-out** — drawing in from the leading edge and retracting to the trailing edge — makes the underline read as a single stroke passing through rather than a line growing and shrinking. It costs nothing and it is the difference between considered and assembled.

## 9.3 Mega Menu

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Pointer enter | Opens after a short **intent delay** | Base | Entrance |
| Open | Panel resolves downward a short distance, settling | Base | Entrance |
| Pointer leave | Closes after a **grace delay** | Fast | Exit |
| Keyboard open | Same as pointer, no delay | Base | Entrance |
| Dismiss | Closes promptly | Fast | Exit |
| Contents | **Do not stagger.** The panel arrives as one object. | — | — |

**The two delays are the whole craft of this component.** Intent delay prevents the panel opening when a pointer merely crosses the trigger. Grace delay lets a visitor travel diagonally from trigger to the panel's furthest column without it vanishing beneath them.

**Contents never stagger.** A staggered mega menu draws attention to itself and delays scanning — the opposite of a menu's purpose.

## 9.4 Mobile Menu

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Open | Full-screen field resolves | Base | Entrance |
| Items | Rise and resolve in reading order, short stagger | Base | Entrance |
| Practice group expand | Expands in place, pushing subsequent items down | Base | Entrance |
| Close | Field releases; items do not animate out individually | Fast | Exit |

**Items stagger in and do not stagger out.** Arriving is a performance; leaving is not.

## 9.5 Buttons

| Component | Trigger | Behaviour | Band |
|---|---|---|---|
| Primary | Hover | Fill lightens | Fast |
| Primary | Press | Depresses very slightly | Instant |
| Ghost | Hover | Border strengthens | Fast |
| Text / arrow link | Hover | Underline draws; arrow advances a short distance | Fast |
| All | Focus | Indicator appears instantly | Instant |

**Prohibited on all buttons:** scale on hover, shadow on hover, glow, pulse, shimmer, gradient sweep, ripple, loading spinners in place of labels.

A CTA that pulses is asking for attention it should command by position and contrast.

## 9.6 Practice Cards

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Enter viewport | Rise and resolve, short stagger, capped at 6 | Slow | Entrance |
| Hover | Lifts a very small distance; border strengthens to gold; arrow advances | Fast | Response |
| Hover out | All three reverse together | Fast | Response |
| Focus | Indicator surrounds the whole card, instantly | Instant | — |
| Mobile | **No hover state.** Press produces a brief, subtle depression. | Instant | Response |

**The lift is deliberately small.** A card that rises noticeably reads as a web app. A card that acknowledges reads as print responding to a hand.

## 9.7 Attorney Section

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Image enters viewport | Settles with a barely-perceptible scale reduction | Scene | Entrance |
| Text | Rises and resolves after the image begins | Slow | Entrance |
| Credential rows | Short stagger in list order | Slow | Entrance |
| Biography link hover | Underline draws; arrow advances | Fast | Response |

**The image settle is the only scale change permitted anywhere on the site.** It is small enough to sit below conscious perception and large enough to give the photograph a sense of having just come to rest. It exists here and nowhere else.

## 9.8 Process Section

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Rules | Draw from the leading edge, short stagger | Scene | Environmental |
| Step content | Rises and resolves as each rule completes | Slow | Entrance |
| Numerals | Arrive with their step. No independent motion. | Slow | Entrance |
| Hover | **None.** Nothing here is interactive. | — | — |

The rules drawing before the content arrives reads as structure being ruled out and then filled in — appropriate for a section about process, and the only place in the system where a line is the subject rather than the frame.

## 9.9 Testimonials

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Rules | Draw from the leading edge, short stagger | Scene | Environmental |
| Quotes | Rise and resolve — **the slowest reveal in the system** | Slow (extended) | Entrance |
| Rating badge | Resolves with the section heading | Slow | Entrance |
| Badge hover | Arrow advances | Fast | Response |
| Rotation / carousel | **Prohibited.** Quotes are static. | — | — |

**Quotes are the slowest thing on the site.** Testimonials that snap into place read as advertising. Testimonials that arrive slowly read as recollection. The difference is not consciously perceptible and it changes the section's temperature entirely.

**No carousel.** A rotating testimonial is a slot machine, and it removes the visitor's control over their own reading.

## 9.10 Case Results

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Enter viewport | Rise and resolve, short stagger | Slow | Entrance |
| Outcome text | **No emphasis motion whatsoever** | — | — |
| Hover (where linked) | Standard card response | Fast | Response |

**Outcomes never animate for emphasis.** No counting up, no scale, no highlight sweep. A case outcome that performs is an advertising claim performing, which is precisely the register that attorney advertising rules exist to constrain. Case results are stated, not celebrated.

## 9.11 Images

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Load complete | Resolves from its placeholder without shift | Slow | Entrance |
| Hero portrait | Very slight vertical drift on scroll, desktop only | Sustained | Environmental |
| All other images | **No parallax, no scroll response** | — | — |
| Hover | **None on any image, anywhere** | — | — |

**No image zooms on hover.** Ken Burns effects, hover zooms, and reveal wipes are all editorial-template signatures. Photographs here are documents, not media.

## 9.12 Forms

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Field focus | Border strengthens; indicator appears instantly | Instant | — |
| Label | **Static.** Never floats, never shrinks, never migrates. | — | — |
| Validation error | Message resolves in place, pushing content below it down gently | Base | Entrance |
| Error clear | Message releases | Fast | Exit |
| Submit | Button enters a busy state; label remains legible | Base | Response |
| Success | Confirmation resolves; the form releases | Base | Entrance / Exit |

**Floating labels are prohibited.** They are a space-saving pattern that costs legibility and accessibility, and this design has space.

**Errors never shake, flash, or use colour alone.** An error is information delivered calmly. A form that reprimands is a form that loses a frightened visitor.

## 9.13 FAQ / Accordion

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Open | Panel expands to its natural height; content resolves shortly after the expansion begins | Base | Entrance |
| Close | Panel collapses, faster than it opened | Fast | Exit |
| Toggle mark | Transforms between its two states in step with the panel | Base | Response |
| Hover | **None.** The row's interactivity is evident at rest. | — | — |

**Where the expansion cannot be animated** — a platform constraint documented in the homepage specification — the panel opens instantly and **the toggle mark still transitions.** The interaction retains a felt response even when the panel does not animate. This is not a degradation to be apologised for; an instantly-opening accordion is a perfectly good accordion.

## 9.14 Page Transitions

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Internal link activated | Current content releases | Fast | Exit |
| New document ready | New content resolves | Base | Entrance |
| Persistent elements | Header and footer **do not participate.** They persist. | — | — |
| Browser back/forward | **No transition.** Instant, at the restored scroll position. | — | — |

**The transition must never delay navigation.** The exit begins the moment the link is activated and runs concurrently with the request. If the new document arrives first, the exit is cut short. A transition that adds latency to navigation is a transition that has failed.

**The header persisting through navigation is what makes the site feel like one space.** The visitor moves; the frame does not.

**Browser navigation receives no transition.** Back is an undo, and undo is instant.

## 9.15 Footer

| Trigger | Behaviour | Band | Curve |
|---|---|---|---|
| Enter viewport | **No entrance motion whatsoever** | — | — |
| Link hover | Underline draws | Fast | Response |

**The footer does not animate in.** By the time a visitor reaches it, motion has stopped signalling craft and started delaying them from a phone number. This is deliberate, slightly unusual, and must not be "corrected" for consistency.

## 9.16 Complete inventory

| Component | Entrance | Interactive | Environmental |
|---|---|---|---|
| Site header | First visit only | Compress, hide/reveal | Scene colour |
| Primary nav | With header | Underline | — |
| Mega menu | — | Open/close, delays | — |
| Mobile menu | — | Open, item stagger | — |
| Skip link | — | Instant appearance on focus | — |
| Hero | Full sequence | — | Portrait drift, ambient light |
| Trust strip | Reveal, stagger | — | — |
| Positioning statement | Line-by-line reveal | — | **Scene owner** |
| Attorney section | Image settle + stagger | Link | — |
| Process section | Rule draw + stagger | — | — |
| Testimonials | Slowest reveal | Badge arrow | **Scene owner** |
| Practice cards | Reveal, stagger | Lift, border, arrow | — |
| Case results | Reveal, stagger | Card response | — |
| Service areas | Reveal + map draw | Link underline | — |
| FAQ | Reveal, stagger | Expand/collapse | — |
| Final CTA | Rule draw + reveal | Button states | — |
| Forms | With section | Focus, validation, submit | — |
| Footer | **None** | Link underline | — |
| Page transition | Exit / entry | — | — |

---

# 10. Environmental Motion

The most dangerous category. Everything here is optional, everything is removable, and everything is the first thing sacrificed under any constraint.

## 10.1 Governing rule

> **Environmental motion must be invisible to anyone who has not been told it exists.** If a visitor notices it, its amplitude is wrong.

## 10.2 Pointer-responsive lighting

**Permitted, narrowly.**

A very slight warmth in the hero's radial field, responding to pointer position. The field's centre of luminance drifts toward the pointer at a fraction of the pointer's own movement, with substantial lag.

| Constraint | Value |
|---|---|
| Where | Hero radial field only. Nowhere else on the site. |
| Scene | Light scene only |
| Device | Desktop, fine pointer only |
| Amplitude | Below conscious perception |
| Over text | **Never.** The field is behind the portrait column, not beneath the type. |
| Dark scenes | **Never.** A light following the cursor on a dark background is a flashlight effect and reads as a game. |

**Never used for:** highlighting elements, revealing content, cursor followers, custom cursors, spotlight masks, magnetic buttons.

## 10.3 Parallax

**Permitted, once.**

The hero portrait drifts vertically at a slightly different rate from the page, across a very small distance.

| Constraint | Value |
|---|---|
| Elements | Hero portrait only. One element on the entire site. |
| Amplitude | Very small — a suggestion of depth, not a demonstration |
| Device | Desktop only |
| Layers | **One.** Multi-layer parallax is prohibited without exception. |
| Interior pages | **Never** |

**Why one layer only:** two or more layers moving at different rates is the defining signature of a portfolio site. It is also a vestibular hazard (§11.5). One layer, barely moving, reads as a photograph having presence. Three layers reads as a demo.

## 10.4 Background movement

**Prohibited entirely.**

| Prohibited | Why |
|---|---|
| Drifting gradients | Reads as a SaaS landing page |
| Animated noise or grain | Costs continuous compositing for an effect nobody consciously perceives |
| Floating shapes, blobs, orbs | Startup vocabulary |
| Video backgrounds | Expensive, distracting, and hostile to this audience's connections |
| Animated patterns or meshes | Tech-demo signature |
| Particles of any kind | Never |

**The background changes value across the descent. It does not move.** This single restriction is responsible for much of the site's calm.

## 10.5 Depth

Depth is produced **only** by:

1. Differential reveal timing — nearer elements resolve sooner and travel further
2. Value separation between scene surfaces
3. The single-layer portrait drift (§10.3)

Depth is **never** produced by drop shadows, 3D transforms, perspective, layered translation, blur-based depth of field, or scale-based distance cues.

## 10.6 Gold reflections

**Prohibited.**

Gold does not shimmer, sweep, glint, pulse, or catch the light. There is no specular animation on any gold element anywhere on the site.

**Reasoning.** Gold occupies under 3% of any viewport by deliberate constraint. Animating the accent is the fastest available route from *premium* to *costume jewellery*, and a sweeping highlight across a CTA is among the most recognisable cheap effects in commercial web design.

**The only permitted gold motion is structural:** underlines drawing, rules extending, the monogram inscribing, and the arrow advancing. In each case gold is *being drawn*, not *being lit*.

**The single exception:** the loading monogram's inscription implies a moving point of contact as the stroke is laid down. That is the act of drawing, not a reflection.

## 10.7 Atmospheric effects

**Prohibited entirely.** No fog, haze, light rays, dust, bokeh, lens flare, or film-grain animation.

Static film grain as a *texture* is a visual design decision outside this document's scope. **Animated grain is prohibited** — it costs a full-viewport repaint every frame for an effect that reads, on a law firm site, as pretension.

## 10.8 Degradation order

When device capability, connection, or user preference constrains motion, environmental motion is removed **first and completely**, before any other category is touched.

| Order | Removed |
|---|---|
| 1 | Ambient lighting |
| 2 | Portrait parallax |
| 3 | Loading curtain |
| 4 | Structural reveal transforms — reveals become instant presence |
| 5 | Scene transitions reduced to a brief resolve, never eliminated |
| 6 | Interactive motion reduced to instant state changes |

**Categories 5 and 6 are never fully removed**, because state feedback is functional rather than decorative.

---

# 11. Accessibility

Motion is where accessible design most often fails, because the failures are invisible to the people who build them.

## 11.1 Reduced motion

When a visitor has expressed a preference for reduced motion, the system honours it completely and immediately.

| Category | Reduced-motion behaviour |
|---|---|
| Loading | Static mark, brief hold, plain removal. No inscription, no travel, no lift. |
| Hero entrance | Does not play. Hero is complete at first paint. |
| Scene | **Still changes**, resolving over a short interval |
| Structural | Elements are present. No transform, no fade, no stagger. |
| Interactive | State changes apply instantly |
| Environmental | Entirely absent |
| Page transition | None. Instant. |

### Why scene changes persist rather than being eliminated

The light-to-dark descent is **design intent**, not decoration. A visitor with a motion sensitivity should experience the same site, not a different one.

**But the resolve must not be instantaneous.** An immediate inversion between a near-white and a near-black full viewport, repeated as a visitor scrolls back and forth across the trigger, produces a strobing effect — precisely the sensory event the preference exists to prevent.

A short resolve is slow enough not to strobe and fast enough not to read as animation. **This is the one place where "reduced motion" correctly means *less* motion rather than *no* motion, and the reasoning must survive into implementation.**

## 11.2 Keyboard users

| Requirement | Behaviour |
|---|---|
| Focus indicator | **Appears instantly. Never animates. In every mode, without exception.** |
| Focus-driven scrolling | Instant positioning. **Never smooth.** |
| Focus during motion | Focusing an element mid-reveal completes its reveal immediately |
| Curtain | Dismissed by Tab; focus lands on the skip link |
| Mega menu | Opens without delay for keyboard, unlike pointer |
| Motion never gates focus | An element that has not yet revealed is still focusable and still moves focus correctly |

**Smooth scrolling is prohibited for focus movement.** Animated scroll can outrun the focus indicator, leaving a keyboard visitor watching the page move with no idea where they now are.

## 11.3 Focus transitions

The focus indicator is the only element in the entire system exempt from every motion rule. It has no duration, no curve, no delay, and no transition — in full-motion mode as well as reduced.

**Focus is not an animation. It is a fact about where the visitor is.**

## 11.4 Screen readers

| Requirement | Behaviour |
|---|---|
| Motion is invisible to assistive technology | No announcements, no live regions, no status updates for any animation |
| Scene changes | Purely visual. No DOM reordering, no content substitution, no announcement. |
| Curtain | Not a dialog. Does not take or trap focus. Does not announce. |
| Reveals | Content is in the accessibility tree from first paint, regardless of visual reveal state |
| Progress | The loading rule is decorative and silent |

**A screen-reader user experiences this site as a well-structured document.** Everything in this specification is, to them, correctly absent.

## 11.5 Vestibular safety

Vestibular disorders can be triggered by motion suggesting that the *viewer* is moving rather than the content.

| Prohibited | Status |
|---|---|
| Rotation of any element | Never |
| Scale beyond a barely-perceptible amount | Only the attorney image settle and the monogram travel |
| Multi-layer parallax | Never |
| Zoom transitions | Never |
| Full-viewport translation | Never |
| Perspective or 3D transforms | Never |
| Camera metaphors — dolly, pan, orbit | Never |

**The scene system is intrinsically vestibular-safe by design**, and this is a designed property rather than a fortunate accident: the environment changes **value**, not **position**. Nothing moves. The room's light changes while the visitor stands still, which is a categorically different sensation from being moved through a space.

**The maximum translation of any element in this system is small enough that no element ever appears to travel across the viewport.** Reveals move a short distance. The portrait drifts barely. Nothing sweeps.

---

# 12. Performance Philosophy

## 12.1 Position

Motion is the most common cause of a beautiful site being slow, and the audience for this site is frequently on a poor connection with an inexpensive device.

> **Every motion in this system must be affordable on the worst device a real visitor will use.**

Not the best device. Not the average. The worst.

## 12.2 The absolute rule

> **Motion may never be the reason content is unavailable, delayed, or unreadable.**

Every element on this site is present, laid out, and readable before its motion begins. Motion adjusts *emphasis*. It never controls *availability*.

**Consequence:** if the entire motion system fails to execute — a script error, an unsupported platform, an aggressive content blocker — **the site is complete and correct.** Nothing is hidden awaiting an animation that will never arrive.

This is not a defensive fallback. It is the primary architecture, and animation is the enhancement layered onto it.

## 12.3 Engineering principles

| Principle | Requirement |
|---|---|
| **Cheap properties only** | Motion may only affect properties that do not force the browser to recalculate layout. Anything that reflows the page is prohibited as an animated property. |
| **Nothing animates off-screen** | Motion outside the viewport does not run. Ambient motion suspends when its subject is not visible. |
| **Observation, not polling** | Position-dependent motion is driven by browser-native observation. **The system never inspects scroll position on every frame.** |
| **Bounded concurrency** | A hard ceiling on simultaneously animating elements. The stagger cap enforces this structurally. |
| **Composite-friendly by construction** | If a motion cannot be expressed in cheap properties, the motion is redesigned — not the performance budget. |
| **Idle by default** | The system does no work when nothing is animating. No always-running loop. |
| **Motion suspends under load** | If the device cannot sustain the frame budget, motion degrades in the §10.8 order **before content is affected.** |

## 12.4 The budget relationship

Motion operates **within** the performance budget established for the site. It is never granted an exemption.

| Constraint | Motion's obligation |
|---|---|
| Largest contentful paint | **Motion never delays it.** The hero sequence begins after the primary content has painted. |
| Layout stability | **Motion contributes nothing.** No animated property may shift neighbouring content. |
| Interaction responsiveness | Interactive motion is interruptible and never blocks input |
| Total weight | The entire motion system is a small fraction of the page budget. If it cannot fit, it is reduced. |

**If a motion cannot be delivered within budget, the motion is cut.** The budget is not negotiable and has never been the variable.

---

# 13. Engineering Guidelines

## 13.1 Motion is declared, not written

Components do not contain animation. A component **declares the motion role it plays**, and the motion system supplies the behaviour.

| Component declares | System supplies |
|---|---|
| "I am a revealed element" | Timing, curve, transform distance, stagger participation, reduced-motion handling |
| "I am an interactive surface" | Hover, focus, press behaviour |
| "I am a scene owner" | Transition orchestration |
| "I am ambient" | Amplitude, suspension, degradation |

**Consequence:** a component author never chooses a duration or a curve. Those decisions were made in this document and live in the design system.

## 13.2 No component owns a timing value

| Rule | Detail |
|---|---|
| Durations and curves live in the design system | Never in a component |
| A component needing a bespoke duration is a design escalation | Not an implementation decision |
| Changing a band changes it everywhere | This is the intended behaviour |
| No magic numbers | A value appearing in one place only is a defect |

## 13.3 Motion is never embedded in business logic

Motion is a presentation concern with no authority over anything.

| Prohibited | Why |
|---|---|
| Motion gating navigation | A link must navigate regardless of animation state |
| Motion gating form submission | A form must submit regardless |
| Motion holding data | Content availability is never a function of animation state |
| Business logic inside animation callbacks | Removing the animation must not remove the behaviour |
| Motion state as application state | Whether something has revealed is not a fact the application knows |

**Test:** deleting the entire motion layer must break nothing except the appearance of motion.

## 13.4 Framework compatibility

Motion roles are part of the Nulo Legal Framework component contract. A new firm inherits the complete motion language by declaring roles on its components — **not by writing animation.**

| Requirement | Detail |
|---|---|
| Roles are firm-agnostic | Nothing in the motion system references Austin specifically |
| Amplitudes are tokens | A firm may adjust motion intensity via its theme, within bounded ranges |
| The loading sequence is parameterised by the firm's mark | Any firm's monogram performs the same inscription and travel |
| Narrative mode does not alter motion | Timing, curves, and behaviour are identical across urgent and planning firms. Only copy and emphasis differ. |
| No per-page motion | One motion system per site |

## 13.5 Naming

Motion roles are named by **intent**, never by implementation.

| Correct | Incorrect |
|---|---|
| Reveal, settle, respond, inscribe, travel, descend | fadeUp, slideIn, zoomOut, bounceIn |

A name describing *what a thing does visually* locks the implementation. A name describing *what a thing means* allows the implementation to improve.

## 13.6 One system, no exceptions

| Rule |
|---|
| One motion system per site. No page-specific motion. |
| No component reimplements an existing behaviour |
| A new motion requires a new entry in this document — not a local addition |
| Any motion not described in this document does not ship |

---

# 14. Success Criteria

## 14.1 The governing test

> **A visitor should leave thinking: "That was unlike any law firm website I've seen."**
>
> **They should never think: "That website had cool animations."**

The first is a judgement about the firm. The second is a judgement about the website. Only one of those wins clients.

## 14.2 Qualifying tests

Every one must pass. Failure of any single test invalidates the motion system regardless of how well it performs elsewhere.

### The recall test

Ask a visitor, five minutes after leaving, to describe one animation they saw.

**Pass:** they cannot, but describe the site as calm, serious, expensive, or careful.
**Fail:** they can name a specific effect.

### The mute test

Remove the entire motion system and view the site.

**Pass:** the site is complete, correct, and still clearly premium. Nothing is missing; something is merely quieter.
**Fail:** anything is invisible, broken, unreachable, or unexplained.

**This is the most important test in the document**, because it is the one that guarantees no visitor is ever harmed by motion failing.

### The emergency test

At any moment during the experience — including mid-loading-sequence, mid-hero-entrance, and mid-scene-transition — a visitor must be able to reach a working phone number within roughly three seconds.

**Pass:** always reachable, on every device, in every state.
**Fail:** any state in which the phone is obscured, delayed, or unreachable.

**No aesthetic consideration may compromise this test.**

### The third-visit test

View the homepage three times in one week.

**Pass:** the site feels the same on the third visit as the first — because the entrance no longer plays and nothing repeats.
**Fail:** anything has become tiresome, or the visitor begins waiting for motion to finish.

### The vestibular test

Review by someone with a known motion sensitivity, in full-motion mode.

**Pass:** no discomfort at any point.
**Fail:** any discomfort. There is no acceptable threshold.

### The budget test

Measure performance with motion fully enabled on a mid-range device and a poor connection.

**Pass:** every performance target met with motion running.
**Fail:** any regression attributable to motion. The motion is reduced, not the target.

### The competitor test

Place the site beside the strongest local competitor and a national firm's site.

**Pass:** this site reads as the most carefully made, and the *least* animated.
**Fail:** it reads as the most animated.

**These are the same test.** The site should win on restraint.

## 14.3 What success feels like

A visitor arrives frightened. Something moves — they could not say what. The page settles around a photograph of a person who looks directly at them. They scroll, and the light changes without their noticing when.

They read that this attorney will tell them the truth about where they stand. They reach for their phone.

They do not think about the website at all.

**That is the entire objective.** Every rule in this document exists to produce that unremarkable, decisive moment.

---

# 15. Changes to Prior Specifications

This document supersedes prior motion decisions in exactly two places. Both are consequences of introducing the loading sequence.

| # | Prior specification | Prior decision | This document | Reason |
|---|---|---|---|---|
| 1 | Phase 2 §S01 §8 | *"The header does not animate on page load. It is present at first paint."* | On **first session entry**, the header is assembled around the arriving monogram (§7.2 steps 4–5). On **every other entry**, the prior rule stands unchanged. | The original reasoning was that animating the header delays the first thing a visitor needs. With the curtain, the visitor has not yet needed anything — and the monogram travel gives the header a motivated arrival rather than a decorative one. The phone affordance remains live throughout (§6.7), so nothing is delayed. |
| 2 | Phase 2 §S04 §8 | Hero entrance begins on document ready | Hero entrance begins on **curtain lift**, continuous with it | The two must read as one gesture. A pause between them would make the curtain feel like an obstacle that was removed rather than a threshold that was crossed. |

**No other prior motion decision is changed.** All timing tokens, curve tokens, the reduced-motion contract, the stagger cap, the scene trigger assignment, and every per-component behaviour specified in Phase 2 remain in force.

---

**End of Motion Language Specification.**

*Every animation on this site is implemented against this document. Motion not described here does not ship.*
