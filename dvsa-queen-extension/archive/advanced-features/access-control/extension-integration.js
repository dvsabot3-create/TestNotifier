/**
 * Extension Integration - Connects access control to Chrome extension
 * Handles message passing, popup communication, and content script coordination
 */

class ExtensionIntegration {
  constructor() {
    this.accessControl = null;
    this.isBackgroundContext = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage;
    this.isPopupContext = typeof window !== 'undefined' && window.location && window.location.pathname.includes('popup');
    this.isContentContext = typeof window !== 'undefined' && !this.isPopupContext;
  }

  /**
   * Initialize extension integration
   */
  async initialize() {
    try {
      console.log('🔌 Initializing Extension Integration...');

      // Create access control manager
      this.accessControl = new AccessControlManager();

      // Initialize access control
      const initialized = await this.accessControl.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize access control');
      }

      // Set up message handlers based on context
      if (this.isBackgroundContext) {
        this.setupBackgroundMessageHandlers();
      } else if (this.isPopupContext) {
        this.setupPopupMessageHandlers();
      } else if (this.isContentContext) {
        this.setupContentMessageHandlers();
      }

      console.log('✅ Extension Integration initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Extension Integration initialization failed:', error);
      return false;
    }
  }

  /**
   * Set up background script message handlers
   */
  setupBackgroundMessageHandlers() {
    // Handle access validation requests
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleBackgroundMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleExtensionInstalled(details);
    });

    // Handle extension startup
    chrome.runtime.onStartup.addListener(() => {
      this.handleExtensionStartup();
    });

    console.log('🔧 Background message handlers set up');
  }

  /**
   * Handle background script messages
   */
  async handleBackgroundMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'validateAccess':
          const validation = await this.accessControl.validateAccess(
            request.operation,
            request.context
          );
          sendResponse({ success: true, validation });
          break;

        case 'getAccessStatus':
          const status = this.accessControl.getStatus();
          sendResponse({ success: true, status });
          break;

        case 'showLimitations':
          await this.accessControl.showUserLimitations();
          sendResponse({ success: true });
          break;

        case 'recordOperation':
          await this.accessControl.recordOperation(
            request.operation,
            request.context
          );
          sendResponse({ success: true });
          break;

        case 'getCurrentUser':
          const userData = await this.accessControl.getCurrentUser();
          sendResponse({ success: true, userData });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('❌ Background message handling error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  /**
   * Set up popup script message handlers
   */
  setupPopupMessageHandlers() {
    // Listen for messages from background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handlePopupMessage(request, sender, sendResponse);
      return true;
    });

    // Initialize popup UI
    this.initializePopupUI();

    console.log('🔧 Popup message handlers set up');
  }

  /**
   * Handle popup script messages
   */
  async handlePopupMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'accessStatusUpdated':
          this.updatePopupUI(request.status);
          break;

        case 'showNotification':
          this.showPopupNotification(request.notification);
          break;

        case 'forceLogout':
          this.handleForceLogout(request.reason);
          break;

        default:
          console.log('📨 Unhandled popup message:', request.action);
      }
    } catch (error) {
      console.error('❌ Popup message handling error:', error);
    }
  }

  /**
   * Set up content script message handlers
   */
  setupContentMessageHandlers() {
    // Listen for messages from background/popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleContentMessage(request, sender, sendResponse);
      return true;
    });

    console.log('🔧 Content script message handlers set up');
  }

  /**
   * Handle content script messages
   */
  async handleContentMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'showTrialUpgrade':
          this.showContentTrialUpgrade(request.notification);
          break;

        case 'showLimitationWarning':
          this.showContentLimitationWarning(request.operation, request.currentUsage, request.limit);
          break;

        case 'validateContentAccess':
          const validation = await this.validateContentAccess(request.operation, request.context);
          sendResponse({ success: true, validation });
          break;

        default:
          console.log('📨 Unhandled content message:', request.action);
      }
    } catch (error) {
      console.error('❌ Content message handling error:', error);
    }
  }

  /**
   * Handle extension installation
   */
  async handleExtensionInstalled(details) {
    console.log('📦 Extension installed:', details);

    if (details.reason === 'install') {
      // First time installation
      await this.handleFirstInstall();
    } else if (details.reason === 'update') {
      // Extension update
      await this.handleExtensionUpdate(details);
    }
  }

  /**
   * Handle first time installation
   */
  async handleFirstInstall() {
    try {
      console.log('🎉 First time installation detected');

      // Set default settings
      await chrome.storage.local.set({
        extension_installed: true,
        install_date: Date.now(),
        first_run: true,
        settings: {
          auto_monitor: false,
          notifications: true,
          stealth_mode: false,
          sound_alerts: true
        }
      });

      // Show welcome notification
      chrome.notifications.create('welcome-notification', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Welcome to TestNotifier!',
        message: 'Get started by creating an account or logging in to access test monitoring features.'
      });

    } catch (error) {
      console.error('❌ First install handling error:', error);
    }
  }

  /**
   * Handle extension update
   */
  async handleExtensionUpdate(details) {
    try {
      console.log('🔄 Extension updated from version:', details.previousVersion);

      // Clear old session data if needed
      const result = await chrome.storage.local.get(['sessionData', 'auth_token']);

      if (result.sessionData || result.auth_token) {
        // User was logged in, show update notification
        chrome.notifications.create('update-notification', {
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'TestNotifier Updated!',
          message: 'The extension has been updated. Your session will be refreshed.'
        });

        // Validate existing session
        if (this.accessControl) {
          const userData = await this.accessControl.getCurrentUser();
          if (userData) {
            const sessionValid = await this.accessControl.deviceFingerprint.isSessionValid(
              userData.user.id,
              userData.authToken
            );

            if (!sessionValid) {
              // Force re-authentication
              await this.accessControl.deviceFingerprint.forceLogout();
            }
          }
        }
      }

    } catch (error) {
      console.error('❌ Extension update handling error:', error);
    }
  }

  /**
   * Handle extension startup
   */
  async handleExtensionStartup() {
    console.log('🚀 Extension startup detected');

    try {
      // Check if user was previously logged in
      const result = await chrome.storage.local.get(['user_data', 'auth_token']);

      if (result.user_data && result.auth_token) {
        console.log('👤 Previous session detected, validating...');

        // Validate existing session
        const sessionValid = await this.accessControl.deviceFingerprint.isSessionValid(
          result.user_data.user.id,
          result.auth_token
        );

        if (sessionValid) {
          console.log('✅ Previous session validated');

          // Show welcome back notification
          chrome.notifications.create('welcome-back-notification', {
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Welcome Back!',
            message: 'Your TestNotifier session has been restored.'
          });
        } else {
          console.log('⚠️ Previous session invalid, requiring re-authentication');
        }
      }

    } catch (error) {
      console.error('❌ Extension startup handling error:', error);
    }
  }

  /**
   * Initialize popup UI
   */
  async initializePopupUI() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.setupPopupUI();
        });
      } else {
        this.setupPopupUI();
      }
    } catch (error) {
      console.error('❌ Popup UI initialization error:', error);
    }
  }

  /**
   * Set up popup UI elements
   */
  setupPopupUI() {
    try {
      // Add access control status indicator
      this.addStatusIndicator();

      // Add limitations button
      this.addLimitationsButton();

      // Update UI with current status
      this.updatePopupUI();

      console.log('🎨 Popup UI set up');
    } catch (error) {
      console.error('❌ Popup UI setup error:', error);
    }
  }

  /**
   * Add status indicator to popup
   */
  addStatusIndicator() {
    const statusContainer = document.createElement('div');
    statusContainer.id = 'access-control-status';
    statusContainer.className = 'access-control-status';
    statusContainer.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(statusContainer);

    // Add click handler
    statusContainer.addEventListener('click', () => {
      this.showLimitations();
    });
  }

  /**
   * Add limitations button to popup
   */
  addLimitationsButton() {
    const limitationsButton = document.createElement('button');
    limitationsButton.id = 'show-limitations-btn';
    limitationsButton.textContent = 'View Limits';
    limitationsButton.className = 'show-limitations-btn';
    limitationsButton.style.cssText = `
      background: linear-gradient(135deg, #1d70b8, #2e8bc0);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      margin: 10px;
      transition: all 0.3s ease;
    `;

    limitationsButton.addEventListener('mouseenter', () => {
      limitationsButton.style.transform = 'scale(1.05)';
    });

    limitationsButton.addEventListener('mouseleave', () => {
      limitationsButton.style.transform = 'scale(1)';
    });

    limitationsButton.addEventListener('click', () => {
      this.showLimitations();
    });

    // Try to find a good place to insert the button
    const popupContainer = document.querySelector('.popup-container') || document.body;
    popupContainer.appendChild(limitationsButton);
  }

  /**
   * Update popup UI with current status
   */
  async updatePopupUI(status = null) {
    try {
      if (!status) {
        // Get current status from background
        const response = await chrome.runtime.sendMessage({ action: 'getAccessStatus' });
        if (response.success) {
          status = response.status;
        }
      }

      if (!status) return;

      const statusContainer = document.getElementById('access-control-status');
      if (!statusContainer) return;

      // Update status indicator based on subscription tier
      const tierColors = {
        'trial': '#f59e0b',
        'one-off': '#10b981',
        'starter': '#3b82f6',
        'premium': '#8b5cf6',
        'professional': '#dc2626'
      };

      const tierNames = {
        'trial': 'Trial',
        'one-off': 'One-Off',
        'starter': 'Starter',
        'premium': 'Premium',
        'professional': 'Professional'
      };

      const color = tierColors[status.subscription?.tier] || '#6b7280';
      const name = tierNames[status.subscription?.tier] || 'Unknown';

      statusContainer.style.background = color;
      statusContainer.style.color = 'white';
      statusContainer.textContent = `${name} Plan`;

      // Add tooltip
      statusContainer.title = `Click to view your subscription limits and usage`;

    } catch (error) {
      console.error('❌ Popup UI update error:', error);
    }
  }

  /**
   * Show limitations
   */
  async showLimitations() {
    try {
      await chrome.runtime.sendMessage({ action: 'showLimitations' });
    } catch (error) {
      console.error('❌ Failed to show limitations:', error);
    }
  }

  /**
   * Show popup notification
   */
  showPopupNotification(notification) {
    try {
      // Create notification element
      const notificationEl = document.createElement('div');
      notificationEl.className = 'popup-notification';
      notificationEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        padding: 16px;
        max-width: 300px;
        z-index: 10000;
        border-left: 4px solid #ef4444;
      `;

      notificationEl.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">${notification.title}</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">${notification.message}</p>
            ${notification.cta ? `
              <button id="notification-cta" style="background: #1d70b8; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                ${notification.cta}
              </button>
            ` : ''}
          </div>
          <button id="notification-close" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #9ca3af;">×</button>
        </div>
      `;

      document.body.appendChild(notificationEl);

      // Add event listeners
      const closeBtn = notificationEl.querySelector('#notification-close');
      closeBtn.addEventListener('click', () => {
        notificationEl.remove();
      });

      if (notification.cta) {
        const ctaBtn = notificationEl.querySelector('#notification-cta');
        ctaBtn.addEventListener('click', () => {
          if (notification.ctaLink) {
            chrome.tabs.create({ url: notification.ctaLink });
          }
          notificationEl.remove();
        });
      }

      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (notificationEl.parentNode) {
          notificationEl.remove();
        }
      }, 10000);

    } catch (error) {
      console.error('❌ Popup notification error:', error);
    }
  }

  /**
   * Handle force logout
   */
  async handleForceLogout(reason) {
    try {
      // Clear UI
      const statusContainer = document.getElementById('access-control-status');
      if (statusContainer) {
        statusContainer.remove();
      }

      const limitationsBtn = document.getElementById('show-limitations-btn');
      if (limitationsBtn) {
        limitationsBtn.remove();
      }

      // Show logout notification
      this.showPopupNotification({
        type: 'force_logout',
        title: '🚫 Session Ended',
        message: reason === 'device_limit_exceeded'
          ? 'You have been logged out due to device limit exceeded.'
          : 'Your session has ended. Please log in again.',
        cta: 'Log In',
        ctaLink: 'https://testnotifier.co.uk/auth/login'
      });

    } catch (error) {
      console.error('❌ Force logout handling error:', error);
    }
  }

  /**
   * Validate access from content script
   */
  async validateContentAccess(operation, context) {
    try {
      // Send to background for validation
      const response = await chrome.runtime.sendMessage({
        action: 'validateAccess',
        operation: operation,
        context: context
      });

      if (response.success) {
        return response.validation;
      } else {
        console.error('❌ Content access validation failed:', response.error);
        return { allowed: false, reason: 'validation_error' };
      }

    } catch (error) {
      console.error('❌ Content access validation error:', error);
      return { allowed: false, reason: 'validation_error' };
    }
  }

  /**
   * Show trial upgrade in content script
   */
  showContentTrialUpgrade(notification) {
    if (typeof TrialManager !== 'undefined') {
      const trialManager = new TrialManager();
      trialManager.showContentScriptOverlay(notification);
    }
  }

  /**
   * Show limitation warning in content script
   */
  showContentLimitationWarning(operation, currentUsage, limit) {
    if (typeof UserLimitationsUI !== 'undefined') {
      const limitationsUI = new UserLimitationsUI();
      limitationsUI.showLimitationWarning(operation, currentUsage, limit);
    }
  }
}

// Auto-initialize if in extension context
if (typeof chrome !== 'undefined' && chrome.runtime) {
  const integration = new ExtensionIntegration();

  // Initialize when the script loads
  integration.initialize().then(success => {
    if (success) {
      console.log('🎯 Extension Integration ready');
    } else {
      console.error('💥 Extension Integration failed to initialize');
    }
  });

  // Export for use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExtensionIntegration;
  } else {
    window.ExtensionIntegration = ExtensionIntegration;
  }
}