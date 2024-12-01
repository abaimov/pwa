import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    dest: "public",
    fallbacks: {
        // Failed page requests fallback to this.
        document: "/offline",
    },
    workboxOptions: {
        disableDevLogs: true,
    },
    customWorkerSrc: "service-worker", // Указываем путь к файлу Service Worker
    customWorkerDest: "service-worker", // Папка для Service Worker, defaults to `dest`
    customWorkerPrefix: "not/a-worker",
});

export default withPWA({reactStrictMode: false});
