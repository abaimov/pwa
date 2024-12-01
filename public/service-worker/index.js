self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("static-cache").then((cache) => {
            return cache.addAll([
                "/", // Главная страница
                "/offline.html", // Страница, если пользователь оффлайн
                "/styles.css", // CSS-файл
                "/script.js", // JS-файл
                "/logo.png", // Логотип или другие медиа
            ]);
        })
    );
    console.log("Service Worker установлен и ресурсы закэшированы.");
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return caches.match("/offline.html"); // Оффлайн-страница
                }
            });
        })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = ["static-cache", "api-cache"];
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open("api-cache").then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => {
                        return cache.match(event.request);
                    });
            })
        );
    }
});
