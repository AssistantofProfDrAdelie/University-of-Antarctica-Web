# Encounter Penguin — Product Definition

## Identity and worldview

The product is **Encounter Penguin**. It creates small, unexpected encounters with penguins in ordinary visual life.

> There is always a penguin.

This is a playful product principle, not a requirement that a machine identify penguin-shaped pixels in every image. Human judgment remains authoritative. If a person sees a penguin, they see one; if they do not, that is also valid. The product does not persuade, coach, score, or prove an answer.

The characteristic successful moment is:

> an ordinary scene → something happens → Professor Adelie unexpectedly appears → “Oh.”

Keep the UI understated. Do not over-intellectualize or explain the joke.

## Core encounter

The user chooses an ordinary photograph. After a brief untouched pause, Professor Adelie cautiously peeks from an edge or corner without being requested or announced, remains long enough to be noticed or saved, then slowly retreats and disappears. The photograph becomes genuinely quiet again, but the silence is not necessarily the end: after an unpredictable absence he may visit again. The source photograph remains unchanged; saving creates a separate composite capture only while he is visible. A quiet lower-right “企鹅” counter records aggregate page views as a trace of other visitors having passed through; it is not a counter for Professor Adelie's appearances and must not narrate or gamify the encounter.

Each appearance remains simple—arrival, pause, retreat. The motion should feel like a temporary visit, not a pop, a mechanical full-image slide, an obvious animation loop, or an elaborate character performance. Richness comes from uncertainty about when, where, and eventually which approved Professor Adelie appears. Do not add scene understanding merely to choose placement.

## Visitation rhythm

Professor Adelie behaves as though he exists beyond the photograph and visits on his own time. The interval after retreat is an attentional and comic beat: the visitor first understands “oh—he retreats too,” experiences a brief suspension, and the return interrupts before attention disengages. The current creative anchor is approximately two seconds from full disappearance to visible re-entry, with small variation rather than a fixed beat. The interface never promises that he will return and never exposes timers, probabilities, visit counts, replay indicators, or phase narration.

Direction is probabilistic, but randomness is judged perceptually rather than by statistical purity. The photograph's perimeter is continuous encounter space, not a menu of four or eight directions. Each visit receives a continuously varied entry angle whose ray meets the rectangular boundary at a corresponding point; bodily orientation follows that exact angle. The lower perimeter remains the broadest source of encounters, sides remain less common, and the upper perimeter remains unusual. Consecutive angles retain substantial separation so the return moves perceptibly without becoming a fixed rotation or opposite-direction rule.

The silence after retreat must be real but remain within the visitor's immediate attention. The second appearance is a comic response to the first—“again, but from there?”—rather than a disconnected later event. The current quiet scheduling beat varies between one and 1.8 seconds; the next visit's own one-second untouched pause follows before visible movement begins. Timing starts only after retreat is complete. The values are implementation expressions of the approximately two-second attentional anchor, not a creative rule to preserve mechanically.

Spatial uncertainty is continuous: angle determines both where the perimeter is crossed and how Professor Adelie is oriented. Cardinal edges and corners remain recognizable possibilities, but most encounters may fall between them. Rotation-aware footprint calculation, bounded scale, and controlled reveal protect legibility, plausible framing, and head-first entry at every angle. The first appearance already uses the full continuum; later appearances preserve displacement without revealing a route.

Behavioral uncertainty is a small authored vocabulary, not a bag of effects. Most visits remain the established full peek and physical retreat. Less often Professor Adelie may reveal only a head, vanish without retracing the entrance, slip along the boundary, perform a quick double-take, or be joined by a second appearance. A perfectly opposed pair is rarer still. These gestures are selected as complete choreographies so they remain readable and deadpan; unusual traits must not combine into visual noise. The humor comes from the visitor discovering that the behavior has more logic than expected, never from spectacle.

Even an impossible departure must remain visually grounded. A fade affects the natural silhouette rather than the rectangular source image. A lateral departure continues to respect the photograph boundary and the hidden cut edges. Multiple heads are simultaneous sightings beyond different parts of the same photograph, not duplicated stickers floating in its interior. There are no particles, squash-and-stretch, explanatory cues, sound effects, or visitor-facing labels for these behaviors.

Professor Adelie's orientation belongs to the actual boundary trajectory. Upright, sideways, inverted, and diagonal appearances are landmarks within a continuous range rather than discrete modes. Scale and framing account for the rotated footprint at any angle; orientation must not produce accidental clipping or turn the character into a generic sliding image.

The approved source photograph ends against two hard raster boundaries. Those rectangular crop edges must never become visible when arbitrary rotation brings a source corner toward the photograph. Do not blur, feather, or otherwise cosmetically disguise them: that still reads as a processed rectangular image. Placement must keep the cut source edges physically beyond the photograph boundary while allowing the natural transparent silhouette of the head and body to enter.

## Professor Adelie

Professor Adelie (阿德利教授) is the authoritative primary character. His raw source corpus remains Private; the repository contains only the deliberately selected, processed cutout required by the public product.

The established visual language is deadpan, understated, physically grounded, modestly scaled, and situated in ordinary environments. Humor comes from Professor Adelie simply being there. Do not replace him with a generic cute penguin aesthetic, redraw him, or generate a substitute.

Raw source photographs may require technical preparation. Preserve originals and create reproducible derivatives using segmentation, masking, edge cleanup, cropping, optimization, and other non-generative transformations.

Approved character assets form an encounter vocabulary. Each asset defines only the directions, position regions, and presentations appropriate to its supplied pose, so asset and spatial presentation are selected as one compatible encounter rather than as unrelated random choices. The current vocabulary contains one approved asset. Future assets must be owner-approved and added without visitor-facing character selection or invented variants.

## Human judgment and visual reality

- A penguin is not an answer key. Do not use “look carefully,” hints, progressive reveal, Penguinness scores, anatomical explanations, or machine arguments.
- Playfulness does not excuse obvious factual stupidity: a clearly present real or represented penguin should not be confidently ignored in favor of an unrelated region.
- Not detected does not mean not present. Never claim exhaustive visual knowledge or build a state-of-the-art detector merely to avoid every miss.
- Recognition may serve the experience when useful, but recognition is not the product.

## Hard visual constraint

AI may analyze supplied images but may not generate image content. All visible character pixels must originate in owner-supplied source material. Non-generative selection, segmentation, cleanup, transformation, compositing, and animation are allowed; generative synthesis, fill, reconstruction, new poses, and replacement imagery are prohibited. See `AGENTS.md` for the operational rule.

## Current scope

- Deliver the complete local encounter loop reliably.
- Keep the user's original photograph untouched.
- Keep the experience short, replayable, and uncomplicated.
- Do not add recognition, semantic analysis, commentary, or other intelligence merely to demonstrate it. The aggregate page-view counter is the sole current external runtime service and must remain nonessential to the encounter.

## Distribution

Encounter Penguin is a static, client-side application. Photograph loading,
animation, compositing, and saving all remain in the user's browser; photographs
are not uploaded. The production application is continuously deployed from the
GitHub `main` branch to GitHub Pages and must operate independently of the
owner's computer. The page-view counter may depend on a privacy-respecting hosted
counter, but its failure must never block the local photograph experience. Only
production runtime files and the cleaned Professor Adelie
derivative belong in the deployed artifact.

The repository and deployed product are Public. Raw photographs, the broader
Antarctic University archive, internal corpus notes, and temporary preparation
material remain Private. Access for engineering never implies permission to
publish them.
