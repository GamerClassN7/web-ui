// usage: node render.js out_dir game[,game] [screen,...]   -> out/<game>-<screen>-mock.png (1x, ref size, via DPR 2.5 downscale)
const {chromium}=require('playwright');
// Optional offline mode: ME_OFFLINE=<dir> with bootstrap.min.css, fonts.css and the font files
// (for sandboxes without CDN access); otherwise the pages load Bootstrap and Google Fonts normally.
async function offline(c){const O=process.env.ME_OFFLINE;if(!O)return;
 await c.route('**/bootstrap.min.css',r=>r.fulfill({path:O+'/bootstrap.min.css',contentType:'text/css'}));
 await c.route('https://fonts.googleapis.com/**',r=>r.fulfill({path:O+'/fonts.css',contentType:'text/css'}));
 await c.route('**/__f/**',r=>{const u=new URL(r.request().url());r.fulfill({path:O+u.pathname.slice(4),contentType:'font/woff2'})});}
const BASE=process.env.ME_BASE||'http://127.0.0.1:8765';
const path=require('path');const fs=require('fs');
const out=process.argv[2], games=process.argv[3].split(','), only=process.argv[4]?process.argv[4].split(','):null;
const SCR=['graphics','calibration','sound','controls','keys','gameplay'];
(async()=>{const b=await chromium.launch();
 const c=await b.newContext({viewport:{width:1023,height:640},deviceScaleFactor:2.5});
 await offline(c);
 const p=await c.newPage();
 for(const g of games)for(const s of (only||SCR)){
  await p.goto(`${BASE}/mockups/${g}.html?screen=${s}&mode=mock&bare=1&theme=dark`,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:`${out}/${g}-${s}-mock2x.png`,clip:{x:0,y:0,width:1023,height:640}});
 }
 await b.close();})();
