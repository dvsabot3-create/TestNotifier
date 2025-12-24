/**
 * Stripe Billing Portal
 * Creates a Stripe Customer Portal session for managing subscriptions
 */

const Stripe = require('stripe');
const jwt = require('jsonwebtoken');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userEmail = decoded.email;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }

    // Get or create Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: decoded.id || decoded.googleId,
          source: 'testnotifier_dashboard'
        }
      });
    }

    // Create billing portal session
    const returnUrl = req.body.returnUrl || `${process.env.FRONTEND_URL || 'https://testnotifier.co.uk'}/dashboard`;
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    res.status(200).json({
      success: true,
      url: session.url,
      data: {
        url: session.url,
        customerId: customer.id
      }
    });

  } catch (error) {
    console.error('Billing portal error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create billing portal session',
      message: error.message
    });
  }
};

