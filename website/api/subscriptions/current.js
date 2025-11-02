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
      analytics: false,
      bulkOperations: false,
      instructorMode: false
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
      analytics: false,
      bulkOperations: false,
      instructorMode: false
    },
    'premium': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: true, // ✅ AUTO-BOOKING ENABLED
      rapidMode: true,
      stealthMode: false,
      prioritySupport: true,
      analytics: true,
      bulkOperations: true,
      instructorMode: false
    },
    'professional': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: true, // ✅ WHATSAPP EXCLUSIVE
      emailNotifications: true,
      autoRebook: true,
      rapidMode: true,
      stealthMode: true, // ✅ STEALTH MODE EXCLUSIVE
      prioritySupport: true,
      analytics: true,
      bulkOperations: true,
      instructorMode: true,
      phoneSupport: true
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
      analytics: false,
      bulkOperations: false,
      instructorMode: false
    }
  };
  
  return features[planType] || features['free'];
}

function getPlanLimits(planType) {
  const limits = {
    'oneoff': { 
      pupils: 1, 
      monitors: 1, 
      testCentres: 1,
      rebooksPerDay: 1,
      rebooksTotal: 1,
      notificationsPerDay: 5,
      checkFrequency: 120,
      validityDays: 30
    },
    'starter': { 
      pupils: 3, 
      monitors: 10, 
      testCentres: 3,
      rebooksPerDay: 2,
      notificationsPerDay: 10,
      checkFrequency: 60,
      validityDays: null
    },
    'premium': { 
      pupils: 5, 
      monitors: 20, 
      testCentres: 5,
      rebooksPerDay: 5,
      notificationsPerDay: 25,
      checkFrequency: 30,
      validityDays: null
    },
    'professional': { 
      pupils: 20, 
      monitors: null, 
      testCentres: 999,
      rebooksPerDay: 10,
      notificationsPerDay: 50,
      checkFrequency: 15,
      validityDays: null
    },
    'free': { 
      pupils: 1, 
      monitors: 1, 
      testCentres: 1,
      rebooksPerDay: 0,
      notificationsPerDay: 1,
      checkFrequency: 300,
      validityDays: 7
    }
  };
  
  return limits[planType] || limits['free'];
}


