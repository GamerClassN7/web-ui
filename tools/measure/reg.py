# usage: python3 -I reg.py dir game [screen...]  -> per-element best shift of mock vs ref (edge images)
import sys,json,numpy as np
from PIL import Image
d,g=sys.argv[1:3]; scr=sys.argv[3:] or ['graphics','calibration','sound','controls','keys','gameplay']
def edges(p):
    a=np.asarray(Image.open(p).convert('L'),dtype=np.float32)
    gx=np.zeros_like(a);gy=np.zeros_like(a);gx[:,1:-1]=a[:,2:]-a[:,:-2];gy[1:-1,:]=a[2:,:]-a[:-2,:]
    return np.hypot(gx,gy)
M=8
for s in scr:
    m=edges(f'{d}/{g}-{s}-mock.png'); r=edges(f'{d}/{g}-{s}-ref.png'); H=min(m.shape[0],r.shape[0]); W=min(m.shape[1],r.shape[1])
    m=np.pad(m[:H,:W],M); r=np.pad(r[:H,:W],M)
    print(f'== {g} {s}')
    for e in json.load(open(f'{d}/{g}-{s}-rects.json')):
        x,y,w,h=e['r']; x0,y0,x1,y1=[int(round(v)) for v in (x-3,y-3,x+w+3,y+h+3)]
        x0=max(x0,0);y0=max(y0,0);x1=min(x1,W);y1=min(y1,H)
        if x1-x0<4 or y1-y0<4: continue
        mc=m[y0+M:y1+M,x0+M:x1+M]
        if mc.sum()<50: continue
        best=None;z=None
        for dy in range(-M,M+1):
            for dx in range(-M,M+1):
                rc=r[y0+M+dy:y1+M+dy,x0+M+dx:x1+M+dx]
                c=float((mc*rc).sum()/(np.sqrt((mc*mc).sum()*(rc*rc).sum())+1e-6))
                if dx==0 and dy==0: z=c
                if best is None or c>best[0]: best=(c,dx,dy)
        c,dx,dy=best; flag='  <<' if (abs(dx)>=1 or abs(dy)>=1) and c-z>0.03 else ''
        print(f"{e['k']:8} {e['i']:2} {e['txt'][:22]:22} box=({x:6.1f},{y:6.1f},{w:6.1f},{h:5.1f}) shift=({dx:+d},{dy:+d}) corr {z:.2f}->{c:.2f}{flag}")
