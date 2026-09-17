# University of Antarctica

The University of Antarctica is the parent product and long-term source of
truth. Its public experiences include:

- Student Directory at the site root
- Aurora Art Gallery at `aurora/`
- Encounter Penguin at `experiences/encounter-penguin/`

The public site is assembled by `tools/build-public-site.py` from an explicit
allowlist and deployed by GitHub Actions to GitHub Pages. Encounter Penguin is
fully browser-only: uploaded photographs stay on the visitor's device.

Encounter Penguin is developed, tested, built, and deployed only from this
repository. The former standalone `find_a_penguin` repository is historical
migration provenance, not an active development or deployment source. There is
no synchronization path between the repositories.
