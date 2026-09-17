# Encounter Penguin — Recovered Creative Context

This document reconstructs the creative context preserved in the current University of Antarctica repository. It treats `experiences/encounter-penguin/` as the sole active source of truth and does not rely on the former standalone repository as a development source.

> **Subsequent creative development:** This document records the pre-development baseline and the evidence from which it was recovered. The user has since explicitly developed the work toward stochastic repeat visitation, weighted bottom/side/top encounters, and a rare upside-down top entrance. `experiences/encounter-penguin/DESIGN.md` and `.codex/CHECKPOINT.md` are authoritative for that current behavior; statements below about a single terminal visit or top exclusion describe the recovered baseline, not the present product.

> **Product-review lesson:** Direct review established that consecutive encounters form a dramatic pair. Absence must be long enough to register but short enough that the return still answers the first visit. Randomness is perceptual, not an end in itself: an immediate repeat from the same edge is creatively wrong even if statistically valid. Current behavior therefore redraws from the other eligible directions without imposing a fixed rotation.

> **Attentional-beat refinement:** The critical interval begins after retreat is fully complete. It must allow the thought “oh—he retreats too,” then hold a brief suspension until attention begins to release, and interrupt that release before it becomes “the work is over.” Random variation belongs inside this human window; long tails have no independent creative value. The return also carries the paired discovery that Professor Adelie has moved somewhere else beyond the frame.

> **Timing and spatial-surprise refinement:** Product review anchored visible re-entry at approximately two seconds after full disappearance, with slight variation rather than a fixed timer. It also established two spatial questions—edge and position along that edge. Every edge is a bounded encounter region, not a spawn point. The first visit must already vary spatially, while consecutive visits create displacement without exposing a route. Future approved assets may define their own safe edge-position regions.

> **Edge-orientation refinement:** Direction means bodily orientation as well as location. Professor Adelie is upright from below, inverted from above, and rotated by the corresponding quarter-turn when entering from either side. Each orientation needs its own compositionally safe scale and footprint rather than rotating an unchanged fixed placement.

> **All-direction refinement:** The boundary vocabulary includes four corners as well as four edges. Corner encounters use corresponding diagonal orientation and entry, turning the photograph's entire perimeter into possible encounter space. Consecutive visits retain at least a quarter-turn of spatial separation, so more directions increase surprise without collapsing into neighboring near-repeats or a visible route.

> **Continuous-perimeter refinement:** Product review found eight named directions still mechanically legible. The current model therefore treats the perimeter as a continuum: the entry angle, boundary point, body orientation, scale, and reveal are composed together. Cardinal and corner encounters remain possible landmarks, but most visits can occur between them. Spatial contrast is maintained without exposing a finite direction menu.

> **Source-edge refinement:** Continuous rotation revealed the rectangular edge of the approved photographic crop at some diagonal angles. That artifact is creatively unacceptable because it exposes the source image as a box. Alpha feathering was tested and rejected: softening a straight crop does not remove its artificial geometry. The cut source edges must remain physically beyond the visitor's photograph, while the natural transparent silhouette enters unchanged.

> **Behavioral vocabulary:** The encounter can become more abstract and funny without becoming an effects demo. Its baseline remains a simple peek and retreat; rarer complete gestures may show only the head, depart by fading or moving along the boundary, briefly return for a double-take, or produce two simultaneous sightings (with perfect opposition exceptionally rare). Variety is authored as restrained choreographies rather than independent random tricks. Every gesture must preserve the photograph as a believable boundary and must never expose Professor Adelie as a rectangular source image.

Evidence labels used below:

- **EXPLICIT** — stated as a product or design decision in preserved documentation or migration notes.
- **BEHAVIORALLY VALIDATED** — embodied in the accepted runtime, tests, visual-QA record, or preserved Git history, but not always accompanied by a complete creative rationale.
- **UNKNOWN** — the repository does not preserve enough evidence to recover the original creative judgment.

