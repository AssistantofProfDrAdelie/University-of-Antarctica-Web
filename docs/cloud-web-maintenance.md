# Cloud web maintenance

`AssistantofProfDrAdelie/University-of-Antarctica-Web` is the authoritative
source for the current online presentation and behavior. GitHub Pages is the
live review target.

- Make ordinary HTML, CSS, JavaScript, public JSON, layout, responsive, and
  interaction changes directly in this repository.
- Test, commit, push `main`, wait for the existing Pages workflow, and validate
  the actual live site after every release.
- The owner's Mac is not required for ordinary work on already-published
  material. It remains a source for new, unpublished, raw, or private assets.
- If work needs an asset that is not already public, stop only that part and
  report `new source asset required`.
- Never infer, reconstruct, commit, or publish private workbooks, ZIP archives,
  OCR/review data, reconciliation files, audit material, or source images.
- `tools/build-public-site.py` is the deployment allowlist. Update it explicitly
  when a new public runtime file is intentionally introduced.
