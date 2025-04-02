const CACHE_PREFIX = "nucleofc-cache";
const CACHE_VERSION = "v4"; // ATUALIZE SEMPRE QUE MODIFICAR OS ARQUIVOS
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const ASSETS = [
  "/",
  "/index.html",
  "/logo.png",
  "/styles.css",
  "/app.js",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

// --- INSTALAÇÃO ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // Força ativação imediata
  );
});

// --- ATIVAÇÃO ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
            )
            .map((name) => {
              console.log("[SW] Removendo cache antigo:", name);
              return caches.delete(name); // Deleta TODOS os caches antigos
            })
        );
      })
      .then(() => {
        console.log("[SW] Cache limpo e pronto para nova versão!");
        return self.clients.claim(); // Assume controle de todas as abas
      })
  );
});

// --- FETCH ---
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