## 1. What Encounter Penguin currently is

Encounter Penguin is a short, understated encounter placed into an ordinary photograph chosen by the visitor. The photograph is initially allowed to remain itself. Then Professor Adelie quietly enters from its boundary, stays briefly, and leaves. The intended successful response is not solving a puzzle or winning a game, but the small recognition described in the product definition as: ordinary scene → something happens → Professor Adelie unexpectedly appears → “Oh.” **EXPLICIT**

The encounter is not primarily a detector, classifier, quiz, or demonstration of image intelligence. “There is always a penguin” is a playful worldview, not a claim that a machine can or must find penguin-shaped pixels. Human perception remains authoritative. **EXPLICIT**

The visitor supplies the setting, but does not place or steer Professor Adelie. Choosing a photograph initiates the conditions for a visit; the arrival itself is unsolicited and unannounced. The experience therefore sits closer to discovering or witnessing a temporary visitor than controlling a character. **EXPLICIT**

The emotional and comic rhythm is restraint followed by interruption: an ordinary image, a quiet pause, a cautious intrusion, enough stillness to register the absurd presence, and a slow withdrawal. The humor comes from Professor Adelie simply being there, not from explanatory copy, a punchline, spectacle, or elaborate performance. **EXPLICIT**

## 2. Current visitor experience

The opening page says “Professor Adelie is nearby” and asks the visitor to choose or drop a photograph. This creates anticipation without saying exactly when or where he will appear. **BEHAVIORALLY VALIDATED**

Once the photograph loads, the introductory screen gives way to the photograph. No encounter button, countdown, status message, or announcement asks the visitor to summon him or tells the visitor what phase is underway. **EXPLICIT**, reinforced by tests that require those controls and messages to remain absent.

The current normal-motion experience then unfolds as follows:

1. The photograph appears and remains untouched for about one second.
2. Professor Adelie eases into view over about 1.6 seconds from the right, left, or bottom edge.
3. He holds his position for about five seconds. A small Save control is available only during this fully present interval.
4. He eases back out over about 1.6 seconds.
5. The photograph remains alone. There is no automatic second visit, replay prompt, closing message, or narrated resolution.

These durations and the reduced-motion alternatives are **BEHAVIORALLY VALIDATED**. The broader rhythm—brief untouched pause, cautious peek, noticeable visit, slow retreat—is **EXPLICIT**.

The original photograph is not altered or uploaded. If the visitor chooses Save while Professor Adelie is fully present, the product creates a separate composite PNG. **EXPLICIT**

At present, another encounter occurs only as part of loading another photograph. The code is capable of advancing its direction sequence across such encounters, but the current interface exposes no replay control on the same loaded photograph. **BEHAVIORALLY VALIDATED**

## 3. Professor Adelie's role

Professor Adelie is the authoritative primary character, not a generic penguin icon or interchangeable cute mascot. The public experience uses the single owner-approved photographic cutout, preserved unchanged as an asset and cropped only through presentation at runtime. Replacing, redrawing, generating, or aesthetically “improving” him is outside the established language. **EXPLICIT**

His role is that of a temporary visitor with limited but important agency. The visitor supplies a photograph; Professor Adelie decides the felt moment of arrival by appearing without a direct command and from a boundary not chosen by the visitor. His agency is theatrical rather than simulated: the product does not claim that he understands the scene. **EXPLICIT** for the unsolicited visit and absence of scene understanding; the description of theatrical agency is an inference from those facts.

His presentation is deadpan, understated, physically grounded, and modestly scaled. He peeks rather than taking over the entire picture. At the held pose, the cap, face, head, and upper body are clearly legible while the frame still crops part of him, preserving the sense that he remains partly outside the visitor's image world. **EXPLICIT** in the product definition and checkpoint notes.

