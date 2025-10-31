const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Sentry before any other middleware
const { initializeSentry, Sentry } = require('./config/sentry');
initializeSentry();

// Import Sentry handlers after initialization
let SentryHandlers = {};
if (process.env.SENTRY_DSN) {
  try {
    SentryHandlers = Sentry.Handlers || {};
  } catch (error) {
    console.log('⚠️  Sentry Handlers not available:', error.message);
  }
}

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');
const extensionRoutes = require('./routes/extension');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import database connection
const connectDB = require('./config/database');

const app = express();

// Sentry Request Handler must be the first middleware on the app
if (process.env.SENTRY_DSN && SentryHandlers.requestHandler) {
  app.use(SentryHandlers.requestHandler());
  app.use(SentryHandlers.tracingHandler());
}

// Connect to database (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL_PRODUCTION
    : process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/extension', extensionRoutes);

// Stripe webhook endpoint (needs raw body)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), require('./routes/webhooks/stripe'));

// Error handling middleware
// Sentry Error Handler must be before any other error middleware
if (process.env.SENTRY_DSN && SentryHandlers.errorHandler) {
  app.use(SentryHandlers.errorHandler());
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start HTTP server in non-test environments
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 TestNotifier Backend Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 CORS enabled for: ${corsOptions.origin}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    console.log('🔄 Shutting down the server due to unhandled promise rejection');
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.log(`❌ Error: ${err.message}`);
    console.log('🔄 Shutting down the server due to uncaught exception');
    process.exit(1);
  });
}

module.exports = app;