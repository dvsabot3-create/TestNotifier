/**
 * Test Suite for Access Control System
 * Comprehensive testing of all access control components
 */

class AccessControlTestSuite {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Starting Access Control Test Suite...');
    console.log('='.repeat(50));

    try {
      // Test Trial Manager
      await this.testTrialManager();

      // Test Device Fingerprint
      await this.testDeviceFingerprint();

      // Test User Limitations UI
      await this.testUserLimitationsUI();

      // Test Access Control Manager
      await this.testAccessControlManager();

      // Test Integration
      await this.testIntegration();

      // Test Usage Monitoring
      await this.testUsageMonitoring();

      // Print results
      this.printTestResults();

    } catch (error) {
      console.error('❌ Test suite error:', error);
    }
  }

  /**
   * Test Trial Manager
   */
  async testTrialManager() {
    console.log('\n📋 Testing Trial Manager...');

    try {
      const trialManager = new TrialManager();

      // Test 1: Initialize trial mode
      const trialSubscription = {
        tier: 'trial',
        status: 'trial',
        trialStartTime: Date.now()
      };

      const initialized = await trialManager.initialize(trialSubscription);
      this.assertTrue(initialized, 'Trial manager should initialize with trial subscription');
      this.assertTrue(trialManager.isInTrialMode(), 'Should be in trial mode');

      // Test 2: Demo data generation
      const demoPupils = trialManager.getDemoPupils();
      this.assertTrue(demoPupils.length > 0, 'Should generate demo pupils');
      this.assertTrue(demoPupils[0].isDemo, 'Demo pupils should be marked as demo');

      // Test 3: Trial expiration
      const expiredSubscription = {
        tier: 'trial',
        status: 'trial',
        trialStartTime: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days ago
      };

      await trialManager.initialize(expiredSubscription);
      this.assertTrue(trialManager.isTrialExpired(), 'Trial should be expired after 7 days');

      // Test 4: Real operation blocking
      const trialManager2 = new TrialManager();
      await trialManager2.initialize({ tier: 'trial', status: 'trial', trialStartTime: Date.now() });

      const blocked = trialManager2.blockRealOperation('add_pupil', 'test context');
      this.assertTrue(blocked, 'Real operations should be blocked in trial mode');

      console.log('✅ Trial Manager tests completed');

    } catch (error) {
      console.error('❌ Trial Manager test error:', error);
      this.failedTests++;
    }
  }

  /**
   * Test Device Fingerprint
   */
  async testDeviceFingerprint() {
    console.log('\n🔍 Testing Device Fingerprint...');

    try {
      const deviceFingerprint = new DeviceFingerprint();

      // Test 1: Fingerprint generation
      const fingerprint = await deviceFingerprint.getFingerprint();
      this.assertTrue(fingerprint !== null, 'Should generate device fingerprint');
      this.assertTrue(fingerprint.length > 0, 'Fingerprint should not be empty');

      // Test 2: Fingerprint consistency
      const fingerprint2 = await deviceFingerprint.getFingerprint();
      this.assertEqual(fingerprint, fingerprint2, 'Fingerprint should be consistent');

      // Test 3: Fingerprint components
      const components = await deviceFingerprint.collectFingerprintComponents();
      this.assertTrue(components.userAgent !== undefined, 'Should collect user agent');
      this.assertTrue(components.screenWidth !== undefined, 'Should collect screen width');
      this.assertTrue(components.webglVendor !== undefined, 'Should collect WebGL vendor');

      // Test 4: Canvas fingerprint
      const canvasFingerprint = await deviceFingerprint.getCanvasFingerprint();
      this.assertTrue(canvasFingerprint !== null, 'Should generate canvas fingerprint');

      // Test 5: Session validation (mock)
      const mockValidation = await deviceFingerprint.validateSession('test-user', 'test-token');
      this.assertTrue(typeof mockValidation === 'object', 'Should return validation result');

      console.log('✅ Device Fingerprint tests completed');

    } catch (error) {
      console.error('❌ Device Fingerprint test error:', error);
      this.failedTests++;
    }
  }

  /**
   * Test User Limitations UI
   */
  async testUserLimitationsUI() {
    console.log('\n🖼️ Testing User Limitations UI...');

    try {
      // Create a mock DOM environment
      if (typeof document === 'undefined') {
        console.log('⚠️ Skipping UI tests - no DOM environment');
        return;
      }

      const limitationsUI = new UserLimitationsUI();
      limitationsUI.initialize();

      // Test 1: UI initialization
      const container = document.getElementById('user-limitations-ui');
      this.assertTrue(container !== null, 'Should create UI container');

      // Test 2: Show limitations
      const mockSubscription = {
        tier: 'starter',
        status: 'active'
      };

      const mockUsageStats = {
        pupils: 2,
        dailyBookings: 1,
        notifications: 5
      };

      limitationsUI.showLimitations(mockSubscription, mockUsageStats);
      this.assertTrue(limitationsUI.isVisible, 'Should show limitations UI');

      // Test 3: Hide limitations
      limitationsUI.hide();
      this.assertFalse(limitationsUI.isVisible, 'Should hide limitations UI');

      // Test 4: HTML generation
      const html = limitationsUI.generateLimitationsHTML(mockSubscription, mockUsageStats, {
        pupils: 3,
        dailyBookings: 2,
        notifications: 10
      });

      this.assertTrue(html.includes('Starter'), 'Should include tier name');
      this.assertTrue(html.includes('2/3 pupils'), 'Should include usage stats');

      console.log('✅ User Limitations UI tests completed');

    } catch (error) {
      console.error('❌ User Limitations UI test error:', error);
      this.failedTests++;
    }
  }

  /**
   * Test Access Control Manager
   */
  async testAccessControlManager() {
    console.log('\n🔐 Testing Access Control Manager...');

    try {
      const accessControl = new AccessControlManager();

      // Mock Chrome storage
      global.chrome = {
        storage: {
          local: {
            get: async (keys) => {
              return {
                user_data: {
                  user: { id: 'test-user' },
                  subscription: { tier: 'starter', status: 'active' }
                },
                auth_token: 'test-token'
              };
            },
            set: async (data) => {},
            remove: async (keys) => {}
          }
        },
        runtime: {
          sendMessage: async (message) => {
            return { success: true };
          },
          onMessage: {
            addListener: () => {}
          }
        }
      };

      // Test 1: Initialization
      const initialized = await accessControl.initialize();
      this.assertTrue(initialized, 'Should initialize access control manager');
      this.assertTrue(accessControl.isInitialized, 'Should be marked as initialized');

      // Test 2: Access validation
      const validation = await accessControl.validateAccess('add_pupil', {});
      this.assertTrue(typeof validation === 'object', 'Should return validation object');
      this.assertTrue(validation.allowed !== undefined, 'Should have allowed property');

      // Test 3: Tier access checking
      const tierCheck = accessControl.checkTierAccess('monitor_slots', 'starter');
      this.assertTrue(typeof tierCheck === 'object', 'Should return tier check object');
      this.assertTrue(tierCheck.allowed !== undefined, 'Should have allowed property');

      // Test 4: Required tier determination
      const requiredTier = accessControl.getRequiredTier('auto_book');
      this.assertEqual(requiredTier, 'premium', 'Auto-book should require premium tier');

      console.log('✅ Access Control Manager tests completed');

    } catch (error) {
      console.error('❌ Access Control Manager test error:', error);
      this.failedTests++;
    }
  }

  /**
   * Test Integration
   */
  async testIntegration() {
    console.log('\n🔗 Testing Integration...');

    try {
      const integration = new ExtensionIntegration();

      // Test 1: Integration initialization
      const initialized = await integration.initialize();
      this.assertTrue(initialized, 'Should initialize extension integration');

      // Test 2: Message handling setup
      this.assertTrue(integration.accessControl !== null, 'Should have access control instance');

      console.log('✅ Integration tests completed');

    } catch (error) {
      console.error('❌ Integration test error:', error);
      this.failedTests++;
    }
  }

  /**
   * Test Usage Monitoring
   */
  async testUsageMonitoring() {
    console.log('\n📊 Testing Usage Monitoring...');

    try {
      const usageMonitor = new UsageMonitor();

      // Test 1: Usage limit checking
      const limitCheck = await usageMonitor.checkUsageLimits('test-user', 'starter', 'add_pupil', {});
      this.assertTrue(typeof limitCheck === 'object', 'Should return limit check object');
      this.assertTrue(limitCheck.allowed !== undefined, 'Should have allowed property');

      // Test 2: Tier limits
      const starterLimits = usageMonitor.getTierLimits('starter');
      this.assertEqual(starterLimits.pupils, 3, 'Starter should allow 3 pupils');
      this.assertEqual(starterLimits.dailyBookings, 2, 'Starter should allow 2 daily bookings');

      // Test 3: Usage stats
      const usageStats = await usageMonitor.getUsageStats('test-user');
      this.assertTrue(typeof usageStats === 'object', 'Should return usage stats');
      this.assertTrue(usageStats.pupils !== undefined, 'Should have pupils count');

      console.log('✅ Usage Monitoring tests completed');

    } catch (error) {
      console.error('❌ Usage Monitoring test error:', error);
      this.failedTests++;
    }
  }

  /**
   * Assertion helpers
   */
  assertTrue(condition, message) {
    this.totalTests++;
    if (condition) {
      this.passedTests++;
      console.log(`✅ ${message}`);
    } else {
      this.failedTests++;
      console.error(`❌ ${message}`);
      this.testResults.push({ status: 'failed', message });
    }
  }

  assertFalse(condition, message) {
    this.totalTests++;
    if (!condition) {
      this.passedTests++;
      console.log(`✅ ${message}`);
    } else {
      this.failedTests++;
      console.error(`❌ ${message}`);
      this.testResults.push({ status: 'failed', message });
    }
  }

  assertEqual(actual, expected, message) {
    this.totalTests++;
    if (actual === expected) {
      this.passedTests++;
      console.log(`✅ ${message}`);
    } else {
      this.failedTests++;
      console.error(`❌ ${message} (Expected: ${expected}, Got: ${actual})`);
      this.testResults.push({ status: 'failed', message, expected, actual });
    }
  }

  /**
   * Print test results summary
   */
  printTestResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.totalTests}`);
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`📈 Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);

    if (this.failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.filter(r => r.status === 'failed').forEach(result => {
        console.log(`  - ${result.message}`);
      });
    }

    if (this.passedTests === this.totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! Access control system is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the implementation.');
    }

    console.log('\n' + '='.repeat(50));
  }
}

