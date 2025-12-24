const jwt = require('jsonwebtoken');
const { connectDatabase } = require('../config/database');
const User = require('../models/User');

/**
 * Validate user actions in real-time
 * Prevents bypassing subscription limits via local storage manipulation
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7);

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Connect to database and get user
    await connectDatabase();

    const userEmail = decoded.email || decoded.id;
    const user = await User.findOne({
      $or: [
        { email: userEmail },
        { _id: decoded.id }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate subscription is active
    if (user.subscription.status !== 'active' && user.subscription.status !== 'trialing') {
      return res.status(403).json({
        success: false,
        error: 'Subscription is not active',
        subscriptionStatus: user.subscription.status
      });
    }

    // Get action details
    const {
      action,
      monitorId,
      slotId,
      notificationTypes = [],
      estimatedCost = 1
    } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: 'Action is required'
      });
    }

    // Reset daily usage if needed
    user.resetDailyUsage();

    // Validate based on action type
    let validationResult = {};

    switch (action) {
      case 'send_notification':
        validationResult = validateNotificationAction(user, notificationTypes);
        break;

      case 'book_slot':
        validationResult = validateBookingAction(user, monitorId, slotId);
        break;

      case 'add_monitor':
        validationResult = validateMonitorAction(user);
        break;

      case 'check_slots':
        validationResult = validateSlotCheckAction(user);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Unknown action type'
        });
    }

    if (!validationResult.allowed) {
      return res.status(403).json({
        success: false,
        error: validationResult.error,
        subscriptionTier: user.subscription.tier,
        usage: user.usage,
        limits: getTierLimits(user.subscription.tier)
      });
    }

    // Update usage if action is allowed
    if (validationResult.updateUsage) {
      await user.save();
      console.log(`✅ Action validated for ${user.email}: ${action} (${user.subscription.tier})`);
    }

    // Return success with current limits
    res.status(200).json({
      success: true,
      allowed: true,
      subscriptionTier: user.subscription.tier,
      subscriptionStatus: user.subscription.status,
      usage: user.usage,
      limits: validationResult.limits || getTierLimits(user.subscription.tier),
      remaining: validationResult.remaining || {},
      message: validationResult.message || 'Action validated successfully'
    });

  } catch (error) {
    console.error('Action validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      details: error.message
    });
  }
}

/**
 * Validate notification sending based on tier
 */
function validateNotificationAction(user, notificationTypes) {
  const tier = user.subscription.tier;
  const errors = [];

  // Check each notification type
  for (const type of notificationTypes) {
    switch (type) {
      case 'sms':
        if (!['starter', 'premium', 'professional'].includes(tier)) {
          errors.push('SMS notifications require Starter tier or higher');
        }
        break;

      case 'whatsapp':
        if (tier !== 'professional') {
          errors.push('WhatsApp notifications require Professional tier');
        }
        break;

      case 'email':
        // Email is available to all tiers
        break;

      default:
        errors.push(`Unknown notification type: ${type}`);
    }
  }

  if (errors.length > 0) {
    return { allowed: false, error: errors.join(', ') };
  }

  return { allowed: true, updateUsage: false };
}

/**
 * Validate slot booking based on tier limits
 */
function validateBookingAction(user, monitorId, slotId) {
  const tier = user.subscription.tier;
  const usage = user.usage;

  // Check daily rebook limit
  if (usage.rebooksToday >= getTierLimits(tier).dailyRebooks && tier !== 'professional') {
    return {
      allowed: false,
      error: `Daily rebook limit reached (${getTierLimits(tier).dailyRebooks})`
    };
  }

  // Check monthly rebook limit
  if (usage.rebooksThisMonth >= getTierLimits(tier).monthlyRebooks && tier !== 'professional') {
    return {
      allowed: false,
      error: `Monthly rebook limit reached (${getTierLimits(tier).monthlyRebooks})`
    };
  }

  // Professional tier has unlimited rebooks
  if (tier === 'professional') {
    return {
      allowed: true,
      updateUsage: true,
      message: 'Unlimited rebooks available (Professional tier)'
    };
  }

  // Update usage for non-professional tiers
  user.usage.rebooksToday += 1;
  user.usage.rebooksThisMonth += 1;

  return {
    allowed: true,
    updateUsage: true,
    remaining: {
      dailyRebooks: getTierLimits(tier).dailyRebooks - user.usage.rebooksToday,
      monthlyRebooks: getTierLimits(tier).monthlyRebooks - user.usage.rebooksThisMonth
    }
  };
}

/**
 * Validate monitor creation based on tier
 */
function validateMonitorAction(user) {
  const tier = user.subscription.tier;
  const currentMonitors = user.monitors ? user.monitors.length : 0;
  const maxMonitors = getTierLimits(tier).monitors;

  if (currentMonitors >= maxMonitors) {
    return {
      allowed: false,
      error: `Monitor limit reached (${maxMonitors} monitors for ${tier} tier)`
    };
  }

  return { allowed: true, updateUsage: false };
}

/**
 * Validate slot checking (no specific limits, just subscription check)
 */
function validateSlotCheckAction(user) {
  // All active subscriptions can check slots
  return { allowed: true, updateUsage: false };
}

/**
 * Get tier-specific limits
 */
function getTierLimits(tier) {
  const limits = {
    free: {
      monitors: 1,
      dailyRebooks: 0,
      monthlyRebooks: 0,
      notifications: ['email']
    },
    oneoff: {
      monitors: 1,
      dailyRebooks: 1,
      monthlyRebooks: 1,
      notifications: ['email']
    },
    starter: {
      monitors: 3,
      dailyRebooks: 3,
      monthlyRebooks: 10,
      notifications: ['email', 'sms']
    },
    premium: {
      monitors: 10,
      dailyRebooks: 10,
      monthlyRebooks: 50,
      notifications: ['email', 'sms']
    },
    professional: {
      monitors: -1, // unlimited
      dailyRebooks: -1, // unlimited
      monthlyRebooks: -1, // unlimited
      notifications: ['email', 'sms', 'whatsapp']
    }
  };

  return limits[tier] || limits.free;
}

module.exports = handler;