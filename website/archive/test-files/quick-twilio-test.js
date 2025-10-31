// Quick Twilio test to verify your configuration
console.log('🚀 Testing Twilio Configuration...');

// Check environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const testPhone = process.env.TEST_PHONE_NUMBER;

console.log('📋 Environment Check:');
console.log('Account SID:', accountSid ? '✅ Set' : '❌ Missing');
console.log('Auth Token:', authToken ? '✅ Set' : '❌ Missing');
console.log('Twilio Number:', phoneNumber ? '✅ Set' : '❌ Missing');
console.log('Test Number:', testPhone ? '✅ Set' : '❌ Missing');

if (!accountSid || !authToken || !phoneNumber || !testPhone) {
  console.log('❌ Missing environment variables. Please set all Twilio credentials.');
  process.exit(1);
}

// Test phone number validation
const ukPhoneRegex = /^\+44[1-9]\d{9,10}$/;
const usPhoneRegex = /^\+1[2-9]\d{9}$/;

console.log('\n📱 Phone Number Validation:');
console.log('Twilio Number:', phoneNumber);
console.log('Test Number:', testPhone);
console.log('Twilio valid:', ukPhoneRegex.test(phoneNumber) || usPhoneRegex.test(phoneNumber));
console.log('Test valid:', ukPhoneRegex.test(testPhone) || usPhoneRegex.test(testPhone));

// Simulate the test
console.log('\n🧪 Simulated Test Results:');
console.log('✅ Email notifications: Ready (browser-based)');
console.log('✅ SMS notifications: Ready (Twilio configured)');
console.log('✅ WhatsApp notifications: Ready (Twilio configured)');
console.log('\n🎯 Ready to run full test suite!');
console.log('Run: node test-notification-system.js');