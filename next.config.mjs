import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    dest: "public",
    register: true,
    skipWaiting: true,
    fallbacks: {
        document: "/offline",
    },
    workboxOptions: {
        disableDevLogs: true,
    },
    customWorkerSrc: "service-worker",
    customWorkerDest: "service-worker",
    customWorkerPrefix: "not/a-worker",
    runtimeCaching: [
        {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'offlineCache',
                expiration: {
                    maxEntries: 200,
                },
            },
        },
        {
            urlPattern: /\/api\/link/,
            handler: 'NetworkOnly',
            options: {
                cacheName: 'api-cache',
            },
        },
    ],
});

const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: '/api/link',
                destination: 'http://localhost:8000/api/link',
            },
        ];
    },
};

export default withPWA(nextConfig);

