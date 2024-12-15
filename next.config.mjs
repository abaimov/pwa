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
    customWorkerSrc: "service-worker/index.js",
    customWorkerDest: "service-worker/index.js",
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
                destination: 'https://express-pwa.onrender.com',
            },
        ];
    },
};

export default withPWA(nextConfig);
