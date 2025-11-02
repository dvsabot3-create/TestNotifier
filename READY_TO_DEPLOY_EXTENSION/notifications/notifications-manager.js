/**
 * TestNotifier Notifications Manager
 * 
 * Multi-Channel Notification System:
 * - Email (All tiers)
 * - SMS via Twilio (Starter/Premium/Professional)
 * - WhatsApp Business API (Professional only)
 * - Browser notifications (All tiers)
 * 
 * Features:
 * - Subscription tier validation
 * - Backend API integration
 * - Retry logic with exponential backoff
 * - Delivery tracking
 * - Error handling
 */

class NotificationsManager {
  constructor() {
    this.backendURL = 'https://testnotifier.co.uk';
    this.retryAttempts = 3;
    this.retryDelays = [2000, 4000, 8000]; // 2min, 4min, 8min in milliseconds
    
    // Subscription tier capabilities
    this.tierCapabilities = {
      'one-off': {
        email: true,
        sms: false,
        whatsapp: false,
        browser: true
      },
      'starter': {
        email: true,
        sms: true,
        whatsapp: false,
        browser: true
      },
      'premium': {
        email: true,
        sms: true,
        whatsapp: false,
        browser: true
      },
      'professional': {
        email: true,
        sms: true,
        whatsapp: true,
        browser: true
      }
    };
  }

  /**
   * Send slot found notification across all enabled channels
   */
  async sendSlotFoundNotification(monitor, slot, subscription) {
    console.log('📢 Sending slot found notification for', monitor.name);
    
    const results = {
      browser: false,
      email: false,
      sms: false,
      whatsapp: false,
      errors: []
    };
    
    // Determine which channels to use
    const channels = this.getAvailableChannels(monitor, subscription);
    
    // Browser notification (always for all tiers)
    if (channels.includes('browser')) {
      try {
        results.browser = await this.sendBrowserNotification(monitor, slot);
      } catch (error) {
        results.errors.push({ channel: 'browser', error: error.message });
      }
    }
    
    // Backend notifications (Email/SMS/WhatsApp)
    if (channels.includes('email') || channels.includes('sms') || channels.includes('whatsapp')) {
      try {
        const backendResult = await this.sendBackendNotifications(monitor, slot, channels);
        results.email = backendResult.email;
        results.sms = backendResult.sms;
        results.whatsapp = backendResult.whatsapp;
      } catch (error) {
        results.errors.push({ channel: 'backend', error: error.message });
      }
    }
    
    return results;
  }

  /**
   * Get available notification channels based on subscription tier and user preferences
   */
  getAvailableChannels(monitor, subscription) {
    const channels = [];
    const tier = subscription?.tier || 'one-off';
    const capabilities = this.tierCapabilities[tier] || this.tierCapabilities['one-off'];
    
    // Check each channel
    if (monitor.notifications?.browser) {
      channels.push('browser');
    }
    
    if (monitor.notifications?.email && capabilities.email) {
      channels.push('email');
    }
    
    if (monitor.notifications?.sms && capabilities.sms) {
      channels.push('sms');
    }
    
    if (monitor.notifications?.whatsapp && capabilities.whatsapp) {
      channels.push('whatsapp');
    }
    
    console.log('📬 Available channels:', channels);
    return channels;
  }

  /**
   * Send browser notification
   */
  async sendBrowserNotification(monitor, slot) {
    return new Promise((resolve, reject) => {
      try {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '../icons/icon128.png',
          title: `🎉 Slot Found for ${monitor.name}!`,
          message: `${slot.date} at ${slot.time}\n${slot.centre}`,
          requireInteraction: true,
          priority: 2,
          buttons: [
            { title: '🚀 Book Now' },
            { title: 'View Details' }
          ]
        }, (notificationId) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            console.log('✅ Browser notification sent:', notificationId);
            resolve(true);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send backend notifications (Email/SMS/WhatsApp)
   */
  async sendBackendNotifications(monitor, slot, channels) {
    const authToken = await this.getAuthToken();
    
    if (!authToken) {
      throw new Error('Not authenticated. Please sign in to send notifications.');
    }
    
    const payload = {
      type: 'slot_found',
      monitorId: monitor.id,
      studentName: monitor.name,
      email: monitor.email,
      phone: monitor.phone,
      slot: {
        date: slot.date,
        time: slot.time,
        centre: slot.centre
      },
      channels: channels.filter(c => c !== 'browser'),
      subscription: {
        tier: monitor.subscriptionTier || 'premium'
      }
    };
    
    // Attempt with retry logic
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.backendURL}/api/notifications/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Backend notifications sent:', result);
          return {
            email: result.sent?.includes('email') || false,
            sms: result.sent?.includes('sms') || false,
            whatsapp: result.sent?.includes('whatsapp') || false
          };
        } else {
          const error = await response.text();
          console.error(`❌ Backend notification failed (attempt ${attempt + 1}):`, error);
          
          if (attempt < this.retryAttempts - 1) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, this.retryDelays[attempt]));
          } else {
            throw new Error(`Failed after ${this.retryAttempts} attempts: ${error}`);
          }
        }
      } catch (error) {
        console.error(`❌ Network error (attempt ${attempt + 1}):`, error);
        
        if (attempt < this.retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelays[attempt]));
        } else {
          throw error;
        }
      }
    }
    
    return { email: false, sms: false, whatsapp: false };
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(monitor, bookingDetails, subscription) {
    console.log('📧 Sending booking confirmation for', monitor.name);
    
    const channels = this.getAvailableChannels(monitor, subscription);
    
    try {
      // Browser notification
      if (channels.includes('browser')) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '../icons/icon128.png',
          title: `✅ Booking Confirmed for ${monitor.name}!`,
          message: `Test booked for ${bookingDetails.date} at ${bookingDetails.time}`,
          priority: 2
        });
      }
      
      // Backend notifications
      if (channels.some(c => ['email', 'sms', 'whatsapp'].includes(c))) {
        const authToken = await this.getAuthToken();
        
        await fetch(`${this.backendURL}/api/notifications/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'booking_confirmed',
            monitorId: monitor.id,
            studentName: monitor.name,
            email: monitor.email,
            phone: monitor.phone,
            bookingDetails: bookingDetails,
            channels: channels.filter(c => c !== 'browser')
          })
        });
      }
      
      console.log('✅ Booking confirmation sent');
    } catch (error) {
      console.error('❌ Failed to send booking confirmation:', error);
    }
  }

  /**
   * Get auth token from storage
   */
  async getAuthToken() {
    try {
      const result = await chrome.storage.local.get(['authToken']);
      return result.authToken || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Validate notification preferences against subscription tier
   */
  validateNotificationPreferences(notifications, tier) {
    const capabilities = this.tierCapabilities[tier] || this.tierCapabilities['one-off'];
    
    return {
      email: notifications.email && capabilities.email,
      sms: notifications.sms && capabilities.sms,
      whatsapp: notifications.whatsapp && capabilities.whatsapp,
      browser: notifications.browser // Always available
    };
  }

  /**
   * Get notification status text
   */
  getNotificationStatusText(tier) {
    const capabilities = this.tierCapabilities[tier];
    if (!capabilities) return 'Browser only';
    
    const enabled = [];
    if (capabilities.email) enabled.push('Email');
    if (capabilities.sms) enabled.push('SMS');
    if (capabilities.whatsapp) enabled.push('WhatsApp');
    
    return enabled.length > 0 ? enabled.join(' + ') : 'Browser only';
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationsManager;
}

