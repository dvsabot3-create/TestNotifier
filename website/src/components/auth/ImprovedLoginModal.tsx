import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Chrome, ChromeIcon, Sparkles, Bell, Calendar, Shield } from 'lucide-react';
import { useAuthContext } from '../../lib/auth';

interface ImprovedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onSuccess?: () => void;
}

const ImprovedLoginModal: React.FC<ImprovedLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword,
  onSuccess
}) => {
  const { login, loading, error, isAuthenticated } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
      setLocalError('');
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated && success) {
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    }
  }, [isAuthenticated, success, onClose, onSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
      setSuccess(true);
    } catch (err) {
      // Error is handled by auth context
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/google`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in zoom-in-95">
        {/* Blue Header Section */}
        <div className="relative bg-[#1d70b8] px-8 py-12 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#1d70b8]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">TestNotifier</h1>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-white/90 text-sm mt-1">Sign in to access your test monitoring dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/20 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 m-6 mb-0 shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <p className="text-green-700 font-medium">Login successful! Redirecting...</p>
            </div>
          </div>
        )}

        {/* White Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          {/* Error Message */}
          {localError && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{localError}</p>
              </div>
            </div>
          )}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Chrome className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d70b8] focus:border-[#1d70b8] transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d70b8] focus:border-[#1d70b8] transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-[#1d70b8] hover:text-[#155a8c] font-semibold transition-colors underline decoration-1 underline-offset-2 hover:decoration-[#155a8c]"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d70b8] hover:bg-[#155a8c] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link - Inside white card area */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#1d70b8] hover:text-[#155a8c] font-semibold transition-colors underline decoration-2 underline-offset-2 hover:decoration-[#155a8c]"
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* Terms - Inside white card area */}
          <div className="text-center mt-6 border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
              By signing in, you agree to our{' '}
              <a
                href="/terms"
                className="text-[#1d70b8] hover:text-[#155a8c] underline decoration-1 underline-offset-2 hover:decoration-[#155a8c] transition-all duration-200"
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a
                href="/privacy"
                className="text-[#1d70b8] hover:text-[#155a8c] underline decoration-1 underline-offset-2 hover:decoration-[#155a8c] transition-all duration-200"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </form>

        {/* Trust Badge - Outside white card container */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-green-500 mr-1">✓</span>
            Trusted by 500+ learners & driving instructors
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedLoginModal;