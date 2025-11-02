import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, planName, planType, customerEmail } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Check for existing active subscription to prevent duplicates
    if (planType === 'subscription' && customerEmail) {
      try {
        const customers = await stripe.customers.list({
          email: customerEmail,
          limit: 1
        });

        if (customers.data.length > 0) {
          const customer = customers.data[0];
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1
          });

          if (subscriptions.data.length > 0) {
            const activeSubscription = subscriptions.data[0];
            console.log(`Active subscription found for ${customerEmail}: ${activeSubscription.id}`);
            
            return res.status(400).json({ 
              error: 'You already have an active subscription',
              details: 'Please cancel your current subscription before starting a new one.',
              existingSubscriptionId: activeSubscription.id
            });
          }
        }
      } catch (subscriptionCheckError) {
        console.error('Error checking for existing subscriptions:', subscriptionCheckError);
        // Continue with checkout if we can't verify (don't block legitimate new customers)
      }
    }

    // Create checkout session
    const baseUrl = (req.headers.origin || process.env.FRONTEND_URL?.trim() || 'https://testnotifier.co.uk').replace(/\n/g, '');
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;

    // Build checkout session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: planType === 'one-time' ? 'payment' : 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planName: planName,
        planType: planType,
        business_email: 'hello@testnotifier.co.uk',
        support_email: 'hello@testnotifier.co.uk',
        consolidated_email: 'true'
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Automatic tax calculation
      automatic_tax: { enabled: true },
      // Collect billing address
      billing_address_collection: 'required',
      // Collect shipping address for physical products (if any)
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      // Custom text for checkout
      custom_text: {
        submit: {
          message: planType === 'subscription' 
            ? 'You will be charged monthly. Cancel anytime from your dashboard.' 
            : 'You will receive instant access after payment confirmation.',
        },
      },
    };

    // Only add customer_creation for payment mode (not subscription mode)
    if (planType === 'one-time') {
      sessionConfig.customer_creation = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}

