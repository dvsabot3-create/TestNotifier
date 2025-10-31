const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Received webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
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
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper function to update customer email to hello@testnotifier.co.uk
async function updateCustomerEmail(customerId, email = 'hello@testnotifier.co.uk') {
  try {
    await stripe.customers.update(customerId, {
      email: email,
      metadata: {
        support_email: email,
        business_email: email,
        consolidated_email: 'true',
        email_updated_date: new Date().toISOString()
      }
    });
    console.log(`✅ Updated customer ${customerId} with email ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error updating customer email:', error);
    return false;
  }
}

// Webhook event handlers
async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  // Here you would typically:
  // 1. Create user account if needed
  // 2. Send welcome email
  // 3. Grant access to service
  // 4. Log the transaction

  const customerEmail = session.customer_details?.email;
  const planName = session.metadata?.planName;
  const customerId = session.customer;

  console.log(`Customer ${customerEmail} completed checkout for ${planName}`);

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Implement your business logic here
  // - Send welcome email
  // - Create user account
  // - Grant service access
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer;
  const planId = subscription.items.data[0].price.id;

  console.log(`New subscription created for customer ${customerId}, plan ${planId}`);

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Implement your business logic here
  // - Activate subscription features
  // - Send confirmation email
  // - Update user account status
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);

  const customerId = subscription.customer;

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Handle subscription changes
  // - Plan upgrades/downgrades
  // - Status changes
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);

  const customerId = subscription.customer;

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Handle subscription cancellation
  // - Revoke access
  // - Send cancellation email
  // - Update user account status
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded:', invoice.id);

  const customerId = invoice.customer;

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Handle successful recurring payments
  // - Extend subscription period
  // - Send payment confirmation
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed:', invoice.id);

  const customerId = invoice.customer;

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Handle failed payments
  // - Send payment failure notification
  // - Implement retry logic
  // - Handle subscription suspension
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const customerId = paymentIntent.customer;

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Handle successful one-time payments
  // - Grant access to service
  // - Send confirmation email
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  const customerId = paymentIntent.customer;

  // Update customer email to hello@testnotifier.co.uk for consolidated support
  if (customerId) {
    await updateCustomerEmail(customerId);
  }

  // TODO: Handle failed one-time payments
  // - Send failure notification
  // - Offer retry options
}

