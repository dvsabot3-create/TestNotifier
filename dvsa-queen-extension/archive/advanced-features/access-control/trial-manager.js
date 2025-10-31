/**
 * Trial Manager - Demo mode with visible but non-functional features
 * Allows users to see platform value without giving away core functionality
 */

class TrialManager {
  constructor() {
    this.isTrialMode = false;
    this.demoData = this.generateDemoData();
    this.trialStartTime = null;
    this.trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }

  /**
   * Initialize trial mode
   */
  async initialize(subscription) {
    this.isTrialMode = subscription?.tier === 'trial' && subscription?.status === 'trial';

    if (this.isTrialMode) {
      this.trialStartTime = subscription?.trialStartTime || Date.now();
      console.log('🎯 Trial mode activated - visible but non-functional');
      this.startTrialTimer();
    }

    return this.isTrialMode;
  }

  /**
   * Generate demo data for trial users
   */
  generateDemoData() {
    return {
      pupils: [
        {
          id: 'demo-pupil-1',
          name: 'Demo Student 1',
          email: 'demo1@example.com',
          phone: '+447700900123',
          licenceNumber: 'DEMO123456',
          currentTestDate: '2024-12-25',
          currentTestTime: '09:00',
          testCentre: 'London Wood Green',
          status: 'active',
          isDemo: true
        },
        {
          id: 'demo-pupil-2',
          name: 'Demo Student 2',
          email: 'demo2@example.com',
          phone: '+447700900124',
          licenceNumber: 'DEMO789012',
          currentTestDate: '2025-01-15',
          currentTestTime: '14:30',
          testCentre: 'Birmingham Garretts Green',
          status: 'active',
          isDemo: true
        }
      ],
      notifications: [
        {
          id: 'demo-notif-1',
          type: 'slot_found',
          pupilName: 'Demo Student 1',
          message: '🎯 Earlier test slot found! December 20th at 11:30 AM',
          timestamp: Date.now() - (30 * 60 * 1000), // 30 minutes ago
          isDemo: true
        },
        {
          id: 'demo-notif-2',
          type: 'booking_success',
          pupilName: 'Demo Student 2',
          message: '✅ Test changed successfully to January 10th at 2:00 PM',
          timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
          isDemo: true
        }
      ],
      availableSlots: [
        {
          id: 'demo-slot-1',
          date: '2024-12-20',
          time: '11:30',
          centre: 'London Wood Green',
          isDemo: true
        },
        {
          id: 'demo-slot-2',
          date: '2024-12-22',
          time: '09:15',
          centre: 'London Wood Green',
          isDemo: true
        }
      ]
    };
  }

  /**
   * Check if current user is in trial mode
   */
  isInTrialMode() {
    return this.isTrialMode;
  }

  /**
   * Check if trial period has expired
   */
  isTrialExpired() {
    if (!this.trialStartTime) return false;
    return Date.now() - this.trialStartTime > this.trialDuration;
  }

  /**
   * Get remaining trial time in milliseconds
   */
  getRemainingTrialTime() {
    if (!this.trialStartTime) return 0;
    const remaining = this.trialDuration - (Date.now() - this.trialStartTime);
    return Math.max(0, remaining);
  }

  /**
   * Get demo pupils (for trial users)
   */
  getDemoPupils() {
    return this.isTrialMode ? this.demoData.pupils : [];
  }

  /**
   * Get demo notifications (for trial users)
   */
  getDemoNotifications() {
    return this.isTrialMode ? this.demoData.notifications : [];
  }

  /**
   * Get demo available slots (for trial users)
   */
  getDemoAvailableSlots() {
    return this.isTrialMode ? this.demoData.availableSlots : [];
  }

  /**
   * Block real operations in trial mode
   */
  blockRealOperation(operation, context = '') {
    if (this.isTrialMode) {
      console.log(`🚫 Trial mode: Blocked real operation "${operation}"`);
      this.showTrialUpgradePrompt(operation, context);
      return true;
    }
    return false;
  }

