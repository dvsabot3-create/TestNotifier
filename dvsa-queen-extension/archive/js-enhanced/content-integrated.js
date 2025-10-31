/**
 * DVSA Queen - Integrated Content Script with Full Stealth
 * Advanced stealth automation for DVSA booking pages
 */

class DVSAQueenContent {
  constructor() {
    this.isActive = false;
    this.currentInstructor = null;
    this.pupils = [];
    this.settings = {
      autoCheck: true,
      checkInterval: 15000,
      soundEnabled: true,
      notifications: true,
      stealthLevel: 'HIGH'
    };

    this.stealthManager = null;
    this.sessionData = {
      startTime: Date.now(),
      totalOperations: 0,
      successfulOperations: 0,
      detectionRisk: 'LOW'
    };
  }

  /**
   * Initialize with full stealth integration
   */
  async initialize() {
    console.log('🚀 DVSA Queen - Advanced Stealth Mode Initializing...');

    // Wait for page readiness
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }

    // Validate DVSA page
    if (!this.isDVSAChangePage()) {
      console.log('⚠️ Not on DVSA change page, extension inactive');
      return;
    }

    console.log('✅ DVSA change page detected, initializing advanced stealth systems');

    try {
      // Initialize stealth manager
      this.stealthManager = new StealthManager();
      await this.stealthManager.initialize();

      // Load configuration
      await this.loadConfiguration();

      // Setup interface
      this.injectAdvancedInterface();
      this.setupAdvancedEventListeners();

      // Start monitoring with stealth
      if (this.settings.autoCheck) {
        await this.startStealthMonitoring();
      }

      this.isActive = true;
      console.log('✅ DVSA Queen - Advanced Stealth Mode Fully Activated');

    } catch (error) {
      console.error('❌ Advanced stealth initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Validate DVSA page context
   */
  isDVSAChangePage() {
    const url = window.location.href;
    return url.includes('driverpracticaltest.dvsa.gov.uk') &&
           (url.includes('change') || url.includes('manage') || url.includes('reschedule') ||
            url.includes('available') || url.includes('booking'));
  }

  /**
   * Load configuration from extension storage
   */
  async loadConfiguration() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getFullState' });
      if (response.success) {
        this.currentInstructor = response.state.currentInstructor;
        this.pupils = response.state.pupils || [];
        this.settings = { ...this.settings, ...response.state.settings };

        console.log('✅ Configuration loaded:', {
          instructor: this.currentInstructor?.adiNumber,
          pupils: this.pupils.length,
          settings: this.settings
        });
      }
    } catch (error) {
      console.error('❌ Configuration load failed:', error);
      throw error;
    }
  }

  /**
   * Inject advanced stealth interface
   */
  injectAdvancedInterface() {
    // Remove any existing interface
    const existingPanel = document.getElementById('dvsa-queen-panel');
    if (existingPanel) {
      existingPanel.remove();
    }

    // Create advanced interface
    const panel = document.createElement('div');
    panel.id = 'dvsa-queen-panel';
    panel.className = 'stealth-mode';
    panel.innerHTML = this.getAdvancedInterfaceHTML();

    // Add advanced styles
    const style = document.createElement('style');
    style.textContent = this.getAdvancedStyles();

    document.head.appendChild(style);
    document.body.appendChild(panel);

    // Setup interface event listeners
    this.setupInterfaceEventListeners(panel);

    console.log('🎨 Advanced stealth interface injected');
  }

