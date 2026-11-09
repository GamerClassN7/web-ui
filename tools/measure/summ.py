# usage: python3 -I summ.py reg.txt  -> median (dx,dy) per element kind per screen, only reliable matches
import sys,re,statistics as st,collections
cur=None;D=collections.OrderedDict()
for l in open(sys.argv[1]):
    if l.startswith('=='): cur=l.split()[2]; D[cur]=collections.OrderedDict(); continue
    m=re.search(r'^(\w+)\s+(\d+).*shift=\(([-+]\d+),([-+]\d+)\) corr ([\d.]+)->([\d.]+)',l)
    if not m: continue
    k=m[1]; dx,dy=int(m[3]),int(m[4]); c=float(m[6])
    if c<0.55: continue
    D[cur].setdefault(k,[]).append((dx,dy))
for s,ks in D.items():
    out=[]
    for k,v in ks.items():
        mx=st.median([a for a,b in v]); my=st.median([b for a,b in v])
        if abs(mx)>=1.5 or abs(my)>=1.5: out.append(f'{k}({mx:+g},{my:+g})x{len(v)}')
    print(f'{s:12}',' '.join(out) or 'ok')
