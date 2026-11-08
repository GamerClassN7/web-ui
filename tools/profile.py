"""Print a pixel profile (vertical or horizontal line) of mock vs reference side by side.
usage: python -I tools/profile.py <game> <screen> v|h <fixed> <from> <to>
  v: column x=<fixed>, y from..to    h: row y=<fixed>, x from..to"""
import os, re, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game, screen, mode, fixed, a, b = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
js = open(os.path.join(ROOT, 'mockups', 'mock.js'), encoding='utf-8').read()
start = js.index('DATA.%s = {' % game)
ref_name = re.compile(screen + r":\s*\{\s*file:\s*'([^']+)'").search(js, start).group(1)
ref = Image.open(os.path.join(ROOT, 'refs', game, 'ea', ref_name)).convert('RGB')
mock = Image.open(os.path.join(ROOT, 'mockups', 'renders', f'{game}-{screen}-mock.png')).convert('RGB').crop((0, 0) + ref.size)
hx = lambda c: '#%02x%02x%02x' % c
print('pos   mock      ref')
for i in range(a, b + 1):
    xy = (fixed, i) if mode == 'v' else (i, fixed)
    m, r = mock.getpixel(xy), ref.getpixel(xy)
    print(f'{i:4d}  {hx(m)}  {hx(r)}   {"*" if sum(abs(m[k]-r[k]) for k in range(3)) > 45 else ""}')
