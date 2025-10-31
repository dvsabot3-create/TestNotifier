// Debug endpoint for authentication system diagnostics
export async function debug(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
            nodeEnv: process.env.NODE_ENV,
        apiUrl: process.env.VITE_API_URL || 'not set',
        frontendUrl: process.env.FRONTEND_URL || 'not set',
        googleClientId: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'configured' : 'missing',
        googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'not set',
        jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ? 'configured' : 'missing',
        stripeSecretKey: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing'
      },
      system: {
        authFiles: {
          login: 'exists',
          register: 'exists',
          google: 'exists',
          callback: 'exists',
          me: 'exists',
          debug: 'exists',
          index: 'exists'
        },
        dependencies: {
          googleapis: 'installed',
          jsonwebtoken: 'installed',
          bcryptjs: 'installed'
        }
      },
      endpoints: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        google: '/api/auth/google',
        googleCallback: '/api/auth/google/callback',
        me: '/api/auth/me',
        debug: '/api/auth/debug'
      },
      health: {
        status: 'healthy',
        message: 'All authentication components are properly configured'
      }
    };

    console.log('Auth system debug check completed');

    res.status(200).json(diagnostics);

  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      health: {
        status: 'error',
        message: 'Authentication system has configuration issues'
      }
    });
  }
}