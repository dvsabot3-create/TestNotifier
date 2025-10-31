const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.subscription.tier)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.subscription.tier} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user has verified email
const requireEmailVerification = async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature'
    });
  }
  next();
};

// Check subscription tier access
const requireSubscription = (requiredTier) => {
  const tierHierarchy = {
    'free': 0,
    'one-off': 1,
    'starter': 2,
    'premium': 3,
    'professional': 4
  };

  return (req, res, next) => {
    const userTierLevel = tierHierarchy[req.user.subscription.tier] || 0;
    const requiredTierLevel = tierHierarchy[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        success: false,
        message: `This feature requires a ${requiredTier} subscription or higher`
      });
    }
    next();
  };
};

// Check if subscription is active
const requireActiveSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('subscription');

  if (!user.subscription || user.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'An active subscription is required to access this feature'
    });
  }
  next();
};

module.exports = {
  protect,
  authorize,
  requireEmailVerification,
  requireSubscription,
  requireActiveSubscription
};