/**
 * Access Control Manager - Central coordination of all access control systems
 * Manages trial mode, device fingerprinting, user limitations, and subscription validation
 */

class AccessControlManager {
  constructor() {
    this.trialManager = new TrialManager();
    this.deviceFingerprint = new DeviceFingerprint();
    this.userLimitationsUI = new UserLimitationsUI();
    this.subscriptionValidator = new SubscriptionValidator();
    this.usageMonitor = new UsageMonitor();
    this.isInitialized = false;
    this.currentUser = null;
    this.currentSubscription = null;
  }

  /**
   * Initialize all access control systems
   */
  async initialize() {
    try {
      console.log('🔐 Initializing Access Control Manager...');

      // Initialize individual components
      await this.trialManager.initialize(this.currentSubscription);
      this.userLimitationsUI.initialize();
      await this.deviceFingerprint.getFingerprint(); // Pre-generate fingerprint

      this.isInitialized = true;
      console.log('✅ Access Control Manager initialized successfully');

      // Start monitoring
      this.startMonitoring();

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Access Control Manager:', error);
      return false;
    }
  }

  /**
   * Validate user access for a specific operation
   */
  async validateAccess(operation, context = {}) {
    try {
      // Check if system is initialized
      if (!this.isInitialized) {
        console.warn('⚠️ Access Control Manager not initialized');
        return { allowed: false, reason: 'system_not_initialized' };
      }

      // Get current user and subscription
      const userData = await this.getCurrentUser();
      if (!userData) {
        return { allowed: false, reason: 'not_authenticated' };
      }

      this.currentUser = userData.user;
      this.currentSubscription = userData.subscription;

      // Check device session validity
      const sessionValid = await this.deviceFingerprint.isSessionValid(
        this.currentUser.id,
        userData.authToken
      );

      if (!sessionValid) {
        return { allowed: false, reason: 'invalid_session' };
      }

      // Check trial mode restrictions
      if (this.trialManager.isInTrialMode()) {
        const trialBlocked = this.trialManager.blockRealOperation(operation, context);
        if (trialBlocked) {
          return { allowed: false, reason: 'trial_mode_restricted' };
        }
      }

      // Check usage limits
      const usageCheck = await this.usageMonitor.checkUsageLimits(
        this.currentUser.id,
        this.currentSubscription?.tier,
        operation,
        context
      );

      if (!usageCheck.allowed) {
        return { allowed: false, reason: usageCheck.reason, limit: usageCheck.limit };
      }

      // Check tier-specific feature access
      const tierCheck = this.checkTierAccess(operation, this.currentSubscription?.tier);
      if (!tierCheck.allowed) {
        return { allowed: false, reason: tierCheck.reason, requiredTier: tierCheck.requiredTier };
      }

      // All checks passed
      return { allowed: true, subscription: this.currentSubscription };

    } catch (error) {
      console.error('❌ Access validation error:', error);
      return { allowed: false, reason: 'validation_error' };
    }
  }

  /**
   * Check tier-specific feature access
   */
  checkTierAccess(operation, tier) {
    const tierPermissions = {
      'trial': {
        'view_demo': true,
        'explore_interface': true,
        'add_pupil': false,
        'monitor_slots': false,
        'auto_book': false,
        'notifications': false,
        'bulk_operations': false,
        'stealth_mode': false
      },
      'one-off': {
        'view_demo': true,
        'explore_interface': true,
        'add_pupil': true,
        'monitor_slots': false,
        'auto_book': false,
        'notifications': true,
        'bulk_operations': false,
        'stealth_mode': false
      },
      'starter': {
        'view_demo': true,
        'explore_interface': true,
        'add_pupil': true,
        'monitor_slots': true,
        'auto_book': false,
        'notifications': true,
        'bulk_operations': false,
        'stealth_mode': false
      },
      'premium': {
        'view_demo': true,
        'explore_interface': true,
        'add_pupil': true,
        'monitor_slots': true,
        'auto_book': true,
        'notifications': true,
        'bulk_operations': false,
        'stealth_mode': false
      },
      'professional': {
        'view_demo': true,
        'explore_interface': true,
        'add_pupil': true,
        'monitor_slots': true,
        'auto_book': true,
        'notifications': true,
        'bulk_operations': true,
        'stealth_mode': true
      }
    };

    const permissions = tierPermissions[tier] || tierPermissions['trial'];

    if (!permissions[operation]) {
      const requiredTier = this.getRequiredTier(operation);
      return {
        allowed: false,
        reason: 'tier_restricted',
        requiredTier: requiredTier
      };
    }

    return { allowed: true };
  }

  /**
   * Get required tier for an operation
   */
  getRequiredTier(operation) {
    const tierRequirements = {
      'add_pupil': 'one-off',
      'monitor_slots': 'starter',
      'auto_book': 'premium',
      'notifications': 'one-off',
      'bulk_operations': 'professional',
      'stealth_mode': 'professional'
    };

    return tierRequirements[operation] || 'trial';
  }

  /**
   * Show user limitations UI
   */
  async showUserLimitations() {
    if (!this.currentSubscription) {
      console.warn('⚠️ No subscription data available');
      return;
    }

    const usageStats = await this.usageMonitor.getUsageStats(this.currentUser.id);
    this.userLimitationsUI.showLimitations(this.currentSubscription, usageStats);
  }

  /**
   * Show limitation warning for specific operation
   */
  showLimitationWarning(operation, currentUsage, limit) {
    this.userLimitationsUI.showLimitationWarning(operation, currentUsage, limit);
  }

