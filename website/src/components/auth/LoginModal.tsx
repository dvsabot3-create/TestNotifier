import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../../lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword
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
      }, 1500);
    }
  }, [isAuthenticated, success, onClose]);

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

  const handleDemoLogin = (tier: string) => {
    const demoCredentials = {
      starter: { email: 'demo@starter.com', password: 'Demo1234!' },
      premium: { email: 'demo@premium.com', password: 'Demo1234!' },
      professional: { email: 'demo@professional.com', password: 'Demo1234!' }
    };

    const credentials = demoCredentials[tier as keyof typeof demoCredentials];
    if (credentials) {
      setFormData(credentials);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-blue-100 mt-1">Sign in to your account</p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-blue-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6 mb-0">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-700">Login successful! Redirecting...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {localError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-700 text-sm">{localError}</p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
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

          {/* Demo Login Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600 mb-4">Try demo accounts:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('starter')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Demo Starter Account
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('premium')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Demo Premium Account
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('professional')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Demo Professional Account
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Sign up free
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;