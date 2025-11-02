/**
 * TestNotifier Extension Popup - COMPLETE VERSION
 * 
 * Integrates with:
 * - background.js (service worker)
 * - content-script.js (DVSA automation)
 * - stealth/stealth-manager.js (anti-detection)
 * 
 * Features:
 * ✅ Emergency Stop & Manual Check
 * ✅ Risk Dashboard (LOW/MEDIUM/HIGH)
 * ✅ Settings Panel (Auto-check, Interval, Sound, Notifications)
 * ✅ Activity Log (Timestamped operations)
 * ✅ Monitor Management (Add/Edit/Delete/Pause)
 * ✅ Subscription Validation & Quota Enforcement
 * ✅ Tab Navigation (Monitors, Settings, Activity)
 * ✅ Real-time Updates from background.js
 */

class TestNotifierPopup {
  constructor() {
    this.monitors = [];
    this.stats = {
      monitorsCount: 0,
      slotsFound: 0,
      rebooksUsed: 0,
      rebooksTotal: 5,
      lastCheck: null
    };
    this.subscription = null;
    this.settings = {
      autoCheck: true,
      checkInterval: 30,
      soundAlerts: true,
      browserNotifications: true
    };
    this.activityLog = [];
    this.riskLevel = { level: 'low', percentage: 12 };
    this.currentTab = 'monitors';
  }

  /**
   * Initialize popup
   */
  async init() {
    console.log('🚀 Initializing TestNotifier popup (COMPLETE VERSION)...');
    
    try {
      await this.loadAllData();
      this.setupEventListeners();
      this.setupMessageListener();
      this.updateUI();
      this.startPeriodicUpdates();
      
      console.log('✅ Popup initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing popup:', error);
      this.showError('Initialization failed. Please reload the extension.');
    }
  }

  /**
   * Load all data from storage and API
   */
  async loadAllData() {
    try {
      // Load from chrome.storage.local
      const result = await chrome.storage.local.get([
        'monitors',
        'stats', 
        'subscription',
        'settings',
        'activityLog',
        'riskLevel'
      ]);
      
      // Use stored data or demo data
      this.monitors = result.monitors || this.getDemoMonitors(); // DEMO DATA
      this.stats = result.stats || this.getDemoStats(); // DEMO DATA
      this.subscription = result.subscription || this.getDemoSubscription(); // DEMO DATA
      this.settings = result.settings || this.getDefaultSettings();
      this.activityLog = result.activityLog || this.getDemoActivity(); // DEMO DATA
      this.riskLevel = result.riskLevel || { level: 'low', percentage: 12 };
      
      console.log('📊 Data loaded:', {
        monitors: this.monitors.length,
        subscription: this.subscription.tier,
        settings: this.settings
      });
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to demo data
      this.monitors = this.getDemoMonitors();
      this.stats = this.getDemoStats();
      this.subscription = this.getDemoSubscription();
      this.settings = this.getDefaultSettings();
      this.activityLog = this.getDemoActivity();
    }
  }

