/**
 * Usage Examples - How to integrate access control into extension components
 * Shows practical implementation of access control in real extension scenarios
 */

// Example 1: Background Script Integration
class BackgroundAccessControl {
  constructor() {
    this.accessControl = null;
  }

  async initialize() {
    // Import the access control manager
    if (typeof AccessControlManager !== 'undefined') {
      this.accessControl = new AccessControlManager();
      await this.accessControl.initialize();
    }
  }

  /**
   * Example: Handle pupil addition request
   */
  async handleAddPupil(pupilData) {
    try {
      // Validate access before processing
      const validation = await this.accessControl.validateAccess('add_pupil', {
        pupilData: pupilData,
        timestamp: Date.now()
      });

      if (!validation.allowed) {
        console.log(`🚫 Access denied for add_pupil: ${validation.reason}`);

        // Show appropriate message to user
        this.handleAccessDenied('add_pupil', validation);
        return { success: false, error: validation.reason };
      }

      // Access granted - proceed with operation
      console.log('✅ Access granted for add_pupil');

      // Perform the actual operation
      const result = await this.performAddPupil(pupilData);

      // Record successful operation
      await this.accessControl.recordOperation('add_pupil', {
        pupilId: result.pupilId,
        timestamp: Date.now()
      });

      return { success: true, data: result };

    } catch (error) {
      console.error('❌ Error in handleAddPupil:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Example: Handle slot monitoring request
   */
  async handleMonitorSlots(pupilId) {
    try {
      // Validate access for slot monitoring
      const validation = await this.accessControl.validateAccess('monitor_slots', {
        pupilId: pupilId,
        timestamp: Date.now()
      });

      if (!validation.allowed) {
        console.log(`🚫 Access denied for monitor_slots: ${validation.reason}`);
        this.handleAccessDenied('monitor_slots', validation);
        return { success: false, error: validation.reason };
      }

      // Access granted - proceed with monitoring
      console.log('✅ Access granted for monitor_slots');

      // Start monitoring logic
      const monitorResult = await this.startSlotMonitoring(pupilId);

      // Record operation
      await this.accessControl.recordOperation('monitor_slots', {
        pupilId: pupilId,
        timestamp: Date.now()
      });

      return { success: true, data: monitorResult };

    } catch (error) {
      console.error('❌ Error in handleMonitorSlots:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle access denied scenarios
   */
  handleAccessDenied(operation, validation) {
    switch (validation.reason) {
      case 'trial_mode_restricted':
        // Trial mode - show upgrade prompt
        chrome.runtime.sendMessage({
          action: 'showTrialUpgrade',
          notification: {
            type: 'trial_upgrade',
            title: '💎 Upgrade Required',
            message: `To use ${operation.replace('_', ' ')}, upgrade to a paid subscription`,
            cta: 'View Plans',
            ctaLink: 'https://testnotifier.co.uk/pricing'
          }
        });
        break;

      case 'max_pupils_reached':
      case 'daily_booking_limit_reached':
      case 'notification_limit_reached':
        // Usage limit reached
        chrome.runtime.sendMessage({
          action: 'showLimitationWarning',
          operation: operation,
          currentUsage: validation.currentUsage,
          limit: validation.limit
        });
        break;

      case 'tier_restricted':
        // Feature requires higher tier
        chrome.runtime.sendMessage({
          action: 'showNotification',
          notification: {
            type: 'tier_restricted',
            title: '🔒 Feature Not Available',
            message: `This feature requires a ${validation.requiredTier} subscription`,
            cta: 'Upgrade Now',
            ctaLink: 'https://testnotifier.co.uk/pricing'
          }
        });
        break;

      case 'invalid_session':
        // Session invalid - force logout
        this.accessControl.deviceFingerprint.forceLogout();
        break;

      default:
        // Generic access denied
        chrome.runtime.sendMessage({
          action: 'showNotification',
          notification: {
            type: 'access_denied',
            title: '🚫 Access Denied',
            message: 'You don\'t have permission to perform this action',
            cta: 'View Account',
            ctaLink: 'https://testnotifier.co.uk/account'
          }
        });
    }
  }

  // Mock implementations
  async performAddPupil(pupilData) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          pupilId: 'pupil_' + Date.now(),
          success: true
        });
      }, 1000);
    });
  }

  async startSlotMonitoring(pupilId) {
    // Simulate monitoring start
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          monitorId: 'monitor_' + Date.now(),
          status: 'active'
        });
      }, 500);
    });
  }
}

// Example 2: Content Script Integration
class ContentAccessControl {
  constructor() {
    this.accessControl = null;
    this.isAccessControlReady = false;
  }

  async initialize() {
    // Wait for access control to be ready
    await this.waitForAccessControl();
    this.isAccessControlReady = true;
  }

