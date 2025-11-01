import { Button } from "./ui/button";
import { Download, Chrome, Settings, FolderOpen, CheckCircle, AlertCircle, Info, Shield, Zap, Clock, Ban, RefreshCw, LifeBuoy, Camera, PlayCircle } from "lucide-react";

// Screenshot data structure for professional installation documentation
interface ScreenshotData {
  id: string;
  title: string;
  description: string;
  altText: string;
  scribeLink?: string;
  steps?: string[];
}

const installationScreenshots: ScreenshotData[] = [
  {
    id: 'chrome-version',
    title: 'Check Chrome Version',
    description: 'Verify you have Chrome 88 or later installed',
    altText: 'Chrome settings page showing version number',
    scribeLink: 'https://scribehow.com/shared/Check_Chrome_Version_for_TestNotifier__kYqQ',
    steps: ['Navigate to chrome://settings/help', 'Check version number', 'Update if needed']
  },
  {
    id: 'extensions-page',
    title: 'Open Chrome Extensions',
    description: 'Access the Chrome extensions management page',
    altText: 'Chrome extensions page with developer mode toggle',
    scribeLink: 'https://scribehow.com/shared/Open_Chrome_Extensions_Page__kYrR',
    steps: ['Type chrome://extensions/ in address bar', 'Or use menu: More Tools → Extensions']
  },
  {
    id: 'developer-mode',
    title: 'Enable Developer Mode',
    description: 'Toggle the developer mode switch in the top-right corner',
    altText: 'Chrome extensions page showing developer mode toggle switched on',
    scribeLink: 'https://scribehow.com/shared/Enable_Developer_Mode_in_Chrome__kYsS',
    steps: ['Find Developer mode toggle in top-right', 'Click to enable', 'Wait for UI to update']
  },
  {
    id: 'load-unpacked',
    title: 'Load Unpacked Extension',
    description: 'Click the "Load unpacked" button and select the extension folder',
    altText: 'Chrome extensions page showing Load unpacked button highlighted',
    scribeLink: 'https://scribehow.com/shared/Load_Unpacked_Extension_in_Chrome__kYtT',
    steps: ['Click "Load unpacked" button', 'Navigate to extracted folder', 'Select folder containing manifest.json']
  },
  {
    id: 'extension-verification',
    title: 'Verify Installation',
    description: 'Confirm the extension appears in your extensions list',
    altText: 'Chrome extensions page showing TestNotifier extension installed and enabled',
    scribeLink: 'https://scribehow.com/shared/Verify_TestNotifier_Extension_Installation__kYuU',
    steps: ['Check TestNotifier appears in list', 'Verify status shows "Enabled"', 'Note the version number']
  },
  {
    id: 'pin-extension',
    title: 'Pin Extension to Toolbar',
    description: 'Keep the TestNotifier extension easily accessible',
    altText: 'Chrome toolbar showing TestNotifier extension pinned with puzzle piece icon',
    scribeLink: 'https://scribehow.com/shared/Pin_TestNotifier_Extension_to_Toolbar__kYvV',
    steps: ['Click puzzle piece icon in toolbar', 'Find TestNotifier in list', 'Click pin icon']
  },
  {
    id: 'disable-extensions',
    title: 'Disable Conflicting Extensions',
    description: 'Temporarily disable ad blockers and privacy extensions',
    altText: 'Chrome extensions page showing uBlock Origin and Privacy Badger disabled',
    scribeLink: 'https://scribehow.com/shared/Disable_Conflicting_Extensions_for_TestNotifier__kYwW',
    steps: ['Identify conflicting extensions', 'Click toggle to disable temporarily', 'Refresh DVSA page after disabling']
  }
];

// Professional screenshot helper functions
export const ScreenshotHelper = {
  // Generate placeholder for screenshots during development
  generatePlaceholder: (id: string, title: string) => {
    return {
      src: `/assets/screenshots/installation/${id}-placeholder.png`,
      alt: title,
      className: 'w-full h-auto rounded-lg border-2 border-dashed border-gray-300'
    };
  },

  // Get Scribe link for interactive tutorial
  getScribeLink: (id: string) => {
    const screenshot = installationScreenshots.find(s => s.id === id);
    return screenshot?.scribeLink;
  },

  // Check if screenshot is available
  isScreenshotAvailable: (id: string) => {
    return installationScreenshots.some(s => s.id === id);
  }
};

