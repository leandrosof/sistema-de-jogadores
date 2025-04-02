// service-worker.js

const CACHE_VERSION = "v3-" + Date.now(); // Versão única para forçar atualização
const CACHE_NAME = `nucleofc-cache-${CACHE_VERSION}`;
const ASSETS = [
  "/",
  "/index.html",
  "/logo.png",
  "/styles.css",
  "/app.js",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/manifest.json"
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing version:", CACHE_NAME);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching assets");
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log("[Service Worker] Skip waiting on install");
        return self.skipWaiting(); // Força o novo SW a assumir controle imediatamente
      })
  );
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating new version:", CACHE_NAME);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith("nucleofc-cache-") && name !== CACHE_NAME
            )
            .map((name) => {
              console.log("[Service Worker] Deleting old cache:", name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log("[Service Worker] Claiming clients");
        return self.clients.claim(); // Assume controle de todas as páginas
      })
  );
});

// Estratégia de cache: Cache-first, fallback para network
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetching:", event.request.url);

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        // Retorna do cache se existir, senão busca na rede
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            // Se for uma requisição GET, adiciona ao cache para futuras requisições
            if (event.request.method === "GET") {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
        );
      })
      .catch(() => {
        // Fallback para páginas offline
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      })
  );
});

// Mensagens para atualização forçada
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    console.log("[Service Worker] Skipping waiting due to message");
    self.skipWaiting();
  }
});
