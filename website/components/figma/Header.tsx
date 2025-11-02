import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "../../src/contexts/AuthContext";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleGetStartedClick = () => {
    // Scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <img
              src="/assets/logos/tn-logov2.png"
              alt="TN Test Notifier"
              className="w-auto h-10 transition-opacity group-hover:opacity-80 cursor-pointer"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className={`text-sm ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                    {user?.firstName || user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className={`${scrolled ? 'text-gray-700 hover:text-[#1d70b8]' : 'text-white hover:bg-white/10'}`}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSignInClick}
                  className={`${scrolled ? 'text-gray-700 hover:text-[#1d70b8]' : 'text-white hover:bg-white/10'}`}
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleGetStartedClick}
                  className="relative overflow-hidden group bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl transition-all"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2e8bc0] to-[#1d70b8] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-gray-200">
            <div className="px-6 py-4 space-y-4">
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                  className="block text-gray-700 hover:text-[#1d70b8] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button
                  variant="ghost"
                  onClick={handleSignInClick}
                  className="w-full text-gray-700 hover:text-[#1d70b8]"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleGetStartedClick}
                  className="w-full bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl transition-all"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        source="header"
      />
    </header>
  );
}
