# University of Antarctica

The University of Antarctica is the parent product and long-term source of
truth. Its public experiences include:

- Student Directory at the site root
- Aurora Art Gallery at `aurora/`
- Encounter Penguin at `experiences/encounter-penguin/`

The public site is assembled by `tools/build-public-site.py` from an explicit
allowlist and deployed by GitHub Actions to GitHub Pages. Encounter Penguin is
fully browser-only: uploaded photographs stay on the visitor's device.

The standalone `find_a_penguin` repository remains an intact migration source.
Its public product snapshot and Git provenance were imported into this project;
the private Professor Adelie source library was not imported.
