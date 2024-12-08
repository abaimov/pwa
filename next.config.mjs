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
        runtimeCaching: [
            {
                urlPattern: ({ url }) => {
                    return !url.pathname.includes('/api/');
                },
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-cache',
                    expiration: {
                        maxEntries: 200,
                    },
                },
            },
            {
                urlPattern: ({ url }) => {
                    return url.pathname.includes('/api/');
                },
                handler: 'NetworkOnly',
                options: {
                    cacheName: 'api-cache',
                    networkTimeoutSeconds: 5,
                },
            },
        ],
    },
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

