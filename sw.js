// Golf Log – B7.0 (SW neutralizado)
// Esta versión NO usa Service Worker para evitar problemas de cache en iOS.
// Archivo presente solo para compatibilidad / futuro.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
