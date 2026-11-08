"""Footer-button displacement per ME3 screen: bbox of bright button pixels in reference vs mockup render."""
import os, re, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
game = sys.argv[1]; box = tuple(map(int, sys.argv[2:6]))
js = open(os.path.join(ROOT, 'mockups', 'mock.js'), encoding='utf-8').read(); st = js.index('DATA.%s = {' % game)
def bbox(im):
    c = im.crop(box); xs = []; ys = []
    for y in range(c.height):
        for x in range(c.width):
            r, g, b = c.getpixel((x, y))
            if g > 90 and b > 110 and r < 60: xs.append(x); ys.append(y)
    return (min(xs) + box[0], min(ys) + box[1], max(xs) + box[0], max(ys) + box[1]) if xs else None
for scr in ('graphics', 'calibration', 'sound', 'controls', 'keys', 'gameplay'):
    n = re.compile(scr + r":\s*\{\s*file:\s*'([^']+)'").search(js, st).group(1)
    ref = Image.open(os.path.join(ROOT, 'refs', game, 'ea', n)).convert('RGB')
    mk = Image.open(os.path.join(ROOT, 'mockups', 'renders', f'{game}-{scr}-mock.png')).convert('RGB')
    print(scr, 'ref', bbox(ref), 'mock', bbox(mk))
