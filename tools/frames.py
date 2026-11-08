"""Crop left/right frame ornaments from the reference PNGs, side by side, for SVG tracing."""
import os, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'mockups', 'renders')
def two(p, l, r, name, s):
    im = Image.open(os.path.join(ROOT, p)).convert('RGB')
    a, b = im.crop(l), im.crop(r)
    a = a.resize((a.width * s, a.height * s), Image.LANCZOS); b = b.resize((b.width * s, b.height * s), Image.LANCZOS)
    o = Image.new('RGB', (a.width + b.width + 10, max(a.height, b.height)), (255, 0, 255))
    o.paste(a, (0, 0)); o.paste(b, (a.width + 10, 0)); o.save(os.path.join(OUT, name)); print(name, o.size)
two(r'refs\me3\ea\1-graphics.png', (130, 100, 260, 540), (780, 100, 900, 540), 'frame-me3.png', 2)
two(r'refs\me1\ea\graphics-picture-1.png', (0, 95, 70, 540), (700, 95, 770, 540), 'frame-me1.png', 2)
two(r'refs\me2\ea\graphics-picture-1.png', (100, 470, 220, 560), (900, 470, 1020, 560), 'frame-me2.png', 4)
