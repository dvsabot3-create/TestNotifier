/**
 * TestNotifier - Branded Chrome Extension Popup
 * Matches TestNotifier.co.uk design system
 */

class TestNotifierPopup {
  constructor() {
    this.isRunning = false;
    this.isRapidMode = false;
    this.selectedCenters = [];
    this.startTime = null;
    this.timerInterval = null;
    this.stats = {
      totalChecks: 0,
      testsFound: 0,
      successRate: 0,
      totalCancellationsFound: 0,
      totalBookingsChanged: 0,
      averageTimeSaved: 0
    };

    // New UI state
    this.currentView = 'main'; // 'main' or 'settings'
    this.monitors = []; // Will be loaded from real pupil data
    this.pupils = []; // Real pupil data from storage
  }

  /**
   * Initialize popup
   */
  async init() {
    console.log('🚀 TestNotifier popup initializing...');

    await this.loadState();
    this.setupEventListeners();
    this.handleBackgroundMessages();
    await this.loadSettingsIntoUI();
    this.updateUI();

    console.log('✅ TestNotifier popup ready');
  }

  /**
   * Convert pupil data to monitor format for UI display
   */
  convertPupilsToMonitors() {
    this.monitors = this.pupils.map((pupil, index) => ({
      id: pupil.id || index + 1,
      name: pupil.name,
      currentDate: pupil.currentBooking?.date || pupil.preferredDates?.from || 'Not set',
      testCenter: pupil.testCentre,
      status: pupil.status || 'active',
      foundSlots: pupil.stats?.foundSlots || 0,
      lastCheck: pupil.lastCheck ? this.formatLastCheckTime(pupil.lastCheck) : 'Never'
    }));
  }

  /**
   * Format last check timestamp to readable format
   */
  formatLastCheckTime(timestamp) {
    if (!timestamp) return 'Never';

    const now = new Date();
    const checkTime = new Date(timestamp);
    const diffMs = now - checkTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }

  /**
   * Handle messages from background script
   */
  handleBackgroundMessages() {
    chrome.runtime.onMessage.addListener((message) => {
      switch (message.action) {
        case 'incrementCheck':
          this.stats.totalChecks++;
          this.updateStats();
          break;
        case 'recordFoundTest':
          this.stats.testsFound++;
          this.stats.totalCancellationsFound++;
          this.updateStats();
          break;
        case 'recordBookingChanged':
          const timeSaved = message.data?.timeSaved || 0;
          this.recordBookingChanged(timeSaved);
          break;
        case 'refreshPupilList':
          // Refresh pupil data when notified by background script
          this.refreshPupilData();
          break;
      }
    });
  }

  /**
   * Refresh pupil data from storage
   */
  async refreshPupilData() {
    try {
      const data = await chrome.storage.local.get(['extensionState']);
      if (data.extensionState && data.extensionState.pupils) {
        this.pupils = data.extensionState.pupils;
        this.convertPupilsToMonitors();
        this.updateUI();
        console.log('✅ Pupil data refreshed:', this.pupils.length);
      }
    } catch (error) {
      console.error('❌ Error refreshing pupil data:', error);
    }
  }

  /**
   * Load saved state from storage
   */
  async loadState() {
    try {
      const data = await chrome.storage.local.get([
        'isRunning',
        'isRapidMode',
        'selectedCenters',
        'startTime',
        'stats',
        'extensionState'
      ]);

      this.isRunning = data.isRunning || false;
      this.isRapidMode = data.isRapidMode || false;
      this.selectedCenters = data.selectedCenters || [];
      this.startTime = data.startTime || null;

      if (data.stats) {
        this.stats = { ...this.stats, ...data.stats };
      }

      // Load real pupil data from extension state
      if (data.extensionState && data.extensionState.pupils) {
        this.pupils = data.extensionState.pupils;
        this.convertPupilsToMonitors();
      }

      console.log('📦 State loaded:', {
        running: this.isRunning,
        centers: this.selectedCenters.length,
        rapidMode: this.isRapidMode,
        pupils: this.pupils.length,
        monitors: this.monitors.length
      });
    } catch (error) {
      console.error('❌ Error loading state:', error);
    }
  }

