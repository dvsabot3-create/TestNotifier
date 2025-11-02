import { Button } from "./ui/button";
import { Bell, Chrome, PlayCircle, Sparkles, Calendar, MapPin, Clock } from "lucide-react";

export function HeroSection() {
  const handleInstallClick = () => {
    // Download the extension ZIP file
    const link = document.createElement('a');
    link.href = '/downloads/testnotifier-extension.zip';
    link.download = 'testnotifier-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message via custom modal
    setTimeout(() => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: white; padding: 24px 32px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; max-width: 550px; border: 2px solid #28a745;';
      modal.innerHTML = `
        <div style="display: flex; align-items: start; gap: 16px;">
          <div style="font-size: 32px;">🎉</div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 8px 0; color: #1d70b8; font-size: 18px; font-weight: 600;">Extension Downloaded!</h3>
            <p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; line-height: 1.5;">
              📁 Check your Downloads folder for <strong>testnotifier-extension.zip</strong><br><br>
              📖 Next steps:<br>
              1. Extract the ZIP file<br>
              2. Open Chrome → Extensions (chrome://extensions)<br>
              3. Enable "Developer mode"<br>
              4. Click "Load unpacked"<br>
              5. Select the extracted folder
            </p>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.location.href='#how-it-works'; this.closest('div[style*=fixed]').remove();" style="background: #1d70b8; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">View Full Guide</button>
              <button onclick="this.closest('div[style*=fixed]').remove();" style="background: #f3f4f6; color: #374151; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">Got it!</button>
            </div>
          </div>
          <button onclick="this.closest('div[style*=fixed]').remove();" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #9ca3af; line-height: 1;">×</button>
        </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => modal.remove(), 12000);
    }, 500);
  };

  const handleDemoClick = () => {
    // Scroll to demo section
    const demoSection = document.querySelector('.demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to how it works section
      const howItWorksSection = document.querySelector('.how-it-works-section');
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1d70b8] to-[#2e8bc0]"
      style={{
        backgroundImage: "url(/assets/hero/hero-bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-bg-1 absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-[#2e8bc0]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="hero-bg-2 absolute bottom-0 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-[#1d70b8]/30 to-transparent rounded-full blur-3xl"></div>
        <div className="hero-bg-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 relative z-20">

            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 500+ learners & driving instructors</span>
            </div>

            {/* Main Headline */}
            <div className="hero-title space-y-4">
              <h1 className="text-6xl lg:text-7xl text-white leading-tight">
                Never Miss an
                <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Earlier Test Slot
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                Get instant notifications when earlier DVSA test dates appear. Built for learners and driving instructors managing multiple pupils—with intelligent, reliable monitoring.
              </p>
            </div>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = '#pricing'}
                className="group relative overflow-hidden bg-white text-[#1d70b8] hover:bg-white/90 hover:scale-105 active:bg-[#28a745] active:text-white text-lg px-8 h-14 shadow-2xl transition-all"
              >
                <Chrome className="w-5 h-5 mr-2" />
                <span>View Pricing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '#how-it-works'}
                className="border-2 border-white bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/90 hover:scale-105 active:bg-[#28a745] active:border-[#28a745] text-lg px-8 h-14 shadow-xl transition-all"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">How Does It Work?</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="hero-stats flex flex-wrap gap-8 pt-6">
              {[
                { value: '500+', label: 'Active Users' },
                { value: '95%', label: 'Success Rate' },
                { value: '8 weeks', label: 'Avg. Time Saved' }
              ].map((stat, index) => (
                <div key={index} className="text-white/90">
                  <div className="text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Extension Preview */}
          <div className="hero-visual relative z-10">
            {/* Main Extension Window */}
            <div className="extension-window relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl w-full min-h-[420px] lg:min-h-[560px]">
              {/* Window Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="notification-pulse absolute -top-1 -right-1 w-3 h-3 bg-[#28a745] rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-white text-sm">TestNotifier</div>
                    <div className="text-white/60 text-xs">Chrome Extension</div>
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
                <div className="text-white/80 text-sm mb-3">Active Monitors</div>
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
                      <MapPin className="w-4 h-4 text-white/60" />
                      <div>
                        <div className="text-white text-sm">{monitor.center}</div>
                        <div className={`text-xs ${monitor.color === 'green' ? 'text-[#28a745]' : 'text-[#2e8bc0]'}`}>
                          {monitor.slots}
                        </div>
                      </div>
                    </div>
                    <div className="text-white/40 text-xs">{monitor.time}</div>
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
                    <div className="text-white text-sm mb-1">Earlier Slot Found! 🎉</div>
                    <div className="text-white/70 text-xs mb-3">
                      Manchester North - 3 months earlier than your current booking
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
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
                  <Bell className="w-5 h-5 text-white" />
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
                  <Bell className="w-5 h-5 text-white" />
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <div className="text-sm mb-2">Scroll to explore</div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
          <div className="w-1.5 h-2 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
