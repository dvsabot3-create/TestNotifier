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
      totalChecks: 1247,
      testsFound: 23,
      successRate: 94
    };

    // New UI state
    this.currentView = 'main'; // 'main' or 'settings'
    this.monitors = [
      {
        id: 1,
        name: 'Sarah Johnson',
        currentDate: '15 Mar 2025',
        testCenter: 'Manchester',
        status: 'active',
        foundSlots: 3,
        lastCheck: '2m ago'
      },
      {
        id: 2,
        name: 'James Wilson',
        currentDate: '22 Apr 2025',
        testCenter: 'London',
        status: 'active',
        foundSlots: 0,
        lastCheck: '5m ago'
      },
      {
        id: 3,
        name: 'Emily Davis',
        currentDate: '10 May 2025',
        testCenter: 'Birmingham',
        status: 'paused',
        foundSlots: 1,
        lastCheck: '1h ago'
      }
    ];
  }

  /**
   * Initialize popup
   */
  async init() {
    console.log('🚀 TestNotifier popup initializing...');

    await this.loadState();
    this.setupEventListeners();
    this.updateUI();

    console.log('✅ TestNotifier popup ready');
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
        'stats'
      ]);

      this.isRunning = data.isRunning || false;
      this.isRapidMode = data.isRapidMode || false;
      this.selectedCenters = data.selectedCenters || [];
      this.startTime = data.startTime || null;

      if (data.stats) {
        this.stats = { ...this.stats, ...data.stats };
      }

      console.log('📦 State loaded:', {
        running: this.isRunning,
        centers: this.selectedCenters.length,
        rapidMode: this.isRapidMode
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
   * Refresh data
   */
  async refreshData() {
    try {
      await this.loadState();
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
    const activeMonitors = this.monitors.filter(m => m.status === 'active').length;
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
   * Add new monitor (placeholder for future functionality)
   */
  addMonitor() {
    console.log('Add new monitor clicked');
    // Future: Open add monitor dialog
    this.showNotification('Add monitor functionality coming soon!', 'info');
  }

  /**
   * Open full dashboard (placeholder for future functionality)
   */
  openFullDashboard() {
    console.log('Open full dashboard clicked');
    // Future: Open full dashboard in new tab or window
    this.showNotification('Full dashboard coming soon!', 'info');
  }

  /**
   * Open help - uses existing functionality
   */
  openHelp() {
    // Use existing settings page mechanism for help
    this.openSettings();
  }

  /**
   * Sign out (placeholder for future functionality)
   */
  signOut() {
    console.log('Sign out clicked');
    // Future: Implement sign out functionality
    this.showNotification('Sign out functionality coming soon!', 'info');
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

