# 校园活动 · 与鹅同行

Static album gallery at `campus/`. Preview from the repository root with
`python3 -m http.server 8765 --bind 127.0.0.1` and open `/campus/`.

`albums.json` contains ordered events with stable IDs, dates, titles, locations,
`datePending`, and photo records (`id`, `src`, `thumb`). Dates with
`datePending: true` are provisional ordering dates, not confirmed event dates.
Empty events are intentional placeholders. Photos retain the curated folder's
order. All images have a 640px thumbnail and a maximum 1800px JPEG for viewing.
Derivatives are oriented, converted to sRGB, and stripped of embedded metadata.
Original files and private local paths are not part of this section.

The public build copies only the four runtime files and JPEG paths explicitly
referenced by `albums.json`. Adding an album does not require changing the UI.
The reviewed draft contains 15 activity albums and 3 separately classified
albums, with 257 photographs. Owner classifications override embedded dates;
an export date is not automatically an event date. Pool photo IDs remain
stable even when cover ordering changes. The Xuhui album includes all four
confirmed January 5 photographs for owner selection, including solo plush photos.
Await owner review before release.
