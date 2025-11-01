import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Chrome, Download, CheckCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface DownloadStep {
  id: number;
  title: string;
  description: string;
  action?: string;
  completed: boolean;
}

interface DownloadFlowProps {
  onComplete?: () => void;
  source?: string;
}

export function DownloadFlow({ onComplete, source }: DownloadFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInstalling, setIsInstalling] = useState(false);
  const [extensionDetected, setExtensionDetected] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAlternativeDownload, setShowAlternativeDownload] = useState(false);

  const trackEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel
      });
    }
  };

  const downloadSteps: DownloadStep[] = [
    {
      id: 1,
      title: "Add to Chrome",
      description: "Click the button below to open the Chrome Web Store",
      action: "install",
      completed: currentStep > 1
    },
    {
      id: 2,
      title: "Install Extension",
      description: "Click 'Add to Chrome' in the Chrome Web Store",
      completed: currentStep > 2
    },
    {
      id: 3,
      title: "Pin Extension",
      description: "Pin the extension to your browser toolbar for easy access",
      completed: currentStep > 3
    },
    {
      id: 4,
      title: "Start Monitoring",
      description: "Configure your test preferences and start monitoring for cancellations",
      completed: currentStep > 4
    }
  ];

  const handleInstallClick = () => {
    trackEvent('download_install_click', 'download_flow', source || 'unknown');
    setIsInstalling(true);
    setCurrentStep(2);

    // Open Chrome Web Store
    window.open('https://chrome.google.com/webstore/detail/testnotifier/dvsa-test-cancellation-alerts', '_blank');

    // Simulate installation process
    setTimeout(() => {
      setCurrentStep(3);
      trackEvent('download_install_started', 'download_flow', 'chrome_webstore_opened');
    }, 2000);
  };

  const handleExtensionDetected = () => {
    setExtensionDetected(true);
    setCurrentStep(4);
    trackEvent('download_extension_detected', 'download_flow', 'extension_installed');

    // Wait a moment then complete
    setTimeout(() => {
      setCurrentStep(5);
      trackEvent('download_flow_complete', 'conversion', 'installation_successful');
      if (onComplete) onComplete();
    }, 2000);
  };

  const copyDownloadLink = async () => {
    try {
      const downloadLink = 'https://chrome.google.com/webstore/detail/testnotifier/dvsa-test-cancellation-alerts';
      await navigator.clipboard.writeText(downloadLink);
      setCopiedLink(true);
      trackEvent('download_link_copied', 'download_flow', 'manual_link_copy');

      setTimeout(() => setCopiedLink(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleAlternativeDownload = () => {
    setShowAlternativeDownload(true);
    trackEvent('alternative_download_shown', 'download_flow', 'manual_install_requested');
  };

  const downloadCRXFile = () => {
    trackEvent('crx_download_click', 'download_flow', 'manual_crx_download');
    window.open('/api/download/extension', '_blank');
  };

  // Check for extension periodically
  useEffect(() => {
    const checkExtension = () => {
      if (window.chrome && chrome.runtime) {
        chrome.runtime.sendMessage('testnotifier-extension-id', { action: 'ping' }, (response) => {
          if (response && response.success) {
            handleExtensionDetected();
          }
        });
      }
    };

    const interval = setInterval(checkExtension, 3000);
    return () => clearInterval(interval);
  }, []);

  const progress = (currentStep - 1) * 25;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Installation Progress</h3>
            <p className="text-sm text-gray-600">Step {currentStep} of {downloadSteps.length}</p>
          </div>
          <Badge variant="outline" className="border-[#1d70b8] text-[#1d70b8]">
            <Chrome className="w-4 h-4 mr-1" />
            Chrome Extension
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Installation steps */}
      <div className="space-y-4">
        {downloadSteps.map((step) => (
          <Card
            key={step.id}
            className={`transition-all duration-300 ${
              currentStep === step.id
                ? 'border-[#1d70b8] shadow-lg scale-105'
                : step.completed
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-200'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.completed
                        ? 'bg-green-100 text-green-700'
                        : currentStep === step.id
                          ? 'bg-[#1d70b8] text-white'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
                {step.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{step.description}</CardDescription>

              {currentStep === step.id && step.action === 'install' && !extensionDetected && (
                <div className="mt-4 space-y-3">
                  <Button
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="w-full bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:from-[#1d70b8]/90 hover:to-[#2e8bc0]/90 text-white"
                  >
                    {isInstalling ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Opening Chrome Web Store...
                      </>
                    ) : (
                      <>
                        <Chrome className="w-5 h-5 mr-2" />
                        Add to Chrome
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleAlternativeDownload}
                    className="w-full border-gray-300 text-gray-700 hover:border-gray-400"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Manual Installation
                  </Button>
                </div>
              )}

              {currentStep === step.id && step.id === 3 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Pin the Extension</p>
                      <p>Click the puzzle piece icon in your Chrome toolbar, then click the pin icon next to TestNotifier.</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleExtensionDetected}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    I've Pinned the Extension
                  </Button>
                </div>
              )}

              {currentStep === step.id && step.id === 4 && (
                <div className="mt-4 space-y-3">
                  <Button
                    onClick={() => {
                      trackEvent('dashboard_access_click', 'download_flow', 'setup_complete');
                      window.location.href = '/dashboard';
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      trackEvent('extension_help_click', 'download_flow', 'need_help');
                      window.open('/help/getting-started', '_blank');
                    }}
                    className="w-full border-gray-300 text-gray-700 hover:border-gray-400"
                  >
                    Need Help Getting Started?
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alternative download section */}
      {showAlternativeDownload && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Manual Installation
            </CardTitle>
            <CardDescription className="text-orange-800">
              For users who prefer manual installation or have Chrome Web Store restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={copyDownloadLink}
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:border-orange-400 hover:bg-orange-100"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Chrome Web Store Link
                  </>
                )}
              </Button>

              <Button
                onClick={downloadCRXFile}
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:border-orange-400 hover:bg-orange-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CRX File (Advanced)
              </Button>
            </div>

            <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Manual Installation Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Download the CRX file</li>
                    <li>Open Chrome and go to chrome://extensions/</li>
                    <li>Enable "Developer mode"</li>
                    <li>Drag and drop the CRX file into the extensions page</li>
                    <li>Click "Add extension" when prompted</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support section */}
      <Card className="bg-gradient-to-r from-[#1d70b8]/5 to-[#2e8bc0]/5 border-[#1d70b8]/20">
        <CardHeader>
          <CardTitle className="text-[#1d70b8] flex items-center gap-2">
            Need Help?
          </CardTitle>
          <CardDescription>
            Our support team is here to help you get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={() => {
              trackEvent('support_chat_click', 'download_flow', 'live_support');
              // Implement chat widget
              if (window.Tawk_API) {
                window.Tawk_API.showWidget();
                window.Tawk_API.maximize();
              }
            }}
            className="w-full border-[#1d70b8]/30 text-[#1d70b8] hover:border-[#1d70b8] hover:bg-[#1d70b8]/5"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Chat Support
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              trackEvent('support_email_click', 'download_flow', 'email_support');
              window.location.href = 'mailto:support@testnotifier.co.uk?subject=Installation Help';
            }}
            className="w-full border-[#1d70b8]/30 text-[#1d70b8] hover:border-[#1d70b8] hover:bg-[#1d70b8]/5"
          >
            Email Support Team
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Add global type declarations
declare global {
  interface Window {
    chrome?: any;
    Tawk_API?: any;
  }
}