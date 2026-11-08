"""Compare colours at identical coordinates in mock render vs reference PNG.
usage: python -I tools/colorcmp.py <game> <screen>      (needs a render from tools/compare.py)
Prints mock / reference / delta for named probes; box probes use the brightest 3 % (text colour)."""
import os, re, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game, screen = sys.argv[1], sys.argv[2]
js = open(os.path.join(ROOT, 'mockups', 'mock.js'), encoding='utf-8').read()
start = js.index('DATA.%s = {' % game)
ref_name = re.compile(screen + r":\s*\{\s*file:\s*'([^']+)'").search(js, start).group(1)
ref = Image.open(os.path.join(ROOT, 'refs', game, 'ea', ref_name)).convert('RGB')
mock = Image.open(os.path.join(ROOT, 'mockups', 'renders', f'{game}-{screen}-mock.png')).convert('RGB').crop((0, 0) + ref.size)

P = {
 ('me3', 'graphics'): {
  'pt': [('sel row fill L', 300, 198), ('sel row top line', 300, 187), ('sel row bottom line', 300, 208), ('picker fill', 480, 223), ('picker border top', 560, 213),
         ('picker border left', 447, 223), ('arrow L active', 433, 222), ('arrow R dim', 686, 222), ('On fill top', 470, 265), ('On fill bottom', 470, 280),
         ('On border top', 490, 262), ('Off border left', 580, 272), ('Off fill', 600, 272), ('footer fill 1', 650, 501), ('footer fill 2', 760, 507),
         ('desc top', 300, 427), ('desc mid', 300, 440), ('desc low', 300, 465), ('scroll pill', 857, 212), ('frame line top', 700, 111), ('drop btn', 655, 200)],
  'box': [('label normal', 154, 215, 260, 230), ('sel label', 154, 190, 220, 206), ('picker text', 520, 216, 600, 230), ('On text', 480, 265, 505, 280),
          ('Off text', 612, 265, 640, 280), ('desc text', 168, 428, 424, 442), ('footer text', 645, 501, 730, 514), ('title', 150, 118, 238, 134)]},
 ('me3', 'sound'): {
  'pt': [('track inner', 550, 198), ('track border top', 550, 187), ('thumb', 663, 198), ('sel track fill', 550, 247), ('sel track border', 550, 237), ('sel thumb', 662, 247),
         ('arrow L blue', 433, 198), ('arrow R dim', 684, 198), ('sel arrow L', 433, 247), ('sel arrow R', 684, 247)],
  'box': [('pct', 705, 191, 741, 206), ('sel pct', 705, 240, 741, 254), ('label', 155, 191, 245, 206)]},
 ('me2', 'graphics'): {
  'pt': [('sel bar fill L', 300, 213), ('sel bar top', 500, 203), ('sel bar bottom', 500, 222), ('green box fill', 560, 213), ('green box border', 517, 213), ('green drop', 714, 213),
         ('orange box fill', 560, 264), ('orange box border', 517, 264), ('orange drop', 714, 264), ('On fill', 520, 291), ('On frame', 498, 291), ('Off frame', 646, 291),
         ('Off fill', 670, 291), ('arrow L', 470, 239), ('arrow R', 772, 291), ('desc fill', 500, 515), ('desc border top', 500, 487), ('footer fill', 460, 593), ('footer border', 378, 593)],
  'box': [('label normal', 134, 232, 238, 246), ('sel label', 134, 206, 198, 219), ('Windowed value', 580, 230, 666, 248), ('On text', 555, 284, 575, 298),
          ('desc text', 140, 508, 290, 524), ('footer text', 418, 587, 508, 600), ('title', 122, 114, 277, 142)]},
 ('me2', 'sound'): {
  'pt': [('bar peach', 620, 209), ('bar top', 620, 204), ('bar bottom', 620, 215), ('end cap', 758, 209), ('arrow', 466, 209), ('sel bar', 620, 260), ('sel cap', 758, 260), ('sel arrow', 466, 260)],
  'box': [('pct', 806, 203, 839, 216), ('sel pct', 806, 254, 839, 267), ('label', 134, 203, 225, 216)]},
}

def hx(c): return '#%02x%02x%02x' % c
def pt(x, y, r=1):
    px = [im.getpixel((xx, yy)) for xx in range(x - r, x + r + 1) for yy in range(y - r, y + r + 1)]
    return tuple(round(sum(p[i] for p in px) / len(px)) for i in range(3))
def box(x0, y0, x1, y1):
    px = sorted([im.getpixel((x, y)) for x in range(x0, x1) for y in range(y0, y1)], key=sum)
    k = max(1, int(len(px) * .03)); t = px[-k:]
    return tuple(round(sum(p[i] for p in t) / len(t)) for i in range(3))
def dist(a, b): return sum(abs(a[i] - b[i]) for i in range(3))

rows = []
for kind in ('pt', 'box'):
    for item in P[(game, screen)][kind]:
        name = item[0]; args = item[1:]
        im = mock; m = pt(*args) if kind == 'pt' else box(*args)
        im = ref;  r = pt(*args) if kind == 'pt' else box(*args)
        rows.append((dist(m, r), name, kind, m, r))
print(f'{"element":22s} {"mock":8s} {"ref":8s}  delta(sum |RGB|)')
for d, name, kind, m, r in sorted(rows, key=lambda x: -x[0]):
    flag = '  <<<' if d > 60 else ''
    print(f'{name:22s} {hx(m)}  {hx(r)}  {d:4d}{flag}')
