/**
 * DVSA Queen - Background Service Worker
 * Manages extension lifecycle and communication between components
 */

// Extension state management
let extensionState = {
  isActive: false,
  currentInstructor: null,
  pupils: [],
  settings: {
    autoCheck: true,
    checkInterval: 15000, // 15 seconds
    soundEnabled: true,
    notifications: true
  }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 DVSA Queen extension installed');

  // Set default state
  chrome.storage.local.set({
    extensionState: extensionState,
    firstRun: true
  });

  // Create context menu
  chrome.contextMenus.create({
    id: 'dvsa-queen-check',
    title: 'Check for cancellations',
    contexts: ['page'],
    documentUrlPatterns: ['https://driverpracticaltest.dvsa.gov.uk/*']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'dvsa-queen-check') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'manualCheck',
      source: 'contextMenu'
    });
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Background received message:', message);

  switch (message.action) {
    case 'getState':
      getExtensionState().then(state => {
        sendResponse({ success: true, state: state });
      });
      return true; // Keep channel open for async response

    case 'updateState':
      updateExtensionState(message.data).then(() => {
        sendResponse({ success: true });
      });
      return true;

    case 'foundCancellation':
      handleCancellationFound(message.data, sender.tab);
      break;

    case 'bookingChanged':
      handleBookingChanged(message.data, sender.tab);
      break;

    case 'errorOccurred':
      handleError(message.data, sender.tab);
      break;

    case 'getSettings':
      getSettings().then(settings => {
        sendResponse({ success: true, settings: settings });
      });
      return true;

    case 'updateSettings':
      updateSettings(message.data).then(() => {
        sendResponse({ success: true });
      });
      return true;

    default:
      console.warn('⚠️ Unknown message action:', message.action);
  }
});

// Handle tab updates (DVSA page navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('driverpracticaltest.dvsa.gov.uk')) {
    console.log('🌐 DVSA page loaded:', tab.url);

    // Check if this is the change date page
    if (tab.url.includes('change') || tab.url.includes('manage')) {
      chrome.tabs.sendMessage(tabId, {
        action: 'pageLoaded',
        url: tab.url
      });
    }
  }
});

// Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  if (tab.url?.includes('driverpracticaltest.dvsa.gov.uk')) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggleInterface'
    });
  }
});

/**
 * Get current extension state from storage
 */
async function getExtensionState() {
  try {
    const result = await chrome.storage.local.get('extensionState');
    return result.extensionState || extensionState;
  } catch (error) {
    console.error('❌ Error getting extension state:', error);
    return extensionState;
  }
}

/**
 * Update extension state in storage
 */
async function updateExtensionState(newState) {
  try {
    extensionState = { ...extensionState, ...newState };
    await chrome.storage.local.set({ extensionState: extensionState });
    console.log('✅ Extension state updated');
  } catch (error) {
    console.error('❌ Error updating extension state:', error);
  }
}

/**
 * Get settings from storage
 */
async function getSettings() {
  try {
    const result = await chrome.storage.local.get('settings');
    return result.settings || extensionState.settings;
  } catch (error) {
    console.error('❌ Error getting settings:', error);
    return extensionState.settings;
  }
}

/**
 * Update settings in storage
 */
async function updateSettings(newSettings) {
  try {
    extensionState.settings = { ...extensionState.settings, ...newSettings };
    await chrome.storage.local.set({ settings: extensionState.settings });

    // Notify content script of settings change
    chrome.tabs.query({ url: '*://driverpracticaltest.dvsa.gov.uk/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'settingsUpdated',
          settings: extensionState.settings
        });
      });
    });

    console.log('✅ Settings updated');
  } catch (error) {
    console.error('❌ Error updating settings:', error);
  }
}

/**
 * Handle cancellation found
 */
function handleCancellationFound(data, tab) {
  console.log('🎯 Cancellation found:', data);

  // Show notification
  if (extensionState.settings.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'DVSA Queen - Cancellation Found!',
      message: `Earlier test available for ${data.pupilName}: ${data.newDate} at ${data.newCentre}`
    });
  }

  // Play sound if enabled
  if (extensionState.settings.soundEnabled) {
    // Create audio notification
    const audio = new Audio(chrome.runtime.getURL('sounds/notification.mp3'));
    audio.play().catch(() => {}); // Ignore if sound file not found
  }
}

/**
 * Handle successful booking change
 */
function handleBookingChanged(data, tab) {
  console.log('✅ Booking changed successfully:', data);

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'DVSA Queen - Booking Changed!',
    message: `Test moved from ${data.oldDate} to ${data.newDate} for ${data.pupilName}`
  });
}

/**
 * Handle errors
 */
function handleError(error, tab) {
  console.error('❌ Extension error:', error);

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'DVSA Queen - Error',
    message: `Error: ${error.message}`
  });
}

/**
 * Utility: Generate unique ID
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

console.log('🔧 DVSA Queen background script loaded');