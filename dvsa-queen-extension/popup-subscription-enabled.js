/**
 * TestNotifier Extension - Subscription-Enabled Popup
 * Enforces subscription tiers and limits
 */

class SubscriptionEnabledPopup {
  constructor() {
    this.authManager = new AuthManager();
    this.isAuthenticated = false;
    this.subscription = null;
    this.selectedCenters = [];
    this.isMonitoring = false;
    this.stats = { checks: 0, found: 0, successRate: 0 };
    
    // Subscription tier limits
    this.tierLimits = {
      oneoff: {
        testCenters: 1,
        monitoring: true,
        smsNotifications: false,
        rapidMode: false,
        rebooksAllowed: 1,
        validityDays: 30,
        message: 'One-time rebook service active',
      },
      premium: {
        testCenters: 5,
        monitoring: true,
        smsNotifications: true,
        rapidMode: true,
        rebooksAllowed: -1, // Unlimited
        message: 'Premium features unlocked',
      },
      pro: {
        testCenters: -1, // Unlimited
        monitoring: true,
        smsNotifications: true,
        rapidMode: true,
        multiPupil: true,
        pupils: -1, // Unlimited
        rebooksAllowed: -1, // Unlimited
        analytics: true,
        message: 'All features unlocked - Unlimited everything',
      },
    };
  }

  /**
   * Initialize popup
   */
  async init() {
    console.log('🚀 Initializing subscription-enabled popup...');

    // Show loading
    this.showScreen('loading');

    // Initialize auth manager
    const isAuth = await this.authManager.initialize();

    if (!isAuth) {
      // Not authenticated - show login screen
      this.showScreen('auth-required');
      this.setupAuthScreenHandlers();
      return;
    }

    // User is authenticated - get subscription
    this.isAuthenticated = true;
    this.subscription = this.authManager.getSubscription();
    this.user = this.authManager.getUser();

    console.log('✅ User authenticated:', this.user?.email);
    console.log('📋 Subscription:', this.subscription?.planType);

    // Load extension state
    await this.loadState();

    // Show main content
    this.showScreen('main');

    // Update UI based on subscription
    this.updateUIForSubscription();

    // Setup event listeners
    this.setupEventListeners();

    console.log('✅ Popup initialized');
  }

  /**
   * Show specific screen
   */
  showScreen(screen) {
    // Hide all screens
    document.getElementById('loading-screen').classList.remove('active');
    document.getElementById('auth-required').classList.remove('active');
    document.getElementById('main-content').classList.remove('active');

    // Show requested screen
    if (screen === 'loading') {
      document.getElementById('loading-screen').classList.add('active');
    } else if (screen === 'auth-required') {
      document.getElementById('auth-required').classList.add('active');
    } else if (screen === 'main') {
      document.getElementById('main-content').classList.add('active');
    }
  }

  /**
   * Setup auth screen handlers
   */
  setupAuthScreenHandlers() {
    document.getElementById('login-btn').addEventListener('click', () => {
      // Open website login page
      chrome.tabs.create({ url: 'https://testnotifier.co.uk/login?from=extension' });
    });

    document.getElementById('register-btn').addEventListener('click', () => {
      // Open website registration page
      chrome.tabs.create({ url: 'https://testnotifier.co.uk/register?from=extension' });
    });
  }

  /**
   * Update UI based on subscription tier
   */
  updateUIForSubscription() {
    const planType = this.subscription?.planType || 'free';
    const limits = this.tierLimits[planType];

    console.log('🎨 Updating UI for plan:', planType);

    // Update subscription badge
    const badge = document.getElementById('subscription-badge');
    const planName = document.getElementById('plan-name');
    
    badge.className = `subscription-badge ${planType}`;
    planName.textContent = planType === 'pro' ? 'Professional' : planType.charAt(0).toUpperCase() + planType.slice(1);

    // Update center limit display
    const centerLimit = document.getElementById('center-limit');
    const maxCenters = limits.testCenters === -1 ? '∞' : limits.testCenters;
    centerLimit.textContent = `${this.selectedCenters.length} / ${maxCenters}`;

    // Show upgrade prompt for free users
    const upgradePrompt = document.getElementById('upgrade-prompt');
    if (planType === 'free') {
      upgradePrompt.style.display = 'block';
      this.showUpgradePrompt('premium');
    } else {
      upgradePrompt.style.display = 'none';
    }

    // Lock/unlock features based on plan
    this.enforcePlanLimits(planType, limits);
  }

