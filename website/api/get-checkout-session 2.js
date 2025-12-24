const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Fetch the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer', 'payment_intent', 'subscription']
    });

    // Extract customer email
    const customerEmail = session.customer_details?.email || session.customer_email || 'N/A';
    
    // Extract amount paid
    const amountTotal = session.amount_total / 100; // Convert from pence to pounds
    const currency = session.currency?.toUpperCase() || 'GBP';
    const formattedAmount = `£${amountTotal.toFixed(2)}`;
    
    // Get plan name from metadata or line items
    const planName = session.metadata?.planName || session.line_items?.data?.[0]?.description || 'Premium Plan';
    
    // Check payment status
    const paymentStatus = session.payment_status === 'paid' ? 'paid' : session.payment_status;
    
    // Return formatted session data
    res.status(200).json({
      planName,
      customerEmail,
      amount: formattedAmount,
      currency,
      status: paymentStatus,
      sessionId: session.id,
      customerId: session.customer,
      subscriptionId: session.subscription,
      createdAt: new Date(session.created * 1000).toISOString()
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve session details',
      details: error.message 
    });
  }
}


