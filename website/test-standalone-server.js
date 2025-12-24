/**
 * Diagnostic server startup
 * Test server initialization step by step
 */

console.log('=== SERVER DIAGNOSTIC STARTUP ===\n');

// Step 1: Environment check
console.log('Step 1: Checking Environment Variables');
try {
  const path = require('path');
  const projectRoot = path.join(__dirname);
  console.log('Project Root:', projectRoot);
  console.log('Working Directory:', process.cwd());

  // Load environment before security config
  require('dotenv').config({ path: '.env.local' });

  console.log('\nEnvironment Check:');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Present' : '❌ Missing');
  console.log('JWT_SECRET Length:', process.env.JWT_SECRET?.length || 'N/A');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Present' : '❌ Missing');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'default (development)');

} catch (envError) {
  console.error('❌ Environment Error:', envError.message);
  process.exit(1);
}

// Step 2: Security Config Check
console.log('\nStep 2: Testing Secure Config');
try {
  // Change to project directory
  if (process.cwd() !== __dirname) {
    process.chdir(__dirname);
    console.log('Changed working directory to:', __dirname);
  }

  const SecureConfig = require('./config/secure-config');
  console.log('✅ SecureConfig loaded successfully');

  const secureConfig = new SecureConfig();
  console.log('✅ SecureConfig instantiated successfully');

} catch (secureError) {
  console.error('❌ Secure Config Error:', secureError.message);
  process.exit(1);
}

// Step 3: Database Connection Check
console.log('\nStep 3: Testing Database Connection');
try {
  const { connectDatabase } = require('./config/database');

  connectDatabase()
    .then(() => {
      console.log('✅ Database connected successfully');
      return completeStartup();
    })
    .catch((dbError) => {
      console.error('❌ Database Error:', dbError.message);
      console.log('⚠️  Starting server in diagnostic mode (skip database)');
      return completeStartup({ skipDatabase: true });
    });

} catch (dbSetupError) {
  console.error('❌ Database Setup Error:', dbSetupError.message);
  console.log('⚠️  Starting server in diagnostic mode (skip database)');
  return completeStartup({ skipDatabase: true });
}

function completeStartup(options = {}) {
  console.log('\nStep 4: Starting Server...');

  try {
    const express = require('express');
    const cors = require('cors');
    const helmet = require('helmet');
    const rateLimit = require('express-rate-limit');
    const session = require('express-session');

    console.log('✅ Core dependencies loaded');

    const app = express();
    const PORT = process.env.PORT || 10000;

    // Trust proxy - CRITICAL for production
    app.set('trust proxy', 1);

    // Initialize secure configuration
    let secureConfig;
    try {
      const SecureConfig = require('./config/secure-config');
      secureConfig = new SecureConfig();
      console.log('✅ Secure configuration loaded');
    } catch (error) {
      console.log('⚠️  Secure config failed, using basic config');
      secureConfig = { validateEnvironment: () => {} }; // Mock
    }

    // Middleware setup
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
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      }
    }));

    // Rate limiting (simplified for diagnostic)
    const generalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { error: 'Too many requests from this IP, please try again.' },
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use('/api/', generalLimiter);

    console.log('✅ Middleware configured');

    // Basic health check
    app.get('/health', (req, res) => {
      res.json({
        status: 'diagnostic-up',
        timestamp: new Date().toISOString(),
        service: 'testnotifier-website',
        environment: process.env.NODE_ENV || 'development',
        auth: process.env.GOOGLE_CLIENT_ID ? 'oauth-configured' : 'oauth-placeholder',
        error_count: 0
      });
    });

    // Auth routes (simplified for testing)
    app.get('/api/auth/test', (req, res) => {
      res.json({
        status: 'auth-endpoint-reachable',
        oauth_status: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'needs-setup',
        jwt_status: process.env.JWT_SECRET ? 'ready' : 'missing'
      });
    });

    app.get('/api/oauth/test', (req, res) => {
      if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.includes('YOUR_')) {
        return res.status(503).json({
          status: 'oauth-not-ready',
          message: 'Google OAuth not configured. See GOOGLE_OAUTH_SETUP_EXACT.md',
          client_id: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'none'
        });
      }

      res.json({
        status: 'oauth-ready',
        message: 'Ready for Google OAuth authentication',
        client_configured: true
      });
    });

    // Final configuration
    app.use((req, res) => {
      res.status(404).json({ error: 'Diagnostic endpoint not found', available: ['/health', '/api/auth/test', '/api/oauth/test'] });
    });

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Diagnostic error:', err);
      res.status(500).json({
        error: 'Diagnostic server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🎉 DIAGNOSTIC SERVER READY!');
      console.log(`🌍 Port: ${PORT}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth Test: http://localhost:${PORT}/api/auth/test`);
      console.log(`🚪 OAuth Test: http://localhost:${PORT}/api/oauth/test`);
      console.log('');
      console.log('🎯 Ready for Google OAuth setup!');
      console.log('Complete Google OAuth setup, then test: http://localhost:10000/api/auth/google');
    });

  } catch (finalError) {
    console.error('\n❌ FINAL STARTUP ERROR:', finalError);
    process.exit(1);
  }
}