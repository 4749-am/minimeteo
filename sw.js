const CACHE = "minimeteo";

// Installation
self.addEventListener("install", event => {

    self.skipWaiting();

});

// Activation

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

// Cache dynamique

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.open(CACHE)

            .then(async cache => {

                try {

                    const network = await fetch(event.request);

                    cache.put(event.request, network.clone());

                    return network;

                }

                catch {

                    const cached = await cache.match(event.request);

                    return cached;

                }

            })

    );

});