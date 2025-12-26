/**
 * Get Current Subscription Status
 * Returns the user's current subscription details for real-time sync
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

/**
 * JWT Authentication Middleware
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Subscription API - Auth check:');
    console.log('  - Auth header present:', !!authHeader);
    console.log('  - Token present:', !!token);
    console.log('  - Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'NONE');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('  - JWT decoded successfully');
      console.log('  - Decoded email:', decoded.email);
      console.log('  - Decoded id:', decoded.id);
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Find user in database
    const user = await User.findOne({
      $or: [
        { email: decoded.email },
        { _id: decoded.id }
      ]
    });

    console.log('  - User found:', !!user);
    if (user) {
      console.log('  - User email:', user.email);
      console.log('  - User tier:', user.subscription?.tier);
    }

    if (!user) {
      console.log('❌ User not found for token');
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('✅ Authentication successful for:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Get current subscription status
 * GET /api/subscriptions/current
 */
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    console.log(`📊 Subscription status requested for user: ${user.email} (${user.subscription?.tier || 'free'})`);

    // Build subscription response
    const subscription = {
      id: user.subscription?.id || 'free',
      tier: user.subscription?.tier || 'free',
      status: user.subscription?.status || 'active',
      currentPeriodStart: user.subscription?.currentPeriodStart || null,
      currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
      cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
      usage: {
        monitorsCount: user.monitors?.length || 0,
        monitorsLimit: getTierMonitorLimit(user.subscription?.tier),
        rebooksToday: user.usage?.rebooksToday || 0,
        rebooksTotal: user.usage?.rebooksTotal || 0,
        rebooksLimit: getTierRebookLimit(user.subscription?.tier),
        notificationsSent: user.usage?.notificationsSent || 0,
        notificationsLimit: getTierNotificationLimit(user.subscription?.tier)
      }
    };

    console.log(`✅ Subscription data returned for ${user.email}:`, {
      tier: subscription.tier,
      status: subscription.status,
      monitors: subscription.usage.monitorsCount,
      rebooksToday: subscription.usage.rebooksToday
    });

    res.json({
      success: true,
      subscription: subscription
    });

  } catch (error) {
    console.error('❌ Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription status'
    });
  }
});

/**
 * Helper functions to get tier limits
 */
function getTierMonitorLimit(tier) {
  const limits = {
    'free': 1,
    'one-off': 1,
    'starter': 3,
    'premium': 10,
    'professional': -1 // unlimited
  };
  return limits[tier] || limits['free'];
}

function getTierRebookLimit(tier) {
  const limits = {
    'free': 0,
    'one-off': 0,
    'starter': 5,
    'premium': 20,
    'professional': -1 // unlimited
  };
  return limits[tier] || limits['free'];
}

function getTierNotificationLimit(tier) {
  const limits = {
    'free': 10,
    'one-off': 5,
    'starter': 100,
    'premium': 500,
    'professional': -1 // unlimited
  };
  return limits[tier] || limits['free'];
}

module.exports = router;
