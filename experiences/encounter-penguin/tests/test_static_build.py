import unittest
from pathlib import Path

from scripts.build_static import OUTPUT, main as build_static


class StaticBuildTest(unittest.TestCase):
    def test_build_contains_only_runtime_files(self):
        build_static()
        files = {
            path.relative_to(OUTPUT).as_posix()
            for path in OUTPUT.rglob("*")
            if path.is_file()
        }
        self.assertEqual(
            files,
            {
                ".nojekyll",
                "index.html",
                "styles.css",
                "app-ui.js",
                "assets/professor-adelie-owner-approved.png",
            },
        )
        self.assertFalse((OUTPUT / "app.py").exists())
        self.assertFalse((OUTPUT / "assets/source").exists())
        self.assertFalse(any(OUTPUT.rglob("*.HEIC")))


if __name__ == "__main__":
    unittest.main()
