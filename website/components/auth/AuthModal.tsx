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
      // Check if user is in checkout flow
      const checkoutInProgress = localStorage.getItem('checkout_in_progress');
      const selectedPlan = localStorage.getItem('selected_plan');
      
      let finalRedirect = '/dashboard';
      
      // If user selected a plan - use special "checkout:planId" format
      // This tells AuthCallbackPage to go STRAIGHT to Stripe (no dashboard)
      if (checkoutInProgress && selectedPlan) {
        finalRedirect = `checkout:${selectedPlan}`;
        console.log('🛒 User selected plan - will go STRAIGHT to Stripe after auth:', selectedPlan);
      } else if (redirectUrl) {
        finalRedirect = redirectUrl;
      }

      // Redirect to Google OAuth with state parameter
      console.log('🔐 Starting Google OAuth with state:', finalRedirect);
      window.location.href = `/api/auth/google?state=${encodeURIComponent(finalRedirect)}`;
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
              className="w-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
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