export function InstallationGuide() {
  const handleDownloadClick = () => {
    // Download the extension zip file
    const link = document.createElement('a');
    link.href = '/downloads/testnotifier-extension.zip';
    link.download = 'testnotifier-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScreenshotDemo = () => {
    // Open Scribe tutorial for screenshot creation
    window.open('https://scribehow.com/shared/TestNotifier_Installation_Guide_Creation__kYxX', '_blank');
  };

// Screenshot Section Component
function ScreenshotSection({ screenshotId, title, description }: { screenshotId: string; title: string; description: string }) {
  const scribeLink = ScreenshotHelper.getScribeLink(screenshotId);
  const isAvailable = ScreenshotHelper.isScreenshotAvailable(screenshotId);

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-500" />
          {title}
        </h4>
        {isAvailable && (
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => scribeLink && window.open(scribeLink, '_blank')}
          >
            <PlayCircle className="w-4 h-4 mr-1" />
            View Tutorial
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {/* Screenshot Placeholder */}
      <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 mb-2">
          Screenshot will be captured here showing: {description}
        </p>
        <p className="text-xs text-gray-400">
          Use Scribe Chrome extension to automatically capture this step
        </p>
      </div>

      {isAvailable && (
        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>Interactive Tutorial Available:</strong> Click "View Tutorial" above to see this step in action with real screenshots
          </p>
        </div>
      )}
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#f8f9fa] py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm mb-6">
            <Download className="w-4 h-4 inline mr-2" />
            Extension Installation
          </div>
          <h1 className="text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Install TestNotifier Extension
          </h1>
          <p className="text-xl text-[#6c757d] max-w-3xl mx-auto">
            Follow these simple steps to install the TestNotifier Chrome extension and start monitoring for earlier test slots.
          </p>

          {/* Screenshot Demo Section */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Camera className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800">Interactive Installation Guide</h3>
              <PlayCircle className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-purple-700 mb-4">
              Prefer visual learning? We have created interactive step-by-step tutorials with screenshots for each installation step.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={handleScreenshotDemo}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                View Interactive Tutorial
              </Button>
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() => window.open('https://scribehow.com/library', '_blank')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Create Your Own Guide
              </Button>
            </div>
            <p className="text-sm text-purple-600 mt-3">
              💡 <strong>Pro Tip:</strong> Use Scribe Chrome extension to automatically capture screenshots while you install - perfect for creating documentation for your team or clients.
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl text-[#1d70b8] mb-4">Step 1: Download Extension</h2>
            <p className="text-[#6c757d] mb-6">
              Download the TestNotifier extension package (262KB)
            </p>
            <Button 
              onClick={handleDownloadClick}
              size="lg"
              className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Extension
            </Button>
            <p className="text-sm text-[#6c757d] mt-4">
              File will be saved to your Downloads folder
            </p>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl text-[#1d70b8] mb-3">Extract the ZIP File</h3>
                <p className="text-[#6c757d] mb-4">
                  Locate the downloaded file in your Downloads folder and extract it to a convenient location.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-mono">
                    📁 Downloads/testnotifier-extension.zip → Extract to → 📁 testnotifier-extension/
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-xl flex items-center justify-center flex-shrink-0">
                <Chrome className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-[#1d70b8] mb-3">Open Chrome Extensions</h3>
                <p className="text-[#6c757d] mb-4">
                  Navigate to Chrome's extension management page.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Method 1:</strong> Type <code className="bg-blue-100 px-2 py-1 rounded">chrome://extensions/</code> in your address bar
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Method 2:</strong> Chrome Menu → More Tools → Extensions
                  </p>
                </div>

                {/* Screenshot for this step */}
                <ScreenshotSection
                  screenshotId="extensions-page"
                  title="Chrome Extensions Page"
                  description="This is what the Chrome extensions management page looks like. You'll see all your installed extensions here."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ffc107] to-[#ff8c00] rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-[#1d70b8] mb-3">Enable Developer Mode</h3>
                <p className="text-[#6c757d] mb-4">
                  Toggle the "Developer mode" switch in the top-right corner of the extensions page.
                </p>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    <strong>Important:</strong> This allows you to load unpacked extensions
                  </p>
                </div>

                {/* Screenshot for Developer Mode */}
                <ScreenshotSection
                  screenshotId="developer-mode"
                  title="Developer Mode Toggle"
                  description="This shows the Developer mode switch in the top-right corner of the Chrome extensions page. Toggle this on to enable loading unpacked extensions."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-xl flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-[#1d70b8] mb-3">Load Unpacked Extension</h3>
                <p className="text-[#6c757d] mb-4">
                  Click "Load unpacked" and select the extracted extension folder.
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    <strong>Select:</strong> The folder containing manifest.json (not the ZIP file)
                  </p>
                </div>

                {/* Screenshot for Load Unpacked */}
                <ScreenshotSection
                  screenshotId="load-unpacked"
                  title="Load Unpacked Extension"
                  description="This shows the 'Load unpacked' button that appears after enabling Developer Mode. Click this and select the extracted extension folder containing the manifest.json file."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-[#1d70b8] mb-3">Verify Installation</h3>
                <p className="text-[#6c757d] mb-4">
                  The TestNotifier extension should now appear in your extensions list and Chrome toolbar.
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    <strong>Success!</strong> You should see the TestNotifier icon in your Chrome toolbar
                  </p>
                </div>

                {/* Screenshot for Extension Verification */}
                <ScreenshotSection
                  screenshotId="extension-verification"
                  title="Extension Verification"
                  description="This shows the TestNotifier extension successfully installed and enabled in your Chrome extensions list. Check that it appears and shows as 'Enabled'."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#17a2b8] to-[#20c997] rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-[#1d70b8] mb-3">Pin Extension to Toolbar</h3>
                <p className="text-[#6c757d] mb-4">
                  Keep the TestNotifier extension easily accessible by pinning it to your Chrome toolbar.
                </p>
                <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-cyan-800">
                    <strong>Step 1:</strong> Click the puzzle piece icon in your Chrome toolbar
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-cyan-800">
                    <strong>Step 2:</strong> Find TestNotifier in the extensions list
                  </p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4">
                  <p className="text-sm text-cyan-800">
                    <strong>Step 3:</strong> Click the pin icon next to TestNotifier
                  </p>
                </div>

                {/* Screenshot for Pin Extension */}
                <ScreenshotSection
                  screenshotId="pin-extension"
                  title="Pin Extension to Toolbar"
                  description="This shows how to pin the TestNotifier extension to your Chrome toolbar using the puzzle piece icon, making it easily accessible for monitoring test slots."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility & Requirements */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl text-[#1d70b8] mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Compatibility & Requirements
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* System Requirements */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Chrome className="w-5 h-5 text-blue-500" />
                  Browser Requirements
                </h4>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span><strong>Chrome 88+</strong> (Recommended: Latest version)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-500" />
                      <span><strong>Not compatible</strong> with Firefox, Safari, Edge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>Manifest V3 support required</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Performance Requirements
                </h4>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Stable internet connection (broadband recommended)</li>
                    <li>• Minimum 4GB RAM</li>
                    <li>• Windows 10+, macOS 10.14+, or Linux</li>
                    <li>• Chrome must be your primary browser</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-500" />
                  Known Incompatibilities
                </h4>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>• <strong>Popup blockers</strong> - Must be disabled for DVSA site</li>
                    <li>• <strong>Ad blockers</strong> - May interfere with monitoring</li>
                    <li>• <strong>VPN extensions</strong> - Can cause connection issues</li>
                    <li>• <strong>Privacy extensions</strong> - May block necessary scripts</li>
                    <li>• <strong>Corporate networks</strong> - Firewall restrictions apply</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Pre-Installation Checklist
                </h4>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <ol className="text-sm text-orange-700 space-y-2 list-decimal list-inside">
                    <li>Update Chrome to latest version</li>
                    <li>Disable popup blockers temporarily</li>
                    <li>Pause ad-blocking extensions</li>
                    <li>Ensure stable internet connection</li>
                    <li>Close unnecessary Chrome tabs</li>
                    <li>Have DVSA login credentials ready</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Warning */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800 mb-1">Critical: Extension Permissions</h5>
                <p className="text-sm text-yellow-700">
                  This extension requires access to the DVSA website to monitor test slots.
                  You must allow all requested permissions for the extension to function properly.
                  Denying permissions will prevent the extension from working.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl text-[#1d70b8] mb-6 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-red-500" />
            Common Installation Issues
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Technical Issues */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <h4 className="font-semibold text-gray-800 mb-3 text-red-700">Extension Won't Load</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Developer Mode:</strong> Must be enabled in chrome://extensions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Folder Selection:</strong> Select the extracted folder, not the ZIP file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>manifest.json:</strong> Must be in the selected folder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Chrome Version:</strong> Update to latest Chrome version</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <h4 className="font-semibold text-gray-800 mb-3 text-orange-700">Extension Disappears</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Check if Chrome updated (may disable developer extensions)</li>
                  <li>• Re-enable Developer Mode in chrome://extensions</li>
                  <li>• Click "Load unpacked" again with the same folder</li>
                  <li>• Pin extension to toolbar again</li>
                </ul>
              </div>
            </div>

            {/* Browser Issues */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h4 className="font-semibold text-gray-800 mb-3 text-yellow-700">Popup Blockers & Extensions</h4>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800 font-medium mb-1"><strong>Critical:</strong> Disable these before installation:</p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Ad blockers (uBlock Origin, AdBlock Plus)</li>
                      <li>• Privacy extensions (Privacy Badger, Ghostery)</li>
                      <li>• Popup blockers (built-in Chrome or extensions)</li>
                      <li>• Script blockers (NoScript)</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>How to disable:</strong> Click extension icon → "Pause on this site" → Refresh DVSA page
                  </p>

                  {/* Screenshot for disabling conflicting extensions */}
                  <ScreenshotSection
                    screenshotId="disable-extensions"
                    title="Disable Conflicting Extensions"
                    description="This shows how to disable ad blockers, privacy extensions, and other conflicting browser extensions that may interfere with TestNotifier functionality."
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 text-blue-700">Permission Issues</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Allow all extension permissions when prompted</li>
                  <li>• Grant access to dvsa.gov.uk domains</li>
                  <li>• Enable notifications for alert functionality</li>
                  <li>• Check Chrome Settings → Privacy → Site Settings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Fix Actions */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Quick Fix Checklist
            </h5>
            <div className="grid md:grid-cols-2 gap-4">
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Restart Chrome completely</li>
                <li>Clear browser cache & cookies</li>
                <li>Disable conflicting extensions</li>
                <li>Check internet connection</li>
              </ol>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside" start="5">
                <li>Update Chrome to latest version</li>
                <li>Re-load extension from folder</li>
                <li>Pin extension to toolbar</li>
                <li>Test on DVSA website</li>
              </ol>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <LifeBuoy className="w-4 h-4" />
              Still Need Help?
            </h5>
            <p className="text-sm text-green-700 mb-2">
              Contact our support team with your specific issue:
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="mailto:hello@testnotifier.co.uk" className="text-green-600 hover:text-green-800 underline">
                📧 hello@testnotifier.co.uk
              </a>
              <span className="text-green-600">• Response within 2 hours (business hours)</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-gradient-to-r from-[#1d70b8]/5 to-[#2e8bc0]/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl text-[#1d70b8] mb-4">What's Next?</h3>
          <p className="text-[#6c757d] mb-6">
            Once installed, click the TestNotifier icon to set up your monitoring preferences and start tracking test slots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownloadClick}
              className="bg-[#1d70b8] hover:bg-[#2e8bc0] text-white"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Extension
            </Button>
            <Button 
              variant="outline"
              className="border-[#1d70b8] text-[#1d70b8] hover:bg-[#1d70b8]/5"
            >
              <Info className="w-5 h-5 mr-2" />
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

