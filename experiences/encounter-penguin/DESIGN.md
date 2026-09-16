# Encounter Penguin — Product Definition

## Identity and worldview

The product is **Encounter Penguin**. It creates small, unexpected encounters with penguins in ordinary visual life.

> There is always a penguin.

This is a playful product principle, not a requirement that a machine identify penguin-shaped pixels in every image. Human judgment remains authoritative. If a person sees a penguin, they see one; if they do not, that is also valid. The product does not persuade, coach, score, or prove an answer.

The characteristic successful moment is:

> an ordinary scene → something happens → Professor Adelie unexpectedly appears → “Oh.”

Keep the UI understated. Do not over-intellectualize or explain the joke.

## Core encounter

The user chooses an ordinary photograph. After a brief untouched pause, Professor Adelie cautiously peeks from an edge or corner without being requested or announced, remains long enough to be noticed or saved, then slowly retreats and disappears. The source photograph remains unchanged; saving creates a separate composite capture only while he is visible.

The motion should feel like a temporary visit, not a pop, a mechanical full-image slide, or an elaborate character animation. Small inexpensive variation is welcome when it improves repeat encounters. Do not add scene understanding merely to choose placement.

## Professor Adelie

Professor Adelie (阿德利教授) is the authoritative primary character. His raw source corpus remains Private; the repository contains only the deliberately selected, processed cutout required by the public product.

The established visual language is deadpan, understated, physically grounded, modestly scaled, and situated in ordinary environments. Humor comes from Professor Adelie simply being there. Do not replace him with a generic cute penguin aesthetic, redraw him, or generate a substitute.

Raw source photographs may require technical preparation. Preserve originals and create reproducible derivatives using segmentation, masking, edge cleanup, cropping, optimization, and other non-generative transformations.

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
- Do not add recognition, semantic analysis, commentary, external services, or other intelligence merely to demonstrate it.

## Distribution

Encounter Penguin is a static, client-side application. Photograph loading,
animation, compositing, and saving all remain in the user's browser; photographs
are not uploaded. The production application is continuously deployed from the
GitHub `main` branch to GitHub Pages and must operate independently of the
owner's computer. Only production runtime files and the cleaned Professor Adelie
derivative belong in the deployed artifact.

The repository and deployed product are Public. Raw photographs, the broader
Antarctic University archive, internal corpus notes, and temporary preparation
material remain Private. Access for engineering never implies permission to
publish them.
