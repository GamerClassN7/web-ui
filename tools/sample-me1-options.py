import sys
from PIL import Image
D = sys.argv[1]
def hx(c): return '#%02x%02x%02x' % c
def mk(im):
    def pt(n, x, y, r=1):
        px = [im.getpixel((xx, yy))[:3] for xx in range(x - r, x + r + 1) for yy in range(y - r, y + r + 1)]
        c = tuple(round(sum(p[i] for p in px) / len(px)) for i in range(3)); print(f'{n:30s} ({x},{y}) {hx(c)}')
    def box(n, x0, y0, x1, y1, top=0.03):
        px = [im.getpixel((x, y))[:3] for x in range(x0, x1) for y in range(y0, y1)]
        px.sort(key=lambda p: sum(p)); k = max(1, int(len(px) * top)); t = px[-k:]
        c = tuple(round(sum(p[i] for p in t) / len(t)) for i in range(3)); med = px[len(px) // 2]
        print(f'{n:30s} text {hx(c)}  bg {hx(med)}')
    return pt, box
pt, box = mk(Image.open(D + '/graphics-picture-1.png').convert('RGBA'))
print('=== ME1 graphics')
print('-- background')
for n, x, y in [('letterbox top', 500, 12), ('bg upper', 500, 60), ('bg mid', 500, 300), ('bg low', 500, 520), ('bg glow 1', 500, 560), ('bg glow 2', 500, 600), ('bg bottom', 500, 632), ('bg right haze', 900, 300)]: pt(n, x, y, 3)
print('-- title / header panel')
box('Options title', 170, 80, 268, 98); box('subtitle', 172, 113, 238, 126)
for n, x, y in [('hdr panel fill top', 400, 125), ('hdr panel fill bottom', 400, 160), ('hdr panel border top', 400, 105), ('hdr panel border left', 10, 130)]: pt(n, x, y, 0 if 'border' in n else 1)
print('-- selected row (orange)')
for n, x, y in [('sel fill L', 300, 194), ('sel fill R', 700, 194), ('sel fill top', 400, 186), ('sel fill bottom', 400, 203), ('sel edge top', 400, 183), ('sel edge left', 11, 194)]: pt(n, x, y, 0 if 'edge' in n else 1)
box('sel label', 170, 189, 254, 203)
print('-- labels'); box('label normal', 170, 214, 290, 228); box('label disabled', 170, 326, 290, 340)
print('-- picker boxes')
for n, x, y in [('sel picker fill', 560, 196), ('sel picker border', 481, 196), ('sel drop fill', 678, 196), ('picker fill', 560, 220), ('picker border', 481, 220), ('picker drop', 679, 220), ('disabled picker', 560, 331)]: pt(n, x, y, 0 if 'border' in n else 1)
box('sel picker text', 500, 190, 660, 203); box('picker text', 530, 214, 612, 227)
print('-- On toggle')
for n, x, y in [('On box fill', 617, 265), ('On box fill top', 617, 259), ('On box fill bot', 617, 271), ('On box edge', 594, 265)]: pt(n, x, y, 0 if 'edge' in n else 1)
box('On text', 650, 258, 677, 272)
print('-- description box')
for n, x, y in [('desc fill top', 300, 420), ('desc fill mid', 300, 470), ('desc fill bottom', 300, 515), ('desc border top', 300, 415), ('desc border left', 10, 470)]: pt(n, x, y, 0 if 'border' in n else 1)
box('desc text', 170, 436, 372, 449)
print('-- Default button')
for n, x, y in [('btn fill', 258, 556), ('btn fill top', 258, 550), ('btn edge', 184, 556), ('back tab fill', 830, 556)]: pt(n, x, y, 0 if 'edge' in n else 1)
box('btn text', 233, 549, 284, 563)
pt, box = mk(Image.open(D + '/sound-picture-3.png').convert('RGBA'))
print('=== ME1 sound')
for n, x, y in [('track fill', 550, 196), ('track fill normal', 550, 221), ('track border', 550, 189), ('thumb sel', 622, 196), ('thumb normal', 622, 221), ('arrow sel L', 465, 195), ('arrow norm L', 465, 220), ('arrow norm R', 637, 220)]: pt(n, x, y, 1)
box('value 100 sel', 648, 190, 688, 204); box('value 100 normal', 648, 214, 688, 228)
pt, box = mk(Image.open(D + '/key-bindings-picture-5.png').convert('RGBA'))
print('=== ME1 keys')
for n, x, y in [('key cell fill', 478, 242), ('key cell fill top', 478, 236), ('key cell edge', 401, 242), ('bar orange L', 100, 218), ('bar orange R', 600, 218), ('scroll track', 760, 280), ('scroll thumb', 760, 224)]: pt(n, x, y, 0 if 'edge' in n else 1)
box('col header', 432, 192, 521, 206); box('General text', 177, 212, 244, 225); box('action text', 176, 236, 250, 249); box('key text', 470, 236, 486, 249)
