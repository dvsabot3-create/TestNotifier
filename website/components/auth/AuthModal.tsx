import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Chrome, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  source?: string;
}

export function AuthModal({ isOpen, onClose, redirectUrl, source }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const trackEvent = (eventName: string, eventCategory: string, eventLabel: string) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        localStorage.setItem('subscription_status', data.subscription?.status || 'inactive');

        // Track successful authentication
        trackEvent(isLogin ? 'login_success' : 'registration_success', 'authentication', source || 'modal');

        setAuthSuccess(true);

        // Close modal and redirect
        setTimeout(() => {
          onClose();
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            window.location.reload();
          }
        }, 1500);
      } else {
        setErrors({ submit: data.message || 'Authentication failed' });
        trackEvent(isLogin ? 'login_error' : 'registration_error', 'authentication', data.message || 'unknown_error');
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
      trackEvent('auth_network_error', 'error', 'network_failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    trackEvent('google_auth_click', 'authentication', source || 'modal');

    try {
      // Redirect to Google OAuth
      window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectUrl || '/')}`;
    } catch (error) {
      setErrors({ submit: 'Google authentication failed. Please try again.' });
      trackEvent('google_auth_error', 'error', 'google_auth_failure');
    }
  };

  const handleForgotPassword = () => {
    trackEvent('forgot_password_click', 'authentication', source || 'modal');
    // Implement forgot password flow
    window.location.href = '/auth/forgot-password';
  };

  useEffect(() => {
    if (isOpen) {
      // Track modal open event
      trackEvent('auth_modal_open', 'engagement', source || 'unknown');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {authSuccess ? 'Success!' : isLogin ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {authSuccess
              ? 'Authentication successful! Redirecting...'
              : isLogin
                ? 'Sign in to access your test monitoring dashboard'
                : 'Join TestNotifier to start finding earlier test dates'}
          </DialogDescription>
        </DialogHeader>

        {authSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700">Authentication successful!</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting you now...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Auth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full border-2 border-gray-300 hover:border-[#1d70b8] hover:text-[#1d70b8] transition-colors"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Name field for registration */}
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 border-gray-300 focus:border-[#1d70b8] focus:ring-[#1d70b8]"
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 border-gray-300 focus:border-[#1d70b8] focus:ring-[#1d70b8]"
                placeholder="Enter your email address"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="border-gray-300 focus:border-[#1d70b8] focus:ring-[#1d70b8] pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password for registration */}
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="mt-1 border-gray-300 focus:border-[#1d70b8] focus:ring-[#1d70b8]"
                  placeholder="Confirm your password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:from-[#1d70b8]/90 hover:to-[#2e8bc0]/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>

            {/* Error message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </div>
            )}
          </form>
        )}

        <DialogFooter className="flex-col gap-4">
          <div className="text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#1d70b8] hover:underline font-medium"
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#1d70b8] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#1d70b8] hover:underline"
            >
              Forgot your password?
            </button>
          )}

          {/* Privacy notice */}
          <div className="text-xs text-gray-500 text-center">
            By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <a href="/terms" className="text-[#1d70b8] hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#1d70b8] hover:underline">Privacy Policy</a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}