const STATIC_CACHE = "ap-docent-static-v9";
const CACHE_PREFIX = "ap-docent-static-";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./artworks.json",
  "./artHistoryMaster.js",
  "./viewingRoutesMaster.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) => cache.match(event.request)).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});