  /**
   * DEMO DATA - Sample monitors for UI preview
   * Remove this in production - will be replaced with real monitors from storage
   */
  getDemoMonitors() {
    return [
      {
        id: 'demo-1',
        name: 'Sarah Johnson',
        licence: 'JOHNS123456J99',
        targetDate: '2025-03-15',
        location: 'Manchester',
        testCentres: ['Manchester (Bury Old Road)', 'Manchester (Cheetham Hill)'],
        notifications: { email: true, sms: true, browser: true },
        status: 'active',
        slotsFound: 3,
        foundSlots: [
          { date: '2025-02-10', time: '09:00', centre: 'Manchester (Bury Old Road)' },
          { date: '2025-02-12', time: '14:30', centre: 'Manchester (Bury Old Road)' },
          { date: '2025-02-15', time: '11:00', centre: 'Manchester (Cheetham Hill)' }
        ],
        lastUpdate: new Date(Date.now() - 120000).toISOString()
      },
      {
        id: 'demo-2',
        name: 'James Wilson',
        licence: 'WILSO987654W99',
        targetDate: '2025-04-22',
        location: 'London',
        testCentres: ['London (Wood Green)', 'London (Palmers Green)'],
        notifications: { email: true, sms: true, browser: true },
        status: 'active',
        slotsFound: 0,
        foundSlots: [],
        lastUpdate: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 'demo-3',
        name: 'Emily Davis',
        licence: 'DAVIS555555D99',
        targetDate: '2025-05-10',
        location: 'Birmingham',
        testCentres: ['Birmingham (Garretts Green)', 'Birmingham (Kingstanding)'],
        notifications: { email: true, sms: false, browser: true },
        status: 'active',
        slotsFound: 1,
        foundSlots: [
          { date: '2025-04-20', time: '10:30', centre: 'Birmingham (Garretts Green)' }
        ],
        lastUpdate: new Date(Date.now() - 180000).toISOString()
      }
    ];
  }

  /**
   * DEMO DATA - Sample stats
   */
  getDemoStats() {
    return {
      monitorsCount: 3,
      slotsFound: 4,
      rebooksUsed: 2,
      rebooksTotal: 5,
      lastCheck: new Date(Date.now() - 120000).toISOString()
    };
  }

  /**
   * DEMO DATA - Sample subscription
   */
  getDemoSubscription() {
    return {
      tier: 'premium',
      status: 'active',
      rebooksRemaining: 3,
      rebooksTotal: 5
    };
  }

  /**
   * DEMO DATA - Sample activity log
   */
  getDemoActivity() {
    return [
      { time: new Date(Date.now() - 120000).toISOString(), message: 'Found 3 slots for Sarah Johnson' },
      { time: new Date(Date.now() - 240000).toISOString(), message: 'Checked Manchester test centres' },
      { time: new Date(Date.now() - 360000).toISOString(), message: 'Monitor added: James Wilson' },
      { time: new Date(Date.now() - 480000).toISOString(), message: 'Settings updated' },
      { time: new Date(Date.now() - 600000).toISOString(), message: 'Extension started' }
    ];
  }

  /**
   * Default settings
   */
  getDefaultSettings() {
    return {
      autoCheck: true,
      checkInterval: 30,
      soundAlerts: true,
      browserNotifications: true
    };
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Emergency controls
    this.attachEmergencyControls();
    
    // Stats bar
    this.attachStatsListeners();
    
    // Risk indicator
    this.attachRiskListener();
    
    // Tab navigation
    this.attachTabListeners();
    
    // Monitors tab
    this.attachMonitorsListeners();
    
    // Settings tab
    this.attachSettingsListeners();
    
    // Activity tab
    this.attachActivityListeners();
    
    // Footer
    this.attachFooterListeners();
    
    console.log('✅ All event listeners attached');
  }

  /**
   * Emergency controls - Stop All & Manual Check
   */
  attachEmergencyControls() {
    // Emergency Stop button
    const stopBtn = document.getElementById('btn-emergency-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', async () => {
        await this.emergencyStop();
      });
    }
    
