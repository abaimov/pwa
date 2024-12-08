'use client'

import { useState, useEffect } from 'react'



export default function DynamicContent() {
    const [link, setLink] = useState(null)
    const [isOnline, setIsOnline] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLink = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('http://localhost:8000/api/link', {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
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

        return () => {
            window.removeEventListener('online', updateOnlineStatus)
            window.removeEventListener('offline', updateOnlineStatus)
        }
    }, [])

    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-bold mb-4">Динамический контент</h2>
            {!isOnline && (
                <p className="text-yellow-600 mb-2">Вы сейчас офлайн. Отображается резервная ссылка.</p>
            )}
            {isLoading ? (
                <p>Загрузка динамического контента...</p>
            ) : link ? (
                <a
                    href={link.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {link.text}
                </a>
            ) : null}
        </div>
    )
}

