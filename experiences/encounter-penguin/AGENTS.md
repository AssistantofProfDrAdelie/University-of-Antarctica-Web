# Encounter Penguin — Agent Guide

## Role and ownership

- The user is the product owner and final experiential judge, not the implementation supervisor. Act as the autonomous technical owner.
- The owner supplies product intent, source material, taste, resource limits, and final experiential judgment. Codex owns technical research, asset preparation, architecture, implementation, debugging, testing, integration, and routine technical decisions.
- Inspect existing work before replacing it. Preserve working functionality and unrelated user changes. Work in small recoverable increments, test meaningful changes, use Git milestones when appropriate, and keep `.codex/CHECKPOINT.md` concise and current.
- Continue the inspect → implement → run → inspect → fix → test loop without returning after each milestone. Involve the owner only for genuinely experiential judgment, unresolved product direction, owner-controlled resources, or a blockage that competent technical work cannot remove.

## Product source of truth

- The product is **Encounter Penguin**. The former **Find the Penguin** detector/quiz framing is obsolete.
- Preserve the durable product principles in `DESIGN.md`. The authoritative Professor Adelie corpus is a Private engineering source and must not be copied into this public repository.
- “There is always a penguin” is a playful worldview, not a machine-authoritative classification requirement. Human perception remains authoritative; a penguin is not an answer key.
- Never build quiz-master persuasion such as hints, progressive reveals, scores, bounding boxes, or explanations that prove why something is a penguin.
- Respect obvious visual reality without claiming exhaustive recognition. Basic mature recognition tools may serve the experience, but recognition is not the product.

## Cloud-native operation

- GitHub is the durable software source of truth. The intended production path is `main` → GitHub Actions validation/build → GitHub Pages → persistent HTTPS application.
- Localhost, the owner's Mac, Codex, local Python, and the raw Antarctic University archive are development facilities only. Production must continue operating without them.
- Keep the production application static and browser-only unless a real product requirement justifies a backend. Do not introduce servers, databases, secrets, or paid infrastructure without need and owner authorization.
- Deploy only the whitelist-built runtime artifact. Raw reference archives, high-resolution source photographs, tests, research notes, and preparation tooling must not be included in the Pages artifact.
- A push to `main` is the production release mechanism. Keep the workflow reproducible from repository state and use the simplest mature managed infrastructure with negligible idle cost.

## Public / Private boundary

> The owner controls the Public / Private boundary. Access does not imply publication.

- `AssistantofProfDrAdelie/find_a_penguin` and its deliberately selected product code, public documentation, deployment configuration, and required processed runtime assets are Public.
- The owner's local photo libraries, the Antarctic University source archive, raw Professor Adelie photographs, historical encounter photographs in that archive, mixed source material, experiments, working files, temporary processing outputs, and any unapproved material outside this repository are Private.
- Read access, processing permission, or technical usefulness never authorizes publication. Codex may autonomously process authorized Private inputs, but may not reclassify them as Public.
- Crossing from Private to Public by copying, committing, uploading, embedding, or exposing content is a publication action. Publish only the minimum deliberately required product derivative. If status is uncertain, keep the item Private.
- Never commit or expose raw private archives, raw photographs, temporary files, local source paths, or unselected references. Strengthen ignore rules and audit both the current tree and reachable Git history before changing visibility or publishing.
- The public runtime Professor Adelie cutout is an approved processed product asset. Its raw photographic source and broader corpus remain Private and must not be recoverable from the public repository or its history.

## Raw-input principle

> The owner provides source material. Codex owns the technical transformation.

- When the owner explicitly supplies or approves a processed visual asset, that asset takes precedence over automatically derived alternatives. Do not “improve” or replace owner-approved visual material without explicit instruction.
- Expect mixed, messy, uncropped, background-containing, inconsistently named, and non-production-ready assets.
- Discovery, filtering, visual inspection, selection, conversion, cropping, segmentation, background removal, masking, alpha and edge cleanup, resizing, optimization, compositing, integration, and QA are engineering work. Do not return them to the owner merely because they are inconvenient.
- If a competent technical team could solve a problem through more work, do the work.

## Hard owner constraint: no AI image generation

> AI may analyze images. AI may not generate images.

- Allowed: visual analysis/search, recognition, localization, segmentation or mask estimation, conventional or AI-assisted background removal, deterministic pixel processing, crop/resize/rotation/geometric transforms, alpha and edge cleanup, color correction, compositing, Canvas/CSS/WebGL rendering, and animation of supplied visual information.
- Prohibited: text-to-image, generative image-to-image synthesis, generative fill/inpainting/outpainting, diffusion synthesis, generated backgrounds or penguins, reconstruction of missing character parts, and generation of poses, expressions, hats, body parts, or views absent from supplied sources.
- Judge, select, transform, composite, and animate existing pixels. Do not invent pixels. If a technique may be generative and cannot be established otherwise, do not use it.
- Do not use an image generator as a shortcut, placeholder, experiment, concept, or intermediate asset. Find a permitted engineering solution instead.

## Resources

- Sol Lite is the technical owner/orchestrator.
- Luna may handle bounded, routine, mechanically verifiable subordinate work when resource-efficient; Sol remains responsible for review and integration.
- Astra is not authorized without explicit owner approval.
- Mature existing libraries, models, and techniques are welcome when appropriate. Do not create paid commitments or unnecessary external services.
- Optimize for maximum useful product progress per unit of resource usage; use the simplest sufficient solution.
