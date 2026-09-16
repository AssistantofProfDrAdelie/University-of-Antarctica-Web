#!/usr/bin/env python3
"""Build the minimal, server-independent Encounter Penguin site."""

from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist"
RUNTIME_FILES = (
    Path("index.html"),
    Path("styles.css"),
    Path("app-ui.js"),
    Path("assets/professor-adelie-owner-approved.png"),
)


def main() -> None:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()

    for relative_path in RUNTIME_FILES:
        source = ROOT / relative_path
        if not source.is_file():
            raise FileNotFoundError(f"Missing production file: {relative_path}")
        destination = OUTPUT / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)

    (OUTPUT / ".nojekyll").touch()
    deployed = sorted(
        path.relative_to(OUTPUT).as_posix()
        for path in OUTPUT.rglob("*")
        if path.is_file()
    )
    print("Production artifact:")
    for path in deployed:
        print(f"  {path}")


if __name__ == "__main__":
    main()
