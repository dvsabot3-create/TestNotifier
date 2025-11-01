/**
 * TestNotifier Extension - Subscription-Enabled Background Script
 * Enforces subscription tiers and manages monitoring
 */

// Initialize auth manager
const authManager = new AuthManager();
let monitoringState = {
  isActive: false,
  centers: [],
  rapidMode: false,
  userId: null,
  subscription: null,
  lastCheck: null,
  checkInterval: null,
  stats: { checks: 0, found: 0, successRate: 0 },
};

/**
 * Extension installed/updated
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('🚀 TestNotifier extension installed/updated');

  // Initialize auth manager
  await authManager.initialize();

  // Set default state
  await chrome.storage.local.set({
    monitoringState: monitoringState,
    firstRun: details.reason === 'install',
  });

  // Open welcome page on first install
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'https://testnotifier.co.uk/welcome?from=extension',
    });
  }
});

/**
 * Handle messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Background received:', message.action);

  // Handle async messages
  (async () => {
    try {
      let response;

      switch (message.action) {
        case 'startMonitoring':
          response = await handleStartMonitoring(message);
          break;

        case 'stopMonitoring':
          response = await handleStopMonitoring();
          break;

        case 'setRapidMode':
          response = handleSetRapidMode(message.enabled);
          break;

        case 'getMonitoringState':
          response = { success: true, state: monitoringState };
          break;

        case 'trackEvent':
          response = await handleTrackEvent(message.event);
          break;

        case 'verifySubscription':
          response = await handleVerifySubscription();
          break;

        default:
          response = { success: false, error: 'Unknown action' };
      }

      sendResponse(response);
    } catch (error) {
      console.error('❌ Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  return true; // Keep channel open for async response
});

/**
 * Handle start monitoring
 */
async function handleStartMonitoring(message) {
  console.log('▶️ Starting monitoring with subscription verification...');

  // Verify authentication
  if (!authManager.isAuth()) {
    return {
      success: false,
      error: 'NOT_AUTHENTICATED',
      message: 'Please login to start monitoring',
    };
  }

  // Verify subscription allows monitoring
  const canMonitor = authManager.canUseFeature('monitoring');
  
  if (!canMonitor.allowed) {
    return {
      success: false,
      error: canMonitor.reason,
      message: canMonitor.message,
      upgradeRequired: canMonitor.upgradeRequired,
    };
  }

  // Check center limit
  const maxCenters = authManager.getMaxTestCenters();
  if (maxCenters !== -1 && message.centers.length > maxCenters) {
    return {
      success: false,
      error: 'CENTER_LIMIT_EXCEEDED',
      message: `Your plan allows ${maxCenters} test centers. You selected ${message.centers.length}.`,
    };
  }

  // Start monitoring
  monitoringState.isActive = true;
  monitoringState.centers = message.centers;
  monitoringState.userId = message.userId;
  monitoringState.subscription = message.subscription;
  monitoringState.lastCheck = Date.now();

  // Save state
  await chrome.storage.local.set({ monitoringState });

  // Start monitoring loop
  startMonitoringLoop();

  console.log('✅ Monitoring started');

  return {
    success: true,
    message: 'Monitoring started successfully',
  };
}

/**
 * Handle stop monitoring
 */
async function handleStopMonitoring() {
  console.log('⏹️ Stopping monitoring...');

  monitoringState.isActive = false;

  // Stop monitoring loop
  if (monitoringState.checkInterval) {
    clearInterval(monitoringState.checkInterval);
    monitoringState.checkInterval = null;
  }

  // Save state
  await chrome.storage.local.set({ monitoringState });

  console.log('✅ Monitoring stopped');

  return { success: true };
}

/**
 * Handle rapid mode setting
 */
function handleSetRapidMode(enabled) {
  console.log(`⚡ Rapid mode: ${enabled ? 'enabled' : 'disabled'}`);

  // Verify subscription allows rapid mode
  const canUseRapid = authManager.canUseFeature('monitoring');
  
  if (!canUseRapid.allowed) {
    return {
      success: false,
      error: 'PREMIUM_REQUIRED',
      message: 'Rapid mode requires Premium or Professional plan',
    };
  }

  monitoringState.rapidMode = enabled;

  // Restart monitoring if active
  if (monitoringState.isActive) {
    stopMonitoringLoop();
    startMonitoringLoop();
  }

  return { success: true };
}

/**
 * Start monitoring loop
 */
function startMonitoringLoop() {
  if (monitoringState.checkInterval) {
    clearInterval(monitoringState.checkInterval);
  }

  // Set interval based on rapid mode and subscription
  const interval = monitoringState.rapidMode ? 500 : 15000; // 500ms or 15s

  console.log(`⏱️ Starting monitoring loop with ${interval}ms interval`);

  monitoringState.checkInterval = setInterval(async () => {
    await performMonitoringCheck();
  }, interval);

  // Perform immediate check
  performMonitoringCheck();
}

