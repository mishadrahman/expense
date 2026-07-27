import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isIframe: boolean;
  hasUpdate: boolean;
  promptInstall: () => Promise<boolean>;
  updateApp: () => void;
  dismissInstallBanner: () => void;
  isBannerDismissed: boolean;
}

const PWAContext = createContext<PWAContextType | null>(null);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    return localStorage.getItem('pwa_install_banner_dismissed') === 'true';
  });

  const {
    needRefresh: [hasUpdate],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('[PWA] SW registration error', error);
    },
  });

  // Check standalone mode and iOS environment
  useEffect(() => {
    setIsIframe(window.self !== window.top);

    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
      if (isStandaloneMode) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      if (e.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);

  // Listen for beforeinstallprompt and appinstalled events
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      console.log('[PWA] beforeinstallprompt event captured');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] App successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger Install Prompt
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('[PWA] No deferred prompt available');
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', choiceResult.outcome);
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[PWA] Error prompting installation:', err);
      return false;
    }
  }, [deferredPrompt]);

  // Trigger app update
  const updateApp = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  const dismissInstallBanner = useCallback(() => {
    setIsBannerDismissed(true);
    localStorage.setItem('pwa_install_banner_dismissed', 'true');
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isStandalone,
        isIOS,
        isIframe,
        hasUpdate,
        promptInstall,
        updateApp,
        dismissInstallBanner,
        isBannerDismissed,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
