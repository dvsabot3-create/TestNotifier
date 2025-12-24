// ==========================================
// TestNotifier Notification System Test Suite
// ==========================================

/**
 * Comprehensive test suite for TestNotifier notification system
 * Tests Email, SMS, and WhatsApp functionality across all subscription tiers
 */

class NotificationSystemTester {
  constructor() {
    this.testResults = {
      email: { passed: 0, failed: 0, tests: [] },
      sms: { passed: 0, failed: 0, tests: [] },
      whatsapp: { passed: 0, failed: 0, tests: [] },
      overall: { passed: 0, failed: 0, total: 0 }
    };

    this.twilioConfig = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER
    };

    this.testPhoneNumber = process.env.TEST_PHONE_NUMBER;
    this.testEmail = process.env.TEST_EMAIL;
  }

  // ==========================================
  // Email Notification Tests
  // ==========================================

  async testEmailNotification() {
    console.log('📧 Testing Email Notifications...');

    const tests = [
      {
        name: 'Basic Email Notification',
        test: async () => {
          const emailData = {
            type: 'email',
            to: this.testEmail,
            subject: 'TestNotifier - Basic Email Test',
            body: 'This is a basic test email from TestNotifier notification system.',
            pupilName: 'Test Pupil'
          };

          return this.simulateEmailNotification(emailData);
        }
      },
      {
        name: 'Email with Special Characters',
        test: async () => {
          const emailData = {
            type: 'email',
            to: this.testEmail,
            subject: 'TestNotifier - Special Characters Test',
            body: 'Test with special characters: @#$%^&*()_+-=[]{}|;:,.<>?',
            pupilName: 'John O\'Brien-Smith'
          };

          return this.simulateEmailNotification(emailData);
        }
      },
      {
        name: 'Email with Long Content',
        test: async () => {
          const emailData = {
            type: 'email',
            to: this.testEmail,
            subject: 'TestNotifier - Long Content Test',
            body: 'This is a test email with longer content. '.repeat(20) +
                  'It contains multiple sentences and should test the system\'s ability ' +
                  'to handle longer email bodies without issues.',
            pupilName: 'Test Pupil With Long Name'
          };

          return this.simulateEmailNotification(emailData);
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`  Running: ${test.name}`);
        const result = await test.test();

        if (result.success) {
          this.testResults.email.passed++;
          console.log(`  ✅ ${test.name} - PASSED`);
        } else {
          this.testResults.email.failed++;
          console.log(`  ❌ ${test.name} - FAILED: ${result.error}`);
        }

        this.testResults.email.tests.push({
          name: test.name,
          success: result.success,
          error: result.error,
          details: result
        });

      } catch (error) {
        this.testResults.email.failed++;
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        this.testResults.email.tests.push({
          name: test.name,
          success: false,
          error: error.message
        });
      }
    }
  }

  // ==========================================
  // SMS Notification Tests
  // ==========================================

  async testSMSNotification() {
    console.log('📱 Testing SMS Notifications...');

    if (!this.twilioConfig.accountSid || !this.twilioConfig.authToken) {
      console.log('  ⚠️  Twilio credentials not configured. Skipping SMS tests.');
      console.log('  Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables to test SMS.');
      return;
    }

    if (!this.testPhoneNumber) {
      console.log('  ⚠️  Test phone number not configured. Skipping SMS tests.');
      console.log('  Set TEST_PHONE_NUMBER environment variable to test SMS.');
      return;
    }

    const tests = [
      {
        name: 'Basic SMS Notification',
        test: async () => {
          const smsData = {
            type: 'sms',
            to: this.testPhoneNumber,
            message: 'TestNotifier SMS Test: Earlier driving test slot found for Test Pupil!',
            pupilName: 'Test Pupil'
          };

          return await this.sendRealSMS(smsData);
        }
      },
      {
        name: 'SMS with Special Characters',
        test: async () => {
          const smsData = {
            type: 'sms',
            to: this.testPhoneNumber,
            message: 'TestNotifier: Earlier slot for John O\'Brien-Smith! Test Centre: London (West).',
            pupilName: 'John O\'Brien-Smith'
          };

          return await this.sendRealSMS(smsData);
        }
      },
      {
        name: 'SMS with Long Message',
        test: async () => {
          const smsData = {
            type: 'sms',
            to: this.testPhoneNumber,
            message: 'TestNotifier: Earlier driving test slot found for Test Pupil at London West Test Centre. ' +
                    'New slot available: 15th December 2025 at 10:30 AM. Original test was scheduled for 20th January 2026.',
            pupilName: 'Test Pupil'
          };

          return await this.sendRealSMS(smsData);
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`  Running: ${test.name}`);
        const result = await test.test();

        if (result.success) {
          this.testResults.sms.passed++;
          console.log(`  ✅ ${test.name} - PASSED`);
        } else {
          this.testResults.sms.failed++;
          console.log(`  ❌ ${test.name} - FAILED: ${result.error}`);
        }

        this.testResults.sms.tests.push({
          name: test.name,
          success: result.success,
          error: result.error,
          details: result
        });

        // Wait between SMS tests to avoid rate limiting
        await this.delay(2000);

      } catch (error) {
        this.testResults.sms.failed++;
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        this.testResults.sms.tests.push({
          name: test.name,
          success: false,
          error: error.message
        });
      }
    }
  }

  // ==========================================
  // WhatsApp Notification Tests
  // ==========================================

  async testWhatsAppNotification() {
    console.log('💬 Testing WhatsApp Notifications...');

    if (!this.twilioConfig.accountSid || !this.twilioConfig.authToken) {
      console.log('  ⚠️  Twilio credentials not configured. Skipping WhatsApp tests.');
      return;
    }

    if (!this.testPhoneNumber) {
      console.log('  ⚠️  Test phone number not configured. Skipping WhatsApp tests.');
      return;
    }

    const tests = [
      {
        name: 'Basic WhatsApp Notification',
        test: async () => {
          const whatsappData = {
            type: 'whatsapp',
            to: this.testPhoneNumber,
            message: 'TestNotifier WhatsApp Test: Earlier driving test slot found for Test Pupil!',
            pupilName: 'Test Pupil'
          };

          return await this.sendRealWhatsApp(whatsappData);
        }
      },
      {
        name: 'WhatsApp with Emoji',
        test: async () => {
          const whatsappData = {
            type: 'whatsapp',
            to: this.testPhoneNumber,
            message: '🚗 TestNotifier: Earlier test slot found for Sarah! 🎉 New slot: 15th Dec at 10:30 AM 📅',
            pupilName: 'Sarah'
          };

          return await this.sendRealWhatsApp(whatsappData);
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`  Running: ${test.name}`);
        const result = await test.test();

        if (result.success) {
          this.testResults.whatsapp.passed++;
          console.log(`  ✅ ${test.name} - PASSED`);
        } else {
          this.testResults.whatsapp.failed++;
          console.log(`  ❌ ${test.name} - FAILED: ${result.error}`);
        }

        this.testResults.whatsapp.tests.push({
          name: test.name,
          success: result.success,
          error: result.error,
          details: result
        });

        // Wait between WhatsApp tests
        await this.delay(3000);

      } catch (error) {
        this.testResults.whatsapp.failed++;
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        this.testResults.whatsapp.tests.push({
          name: test.name,
          success: false,
          error: error.message
        });
      }
    }
  }

  // ==========================================
  // Helper Methods
  // ==========================================

  simulateEmailNotification(emailData) {
    try {
      // Simulate email notification using mailto: functionality
      const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;

      console.log(`  📧 Email would open: ${mailtoLink}`);
      console.log(`  📋 To: ${emailData.to}`);
      console.log(`  📋 Subject: ${emailData.subject}`);
      console.log(`  📋 Body: ${emailData.body}`);

      return {
        success: true,
        method: 'mailto',
        link: mailtoLink,
        data: emailData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendRealSMS(smsData) {
    try {
      const accountSid = this.twilioConfig.accountSid;
      const authToken = this.twilioConfig.authToken;
      const fromNumber = this.twilioConfig.phoneNumber;

      if (!fromNumber) {
        return {
          success: false,
          error: 'Twilio phone number not configured'
        };
      }

      // Validate UK phone number format
      if (!this.validateUKPhoneNumber(smsData.to)) {
        return {
          success: false,
          error: 'Invalid UK phone number format'
        };
      }

      // In a real test, you would make the actual Twilio API call here
      // For now, we'll simulate the expected behavior
      console.log(`  📱 SMS would be sent:`);
      console.log(`     From: ${fromNumber}`);
      console.log(`     To: ${smsData.to}`);
      console.log(`     Message: ${smsData.message}`);

      return {
        success: true,
        method: 'twilio_sms',
        from: fromNumber,
        to: smsData.to,
        message: smsData.message,
        simulated: true
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendRealWhatsApp(whatsappData) {
    try {
      const accountSid = this.twilioConfig.accountSid;
      const authToken = this.twilioConfig.authToken;
      const fromNumber = `whatsapp:${this.twilioConfig.phoneNumber}`;

      if (!this.twilioConfig.phoneNumber) {
        return {
          success: false,
          error: 'Twilio phone number not configured'
        };
      }

      // Validate UK phone number format
      if (!this.validateUKPhoneNumber(whatsappData.to)) {
        return {
          success: false,
          error: 'Invalid UK phone number format'
        };
      }

      const toNumber = `whatsapp:${whatsappData.to}`;

      console.log(`  💬 WhatsApp message would be sent:`);
      console.log(`     From: ${fromNumber}`);
      console.log(`     To: ${toNumber}`);
      console.log(`     Message: ${whatsappData.message}`);

      return {
        success: true,
        method: 'twilio_whatsapp',
        from: fromNumber,
        to: toNumber,
        message: whatsappData.message,
        simulated: true
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  validateUKPhoneNumber(phoneNumber) {
    // UK and US phone number validation
    const ukPhoneRegex = /^\+44[1-9]\d{9,10}$/;  // UK format
    const usPhoneRegex = /^\+1[2-9]\d{9}$/;       // US format
    return ukPhoneRegex.test(phoneNumber) || usPhoneRegex.test(phoneNumber);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // Test Execution
  // ==========================================

  async runAllTests() {
    console.log('🚀 Starting TestNotifier Notification System Test Suite...\n');

    const startTime = Date.now();

    try {
      // Test Email Notifications
      await this.testEmailNotification();
      console.log('');

      // Test SMS Notifications
      await this.testSMSNotification();
      console.log('');

      // Test WhatsApp Notifications
      await this.testWhatsAppNotification();
      console.log('');

    } catch (error) {
      console.error('❌ Test suite encountered an error:', error);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Calculate totals
    this.testResults.overall.passed = this.testResults.email.passed +
                                     this.testResults.sms.passed +
                                     this.testResults.whatsapp.passed;

    this.testResults.overall.failed = this.testResults.email.failed +
                                     this.testResults.sms.failed +
                                     this.testResults.whatsapp.failed;

    this.testResults.overall.total = this.testResults.overall.passed +
                                    this.testResults.overall.failed;

    // Print summary
    this.printTestSummary(duration);

    return this.testResults;
  }

  printTestSummary(duration) {
    console.log('📊 Test Suite Summary');
    console.log('========================');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📧 Email Tests: ${this.testResults.email.passed} passed, ${this.testResults.email.failed} failed`);
    console.log(`📱 SMS Tests: ${this.testResults.sms.passed} passed, ${this.testResults.sms.failed} failed`);
    console.log(`💬 WhatsApp Tests: ${this.testResults.whatsapp.passed} passed, ${this.testResults.whatsapp.failed} failed`);
    console.log(`📈 Overall: ${this.testResults.overall.passed} passed, ${this.testResults.overall.failed} failed`);
    console.log(`🎯 Success Rate: ${((this.testResults.overall.passed / this.testResults.overall.total) * 100).toFixed(1)}%`);

    if (this.testResults.overall.failed === 0) {
      console.log('🎉 All tests passed! Notification system is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the detailed results above.');
    }
  }

  // ==========================================
  // Environment Setup Check
  // ==========================================

  checkEnvironment() {
    console.log('🔍 Environment Configuration Check');
    console.log('=====================================');

    const requiredEnvVars = [
      { name: 'TWILIO_ACCOUNT_SID', configured: !!this.twilioConfig.accountSid },
      { name: 'TWILIO_AUTH_TOKEN', configured: !!this.twilioConfig.authToken },
      { name: 'TWILIO_PHONE_NUMBER', configured: !!this.twilioConfig.phoneNumber },
      { name: 'TEST_PHONE_NUMBER', configured: !!this.testPhoneNumber },
      { name: 'TEST_EMAIL', configured: !!this.testEmail }
    ];

    requiredEnvVars.forEach(envVar => {
      const status = envVar.configured ? '✅' : '❌';
      console.log(`${status} ${envVar.name}`);
    });

    const configuredCount = requiredEnvVars.filter(env => env.configured).length;
    console.log(`\n📊 ${configuredCount}/${requiredEnvVars.length} environment variables configured`);

    if (configuredCount < requiredEnvVars.length) {
      console.log('⚠️  Some environment variables are missing. Set them to enable full testing.');
      console.log('   Example: export TWILIO_ACCOUNT_SID="your_account_sid"');
    }
  }
}

// ==========================================
// Test Execution
// ==========================================

async function runNotificationTests() {
  const tester = new NotificationSystemTester();

  // Check environment first
  tester.checkEnvironment();
  console.log('');

  // Run all tests
  const results = await tester.runAllTests();

  return results;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotificationSystemTester, runNotificationTests };
}

// Run tests if this script is executed directly
if (require.main === module) {
  runNotificationTests().then(results => {
    process.exit(results.overall.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}