// Mock Chrome API for testing
if (typeof chrome === 'undefined') {
  global.chrome = {
    storage: {
      local: {
        get: async () => ({ }),
        set: async () => {},
        remove: async () => {}
      }
    },
    runtime: {
      sendMessage: async () => ({ success: true }),
      onMessage: {
        addListener: () => {}
      }
    },
    notifications: {
      create: () => {}
    }
  };
}

// Mock document for Node.js testing
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({
      style: {},
      appendChild: () => {},
      remove: () => {},
      addEventListener: () => {},
      querySelector: () => null
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    getElementById: () => null,
    querySelector: () => null,
    getElementsByTagName: () => []
  };

  global.window = {
    location: { pathname: '' },
    open: () => {},
    AudioContext: function() {
      this.createOscillator = () => ({
        connect: () => {},
        start: () => {},
        stop: () => {},
        type: ''
      });
      this.createAnalyser = () => ({});
      this.createGain = () => ({
        connect: () => {},
        gain: { setValueAtTime: () => {} }
      });
      this.createScriptProcessor = () => ({
        connect: () => {},
        onaudioprocess: null
      });
      this.currentTime = 0;
      this.close = () => {};
    },
    webkitAudioContext: function() {}
  };

  global.navigator = {
    userAgent: 'Mozilla/5.0 Test Browser',
    language: 'en-US',
    platform: 'TestPlatform',
    cookieEnabled: true,
    doNotTrack: '1',
    hardwareConcurrency: 4,
    deviceMemory: 8,
    maxTouchPoints: 0,
    plugins: [],
    connection: {
      effectiveType: '4g',
      downlink: 10
    }
  };

  global.screen = {
    width: 1920,
    height: 1080,
    colorDepth: 24,
    orientation: { type: 'landscape-primary' }
  };

  global.Intl = {
    DateTimeFormat: () => ({
      resolvedOptions: () => ({ timeZone: 'America/New_York' })
    })
  };
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const testSuite = new AccessControlTestSuite();
  testSuite.runAllTests();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessControlTestSuite;
} else {
  window.AccessControlTestSuite = AccessControlTestSuite;
}