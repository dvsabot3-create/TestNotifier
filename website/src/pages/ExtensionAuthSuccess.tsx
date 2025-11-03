import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

/**
 * Extension Authentication Success Page
 * 
 * This page is shown after a user successfully authenticates via the extension.
 * It sends the auth token back to the extension and provides UI feedback.
 */
const ExtensionAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'sending' | 'success' | 'error'>('sending');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const sendTokenToExtension = async () => {
      try {
        // Get auth token from localStorage
        const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const userData = localStorage.getItem('user_data') || localStorage.getItem('user');

        if (!authToken || !userData) {
          console.error('No auth token or user data found');
          setStatus('error');
          return;
        }

        const user = JSON.parse(userData);

        console.log('📤 Sending auth data to extension...');

        // Try to send via chrome.runtime.sendMessage (requires externally_connectable in manifest)
        let messageSent = false;
        
        if (typeof window !== 'undefined' && (window as any).chrome && (window as any).chrome.runtime) {
          try {
            // Send to extension via chrome.runtime API
            await (window as any).chrome.runtime.sendMessage({
              type: 'AUTH_SUCCESS',
              token: authToken,
              user: user
            });
            console.log('✅ Message sent via chrome.runtime');
            messageSent = true;
          } catch (err: any) {
            console.log('chrome.runtime.sendMessage failed:', err.message);
            // Extension may not be installed or not configured for external messaging
          }
        }

        // Fallback: Use postMessage (content script can relay to background)
        window.postMessage({
          type: 'TESTNOTIFIER_AUTH',
          token: authToken,
          user: user,
          source: 'testnotifier-website'
        }, '*');
        console.log('📤 Message sent via window.postMessage');

        setStatus('success');

        // Start countdown
        let count = 3;
        const countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);
          if (count === 0) {
            clearInterval(countdownInterval);
            // Close this tab (extension will detect and reload popup)
            window.close();
            // If window.close() fails (some browsers block it), redirect
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
          }
        }, 1000);

      } catch (error) {
        console.error('Error sending token to extension:', error);
        setStatus('error');
      }
    };

    // Small delay to ensure localStorage is populated
    setTimeout(sendTokenToExtension, 500);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'sending' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Syncing with Extension...
            </h2>
            <p className="text-gray-600">
              Please wait while we sync your account with the TestNotifier extension.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your extension is now synced with your TestNotifier account.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Next step:</strong> Go back to the extension popup to start monitoring for test slots.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              This window will close in <strong>{countdown}</strong> seconds...
            </p>
            <button
              onClick={() => window.close()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sync Failed
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to sync with the extension. Please try again or sign in directly at testnotifier.co.uk
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExtensionAuthSuccess;

