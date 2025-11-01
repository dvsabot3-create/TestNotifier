const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// API Routes
try {
  // Auth API
  const authHandler = require('./api/auth/index.js');
  app.use('/api/auth', authHandler);
  console.log('✅ Auth API routes loaded');
} catch (err) {
  console.warn('⚠️  Auth API not available:', err.message);
}

try {
  // Billing API
  const billingHandler = require('./api/billing/index.js');
  app.use('/api/billing', billingHandler);
  console.log('✅ Billing API routes loaded');
} catch (err) {
  console.warn('⚠️  Billing API not available:', err.message);
}

try {
  // Stripe Checkout
  const checkoutHandler = require('./api/create-checkout-session.js');
  app.post('/api/create-checkout-session', checkoutHandler);
  console.log('✅ Stripe checkout route loaded');
} catch (err) {
  console.warn('⚠️  Stripe checkout not available:', err.message);
}

try {
  // Stripe Webhooks
  const webhookHandler = require('./api/webhooks/stripe.js');
  app.use('/api/webhooks', webhookHandler);
  console.log('✅ Stripe webhook routes loaded');
} catch (err) {
  console.warn('⚠️  Stripe webhooks not available:', err.message);
}

try {
  // Subscriptions API
  const subscriptionsHandler = require('./api/subscriptions/current.js');
  app.get('/api/subscriptions/current', subscriptionsHandler);
  console.log('✅ Subscriptions API routes loaded');
} catch (err) {
  console.warn('⚠️  Subscriptions API not available:', err.message);
}

// Health check endpoints
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'testnotifier-website',
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'testnotifier-website'
  });
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ TestNotifier website server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: /api/auth`);
  console.log(`💳 Billing API: /api/billing`);
  console.log(`📦 Subscriptions API: /api/subscriptions`);
});
