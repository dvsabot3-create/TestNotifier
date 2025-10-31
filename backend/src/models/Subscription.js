const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Subscription Details
  tier: {
    type: String,
    enum: ['free', 'one-off', 'starter', 'premium', 'professional'],
    required: true
  },

  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'past_due', 'incomplete', 'incomplete_expired'],
    default: 'active'
  },

  // Pricing Information
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'gbp'
    },
    interval: {
      type: String,
      enum: ['month', 'year', 'one-time'],
      required: true
    }
  },

  // Stripe Integration
  stripe: {
    customerId: {
      type: String,
      required: true
    },
    subscriptionId: String,
    priceId: String,
    paymentMethodId: String,
    invoiceId: String
  },

  // Billing Period
  currentPeriod: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },

  // Trial Information
  trial: {
    start: Date,
    end: Date,
    used: {
      type: Boolean,
      default: false
    }
  },

  // Cancellation
  cancellation: {
    cancelledAt: Date,
    reason: String,
    feedback: String,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },

  // Usage Limits
  limits: {
    pupils: {
      type: Number,
      required: true
    },
    checksPerMonth: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    notificationsPerMonth: {
      type: Number,
      default: -1
    }
  },

  // Usage Tracking
  usage: {
    pupilsCount: {
      type: Number,
      default: 0
    },
    checksPerformed: {
      type: Number,
      default: 0
    },
    notificationsSent: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },

  // Payment History
  payments: [{
    stripePaymentIntentId: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['succeeded', 'failed', 'pending', 'cancelled']
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Feature Access
  features: {
    smsNotifications: {
      type: Boolean,
      default: false
    },
    whatsappNotifications: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    autoRebooking: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    advancedAnalytics: {
      type: Boolean,
      default: false
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ 'stripe.customerId': 1 });
subscriptionSchema.index({ 'currentPeriod.end': 1 });
subscriptionSchema.index({ tier: 1, status: 1 }, { background: true });

// Pre-save middleware
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance methods
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.currentPeriod.end > new Date();
};

subscriptionSchema.methods.canCancel = function() {
  return ['active', 'past_due'].includes(this.status);
};

subscriptionSchema.methods.incrementUsage = function(type, amount = 1) {
  if (this.usage[type] !== undefined) {
    this.usage[type] += amount;
  }
};

subscriptionSchema.methods.checkUsageLimit = function(type) {
  const limit = this.limits[type === 'pupilsCount' ? 'pupils' : type];
  const current = this.usage[type];

  if (limit === -1) return true; // Unlimited
  return current < limit;
};

subscriptionSchema.methods.resetUsage = function() {
  this.usage.pupilsCount = 0;
  this.usage.checksPerformed = 0;
  this.usage.notificationsSent = 0;
  this.usage.lastReset = new Date();
};

// Static methods
subscriptionSchema.statics.findActiveSubscription = function(userId) {
  return this.findOne({
    userId,
    status: 'active',
    'currentPeriod.end': { $gt: new Date() }
  });
};

subscriptionSchema.statics.findByStripeCustomerId = function(customerId) {
  return this.findOne({ 'stripe.customerId': customerId });
};

subscriptionSchema.statics.getExpiringSubscriptions = function(days = 7) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  return this.find({
    status: 'active',
    'currentPeriod.end': { $lte: expirationDate }
  }).populate('userId', 'email firstName lastName');
};

// Virtual for usage percentage
subscriptionSchema.virtual('usagePercentage').get(function() {
  const usage = {};

  // Map pupils limit to pupilsCount usage
  if (this.limits.pupils !== undefined) {
    const limit = this.limits.pupils;
    const current = this.usage.pupilsCount || 0;

    if (limit === -1) {
      usage.pupilsCount = { current, limit: 'unlimited', percentage: 0 };
    } else {
      usage.pupilsCount = {
        current,
        limit,
        percentage: Math.round((current / limit) * 100)
      };
    }
  }

  // Map other limits
  Object.keys(this.limits).forEach(key => {
    if (key === 'pupils') return; // Already handled above

    const limit = this.limits[key];
    const usageKey = key === 'checksPerMonth' ? 'checksPerformed' :
                    key === 'notificationsPerMonth' ? 'notificationsSent' : key;
    const current = this.usage[usageKey] || 0;

    if (limit === -1) {
      usage[usageKey] = { current, limit: 'unlimited', percentage: 0 };
    } else {
      usage[usageKey] = {
        current,
        limit,
        percentage: Math.round((current / limit) * 100)
      };
    }
  });

  return usage;
});

module.exports = mongoose.model('Subscription', subscriptionSchema);