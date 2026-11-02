'use strict';
// Cache apenas os arquivos desta interface. Emulador remoto e ROM não são cacheados aqui.
const CACHE = 'pocahontas-ipad-shell-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const target = new URL(event.request.url);
  if (target.origin !== self.location.origin) return;
  if (!SHELL.some(path => new URL(path,self.registration.scope).href === target.href)) return;
  event.respondWith(caches.match(event.request).then(hit=>hit || fetch(event.request)));
});
