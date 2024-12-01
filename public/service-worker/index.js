// Установка Service Worker
self.addEventListener("install", (event) => {
    console.log("Service Worker: Устанавливается...");
    event.waitUntil(
        caches.open("static-cache").then((cache) => {
            console.log("Service Worker: Кэширование ресурсов...");
            return cache.addAll([
                "/",          // Главная страница
                "/offline",   // Страница оффлайн
                "/styles.css", // CSS-файл
                "/script.js", // JS-файл
                "/logo.png",  // Логотип или другие медиа
            ]);
        })
    );
});

// Активация Service Worker
self.addEventListener("activate", (event) => {
    console.log("Service Worker: Активирован.");
    const cacheWhitelist = ["static-cache", "dynamic-cache", "api-cache"];
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Service Worker: Удаляю старый кэш: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

// Обработка запросов с резервным сервером
self.addEventListener("fetch", (event) => {
    const primaryServer = "https://pwa-three-wheat.vercel.app";
    const backupServer = "https://pwa-three-wheat1.vercel.app"; // Резервный сервер

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Возврат закэшированного ответа
            }

            // Попытка загрузки с основного сервера
            return fetch(event.request)
                .then((response) => {
                    if (!response || response.status !== 200) {
                        throw new Error("Некорректный ответ от основного сервера");
                    }
                    // Кэширование успешного ответа
                    return caches.open("dynamic-cache").then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    console.warn("Основной сервер недоступен. Пробуем резервный сервер...");

                    // Замена URL на резервный сервер
                    const updatedRequest = new Request(
                        event.request.url.replace(primaryServer, backupServer),
                        event.request
                    );

                    return fetch(updatedRequest)
                        .then((response) => {
                            if (!response || response.status !== 200) {
                                throw new Error("Некорректный ответ от резервного сервера");
                            }
                            // Кэширование ответа с резервного сервера
                            return caches.open("dynamic-cache").then((cache) => {
                                cache.put(updatedRequest, response.clone());
                                return response;
                            });
                        })
                        .catch(() => {
                            console.error("Оба сервера недоступны. Возвращаем оффлайн-страницу.");
                            // Возврат оффлайн-страницы
                            return caches.match("/offline");
                        });
                });
        })
    );
});