/**
 * Stop monitoring loop
 */
function stopMonitoringLoop() {
  if (monitoringState.checkInterval) {
    clearInterval(monitoringState.checkInterval);
    monitoringState.checkInterval = null;
  }
}

/**
 * Perform actual monitoring check
 */
async function performMonitoringCheck() {
  console.log('🔍 Performing monitoring check...');

  // Verify subscription is still active
  const subscription = authManager.getSubscription();
  
  if (!subscription || (subscription.status !== 'active' && subscription.status !== 'trialing')) {
    console.log('❌ Subscription not active, stopping monitoring');
    await handleStopMonitoring();
    
    // Notify user
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'TestNotifier - Monitoring Stopped',
      message: 'Your subscription is not active. Monitoring has been stopped.',
    });
    
    return;
  }

  monitoringState.stats.checks++;
  monitoringState.lastCheck = Date.now();

  try {
    // Check for available tests
    const result = await checkForAvailableTests(monitoringState.centers);

    if (result.slotsFound > 0) {
      console.log(`🎯 Found ${result.slotsFound} available slots!`);
      monitoringState.stats.found++;
      
      // Send notifications
      await sendNotifications(result.slots, subscription.planType);
    }

    // Update success rate
    monitoringState.stats.successRate = Math.round(
      (monitoringState.stats.found / monitoringState.stats.checks) * 100
    );

    // Save stats
    await chrome.storage.local.set({ monitoringState });

  } catch (error) {
    console.error('❌ Monitoring check failed:', error);
  }
}

/**
 * Check for available tests at specified centers
 */
async function checkForAvailableTests(centers) {
  console.log(`🔍 Checking ${centers.length} test centers...`);

  // This would integrate with your DVSA automation engine
  // For now, returning mock data
  return {
    slotsFound: 0,
    slots: [],
  };
}

/**
 * Send notifications based on subscription tier
 */
async function sendNotifications(slots, planType) {
  console.log('📢 Sending notifications...');

  const notificationConfig = {
    free: {
      types: [], // No notifications
    },
    premium: {
      types: ['browser', 'email', 'sms'],
    },
    pro: {
      types: ['browser', 'email', 'sms', 'push'],
    },
  };

  const config = notificationConfig[planType] || notificationConfig.free;

  // Browser notification (always for paid plans)
  if (config.types.includes('browser')) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'TestNotifier - Test Slot Found!',
      message: `Earlier slot available: ${slots[0].date} at ${slots[0].centre}`,
      requireInteraction: true,
      buttons: [
        { title: 'View Details' },
        { title: 'Dismiss' },
      ],
    });
  }

  // Send to backend for email/SMS
  if (config.types.includes('email') || config.types.includes('sms')) {
    try {
      await authManager.makeAuthenticatedRequest('/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify({
          type: 'slot_found',
          slots: slots,
          notificationTypes: config.types,
        }),
      });
    } catch (error) {
      console.error('❌ Failed to send backend notifications:', error);
    }
  }
}

/**
 * Handle track event
 */
async function handleTrackEvent(event) {
  console.log('📊 Tracking event:', event.name);

  try {
    // Send to backend analytics
    if (authManager.isAuth()) {
      await authManager.makeAuthenticatedRequest('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          eventName: event.name,
          eventCategory: event.category,
          eventLabel: event.label,
          eventValue: event.value,
          source: 'extension',
          metadata: {
            subscription: event.subscription,
            timestamp: Date.now(),
          },
        }),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Analytics tracking failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle verify subscription
 */
async function handleVerifySubscription() {
  console.log('💳 Verifying subscription...');

  try {
    const result = await authManager.verifySubscription();
    return { success: true, subscription: result };
  } catch (error) {
    console.error('❌ Subscription verification failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Periodic subscription check (every hour)
 */
setInterval(async () => {
  if (authManager.isAuth()) {
    console.log('🔄 Periodic subscription verification...');
    await authManager.verifySubscription();

    // If monitoring is active but subscription is no longer valid, stop it
    if (monitoringState.isActive) {
      const canMonitor = authManager.canUseFeature('monitoring');
      
      if (!canMonitor.allowed) {
        console.log('❌ Subscription no longer allows monitoring, stopping...');
        await handleStopMonitoring();
        
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'TestNotifier - Monitoring Stopped',
          message: 'Your subscription has expired. Please renew to continue monitoring.',
        });
      }
    }
  }
}, 60 * 60 * 1000); // Every hour

/**
 * Listen for web requests to sync auth from website
 */
chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Check if user logged in on website
    if (details.url.includes('/api/auth/login') && details.statusCode === 200) {
      console.log('✅ Login detected on website, syncing auth...');
      // Trigger auth refresh
      setTimeout(() => authManager.initialize(), 1000);
    }
  },
  { urls: ['*://testnotifier.co.uk/*', '*://localhost:3000/*'] }
);

console.log('🔧 TestNotifier background script loaded (subscription-enabled)');

