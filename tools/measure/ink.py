# usage: python3 -I ink.py dir game [kinds] -> ink bbox of text elements in mock vs ref: dL dR (left/right edge), dT dB, width ratio
import sys,json,numpy as np
from PIL import Image
d,g=sys.argv[1:3]; kinds=(sys.argv[3] if len(sys.argv)>3 else 'title,subtitle,label,value,aside,key,foot,onoff').split(',')
def L(p): return np.asarray(Image.open(p).convert('L'),dtype=np.float32)
def bbox(a,thr):
    ys,xs=np.where(a>thr)
    if len(xs)<4: return None
    return xs.min(),xs.max(),ys.min(),ys.max()
tot={}
for s in ['graphics','calibration','sound','controls','keys','gameplay']:
    m=L(f'{d}/{g}-{s}-mock.png'); r=L(f'{d}/{g}-{s}-ref.png')
    lines=[]
    for e in json.load(open(f'{d}/{g}-{s}-rects.json')):
        if e['k'] not in kinds or not e['t'] or not e['txt']: continue
        x,y,w,h=e['t']; pad=5 if e['k'] in('label','title','subtitle') else 2
        x0,y0,x1,y1=int(x-pad),int(y),int(x+w+pad+(6 if e['k'] in('label','subtitle','title') else 0)),int(y+h)
        mc=m[y0:y1,x0:x1]; rc=r[y0:y1,x0:x1]
        res=[]
        for a in (mc,rc):
            bg=np.percentile(a,30); hi=np.percentile(a,99.5); thr=bg+(hi-bg)*0.45
            res.append(bbox(a,thr) if hi-bg>25 else None)
        if None in res: continue
        (ml,mr,mt,mb),(rl,rr,rt,rb)=res
        dl,dr,dt,db=rl-ml,rr-mr,rt-mt,rb-mb; wr=(rr-rl+1)/(mr-ml+1)
        lines.append(f"  {e['k']:8} {e['txt'][:24]:24} dL={dl:+3d} dR={dr:+3d} dT={dt:+3d} dB={db:+3d} w(ref/mock)={wr:.2f}")
        tot.setdefault(e['k'],[]).append((dl,dr,dt,db,wr))
    print('==',g,s); print('\n'.join(lines))
print('== medians per kind (dL dR dT dB wratio):')
for k,v in tot.items():
    a=np.array(v); print(f'  {k:8} n={len(v):2}',' '.join(f'{x:+.1f}' for x in np.median(a[:,:4],0)),f'{np.median(a[:,4]):.3f}')