  /**
   * Get current user data
   */
  async getCurrentUser() {
    try {
      const result = await chrome.storage.local.get(['user_data', 'auth_token']);

      if (!result.user_data || !result.auth_token) {
        return null;
      }

      return {
        user: result.user_data.user,
        subscription: result.user_data.subscription,
        authToken: result.auth_token
      };
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Start monitoring systems
   */
  startMonitoring() {
    // Monitor subscription changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes.user_data) {
        this.handleSubscriptionChange(changes.user_data.newValue);
      }
    });

    // Periodic validation
    setInterval(() => {
      this.performPeriodicValidation();
    }, 5 * 60 * 1000); // Every 5 minutes

    console.log('🔍 Access control monitoring started');
  }

  /**
   * Handle subscription changes
   */
  async handleSubscriptionChange(newUserData) {
    if (newUserData?.subscription) {
      this.currentSubscription = newUserData.subscription;

      // Re-initialize trial manager with new subscription
      await this.trialManager.initialize(this.currentSubscription);

      console.log('📊 Subscription updated:', this.currentSubscription.tier);

      // Show updated limitations
      if (this.userLimitationsUI.isVisible) {
        this.showUserLimitations();
      }
    }
  }

  /**
   * Perform periodic validation
   */
  async performPeriodicValidation() {
    try {
      const userData = await this.getCurrentUser();
      if (!userData) return;

      // Validate session
      const sessionValid = await this.deviceFingerprint.isSessionValid(
        userData.user.id,
        userData.authToken
      );

      if (!sessionValid) {
        console.log('⚠️ Periodic validation: Session invalid');
        this.handleInvalidSession();
        return;
      }

      // Check for subscription updates
      const subscriptionValid = await this.subscriptionValidator.validateSubscription(
        userData.user.id,
        userData.authToken
      );

      if (!subscriptionValid.valid) {
        console.log('⚠️ Periodic validation: Subscription invalid');
        this.handleInvalidSubscription();
      }

    } catch (error) {
      console.error('❌ Periodic validation error:', error);
    }
  }

  /**
   * Handle invalid session
   */
  async handleInvalidSession() {
    await this.deviceFingerprint.forceLogout();

    // Show notification
    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: {
        type: 'session_invalid',
        title: '🔒 Session Expired',
        message: 'Your session has expired. Please log in again to continue.',
        cta: 'Log In',
        ctaLink: 'https://testnotifier.co.uk/auth/login'
      }
    });
  }

  /**
   * Handle invalid subscription
   */
  handleInvalidSubscription() {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: {
        type: 'subscription_invalid',
        title: '⚠️ Subscription Issue',
        message: 'There\'s an issue with your subscription. Please check your account.',
        cta: 'Check Account',
        ctaLink: 'https://testnotifier.co.uk/account'
      }
    });
  }

  /**
   * Record successful operation for usage tracking
   */
  async recordOperation(operation, context = {}) {
    if (!this.currentUser) return;

    try {
      await this.usageMonitor.recordOperation(
        this.currentUser.id,
        operation,
        context
      );
    } catch (error) {
      console.error('❌ Failed to record operation:', error);
    }
  }

  /**
   * Get access control status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      trialMode: this.trialManager.isInTrialMode(),
      trialExpired: this.trialManager.isTrialExpired(),
      subscription: this.currentSubscription,
      sessionValid: this.deviceFingerprint.getSessionInfo()
    };
  }
}

// Mock classes for the manager (to be replaced with actual implementations)
class SubscriptionValidator {
  async validateSubscription(userId, authToken) {
    // Mock implementation - replace with actual API call
    return { valid: true };
  }
}

class UsageMonitor {
  constructor() {
    this.usageCache = new Map();
  }

  async checkUsageLimits(userId, tier, operation, context) {
    const limits = this.getTierLimits(tier);
    const currentUsage = await this.getUsageStats(userId);

    switch (operation) {
      case 'add_pupil':
        if (currentUsage.pupils >= limits.pupils) {
          return { allowed: false, reason: 'max_pupils_reached', limit: limits.pupils };
        }
        break;
      case 'daily_bookings':
        if (currentUsage.dailyBookings >= limits.dailyBookings) {
          return { allowed: false, reason: 'daily_booking_limit_reached', limit: limits.dailyBookings };
        }
        break;
      case 'notifications':
        if (currentUsage.notifications >= limits.notifications) {
          return { allowed: false, reason: 'notification_limit_reached', limit: limits.notifications };
        }
        break;
    }

    return { allowed: true };
  }

  async getUsageStats(userId) {
    // Mock implementation - replace with actual API call
    return {
      pupils: 2,
      dailyBookings: 1,
      notifications: 5
    };
  }

  getTierLimits(tier) {
    const limits = {
      'trial': { pupils: 1, dailyBookings: 0, notifications: 0 },
      'free': { pupils: 1, dailyBookings: 0, notifications: 0 },
      'one-off': { pupils: 1, dailyBookings: 1, notifications: 5 },
      'starter': { pupils: 3, dailyBookings: 2, notifications: 10 },
      'premium': { pupils: 10, dailyBookings: 5, notifications: 25 },
      'professional': { pupils: 20, dailyBookings: 10, notifications: 50 }
    };
    return limits[tier] || limits['trial'];
  }

  async recordOperation(userId, operation, context) {
    // Mock implementation - replace with actual recording logic
    console.log(`📊 Recorded operation: ${operation} for user ${userId}`);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessControlManager;
} else {
  window.AccessControlManager = AccessControlManager;
}