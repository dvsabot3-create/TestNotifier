const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectDatabase } = require('../../config/database');

const router = express.Router();

// Define User model inline to avoid import issues
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: String,
  googleId: String,
  firstName: String,
  lastName: String,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscription: {
    tier: { type: String, default: 'free' },
    status: { type: String, default: 'active' }
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Configure passport with Google Strategy
let googleStrategyConfigured = false;
try {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'https://testnotifier.co.uk/api/auth/google/callback';
  
  console.log('🔐 Configuring Google Strategy:');
  console.log('  - Client ID:', clientID ? `${clientID.substring(0, 20)}...` : 'NOT SET');
  console.log('  - Client Secret:', clientSecret ? 'SET' : 'NOT SET');
  console.log('  - Callback URL:', callbackURL);
  
  if (!clientID || !clientSecret) {
    console.error('❌ Google OAuth credentials missing! Strategy NOT configured.');
  } else {
    passport.use(
      new GoogleStrategy(
        {
          clientID: clientID,
          clientSecret: clientSecret,
          callbackURL: callbackURL,
          passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const encodedState = req.query.state || '';
            let redirectUrl = '/';
            
            try {
              redirectUrl = encodedState ? Buffer.from(encodedState, 'base64').toString('utf8') : '/';
              console.log('🔐 GoogleStrategy: Decoded redirect URL:', redirectUrl);
            } catch (decodeError) {
              console.error('Failed to decode state, using default:', decodeError);
              redirectUrl = '/';
            }
            
            const userData = {
              googleId: profile.id,
              email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
              firstName: profile.name.givenName || '',
              lastName: profile.name.familyName || '',
              avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
              state: redirectUrl
            };
            done(null, userData);
          } catch (error) {
            console.error('Google OAuth error:', error);
            done(error, null);
          }
        }
      )
    );
    googleStrategyConfigured = true;
    console.log('✅ Google Strategy configured successfully');
  }
} catch (strategyError) {
  console.error('❌ Failed to configure Google Strategy:', strategyError.message);
}

router.use(passport.initialize());

// Diagnostic endpoint to check OAuth configuration
router.get('/status', (req, res) => {
  res.json({
    googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleClientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    frontendUrl: process.env.FRONTEND_URL || 'not set',
    jwtSecretSet: !!process.env.JWT_SECRET,
    databaseUrlSet: !!process.env.DATABASE_URL
  });
});

