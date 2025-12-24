import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Download, RefreshCw, Wifi, WifiOff, Bell, BellOff, Smartphone, AppWindow } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

interface PWAInstallerProps {
  className?: string;
  showDetailed?: boolean;
}

export function PWAInstaller({ className = "", showDetailed = false }: PWAInstallerProps) {
  const {
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
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Auto-show install prompt after 30 seconds if not installed
    if (isInstallable && !isInstalled && !showInstallPrompt) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, showInstallPrompt]);

  const handleInstall = async () => {
    try {
      await install();
      setShowInstallPrompt(false);
    } catch (err) {
      console.error('Installation failed:', err);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await update();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        // Show a test notification
        await showNotification('TestNotifier', {
          body: 'Notifications are now enabled!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: 'test-notification',
          requireInteraction: false,
        });
      }
    } catch (err) {
      console.error('Notification permission failed:', err);
    }
  };

  const handleTestNotification = async () => {
    try {
      await showNotification('TestNotifier Alert', {
        body: 'This is a test notification from TestNotifier!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'test-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'view',
            title: 'View Dashboard',
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
          },
        ],
        data: {
          url: '/dashboard',
        },
      });
    } catch (err) {
      console.error('Test notification failed:', err);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading PWA features...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>
          PWA Error: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {/* Install Prompt Modal */}
      {showInstallPrompt && isInstallable && !isInstalled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AppWindow className="h-8 w-8 text-[#1d70b8]" />
                <div>
                  <CardTitle>Install TestNotifier</CardTitle>
                  <CardDescription>
                    Get instant notifications and faster access to your driving tests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Works offline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Push notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Faster loading</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-[#1d70b8] hover:bg-[#165a9f]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main PWA Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AppWindow className="h-6 w-6 text-[#1d70b8]" />
              <div>
                <CardTitle>Progressive Web App</CardTitle>
                <CardDescription>
                  Enhanced features for better performance
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isOffline ? (
                <Badge variant="destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              ) : (
                <Badge variant="success">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              )}
              {isInstalled && (
                <Badge variant="success">Installed</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Installation Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Installation Status</span>
              <Badge variant={isInstalled ? "success" : "secondary"}>
                {isInstalled ? "Installed" : "Not Installed"}
              </Badge>
            </div>

            {isInstallable && !isInstalled && (
              <Button
                onClick={handleInstall}
                className="w-full bg-[#1d70b8] hover:bg-[#165a9f]"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
          </div>

          {/* Update Status */}
          {updateAvailable && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Update Available</span>
                <Badge variant="warning">New Version</Badge>
              </div>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full"
                variant="outline"
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isUpdating ? "Updating..." : "Update Now"}
              </Button>
            </div>
          )}

          {/* Notification Settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Notifications</span>
              <Badge variant={canNotify ? "success" : "secondary"}>
                {canNotify ? (
                  <Bell className="h-3 w-3 mr-1" />
                ) : (
                  <BellOff className="h-3 w-3 mr-1" />
                )}
                {canNotify ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="flex space-x-2">
              {!canNotify ? (
                <Button
                  onClick={requestNotificationPermission}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Enable Notifications
                </Button>
              ) : (
                <Button
                  onClick={handleTestNotification}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Test Notification
                </Button>
              )}
            </div>
          </div>

          {/* Network Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network Status</span>
              <Badge variant={isOffline ? "destructive" : "success"}>
                {isOffline ? "Offline" : "Online"}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              {isOffline
                ? "You're currently offline. Some features may be limited."
                : "You're connected to the internet."
              }
            </div>
          </div>

          {/* Detailed Information */}
          {showDetailed && (
            <div className="space-y-3 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">App Status</div>
                  <div className="font-medium">
                    {isInstalled ? "Installed" : "Web Version"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Service Worker</div>
                  <div className="font-medium capitalize">
                    {pwaService.getStatus()}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Version: 1.0.0 • Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Alert */}
      {isOffline && (
        <Alert>
          <AlertDescription className="flex items-center">
            <WifiOff className="h-4 w-4 mr-2" />
            You're currently offline. The app will sync when you're back online.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default PWAInstaller;