  /**
   * Enforce plan limits by locking/unlocking features
   */
  enforcePlanLimits(planType, limits) {
    const automationCard = document.getElementById('automation-content');
    const centersCard = document.getElementById('centers-content');
    const startBtn = document.getElementById('start-btn');
    const rapidToggle = document.getElementById('rapid-toggle');
    const addCenterBtn = document.getElementById('add-center-btn');

    // Free plan: Lock monitoring features
    if (!limits.monitoring) {
      this.lockFeature(automationCard, '🔒 Premium Required');
      startBtn.disabled = true;
      rapidToggle.classList.add('disabled');
      addCenterBtn.disabled = true;
    } else {
      // Premium/Pro: Unlock monitoring
      this.unlockFeature(automationCard);
      startBtn.disabled = false;
      
      if (limits.rapidMode) {
        rapidToggle.classList.remove('disabled');
      }

      // Check center limit
      const canAddMore = limits.testCenters === -1 || this.selectedCenters.length < limits.testCenters;
      addCenterBtn.disabled = !canAddMore;

      if (!canAddMore) {
        addCenterBtn.textContent = `Limit Reached (${limits.testCenters})`;
      }
    }
  }

  /**
   * Lock a feature with overlay
   */
  lockFeature(element, message) {
    if (!element) return;

    // Add locked class
    element.classList.add('locked-overlay');

    // Create lock badge if doesn't exist
    let lockBadge = element.querySelector('.lock-badge');
    if (!lockBadge) {
      lockBadge = document.createElement('div');
      lockBadge.className = 'lock-badge';
      lockBadge.innerHTML = `🔒 ${message}`;
      element.style.position = 'relative';
      element.appendChild(lockBadge);
    }
  }

  /**
   * Unlock a feature
   */
  unlockFeature(element) {
    if (!element) return;

    element.classList.remove('locked-overlay');
    
    const lockBadge = element.querySelector('.lock-badge');
    if (lockBadge) {
      lockBadge.remove();
    }
  }

  /**
   * Show upgrade prompt
   */
  showUpgradePrompt(targetPlan) {
    const upgradeMessage = document.getElementById('upgrade-message');
    const upgradePrice = document.getElementById('upgrade-price');
    const upgradeFeaturesList = document.getElementById('upgrade-features-list');

    const planDetails = {
      oneoff: {
        price: '£25 once',
        features: [
          'One test rebook service',
          'Monitor 1 test center',
          'Email notification',
          'Valid for 30 days',
          'No recurring charges',
        ],
      },
      premium: {
        price: '£20/mo',
        features: [
          'Monitor up to 5 test centers',
          'UNLIMITED rebooks',
          'Instant SMS + Email notifications',
          'Priority notifications',
          'Advanced filtering',
          '24/7 monitoring',
          '7-day free trial',
        ],
      },
      pro: {
        price: '£50/mo',
        features: [
          'UNLIMITED test centers',
          'UNLIMITED rebooks',
          'UNLIMITED pupils',
          'Multi-pupil management',
          'Advanced analytics',
          'Priority support',
          'API access',
          'Dedicated account manager',
          '14-day free trial',
        ],
      },
    };

    const plan = planDetails[targetPlan];
    
    upgradeMessage.textContent = `Upgrade to ${targetPlan === 'oneoff' ? 'Single Rebook' : targetPlan === 'premium' ? 'Premium' : 'Professional'} to unlock monitoring`;
    upgradePrice.textContent = plan.price;
    
    upgradeFeaturesList.innerHTML = plan.features.map(f => `<li>${f}</li>`).join('');
  }

