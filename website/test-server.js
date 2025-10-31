import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TestNotifier Railway Server is Running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    frontendUrl: process.env.FRONTEND_URL || 'not-set'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'api-working',
    message: 'API endpoints are accessible!',
    path: '/api/test'
  });
});

app.get('/api/auth/test', (req, res) => {
  res.json({
    status: 'auth-api-working',
    message: 'Auth API endpoints are accessible!',
    path: '/api/auth/test',
    envVars: {
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not-set',
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'set' : 'not-set',
      jwtSecret: process.env.JWT_SECRET ? 'set' : 'not-set'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'server-running',
    message: 'TestNotifier Railway Deployment Active!',
    endpoints: [
      '/health',
      '/api/test',
      '/api/auth/test'
    ],
    nextSteps: [
      'Update Google OAuth settings',
      'Update Stripe webhooks',
      'Test authentication flow',
      'Migrate DNS from Vercel'
    ]
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/',
      '/health',
      '/api/test',
      '/api/auth/test'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TestNotifier Railway Server Running!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Railway URL: ${process.env.FRONTEND_URL}`);
  console.log(`✅ Server started successfully!`);
});