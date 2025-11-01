// Unified auth handler to reduce serverless functions
export default async function handler(req, res) {
  const { method, query: { action } } = req;

  try {
    switch (action) {
      case 'login':
        const { login } = await import('./login.js');
        return login(req, res);

      case 'register':
        const { register } = await import('./register.js');
        return register(req, res);

      case 'google':
        const { google } = await import('./google.js');
        return google(req, res);

      case 'callback':
        const { callback } = await import('./callback.js');
        return callback(req, res);

      case 'me':
        const { me } = await import('./me.js');
        return me(req, res);

      case 'debug':
        const { debug } = await import('./debug.js');
        return debug(req, res);

      default:
        res.status(400).json({ error: 'Invalid auth action' });
    }
  } catch (error) {
    console.error('Auth handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}