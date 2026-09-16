import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def relative_luminance(hex_color):
    channels = [int(hex_color[index : index + 2], 16) / 255 for index in (1, 3, 5)]
    linear = [
        channel / 12.92
        if channel <= 0.04045
        else ((channel + 0.055) / 1.055) ** 2.4
        for channel in channels
    ]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def contrast_ratio(first, second):
    light, dark = sorted(
        (relative_luminance(first), relative_luminance(second)), reverse=True
    )
    return (light + 0.05) / (dark + 0.05)


class PaletteContrastTest(unittest.TestCase):
    def test_primary_palette_text_colors_meet_wcag_aa(self):
        stylesheet = (ROOT / "styles.css").read_text(encoding="utf-8")
        variables = dict(
            re.findall(r"--(navy|accent|ink|paper|surface|muted):(#[0-9a-f]{6})", stylesheet)
        )

        for foreground in ("navy", "accent", "ink", "muted"):
            for background in ("paper", "surface"):
                with self.subTest(foreground=foreground, background=background):
                    self.assertGreaterEqual(
                        contrast_ratio(variables[foreground], variables[background]),
                        4.5,
                    )

    def test_white_text_on_interactive_colors_meets_wcag_aa(self):
        for background in ("#123b59", "#087985", "#075d70"):
            with self.subTest(background=background):
                self.assertGreaterEqual(contrast_ratio("#ffffff", background), 4.5)


if __name__ == "__main__":
    unittest.main()
