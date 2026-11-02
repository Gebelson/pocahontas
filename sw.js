'use strict';
// Cache de recursos próprios apenas. O jogo incorporado permanece no provedor.
const CACHE='pocahontas-ipad-shell-v3';
const SHELL=['./','./index.html','./lifecycle.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-180.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('pocahontas-ipad-shell-') && key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(!SHELL.some(path=>new URL(path,self.registration.scope).href===url.href))return;
  // Network first para a Vercel atualizar imediatamente após novo deploy.
  event.respondWith(fetch(event.request).then(response=>{
    if(!response.ok) return caches.match(event.request).then(hit=>hit || response);
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
    return response;
  }).catch(()=>caches.match(event.request)));
});
