#!/usr/bin/env python3
"""Build and validate the allowlisted static artifact used by GitHub Pages."""
import json
import shutil
import sys
from pathlib import Path


STATIC_FILES = (
    "index.html",
    "styles.css",
    "directory-batches.css",
    "app.js",
    "huddle.css",
    "huddle.js",
    "南极大学校徽2.png",
    "南极大学校徽2.jpg",
    "南极大学校徽.jpg",
    "南极大学校训.png",
    "阿德利教授.JPG",
    "阿德利教授小红书.jpg",
    "一袋企鹅二维码.jpg",
)
ENCOUNTER_PENGUIN_FILES = (
    "index.html",
    "styles.css",
    "app-ui.js",
    "assets/prof-adelie-icon.png",
    "assets/professor-adelie-owner-approved.png",
)
CURATED_AURORA_ARTISTS = (
    "Amon.png",
    "鸟好鸟坏.PNG",
    "骷髅柴人.PNG",
    "skny.PNG",
    "第六封信.PNG",
    "柏贤也.PNG",
    "叶无殊.PNG",
    "卡波鼠博士.PNG",
    "Mariella.png",
    "燃海.PNG",
    "Hyggelgloo.PNG",
    "萝卜萝卜马.PNG",
    "晚风.PNG",
    "7%溶剂.jpeg",
    "幽灵.jpeg",
    "小琉.jpeg",
    "团子.jpeg",
    "魅力棕熊姨.jpeg",
    "未来小道士.jpeg",
    "ICEBEBE艾斯比比.jpeg",
    "睡觉闪闪.png",
)
CURATED_AURORA_CURATOR = "帝加索.JPG"
PUBLIC_RECORD_COUNT = 276
PUBLIC_BATCH_COUNT = 21


def fail(message: str) -> None:
    raise SystemExit(f"public build failed: {message}")


def validate_public_tree(output: Path, public_students: list[dict]) -> None:
    if not (output / "index.html").is_file():
        fail("index.html is not at the artifact root")
    for name in STATIC_FILES[1:]:
        if not (output / name).is_file():
            fail(f"missing required web asset: {name}")
    if len(public_students) != PUBLIC_RECORD_COUNT:
        fail(f"expected {PUBLIC_RECORD_COUNT} public records, got {len(public_students)}")
    batches = {(s["admission_year"], s["admission_batch"]) for s in public_students}
    if len(batches) != PUBLIC_BATCH_COUNT:
        fail(f"expected {PUBLIC_BATCH_COUNT} batches, got {len(batches)}")
    paths = [s["source"]["path"] for s in public_students]
    if len(paths) != len(set(paths)):
        fail("duplicate certificate publication paths")
    for relative in paths:
        asset = output / relative
        if not asset.is_file():
            fail(f"missing certificate asset: {relative}")
        if asset.suffix.lower() != ".png":
            fail(f"certificate is not a PNG: {relative}")
    aurora_data_path = output / "data/aurora-artists.json"
    if not aurora_data_path.is_file():
        fail("missing Aurora artist data")
    aurora_artists = json.loads(aurora_data_path.read_text(encoding="utf-8"))
    if len(aurora_artists) != len(CURATED_AURORA_ARTISTS):
        fail(f"expected {len(CURATED_AURORA_ARTISTS)} Aurora artists, got {len(aurora_artists)}")
    if [item["certificate_path"] for item in aurora_artists] != [f"极光艺术家/极光艺术家-{name}" for name in CURATED_AURORA_ARTISTS]:
        fail("Aurora artist order or paths are not the explicit curated order")
    for item in aurora_artists:
        if not (output / item["certificate_path"]).is_file():
            fail(f"missing Aurora certificate asset: {item['certificate_path']}")
    if not (output / f"极光艺术家/{CURATED_AURORA_CURATOR}").is_file():
        fail("missing Aurora curator asset")
    encounter_root = output / "experiences/encounter-penguin"
    for name in ENCOUNTER_PENGUIN_FILES:
        if not (encounter_root / name).is_file():
            fail(f"missing Encounter Penguin runtime asset: {name}")
    forbidden_extensions = {".xlsx", ".zip", ".pyc"}
    for path in output.rglob("*"):
        if path.is_file() and path.suffix.lower() in forbidden_extensions:
            fail(f"forbidden file in public artifact: {path.relative_to(output)}")
        if path.name in {"archive", "review", "__pycache__"}:
            fail(f"forbidden directory in public artifact: {path.relative_to(output)}")


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: build-public-site.py REPOSITORY_ROOT OUTPUT_DIR")
    root = Path(sys.argv[1]).resolve()
    output = Path(sys.argv[2]).resolve()
    if output == root:
        fail("output directory must not be the repository root")
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)

    for name in STATIC_FILES:
        source = root / name
        if not source.is_file():
            fail(f"missing source web asset: {name}")
        shutil.copy2(source, output / name)

    data_dir = output / "data"
    data_dir.mkdir()
    aurora_dir = output / "aurora"
    aurora_dir.mkdir()
    for name in ("index.html",):
        shutil.copy2(root / "aurora" / name, aurora_dir / name)
    shutil.copy2(root / "aurora.js", output / "aurora.js")
    shutil.copy2(root / "aurora.css", output / "aurora.css")

    encounter_source = root / "experiences/encounter-penguin"
    encounter_output = output / "experiences/encounter-penguin"
    for name in ENCOUNTER_PENGUIN_FILES:
        source = encounter_source / name
        if not source.is_file():
            fail(f"missing Encounter Penguin source asset: {name}")
        destination = encounter_output / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    aurora_assets = output / "极光艺术家"
    aurora_assets.mkdir(parents=True)
    aurora_data = []
    for name in CURATED_AURORA_ARTISTS:
        source = root / "极光艺术家" / f"极光艺术家-{name}"
        if not source.is_file():
            fail(f"missing curated Aurora artist source: {source}")
        destination_name = source.name
        shutil.copy2(source, aurora_assets / destination_name)
        aurora_data.append({
            "artist_name": name.rsplit(".", 1)[0],
            "certificate_path": f"极光艺术家/{destination_name}",
        })
    curator_source = root / "极光艺术家" / CURATED_AURORA_CURATOR
    if not curator_source.is_file():
        fail(f"missing curated Aurora curator source: {curator_source}")
    shutil.copy2(curator_source, aurora_assets / CURATED_AURORA_CURATOR)
    (data_dir / "aurora-artists.json").write_text(
        json.dumps(aurora_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    source_data = root / "data/students.json"
    if not source_data.is_file():
        fail("missing source data/students.json")
    students = json.loads(source_data.read_text(encoding="utf-8"))
    public_students = []
    for student in students:
        source = student["source"]
        source_path = Path(source["path"])
        if not source_path.is_file() or source_path.parts[0] == "archive":
            fail(f"invalid active certificate path: {source_path}")
        public_students.append({
            "name_cn": student.get("name_cn"),
            "name_en": student.get("name_en"),
            "major_cn": student.get("major_cn"),
            "major_en": student.get("major_en"),
            "admission_year": student.get("admission_year"),
            "admission_batch": student.get("admission_batch"),
            "admission_date": student.get("admission_date"),
            "original_order": student.get("original_order"),
            "source": {"filename": source["filename"], "path": source["path"]},
        })

    (data_dir / "students.json").write_text(
        json.dumps(public_students, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    for student in public_students:
        source = Path(student["source"]["path"])
        destination = output / source
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / source, destination)

    validate_public_tree(output, public_students)


if __name__ == "__main__":
    main()
