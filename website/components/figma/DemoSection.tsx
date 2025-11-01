import { PlayCircle, Zap, Bell, MousePointerClick, CheckCircle, Camera, Download, Chrome, Settings, FolderOpen, AlertCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function DemoSection() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const installationSteps = [
    {
      id: 'chrome-version',
      icon: Chrome,
      title: 'Check Chrome Version',
      shortDesc: 'Verify Chrome 88+ compatibility',
      color: 'from-green-500 to-emerald-500',
      detailedInfo: {
        requirement: 'Chrome Version 88 or higher required',
        howToCheck: '1. Click three dots (⋮) in Chrome\n2. Help → About Google Chrome\n3. Version number shown at top',
        commonIssues: '• Update Chrome if version < 88\n• Restart browser after update\n• Chromium-based browsers (Edge, Brave) also work',
        tip: 'Most users already have compatible version'
      }
    },
    {
      id: 'extensions-page',
      icon: Settings,
      title: 'Open Extensions Page',
      shortDesc: 'Navigate to chrome://extensions/',
      color: 'from-blue-500 to-cyan-500',
      detailedInfo: {
        requirement: 'Access Chrome Extensions management',
        howToCheck: '1. Type chrome://extensions in address bar\n2. Or: Menu → Extensions → Manage Extensions\n3. Or: Right-click extension icon → Manage',
        commonIssues: '• Must type exact URL with colon (://)\n• Some corporate networks block extensions page\n• Use Menu method if URL blocked',
        tip: 'Bookmark this page for easy access'
      }
    },
    {
      id: 'developer-mode',
      icon: Zap,
      title: 'Enable Developer Mode',
      shortDesc: 'Toggle developer mode switch',
      color: 'from-yellow-500 to-orange-500',
      detailedInfo: {
        requirement: 'Developer Mode must be ON',
        howToCheck: '1. Find toggle switch in top-right corner\n2. Says "Developer mode"\n3. Click to turn blue/ON',
        commonIssues: '• If missing, Chrome version too old\n• Corporate policy may block this\n• Must be ON to load unpacked extensions',
        tip: 'You\'ll see "Pack extension" and "Load unpacked" appear when enabled'
      }
    },
    {
      id: 'load-unpacked',
      icon: FolderOpen,
      title: 'Load Unpacked Extension',
      shortDesc: 'Select the extension folder',
      color: 'from-purple-500 to-pink-500',
      detailedInfo: {
        requirement: 'Select correct folder with manifest.json',
        howToCheck: '1. Click "Load unpacked" button\n2. Navigate to downloaded extension folder\n3. Select the FOLDER (not a zip file)\n4. Click "Select Folder"',
        commonIssues: '• Don\'t select individual files\n• Don\'t select parent folder\n• Folder must contain manifest.json\n• Unzip first if downloaded as .zip',
        tip: 'Look for folder icon named "testnotifier-extension"'
      }
    },
    {
      id: 'extension-verification',
      icon: CheckCircle,
      title: 'Verify Installation',
      shortDesc: 'Confirm extension is enabled',
      color: 'from-green-500 to-teal-500',
      detailedInfo: {
        requirement: 'Extension card visible and toggle ON',
        howToCheck: '1. Extension card appears in list\n2. Toggle switch is blue/ON\n3. No error messages shown\n4. Icon visible in toolbar',
        commonIssues: '• Red errors = manifest.json issues\n• "Disabled" = click toggle to enable\n• Missing icon = pin it manually\n• "Corrupted" = re-download extension',
        tip: 'Click "Details" to see permissions and version'
      }
    },
    {
      id: 'pin-extension',
      icon: Download,
      title: 'Pin to Toolbar',
      shortDesc: 'Keep extension accessible',
      color: 'from-indigo-500 to-purple-500',
      detailedInfo: {
        requirement: 'Extension icon pinned to browser toolbar',
        howToCheck: '1. Click puzzle piece icon in toolbar\n2. Find TestNotifier in list\n3. Click pin icon next to it\n4. Icon moves to main toolbar',
        commonIssues: '• If hidden, check puzzle piece menu\n• Too many extensions? Unpin others\n• Icon not showing? Extension may be disabled',
        tip: 'Pinned extensions are always visible for quick access'
      }
    },
    {
      id: 'avoid-popups',
      icon: AlertCircle,
      title: 'Important: Avoid Popup Blockers',
      shortDesc: 'Disable popup blockers for DVSA site',
      color: 'from-red-500 to-pink-500',
      detailedInfo: {
        requirement: 'Allow popups from driving-tests-manage-booking.service.gov.uk',
        howToCheck: '1. Visit DVSA site\n2. Look for blocked popup icon in address bar\n3. Click "Always allow popups"\n4. Refresh the page',
        commonIssues: '• Popup blockers prevent booking\n• Must whitelist exact DVSA domain\n• Some extensions block popups too\n• Test by clicking a test slot',
        tip: 'CRITICAL: Extension cannot work with popup blockers active'
      }
    }
  ];

  return (
    <section className="demo-section relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(46,139,192,0.08),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="demo-badge inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-purple-700 text-sm mb-6">
            <Camera className="w-4 h-4" />
            <span>Installation Guide</span>
          </div>
          <h2 className="demo-title text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            Setup in 5 Minutes
            <span className="block text-[#1d70b8] demo-subtitle">Step-by-Step Instructions</span>
          </h2>
          <p className="demo-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hover over each step for detailed instructions, Chrome version requirements, and troubleshooting tips
          </p>
        </div>

        {/* Installation Steps Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installationSteps.map((step, index) => (
              <div 
                key={step.id} 
                className="group relative"
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Main Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-[#1d70b8] hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-200">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Content */}
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1d70b8] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {step.shortDesc}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#1d70b8] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-4 h-4" />
                    <span>Hover for detailed instructions</span>
                  </div>
                </div>

                {/* Detailed Tooltip on Hover */}
                {hoveredStep === step.id && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-2 p-6 bg-white rounded-2xl shadow-2xl border-2 border-[#1d70b8] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      {/* Requirement */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-sm text-gray-900">Requirement:</span>
                        </div>
                        <p className="text-sm text-gray-700 pl-6">{step.detailedInfo.requirement}</p>
                      </div>

                      {/* How To */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MousePointerClick className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-sm text-gray-900">How To:</span>
                        </div>
                        <pre className="text-xs text-gray-700 pl-6 whitespace-pre-line font-sans">{step.detailedInfo.howToCheck}</pre>
                      </div>

                      {/* Common Issues */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-bold text-sm text-gray-900">Common Issues:</span>
                        </div>
                        <pre className="text-xs text-gray-700 pl-6 whitespace-pre-line font-sans">{step.detailedInfo.commonIssues}</pre>
                      </div>

                      {/* Pro Tip */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-blue-900">Pro Tip: </span>
                            <span className="text-xs text-blue-800">{step.detailedInfo.tip}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Button - Link to Pricing */}
          <div className="flex justify-center mt-12">
            <Button
              onClick={() => window.location.href = '#pricing'}
              size="lg"
              className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl text-lg px-12"
            >
              <Chrome className="w-5 h-5 mr-2" />
              View Pricing & Get Extension
            </Button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              step: '01',
              title: 'Slot Detected',
              description: 'Extension detects availability',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Bell,
              step: '02',
              title: 'Instant Alert',
              description: 'You get SMS + email notification',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: MousePointerClick,
              step: '03',
              title: 'One-Click Book',
              description: 'Auto-fill and instant booking',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: CheckCircle,
              step: '04',
              title: 'Confirmed!',
              description: 'Earlier date secured successfully',
              color: 'from-green-500 to-teal-500'
            }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-300 mb-2">{item.step}</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
