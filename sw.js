/* =========================================================
   Golf Log - Service Worker
   Soporte OFFLINE para iPhone (Safari / PWA)
   ========================================================= */

const CACHE_NAME = "golf-log-v1";

/* Archivos esenciales (app shell) */
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

/* =========================
   INSTALL
   ========================= */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      await self.skipWaiting();
    })()
  );
});

/* =========================
   ACTIVATE
   ========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

/* =========================
   FETCH
   ========================= */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Solo GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Solo mismo origen
  if (url.origin !== self.location.origin) return;

  const isHTML =
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html");

  /* ---------- HTML: network first ---------- */
  if (isHTML) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", networkResponse.clone());
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match("./index.html");
          return (
            cachedResponse ||
            new Response("Golf Log está offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" }
            })
          );
        }
      })()
    );
    return;
  }

  /* ---------- Assets: cache first ---------- */
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        return new Response("", { status: 504 });
      }
    })()
  );
});
