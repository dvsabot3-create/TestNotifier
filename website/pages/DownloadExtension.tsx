import { useEffect, useState } from 'react';
import { Download, Chrome, CheckCircle, AlertCircle } from 'lucide-react';

export function DownloadExtension() {
  const [user, setUser] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user') || localStorage.getItem('user_data');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  const getExtensionFile = (tier: string) => {
    switch (tier) {
      case 'professional':
        return {
          filename: 'testnotifier-extension-professional.zip',
          path: '/downloads/testnotifier-extension-professional.zip',
          name: 'Professional Edition'
        };
      case 'premium':
        return {
          filename: 'testnotifier-extension-final.zip',
          path: '/downloads/testnotifier-extension-final.zip',
          name: 'Premium Edition'
        };
      case 'starter':
        return {
          filename: 'testnotifier-extension.zip',
          path: '/downloads/testnotifier-extension.zip',
          name: 'Starter Edition'
        };
      case 'oneoff':
        return {
          filename: 'testnotifier-extension-simple.zip',
          path: '/downloads/testnotifier-extension-simple.zip',
          name: 'One-Off Edition'
        };
      default:
        return {
          filename: 'testnotifier-extension.zip',
          path: '/downloads/testnotifier-extension.zip',
          name: 'Free Edition'
        };
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    
    const tier = user?.subscription?.tier || 'free';
    const extensionFile = getExtensionFile(tier);

    // Create download link
    const link = document.createElement('a');
    link.href = extensionFile.path;
    link.download = extensionFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track download
    if (window.gtag) {
      window.gtag('event', 'extension_download', {
        event_category: 'extension',
        event_label: tier,
        value: 1
      });
    }

    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  const tier = user?.subscription?.tier || 'free';
  const extensionFile = getExtensionFile(tier);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Chrome className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download Chrome Extension
          </h1>
          <p className="text-xl text-gray-600">
            Get the TestNotifier extension for your subscription tier
          </p>
        </div>

        {/* Download Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {extensionFile.name}
              </h2>
              <p className="text-gray-600">
                Your subscription: <span className="font-semibold capitalize">{tier}</span>
              </p>
            </div>
            <Download className="w-16 h-16 text-blue-600 opacity-20" />
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download {extensionFile.filename}</span>
              </>
            )}
          </button>
        </div>

        {/* Installation Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Installation Steps
          </h3>
          <ol className="space-y-3 text-blue-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Extract the downloaded ZIP file to a folder</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Open Chrome and go to <code className="bg-white px-2 py-1 rounded">chrome://extensions</code></span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Enable "Developer mode" (toggle in top-right corner)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Click "Load unpacked" button</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">5.</span>
              <span>Select the extracted folder</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">6.</span>
              <span>Click on the extension icon to configure your settings</span>
            </li>
          </ol>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">What's Included in {extensionFile.name}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier === 'free' && (
              <>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Monitor 1 Test Center</p>
                    <p className="text-sm text-gray-600">Basic monitoring functionality</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Email Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when slots open</p>
                  </div>
                </div>
              </>
            )}
            {(tier === 'starter' || tier === 'oneoff') && (
              <>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Monitor Multiple Centers</p>
                    <p className="text-sm text-gray-600">Track up to 3 test centers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">SMS + Email Alerts</p>
                    <p className="text-sm text-gray-600">Dual notification system</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Auto-Refresh</p>
                    <p className="text-sm text-gray-600">Automatic monitoring</p>
                  </div>
                </div>
              </>
            )}
            {tier === 'premium' && (
              <>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Monitor 5 Test Centers</p>
                    <p className="text-sm text-gray-600">Expanded monitoring</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Rapid Mode (500ms)</p>
                    <p className="text-sm text-gray-600">Ultra-fast checking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Auto-Rebooking</p>
                    <p className="text-sm text-gray-600">Automatic slot booking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Priority Notifications</p>
                    <p className="text-sm text-gray-600">Instant SMS + Email</p>
                  </div>
                </div>
              </>
            )}
            {tier === 'professional' && (
              <>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unlimited Test Centers</p>
                    <p className="text-sm text-gray-600">Monitor any number of locations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Rapid Mode (100ms)</p>
                    <p className="text-sm text-gray-600">Fastest checking available</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Advanced Auto-Rebooking</p>
                    <p className="text-sm text-gray-600">Intelligent booking system</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">WhatsApp Alerts</p>
                    <p className="text-sm text-gray-600">SMS + Email + WhatsApp</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center space-x-2"
          >
            <span>← Back to Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default DownloadExtension;

