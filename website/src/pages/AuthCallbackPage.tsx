import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Plan to Stripe Price ID mapping
const PLAN_TO_PRICE_ID: Record<string, string> = {
  'oneoff': 'price_1SPEkE0xPOxdopWPVF6IYYUr',
  'starter': 'price_1SPEkG0xPOxdopWPVVWGWu4M',
  'premium': 'price_1SPEkH0xPOxdopWPUiOBFDPd',
  'professional': 'price_1SPEkI0xPOxdopWP5bwrFwY5'
};

const PLAN_NAMES: Record<string, string> = {
  'oneoff': 'One-Off Rebook',
  'starter': 'Starter',
  'premium': 'Premium',
  'professional': 'ADI Professional'
};

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isExtensionLogin, setIsExtensionLogin] = useState<boolean>(false);

  /**
   * Create Stripe checkout session and redirect immediately
   */
  const createCheckoutSessionAndRedirect = async (planId: string, userData: any) => {
    try {
      console.log('Creating checkout session for plan:', planId);
      
      const priceId = PLAN_TO_PRICE_ID[planId];
      const planName = PLAN_NAMES[planId];
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

      if (!priceId) {
        throw new Error('Invalid plan ID');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId: priceId,
          planName: planName,
          planType: planId === 'oneoff' ? 'one-time' : 'subscription',
          customerEmail: userData.email,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // IMMEDIATE redirect to Stripe - no intermediate pages
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout creation error:', error);
      setError('Failed to start checkout. Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
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
            navigate('/');
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

        console.log('OAuth Callback - Received params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          userId,
          email,
          firstName,
          lastName,
          avatar: avatar ? 'present' : 'missing'
        });

        // Validate required parameters
        if (!accessToken || !refreshToken || !userId || !email) {
          console.error('Missing required OAuth parameters');
          setError('Invalid authentication response. Please try again.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
          return;
        }

        // Create user object
        const userData = {
          id: userId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: avatar || undefined,
          isEmailVerified: true,
          subscription: {
            tier: 'free',
            status: 'active'
          },
          createdAt: new Date().toISOString()
        };

        // Save authentication data (compatible with auth library)
        localStorage.setItem('token', accessToken);
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('user_data', JSON.stringify(userData));

        console.log('OAuth Callback - User data saved to localStorage');

        // Check if user was in checkout flow - CHECK REDIRECT URL
        const redirectUrl = searchParams.get('redirect');
        
        console.log('🔍 Checking redirect URL:', redirectUrl);
        
        // Check if this is an EXTENSION login (state=/extension-login)
        if (redirectUrl === '/extension-login') {
          console.log('🔌 Extension login detected - sending token to extension');
          setIsExtensionLogin(true);
          
          // Try to send message to extension
          if (window.chrome && (window as any).chrome.runtime) {
            try {
              // Send message to extension
              (window as any).chrome.runtime.sendMessage(
                { type: 'TESTNOTIFIER_AUTH', token: accessToken },
                () => {
                  if ((window as any).chrome.runtime.lastError) {
                    console.log('Could not send to extension directly');
                  } else {
                    console.log('✅ Token sent to extension successfully');
                  }
                }
              );
            } catch (e) {
              console.log('Extension message failed:', e);
            }
          }
          
          // Close this tab after 3 seconds
          setTimeout(() => {
            window.close();
          }, 3000);
          return;
        }
        
        // Check if redirect URL contains "checkout:planId" format
        if (redirectUrl && redirectUrl.startsWith('checkout:')) {
          const planId = redirectUrl.replace('checkout:', '');
          console.log('✅ CHECKOUT DETECTED - Going STRAIGHT to Stripe for plan:', planId);
          
          // Clear localStorage flags
          localStorage.removeItem('checkout_in_progress');
          localStorage.removeItem('selected_plan');
          
          // Create checkout session immediately - NO DASHBOARD
          createCheckoutSessionAndRedirect(planId, userData);
          return; // Stop here - don't navigate to dashboard
        }
        
        // Backup: Check localStorage
        const checkoutInProgress = localStorage.getItem('checkout_in_progress');
        const selectedPlan = localStorage.getItem('selected_plan');
        
        if (checkoutInProgress && selectedPlan) {
          console.log('✅ CHECKOUT from localStorage - Going to Stripe:', selectedPlan);
          
          localStorage.removeItem('checkout_in_progress');
          localStorage.removeItem('selected_plan');
          
          createCheckoutSessionAndRedirect(selectedPlan, userData);
          return;
        }

        // Check if this is an extension login
        const isExtensionLogin = redirectUrl && redirectUrl.includes('extension-login');
        
        if (isExtensionLogin) {
          // Redirect to extension auth success page which will send token to extension
          navigate('/extension-auth-success');
          return;
        }

        // No checkout in progress - check subscription status
        // Dashboard is ONLY for existing customers with subscriptions
        // New users go to pricing page to select a plan
        setTimeout(() => {
          // Check if user has an active subscription
          const tier = userData.subscription?.tier || 'free';
          const status = userData.subscription?.status || 'inactive';
          
          console.log('📊 User subscription check:', { tier, status });
          
          // If user has a paid subscription → Dashboard
          if (tier !== 'free' && (status === 'active' || status === 'trialing')) {
            console.log('✅ Existing customer - going to Dashboard');
            navigate('/dashboard');
          } else {
            // New user or no active subscription → Pricing page to select plan
            console.log('🆕 New account detected - redirecting to pricing to select subscription');
            navigate('/#pricing');
          }
        }, 500);

      } catch (callbackError) {
        console.error('Callback handling error:', callbackError);
        setError('Failed to complete authentication. Please try again.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (isExtensionLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md mx-5">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4 text-blue-600">Successfully Logged In!</h1>
          <p className="text-gray-600 text-lg mb-6">Your account is now connected to the extension.</p>
          <div className="bg-gray-100 p-5 rounded-xl mb-6">
            <p className="text-gray-800 font-semibold mb-3">Next Steps:</p>
            <ol className="text-left text-gray-600 text-sm space-y-2 pl-5 list-decimal">
              <li>Close this tab</li>
              <li>Return to the Chrome extension</li>
              <li>The extension should now show your dashboard</li>
            </ol>
          </div>
          <p className="text-gray-400 text-sm mb-4">This window will close automatically in 3 seconds...</p>
          <button 
            onClick={() => window.close()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            Close Now
          </button>
        </div>
      </div>
    );
  }

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
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;