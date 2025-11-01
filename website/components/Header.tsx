import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-6'
          : 'bg-transparent py-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <img
              src="/assets/logos/tn-logov2.png"
              alt="TN Test Notifier"
              className="w-auto h-19 transition-opacity group-hover:opacity-80 cursor-pointer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className={`relative group transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-[#1d70b8]' : 'text-white/90 hover:text-white'
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className={`hidden md:flex ${scrolled ? 'text-gray-700 hover:text-[#1d70b8]' : 'text-white hover:bg-white/10'}`}
            >
              Sign In
            </Button>
            <Button className="relative overflow-hidden group bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl transition-all">
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2e8bc0] to-[#1d70b8] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
