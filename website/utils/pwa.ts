import { Workbox } from 'workbox-window';

interface PWAConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

class PWAService {
  private wb: Workbox | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private config: PWAConfig = {};

  constructor(config: PWAConfig = {}) {
    this.config = config;
  }

  /**
   * Register the service worker
   */
  async register(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return;
    }

    try {
      this.wb = new Workbox('/service-worker.js');

      // Add event listeners
      this.wb.addEventListener('installed', (event) => {
        console.log('Service Worker installed');
        if (event.isUpdate) {
          console.log('Service Worker updated');
          this.showUpdateNotification();
        }
      });

      this.wb.addEventListener('waiting', (event) => {
        console.log('Service Worker waiting');
        this.showUpdateNotification();
      });

      this.wb.addEventListener('activated', (event) => {
        console.log('Service Worker activated');
        if (this.config.onSuccess) {
          this.config.onSuccess(this.registration!);
        }
      });

      this.wb.addEventListener('controlling', (event) => {
        console.log('Service Worker controlling');
        if (event.isUpdate && this.config.onUpdate) {
          this.config.onUpdate(this.registration!);
        }
      });

      // Register the service worker
      this.registration = await this.wb.register();
      console.log('Service Worker registered successfully');

      // Set up network status listeners
      this.setupNetworkStatusListeners();

      // Set up periodic background sync
      await this.setupPeriodicSync();

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TestNotifier Updated', {
        body: 'A new version is available. Refresh to get the latest features.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'update-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'refresh',
            title: 'Refresh Now'
          },
          {
            action: 'later',
            title: 'Later'
          }
        ]
      });
    }

    // Also show in-app notification
    if (this.config.onUpdate) {
      this.config.onUpdate(this.registration!);
    }
  }

  /**
   * Update the service worker
   */
  async updateServiceWorker(): Promise<void> {
    if (this.wb) {
      await this.wb.messageSkipWaiting();
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<void> {
    if (this.registration) {
      await this.registration.unregister();
      this.registration = null;
      this.wb = null;
      console.log('Service Worker unregistered');
    }
  }

  /**
   * Check for updates
   */
  async checkForUpdates(): Promise<void> {
    if (this.wb) {
      await this.wb.update();
    }
  }

  /**
   * Get service worker status
   */
  getStatus(): string {
    if (!this.registration) return 'not-registered';
    if (this.registration.installing) return 'installing';
    if (this.registration.waiting) return 'waiting';
    if (this.registration.active) return 'active';
    return 'unknown';
  }

  /**
   * Send message to service worker
   */
  async sendMessage(message: any): Promise<any> {
    if (!this.wb) return null;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.wb!.messageSW(message, [messageChannel.port2]);
    });
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkStatusListeners(): void {
    const handleOnline = () => {
      console.log('Application is online');
      if (this.config.onOnline) {
        this.config.onOnline();
      }

      // Sync any pending data
      this.sendMessage({ type: 'SYNC_PENDING_DATA' });
    };

    const handleOffline = () => {
      console.log('Application is offline');
      if (this.config.onOffline) {
        this.config.onOffline();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status
    if (navigator.onLine) {
      handleOnline();
    } else {
      handleOffline();
    }
  }

  /**
   * Setup periodic background sync
   */
  private async setupPeriodicSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('periodicSync' in registration) {
          const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName });
          if (status.state === 'granted') {
            await registration.periodicSync.register('check-test-availability', {
              minInterval: 24 * 60 * 60 * 1000, // 24 hours
            });
            console.log('Periodic background sync registered');
          }
        }
      } catch (error) {
        console.error('Periodic background sync failed:', error);
      }
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return 'denied';
    }
  }

  /**
   * Show notification
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      await self.registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'testnotifier-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        ...options,
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Cache API response
   */
  async cacheResponse(url: string, response: Response): Promise<void> {
    if (!this.registration) return;

    try {
      const cache = await caches.open('api-cache');
      await cache.put(url, response.clone());
    } catch (error) {
      console.error('Failed to cache response:', error);
    }
  }

  /**
   * Get cached response
   */
  async getCachedResponse(url: string): Promise<Response | undefined> {
    if (!this.registration) return undefined;

    try {
      const cache = await caches.open('api-cache');
      return await cache.match(url);
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return undefined;
    }
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }
}

// Export singleton instance
export const pwaService = new PWAService();

// Export types
export type { PWAConfig };

// Default export
export default PWAService;