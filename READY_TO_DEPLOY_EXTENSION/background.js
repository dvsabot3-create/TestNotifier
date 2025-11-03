/**
 * TestNotifier Extension - Background Service Worker
 * 
 * Handles:
 * - Extension lifecycle management
 * - Communication between popup and content script
 * - Monitoring coordination
 * - State management
 * - Multi-channel notifications (Email/SMS/WhatsApp)
 */

// Import notifications manager
importScripts('notifications/notifications-manager.js');
const notificationsManager = new NotificationsManager();

// Extension state
let state = {
  monitors: [],
  settings: {
    autoCheck: true,
    checkInterval: 30,
    soundAlerts: true,
    browserNotifications: true
  },
  isMonitoring: false,
  subscription: null,
  stats: {
    monitorsCount: 0,
    slotsFound: 0,
    rebooksUsed: 0,
    rebooksTotal: 5,
    lastCheck: null
  },
  riskLevel: {
    level: 'low',
    percentage: 12
  },
  riskMetrics: {
    totalChecks: 0,
    successfulChecks: 0,
    failedChecks: 0,
    lastCheckTime: null,
    averageCheckInterval: 30000,
    checksInLastHour: 0,
    suspiciousPatterns: 0
  }
};

// Monitoring intervals
let monitoringInterval = null;

/**
 * Extension installed/updated
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('🚀 TestNotifier installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // First install - initialize
    await initializeExtension();
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('Updated to version:', chrome.runtime.getManifest().version);
  }
});

/**
 * Initialize extension
 */
async function initializeExtension() {
  console.log('Initializing TestNotifier...');
  
  // Load saved state or use defaults
  const result = await chrome.storage.local.get([
    'monitors',
    'settings',
    'subscription',
    'stats',
    'riskLevel'
  ]);
  
  state.monitors = result.monitors || [];
  state.settings = result.settings || state.settings;
  state.subscription = result.subscription || null;
  state.stats = result.stats || state.stats;
  state.riskLevel = result.riskLevel || state.riskLevel;
  
  console.log('✅ Extension initialized', state);
}

/**
 * Message handler - Communication hub
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message received:', message.action);
  
  // Handle async operations
  handleMessage(message, sender).then(response => {
    sendResponse(response);
  }).catch(error => {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  });
  
  return true; // Keep message channel open for async response
});

/**
 * Handle messages from popup and content script
 */
async function handleMessage(message, sender) {
  switch (message.action) {
    case 'emergencyStop':
      return await handleEmergencyStop();
      
    case 'manualCheck':
      return await handleManualCheck();
      
    case 'addMonitor':
      return await handleAddMonitor(message.monitor);
      
    case 'updateMonitor':
      return await handleUpdateMonitor(message.monitorId, message.updates);
      
    case 'deleteMonitor':
      return await handleDeleteMonitor(message.monitorId);
      
    case 'toggleMonitor':
      return await handleToggleMonitor(message.monitorId, message.status);
      
    case 'updateSettings':
      return await handleUpdateSettings(message.settings);
      
    case 'getMonitors':
      return { success: true, monitors: state.monitors };
      
    case 'getStats':
      return { success: true, stats: state.stats };
      
    case 'getRisk':
      return { success: true, riskLevel: state.riskLevel };
      
    case 'checkSubscription':
      return await checkSubscription();
      
    case 'checkConnection':
      return { success: true, connected: true };
      
    case 'bookSlot':
      return await handleBookSlot(message.slot, message.monitorId);
      
    case 'getFullState':
      return {
        success: true,
        state: {
          currentInstructor: state.currentInstructor || null,
          pupils: state.pupils || [],
          settings: state.settings,
          monitors: state.monitors,
          subscription: state.subscription
        }
      };
      
    default:
      console.warn('Unknown action:', message.action);
      return { success: false, error: 'Unknown action' };
  }
}

/**
 * Emergency Stop - Halt all monitoring
 */
async function handleEmergencyStop() {
  console.log('🛑 EMERGENCY STOP ACTIVATED');
  
  // Stop monitoring interval
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
  
  // Pause all monitors
  state.monitors.forEach(m => m.status = 'paused');
  state.isMonitoring = false;
  
  // Save state
  await chrome.storage.local.set({ 
    monitors: state.monitors,
    isMonitoring: false
  });
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Emergency Stop Activated',
    message: 'All monitoring has been stopped.',
    priority: 2
  });
  
  console.log('✅ Emergency stop completed');
  
  return { success: true, message: 'All monitoring stopped' };
}

