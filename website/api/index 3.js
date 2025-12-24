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
      const billingHandler = await import('./billing/index.js');
      return billingHandler.default(req, res);
    }

    // Stripe webhook is now handled by billing system

    // Default response
    res.status(404).json({ error: 'API endpoint not found' });

  } catch (error) {
    console.error('Unified API handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}