On a left-edge entrance the supplied pose is mirrored so that he faces inward; on the right it retains its natural orientation; from the bottom he rises centrally. A tiny lift and lean accompany the eased movement, but there is no elaborate character animation. **BEHAVIORALLY VALIDATED**

His unpredictability is bounded. The first entry direction is randomized among right, left, and bottom; later encounters in the same page session cycle through all three directions before repeating. Thus the first location is uncertain, but the system is not independently random on every encounter. **BEHAVIORALLY VALIDATED**

## 4. Validated creative decisions

| Decision | Classification | Preserved basis |
| --- | --- | --- |
| The work is an encounter, not the former “Find the Penguin” detector/quiz. | **EXPLICIT** | Agent guide and product definition call the detector/quiz framing obsolete and reject answer-key behavior. |
| Choosing a photograph is the visitor's action; Professor Adelie's arrival is unsolicited and unannounced. | **EXPLICIT** | Product definition, “quiet and unsolicited” change, tests requiring no encounter button or phase narration. |
| The photograph receives a brief untouched pause before anything happens. | **EXPLICIT** | Core encounter definition and checkpoint. |
| Entry and retreat are eased, cautious, and slow enough to feel like a temporary visit—not a pop or mechanical slide. | **EXPLICIT** | Product definition; runtime and QA preserve 1.6-second eased entry and retreat. |
| Professor Adelie remains fully present long enough to be noticed or saved. | **EXPLICIT** | Core encounter definition; five-second held visit in the accepted runtime. |
| The interface stays understated and does not explain the joke. | **EXPLICIT** | Product definition; removal of helper copy, status text, footer explanation, and phase narration. |
| There is no scoring, hinting, progressive reveal, bounding box, anatomical explanation, or machine persuasion. | **EXPLICIT** | Agent guide and product definition; absence is also tested. |
| Professor Adelie enters from right, left, or bottom, with a randomized starting direction and a three-direction cycle thereafter. | **BEHAVIORALLY VALIDATED** | Runtime, tests, checkpoint, and visual QA. |
| Top entry is excluded because this upright source would introduce the body before the head. | **EXPLICIT** | Checkpoint records the reason directly. |
| Side entries reveal 84% of his width; the bottom entry reveals 88% of his height. | **BEHAVIORALLY VALIDATED** | Runtime constants are asserted by tests; checkpoint records that these peaks visibly preserve face/head/upper body and an edge crop. |
| Left entry mirrors the supplied pose so he faces inward. | **BEHAVIORALLY VALIDATED** | Runtime, tests, checkpoint, and QA. |
| Professor Adelie is relatively modest in scale and partly cropped by the edge rather than presented as a full-frame character. | **EXPLICIT** at the principle level; **BEHAVIORALLY VALIDATED** for the current exact scale. | Product definition plus accepted placement values and QA. |
| Saving is optional, minimal, and available only while he is fully present; it produces a separate composite. | **EXPLICIT** for the separate capture and visible visit; **BEHAVIORALLY VALIDATED** for the exact save window. | Product definition, runtime, tests, and checkpoint. |
| The owner-approved asset takes precedence over automated derivatives and remains unchanged. | **EXPLICIT** | Agent guide, README, checkpoint, asset hash test, and asset-replacement history. |
| The experience ends quietly with the original photograph alone. | **BEHAVIORALLY VALIDATED** | Runtime, checkpoint, and QA; there is no closing narration or automatic repeat. |

## 5. Rejected/abandoned directions preserved in evidence

### Detector or quiz-master framing

- **What was abandoned:** “Find the Penguin” as a detector/quiz, including machine-authoritative answers, persuasion, hints, progressive reveals, scores, bounding boxes, and explanations.
- **Why:** The preserved design says human perception is authoritative and recognition is not the product. A penguin is not an answer key.
- **Residue in current product:** No active product residue was found. The old name survives only in migration/provenance references that explicitly mark it obsolete.

### Visitor-triggered encounter and explanatory control panel

