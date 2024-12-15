const CACHE_NAME = 'pwa-cache-v1';
const OFFLINE_URL = '/offline';
const API_URL = 'https://express-pwa.onrender.com/api/link';

// Предварительная загрузка основных ресурсов
const PRECACHE_ASSETS = [
    '/',
    OFFLINE_URL,
    '/styles.css',
    '/script.js',
    '/logo.png'
];

// Установка Service Worker и предварительное кэширование
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Активация Service Worker и очистка устаревших кэшей
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Обработка fetch-запросов
self.addEventListener('fetch', (event) => {
    if (event.request.url === API_URL) {
        // Обработка запросов к API с использованием Network First
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(event.request)) // Возврат данных из кэша при ошибке сети
        );
    } else if (event.request.mode === 'navigate') {
        // Для HTML-страниц: Network First с fallback на оффлайн-страницу
        event.respondWith(
            fetch(event.request)
                .then((response) => cacheAndReturn(event.request, response))
                .catch(() => caches.match(OFFLINE_URL))
        );
    } else {
        // Для остальных запросов: Cache First
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return (
                    cachedResponse ||
                    fetch(event.request)
                        .then((response) => cacheAndReturn(event.request, response))
                        .catch(() => undefined)
                );
            })
        );
    }
});

// Фоновая синхронизация для обновления данных API
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-fetch-link') {
        event.waitUntil(fetchAndCacheLink());
    }
});

async function fetchAndCacheLink() {
    try {
        console.log('Получение данных с API...');
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.statusText}`);
        }
        const clonedResponse = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(API_URL, clonedResponse);
        console.log('Данные API успешно обновлены в кэше');
        return response.json(); // Возвращаем данные
    } catch (error) {
        console.error('Ошибка при получении и кэшировании данных:', error);
        throw error;
    }
}

// Кэширование ответа и возврат клиенту
function cacheAndReturn(request, response) {
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
    }

    const clonedResponse = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, clonedResponse);
    });

    return response;
}
