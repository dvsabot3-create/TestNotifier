/**
 * Extension Download Button Component
 * Handles Chrome extension download and installation
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Download, Chrome, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ExtensionDownloadButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  source?: string;
}

export function ExtensionDownloadButton({
  variant = 'primary',
  size = 'lg',
  className = '',
  source = 'unknown',
}: ExtensionDownloadButtonProps) {
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [downloadMethod, setDownloadMethod] = useState<'chrome-store' | 'direct' | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EXTENSION_ID = 'testnotifier-dvsa-finder'; // Your extension ID
  const CHROME_STORE_URL = 'https://chrome.google.com/webstore/detail/testnotifier/' + EXTENSION_ID;
  const DIRECT_DOWNLOAD_URL = '/extensions/testnotifier-latest.crx';

  useEffect(() => {
    checkIfInstalled();
  }, []);

  /**
   * Check if extension is already installed
   */
  const checkIfInstalled = () => {
    try {
      // Try to communicate with extension
      if (window.chrome && window.chrome.runtime) {
        chrome.runtime.sendMessage(EXTENSION_ID, { action: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            setIsInstalled(false);
          } else {
            setIsInstalled(true);
          }
        });
      }
    } catch (e) {
      setIsInstalled(false);
    }
  };

  /**
   * Track download event
   */
  const trackDownload = (method: string) => {
    if (window.gtag) {
      window.gtag('event', 'extension_download_initiated', {
        event_category: 'extension',
        event_label: method,
        source: source,
      });
    }
  };

  /**
   * Handle Chrome Web Store installation
   */
  const handleChromeStoreInstall = () => {
    trackDownload('chrome_web_store');
    
    // Open Chrome Web Store in new tab
    window.open(CHROME_STORE_URL, '_blank');
    
    // Show instructions
    setDownloadMethod('chrome-store');
    setShowInstructions(true);
  };

  /**
   * Handle direct download (.crx file)
   */
  const handleDirectDownload = async () => {
    setIsDownloading(true);
    setError(null);
    trackDownload('direct_download');

    try {
      // Initiate download
      const response = await fetch(DIRECT_DOWNLOAD_URL);
      
      if (!response.ok) {
        throw new Error('Extension file not available');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'testnotifier-extension.crx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadMethod('direct');
      setShowInstructions(true);

    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download extension. Please try the Chrome Web Store instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Main click handler
   */
  const handleClick = () => {
    if (isInstalled) {
      // Extension already installed - show success message
      alert('TestNotifier extension is already installed!');
      return;
    }

    // Show installation options
    setShowInstructions(true);
  };

  if (isInstalled) {
    return (
      <Button
        variant="outline"
        className={`${className} border-green-500 text-green-600 hover:bg-green-50`}
        disabled
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        Extension Installed
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className={`
          ${className}
          ${variant === 'primary'
            ? 'bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white hover:opacity-90'
            : 'border-2 border-[#1d70b8] text-[#1d70b8] hover:bg-[#1d70b8] hover:text-white'
          }
          ${size === 'lg' ? 'px-8 py-4 text-lg' : size === 'md' ? 'px-6 py-3' : 'px-4 py-2 text-sm'}
          shadow-lg hover:shadow-xl transition-all duration-300
        `}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Chrome className="w-5 h-5 mr-2" />
            Install Extension Free
          </>
        )}
      </Button>

      {/* Installation Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] flex items-center justify-center">
                <Chrome className="w-6 h-6 text-white" />
              </div>
              Install TestNotifier Extension
            </DialogTitle>
            <DialogDescription>
              Choose your preferred installation method
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Chrome Web Store (Recommended) */}
            <div className="border-2 border-[#1d70b8] rounded-xl p-6 bg-blue-50/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1d70b8] flex items-center justify-center flex-shrink-0">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Chrome Web Store
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Install directly from Google's official store. Automatic updates included.
                  </p>
                  <Button
                    onClick={handleChromeStoreInstall}
                    className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Chrome Web Store
                  </Button>
                </div>
              </div>

              {downloadMethod === 'chrome-store' && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Click "Add to Chrome" on the Chrome Web Store page</li>
                    <li>Click "Add extension" in the popup</li>
                    <li>Wait for installation to complete</li>
                    <li>Click the extension icon in your browser toolbar</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Direct Download (Advanced) */}
            <div className="border-2 border-gray-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Direct Download
                    <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      Advanced
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download the .crx file and install manually. For advanced users only.
                  </p>
                  <Button
                    onClick={handleDirectDownload}
                    variant="outline"
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download .CRX File
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {downloadMethod === 'direct' && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Installation steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Open Chrome and go to <code className="bg-gray-100 px-2 py-1 rounded">chrome://extensions/</code></li>
                    <li>Enable "Developer mode" (toggle in top right)</li>
                    <li>Drag and drop the downloaded .crx file onto the page</li>
                    <li>Click "Add extension" in the confirmation dialog</li>
                    <li>Pin the extension to your toolbar for easy access</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Need help?</strong> Check our{' '}
              <a href="/help/extension-install" className="text-[#1d70b8] hover:underline">
                installation guide
              </a>
              {' '}or{' '}
              <a href="/contact" className="text-[#1d70b8] hover:underline">
                contact support
              </a>
              .
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExtensionDownloadButton;

