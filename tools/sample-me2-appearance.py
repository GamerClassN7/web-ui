import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); print(im.size)
def hx(c): return '#%02x%02x%02x'%c
def pt(n,x,y,r=1):
    px=[im.getpixel((xx,yy)) for xx in range(x-r,x+r+1) for yy in range(y-r,y+r+1)]
    c=tuple(round(sum(p[i] for p in px)/len(px)) for i in range(3)); print(f'{n:28s} {hx(c)}')
def box(n,x0,y0,x1,y1,top=0.03):
    px=[im.getpixel((x,y)) for x in range(x0,x1) for y in range(y0,y1)]
    px.sort(key=lambda p:sum(p)); k=max(1,int(len(px)*top)); t=px[-k:]
    c=tuple(round(sum(p[i] for p in t)/len(t)) for i in range(3)); med=px[len(px)//2]
    print(f'{n:28s} text {hx(c)}  bg {hx(med)}')
print('--- text')
box('Title Appearance',115,80,452,112); box('Subtitle',115,120,632,145)
box('Armor tab text',184,174,254,198); box('Casual tab text',152,234,368,258)
box('Label Legs/Material',670,283,762,307); box('N7 Greaves',972,176,1098,198)
box('Pattern Color (active)',640,608,790,632); box('Rotate',1438,918,1527,946); box('Apply',704,988,770,1014)
print('--- tabs')
for n,x,y in [('green tab fill',400,172),('green tab fill2',300,200),('green tab top edge',350,161),('green tab left edge',112,185),('orange tab fill',400,232),('orange tab fill2',300,258),('orange tab edge',300,221),('orange tab left',82,258)]: pt(n,x,y,0 if 'edge' in n or 'left' in n else 1)
print('--- panel')
for n,x,y in [('panel border L',558,400),('panel border T',900,160),('panel bg',700,450),('panel bg2',700,350),('bottom box border',95,820),('bottom box border top',600,720),('bottom box fill',600,820),('bottom box inner glow',600,735)]: pt(n,x,y,0 if 'border' in n else 2)
print('--- slider')
for n,x,y in [('track border',900,206),('track border bottom',900,235),('track inner empty',1100,221),('track fill (olive)',900,301),('track fill2',1000,382),('thumb body',1112,302),('thumb border',1106,302),('legs track inner',1000,221)]: pt(n,x,y,0)
print('--- active row')
for n,x,y in [('active row fill',700,640),('active row fill2',1000,590),('active row border',700,577),('active track fill',1000,626),('active thumb',888,626),('active arrow',845,626)]: pt(n,x,y,0 if 'border' in n else 1)
print('--- misc')
for n,x,y in [('top arrow orange',1015,130),('R button ring',1345,933),('R button fill',1360,915),('bg left',20,500),('bg left low',20,1000),('bg top left',20,20),('bg between',400,500),('bg haze mid',800,650)]: pt(n,x,y,4 if n.startswith('bg') else 1)
