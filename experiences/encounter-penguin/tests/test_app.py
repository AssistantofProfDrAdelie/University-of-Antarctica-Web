import http.client
import hashlib
import struct
import threading
import unittest
from pathlib import Path

from app import make_server


class AppServerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = make_server(port=0)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.server.server_address[1]

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def fetch(self, path):
        connection = http.client.HTTPConnection("127.0.0.1", self.port)
        connection.request("GET", path)
        response = connection.getresponse()
        body = response.read()
        connection.close()
        return response, body

    def test_home_serves_encounter_product(self):
        response, body = self.fetch("/")
        self.assertEqual(response.status, 200)
        self.assertIn(b"Encounter a Penguin", body)
        self.assertNotIn(b"Find a Penguin", body)
        self.assertEqual(response.getheader("Cache-Control"), "no-store")
        self.assertIn(b'href="./"', body)

    def test_owner_approved_professor_asset_is_preserved_without_raw_source(self):
        approved = Path("assets/professor-adelie-owner-approved.png")
        self.assertTrue(approved.is_file())
        contents = approved.read_bytes()
        self.assertTrue(contents.startswith(b"\x89PNG\r\n\x1a\n"))
        self.assertEqual(struct.unpack(">II", contents[16:24]), (1980, 3520))
        self.assertEqual(
            hashlib.sha256(contents).hexdigest(),
            "f566348a640dc2b735b962ffb3e950914e559f89e214fa8f395f40834a9ebafd",
        )
        self.assertFalse(Path("assets/source").exists())
        self.assertFalse(Path("assets/professor-adelie-transparent.png").exists())

    def test_ui_contains_complete_encounter_loop(self):
        markup = Path("index.html").read_text()
        script = Path("app-ui.js").read_text()
        self.assertIn("Encounter a Penguin", markup)
        self.assertIn("Professor Adelie is nearby.", markup)
        self.assertIn('src="assets/prof-adelie-icon.png"', markup)
        self.assertNotIn('<span class="brand-mark"', markup)
        self.assertIn('class="university-link" href="../../"', markup)
        self.assertIn('aria-label="Back to University of Antarctica"', markup)
        self.assertNotIn("An ordinary photograph", markup)
        self.assertIn('>Save <span', markup)
        self.assertNotIn("Save this encounter", markup)
        self.assertNotIn("Professor Adelie is visiting", script)
        self.assertNotIn("Professor Adelie is leaving", script)
        self.assertNotIn("encounterButton", markup + script)
        self.assertIn("scheduleFirstEncounter", script)
        self.assertIn("scheduleReturn", script)
        self.assertIn("chooseAbsence", script)
        self.assertIn("toBlob", script)
        self.assertIn("encounterVocabulary", script)
        self.assertIn("regions:[", script)
        self.assertIn("{weight:55,center:0,spread:72}", script)
        self.assertIn("Math.min(rawDifference,360-rawDifference)", script)
        self.assertIn("difference>=70", script)
        self.assertIn("drawWidth*cosine+drawHeight*sine", script)
        self.assertIn("boundaryDistance=Math.min(xDistance,yDistance)", script)
        self.assertIn("angle*Math.PI/180", script)
        self.assertIn("cutEdgesOutside", script)
        self.assertIn("safeVisibleOffset", script)
        self.assertNotIn("createLinearGradient", script)
        self.assertNotIn('globalCompositeOperation="destination-in"', script)
        self.assertIn("absenceModel={minimum:1000,maximum:1800}", script)
        self.assertIn("humanScaleVariation=(Math.random()+Math.random())/2", script)
        self.assertIn("previousAngle=angle", script)
        self.assertIn("entryAngle", script)
        self.assertIn("document.hidden", script)
        self.assertIn("generation!==encounterGeneration", script)
        self.assertIn("!saveWindowOpen", script)
        self.assertIn("professor-adelie-owner-approved.png", script)
        self.assertIn("choreographyVocabulary", script)
        self.assertIn('{id:"classic",weight:66', script)
        self.assertIn('{id:"head-peek",weight:12', script)
        self.assertIn('{id:"double-take",weight:5', script)
        self.assertIn('{id:"two-heads",weight:1.5', script)
        self.assertIn('{id:"mirror-heads",weight:.5', script)
        self.assertIn("encounterMotion", script)
        self.assertIn('choreography.exit==="fade"', script)
        self.assertIn('choreography.exit==="slip"', script)
        self.assertIn("visitor.dataset.choreography", script)
        self.assertIn('imageSmoothingQuality="high"', script)
        self.assertIn("photoFrame.style.maxWidth", script)
        self.assertNotIn("professor-adelie-transparent.png", script)
        self.assertNotIn("professor-adelie-transparent.svg", script)
        self.assertIn('download hidden', markup)
        self.assertNotIn("Penguinness", markup + script)
        self.assertNotIn("Give me a hint", markup + script)

    def test_javascript_and_asset_have_correct_content_types(self):
        js_response, _ = self.fetch("/app-ui.js")
        png_response, png = self.fetch("/assets/professor-adelie-owner-approved.png")
        icon_response, icon = self.fetch("/assets/prof-adelie-icon.png")
        self.assertIn("javascript", js_response.getheader("Content-Type"))
        self.assertIn("png", png_response.getheader("Content-Type"))
        self.assertTrue(png.startswith(b"\x89PNG\r\n\x1a\n"))
        self.assertIn("png", icon_response.getheader("Content-Type"))
        self.assertTrue(icon.startswith(b"\x89PNG\r\n\x1a\n"))

    def test_missing_file_is_404(self):
        response, _ = self.fetch("/not-here")
        self.assertEqual(response.status, 404)

    def test_cloud_deployment_workflow_is_main_driven(self):
        repository_root = Path(__file__).resolve().parents[3]
        workflow = (repository_root / ".github/workflows/pages.yml").read_text()
        self.assertIn("branches: [main]", workflow)
        self.assertIn("working-directory: experiences/encounter-penguin", workflow)
        self.assertIn("python3 -m unittest discover -s tests -v", workflow)
        self.assertIn('python3 tools/build-public-site.py "$GITHUB_WORKSPACE" "$RUNNER_TEMP/public-site"', workflow)
        self.assertIn("actions/upload-pages-artifact@v4", workflow)
        self.assertIn("actions/deploy-pages@v4", workflow)
        self.assertIn("path: ${{ runner.temp }}/public-site", workflow)


if __name__ == "__main__":
    unittest.main()
