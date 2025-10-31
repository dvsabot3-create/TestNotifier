/**
 * DVSA Automation Engine
 * Complete booking flow with advanced stealth and human-like behavior
 * Based on research of DVSA detection methods and competitor analysis
 */

class DVSAAutomationEngine {
  constructor() {
    this.stealthMode = true;
    this.detectionRisk = 'LOW';
    this.sessionMetrics = {
      checks: 0,
      successes: 0,
      failures: 0,
      startTime: Date.now()
    };

    // Anti-detection configurations from research
    this.antiDetection = {
      // Avoid WebDriver detection
      removeWebDriverFlag: true,
      // Randomize navigator properties
      randomizeNavigator: true,
      // Human-like timing
      humanTiming: true,
      // Mouse movement simulation
      mouseSimulation: true,
      // Canvas fingerprint randomization
      canvasNoise: true,
      // WebGL fingerprint randomization
      webglNoise: true,
      // Audio context fingerprint
      audioNoise: true
    };

    this.dvsa = {
      baseUrl: 'https://driverpracticaltest.dvsa.gov.uk',
      selectors: this.getDVSASelectors(),
      endpoints: this.getDVSAEndpoints()
    };
  }

  /**
   * Get DVSA page selectors (updated for current DVSA website structure)
   */
  getDVSASelectors() {
    return {
      // Login page
      login: {
        licenceNumber: 'input[name="driving-licence-number"]',
        email: 'input[type="email"]',
        submitButton: 'button[type="submit"], input[type="submit"]'
      },

      // Current booking page
      currentBooking: {
        testDate: '.booking-date, .test-date, [data-test="booking-date"]',
        testTime: '.booking-time, .test-time, [data-test="booking-time"]',
        testCentre: '.booking-centre, .test-centre, [data-test="test-centre"]',
        changeButton: 'button:contains("Change"), a:contains("Change")'
      },

      // Change booking page
      changeBooking: {
        centreSelect: 'select[name="test-centre"], #test-centre',
        dateCalendar: '.calendar, .date-picker, [data-test="calendar"]',
        availableSlots: '.available, .slot-available, [data-available="true"]',
        timeSlots: '.time-slot, .available-time',
        continueButton: 'button:contains("Continue"), #continue'
      },

      // Confirmation page
      confirmation: {
        newDate: '.new-date, [data-test="new-date"]',
        confirmButton: 'button:contains("Confirm"), #confirm',
        successMessage: '.success, .confirmation'
      }
    };
  }

  /**
   * Get DVSA API endpoints
   */
  getDVSAEndpoints() {
    return {
      checkAvailability: '/check-for-available-tests',
      changeBooking: '/change-booking',
      confirmChange: '/confirm-change'
    };
  }

  /**
   * Initialize stealth mode - apply all anti-detection measures
   */
  async initializeStealth() {
    console.log('🕵️ Initializing stealth mode...');

    if (this.antiDetection.removeWebDriverFlag) {
      await this.removeWebDriverDetection();
    }

    if (this.antiDetection.randomizeNavigator) {
      await this.randomizeNavigatorProperties();
    }

    if (this.antiDetection.canvasNoise) {
      await this.addCanvasNoise();
    }

    if (this.antiDetection.webglNoise) {
      await this.addWebGLNoise();
    }

    console.log('✅ Stealth mode active');
  }

  /**
   * Remove WebDriver detection flags
   */
  async removeWebDriverDetection() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.textContent = `
        // Override webdriver detection
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined
        });
        
        // Override automation flags
        delete navigator.__proto__.webdriver;
        
        // Override Chrome detection
        Object.defineProperty(navigator, 'chrome', {
          get: () => true
        });
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' 
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters)
        );
        
        // Override plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [
            { name: 'Chrome PDF Plugin' },
            { name: 'Chrome PDF Viewer' },
            { name: 'Native Client' }
          ]
        });
        
        // Override language
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-GB', 'en-US', 'en']
        });
      `;

