async (page) => {
 const files=__SITE_FILES__;
 await page.route('https://pocahontas.test/**',async route=>{
   const path=new URL(route.request().url()).pathname;
   const file=path==='/'?'index.html':path.slice(1);
   if(file==='sw.js')return route.abort();
   await route.fulfill({body:files[file],contentType:file.endsWith('.js')?'application/javascript':'text/html'});
 });
 await page.route('https://arcader.com/**',r=>r.fulfill({body:'<html><body>Controlled player fixture</body></html>',contentType:'text/html'}));
 await page.goto('https://pocahontas.test/');
 const assert=(v,m)=>{if(!v)throw Error(m)};
 await page.evaluate(()=>{window.originalPlayer=document.getElementById('game');window.loads=0;originalPlayer.addEventListener('load',()=>window.loads++);});
 await page.locator('#openMenu').click();
 assert(await page.locator('#top').isVisible(),'menu opens');
 await page.evaluate(()=>{window.dispatchEvent(new Event('focus'));window.dispatchEvent(new Event('pageshow'));});
 assert(await page.evaluate(()=>document.activeElement.id==='closeMenu'),'no focus theft by host while menu open');
 await page.locator('#closeMenu').click();
 assert(await page.evaluate(()=>document.activeElement.id==='game'),'focus restored on explicit continue');
 await page.evaluate(()=>window.confirm=()=>false);
 await page.locator('#openMenu').click();await page.locator('#reload').click();
 await page.evaluate(()=>{window.dispatchEvent(new Event('blur'));document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pagehide'));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));window.dispatchEvent(new Event('offline'));});
 await page.setViewportSize({width:768,height:1024});
 await page.setViewportSize({width:1024,height:768});
 assert(await page.evaluate(()=>window.originalPlayer===document.getElementById('game')&&window.loads===0),'iframe preserved across menu, lifecycle, rotation, cancelled restart');
 assert(await page.evaluate(()=>JSON.parse(document.getElementById('app').dataset.lifecycle).emulation==='unknown'),'does not claim game running');
 await page.evaluate(()=>window.confirm=()=>true);await page.locator('#reload').click();
 await page.waitForFunction(()=>window.loads===1);
 assert(await page.evaluate(()=>window.originalPlayer===document.getElementById('game')),'restart reuses element');
 await page.evaluate(()=>document.title='CHECKS PASSED');console.log('PASS: menu, focus guard, explicit focus return, cancelled/confirmed restart, lifecycle/BFCache synthetic events, rotation, honest unknown emulation. Fixture only; not gameplay validation.');
}
