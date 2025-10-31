// Import individual auth functions
import { login } from './login.js';
import { register } from './register.js';
import { me } from './me.js';
import { debug } from './debug.js';
import { google } from './google.js';
import { callback } from './callback.js';

// Unified auth handler to reduce serverless functions
export default async function handler(req, res) {
  const { method, query: { action }, url } = req;

  try {
    // Parse the full URL to get the correct action from path
    const urlObj = new URL(url, `http://${req.headers.host}`);
    const pathParts = urlObj.pathname.split('/');
    const pathAction = pathParts[pathParts.length - 1]; // Get the last part of the path

    // Determine which action to use
    const finalAction = action || pathAction;

    console.log('Auth handler called with:', { action, pathAction, finalAction, url: urlObj.pathname });

    switch (finalAction) {
      case 'login':
        return login(req, res);

      case 'register':
        return register(req, res);

      case 'google':
        return google(req, res);

      case 'google/callback':
      case 'callback':
        return callback(req, res);

      case 'me':
        return me(req, res);

      case 'debug':
        return debug(req, res);

      default:
        console.log('Invalid auth action:', finalAction);
        res.status(400).json({ error: `Invalid auth action: ${finalAction}` });
    }
  } catch (error) {
    console.error('Auth handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}