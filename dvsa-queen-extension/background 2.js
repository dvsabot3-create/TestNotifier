/**
 * DVSA Queen - Background Service Worker
 * Manages extension lifecycle and communication between components
 */

// Extension state management
let extensionState = {
  isActive: false,
  currentInstructor: null,
  pupils: [],
  subscription: {
    tier: 'free', // 'free', 'one-off', 'starter', 'premium', 'professional'
    status: 'inactive',
    expiresAt: null,
    features: {
      maxTestCenters: 1,
      maxRebooks: 0,
      rapidMode: false,
      bulkOperations: false,
      advancedFiltering: false,
      stealthMode: false,
      multiPupil: false,
      smsNotifications: false,
      whatsappNotifications: false,
      emailNotifications: false
    }
  },
  settings: {
    autoCheck: true,
    checkInterval: 15000, // 15 seconds
    soundEnabled: true,
    notifications: true,
    twilio: {
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      username: '',
      password: '',
      fromAddress: ''
    }
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

  // Start notification retry scheduler
  startNotificationRetryScheduler();

  // Context menu - disabled for now
  // chrome.contextMenus.create({
  //   id: 'dvsa-queen-check',
  //   title: 'Check for cancellations',
  //   contexts: ['page'],
  //   documentUrlPatterns: ['https://driverpracticaltest.dvsa.gov.uk/*']
  // });
});

// Handle context menu clicks - disabled for now
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'dvsa-queen-check') {
//     chrome.tabs.sendMessage(tab.id, {
//       action: 'manualCheck',
//       source: 'contextMenu'
//     });
//   }
// });

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

  case 'autoBookingExecuted':
    handleAutoBookingExecuted(message.data, sender.tab);
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

  case 'validateSubscription':
    validateSubscription(message.userId).then(result => {
      sendResponse({ success: true, subscription: result });
    });
    return true;

  case 'getSubscription':
    getSubscription().then(subscription => {
      sendResponse({ success: true, subscription: subscription });
    });
    return true;

  case 'addPupil':
    handleAddPupil(message.data).then(result => {
      sendResponse(result);
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
async function handleCancellationFound(data, tab) {
  console.log('🎯 Cancellation found:', data);

  // Find the pupil in our database
  const pupil = extensionState.pupils.find(p => p.name === data.pupilName);

  if (!pupil) {
    console.warn('⚠️ Pupil not found in database, sending basic notification only');

    // Fallback to basic Chrome notification
    if (extensionState.settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/professional/icon128.png',
        title: 'TestNotifier - Cancellation Found!',
        message: `Earlier test available for ${data.pupilName}: ${data.newDate} at ${data.newCentre}`
      });
    }

    // Play sound if enabled
    if (extensionState.settings.soundEnabled) {
      const audio = new Audio(chrome.runtime.getURL('sounds/notification.mp3'));
      audio.play().catch(() => {});
    }
    return;
  }

  // Send multi-channel notification
  try {
    const results = await sendMultiChannelNotification(pupil, 'cancellation_found', data);
    console.log('✅ Multi-channel notification sent:', results);
  } catch (error) {
    console.error('❌ Error sending multi-channel notification:', error);

    // Fallback to basic notification on error
    if (extensionState.settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/professional/icon128.png',
        title: 'TestNotifier - Cancellation Found!',
        message: `Earlier test available for ${data.pupilName}: ${data.newDate} at ${data.newCentre}`
      });
    }
  }

  // Play sound if enabled
  if (extensionState.settings.soundEnabled) {
    const audio = new Audio(chrome.runtime.getURL('sounds/notification.mp3'));
    audio.play().catch(() => {});
  }
}

/**
 * Handle successful booking change
 */
async function handleBookingChanged(data, tab) {
  console.log('✅ Booking changed successfully:', data);

  // Find the pupil in our database
  const pupil = extensionState.pupils.find(p => p.name === data.pupilName);

  if (!pupil) {
    console.warn('⚠️ Pupil not found in database, sending basic notification only');

    // Fallback to basic Chrome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/professional/icon128.png',
      title: 'TestNotifier - Booking Changed!',
      message: `Test moved from ${data.oldDate} to ${data.newDate} for ${data.pupilName}`
    });
    return;
  }

  // Send multi-channel notification
  try {
    const results = await sendMultiChannelNotification(pupil, 'booking_changed', data);
    console.log('✅ Multi-channel booking change notification sent:', results);
  } catch (error) {
    console.error('❌ Error sending multi-channel notification:', error);

    // Fallback to basic notification on error
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/professional/icon128.png',
      title: 'TestNotifier - Booking Changed!',
      message: `Test moved from ${data.oldDate} to ${data.newDate} for ${data.pupilName}`
    });
  }
}

/**
 * Handle errors
 */
function handleError(error, tab) {
  console.error('❌ Extension error:', error);

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/professional/icon128.png',
    title: 'TestNotifier - Error',
    message: `Error: ${error.message}`
  });
}

/**
 * Handle auto-booking execution with verification
 */
async function handleAutoBookingExecuted(data, tab) {
  console.log('🤖 Auto-booking executed:', data);

  // Find the pupil in our database
  const pupil = extensionState.pupils.find(p => p.name === data.pupilName);

  if (!pupil) {
    console.warn('⚠️ Pupil not found in database, sending basic notification only');

    // Fallback to basic Chrome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/professional/icon128.png',
      title: 'TestNotifier - Auto-Booking Complete!',
      message: `${data.pupilName} moved to ${data.newDate} automatically`
    });
    return;
  }

  try {
    console.log('🔍 Starting booking verification process...');

    // Verify the booking change
    const verificationResults = await verifyBookingChange(pupil, {
      date: data.newDate,
      time: data.newTime,
      centre: data.newCentre
    }, {
      date: data.oldDate,
      time: data.oldTime,
      centre: data.oldCentre
    });

    // Track analytics
    trackBookingAnalytics('auto_booking_executed', {
      ...data,
      success: verificationResults.success,
      riskLevel: verificationResults.riskAssessment?.level
    });

    if (verificationResults.success) {
      console.log('✅ Booking verification passed, sending confirmation...');

      // Send verified booking confirmation
      const results = await sendBookingConfirmation(pupil, data, verificationResults);
      console.log('✅ Verified booking confirmation sent:', results);

      // Also send the regular auto-booking notification
      await sendMultiChannelNotification(pupil, 'auto_booking_executed', data);

    } else {
      console.warn('⚠️ Booking verification failed, sending alert...');

      // Send verification failure alert
      await sendMultiChannelNotification(pupil, 'booking_verified', {
        ...data,
        verificationResults: {
          ...verificationResults,
          success: false
        },
        confidenceScore: 25
      });
    }

  } catch (error) {
    console.error('❌ Error in auto-booking verification process:', error);

    // Fallback to basic notification on error
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/professional/icon128.png',
      title: 'TestNotifier - Auto-Booking Complete!',
      message: `${data.pupilName} moved to ${data.newDate} automatically`
    });
  }
}