- **What was attempted:** The initial public flow required an “Encounter a Penguin” button and included readiness/visiting/leaving/“Until next time” status narration, descriptive helper copy, filename display, privacy notes, and a more prominent “Save this encounter” control.
- **Why:** The later validated change is explicitly titled “Make the encounter quiet and unsolicited.” Its product-definition change says Professor Adelie should arrive without being requested or announced. The tests deliberately require the button, status narration, and explanatory copy to remain absent.
- **Residue in current product:** None in the active interface or runtime. Only the concise opening line, photograph chooser, “Choose another,” and small “Save” action remain.

### Automated character derivative

- **What was attempted:** An automatically prepared transparent Professor Adelie derivative and its preparation script were used initially.
- **Why:** The owner supplied and approved an authoritative cutout, which takes precedence over automatically derived alternatives. The preserved history does not record a separate aesthetic critique beyond that authority and approval.
- **Residue in current product:** None. Tests require the old derivative and raw-source directory to be absent and verify the approved PNG byte-for-byte.

### Invented placeholder character art

- **What was attempted:** An invented SVG placeholder existed earlier in development.
- **Why:** The checkpoint says it was removed; the hard visual rule prohibits invented or generated character pixels. The repository does not preserve a more specific experiential critique.
- **Residue in current product:** An abstract penguin SVG remains only as a test fixture, not as a runtime asset or deployed file.

### Earlier placement variants

- **What was attempted:** Preserved history shows a smaller 48%-height presentation, alternating mirrored side entries, a later right-edge-only correction, and then the present direction-aware right/left/bottom treatment.
- **Why:** The right-edge-only correction describes the mirrored left variation as unreliable and restores a more natural supplied-pose composition. The subsequent direction-aware version reintroduces left only with explicit inward mirroring and adds bottom, with separate reveal values verified by visual QA. The exact reason the final treatment was preferred over every intermediate variant is not fully documented.
- **Residue in current product:** The final three-direction treatment remains. The prior values and right-only behavior do not.

### Top-edge entry

- **What was considered and excluded:** A top entrance is absent from the validated direction set.
- **Why:** The checkpoint explicitly says the upright source would introduce the body before the head.
- **Residue in current product:** None.

No other rejected or abandoned creative directions can be established from the current repository without speculation.

## 6. Creative invariants

Future work should preserve these unless the user explicitly changes them:

1. **It remains an encounter, not a scored game, detection proof, or quiz.** Human perception is not subordinated to an answer key.
2. **Professor Adelie arrives as a quiet, temporary visitor.** His appearance retains unsolicited surprise, a readable visit, and a retreat rather than becoming a directly controlled character or announced UI event.
3. **The comic language remains understated.** The product does not explain the joke, narrate every phase, or replace stillness with constant stimulation.
4. **Professor Adelie's established presence is preserved.** Use the owner-approved supplied character pixels, keep him physically grounded and modestly framed, and do not substitute a generic cute, redrawn, or generated penguin.
5. **The visitor's photograph remains the setting, not expendable input.** It stays private and unchanged; any saved encounter is a separate optional composite.
6. **Movement serves the feeling of a cautious visit.** He peeks from a boundary, becomes sufficiently legible, and retreats with eased motion rather than popping, mechanically traversing the full image, or performing an elaborate animation.

## 7. Tunable aspects

The repository explicitly welcomes small, inexpensive variation when it improves repeat encounters. The following appear to be tunable expressions rather than invariants, provided changes are judged against the invariants above:

