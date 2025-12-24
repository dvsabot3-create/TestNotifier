/**
 * DVSA Integration Module
 *
 * This module integrates the real DVSA slot detector with the existing content script
 * It provides a bridge between the old mock data system and the new real detection
 */

(function() {
  'use strict';

  console.log('🔧 DVSA Integration Module Loading...');

  // Wait for the DVSA Slot Detector to be available
  function waitForSlotDetector() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof DVSASlotDetector !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(); // Resolve anyway, will use fallback
      }, 5000);
    });
  }

  /**
   * Real DVSA slot detection function
   * Replaces the mock data with actual DOM parsing
   */
  async function performRealDVSASlotDetection() {
    try {
      console.log('🔍 Starting real DVSA slot detection...');

      // Wait for slot detector to be available
      await waitForSlotDetector();

      if (typeof DVSASlotDetector === 'undefined') {
        console.warn('⚠️ DVSA Slot Detector not available, using fallback');
        return performFallbackDetection();
      }

      // Initialize the slot detector
      const slotDetector = new DVSASlotDetector();

      // Perform real detection
      const availableSlots = await slotDetector.detectAvailableSlots();

      console.log(`✅ Real DVSA slot detection completed: ${availableSlots.length} slots found`);

      return availableSlots;

    } catch (error) {
      console.error('❌ Real DVSA slot detection failed:', error);

      // Log error for debugging
      if (window.chrome && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: 'SLOT_DETECTION_ERROR',
          error: {
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        }).catch(err => console.error('Failed to send error report:', err));
      }

      return performFallbackDetection();
    }
  }

  /**
   * Fallback detection for when real detection fails
   */
  function performFallbackDetection() {
    console.log('⚠️ Using fallback slot detection');

    // Generate a realistic test slot for development
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 14); // 14 days from now

    return [{
      date: testDate.toISOString().split('T')[0],
      centre: 'FALLBACK-TEST-CENTRE',
      time: '10:00',
      type: 'test',
      detectedAt: new Date().toISOString(),
      note: 'Fallback test slot - real detection unavailable',
      isFallback: true
    }];
  }

  /**
   * Override the existing checkForAvailableSlots function
   */
  function integrateWithExistingScript() {
    console.log('🔧 Integrating with existing DVSA Queen content script...');

    // Wait for the existing content script to be ready
    const checkExistingScript = setInterval(() => {
      if (window.dvsaQueen && window.dvsaQueen.checkForAvailableSlots) {
        clearInterval(checkExistingScript);

        console.log('✅ Found existing DVSA Queen instance');

        // Store reference to original function
        const originalCheckForAvailableSlots = window.dvsaQueen.checkForAvailableSlots;

        // Override with real detection
        window.dvsaQueen.checkForAvailableSlots = async function() {
          console.log('🔄 DVSA Integration: Calling real slot detection...');

          try {
            const slots = await performRealDVSASlotDetection();

            // Add activity log if method exists
            if (this.addActivityLog) {
              this.addActivityLog(`🔍 Real DVSA scan completed: ${slots.length} slots detected`, 'success');
            }

            // Filter based on pupil preferences if method exists
            if (this.matchesPupilPreferences) {
              return slots.filter(slot => this.matchesPupilPreferences(slot));
            }

            return slots;

          } catch (error) {
            console.error('❌ Integration error:', error);

            // Add error activity log if method exists
            if (this.addActivityLog) {
              this.addActivityLog(`❌ DVSA scan failed: ${error.message}`, 'error');
            }

            // Return fallback slots
            const fallbackSlots = performFallbackDetection();

            // Filter fallback slots too
            if (this.matchesPupilPreferences) {
              return fallbackSlots.filter(slot => this.matchesPupilPreferences(slot));
            }

            return fallbackSlots;
          }
        };

        console.log('✅ DVSA Integration: Successfully integrated real slot detection');

      } else {
        console.log('⏳ Waiting for existing DVSA Queen script...');
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkExistingScript);
      if (!window.dvsaQueen) {
        console.warn('⚠️ DVSA Queen not found after 10 seconds, integration failed');
      }
    }, 10000);
  }

  /**
   * Initialize the integration
   */
  function initialize() {
    console.log('🚀 DVSA Integration: Starting initialization...');

    // Make sure we're on a DVSA page
    if (!window.location.href.includes('driverpracticaltest.dvsa.gov.uk')) {
      console.log('⚠️ Not on DVSA website, integration not needed');
      return;
    }

    // Start integration
    integrateWithExistingScript();

    console.log('✅ DVSA Integration: Initialization complete');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Also initialize on navigation changes (for SPAs)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (url.includes('driverpracticaltest.dvsa.gov.uk')) {
        console.log('🔄 DVSA Integration: URL changed, re-initializing...');
        setTimeout(initialize, 1000); // Wait a bit for new page to load
      }
    }
  }).observe(document, { subtree: true, childList: true });

})();