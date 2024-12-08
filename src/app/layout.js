'use client'

import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                        console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                        console.log('Service Worker registration failed: ', err);
                    }
                );
            });
        }
    }, [])

    return (
        <html lang="ru">
        <body className={inter.className}>{children}</body>
        </html>
    )
}