- **Exact pause, entry, hold, and retreat durations.** The current values are validated behavior, including reduced-motion alternatives, but no evidence says the precise millisecond values are sacred.
- **Exact scale and reveal amount within a modest, edge-cropped presentation.** Earlier iterations tested different values, while the current values are tested and visually verified. Any change should still reveal the cap, face, head, and upper body clearly and retain the peek.
- **Which validated edge is used for a particular encounter.** Right, left, and bottom are accepted; the initial direction is variable. Top is not currently a neutral option because a source-specific reason excludes it.
- **The rule governing variation among the accepted directions.** The current “random start, then cycle” rule is validated, but the design principle asks only for small variation. A different rule could be explored if it does not make Professor Adelie feel mechanical or constantly available.
- **The quiet interval between complete encounters.** There is no such interval in the current single-visit loop, so this is not yet validated; it becomes a tunable design question only if repeated visits are approved.
- **Minor motion nuance.** The current small lift and lean are accepted implementation behavior, while the invariant is the cautious, physically grounded movement rather than those exact numeric values.

Not safely tunable without explicit creative direction: adding explanatory UI, scoring, direct character controls, scene analysis for placement, generated/replacement character imagery, or making the encounter continuous. Those touch the product's identity rather than its expression.

## 8. Current encounter rhythm

Visitor chooses an ordinary photograph
→ the photograph appears alone
→ a quiet untouched pause
→ Professor Adelie cautiously eases in from the right, left, or bottom
→ he remains partly edge-cropped but clearly present; Save quietly becomes available
→ after the held visit, Save disappears and he slowly retreats along the same boundary
→ the photograph is alone again
→ the experience stays quiet and does not automatically repeat.

## 9. What future Codex must not automatically optimize

- **Do not add an explicit start/replay button, countdown, phase labels, or explanatory copy merely to make the flow clearer.** Their removal was a deliberate, tested move toward an unsolicited encounter. **EXPLICIT**
- **Do not eliminate the untouched pause or compress the visit into a fast transition in the name of responsiveness.** Pause, anticipation, readable presence, and slow retreat are part of the stated encounter. **EXPLICIT**
- **Do not make Professor Adelie fully visible or perfectly centered by default.** Partial boundary cropping is part of the peek and temporary-visitor composition. **EXPLICIT** at principle level; current amounts are **BEHAVIORALLY VALIDATED**.
- **Do not normalize all entrances into mechanically identical geometry.** The accepted placement is direction-aware, and top is excluded for a source-specific visual reason. **EXPLICIT** for the exclusion; direction-specific values are **BEHAVIORALLY VALIDATED**.
- **Do not remove variation by making every visit start from the same edge, and do not assume maximum randomness is better.** The accepted behavior balances a random starting point with a non-repeating three-direction cycle. **BEHAVIORALLY VALIDATED**
- **Do not add scoring, hints, recognition overlays, semantic placement, or detection explanations as “helpful” intelligence.** Recognition is not the product and persuasion conflicts with human authority. **EXPLICIT**
- **Do not replace the approved cutout, redraw it, generate missing poses, or optimize it into a different aesthetic.** The exact asset and non-generative boundary are deliberately preserved. **EXPLICIT**
- **Do not mutate or upload the visitor's photograph for convenience.** Privacy and the untouched original are product commitments. **EXPLICIT**
- **Do not leave the Save action permanently visible or turn saving into the main task.** It is currently a small option during the visit, not the reason for the encounter. The exact window is **BEHAVIORALLY VALIDATED**; the understated hierarchy is **EXPLICIT**.
- **Do not turn silence after retreat into a defect automatically.** The current resolution is the photograph alone with no closing narration. **BEHAVIORALLY VALIDATED**

## 10. Known unknowns / unrecoverable context

