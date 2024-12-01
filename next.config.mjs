import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    dest: "public",
    fallbacks: {
        document: "/offline", // если вы хотите использовать серверную страницу для fallback
    },
    workboxOptions: {
        disableDevLogs: true,
    },
    customWorkerSrc: "service-worker/index.js", // Указываем путь к файлу Service Worker
    customWorkerDest: "service-worker", // Папка для Service Worker, defaults to `dest`
    // customWorkerPrefix: "not/a-worker",
});

export default withPWA({});
