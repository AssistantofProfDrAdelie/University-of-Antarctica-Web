import subprocess
import tempfile
import unittest
from pathlib import Path
from shutil import which


ROOT = Path(__file__).resolve().parents[1]
EXPERIENCE = ROOT / "experiences" / "dark-side-of-the-penguin"


class DarkSidePenguinContractTest(unittest.TestCase):
    def test_javascript_syntax(self):
        node = which("node")
        if node is None:
            self.skipTest("Node.js is not on PATH")
        for script in ("app.js", "vinyl-processor.js"):
            subprocess.run([node, "--check", script], cwd=EXPERIENCE, check=True)

    def test_public_build_contains_only_runtime_package(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(
                ["python3", "tools/build-public-site.py", str(ROOT), output],
                cwd=ROOT,
                check=True,
            )
            public = Path(output)
            project = public / "experiences" / "dark-side-of-the-penguin"
            for relative in (
                "index.html",
                "styles.css",
                "app.js",
                "vinyl-processor.js",
                "assets/cover.jpg",
                "assets/emperor-penguin-original-60s.mp3",
            ):
                self.assertTrue((project / relative).is_file(), relative)
            self.assertFalse((public / "local-experiments").exists())
            self.assertFalse((public / "The Great Gig In The Sky.mp3").exists())

    def test_public_page_keeps_noncommercial_recording_credit(self):
        page = (EXPERIENCE / "index.html").read_text(encoding="utf-8")
        self.assertIn("stormpetrel", page)
        self.assertIn("CC BY-NC 4.0", page)
        self.assertNotIn("original-vocal", page)

    def test_public_page_has_share_card_metadata(self):
        page = (EXPERIENCE / "index.html").read_text(encoding="utf-8")
        self.assertIn('property="og:title" content="鹅之暗面 · The Dark Side of the Penguin"', page)
        self.assertIn('property="og:image" content="https://assistantofprofdradelie.github.io/', page)
        self.assertIn('name="twitter:card" content="summary_large_image"', page)
        self.assertNotIn('name="description"', page)
        self.assertNotIn('property="og:description"', page)
        self.assertNotIn('name="twitter:description"', page)
        self.assertNotIn("noindex", page)


if __name__ == "__main__":
    unittest.main()
