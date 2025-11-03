/**
 * DVSA Slot Detector - Real Implementation
 * 
 * Parses the actual DVSA booking website to detect available test slots.
 * Handles:
 * - Calendar date parsing
 * - Time slot extraction
 * - Test centre identification
 * - Cancellation vs. new slot detection
 * - Error handling and recovery
 * 
 * Integrated with stealth-manager.js for anti-detection
 */

class DVSASlotDetector {
  constructor() {
    this.baseURL = 'https://driverpracticaltest.dvsa.gov.uk';
    this.maxRetries = 3;
    this.currentPage = null;
    
    // DVSA DOM selectors (updated for 2024-2025 website)
    this.selectors = {
      // Calendar elements
      calendar: {
        container: '.BookingCalendar, .booking-calendar, [data-module="booking-calendar"]',
        datesContainer: '.BookingCalendar-datesContainer, .calendar-dates, .booking-calendar-dates',
        dateCell: '.BookingCalendar-date, .calendar-date, [data-date]',
        availableDate: '[data-available="true"], .date-available, .BookingCalendar-date--bookable',
        unavailableDate: '[data-available="false"], .date-unavailable, .BookingCalendar-date--unavailable',
        selectedDate: '.date-selected, .BookingCalendar-date--selected',
        dateNumber: '.date-number, .BookingCalendar-dateNumber',
        month: '.calendar-month, .BookingCalendar-month, [data-month]',
        year: '.calendar-year, .BookingCalendar-year, [data-year]'
      },
      
      // Time slot elements
      timeSlots: {
        container: '.time-slots, .available-times, [data-module="time-slots"]',
        slot: '.time-slot, .available-time, button[data-time]',
        slotTime: '[data-time], .slot-time',
        selectedSlot: '.time-slot--selected, .selected-time'
      },
      
      // Test centre elements
      testCentre: {
        select: '#test-centre, #testCentre, select[name*="centre"]',
        input: 'input[name*="centre"]',
        display: '.test-centre-name, .centre-name, [data-centre-name]',
        option: 'option[value]'
      },
      
      // Form elements
      forms: {
        bookingReference: '#booking-ref, #bookingReference, input[name*="booking"]',
        licenceNumber: '#driving-licence-number, #licenceNumber',
        confirmButton: 'button[type="submit"], .button-primary, #confirm-booking',
        continueButton: '.button-continue, button:contains("Continue")',
        backButton: '.button-back, button:contains("Back")'
      },
      
      // Page state indicators
      pageStates: {
        loginPage: '#email, #password, .login-form',
        managePage: '.manage-booking, [data-page="manage"]',
        changePage: '.change-booking, [data-page="change"]',
        calendarPage: '.BookingCalendar, .booking-calendar',
        confirmPage: '.confirm-booking, [data-page="confirm"]'
      }
    };
  }

  /**
   * Main detection method - finds all available slots
   */
  async detectAvailableSlots() {
    console.log('🔍 Starting REAL DVSA slot detection...');
    
    try {
      // Step 1: Detect current page type
      this.currentPage = this.detectPageType();
      console.log('📍 Current page:', this.currentPage);
      
      // Step 2: Navigate to calendar if needed
      if (this.currentPage !== 'calendar') {
        const navigated = await this.navigateToCalendar();
        if (!navigated) {
          console.error('❌ Could not navigate to calendar page');
          return this.handleDetectionFailure('Navigation failed');
        }
      }
      
      // Step 3: Wait for calendar to load
      const calendarLoaded = await this.waitForCalendarLoad().catch(err => {
        console.error('❌ Calendar load timeout:', err.message);
        return false;
      });
      
      if (!calendarLoaded) {
        return this.handleDetectionFailure('Calendar did not load');
      }
      
      // Step 4: Extract test centre info
      const testCentre = await this.extractTestCentre();
      console.log('📍 Test centre:', testCentre);
      
      // Step 5: Parse calendar for available dates
      let availableDates = [];
      try {
        availableDates = await this.parseCalendarDates();
      } catch (error) {
        console.warn('⚠️ Primary calendar parse failed, trying alternative method...');
        try {
          availableDates = await this.parseCalendarAlternative();
        } catch (altError) {
          console.error('❌ Both calendar parse methods failed');
          return this.handleDetectionFailure('Calendar parsing failed');
        }
      }
      
      console.log(`📅 Found ${availableDates.length} available dates`);
      
      if (availableDates.length === 0) {
        console.log('ℹ️ No available dates found in calendar');
        return [];
      }
      
      // Step 6: For each date, get time slots
      const allSlots = [];
      const maxDatesToCheck = Math.min(availableDates.length, 10); // Limit to first 10 dates to avoid detection
      
      for (let i = 0; i < maxDatesToCheck; i++) {
        const dateInfo = availableDates[i];
        
        try {
          const timeSlots = await this.getTimeSlotsForDate(dateInfo);
          
          for (const time of timeSlots) {
            allSlots.push({
              date: dateInfo.date,
              time: time.time,
              centre: testCentre.name,
              centreCode: testCentre.code,
              type: dateInfo.isCancellation ? 'cancellation' : 'new',
              available: true,
              detectedAt: new Date().toISOString()
            });
          }
          
          // Add human-like delay between date checks
          if (i < maxDatesToCheck - 1) {
            await this.humanDelay(300, 800);
          }
        } catch (error) {
          console.warn(`⚠️ Could not get time slots for ${dateInfo.date}:`, error.message);
          continue;
        }
      }
      
      // Validate slots before returning
      const validSlots = this.validateSlots(allSlots);
      
      console.log(`✅ DVSA slot detection complete: ${validSlots.length} valid slots found`);
      return validSlots;
      
    } catch (error) {
      console.error('❌ DVSA slot detection failed:', error);
      return this.handleDetectionFailure(error.message);
    }
  }

