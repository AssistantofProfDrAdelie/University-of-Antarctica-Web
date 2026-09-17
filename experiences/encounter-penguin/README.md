# Encounter a Penguin

An ordinary photograph. A brief visit from Professor Adelie.

## University of Antarctica integration

Encounter Penguin now lives inside the University of Antarctica parent product
at `experiences/encounter-penguin/`. The parent repository's allowlisted build
and GitHub Pages workflow publish this experience.

This directory is the sole active source of truth. The former standalone
`find_a_penguin` repository is retained only as historical migration
provenance; do not develop, deploy, or synchronize from it.

The application remains browser-only: it needs no server, secrets, database, or
access to the owner's computer or raw asset archive.

## Local development

Requires Python 3.10 or newer.

```bash
python3 app.py
```

Open <http://127.0.0.1:8000> and choose a photograph.

After a quiet pause, Professor Adelie peeks in from an edge, stays briefly with a save option, then retreats. The photograph is never uploaded or modified.

## Character asset

The public product includes only the owner-approved Professor Adelie cutout
at `assets/professor-adelie-owner-approved.png`. The supplied PNG is preserved
unchanged; the browser uses its transparent bounds for placement. Raw photographs
and the broader source archive remain private and are not required by the
production build.

## Test it

```bash
python3 -m unittest discover -s tests -v
python3 scripts/build_static.py
```

The production artifact is written to `dist/`. Only `index.html`, `styles.css`,
`app-ui.js`, `.nojekyll`, and the owner-approved runtime PNG are included.
