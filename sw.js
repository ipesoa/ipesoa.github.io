/*
 * Service Worker de Onda (Etapa 1).
 * Estrategia: en la primera visita cachea todo lo que se sirve
 * (cache-on-fetch) y a partir de ahí responde cache-first → la app
 * funciona completamente sin conexión tras la primera carga.
 *
 * IMPORTANTE: al publicar una versión nueva, cambia CACHE_VERSION para
 * invalidar el caché anterior.
 */
const CACHE_VERSION = "onda-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(["./", "./manifest.webmanifest"]).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
