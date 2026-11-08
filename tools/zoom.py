"""Zoom the same region of mockup render and reference PNG, stacked (mock on top, reference below).
usage: python -I tools/zoom.py <game> <screen> x0 y0 x1 y1 [scale]
needs the render from tools/compare.py (mockups/renders/<game>-<screen>-mock.png)"""
import os, re, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game, screen = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7])
s = int(sys.argv[7]) if len(sys.argv) > 7 else 3
js = open(os.path.join(ROOT, "mockups", "mock.js"), encoding="utf-8").read()
start = js.index("DATA.%s = {" % game)
ref_name = re.compile(screen + r":\s*\{\s*file:\s*'([^']+)'").search(js, start).group(1)
ref = Image.open(os.path.join(ROOT, "refs", game, "ea", ref_name)).convert("RGB")
mock = Image.open(os.path.join(ROOT, "mockups", "renders", f"{game}-{screen}-mock.png")).convert("RGB")
a = mock.crop((x0, y0, x1, y1)).resize(((x1 - x0) * s, (y1 - y0) * s), Image.LANCZOS)
b = ref.crop((x0, y0, x1, y1)).resize(((x1 - x0) * s, (y1 - y0) * s), Image.LANCZOS)
out = Image.new("RGB", (a.width, a.height * 2 + 6), (255, 0, 255))
out.paste(a, (0, 0)); out.paste(b, (0, a.height + 6))
p = os.path.join(ROOT, "mockups", "renders", f"zoom-{game}-{screen}.png")
out.save(p); print(p)
