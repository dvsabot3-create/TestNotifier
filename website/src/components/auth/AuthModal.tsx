import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleClose = () => {
    setMode('login');
    setShowForgotPassword(false);
    onClose();
  };

  const switchToRegister = () => {
    setMode('register');
    setShowForgotPassword(false);
  };

  const switchToLogin = () => {
    setMode('login');
    setShowForgotPassword(false);
  };

  const switchToForgotPassword = () => {
    setShowForgotPassword(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {mode === 'login' && !showForgotPassword && (
        <LoginModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToRegister={switchToRegister}
          onSwitchToForgotPassword={switchToForgotPassword}
        />
      )}

      {mode === 'register' && !showForgotPassword && (
        <RegisterModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                  <p className="text-purple-100 mt-1">We'll send you a reset link</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-purple-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-purple-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;