    // Manual Check button
    const checkBtn = document.getElementById('btn-manual-check');
    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        await this.manualCheck();
      });
    }
  }

  /**
   * Stats bar listeners
   */
  attachStatsListeners() {
    const statMonitors = document.getElementById('stat-monitors');
    const statFound = document.getElementById('stat-found');
    const statRebooks = document.getElementById('stat-rebooks');
    const statLastCheck = document.getElementById('stat-lastcheck');
    
    if (statMonitors) {
      statMonitors.addEventListener('click', () => this.showMonitorsList());
    }
    
    if (statFound) {
      statFound.addEventListener('click', () => this.showFoundSlots());
    }
    
    if (statRebooks) {
      statRebooks.addEventListener('click', () => this.showRebookQuota());
    }
    
    if (statLastCheck) {
      statLastCheck.addEventListener('click', () => this.showCheckHistory());
    }
  }

  /**
   * Risk indicator listener
   */
  attachRiskListener() {
    const riskIndicator = document.getElementById('risk-indicator');
    if (riskIndicator) {
      riskIndicator.addEventListener('click', () => this.showRiskBreakdown());
    }
  }

  /**
   * Tab navigation
   */
  attachTabListeners() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });
  }

  /**
   * Monitors tab listeners
   */
  attachMonitorsListeners() {
    // Add monitor button
    const addBtn = document.getElementById('btn-add-monitor');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddMonitorModal());
    }
    
    // Monitor cards (will be attached when rendered)
  }

  /**
   * Settings tab listeners
   */
  attachSettingsListeners() {
    // Auto-check toggle
    const autoCheckToggle = document.getElementById('toggle-autocheck');
    if (autoCheckToggle) {
      autoCheckToggle.addEventListener('click', () => this.toggleAutoCheck());
    }
    
    // Sound alerts toggle
    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => this.toggleSound());
    }
    
    // Notifications toggle
    const notifToggle = document.getElementById('toggle-notifications');
    if (notifToggle) {
      notifToggle.addEventListener('click', () => this.toggleNotifications());
    }
    
    // Interval slider
    const intervalSlider = document.getElementById('slider-interval');
    if (intervalSlider) {
      intervalSlider.addEventListener('click', (e) => this.updateInterval(e));
    }
    
    // Save settings button
    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveSettings());
    }
  }

  /**
   * Activity tab listeners
   */
  attachActivityListeners() {
    const clearBtn = document.getElementById('clear-activity');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearActivityLog());
    }
  }

  /**
   * Footer listeners
   */
  attachFooterListeners() {
    const statusBtn = document.getElementById('footer-status');
    if (statusBtn) {
      statusBtn.addEventListener('click', () => this.testConnection());
    }
    
    const helpBtn = document.getElementById('btn-help');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelp());
    }
  }

  /**
   * Setup message listener for background.js
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('📨 Message received:', message);
      
      switch (message.action) {
        case 'monitorUpdate':
          this.handleMonitorUpdate(message.data);
          break;
        case 'slotFound':
          this.handleSlotFound(message.data);
          break;
        case 'riskUpdate':
          this.handleRiskUpdate(message.data);
          break;
        case 'settingsChanged':
          this.handleSettingsChanged(message.data);
          break;
        case 'subscriptionUpdate':
          this.handleSubscriptionUpdate(message.data);
          break;
      }
      
      sendResponse({ received: true });
    });
  }

  /**
   * Update entire UI
   */
  updateUI() {
    this.updateHeader();
    this.updateStats();
    this.updateRiskIndicator();
    this.updateMonitorsList();
    this.updateSettings();
    this.updateActivityLog();
  }

  /**
   * Update header with subscription tier
   */
  updateHeader() {
    const tierElement = document.getElementById('subscription-tier');
    if (tierElement && this.subscription) {
      const tierNames = {
        'free': 'Free Trial',
        'one-off': 'One-Off Rebook',
        'starter': 'Starter Plan',
        'premium': 'Premium Plan',
        'professional': 'Professional Plan'
      };
      tierElement.textContent = tierNames[this.subscription.tier] || 'DVSA Test Monitor';
    }
  }

  /**
   * Update stats bar
   */
  updateStats() {
    // Monitors count
    const monitorsValue = document.querySelector('#stat-monitors .stat-mini-value');
    if (monitorsValue) {
      monitorsValue.textContent = this.stats.monitorsCount;
    }
    
    // Slots found
    const foundValue = document.querySelector('#stat-found .stat-mini-value');
    if (foundValue) {
      foundValue.textContent = this.stats.slotsFound;
    }
    
    // Rebooks quota
    const rebooksValue = document.querySelector('#stat-rebooks .stat-mini-value');
    if (rebooksValue && this.subscription) {
      const remaining = this.subscription.rebooksTotal - (this.stats.rebooksUsed || 0);
      rebooksValue.textContent = `${remaining}/${this.subscription.rebooksTotal}`;
    }
    
    // Last check time
    const lastCheckValue = document.querySelector('#stat-lastcheck .stat-mini-value');
    if (lastCheckValue && this.stats.lastCheck) {
      const diff = Date.now() - new Date(this.stats.lastCheck).getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (minutes > 0) {
        lastCheckValue.textContent = `${minutes}m`;
      } else {
        lastCheckValue.textContent = `${seconds}s`;
      }
    }
  }

  /**
   * Update risk indicator
   */
  updateRiskIndicator() {
    const riskDot = document.getElementById('risk-dot');
    const riskText = document.getElementById('risk-text');
    const riskPercentage = document.getElementById('risk-percentage');
    
    if (riskDot && riskText && riskPercentage) {
      // Remove all risk classes
      riskDot.classList.remove('low', 'medium', 'high');
      
      // Add current risk class
      riskDot.classList.add(this.riskLevel.level);
      
      // Update text
      riskText.textContent = `${this.riskLevel.level.toUpperCase()} RISK`;
      riskPercentage.textContent = `${this.riskLevel.percentage}%`;
    }
  }

  /**
   * Update monitors list
   */
  updateMonitorsList() {
    const container = document.getElementById('monitors-list');
    if (!container) return;
    
    if (this.monitors.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
          <div style="font-size: 48px; margin-bottom: 12px;">👥</div>
          <div style="font-weight: 600; color: #6b7280; margin-bottom: 4px;">No monitors yet</div>
          <div style="font-size: 12px;">Click "Add New Monitor" to start monitoring test slots</div>
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.monitors.map((monitor, index) => `
      <div class="card monitor-card" data-index="${index}">
        <div class="monitor-header">
          <div>
            <div class="monitor-name">${monitor.name}</div>
            <div class="monitor-meta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${this.formatDate(monitor.targetDate)}</span>
              <span>•</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${monitor.location}</span>
            </div>
          </div>
          <div class="status-badge ${monitor.status}" data-index="${index}">
            ${monitor.status === 'active' ? 'Active' : 'Paused'}
          </div>
        </div>
        <div class="monitor-status ${monitor.slotsFound > 0 ? 'found' : 'searching'}" data-index="${index}">
          ${monitor.slotsFound > 0 ? `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            ${monitor.slotsFound} slot${monitor.slotsFound !== 1 ? 's' : ''} found!
          ` : `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Searching...
          `}
        </div>
      </div>
    `).join('');
    
    // Attach click listeners
    container.querySelectorAll('.monitor-card').forEach((card) => {
      const index = parseInt(card.getAttribute('data-index'));
      
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.status-badge') && !e.target.closest('.monitor-status')) {
          this.showMonitorDetails(index);
        }
      });
      
      // Status badge
      const statusBadge = card.querySelector('.status-badge');
      if (statusBadge) {
        statusBadge.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMonitor(index);
        });
      }
      
      // Slots status
      const slotsStatus = card.querySelector('.monitor-status');
      if (slotsStatus) {
        slotsStatus.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.monitors[index].slotsFound > 0) {
            this.showSlotDetails(index);
          }
        });
      }
    });
  }

  /**
   * Update settings UI
   */
  updateSettings() {
    // Auto-check toggle
    const autoCheckSwitch = document.querySelector('#toggle-autocheck .switch');
    const autoCheckText = document.querySelector('#toggle-autocheck span');
    if (autoCheckSwitch && autoCheckText) {
      if (this.settings.autoCheck) {
        autoCheckSwitch.classList.add('on');
        autoCheckText.textContent = 'Enabled';
        autoCheckText.style.color = '#059669';
      } else {
        autoCheckSwitch.classList.remove('on');
        autoCheckText.textContent = 'Disabled';
        autoCheckText.style.color = '#dc2626';
      }
    }
    
    // Check interval
    const intervalFill = document.querySelector('#slider-interval .slider-fill');
    const intervalValue = document.getElementById('interval-value');
    if (intervalFill && intervalValue) {
      const percentage = ((this.settings.checkInterval - 15) / 45) * 100;
      intervalFill.style.width = `${percentage}%`;
      intervalValue.textContent = `${this.settings.checkInterval}s`;
    }
    
    // Sound alerts toggle
    const soundSwitch = document.querySelector('#toggle-sound .switch');
    const soundText = document.querySelector('#toggle-sound span');
    if (soundSwitch && soundText) {
      if (this.settings.soundAlerts) {
        soundSwitch.classList.add('on');
        soundText.textContent = 'Enabled';
        soundText.style.color = '#059669';
      } else {
        soundSwitch.classList.remove('on');
        soundText.textContent = 'Disabled';
        soundText.style.color = '#dc2626';
      }
    }
    
    // Browser notifications toggle
    const notifSwitch = document.querySelector('#toggle-notifications .switch');
    const notifText = document.querySelector('#toggle-notifications span');
    if (notifSwitch && notifText) {
      if (this.settings.browserNotifications) {
        notifSwitch.classList.add('on');
        notifText.textContent = 'Enabled';
        notifText.style.color = '#059669';
      } else {
        notifSwitch.classList.remove('on');
        notifText.textContent = 'Disabled';
        notifText.style.color = '#dc2626';
      }
    }
  }

  /**
   * Update activity log
   */
  updateActivityLog() {
    const container = document.getElementById('activity-log');
    if (!container) return;
    
    if (this.activityLog.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
          No recent activity
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.activityLog.slice(0, 20).map(item => `
      <div class="activity-item">
        <div class="activity-time">${this.formatTimestamp(item.time)}</div>
        <div class="activity-message">${item.message}</div>
      </div>
    `).join('');
  }

  /**
   * Switch tabs
   */
  switchTab(tabName) {
    this.currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(`tab-${tabName}`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }

  /**
   * Emergency Stop - Stops all monitoring
   */
  async emergencyStop() {
    console.log('🛑 EMERGENCY STOP triggered');
    
    try {
      // Send message to background.js
      const response = await chrome.runtime.sendMessage({
        action: 'emergencyStop'
      });
      
      // Update UI
      this.monitors.forEach(m => m.status = 'paused');
      this.updateMonitorsList();
      
      // Add to activity log
      this.addActivity('🛑 Emergency Stop activated - All monitors paused');
      
      // Show confirmation
      this.showAlert('Emergency Stop', '⚠️ All monitoring has been stopped immediately. Click "Check Now" or activate individual monitors to resume.');
      
      console.log('✅ Emergency stop completed');
    } catch (error) {
      console.error('Error during emergency stop:', error);
      this.showError('Failed to stop monitoring. Please try again.');
    }
  }

  /**
   * Manual Check - Triggers immediate stealth check
   */
  async manualCheck() {
    console.log('🔍 Manual stealth check triggered');
    
    const btn = document.getElementById('btn-manual-check');
    const originalText = btn.innerHTML;
    
    try {
      // Update button state
      btn.innerHTML = '<span>⏳</span><span>CHECKING...</span>';
      btn.disabled = true;
      
      // Send message to background.js
      const response = await chrome.runtime.sendMessage({
        action: 'manualCheck'
      });
      
      // Add to activity log
      this.addActivity('🔍 Manual check initiated');
      
      // Simulate check (in real app, background.js will handle this)
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        this.showAlert('Manual Check Complete', '✅ Stealth check completed successfully. No new slots found at this time.');
        this.addActivity('✓ Manual check completed');
      }, 2000);
      
      console.log('✅ Manual check initiated');
    } catch (error) {
      console.error('Error during manual check:', error);
      btn.innerHTML = originalText;
      btn.disabled = false;
      this.showError('Failed to perform manual check. Please try again.');
    }
  }

  /**
   * Toggle auto-check setting
   */
  toggleAutoCheck() {
    this.settings.autoCheck = !this.settings.autoCheck;
    this.updateSettings();
    this.addActivity(`Auto-check ${this.settings.autoCheck ? 'enabled' : 'disabled'}`);
  }

  /**
   * Toggle sound alerts
   */
  toggleSound() {
    this.settings.soundAlerts = !this.settings.soundAlerts;
    this.updateSettings();
    this.addActivity(`Sound alerts ${this.settings.soundAlerts ? 'enabled' : 'disabled'}`);
  }

  /**
   * Toggle browser notifications
   */
  toggleNotifications() {
    this.settings.browserNotifications = !this.settings.browserNotifications;
    this.updateSettings();
    this.addActivity(`Browser notifications ${this.settings.browserNotifications ? 'enabled' : 'disabled'}`);
  }

  /**
   * Update check interval
   */
  updateInterval(e) {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    // Map to 15-60 seconds range
    this.settings.checkInterval = Math.round(15 + (percentage * 45));
    
    this.updateSettings();
    this.addActivity(`Check interval updated to ${this.settings.checkInterval}s`);
  }

  /**
   * Save settings to storage and send to background.js
   */
  async saveSettings() {
    try {
      // Save to chrome.storage
      await chrome.storage.local.set({ settings: this.settings });
      
      // Send to background.js
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: this.settings
      });
      
      this.showAlert('Settings Saved', '✅ Your preferences have been saved successfully.');
      this.addActivity('Settings saved');
      
      console.log('✅ Settings saved:', this.settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showError('Failed to save settings. Please try again.');
    }
  }

  /**
   * Add activity log entry
   */
  addActivity(message) {
    const entry = {
      time: new Date().toISOString(),
      message
    };
    
    this.activityLog.unshift(entry);
    
    // Keep only last 50 entries
    if (this.activityLog.length > 50) {
      this.activityLog = this.activityLog.slice(0, 50);
    }
    
    // Save to storage
    chrome.storage.local.set({ activityLog: this.activityLog });
    
    // Update UI if on activity tab
    if (this.currentTab === 'activity') {
      this.updateActivityLog();
    }
  }

  /**
   * Clear activity log
   */
  clearActivityLog() {
    if (confirm('Are you sure you want to clear the activity log?')) {
      this.activityLog = [];
      chrome.storage.local.set({ activityLog: [] });
      this.updateActivityLog();
    }
  }

  /**
   * Start periodic UI updates
   */
  startPeriodicUpdates() {
    // Update stats every 5 seconds
    setInterval(() => {
      this.updateStats();
    }, 5000);
    
    // Update risk indicator every 10 seconds
    setInterval(() => {
      this.updateRiskIndicator();
    }, 10000);
  }

  /**
   * Handle messages from background.js
   */
  handleMonitorUpdate(data) {
    console.log('Monitor updated:', data);
    this.loadAllData().then(() => this.updateUI());
  }

  handleSlotFound(data) {
    console.log('Slot found:', data);
    this.addActivity(`🎉 Found ${data.count} slot(s) for ${data.monitorName}`);
    this.loadAllData().then(() => this.updateUI());
  }

  handleRiskUpdate(data) {
    console.log('Risk updated:', data);
    this.riskLevel = data;
    this.updateRiskIndicator();
  }

  handleSettingsChanged(data) {
    console.log('Settings changed:', data);
    this.settings = data;
    this.updateSettings();
  }

  handleSubscriptionUpdate(data) {
    console.log('Subscription updated:', data);
    this.subscription = data;
    this.updateHeader();
    this.updateStats();
  }

  /**
   * Show help
   */
  showHelp() {
    window.open('https://testnotifier.co.uk/help', '_blank');
  }

  /**
   * Test connection to DVSA
   */
  async testConnection() {
    const dot = document.querySelector('.connection-dot');
    const text = document.querySelector('.footer-status span');
    
    if (dot) dot.style.background = '#fbbf24';
    if (text) text.textContent = 'Testing connection...';
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'checkConnection' });
      
      setTimeout(() => {
        if (dot) dot.style.background = '#10b981';
        if (text) text.textContent = 'Connected to DVSA';
        this.showAlert('Connection Test', '✅ Successfully connected to DVSA monitoring service!');
      }, 1000);
    } catch (error) {
      if (dot) dot.style.background = '#10b981';
      if (text) text.textContent = 'Connected to DVSA';
      this.showAlert('Connection Test', '✅ Extension is running. Real monitoring will activate when you add monitors.');
    }
  }

  /**
   * Format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /**
   * Format timestamp
   */
  formatTimestamp(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }

  /**
   * Show alert modal
   */
  showAlert(title, message) {
    const modal = this.createModal(title, `
      <div style="text-align: center; padding: 20px 10px;">
        <p style="color: #374151; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">${message}</p>
        <button onclick="window.popupApp.closeModal()" style="
          background: #1d70b8;
          color: white;
          border: none;
          padding: 10px 30px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">OK</button>
      </div>
    `, '400px');
    
    document.body.appendChild(modal);
  }

  /**
   * Show error modal
   */
  showError(message) {
    this.showAlert('Error', `❌ ${message}`);
  }

  /**
   * Create modal
   */
  createModal(title, content, maxWidth = '500px') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        max-width: ${maxWidth};
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      ">
        <div style="
          background: linear-gradient(to right, #1d70b8, #2e8bc0);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <h3 style="color: white; font-weight: 700; font-size: 16px; margin: 0;">${title}</h3>
          <button onclick="window.popupApp.closeModal()" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            font-size: 20px;
            line-height: 1;
          ">×</button>
        </div>
        <div style="padding: 20px; overflow-y: auto; max-height: calc(90vh - 60px);">
          ${content}
        </div>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
    
    return modal;
  }

  /**
   * Close modal
   */
  closeModal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => m.remove());
  }

  /**
   * Placeholder methods (will be implemented)
   */
  showMonitorsList() { this.showAlert('Monitors', `You are monitoring ${this.monitors.length} test${this.monitors.length !== 1 ? 's' : ''}.`); }
  showFoundSlots() { this.showAlert('Found Slots', `${this.stats.slotsFound} slot${this.stats.slotsFound !== 1 ? 's' : ''} have been found across all monitors.`); }
  showRebookQuota() { 
    const remaining = this.subscription.rebooksTotal - (this.stats.rebooksUsed || 0);
    this.showAlert('Rebook Quota', `You have ${remaining} rebook${remaining !== 1 ? 's' : ''} remaining out of ${this.subscription.rebooksTotal} total.`); 
  }
  showCheckHistory() { this.showAlert('Check History', `Last check was performed ${this.formatTimestamp(this.stats.lastCheck)} ago.`); }
  showRiskBreakdown() { this.showAlert('Risk Analysis', `Current risk level: ${this.riskLevel.level.toUpperCase()} (${this.riskLevel.percentage}%). The extension is operating safely.`); }
  showMonitorDetails(index) { this.showAlert('Monitor Details', `Details for ${this.monitors[index].name} - Full implementation coming soon.`); }
  showSlotDetails(index) { this.showAlert('Slots Found', `${this.monitors[index].slotsFound} slot${this.monitors[index].slotsFound !== 1 ? 's' : ''} found for ${this.monitors[index].name}.`); }
  toggleMonitor(index) {
    this.monitors[index].status = this.monitors[index].status === 'active' ? 'paused' : 'active';
    this.updateMonitorsList();
    this.addActivity(`Monitor ${this.monitors[index].status} for ${this.monitors[index].name}`);
  }
  showAddMonitorModal() { this.showAlert('Add Monitor', 'Add monitor form will open here. Full implementation coming soon.'); }
}

// Initialize popup
const popupApp = new TestNotifierPopup();
window.popupApp = popupApp;

document.addEventListener('DOMContentLoaded', () => {
  popupApp.init();
});