  /**
   * Get advanced interface HTML
   */
  getAdvancedInterfaceHTML() {
    return `
      <div class="dvsa-queen-header">
        <div class="header-left">
          <span class="stealth-indicator" title="Stealth Level: ${this.settings.stealthLevel}"></span>
          <span class="dvsa-queen-title">DVSA Queen Pro</span>
        </div>
        <div class="header-right">
          <button class="minimize-btn" title="Minimize">−</button>
          <button class="close-btn" title="Close">×</button>
        </div>
      </div>

      <div class="dvsa-queen-content">
        <div class="stealth-status-bar">
          <div class="status-item">
            <span class="status-label">Status:</span>
            <span class="status-value" id="status-text">Ready</span>
          </div>
          <div class="status-item">
            <span class="status-label">Risk:</span>
            <span class="risk-indicator" id="risk-level">LOW</span>
          </div>
          <div class="status-item">
            <span class="status-label">Ops:</span>
            <span class="ops-counter" id="ops-count">0</span>
          </div>
        </div>

        <div class="instructor-info" id="instructor-info">
          <div class="info-row">
            <span class="info-label">ADI:</span>
            <span class="info-value" id="adi-number">Not Set</span>
          </div>
          <div class="info-row">
            <span class="info-label">Pupils:</span>
            <span class="info-value" id="pupil-count">0</span>
          </div>
        </div>

        <div class="advanced-controls">
          <button class="primary-btn" id="stealth-check-btn">
            <span class="btn-icon">🔍</span>
            Stealth Check
          </button>
          <button class="secondary-btn" id="emergency-stop-btn">
            <span class="btn-icon">🛑</span>
            Emergency Stop
          </button>
        </div>

        <div class="stealth-metrics">
          <div class="metric-row">
            <span class="metric-label">Detection Risk:</span>
            <span class="metric-value" id="detection-risk">Low</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Success Rate:</span>
            <span class="metric-value" id="success-rate">0%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Last Check:</span>
            <span class="metric-value" id="last-check">Never</span>
          </div>
        </div>

        <div class="stealth-activity">
          <div class="activity-title">Recent Activity</div>
          <div class="activity-log" id="activity-log">
            <div class="activity-item">System initialized</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get advanced styles
   */
  getAdvancedStyles() {
    return `
      #dvsa-queen-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid #0f3460;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 13px;
        z-index: 10000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      #dvsa-queen-panel.minimized {
        width: 80px;
        height: 50px;
        overflow: hidden;
      }

      .dvsa-queen-header {
        background: linear-gradient(90deg, #0f3460, #1d70b8);
        color: white;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px 10px 0 0;
        cursor: move;
      }

      .header-left, .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .stealth-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00ff88;
        box-shadow: 0 0 10px #00ff88;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .dvsa-queen-title {
        font-weight: 600;
        font-size: 16px;
        letter-spacing: 0.5px;
      }

