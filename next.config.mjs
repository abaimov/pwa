// import withPWAInit from "@ducanh2912/next-pwa";
//
// const withPWA = withPWAInit({
//     cacheOnFrontEndNav: true,
//     aggressiveFrontEndNavCaching: true,
//     reloadOnOnline: true,
//     swcMinify: true,
//     dest: "public",
//     fallbacks: {
//         //image: "/static/images/fallback.png",
//         document: "/offline", // if you want to fallback to a custom page rather than /_offline
//         // font: '/static/font/fallback.woff2',
//         // audio: ...,
//         // video: ...,
//     },
//     workboxOptions: {
//         disableDevLogs: true,
//     },
//     // ... other options you like
// });
//
// export default withPWA({});

import withPWA from "@ducanh2912/next-pwa"; // импорт PWA плагина

export default {
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'pwa-three-wheat1.vercel.app', // основной домен
                    },
                ],
                destination: 'https://pwa-ue9e.vercel.app/:path*', // резервный домен
                permanent: false, // редирект не постоянный, так как это временное решение
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: 'https://pwa-ue9e.vercel.app/:path*', // редирект на резервный домен
            },
        ]
    },
    ...withPWA({
        cacheOnFrontEndNav: true,
        aggressiveFrontEndNavCaching: true,
        reloadOnOnline: true,
        swcMinify: true,
        dest: "public",
        fallbacks: {
            document: "/offline", // fallback на страницу /offline при отключении от сети
        },
        workboxOptions: {
            disableDevLogs: true,
        },
    }),
};
