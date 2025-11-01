import { Button } from "./ui/button";
import { Bell, Chrome, PlayCircle, Sparkles, Calendar, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  const [isInstalling, setIsInstalling] = useState(false);

  const trackEvent = (eventName: string, eventCategory: string, eventLabel: string, value?: number) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        value: value
      });
    }
  };

  const handleInstallClick = async () => {
    try {
      setIsInstalling(true);

      // Track conversion event
      trackEvent('extension_install_click', 'conversion', 'hero_primary_cta');

      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // Redirect to login/signup with return URL
        navigate('/auth?redirect=/download&source=hero');
        return;
      }

      // Check subscription status
      const subscriptionStatus = localStorage.getItem('subscription_status');
      if (subscriptionStatus === 'inactive') {
        // Redirect to pricing page
        navigate('/pricing?source=hero_install');
        return;
      }

      // Proceed with Chrome Web Store installation
      window.open('https://chrome.google.com/webstore/detail/testnotifier/dvsa-test-cancellation-alerts', '_blank');

      // Track successful installation start
      trackEvent('extension_install_started', 'conversion', 'hero_install_success');

    } catch (error) {
      console.error('Installation error:', error);
      trackEvent('extension_install_error', 'error', 'hero_install_failed');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDemoClick = () => {
    trackEvent('demo_click', 'engagement', 'hero_secondary_cta');

    // Smooth scroll to demo section
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    trackEvent('auth_click', 'engagement', 'hero_auth_prompt');
    navigate('/auth?source=hero');
  };
  return (
    <section className="hero-section relative min-h-[70vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1d70b8] via-[#2e8bc0] to-[#28a745]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-bg-1 absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-[#2e8bc0]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="hero-bg-2 absolute bottom-0 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-[#1d70b8]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="hero-bg-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-gray-100 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 500+ UK learner drivers</span>
            </div>

            {/* Main Headline */}
            <div className="hero-title space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-100 leading-tight tracking-tight">
                Never Miss an
                <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Earlier Test Slot
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Get instant notifications when earlier DVSA driving test dates become available. Stop checking manually - let TestNotifier do the work.
              </p>
            </div>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="group relative overflow-hidden bg-white text-[#1d70b8] hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(29,112,184,0.3)] transition-all duration-300 text-lg px-8 h-14 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <Chrome className="w-5 h-5 mr-2" />
                <span>{isInstalling ? 'Loading...' : 'Install Free Extension'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDemoClick}
                className="border-2 border-white/30 text-gray-100 backdrop-blur-xl hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 text-lg px-8 h-14"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                <span>Watch Demo</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="hero-stats flex flex-wrap gap-8 pt-6">
              {[
                { value: '500+', label: 'Active Users' },
                { value: '95%', label: 'Success Rate' },
                { value: '8 weeks', label: 'Avg. Time Saved' }
              ].map((stat, index) => (
                <div key={index} className="text-gray-100">
                  <div className="text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Extension Preview */}
          <div className="hero-visual relative">
            {/* Main Extension Window */}
            <div className="extension-window relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-gray-100" />
                    </div>
                    <div className="notification-pulse absolute -top-1 -right-1 w-3 h-3 bg-[#28a745] rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-gray-100 text-sm">TestNotifier</div>
                    <div className="text-gray-400 text-xs">Chrome Extension</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
                </div>
              </div>

              {/* Active Monitors */}
              <div className="space-y-3 mb-6">
                <div className="text-gray-300 text-sm mb-3">Active Monitors</div>
                {[
                  { center: 'Manchester North', slots: '3 new slots', color: 'green', time: '2 mins ago' },
                  { center: 'London Wembley', slots: 'Checking...', color: 'blue', time: 'Live' },
                  { center: 'Birmingham South', slots: '1 new slot', color: 'green', time: '5 mins ago' }
                ].map((monitor, index) => (
                  <div 
                    key={index}
                    className="monitor-card flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-gray-100 text-sm">{monitor.center}</div>
                        <div className={`text-xs ${monitor.color === 'green' ? 'text-[#28a745]' : 'text-[#2e8bc0]'}`}>
                          {monitor.slots}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">{monitor.time}</div>
                  </div>
                ))}
              </div>

              {/* Recent Notification */}
              <div className="notification-card bg-gradient-to-br from-[#28a745]/20 to-[#28a745]/5 border border-[#28a745]/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#28a745] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-100 text-sm mb-1">Earlier Slot Found! 🎉</div>
                    <div className="text-gray-300 text-xs mb-3">
                      Manchester North - 3 months earlier than your current booking
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>12 Feb 2025</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>10:30 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notification Cards */}
            <div className="floating-notification-1 absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl max-w-xs hidden lg:block border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#28a745] to-[#20c997] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-gray-100" />
                </div>
                <div>
                  <div className="text-[#1d70b8] mb-1">New slot available!</div>
                  <div className="text-sm text-gray-600">London Wembley</div>
                  <div className="text-xs text-gray-500 mt-1">2 minutes ago</div>
                </div>
              </div>
            </div>

            <div className="floating-notification-2 absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl max-w-xs hidden lg:block border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-gray-100" />
                </div>
                <div>
                  <div className="text-[#1d70b8] mb-1">3 new slots found</div>
                  <div className="text-sm text-gray-600">Birmingham South</div>
                  <div className="text-xs text-gray-500 mt-1">Just now</div>
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8]/20 to-[#2e8bc0]/20 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce">
        <div className="text-sm mb-2">Scroll to explore</div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
          <div className="w-1.5 h-2 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
