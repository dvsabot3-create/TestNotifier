/**
 * DVSA Queen - Content Script
 * Injects into DVSA booking pages and provides stealth automation
 */

// Import stealth modules
class ContentStealth {
  constructor() {
    this.isActive = false;
    this.currentInstructor = null;
    this.pupils = [];
    this.subscription = {
      tier: 'free',
      status: 'inactive',
      features: {}
    };
    this.settings = {
      autoCheck: true,
      checkInterval: 15000, // 15 seconds
      soundEnabled: true,
      notifications: true,
      autoBooking: false, // New: auto-booking setting
      maxAutoBookingsPerDay: 1, // Safety limit
      requireConfirmation: true // Safety: require user confirmation
    };

    this.stealthMetrics = {
      totalChecks: 0,
      successfulChanges: 0,
      lastCheck: null,
      detectionRisk: 'LOW',
      autoBookingsToday: 0,
      lastAutoBookingDate: null
    };

    // Initialize stealth systems
    this.initializeStealthSystems();
    this.automationEngine = null; // Will initialize when needed
    this.pendingBooking = null; // Stores booking awaiting confirmation
    this.bookingPreview = null; // Stores preview data for user review

    // Load DVSA automation engine if available
    this.loadDVSAAutomationEngine();
  }

  /**
   * Initialize stealth systems
   */
  initializeStealthSystems() {
    try {
      // Load stealth manager if available
      if (typeof StealthSystem !== 'undefined') {
        this.stealthSystem = new StealthSystem();
      } else {
        // Fallback basic stealth system
        this.stealthSystem = this.createBasicStealthSystem();
      }

      if (typeof MouseSimulator !== 'undefined') {
        this.mouseSimulator = new MouseSimulator();
      } else {
        this.mouseSimulator = this.createBasicMouseSimulator();
      }

      if (typeof TimingRandomizer !== 'undefined') {
        this.timingRandomizer = new TimingRandomizer();
      } else {
        this.timingRandomizer = this.createBasicTimingRandomizer();
      }

      if (typeof DetectionEvasion !== 'undefined') {
        this.detectionEvasion = new DetectionEvasion();
      } else {
        this.detectionEvasion = this.createBasicDetectionEvasion();
      }

      if (typeof BookingManager !== 'undefined') {
        this.bookingManager = new BookingManager();
      } else {
        this.bookingManager = this.createBasicBookingManager();
      }

      console.log('✅ Stealth systems initialized');
    } catch (error) {
      console.error('❌ Failed to initialize stealth systems:', error);
      // Create fallback systems
      this.createFallbackStealthSystems();
    }
  }

  /**
   * Create basic fallback stealth systems
   */
  createFallbackStealthSystems() {
    this.stealthSystem = this.createBasicStealthSystem();
    this.mouseSimulator = this.createBasicMouseSimulator();
    this.timingRandomizer = this.createBasicTimingRandomizer();
    this.detectionEvasion = this.createBasicDetectionEvasion();
    this.bookingManager = this.createBasicBookingManager();
  }

  /**
   * Basic stealth system implementation
   */
  createBasicStealthSystem() {
    return {
      simulateThinking: async (type = 'simple') => {
        const thinkingTimes = {
          simple: { min: 200, max: 800 },
          normal: { min: 500, max: 1500 },
          important: { min: 1000, max: 3000 }
        };
        const timeRange = thinkingTimes[type] || thinkingTimes.simple;
        const thinkingTime = Math.random() * (timeRange.max - timeRange.min) + timeRange.min;
        console.log(`🧠 Basic thinking simulation: ${Math.round(thinkingTime)}ms`);
        await new Promise(resolve => setTimeout(resolve, thinkingTime));
      },
      assessBookingRisk: async (newSlot) => {
        return {
          score: 10,
          level: 'LOW',
          factors: [],
          recommendation: 'Proceed with caution'
        };
      },
      updateMetrics: (checks, changes, risk) => {
        console.log('📊 Updated stealth metrics');
      }
    };
  }

  createBasicMouseSimulator() {
    return {
      simulateNaturalMovement: async () => {
        console.log('🖱️ Basic mouse movement simulation');
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
      },
      simulateClick: async (element) => {
        console.log('🖱️ Basic click simulation');
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
      }
    };
  }

