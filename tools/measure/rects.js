// usage: node rects.js out game[,game]  -> out/<game>-<screen>-rects.json
const {chromium}=require('playwright');
// Optional offline mode: ME_OFFLINE=<dir> with bootstrap.min.css, fonts.css and the font files
// (for sandboxes without CDN access); otherwise the pages load Bootstrap and Google Fonts normally.
async function offline(c){const O=process.env.ME_OFFLINE;if(!O)return;
 await c.route('**/bootstrap.min.css',r=>r.fulfill({path:O+'/bootstrap.min.css',contentType:'text/css'}));
 await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({path:O+'/fonts.css',contentType:'text/css'}));
 await c.route('**/__f/**',r=>{const u=new URL(r.request().url());r.fulfill({path:O+u.pathname.slice(4),contentType:'font/woff2'})});}
const BASE=process.env.ME_BASE||'http://127.0.0.1:8765';
const fs=require('fs');const out=process.argv[2],games=process.argv[3].split(',');
const SCR=['graphics','calibration','sound','controls','keys','gameplay'];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1023,height:640}});
 await offline(c);
 const p=await c.newPage();
 for(const g of games)for(const s of SCR){
  await p.goto(`${BASE}/mockups/${g}.html?screen=${s}&mode=mock&bare=1&theme=dark`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const R=await p.evaluate(()=>{const st=document.getElementById('stage').getBoundingClientRect();const o=[];
   const sel={'title':'.scr-title b','subtitle':'.scr-title small','me1head':'.me1-head','row':'.me-rows > .me-row','label':'.me-row-label','value':'.me-picker-value','drop':'.me-picker-drop','arrow':'.me-arrow:not([style*=hidden])','onoff':'.me-onoff .btn','range':'.form-range','aside':'.me-row-aside','desc':'.me-desc','foot':'.me-foot .btn','key':'.key-cell','scroll':'.me-scroll','n7':'.n7-box','back':'.back-icon','cols':'.me2-cols span, .me1-keys-cols span, .me-keys-head span'};
   for(const [k,q] of Object.entries(sel)){document.querySelectorAll('#stage '+q).forEach((e,i)=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return;
     // text-tight box for text-like elements
     let t=null;if(['title','subtitle','label','value','aside','key','foot','onoff','cols'].includes(k)){const rg=document.createRange();rg.selectNodeContents(e);const rr=rg.getBoundingClientRect();if(rr.width>1)t=[rr.left-st.left,rr.top-st.top,rr.width,rr.height];}
     o.push({k,i,txt:(e.textContent||'').trim().slice(0,24),r:[r.left-st.left,r.top-st.top,r.width,r.height],t});});}
   return o;});
  fs.writeFileSync(`${out}/${g}-${s}-rects.json`,JSON.stringify(R));}
 await b.close();})();