  async waitForAccessControl() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max

    while (attempts < maxAttempts) {
      if (typeof AccessControlManager !== 'undefined') {
        this.accessControl = new AccessControlManager();
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    throw new Error('Access Control Manager not available');
  }

  /**
   * Example: Handle booking attempt from content script
   */
  async handleBookingAttempt(slotData) {
    if (!this.isAccessControlReady) {
      console.error('❌ Access control not ready');
      return { success: false, error: 'system_not_ready' };
    }

    try {
      // Validate access for booking
      const validation = await chrome.runtime.sendMessage({
        action: 'validateAccess',
        operation: 'auto_book',
        context: {
          slotData: slotData,
          timestamp: Date.now()
        }
      });

      if (!validation.success) {
        console.error('❌ Access validation failed:', validation.error);
        return { success: false, error: 'validation_failed' };
      }

      if (!validation.validation.allowed) {
        console.log(`🚫 Booking access denied: ${validation.validation.reason}`);
        this.handleBookingAccessDenied(validation.validation);
        return { success: false, error: validation.validation.reason };
      }

      // Access granted - proceed with booking
      console.log('✅ Booking access granted');

      // Perform the actual booking
      const bookingResult = await this.performBooking(slotData);

      if (bookingResult.success) {
        // Record successful operation
        await chrome.runtime.sendMessage({
          action: 'recordOperation',
          operation: 'auto_book',
          context: {
            slotId: slotData.id,
            pupilId: slotData.pupilId,
            timestamp: Date.now()
          }
        });
      }

      return bookingResult;

    } catch (error) {
      console.error('❌ Error in handleBookingAttempt:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle booking access denied
   */
  handleBookingAccessDenied(validation) {
    // Show appropriate message in content script context
    switch (validation.reason) {
      case 'trial_mode_restricted':
        this.showContentMessage({
          type: 'warning',
          title: 'Trial Mode',
          message: 'Auto-booking requires a paid subscription. Upgrade to enable this feature.',
          cta: 'Upgrade Now'
        });
        break;

      case 'tier_restricted':
        this.showContentMessage({
          type: 'warning',
          title: 'Feature Not Available',
          message: `Auto-booking requires a ${validation.requiredTier} subscription`,
          cta: 'View Plans'
        });
        break;

      case 'daily_booking_limit_reached':
        this.showContentMessage({
          type: 'warning',
          title: 'Daily Limit Reached',
          message: `You've reached your daily booking limit of ${validation.limit}. Try again tomorrow.`,
          cta: 'View Limits'
        });
        break;

      default:
        this.showContentMessage({
          type: 'error',
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this booking',
          cta: 'View Account'
        });
    }
  }

  /**
   * Show message in content script context
   */
  showContentMessage(message) {
    // Create overlay message
    const overlay = document.createElement('div');
    overlay.className = 'content-access-message';
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 300px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border-left: 4px solid ${message.type === 'error' ? '#ef4444' : '#f59e0b'};
      padding: 16px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;

    overlay.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">${message.title}</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">${message.message}</p>
          ${message.cta ? `
            <button id="content-message-cta" style="background: #1d70b8; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
              ${message.cta}
            </button>
          ` : ''}
        </div>
        <button id="content-message-close" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #9ca3af;">×</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners
    overlay.querySelector('#content-message-close').addEventListener('click', () => {
      overlay.remove();
    });

    if (message.cta) {
      overlay.querySelector('#content-message-cta').addEventListener('click', () => {
        if (message.ctaLink) {
          window.open(message.ctaLink, '_blank');
        }
        overlay.remove();
      });
    }

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 8000);
  }

  // Mock booking implementation
  async performBooking(slotData) {
    // Simulate booking API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          bookingId: 'booking_' + Date.now(),
          slot: slotData
        });
      }, 2000);
    });
  }
}

// Example 3: Popup Script Integration
class PopupAccessControl {
  constructor() {
    this.accessControl = null;
  }

  async initialize() {
    // Set up UI event handlers
    this.setupUIHandlers();

    // Get initial access status
    await this.updateAccessStatus();
  }