  /**
   * Show trial upgrade prompt
   */
  showTrialUpgradePrompt(operation, context) {
    const messages = {
      'add_pupil': 'To add real pupils, upgrade to a paid subscription',
      'monitor_slots': 'Live slot monitoring requires a subscription',
      'auto_book': 'Auto-booking is available with paid plans',
      'notifications': 'Real notifications require a subscription',
      'default': 'This feature requires a paid subscription'
    };

    const message = messages[operation] || messages.default;

    // Show upgrade prompt
    this.showUpgradeNotification(message, context);
  }

  /**
   * Show upgrade notification in extension
   */
  showUpgradeNotification(message, context) {
    // Create upgrade prompt UI
    const notification = {
      type: 'trial_upgrade',
      title: '💎 Upgrade Required',
      message: message,
      context: context,
      cta: 'View Pricing',
      ctaLink: 'https://testnotifier.co.uk/pricing',
      timestamp: Date.now()
    };

    // Send to popup and content script
    chrome.runtime.sendMessage({
      action: 'showTrialUpgrade',
      notification: notification
    });

    // Show in content script overlay
    this.showContentScriptOverlay(notification);
  }

  /**
   * Show content script overlay for trial upgrade
   */
  showContentScriptOverlay(notification) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'trial-upgrade-overlay';
    overlay.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <h3 style="color: #1d70b8; margin-bottom: 15px; font-size: 18px;">${notification.title}</h3>
          <p style="color: #333; margin-bottom: 20px; font-size: 14px;">${notification.message}</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="trial-upgrade-cta" style="background: #1d70b8; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
              ${notification.cta}
            </button>
            <button id="trial-upgrade-close" style="background: #f0f0f0; color: #333; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners
    document.getElementById('trial-upgrade-cta').addEventListener('click', () => {
      window.open(notification.ctaLink, '_blank');
      this.trackTrialUpgradeClick(notification.context);
      overlay.remove();
    });

    document.getElementById('trial-upgrade-close').addEventListener('click', () => {
      overlay.remove();
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.getElementById('trial-upgrade-overlay')) {
        overlay.remove();
      }
    }, 10000);
  }

  /**
   * Track trial upgrade clicks
   */
  trackTrialUpgradeClick(context) {
    chrome.runtime.sendMessage({
      action: 'trackEvent',
      event: 'trial_upgrade_click',
      category: 'conversion',
      label: context
    });
  }

  /**
   * Start trial timer to show expiration warnings
   */
  startTrialTimer() {
    if (!this.isTrialMode) return;

    const checkExpiration = () => {
      if (this.isTrialExpired()) {
        this.showTrialExpiredMessage();
        return;
      }

      const remainingTime = this.getRemainingTrialTime();
      const hoursRemaining = Math.floor(remainingTime / (1000 * 60 * 60));

      // Show warning when less than 24 hours remain
      if (hoursRemaining <= 24 && hoursRemaining > 23) {
        this.showTrialExpiringSoon(hoursRemaining);
      }

      // Check again in 1 hour
      setTimeout(checkExpiration, 60 * 60 * 1000);
    };

    // Start checking
    checkExpiration();
  }

  /**
   * Show trial expiring soon message
   */
  showTrialExpiringSoon(hoursRemaining) {
    const message = `Your free trial expires in ${hoursRemaining} hours. Upgrade now to continue using TestNotifier!`;

    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: {
        type: 'trial_expiring',
        title: '⏰ Trial Expiring Soon',
        message: message,
        cta: 'Upgrade Now',
        ctaLink: 'https://testnotifier.co.uk/pricing'
      }
    });
  }

  /**
   * Show trial expired message
   */
  showTrialExpiredMessage() {
    const message = 'Your free trial has expired. Upgrade to a paid plan to continue using TestNotifier!';

    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: {
        type: 'trial_expired',
        title: '🚨 Trial Expired',
        message: message,
        cta: 'View Plans',
        ctaLink: 'https://testnotifier.co.uk/pricing'
      }
    });
  }

  /**
   * Convert trial to demo mode (after expiration)
   */
  convertToDemoMode() {
    this.isTrialMode = false;
    // Keep demo data but don't show upgrade prompts as frequently
    console.log('🔧 Converted to demo mode - limited functionality');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrialManager;
} else {
  window.TrialManager = TrialManager;
}