/**
 * Manual Check - Trigger immediate DVSA check
 */
async function handleManualCheck() {
  console.log('🔍 Manual stealth check triggered');
  
  // Get all active tabs with DVSA page
  const tabs = await chrome.tabs.query({
    url: 'https://driverpracticaltest.dvsa.gov.uk/*'
  });
  
  if (tabs.length > 0) {
    // Send message to content script to perform check
    for (const tab of tabs) {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'performStealthCheck',
        monitors: state.monitors.filter(m => m.status === 'active')
      });
    }
  } else {
    // No DVSA tab open - open one
    await chrome.tabs.create({
      url: 'https://driverpracticaltest.dvsa.gov.uk/',
      active: false
    });
  }
  
  // Update last check time
  state.stats.lastCheck = new Date().toISOString();
  await chrome.storage.local.set({ stats: state.stats });
  
  return { success: true, message: 'Manual check initiated' };
}

/**
 * Add Monitor
 */
async function handleAddMonitor(monitor) {
  console.log('➕ Adding monitor:', monitor.name);
  
  // Add to state
  state.monitors.push(monitor);
  state.stats.monitorsCount = state.monitors.length;
  
  // Save to storage
  await chrome.storage.local.set({ 
    monitors: state.monitors,
    stats: state.stats
  });
  
  // Start monitoring if not already running
  if (state.settings.autoCheck && !state.isMonitoring) {
    startMonitoring();
  }
  
  return { success: true, message: `Monitor added for ${monitor.name}` };
}

/**
 * Update Monitor
 */
async function handleUpdateMonitor(monitorId, updates) {
  const monitor = state.monitors.find(m => m.id === monitorId);
  if (!monitor) {
    return { success: false, error: 'Monitor not found' };
  }
  
  Object.assign(monitor, updates);
  
  await chrome.storage.local.set({ monitors: state.monitors });
  
  return { success: true, message: 'Monitor updated' };
}

/**
 * Delete Monitor
 */
async function handleDeleteMonitor(monitorId) {
  state.monitors = state.monitors.filter(m => m.id !== monitorId);
  state.stats.monitorsCount = state.monitors.length;
  
  await chrome.storage.local.set({ 
    monitors: state.monitors,
    stats: state.stats
  });
  
  return { success: true, message: 'Monitor deleted' };
}

/**
 * Toggle Monitor Status
 */
async function handleToggleMonitor(monitorId, status) {
  const monitor = state.monitors.find(m => m.id === monitorId);
  if (!monitor) {
    return { success: false, error: 'Monitor not found' };
  }
  
  monitor.status = status;
  
  await chrome.storage.local.set({ monitors: state.monitors });
  
  return { success: true, message: `Monitor ${status}` };
}

/**
 * Update Settings
 */
async function handleUpdateSettings(settings) {
  state.settings = { ...state.settings, ...settings };
  
  await chrome.storage.local.set({ settings: state.settings });
  
  // Restart monitoring with new interval if active
  if (state.isMonitoring) {
    stopMonitoring();
    if (state.settings.autoCheck) {
      startMonitoring();
    }
  }
  
  return { success: true, message: 'Settings updated' };
}

/**
 * Book Slot - Trigger automated booking
 */
async function handleBookSlot(slot, monitorId) {
  console.log('📅 Booking slot:', slot);
  
  const monitor = state.monitors.find(m => m.id === monitorId);
  if (!monitor) {
    return { success: false, error: 'Monitor not found' };
  }
  
  // Check subscription quota
  const remaining = state.subscription?.rebooksTotal - (state.stats.rebooksUsed || 0);
  if (remaining <= 0 && state.subscription?.tier !== 'professional') {
    return { success: false, error: 'No rebooks remaining. Please upgrade your plan.' };
  }
  
  // Open DVSA booking page
  const tab = await chrome.tabs.create({
    url: 'https://driverpracticaltest.dvsa.gov.uk/login',
    active: true
  });
  
  // Wait for page load, then send booking request to content script
  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId === tab.id && info.status === 'complete') {
      chrome.tabs.sendMessage(tab.id, {
        action: 'autoBook',
        slot: slot,
        monitor: monitor
      }, async (response) => {
        if (response && response.success) {
          // Booking confirmed - send confirmation notifications
          try {
            await notificationsManager.sendBookingConfirmation(
              monitor,
              {
                date: slot.date,
                time: slot.time,
                centre: slot.centre
              },
              state.subscription
            );
            console.log('✅ Booking confirmation notifications sent');
          } catch (error) {
            console.error('Failed to send booking confirmation:', error);
          }
        }
      });
      
      chrome.tabs.onUpdated.removeListener(listener);
    }
  });
  
  // Update stats
  state.stats.rebooksUsed++;
  await chrome.storage.local.set({ stats: state.stats });
  
  return { success: true, message: 'Booking initiated' };
}

