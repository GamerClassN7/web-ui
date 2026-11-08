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
pt,box=mk(Image.open(D+'/1-graphics.png').convert('RGBA'))
print('=== graphics')
print('-- selected row')
for n,x,y in [('sel fill L',300,198),('sel fill R',760,198),('sel fill top',500,189),('sel fill bottom',500,207),('sel border top',400,186),('sel border left',147,198)]: pt(n,x,y,0 if 'border' in n else 1)
box('sel label',154,190,220,206)
print('-- picker'); 
for n,x,y in [('picker fill',470,223),('picker border top',560,214),('picker sel border',560,187),('picker sel fill',470,197),('dropdown btn',655,190),('dropdown btn mid',655,200)]: pt(n,x,y,0 if 'border' in n else 1)
box('picker value text',528,215,596,232); box('picker sel text',520,190,600,206)
print('-- arrows')
for n,x,y in [('arrow L active',433,222),('arrow L active 2',435,247),('arrow R dim',686,222),('arrow R active',685,246),('arrow L monitor',433,247)]: pt(n,x,y,1)
print('-- On / Off')
for n,x,y in [('On fill top',470,264),('On fill bottom',470,280),('On fill mid',470,272),('On border top',490,262),('On border left',446,272),('Off fill',600,272),('Off border top',620,262),('Off border left',579,272),('Off border bottom',620,281)]: pt(n,x,y,0 if 'border' in n else 1)
box('On text',480,265,505,280); box('Off text',615,265,640,280)
print('-- labels'); box('label normal',154,215,260,230); box('label disabled',154,339,244,353); 
print('-- description box')
for n,x,y in [('desc top',300,427),('desc mid',300,440),('desc low',300,465),('desc bottom',300,500),('desc border',152,470),('desc line top',400,421)]: pt(n,x,y,0 if 'border' in n or 'line' in n else 1)
box('desc text',168,428,424,442)
print('-- scrollbar')
for n,x,y in [('scroll pill',857,212),('scroll line',856,300)]: pt(n,x,y,1)
print('-- footer'); 
for n,x,y in [('footer btn fill',650,501),('footer btn fill2',760,507),('footer btn border',618,507),('footer btn bottom',690,515)]: pt(n,x,y,0 if 'border' in n else 1)
box('footer text',645,501,730,514)
print('-- title'); box('Options title',150,118,238,134); box('subtitle Graphics',150,135,203,147)
print('-- frame line'); 
for n,x,y in [('frame top line',700,111),('frame right line',860,300),('frame left line',150,300)]: pt(n,x,y,0)
print('-- bg'); 
for n,x,y in [('bg tl',50,50),('bg mid',500,580),('bg top right',900,60),('bg between',90,300)]: pt(n,x,y,4)
pt,box=mk(Image.open(D+'/3-sound.png').convert('RGBA'))
print('=== sound')
for n,x,y in [('track inner',550,198),('track border top',550,187),('track border left',447,198),('slider thumb',663,198),('slider thumb edge',660,198),('sel track fill',550,247),('sel track fill L',460,247),('sel track border',550,237),('sel thumb',662,247),('sel arrow L',433,247),('sel arrow R',684,247),('arrow R dim',684,198),('arrow L blue',433,198),('pct text',720,198)]: pt(n,x,y,0 if 'border' in n or 'edge' in n else 1)
box('percent text',705,191,741,206)
pt,box=mk(Image.open(D+'/2-calibration.png').convert('RGBA'))
print('=== calibration'); box('desc text',160,430,420,445)
