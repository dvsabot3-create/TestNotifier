// Unified API handler to reduce serverless functions to under 12
export default async function handler(req, res) {
  const { method, query: { section, action }, url } = req;

  try {
    // Parse URL to determine route
    const path = new URL(url, `http://${req.headers.host}`).pathname;

    // Handle different API sections
    if (path.includes('/auth/') || section === 'auth') {
      const authHandler = await import('./auth/index.js');
      return authHandler.default(req, res);
    }

    if (path.includes('/billing/') || section === 'billing') {
      const billingHandler = await import('./billing/index.js');
      return billingHandler.default(req, res);
    }

    if (path.includes('/subscriptions/') || section === 'subscriptions') {
      const { current } = await import('./subscriptions/current.js');
      return current(req, res);
    }

    if (path.includes('create-checkout-session')) {
      const { createCheckoutSession } = await import('./create-checkout-session.js');
      return createCheckoutSession(req, res);
    }

    if (path.includes('get-checkout-session')) {
      const { getCheckoutSession } = await import('./get-checkout-session.js');
      return getCheckoutSession(req, res);
    }

    if (path.includes('/webhooks/stripe')) {
      const { stripeWebhook } = await import('./webhooks/stripe.js');
      return stripeWebhook(req, res);
    }

    // Default response
    res.status(404).json({ error: 'API endpoint not found' });

  } catch (error) {
    console.error('Unified API handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}