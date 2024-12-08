'use client'

import { useState, useEffect } from 'react'
import styles from './DynamicContent.module.css'

export default function DynamicContent() {
    const [link, setLink] = useState(null)
    const [isOnline, setIsOnline] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchLink = async () => {
        setIsLoading(true)
        setError(null)
        try {
            console.log('Attempting to fetch link...')
            const response = await fetch('http:/localhost:8000/api/link', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-store'
            })

            console.log('Response status:', response.status)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('Received data:', data)
            setLink(data)
        } catch (error) {
            console.error('Error fetching link:', error)
            setError(`Не удалось получить данные с сервера. Ошибка: ${error.message}`)
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

        // Слушаем сообщения от Service Worker
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'API_RESPONSE') {
                setLink(event.data.payload)
                setIsLoading(false)
            }
        }
        navigator.serviceWorker.addEventListener('message', handleMessage)

        const intervalId = setInterval(fetchLink, 30000)

        return () => {
            window.removeEventListener('online', updateOnlineStatus)
            window.removeEventListener('offline', updateOnlineStatus)
            navigator.serviceWorker.removeEventListener('message', handleMessage)
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
            {error && (
                <p className={styles.errorMessage}>{error}</p>
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

