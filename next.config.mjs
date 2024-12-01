import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontendNav: true,
    aggressiveFrontEndNavCaching: true,
    // reloadOnOnline: true,
    disable: false,
    workboxOptions: {
        disableDevLogs: true
    }
});

export default withPWA({});