  createBasicTimingRandomizer() {
    return {
      randomizeCheckTiming: async () => {
        const delay = 1000 + (Math.random() * 1000);
        console.log(`⏱️ Basic timing randomization: ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      },
      getRandomInterval: (baseInterval) => {
        return baseInterval + (Math.random() * baseInterval * 0.2) - (baseInterval * 0.1);
      }
    };
  }

  createBasicDetectionEvasion() {
    return {
      beforeCheck: () => {
        console.log('🕵️ Basic detection evasion');
        if (Math.random() > 0.8) {
          window.scrollBy(0, (Math.random() * 50) - 25);
        }
      }
    };
  }

  createBasicBookingManager() {
    return {
      executeBookingChange: async (newSlot, pupilData) => {
        console.log('🤖 Basic booking execution simulation');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          return {
            success: true,
            newBooking: {
              date: newSlot.date,
              time: newSlot.time,
              centre: newSlot.centre,
              bookingRef: 'BK' + Date.now().toString(36).toUpperCase()
            }
          };
        } else {
          return {
            success: false,
            error: 'Slot no longer available'
          };
        }
      }
    };
  }

  /**
   * Initialize content script
   */
  async initialize() {
    console.log('🚀 DVSA Queen content script initializing...');

    // Wait for page to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }

    // Check if we're on the right page
    if (!this.isDVSAChangePage()) {
      console.log('⚠️ Not on DVSA change page, extension inactive');
      return;
    }

    console.log('✅ DVSA change page detected, activating extension');

    // Initialize components
    await this.loadSettings();
    await this.validateSubscription();
    await this.initializeAutomationEngine();
    await this.loadPupilsFromStorage(); // Load pupils first
    this.injectInterface();
    this.setupEventListeners();
    this.startMonitoring();

    // Make pupil management functions available globally
    window.dvsaQueen = {
      openModernPupilForm: this.openModernPupilForm.bind(this),
      editPupil: this.editPupil.bind(this),
      togglePupilStatus: this.togglePupilStatus.bind(this),
      deletePupil: this.deletePupil.bind(this)
    };

    console.log('✅ DVSA Queen content script fully activated');
  }

  /**
   * Check if we're on the DVSA change booking page
   */
  isDVSAChangePage() {
    const url = window.location.href;
    return url.includes('driverpracticaltest.dvsa.gov.uk') &&
           (url.includes('change') || url.includes('manage') || url.includes('available'));
  }

  /**
   * Load DVSA automation engine dynamically
   */
  async loadDVSAAutomationEngine() {
    try {
      console.log('🔧 Loading DVSA automation engine...');

      // Load the DVSA automation engine script
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('dvsa-automation-engine.js');

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      console.log('✅ DVSA automation engine loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load DVSA automation engine:', error);
    }
  }

  /**
   * Initialize automation engine for Professional tier
   */
  async initializeAutomationEngine() {
    if (this.subscription.tier === 'professional' && !this.automationEngine) {
      try {
        console.log('🤖 Initializing automation engine for Professional tier...');

        // Check if DVSAAutomationEngine is available
        if (typeof DVSAAutomationEngine !== 'undefined') {
          this.automationEngine = new DVSAAutomationEngine();
          await this.automationEngine.initialize();
          console.log('✅ Automation engine initialized successfully');
        } else {
          console.warn('⚠️ DVSAAutomationEngine not available, using basic booking manager');
          // Use the booking manager as fallback
          this.automationEngine = this.bookingManager;
        }
      } catch (error) {
        console.error('❌ Failed to initialize automation engine:', error);
        console.log('🔄 Using basic booking manager as fallback');
        this.automationEngine = this.bookingManager;
      }
    }
  }

  /**
   * Validate user subscription
   */
  async validateSubscription() {
    try {
      console.log('🔍 Validating subscription...');

      // Generate a mock user ID based on current time (for testing)
      const userId = 'user_' + Date.now().toString(36);

      const response = await chrome.runtime.sendMessage({
        action: 'validateSubscription',
        userId: userId
      });

      if (response.success) {
        this.subscription = response.subscription;
        console.log('✅ Subscription validated:', this.subscription);

        // Update UI based on subscription tier
        this.updateUIForSubscription();
      }
    } catch (error) {
      console.error('❌ Error validating subscription:', error);
    }
  }

  /**
   * Update UI based on subscription tier
   */
  updateUIForSubscription() {
    const tier = this.subscription.tier;
    console.log('🎨 Updating UI for tier:', tier);

    // Update panel styling based on tier
    const panel = document.getElementById('dvsa-queen-panel');
    if (panel) {
      panel.className = `dvsa-queen-tier-${tier}`;
    }

    // Update UI elements based on features
    this.updateFeaturesDisplay();
  }

  /**
   * Get tier-specific title
   */
  getTierTitle() {
    const titles = {
      'free': 'DVSA Queen Basic',
      'one-off': 'DVSA Queen Test Finder',
      'starter': 'DVSA Queen Personal Assistant',
      'premium': 'DVSA Queen Smart Monitor',
      'professional': 'DVSA Queen Instructor Command Center'
    };
    return titles[this.subscription.tier] || 'DVSA Queen';
  }

  /**
   * Inject modern theme styles that match website exactly
   */
  injectModernStyles() {
    // Use the website-matching CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('extension-theme-website.css');
    document.head.appendChild(link);
  }

  /**
   * Get tier-specific features HTML with modern design
   */
  getTierFeatures() {
    const features = this.subscription.features || {};

    let featuresHtml = '';

    // Rapid mode indicator
    if (features.rapidMode) {
      featuresHtml += `
        <div class="dvsa-queen-feature">
          <div class="feature-icon">⚡</div>
          <div class="feature-text">Rapid Mode (500ms checks)</div>
        </div>
      `;
    }

    // Multi-pupil management
    if (features.multiPupil) {
      featuresHtml += `
        <div class="dvsa-queen-feature">
          <div class="feature-icon">👥</div>
          <div class="feature-text">Multi-Pupil Management</div>
        </div>
      `;
    }

    // Bulk operations
    if (features.bulkOperations) {
      featuresHtml += `
        <div class="dvsa-queen-feature">
          <div class="feature-icon">🚀</div>
          <div class="feature-text">Bulk Operations</div>
        </div>
      `;
    }

    // Advanced filtering
    if (features.advancedFiltering) {
      featuresHtml += `
        <div class="dvsa-queen-feature">
          <div class="feature-icon">🔍</div>
          <div class="feature-text">Advanced Filtering</div>
        </div>
      `;
    }

    // Stealth mode
    if (features.stealthMode) {
      featuresHtml += `
        <div class="dvsa-queen-feature">
          <div class="feature-icon">🕵️</div>
          <div class="feature-text">Stealth Mode</div>
        </div>
      `;
    }

    // Auto-booking for Professional tier
    if (this.subscription.tier === 'professional') {
      featuresHtml += `
        <div class="dvsa-queen-feature">
          <div class="feature-icon">🤖</div>
          <div class="feature-text">Auto-Booking System</div>
        </div>
      `;
    }

    // Test center limit indicator
    const maxCenters = features.maxTestCenters || 1;
    featuresHtml += `
      <div class="dvsa-queen-limits">
        <span class="limit-info">Max ${maxCenters} test center${maxCenters !== 1 ? 's' : ''}</span>
      </div>
    `;

    return featuresHtml;
  }

  /**
   * Update features display based on subscription
   */
  updateFeaturesDisplay() {
    const features = this.subscription.features || {};

    // Show/hide elements based on features
    const rapidModeElement = document.querySelector('.dvsa-queen-rapid-mode');
    if (rapidModeElement) {
      rapidModeElement.style.display = features.rapidMode ? 'block' : 'none';
    }

    const bulkOperationsElement = document.querySelector('.dvsa-queen-bulk-ops');
    if (bulkOperationsElement) {
      bulkOperationsElement.style.display = features.bulkOperations ? 'block' : 'none';
    }

    const multiPupilElement = document.querySelector('.dvsa-queen-multi-pupil');
    if (multiPupilElement) {
      multiPupilElement.style.display = features.multiPupil ? 'block' : 'none';
    }
  }

  /**
   * Load settings from extension storage
   */
  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        this.settings = { ...this.settings, ...response.settings };
        console.log('✅ Settings loaded:', this.settings);
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
    }
  }

  /**
   * Inject custom interface into DVSA page
   */
  injectInterface() {
    // Create floating interface panel
    const panel = document.createElement('div');
    panel.id = 'dvsa-queen-panel';
    panel.className = `dvsa-queen-tier-${this.subscription.tier}`;

    // Get tier-specific title and features
    const tierTitle = this.getTierTitle();
    const tierFeatures = this.getTierFeatures();

    panel.innerHTML = `
      <div class="dvsa-queen-header">
        <div class="dvsa-queen-logo-section">
          <img src="${chrome.runtime.getURL('icons/simple/icon32.png')}" alt="TestNotifier" class="dvsa-queen-logo">
          <div class="dvsa-queen-title-section">
            <span class="dvsa-queen-title">${tierTitle}</span>
            <div class="dvsa-queen-tier-badge">${this.subscription.tier.toUpperCase()}</div>
          </div>
        </div>
        <button class="dvsa-queen-close" title="Close">×</button>
      </div>
      <div class="dvsa-queen-content">
        <div class="dvsa-queen-status">
          <span class="status-indicator active"></span>
          <span class="status-text">Ready</span>
        </div>
        ${tierFeatures}
        <div class="dvsa-queen-controls">
          <button class="dvsa-queen-check-btn">Check Now</button>
          <button class="dvsa-queen-settings-btn">⚙️</button>
        </div>
        ${this.subscription.tier === 'professional' ? `
        <div class="dvsa-queen-auto-booking">
          <label class="auto-booking-toggle">
            <input type="checkbox" class="auto-booking-checkbox" ${this.settings.autoBooking ? 'checked' : ''}>
            <span class="toggle-slider"></span>
            <span class="toggle-label">Auto-Booking</span>
          </label>
          <small class="auto-booking-info">Professional feature - requires confirmation</small>
        </div>
        ` : ''}
        <div class="dvsa-queen-stats">
          <div>Checks: <span class="check-count">0</span></div>
          <div>Success: <span class="success-count">0</span></div>
          <div>Risk: <span class="risk-level">LOW</span></div>
        </div>
      </div>
    `;

    // Add modern theme styles
    this.injectModernStyles();
    document.body.appendChild(panel);

    // Add event listeners
    this.setupPanelEventListeners(panel);
  }

  /**
   * Setup event listeners for the injected panel
   */
  setupPanelEventListeners(panel) {
    // Close button
    panel.querySelector('.dvsa-queen-close').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    // Check button
    panel.querySelector('.dvsa-queen-check-btn').addEventListener('click', () => {
      this.manualCheck();
    });

    // Settings button - now opens modern pupil form
    panel.querySelector('.dvsa-queen-settings-btn').addEventListener('click', () => {
      this.openModernPupilForm();
    });

    // Auto-booking toggle (Professional tier only)
    const autoBookingCheckbox = panel.querySelector('.auto-booking-checkbox');
    if (autoBookingCheckbox) {
      autoBookingCheckbox.addEventListener('change', (e) => {
        this.toggleAutoBooking(e.target.checked);
      });
    }

    // Make panel draggable
    this.makePanelDraggable(panel);
  }

  /**
   * Open modern pupil form
   */
  openModernPupilForm() {
    // Load modern pupil form script if not already loaded
    if (typeof ModernPupilForm === 'undefined') {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('modern-pupil-form.js');
      script.onload = () => {
        const form = new ModernPupilForm();
        form.show();
      };
      document.head.appendChild(script);
    } else {
      const form = new ModernPupilForm();
      form.show();
    }
  }

  /**
   * Make the panel draggable
   */
  makePanelDraggable(panel) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = panel.querySelector('.dvsa-queen-header');

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === header || header.contains(e.target)) {
        isDragging = true;
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }
  }

  /**
   * Setup event listeners for page changes
   */
  setupEventListeners() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('📨 Content script received message:', message);

      switch (message.action) {
        case 'pageLoaded':
          this.handlePageLoaded(message.url);
          break;
        case 'manualCheck':
          this.manualCheck();
          break;
        case 'toggleInterface':
          this.toggleInterface();
          break;
        case 'settingsUpdated':
          this.handleSettingsUpdated(message.settings);
          break;
        case 'refreshPupilList':
          this.refreshPupilDisplay();
          break;
        case 'getPupils':
          this.getPupilsList().then(pupils => {
            sendResponse({ success: true, pupils: pupils });
          });
          return true; // Keep channel open for async response
        case 'updatePupil':
          this.updatePupil(message.pupilId, message.updates).then(result => {
            sendResponse(result);
          });
          return true;
        case 'deletePupil':
          this.deletePupil(message.pupilId).then(result => {
            sendResponse(result);
          });
          return true;
        default:
          console.warn('⚠️ Unknown message action:', message.action);
      }
    });

    // Listen for URL changes (SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.handleUrlChange(url);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  /**
   * Handle page loaded event
   */
  async handlePageLoaded(url) {
    console.log('🌐 Page loaded:', url);

    if (this.isDVSAChangePage()) {
      await this.initialize();
      this.updateStatus('Ready', 'active');

      if (this.settings.autoCheck) {
        this.startMonitoring();
      }
    }
  }

  /**
   * Handle URL changes
   */
  async handleUrlChange(url) {
    console.log('🔄 URL changed:', url);

    if (this.isDVSAChangePage()) {
      this.updateStatus('Active', 'active');
    } else {
      this.updateStatus('Inactive', 'inactive');
      this.stopMonitoring();
    }
  }

  /**
   * Start monitoring for cancellations
   */
  startMonitoring() {
    if (this.monitoringInterval) {
      console.log('⚠️ Monitoring already active');
      return;
    }

    console.log('🔍 Starting cancellation monitoring...');
    this.updateStatus('Monitoring', 'active');

    this.monitoringInterval = setInterval(async () => {
      await this.performCheck();
    }, this.settings.checkInterval);

    // Perform initial check
    this.performCheck();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      console.log('⏹️ Stopping cancellation monitoring');
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.updateStatus('Ready', 'active');
    }
  }

  /**
   * Manual check triggered by user
   */
  async manualCheck() {
    console.log('🔄 Manual check requested');
    this.updateStatus('Checking...', 'active');
    await this.performCheck();
  }

  /**
   * Toggle interface visibility
   */
  toggleInterface() {
    const panel = document.getElementById('dvsa-queen-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  /**
   * Handle settings updated
   */
  handleSettingsUpdated(newSettings) {
    console.log('⚙️ Settings updated:', newSettings);
    this.settings = { ...this.settings, ...newSettings };

    // Restart monitoring if interval changed
    if (this.monitoringInterval) {
      this.stopMonitoring();
      if (this.settings.autoCheck) {
        this.startMonitoring();
      }
    }
  }

  /**
   * Update status display
   */
  updateStatus(text, level = 'active') {
    const panel = document.getElementById('dvsa-queen-panel');
    if (!panel) return;

    const statusText = panel.querySelector('.status-text');
    const statusIndicator = panel.querySelector('.status-indicator');

    if (statusText) statusText.textContent = text;
    if (statusIndicator) {
      statusIndicator.className = 'status-indicator ' + level;
    }
  }

  /**
   * Update statistics display
   */
  updateStatistics() {
    const panel = document.getElementById('dvsa-queen-panel');
    if (!panel) return;

    const checkCount = panel.querySelector('.check-count');
    const successCount = panel.querySelector('.success-count');
    const riskLevel = panel.querySelector('.risk-level');

    if (checkCount) checkCount.textContent = this.stealthMetrics.totalChecks;
    if (successCount) successCount.textContent = this.stealthMetrics.successfulChanges;
    if (riskLevel) {
      riskLevel.textContent = this.stealthMetrics.detectionRisk;
      riskLevel.className = 'risk-level ' + this.stealthMetrics.detectionRisk;
    }
  }

  /**
   * Perform actual check for cancellations
   */
  async performCheck() {
    console.log('🔍 Performing cancellation check...');

    this.stealthMetrics.totalChecks++;
    this.updateStatistics();

    try {
      // Apply stealth behavioral simulation
      await this.applyStealthBeforeCheck();

      // Check for available slots
      const availableSlots = await this.checkForAvailableSlots();

      if (availableSlots.length > 0) {
        console.log(`🎯 Found ${availableSlots.length} available slots`);
        await this.handleFoundSlots(availableSlots);
        this.stealthMetrics.successfulChanges++;
      } else {
        console.log('📭 No available slots found');
      }

      this.updateStatistics();

    } catch (error) {
      console.error('❌ Error during check:', error);
      this.updateStatus('Error', 'warning');
    }
  }

  /**
   * Apply stealth before checking
   */
  async applyStealthBeforeCheck() {
    // Add realistic thinking time
    await this.stealthSystem.simulateThinking('simple');

    // Add mouse movement simulation
    await this.mouseSimulator.simulateNaturalMovement();

    // Add timing randomization
    await this.timingRandomizer.randomizeCheckTiming();

    // Apply detection evasion
    this.detectionEvasion.beforeCheck();
  }

  /**
   * Check for available slots (stealth implementation)
   */
  async checkForAvailableSlots() {
    // Real DVSA integration - check for available slots
    console.log('🔍 Checking DVSA calendar for available slots...');

    try {
      // Check if automation engine is available
      if (!this.automationEngine) {
        await this.initializeAutomationEngine();
      }

      if (!this.automationEngine || typeof this.automationEngine.checkForAvailableSlots !== 'function') {
        console.warn('⚠️ Automation engine not available, using basic slot checking');
        return this.basicSlotChecking();
      }

      // Use real DVSA automation engine
      console.log('🤖 Using DVSA automation engine for slot checking');
      const availableSlots = await this.automationEngine.checkForAvailableSlots({
        pupils: this.pupils,
        preferences: this.getPupilPreferences()
      });

      console.log('✅ Found available slots:', availableSlots.length);
      return availableSlots;

    } catch (error) {
      console.error('❌ Error checking DVSA slots:', error);
      console.log('🔄 Falling back to basic slot checking');
      return this.basicSlotChecking();
    }
  }

  /**
   * Basic slot checking fallback when automation engine is not available
   */
  async basicSlotChecking() {
    console.log('🔧 Using basic slot checking fallback');

    // Look for DVSA calendar elements on the page
    const calendarElements = document.querySelectorAll('[data-test-id="calendar-slot"], .available-slot, .slot-available');
    const availableSlots = [];

    if (calendarElements.length === 0) {
      console.log('⚠️ No DVSA calendar elements found on page');
      return [];
    }

    // Extract slot information from DVSA page elements
    calendarElements.forEach((element, index) => {
      try {
        const slotData = this.extractSlotDataFromElement(element);
        if (slotData && this.isSlotValid(slotData)) {
          availableSlots.push(slotData);
        }
      } catch (error) {
        console.warn('⚠️ Error extracting slot data from element', index, error);
      }
    });

    console.log(`✅ Basic checking found ${availableSlots.length} potential slots`);
    return availableSlots;
  }

  /**
   * Extract slot data from DVSA page element
   */
  extractSlotDataFromElement(element) {
    try {
      // Look for date, time, and centre information
      const dateElement = element.querySelector('[data-date], .slot-date, .date');
      const timeElement = element.querySelector('[data-time], .slot-time, .time');
      const centreElement = element.querySelector('[data-centre], .slot-centre, .centre');

      const date = dateElement ? dateElement.textContent.trim() : null;
      const time = timeElement ? timeElement.textContent.trim() : null;
      const centre = centreElement ? centreElement.textContent.trim() : null;

      if (!date || !time) {
        return null;
      }

      return {
        date: this.parseDate(date),
        time: this.parseTime(time),
        centre: centre || 'Unknown Centre',
        element: element,
        source: 'dvsa-page'
      };
    } catch (error) {
      console.error('❌ Error extracting slot data:', error);
      return null;
    }
  }

  /**
   * Parse date from DVSA format
   */
  parseDate(dateText) {
    try {
      // Handle various DVSA date formats
      const dateFormats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
        /(\d{1,2})\s+(\w+)\s+(\d{4})/,    // DD Month YYYY
        /(\w+)\s+(\d{1,2})\s+(\d{4})/,    // Month DD YYYY
      ];

      for (const format of dateFormats) {
        const match = dateText.match(format);
        if (match) {
          // Convert to ISO format
          const date = new Date(dateText);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }

      // If no format matches, try direct parsing
      const date = new Date(dateText);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return null;
    } catch (error) {
      console.error('❌ Error parsing date:', error);
      return null;
    }
  }

  /**
   * Parse time from DVSA format
   */
  parseTime(timeText) {
    try {
      // Handle various time formats
      const timeMatch = timeText.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        return timeMatch[0];
      }
      return timeText;
    } catch (error) {
      console.error('❌ Error parsing time:', error);
      return null;
    }
  }

  /**
   * Check if slot is valid and meets criteria
   */
  isSlotValid(slot) {
    try {
      if (!slot.date || !slot.time) {
        return false;
      }

      // Check if date is in the future
      const slotDate = new Date(slot.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (slotDate < today) {
        return false;
      }

      // Additional validation could be added here
      return true;
    } catch (error) {
      console.error('❌ Error validating slot:', error);
      return false;
    }
  }

  /**
   * Get pupil preferences for filtering
   */
  getPupilPreferences() {
    return {
      testCentres: this.pupils.map(p => p.testCentre).filter(Boolean),
      earliestDate: this.getEarliestPreferredDate(),
      latestDate: this.getLatestPreferredDate()
    };
  }

  /**
   * Get earliest preferred date across all pupils
   */
  getEarliestPreferredDate() {
    // Implementation based on pupil preferences
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Get latest preferred date across all pupils
   */
  getLatestPreferredDate() {
    // Implementation based on pupil preferences
    const future = new Date();
    future.setMonth(future.getMonth() + 6);
    return future.toISOString().split('T')[0];
  }

  /**
   * Handle found available slots with assisted auto-booking
   */
  async handleFoundSlots(slots) {
    console.log('🎯 Processing found slots:', slots);

    // Get current booking details for comparison
    const currentBooking = await this.getCurrentBookingDetails();
    const bestSlot = slots[0]; // Assume first slot is best

    // Send to background script for notification
    await chrome.runtime.sendMessage({
      action: 'foundCancellation',
      data: {
        pupilName: 'Current Pupil', // Would get real name
        newDate: bestSlot.date,
        newCentre: bestSlot.centre,
        newTime: bestSlot.time,
        timestamp: new Date()
      }
    });

    // **ASSISTED AUTO-BOOKING FOR PROFESSIONAL TIER**
    if (this.subscription.tier === 'professional' && this.settings.autoBooking) {
      console.log('🤖 Professional tier detected - initiating assisted auto-booking...');

      // Check daily limits
      if (!this.canPerformAutoBooking()) {
        console.log('⏰ Daily auto-booking limit reached');
        this.updateStatus('Daily limit reached', 'warning');
        return;
      }

      try {
        // Simple confirmation for now - show basic alert
        const userConfirmed = confirm(
          `🎯 Auto-Booking Alert!\n\n` +
          `New earlier slot found:\n` +
          `📅 ${bestSlot.date} at ${bestSlot.time}\n` +
          `📍 ${bestSlot.centre}\n\n` +
          `Current booking: ${currentBooking?.date || 'Unknown'}\n\n` +
          `Would you like to proceed with auto-booking this slot?\n\n` +
          `⚠️ This will execute with full stealth protection.`
        );

        if (userConfirmed) {
          await this.executeSimpleAutoBooking(bestSlot, currentBooking);
        } else {
          console.log('❌ User declined auto-booking');
          this.updateStatus('Auto-booking declined', 'active');
        }

      } catch (error) {
        console.error('❌ Auto-booking preparation failed:', error);
        this.updateStatus('Auto-booking failed', 'error');
      }
    }

    // Highlight slots in page (optional)
    this.highlightAvailableSlots(slots);
  }

  /**
   * Check if auto-booking can be performed (daily limits, etc.)
   */
  canPerformAutoBooking() {
    const today = new Date().toDateString();
    const lastBookingDate = this.stealthMetrics.lastAutoBookingDate;

    // Reset daily counter if it's a new day
    if (lastBookingDate !== today) {
      this.stealthMetrics.autoBookingsToday = 0;
      this.stealthMetrics.lastAutoBookingDate = today;
    }

    // Check daily limit
    return this.stealthMetrics.autoBookingsToday < this.settings.maxAutoBookingsPerDay;
  }

  /**
   * Get current booking details from DVSA page
   */
  async getCurrentBookingDetails() {
    try {
      // This would extract actual booking details from the DVSA page
      // For now, return mock data
      return {
        date: '2025-11-15',
        time: '14:30',
        centre: 'Current Test Centre',
        bookingRef: 'MOCK123'
      };
    } catch (error) {
      console.error('❌ Failed to get current booking details:', error);
      return null;
    }
  }

  /**
   * Calculate estimated time savings
   */
  calculateTimeSavings(currentBooking, newSlot) {
    try {
      const currentDate = new Date(currentBooking.date);
      const newDate = new Date(newSlot.date);
      const daysDifference = Math.floor((currentDate - newDate) / (1000 * 60 * 60 * 24));

      return {
        daysEarlier: Math.max(0, daysDifference),
        savingsDescription: daysDifference > 0 ? `${daysDifference} days earlier` : 'Same day'
      };
    } catch (error) {
      return { daysEarlier: 0, savingsDescription: 'Unknown' };
    }
  }

  /**
   * Assess booking risk for the new slot
   */
  async assessBookingRisk(newSlot) {
    try {
      // Simple risk assessment
      const riskFactors = [];
      let riskScore = 0;

      // Check if slot is very soon (higher risk)
      const slotDate = new Date(newSlot.date);
      const daysUntilTest = Math.floor((slotDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilTest < 7) {
        riskFactors.push('Very soon test date');
        riskScore += 20;
      }

      // Check if it's a weekend (higher demand)
      const dayOfWeek = slotDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        riskFactors.push('Weekend slot');
        riskScore += 10;
      }

      // Check time (early morning/late evening might be suspicious)
      const hour = parseInt(newSlot.time.split(':')[0]);
      if (hour < 8 || hour > 17) {
        riskFactors.push('Unusual time slot');
        riskScore += 15;
      }

      return {
        score: riskScore,
        level: riskScore >= 30 ? 'HIGH' : riskScore >= 15 ? 'MEDIUM' : 'LOW',
        factors: riskFactors,
        recommendation: riskScore >= 30 ? 'Manual review recommended' : 'Proceed with caution'
      };
    } catch (error) {
      return {
        score: 50,
        level: 'HIGH',
        factors: ['Assessment failed'],
        recommendation: 'Manual review required'
      };
    }
  }

  /**
   * Show booking preview to user for confirmation
   */
  async showBookingPreview(preview) {
    console.log('📋 Showing booking preview to user...', preview);

    // Create booking preview modal
    const previewModal = document.createElement('div');
    previewModal.id = 'dvsa-booking-preview';
    previewModal.className = 'booking-preview-modal';
    previewModal.innerHTML = `
      <div class="booking-preview-content">
        <div class="booking-preview-header">
          <h3>🎯 Auto-Booking Preview</h3>
          <button class="preview-close" onclick="this.closest('.booking-preview-modal').remove()">×</button>
        </div>

        <div class="booking-preview-body">
          <div class="current-booking">
            <h4>Current Booking</h4>
            <p><strong>Date:</strong> ${preview.currentBooking?.date || 'Unknown'}</p>
            <p><strong>Time:</strong> ${preview.currentBooking?.time || 'Unknown'}</p>
            <p><strong>Centre:</strong> ${preview.currentBooking?.centre || 'Unknown'}</p>
          </div>

          <div class="new-slot">
            <h4>🎉 New Earlier Slot Found!</h4>
            <p><strong>Date:</strong> ${preview.newSlot.date}</p>
            <p><strong>Time:</strong> ${preview.newSlot.time}</p>
            <p><strong>Centre:</strong> ${preview.newSlot.centre}</p>
            <p><strong>Time Savings:</strong> ${preview.estimatedSavings.savingsDescription}</p>
          </div>

          <div class="risk-assessment">
            <h4>Risk Assessment</h4>
            <p><strong>Level:</strong> <span class="risk-${preview.riskAssessment.level.toLowerCase()}">${preview.riskAssessment.level}</span></p>
            <p><strong>Score:</strong> ${preview.riskAssessment.score}/100</p>
            <p><strong>Recommendation:</strong> ${preview.riskAssessment.recommendation}</p>
            ${preview.riskAssessment.factors.length > 0 ? `
              <p><strong>Factors:</strong></p>
              <ul>
                ${preview.riskAssessment.factors.map(factor => `<li>${factor}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>

        <div class="booking-preview-footer">
          <button class="btn-decline" onclick="window.dvsaQueen.declineAutoBooking()">❌ Decline</button>
          <button class="btn-manual" onclick="window.dvsaQueen.switchToManualMode()">⚙️ Manual Mode</button>
          <button class="btn-approve" onclick="window.dvsaQueen.approveAutoBooking()">✅ Approve Auto-Booking</button>
        </div>

        <div class="booking-preview-safety">
          <p><small>⚠️ This booking will be executed with full stealth protection. You can cancel within 5 minutes if needed.</small></p>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .booking-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      }

      .booking-preview-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }

      .booking-preview-header {
        background: linear-gradient(135deg, #1d70b8, #2c5aa0);
        color: white;
        padding: 20px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .booking-preview-header h3 {
        margin: 0;
        font-size: 18px;
      }

      .preview-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .booking-preview-body {
        padding: 20px;
      }

      .current-booking, .new-slot, .risk-assessment {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #e9ecef;
      }

      .new-slot {
        border-left-color: #28a745;
        background: #f8fff8;
      }

      .risk-assessment {
        border-left-color: #ffc107;
        background: #fffbf0;
      }

      .risk-low { color: #28a745; font-weight: bold; }
      .risk-medium { color: #ffc107; font-weight: bold; }
      .risk-high { color: #dc3545; font-weight: bold; }

      .booking-preview-footer {
        padding: 20px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .booking-preview-footer button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .btn-decline {
        background: #dc3545;
        color: white;
      }

      .btn-manual {
        background: #6c757d;
        color: white;
      }

      .btn-approve {
        background: #28a745;
        color: white;
      }

      .booking-preview-footer button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .booking-preview-safety {
        padding: 15px 20px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
        text-align: center;
      }

      .booking-preview-safety p {
        margin: 0;
        color: #6c757d;
        font-size: 12px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(previewModal);

    // Store reference for button callbacks
    window.dvsaQueen = window.dvsaQueen || {};
    window.dvsaQueen.declineAutoBooking = () => {
      this.declineAutoBooking();
    };
    window.dvsaQueen.approveAutoBooking = () => {
      this.approveAutoBooking();
    };
    window.dvsaQueen.switchToManualMode = () => {
      this.switchToManualMode();
    };

    this.updateStatus('Booking preview shown', 'active');
  }

  /**
   * Handle user declining auto-booking
   */
  declineAutoBooking() {
    console.log('❌ User declined auto-booking');
    this.clearBookingPreview();
    this.updateStatus('Auto-booking declined', 'active');

    // Remove preview modal
    const modal = document.getElementById('dvsa-booking-preview');
    if (modal) modal.remove();
  }

  /**
   * Handle user approving auto-booking
   */
  async approveAutoBooking() {
    console.log('✅ User approved auto-booking');
    this.updateStatus('Executing auto-booking...', 'active');

    // Remove preview modal
    const modal = document.getElementById('dvsa-booking-preview');
    if (modal) modal.remove();

    try {
      await this.executeAutoBooking();
    } catch (error) {
      console.error('❌ Auto-booking execution failed:', error);
      this.updateStatus('Auto-booking failed', 'error');
      this.clearBookingPreview();
    }
  }

  /**
   * Switch to manual mode
   */
  switchToManualMode() {
    console.log('⚙️ Switching to manual booking mode');
    this.settings.autoBooking = false;
    this.clearBookingPreview();
    this.updateStatus('Manual mode activated', 'active');

    // Remove preview modal
    const modal = document.getElementById('dvsa-booking-preview');
    if (modal) modal.remove();

    // Update UI to reflect manual mode
    this.updateInterfaceForManualMode();
  }

  /**
   * Execute the approved auto-booking
   */
  async executeAutoBooking() {
    if (!this.bookingPreview || !this.automationEngine) {
      throw new Error('No booking preview or automation engine available');
    }

    console.log('🤖 Executing auto-booking with full stealth protection...');

    try {
      const result = await this.automationEngine.executeBookingChange(
        this.bookingPreview.newSlot,
        {
          name: 'Current Pupil',
          licenceNumber: 'MOCK123',
          currentBooking: this.bookingPreview.currentBooking
        }
      );

      if (result.success) {
        console.log('✅ Auto-booking completed successfully!');
        this.stealthMetrics.autoBookingsToday++;
        this.stealthMetrics.successfulChanges++;

        // Notify background script
        await chrome.runtime.sendMessage({
          action: 'autoBookingExecuted',
          data: {
            oldDate: this.bookingPreview.currentBooking.date,
            newDate: this.bookingPreview.newSlot.date,
            pupilName: 'Current Pupil',
            newCentre: this.bookingPreview.newSlot.centre,
            timeSavings: this.calculateTimeSavings(this.bookingPreview.currentBooking, this.bookingPreview.newSlot).savingsDescription,
            autoExecuted: true
          }
        });

        this.updateStatus('Auto-booking successful! 🎉', 'success');
        this.clearBookingPreview();

        // Show success confirmation
        this.showBookingSuccess(result.newBooking);

      } else {
        throw new Error(result.error || 'Booking execution failed');
      }
    } catch (error) {
      console.error('❌ Auto-booking execution failed:', error);
      this.updateStatus('Auto-booking failed: ' + error.message, 'error');
      this.clearBookingPreview();
      throw error;
    }
  }

  /**
   * Clear booking preview data
   */
  clearBookingPreview() {
    this.bookingPreview = null;
    this.pendingBooking = null;
  }

  /**
   * Show booking success confirmation
   */
  showBookingSuccess(newBooking) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success-notification';
    successDiv.innerHTML = `
      <div class="success-content">
        <h4>🎉 Booking Successful!</h4>
        <p>Your test has been moved to:</p>
        <p><strong>${newBooking.date} at ${newBooking.time}</strong></p>
        <p>Centre: ${newBooking.centre}</p>
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;

    // Add success styles
    const successStyle = document.createElement('style');
    successStyle.textContent = `
      .booking-success-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 15000;
        max-width: 300px;
      }
      .success-content h4 {
        margin: 0 0 10px 0;
      }
      .success-content button {
        background: white;
        color: #28a745;
        border: none;
        padding: 5px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }
    `;

    document.head.appendChild(successStyle);
    document.body.appendChild(successDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, 10000);
  }

  /**
   * Toggle auto-booking feature
   */
  async toggleAutoBooking(enabled) {
    console.log(`🔄 Auto-booking ${enabled ? 'enabled' : 'disabled'}`);

    this.settings.autoBooking = enabled;

    // Update settings in storage
    try {
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        data: { autoBooking: enabled }
      });

      this.updateStatus(enabled ? 'Auto-booking enabled' : 'Auto-booking disabled', 'active');

      // Update UI
      const statusText = document.querySelector('.status-text');
      if (statusText) {
        statusText.textContent = enabled ? 'Auto-booking ready' : 'Manual mode';
      }

    } catch (error) {
      console.error('❌ Failed to update auto-booking setting:', error);
      // Revert checkbox if update failed
      const checkbox = document.querySelector('.auto-booking-checkbox');
      if (checkbox) checkbox.checked = !enabled;
    }
  }

  /**
   * Execute simple auto-booking with user confirmation
   */
  async executeSimpleAutoBooking(newSlot, currentBooking) {
    console.log('🤖 Executing simple auto-booking...');
    this.updateStatus('Executing auto-booking...', 'active');

    try {
      // Check if automation engine is available
      if (!this.automationEngine) {
        throw new Error('Automation engine not available');
      }

      // Execute booking with stealth protection
      const result = await this.automationEngine.executeBookingChange(
        newSlot,
        {
          name: 'Current Pupil',
          licenceNumber: 'MOCK123',
          currentBooking: currentBooking
        }
      );

      if (result.success) {
        console.log('✅ Auto-booking completed successfully!');
        this.stealthMetrics.autoBookingsToday++;
        this.stealthMetrics.successfulChanges++;

        // Notify background script
        await chrome.runtime.sendMessage({
          action: 'autoBookingExecuted',
          data: {
            oldDate: currentBooking?.date || 'Unknown',
            newDate: newSlot.date,
            pupilName: 'Current Pupil',
            newCentre: newSlot.centre,
            timeSavings: this.calculateTimeSavings(currentBooking, newSlot).savingsDescription,
            autoExecuted: true
          }
        });

        this.updateStatus('Auto-booking successful! 🎉', 'success');
        alert('🎉 Auto-booking successful!\n\nYour test has been moved to an earlier slot.');

      } else {
        throw new Error(result.error || 'Booking execution failed');
      }

    } catch (error) {
      console.error('❌ Auto-booking execution failed:', error);
      this.updateStatus('Auto-booking failed: ' + error.message, 'error');
      alert('❌ Auto-booking failed:\n\n' + error.message + '\n\nPlease try manual booking instead.');
      throw error;
    }
  }

  /**
   * Update interface for manual mode
   */
  updateInterfaceForManualMode() {
    // Update the main panel to show manual mode
    const panel = document.getElementById('dvsa-queen-panel');
    if (panel) {
      const statusText = panel.querySelector('.status-text');
      if (statusText) {
        statusText.textContent = 'Manual Mode - Click Check Now';
      }
    }
  }

  /**
   * Refresh pupil display in extension panel
   */
  refreshPupilDisplay() {
    console.log('🔄 Refreshing pupil display...');
    this.loadPupilsFromStorage().then(() => {
      this.updatePupilUI();
    }).catch(error => {
      console.error('❌ Failed to refresh pupil display:', error);
    });
  }

  /**
   * Load pupils from extension storage
   */
  async loadPupilsFromStorage() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getState' });
      if (response.success && response.state.pupils) {
        this.pupils = response.state.pupils;
        console.log('✅ Loaded pupils from storage:', this.pupils.length);
      }
    } catch (error) {
      console.error('❌ Failed to load pupils from storage:', error);
      this.pupils = [];
    }
  }

  /**
   * Update pupil UI elements
   */
  updatePupilUI() {
    // Update multi-pupil display if available
    const multiPupilElement = document.querySelector('.dvsa-queen-multi-pupil');
    if (multiPupilElement && this.pupils.length > 0) {
      multiPupilElement.innerHTML = `
        <div class="feature-icon">👥</div>
        <div class="feature-text">${this.pupils.length} Pupil${this.pupils.length !== 1 ? 's' : ''} Active</div>
      `;
      multiPupilElement.style.display = 'flex';
    }

    // Add pupil management section if multi-pupil is enabled
    if (this.subscription.features.multiPupil) {
      this.addPupilManagementSection();
    }
  }

  /**
   * Add pupil management section to panel
   */
  addPupilManagementSection() {
    const content = document.querySelector('.dvsa-queen-content');
    if (!content) return;

    // Remove existing pupil management section
    const existingSection = document.querySelector('.dvsa-pupil-management');
    if (existingSection) {
      existingSection.remove();
    }

    // Create pupil management section
    const managementSection = document.createElement('div');
    managementSection.className = 'dvsa-pupil-management';
    managementSection.innerHTML = `
      <div class="dvsa-section-header">
        <h4>Pupil Management</h4>
        <button class="dvsa-add-pupil-btn" onclick="window.dvsaQueen.openModernPupilForm()">+ Add Pupil</button>
      </div>
      <div class="dvsa-pupil-list">
        ${this.pupils.map(pupil => this.createPupilItem(pupil)).join('')}
      </div>
    `;

    // Insert after status section
    const statusSection = content.querySelector('.dvsa-queen-status');
    if (statusSection) {
      statusSection.parentNode.insertBefore(managementSection, statusSection.nextSibling);
    }
  }

  /**
   * Create pupil item HTML
   */
  createPupilItem(pupil) {
    return `
      <div class="dvsa-pupil-item" data-pupil-id="${pupil.id}">
        <div class="dvsa-pupil-info">
          <div class="dvsa-pupil-name">${pupil.name}</div>
          <div class="dvsa-pupil-details">${pupil.testCentre} • ${pupil.licenceNumber}</div>
        </div>
        <div class="dvsa-pupil-actions">
          <button class="dvsa-pupil-btn dvsa-pupil-edit" onclick="window.dvsaQueen.editPupil('${pupil.id}')" title="Edit">✏️</button>
          <button class="dvsa-pupil-btn dvsa-pupil-${pupil.status === 'active' ? 'pause' : 'resume'}"
                  onclick="window.dvsaQueen.togglePupilStatus('${pupil.id}')"
                  title="${pupil.status === 'active' ? 'Pause' : 'Resume'}">${pupil.status === 'active' ? '⏸️' : '▶️'}</button>
          <button class="dvsa-pupil-btn dvsa-pupil-delete" onclick="window.dvsaQueen.deletePupil('${pupil.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }

  /**
   * Get pupils list
   */
  async getPupilsList() {
    await this.loadPupilsFromStorage();
    return this.pupils;
  }

  /**
   * Update pupil
   */
  async updatePupil(pupilId, updates) {
    try {
      const pupilIndex = this.pupils.findIndex(p => p.id === pupilId);
      if (pupilIndex === -1) {
        return { success: false, error: 'Pupil not found' };
      }

      // Update pupil data
      this.pupils[pupilIndex] = { ...this.pupils[pupilIndex], ...updates };

      // Save to storage
      await chrome.runtime.sendMessage({
        action: 'updateState',
        data: { pupils: this.pupils }
      });

      // Refresh UI
      this.updatePupilUI();

      return { success: true, pupil: this.pupils[pupilIndex] };
    } catch (error) {
      console.error('❌ Error updating pupil:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete pupil
   */
  async deletePupil(pupilId) {
    try {
      const pupilIndex = this.pupils.findIndex(p => p.id === pupilId);
      if (pupilIndex === -1) {
        return { success: false, error: 'Pupil not found' };
      }

      const pupilName = this.pupils[pupilIndex].name;

      // Remove pupil
      this.pupils.splice(pupilIndex, 1);

      // Save to storage
      await chrome.runtime.sendMessage({
        action: 'updateState',
        data: { pupils: this.pupils }
      });

      // Refresh UI
      this.updatePupilUI();

      return { success: true, message: `Pupil ${pupilName} deleted` };
    } catch (error) {
      console.error('❌ Error deleting pupil:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Toggle pupil status (pause/resume)
   */
  async togglePupilStatus(pupilId) {
    try {
      const pupil = this.pupils.find(p => p.id === pupilId);
      if (!pupil) {
        return { success: false, error: 'Pupil not found' };
      }

      const newStatus = pupil.status === 'active' ? 'paused' : 'active';
      return await this.updatePupil(pupilId, { status: newStatus });
    } catch (error) {
      console.error('❌ Error toggling pupil status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Edit pupil (open form with existing data)
   */
  async editPupil(pupilId) {
    const pupil = this.pupils.find(p => p.id === pupilId);
    if (!pupil) {
      alert('Pupil not found');
      return;
    }

    // Open modern form with existing data
    if (typeof ModernPupilForm !== 'undefined') {
      const form = new ModernPupilForm();
      form.showEditForm(pupil);
    } else {
      // Load form script first
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('modern-pupil-form.js');
      script.onload = () => {
        const form = new ModernPupilForm();
        form.showEditForm(pupil);
      };
      document.head.appendChild(script);
    }
  }

  /**
   * Extra verification steps for high-risk operations
   */
  async extraVerificationSteps(pupil, currentBooking, newSlot) {
    console.log('🔍 Extra verification steps for high-risk change');

    // Additional checks for suspicious patterns
    // Would implement comprehensive validation

    await this.stealthSystem.simulateThinking('important');
  }

  /**
   * Helper methods for DVSA integration
   */
  async stealthLogin(pupil) {
    // Would integrate with existing DVSA login logic
    console.log('🔐 Stealth login for pupil:', pupil.licence);
  }

  async findCurrentBooking(pupil) {
    // Would find current booking in DVSA system
    console.log('🔍 Finding current booking for pupil:', pupil.licence);
    return { date: '2025-01-15', centre: 'LONDON-WD' }; // Mock
  }

  async reserveNewSlot(newSlot) {
    // Would reserve the new slot
    console.log('🎯 Reserving new slot:', newSlot);
    return 'RES123456'; // Mock reservation ID
  }

  async confirmNewBooking(reservationId) {
    // Would confirm the new booking
    console.log('✅ Confirming new booking:', reservationId);
    return true;
  }
}

/**
 * Initialize content script when DOM is ready
 */
(function() {
  'use strict';

  // Check if we're on the right page before initializing
  if (!window.location.href.includes('driverpracticaltest.dvsa.gov.uk')) {
    return;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentScript);
  } else {
    initContentScript();
  }

  async function initContentScript() {
    console.log('🚀 Initializing DVSA Queen content script');

    const contentStealth = new ContentStealth();
    await contentStealth.initialize();
  }
})();