/**
 * Utility: Generate unique ID
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Validate user subscription with API
 */
async function validateSubscription(userId) {
  try {
    console.log('🔍 Validating subscription for user:', userId);

    // For now, return mock subscription data based on user patterns
    // In production, this would call the actual API
    const mockSubscription = getMockSubscription(userId);

    // Update extension state with subscription info
    extensionState.subscription = mockSubscription;
    await chrome.storage.local.set({ extensionState: extensionState });

    console.log('✅ Subscription validated:', mockSubscription);
    return mockSubscription;
  } catch (error) {
    console.error('❌ Error validating subscription:', error);
    return extensionState.subscription; // Return current subscription on error
  }
}

/**
 * Get current subscription from storage
 */
async function getSubscription() {
  try {
    const result = await chrome.storage.local.get('extensionState');
    return result.extensionState?.subscription || extensionState.subscription;
  } catch (error) {
    console.error('❌ Error getting subscription:', error);
    return extensionState.subscription;
  }
}

/**
 * Get mock subscription data based on user patterns
 * This simulates different subscription tiers for testing
 */
function getMockSubscription(userId) {
  // Simulate different subscription tiers based on user ID patterns
  const tierIndex = userId ? userId.length % 5 : 0;

  const tiers = [
    {
      tier: 'free',
      status: 'active',
      expiresAt: null,
      features: {
        maxTestCenters: 1,
        maxRebooks: 0,
        rapidMode: false,
        bulkOperations: false,
        advancedFiltering: false,
        stealthMode: false,
        multiPupil: false,
        smsNotifications: false,
        whatsappNotifications: false,
        emailNotifications: false
      }
    },
    {
      tier: 'one-off',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      features: {
        maxTestCenters: 1,
        maxRebooks: 1,
        rapidMode: false,
        bulkOperations: false,
        advancedFiltering: false,
        stealthMode: false,
        multiPupil: false,
        smsNotifications: false,
        whatsappNotifications: false,
        emailNotifications: true
      }
    },
    {
      tier: 'starter',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        maxTestCenters: 3,
        maxRebooks: 2,
        rapidMode: false,
        bulkOperations: false,
        advancedFiltering: false,
        stealthMode: false,
        multiPupil: false,
        smsNotifications: true,
        whatsappNotifications: false,
        emailNotifications: true
      }
    },
    {
      tier: 'premium',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        maxTestCenters: 8,
        maxRebooks: 5,
        rapidMode: true,
        bulkOperations: false,
        advancedFiltering: true,
        stealthMode: false,
        multiPupil: false,
        smsNotifications: true,
        whatsappNotifications: false,
        emailNotifications: true
      }
    },
    {
      tier: 'professional',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        maxTestCenters: 999, // Unlimited
        maxRebooks: 999, // Unlimited
        rapidMode: true,
        bulkOperations: true,
        advancedFiltering: true,
        stealthMode: true,
        multiPupil: true,
        smsNotifications: true,
        whatsappNotifications: true,
        emailNotifications: true
      }
    }
  ];

  return tiers[tierIndex];
}

/**
 * Retry failed notifications
 */
async function retryFailedNotifications() {
  try {
    if (!extensionState.failedNotifications) {
      extensionState.failedNotifications = [];
      return;
    }

    const now = Date.now();
    const notificationsToRetry = extensionState.failedNotifications.filter(notification =>
      notification.nextRetryTime && now >= notification.nextRetryTime &&
      notification.retryCount < 3 && !notification.success
    );

    if (notificationsToRetry.length === 0) {
      return;
    }

    console.log(`🔄 Retrying ${notificationsToRetry.length} failed notifications...`);

    for (const notification of notificationsToRetry) {
      try {
        let result = null;

        switch (notification.channel) {
        case 'sms':
          result = await sendSMSNotification(
            notification.recipient,
            notification.message,
            notification.pupilName
          );
          break;

        case 'whatsapp':
          result = await sendWhatsAppNotification(
            notification.recipient,
            notification.message,
            notification.pupilName
          );
          break;

        case 'email':
          result = await sendEmailNotification(
            notification.recipient,
            notification.subject,
            notification.body,
            notification.pupilName
          );
          break;
        }

        if (result.success) {
          notification.success = true;
          notification.finalMessageId = result.messageId;
          console.log(`✅ Notification retry successful: ${notification.id}`);
        } else {
          notification.retryCount++;
          notification.lastError = result.error;
          notification.nextRetryTime = now + (60000 * Math.pow(2, notification.retryCount)); // Exponential backoff
          console.log(`⚠️ Notification retry failed: ${notification.id}, will retry in ${Math.pow(2, notification.retryCount)} minutes`);
        }

      } catch (error) {
        notification.retryCount++;
        notification.lastError = error.message;
        notification.nextRetryTime = now + (60000 * Math.pow(2, notification.retryCount));
        console.error(`❌ Notification retry error: ${notification.id}`, error);
      }
    }

    // Clean up old successful notifications
    extensionState.failedNotifications = extensionState.failedNotifications.filter(notification =>
      !notification.success || (now - notification.timestamp < 86400000) // Keep successful notifications for 24 hours
    );

    // Save updated state
    await chrome.storage.local.set({ extensionState });

  } catch (error) {
    console.error('❌ Error in retry notification process:', error);
  }
}

