import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Shield, Bell, User, Settings, LogOut, UserPlus } from 'lucide-react';
import { Button } from "./ui/button";
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../utils/auth';
import { useBritishTranslation } from '../utils/translation';

interface TranslatedHeaderProps {
  className?: string;
}

export function TranslatedHeader({ className = "" }: TranslatedHeaderProps) {
  const { t } = useTranslation(['common', 'home']);
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getDirectionClass } = useBritishTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { href: "/", label: t('common:home', 'Home') },
    { href: "/test-centres", label: t('common:testCentres', 'Test Centres') },
    { href: "/pricing", label: t('common:pricing', 'Pricing') },
    { href: "/extension", label: t('common:extension', 'Extension') },
    { href: "/about", label: t('common:about', 'About') },
  ];

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getDirectionClass()}`}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-[#1d70b8]" />
              <span className="text-xl font-bold text-gray-900">
                {t('common:title', 'TestNotifier')}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-[#1d70b8] font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side - Language Switcher & Auth */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="inline-block h-4 w-4 mr-2" />
                      {t('common:dashboard', 'Dashboard')}
                    </a>
                    <a
                      href="/notifications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bell className="inline-block h-4 w-4 mr-2" />
                      {t('common:notifications', 'Notifications')}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline-block h-4 w-4 mr-2" />
                      {t('common:logout', 'Logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a href="/login">
                  <Button variant="ghost" size="sm">
                    {t('common:login', 'Login')}
                  </Button>
                </a>
                <a href="/register">
                  <Button size="sm" className="bg-[#1d70b8] hover:bg-[#165a9f]">
                    <UserPlus className="h-4 w-4 mr-1" />
                    {t('common:register', 'Register')}
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-[#1d70b8] font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <a
                    href="/dashboard"
                    className="text-gray-600 hover:text-[#1d70b8] font-medium py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('common:dashboard', 'Dashboard')}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-[#1d70b8] font-medium py-2 flex items-center w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('common:logout', 'Logout')}
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default TranslatedHeader;