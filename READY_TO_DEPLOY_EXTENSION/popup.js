/**
 * TestNotifier Extension Popup
 * Modern UI with full subscription integration
 */

class TestNotifierPopup {
  constructor() {
    this.subscription = null;
    this.monitors = [];
    this.stats = { monitorsCount: 0, slotsFound: 0, lastCheck: null };
    this.activityLog = [];
    this.isActivityExpanded = false;
  }

  async init() {
    console.log('🚀 Initializing TestNotifier popup...');
    
    await this.loadSubscription();
    await this.loadMonitors();
    await this.loadStats();
    await this.loadActivityLog();
    
    this.setupEventListeners();
    this.updateUI();
    this.startPeriodicUpdates();
    
    console.log('✅ Popup initialized');
  }

  /**
   * Load subscription status from backend API
   */
  async loadSubscription() {
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        this.subscription = { tier: 'none', status: 'not_authenticated' };
        return;
      }

      const response = await fetch('https://testnotifier.co.uk/api/subscriptions/current', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        this.subscription = await response.json();
      } else {
        this.subscription = { tier: 'free', status: 'trial', rebooks Remaining: 0 };
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      this.subscription = { tier: 'free', status: 'trial' };
    }
  }

  /**
   * Load monitors from storage
   */
  async loadMonitors() {
    try {
      const result = await chrome.storage.local.get(['monitors']);
      this.monitors = result.monitors || [];
      this.stats.monitorsCount = this.monitors.length;
    } catch (error) {
      console.error('Error loading monitors:', error);
      this.monitors = [];
    }
  }

  /**
   * Load stats from storage
   */
  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['stats']);
      if (result.stats) {
        this.stats = { ...this.stats, ...result.stats };
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  /**
   * Load activity log
   */
  async loadActivityLog() {
    try {
      const result = await chrome.storage.local.get(['activityLog']);
      this.activityLog = result.activityLog || [];
    } catch (error) {
      console.error('Error loading activity log:', error);
    }
  }

  /**
   * Get auth token from storage
   */
  async getAuthToken() {
    try {
      const result = await chrome.storage.local.get(['auth_token']);
      return result.auth_token || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Add monitor button
    document.getElementById('add-monitor-btn')?.addEventListener('click', () => this.showAddMonitorModal());
    
    // Emergency stop
    document.getElementById('emergency-stop-btn')?.addEventListener('click', () => this.emergencyStop());
    
    // Settings button
    document.getElementById('settings-btn')?.addEventListener('click', () => this.showSettings());
    
    // Help button
    document.getElementById('help-btn')?.addEventListener('click', () => this.showHelp());
    
    // Activity log toggle
    document.getElementById('activity-toggle')?.addEventListener('click', () => this.toggleActivityLog());
  }

  /**
   * Update entire UI
   */
  updateUI() {
    this.updateHeader();
    this.updateStats();
    this.updateMonitorsList();
    this.updateActivityLog();
    this.updateConnectionStatus();
  }

  /**
   * Update header color based on subscription tier
   */
  updateHeader() {
    const header = document.getElementById('header');
    const tierText = document.getElementById('subscription-tier');
    const quotaIndicator = document.getElementById('quota-indicator');
    
    if (!header || !tierText) return;

    const tier = this.subscription?.tier || 'free';
    const status = this.subscription?.status || 'trial';
    
    // Define colors for each tier
    const tierColors = {
      'free': 'bg-gradient-to-r from-gray-600 to-gray-700',
      'one-off': 'bg-gradient-to-r from-[#8B4513] to-[#A0522D]', // Bronze
      'starter': 'bg-gradient-to-r from-[#C0C0C0] to-[#B0B0B0]', // Silver
      'premium': 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]', // Gold
      'professional': 'bg-gradient-to-r from-[#E5E4E2] to-[#C9C9C9]' // Platinum
    };

    const tierNames = {
      'free': 'Free Trial (3-day preview)',
      'one-off': 'One-Off Rebook',
      'starter': 'Starter Plan',
      'premium': 'Premium Plan',
      'professional': 'Professional Plan'
    };

    // Remove all gradient classes
    header.className = header.className.replace(/bg-gradient-\S+/g, '').trim();
    
    // Add new gradient
    header.className += ' ' + (tierColors[tier] || tierColors['free']);
    
    // Update tier text
    tierText.textContent = tierNames[tier] || 'DVSA Test Monitor';
    
    // Show quota indicator for non-unlimited plans
    if (tier !== 'professional' && tier !== 'free') {
      const remaining = this.subscription?.rebooksRemaining || 0;
      const total = tier === 'starter' ? 2 : tier === 'premium' ? 5 : tier === 'one-off' ? 1 : 0;
      
      document.getElementById('quota-remaining').textContent = remaining;
      document.getElementById('quota-total').textContent = total;
      quotaIndicator?.classList.remove('hidden');
    } else {
      quotaIndicator?.classList.add('hidden');
    }

    // Show subscription alert if trial or expired
    this.updateSubscriptionAlert();
  }

  /**
   * Update subscription alert banner
   */
  updateSubscriptionAlert() {
    const alertContainer = document.getElementById('subscription-alert');
    if (!alertContainer) return;

    const tier = this.subscription?.tier;
    const status = this.subscription?.status;

    if (tier === 'free' || status === 'trial') {
      alertContainer.innerHTML = `
        <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-sm">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="font-semibold text-blue-900 mb-1">Trial Mode: Monitoring Only</p>
              <p class="text-blue-700 text-xs">You can see slots but cannot book. Subscribe to unlock booking!</p>
              <button onclick="window.open('https://testnotifier.co.uk/#pricing', '_blank')" class="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold">
                View Plans
              </button>
            </div>
          </div>
        </div>
      `;
      alertContainer.classList.remove('hidden');
    } else if (status === 'expired') {
      alertContainer.innerHTML = `
        <div class="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="font-semibold text-red-900 mb-1">Subscription Expired</p>
              <p class="text-red-700 text-xs">Renew your subscription to continue using TestNotifier.</p>
              <button onclick="window.open('https://testnotifier.co.uk/#pricing', '_blank')" class="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-semibold">
                Renew Now
              </button>
            </div>
          </div>
        </div>
      `;
      alertContainer.classList.remove('hidden');
    } else {
      alertContainer.classList.add('hidden');
    }
  }

  /**
   * Update stats display
   */
  updateStats() {
    document.getElementById('monitor-count').textContent = this.stats.monitorsCount || 0;
    document.getElementById('slots-found').textContent = this.stats.slotsFound || 0;
    
    const lastCheck = this.stats.lastCheck;
    if (lastCheck) {
      const diff = Date.now() - new Date(lastCheck).getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (minutes > 0) {
        document.getElementById('last-check').textContent = `${minutes}m`;
      } else {
        document.getElementById('last-check').textContent = `${seconds}s`;
      }
    } else {
      document.getElementById('last-check').textContent = '--';
    }
  }

  /**
   * Update monitors list
   */
  updateMonitorsList() {
    const container = document.getElementById('monitors-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!container) return;

    if (this.monitors.length === 0) {
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');
    
    container.innerHTML = this.monitors.map((monitor, index) => this.createMonitorCard(monitor, index)).join('');
    
    // Add click listeners to monitor cards
    this.monitors.forEach((_, index) => {
      document.getElementById(`monitor-${index}`)?.addEventListener('click', () => this.showMonitorDetails(index));
      document.getElementById(`pause-monitor-${index}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMonitor(index);
      });
      document.getElementById(`delete-monitor-${index}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteMonitor(index);
      });
    });
  }

  /**
   * Create monitor card HTML
   */
  createMonitorCard(monitor, index) {
    const isActive = monitor.status === 'active';
    const hasSlots = (monitor.slotsFound || 0) > 0;
    const lastUpdate = monitor.lastUpdate ? this.formatTimeAgo(monitor.lastUpdate) : 'Never';
    
    return `
      <div id="monitor-${index}" class="bg-white rounded-xl p-4 border-2 ${isActive ? 'border-[#1d70b8]' : 'border-gray-200'} hover:border-[#1d70b8] hover:shadow-md transition-all cursor-pointer">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="font-semibold text-gray-900 mb-1">${monitor.name || 'Monitor ' + (index + 1)}</div>
            <div class="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
              <!-- Calendar Icon -->
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${this.formatDate(monitor.targetDate)}</span>
              <span>•</span>
              <!-- Map Pin Icon -->
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${monitor.location || 'Not set'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="bg-${isActive ? 'green' : 'gray'}-50 px-2 py-1 rounded text-xs font-semibold text-${isActive ? 'green' : 'gray'}-700">
              ${isActive ? 'Active' : 'Paused'}
            </div>
          </div>
        </div>
        
        <!-- Status Row -->
        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
          <div class="flex items-center gap-2 text-sm ${hasSlots ? 'text-green-600 font-semibold' : 'text-gray-500'}">
            ${hasSlots ? `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              ${monitor.slotsFound} slot${monitor.slotsFound > 1 ? 's' : ''} found!
            ` : `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              ${isActive ? 'Searching...' : 'Paused'}
            `}
          </div>
          <div class="flex items-center gap-2">
            <button id="pause-monitor-${index}" class="text-xs text-gray-500 hover:text-[#1d70b8] font-semibold">
              ${isActive ? 'Pause' : 'Resume'}
            </button>
            <span class="text-gray-300">•</span>
            <button id="delete-monitor-${index}" class="text-xs text-red-500 hover:text-red-700 font-semibold">
              Delete
            </button>
          </div>
        </div>
        
        <div class="text-xs text-gray-400 mt-1 text-right">${lastUpdate}</div>
      </div>
    `;
  }

  /**
   * Update activity log
   */
  updateActivityLog() {
    const logContainer = document.getElementById('activity-log');
    if (!logContainer) return;

    if (this.activityLog.length === 0) {
      logContainer.innerHTML = '<p class="text-xs text-gray-500 py-2">No recent activity</p>';
      return;
    }

    logContainer.innerHTML = this.activityLog.slice(0, 10).map(activity => `
      <div class="text-xs text-gray-600 py-1 flex items-center gap-2">
        <span class="text-gray-400">${this.formatTime(activity.timestamp)}</span>
        <span>${activity.message}</span>
      </div>
    `).join('');
  }

  /**
   * Update connection status
   */
  async updateConnectionStatus() {
    const indicator = document.getElementById('connection-indicator');
    const statusText = document.getElementById('connection-status');
    
    if (!indicator || !statusText) return;

    try {
      // Check if we can reach DVSA (via background script)
      const response = await chrome.runtime.sendMessage({ action: 'checkConnection' });
      
      if (response?.connected) {
        indicator.className = 'w-2 h-2 bg-green-500 rounded-full animate-pulse';
        statusText.textContent = 'Connected to DVSA';
      } else {
        indicator.className = 'w-2 h-2 bg-yellow-500 rounded-full';
        statusText.textContent = 'Checking connection...';
      }
    } catch (error) {
      indicator.className = 'w-2 h-2 bg-red-500 rounded-full';
      statusText.textContent = 'Disconnected';
    }
  }

  /**
   * Show add monitor modal
   */
  showAddMonitorModal() {
    const tier = this.subscription?.tier || 'free';
    
    // Check monitor limits
    const limits = {
      'free': 0,
      'one-off': 1,
      'starter': 3,
      'premium': 5,
      'professional': 999
    };

    if (this.monitors.length >= limits[tier]) {
      this.showUpgradePrompt();
      return;
    }

    const modal = document.getElementById('modals-container');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="add-monitor-modal">
        <div class="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Add New Monitor</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Name/Pupil Name</label>
              <input type="text" id="monitor-name" class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1d70b8] focus:outline-none" placeholder="e.g., Sarah Johnson">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Licence Number</label>
              <input type="text" id="licence-number" class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1d70b8] focus:outline-none uppercase" placeholder="e.g., SMITH123456S99">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Target Date (earliest acceptable)</label>
              <input type="date" id="target-date" class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1d70b8] focus:outline-none">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Test Centre / Location</label>
              <input type="text" id="test-location" class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1d70b8] focus:outline-none" placeholder="e.g., Manchester, Birmingham">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Notification Preferences</label>
              <div class="space-y-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" id="notify-email" checked class="rounded text-[#1d70b8]">
                  <span class="text-sm text-gray-700">Email notifications</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" id="notify-sms" ${tier === 'free' || tier === 'one-off' ? 'disabled' : 'checked'} class="rounded text-[#1d70b8]">
                  <span class="text-sm text-gray-700">SMS notifications ${tier === 'free' || tier === 'one-off' ? '(Premium+)' : ''}</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" id="notify-browser" checked class="rounded text-[#1d70b8]">
                  <span class="text-sm text-gray-700">Browser notifications</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button onclick="testNotifierPopup.closeModal()" class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onclick="testNotifierPopup.saveMonitor()" class="flex-1 px-4 py-3 bg-[#28a745] text-white rounded-xl font-semibold hover:bg-[#218838] transition-colors">
              Add Monitor
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Set min date to today
    const dateInput = document.getElementById('target-date');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Save new monitor
   */
  async saveMonitor() {
    const name = document.getElementById('monitor-name')?.value;
    const licence = document.getElementById('licence-number')?.value;
    const targetDate = document.getElementById('target-date')?.value;
    const location = document.getElementById('test-location')?.value;
    const notifyEmail = document.getElementById('notify-email')?.checked;
    const notifySMS = document.getElementById('notify-sms')?.checked;
    const notifyBrowser = document.getElementById('notify-browser')?.checked;

    if (!name || !licence || !targetDate || !location) {
      alert('Please fill in all required fields');
      return;
    }

    const newMonitor = {
      id: Date.now().toString(),
      name,
      licence: licence.toUpperCase(),
      targetDate,
      location,
      notifications: {
        email: notifyEmail,
        sms: notifySMS,
        browser: notifyBrowser
      },
      status: 'active',
      slotsFound: 0,
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.monitors.push(newMonitor);
    await chrome.storage.local.set({ monitors: this.monitors });
    
    // Notify background script
    chrome.runtime.sendMessage({
      action: 'monitorAdded',
      monitor: newMonitor
    });

    this.stats.monitorsCount = this.monitors.length;
    this.closeModal();
    this.updateUI();
    
    this.addActivityLog(`Added monitor for ${name}`);
  }

  /**
   * Close modal
   */
  closeModal() {
    document.getElementById('modals-container').innerHTML = '';
  }

  /**
   * Toggle monitor active/paused
   */
  async toggleMonitor(index) {
    const monitor = this.monitors[index];
    if (!monitor) return;

    monitor.status = monitor.status === 'active' ? 'paused' : 'active';
    monitor.lastUpdate = new Date().toISOString();
    
    await chrome.storage.local.set({ monitors: this.monitors });
    
    chrome.runtime.sendMessage({
      action: monitor.status === 'active' ? 'resumeMonitor' : 'pauseMonitor',
      monitorId: monitor.id
    });

    this.updateUI();
    this.addActivityLog(`${monitor.status === 'active' ? 'Resumed' : 'Paused'} monitor for ${monitor.name}`);
  }

  /**
   * Delete monitor
   */
  async deleteMonitor(index) {
    const monitor = this.monitors[index];
    if (!monitor) return;

    if (!confirm(`Delete monitor for ${monitor.name}?`)) return;

    chrome.runtime.sendMessage({
      action: 'deleteMonitor',
      monitorId: monitor.id
    });

    this.monitors.splice(index, 1);
    await chrome.storage.local.set({ monitors: this.monitors });
    
    this.stats.monitorsCount = this.monitors.length;
    this.updateUI();
    this.addActivityLog(`Deleted monitor for ${monitor.name}`);
  }

  /**
   * Show monitor details
   */
  showMonitorDetails(index) {
    const monitor = this.monitors[index];
    if (!monitor) return;

    const modal = document.getElementById('modals-container');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="details-modal">
        <div class="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Monitor Details</h3>
          
          <div class="space-y-3">
            <div>
              <span class="text-xs font-semibold text-gray-500">Name:</span>
              <p class="text-sm font-semibold text-gray-900">${monitor.name}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Licence Number:</span>
              <p class="text-sm font-mono text-gray-900">${monitor.licence}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Target Date:</span>
              <p class="text-sm text-gray-900">${this.formatDate(monitor.targetDate)}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Location:</span>
              <p class="text-sm text-gray-900">${monitor.location}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Notifications:</span>
              <div class="flex gap-2 mt-1">
                ${monitor.notifications.email ? '<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Email</span>' : ''}
                ${monitor.notifications.sms ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">SMS</span>' : ''}
                ${monitor.notifications.browser ? '<span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Browser</span>' : ''}
              </div>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Status:</span>
              <p class="text-sm font-semibold ${monitor.status === 'active' ? 'text-green-600' : 'text-gray-500'}">${monitor.status === 'active' ? '● Active' : '○ Paused'}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Slots Found:</span>
              <p class="text-sm font-semibold text-green-600">${monitor.slotsFound || 0}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-500">Last Update:</span>
              <p class="text-sm text-gray-600">${this.formatTimeAgo(monitor.lastUpdate)}</p>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button onclick="testNotifierPopup.closeModal()" class="flex-1 px-4 py-3 bg-[#1d70b8] text-white rounded-xl font-semibold hover:bg-[#155a9e] transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Emergency stop all monitoring
   */
  async emergencyStop() {
    if (!confirm('Stop all monitoring? This will pause all active monitors.')) return;

    // Pause all monitors
    this.monitors.forEach(m => m.status = 'paused');
    await chrome.storage.local.set({ monitors: this.monitors });
    
    // Notify background
    chrome.runtime.sendMessage({ action: 'emergencyStop' });
    
    this.updateUI();
    this.addActivityLog('🛑 Emergency stop activated - All monitors paused');
  }

  /**
   * Show settings modal
   */
  showSettings() {
    const modal = document.getElementById('modals-container');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Check Interval</label>
              <div class="flex items-center gap-3">
                <input type="range" id="check-interval" min="15" max="60" value="30" class="flex-1">
                <span id="interval-value" class="text-sm font-semibold text-gray-900 min-w-[40px]">30s</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">How often to check for slots</p>
            </div>
            
            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-700">Sound Notifications</span>
                <input type="checkbox" id="sound-enabled" checked class="rounded text-[#1d70b8]">
              </label>
            </div>
            
            <div>
              <label class="flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-700">Browser Notifications</span>
                <input type="checkbox" id="browser-notifications" checked class="rounded text-[#1d70b8]">
              </label>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Risk Sensitivity</label>
              <select id="risk-level" class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1d70b8] focus:outline-none">
                <option value="low">Low (Aggressive)</option>
                <option value="medium" selected>Medium (Balanced)</option>
                <option value="high">High (Cautious)</option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button onclick="testNotifierPopup.closeModal()" class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button onclick="testNotifierPopup.saveSettings()" class="flex-1 px-4 py-3 bg-[#1d70b8] text-white rounded-xl font-semibold hover:bg-[#155a9e]">
              Save
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Setup interval slider
    const slider = document.getElementById('check-interval');
    const value = document.getElementById('interval-value');
    slider?.addEventListener('input', (e) => {
      value.textContent = e.target.value + 's';
    });
  }

  /**
   * Save settings
   */
  async saveSettings() {
    const interval = document.getElementById('check-interval')?.value || 30;
    const sound = document.getElementById('sound-enabled')?.checked;
    const browserNotif = document.getElementById('browser-notifications')?.checked;
    const riskLevel = document.getElementById('risk-level')?.value || 'medium';

    const settings = {
      checkInterval: parseInt(interval) * 1000,
      soundEnabled: sound,
      browserNotifications: browserNotif,
      riskLevel: riskLevel
    };

    await chrome.storage.local.set({ settings });
    chrome.runtime.sendMessage({ action: 'settingsUpdated', settings });
    
    this.closeModal();
    this.addActivityLog('Settings saved');
  }

  /**
   * Show help
   */
  showHelp() {
    window.open('https://testnotifier.co.uk/help', '_blank');
  }

  /**
   * Show upgrade prompt
   */
  showUpgradePrompt() {
    const tier = this.subscription?.tier || 'free';
    const modal = document.getElementById('modals-container');
    
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Upgrade Required</h3>
          
          <p class="text-gray-700 mb-4">
            You've reached the monitor limit for your ${tier} plan.
          </p>
          
          <div class="bg-blue-50 rounded-lg p-4 mb-4">
            <p class="text-sm font-semibold text-blue-900 mb-2">Upgrade to get:</p>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>✓ More monitors</li>
              <li>✓ More rebooks per month</li>
              <li>✓ SMS notifications</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          
          <div class="flex gap-3">
            <button onclick="testNotifierPopup.closeModal()" class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold">
              Cancel
            </button>
            <button onclick="window.open('https://testnotifier.co.uk/#pricing', '_blank')" class="flex-1 px-4 py-3 bg-[#1d70b8] text-white rounded-xl font-semibold">
              View Plans
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Toggle activity log
   */
  toggleActivityLog() {
    this.isActivityExpanded = !this.isActivityExpanded;
    const log = document.getElementById('activity-log');
    const arrow = document.getElementById('activity-arrow');
    
    if (this.isActivityExpanded) {
      log?.classList.remove('hidden');
      arrow?.classList.add('rotate-180');
    } else {
      log?.classList.add('hidden');
      arrow?.classList.remove('rotate-180');
    }
  }

  /**
   * Add activity log entry
   */
  async addActivityLog(message) {
    const entry = {
      timestamp: new Date().toISOString(),
      message
    };
    
    this.activityLog.unshift(entry);
    this.activityLog = this.activityLog.slice(0, 50); // Keep last 50
    
    await chrome.storage.local.set({ activityLog: this.activityLog });
    this.updateActivityLog();
  }

  /**
   * Start periodic updates
   */
  startPeriodicUpdates() {
    // Update stats every 5 seconds
    setInterval(() => {
      this.updateStats();
      this.updateConnectionStatus();
    }, 5000);

    // Reload data every 30 seconds
    setInterval(() => {
      this.loadMonitors();
      this.loadStats();
      this.updateUI();
    }, 30000);
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /**
   * Format time ago
   */
  formatTimeAgo(timestamp) {
    if (!timestamp) return 'Never';
    
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  /**
   * Format time for activity log
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Listen for messages from background script
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case 'slotFound':
          this.handleSlotFound(message.data);
          break;
        case 'monitorUpdated':
          this.loadMonitors().then(() => this.updateUI());
          break;
        case 'statsUpdated':
          this.stats = { ...this.stats, ...message.stats };
          this.updateStats();
          break;
      }
    });
  }

  /**
   * Handle slot found notification
   */
  handleSlotFound(data) {
    const monitor = this.monitors.find(m => m.id === data.monitorId);
    if (monitor) {
      monitor.slotsFound = (monitor.slotsFound || 0) + 1;
      monitor.lastUpdate = new Date().toISOString();
      chrome.storage.local.set({ monitors: this.monitors });
    }
    
    this.stats.slotsFound++;
    this.updateUI();
    this.addActivityLog(`🎉 Found slot for ${data.name || 'monitor'} - ${data.date} at ${data.location}`);
  }
}

// Initialize popup when DOM is ready
let testNotifierPopup;

document.addEventListener('DOMContentLoaded', async () => {
  testNotifierPopup = new TestNotifierPopup();
  await testNotifierPopup.init();
  testNotifierPopup.setupMessageListener();
});
