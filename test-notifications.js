#!/usr/bin/env node

/**
 * Test script to verify notification services are configured correctly
 * Run with: node test-notifications.js
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:10000';
const TEST_JWT_TOKEN = process.env.TEST_JWT_TOKEN || 'your-test-jwt-token';

console.log('🧪 Testing Notification Services...\n');

async function testNotificationService(type, data) {
  try {
    console.log(`Testing ${type.toUpperCase()} notifications...`);

    const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_JWT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`✅ ${type.toUpperCase()} notification sent successfully`);
      console.log(`   Details: ${result.message}`);
      if (result.details) {
        console.log(`   Email: ${result.details.email?.success ? '✅' : '❌'}`);
        console.log(`   SMS: ${result.details.sms?.success ? '✅' : '❌'}`);
        console.log(`   WhatsApp: ${result.details.whatsapp?.success ? '✅' : '❌'}`);
      }
    } else {
      console.log(`❌ ${type.toUpperCase()} notification failed`);
      console.log(`   Error: ${result.error || 'Unknown error'}`);
      if (result.details) {
        console.log(`   Email error: ${result.details.email?.error || 'None'}`);
        console.log(`   SMS error: ${result.details.sms?.error || 'None'}`);
        console.log(`   WhatsApp error: ${result.details.whatsapp?.error || 'None'}`);
      }
    }

    console.log('');
    return result;

  } catch (error) {
    console.log(`❌ ${type.toUpperCase()} notification error:`, error.message);
    console.log('');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting notification service tests...\n');

  // Test 1: Email notification (should work for all tiers)
  await testNotificationService('email', {
    type: 'slot_found',
    monitorName: 'Test Pupil',
    email: 'your-email@example.com', // Replace with your email
    slot: {
      date: '2024-12-25',
      time: '09:00',
      centre: 'London Test Centre'
    },
    notificationTypes: ['email']
  });

  // Test 2: SMS notification (requires Starter+ tier)
  await testNotificationService('sms', {
    type: 'slot_found',
    monitorName: 'Test Pupil',
    phone: '+447700900123', // Replace with your phone number
    slot: {
      date: '2024-12-25',
      time: '09:00',
      centre: 'London Test Centre'
    },
    notificationTypes: ['sms']
  });

  // Test 3: WhatsApp notification (requires Professional tier)
  await testNotificationService('whatsapp', {
    type: 'slot_found',
    monitorName: 'Test Pupil',
    phone: '+447700900123', // Replace with your phone number
    slot: {
      date: '2024-12-25',
      time: '09:00',
      centre: 'London Test Centre'
    },
    notificationTypes: ['whatsapp']
  });

  // Test 4: Multi-channel notification
  await testNotificationService('multi-channel', {
    type: 'slot_found',
    monitorName: 'Test Pupil',
    email: 'your-email@example.com',
    phone: '+447700900123',
    slot: {
      date: '2024-12-25',
      time: '09:00',
      centre: 'London Test Centre'
    },
    notificationTypes: ['email', 'sms']
  });

  console.log('🎯 Test Summary:');
  console.log('');
  console.log('Expected Results:');
  console.log('✅ Email: Should work (all tiers have email)');
  console.log('⚠️  SMS: Requires Starter+ tier');
  console.log('⚠️  WhatsApp: Requires Professional tier');
  console.log('⚠️  Multi-channel: Depends on your subscription tier');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Check your email for test notifications');
  console.log('2. Check your phone for SMS/WhatsApp messages');
  console.log('3. If services are not configured, follow NOTIFICATION_SERVICE_SETUP.md');
  console.log('4. Check browser console for detailed error logs');
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
  console.log('❌ Fetch is not available. Please install node-fetch:');
  console.log('   npm install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});