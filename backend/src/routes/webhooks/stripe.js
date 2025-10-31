const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../../models/Subscription');
const User = require('../../models/User');

const router = express.Router();

// @desc    Handle Stripe webhook events
// @route   POST /api/webhooks/stripe
// @access  Public (Stripe sends this)
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook events
async function handleSubscriptionCreated(stripeSubscription) {
  // Implementation pending
  console.log('Subscription created:', stripeSubscription.id);
}

async function handleSubscriptionUpdated(stripeSubscription) {
  // Implementation pending
  console.log('Subscription updated:', stripeSubscription.id);
}

async function handleSubscriptionDeleted(stripeSubscription) {
  // Implementation pending
  console.log('Subscription deleted:', stripeSubscription.id);
}

async function handlePaymentSucceeded(invoice) {
  // Implementation pending
  console.log('Payment succeeded:', invoice.id);
}

async function handlePaymentFailed(invoice) {
  // Implementation pending
  console.log('Payment failed:', invoice.id);
}

async function handleCustomerDeleted(customer) {
  // Implementation pending
  console.log('Customer deleted:', customer.id);
}

module.exports = router;