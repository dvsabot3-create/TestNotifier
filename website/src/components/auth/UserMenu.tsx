import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, LogOut, CreditCard, Bell } from 'lucide-react';
import { useAuthContext } from '../../lib/auth';
import AuthModal from './AuthModal';

const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated, getSubscriptionTier } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-yellow-100 text-yellow-800';
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      case 'one-off':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLoginClick}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            Sign In
          </button>
          <button
            onClick={handleRegisterClick}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Get Started Free
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user ? getInitials(user.firstName, user.lastName) : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 truncate max-w-32">
              {user?.firstName} {user?.lastName}
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTierColor(getSubscriptionTier())}`}
            >
              {getSubscriptionTier().charAt(0).toUpperCase() + getSubscriptionTier().slice(1)}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getTierColor(getSubscriptionTier())}`}
              >
                {getSubscriptionTier().charAt(0).toUpperCase() + getSubscriptionTier().slice(1)} Plan
              </span>
            </div>

            <div className="py-2">
              <a
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-3" />
                Dashboard
              </a>

              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </a>

              <a
                href="/subscription"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <CreditCard className="w-4 h-4 mr-3" />
                Subscription
              </a>

              <a
                href="/notifications"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </a>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default UserMenu;