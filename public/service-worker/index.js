self.addEventListener('install', (event) => {
    // Кэширование страницы offline при установке
    event.waitUntil(
        caches.open('offline-cache').then((cache) => {
            return cache.addAll([
                '/offline',  // Страница offline, которая будет показываться при ошибке
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Очистка устаревших кэшей
    const cacheWhitelist = ['offline-cache'];  // Пример: имя кэша для страницы offline
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка всех fetch-запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Если есть кэшированный ответ, возвращаем его
            if (cachedResponse) {
                return cachedResponse;
            }

            // Если кэшированного ответа нет, пытаемся выполнить запрос
            return fetch(event.request).catch(() => {
                // Если запрос не удался, пытаемся показать страницу /offline
                if (event.request.url.includes('pwa-three-wheat1.vercel.app')) {
                    return caches.match('/offline'); // Запрашиваем страницу offline, если основной домен недоступен
                }
                if (event.request.url.includes('pwa-ue9e.vercel.app')) {
                    return caches.match('/offline'); // Запрашиваем страницу offline, если резервный домен недоступен
                }

                // В случае других ошибок возвращаем страницу offline
                return caches.match('/offline');
            });
        })
    );
});

// Пример кэширования других статических файлов
workbox.precacheAndRoute([
    {
        "url": "/offline",  // Страница, которая будет показана при ошибке
        "revision": "1"  // Версия страницы, обновляется при изменении
    }
], {
    "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /ts/]
});

// Пример обработки кэширования начальной страницы с использованием NetworkFirst
workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [
        {
            cacheWillUpdate: async ({ response }) => {
                if (response && response.type === "opaqueredirect") {
                    return new Response(response.body, {
                        status: 200,
                        statusText: "OK",
                        headers: response.headers
                    });
                }
                return response;
            }
        },
        {
            handlerDidError: async ({ request }) => {
                // Если ошибка, показываем страницу offline
                return self.fallback(request);
            }
        }
    ]
}), 'GET');

// Пример обработки всех других запросов с использованием NetworkOnly
workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: [{
        handlerDidError: async ({ request }) => {
            // Если ошибка, показываем страницу offline
            return self.fallback(request);
        }
    }]
}), 'GET');
