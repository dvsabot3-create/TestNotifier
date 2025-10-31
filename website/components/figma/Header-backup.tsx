import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuthContext } from "../../src/lib/auth";
import AuthModal from "../../src/components/auth/AuthModal";
import UserMenu from "../../src/components/auth/UserMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user, logout } = useAuthContext();

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleSignInClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      // Redirect to dashboard if user is logged in
      window.location.href = '/dashboard';
    } else {
      setAuthMode('register');
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-4'
          : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <img
              src="/assets/logos/tn-logov2.png"
              alt="TN Test Notifier"
              className="w-auto h-14 transition-opacity group-hover:opacity-80 cursor-pointer"
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
              // Show UserMenu when authenticated
              React.createElement(UserMenu)
            ) : (
              // Show login/register buttons when not authenticated
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
                  <span className="relative z-10">Get Started Free</span>
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
                {isAuthenticated ? (
                  // Show user info when authenticated on mobile
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => { window.location.href = '/dashboard'; setMobileMenuOpen(false); }}
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  // Show login/register buttons when not authenticated
                  <>
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
                      Get Started Free
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </header>
  );
}
