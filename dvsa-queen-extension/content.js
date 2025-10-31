/**
 * DVSA Queen - Content Script
 * Injects into DVSA booking pages and provides stealth automation
 */

// Import stealth modules (will be bundled)
class ContentStealth {
  constructor() {
    this.isActive = false;
    this.currentInstructor = null;
    this.pupils = [];
    this.settings = {
      autoCheck: true,
      checkInterval: 15000, // 15 seconds
      soundEnabled: true,
      notifications: true
    };

    this.stealthMetrics = {
      totalChecks: 0,
      successfulChanges: 0,
      lastCheck: null,
      detectionRisk: 'LOW'
    };

    this.mouseSimulator = new MouseSimulator();
    this.timingRandomizer = new TimingRandomizer();
    this.detectionEvasion = new DetectionEvasion();
    this.bookingManager = new BookingManager();
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
    this.injectInterface();
    this.setupEventListeners();
    this.startMonitoring();

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
    panel.innerHTML = `
      <div class="dvsa-queen-header">
        <span class="dvsa-queen-title">DVSA Queen</span>
        <button class="dvsa-queen-close" title="Close">×</button>
      </div>
      <div class="dvsa-queen-content">
        <div class="dvsa-queen-status">
          <span class="status-indicator"></span>
          <span class="status-text">Ready</span>
        </div>
        <div class="dvsa-queen-controls">
          <button class="dvsa-queen-check-btn">Check Now</button>
          <button class="dvsa-queen-settings-btn">⚙️</button>
        </div>
        <div class="dvsa-queen-stats">
          <div>Checks: <span class="check-count">0</span></div>
          <div>Success: <span class="success-count">0</span></div>
          <div>Risk: <span class="risk-level">LOW</span></div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #dvsa-queen-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 280px;
        background: #ffffff;
        border: 2px solid #1d70b8;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 10000;
        transition: all 0.3s ease;
      }

      #dvsa-queen-panel.minimized {
        width: 60px;
        height: 40px;
        overflow: hidden;
      }

      .dvsa-queen-header {
        background: #1d70b8;
        color: white;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      }

      .dvsa-queen-title {
        font-weight: bold;
        font-size: 16px;
      }

      .dvsa-queen-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dvsa-queen-content {
        padding: 12px;
      }

      .dvsa-queen-status {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
        background: #28a745;
      }

      .status-indicator.inactive {
        background: #dc3545;
      }

      .status-indicator.warning {
        background: #ffc107;
      }

      .dvsa-queen-controls {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .dvsa-queen-check-btn,
      .dvsa-queen-settings-btn {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #1d70b8;
        background: white;
        color: #1d70b8;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .dvsa-queen-check-btn:hover,
      .dvsa-queen-settings-btn:hover {
        background: #1d70b8;
        color: white;
      }

      .dvsa-queen-stats {
        font-size: 12px;
        color: #666;
      }

      .dvsa-queen-stats div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .check-count,
      .success-count,
      .risk-level {
        font-weight: bold;
      }

      .risk-level.LOW { color: #28a745; }
      .risk-level.MEDIUM { color: #ffc107; }
      .risk-level.HIGH { color: #dc3545; }
    `;

    document.head.appendChild(style);
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

    // Settings button
    panel.querySelector('.dvsa-queen-settings-btn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openOptions' });
    });

    // Make panel draggable
    this.makePanelDraggable(panel);
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
    // This would integrate with your existing DVSA checking logic
    // For now, simulating the check process

    console.log('🔍 Checking DVSA calendar for available slots...');

    // Simulate finding slots (would be real implementation)
    const mockSlots = [
      { date: '2024-12-15', centre: 'LONDON-WD', time: '09:00' },
      { date: '2024-12-18', centre: 'LONDON-WG', time: '14:30' }
    ];

    // Filter by pupil preferences (would be real logic)
    return mockSlots.filter(slot => {
      // Check if slot is earlier than current booking
      // Check if centre is in pupil's preferred list
      // Check if date is within pupil's range
      return true; // Simplified for demo
    });
  }

  /**
   * Handle found available slots
   */
  async handleFoundSlots(slots) {
    console.log('🎯 Processing found slots:', slots);

    // Send to background script for notification
    await chrome.runtime.sendMessage({
      action: 'foundCancellation',
      data: {
        pupilName: 'Current Pupil', // Would get real name
        newDate: slots[0].date,
        newCentre: slots[0].centre,
        newTime: slots[0].time,
        timestamp: new Date()
      }
    });

    // Highlight slots in page (optional)
    this.highlightAvailableSlots(slots);
  }

  /**
   * Highlight available slots in the page
   */
  highlightAvailableSlots(slots) {
    // Find calendar elements and highlight available slots
    // This would integrate with DVSA's calendar UI
    console.log('🎨 Highlighting available slots:', slots);
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
})();","file_path":"/Users/mosman/Documents/DVLA BOT/dvsa-queen-extension/content.js"}