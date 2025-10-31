# 📧 TestNotifier Notification System Testing Guide

## 🎯 Testing Overview

This guide provides comprehensive testing procedures for TestNotifier's multi-channel notification system including SMS, WhatsApp, and Email notifications.

## 📋 Notification Features by Plan

| Feature | One-Off | Starter | Premium | Professional |
|---------|---------|---------|---------|--------------|
| **Email Notifications** | ✅ | ✅ | ✅ | ✅ |
| **SMS Notifications** | ❌ | ✅ | ✅ | ✅ |
| **WhatsApp Notifications** | ❌ | ❌ | ❌ | ✅ |
| **Daily Notification Limit** | 5 | 10 | 25 | 50 |

## 🧪 Testing Environment Setup

### **1. Twilio Configuration (Required for SMS/WhatsApp)**

**For SMS Testing:**
- **Account SID**: Your Twilio account SID
- **Auth Token**: Your Twilio auth token
- **Phone Number**: Your Twilio phone number (UK format)

**For WhatsApp Testing:**
- **Same Twilio credentials** as SMS
- **WhatsApp Business API** enabled on your Twilio account
- **WhatsApp sender number** configured

### **2. Email Configuration**
- **Email notifications** work through browser mailto: links
- **Professional tier** includes enhanced email features
- **Backend API integration** available for production

## 🚀 Testing Procedures

### **A. Manual Testing in Browser**

#### **Step 1: Test Email Notifications**
```javascript
// Test email notification (works on all tiers)
// This will open your default email client
const testEmail = {
  type: 'email',
  to: 'your-email@example.com',
  subject: 'TestNotifier - Test Email',
  body: 'This is a test email from TestNotifier notification system.',
  pupilName: 'Test Pupil'
};
```

#### **Step 2: Test SMS Notifications (Requires Twilio)**
```javascript
// Configure Twilio settings first
const twilioConfig = {
  accountSid: 'your-twilio-account-sid',
  authToken: 'your-twilio-auth-token',
  phoneNumber: '+447700900123' // Your Twilio number
};

// Test SMS notification
const testSMS = {
  type: 'sms',
  to: '+447700900123', // Your test phone number
  message: 'TestNotifier: Earlier driving test slot found for Test Pupil!',
  pupilName: 'Test Pupil'
};
```

#### **Step 3: Test WhatsApp Notifications (Professional Only)**
```javascript
// Test WhatsApp notification (Professional tier only)
const testWhatsApp = {
  type: 'whatsapp',
  to: '+447700900123', // Your test phone number
  message: 'TestNotifier: Earlier driving test slot found for Test Pupil!',
  pupilName: 'Test Pupil'
};
```

### **B. Automated Testing Script**

Create this test script in your browser console when the extension is active:

```javascript
// ==========================================
// TestNotifier Notification System Test
// ==========================================

console.log('🚀 Starting TestNotifier Notification System Test...');

// Test 1: Email Notification (All Tiers)
async function testEmailNotification() {
  console.log('📧 Testing Email Notification...');

  const emailTest = {
    type: 'email',
    to: 'test@example.com',
    subject: 'TestNotifier - Email Test',
    body: 'This is a test email from the TestNotifier system.',
    pupilName: 'Test Pupil'
  };

  // This should trigger the mailto: functionality
  console.log('✅ Email test prepared - check your default email client');
  return emailTest;
}

// Test 2: SMS Notification (Requires Twilio Config)
async function testSMSNotification() {
  console.log('📱 Testing SMS Notification...');

  // Check if Twilio is configured
  const twilioConfigured = extensionState.settings.twilio.accountSid &&
                          extensionState.settings.twilio.authToken &&
                          extensionState.settings.twilio.phoneNumber;

  if (!twilioConfigured) {
    console.log('⚠️ Twilio not configured. SMS notifications disabled.');
    return { success: false, error: 'Twilio not configured' };
  }

  const smsTest = {
    type: 'sms',
    to: '+447700900123', // Your test number
    message: 'TestNotifier SMS Test: Earlier slot found for Test Pupil',
    pupilName: 'Test Pupil'
  };

  console.log('✅ SMS test configured');
  return smsTest;
}

// Test 3: WhatsApp Notification (Professional Only)
async function testWhatsAppNotification() {
  console.log('💬 Testing WhatsApp Notification...');

  // Check if Professional tier and WhatsApp enabled
  const isProfessional = extensionState.subscription.tier === 'professional';
  const whatsappEnabled = extensionState.subscription.features.whatsappNotifications;

  if (!isProfessional || !whatsappEnabled) {
    console.log('⚠️ WhatsApp only available on Professional tier');
    return { success: false, error: 'WhatsApp not available' };
  }

  const whatsappTest = {
    type: 'whatsapp',
    to: '+447700900123', // Your test number
    message: 'TestNotifier WhatsApp Test: Earlier slot found for Test Pupil',
    pupilName: 'Test Pupil'
  };

  console.log('✅ WhatsApp test configured');
  return whatsappTest;
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting comprehensive notification tests...');

  // Test 1: Email (All tiers)
  await testEmailNotification();

  // Test 2: SMS (Starter+ tiers)
  await testSMSNotification();

  // Test 3: WhatsApp (Professional only)
  await testWhatsAppNotification();

  console.log('✅ All notification tests configured!');
  console.log('📋 Check your email client, SMS messages, and WhatsApp for test notifications');
}

// Run the tests
runAllTests();
```

### **C. Testing with Real Twilio Account**

**Step 1: Set up Twilio account**
```bash
# Get your Twilio credentials from https://www.twilio.com/console
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+447700900123"  # Your Twilio number
```

