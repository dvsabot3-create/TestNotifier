/**
 * User Limitations UI - Clear communication of extension limitations
 * Prevents user confusion by showing exactly what they can/can't do
 */

class UserLimitationsUI {
  constructor() {
    this.container = null;
    this.isVisible = false;
  }

  /**
   * Initialize the limitations UI
   */
  initialize() {
    this.createUIElements();
    this.addEventListeners();
  }

  /**
   * Create UI elements for limitations display
   */
  createUIElements() {
    // Main limitations container
    this.container = document.createElement('div');
    this.container.id = 'user-limitations-ui';
    this.container.className = 'user-limitations-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      border: 1px solid #e5e7eb;
      z-index: 999999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      display: none;
      overflow: hidden;
    `;

    // Header
    const header = document.createElement('div');
    header.className = 'limitations-header';
    header.style.cssText = `
      background: linear-gradient(135deg, #1d70b8, #2e8bc0);
      color: white;
      padding: 16px 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;

    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Extension Status</span>
      </div>
      <button id="close-limitations-ui" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Content area
    const content = document.createElement('div');
    content.className = 'limitations-content';
    content.style.cssText = `
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
    `;

    this.container.appendChild(header);
    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  /**
   * Show limitations UI with current subscription info
   */
  showLimitations(subscription, usageStats = {}) {
    if (!this.container) return;

    const content = this.container.querySelector('.limitations-content');
    if (!content) return;

    const isTrial = subscription?.tier === 'trial';
    const tierName = this.getTierDisplayName(subscription?.tier);
    const limits = this.getTierLimits(subscription?.tier);

    content.innerHTML = this.generateLimitationsHTML(subscription, usageStats, limits);

    this.container.style.display = 'block';
    this.isVisible = true;

    // Auto-hide after 10 seconds unless it's trial mode
    if (!isTrial) {
      setTimeout(() => this.hide(), 10000);
    }

    this.trackDisplay(subscription?.tier);
  }

  /**
   * Generate HTML for limitations display
   */
  generateLimitationsHTML(subscription, usageStats, limits) {
    const isTrial = subscription?.tier === 'trial';
    const tierName = this.getTierDisplayName(subscription?.tier);
    const remainingTime = this.getRemainingTrialTime(subscription);

    return `
      ${this.generateSubscriptionBanner(subscription, remainingTime)}
      ${this.generateFeatureList(subscription, usageStats, limits)}
      ${this.generateUsageStats(usageStats, limits)}
      ${this.generateUpgradeSection(subscription)}
      ${isTrial ? this.generateTrialSpecificInfo(subscription, remainingTime) : ''}
    `;
  }

  /**
   * Generate subscription banner
   */
  generateSubscriptionBanner(subscription, remainingTime) {
    const isTrial = subscription?.tier === 'trial';
    const tierName = this.getTierDisplayName(subscription?.tier);

    return `
      <div style="
        background: ${isTrial ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #1d70b8, #2e8bc0)'};
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        text-align: center;
      ">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${tierName} Plan</div>
        <div style="font-size: 12px; opacity: 0.9;">${isTrial ? `Trial expires in ${remainingTime}` : 'Active subscription'}</div>
      </div>
    `;
  }

  /**
   * Generate feature list with status
   */
  generateFeatureList(subscription, usageStats, limits) {
    const features = this.getFeatureList(subscription?.tier);

    return `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">Your Features</h3>
        <div style="space-y: 3px;">
          ${features.map(feature => `
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 8px 12px;
              background: ${feature.available ? '#f0fdf4' : '#fef2f2'};
              border-radius: 6px;
              border: 1px solid ${feature.available ? '#bbf7d0' : '#fecaca'};
            ">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: ${feature.available ? '#16a34a' : '#dc2626'};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 10px;
                ">
                  ${feature.available ? '✓' : '✗'}
                </div>
                <span style="font-size: 13px; color: #374151;">${feature.name}</span>
              </div>
              <span style="font-size: 11px; color: #6b7280;">${feature.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Generate usage statistics
   */
  generateUsageStats(usageStats, limits) {
    const stats = [
      {
        name: 'Pupils',
        current: usageStats.pupils || 0,
        limit: limits.pupils,
        unit: ''
      },
      {
        name: 'Bookings Today',
        current: usageStats.dailyBookings || 0,
        limit: limits.dailyBookings,
        unit: ''
      },
      {
        name: 'Notifications',
        current: usageStats.notifications || 0,
        limit: limits.notifications,
        unit: '/day'
      }
    ];

    return `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">Usage This Period</h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
          ${stats.map(stat => `
            <div style="
              background: #f9fafb;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
            ">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; color: #6b7280;">${stat.name}</span>
                <span style="font-size: 12px; color: #374151; font-weight: 500;">${stat.current}${stat.unit} / ${stat.limit}${stat.unit}</span>
              </div>
              <div style="
                width: 100%;
                height: 6px;
                background: #e5e7eb;
                border-radius: 3px;
                overflow: hidden;
              ">
                <div style="
                  width: ${Math.min(100, (stat.current / stat.limit) * 100)}%;
                  height: 100%;
                  background: ${stat.current / stat.limit > 0.8 ? '#dc2626' : '#16a34a'};
                  transition: width 0.3s ease;
                "></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Generate upgrade section
   */
  generateUpgradeSection(subscription) {
    const isTrial = subscription?.tier === 'trial';
    const nextTier = this.getNextTier(subscription?.tier);

    return `
      <div style="
        background: linear-gradient(135deg, #1d70b8, #2e8bc0);
        color: white;
        padding: 16px;
        border-radius: 8px;
        text-align: center;
      ">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">${isTrial ? 'Ready for more features?' : 'Need more capacity?'}</div>
        <button
          id="upgrade-button"
          style="
            background: white;
            color: #1d70b8;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
          "
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        >
          ${isTrial ? 'Start Free Trial' : `Upgrade to ${nextTier}`}
        </button>
      </div>
    `;
  }

  /**
   * Generate trial-specific information
   */
  generateTrialSpecificInfo(subscription, remainingTime) {
    return `
      <div style="
        background: #fef3c7;
        border: 1px solid #f59e0b;
        padding: 12px;
        border-radius: 6px;
        margin-top: 16px;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">⚠</div>
          <span style="font-size: 13px; font-weight: 600; color: #92400e;">Trial Mode Active</span>
        </div>
        <p style="font-size: 12px; color: #78350f; margin: 0;">
          You're in trial mode. This shows demo data only. Real functionality requires a subscription.
        </p>
        <p style="font-size: 11px; color: #92400e; margin: 4px 0 0 0;">⏰ ${remainingTime} remaining</p>
      </div>
    `;
  }

  /**
   * Helper methods
   */
  getTierDisplayName(tier) {
    const names = {
      'trial': 'Trial',
      'free': 'Free',
      'one-off': 'One-Off',
      'starter': 'Starter',
      'premium': 'Premium',
      'professional': 'Professional'
    };
    return names[tier] || 'Unknown';
  }

  getRemainingTrialTime(subscription) {
    if (!subscription?.trialEndTime) return 'Trial ended';
    const remaining = subscription.trialEndTime - Date.now();
    if (remaining <= 0) return 'Trial ended';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Less than 1 hour remaining';
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

  getFeatureList(tier) {
    const features = {
      'trial': [
        { name: 'View Demo Data', available: true, status: 'Active' },
        { name: 'Explore Interface', available: true, status: 'Active' },
        { name: 'Add Real Pupils', available: false, status: 'Upgrade Required' },
        { name: 'Live Monitoring', available: false, status: 'Upgrade Required' },
        { name: 'Real Notifications', available: false, status: 'Upgrade Required' },
        { name: 'Auto-Booking', available: false, status: 'Upgrade Required' }
      ],
      'one-off': [
        { name: 'Add 1 Pupil', available: true, status: 'Active' },
        { name: 'Manual Notifications', available: true, status: 'Active' },
        { name: 'Manual Booking', available: true, status: 'Active' },
        { name: 'Email Support', available: true, status: 'Active' },
        { name: 'Auto-Notifications', available: false, status: 'Upgrade Required' },
        { name: 'Bulk Operations', available: false, status: 'Upgrade Required' }
      ],
      'starter': [
        { name: 'Add 3 Pupils', available: true, status: 'Active' },
        { name: 'Email Notifications', available: true, status: 'Active' },
        { name: 'Basic Monitoring', available: true, status: 'Active' },
        { name: 'Standard Support', available: true, status: 'Active' },
        { name: 'SMS Notifications', available: false, status: 'Upgrade Required' },
        { name: 'Bulk Operations', available: false, status: 'Upgrade Required' }
      ],
      'premium': [
        { name: 'Add 10 Pupils', available: true, status: 'Active' },
        { name: 'Email + SMS', available: true, status: 'Active' },
        { name: 'Auto-Booking', available: true, status: 'Active' },
        { name: 'Advanced Filtering', available: true, status: 'Active' },
        { name: 'WhatsApp', available: false, status: 'Upgrade Required' },
        { name: 'Bulk Operations', available: false, status: 'Upgrade Required' }
      ],
      'professional': [
        { name: 'Add 20 Pupils', available: true, status: 'Active' },
        { name: 'All Channels', available: true, status: 'Active' },
        { name: 'Full Auto-Booking', available: true, status: 'Active' },
        { name: 'Bulk Operations', available: true, status: 'Active' },
        { name: 'Stealth Mode', available: true, status: 'Active' },
        { name: 'Priority Support', available: true, status: 'Active' }
      ]
    };
    return features[tier] || features['trial'];
  }

  getNextTier(tier) {
    const nextTiers = {
      'trial': 'Starter',
      'one-off': 'Starter',
      'starter': 'Premium',
      'premium': 'Professional',
      'professional': 'Professional'
    };
    return nextTiers[tier] || 'Starter';
  }

  /**
   * Add event listeners
   */
  addEventListeners() {
    // Close button
    const closeButton = document.getElementById('close-limitations-ui');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }

    // Upgrade button
    const upgradeButton = document.getElementById('upgrade-button');
    if (upgradeButton) {
      upgradeButton.addEventListener('click', () => {
        window.open('https://testnotifier.co.uk/pricing', '_blank');
        this.trackUpgradeClick();
      });
    }
  }

  /**
   * Hide limitations UI
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
  }

  /**
   * Track display
   */
  trackDisplay(tier) {
    chrome.runtime.sendMessage({
      action: 'trackEvent',
      event: 'limitations_ui_shown',
      category: 'ui',
      label: tier
    });
  }

  /**
   * Track upgrade clicks
   */
  trackUpgradeClick() {
    chrome.runtime.sendMessage({
      action: 'trackEvent',
      event: 'limitations_upgrade_click',
      category: 'conversion',
      label: 'ui_panel'
    });
  }

  /**
   * Show specific limitation warning
   */
  showLimitationWarning(operation, currentUsage, limit) {
    const message = this.getLimitationMessage(operation, currentUsage, limit);

    this.showNotification({
      type: 'limitation_warning',
      title: '⚠️ Limit Reached',
      message: message,
      cta: 'View Plans',
      ctaLink: 'https://testnotifier.co.uk/pricing',
      duration: 5000
    });
  }

  /**
   * Get limitation message for specific operation
   */
  getLimitationMessage(operation, currentUsage, limit) {
    const messages = {
      'max_pupils': `You've reached your limit of ${limit} pupils. Upgrade to add more.`,
      'daily_bookings': `Daily booking limit (${limit}) reached. Try again tomorrow or upgrade.`,
      'notifications': `Notification limit (${limit}/day) reached. Upgrade for unlimited notifications.`,
      'auto_booking_disabled': 'Auto-booking requires a Premium or Professional subscription.',
      'bulk_operations': 'Bulk operations require a Professional subscription.',
      'sms_notifications': 'SMS notifications require Premium or Professional subscription.',
      'whatsapp_notifications': 'WhatsApp notifications require Professional subscription.',
      'stealth_mode': 'Stealth mode requires Professional subscription.',
      'default': 'This feature requires a subscription upgrade.'
    };

    return messages[operation] || messages.default;
  }

  /**
   * Show notification
   */
  showNotification(notification) {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: notification
    });
  }

  /**
   * Show quick limitation summary
   */
  showQuickSummary(subscription, usageStats) {
    const isTrial = subscription?.tier === 'trial';
    const tierName = this.getTierDisplayName(subscription?.tier);
    const stats = this.getTierLimits(subscription?.tier);

    const summary = `
      📊 ${tierName} Plan Active
      ${isTrial ? '⏰ Trial mode - demo data only' : ''}
      👥 ${usageStats.pupils || 0}/${stats.pupils} pupils
      📅 ${usageStats.dailyBookings || 0}/${stats.dailyBookings} bookings today
      🔔 ${usageStats.notifications || 0}/${stats.notifications} notifications
    `;

    this.showNotification({
      type: 'usage_summary',
      title: 'Extension Status',
      message: summary.replace(/\n/g, ' • '),
      duration: 4000
    });
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserLimitationsUI;
} else {
  window.UserLimitationsUI = UserLimitationsUI;
}