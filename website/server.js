const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const SecureConfig = require('./config/secure-config');
const { csrfTokenMiddleware, csrfProtection } = require('./middleware/csrf');
const { connectDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 10000;

// Trust proxy - CRITICAL for Render (behind reverse proxy)
app.set('trust proxy', 1);

// Initialize secure configuration
let secureConfig;
try {
  secureConfig = new SecureConfig();
  console.log('✅ Secure configuration loaded');
} catch (error) {
  console.error('❌ Failed to load secure configuration:', error.message);
  console.error('Please ensure all required environment variables are set');
  process.exit(1);
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://www.googletagmanager.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://testnotifier.co.uk',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for CSRF
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CSRF Protection
app.use(csrfTokenMiddleware);
app.use('/api/', csrfProtection);

// Rate limiting - General API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login/register attempts per 15 minutes
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 payment requests per hour
  message: { error: 'Too many payment requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/create-checkout-session', paymentLimiter);
app.use('/api/billing', paymentLimiter);

// Comprehensive security headers
app.use((req, res, next) => {
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict browser features
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()');
  
  // Strict Transport Security (HSTS) - force HTTPS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Expect-CT header for certificate transparency
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Expect-CT', 'max-age=86400, enforce');
  }
  
  // Cross-Origin Resource Policy
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Cross-Origin-Opener-Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Cross-Origin-Embedder-Policy
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  
  // Disable caching for sensitive endpoints
  if (req.path.includes('/api/auth') || req.path.includes('/api/billing')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
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
  // Stripe Webhooks (function handler)
  const webhookHandler = require('./api/webhooks/stripe.js');
  app.post('/api/webhooks/stripe', webhookHandler);
  console.log('✅ Stripe webhook routes loaded');
} catch (err) {
  console.warn('⚠️  Stripe webhooks not available:', err.message);
}

try {
  // Subscriptions API (router)
  const subscriptionsRouter = require('./api/subscriptions/current.js');
  app.use('/api/subscriptions', subscriptionsRouter);
  console.log('✅ Subscriptions API routes loaded');
} catch (err) {
  console.warn('⚠️  Subscriptions API not available:', err.message);
}

try {
  // Notifications API (router)
  const notificationsRouter = require('./api/notifications/send.js');
  app.use('/api/notifications', notificationsRouter);
  console.log('✅ Notifications API routes loaded');
} catch (err) {
  console.warn('⚠️  Notifications API not available:', err.message);
}

try {
  // Contact API (router)
  const contactRouter = require('./api/contact/index.js');
  app.use('/api/contact', contactRouter);
  console.log('✅ Contact API routes loaded');
} catch (err) {
  console.warn('⚠️  Notifications API not available:', err.message);
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

connectDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('✅ Server + Database ready');
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🔐 Auth API: /api/auth`);
      console.log(`💳 Billing API: /api/billing`);
      console.log(`📦 Subscriptions API: /api/subscriptions`);
    });
  })
  .catch(err => {
    console.error('❌ Database failed:', err);
    process.exit(1);
  });