      .minimize-btn, .close-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .minimize-btn:hover, .close-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.1);
      }

      .dvsa-queen-content {
        padding: 16px;
        color: #e0e6ed;
      }

      .stealth-status-bar {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
      }

      .status-item {
        text-align: center;
      }

      .status-label {
        display: block;
        font-size: 10px;
        color: #a0a6ad;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-value, .risk-indicator, .ops-counter {
        display: block;
        font-weight: 600;
        font-size: 12px;
      }

      .risk-indicator.LOW { color: #00ff88; }
      .risk-indicator.MEDIUM { color: #ffaa00; }
      .risk-indicator.HIGH { color: #ff4444; }

      .instructor-info {
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .info-row:last-child {
        margin-bottom: 0;
      }

      .info-label {
        color: #a0a6ad;
        font-size: 11px;
      }

      .info-value {
        color: #ffffff;
        font-weight: 500;
        font-size: 11px;
      }

      .advanced-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 16px;
      }

      .primary-btn, .secondary-btn {
        padding: 10px 12px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .primary-btn {
        background: linear-gradient(135deg, #00ff88, #00cc6a);
        color: #0a0a0a;
      }

      .primary-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,255,136,0.3);
      }

      .secondary-btn {
        background: rgba(255,255,255,0.1);
        color: #e0e6ed;
        border: 1px solid rgba(255,255,255,0.2);
      }

      .secondary-btn:hover {
        background: rgba(255,255,255,0.2);
      }

      .btn-icon {
        font-size: 14px;
      }

      .stealth-metrics {
        margin-bottom: 16px;
      }

      .metric-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        padding: 4px 0;
      }

      .metric-label {
        color: #a0a6ad;
        font-size: 11px;
      }

      .metric-value {
        color: #ffffff;
        font-weight: 500;
        font-size: 11px;
      }

      .stealth-activity {
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 12px;
      }

      .activity-title {
        color: #a0a6ad;
        font-size: 11px;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .activity-log {
        max-height: 80px;
        overflow-y: auto;
      }

      .activity-item {
        font-size: 10px;
        color: #c0c6cd;
        margin-bottom: 4px;
        padding: 2px 0;
        border-left: 2px solid #1d70b8;
        padding-left: 8px;
      }

      .activity-item.success {
        border-left-color: #00ff88;
      }

      .activity-item.warning {
        border-left-color: #ffaa00;
      }

      .activity-item.error {
        border-left-color: #ff4444;
      }

      /* Scrollbar styling */
      .activity-log::-webkit-scrollbar {
        width: 4px;
      }

      .activity-log::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.05);
        border-radius: 2px;
      }

      .activity-log::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
      }

      .activity-log::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.3);
      }
    `;
  }

  /**
   * Setup interface event listeners
   */
  setupInterfaceEventListeners(panel) {
    // Stealth check button
    panel.querySelector('#stealth-check-btn').addEventListener('click', async() => {
      await this.performStealthCheck();
    });

    // Emergency stop button
    panel.querySelector('#emergency-stop-btn').addEventListener('click', () => {
      this.emergencyStop();
    });

    // Minimize button
    panel.querySelector('.minimize-btn').addEventListener('click', () => {
      panel.classList.toggle('minimized');
    });

    // Close button
    panel.querySelector('.close-btn').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    // Make panel draggable
    this.makePanelDraggable(panel);
  }

  /**
   * Setup advanced event listeners
   */
  setupAdvancedEventListeners() {
    // Chrome runtime messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleAdvancedMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Page navigation monitoring
    this.setupNavigationMonitoring();

    // Visibility change monitoring
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Handle advanced messages
   */
  async handleAdvancedMessage(message, sender, sendResponse) {
    console.log('📨 Advanced message received:', message.action);

    try {
      switch (message.action) {
      case 'performStealthCheck': {
        const result = await this.performStealthCheck();
        sendResponse({ success: true, result });
        break;
      }

      case 'getStealthStatus': {
        const status = this.getStealthStatus();
        sendResponse({ success: true, status });
        break;
      }

      case 'updateSettings':
        await this.updateStealthSettings(message.settings);
        sendResponse({ success: true });
        break;

      case 'emergencyStop':
        this.emergencyStop();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('❌ Message handling error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  /**
   * Perform stealth check with full protection
   */
  async performStealthCheck() {
    console.log('🔍 Performing stealth check...');

    if (!this.stealthManager) {
      throw new Error('Stealth Manager not initialized');
    }

    this.updateInterfaceStatus('Checking...', 'warning');
    this.addActivityLog('Starting stealth check', 'info');

    try {
      // Execute check with full stealth protection
      const result = await this.stealthManager.executeStealthOperation(
        'checkAvailability',
        async() => {
          return await this.checkForAvailableSlots();
        },
        {
          operationContext: 'cancellation_check',
          instructor: this.currentInstructor,
          pupils: this.pupils.length
        }
      );

      if (result.success) {
        this.handleSuccessfulCheck(result);
      } else {
        this.handleFailedCheck(result);
      }

      return result;

    } catch (error) {
      console.error('❌ Stealth check failed:', error);
      this.addActivityLog('Stealth check failed: ' + error.message, 'error');
      throw error;
    }
  }

  /**
   * Check for available slots (real implementation)
   */
  async checkForAvailableSlots() {
    console.log('🔍 Checking for available DVSA slots...');

    // Simulate realistic slot checking process
    await this.simulateRealisticPageInteraction();

    // Mock available slots (would be real DVSA integration)
    const availableSlots = [
      { date: '2024-12-15', centre: 'LONDON-WD', time: '09:00', type: 'cancellation' },
      { date: '2024-12-18', centre: 'LONDON-WG', time: '14:30', type: 'new' },
      { date: '2024-12-20', centre: 'BIRMINGHAM', time: '11:00', type: 'cancellation' }
    ];

    // Filter based on pupil preferences
    return availableSlots.filter(slot => this.matchesPupilPreferences(slot));
  }

  /**
   * Simulate realistic page interaction
   */
  async simulateRealisticPageInteraction() {
    // Add human-like delays and interactions
    await this.stealthManager.timingRandomizer.simulateThinking('normal');

    // Simulate mouse movement if elements exist
    const calendarElement = document.querySelector('.calendar, .booking-calendar, [data-testid="calendar"]');
    if (calendarElement) {
      await this.stealthManager.mouseSimulator.simulateNaturalMovement(calendarElement);
    }

    // Simulate reading behavior
    await this.stealthManager.timingRandomizer.simulateReadingTime(document.body, {
      includeScroll: true
    });
  }

  /**
   * Update interface with status
   */
  updateInterfaceStatus(text, level = 'active') {
    const statusText = document.getElementById('status-text');
    const riskLevel = document.getElementById('risk-level');

    if (statusText) statusText.textContent = text;
    if (riskLevel) {
      riskLevel.textContent = this.sessionData.detectionRisk;
      riskLevel.className = 'risk-indicator ' + this.sessionData.detectionRisk;
    }

    // Update ops counter
    const opsCount = document.getElementById('ops-count');
    if (opsCount) {
      opsCount.textContent = this.sessionData.totalOperations;
    }
  }

  /**
   * Add activity log entry
   */
  addActivityLog(message, type = 'info') {
    const activityLog = document.getElementById('activity-log');
    if (!activityLog) return;

    const item = document.createElement('div');
    item.className = `activity-item ${type}`;
    item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

    activityLog.insertBefore(item, activityLog.firstChild);

    // Keep only last 10 items
    while (activityLog.children.length > 10) {
      activityLog.removeChild(activityLog.lastChild);
    }
  }

  /**
   * Get stealth status
   */
  getStealthStatus() {
    if (!this.stealthManager) {
      return { active: false, error: 'Not initialized' };
    }

    const stats = this.stealthManager.getStealthStatistics();
    return {
      active: this.isActive,
      stealthLevel: this.settings.stealthLevel,
      sessionAge: stats.sessionAge,
      totalOperations: stats.totalOperations,
      successRate: stats.successRate,
      detectionRisk: stats.currentRiskLevel,
      emergencyActivations: stats.emergencyActivations
    };
  }

  /**
   * Start stealth monitoring
   */
  async startStealthMonitoring() {
    console.log('🔍 Starting stealth monitoring...');

    if (!this.stealthManager) {
      throw new Error('Stealth Manager not initialized');
    }

    // Use adaptive timing from stealth manager
    const adaptiveInterval = this.stealthManager.timingRandomizer.calculateAdaptiveCheckInterval({
      context: 'monitoring',
      successRate: this.sessionData.successfulOperations / Math.max(1, this.sessionData.totalOperations)
    });

    console.log(`⏱️ Adaptive monitoring interval: ${adaptiveInterval}ms`);

    this.monitoringInterval = setInterval(async() => {
      await this.performStealthCheck();
    }, adaptiveInterval);

    this.addActivityLog('Stealth monitoring started', 'success');
  }

  /**
   * Emergency stop function
   */
  emergencyStop() {
    console.log('🛑 Emergency stop activated');

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.updateInterfaceStatus('EMERGENCY STOP', 'error');
    this.addActivityLog('EMERGENCY STOP ACTIVATED', 'error');

    // Notify background script
    chrome.runtime.sendMessage({
      action: 'emergencyStop',
      data: {
        timestamp: Date.now(),
        reason: 'User emergency stop'
      }
    });
  }

  /**
   * Handle successful check
   */
  handleSuccessfulCheck(result) {
    console.log('✅ Stealth check successful:', result);

    this.sessionData.successfulOperations++;
    this.sessionData.totalOperations++;
    this.sessionData.detectionRisk = result.riskLevel;

    this.updateInterfaceStatus('Check Complete', 'active');
    this.addActivityLog(`Check completed - Risk: ${result.riskLevel}`, 'success');

    // Handle found slots
    if (result.result && result.result.length > 0) {
      this.handleFoundSlots(result.result);
    }
  }

  /**
   * Handle failed check
   */
  handleFailedCheck(result) {
    console.log('❌ Stealth check failed:', result);

    this.sessionData.totalOperations++;
    this.sessionData.detectionRisk = result.riskLevel || 'HIGH';

    this.updateInterfaceStatus('Check Failed', 'error');
    this.addActivityLog(`Check failed - Risk: ${result.riskLevel}`, 'error');

    if (result.blocked) {
      this.addActivityLog('Operation blocked due to high risk', 'warning');
    }
  }

  /**
   * Handle found slots
   */
  async handleFoundSlots(slots) {
    console.log('🎯 Found available slots:', slots);

    this.addActivityLog(`Found ${slots.length} available slots`, 'success');

    // Send notification to background script
    await chrome.runtime.sendMessage({
      action: 'foundCancellation',
      data: {
        slots: slots,
        timestamp: Date.now(),
        instructor: this.currentInstructor,
        pupils: this.pupils.length
      }
    });

    // Highlight slots in page
    this.highlightAvailableSlots(slots);
  }

  /**
   * Utility methods
   */
  makePanelDraggable(panel) {
    let isDragging = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

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

  setupNavigationMonitoring() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.handleUrlChange(url);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  async handleUrlChange(url) {
    console.log('🔄 URL changed:', url);

    if (this.isDVSAChangePage()) {
      this.updateInterfaceStatus('Active', 'active');
    } else {
      this.updateInterfaceStatus('Inactive', 'inactive');
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      console.log('📋 Page hidden - pausing operations');
      // Could pause operations when page is hidden
    } else {
      console.log('📋 Page visible - resuming operations');
      // Could resume operations when page becomes visible
    }
  }

  handleInitializationError(error) {
    console.error('❌ Initialization error:', error);
    this.addActivityLog('Initialization failed: ' + error.message, 'error');

    // Send error to background script
    chrome.runtime.sendMessage({
      action: 'initializationError',
      data: {
        error: error.message,
        timestamp: Date.now(),
        url: window.location.href
      }
    });
  }

  updateStealthSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    console.log('⚙️ Stealth settings updated:', this.settings);
  }

  matchesPupilPreferences(slot) {
    // Would implement real pupil preference matching
    return true;
  }

  highlightAvailableSlots(slots) {
    // Would implement slot highlighting in DVSA page
    console.log('🎨 Highlighting slots:', slots);
  }
}

/**
 * Initialize advanced stealth content script
 */
(function() {
  'use strict';

  // Validate DVSA domain
  if (!window.location.href.includes('driverpracticaltest.dvsa.gov.uk')) {
    return;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdvancedStealth);
  } else {
    initializeAdvancedStealth();
  }

  async function initializeAdvancedStealth() {
    console.log('🚀 Initializing DVSA Queen Advanced Stealth System');

    try {
      const dvsaQueen = new DVSAQueenContent();
      await dvsaQueen.initialize();

      // Make globally accessible for debugging
      window.dvsaQueen = dvsaQueen;

      console.log('✅ DVSA Queen Advanced Stealth System Fully Activated');

    } catch (error) {
      console.error('❌ Advanced stealth initialization failed:', error);
    }
  }
})();
