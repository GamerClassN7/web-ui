import sys
from PIL import Image
from collections import Counter
im=Image.open(sys.argv[1]).convert('RGB'); print(im.size)
def hx(c): return '#%02x%02x%02x'%c
def pt(n,x,y,r=2):
    px=[im.getpixel((xx,yy)) for xx in range(x-r,x+r+1) for yy in range(y-r,y+r+1)]
    c=tuple(round(sum(p[i] for p in px)/len(px)) for i in range(3)); print(f'{n:28s} ({x},{y}) {hx(c)}')
def box(n,x0,y0,x1,y1,top=0.03):
    px=[im.getpixel((x,y)) for x in range(x0,x1) for y in range(y0,y1)]
    px.sort(key=lambda p:sum(p)); k=max(1,int(len(px)*top)); t=px[-k:]
    c=tuple(round(sum(p[i] for p in t)/len(t)) for i in range(3))
    med=px[len(px)//2]
    print(f'{n:28s} text-top {hx(c)}  bg-median {hx(med)}')
print('--- backgrounds')
for n,x,y in [('bg top-left',40,40),('bg center-left',400,600),('bg bottom',960,1030),('bg right',1880,500),('bg glow',700,700)]: pt(n,x,y,6)
print('--- header tab')
for n,x,y in [('header fill left',700,165),('header fill mid',1220,170),('header fill bottom',900,185),('header top border',950,139),('header fill top',900,150)]: pt(n,x,y,1)
print('--- main frame')
for n,x,y in [('frame border right',1787,600),('frame border top',1500,190),('frame border bottom',1000,940),('inner panel top',980,240),('inner panel mid',980,320),('inner panel dark',980,600),('inner panel left border',679,500)]: pt(n,x,y,1)
print('--- selected red field')
for n,x,y in [('red fill left',170,270),('red fill mid',500,245),('red border',137,258),('red border top',400,230),('red glow outer',130,258)]: pt(n,x,y,1)
print('--- text')
box('Primary Color (active)',150,430,345,465)
box('Highlight Color',150,500,370,535)
box('Secondary Color (disabled)',150,570,385,605)
box('Level 4 Vanguard (sub)',150,297,365,355)
box('Rotate Character',905,865,1135,897)
box('Appearance title',795,150,1110,190)
box('Name input text',150,240,350,275)
print('--- buttons')
for n,x,y in [('btn fill',1300,975),('btn fill2',1650,975),('btn border',1245,968),('btn border top',1400,948),('btn gradient lower',1350,985)]: pt(n,x,y,1)
box('Reset btn text',1435,955,1497,985)
print('--- mouse icon red')
for n,x,y in [('icon red body',845,900),('icon glow',815,880)]: pt(n,x,y,1)
