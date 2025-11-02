import Stripe from 'stripe';
import { connectDatabase } from '../../config/database.js';
import User from '../../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  // Connect to database
  await connectDatabase();
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

  const customerEmail = session.customer_details?.email;
  const planName = session.metadata?.planName;
  const planType = session.metadata?.planType;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  console.log(`Customer ${customerEmail} completed checkout for ${planName}`);

  try {
    // Find or create user
    let user = await User.findOne({ email: customerEmail.toLowerCase() });
    
    if (!user) {
      // Create new user
      const names = session.customer_details?.name?.split(' ') || ['', ''];
      user = await User.create({
        email: customerEmail.toLowerCase(),
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscription: {
          tier: mapPlanNameToTier(planName),
          status: subscriptionId ? 'trialing' : 'active',
          stripePriceId: session.line_items?.data[0]?.price?.id
        }
      });
      console.log('✅ New user created:', user.email);
    } else {
      // Update existing user
      user.stripeCustomerId = customerId;
      user.stripeSubscriptionId = subscriptionId;
      user.subscription.tier = mapPlanNameToTier(planName);
      user.subscription.status = subscriptionId ? 'trialing' : 'active';
      user.subscription.stripePriceId = session.line_items?.data[0]?.price?.id;
      await user.save();
      console.log('✅ Existing user updated:', user.email);
    }
    
    // Update customer email for support
    if (customerId) {
      await updateCustomerEmail(customerId);
    }
    
    console.log('✅ Checkout completed successfully for:', customerEmail);
  } catch (error) {
    console.error('❌ Error handling checkout completion:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);

  const customerId = subscription.customer;
  const planId = subscription.items.data[0].price.id;
  const productName = subscription.items.data[0]?.price?.product?.name;

  console.log(`New subscription created for customer ${customerId}, plan ${planId}`);

  try {
    // Find user by Stripe customer ID
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (user) {
      user.stripeSubscriptionId = subscription.id;
      user.subscription.tier = mapPlanIdToTier(planId);
      user.subscription.status = subscription.status;
      user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
      
      if (subscription.trial_end) {
        user.subscription.trialEnd = new Date(subscription.trial_end * 1000);
      }
      
      await user.save();
      console.log('✅ User subscription activated:', user.email);
    } else {
      console.warn('⚠️ User not found for customer:', customerId);
    }
    
    // Update customer email
    if (customerId) {
      await updateCustomerEmail(customerId);
    }
  } catch (error) {
    console.error('❌ Error handling subscription creation:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);

  const customerId = subscription.customer;

  try {
    const user = await User.findOne({ stripeSubscriptionId: subscription.id });
    
    if (user) {
      user.subscription.status = subscription.status;
      user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
      
      // Handle plan changes
      const newPlanId = subscription.items.data[0]?.price?.id;
      if (newPlanId) {
        user.subscription.tier = mapPlanIdToTier(newPlanId);
        user.subscription.stripePriceId = newPlanId;
      }
      
      await user.save();
      console.log('✅ Subscription updated:', user.email);
    }
    
    if (customerId) {
      await updateCustomerEmail(customerId);
    }
  } catch (error) {
    console.error('❌ Error handling subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);

  const customerId = subscription.customer;

  try {
    const user = await User.findOne({ stripeSubscriptionId: subscription.id });
    
    if (user) {
      user.subscription.status = 'canceled';
      user.subscription.canceledAt = new Date();
      user.subscription.cancelAtPeriodEnd = true;
      
      // If one-off expired, revert to free tier
      if (user.subscription.tier === 'oneoff') {
        user.subscription.tier = 'free';
      }
      
      await user.save();
      console.log('✅ Subscription canceled:', user.email);
    }
    
    if (customerId) {
      await updateCustomerEmail(customerId);
    }
  } catch (error) {
    console.error('❌ Error handling subscription deletion:', error);
    throw error;
  }
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

  try {
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (user && user.subscription.status === 'active') {
      user.subscription.status = 'past_due';
      await user.save();
      console.log('⚠️ User payment failed, marked past_due:', user.email);
    }
    
    if (customerId) {
      await updateCustomerEmail(customerId);
    }
  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

// Helper function to map Stripe plan names/IDs to tier names
function mapPlanNameToTier(planName) {
  const mapping = {
    'One-Off Rebook': 'oneoff',
    'One-Off': 'oneoff',
    'Starter': 'starter',
    'Starter Plan': 'starter',
    'Premium': 'premium',
    'Premium Plan': 'premium',
    'Professional': 'professional',
    'Professional Plan': 'professional'
  };
  return mapping[planName] || 'free';
}

function mapPlanIdToTier(priceId) {
  if (priceId.includes('oneoff')) return 'oneoff';
  if (priceId.includes('starter')) return 'starter';
  if (priceId.includes('premium')) return 'premium';
  if (priceId.includes('pro') || priceId.includes('professional')) return 'professional';
  return 'free';
}

