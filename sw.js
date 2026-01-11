/* Golf Log PWA — Service Worker (B6.2 STABLE)
   Estrategia:
   - HTML (navegación): network-first (evita pantallas viejas)
   - Assets: stale-while-revalidate
*/
'use strict';

const VERSION = "B6.2-stable-refsfix2";
const CACHE_PREFIX = 'golf-log';
const CACHE_NAME = `${CACHE_PREFIX}-${VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

const isSameOrigin = (url) => url.origin === self.location.origin;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try { await cache.addAll(PRECACHE_URLS); } catch (e) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => {
        const isOurCache = key.startsWith(`${CACHE_PREFIX}-`);
        const isCurrent = key === CACHE_NAME;
        if (isOurCache && !isCurrent) return caches.delete(key);
        return Promise.resolve();
      })
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (!isSameOrigin(url)) return;

  const isNavigation = req.mode === 'navigate';
  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

  if (isNavigation || isHTML || isIndex) {
    event.respondWith(networkFirst(req));
    return;
  }

  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req, { cache: 'no-store' });
    if (fresh && fresh.ok) await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    if (cached) return cached;
    const fallback = await cache.match('./index.html');
    if (fallback) return fallback;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);

  const fetchPromise = (async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) await cache.put(req, fresh.clone());
      return fresh;
    } catch {
      return null;
    }
  })();

  return cached || (await fetchPromise) || new Response('', { status: 504 });
}

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
