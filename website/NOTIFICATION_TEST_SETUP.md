# 🧪 TestNotifier Notification System Test Setup Guide

## 📋 Overview

This guide will help you set up and test the TestNotifier notification system including Email, SMS, and WhatsApp functionality.

## 🎯 Quick Start

### **1. Environment Setup**

Create a `.env` file in the website directory:

```bash
# Email Testing (Required for all tests)
TEST_EMAIL=your-email@example.com

# SMS/WhatsApp Testing (Optional - for full testing)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+447700900123
TEST_PHONE_NUMBER=+447700900456
```

### **2. Run Basic Tests (Email Only)**
```bash
cd website
node test-notification-system.js
```

### **3. Run Full Tests (Email + SMS + WhatsApp)**
```bash
# Set up your environment variables first
export TEST_EMAIL="your-email@example.com"
export TWILIO_ACCOUNT_SID="your_twilio_sid"
export TWILIO_AUTH_TOKEN="your_twilio_token"
export TWILIO_PHONE_NUMBER="+447700900123"
export TEST_PHONE_NUMBER="+447700900456"

# Run the test suite
node test-notification-system.js
```

## 🔧 Detailed Setup Instructions

### **Email Testing Setup**

Email notifications use the browser's `mailto:` functionality and work immediately:

1. **Set your test email**:
   ```bash
   export TEST_EMAIL="your-email@example.com"
   ```

2. **Run email tests** - they will simulate mailto: links

3. **What to expect**:
   - Tests will show the mailto: links that would be opened
   - Your default email client will open with pre-filled content
   - No external services required

### **SMS Testing Setup (Optional)**

For SMS testing, you need a Twilio account:

