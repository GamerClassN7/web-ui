"""Render a mockup screen headless and build [mockup | reference | diff] for visual comparison.

usage:  python -I tools/compare.py me3 graphics [outdir]
needs:  local server  python -m http.server 8765 --bind 127.0.0.1 --directory <project root>
"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageChops

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game, screen = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(ROOT, "mockups", "renders")
out = os.path.abspath(out)
os.makedirs(out, exist_ok=True)

# reference file name for this screen
import re
js = open(os.path.join(ROOT, "mockups", "mock.js"), encoding="utf-8").read()
start = js.index("DATA.%s = {" % game)
m = re.compile(screen + r":\s*\{\s*file:\s*'([^']+)'").search(js, start)
ref_name = m.group(1)
ref_dir = os.path.join(ROOT, "refs", game, "ea")
ref_path = os.path.join(ref_dir, ref_name)
if not os.path.exists(ref_path):  # ME1/ME2 files are named differently (e.g. graphics-picture-1.png)
    base = ref_name.split("-", 1)[1].replace(".png", "")           # graphics / key-bindings ...
    cands = [f for f in os.listdir(ref_dir) if f.startswith(base)]
    ref_path = os.path.join(ref_dir, cands[0])
ref = Image.open(ref_path).convert("RGB")
W, H = ref.size

shot = os.path.join(out, f"{game}-{screen}-mock.png")
url = f"http://127.0.0.1:8765/mockups/{game}.html?screen={screen}&mode=mock&bare=1&theme={os.environ.get('ME_THEME','dark')}"
DPR = 2.5
import shutil
from PIL import ImageStat
mock = None
for attempt in range(4):
    prof = tempfile.mkdtemp(prefix="me-compare-")   # fresh profile each run: no stale cached css/js
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--force-device-scale-factor={DPR}",
                    f"--user-data-dir={prof}", f"--window-size={W},{H}", "--virtual-time-budget=15000",
                    f"--screenshot={shot}", url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
    shutil.rmtree(prof, ignore_errors=True)
    big = Image.open(shot).convert("RGB")
    mock = big.crop((0, 0, round(W * DPR), round(H * DPR))).resize((W, H), Image.LANCZOS)
    if sum(ImageStat.Stat(mock).mean) > 15:   # not a blank capture
        break
mock.save(shot)                                                      # keep *-mock.png at reference size for the other tools

diff = ImageChops.difference(mock, ref)
diff = diff.point(lambda v: min(255, v * 3))                       # amplify
sheet = Image.new("RGB", (W, H * 3 + 8), (30, 30, 30))
sheet.paste(mock, (0, 0)); sheet.paste(ref, (0, H + 4)); sheet.paste(diff, (0, 2 * H + 8))
p = os.path.join(out, f"{game}-{screen}-compare.png")
sheet.save(p)
# mean absolute difference as a rough score
px = list(ImageChops.difference(mock, ref).convert("L").getdata())
print(p, "mean-diff=%.2f" % (sum(px) / len(px)))
