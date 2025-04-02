const CACHE_PREFIX = "nucleofc-cache";
const CACHE_VERSION =
  "v3" + (location.hostname === "localhost" ? "-" + Date.now() : "");
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Atualiza o cache em segundo plano (se a resposta da rede for válida)
      const fetchAndUpdate = fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return response;
      });

      // Retorna do cache se existir, senão busca na rede
      return (
        cachedResponse ||
        fetchAndUpdate.catch(() => {
          if (event.request.headers.get("accept").includes("text/html")) {
            return new Response(
              "<h1>Offline</h1><p>Conteúdo não disponível sem conexão.</p>",
              { headers: { "Content-Type": "text/html" } }
            );
          }
        })
      );
    })
  );
});
