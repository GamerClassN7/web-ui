"""Element-by-element comparison: cut named regions out of the mockup render and the reference PNG,
stack them (mock on top, reference below, amplified diff third) and print a per-element score.

usage:  python -I tools/elements.py <game> <screen> [scale]
needs the render produced by tools/compare.py  (mockups/renders/<game>-<screen>-mock.png)
output: mockups/renders/elements-<game>-<screen>.png  + scores on stdout (mean abs diff, 0-255, lower = closer)
"""
import os, re, sys
from PIL import Image, ImageChops, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game, screen = sys.argv[1], sys.argv[2]
S = int(sys.argv[3]) if len(sys.argv) > 3 else 3

# (name, (x0, y0, x1, y1)) in the 1023-px reference coordinate system
R = {
  ('me3', 'graphics'): [
    ('title', (146, 110, 300, 152)), ('selected row', (146, 183, 840, 212)), ('picker windowed', (420, 212, 700, 235)),
    ('picker monitor', (420, 237, 700, 260)), ('on/off x3', (420, 260, 700, 330)), ('disabled row', (146, 334, 700, 358)),
    ('scrollbar', (845, 184, 872, 410)), ('desc box', (146, 415, 870, 525)), ('footer', (610, 490, 870, 525)),
    ('frame top right', (470, 105, 872, 200))],
  ('me3', 'sound'): [('sliders', (140, 184, 760, 262)), ('desc box', (146, 415, 870, 525))],
  ('me3', 'controls'): [('rows', (140, 184, 760, 345))],
  ('me3', 'keys'): [('scrollbar', (855, 188, 885, 330)), ('header bar', (140, 188, 880, 214)), ('key rows', (140, 214, 880, 300))],
  ('me3', 'gameplay'): [('rows', (140, 184, 760, 380))],
  ('me3', 'calibration'): [('rows', (140, 184, 760, 290)), ('n7 box', (425, 278, 700, 418))],
  ('me1', 'graphics'): [
    ('title', (160, 70, 300, 102)), ('header panel', (5, 100, 760, 180)), ('selected row', (5, 180, 760, 209)), ('pickers', (470, 210, 700, 255)),
    ('on boxes', (580, 256, 700, 322)), ('labels', (160, 256, 480, 330)), ('desc box', (5, 410, 760, 530)), ('Default btn', (175, 540, 345, 575)), ('back tab', (775, 540, 850, 575))],
  ('me1', 'sound'): [('sliders', (150, 182, 720, 252)), ('desc box', (5, 410, 760, 530))],
  ('me1', 'controls'): [('rows', (150, 180, 720, 335))],
  ('me1', 'keys'): [('scrollbar', (752, 188, 785, 400)), ('col headers', (150, 188, 760, 207)), ('General bar', (5, 207, 760, 230)), ('key rows', (150, 230, 760, 375))],
  ('me1', 'gameplay'): [('rows', (140, 176, 720, 385))],
  ('me1', 'calibration'): [('rows', (150, 176, 720, 275)), ('n7 box', (420, 282, 725, 405))],
  ('me2', 'graphics'): [
    ('title', (118, 105, 300, 170)), ('selected row', (118, 198, 988, 226)), ('picker windowed', (440, 228, 800, 252)),
    ('picker monitor', (440, 254, 800, 278)), ('on/off x3', (440, 278, 800, 352)), ('disabled row', (118, 357, 640, 380)),
    ('desc box', (116, 480, 990, 552)), ('footer', (368, 576, 556, 612)), ('back icon', (895, 578, 975, 612))],
  ('me2', 'sound'): [('sliders', (118, 195, 800, 275))],
  ('me2', 'controls'): [('rows', (118, 200, 800, 355))],
  ('me2', 'keys'): [('scrollbar', (985, 195, 1020, 340)), ('col titles', (480, 170, 900, 195)), ('header bar', (118, 196, 1000, 228)), ('key rows', (118, 228, 1000, 330))],
  ('me2', 'gameplay'): [('rows', (30, 200, 760, 335))],
  ('me2', 'calibration'): [('rows', (118, 198, 800, 300)), ('n7 box', (395, 395, 705, 560)), ('desc box', (116, 325, 990, 398))],
}

js = open(os.path.join(ROOT, 'mockups', 'mock.js'), encoding='utf-8').read()
start = js.index('DATA.%s = {' % game)
ref_name = re.compile(screen + r":\s*\{\s*file:\s*'([^']+)'").search(js, start).group(1)
ref = Image.open(os.path.join(ROOT, 'refs', game, 'ea', ref_name)).convert('RGB')
mock = Image.open(os.path.join(ROOT, 'mockups', 'renders', f'{game}-{screen}-mock.png')).convert('RGB').crop((0, 0) + ref.size)

def mad(a, b):
    px = list(ImageChops.difference(a, b).convert('L').getdata())
    return sum(px) / len(px)

def best_shift(box, rng=8):
    """How far is the mockup content displaced from the reference? (dx,dy): mock cropped at +(dx,dy) matches best."""
    x0, y0, x1, y1 = box
    b = ref.crop(box).convert('L')
    best = (999, 0, 0)
    for dy in range(-rng, rng + 1):
        for dx in range(-rng, rng + 1):
            a = mock.crop((x0 + dx, y0 + dy, x1 + dx, y1 + dy)).convert('L')
            s = mad(a, b)
            if s < best[0]: best = (s, dx, dy)
    return best

tiles, scores, shifts = [], [], []
for name, (x0, y0, x1, y1) in R[(game, screen)]:
    a, b = mock.crop((x0, y0, x1, y1)), ref.crop((x0, y0, x1, y1))
    d = ImageChops.difference(a, b)
    px = list(d.convert('L').getdata()); sc = sum(px) / len(px)
    scores.append((name, sc))
    bs = best_shift((x0, y0, x1, y1), 7)
    shifts.append((name, bs))
    w, h = (x1 - x0) * S, (y1 - y0) * S
    t = Image.new('RGB', (w, h * 3 + 20), (255, 0, 255))
    t.paste(a.resize((w, h), Image.LANCZOS), (0, 0))
    t.paste(b.resize((w, h), Image.LANCZOS), (0, h + 10))
    t.paste(d.point(lambda v: min(255, v * 3)).resize((w, h), Image.NEAREST), (0, 2 * h + 20))
    dr = ImageDraw.Draw(t); dr.text((4, 4), f'{name}  diff={sc:.1f}', fill=(255, 255, 0))
    tiles.append(t)

W = max(t.width for t in tiles); H = sum(t.height + 14 for t in tiles)
sheet = Image.new('RGB', (W, H), (40, 40, 40)); y = 0
for t in tiles:
    sheet.paste(t, (0, y)); y += t.height + 14
out = os.path.join(ROOT, 'mockups', 'renders', f'elements-{game}-{screen}.png')
sheet.save(out)
print(out)
sh = dict(shifts)
for n, s in sorted(scores, key=lambda x: -x[1]):
    b = sh[n]
    print(f'  {s:6.1f}  {n:18s} best-aligned {b[0]:5.1f} when mock content is displaced by dx={b[1]:+d} dy={b[2]:+d}px')