/**
 * Check Subscription Status
 */
async function checkSubscription() {
  try {
    // Get auth token
    const result = await chrome.storage.local.get(['authToken']);
    
    if (!result.authToken) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Call backend API
    const response = await fetch('https://testnotifier.co.uk/api/subscriptions/current', {
      headers: {
        'Authorization': `Bearer ${result.authToken}`
      }
    });
    
    if (response.ok) {
      const subscription = await response.json();
      state.subscription = subscription;
      await chrome.storage.local.set({ subscription });
      return { success: true, subscription };
    } else {
      return { success: false, error: 'Failed to fetch subscription' };
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Start Monitoring
 */
function startMonitoring() {
  if (state.isMonitoring) return;
  
  console.log('▶️ Starting monitoring...');
  state.isMonitoring = true;
  
  // Check immediately
  performCheck();
  
  // Then check at intervals
  monitoringInterval = setInterval(() => {
    performCheck();
  }, state.settings.checkInterval * 1000);
}

/**
 * Stop Monitoring
 */
function stopMonitoring() {
  if (!state.isMonitoring) return;
  
  console.log('⏸️ Stopping monitoring...');
  state.isMonitoring = false;
  
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
}

/**
 * Perform Check on all active monitors
 */
async function performCheck() {
  const activeMonitors = state.monitors.filter(m => m.status === 'active');
  
  if (activeMonitors.length === 0) {
    console.log('No active monitors');
    return;
  }
  
  console.log(`🔍 Checking ${activeMonitors.length} monitor(s)...`);
  
  // Get or create DVSA tab
  const tabs = await chrome.tabs.query({
    url: 'https://driverpracticaltest.dvsa.gov.uk/*'
  });
  
  let dvsaTab;
  if (tabs.length > 0) {
    dvsaTab = tabs[0];
  } else {
    // Create hidden tab for checking
    dvsaTab = await chrome.tabs.create({
      url: 'https://driverpracticaltest.dvsa.gov.uk/',
      active: false
    });
  }
  
  // Send check request to content script
  try {
    const response = await chrome.tabs.sendMessage(dvsaTab.id, {
      action: 'performStealthCheck',
      monitors: activeMonitors
    });
    
    if (response?.slotsFound) {
      // Process found slots
      await handleSlotsFound(response.slotsFound);
      
      // Update risk metrics (successful check with slots found)
      updateRiskMetrics({ success: true, slotsFound: true });
    } else {
      // Update risk metrics (successful check, no slots)
      updateRiskMetrics({ success: true, slotsFound: false });
    }
    
    // Update last check time
    state.stats.lastCheck = new Date().toISOString();
    await chrome.storage.local.set({ stats: state.stats });
    
  } catch (error) {
    console.error('Error performing check:', error);
    
    // Update risk metrics (failed check)
    updateRiskMetrics({ success: false });
  }
}

/**
 * Handle found slots - REAL MULTI-CHANNEL NOTIFICATIONS
 */
async function handleSlotsFound(slotsData) {
  console.log('🎉 Slots found!', slotsData);
  
  for (const { monitorId, slots } of slotsData) {
    const monitor = state.monitors.find(m => m.id === monitorId);
    if (!monitor) continue;
    
    // Update monitor with found slots
    monitor.foundSlots = slots;
    monitor.slotsFound = slots.length;
    monitor.lastUpdate = new Date().toISOString();
    
    // Update total stats
    state.stats.slotsFound += slots.length;
    
    // Send multi-channel notifications
    for (const slot of slots) {
      try {
        console.log(`📢 Sending notifications for ${monitor.name} - ${slot.date} at ${slot.time}`);
        
        const results = await notificationsManager.sendSlotFoundNotification(
          monitor,
          slot,
          state.subscription
        );
        
        console.log('📊 Notification results:', results);
        
        // Log any errors
        if (results.errors.length > 0) {
          console.error('⚠️ Some notifications failed:', results.errors);
        }
        
        // Play sound if enabled (for browser notifications)
        if (results.browser && state.settings.soundAlerts) {
          try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
              await chrome.tabs.sendMessage(tabs[0].id, { action: 'playNotificationSound' });
            }
          } catch (error) {
            console.log('Could not play sound (no active tab)');
          }
        }
        
      } catch (error) {
        console.error('❌ Error sending notifications for slot:', error);
        
        // Fallback to basic browser notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: `Slot Found for ${monitor.name}!`,
          message: `${slot.date} at ${slot.time} - ${slot.centre}`,
          priority: 2
        });
      }
    }
  }
  
  // Save updated monitors
  await chrome.storage.local.set({ 
    monitors: state.monitors,
    stats: state.stats
  });
}

