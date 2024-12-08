'use client'
import { useState, useEffect, useCallback } from 'react';
import styles from './DownloadBanner.module.css';

const DownloadBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deviceType, setDeviceType] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const hideBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const handleInstallClick = useCallback(() => {
    if (deferredPrompt) {
      hideBanner();
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Пользователь установил PWA.');
        } else {
          console.log('Пользователь отказался установить PWA.');
        }
        setDeferredPrompt(null);
      });
    }
  }, [deferredPrompt, hideBanner]);

  useEffect(() => {
    const checkPWAInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      if (window.navigator.standalone === true) {
        return true;
      }
      return false;
    };

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA успешно установлено.');
      hideBanner();
    };

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isWindows = ua.indexOf('win') > -1;
    const isMac = ua.indexOf('mac') > -1;

    if (isAndroid) {
      setDeviceType('android');
    } else if (isIOS) {
      setDeviceType('ios');
    } else if (isWindows) {
      setDeviceType('windows');
    } else if (isMac) {
      setDeviceType('mac');
    }

    if (!checkPWAInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [hideBanner]);

  if (!showBanner) return null;

  const getInstructions = () => {
    switch (deviceType) {
      case 'android':
        return 'Нажмите кнопку "Установить" для добавления приложения на главный экран';
      case 'ios':
        return 'Нажмите на значок "Поделиться" и выберите "На экран «Домой»"';
      case 'windows':
      case 'mac':
        return 'Нажмите кнопку "Установить" для установки приложения';
      default:
        return 'Установите наше PWA приложение для лучшего опыта';
    }
  };

  return (
      <div className={styles.banner}>
        <p className={styles.bannerText}>
          Установите наше PWA приложение для лучшего опыта!
        </p>
        <p className={styles.bannerInstructions}>{getInstructions()}</p>
        {deferredPrompt && (
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
  );
};

export default DownloadBanner;