  /**
   * Check if user can perform action based on subscription
   */
  canPerformAction(action) {
    const planType = this.subscription?.planType || 'free';
    const limits = this.tierLimits[planType];

    switch (action) {
      case 'start_monitoring':
        return limits.monitoring;
      
      case 'add_center':
        if (!limits.monitoring) return false;
        if (limits.testCenters === -1) return true;
        return this.selectedCenters.length < limits.testCenters;
      
      case 'enable_rapid_mode':
        return limits.rapidMode;
      
      case 'sms_notifications':
        return limits.smsNotifications;
      
      default:
        return false;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Start monitoring
    document.getElementById('start-btn').addEventListener('click', () => {
      this.handleStartMonitoring();
    });

    // Stop monitoring
    document.getElementById('stop-btn').addEventListener('click', () => {
      this.handleStopMonitoring();
    });

    // Rapid mode toggle
    document.getElementById('rapid-toggle').addEventListener('click', () => {
      this.handleRapidModeToggle();
    });

    // Add center
    document.getElementById('add-center-btn').addEventListener('click', () => {
      this.handleAddCenter();
    });

    // Upgrade button
    document.getElementById('upgrade-btn').addEventListener('click', () => {
      this.handleUpgrade();
    });

    // Billing
    document.getElementById('billing-btn').addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://testnotifier.co.uk/dashboard/billing' });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.handleLogout();
    });
  }

  /**
   * Handle start monitoring
   */
  async handleStartMonitoring() {
    // Check subscription permission
    if (!this.canPerformAction('start_monitoring')) {
      this.showUpgradeDialog('monitoring');
      return;
    }

    if (this.selectedCenters.length === 0) {
      alert('Please add at least one test center first');
      return;
    }

    console.log('▶️ Starting monitoring...');

    try {
      // Send to background script
      await chrome.runtime.sendMessage({
        action: 'startMonitoring',
        centers: this.selectedCenters,
        userId: this.user.id,
        subscription: this.subscription,
      });

      this.isMonitoring = true;
      this.updateMonitoringUI();

      // Track event
      this.trackEvent('monitoring_started', 'extension', this.subscription.planType);

    } catch (error) {
      console.error('❌ Error starting monitoring:', error);
      alert('Failed to start monitoring. Please try again.');
    }
  }

  /**
   * Handle stop monitoring
   */
  async handleStopMonitoring() {
    console.log('⏹️ Stopping monitoring...');

    try {
      await chrome.runtime.sendMessage({ action: 'stopMonitoring' });
      
      this.isMonitoring = false;
      this.updateMonitoringUI();

      this.trackEvent('monitoring_stopped', 'extension', this.subscription.planType);

    } catch (error) {
      console.error('❌ Error stopping monitoring:', error);
    }
  }

  /**
   * Handle rapid mode toggle
   */
  handleRapidModeToggle() {
    if (!this.canPerformAction('enable_rapid_mode')) {
      this.showUpgradeDialog('rapid_mode');
      return;
    }

    const toggle = document.getElementById('rapid-toggle');
    const isActive = toggle.classList.contains('active');
    
    toggle.classList.toggle('active');

    console.log(`⚡ Rapid mode ${isActive ? 'disabled' : 'enabled'}`);

    // Send to background script
    chrome.runtime.sendMessage({
      action: 'setRapidMode',
      enabled: !isActive,
    });

    this.trackEvent('rapid_mode_toggled', 'extension', !isActive ? 'enabled' : 'disabled');
  }

  /**
   * Handle add center
   */
  handleAddCenter() {
    if (!this.canPerformAction('add_center')) {
      const planType = this.subscription?.planType || 'free';
      
      if (planType === 'free') {
        this.showUpgradeDialog('monitoring');
      } else {
        // Already at limit for their plan
        this.showUpgradeDialog('more_centers');
      }
      return;
    }

    // Show center selection (would integrate with backend)
    alert('Test center selection coming soon!');
  }

  /**
   * Handle upgrade button
   */
  handleUpgrade() {
    const currentPlan = this.subscription?.planType || 'free';
    const targetPlan = currentPlan === 'premium' ? 'pro' : 'premium';

    // Open pricing page with plan pre-selected
    chrome.tabs.create({
      url: `https://testnotifier.co.uk/pricing?plan=${targetPlan}&from=extension`,
    });

    this.trackEvent('upgrade_clicked', 'subscription', `from_${currentPlan}_to_${targetPlan}`);
  }

  /**
   * Show upgrade dialog
   */
  showUpgradeDialog(feature) {
    const messages = {
      monitoring: {
        title: 'Premium Required',
        message: 'Monitoring test cancellations requires Premium or Professional plan.',
        targetPlan: 'premium',
      },
      more_centers: {
        title: 'Professional Required',
        message: 'Monitoring more than 5 centers requires Professional plan.',
        targetPlan: 'pro',
      },
      rapid_mode: {
        title: 'Premium Required',
        message: 'Rapid mode (500ms checks) requires Premium or Professional plan.',
        targetPlan: 'premium',
      },
    };

    const config = messages[feature] || messages.monitoring;

    if (confirm(`${config.title}\n\n${config.message}\n\nUpgrade now?`)) {
      this.handleUpgrade();
    }
  }

  /**
   * Update monitoring UI
   */
  updateMonitoringUI() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusText = document.getElementById('status-text');

    if (this.isMonitoring) {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      statusText.textContent = 'Monitoring Active';
      statusText.style.color = 'var(--success-green)';
    } else {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusText.textContent = 'Ready';
      statusText.style.color = 'var(--gray-900)';
    }
  }

  /**
   * Handle logout
   */
  async handleLogout() {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }

    console.log('🚪 Logging out...');

    // Stop monitoring if active
    if (this.isMonitoring) {
      await this.handleStopMonitoring();
    }

    // Logout via auth manager
    await this.authManager.logout();

    // Show auth screen
    this.showScreen('auth-required');
    this.setupAuthScreenHandlers();

    this.trackEvent('user_logout', 'auth', 'extension');
  }

  /**
   * Load saved state
   */
  async loadState() {
    try {
      const data = await chrome.storage.local.get([
        'selectedCenters',
        'isMonitoring',
        'stats',
      ]);

      this.selectedCenters = data.selectedCenters || [];
      this.isMonitoring = data.isMonitoring || false;
      this.stats = data.stats || this.stats;

      // Update UI
      this.updateCentersList();
      this.updateStats();
      this.updateMonitoringUI();

    } catch (error) {
      console.error('❌ Error loading state:', error);
    }
  }

  /**
   * Save state
   */
  async saveState() {
    try {
      await chrome.storage.local.set({
        selectedCenters: this.selectedCenters,
        isMonitoring: this.isMonitoring,
        stats: this.stats,
      });
    } catch (error) {
      console.error('❌ Error saving state:', error);
    }
  }

  /**
   * Update centers list
   */
  updateCentersList() {
    const centerList = document.getElementById('center-list');
    const planType = this.subscription?.planType || 'free';
    const limits = this.tierLimits[planType];

    if (this.selectedCenters.length === 0) {
      centerList.innerHTML = `
        <p style="text-align: center; color: var(--gray-600); padding: 20px; font-size: 13px;">
          ${planType === 'free' ? 'Upgrade to add test centers' : 'No centers selected'}
        </p>
      `;
      return;
    }

    centerList.innerHTML = this.selectedCenters.map((center, index) => {
      const isLocked = limits.testCenters !== -1 && index >= limits.testCenters;
      
      return `
        <div class="center-item ${isLocked ? 'locked' : ''}">
          <span>${center.name}</span>
          ${isLocked 
            ? '<span class="plan-limit-badge">Upgrade</span>' 
            : '<span style="cursor: pointer; color: var(--danger-red);" data-index="${index}">×</span>'
          }
        </div>
      `;
    }).join('');

    // Add remove handlers
    centerList.querySelectorAll('[data-index]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.removeCenter(index);
      });
    });
  }

  /**
   * Remove center
   */
  async removeCenter(index) {
    this.selectedCenters.splice(index, 1);
    await this.saveState();
    this.updateCentersList();
    this.updateUIForSubscription();
  }

  /**
   * Update stats display
   */
  updateStats() {
    document.getElementById('total-checks').textContent = this.stats.checks.toLocaleString();
    document.getElementById('tests-found').textContent = this.stats.found.toString();
    document.getElementById('success-rate').textContent = `${this.stats.successRate}%`;
  }

  /**
   * Track analytics event
   */
  trackEvent(eventName, category, label, value) {
    chrome.runtime.sendMessage({
      action: 'trackEvent',
      event: {
        name: eventName,
        category: category,
        label: label,
        value: value,
        subscription: this.subscription?.planType,
        userId: this.user?.id,
      },
    });
  }

  /**
   * Listen for auth changes from website
   */
  listenForAuthChanges() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'authChanged') {
        console.log('🔄 Auth changed from website');
        this.init(); // Reinitialize
      }

      if (message.action === 'subscriptionChanged') {
        console.log('🔄 Subscription changed');
        this.authManager.verifySubscription().then(() => {
          this.subscription = this.authManager.getSubscription();
          this.updateUIForSubscription();
        });
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popup = new SubscriptionEnabledPopup();
  popup.init();
  popup.listenForAuthChanges();
});