  setupUIHandlers() {
    // Add pupil button
    const addPupilBtn = document.getElementById('add-pupil-btn');
    if (addPupilBtn) {
      addPupilBtn.addEventListener('click', async () => {
        await this.handleAddPupilClick();
      });
    }

    // Monitor slots button
    const monitorBtn = document.getElementById('monitor-slots-btn');
    if (monitorBtn) {
      monitorBtn.addEventListener('click', async () => {
        await this.handleMonitorSlotsClick();
      });
    }

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', async () => {
        await this.handleSettingsClick();
      });
    }
  }

  async handleAddPupilClick() {
    try {
      // Validate access
      const validation = await chrome.runtime.sendMessage({
        action: 'validateAccess',
        operation: 'add_pupil',
        context: { timestamp: Date.now() }
      });

      if (!validation.success) {
        this.showError('Failed to validate access');
        return;
      }

      if (!validation.validation.allowed) {
        this.showAccessDeniedMessage(validation.validation);
        return;
      }

      // Access granted - show add pupil form
      this.showAddPupilForm();

    } catch (error) {
      console.error('❌ Add pupil click error:', error);
      this.showError('Failed to check access permissions');
    }
  }

  async handleMonitorSlotsClick() {
    try {
      // Validate access
      const validation = await chrome.runtime.sendMessage({
        action: 'validateAccess',
        operation: 'monitor_slots',
        context: { timestamp: Date.now() }
      });

      if (!validation.success) {
        this.showError('Failed to validate access');
        return;
      }

      if (!validation.validation.allowed) {
        this.showAccessDeniedMessage(validation.validation);
        return;
      }

      // Access granted - proceed with monitoring
      this.startSlotMonitoring();

    } catch (error) {
      console.error('❌ Monitor slots click error:', error);
      this.showError('Failed to check access permissions');
    }
  }

  showAccessDeniedMessage(validation) {
    const messageMap = {
      'trial_mode_restricted': 'This feature requires a paid subscription',
      'max_pupils_reached': 'You\'ve reached your pupil limit. Upgrade to add more.',
      'tier_restricted': `This feature requires a ${validation.requiredTier} subscription`,
      'invalid_session': 'Please log in again to continue',
      'system_not_initialized': 'System is starting up. Please try again in a moment.'
    };

    const message = messageMap[validation.reason] || 'Access denied. Please check your subscription.';
    this.showWarning(message);
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showWarning(message) {
    this.showMessage(message, 'warning');
  }

  showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `popup-message popup-message-${type}`;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'error' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#f0fdf4'};
      border: 1px solid ${type === 'error' ? '#fecaca' : type === 'warning' ? '#fed7aa' : '#bbf7d0'};
      color: ${type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#16a34a'};
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      max-width: 300px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    messageEl.textContent = message;
    document.body.appendChild(messageEl);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }

  async updateAccessStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAccessStatus' });
      if (response.success) {
        this.updateUIBasedOnAccess(response.status);
      }
    } catch (error) {
      console.error('❌ Failed to update access status:', error);
    }
  }

  updateUIBasedOnAccess(status) {
    // Update button states based on access
    const addPupilBtn = document.getElementById('add-pupil-btn');
    const monitorBtn = document.getElementById('monitor-slots-btn');

    if (status.trialMode) {
      // Trial mode - show trial indicators
      this.showTrialIndicators();
    }

    if (status.subscription?.tier === 'trial') {
      // Disable certain buttons for trial users
      if (monitorBtn) {
        monitorBtn.disabled = true;
        monitorBtn.title = 'Monitoring requires a paid subscription';
      }
    }
  }

  showTrialIndicators() {
    // Add trial badge to popup
    const trialBadge = document.createElement('div');
    trialBadge.className = 'trial-badge';
    trialBadge.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #f59e0b;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    `;
    trialBadge.textContent = 'TRIAL MODE';

    document.body.appendChild(trialBadge);
  }

  // Mock implementations
  showAddPupilForm() {
    console.log('📋 Showing add pupil form');
  }

  startSlotMonitoring() {
    console.log('🔍 Starting slot monitoring');
  }
}

// Usage Instructions:

/**
 * INTEGRATION STEPS:
 *
 * 1. Import access control scripts in your HTML/manifest:
 *    <script src="access-control/access-control-manager.js"></script>
 *    <script src="access-control/extension-integration.js"></script>
 *
 * 2. For Background Script:
 *    const bgAccess = new BackgroundAccessControl();
 *    await bgAccess.initialize();
 *
 * 3. For Content Script:
 *    const contentAccess = new ContentAccessControl();
 *    await contentAccess.initialize();
 *
 * 4. For Popup Script:
 *    const popupAccess = new PopupAccessControl();
 *    await popupAccess.initialize();
 *
 * 5. Always validate access before performing operations:
 *    const validation = await accessControl.validateAccess('operation_name', context);
 *    if (validation.allowed) {
 *      // Perform operation
 *    }
 *
 * 6. Record successful operations:
 *    await accessControl.recordOperation('operation_name', context);
 *
 * 7. Show limitations UI when needed:
 *    await accessControl.showUserLimitations();
 */

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BackgroundAccessControl,
    ContentAccessControl,
    PopupAccessControl
  };
} else {
  window.BackgroundAccessControl = BackgroundAccessControl;
  window.ContentAccessControl = ContentAccessControl;
  window.PopupAccessControl = PopupAccessControl;
}