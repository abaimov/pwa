'use client';

import { useState, useEffect } from 'react';
import styles from './DynamicContent.module.css';

export default function DynamicContent() {
    const [link, setLink] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для генерации случайных данных
    const generateRandomData = () => {
        const randomId = Math.floor(Math.random() * 1000);
        return {
            url: `https://example.com/${randomId}`,
            text: `Случайная ссылка №${randomId}`,
        };
    };

    // Функция для получения данных с сервера
    const fetchDataFromServer = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://pwa-three-wheat1.vercel.app/api/link');
            if (!response.ok) {
                throw new Error('Ошибка при получении данных с сервера');
            }
            const data = await response.json();
            setLink(data);
            setError(null);
            setIsLoading(true)
        } catch (err) {
            setError(err.message);
            setLink(generateRandomData()); // Если ошибка, возвращаем случайные данные
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Функция для отслеживания состояния онлайн/офлайн
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        // Обработчик сообщений от service worker
        const handleMessage = (event) => {
            console.log('Сообщение от service worker:', event.data);  // Логирование
            if (event.data && event.data.type === 'SERVER_DATA') {
                if (event.data.payload?.error) {
                    setError(event.data.payload.error);
                } else {
                    setLink(event.data.payload);
                    setError(null);
                }
                setIsLoading(false);
            }
        };

        // Запрос данных с сервера
        fetchDataFromServer();

        // Добавление слушателей событий для изменения состояния онлайн/офлайн
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        navigator.serviceWorker.addEventListener('message', handleMessage);

        // Обновление данных с интервалом каждые 30 секунд
        const intervalId = setInterval(fetchDataFromServer, 30000);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
            navigator.serviceWorker.removeEventListener('message', handleMessage);
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className={styles.container}>
            {!isOnline && (
                <p className={styles.offlineMessage}>
                    Вы сейчас офлайн. Отображается последняя доступная информация.
                </p>
            )}
            {/*{error && (*/}
            {/*    <p className={styles.errorMessage}>{error}</p>*/}
            {/*)}*/}
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
    );
}
