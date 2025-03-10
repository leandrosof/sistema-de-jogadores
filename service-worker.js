const CACHE_NAME = "nucleofc-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/logo.png",
  "/styles.css",
  "/app.js",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => console.log("NúcleoFC: Cache instalado com sucesso!"))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