      (document.head || document.documentElement).appendChild(script);
      script.remove();
      resolve();
    });
  }

  /**
   * Randomize navigator properties to avoid fingerprinting
   */
  async randomizeNavigatorProperties() {
    const script = document.createElement('script');
    script.textContent = `
      // Randomize screen resolution slightly
      const originalScreen = window.screen;
      Object.defineProperty(window, 'screen', {
        get: () => ({
          ...originalScreen,
          availWidth: originalScreen.availWidth + Math.floor(Math.random() * 10 - 5),
          availHeight: originalScreen.availHeight + Math.floor(Math.random() * 10 - 5)
        })
      });
      
      // Randomize hardware concurrency
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 4 + Math.floor(Math.random() * 5)
      });
      
      // Randomize device memory
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 4 + Math.floor(Math.random() * 5) * 2
      });
    `;

    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  /**
   * Add noise to canvas fingerprinting
   */
  async addCanvasNoise() {
    const script = document.createElement('script');
    script.textContent = `
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      const originalToBlob = HTMLCanvasElement.prototype.toBlob;
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      
      const addCanvasNoise = (canvas) => {
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Add minimal noise to avoid detection
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] += Math.floor(Math.random() * 3 - 1);     // R
          imageData.data[i + 1] += Math.floor(Math.random() * 3 - 1); // G
          imageData.data[i + 2] += Math.floor(Math.random() * 3 - 1); // B
        }
        
        context.putImageData(imageData, 0, 0);
      };
      
      HTMLCanvasElement.prototype.toDataURL = function() {
        if (this.width > 0 && this.height > 0) {
          addCanvasNoise(this);
        }
        return originalToDataURL.apply(this, arguments);
      };
    `;

    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  /**
   * Add noise to WebGL fingerprinting
   */
  async addWebGLNoise() {
    const script = document.createElement('script');
    script.textContent = `
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        // Add slight randomization to WebGL parameters
        const result = getParameter.apply(this, arguments);
        
        if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
          return 'Google Inc.';
        }
        if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
          const renderers = [
            'ANGLE (Intel(R) HD Graphics 630 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (AMD Radeon RX 5600 XT Direct3D11 vs_5_0 ps_5_0)'
          ];
          return renderers[Math.floor(Math.random() * renderers.length)];
        }
        
        return result;
      };
    `;

    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  /**
   * Human-like page interaction before automation
   */
  async performHumanLikeInteractions() {
    console.log('👤 Performing human-like interactions...');

    // Random scroll
    const scrollAmount = Math.floor(Math.random() * 200 + 50);
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth'
    });
    await this.randomDelay(800, 1500);

    // Mouse movement simulation
    await this.simulateMouseMovement();
    await this.randomDelay(500, 1200);

    // Scroll back up
    window.scrollBy({
      top: -scrollAmount / 2,
      behavior: 'smooth'
    });
    await this.randomDelay(600, 1000);

    console.log('✅ Human-like interactions complete');
  }

  /**
   * Simulate realistic mouse movements
   */
  async simulateMouseMovement() {
    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: Math.floor(Math.random() * window.innerWidth),
      clientY: Math.floor(Math.random() * window.innerHeight)
    });
    document.dispatchEvent(mouseMoveEvent);
  }

  /**
   * Complete DVSA booking check flow with stealth
   */
  async checkForAvailability(pupilDetails, preferences) {
    console.log('🔍 Starting availability check with stealth mode...');

    try {
      // Pre-check stealth measures
      await this.initializeStealth();
      await this.performHumanLikeInteractions();

      // Check current booking
      const currentBooking = await this.getCurrentBooking();

      if (!currentBooking) {
        console.log('❌ No current booking found');
        return { success: false, reason: 'No current booking' };
      }

      console.log('📅 Current booking:', currentBooking);

      // Navigate to change booking page with stealth
      await this.navigateToChangePage();

      // Search for earlier slots
      const availableSlots = await this.searchAvailableSlots(
        currentBooking,
        preferences
      );

      if (availableSlots.length === 0) {
        console.log('📭 No earlier slots available');
        return { success: true, slotsFound: 0, slots: [] };
      }

      console.log(`🎯 Found ${availableSlots.length} available slots`);

      return {
        success: true,
        slotsFound: availableSlots.length,
        slots: availableSlots,
        currentBooking: currentBooking
      };

    } catch (error) {
      console.error('❌ Error during availability check:', error);
      this.sessionMetrics.failures++;
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current booking details from DVSA page
   */
  async getCurrentBooking() {
    console.log('📖 Reading current booking details...');

    // Human-like delay before reading
    await this.randomDelay(1000, 2000);

    const selectors = this.dvsa.selectors.currentBooking;

    try {
      const dateElement = document.querySelector(selectors.testDate);
      const timeElement = document.querySelector(selectors.testTime);
      const centreElement = document.querySelector(selectors.testCentre);

      if (!dateElement) {
        // Try alternative selectors
        const booking = this.extractBookingFromPage();
        if (booking) return booking;

        throw new Error('Cannot find current booking on page');
      }

      const booking = {
        date: dateElement.textContent.trim(),
        time: timeElement?.textContent.trim() || '',
        centre: centreElement?.textContent.trim() || '',
        dateObj: this.parseDate(dateElement.textContent.trim())
      };

      console.log('✅ Current booking extracted:', booking);
      return booking;

    } catch (error) {
      console.error('❌ Error getting current booking:', error);
      return null;
    }
  }

  /**
   * Extract booking from page content (fallback method)
   */
  extractBookingFromPage() {
    const pageText = document.body.innerText;

    // Look for date patterns
    const datePattern = /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i;
    const timePattern = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;

    const dateMatch = pageText.match(datePattern);
    const timeMatch = pageText.match(timePattern);

    if (dateMatch) {
      return {
        date: dateMatch[0],
        time: timeMatch ? timeMatch[0] : '',
        centre: '',
        dateObj: new Date(dateMatch[0])
      };
    }

    return null;
  }

  /**
   * Navigate to change booking page
   */
  async navigateToChangePage() {
    console.log('🧭 Navigating to change booking page...');

    const changeButton = document.querySelector(this.dvsa.selectors.currentBooking.changeButton);

    if (!changeButton) {
      throw new Error('Change booking button not found');
    }

    // Human-like thinking before clicking
    await this.humanThinkingDelay('decision');

    // Simulate mouse movement to button
    await this.simulateMouseToElement(changeButton);

    // Click with human-like precision
    await this.humanClick(changeButton);

    // Wait for navigation
    await this.waitForNavigation();

    console.log('✅ Navigated to change booking page');
  }

  /**
   * Search for available earlier slots
   */
  async searchAvailableSlots(currentBooking, preferences) {
    console.log('🔍 Searching for earlier available slots...');

    const availableSlots = [];

    try {
      // Wait for calendar to load
      await this.waitForElement(this.dvsa.selectors.changeBooking.dateCalendar, 5000);

      // Human-like delay before interacting
      await this.humanThinkingDelay('reading');

      // Get all available date elements
      const availableDates = document.querySelectorAll(
        this.dvsa.selectors.changeBooking.availableSlots
      );

      console.log(`📅 Found ${availableDates.length} dates with availability`);

      for (const dateElement of availableDates) {
        // Extract date from element
        const dateStr = this.extractDateFromElement(dateElement);
        const slotDate = this.parseDate(dateStr);

        // Check if this date is earlier than current booking
        if (slotDate < currentBooking.dateObj) {
          // Human-like delay between checks
          await this.randomDelay(300, 800);

          // Click to view times for this date
          await this.humanClick(dateElement);
          await this.randomDelay(500, 1200);

          // Get available times
          const times = await this.getAvailableTimesForDate(dateStr);

          if (times.length > 0) {
            availableSlots.push({
              date: dateStr,
              dateObj: slotDate,
              times: times,
              monthsEarlier: this.calculateMonthsDifference(slotDate, currentBooking.dateObj)
            });

            console.log(`🎯 Earlier slot found: ${dateStr} (${times.length} times)`);
          }
        }

        // Stop if we've found enough slots (don't appear too eager)
        if (availableSlots.length >= 5) {
          console.log('✓ Found sufficient slots, stopping search');
          break;
        }
      }

    } catch (error) {
      console.error('❌ Error searching for slots:', error);
    }

    return availableSlots;
  }

  /**
   * Get available times for a specific date
   */
  async getAvailableTimesForDate(date) {
    console.log(`🕐 Getting available times for ${date}...`);

    const times = [];

    try {
      const timeElements = document.querySelectorAll(
        this.dvsa.selectors.changeBooking.timeSlots
      );

      timeElements.forEach((timeEl) => {
        const timeStr = timeEl.textContent.trim();
        if (timeStr && this.isValidTimeFormat(timeStr)) {
          times.push(timeStr);
        }
      });

    } catch (error) {
      console.error('❌ Error getting times:', error);
    }

    return times;
  }

  /**
   * Execute complete booking change with stealth
   */
  async executeBookingChange(newSlot, pupilDetails) {
    console.log('🎯 Executing booking change with full stealth...');

    try {
      // Pre-execution human behavior
      await this.humanThinkingDelay('important');
      await this.performHumanLikeInteractions();

      // Step 1: Select the new date
      await this.selectDate(newSlot.date);
      await this.randomDelay(1000, 2000);

      // Step 2: Select the time
      await this.selectTime(newSlot.time);
      await this.randomDelay(800, 1500);

      // Step 3: Click continue
      await this.clickContinueButton();
      await this.waitForNavigation();

      // Step 4: Review changes (human-like)
      await this.reviewChanges(newSlot);
      await this.randomDelay(2000, 4000);

      // Step 5: Confirm booking change
      const success = await this.confirmBookingChange();

      if (success) {
        console.log('✅ Booking changed successfully!');
        this.sessionMetrics.successes++;

        // Notify backend
        await this.notifyBackend('booking_changed', {
          oldDate: pupilDetails.currentBooking.date,
          newDate: newSlot.date,
          newTime: newSlot.time,
          pupil: pupilDetails.licenceNumber
        });

        return { success: true, newBooking: newSlot };
      } else {
        throw new Error('Booking confirmation failed');
      }

    } catch (error) {
      console.error('❌ Booking change failed:', error);
      this.sessionMetrics.failures++;
      return { success: false, error: error.message };
    }
  }

  /**
   * Select date with human-like interaction
   */
  async selectDate(dateStr) {
    console.log(`📅 Selecting date: ${dateStr}`);

    // Find the date element
    const dateElements = document.querySelectorAll('[data-date], .calendar-day, .available');

    for (const el of dateElements) {
      if (el.textContent.includes(dateStr) || el.dataset.date === dateStr) {
        await this.humanClick(el);
        return true;
      }
    }

    throw new Error(`Date ${dateStr} not found`);
  }

  /**
   * Select time with human-like interaction
   */
  async selectTime(timeStr) {
    console.log(`🕐 Selecting time: ${timeStr}`);

    const timeElements = document.querySelectorAll('.time-slot, .available-time, [data-time]');

    for (const el of timeElements) {
      if (el.textContent.includes(timeStr) || el.dataset.time === timeStr) {
        await this.humanClick(el);
        return true;
      }
    }

    throw new Error(`Time ${timeStr} not found`);
  }

  /**
   * Click continue button
   */
  async clickContinueButton() {
    console.log('➡️ Clicking continue button...');

    const continueBtn = document.querySelector(this.dvsa.selectors.changeBooking.continueButton);

    if (!continueBtn) {
      throw new Error('Continue button not found');
    }

    await this.humanClick(continueBtn);
  }

  /**
   * Review changes before confirming (human-like behavior)
   */
  async reviewChanges(newSlot) {
    console.log('👀 Reviewing changes...');

    // Humans read confirmation pages
    await this.humanThinkingDelay('reading');

    // Scroll to see all details
    window.scrollBy({ top: 100, behavior: 'smooth' });
    await this.randomDelay(1000, 2000);

    window.scrollBy({ top: -50, behavior: 'smooth' });
    await this.randomDelay(500, 1000);

    console.log('✅ Review complete');
  }

  /**
   * Confirm booking change
   */
  async confirmBookingChange() {
    console.log('✅ Confirming booking change...');

    const confirmBtn = document.querySelector(this.dvsa.selectors.confirmation.confirmButton);

    if (!confirmBtn) {
      throw new Error('Confirm button not found');
    }

    // Final thinking delay (this is an important decision)
    await this.humanThinkingDelay('important');

    await this.humanClick(confirmBtn);
    await this.waitForNavigation();

    // Check for success message
    const successElement = document.querySelector(this.dvsa.selectors.confirmation.successMessage);

    if (successElement) {
      console.log('✅ Success message found - booking confirmed!');
      return true;
    }

    return false;
  }

  /**
   * Human-like click with realistic timing and movement
   */
  async humanClick(element) {
    if (!element) {
      throw new Error('Element not found for clicking');
    }

    // Simulate mouse movement to element
    await this.simulateMouseToElement(element);

    // Add realistic pre-click delay
    await this.randomDelay(150, 400);

    // Dispatch realistic click events
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + (Math.random() * 10 - 5);
    const y = rect.top + rect.height / 2 + (Math.random() * 10 - 5);

    // Mouse events
    element.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
    }));

    await this.randomDelay(50, 150); // Realistic click duration

    element.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
    }));

    element.dispatchEvent(new MouseEvent('click', {
      bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
    }));

    // Focus if input
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
      element.focus();
    }

    console.log('🖱️ Element clicked:', element.tagName);

    // Post-click delay
    await this.randomDelay(200, 500);
  }

  /**
   * Simulate mouse movement to an element
   */
  async simulateMouseToElement(element) {
    const rect = element.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    // Dispatch multiple mousemove events along a curved path
    const steps = 5 + Math.floor(Math.random() * 10);
    const currentX = Math.random() * window.innerWidth;
    const currentY = Math.random() * window.innerHeight;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = currentX + (targetX - currentX) * t;
      const y = currentY + (targetY - currentY) * t;

      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
      }));

      await this.randomDelay(20, 80);
    }
  }

  /**
   * Human thinking delays based on complexity
   */
  async humanThinkingDelay(type = 'simple') {
    const delays = {
      simple: [800, 2000],      // Quick decisions
      reading: [1500, 3500],    // Reading content
      decision: [2000, 4500],   // Normal decisions
      important: [3000, 7000]  // Important decisions
    };

    const [min, max] = delays[type] || delays.simple;
    await this.randomDelay(min, max);
  }

  /**
   * Random delay with realistic distribution
   */
  async randomDelay(min, max) {
    // Use normal distribution for more human-like timing
    const mean = (min + max) / 2;
    const stdDev = (max - min) / 6;
    const delay = this.normalRandom(mean, stdDev);
    const clampedDelay = Math.max(min, Math.min(max, delay));

    return new Promise((resolve) => setTimeout(resolve, clampedDelay));
  }

  /**
   * Normal/Gaussian random distribution
   */
  normalRandom(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
  }

  /**
   * Wait for element to appear
   */
  async waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
      await this.randomDelay(100, 300);
    }

    throw new Error(`Element ${selector} not found within ${timeout}ms`);
  }

  /**
   * Wait for page navigation
   */
  async waitForNavigation(timeout = 10000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (document.readyState === 'complete' || Date.now() - startTime > timeout) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Parse date string to Date object
   */
  parseDate(dateStr) {
    // Handle UK date formats: "15 January 2025", "15/01/2025", etc.
    const formats = [
      /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{4})-(\d{2})-(\d{2})/
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        return new Date(dateStr);
      }
    }

    return new Date(dateStr);
  }

  /**
   * Check if time format is valid
   */
  isValidTimeFormat(timeStr) {
    return /^\d{1,2}:\d{2}\s*(am|pm)?$/i.test(timeStr.trim());
  }

  /**
   * Calculate months difference between dates
   */
  calculateMonthsDifference(date1, date2) {
    const months = (date2.getFullYear() - date1.getFullYear()) * 12;
    return months + date2.getMonth() - date1.getMonth();
  }

  /**
   * Extract date from element
   */
  extractDateFromElement(element) {
    return element.dataset.date || element.textContent.trim();
  }

  /**
   * Notify backend of events
   */
  async notifyBackend(eventType, data) {
    try {
      await chrome.runtime.sendMessage({
        action: 'notifyBackend',
        eventType: eventType,
        data: data
      });
    } catch (error) {
      console.error('❌ Error notifying backend:', error);
    }
  }

  /**
   * Calculate detection risk based on current session
   */
  calculateDetectionRisk() {
    const { checks, failures } = this.sessionMetrics;
    const failureRate = checks > 0 ? failures / checks : 0;
    const checksPerHour = checks / ((Date.now() - this.sessionMetrics.startTime) / 3600000);

    if (failureRate > 0.3 || checksPerHour > 120) return 'HIGH';
    if (failureRate > 0.15 || checksPerHour > 60) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    return {
      ...this.sessionMetrics,
      detectionRisk: this.calculateDetectionRisk(),
      uptime: Date.now() - this.sessionMetrics.startTime,
      successRate: this.sessionMetrics.checks > 0
        ? (this.sessionMetrics.successes / this.sessionMetrics.checks * 100).toFixed(1) + '%'
        : '0%'
    };
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.DVSAAutomationEngine = DVSAAutomationEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DVSAAutomationEngine;
}

