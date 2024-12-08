'use client'

import { useState, useEffect } from 'react'
import styles from './DynamicContent.module.css'

export default function DynamicContent() {
    const [link, setLink] = useState(null)
    const [isOnline, setIsOnline] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    const fetchLink = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/link', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-store'
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setLink(data)
        } catch (error) {
            console.log('Не удалось получить данные с сервера. Использую резервную ссылку.')
            setLink({url: 'https://www.google.com', text: 'Google (резервная ссылка)'})
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const updateOnlineStatus = () => {
            const online = navigator.onLine
            setIsOnline(online)
            if (online) {
                fetchLink()
            }
        }

        fetchLink()
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)

        const intervalId = setInterval(fetchLink, 30000)

        return () => {
            window.removeEventListener('online', updateOnlineStatus)
            window.removeEventListener('offline', updateOnlineStatus)
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div className={styles.container}>
            {!isOnline && (
                <p className={styles.offlineMessage}>
                    Вы сейчас офлайн. Отображается резервная ссылка.
                </p>
            )}
            {isLoading ? (
                <div className={styles.loadingContainer}>
                    <p className={styles.loadingText}>Загрузка динамического контента...</p>
                </div>
            ) : link ? (
                <div className={styles.linkContainer}>
                    <p className={styles.linkLabel}>Динамически загруженная ссылка:</p>
                    <a
                        href={link.url}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link.text}
                    </a>
                </div>
            ) : null}
        </div>
    )
}

