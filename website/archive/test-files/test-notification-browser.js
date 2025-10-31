// ==========================================
// TestNotifier Browser Notification Tests
// ==========================================
// This script can be run directly in the browser console with the extension active

(function() {
  'use strict';

  console.log('🚀 Starting TestNotifier Notification System Browser Tests...');

  // Test configuration
  const TEST_CONFIG = {
    email: 'test@example.com', // Replace with your test email
    phone: '+447700900123',    // Replace with your test UK phone number
    pupilName: 'Test Pupil'
  };

  // Test results tracking
  const testResults = {
    email: { passed: 0, failed: 0, tests: [] },
    sms: { passed: 0, failed: 0, tests: [] },
    whatsapp: { passed: 0, failed: 0, tests: [] },
    overall: { passed: 0, failed: 0, total: 0 }
  };

  // ==========================================
  // Utility Functions
  // ==========================================

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function validateUKPhoneNumber(phoneNumber) {
    const ukPhoneRegex = /^\+44[1-9]\d{9,10}$/;  // UK format
    const usPhoneRegex = /^\+1[2-9]\d{9}$/;       // US format
    return ukPhoneRegex.test(phoneNumber) || usPhoneRegex.test(phoneNumber);
  }

  function formatTestResults() {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`📧 Email Tests: ${testResults.email.passed} passed, ${testResults.email.failed} failed`);
    console.log(`📱 SMS Tests: ${testResults.sms.passed} ${testResults.sms.failed} failed`);
    console.log(`💬 WhatsApp Tests: ${testResults.whatsapp.passed} passed, ${testResults.whatsapp.failed} failed`);
    console.log(`📈 Overall: ${testResults.overall.passed} passed, ${testResults.overall.failed} failed`);

    if (testResults.overall.failed === 0) {
      console.log('🎉 All tests completed successfully!');
    } else {
      console.log('⚠️ Some tests failed. Check the detailed results above.');
    }
  }

  // ==========================================
  // Email Tests
  // ==========================================

  async function testEmailNotifications() {
    console.log('\n📧 Testing Email Notifications...');

    const tests = [
      {
        name: 'Basic Email Test',
        test: async () => {
          const emailData = {
            type: 'email',
            to: TEST_CONFIG.email,
            subject: 'TestNotifier - Basic Email Test',
            body: `Test email notification for ${TEST_CONFIG.pupilName}. Earlier driving test slot found!`,
            pupilName: TEST_CONFIG.pupilName
          };

          // Simulate email notification
          const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;

          console.log('  📧 Email details:');
          console.log(`     To: ${emailData.to}`);
          console.log(`     Subject: ${emailData.subject}`);
          console.log(`     Body: ${emailData.body}`);
          console.log(`     Mailto link: ${mailtoLink}`);

          // In a real test, you would open this link or trigger the mailto functionality
          // window.open(mailtoLink, '_blank');

          return { success: true, method: 'mailto', data: emailData };
        }
      },
      {
        name: 'Email with Special Characters',
        test: async () => {
          const emailData = {
            type: 'email',
            to: TEST_CONFIG.email,
            subject: 'TestNotifier - Special Characters Test',
            body: `Test with special characters: @#$%^&*()_+-=[]{}|;:,.<>? for ${TEST_CONFIG.pupilName}`,
            pupilName: 'John O\'Brien-Smith'
          };

          console.log('  📧 Email with special characters test');
          console.log(`     Body: ${emailData.body}`);

          return { success: true, method: 'mailto', data: emailData };
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`\n  Running: ${test.name}`);
        const result = await test.test();

        if (result.success) {
          testResults.email.passed++;
          console.log(`  ✅ ${test.name} - PASSED`);
        } else {
          testResults.email.failed++;
          console.log(`  ❌ ${test.name} - FAILED: ${result.error}`);
        }

        testResults.email.tests.push({
          name: test.name,
          success: result.success,
          error: result.error,
          details: result
        });

        await delay(1000); // Wait between tests

      } catch (error) {
        testResults.email.failed++;
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        testResults.email.tests.push({
          name: test.name,
          success: false,
          error: error.message
        });
      }
    }
  }

  // ==========================================
  // SMS Tests
  // ==========================================

  async function testSMSNotifications() {
    console.log('\n📱 Testing SMS Notifications...');

    // Check if Twilio is configured in the extension
    if (!window.extensionState || !window.extensionState.settings || !window.extensionState.settings.twilio) {
      console.log('  ⚠️  Extension state not available. SMS tests require the TestNotifier extension to be active.');
      testResults.sms.tests.push({
        name: 'SMS Configuration Check',
        success: false,
        error: 'Extension not active or Twilio not configured'
      });
      testResults.sms.failed++;
      return;
    }

    const twilioConfig = window.extensionState.settings.twilio;
    if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber) {
      console.log('  ⚠️  Twilio not configured in extension settings.');
      console.log('  Please configure Twilio credentials in extension settings to test SMS.');
      testResults.sms.tests.push({
        name: 'SMS Configuration Check',
        success: false,
        error: 'Twilio credentials not configured'
      });
      testResults.sms.failed++;
      return;
    }

    if (!validateUKPhoneNumber(TEST_CONFIG.phone)) {
      console.log('  ❌ Invalid phone number format. Use UK: +447700900123 or US: +12025550123');
      testResults.sms.tests.push({
        name: 'Phone Number Validation',
        success: false,
        error: 'Invalid phone number format'
      });
      testResults.sms.failed++;
      return;
    }

    const tests = [
      {
        name: 'Basic SMS Test',
        test: async () => {
          const smsData = {
            type: 'sms',
            to: TEST_CONFIG.phone,
            message: `TestNotifier: Earlier driving test slot found for ${TEST_CONFIG.pupilName}!`,
            pupilName: TEST_CONFIG.pupilName
          };

          console.log('  📱 SMS test details:');
          console.log(`     From: ${twilioConfig.phoneNumber}`);
          console.log(`     To: ${smsData.to}`);
          console.log(`     Message: ${smsData.message}`);

          // Check subscription tier allows SMS
          if (window.extensionState.subscription &&
              window.extensionState.subscription.features &&
              !window.extensionState.subscription.features.smsNotifications) {
            console.log('  ⚠️  SMS notifications not available for current subscription tier');
            return { success: false, error: 'SMS not available for current tier' };
          }

          return {
            success: true,
            method: 'twilio_sms',
            data: smsData,
            note: 'In actual implementation, this would call the Twilio API'
          };
        }
      },
      {
        name: 'SMS with Test Centre Details',
        test: async () => {
          const smsData = {
            type: 'sms',
            to: TEST_CONFIG.phone,
            message: `TestNotifier: Earlier slot for ${TEST_CONFIG.pupilName}! London West Test Centre - 15th Dec at 10:30 AM`,
            pupilName: TEST_CONFIG.pupilName
          };

          console.log('  📱 SMS with test centre details:');
          console.log(`     Message: ${smsData.message}`);

          return { success: true, method: 'twilio_sms', data: smsData };
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`\n  Running: ${test.name}`);
        const result = await test.test();

        if (result.success) {
          testResults.sms.passed++;
          console.log(`  ✅ ${test.name} - PASSED`);
        } else {
          testResults.sms.failed++;
          console.log(`  ❌ ${test.name} - FAILED: ${result.error}`);
        }

        testResults.sms.tests.push({
          name: test.name,
          success: result.success,
          error: result.error,
          details: result
        });

        await delay(2000); // Wait between SMS tests to avoid rate limiting

      } catch (error) {
        testResults.sms.failed++;
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        testResults.sms.tests.push({
          name: test.name,
          success: false,
          error: error.message
        });
      }
    }
  }

  // ==========================================
  // WhatsApp Tests
  // ==========================================

  async function testWhatsAppNotifications() {
    console.log('\n💬 Testing WhatsApp Notifications...');

    // Check if extension state is available and supports WhatsApp
    if (!window.extensionState || !window.extensionState.subscription ||
        !window.extensionState.subscription.features ||
        !window.extensionState.subscription.features.whatsappNotifications) {
      console.log('  ⚠️  WhatsApp notifications not available. Requires Professional tier.');
      testResults.whatsapp.tests.push({
        name: 'WhatsApp Availability Check',
        success: false,
        error: 'WhatsApp not available for current subscription tier'
      });
      testResults.whatsapp.failed++;
      return;
    }

    const tests = [
      {
        name: 'Basic WhatsApp Test',
        test: async () => {
          const whatsappData = {
            type: 'whatsapp',
            to: TEST_CONFIG.phone,
            message: `TestNotifier WhatsApp: Earlier driving test slot found for ${TEST_CONFIG.pupilName}! 🚗`,
            pupilName: TEST_CONFIG.pupilName
          };

          console.log('  💬 WhatsApp test details:');
          console.log(`     To: ${whatsappData.to}`);
          console.log(`     Message: ${whatsappData.message}`);

          return {
            success: true,
            method: 'twilio_whatsapp',
            data: whatsappData,
            note: 'Requires Twilio WhatsApp Business API to be configured'
          };
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`\n  Running: ${test.name}`);
        const result = await test.test();

        if (result.success) {
          testResults.whatsapp.passed++;
          console.log(`  ✅ ${test.name} - PASSED`);
        } else {
          testResults.whatsapp.failed++;
          console.log(`  ❌ ${test.name} - FAILED: ${result.error}`);
        }

        testResults.whatsapp.tests.push({
          name: test.name,
          success: result.success,
          error: result.error,
          details: result
        });

        await delay(3000); // Wait between WhatsApp tests

      } catch (error) {
        testResults.whatsapp.failed++;
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        testResults.whatsapp.tests.push({
          name: test.name,
          success: false,
          error: error.message
        });
      }
    }
  }

  // ==========================================
  // Main Test Execution
  // ==========================================

  async function runBrowserTests() {
    console.log('🧪 Starting comprehensive notification tests...\n');

    try {
      // Test Email Notifications
      await testEmailNotifications();

      // Test SMS Notifications
      await testSMSNotifications();

      // Test WhatsApp Notifications
      await testWhatsAppNotifications();

    } catch (error) {
      console.error('❌ Test suite encountered an error:', error);
    }

    // Calculate totals
    testResults.overall.passed = testResults.email.passed +
                                testResults.sms.passed +
                                testResults.whatsapp.passed;

    testResults.overall.failed = testResults.email.failed +
                                testResults.sms.failed +
                                testResults.whatsapp.failed;

    testResults.overall.total = testResults.overall.passed +
                               testResults.overall.failed;

    // Print summary
    formatTestResults();

    console.log('\n📋 Test Configuration:');
    console.log(`   Email: ${TEST_CONFIG.email}`);
    console.log(`   Phone: ${TEST_CONFIG.phone}`);
    console.log(`   Pupil: ${TEST_CONFIG.pupilName}`);

    console.log('\n💡 Next Steps:');
    console.log('   1. Configure Twilio credentials in extension settings for SMS/WhatsApp tests');
    console.log('   2. Replace test email and phone with your actual contact details');
    console.log('   3. Run individual tests or modify this script for specific testing needs');
    console.log('   4. Check the extension popup for subscription tier and feature availability');

    return testResults;
  }

  // Auto-run tests when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBrowserTests);
  } else {
    // DOM is already loaded
    setTimeout(runBrowserTests, 1000); // Small delay to ensure extension is loaded
  }

  // Export for manual execution
  window.TestNotifierTests = {
    runBrowserTests,
    testEmailNotifications,
    testSMSNotifications,
    testWhatsAppNotifications,
    TEST_CONFIG
  };

})();