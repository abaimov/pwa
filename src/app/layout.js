'use client'

import { useEffect } from 'react'
import './globals.css'

export default function RootLayout({ children }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
                .catch((error) => console.error('Service Worker registration failed:', error))
        }
    }, [])

    return (
        <html lang="ru">
        <body>{children}</body>
        </html>
    )
}

