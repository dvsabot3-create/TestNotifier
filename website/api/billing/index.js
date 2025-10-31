import stripe from 'stripe';

// Initialize Stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY?.trim());

// Import checkout session functions
import { createCheckoutSession } from '../create-checkout-session.js';
import { getCheckoutSession } from '../get-checkout-session.js';

// Stripe webhook handler
async function stripeWebhook(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    console.log('Received Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object.id);
        // Handle successful payment
        break;

      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded:', event.data.object.id);
        // Handle successful subscription payment
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object.id);
        // Handle subscription updates
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription cancelled:', event.data.object.id);
        // Handle subscription cancellation
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Unified billing handler to reduce serverless functions
export default async function handler(req, res) {
  const { method, query: { action }, url } = req;

  try {
    // Parse URL to determine route
    const urlObj = new URL(url, `http://${req.headers.host}`);
    const pathParts = urlObj.pathname.split('/');
    const pathAction = pathParts[pathParts.length - 1];

    // Determine which action to use
    const finalAction = action || pathAction;

    console.log('Billing handler called with:', { action, pathAction, finalAction, url: urlObj.pathname });

    switch (finalAction) {
      case 'create-checkout-session':
        return createCheckoutSession(req, res, stripeClient);

      case 'get-checkout-session':
        return getCheckoutSession(req, res, stripeClient);

      case 'stripe-webhook':
      case 'webhook':
        return stripeWebhook(req, res);

      case 'subscription':
        const { subscription } = await import('./subscription.js');
        return subscription(req, res);

      case 'portal':
        const { portal } = await import('./portal.js');
        return portal(req, res);

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