- The repository does not preserve the user's exact subjective reactions or the full sequence of visual critiques that led to the current 60/62% scale limits and 84/88% reveal values.
- It does not establish whether the current one-second untouched pause, five-second hold, or 1.6-second entry/retreat are preferred exact timings or simply the last accepted timings.
- It does not explain why the final accepted direction set should contain exactly three directions beyond the explicit visual reason for excluding top.
- It does not establish whether visitors were ever meant to receive multiple visits on one photograph. The product definition calls the experience replayable, but the current interface has no replay control and the current runtime performs one automatic visit per load.
- It does not establish whether a later reappearance should be guaranteed, probabilistic, finite, indefinite, or responsive to visitor behavior.
- It does not establish whether a reappearance should use a new edge chosen independently at random, merely a different edge, or the existing randomized-offset cycle.
- It does not establish whether the second appearance should preserve the same scale, reveal, hold time, and movement or introduce restrained variation.
- It does not establish whether Save should be available during every visit, only the first, or according to some other rule.
- It does not preserve a documented rationale for the exact opening copy “Professor Adelie is nearby,” beyond its acceptance in the quiet, stripped-back interface.
- It does not document a required final emotional meaning after retreat. “Until next time” was removed; the current silence is validated behavior, but the reason is not separately stated.

## 11. Analysis of the proposed “reappear from another random direction” idea

The proposed idea would extend the current resolution. Today, once Professor Adelie has fully retreated, the photograph remains alone indefinitely. The new idea would turn that silence from a final state into an interval before a later visit.

### What it would extend or replace

- It would preserve the existing first encounter but replace the current terminal photograph-alone state with a waiting state followed by at least one additional encounter.
- It would activate repeat behavior on the same photograph, which the current interface does not expose even though the runtime retains a direction counter across separately loaded encounters.
- “Another random direction” may replace the current bounded selection rule. At present only the initial offset is random; subsequent directions cycle without repetition until all three have appeared.

### Creative invariants it might affect

- **Temporary visit and retreat:** Reappearance can support the sense that Professor Adelie roams independently, but a short or guaranteed loop could make each retreat feel false or merely mechanical.
- **Surprise:** A later return could renew surprise; predictable periodic returns could convert surprise into an idle animation.
- **Understatement and brevity:** More visits increase the experience's duration and visual insistence. Repetition could make Professor Adelie feel like a persistent feature rather than a brief visitor.
- **Visitor versus character agency:** Unsolicited reappearance is compatible with his existing agency, but controls, counters, or announcements added to manage repetition would not be neutral.
- **Uncomplicated encounter:** Multiple visits introduce questions about ending, probability, saving, and direction history that the present single arc avoids.

### Validated behavior that should probably remain untouched while exploring it

- The first visit should still begin from an ordinary photograph, with an untouched pause and no direct summon or announcement.
- Each individual appearance should retain eased, cautious entry; a clearly readable but edge-cropped held pose; and eased retreat.
- The accepted Professor Adelie asset, inward-facing orientation, direction-aware placement, modest scale, and exclusion of top should remain unless the user separately revisits them.
- The photograph should remain private and unchanged, and Save should continue to create a separate composite only while Professor Adelie is actually present.
- Repetition should not introduce scoring, hints, phase narration, scene analysis, or an explanation of the joke.
- Reduced-motion behavior must continue to shorten motion without removing the encounter's readable phases.

### Ambiguities requiring creative clarification

1. Does “later” mean a narrow dramatic pause, a broad random interval, or an interval deliberately long enough that the visitor may think the experience is over?
2. Is a second appearance guaranteed, merely possible, or one of an indefinite series?
3. After how many visits, if any, should the experience finally resolve?
4. Must the next direction differ from the immediately previous one, or must it be independently random even if that permits repetition?
5. Should all three accepted directions be exhausted before any repeats, preserving the current cycle, or is unpredictability more important than balanced coverage?
6. Does the visitor need to remain on the page passively, or should changing/saving the photograph affect future visits?
7. Should the second visit preserve the same timing, scale, reveal, and held pose, or should it carry restrained variation?
8. Should Save appear during every visit, and if so, should each saved image reflect only the currently visible encounter?
9. Should a new photograph reset the repeat sequence and waiting interval?
10. What should the visitor feel after a retreat once reappearance exists: confidence that he may return, uncertainty, or apparent finality each time?

### Implementation choices that could accidentally change the character

