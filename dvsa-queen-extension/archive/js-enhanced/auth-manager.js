/**
 * Authentication & Subscription Manager for Chrome Extension
 * Verifies user authentication and active subscription before allowing extension use
 */

class AuthManager {
  constructor() {
    this.apiUrl = 'https://api.testnotifier.co.uk'; // Production API
    this.apiUrlDev = 'http://localhost:3002'; // Development API (main backend)
    this.isAuthenticated = false;
    this.user = null;
    this.subscription = null;
    this.authToken = null;
    this.subscriptionCheckInterval = null;
  }

  /**
   * Initialize auth manager
   */
  async initialize() {
    console.log('🔐 Initializing Auth Manager...');

    try {
      // Load stored auth token
      const stored = await chrome.storage.local.get(['authToken', 'user', 'subscription']);

      if (stored.authToken) {
        this.authToken = stored.authToken;
        this.user = stored.user;
        this.subscription = stored.subscription;

        // Verify token is still valid
        const isValid = await this.verifyToken();

        if (isValid) {
          this.isAuthenticated = true;
          console.log('✅ User authenticated:', this.user?.email);

          // Start subscription verification
          await this.verifySubscription();
          this.startSubscriptionMonitoring();
        } else {
          console.log('❌ Token expired, clearing auth');
          await this.clearAuth();
        }
      } else {
        console.log('ℹ️ No auth token found - user must login');
      }

      return this.isAuthenticated;
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
      return false;
    }
  }

