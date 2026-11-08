import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); K=1.28; print(im.size)
def hx(c): return '#%02x%02x%02x'%c
def pt(n,x,y,r=1):
    x=round(x*K);y=round(y*K)
    px=[im.getpixel((xx,yy)) for xx in range(x-r,x+r+1) for yy in range(y-r,y+r+1)]
    c=tuple(round(sum(p[i] for p in px)/len(px)) for i in range(3)); print(f'{n:30s} {hx(c)}')
def box(n,x0,y0,x1,y1,top=0.03):
    px=[im.getpixel((x,y)) for x in range(round(x0*K),round(x1*K)) for y in range(round(y0*K),round(y1*K))]
    px.sort(key=lambda p:sum(p)); k=max(1,int(len(px)*top)); t=px[-k:]
    c=tuple(round(sum(p[i] for p in t)/len(t)) for i in range(3)); med=px[len(px)//2]
    print(f'{n:30s} text {hx(c)}  bg {hx(med)}')
print('--- text'); 
box('Eye Shape (orange active)',725,355,860,385); box('Code label (orange)',170,875,245,905)
box('Eyes selected row text',163,458,226,488); box('Cycle Presets (normal)',163,330,348,358)
box('Turn Head',1460,972,1608,1002); box('Eye Height slider label',722,432,862,460)
box('Code input text',170,938,725,960); box('Desc text',180,150,980,185)
print('--- slider'); 
for n,x,y in [('track inner',800,475),('track border',700,467),('track border2',700,483),('thumb body',681,475),('thumb edge',676,475),('active track fill',700,405),('active track fill R',900,405),('active thumb',913,405),('red arrow',574,408),('active track border',700,392)]: pt(n,x,y,0 if 'border' in n or 'edge' in n else 1)
print('--- panel'); 
for n,x,y in [('slider panel border L',537,600),('slider panel border T',800,331),('slider panel bg',780,590),('slider panel bg top',780,345),('desc box fill',600,275),('desc box border',157,220),('desc box border bottom',600,289)]: pt(n,x,y,0 if 'border' in n else 2)
print('--- selected row'); 
for n,x,y in [('sel fill L',200,472),('sel fill R',480,472),('sel border',335,451),('sel border outer glow',335,447),('code input fill',900,950),('code input border',157,950),('code border top',600,926)]: pt(n,x,y,0 if 'border' in n else 1)
print('--- buttons'); 
for n,x,y in [('btn fill reset',230,1010),('btn fill accept',500,1012),('btn fill back',775,1012),('btn border accept',467,1006),('btn border accept top',600,988)]: pt(n,x,y,0 if 'border' in n else 1)
print('--- bg'); 
for n,x,y in [('bg left',50,500),('bg left low',50,1000),('bg top mid',900,40),('bg between',460,780)]: pt(n,x,y,4)