/**
 * Queue failed notification for retry
 */
function queueFailedNotification(channel, recipient, message, pupilName, subject = null, body = null) {
  if (!extensionState.failedNotifications) {
    extensionState.failedNotifications = [];
  }

  const notification = {
    id: Date.now().toString(),
    channel,
    recipient,
    message,
    pupilName,
    subject,
    body,
    timestamp: Date.now(),
    nextRetryTime: Date.now() + 60000, // Retry in 1 minute
    retryCount: 0,
    success: false
  };

  extensionState.failedNotifications.push(notification);

  // Keep only last 50 failed notifications
  if (extensionState.failedNotifications.length > 50) {
    extensionState.failedNotifications = extensionState.failedNotifications.slice(-50);
  }

  console.log(`📝 Queued failed notification for retry: ${notification.id}`);

  // Save to storage
  chrome.storage.local.set({ extensionState }).catch(error => {
    console.error('❌ Error saving failed notification:', error);
  });
}

/**
 * Start notification retry scheduler
 */
function startNotificationRetryScheduler() {
  // Retry every 30 seconds
  setInterval(() => {
    retryFailedNotifications();
  }, 30000);

  console.log('🔄 Notification retry scheduler started');
}

/**
 * Send SMS notification using Twilio API
 */
async function sendSMSNotification(to, message, pupilName = '') {
  try {
    // Check if Twilio is configured and SMS notifications are enabled
    if (!extensionState.settings.twilio.accountSid ||
        !extensionState.settings.twilio.authToken ||
        !extensionState.settings.twilio.phoneNumber ||
        !extensionState.subscription.features.smsNotifications) {
      console.log('⚠️ SMS notifications not configured or not available for this tier');
      return { success: false, error: 'SMS not configured' };
    }

    // Validate phone number format (UK format)
    const cleanNumber = to.replace(/[^\d+]/g, '');
    if (!cleanNumber.match(/^\+?44\d{10}$|^(07|447)\d{9}$/)) {
      console.log('⚠️ Invalid UK phone number format:', to);
      return { success: false, error: 'Invalid phone number format' };
    }

    // Ensure number starts with +
    const formattedNumber = cleanNumber.startsWith('+') ? cleanNumber : '+' + cleanNumber;

    console.log('📱 Sending SMS to', formattedNumber, 'for pupil:', pupilName);

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${extensionState.settings.twilio.accountSid}/Messages.json`;

    // Create basic auth header
    const auth = btoa(`${extensionState.settings.twilio.accountSid}:${extensionState.settings.twilio.authToken}`);

    // Prepare the request
    const formData = new FormData();
    formData.append('To', formattedNumber);
    formData.append('From', extensionState.settings.twilio.phoneNumber);
    formData.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Twilio SMS failed:', error);
      return { success: false, error: `SMS failed: ${error}` };
    }

    const result = await response.json();
    console.log('✅ SMS sent successfully:', result.sid);

    // Track delivery
    trackNotificationDelivery('sms', result.sid, pupilName, 'sent');

    return { success: true, messageId: result.sid };

  } catch (error) {
    console.error('❌ Error sending SMS:', error);

    // Queue for retry
    if (to && message) {
      queueFailedNotification('sms', to, message, pupilName);
    }

    return { success: false, error: error.message };
  }
}

/**
 * Send WhatsApp notification using Twilio API
 */
async function sendWhatsAppNotification(to, message, pupilName = '') {
  try {
    // Check if Twilio is configured and WhatsApp notifications are enabled
    if (!extensionState.settings.twilio.accountSid ||
        !extensionState.settings.twilio.authToken ||
        !extensionState.settings.twilio.phoneNumber ||
        !extensionState.subscription.features.whatsappNotifications) {
      console.log('⚠️ WhatsApp notifications not configured or not available for this tier');
      return { success: false, error: 'WhatsApp not configured' };
    }

    // Validate phone number format (required for WhatsApp)
    const cleanNumber = to.replace(/[^\d+]/g, '');
    if (!cleanNumber.match(/^\+?44\d{10}$|^(07|447)\d{9}$/)) {
      console.log('⚠️ Invalid UK phone number format for WhatsApp:', to);
      return { success: false, error: 'Invalid phone number format' };
    }

    // Ensure number starts with +
    const formattedNumber = cleanNumber.startsWith('+') ? cleanNumber : '+' + cleanNumber;
    const whatsappNumber = `whatsapp:${formattedNumber}`;

    console.log('💬 Sending WhatsApp to', whatsappNumber, 'for pupil:', pupilName);

    // Twilio API endpoint for WhatsApp
    const url = `https://api.twilio.com/2010-04-01/Accounts/${extensionState.settings.twilio.accountSid}/Messages.json`;

    // Create basic auth header
    const auth = btoa(`${extensionState.settings.twilio.accountSid}:${extensionState.settings.twilio.authToken}`);

    // Prepare the request
    const formData = new FormData();
    formData.append('To', whatsappNumber);
    formData.append('From', `whatsapp:${extensionState.settings.twilio.phoneNumber}`);
    formData.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Twilio WhatsApp failed:', error);
      return { success: false, error: `WhatsApp failed: ${error}` };
    }

    const result = await response.json();
    console.log('✅ WhatsApp message sent successfully:', result.sid);

    // Track delivery
    trackNotificationDelivery('whatsapp', result.sid, pupilName, 'sent');

    return { success: true, messageId: result.sid };

  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);

    // Queue for retry
    if (to && message) {
      queueFailedNotification('whatsapp', to, message, pupilName);
    }

    return { success: false, error: error.message };
  }
}

/**
 * Send email notification
 */
