import { useState, useEffect, useCallback } from 'react';
import { pwaService } from '../utils/pwa';

interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  canNotify: boolean;
  updateAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  install: () => Promise<void>;
  update: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
}

export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [canNotify, setCanNotify] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Initialize PWA
  useEffect(() => {
    const initializePWA = async () => {
      try {
        setIsLoading(true);

        // Register service worker
        await pwaService.register();

        // Check if PWA is installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInstalled = isStandalone || (window.navigator as any).standalone === true;
        setIsInstalled(isInstalled);

        // Check notification permission
        if ('Notification' in window) {
          setCanNotify(Notification.permission === 'granted');
        }

        // Set up update callback
        pwaService.register({
          onUpdate: () => {
            setUpdateAvailable(true);
          },
          onOffline: () => {
            setIsOffline(true);
          },
          onOnline: () => {
            setIsOffline(false);
          }
        });

        // Check for installability
        if ('BeforeInstallPromptEvent' in window) {
          setIsInstallable(true);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize PWA');
      } finally {
        setIsLoading(false);
      }
    };

    initializePWA();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Install app
  const install = useCallback(async () => {
    if (!deferredPrompt) {
      setError('No installation prompt available');
      return;
    }

    try {
      setIsLoading(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }

      setDeferredPrompt(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed');
    } finally {
      setIsLoading(false);
    }
  }, [deferredPrompt]);

  // Update service worker
  const update = useCallback(async () => {
    try {
      setIsLoading(true);
      await pwaService.updateServiceWorker();
      setUpdateAvailable(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    try {
      const permission = await pwaService.requestNotificationPermission();
      setCanNotify(permission === 'granted');
      return permission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permission request failed');
      return 'denied';
    }
  }, []);

  // Show notification
  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!canNotify) {
      setError('Notifications not permitted');
      return;
    }

    try {
      await pwaService.showNotification(title, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to show notification');
    }
  }, [canNotify]);

  return {
    isInstallable,
    isInstalled,
    isOffline,
    canNotify,
    updateAvailable,
    isLoading,
    error,
    install,
    update,
    requestNotificationPermission,
    showNotification,
  };
}

export default usePWA;