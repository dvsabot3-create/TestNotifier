const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const { connectDatabase } = require('../../config/database');
const User = require('../../models/User');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDatabase();
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT and get user
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    const userEmail = decoded.email || decoded.id;
    
    // Get user from database
    const user = await User.findOne({ 
      $or: [
        { email: userEmail },
        { _id: decoded.id }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const customerId = user.stripeCustomerId;

    // Return user's subscription from database
    const planType = user.subscription.tier;
    const features = getPlanFeatures(planType);
    const limits = getPlanLimits(planType);
    
    // Reset daily usage if needed
    user.resetDailyUsage();
    await user.save();

    const subscriptionData = {
      tier: user.subscription.tier,
      status: user.subscription.status,
      currentPeriodStart: user.subscription.currentPeriodStart,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
      trialEnd: user.subscription.trialEnd,
      features: features,
      limits: limits,
      usage: {
        rebooksToday: user.usage.rebooksToday,
        rebooksThisMonth: user.usage.rebooksThisMonth,
        notificationsToday: user.usage.notificationsToday,
        canRebook: user.canRebook()
      },
      instructorProfile: user.subscription.tier === 'professional' ? user.instructorProfile : null
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


