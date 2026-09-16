# Website maintenance

The public GitHub repository is the authoritative development source for the
current University of Antarctica website. Follow
[`cloud-web-maintenance.md`](cloud-web-maintenance.md) for the operating model.

`tools/build-public-site.py` assembles and validates the explicit GitHub Pages
allowlist. A release is complete only after its `main` workflow succeeds and
the live Pages routes, assets, and interactions are verified in a browser.

New unpublished assets may come from the owner's local workspace, but private
archives, raw material, workbooks, OCR/review data, and provenance must never be
inferred or published.
