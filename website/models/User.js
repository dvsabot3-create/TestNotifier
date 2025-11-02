import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false // Optional for Google OAuth users
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: String,
  lastName: String,
  
  // Stripe Integration
  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripeSubscriptionId: String,
  
  // Subscription Details
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'oneoff', 'starter', 'premium', 'professional'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'trialing', 'canceled', 'past_due', 'unpaid', 'incomplete'],
      default: 'active'
    },
    stripePriceId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    trialStart: Date,
    trialEnd: Date,
    canceledAt: Date
  },
  
  // Usage Tracking
  usage: {
    rebooksToday: {
      type: Number,
      default: 0
    },
    rebooksThisMonth: {
      type: Number,
      default: 0
    },
    notificationsToday: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    },
    totalRebooks: {
      type: Number,
      default: 0
    },
    totalNotifications: {
      type: Number,
      default: 0
    }
  },
  
  // Instructor Profile (Professional Tier)
  instructorProfile: {
    adiNumber: String,
    baseLocation: String,
    travelRadius: {
      type: Number,
      min: 10,
      max: 100,
      default: 50
    },
    // DVSA Website Credentials (encrypted)
    dvsaCredentials: {
      email: String,
      encryptedPassword: String,
      lastValidated: Date
    }
  },
  
  // Extension Integration
  extensionInstalled: {
    type: Boolean,
    default: false
  },
  extensionVersion: String,
  lastExtensionSync: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ stripeCustomerId: 1 });
userSchema.index({ 'subscription.tier': 1, 'subscription.status': 1 });
userSchema.index({ googleId: 1 });

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance methods
userSchema.methods.resetDailyUsage = function() {
  const today = new Date().toDateString();
  const lastReset = new Date(this.usage.lastResetDate).toDateString();
  
  if (today !== lastReset) {
    this.usage.rebooksToday = 0;
    this.usage.notificationsToday = 0;
    this.usage.lastResetDate = new Date();
  }
};

userSchema.methods.canRebook = function() {
  // Reset daily limits if needed
  this.resetDailyUsage();
  
  const tierLimits = {
    'oneoff': 1,
    'starter': 2,
    'premium': 5,
    'professional': 10,
    'free': 0
  };
  
  const limit = tierLimits[this.subscription.tier] || 0;
  return this.usage.rebooksToday < limit;
};

userSchema.methods.incrementRebookUsage = async function() {
  this.usage.rebooksToday += 1;
  this.usage.rebooksThisMonth += 1;
  this.usage.totalRebooks += 1;
  await this.save();
};

export default mongoose.model('User', userSchema);