router.get('/google', (req, res, next) => {
  // Check if Google Strategy is configured
  if (!googleStrategyConfigured) {
    console.error('❌ Google OAuth not configured - strategy failed to initialize');
    return res.status(500).json({
      error: 'Google OAuth not configured',
      message: 'Google authentication is not available. Please contact support.',
      debug: {
        clientIdSet: !!process.env.GOOGLE_CLIENT_ID,
        clientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'not set'
      }
    });
  }

  // Get redirect URL from state parameter
  const redirectUrl = req.query.state || req.query.redirect || '/dashboard';
  console.log('🔐 Google OAuth initiated with redirect:', redirectUrl);
  
  // Encode redirect URL as base64 to pass through Google OAuth state
  const encodedState = Buffer.from(redirectUrl).toString('base64');
  console.log('🔐 Encoded state for Google OAuth:', encodedState);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: encodedState,
    session: false
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, userData, info) => {
    try {
      if (err || !userData) {
        console.error('❌ Google OAuth callback error:', err);
        console.error('❌ UserData:', userData);
        console.error('❌ Info:', info);
        const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
        return res.redirect(`${frontendUrl}/auth/callback?error=oauth_failed`);
      }

      // Get state from OAuth state parameter and retrieve our stored redirect URL
      const stateKey = req.query.state;
      const redirectUrl = userData.state || '/'; // userData.state already contains the decoded redirect URL

      // Clean up stored state (no oauthStateStore needed since we use encoded state)
      // Note: oauthStateStore was undefined - we now use state passed through Google OAuth
      
      console.log('✅ Google OAuth callback - redirect URL:', redirectUrl, '(from userData.state)');
      console.log('✅ Google OAuth userData:', {
        googleId: userData.googleId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      });

      // Validate required user data
      if (!userData.googleId || !userData.email) {
        throw new Error('Missing required user data from Google OAuth');
      }

      // Connect to database
      console.log('🔌 Connecting to database...');
      await connectDatabase();
      console.log('✅ Database connected');

      // Find or create user in database
      console.log('🔍 Looking up user by googleId:', userData.googleId);
      let user = await User.findOne({ googleId: userData.googleId });
      
      if (!user) {
        console.log('🔍 User not found by googleId, checking by email:', userData.email.toLowerCase());
        // Check if user exists by email
        user = await User.findOne({ email: userData.email.toLowerCase() });
        
        if (user) {
          console.log('✅ Found existing user by email, linking Google account');
          // Link Google account to existing user
          user.googleId = userData.googleId;
          user.firstName = user.firstName || userData.firstName;
          user.lastName = user.lastName || userData.lastName;
          await user.save();
          console.log('✅ User updated with Google account');
        } else {
          console.log('➕ Creating new user');
          // Create new user
          user = await User.create({
            googleId: userData.googleId,
            email: userData.email.toLowerCase(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            subscription: {
              tier: 'free',
              status: 'active'
            }
          });
          console.log('✅ New user created:', user._id);
        }
      } else {
        console.log('✅ Found existing user:', user._id);
      }

      // Validate user object
      if (!user || !user._id) {
        throw new Error('User object is invalid after creation/update');
      }

      // Validate JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      if (process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
      }

      console.log('🔐 Generating JWT tokens...');
      const jwtSecret = process.env.JWT_SECRET;
      const accessToken = jwt.sign(
        { 
          id: user._id.toString(), 
          email: user.email,
          googleId: user.googleId 
        }, 
        jwtSecret, 
        { expiresIn: '7d' }
      );
      const refreshToken = jwt.sign({ id: user._id.toString() }, jwtSecret, { expiresIn: '30d' });
      console.log('✅ JWT tokens generated');

      // Build callback URL safely
      const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
      let callbackUrl;
      try {
        callbackUrl = new URL('/auth/callback', frontendUrl);
        callbackUrl.searchParams.set('accessToken', accessToken);
        callbackUrl.searchParams.set('refreshToken', refreshToken);
        callbackUrl.searchParams.set('userId', user._id.toString());
        callbackUrl.searchParams.set('email', user.email);
        callbackUrl.searchParams.set('firstName', user.firstName || '');
        callbackUrl.searchParams.set('lastName', user.lastName || '');
        callbackUrl.searchParams.set('redirect', redirectUrl);
      } catch (urlError) {
        console.error('❌ Failed to construct callback URL:', urlError);
        throw new Error(`Invalid FRONTEND_URL: ${frontendUrl}`);
      }
      
      console.log('🔀 Redirecting to:', callbackUrl.toString());
      res.redirect(callbackUrl.toString());
    } catch (error) {
      console.error('❌ Google OAuth token generation error:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      
      // Log environment variables status (without exposing values)
      console.error('❌ Environment check:');
      console.error('  - DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
      console.error('  - JWT_SECRET:', process.env.JWT_SECRET ? `✅ Set (${process.env.JWT_SECRET.length} chars)` : '❌ Missing');
      console.error('  - FRONTEND_URL:', process.env.FRONTEND_URL || 'Using default');
      
      const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
      return res.redirect(`${frontendUrl}/auth/callback?error=token_generation_failed`);
    }
  })(req, res, next);
});

// EMAIL/PASSWORD REGISTRATION
router.post('/register', async (req, res) => {
  try {
    await connectDatabase();
    
    const { name, email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered. Please sign in instead.' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const nameParts = (name || email).split(' ');
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      subscription: {
        tier: 'free',
        status: 'active'
      }
    });
    
    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Return success
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      subscription: user.subscription
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.' 
    });
  }
});

// EMAIL/PASSWORD LOGIN
router.post('/login', async (req, res) => {
  try {
    await connectDatabase();
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Check if user has password (might be Google OAuth only user)
    if (!user.password) {
      return res.status(401).json({ 
        success: false,
        message: 'This account uses Google sign-in. Please use "Continue with Google".' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Return success
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      subscription: user.subscription
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.' 
    });
  }
});

// GET CURRENT USER (for token refresh)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDatabase();
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to get user data' 
    });
  }
});

module.exports = router;