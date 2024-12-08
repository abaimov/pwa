'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './DownloadBanner.module.css'

const DownloadBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [deviceType, setDeviceType] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  const hideBanner = useCallback(() => {
    setShowBanner(false)
  }, [])

  const handleInstallClick = useCallback(() => {
    if (deferredPrompt) {
      hideBanner()
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Пользователь установил PWA.')
        } else {
          console.log('Пользователь отказался установить PWA.')
        }
        setDeferredPrompt(null)
      })
    }
  }, [deferredPrompt, hideBanner])

  const getDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) return 'android';
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    return 'desktop';
  };

  const getInstructions = () => {
    switch (deviceType) {
      case 'android':
        return 'Нажмите на значок "Добавить на главный экран" в меню браузера';
      case 'ios':
        return 'Нажмите на значок "Поделиться" и выберите "На экран «Домой»"';
      default:
        return 'Установите наше PWA приложение для лучшего опыта';
    }
  };

  useEffect(() => {
    const checkPWAInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator.standalone === true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setShowBanner(true)
    }

    const handleAppInstalled = () => {
      console.log('PWA успешно установлено.')
      hideBanner()
    }

    setDeviceType(getDeviceType());

    if (!checkPWAInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [hideBanner])

  if (!showBanner) return null

  return (
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p className={styles.bannerText}>
            Установите наше PWA приложение для лучшего опыта!
          </p>
          <p className={styles.bannerInstructions}>{getInstructions()}</p>
        </div>
        {deferredPrompt && deviceType === 'android' && (
            <button
                className={styles.installButton}
                onClick={handleInstallClick}
            >
              Установить
            </button>
        )}
        <button
            className={styles.bannerClose}
            onClick={hideBanner}
            aria-label="Закрыть баннер"
        >
          &times;
        </button>
      </div>
  )
}

export default DownloadBanner

