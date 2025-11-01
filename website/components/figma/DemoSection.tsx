import { PlayCircle, Zap, Bell, MousePointerClick, CheckCircle, Camera, Download, Chrome, Settings, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";
import { ScreenshotHelper } from "./InstallationGuide";

export function DemoSection() {
  const handleScreenshotDemo = () => {
    // Open Scribe tutorial for screenshot creation
    window.open('https://scribehow.com/shared/TestNotifier_Installation_Guide_Creation__kYxX', '_blank');
  };

  const handleViewInstallationGuide = () => {
    // Navigate to installation guide or scroll to it
    window.open('/install', '_blank');
  };

  return (
    <section className="demo-section relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(46,139,192,0.08),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="demo-badge inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-purple-700 text-sm mb-6">
            <Camera className="w-4 h-4" />
            <span>See Installation Steps</span>
          </div>
          <h2 className="demo-title text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            From Setup to Success
            <span className="block text-[#1d70b8] demo-subtitle">In Under 5 Minutes</span>
          </h2>
          <p className="demo-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our step-by-step visual guide to install TestNotifier and start monitoring for test slots
          </p>
        </div>

        {/* Screenshot Gallery Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
            {/* Gallery Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-6 py-3 mb-4">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">7-Step Installation Guide</span>
                <PlayCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-3xl text-gray-900 mb-3">
                Visual Installation Process
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Click any step below to view interactive screenshots and detailed instructions
              </p>
            </div>

            {/* Screenshot Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'chrome-version',
                  icon: Chrome,
                  title: 'Check Chrome Version',
                  description: 'Verify Chrome 88+ compatibility',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  id: 'extensions-page',
                  icon: Settings,
                  title: 'Open Extensions Page',
                  description: 'Navigate to chrome://extensions/',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  id: 'developer-mode',
                  icon: Zap,
                  title: 'Enable Developer Mode',
                  description: 'Toggle developer mode switch',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  id: 'load-unpacked',
                  icon: FolderOpen,
                  title: 'Load Unpacked Extension',
                  description: 'Select the extension folder',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  id: 'extension-verification',
                  icon: CheckCircle,
                  title: 'Verify Installation',
                  description: 'Confirm extension is enabled',
                  color: 'from-green-500 to-teal-500'
                },
                {
                  id: 'pin-extension',
                  icon: Download,
                  title: 'Pin to Toolbar',
                  description: 'Keep extension accessible',
                  color: 'from-indigo-500 to-purple-500'
                }
              ].map((step, index) => {
                const scribeLink = ScreenshotHelper.getScribeLink(step.id);
                const isAvailable = ScreenshotHelper.isScreenshotAvailable(step.id);

                return (
                  <div key={step.id} className="group cursor-pointer" onClick={() => scribeLink && window.open(scribeLink, '_blank')}>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      {/* Step Number */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center`}>
                          <step.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-200">{String(index + 1).padStart(2, '0')}</span>
                      </div>

                      {/* Content */}
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1d70b8] transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {step.description}
                      </p>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-2">
                        {isAvailable ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Interactive Tutorial Available</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">Screenshot Coming Soon</span>
                          </>
                        )}
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={handleScreenshotDemo}
                size="lg"
                className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                View Interactive Tutorial
              </Button>
              <Button
                onClick={handleViewInstallationGuide}
                variant="outline"
                size="lg"
                className="border-2 border-[#1d70b8] text-[#1d70b8] hover:bg-[#1d70b8]/5"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Extension
              </Button>
            </div>
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
              description: 'Notification sent immediately',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: MousePointerClick,
              step: '03',
              title: 'One Click',
              description: 'View slot details instantly',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: CheckCircle,
              step: '04',
              title: 'You Book',
              description: 'Complete booking manually',
              color: 'from-purple-500 to-pink-500'
            }
          ].map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all">
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity p-[2px]`}>
                  <div className="w-full h-full bg-white rounded-2xl"></div>
                </div>

                <div className="relative z-10">
                  {/* Step number */}
                  <div className="text-5xl font-light text-gray-200 mb-4">{step.step}</div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h4 className="text-xl text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>

              {/* Connector line */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-[#1d70b8]/5 via-[#2e8bc0]/5 to-[#1d70b8]/5 rounded-3xl p-12 border border-[#1d70b8]/20 text-center">
          <h3 className="text-3xl text-gray-900 mb-4">
            Ready to Install TestNotifier?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow our step-by-step installation guide and start monitoring test availability today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleScreenshotDemo}
              size="lg"
              className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl text-lg px-8"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              View Installation Guide
            </Button>
            <Button
              onClick={handleViewInstallationGuide}
              size="lg"
              variant="outline"
              className="border-2 border-[#1d70b8] text-[#1d70b8] hover:bg-[#1d70b8]/5 text-lg px-8"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Extension
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
