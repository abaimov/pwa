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
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 200,
                },
            },
        },
    ],
});

const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['plus.unsplash.com', 'images.unsplash.com'],
    },
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