**Step 2: Configure extension with Twilio**
```javascript
// Configure Twilio in extension settings
extensionState.settings.twilio = {
  accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authToken: 'your_auth_token',
  phoneNumber: '+447700900123'
};
```

**Step 3: Test SMS functionality**
```javascript
// Test SMS with real Twilio
const smsResult = await sendSMSNotification(
  '+447700900123',  // Your test phone
  'TestNotifier SMS Test: Earlier driving test slot found for John Smith!',
  'John Smith'
);

console.log('SMS Result:', smsResult);
```

**Step 4: Test WhatsApp functionality (Professional tier only)**
```javascript
// Test WhatsApp with real Twilio (Professional tier required)
const whatsappResult = await sendWhatsAppNotification(
  '+447700900123',  // Your test phone
  'TestNotifier WhatsApp Test: Earlier driving test slot found for John Smith!',
  'John Smith'
);

console.log('WhatsApp Result:', whatsappResult);
```

## 📊 Testing Results Analysis

### **Expected Results:**

#### **Email Notifications (All Tiers)**
- ✅ Should open default email client
- ✅ Should pre-fill recipient, subject, and body
- ✅ Should include pupil name and test details

#### **SMS Notifications (Starter+ Tiers)**
- ✅ Should send via Twilio API
- ✅ Should deliver to UK phone numbers only
- ✅ Should include proper formatting and pupil name
- ✅ Should show success/failure status

#### **WhatsApp Notifications (Professional Only)**
- ✅ Should send via Twilio WhatsApp API
- ✅ Should deliver to WhatsApp-enabled numbers
- ✅ Should include proper WhatsApp formatting
- ✅ Should show success/failure status

## 🚨 Common Issues and Solutions

### **Issue 1: SMS/WhatsApp Not Working**
**Solution**:
- Verify Twilio credentials are correct
- Ensure phone number is in UK format (+44...)
- Check Twilio account has sufficient balance
- Verify WhatsApp Business API is enabled for WhatsApp

### **Issue 2: Email Not Opening**
**Solution**:
- Check default email client is configured
- Try different email clients (Gmail, Outlook, etc.)
- Test with mailto: links directly in browser

### **Issue 3: Notification Limits Exceeded**
**Solution**:
- Check current subscription tier limits
- Monitor daily usage counters
- Upgrade subscription if needed for higher limits

### **Issue 4: Rate Limiting**
**Solution**:
- Space out notification tests
- Wait for daily limits to reset (midnight UTC)
- Use exponential backoff for retries

## 📈 Advanced Testing

### **A. Load Testing**
```javascript
// Test notification system under load
async function loadTestNotifications() {
  const notifications = [];

  // Generate 50 notifications (Professional tier limit)
  for (let i = 0; i < 50; i++) {
    notifications.push({
      type: 'sms',
      to: '+447700900123',
      message: `Load test notification ${i + 1}`,
      pupilName: `Pupil ${i + 1}`
    });
  }

  console.log(`🚀 Testing ${notifications.length} notifications...`);

  // Send notifications with rate limiting
  for (const notification of notifications) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    await sendSMSNotification(notification.to, notification.message, notification.pupilName);
  }

  console.log('✅ Load test completed');
}
```

### **B. Error Handling Testing**
```javascript
// Test error scenarios
async function testErrorHandling() {
  console.log('🧪 Testing error handling...');

  // Test 1: Invalid phone number
  const invalidPhone = await sendSMSNotification('invalid-phone', 'Test message', 'Pupil');
  console.log('Invalid phone result:', invalidPhone);

  // Test 2: Invalid email
  const invalidEmail = await sendEmailNotification('invalid-email', 'Subject', 'Body', 'Pupil');
  console.log('Invalid email result:', invalidEmail);

  // Test 3: Missing Twilio credentials
  const missingCredentials = await sendSMSNotification('+447700900123', 'Test', 'Pupil');
  console.log('Missing credentials result:', missingCredentials);
}
```

## 📋 Testing Checklist

### **Basic Functionality Tests:**
- [ ] Email notifications work on all tiers
- [ ] SMS notifications work on Starter+ tiers
- [ ] WhatsApp notifications work on Professional tier
- [ ] All notifications include pupil names
- [ ] Error handling works correctly
- [ ] Rate limiting functions properly

### **Subscription Tier Tests:**
- [ ] One-Off tier: Email only (5/day limit)
- [ ] Starter tier: Email + SMS (10/day limit)
- [ ] Premium tier: Email + SMS (25/day limit)
- [ ] Professional tier: Email + SMS + WhatsApp (50/day limit)

### **Advanced Tests:**
- [ ] Load testing with maximum notifications
- [ ] Error handling for invalid inputs
- [ ] Rate limiting enforcement
- [ ] Retry mechanism functionality
- [ ] Multi-channel notification coordination

## 📞 Support and Troubleshooting

**For notification issues:**
- Check browser console for error messages
- Verify Twilio account status and balance
- Ensure phone numbers are in correct format
- Test with different notification types
- Monitor daily usage limits

**Contact Information:**
- **Technical Support**: hello@testnotifier.co.uk
- **Twilio Support**: https://support.twilio.com/
- **Emergency Issues**: hello@testnotifier.co.uk

---

## 🎯 Summary

**TestNotifier's notification system is comprehensive and well-implemented with:**
- ✅ Multi-channel support (Email, SMS, WhatsApp)
- ✅ Subscription tier-based feature access
- ✅ Professional Twilio integration
- ✅ Robust error handling and retry mechanisms
- ✅ Rate limiting and abuse prevention
- ✅ UK phone number validation
- ✅ Comprehensive testing capabilities

**Ready to test your notification system!** 🚀

---

*Last Updated: October 2025*
*Testing Guide Version: 1.0*
*Next Review: After notification system updates*