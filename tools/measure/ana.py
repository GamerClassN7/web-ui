# usage: python3 -I ana.py dir game screen x0 y0 x1 y1 scale -> dir/<game>-<screen>-ana-x0-y0.png  (R=mock, GB=ref)
import sys
from PIL import Image
d,g,s=sys.argv[1:4]; x0,y0,x1,y1,S=map(int,sys.argv[4:9])
m=Image.open(f'{d}/{g}-{s}-mock.png').convert('L').crop((x0,y0,x1,y1)); r=Image.open(f'{d}/{g}-{s}-ref.png').convert('L').crop((x0,y0,x1,y1))
im=Image.merge('RGB',(m,r,r)).resize(((x1-x0)*S,(y1-y0)*S),Image.NEAREST)
# grid every 10px
from PIL import ImageDraw
dr=ImageDraw.Draw(im)
for x in range((x0//10+1)*10,x1,10): dr.line([((x-x0)*S,0),((x-x0)*S,4 if x%50 else 12)],fill=(255,255,0))
for y in range((y0//10+1)*10,y1,10): dr.line([(0,(y-y0)*S),(4 if y%50 else 12,(y-y0)*S)],fill=(255,255,0))
p=f'{d}/{g}-{s}-ana-{x0}-{y0}.png'; im.save(p); print(p)
