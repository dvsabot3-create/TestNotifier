import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const authStatus = searchParams.get('auth');
        const token = searchParams.get('token');
        const userData = searchParams.get('user');
        const error = searchParams.get('error');
        const redirect = searchParams.get('redirect') || '/';

        // Handle errors
        if (error) {
          console.error('Authentication error:', error);
          navigate(`${redirect}?auth=error&error=${encodeURIComponent(error)}`);
          return;
        }

        // Handle successful authentication
        if (authStatus === 'success' && token && userData) {
          try {
            // Parse user data
            const user = JSON.parse(decodeURIComponent(userData));

            // Save authentication data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to the original destination or dashboard
            const targetPath = redirect === '/' ? '/dashboard' : redirect;
            navigate(targetPath);
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
            navigate(`${redirect}?auth=error&error=invalid_user_data`);
          }
        } else {
          // Invalid callback parameters
          console.error('Invalid callback parameters');
          navigate(`${redirect}?auth=error&error=invalid_callback`);
        }
      } catch (callbackError) {
        console.error('Callback handling error:', callbackError);
        navigate(`/?auth=error&error=processing_error`);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;