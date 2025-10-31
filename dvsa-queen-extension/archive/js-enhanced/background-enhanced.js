/**
 * DVSA Queen - Enhanced Background Service Worker
 * Supports new interface requirements and advanced automation
 */

// Enhanced extension state management
let enhancedState = {
  automation: {
    status: 'stopped', // stopped, running, paused
    startTime: null,
    config: {
      startDate: null,
      endDate: null,
      centers: [],
      userId: null,
      rapidMode: false,
      delay: 1000, // milliseconds
      maxRetries: 3,
      retryDelay: 1000
    }
  },
  currentUser: null,
  users: [],
  selectedCenters: [],
  availableCenters: [
    { id: 'man-north', name: 'Manchester North', code: 'MAN01' },
    { id: 'man-south', name: 'Manchester South', code: 'MAN02' },
    { id: 'lon-wembley', name: 'London Wembley', code: 'LON01' },
    { id: 'lon-croydon', name: 'London Croydon', code: 'LON02' },
    { id: 'birm-south', name: 'Birmingham South', code: 'BIR01' },
    { id: 'birm-north', name: 'Birmingham North', code: 'BIR02' },
    { id: 'leeds', name: 'Leeds', code: 'LEE01' },
    { id: 'glasgow', name: 'Glasgow', code: 'GLA01' },
    { id: 'cardiff', name: 'Cardiff', code: 'CAR01' },
    { id: 'bristol', name: 'Bristol', code: 'BRI01' }
  ],
  stats: {
    totalChecks: 0,
    successfulChanges: 0,
    clickCount: 0,
    successRate: 0
  },
  settings: {
    autoCheck: true,
    soundEnabled: true,
    notifications: true,
    rapidModeWarningShown: false
  }
};

// Automation intervals
let automationInterval = null;
let statsUpdateInterval = null;

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 DVSA Queen Enhanced extension installed');

  // Set default state
  chrome.storage.local.set({
    enhancedState: enhancedState,
    firstRun: true
  });

  // Create enhanced context menu
  chrome.contextMenus.create({
    id: 'dvsa-queen-check',
    title: 'Check for cancellations',
    contexts: ['page'],
    documentUrlPatterns: ['https://driverpracticaltest.dvsa.gov.uk/*']
  });

  chrome.contextMenus.create({
    id: 'dvsa-queen-start',
    title: 'Start Auto-Check',
    contexts: ['page'],
    documentUrlPatterns: ['https://driverpracticaltest.dvsa.gov.uk/*']
  });

  chrome.contextMenus.create({
    id: 'dvsa-queen-stop',
    title: 'Stop Auto-Check',
    contexts: ['page'],
    documentUrlPatterns: ['https://driverpracticaltest.dvsa.gov.uk/*']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
  case 'dvsa-queen-check':
    chrome.tabs.sendMessage(tab.id, {
      action: 'manualCheck',
      source: 'contextMenu'
    });
    break;
  case 'dvsa-queen-start':
    startAutomation();
    break;
  case 'dvsa-queen-stop':
    stopAutomation();
    break;
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Background received message:', message);

  switch (message.action) {
  case 'getEnhancedState':
    getEnhancedState().then(sendResponse);
    return true; // Keep channel open for async response

  case 'saveEnhancedState':
    saveEnhancedState(message.state).then(sendResponse);
    return true;

  case 'getAvailableCenters':
    getAvailableCenters().then(sendResponse);
    return true;

  case 'startAutomation':
    startAutomation(message.config).then(sendResponse);
    return true;

  case 'stopAutomation':
    stopAutomation().then(sendResponse);
    return true;

  case 'updateAutomationConfig':
    updateAutomationConfig(message.config).then(sendResponse);
    return true;

  case 'trackEvent':
    trackEvent(message.event, message.data);
    sendResponse({ success: true });
    break;

  case 'logTestFound':
    logTestFound(message.data);
    sendResponse({ success: true });
    break;

  case 'incrementClickCount':
    incrementClickCount();
    sendResponse({ success: true });
    break;

  default:
    console.log('⚠️ Unknown message action:', message.action);
    sendResponse({ success: false, message: 'Unknown action' });
  }
});

/**
 * Get enhanced extension state
 */
