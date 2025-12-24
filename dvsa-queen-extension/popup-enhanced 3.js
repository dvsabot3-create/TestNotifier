/**
 * DVSA Queen - Enhanced Popup JavaScript
 * Professional driving test cancellation finder with advanced interface
 */

class EnhancedPopupManager {
  constructor() {
    this.currentUser = null;
    this.users = [];
    this.selectedCenters = [];
    this.availableCenters = [];
    this.automationStatus = 'stopped';
    this.startTime = null;
    this.clickCount = 0;
    this.currentDelay = 1000;
    this.isRapidMode = false;
    this.stats = {
      totalChecks: 0,
      successfulChanges: 0,
      successRate: 0
    };

    this.isInitialized = false;
    this.autoRefreshInterval = null;
  }

  /**
   * Initialize enhanced popup when DOM is ready
   */
  async initialize() {
    console.log('🚀 Initializing enhanced popup...');

    this.showLoading(true);

    try {
      await this.loadExtensionState();
      await this.loadAvailableCenters();
      this.setupEventListeners();
      this.setupTabNavigation();
      this.updateUI();
      this.startAutoRefresh();

      this.isInitialized = true;
      console.log('✅ Enhanced popup initialized');
    } catch (error) {
      console.error('❌ Error initializing enhanced popup:', error);
      this.showError('Failed to initialize extension');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Load extension state from storage
   */
  async loadExtensionState() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getEnhancedState' });
      if (response.success) {
        const state = response.state;
        this.currentUser = state.currentUser;
        this.users = state.users || [];
        this.selectedCenters = state.selectedCenters || [];
        this.automationStatus = state.automationStatus || 'stopped';
        this.startTime = state.startTime;
        this.clickCount = state.clickCount || 0;
        this.currentDelay = state.currentDelay || 1000;
        this.isRapidMode = state.isRapidMode || false;
        this.stats = { ...this.stats, ...state.stats };

        console.log('✅ Enhanced state loaded:', {
          users: this.users.length,
          centers: this.selectedCenters.length,
          automation: this.automationStatus,
          clicks: this.clickCount
        });
      }
    } catch (error) {
      console.error('❌ Error loading extension state:', error);
    }
  }