  /**
   * Handle detection failure gracefully
   */
  handleDetectionFailure(reason) {
    console.error(`❌ Detection failed: ${reason}`);
    
    // Return empty array instead of crashing
    // This allows the extension to continue functioning
    return [];
  }

  /**
   * Detect which DVSA page we're currently on
   */
  detectPageType() {
    const url = window.location.href;
    const path = window.location.pathname;
    
    // Check URL patterns
    if (url.includes('/login') || document.querySelector(this.selectors.pageStates.loginPage)) {
      return 'login';
    }
    
    if (url.includes('/manage') || document.querySelector(this.selectors.pageStates.managePage)) {
      return 'manage';
    }
    
    if (url.includes('/change') || url.includes('/choose-appointment') || 
        document.querySelector(this.selectors.pageStates.calendarPage)) {
      return 'calendar';
    }
    
    if (url.includes('/confirm') || document.querySelector(this.selectors.pageStates.confirmPage)) {
      return 'confirm';
    }
    
    // Try to detect by page content
    if (document.querySelector(this.selectors.calendar.container)) {
      return 'calendar';
    }
    
    return 'unknown';
  }

  /**
   * Navigate to calendar page from current page
   */
  async navigateToCalendar() {
    console.log('🧭 Navigating to calendar page...');
    
    const currentType = this.currentPage;
    
    switch (currentType) {
      case 'login':
        console.warn('⚠️ Still on login page - user needs to login first');
        return false;
        
      case 'manage':
        // Click "Change appointment" or similar link
        const changeLink = Array.from(document.querySelectorAll('a')).find(a => 
          a.textContent.toLowerCase().includes('change') || 
          a.textContent.toLowerCase().includes('reschedule')
        );
        
        if (changeLink) {
          changeLink.click();
          await this.waitForNavigation(3000);
          return true;
        } else {
          // Direct URL navigation
          window.location.href = `${this.baseURL}/manage-change-cancel`;
          await this.waitForNavigation(5000);
          return true;
        }
        
      case 'calendar':
        // Already on calendar
        return true;
        
      case 'unknown':
      default:
        // Try direct navigation
        console.log('🔄 Attempting direct navigation to calendar...');
        window.location.href = `${this.baseURL}/manage-change-cancel`;
        await this.waitForNavigation(5000);
        
        // Verify we reached calendar
        return document.querySelector(this.selectors.calendar.container) !== null;
    }
  }

