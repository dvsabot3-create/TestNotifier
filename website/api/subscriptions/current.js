const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // In a real app, you'd validate the token and get user info
    // For demo purposes, we'll use a mock customer ID
    const customerId = 'cus_demo_customer_123';

    // Get customer's active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
      expand: ['data.items.data.price.product'],
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ 
        error: 'No active subscription found' 
      });
    }

    const subscription = subscriptions.data[0];
    const productName = subscription.items.data[0]?.price?.product?.name;

    // Map product names to plan types
    const planTypeMap = {
      'One-Off Rebook': 'oneoff',
      'Starter': 'starter', 
      'Premium': 'premium',
      'Professional': 'professional'
    };

    const planType = planTypeMap[productName] || 'free';

    // Get plan features and limits
    const features = getPlanFeatures(planType);
    const limits = getPlanLimits(planType);

    const subscriptionData = {
      id: subscription.id,
      planType: planType,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      features: features,
      limits: limits,
      productName: productName,
    };

    res.status(200).json({
      subscription: subscriptionData
    });

  } catch (error) {
    console.error('Error fetching current subscription:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
}

function getPlanFeatures(planType) {
  const features = {
    'oneoff': {
      multiPupil: false,
      smsNotifications: false,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: false,
      stealthMode: false,
      prioritySupport: false,
    },
    'starter': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: false,
      stealthMode: false,
      prioritySupport: false,
    },
    'premium': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: true,
      stealthMode: false,
      prioritySupport: true,
    },
    'professional': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: true,
      emailNotifications: true,
      autoRebook: true,
      rapidMode: true,
      stealthMode: true,
      prioritySupport: true,
    },
    'free': {
      multiPupil: false,
      smsNotifications: false,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: false,
      stealthMode: false,
      prioritySupport: false,
    }
  };
  
  return features[planType] || features['free'];
}

function getPlanLimits(planType) {
  const limits = {
    'oneoff': { pupils: 1, monitors: 1, notifications: 5 },
    'starter': { pupils: 3, monitors: 3, notifications: 10 },
    'premium': { pupils: 8, monitors: 8, notifications: 25 },
    'professional': { pupils: 20, monitors: 999, notifications: 50 },
    'free': { pupils: 1, monitors: 1, notifications: 1 }
  };
  
  return limits[planType] || limits['free'];
}


