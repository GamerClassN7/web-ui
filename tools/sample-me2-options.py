import sys
from PIL import Image
D=sys.argv[1]
def hx(c): return '#%02x%02x%02x'%c
def mk(im):
    def pt(n,x,y,r=1):
        px=[im.getpixel((xx,yy))[:3] for xx in range(x-r,x+r+1) for yy in range(y-r,y+r+1)]
        c=tuple(round(sum(p[i] for p in px)/len(px)) for i in range(3)); print(f'{n:30s} ({x},{y}) {hx(c)}')
    def box(n,x0,y0,x1,y1,top=0.03):
        px=[im.getpixel((x,y))[:3] for x in range(x0,x1) for y in range(y0,y1)]
        px.sort(key=lambda p:sum(p)); k=max(1,int(len(px)*top)); t=px[-k:]
        c=tuple(round(sum(p[i] for p in t)/len(t)) for i in range(3)); med=px[len(px)//2]
        print(f'{n:30s} text {hx(c)}  bg {hx(med)}')
    return pt,box
pt,box=mk(Image.open(D+'/graphics-picture-1.png').convert('RGBA'))
print('=== ME2 graphics')
box('Options title',122,114,277,142); box('subtitle',122,151,175,163)
print('-- selected row (green)')
for n,x,y in [('sel fill L',300,213),('sel fill R',900,213),('sel top edge',500,203),('sel bottom edge',500,222),('sel left edge',123,213),('picker green fill',560,213),('picker green border',517,213),('drop green',714,213)]: pt(n,x,y,0 if 'edge' in n or 'border' in n else 1)
box('sel label',134,206,198,219)
print('-- labels'); box('label normal',134,232,238,246); box('label disabled',134,362,222,375); box('Windowed value',580,230,666,248)
print('-- on/off')
for n,x,y in [('On fill',520,291),('On fill top',520,285),('On fill bottom',520,297),('On border',498,291),('Off fill',670,291),('Off border',646,291),('Off border top',670,282),('arrow R orange',772,291),('arrow L orange',470,239),('arrow L dim',468,368)]: pt(n,x,y,0 if 'border' in n else 1)
box('On text',555,284,575,298); box('Off text',702,284,722,298)
print('-- picker orange (monitor)')
for n,x,y in [('mon fill',560,264),('mon border',517,264),('mon drop',714,264)]: pt(n,x,y,0 if 'border' in n else 1)
box('mon text',545,257,672,271)
print('-- desc box')
for n,x,y in [('desc fill',500,515),('desc fill dark',300,530),('desc border top',500,487),('desc border outer',121,516),('desc inner glow',500,495)]: pt(n,x,y,0 if 'border' in n else 1)
box('desc text',140,508,290,524)
print('-- footer btn')
for n,x,y in [('reset fill',460,593),('reset border',378,593),('reset top',460,586)]: pt(n,x,y,0 if 'border' in n or 'top' in n else 1)
box('reset text',418,587,508,600)
print('-- bg'); 
for n,x,y in [('bg tl',20,20),('bg mid',500,620),('bg haze',200,100),('bg right',1000,300)]: pt(n,x,y,4)
pt,box=mk(Image.open(D+'/sound-picture-3.png').convert('RGBA'))
print('=== ME2 sound')
for n,x,y in [('slider bar',620,209),('slider bar top',620,204),('slider bar bot',620,215),('slider track groove',620,207),('slider end cap',758,209),('slider arrow',466,209),('sel bar',620,260),('sel bar light',620,256),('sel cap',758,260),('sel arrow',466,260),('pct',820,209)]: pt(n,x,y,0 if 'groove' in n else 1)
box('percent',806,203,839,216); box('sel pct',806,254,839,267)