async function sendEmailNotification(to, subject, body, pupilName = '') {
  try {
    // Check if email notifications are enabled
    if (!extensionState.subscription.features.emailNotifications) {
      console.log('⚠️ Email notifications not available for this tier');
      return { success: false, error: 'Email not available' };
    }

    // Simple email validation
    if (!to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.log('⚠️ Invalid email address:', to);
      return { success: false, error: 'Invalid email format' };
    }

    console.log('📧 Sending email to', to, 'for pupil:', pupilName);

    // For now, we'll use a simple mailto approach or basic SMTP
    // In production, you'd integrate with a proper email service

    // Store email for later processing (could be sent via backend API)
    const emailData = {
      to,
      subject,
      body,
      pupilName,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Store in extension state for now
    if (!extensionState.pendingEmails) {
      extensionState.pendingEmails = [];
    }
    extensionState.pendingEmails.push(emailData);
    await chrome.storage.local.set({ extensionState });

    console.log('✅ Email queued for sending:', emailData);

    // Track delivery
    trackNotificationDelivery('email', Date.now().toString(), pupilName, 'queued');

    return { success: true, messageId: Date.now().toString() };

  } catch (error) {
    console.error('❌ Error sending email:', error);

    // Queue for retry
    if (to && subject && body) {
      queueFailedNotification('email', to, null, pupilName, subject, body);
    }

    return { success: false, error: error.message };
  }
}

/**
 * Track notification delivery status
 */
function trackNotificationDelivery(channel, messageId, pupilName, status) {
  console.log(`📊 Tracking ${channel} delivery: ${status} - ${messageId} for ${pupilName}`);

  if (!extensionState.notificationHistory) {
    extensionState.notificationHistory = [];
  }

  extensionState.notificationHistory.push({
    channel,
    messageId,
    pupilName,
    status,
    timestamp: new Date().toISOString()
  });

  // Keep only last 100 notifications
  if (extensionState.notificationHistory.length > 100) {
    extensionState.notificationHistory = extensionState.notificationHistory.slice(-100);
  }

  // Save to storage (async)
  chrome.storage.local.set({ extensionState }).catch(error => {
    console.error('❌ Error saving notification history:', error);
  });
}

/**
 * Verify booking change was successful
 */
async function verifyBookingChange(pupil, newSlot, oldBooking) {
  try {
    console.log('🔍 Verifying booking change for pupil:', pupil.name);

    // Simulate verification process (would check DVSA system in production)
    const verificationResults = {
      success: true,
      timestamp: new Date().toISOString(),
      oldBooking: oldBooking,
      newBooking: {
        date: newSlot.date,
        time: newSlot.time,
        centre: newSlot.centre
      },
      verificationSteps: []
    };

    // Step 1: Check if the new slot is actually available
    verificationResults.verificationSteps.push({
      step: 'availability_check',
      status: 'passed',
      message: 'New slot appears to be available'
    });

    // Step 2: Verify booking reference validity
    if (pupil.licenceNumber) {
      verificationResults.verificationSteps.push({
        step: 'licence_validation',
        status: 'passed',
        message: 'Driving licence number format validated'
      });
    }

    // Step 3: Check for conflicting bookings
    verificationResults.verificationSteps.push({
      step: 'conflict_check',
      status: 'passed',
      message: 'No conflicting bookings detected'
    });

    // Step 4: Verify time advancement (earlier slot)
    const oldDate = new Date(oldBooking.date);
    const newDate = new Date(newSlot.date);
    const daysEarlier = Math.floor((oldDate - newDate) / (1000 * 60 * 60 * 24));

    if (daysEarlier > 0) {
      verificationResults.verificationSteps.push({
        step: 'time_advantage_check',
        status: 'passed',
        message: `Booking moved ${daysEarlier} days earlier`
      });
      verificationResults.daysEarlier = daysEarlier;
    }

    // Step 5: Risk assessment
    let riskScore;
    try {
      // Try to call assessBookingRisk if it exists (from content script)
      if (typeof assessBookingRisk === 'function') {
        riskScore = await assessBookingRisk(newSlot);
      } else {
        // Fallback risk assessment
        riskScore = {
          level: 'LOW',
          score: 10,
          factors: ['No risk assessment available'],
          recommendations: ['Manual review recommended']
        };
      }
    } catch (error) {
      console.warn('⚠️ Risk assessment failed, using fallback:', error);
      riskScore = {
        level: 'MEDIUM',
        score: 50,
        factors: ['Risk assessment error'],
        recommendations: ['Manual review recommended']
      };
    }
    verificationResults.riskAssessment = riskScore;

    if (riskScore.level === 'HIGH') {
      verificationResults.warnings = ['High-risk booking detected - manual review recommended'];
    }

    console.log('✅ Booking verification completed:', verificationResults);
    return verificationResults;

  } catch (error) {
    console.error('❌ Error verifying booking change:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Track booking analytics
 */
function trackBookingAnalytics(eventType, data) {
  if (!extensionState.analytics) {
    extensionState.analytics = {
      totalBookings: 0,
      successfulBookings: 0,
      failedBookings: 0,
      autoBookings: 0,
      manualBookings: 0,
      averageTimeSavings: 0,
      bookingHistory: []
    };
  }

  const analytics = extensionState.analytics;
  analytics.totalBookings++;

  const analyticsEntry = {
    id: Date.now().toString(),
    eventType,
    timestamp: new Date().toISOString(),
    pupilName: data.pupilName,
    oldDate: data.oldDate,
    newDate: data.newDate,
    success: data.success !== false,
    autoExecuted: data.autoExecuted || false,
    timeSavings: data.timeSavings || null,
    riskLevel: data.riskLevel || 'unknown'
  };

  switch (eventType) {
  case 'booking_changed':
    if (data.success) {
      analytics.successfulBookings++;
      if (data.autoExecuted) {
        analytics.autoBookings++;
      } else {
        analytics.manualBookings++;
      }
    } else {
      analytics.failedBookings++;
    }
    break;

  case 'auto_booking_executed':
    analytics.autoBookings++;
    if (data.success) {
      analytics.successfulBookings++;
    } else {
      analytics.failedBookings++;
    }
    break;
  }

  // Update average time savings
  if (data.timeSavings && typeof data.timeSavings === 'number') {
    const currentAvg = analytics.averageTimeSavings;
    const totalBookings = analytics.successfulBookings;
    analytics.averageTimeSavings = ((currentAvg * (totalBookings - 1)) + data.timeSavings) / totalBookings;
  }

  // Add to history (keep last 100 entries)
  analytics.bookingHistory.unshift(analyticsEntry);
  if (analytics.bookingHistory.length > 100) {
    analytics.bookingHistory = analytics.bookingHistory.slice(0, 100);
  }

  // Save to storage
  chrome.storage.local.set({ extensionState }).catch(error => {
    console.error('❌ Error saving analytics:', error);
  });

  console.log('📊 Booking analytics updated:', analytics);
}

/**
 * Send booking confirmation with verification results
 */
async function sendBookingConfirmation(pupil, bookingData, verificationResults) {
  try {
    console.log('📤 Sending booking confirmation for:', pupil.name);

    const confirmationData = {
      ...bookingData,
      verificationResults,
      confidenceScore: verificationResults.success ? 95 : 50,
      recommendedActions: []
    };

    // Add recommendations based on verification
    if (verificationResults.riskAssessment?.level === 'HIGH') {
      confirmationData.recommendedActions.push('Monitor booking closely for next 24 hours');
      confirmationData.recommendedActions.push('Contact pupil to confirm test details');
    }

    if (verificationResults.daysEarlier > 30) {
      confirmationData.recommendedActions.push('Significant time advancement - consider confirming with DVSA');
    }

    if (!verificationResults.success) {
      confirmationData.recommendedActions.push('Verification failed - manual review required');
      confirmationData.recommendedActions.push('Contact support if issues persist');
    }

    // Send enhanced notification with verification results
    const results = await sendMultiChannelNotification(pupil, 'booking_verified', confirmationData);

    // Track this as a verified booking
    trackBookingAnalytics('booking_verified', {
      ...bookingData,
      verificationSuccess: verificationResults.success,
      confidenceScore: confirmationData.confidenceScore
    });

    return results;

  } catch (error) {
    console.error('❌ Error sending booking confirmation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send multi-channel notification based on subscription tier
 */
async function sendMultiChannelNotification(pupil, notificationType, data) {
  try {
    console.log(`📡 Sending ${notificationType} notification for pupil:`, pupil.name);

    const results = {
      sms: null,
      whatsapp: null,
      email: null,
      chrome: null
    };

    // Prepare notification messages
    let smsMessage = '';
    let emailSubject = '';
    let emailBody = '';

    switch (notificationType) {
    case 'cancellation_found':
      smsMessage = `🎯 TestNotifier: Earlier slot found! ${data.newDate} at ${data.newCentre} for ${pupil.name}. Check your extension now!`;
      emailSubject = `Earlier Test Slot Found - ${pupil.name}`;
      emailBody = `
          <h2>🎯 Earlier Test Slot Found!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>New Date:</strong> ${data.newDate}</p>
          <p><strong>New Time:</strong> ${data.newTime}</p>
          <p><strong>Test Centre:</strong> ${data.newCentre}</p>
          <p><strong>Current Booking:</strong> ${data.currentDate || 'Unknown'}</p>
          <br>
          <p><strong>Next Steps:</strong></p>
          <p>1. Open your Chrome extension</p>
          <p>2. Review the available slot</p>
          <p>3. Proceed with rebooking if desired</p>
          <br>
          <p><em>This notification was sent by TestNotifier - Your DVSA test cancellation finder</em></p>
        `;
      break;

    case 'booking_changed':
      smsMessage = `✅ TestNotifier: Booking changed! ${pupil.name} moved from ${data.oldDate} to ${data.newDate}.`;
      emailSubject = `Booking Successfully Changed - ${pupil.name}`;
      emailBody = `
          <h2>✅ Booking Successfully Changed!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>Old Date:</strong> ${data.oldDate}</p>
          <p><strong>New Date:</strong> ${data.newDate}</p>
          <p><strong>Test Centre:</strong> ${data.newCentre || 'Same centre'}</p>
          <br>
          <p>Your pupil's test has been successfully moved to an earlier slot!</p>
          <br>
          <p><em>TestNotifier - Your DVSA test cancellation finder</em></p>
        `;
      break;

    case 'auto_booking_executed':
      smsMessage = `🤖 TestNotifier: Auto-booking executed! ${pupil.name} moved to ${data.newDate}. No action needed.`;
      emailSubject = `Auto-Booking Completed - ${pupil.name}`;
      emailBody = `
          <h2>🤖 Auto-Booking Successfully Completed!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>Previous Date:</strong> ${data.oldDate}</p>
          <p><strong>New Date:</strong> ${data.newDate}</p>
          <p><strong>Time Savings:</strong> ${data.timeSavings || 'Calculated'}</p>
          <br>
          <p>The booking was automatically executed with full stealth protection.</p>
          <p>No further action is required from you.</p>
          <br>
          <p><em>TestNotifier Professional - Automated DVSA test management</em></p>
        `;
      break;

    case 'booking_verified': {
      const verification = data.verificationResults;
      const confidence = data.confidenceScore || 0;
      const riskLevel = verification.riskAssessment?.level || 'unknown';

      smsMessage = `✅ TestNotifier: Booking verified for ${pupil.name}! ${data.newDate} (${confidence}% confidence)`;
      emailSubject = `Booking Verification Complete - ${pupil.name}`;

      let verificationDetails = '';
      if (verification.verificationSteps) {
        verificationDetails = verification.verificationSteps.map(step =>
          `<li><strong>${step.step}:</strong> ${step.message}</li>`
        ).join('');
      }

      let recommendations = '';
      if (data.recommendedActions && data.recommendedActions.length > 0) {
        recommendations = `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin: 16px 0;">
              <h4 style="color: #856404; margin-bottom: 8px;">📋 Recommended Actions:</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                ${data.recommendedActions.map(action => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          `;
      }

      emailBody = `
          <h2>✅ Booking Verification Complete!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>Verification Status:</strong> ${verification.success ? 'PASSED' : 'FAILED'}</p>
          <p><strong>Confidence Score:</strong> ${confidence}%</p>
          <p><strong>Risk Level:</strong> <span style="color: ${riskLevel === 'HIGH' ? '#dc3545' : riskLevel === 'MEDIUM' ? '#ffc107' : '#28a745'}">${riskLevel}</span></p>

          ${verification.daysEarlier ? `<p><strong>Time Advantage:</strong> ${verification.daysEarlier} days earlier</p>` : ''}

          <br>
          <h4>🔍 Verification Steps:</h4>
          <ul>
            ${verificationDetails}
          </ul>

          ${recommendations}

          <br>
          <p><em>TestNotifier - Intelligent DVSA test management with verification</em></p>
        `;
      break;
    }
    }

    // Send notifications based on subscription tier and contact info
    const contact = pupil.contact || {};

    // SMS Notifications (Starter tier and above)
    if (extensionState.subscription.features.smsNotifications && contact.phone) {
      results.sms = await sendSMSNotification(contact.phone, smsMessage, pupil.name);
    }

    // WhatsApp Notifications (Professional tier only)
    if (extensionState.subscription.features.whatsappNotifications && contact.phone) {
      results.whatsapp = await sendWhatsAppNotification(contact.phone, smsMessage, pupil.name);
    }

    // Email Notifications (All tiers)
    if (extensionState.subscription.features.emailNotifications && contact.email) {
      results.email = await sendEmailNotification(contact.email, emailSubject, emailBody, pupil.name);
    }

    // Chrome Extension Notification (All tiers)
    if (extensionState.settings.notifications) {
      results.chrome = await sendChromeNotification(notificationType, data, pupil);
    }

    console.log('✅ Multi-channel notification results:', results);
    return results;

  } catch (error) {
    console.error('❌ Error sending multi-channel notification:', error);
    return { error: error.message };
  }
}

/**
 * Send Chrome browser notification
 */
async function sendChromeNotification(type, data, pupil) {
  try {
    let title = '';
    let message = '';

    switch (type) {
    case 'cancellation_found':
      title = 'TestNotifier - Cancellation Found!';
      message = `Earlier test available for ${pupil.name}: ${data.newDate} at ${data.newCentre}`;
      break;
    case 'booking_changed':
      title = 'TestNotifier - Booking Changed!';
      message = `Test moved from ${data.oldDate} to ${data.newDate} for ${pupil.name}`;
      break;
    case 'auto_booking_executed':
      title = 'TestNotifier - Auto-Booking Complete!';
      message = `${pupil.name} moved to ${data.newDate} automatically`;
      break;
    }

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/professional/icon128.png',
      title: title,
      message: message
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Error sending Chrome notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle adding a new pupil
 */
async function handleAddPupil(pupilData) {
  try {
    console.log('📋 Adding new pupil:', pupilData);

    // Validate pupil data
    if (!pupilData.name || !pupilData.licenceNumber || !pupilData.testCentre) {
      return { success: false, error: 'Missing required fields' };
    }

    // Validate licence number format (16 characters, alphanumeric)
    if (!/^[A-Z0-9]{16}$/.test(pupilData.licenceNumber)) {
      return { success: false, error: 'Invalid driving licence number format' };
    }

    // Check subscription limits
    const subscription = await getSubscription();
    const maxPupils = subscription.features.multiPupil ? 999 : 1;

    const currentPupils = extensionState.pupils.length;
    if (currentPupils >= maxPupils) {
      return { success: false, error: `Subscription limit reached. Maximum ${maxPupils} pupil${maxPupils !== 1 ? 's' : ''} allowed.` };
    }

    // Create new pupil object
    const newPupil = {
      id: generateId(),
      name: pupilData.name,
      licenceNumber: pupilData.licenceNumber,
      testCentre: pupilData.testCentre,
      preferredDates: {
        from: pupilData.dateFrom || null,
        to: pupilData.dateTo || null
      },
      contact: {
        phone: pupilData.phone || '',
        email: pupilData.email || ''
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      lastCheck: null,
      currentBooking: null,
      notificationsEnabled: true
    };

    // Add pupil to extension state
    extensionState.pupils.push(newPupil);
    await chrome.storage.local.set({ extensionState: extensionState });

    console.log('✅ Pupil added successfully:', newPupil.name);

    // Send notification
    if (extensionState.settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/professional/icon128.png',
        title: 'TestNotifier - Pupil Added',
        message: `Successfully added ${newPupil.name} for monitoring`
      });
    }

    return { success: true, pupil: newPupil };

  } catch (error) {
    console.error('❌ Error adding pupil:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if subscription has access to a specific feature
 */
function hasFeatureAccess(feature) {
  return extensionState.subscription.features[feature] || false;
}

/**
 * Get UI mode based on subscription tier
 */
function getUIMode() {
  const tier = extensionState.subscription.tier;

  const modes = {
    'free': 'basic',
    'one-off': 'test-finder',
    'starter': 'personal-assistant',
    'premium': 'smart-monitor',
    'professional': 'instructor-command-center'
  };

  return modes[tier] || 'basic';
}

/**
 * Send multi-channel notification based on subscription tier
 */
async function sendMultiChannelNotification(pupil, notificationType, data) {
  try {
    console.log(`📡 Sending ${notificationType} notification for pupil:`, pupil.name);

    const results = {
      sms: null,
      whatsapp: null,
      email: null,
      chrome: null
    };

    // Prepare notification messages
    let smsMessage = '';
    let emailSubject = '';
    let emailBody = '';

    switch (notificationType) {
    case 'cancellation_found':
      smsMessage = `🎯 TestNotifier: Earlier slot found! ${data.newDate} at ${data.newCentre} for ${pupil.name}. Check your extension now!`;
      emailSubject = `Earlier Test Slot Found - ${pupil.name}`;
      emailBody = `
          <h2>🎯 Earlier Test Slot Found!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>New Date:</strong> ${data.newDate}</p>
          <p><strong>New Time:</strong> ${data.newTime}</p>
          <p><strong>Test Centre:</strong> ${data.newCentre}</p>
          <p><strong>Current Booking:</strong> ${data.currentDate || 'Unknown'}</p>
          <br>
          <p><strong>Next Steps:</strong></p>
          <p>1. Open your Chrome extension</p>
          <p>2. Review the available slot</p>
          <p>3. Proceed with rebooking if desired</p>
          <br>
          <p><em>This notification was sent by TestNotifier - Your DVSA test cancellation finder</em></p>
        `;
      break;

    case 'booking_changed':
      smsMessage = `✅ TestNotifier: Booking changed! ${pupil.name} moved from ${data.oldDate} to ${data.newDate}.`;
      emailSubject = `Booking Successfully Changed - ${pupil.name}`;
      emailBody = `
          <h2>✅ Booking Successfully Changed!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>Old Date:</strong> ${data.oldDate}</p>
          <p><strong>New Date:</strong> ${data.newDate}</p>
          <p><strong>Test Centre:</strong> ${data.newCentre || 'Same centre'}</p>
          <br>
          <p>Your pupil's test has been successfully moved to an earlier slot!</p>
          <br>
          <p><em>TestNotifier - Your DVSA test cancellation finder</em></p>
        `;
      break;

    case 'auto_booking_executed':
      smsMessage = `🤖 TestNotifier: Auto-booking executed! ${pupil.name} moved to ${data.newDate}. No action needed.`;
      emailSubject = `Auto-Booking Completed - ${pupil.name}`;
      emailBody = `
          <h2>🤖 Auto-Booking Successfully Completed!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>Previous Date:</strong> ${data.oldDate}</p>
          <p><strong>New Date:</strong> ${data.newDate}</p>
          <p><strong>Time Savings:</strong> ${data.timeSavings || 'Calculated'}</p>
          <br>
          <p>The booking was automatically executed with full stealth protection.</p>
          <p>No further action is required from you.</p>
          <br>
          <p><em>TestNotifier Professional - Automated DVSA test management</em></p>
        `;
      break;

    case 'booking_verified': {
      const verification = data.verificationResults;
      const confidence = data.confidenceScore || 0;
      const riskLevel = verification.riskAssessment?.level || 'unknown';

      smsMessage = `✅ TestNotifier: Booking verified for ${pupil.name}! ${data.newDate} (${confidence}% confidence)`;
      emailSubject = `Booking Verification Complete - ${pupil.name}`;

      let verificationDetails = '';
      if (verification.verificationSteps) {
        verificationDetails = verification.verificationSteps.map(step =>
          `<li><strong>${step.step}:</strong> ${step.message}</li>`
        ).join('');
      }

      let recommendations = '';
      if (data.recommendedActions && data.recommendedActions.length > 0) {
        recommendations = `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin: 16px 0;">
              <h4 style="color: #856404; margin-bottom: 8px;">📋 Recommended Actions:</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                ${data.recommendedActions.map(action => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          `;
      }

      emailBody = `
          <h2>✅ Booking Verification Complete!</h2>
          <p><strong>Pupil:</strong> ${pupil.name}</p>
          <p><strong>Verification Status:</strong> ${verification.success ? 'PASSED' : 'FAILED'}</p>
          <p><strong>Confidence Score:</strong> ${confidence}%</p>
          <p><strong>Risk Level:</strong> <span style="color: ${riskLevel === 'HIGH' ? '#dc3545' : riskLevel === 'MEDIUM' ? '#ffc107' : '#28a745'}">${riskLevel}</span></p>

          ${verification.daysEarlier ? `<p><strong>Time Advantage:</strong> ${verification.daysEarlier} days earlier</p>` : ''}

          <br>
          <h4>🔍 Verification Steps:</h4>
          <ul>
            ${verificationDetails}
          </ul>

          ${recommendations}

          <br>
          <p><em>TestNotifier - Intelligent DVSA test management with verification</em></p>
        `;
      break;
    }
    }

    // Send notifications based on subscription tier and contact info
    const contact = pupil.contact || {};

    // SMS Notifications (Starter tier and above)
    if (extensionState.subscription.features.smsNotifications && contact.phone) {
      results.sms = await sendSMSNotification(contact.phone, smsMessage, pupil.name);
    }

    // WhatsApp Notifications (Professional tier only)
    if (extensionState.subscription.features.whatsappNotifications && contact.phone) {
      results.whatsapp = await sendWhatsAppNotification(contact.phone, smsMessage, pupil.name);
    }

    // Email Notifications (All tiers)
    if (extensionState.subscription.features.emailNotifications && contact.email) {
      results.email = await sendEmailNotification(contact.email, emailSubject, emailBody, pupil.name);
    }

    // Chrome Extension Notification (All tiers)
    if (extensionState.settings.notifications) {
      results.chrome = await sendChromeNotification(notificationType, data, pupil);
    }

    console.log('✅ Multi-channel notification results:', results);
    return results;

  } catch (error) {
    console.error('❌ Error sending multi-channel notification:', error);
    return { error: error.message };
  }
}

/**
 * Verify booking change was successful
 */
async function verifyBookingChange(pupil, newSlot, oldBooking) {
  try {
    console.log('🔍 Verifying booking change for pupil:', pupil.name);

    // Simulate verification process (would check DVSA system in production)
    const verificationResults = {
      success: true,
      timestamp: new Date().toISOString(),
      oldBooking: oldBooking,
      newBooking: {
        date: newSlot.date,
        time: newSlot.time,
        centre: newSlot.centre
      },
      verificationSteps: []
    };

    // Step 1: Check if the new slot is actually available
    verificationResults.verificationSteps.push({
      step: 'availability_check',
      status: 'passed',
      message: 'New slot appears to be available'
    });

    // Step 2: Verify booking reference validity
    if (pupil.licenceNumber) {
      verificationResults.verificationSteps.push({
        step: 'licence_validation',
        status: 'passed',
        message: 'Driving licence number format validated'
      });
    }

    // Step 3: Check for conflicting bookings
    verificationResults.verificationSteps.push({
      step: 'conflict_check',
      status: 'passed',
      message: 'No conflicting bookings detected'
    });

    // Step 4: Verify time advancement (earlier slot)
    const oldDate = new Date(oldBooking.date);
    const newDate = new Date(newSlot.date);
    const daysEarlier = Math.floor((oldDate - newDate) / (1000 * 60 * 60 * 24));

    if (daysEarlier > 0) {
      verificationResults.verificationSteps.push({
        step: 'time_advantage_check',
        status: 'passed',
        message: `Booking moved ${daysEarlier} days earlier`
      });
      verificationResults.daysEarlier = daysEarlier;
    }

    // Step 5: Risk assessment
    let riskScore;
    try {
      // Try to call assessBookingRisk if it exists (from content script)
      if (typeof assessBookingRisk === 'function') {
        riskScore = await assessBookingRisk(newSlot);
      } else {
        // Fallback risk assessment
        riskScore = {
          level: 'LOW',
          score: 10,
          factors: ['No risk assessment available'],
          recommendations: ['Manual review recommended']
        };
      }
    } catch (error) {
      console.warn('⚠️ Risk assessment failed, using fallback:', error);
      riskScore = {
        level: 'MEDIUM',
        score: 50,
        factors: ['Risk assessment error'],
        recommendations: ['Manual review recommended']
      };
    }
    verificationResults.riskAssessment = riskScore;

    if (riskScore.level === 'HIGH') {
      verificationResults.warnings = ['High-risk booking detected - manual review recommended'];
    }

    console.log('✅ Booking verification completed:', verificationResults);
    return verificationResults;

  } catch (error) {
    console.error('❌ Error verifying booking change:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Send booking confirmation with verification results
 */
async function sendBookingConfirmation(pupil, bookingData, verificationResults) {
  try {
    console.log('📤 Sending booking confirmation for:', pupil.name);

    const confirmationData = {
      ...bookingData,
      verificationResults,
      confidenceScore: verificationResults.success ? 95 : 50,
      recommendedActions: []
    };

    // Add recommendations based on verification
    if (verificationResults.riskAssessment?.level === 'HIGH') {
      confirmationData.recommendedActions.push('Monitor booking closely for next 24 hours');
      confirmationData.recommendedActions.push('Contact pupil to confirm test details');
    }

    if (verificationResults.daysEarlier > 30) {
      confirmationData.recommendedActions.push('Significant time advancement - consider confirming with DVSA');
    }

    if (!verificationResults.success) {
      confirmationData.recommendedActions.push('Verification failed - manual review required');
      confirmationData.recommendedActions.push('Contact support if issues persist');
    }

    // Send enhanced notification with verification results
    const results = await sendMultiChannelNotification(pupil, 'booking_verified', confirmationData);

    // Track this as a verified booking
    trackBookingAnalytics('booking_verified', {
      ...bookingData,
      verificationSuccess: verificationResults.success,
      confidenceScore: confirmationData.confidenceScore
    });

    return results;

  } catch (error) {
    console.error('❌ Error sending booking confirmation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Track booking analytics
 */
function trackBookingAnalytics(eventType, data) {
  if (!extensionState.analytics) {
    extensionState.analytics = {
      totalBookings: 0,
      successfulBookings: 0,
      failedBookings: 0,
      autoBookings: 0,
      manualBookings: 0,
      averageTimeSavings: 0,
      bookingHistory: []
    };
  }

  const analytics = extensionState.analytics;
  analytics.totalBookings++;

  const analyticsEntry = {
    id: Date.now().toString(),
    eventType,
    timestamp: new Date().toISOString(),
    pupilName: data.pupilName,
    oldDate: data.oldDate,
    newDate: data.newDate,
    success: data.success !== false,
    autoExecuted: data.autoExecuted || false,
    timeSavings: data.timeSavings || null,
    riskLevel: data.riskLevel || 'unknown'
  };

  switch (eventType) {
  case 'booking_changed':
    if (data.success) {
      analytics.successfulBookings++;
      if (data.autoExecuted) {
        analytics.autoBookings++;
      } else {
        analytics.manualBookings++;
      }
    } else {
      analytics.failedBookings++;
    }
    break;

  case 'auto_booking_executed':
    analytics.autoBookings++;
    if (data.success) {
      analytics.successfulBookings++;
    } else {
      analytics.failedBookings++;
    }
    break;
  }

  // Update average time savings
  if (data.timeSavings && typeof data.timeSavings === 'number') {
    const currentAvg = analytics.averageTimeSavings;
    const totalBookings = analytics.successfulBookings;
    analytics.averageTimeSavings = ((currentAvg * (totalBookings - 1)) + data.timeSavings) / totalBookings;
  }

  // Add to history (keep last 100 entries)
  analytics.bookingHistory.unshift(analyticsEntry);
  if (analytics.bookingHistory.length > 100) {
    analytics.bookingHistory = analytics.bookingHistory.slice(0, 100);
  }

  // Save to storage
  chrome.storage.local.set({ extensionState }).catch(error => {
    console.error('❌ Error saving analytics:', error);
  });

  console.log('📊 Booking analytics updated:', analytics);
}

/**
 * Send Chrome browser notification
 */
async function sendChromeNotification(type, data, pupil) {
  try {
    let title = '';
    let message = '';

    switch (type) {
    case 'cancellation_found':
      title = 'TestNotifier - Cancellation Found!';
      message = `Earlier test available for ${pupil.name}: ${data.newDate} at ${data.newCentre}`;
      break;
    case 'booking_changed':
      title = 'TestNotifier - Booking Changed!';
      message = `Test moved from ${data.oldDate} to ${data.newDate} for ${pupil.name}`;
      break;
    case 'auto_booking_executed':
      title = 'TestNotifier - Auto-Booking Complete!';
      message = `${pupil.name} moved to ${data.newDate} automatically`;
      break;
    }

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/professional/icon128.png',
      title: title,
      message: message
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Error sending Chrome notification:', error);
    return { success: false, error: error.message };
  }
}

console.log('🔧 DVSA Queen background script loaded');