/**
 * Notification click handler
 */
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open popup when notification clicked
  chrome.action.openPopup();
});

/**
 * Calculate real-time risk level based on activity metrics
 */
function calculateRiskLevel() {
  const metrics = state.riskMetrics;
  let riskScore = 0;
  
  // Factor 1: Check frequency (0-25 points)
  const timeSinceLastCheck = Date.now() - (metrics.lastCheckTime || Date.now());
  if (timeSinceLastCheck < 10000) { // Less than 10 seconds
    riskScore += 25;
  } else if (timeSinceLastCheck < 20000) {
    riskScore += 15;
  } else if (timeSinceLastCheck < 30000) {
    riskScore += 5;
  }
  
  // Factor 2: Success rate (0-20 points)
  const successRate = metrics.totalChecks > 0 
    ? (metrics.successfulChecks / metrics.totalChecks) 
    : 0.5;
  
  if (successRate > 0.9) {
    riskScore += 20; // Too high success = suspicious
  } else if (successRate < 0.1) {
    riskScore += 15; // Too many failures = suspicious
  }
  
  // Factor 3: Checks in last hour (0-25 points)
  if (metrics.checksInLastHour > 120) { // More than 2 per minute
    riskScore += 25;
  } else if (metrics.checksInLastHour > 60) {
    riskScore += 15;
  } else if (metrics.checksInLastHour > 30) {
    riskScore += 5;
  }
  
  // Factor 4: Suspicious patterns (0-15 points)
  riskScore += Math.min(15, metrics.suspiciousPatterns * 3);
  
  // Factor 5: Time of day (0-15 points)
  const hour = new Date().getHours();
  if (hour >= 2 && hour <= 5) {
    riskScore += 15; // Unusual hours
  } else if (hour >= 22 || hour <= 1) {
    riskScore += 5;
  }
  
  // Determine risk level
  let level = 'low';
  if (riskScore >= 70) {
    level = 'high';
  } else if (riskScore >= 40) {
    level = 'medium';
  }
  
  state.riskLevel = {
    level,
    percentage: Math.min(100, riskScore),
    lastCalculated: new Date().toISOString()
  };
  
  // Save to storage
  chrome.storage.local.set({ riskLevel: state.riskLevel });
  
  return state.riskLevel;
}

/**
 * Update risk metrics after check
 */
function updateRiskMetrics(checkResult) {
  const now = Date.now();
  const metrics = state.riskMetrics;
  
  metrics.totalChecks++;
  if (checkResult.success) {
    metrics.successfulChecks++;
  } else {
    metrics.failedChecks++;
  }
  
  // Update checks in last hour
  metrics.lastCheckTime = now;
  
  // Calculate average interval
  if (metrics.totalChecks > 1) {
    const avgInterval = (now - metrics.lastCheckTime) / metrics.totalChecks;
    metrics.averageCheckInterval = avgInterval;
    
    // Detect suspicious patterns
    if (avgInterval < 15000) { // Checking too frequently
      metrics.suspiciousPatterns++;
    }
  }
  
  // Recalculate risk
  calculateRiskLevel();
  
  chrome.storage.local.set({ riskMetrics: metrics });
}

/**
 * Load state on startup
 */
(async function() {
  await initializeExtension();
  
  // Calculate initial risk
  calculateRiskLevel();
  
  // Recalculate risk every minute
  setInterval(() => {
    calculateRiskLevel();
  }, 60000);
  
  // Start monitoring if auto-check is enabled and there are active monitors
  if (state.settings.autoCheck && state.monitors.some(m => m.status === 'active')) {
    startMonitoring();
  }
})();

console.log('✅ Background service worker loaded');

