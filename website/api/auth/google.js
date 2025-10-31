import { google as googleapis } from 'googleapis';

// Use the correct callback URL from environment or default
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://testnotifier.co.uk/api/auth/google/callback';

const oauth2Client = new googleapis.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  CALLBACK_URL
);

// Generate Google OAuth URL
export async function google(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { redirect } = req.query;

    // Store redirect URL in state parameter
    const state = redirect ? Buffer.from(redirect).toString('base64') : '/';

    // Generate Google OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: state,
      prompt: 'consent'
    });

    console.log('Generated Google OAuth URL:', authUrl);
    console.log('Callback URL:', CALLBACK_URL);
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);

    // Redirect to Google OAuth
    res.redirect(authUrl);

  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    res.redirect(`/auth/callback?error=oauth_failed&message=${encodeURIComponent(error.message)}`);
  }
}