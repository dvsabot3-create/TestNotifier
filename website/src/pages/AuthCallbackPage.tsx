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

        // Check if user was in checkout flow - GO STRAIGHT TO STRIPE
        const checkoutInProgress = localStorage.getItem('checkout_in_progress');
        const selectedPlan = localStorage.getItem('selected_plan');
        const redirectUrl = searchParams.get('redirect');

        if (checkoutInProgress && selectedPlan) {
          // User was trying to subscribe - GO DIRECTLY TO STRIPE CHECKOUT
          console.log('User selected plan before auth - going straight to checkout:', selectedPlan);
          
          // Clear flags
          localStorage.removeItem('checkout_in_progress');
          
          // Create checkout session immediately
          createCheckoutSessionAndRedirect(selectedPlan, userData);
          return; // Don't navigate anywhere else
        }

        // Check if this is an extension login
        const isExtensionLogin = redirectUrl && redirectUrl.includes('extension-login');
        
        if (isExtensionLogin) {
          // Redirect to extension auth success page which will send token to extension
          navigate('/extension-auth-success');
          return;
        }

        // No checkout in progress - check if user has active subscription
        setTimeout(() => {
          if (redirectUrl && redirectUrl !== '/' && redirectUrl !== '/dashboard') {
            navigate(redirectUrl);
          } else {
            // Check subscription tier
            const tier = userData.subscription?.tier || 'free';
            
            if (tier === 'free') {
              // Free users MUST select a plan - redirect to pricing
              console.log('Free user logged in - redirecting to pricing');
              navigate('/#pricing');
            } else {
              // Paid users can go to dashboard
              navigate('/dashboard');
            }
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