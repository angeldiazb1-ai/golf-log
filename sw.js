/* sw.js — B6.2.1 (anti-caché iOS/PWA)
   - HTML/Navegación: NETWORK FIRST (no-store)
   - Assets: cache-first
   - Limpia caches viejos al activar
*/
const CACHE_PREFIX = "golf-log-";
const VERSION = "golf-log-v6.2.1";
const ASSET_CACHE = `${VERSION}-assets`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k.startsWith(CACHE_PREFIX) && k !== ASSET_CACHE) ? caches.delete(k) : Promise.resolve()));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const accept = req.headers.get("accept") || "";
  const isHTML = req.mode === "navigate" || accept.includes("text/html");

  if (isHTML) {
    event.respondWith((async () => {
      try {
        return await fetch(req, { cache: "no-store" });
      } catch (e) {
        const cached = await caches.match(req, { ignoreSearch: true });
        return cached || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    const res = await fetch(req);
    try{
      const url = new URL(req.url);
      if(url.origin === self.location.origin){
        const cache = await caches.open(ASSET_CACHE);
        cache.put(req, res.clone()).catch(()=>{});
      }
    }catch(_){}
    return res;
  })());
});
