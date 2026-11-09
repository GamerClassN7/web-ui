# usage: python3 -I sheet.py out_dir game screen  -> resizes mock2x to ref size, writes compare sheet + overlay; prints mean diff
import sys,os,re
from PIL import Image,ImageChops
out,g,s=sys.argv[1:4]; ROOT=__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__))))
js=open(ROOT+'/mockups/mock.js').read(); st=js.index('DATA.%s = {'%g)
n=re.compile(s+r":\s*\{\s*file:\s*'([^']+)'").search(js,st).group(1)
ref=Image.open(f'{ROOT}/refs/{g}/ea/{n}').convert('RGB'); W,H=ref.size
big=Image.open(f'{out}/{g}-{s}-mock2x.png').convert('RGB')
mock=big.crop((0,0,round(W*2.5),round(H*2.5))).resize((W,H),Image.LANCZOS); mock.save(f'{out}/{g}-{s}-mock.png')
ref.save(f'{out}/{g}-{s}-ref.png')
d=ImageChops.difference(mock,ref)
sh=Image.new('RGB',(W,H*3+8),(30,30,30)); sh.paste(mock,(0,0)); sh.paste(ref,(0,H+4)); sh.paste(d.point(lambda v:min(255,v*3)),(0,2*H+8)); sh.save(f'{out}/{g}-{s}-compare.png')
Image.blend(mock,ref,.5).save(f'{out}/{g}-{s}-blend.png')
px=__import__('numpy').asarray(d.convert('L')).ravel().tolist(); print(g,s,W,H,'mean-diff=%.2f'%(sum(px)/len(px)))
