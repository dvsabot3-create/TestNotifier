import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

export function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check for error parameter
        const errorParam = searchParams.get('error');
        if (errorParam) {
          let errorMessage = 'Authentication failed';

          switch (errorParam) {
            case 'oauth_failed':
              errorMessage = 'Google authentication failed. Please try again.';
              break;
            case 'token_generation_failed':
              errorMessage = 'Failed to generate authentication tokens. Please try again.';
              break;
            default:
              errorMessage = 'An unexpected error occurred during authentication.';
          }

          setError(errorMessage);
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
          return;
        }

        // Extract tokens and user data from URL parameters
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const avatar = searchParams.get('avatar');

        // Validate required parameters
        if (!accessToken || !refreshToken || !userId || !email) {
          throw new Error('Missing required authentication parameters');
        }

        // Create user object
        const userData = {
          id: userId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: avatar || undefined,
          isEmailVerified: true, // Google emails are verified
          subscriptionStatus: 'free' as const,
          isActive: true,
        };

        // Login with Google OAuth data
        await loginWithGoogle({
          accessToken,
          refreshToken,
          user: userData,
        });

        // Check if this is an extension login (state=/extension-login)
        const redirectParam = searchParams.get('redirect');
        if (redirectParam === '/extension-login') {
          // Send token to extension
          console.log('🔌 Extension login detected - sending token to extension');
          
          // Try to send message to extension
          if (window.chrome && chrome.runtime) {
            try {
              // Get all extensions and try to send message
              chrome.runtime.sendMessage(
                { type: 'TESTNOTIFIER_AUTH', token: accessToken },
                () => {
                  if (chrome.runtime.lastError) {
                    console.log('Could not send to extension directly, trying broadcast');
                  }
                }
              );
            } catch (e) {
              console.log('Extension message failed:', e);
            }
          }
          
          // Show success message and auto-close
          setError(null);
          const successDiv = document.createElement('div');
          successDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 32px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; z-index: 10000; max-width: 400px;">
              <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
              <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #1d70b8;">Successfully Logged In!</h2>
              <p style="color: #6b7280; font-size: 16px; margin-bottom: 20px;">You can now return to the extension.</p>
              <p style="color: #9ca3af; font-size: 14px;">This tab will close automatically...</p>
            </div>
          `;
          document.body.appendChild(successDiv);
          
          // Close this tab after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
          return;
        }

        // Normal dashboard redirect
        navigate('/dashboard');

      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Failed to complete authentication. Please try again.');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, loginWithGoogle, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Authentication</h2>
        <p className="text-gray-600">Please wait while we process your Google account...</p>
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}