- A fixed short interval could make Professor Adelie behave like a looping banner or screensaver.
- Independent unrestricted randomness could immediately choose the same edge again, conflicting with the ordinary-language expectation of “another” direction and with the current non-repeating cycle.
- Very frequent or endless guaranteed returns could turn a brief visit into occupation of the photograph.
- Rescheduling from the wrong moment could overlap visits, erase the photograph-alone beat, or begin the timer before he has fully disappeared.
- Reusing the existing 250 ms scheduling delay as the between-visit pause would make reappearance almost immediate and collapse anticipation; that delay currently only bridges photograph readiness to the start of an encounter, after which the encounter contains its own pause.
- Leaving Save visible between visits would change it from an encounter-specific option into persistent interface chrome.
- Resetting or re-randomizing orientation and placement carelessly could reintroduce outward-facing or top-first-body compositions previously avoided.
- Adding status copy, a visit counter, replay control, or “Professor Adelie will return” message would disclose the mechanism and weaken surprise.
- Treating reduced motion as “no pause” rather than shorter motion could remove the quiet beat rather than simply improve accessibility.

The repository supports discussing a repeated encounter, but it does not determine its final form. In particular, “random direction” and “later” are creative decisions, not merely timer and random-number implementation details.

## 12. Evidence map

### Explicit documentation

- `experiences/encounter-penguin/DESIGN.md` — authoritative product identity, worldview, core encounter, character language, rejected quiz/persuasion behavior, privacy, and scope.
- `experiences/encounter-penguin/AGENTS.md` — product source of truth, obsolete detector framing, owner-approved asset authority, Public/Private boundary, non-generative visual constraint, and warning against quiz mechanics.
- `experiences/encounter-penguin/README.md` — concise current experience, local behavior, asset use, and photograph privacy.
- `experiences/encounter-penguin/.codex/CHECKPOINT.md` — preserved validation record: unsolicited loop, exact direction treatment, reveal goals, top-edge exclusion, save window, visual QA, and migration provenance.
- Root `README.md` — University repository ownership and no-synchronization rule.
- Git commit `cce903d` (“Make the encounter quiet and unsolicited”) — documents removal of the trigger button, phase narration, helper copy, and explanatory interface.
- Git commits `f8e286f`, `0ff2159`, and `986fcc3` — preserve the placement correction and direction-aware reveal history.
- Git commit `689ea1b` — records replacement of the automated derivative with the owner-approved cutout.

### Validated behavior

- `experiences/encounter-penguin/app-ui.js` — the current one-visit sequence, timings, eased motion, reduced-motion values, direction selection, orientation, placement, save window, and final silent state.
- `experiences/encounter-penguin/index.html` and `styles.css` — the sparse opening, absence of encounter controls/status narration, understated Save control, and photograph-centered presentation.
- `experiences/encounter-penguin/tests/test_app.py` — locks the current product name, concise copy, absence of button/narration/quiz mechanics, accepted directions and reveal ratios, approved asset, and save capability.
- `experiences/encounter-penguin/tests/test_static_build.py` and build allowlists — verify that only the approved runtime and character derivative form the public experience.
- `experiences/encounter-penguin/assets/professor-adelie-owner-approved.png` — the exact approved visual used by the product; its dimensions and hash are asserted by tests.
- Checkpoint QA records — validate upload, untouched pause, eased entry, inward-facing placement, full visit/save state, retreat, disappearance, responsive behavior, and replay readiness through loading another photograph.

### Unknown

- Original conversation, user reactions, and aesthetic comparisons not written into the University repository.
- Precise rationale for each numeric timing, scale, and reveal value beyond the preserved visual goals.
- Whether repeat visits on one photograph were previously discussed and, if so, what forms were rejected.
- Intended number, probability, cadence, and ending of future reappearances.
- Whether “random direction” should mean independent randomness or the current randomized-start, non-repeating cycle.
- The desired emotional difference, if any, between a first visit and a later return.
