/**
 * DVSA Auto-Booking Engine
 * 
 * Handles complete DVSA booking automation:
 * - Form filling
 * - Calendar navigation
 * - Slot selection
 * - Booking confirmation
 * - Error handling
 * 
 * Integrates with:
 * - stealth-manager.js (human-like behavior)
 * - background.js (coordination)
 */

class DVSAAutoBooking {
  constructor() {
    this.baseURL = 'https://driverpracticaltest.dvsa.gov.uk';
    this.currentStep = 0;
    this.maxRetries = 3;
  }

  /**
   * Main entry point - perform complete auto-booking
   */
  async performAutoBooking(slot, monitor) {
    console.log('🚀 Starting auto-booking for', monitor.name);
    console.log('📅 Slot:', slot);
    
    try {
      // Step 1: Detect current page
      const currentPage = this.detectPageType();
      console.log('📍 Current page:', currentPage);
      
      // Step 2: Navigate to booking change page if needed
      if (currentPage !== 'change-booking') {
        await this.navigateToChangeBooking();
      }
      
      // Step 3: Fill in license details
      await this.fillLicenseDetails(monitor);
      
      // Step 4: Select test centre
      await this.selectTestCentre(slot.centre);
      
      // Step 5: Navigate calendar and select date
      await this.selectDate(slot.date);
      
      // Step 6: Select time slot
      await this.selectTimeSlot(slot.time);
      
      // Step 7: Review booking (don't auto-confirm - let user review)
      this.highlightConfirmButton();
      
      console.log('✅ Auto-booking complete - Ready for user confirmation');
      
      return {
        success: true,
        message: 'Booking form filled - Please review and confirm',
        readyForConfirmation: true
      };
      
    } catch (error) {
      console.error('❌ Auto-booking failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Detect current DVSA page type
   */
  detectPageType() {
    const url = window.location.href;
    
    if (url.includes('/login')) return 'login';
    if (url.includes('/change-booking')) return 'change-booking';
    if (url.includes('/select-test-centre')) return 'select-centre';
    if (url.includes('/choose-appointment')) return 'choose-appointment';
    if (url.includes('/confirm-appointment')) return 'confirm';
    
    return 'unknown';
  }

  /**
   * Navigate to change booking page
   */
  async navigateToChangeBooking() {
    console.log('🧭 Navigating to change booking page...');
    
    // Look for "Change your test" link
    const changeLink = Array.from(document.querySelectorAll('a')).find(a => 
      a.textContent.includes('Change') && a.textContent.includes('test')
    );
    
    if (changeLink) {
      await this.clickElementWithDelay(changeLink, 500);
      await this.waitForNavigation();
    } else {
      // Direct navigation
      window.location.href = `${this.baseURL}/manage-change-cancel`;
      await this.waitForNavigation();
    }
  }

  /**
   * Fill in license details
   */
  async fillLicenseDetails(monitor) {
    console.log('📝 Filling license details...');
    
    // Wait for form to be ready
    await this.waitForElement('#driving-licence-number', 5000);
    
    const licenseField = document.querySelector('#driving-licence-number');
    if (!licenseField) {
      throw new Error('License number field not found');
    }
    
    // Clear existing value
    licenseField.value = '';
    
    // Type license number with human-like timing
    await this.typeHumanLike(licenseField, monitor.licence);
    
    // Trigger change event
    licenseField.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('✅ License details filled');
  }

  /**
   * Select test centre from dropdown
   */
  async selectTestCentre(centreName) {
    console.log('📍 Selecting test centre:', centreName);
    
    await this.waitForElement('#test-centre-select', 5000);
    
    const centreSelect = document.querySelector('#test-centre-select');
    if (!centreSelect) {
      throw new Error('Test centre dropdown not found');
    }
    
    // Find option matching centre name
    const option = Array.from(centreSelect.options).find(opt => 
      opt.text.includes(centreName) || opt.value.includes(centreName)
    );
    
    if (option) {
      centreSelect.value = option.value;
      centreSelect.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Click continue button
      await this.delay(300);
      const continueBtn = document.querySelector('button[type="submit"]');
      if (continueBtn) {
        await this.clickElementWithDelay(continueBtn, 500);
      }
      
      console.log('✅ Test centre selected');
    } else {
      throw new Error(`Test centre "${centreName}" not found in dropdown`);
    }
  }

  /**
   * Select date from calendar
   */
  async selectDate(targetDate) {
    console.log('📅 Selecting date:', targetDate);
    
    await this.waitForElement('.calendar', 5000);
    
    // Parse target date
    const [year, month, day] = targetDate.split('-');
    
    // Navigate calendar to correct month
    await this.navigateToMonth(parseInt(year), parseInt(month));
    
    // Find and click date button
    const dateButtons = document.querySelectorAll('.calendar button[data-date]');
    const targetButton = Array.from(dateButtons).find(btn => {
      const btnDate = btn.getAttribute('data-date');
      return btnDate === targetDate;
    });
    
    if (targetButton) {
      await this.clickElementWithDelay(targetButton, 500);
      console.log('✅ Date selected');
    } else {
      throw new Error(`Date ${targetDate} not available in calendar`);
    }
  }

  /**
   * Navigate calendar to specific month
   */
  async navigateToMonth(targetYear, targetMonth) {
    let attempts = 0;
    const maxAttempts = 12;
    
    while (attempts < maxAttempts) {
      // Get current month display
      const monthDisplay = document.querySelector('.calendar-month');
      if (!monthDisplay) break;
      
      const displayText = monthDisplay.textContent;
      // Parse displayed month/year
      // If match, done
      // If before target, click next
      // If after target, click previous
      
      // Simplified: click next a few times (real impl would parse and navigate accurately)
      const nextBtn = document.querySelector('.calendar-next');
      if (nextBtn && attempts < 3) {
        await this.clickElementWithDelay(nextBtn, 300);
      }
      
      attempts++;
      await this.delay(200);
    }
  }

  /**
   * Select time slot
   */
  async selectTimeSlot(targetTime) {
    console.log('🕐 Selecting time:', targetTime);
    
    await this.waitForElement('.time-slots', 3000);
    
    // Find button matching target time
    const timeButtons = document.querySelectorAll('.time-slots button');
    const targetButton = Array.from(timeButtons).find(btn => 
      btn.textContent.includes(targetTime)
    );
    
    if (targetButton) {
      await this.clickElementWithDelay(targetButton, 500);
      console.log('✅ Time slot selected');
    } else {
      throw new Error(`Time slot ${targetTime} not found`);
    }
  }

  /**
   * Highlight confirm button for user review
   */
  highlightConfirmButton() {
    const confirmBtn = document.querySelector('#confirm-booking, button[name="confirm"]');
    if (confirmBtn) {
      // Add visual highlight
      confirmBtn.style.cssText += `
        animation: pulse 1s infinite;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
        border: 3px solid #10b981;
      `;
      
      // Add CSS animation
      if (!document.getElementById('booking-highlight-style')) {
        const style = document.createElement('style');
        style.id = 'booking-highlight-style';
        style.textContent = `
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Scroll into view
      confirmBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      console.log('✨ Confirm button highlighted for user review');
    }
  }

  /**
   * Type text with human-like timing
   */
  async typeHumanLike(element, text) {
    element.focus();
    
    for (let char of text) {
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Random delay between keystrokes (50-150ms)
      await this.delay(50 + Math.random() * 100);
    }
    
    // Blur after typing
    await this.delay(200);
    element.blur();
  }

  /**
   * Click element with human-like delay
   */
  async clickElementWithDelay(element, delayMs = 300) {
    // Scroll into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Wait for scroll
    await this.delay(300);
    
    // Hover simulation
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await this.delay(100);
    
    // Click
    element.click();
    
    // Wait after click
    await this.delay(delayMs);
  }

  /**
   * Wait for element to appear
   */
  async waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      
      await this.delay(100);
    }
    
    throw new Error(`Element ${selector} not found within ${timeout}ms`);
  }

  /**
   * Wait for page navigation
   */
  async waitForNavigation(timeout = 5000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkReady = setInterval(() => {
        if (document.readyState === 'complete' || Date.now() - startTime > timeout) {
          clearInterval(checkReady);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Simple delay utility
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize and listen for messages
const autoBooking = new DVSAAutoBooking();

// Listen for auto-booking requests from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'autoBook') {
    console.log('📨 Auto-booking request received:', message);
    
    // Perform booking asynchronously
    autoBooking.performAutoBooking(message.slot, message.monitor)
      .then(result => {
        console.log('✅ Auto-booking result:', result);
        sendResponse(result);
      })
      .catch(error => {
        console.error('❌ Auto-booking error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep message channel open for async response
  }
  
  // Handle other messages
  return false;
});

console.log('✅ DVSA Auto-Booking Engine loaded');

