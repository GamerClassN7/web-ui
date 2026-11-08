import os
from PIL import Image
R='mockups/renders'
refs={'me1':'refs/me1/ea/key-bindings-picture-5.png','me2':'refs/me2/ea/key-bindings-picture-5.png','me3':'refs/me3/ea/5-key-bindings.png'}
def c(p,b,s): im=Image.open(p).convert('RGB').crop(b); return im.resize((im.width*s,im.height*s),Image.LANCZOS)
tiles=[]
for g,b in (('me1',(745,188,790,300)),('me2',(985,190,1020,300)),('me3',(855,185,890,300))):
    a=c(os.path.join(R,g+'-keys-mock.png'),b,4); r=c(refs[g],b,4); tiles.append((a,r))
W=sum(a.width*2+30 for a,r in tiles); H=tiles[0][0].height
o=Image.new('RGB',(W,H),(255,0,255)); x=0
for a,r in tiles: o.paste(a,(x,0)); x+=a.width+4; o.paste(r,(x,0)); x+=r.width+26
o.save(os.path.join(R,'scroll-cmp.png')); print(o.size)