async function getEnhancedState() {
  try {
    const result = await chrome.storage.local.get(['enhancedState']);
    if (result.enhancedState) {
      enhancedState = result.enhancedState;
    }
    return { success: true, state: enhancedState };
  } catch (error) {
    console.error('❌ Error getting enhanced state:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Save enhanced extension state
 */
async function saveEnhancedState(newState) {
  try {
    enhancedState = { ...enhancedState, ...newState };
    await chrome.storage.local.set({ enhancedState });
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving enhanced state:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Get available test centers
 */
async function getAvailableCenters() {
  return { success: true, centers: enhancedState.availableCenters };
}

/**
 * Start automation with enhanced configuration
 */
async function startAutomation(config = {}) {
  try {
    if (enhancedState.automation.status === 'running') {
      return { success: false, message: 'Automation already running' };
    }

    // Validate configuration
    if (!config.centers || config.centers.length === 0) {
      return { success: false, message: 'No centers selected' };
    }

    if (!config.userId) {
      return { success: false, message: 'No user selected' };
    }

    // Update configuration
    enhancedState.automation.config = {
      ...enhancedState.automation.config,
      ...config
    };

    // Show rapid mode warning if enabled
    if (config.rapidMode && !enhancedState.settings.rapidModeWarningShown) {
      enhancedState.settings.rapidModeWarningShown = true;
      await saveEnhancedState({ settings: enhancedState.settings });

      // Show notification
      chrome.notifications.create('rapid-mode-warning', {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Rapid Mode Enabled',
        message: 'Rapid mode uses faster intervals and may be more detectable. Use with caution.'
      });
    }

    // Update automation state
    enhancedState.automation.status = 'running';
    enhancedState.automation.startTime = Date.now();

    await saveEnhancedState({
      automation: enhancedState.automation,
      currentUser: enhancedState.users.find(u => u.id === config.userId)
    });

    // Start automation interval
    startAutomationInterval();

    console.log('🟢 Automation started with config:', enhancedState.automation.config);

    return {
      success: true,
      message: 'Automation started successfully',
      config: enhancedState.automation.config
    };
  } catch (error) {
    console.error('❌ Error starting automation:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Stop automation
 */
async function stopAutomation() {
  try {
    if (enhancedState.automation.status !== 'running') {
      return { success: false, message: 'Automation not running' };
    }

    const duration = Date.now() - enhancedState.automation.startTime;

    // Update automation state
    enhancedState.automation.status = 'stopped';
    enhancedState.automation.startTime = null;

    await saveEnhancedState({ automation: enhancedState.automation });

    // Stop automation interval
    stopAutomationInterval();

    // Update final stats
    updateFinalStats(duration);

    console.log('🔴 Automation stopped. Duration:', duration, 'ms');

    return {
      success: true,
      message: 'Automation stopped successfully',
      duration: duration
    };
  } catch (error) {
    console.error('❌ Error stopping automation:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Update automation configuration
 */
async function updateAutomationConfig(config) {
  try {
    enhancedState.automation.config = {
      ...enhancedState.automation.config,
      ...config
    };

    await saveEnhancedState({ automation: enhancedState.automation });

    // If automation is running, restart with new config
    if (enhancedState.automation.status === 'running') {
      stopAutomationInterval();
      startAutomationInterval();
    }

    return { success: true, config: enhancedState.automation.config };
  } catch (error) {
    console.error('❌ Error updating automation config:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Start automation interval
 */
function startAutomationInterval() {
  const config = enhancedState.automation.config;
  const interval = config.rapidMode ? 500 : config.delay;

  automationInterval = setInterval(async() => {
    await performAutomationCheck();
  }, interval);

  console.log(`⏰ Automation interval started: ${interval}ms`);
}

/**
 * Stop automation interval
 */
function stopAutomationInterval() {
  if (automationInterval) {
    clearInterval(automationInterval);
    automationInterval = null;
    console.log('⏰ Automation interval stopped');
  }
}

/**
 * Perform automation check
 */
async function performAutomationCheck() {
  try {
    const config = enhancedState.automation.config;

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url.includes('driverpracticaltest.dvsa.gov.uk')) {
      console.log('⚠️ Not on DVSA site, skipping check');
      return;
    }

    // Send check request to content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'automatedCheck',
      config: {
        centers: config.centers,
        startDate: config.startDate,
        endDate: config.endDate,
        rapidMode: config.rapidMode
      }
    });

    if (response.success) {
      enhancedState.stats.totalChecks++;
      enhancedState.stats.clickCount++;

      if (response.testFound) {
        enhancedState.stats.successfulChanges++;
        await logTestFound(response.testData);
      }

      // Update success rate
      if (enhancedState.stats.totalChecks > 0) {
        enhancedState.stats.successRate = Math.round(
          (enhancedState.stats.successfulChanges / enhancedState.stats.totalChecks) * 100
        );
      }

      // Save updated stats
      await saveEnhancedState({ stats: enhancedState.stats });

      console.log('✅ Automation check completed:', {
        found: response.testFound,
        totalChecks: enhancedState.stats.totalChecks
      });
    } else {
      console.error('❌ Automation check failed:', response.message);
    }
  } catch (error) {
    console.error('❌ Error during automation check:', error);
  }
}

/**
 * Log test found event
 */
async function logTestFound(testData) {
  try {
    // Send notification
    chrome.notifications.create('test-found-' + Date.now(), {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Test Cancellation Found! 🎉',
      message: `${testData.centerName} - ${testData.date} at ${testData.time}`
    });

    // Play sound if enabled
    if (enhancedState.settings.soundEnabled) {
      playNotificationSound();
    }

    // Track event
    trackEvent('test_found', {
      centerName: testData.centerName,
      date: testData.date,
      time: testData.time,
      userId: enhancedState.automation.config.userId
    });

    console.log('🎯 Test found:', testData);
  } catch (error) {
    console.error('❌ Error logging test found:', error);
  }
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  try {
    const audio = new Audio(chrome.runtime.getURL('sounds/notification.mp3'));
    audio.play().catch(error => {
      console.error('❌ Error playing notification sound:', error);
    });
  } catch (error) {
    console.error('❌ Error creating audio element:', error);
  }
}

/**
 * Increment click count
 */
async function incrementClickCount() {
  enhancedState.stats.clickCount++;
  await saveEnhancedState({ stats: enhancedState.stats });
}

/**
 * Track events for analytics
 */
function trackEvent(event, data) {
  // Send to analytics endpoint
  fetch('/api/analytics/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${enhancedState.currentUser?.token}`
    },
    body: JSON.stringify({
      event,
      data,
      timestamp: Date.now(),
      userId: enhancedState.currentUser?.id,
      sessionId: enhancedState.automation.startTime
    })
  }).catch(error => {
    console.error('❌ Error tracking event:', error);
  });
}

/**
 * Update final statistics
 */
function updateFinalStats(duration) {
  const durationMinutes = Math.floor(duration / 60000);

  console.log('📊 Final automation stats:', {
    duration: durationMinutes + ' minutes',
    totalChecks: enhancedState.stats.totalChecks,
    successfulChanges: enhancedState.stats.successfulChanges,
    successRate: enhancedState.stats.successRate + '%',
    clicks: enhancedState.stats.clickCount
  });

  // Store session summary
  const sessionSummary = {
    duration,
    totalChecks: enhancedState.stats.totalChecks,
    successfulChanges: enhancedState.stats.successfulChanges,
    successRate: enhancedState.stats.successRate,
    clicks: enhancedState.stats.clickCount,
    timestamp: Date.now()
  };

  // Save to storage for history
  chrome.storage.local.get(['sessionHistory'], (result) => {
    const history = result.sessionHistory || [];
    history.unshift(sessionSummary);

    // Keep only last 100 sessions
    if (history.length > 100) {
      history.splice(100);
    }

    chrome.storage.local.set({ sessionHistory: history });
  });
}

/**
 * Handle extension lifecycle
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('🔄 Extension started');
  loadState();
});

/**
 * Load state from storage
 */
async function loadState() {
  try {
    const result = await chrome.storage.local.get(['enhancedState']);
    if (result.enhancedState) {
      enhancedState = result.enhancedState;
      console.log('✅ State loaded from storage');

      // Resume automation if it was running
      if (enhancedState.automation.status === 'running') {
        console.log('🔄 Resuming automation from previous session');
        startAutomationInterval();
      }
    }
  } catch (error) {
    console.error('❌ Error loading state:', error);
  }
}

// Load state on initialization
loadState();