  /**
   * Load available test centers
   */
  async loadAvailableCenters() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAvailableCenters' });
      if (response.success) {
        this.availableCenters = response.centers;
        console.log('✅ Available centers loaded:', this.availableCenters.length);
      }
    } catch (error) {
      console.error('❌ Error loading available centers:', error);
    }
  }

  /**
   * Setup tab navigation
   */
  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // Update active states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');

        // Track tab usage
        this.trackEvent('tab_switch', { tab: targetTab });
      });
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Automation controls
    const startBtn = document.getElementById('start-automation');
    const stopBtn = document.getElementById('stop-automation');
    const rapidModeCheckbox = document.getElementById('rapid-mode');

    if (startBtn) startBtn.addEventListener('click', () => this.startAutomation());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stopAutomation());
    if (rapidModeCheckbox) rapidModeCheckbox.addEventListener('change', () => this.toggleRapidMode());

    // Date range inputs
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    if (startDateInput) startDateInput.addEventListener('change', () => this.updateDateRange());
    if (endDateInput) endDateInput.addEventListener('change', () => this.updateDateRange());

    // Advanced settings toggle
    const advancedToggle = document.getElementById('advanced-toggle');
    if (advancedToggle) {
      advancedToggle.addEventListener('click', () => this.toggleAdvancedSettings());
    }

    // Test center search
    const centerSearch = document.getElementById('center-search');
    if (centerSearch) {
      centerSearch.addEventListener('input', (e) => this.handleCenterSearch(e.target.value));
    }

    // User management
    const userSelect = document.getElementById('user-select');
    const delaySelect = document.getElementById('delay-select');

    if (userSelect) userSelect.addEventListener('change', () => this.selectUser());
    if (delaySelect) delaySelect.addEventListener('change', () => this.updateDelay());

    // Action buttons
    const reserveAnotherBtn = document.getElementById('reserve-another');
    const openSettingsBtn = document.getElementById('open-settings');

    if (reserveAnotherBtn) reserveAnotherBtn.addEventListener('click', () => this.reserveAnotherTest());
    if (openSettingsBtn) openSettingsBtn.addEventListener('click', () => this.openSettings());

    // Tab-specific buttons
    const addPupilBtn = document.getElementById('add-pupil');
    const createGroupBtn = document.getElementById('create-group');

    if (addPupilBtn) addPupilBtn.addEventListener('click', () => this.addPupil());
    if (createGroupBtn) createGroupBtn.addEventListener('click', () => this.createCenterGroup());
  }

  /**
   * Start automation
   */
  async startAutomation() {
    try {
      if (this.selectedCenters.length === 0) {
        this.showError('Please select at least one test center');
        return;
      }

      if (!this.currentUser) {
        this.showError('Please select a user first');
        return;
      }

      this.showLoading(true);

      const response = await chrome.runtime.sendMessage({
        action: 'startAutomation',
        config: {
          startDate: document.getElementById('start-date').value,
          endDate: document.getElementById('end-date').value,
          centers: this.selectedCenters,
          userId: this.currentUser.id,
          rapidMode: this.isRapidMode,
          delay: this.currentDelay
        }
      });

      if (response.success) {
        this.automationStatus = 'running';
        this.startTime = Date.now();
        this.updateAutomationUI();
        this.trackEvent('automation_started', {
          centers: this.selectedCenters.length,
          rapidMode: this.isRapidMode,
          delay: this.currentDelay
        });
      } else {
        this.showError(response.message || 'Failed to start automation');
      }
    } catch (error) {
      console.error('❌ Error starting automation:', error);
      this.showError('Failed to start automation');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Stop automation
   */
  async stopAutomation() {
    try {
      this.showLoading(true);

      const response = await chrome.runtime.sendMessage({ action: 'stopAutomation' });

      if (response.success) {
        this.automationStatus = 'stopped';
        this.updateAutomationUI();
        this.trackEvent('automation_stopped', {
          duration: this.startTime ? Date.now() - this.startTime : 0,
          clicks: this.clickCount
        });
      } else {
        this.showError(response.message || 'Failed to stop automation');
      }
    } catch (error) {
      console.error('❌ Error stopping automation:', error);
      this.showError('Failed to stop automation');
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Toggle rapid mode
   */
  async toggleRapidMode() {
    this.isRapidMode = document.getElementById('rapid-mode').checked;
    this.currentDelay = this.isRapidMode ? 500 : 1000;

    // Update delay selector
    const delaySelect = document.getElementById('delay-select');
    if (delaySelect) {
      delaySelect.value = this.currentDelay.toString();
    }

    // Send to background script
    try {
      await chrome.runtime.sendMessage({
        action: 'updateAutomationConfig',
        config: { rapidMode: this.isRapidMode, delay: this.currentDelay }
      });
    } catch (error) {
      console.error('❌ Error updating rapid mode:', error);
    }

    this.trackEvent('rapid_mode_toggled', { enabled: this.isRapidMode });
  }

  /**
   * Handle center search
   */
  handleCenterSearch(query) {
    const resultsContainer = document.getElementById('search-results');

    if (!query.trim()) {
      resultsContainer.style.display = 'none';
      return;
    }

    const filteredCenters = this.availableCenters.filter(center =>
      center.name.toLowerCase().includes(query.toLowerCase()) ||
      center.code.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (filteredCenters.length > 0) {
      resultsContainer.innerHTML = filteredCenters.map(center => `
        <div class="search-result-item" data-center-id="${center.id}">
          ${center.name} (${center.code})
        </div>
      `).join('');

      resultsContainer.style.display = 'block';

      // Add click handlers
      resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => this.addCenter(item.dataset.centerId));
      });
    } else {
      resultsContainer.innerHTML = '<div class="search-result-item">No centers found</div>';
      resultsContainer.style.display = 'block';
    }
  }

  /**
   * Add test center
   */
  async addCenter(centerId) {
    if (this.selectedCenters.length >= 5) {
      this.showError('Maximum 5 centers allowed');
      return;
    }

    if (this.selectedCenters.includes(centerId)) {
      this.showError('Center already selected');
      return;
    }

    this.selectedCenters.push(centerId);
    await this.saveState();
    this.updateCentersList();

    // Clear search
    document.getElementById('center-search').value = '';
    document.getElementById('search-results').style.display = 'none';

    this.trackEvent('center_added', { centerId });
  }

  /**
   * Remove test center
   */
  async removeCenter(centerId) {
    this.selectedCenters = this.selectedCenters.filter(id => id !== centerId);
    await this.saveState();
    this.updateCentersList();

    this.trackEvent('center_removed', { centerId });
  }

  /**
   * Update UI
   */
  updateUI() {
    this.updateAutomationUI();
    this.updateUsersList();
    this.updateCentersList();
    this.updateStats();
    this.updateUserSelector();
    this.updateTimer();
  }

  /**
   * Update automation UI
   */
  updateAutomationUI() {
    const startBtn = document.getElementById('start-automation');
    const stopBtn = document.getElementById('stop-automation');
    const statusDiv = document.getElementById('automation-status');
    const rapidModeCheckbox = document.getElementById('rapid-mode');

    if (this.automationStatus === 'running') {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      statusDiv.className = 'status-display status-running';
      rapidModeCheckbox.disabled = true;

      const elapsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;

      statusDiv.innerHTML = `
        <strong>RUNNING</strong> - ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
        <br><small>Clicks: ${this.clickCount}</small>
      `;
    } else {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusDiv.className = 'status-display status-stopped';
      statusDiv.innerHTML = '<strong>STOPPED</strong> - Ready to start';
      rapidModeCheckbox.disabled = false;
    }

    // Update rapid mode checkbox
    rapidModeCheckbox.checked = this.isRapidMode;
  }

  /**
   * Update centers list
   */
  updateCentersList() {
    const container = document.getElementById('selected-centers-list');
    const countElement = document.querySelector('.centers-count');

    if (container) {
      if (this.selectedCenters.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #6c757d; font-size: 11px; padding: 10px;">No centers selected</div>';
      } else {
        container.innerHTML = this.selectedCenters.map(centerId => {
          const center = this.availableCenters.find(c => c.id === centerId);
          if (!center) return '';

          return `
            <div class="center-item">
              <span class="center-name">${center.name}</span>
              <button class="remove-center" data-center-id="${centerId}">Remove</button>
            </div>
          `;
        }).join('');

        // Add remove handlers
        container.querySelectorAll('.remove-center').forEach(btn => {
          btn.addEventListener('click', () => this.removeCenter(btn.dataset.centerId));
        });
      }
    }

    if (countElement) {
      countElement.textContent = `${this.selectedCenters.length}/5`;
    }
  }

  /**
   * Update user selector
   */
  updateUserSelector() {
    const userSelect = document.getElementById('user-select');
    const clickCountElement = document.getElementById('click-count');

    if (userSelect) {
      userSelect.innerHTML = `
        <option value="">Choose pupil...</option>
        ${this.users.map(user => `
          <option value="${user.id}" ${user.id === this.currentUser?.id ? 'selected' : ''}>
            ${user.name} - ${user.licenceType}
          </option>
        `).join('')}
      `;
    }

    if (clickCountElement) {
      clickCountElement.textContent = this.clickCount.toString();
    }
  }

  /**
   * Update timer
   */
  updateTimer() {
    if (this.automationStatus === 'running' && this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;

      const statusDiv = document.getElementById('automation-status');
      if (statusDiv) {
        statusDiv.innerHTML = `
          <strong>RUNNING</strong> - ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
          <br><small>Clicks: ${this.clickCount}</small>
        `;
      }
    }
  }

  /**
   * Start auto-refresh timer
   */
  startAutoRefresh() {
    this.autoRefreshInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  /**
   * Toggle advanced settings
   */
  toggleAdvancedSettings() {
    const content = document.getElementById('advanced-content');
    const icon = document.getElementById('toggle-icon');

    if (content.classList.contains('expanded')) {
      content.classList.remove('expanded');
      icon.textContent = '▼';
    } else {
      content.classList.add('expanded');
      icon.textContent = '▲';
    }
  }

  /**
   * Save state to storage
   */
  async saveState() {
    try {
      await chrome.runtime.sendMessage({
        action: 'saveEnhancedState',
        state: {
          currentUser: this.currentUser,
          users: this.users,
          selectedCenters: this.selectedCenters,
          automationStatus: this.automationStatus,
          startTime: this.startTime,
          clickCount: this.clickCount,
          currentDelay: this.currentDelay,
          isRapidMode: this.isRapidMode,
          stats: this.stats
        }
      });
    } catch (error) {
      console.error('❌ Error saving state:', error);
    }
  }

  /**
   * Track events for analytics
   */
  trackEvent(action, metadata = {}) {
    try {
      chrome.runtime.sendMessage({
        action: 'trackEvent',
        event: 'popup_action',
        data: { action, ...metadata }
      });
    } catch (error) {
      console.error('❌ Error tracking event:', error);
    }
  }

  /**
   * UI Helper methods
   */
  showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.toggle('active', show);
    }
  }

  showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #f8d7da;
      color: #721c24;
      padding: 10px 15px;
      border-radius: 4px;
      border: 1px solid #f5c6cb;
      z-index: 1000;
      font-size: 12px;
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Placeholder methods for future implementation
  async selectUser() {
    const userSelect = document.getElementById('user-select');
    const selectedUserId = userSelect.value;

    if (selectedUserId) {
      this.currentUser = this.users.find(u => u.id === selectedUserId);
      await this.saveState();
      this.trackEvent('user_selected', { userId: selectedUserId });
    }
  }

  async updateDelay() {
    const delaySelect = document.getElementById('delay-select');
    this.currentDelay = parseInt(delaySelect.value);
    await this.saveState();
    this.trackEvent('delay_updated', { delay: this.currentDelay });
  }

  async updateDateRange() {
    await this.saveState();
    this.trackEvent('date_range_updated', {
      startDate: document.getElementById('start-date').value,
      endDate: document.getElementById('end-date').value
    });
  }

  reserveAnotherTest() {
    this.trackEvent('reserve_another_clicked');
    // Implementation for reserving another test
  }

  openSettings() {
    chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    this.trackEvent('settings_opened');
  }

  addPupil() {
    this.trackEvent('add_pupil_clicked');
    // Implementation for adding pupil
  }

  createCenterGroup() {
    this.trackEvent('create_group_clicked');
    // Implementation for creating center group
  }

  updateStats() {
    // Update statistics display
    const totalChecksElement = document.getElementById('total-checks');
    const successfulChangesElement = document.getElementById('successful-changes');
    const successRateElement = document.getElementById('success-rate');

    if (totalChecksElement) totalChecksElement.textContent = this.stats.totalChecks.toLocaleString();
    if (successfulChangesElement) successfulChangesElement.textContent = this.stats.successfulChanges;
    if (successRateElement) successRateElement.textContent = `${this.stats.successRate}%`;
  }

  updateUsersList() {
    // Implementation for updating users list in users tab
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popupManager = new EnhancedPopupManager();
  popupManager.initialize();
});