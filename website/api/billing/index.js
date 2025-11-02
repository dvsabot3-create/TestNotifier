// Unified billing handler to reduce serverless functions
async function handler(req, res) {
  const { method, query: { action } } = req;

  try {
    switch (action) {
      case 'subscription':
        const { subscription } = await import('./subscription.js');
        return subscription(req, res);

      case 'portal':
        const portalHandler = require('./portal.js');
        return portalHandler(req, res);

      case 'plans':
        const { plans } = await import('./plans.js');
        return plans(req, res);

      default:
        res.status(400).json({ error: 'Invalid billing action' });
    }
  } catch (error) {
    console.error('Billing handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = handler;