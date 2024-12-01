self.addEventListener("install", (event) => {
    console.log("Service Worker: Устанавливается...");
    event.waitUntil(
        caches.open("static-cache").then((cache) => {
            console.log("Service Worker: Кэширование ресурсов...");
            return cache.addAll([
                "/", // Главная страница
                "/offline", // Страница оффлайн
                "/styles.css", // CSS-файл
                "/script.js", // JS-файл
                "/logo.png", // Логотип или другие медиа
            ]);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker: Активирован.");
    const cacheWhitelist = ["static-cache", "api-cache"];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Service Worker: Удаляю старый кэш ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/api/")) {
        // Обработка API-запросов
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
    } else {
        // Обработка остальных запросов
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    } else {
                        return caches.match("/offline"); // Оффлайн-страница
                    }
                });
            })
        );
    }
});
