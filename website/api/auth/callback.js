import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

// Get callback URL from environment or use default
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://testnotifier.co.uk/api/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  CALLBACK_URL
);

export async function callback(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error } = req.query;

    console.log('Google OAuth callback received:', { code: !!code, state: !!state, error });

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return res.redirect(`/auth/callback?error=oauth_failed&message=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect('/auth/callback?error=oauth_failed&message=Missing authorization code');
    }

    console.log('Exchanging code for tokens...');

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Getting user info from Google...');

    // Get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const { data: userInfo } = await oauth2.userinfo.get();

    console.log('Google user info received:', { id: userInfo.id, email: userInfo.email });

    if (!userInfo.email) {
      return res.redirect('/auth/callback?error=oauth_failed&message=No email provided');
    }

    // Decode redirect URL from state
    const redirectUrl = state ? Buffer.from(state, 'base64').toString() : '/';

    console.log('Generating JWT tokens...');

    // Generate JWT tokens for your application
    const accessToken = jwt.sign(
      {
        userId: userInfo.id,
        email: userInfo.email,
        provider: 'google'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: userInfo.id,
        email: userInfo.email
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Redirecting to frontend with tokens...');

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'https://testnotifier.co.uk';
    const redirectUrlWithTokens = new URL('/auth/callback', frontendUrl);
    redirectUrlWithTokens.searchParams.set('accessToken', accessToken);
    redirectUrlWithTokens.searchParams.set('refreshToken', refreshToken);
    redirectUrlWithTokens.searchParams.set('userId', userInfo.id);
    redirectUrlWithTokens.searchParams.set('email', userInfo.email);
    redirectUrlWithTokens.searchParams.set('firstName', userInfo.given_name || '');
    redirectUrlWithTokens.searchParams.set('lastName', userInfo.family_name || '');
    redirectUrlWithTokens.searchParams.set('avatar', userInfo.picture || '');

    console.log('Redirecting to:', redirectUrlWithTokens.toString());

    res.redirect(redirectUrlWithTokens.toString());

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`/auth/callback?error=token_generation_failed&message=${encodeURIComponent(error.message)}`);
  }
}