  /**
   * Authenticate user with credentials
   */
  async login(email, password) {
    console.log('🔑 Attempting login...');

    try {
      const response = await fetch(`${this.getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data
      this.authToken = data.token;
      this.user = data.user;

      await chrome.storage.local.set({
        authToken: this.authToken,
        user: this.user
      });

      this.isAuthenticated = true;

      // Verify subscription
      await this.verifySubscription();

      console.log('✅ Login successful');
      return { success: true, user: this.user };

    } catch (error) {
      console.error('❌ Login failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Authenticate with existing auth token (from website)
   */
  async authenticateWithToken(token) {
    console.log('🔑 Authenticating with token...');

    this.authToken = token;

    // Verify token
    const isValid = await this.verifyToken();

    if (isValid) {
      this.isAuthenticated = true;
      await this.verifySubscription();
      this.startSubscriptionMonitoring();
      return { success: true };
    }

    return { success: false, error: 'Invalid token' };
  }

  /**
   * Verify authentication token
   */
  async verifyToken() {
    if (!this.authToken) return false;

    try {
      const response = await fetch(`${this.getApiUrl()}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;

        await chrome.storage.local.set({ user: this.user });

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return false;
    }
  }

  /**
   * Verify active subscription
   */
  async verifySubscription() {
    console.log('💳 Verifying subscription status...');

    try {
      const response = await fetch(`${this.getApiUrl()}/api/subscriptions/current`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.status === 404) {
        // No subscription found - user on free plan
        this.subscription = { planType: 'free', status: 'active' };
        await chrome.storage.local.set({ subscription: this.subscription });
        console.log('ℹ️ User on Free plan');
        return { hasSubscription: false, plan: 'free' };
      }

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      this.subscription = data.subscription;

      await chrome.storage.local.set({ subscription: this.subscription });

      console.log('✅ Subscription verified:', this.subscription.planType);

      return {
        hasSubscription: true,
        plan: this.subscription.planType,
        status: this.subscription.status
      };

    } catch (error) {
      console.error('❌ Subscription verification failed:', error);
      return { hasSubscription: false, error: error.message };
    }
  }

  /**
   * Check if user can use a specific feature
   */
  canUseFeature(featureName) {
    if (!this.isAuthenticated) {
      return {
        allowed: false,
        reason: 'NOT_AUTHENTICATED',
        message: 'Please login to use TestNotifier'
      };
    }

    if (!this.subscription) {
      return {
        allowed: false,
        reason: 'NO_SUBSCRIPTION_DATA',
        message: 'Unable to verify subscription'
      };
    }

    const planLimits = {
      oneoff: {
        monitoring: true,
        instantNotifications: false,
        multipleCenters: false,
        maxCenters: 1,
        rebooksAllowed: 1,
        validityDays: 30
      },
      premium: {
        monitoring: true,
        instantNotifications: true,
        multipleCenters: true,
        maxCenters: 5,
        rebooksAllowed: -1, // Unlimited
        smsNotifications: true
      },
      pro: {
        monitoring: true,
        instantNotifications: true,
        multipleCenters: true,
        maxCenters: -1, // Unlimited
        rebooksAllowed: -1, // Unlimited
        pupils: -1, // Unlimited
        smsNotifications: true,
        multiPupil: true,
        analytics: true
      }
    };

    const userPlan = this.subscription.planType || 'free';
    const limits = planLimits[userPlan];

    if (!limits) {
      return {
        allowed: false,
        reason: 'INVALID_PLAN',
        message: 'Invalid subscription plan'
      };
    }

    // Check if feature is allowed for this plan
    if (!limits[featureName]) {
      return {
        allowed: false,
        reason: 'PLAN_LIMIT',
        message: `This feature requires ${featureName === 'monitoring' ? 'Premium' : 'Professional'} plan`,
        upgradeRequired: featureName === 'monitoring' ? 'premium' : 'pro'
      };
    }

    // Check subscription status
    if (this.subscription.status !== 'active' && this.subscription.status !== 'trialing') {
      return {
        allowed: false,
        reason: 'INACTIVE_SUBSCRIPTION',
        message: 'Your subscription is not active. Please renew to continue.'
      };
    }

    // Check if subscription has expired
    if (this.subscription.currentPeriodEnd) {
      const expiryDate = new Date(this.subscription.currentPeriodEnd);
      if (expiryDate < new Date()) {
        return {
          allowed: false,
          reason: 'SUBSCRIPTION_EXPIRED',
          message: 'Your subscription has expired. Please renew to continue.'
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Get max test centers allowed for current plan
   */
  getMaxTestCenters() {
    const planLimits = {
      free: 0,
      premium: 5,
      pro: -1 // Unlimited
    };

    return planLimits[this.subscription?.planType] || 0;
  }

  /**
   * Check if user can add more test centers
   */
  canAddTestCenter(currentCount) {
    const maxCenters = this.getMaxTestCenters();

    if (maxCenters === -1) {
      return { allowed: true }; // Unlimited
    }

    if (currentCount >= maxCenters) {
      return {
        allowed: false,
        reason: 'CENTER_LIMIT_REACHED',
        message: `Your ${this.subscription?.planType} plan allows ${maxCenters} test centers. Upgrade to add more.`,
        upgradeRequired: this.subscription?.planType === 'premium' ? 'pro' : 'premium'
      };
    }

    return { allowed: true };
  }

  /**
   * Start subscription monitoring (check every hour)
   */
  startSubscriptionMonitoring() {
    // Clear existing interval
    if (this.subscriptionCheckInterval) {
      clearInterval(this.subscriptionCheckInterval);
    }

    // Check subscription every hour
    this.subscriptionCheckInterval = setInterval(async() => {
      console.log('🔄 Periodic subscription check...');
      await this.verifySubscription();
    }, 60 * 60 * 1000); // 1 hour

    console.log('✅ Subscription monitoring started');
  }

  /**
   * Stop subscription monitoring
   */
  stopSubscriptionMonitoring() {
    if (this.subscriptionCheckInterval) {
      clearInterval(this.subscriptionCheckInterval);
      this.subscriptionCheckInterval = null;
      console.log('⏹️ Subscription monitoring stopped');
    }
  }

  /**
   * Logout user
   */
  async logout() {
    console.log('🚪 Logging out...');

    try {
      // Call logout endpoint
      if (this.authToken) {
        await fetch(`${this.getApiUrl()}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });
      }
    } catch (error) {
      console.error('❌ Logout API call failed:', error);
    }

    await this.clearAuth();
    console.log('✅ Logged out');
  }

  /**
   * Clear authentication data
   */
  async clearAuth() {
    this.isAuthenticated = false;
    this.user = null;
    this.subscription = null;
    this.authToken = null;

    this.stopSubscriptionMonitoring();

    await chrome.storage.local.remove(['authToken', 'user', 'subscription']);
  }

  /**
   * Get API URL based on environment
   */
  getApiUrl() {
    // Check if we're in development
    return window.location.hostname === 'localhost' ? this.apiUrlDev : this.apiUrl;
  }

  /**
   * Get authentication headers for API requests
   */
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    };
  }

  /**
   * Make authenticated API request
   */
  async makeAuthenticatedRequest(endpoint, options = {}) {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.getApiUrl()}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    // Handle 401 - token expired
    if (response.status === 401) {
      await this.clearAuth();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  }

  /**
   * Get user info
   */
  getUser() {
    return this.user;
  }

  /**
   * Get subscription info
   */
  getSubscription() {
    return this.subscription;
  }

  /**
   * Check if authenticated
   */
  isAuth() {
    return this.isAuthenticated;
  }

  /**
   * Get subscription display info for UI
   */
  getSubscriptionDisplayInfo() {
    if (!this.subscription) {
      return {
        planName: 'Free',
        features: ['Limited access'],
        status: 'inactive',
        message: 'Upgrade to unlock full features'
      };
    }

    const planInfo = {
      free: {
        planName: 'Free',
        features: ['View only'],
        status: 'limited',
        message: 'Upgrade to Premium for monitoring'
      },
      premium: {
        planName: 'Premium',
        features: ['Monitor 5 centers', 'Instant notifications'],
        status: 'active',
        message: 'Premium features unlocked'
      },
      pro: {
        planName: 'Professional',
        features: ['Unlimited centers', 'Multi-pupil', 'Analytics'],
        status: 'active',
        message: 'All features unlocked'
      }
    };

    return planInfo[this.subscription.planType] || planInfo.free;
  }

  /**
   * Show upgrade prompt
   */
  showUpgradePrompt(requiredPlan) {
    const planPrices = {
      premium: '£4.99/month',
      pro: '£9.99/month'
    };

    return {
      title: 'Upgrade Required',
      message: `This feature requires the ${requiredPlan === 'premium' ? 'Premium' : 'Professional'} plan.`,
      price: planPrices[requiredPlan],
      action: 'Upgrade Now',
      url: `https://testnotifier.co.uk/pricing?plan=${requiredPlan}`
    };
  }
}

// Singleton instance
const authManager = new AuthManager();

// Make available globally
if (typeof window !== 'undefined') {
  window.authManager = authManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
}

