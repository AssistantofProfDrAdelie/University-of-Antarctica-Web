import subprocess
import tempfile
import unittest
from pathlib import Path
from shutil import which


ROOT = Path(__file__).resolve().parents[1]


class HuddleContractTest(unittest.TestCase):
    def test_javascript_syntax(self):
        node = which("node")
        if node is None:
            self.skipTest("Node.js is not on PATH")
        subprocess.run([node, "--check", "huddle.js"], cwd=ROOT, check=True)

    def test_circle_collision_and_lifecycle_contract(self):
        script = (ROOT / "huddle.js").read_text(encoding="utf-8")
        for required in (
            "collisionRadius: 21",
            "minimumGap: 2",
            "movementStep: 5",
            "firstCollision(proposed, entity.radius)",
            "findLastSafePosition",
            "assertSettledInvariant",
            "this.settledIds.delete(entity.id)",
            "['left', 'right', 'top', 'bottom']",
            "huddleReducedMotion",
        ):
            self.assertIn(required, script)

    def test_public_build_contains_huddle_runtime_only(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(
                ["python3", "tools/build-public-site.py", str(ROOT), output],
                cwd=ROOT,
                check=True,
            )
            public = Path(output)
            self.assertTrue((public / "huddle.js").is_file())
            self.assertTrue((public / "huddle.css").is_file())
            self.assertFalse((public / "tests").exists())
            self.assertFalse((public / "docs").exists())

    def test_build_refuses_repository_root_as_output(self):
        result = subprocess.run(
            ["python3", "tools/build-public-site.py", str(ROOT), str(ROOT)],
            cwd=ROOT,
            text=True,
            capture_output=True,
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must not be the repository root", result.stderr)


if __name__ == "__main__":
    unittest.main()
