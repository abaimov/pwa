import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontendNav: true,
    aggressiveFrontEndNavCaching: true,
    disable: false,
    workboxOptions: {
        disableDevLogs: true
    },
    customWorkerSrc: "service-worker", // Каталог для кастомного worker'а
    customWorkerDest: "public",        // Где будет размещен worker
    customWorkerPrefix: "custom-worker", // URL для кастомного worker'а
});

export default withPWA({});