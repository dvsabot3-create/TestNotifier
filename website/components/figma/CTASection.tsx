import { Button } from "./ui/button";
import { Chrome, PlayCircle, Check, ArrowRight } from "lucide-react";

export function CTASection() {
  const handleInstallClick = () => {
    // Download the extension zip file
    const link = document.createElement('a');
    link.href = '/downloads/testnotifier-extension.zip';
    link.download = 'testnotifier-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert('🎉 Extension downloaded!\n\n📁 Check your Downloads folder\n\n📖 Installation guide:\n1. Extract the ZIP file\n2. Open Chrome → Extensions\n3. Enable Developer mode\n4. Click "Load unpacked"\n5. Select the extracted folder\n\n✅ Ready to monitor test slots!');
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
    <section className="cta-section relative py-20 px-4 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8] via-[#2e8bc0] to-[#1d70b8]"></div>
      
      {/* Animated Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-8 border border-white/20">
          Join 500+ learners who found their test sooner
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl lg:text-6xl text-white mb-6 leading-tight">
          Ready to Never Miss a <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Cancellation Again?
          </span>
        </h2>
        
        <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Install TestNotifier today and start getting instant notifications when earlier test dates become available
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={handleInstallClick}
            className="bg-white text-[#1d70b8] hover:bg-white/90 gap-2 text-lg px-10 py-7 shadow-2xl transform hover:scale-105 transition-all"
          >
            <Chrome className="w-6 h-6" />
            Download Extension Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleDemoClick}
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 gap-2 text-lg px-10 py-7 backdrop-blur-sm"
          >
            <PlayCircle className="w-6 h-6" />
            Watch Demo
          </Button>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 text-white/90 mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Check className="w-5 h-5" />
            <span>3-day preview access</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Check className="w-5 h-5" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Check className="w-5 h-5" />
            <span>Instant notifications</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 pt-16 border-t border-white/20">
          <div className="text-center">
            <div className="text-5xl mb-3">⚡</div>
            <div className="text-4xl text-white mb-2">30 sec</div>
            <p className="text-white/80">Average notification speed</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-4xl text-white mb-2">95%</div>
            <p className="text-white/80">Find earlier slots</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">⏱️</div>
            <div className="text-4xl text-white mb-2">8 weeks</div>
            <p className="text-white/80">Average time saved</p>
          </div>
        </div>

      </div>
    </section>
  );
}
