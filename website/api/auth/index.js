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
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          googleId: profile.id,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
          firstName: profile.name.givenName || '',
          lastName: profile.name.familyName || '',
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
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
  const redirectUrl = req.query.redirect || '/dashboard';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirectUrl,
    session: false
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    try {
      if (err || !user) {
        console.error('Google OAuth callback error:', err);
        const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
        return res.redirect(`${frontendUrl}/auth/callback?error=oauth_failed`);
      }

      const jwtSecret = process.env.JWT_SECRET || 'your_fallback_secret_key';
      const accessToken = jwt.sign({ id: user.googleId, email: user.email }, jwtSecret, { expiresIn: '7d' });
      const refreshToken = jwt.sign({ id: user.googleId }, jwtSecret, { expiresIn: '30d' });

      const redirectUrl = req.query.state || '/dashboard';
      const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
      const callbackUrl = new URL('/auth/callback', frontendUrl);
      callbackUrl.searchParams.set('accessToken', accessToken);
      callbackUrl.searchParams.set('refreshToken', refreshToken);
      callbackUrl.searchParams.set('userId', user.googleId);
      callbackUrl.searchParams.set('email', user.email);
      callbackUrl.searchParams.set('firstName', user.firstName);
      callbackUrl.searchParams.set('lastName', user.lastName);
      if (user.avatar) callbackUrl.searchParams.set('avatar', user.avatar);

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
    const jwtSecret = process.env.JWT_SECRET || 'your_fallback_secret_key';
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
    const jwtSecret = process.env.JWT_SECRET || 'your_fallback_secret_key';
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