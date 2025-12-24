import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useAuthContext } from '../../lib/auth';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const { register, loading, error } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dataProcessingConsent: false,
    marketingConsent: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dataProcessingConsent: false,
        marketingConsent: false
      });
      setLocalError('');
      setSuccess(false);
      setValidationErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.dataProcessingConsent) {
      errors.dataProcessingConsent = 'You must consent to data processing';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (localError) setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        dataProcessingConsent: formData.dataProcessingConsent,
        marketingConsent: formData.marketingConsent
      });
      setSuccess(true);
    } catch (err) {
      // Error is handled by auth context
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-green-100 mt-1">Start your free trial</p>
            </div>
            <button
              onClick={onClose}
              className="text-green-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-green-600"
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
              <p className="text-green-700">Account created successfully! Please check your email to verify your account.</p>
            </div>
            <div className="mt-3">
              <button
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-500 font-medium text-sm"
              >
                Go to login →
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {localError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-700 text-sm">{localError}</p>
              </div>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
              </div>
              {validationErrors.firstName && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Smith"
                />
              </div>
              {validationErrors.lastName && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="john.smith@example.com"
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Password requirements:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
              </li>
              <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                {/[a-z]/.test(formData.password) ? '✓' : '○'} One lowercase letter
              </li>
              <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
              </li>
              <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                {/\d/.test(formData.password) ? '✓' : '○'} One number
              </li>
            </ul>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                id="dataProcessingConsent"
                name="dataProcessingConsent"
                type="checkbox"
                checked={formData.dataProcessingConsent}
                onChange={handleChange}
                className={`mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${
                  validationErrors.dataProcessingConsent ? 'border-red-500' : ''
                }`}
              />
              <div className="ml-3">
                <label htmlFor="dataProcessingConsent" className="text-sm text-gray-700">
                  I consent to the processing of my personal data in accordance with the{' '}
                  <a href="/privacy-policy" className="text-green-600 hover:text-green-500 underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>{' '}
                  *
                </label>
                {validationErrors.dataProcessingConsent && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.dataProcessingConsent}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="marketingConsent"
                name="marketingConsent"
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="marketingConsent" className="text-sm text-gray-700">
                  I would like to receive marketing emails about new features and updates (optional)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Account created!
              </div>
            ) : (
              'Create Free Account'
            )}
          </button>

          {/* Terms and Login Link */}
          <div className="text-center space-y-3">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="/terms-of-service" className="text-green-600 hover:text-green-500 underline" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </p>

            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-500 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;