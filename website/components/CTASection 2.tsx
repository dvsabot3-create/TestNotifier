import { Button } from "./ui/button";
import { Chrome, PlayCircle, Check, ArrowRight } from "lucide-react";

export function CTASection() {
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
            className="bg-white text-[#1d70b8] hover:bg-white/90 gap-2 text-lg px-10 py-7 shadow-2xl transform hover:scale-105 transition-all"
          >
            <Chrome className="w-6 h-6" />
            Install Extension Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
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
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Check className="w-5 h-5" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Check className="w-5 h-5" />
            <span>Cancel anytime</span>
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

        {/* Money Back Guarantee */}
        <div className="mt-12 inline-flex items-center gap-3 bg-[#28a745] text-white px-6 py-3 rounded-full shadow-xl">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>14-day money-back guarantee</span>
        </div>
      </div>
    </section>
  );
}
