const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Import User model and database connection
const connectDatabase = async () => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) return;
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }
  
  await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

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
// Store state in memory (Passport doesn't preserve it by default)
const oauthStateStore = new Map();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      passReqToCallback: true  // Enable access to req object
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Get state from our memory store (set in /google route)
        const stateKey = profile.id || profile.emails[0].value;
        const state = oauthStateStore.get(stateKey) || '/';
        
        // Clean up
        oauthStateStore.delete(stateKey);
        
        console.log('🔐 GoogleStrategy: Retrieved state:', state);
        
        const userData = {
          googleId: profile.id,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
          firstName: profile.name.givenName || '',
          lastName: profile.name.familyName || '',
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          state: state  // Preserve state in userData
        };
        done(null, userData);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

router.use(passport.initialize());

router.get('/google', (req, res, next) => {
  // Check both 'state' and 'redirect' parameters for backwards compatibility
  const redirectUrl = req.query.state || req.query.redirect || '/dashboard';
  console.log('🔐 Google OAuth initiated with redirect:', redirectUrl);
  
  // Store state temporarily (will be retrieved in strategy using profile.id)
  // We'll clean this up after callback
  const tempStateKey = Date.now().toString();
  oauthStateStore.set(tempStateKey, redirectUrl);
  
  // Also store with a cleanup timeout (5 minutes)
  setTimeout(() => {
    oauthStateStore.delete(tempStateKey);
  }, 5 * 60 * 1000);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: tempStateKey,  // Pass temp key as state
    session: false
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, userData, info) => {
    try {
      if (err || !userData) {
        console.error('Google OAuth callback error:', err);
        const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
        return res.redirect(`${frontendUrl}/auth/callback?error=oauth_failed`);
      }

      // Get state from OAuth state parameter and retrieve our stored redirect URL
      const stateKey = req.query.state;
      const redirectUrl = userData.state || oauthStateStore.get(stateKey) || '/';
      
      // Clean up stored state
      if (stateKey) {
        oauthStateStore.delete(stateKey);
      }
      
      console.log('✅ Google OAuth callback - redirect URL:', redirectUrl, '(from userData.state)');

      // Connect to database
      await connectDatabase();

      // Find or create user in database
      let user = await User.findOne({ googleId: userData.googleId });
      
      if (!user) {
        // Check if user exists by email
        user = await User.findOne({ email: userData.email.toLowerCase() });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = userData.googleId;
          user.firstName = user.firstName || userData.firstName;
          user.lastName = user.lastName || userData.lastName;
          await user.save();
        } else {
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
        }
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      const jwtSecret = process.env.JWT_SECRET;
      const accessToken = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          googleId: user.googleId 
        }, 
        jwtSecret, 
        { expiresIn: '7d' }
      );
      const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '30d' });

      // redirectUrl was already extracted above from req.query.state
      const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
      const callbackUrl = new URL('/auth/callback', frontendUrl);
      callbackUrl.searchParams.set('accessToken', accessToken);
      callbackUrl.searchParams.set('refreshToken', refreshToken);
      callbackUrl.searchParams.set('userId', user._id.toString());
      callbackUrl.searchParams.set('email', user.email);
      callbackUrl.searchParams.set('firstName', user.firstName);
      callbackUrl.searchParams.set('lastName', user.lastName);
      callbackUrl.searchParams.set('redirect', redirectUrl);
      
      console.log('🔀 Redirecting to:', callbackUrl.toString());
      res.redirect(callbackUrl.toString());
    } catch (error) {
      console.error('Google OAuth token generation error:', error);
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

module.exports = router;