  /**
   * Wait for calendar to fully load
   */
  async waitForCalendarLoad(timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const calendar = document.querySelector(this.selectors.calendar.container);
      const datesContainer = document.querySelector(this.selectors.calendar.datesContainer);
      
      if (calendar && datesContainer && datesContainer.children.length > 0) {
        console.log('✅ Calendar loaded');
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error('Calendar failed to load within timeout');
  }

  /**
   * Extract test centre information from page
   */
  async extractTestCentre() {
    // Try select dropdown first
    const centreSelect = document.querySelector(this.selectors.testCentre.select);
    if (centreSelect) {
      const selectedOption = centreSelect.options[centreSelect.selectedIndex];
      return {
        code: selectedOption.value,
        name: selectedOption.text.trim()
      };
    }
    
    // Try display element
    const centreDisplay = document.querySelector(this.selectors.testCentre.display);
    if (centreDisplay) {
      const text = centreDisplay.textContent.trim();
      return {
        code: this.extractCentreCode(text),
        name: text
      };
    }
    
    // Try URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const centreParam = urlParams.get('centre') || urlParams.get('testCentre');
    if (centreParam) {
      return {
        code: centreParam,
        name: centreParam
      };
    }
    
    // Fallback
    console.warn('⚠️ Could not determine test centre');
    return {
      code: 'UNKNOWN',
      name: 'Unknown Centre'
    };
  }

  /**
   * Extract test centre code from text
   */
  extractCentreCode(text) {
    // DVSA centres usually have format: "CITY-CODE" or just "CODE"
    const match = text.match(/([A-Z]{2,}(?:-[A-Z]{2,})?)/);
    return match ? match[1] : text.toUpperCase().replace(/\s+/g, '-');
  }

  /**
   * Parse calendar for available dates
   */
  async parseCalendarDates() {
    console.log('📅 Parsing calendar dates...');
    
    const availableDates = [];
    
    // Try multiple selector patterns (DVSA may use different classes)
    let dateCells = document.querySelectorAll(this.selectors.calendar.availableDate);
    
    if (dateCells.length === 0) {
      // Fallback: Find all date cells and check for availability indicators
      dateCells = document.querySelectorAll(this.selectors.calendar.dateCell);
    }
    
    for (const cell of dateCells) {
      try {
        const dateInfo = this.extractDateInfo(cell);
        
        if (dateInfo && dateInfo.available) {
          availableDates.push(dateInfo);
        }
      } catch (error) {
        console.warn('⚠️ Error parsing date cell:', error.message);
        continue;
      }
    }
    
    return availableDates;
  }

  /**
   * Extract date information from calendar cell
   */
  extractDateInfo(cell) {
    // Check if available
    const isAvailable = 
      cell.hasAttribute('data-available') && cell.getAttribute('data-available') === 'true' ||
      cell.classList.contains('date-available') ||
      cell.classList.contains('BookingCalendar-date--bookable') ||
      !cell.classList.contains('date-unavailable');
    
    if (!isAvailable) {
      return null;
    }
    
    // Extract date
    let dateString = null;
    
    // Try data-date attribute
    if (cell.hasAttribute('data-date')) {
      dateString = cell.getAttribute('data-date');
    } 
    // Try data-day/data-month/data-year attributes
    else if (cell.hasAttribute('data-day')) {
      const day = cell.getAttribute('data-day');
      const month = cell.getAttribute('data-month') || this.getCurrentMonth();
      const year = cell.getAttribute('data-year') || new Date().getFullYear();
      dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    // Try extracting from cell content
    else {
      const dateText = cell.textContent.trim();
      const dayMatch = dateText.match(/\d+/);
      if (dayMatch) {
        const day = dayMatch[0];
        const month = this.getCurrentMonthFromCalendar();
        const year = this.getCurrentYearFromCalendar();
        dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
    
    if (!dateString) {
      console.warn('⚠️ Could not extract date from cell');
      return null;
    }
    
    // Detect if cancellation (vs. new slot)
    const isCancellation = 
      cell.classList.contains('cancellation') ||
      cell.classList.contains('BookingCalendar-date--cancellation') ||
      cell.querySelector('.cancellation-indicator') !== null;
    
    return {
      date: dateString,
      available: true,
      isCancellation: isCancellation,
      element: cell
    };
  }

  /**
   * Get current month from calendar header
   */
  getCurrentMonthFromCalendar() {
    const monthElement = document.querySelector(this.selectors.calendar.month);
    if (monthElement) {
      const monthText = monthElement.textContent.trim();
      return this.monthNameToNumber(monthText);
    }
    return new Date().getMonth() + 1;
  }

  /**
   * Get current year from calendar header
   */
  getCurrentYearFromCalendar() {
    const yearElement = document.querySelector(this.selectors.calendar.year);
    if (yearElement) {
      const yearText = yearElement.textContent.trim();
      const yearMatch = yearText.match(/\d{4}/);
      if (yearMatch) {
        return parseInt(yearMatch[0]);
      }
    }
    return new Date().getFullYear();
  }

  /**
   * Get current month
   */
  getCurrentMonth() {
    return new Date().getMonth() + 1;
  }

  /**
   * Convert month name to number
   */
  monthNameToNumber(monthName) {
    const months = {
      'january': 1, 'february': 2, 'march': 3, 'april': 4,
      'may': 5, 'june': 6, 'july': 7, 'august': 8,
      'september': 9, 'october': 10, 'november': 11, 'december': 12
    };
    
    const normalized = monthName.toLowerCase();
    for (const [name, num] of Object.entries(months)) {
      if (normalized.includes(name)) {
        return num;
      }
    }
    
    return new Date().getMonth() + 1;
  }

  /**
   * Get time slots for a specific date
   */
  async getTimeSlotsForDate(dateInfo) {
    console.log(`🕐 Getting time slots for ${dateInfo.date}...`);
    
    try {
      // Click the date cell to reveal time slots
      if (dateInfo.element && typeof dateInfo.element.click === 'function') {
        dateInfo.element.click();
        
        // Wait for time slots to appear
        await this.waitForTimeSlots(3000);
      }
      
      // Find time slot elements
      const timeSlotElements = document.querySelectorAll(this.selectors.timeSlots.slot);
      const timeSlots = [];
      
      for (const slotElement of timeSlotElements) {
        try {
          const timeInfo = this.extractTimeInfo(slotElement);
          if (timeInfo) {
            timeSlots.push(timeInfo);
          }
        } catch (error) {
          console.warn('⚠️ Error extracting time:', error.message);
          continue;
        }
      }
      
      console.log(`✅ Found ${timeSlots.length} time slots for ${dateInfo.date}`);
      return timeSlots;
      
    } catch (error) {
      console.error('❌ Error getting time slots:', error);
      return [];
    }
  }

  /**
   * Extract time information from time slot element
   */
  extractTimeInfo(element) {
    // Try data-time attribute
    let timeString = element.getAttribute('data-time');
    
    // Try button text/value
    if (!timeString) {
      timeString = element.value || element.textContent.trim();
    }
    
    // Parse time string
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) {
      return null;
    }
    
    return {
      time: timeString,
      hour: parseInt(timeMatch[1]),
      minute: parseInt(timeMatch[2]),
      available: !element.disabled && !element.classList.contains('disabled')
    };
  }

  /**
   * Wait for time slots to appear
   */
  async waitForTimeSlots(timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const slotsContainer = document.querySelector(this.selectors.timeSlots.container);
      const slots = document.querySelectorAll(this.selectors.timeSlots.slot);
      
      if (slotsContainer && slots.length > 0) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.warn('⚠️ Time slots did not appear within timeout');
    return false;
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(timeout = 5000) {
    return new Promise(resolve => {
      const startTime = Date.now();
      
      const checkComplete = setInterval(() => {
        if (document.readyState === 'complete' || Date.now() - startTime > timeout) {
          clearInterval(checkComplete);
          resolve(true);
        }
      }, 100);
    });
  }

  /**
   * Wait for specific element to appear
   */
  async waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    throw new Error(`Element not found: ${selector}`);
  }

  /**
   * Simulate human-like delay
   */
  async humanDelay(min = 500, max = 1500) {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Parse available dates from calendar (alternative method)
   */
  async parseCalendarAlternative() {
    console.log('🔄 Using alternative calendar parsing method...');
    
    const calendar = document.querySelector(this.selectors.calendar.container);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    const availableDates = [];
    
    // Get all links/buttons in calendar
    const dateElements = calendar.querySelectorAll('a, button, [data-date]');
    
    for (const element of dateElements) {
      // Check if element represents an available date
      const isDisabled = element.disabled || 
                        element.classList.contains('disabled') ||
                        element.classList.contains('unavailable');
      
      if (isDisabled) continue;
      
      // Try to extract date
      const dateText = element.getAttribute('data-date') || 
                      element.getAttribute('aria-label') ||
                      element.textContent.trim();
      
      const dateMatch = dateText.match(/(\d{4})-(\d{2})-(\d{2})|(\d{1,2})\/(\d{1,2})\/(\d{4})|(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
      
      if (dateMatch) {
        let parsedDate;
        
        if (dateMatch[1]) {
          // ISO format: 2025-11-15
          parsedDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
        } else if (dateMatch[4]) {
          // DD/MM/YYYY format
          parsedDate = `${dateMatch[6]}-${String(dateMatch[5]).padStart(2, '0')}-${String(dateMatch[4]).padStart(2, '0')}`;
        } else if (dateMatch[7]) {
          // DD Month YYYY format
          const monthNum = this.monthNameToNumber(dateMatch[8]);
          parsedDate = `${dateMatch[9]}-${String(monthNum).padStart(2, '0')}-${String(dateMatch[7]).padStart(2, '0')}`;
        }
        
        if (parsedDate) {
          availableDates.push({
            date: parsedDate,
            available: true,
            isCancellation: false,
            element: element
          });
        }
      }
    }
    
    return availableDates;
  }

  /**
   * Validate detected slots
   */
  validateSlots(slots) {
    return slots.filter(slot => {
      // Must have required fields
      if (!slot.date || !slot.time || !slot.centre) {
        return false;
      }
      
      // Date must be in future
      const slotDate = new Date(slot.date);
      const now = new Date();
      if (slotDate < now) {
        return false;
      }
      
      // Date must be valid
      if (isNaN(slotDate.getTime())) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get detection statistics
   */
  getStats() {
    return {
      currentPage: this.currentPage,
      selectorsUsed: Object.keys(this.selectors),
      timestamp: new Date().toISOString()
    };
  }
}

// Export for use in content script
if (typeof window !== 'undefined') {
  window.DVSASlotDetector = DVSASlotDetector;
}

// Also support module export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DVSASlotDetector;
}

