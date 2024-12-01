'use client'
import { useEffect } from "react";

const CustomApp = () => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker/index.js")
                .then((registration) => {
                    console.log("Service Worker зарегистрирован:", registration);
                })
                .catch((error) => {
                    console.log("Ошибка при регистрации Service Worker:", error);
                });
        }
    }, []);

    return <div>App Content</div>;
};

export default CustomApp;
