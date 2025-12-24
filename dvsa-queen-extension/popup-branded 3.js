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
    // Automation controls
    document.getElementById('start-btn').addEventListener('click', () => this.startAutomation());
    document.getElementById('stop-btn').addEventListener('click', () => this.stopAutomation());
    
    // Rapid mode toggle
    document.getElementById('rapid-toggle').addEventListener('click', () => this.toggleRapidMode());
    
    // Date inputs
    document.getElementById('start-date').addEventListener('change', () => this.saveState());
    document.getElementById('end-date').addEventListener('change', () => this.saveState());
    
    // Center search
    document.getElementById('center-search').addEventListener('input', (e) => {
      this.handleCenterSearch(e.target.value);
    });
    
    // Action buttons
    document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
    document.getElementById('refresh-btn').addEventListener('click', () => this.refreshData());
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popup = new TestNotifierPopup();
  popup.init();
});

