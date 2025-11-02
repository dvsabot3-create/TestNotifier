const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');

const router = express.Router();

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

module.exports = router;