  /**
   * Save state to storage
   */
  async saveState() {
    try {
      await chrome.storage.local.set({
        isRunning: this.isRunning,
        isRapidMode: this.isRapidMode,
        selectedCenters: this.selectedCenters,
        startTime: this.startTime,
        stats: this.stats
      });
    } catch (error) {
      console.error('❌ Error saving state:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // New UI event listeners
    document.getElementById('settings-toggle').addEventListener('click', () => this.toggleView());
    document.getElementById('add-monitor-btn').addEventListener('click', () => this.addMonitor());
    document.getElementById('view-dashboard-btn').addEventListener('click', () => this.openFullDashboard());
    document.getElementById('help-btn').addEventListener('click', () => this.openHelp());
    document.getElementById('sign-out-btn').addEventListener('click', () => this.signOut());

    // Settings panel event listeners
    this.setupSettingsEventListeners();

    // Keep existing automation controls for backward compatibility
    if (document.getElementById('start-btn')) {
      document.getElementById('start-btn').addEventListener('click', () => this.startAutomation());
    }
    if (document.getElementById('stop-btn')) {
      document.getElementById('stop-btn').addEventListener('click', () => this.stopAutomation());
    }
    if (document.getElementById('rapid-toggle')) {
      document.getElementById('rapid-toggle').addEventListener('click', () => this.toggleRapidMode());
    }
    if (document.getElementById('start-date')) {
      document.getElementById('start-date').addEventListener('change', () => this.saveState());
    }
    if (document.getElementById('end-date')) {
      document.getElementById('end-date').addEventListener('change', () => this.saveState());
    }
    if (document.getElementById('center-search')) {
      document.getElementById('center-search').addEventListener('input', (e) => {
        this.handleCenterSearch(e.target.value);
      });
    }
    if (document.getElementById('settings-btn')) {
      document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
    }
    if (document.getElementById('refresh-btn')) {
      document.getElementById('refresh-btn').addEventListener('click', () => this.refreshData());
    }
  }

  /**
   * Start automation
   */
  async startAutomation() {
    if (this.selectedCenters.length === 0) {
      this.showNotification('Please select at least one test center', 'warning');
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();

    await this.saveState();
    this.updateUI();
    this.startTimer();

    // Send message to background script
    try {
      await chrome.runtime.sendMessage({
        action: 'startAutomation',
        data: {
          startDate: document.getElementById('start-date').value,
          endDate: document.getElementById('end-date').value,
          centers: this.selectedCenters,
          rapidMode: this.isRapidMode
        }
      });

      this.showNotification('Automation started successfully!', 'success');
    } catch (error) {
      console.error('❌ Error starting automation:', error);
      this.showNotification('Failed to start automation', 'error');
      this.isRunning = false;
      this.updateUI();
    }
  }

  /**
   * Stop automation
   */
  async stopAutomation() {
    this.isRunning = false;
    this.startTime = null;

    this.stopTimer();
    await this.saveState();
    this.updateUI();

    // Send message to background script
    try {
      await chrome.runtime.sendMessage({ action: 'stopAutomation' });
      this.showNotification('Automation stopped', 'info');
    } catch (error) {
      console.error('❌ Error stopping automation:', error);
    }
  }

  /**
   * Toggle rapid mode
   */
  async toggleRapidMode() {
    this.isRapidMode = !this.isRapidMode;

    const toggle = document.getElementById('rapid-toggle');
    toggle.classList.toggle('active', this.isRapidMode);

    await this.saveState();

    // Update background script if running
    if (this.isRunning) {
      try {
        await chrome.runtime.sendMessage({
          action: 'updateConfig',
          data: { rapidMode: this.isRapidMode }
        });
      } catch (error) {
        console.error('❌ Error updating rapid mode:', error);
      }
    }
  }

  /**
   * Handle center search
   */
  handleCenterSearch(query) {
    // Mock test centers - replace with actual data
    const mockCenters = [
      { id: '1', name: 'Manchester North Test Centre', code: 'MNCH' },
      { id: '2', name: 'London Wembley Test Centre', code: 'WEMB' },
      { id: '3', name: 'Birmingham South Test Centre', code: 'BIRM' },
      { id: '4', name: 'Leeds Central Test Centre', code: 'LEED' },
      { id: '5', name: 'Glasgow East Test Centre', code: 'GLAS' }
    ];

    if (!query.trim()) {
      return;
    }

    const results = mockCenters.filter(center =>
      center.name.toLowerCase().includes(query.toLowerCase()) ||
      center.code.toLowerCase().includes(query.toLowerCase())
    );

    // For demo purposes, show add functionality
    console.log('Search results:', results);
  }

  /**
   * Add test center
   */
  addCenter(center) {
    if (this.selectedCenters.length >= 5) {
      this.showNotification('Maximum 5 centers allowed', 'warning');
      return;
    }

    if (this.selectedCenters.find(c => c.id === center.id)) {
      this.showNotification('Center already selected', 'warning');
      return;
    }

    this.selectedCenters.push(center);
    this.saveState();
    this.updateCentersList();

    this.showNotification(`Added ${center.name}`, 'success');
  }

  /**
   * Remove test center
   */
  removeCenter(centerId) {
    this.selectedCenters = this.selectedCenters.filter(c => c.id !== centerId);
    this.saveState();
    this.updateCentersList();

    this.showNotification('Center removed', 'info');
  }

  /**
   * Update UI based on current state
   */
  updateUI() {
    this.updateStatusBar();
    this.updateAutomationControls();
    this.updateCentersList();
    this.updateStats();
    this.updateRapidModeToggle();
  }

  /**
   * Update status bar
   */
  updateStatusBar() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    if (this.isRunning) {
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Running';
    } else {
      statusDot.className = 'status-dot inactive';
      statusText.textContent = 'Ready';
    }
  }

  /**
   * Update automation controls
   */
  updateAutomationControls() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const badgeContainer = document.getElementById('automation-badge');

    if (this.isRunning) {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      badgeContainer.innerHTML = '<div class="badge badge-success">✓ Automation Active</div>';
    } else {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      badgeContainer.innerHTML = '<div class="badge badge-info">Ready to Start</div>';
    }
  }

  /**
   * Update centers list
   */
  updateCentersList() {
    const centerList = document.getElementById('center-list');
    const centerCount = document.getElementById('center-count');

    centerCount.textContent = `${this.selectedCenters.length} / 5`;

    if (this.selectedCenters.length === 0) {
      centerList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📍</div>
          <div class="empty-text">No centers selected</div>
        </div>
      `;
      return;
    }

    centerList.innerHTML = this.selectedCenters.map(center => `
      <div class="center-item">
        <span class="center-name">${center.name}</span>
        <span class="center-remove" data-center-id="${center.id}">×</span>
      </div>
    `).join('');

    // Add remove event listeners
    centerList.querySelectorAll('.center-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        this.removeCenter(btn.dataset.centerId);
      });
    });
  }

  /**
   * Update stats display
   */
  updateStats() {
    document.getElementById('total-checks').textContent = this.stats.totalChecks.toLocaleString();
    document.getElementById('tests-found').textContent = this.stats.testsFound.toString();
    document.getElementById('success-rate').textContent = `${this.stats.successRate}%`;

    // Update new statistics if elements exist
    const cancellationsElement = document.getElementById('cancellations-found');
    const bookingsElement = document.getElementById('bookings-changed');
    const timeSavedElement = document.getElementById('avg-time-saved');

    if (cancellationsElement) {
      cancellationsElement.textContent = this.stats.totalCancellationsFound.toString();
    }
    if (bookingsElement) {
      bookingsElement.textContent = this.stats.totalBookingsChanged.toString();
    }
    if (timeSavedElement) {
      timeSavedElement.textContent = this.stats.averageTimeSaved + ' days';
    }
  }

  /**
   * Increment check counter
   */
  incrementCheck() {
    this.stats.totalChecks++;
    this.saveState();
    this.updateStats();
  }

  /**
   * Record found test
   */
  recordFoundTest() {
    this.stats.testsFound++;
    this.stats.totalCancellationsFound++;
    this.saveState();
    this.updateStats();
  }

  /**
   * Record successful booking change
   */
  recordBookingChanged(timeSaved = 0) {
    this.stats.totalBookingsChanged++;

    // Update average time saved
    if (timeSaved > 0) {
      const totalTimeSaved = (this.stats.averageTimeSaved * (this.stats.totalBookingsChanged - 1)) + timeSaved;
      this.stats.averageTimeSaved = Math.round(totalTimeSaved / this.stats.totalBookingsChanged);
    }

    this.saveState();
    this.updateStats();
  }

  /**
   * Calculate success rate
   */
  calculateSuccessRate() {
    return this.stats.totalChecks > 0
      ? Math.round((this.stats.testsFound / this.stats.totalChecks) * 100)
      : 0;
  }

  /**
   * Update rapid mode toggle
   */
  updateRapidModeToggle() {
    const toggle = document.getElementById('rapid-toggle');
    toggle.classList.toggle('active', this.isRapidMode);
  }

  /**
   * Start timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  /**
   * Stop timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    document.getElementById('status-timer').textContent = '00:00:00';
  }

  /**
   * Update timer display
   */
  updateTimer() {
    if (!this.startTime) return;

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    const timeStr = [hours, minutes, seconds]
      .map(n => n.toString().padStart(2, '0'))
      .join(':');

    document.getElementById('status-timer').textContent = timeStr;
  }

  /**
   * Show notification toast
   */
  showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';

    const colors = {
      success: 'var(--success-green)',
      warning: 'var(--warning-orange)',
      error: 'var(--danger-red)',
      info: 'var(--primary-blue)'
    };

    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Open settings page
   */
  openSettings() {
    chrome.runtime.openOptionsPage();
  }

  /**
   * Setup settings panel event listeners
   */
  setupSettingsEventListeners() {
    // Notification settings checkboxes
    const desktopNotifications = document.querySelector('input[type="checkbox"]:checked');
    const soundAlerts = document.querySelectorAll('input[type="checkbox"]')[1];
    const emailNotifications = document.querySelectorAll('input[type="checkbox"]')[2];

    if (desktopNotifications) {
      desktopNotifications.addEventListener('change', (e) => {
        this.updateSetting('notifications', e.target.checked);
      });
    }

    if (soundAlerts) {
      soundAlerts.addEventListener('change', (e) => {
        this.updateSetting('soundEnabled', e.target.checked);
      });
    }

    if (emailNotifications) {
      emailNotifications.addEventListener('change', (e) => {
        this.updateSetting('emailNotifications', e.target.checked);
      });
    }

    // Check frequency dropdown
    const checkFrequency = document.querySelector('.form-select');
    if (checkFrequency) {
      checkFrequency.addEventListener('change', (e) => {
        const frequencyMap = {
          'Every 2 minutes (Recommended)': 120000,
          'Every 5 minutes': 300000,
          'Every 10 minutes': 600000,
          'Every 30 minutes': 1800000
        };
        const interval = frequencyMap[e.target.value] || 120000;
        this.updateSetting('checkInterval', interval);
      });
    }
  }

  /**
   * Update a setting in the extension
   */
  async updateSetting(key, value) {
    try {
      // Get current settings from background script
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        const settings = response.settings;
        settings[key] = value;

        // Send updated settings to background script
        await chrome.runtime.sendMessage({
          action: 'updateSettings',
          data: settings
        });

        console.log(`✅ Setting updated: ${key} = ${value}`);
        this.showNotification(`${key} updated successfully`, 'success');
      }
    } catch (error) {
      console.error('❌ Error updating setting:', error);
      this.showNotification(`Failed to update ${key}`, 'error');
    }
  }

  /**
   * Load settings into the UI
   */
  async loadSettingsIntoUI() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        const settings = response.settings;

        // Update notification checkboxes
        const desktopNotifications = document.querySelector('input[type="checkbox"]:checked');
        const soundAlerts = document.querySelectorAll('input[type="checkbox"]')[1];
        const emailNotifications = document.querySelectorAll('input[type="checkbox"]')[2];

        if (desktopNotifications) desktopNotifications.checked = settings.notifications !== false;
        if (soundAlerts) soundAlerts.checked = settings.soundEnabled !== false;
        if (emailNotifications) emailNotifications.checked = settings.emailNotifications === true;

        // Update check frequency dropdown
        const checkFrequency = document.querySelector('.form-select');
        if (checkFrequency && settings.checkInterval) {
          const frequencyMap = {
            120000: 'Every 2 minutes (Recommended)',
            300000: 'Every 5 minutes',
            600000: 'Every 10 minutes',
            1800000: 'Every 30 minutes'
          };
          checkFrequency.value = frequencyMap[settings.checkInterval] || 'Every 2 minutes (Recommended)';
        }
      }
    } catch (error) {
      console.error('❌ Error loading settings into UI:', error);
    }
  }

  /**
   * Refresh data
   */
  async refreshData() {
    try {
      await this.loadState();
      await this.refreshPupilData();
      this.updateUI();
      this.showNotification('Data refreshed', 'success');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      this.showNotification('Failed to refresh data', 'error');
    }
  }

  /**
   * New UI Methods
   */

  /**
   * Toggle between main and settings views
   */
  toggleView() {
    const mainView = document.getElementById('main-view');
    const settingsView = document.getElementById('settings-view');
    const settingsToggle = document.getElementById('settings-toggle');

    if (this.currentView === 'main') {
      this.currentView = 'settings';
      mainView.classList.remove('active');
      settingsView.classList.add('active');
      settingsToggle.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      this.currentView = 'main';
      settingsView.classList.remove('active');
      mainView.classList.add('active');
      settingsToggle.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m0-12l5.2 3m-10.4 0L12 7m-5.2 6l5.2 3m0 0l5.2-3"></path>
        </svg>
      `;
    }
  }

  /**
   * Render monitors list
   */
  renderMonitors() {
    const monitorsList = document.getElementById('monitors-list');
    if (!monitorsList) return;

    if (this.monitors.length === 0) {
      monitorsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <div class="empty-text">No monitors added yet</div>
        </div>
      `;
      return;
    }

    monitorsList.innerHTML = this.monitors.map(monitor => `
      <div class="monitor-card" data-monitor-id="${monitor.id}">
        <div class="monitor-header">
          <div class="monitor-info">
            <h3>${monitor.name}</h3>
            <div class="monitor-details">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${monitor.currentDate}</span>
              <span class="text-gray-400">•</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${monitor.testCenter}</span>
            </div>
          </div>
          <div class="monitor-status ${monitor.status}">
            ${monitor.status === 'active' ? 'Active' : 'Paused'}
          </div>
        </div>
        <div class="monitor-footer">
          ${monitor.foundSlots > 0 ? `
            <div class="monitor-slots found">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>${monitor.foundSlots} slot${monitor.foundSlots > 1 ? 's' : ''} found</span>
            </div>
          ` : `
            <div class="monitor-slots searching">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Searching...</span>
            </div>
          `}
          <div class="monitor-time">
            <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${monitor.lastCheck}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Add click listeners to monitor cards
    monitorsList.querySelectorAll('.monitor-card').forEach(card => {
      card.addEventListener('click', () => {
        const monitorId = parseInt(card.dataset.monitorId);
        this.selectMonitor(monitorId);
      });
    });
  }

  /**
   * Update quick stats
   */
  updateQuickStats() {
    const totalFound = this.monitors.reduce((sum, m) => sum + m.foundSlots, 0);
    const lastCheck = this.monitors.length > 0 ?
      Math.min(...this.monitors.map(m => this.parseTimeAgo(m.lastCheck))) : 0;

    document.getElementById('monitor-count').textContent = this.monitors.length;
    document.getElementById('found-count').textContent = totalFound;
    document.getElementById('last-check').textContent = this.formatLastCheck(lastCheck);
  }

  /**
   * Parse time ago string to minutes
   */
  parseTimeAgo(timeAgo) {
    if (timeAgo.includes('m')) return parseInt(timeAgo);
    if (timeAgo.includes('h')) return parseInt(timeAgo) * 60;
    if (timeAgo.includes('d')) return parseInt(timeAgo) * 60 * 24;
    return 0;
  }

  /**
   * Format last check time
   */
  formatLastCheck(minutes) {
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  }

  /**
   * Select monitor (placeholder for future functionality)
   */
  selectMonitor(monitorId) {
    const monitor = this.monitors.find(m => m.id === monitorId);
    if (monitor) {
      console.log('Selected monitor:', monitor.name);
      // Future: Open monitor details or edit mode
      this.showNotification(`Selected ${monitor.name}`, 'info');
    }
  }

  /**
   * Add new monitor - now opens the modern pupil form
   */
  addMonitor() {
    console.log('Add new monitor clicked - opening modern form');

    // Load modern pupil form if not already loaded
    if (typeof ModernPupilForm === 'undefined') {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('modern-pupil-form.js');
      script.onload = () => {
        this.openModernPupilForm();
      };
      script.onerror = () => {
        console.error('Failed to load modern pupil form');
        this.showNotification('Failed to load form. Please refresh and try again.', 'error');
      };
      document.head.appendChild(script);
    } else {
      this.openModernPupilForm();
    }
  }

  /**
   * Open the modern pupil form
   */
  openModernPupilForm() {
    try {
      const form = new ModernPupilForm();
      form.show();
      console.log('✅ Modern pupil form opened successfully');
    } catch (error) {
      console.error('❌ Failed to open modern pupil form:', error);
      this.showNotification('Failed to open form. Please try again.', 'error');
    }
  }

  /**
   * Open full dashboard with detailed monitor view
   */
  openFullDashboard() {
    console.log('Open full dashboard clicked');

    try {
      // Create dashboard overlay
      this.createDashboardOverlay();
    } catch (error) {
      console.error('❌ Failed to create dashboard:', error);
      this.showNotification('Failed to open dashboard. Please try again.', 'error');
    }
  }

  /**
   * Create dashboard overlay with detailed monitor view
   */
  createDashboardOverlay() {
    // Remove existing dashboard if present
    const existingDashboard = document.querySelector('.dashboard-overlay');
    if (existingDashboard) {
      existingDashboard.remove();
    }

    const dashboardHTML = `
      <div class="dashboard-overlay">
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h2>TestNotifier Dashboard</h2>
            <button class="dashboard-close" onclick="this.closest('.dashboard-overlay').remove()">×</button>
          </div>

          <div class="dashboard-content">
            <div class="dashboard-stats">
              <div class="stat-card">
                <h3>Total Monitors</h3>
                <p class="stat-value">${this.monitors.length}</p>
              </div>
              <div class="stat-card">
                <h3>Active Monitors</h3>
                <p class="stat-value">${this.monitors.filter(m => m.status === 'active').length}</p>
              </div>
              <div class="stat-card">
                <h3>Total Slots Found</h3>
                <p class="stat-value">${this.monitors.reduce((sum, m) => sum + m.foundSlots, 0)}</p>
              </div>
              <div class="stat-card">
                <h3>Success Rate</h3>
                <p class="stat-value">${this.stats.successRate}%</p>
              </div>
            </div>

            <div class="dashboard-monitors">
              <h3>Your Monitors</h3>
              <div class="monitors-list">
                ${this.monitors.map(monitor => `
                  <div class="monitor-card ${monitor.status}">
                    <div class="monitor-info">
                      <h4>${monitor.name}</h4>
                      <p>Test Center: ${monitor.testCenter}</p>
                      <p>Current Date: ${monitor.currentDate}</p>
                      <p>Last Check: ${monitor.lastCheck}</p>
                    </div>
                    <div class="monitor-stats">
                      <span class="found-slots">${monitor.foundSlots} slots found</span>
                      <span class="status-badge ${monitor.status}">${monitor.status.toUpperCase()}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject dashboard styles
    this.injectDashboardStyles();

    // Add dashboard to page
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
  }

  /**
   * Inject dashboard styles
   */
  injectDashboardStyles() {
    if (document.querySelector('style[data-dashboard-styles]')) return;

    const styles = `
      <style data-dashboard-styles>
        .dashboard-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .dashboard-container {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .dashboard-header {
          background: linear-gradient(to right, #1d70b8, #2e8bc0);
          color: white;
          padding: 20px;
          border-radius: 16px 16px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .dashboard-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .dashboard-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .dashboard-content {
          padding: 24px;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e9ecef;
        }

        .stat-card h3 {
          margin: 0 0 8px 0;
          color: #6c757d;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1d70b8;
          margin: 0;
        }

        .dashboard-monitors h3 {
          margin: 0 0 16px 0;
          color: #2c2c2c;
          font-size: 20px;
          font-weight: 600;
        }

        .monitors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .monitor-card {
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: box-shadow 0.2s, border-color 0.2s;
        }

        .monitor-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #1d70b8;
        }

        .monitor-card.active {
          border-left: 4px solid #28a745;
        }

        .monitor-card.paused {
          border-left: 4px solid #ffc107;
        }

        .monitor-info h4 {
          margin: 0 0 8px 0;
          color: #2c2c2c;
          font-size: 16px;
          font-weight: 600;
        }

        .monitor-info p {
          margin: 0 0 4px 0;
          color: #6c757d;
          font-size: 14px;
        }

        .monitor-stats {
          text-align: right;
        }

        .found-slots {
          display: block;
          color: #28a745;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.paused {
          background: #fff3cd;
          color: #856404;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  /**
   * Open help - uses existing functionality
   */
  openHelp() {
    // Use existing settings page mechanism for help
    this.openSettings();
  }

  /**
   * Sign out - clears user data and resets extension
   */
  signOut() {
    console.log('Sign out clicked');

    // Confirm sign out
    const confirmed = confirm(
      'Are you sure you want to sign out?\n\n' +
      'This will:\n' +
      '• Stop all active monitors\n' +
      '• Clear your session data\n' +
      '• Reset extension to default settings'
    );

    if (!confirmed) {
      return;
    }

    try {
      // Stop automation if running
      if (this.isRunning) {
        this.stopAutomation();
      }

      // Clear extension state
      this.clearUserData();

      // Show success message
      this.showNotification('Successfully signed out!', 'success');

      // Reset UI after short delay
      setTimeout(() => {
        this.resetToDefaultState();
      }, 1500);

    } catch (error) {
      console.error('❌ Sign out failed:', error);
      this.showNotification('Sign out failed. Please try again.', 'error');
    }
  }

  /**
   * Clear user data from storage
   */
  async clearUserData() {
    try {
      // Clear all extension data
      await chrome.storage.local.clear();

      // Send message to background script to clear state
      await chrome.runtime.sendMessage({
        action: 'resetState'
      });

      console.log('✅ User data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
      throw error;
    }
  }

  /**
   * Reset extension to default state
   */
  resetToDefaultState() {
    // Reset local state
    this.isRunning = false;
    this.isRapidMode = false;
    this.selectedCenters = [];
    this.startTime = null;
    this.monitors = [];

    // Reset stats to defaults
    this.stats = {
      totalChecks: 0,
      testsFound: 0,
      successRate: 0
    };

    // Update UI
    this.updateUI();

    console.log('✅ Extension reset to default state');
  }

  /**
   * Override updateUI to include new components
   */
  updateUI() {
    // Update existing components
    this.updateStatusBar();
    this.updateAutomationControls();
    this.updateCentersList();
    this.updateStats();
    this.updateRapidModeToggle();

    // Update new UI components
    this.renderMonitors();
    this.updateQuickStats();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popup = new TestNotifierPopup();
  popup.init();
});

