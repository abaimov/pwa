// /**
//  * Copyright 2018 Google Inc. All Rights Reserved.
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
//
// // If the loader is already loaded, just stop.
// if (!self.define) {
//   let registry = {};
//
//   // Used for `eval` and `importScripts` where we can't get script URL by other means.
//   // In both cases, it's safe to use a global var because those functions are synchronous.
//   let nextDefineUri;
//
//   const singleRequire = (uri, parentUri) => {
//     uri = new URL(uri + ".js", parentUri).href;
//     return registry[uri] || (
//
//         new Promise(resolve => {
//           if ("document" in self) {
//             const script = document.createElement("script");
//             script.src = uri;
//             script.onload = resolve;
//             document.head.appendChild(script);
//           } else {
//             nextDefineUri = uri;
//             importScripts(uri);
//             resolve();
//           }
//         })
//
//       .then(() => {
//         let promise = registry[uri];
//         if (!promise) {
//           throw new Error(`Module ${uri} didn’t register its module`);
//         }
//         return promise;
//       })
//     );
//   };
//
//   self.define = (depsNames, factory) => {
//     const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
//     if (registry[uri]) {
//       // Module is already loading or loaded.
//       return;
//     }
//     let exports = {};
//     const require = depUri => singleRequire(depUri, uri);
//     const specialDeps = {
//       module: { uri },
//       exports,
//       require
//     };
//     registry[uri] = Promise.all(depsNames.map(
//       depName => specialDeps[depName] || require(depName)
//     )).then(deps => {
//       factory(...deps);
//       return exports;
//     });
//   };
// }
// define(['./workbox-cca50194'], (function (workbox) { 'use strict';
//
//   importScripts("/fallback-development.js");
//   self.skipWaiting();
//   workbox.clientsClaim();
//
//   /**
//    * The precacheAndRoute() method efficiently caches and responds to
//    * requests for URLs in the manifest.
//    * See https://goo.gl/S9QRab
//    */
//   workbox.precacheAndRoute([{
//     "url": "/offline",
//     "revision": "development"
//   }], {
//     "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /ts/]
//   });
//   workbox.cleanupOutdatedCaches();
//   workbox.registerRoute("/", new workbox.NetworkFirst({
//     "cacheName": "start-url",
//     plugins: [{
//       cacheWillUpdate: async ({
//         response: e
//       }) => e && "opaqueredirect" === e.type ? new Response(e.body, {
//         status: 200,
//         statusText: "OK",
//         headers: e.headers
//       }) : e
//     }, {
//       handlerDidError: async ({
//         request: e
//       }) => "undefined" != typeof self ? self.fallback(e) : Response.error()
//     }]
//   }), 'GET');
//   workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
//     "cacheName": "dev",
//     plugins: [{
//       handlerDidError: async ({
//         request: e
//       }) => "undefined" != typeof self ? self.fallback(e) : Response.error()
//     }]
//   }), 'GET');
//   self.__WB_DISABLE_DEV_LOGS = true;
//
// }));
// //# sourceMappingURL=sw.js.map
//
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//       caches.match(event.request).then((cachedResponse) => {
//         return (
//             cachedResponse ||
//             fetch(event.request)
//                 .catch((error) => {
//                   // Обработка ошибки и использование резервного домена
//                   if (event.request.url.includes('pwa-three-wheat1.vercel.app')) {
//                     const fallbackUrl = event.request.url.replace('pwa-three-wheat1.vercel.app', 'pwa-ue9e.vercel.app');
//                     return fetch(fallbackUrl); // запрашиваем резервный домен
//                   }
//                   throw error; // если не удалось получить данные с обоих доменов
//                 })
//         );
//       })
//   );
// });
//
importScripts("/fallback-development.js");
self.skipWaiting();
workbox.clientsClaim();

// Предварительное кэширование
workbox.precacheAndRoute([
  {
    "url": "/offline",
    "revision": "development"
  }
], {
  "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /ts/]
});

// Очистка устаревших кэшей
workbox.cleanupOutdatedCaches();

// Кэширование начальной страницы
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
        // Если ошибка, использовать fallback
        return self.fallback(request);
      }
    }
  ]
}), 'GET');

// Кэширование всех других ресурсов с использованием NetworkFirst
workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
  "cacheName": "dev",
  plugins: [{
    handlerDidError: async ({ request }) => {
      // Если ошибка при запросе, использовать fallback
      return self.fallback(request);
    }
  }]
}), 'GET');

// Обработка fetch-запросов с fallback на резервный домен
self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
            cachedResponse ||
            fetch(event.request).catch((error) => {
              // Проверяем на основной домен и делаем fallback
              if (event.request.url.includes('pwa-three-wheat1.vercel.app')) {
                const fallbackUrl = event.request.url.replace('pwa-three-wheat1.vercel.app', 'pwa-ue9e.vercel.app');
                return fetch(fallbackUrl); // Запрашиваем резервный домен
              }
              throw error; // Если оба домена недоступны
            })
        );
      })
  );
});