1. **Create Twilio Account**:
   - Go to [https://www.twilio.com](https://www.twilio.com)
   - Sign up for a free trial account
   - Verify your phone number

2. **Get Twilio Credentials**:
   - **Account SID**: Found in your Twilio console dashboard
   - **Auth Token**: Found in your Twilio console dashboard
   - **Phone Number**: Buy a UK phone number in Twilio

3. **Set Environment Variables**:
   ```bash
   export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   export TWILIO_AUTH_TOKEN="your_auth_token"
   export TWILIO_PHONE_NUMBER="+447700900123"
   export TEST_PHONE_NUMBER="+447700900456"  # Your test phone
   ```

4. **Verify Phone Number Format**:
   - Use UK format: `+447700900123`
   - Must start with `+44`
   - Must be 12-13 digits total

### **WhatsApp Testing Setup (Optional)**

WhatsApp uses the same Twilio account but requires additional setup:

1. **Enable WhatsApp Business API**:
   - In Twilio console, go to Messaging > Try it out > Send a WhatsApp message
   - Follow setup instructions
   - Connect your WhatsApp Business account

2. **Test Phone Number**:
   - Use the same `TEST_PHONE_NUMBER` as SMS
   - Phone must have WhatsApp installed

3. **Environment Variables** (same as SMS):
   - Uses same Twilio credentials as SMS
   - No additional setup needed

## 🧪 Test Execution Options

### **Option 1: Node.js Test Suite**
```bash
# Basic test (email only)
node test-notification-system.js

# Full test with all features
export TEST_EMAIL="your@email.com"
export TWILIO_ACCOUNT_SID="your_sid"
export TWILIO_AUTH_TOKEN="your_token"
export TWILIO_PHONE_NUMBER="+447700900123"
export TEST_PHONE_NUMBER="+447700900456"
node test-notification-system.js
```

### **Option 2: Browser Console Tests**

1. **Load the extension** in Chrome
2. **Open browser console** (F12) on any webpage
3. **Paste the browser test script**:
   ```javascript
   // Copy contents of test-notification-browser.js and paste in console
   ```
4. **Or run individual tests**:
   ```javascript
   // Run all tests
   TestNotifierTests.runBrowserTests();

   // Run specific test
   TestNotifierTests.testEmailNotifications();
   ```

### **Option 3: Manual Testing in Extension**

1. **Install and configure the extension**
2. **Set up Twilio credentials** in extension settings
3. **Add a test pupil** with your contact details
4. **Trigger notifications** through the extension interface

## 📊 Expected Test Results

### **Email Tests** (Always Available)
- ✅ Basic email notification
- ✅ Email with special characters
- ✅ Email with long content
- ✅ Proper mailto: link generation

### **SMS Tests** (Requires Twilio)
- ✅ Basic SMS notification
- ✅ SMS with special characters
- ✅ SMS with long messages
- ✅ UK phone number validation

### **WhatsApp Tests** (Requires Twilio + Professional Tier)
- ✅ Basic WhatsApp notification
- ✅ WhatsApp with emojis
- ✅ Proper WhatsApp formatting

## 🔍 Troubleshooting

### **Common Issues**

**1. Environment Variables Not Recognized**
```bash
# Check if variables are set
echo $TWILIO_ACCOUNT_SID
echo $TEST_EMAIL

# Set them properly
export TEST_EMAIL="your-email@example.com"
```

**2. Invalid UK Phone Number**
```bash
# Correct format: +447700900123
# Wrong format: 07700900123 or +44 7700 900 123
export TEST_PHONE_NUMBER="+447700900123"
```

**3. Twilio Authentication Failed**
- Verify Account SID and Auth Token are correct
- Check Twilio account has sufficient balance
- Ensure phone number is purchased and active

**4. SMS/WhatsApp Not Working**
- Check Twilio console for error messages
- Verify phone number format (+44...)
- Ensure WhatsApp Business API is enabled
- Check subscription tier supports features

### **Extension-Specific Issues**

**1. Extension Not Active**
- Ensure extension is installed and enabled
- Check that you're on a webpage (not extension page)
- Reload the page after installing extension

**2. Subscription Tier Issues**
- Check current subscription in extension popup
- SMS requires Starter tier or higher
- WhatsApp requires Professional tier

**3. Twilio Configuration in Extension**
- Open extension popup
- Go to Settings > Notifications
- Enter Twilio credentials
- Test with "Send Test Notification" button

## 📈 Advanced Testing

### **Load Testing**
```bash
# Test multiple notifications quickly
node test-notification-system.js --load-test

# Test with specific notification limits
node test-notification-system.js --test-limits
```

### **Error Testing**
```bash
# Test error handling
node test-notification-system.js --test-errors

# Test with invalid credentials
TWILIO_ACCOUNT_SID="invalid" node test-notification-system.js
```

### **Subscription Testing**
```bash
# Test different subscription tiers
TEST_SUBSCRIPTION_TIER="starter" node test-notification-system.js
TEST_SUBSCRIPTION_TIER="professional" node test-notification-system.js
```

## 🎯 Verification Checklist

### **Before Testing**
- [ ] Set up environment variables
- [ ] Verify email address is correct
- [ ] Check Twilio account status (if testing SMS/WhatsApp)
- [ ] Ensure extension is installed (for browser tests)

### **During Testing**
- [ ] Monitor console output for errors
- [ ] Check Twilio console for sent messages
- [ ] Verify email client opens with correct content
- [ ] Test different subscription tier scenarios

### **After Testing**
- [ ] Review test results summary
- [ ] Check for any failed tests
- [ ] Verify notification limits work correctly
- [ ] Test error handling scenarios

## 📞 Support

**For Test Issues**:
- Check browser console for JavaScript errors
- Verify all environment variables are set correctly
- Ensure Twilio account has proper permissions

**For Twilio Issues**:
- Check Twilio console for error logs
- Verify phone number is purchased and active
- Ensure sufficient account balance

**Contact Information**:
- **Test Support**: hello@testnotifier.co.uk
- **Twilio Support**: https://support.twilio.com/

---

**Ready to test your notification system!** 🚀

**Next Steps**: Set up your environment variables and run the test suite to verify all notification channels are working correctly. The tests will work with email immediately, and SMS/WhatsApp once Twilio is configured. The comprehensive test suite will validate the entire notification system functionality across all subscription tiers. 📧📱💬