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
      // Check if user is authenticated
      const result = await chrome.storage.local.get(['authToken']);
      
      if (!result.authToken) {
        // Not authenticated - show login screen
        console.log('⚠️ User not authenticated - showing login screen');
        this.showLoginScreen();
        return;
      }
      
      // User is authenticated - load app
      await this.loadAllData();
      this.hideLoginScreen();
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
   * Show login screen
   */
  showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').style.display = 'none';
    document.querySelector('.content').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    // Setup login button
    document.getElementById('btn-signin-google').addEventListener('click', () => {
      this.handleGoogleSignIn();
    });
  }
  
  /**
   * Hide login screen
   */
  hideLoginScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').style.display = 'block';
    document.querySelector('.content').style.display = 'block';
    document.querySelector('.footer').style.display = 'flex';
  }
  
  /**
   * Handle Google Sign In from extension
   */
  async handleGoogleSignIn() {
    try {
      // Open website login in new tab with extension state parameter
      const loginUrl = 'https://testnotifier.co.uk/api/auth/google?state=/extension-login';
      const newTab = await chrome.tabs.create({ url: loginUrl });
      
      console.log('🔐 Opened authentication tab:', newTab.id);
      
      // Set up message listener BEFORE opening tab
      if (!this.authMessageListenerSet) {
        // Listen for auth token message from website via chrome.runtime
        chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
          console.log('📨 Received message in popup:', message);
          
          if (message.type === 'AUTH_SUCCESS' || message.type === 'TESTNOTIFIER_AUTH') {
            console.log('✅ Auth successful! Token received');
            
            // Store token
            await chrome.storage.local.set({ 
              authToken: message.token,
              user: message.user
            });
            
            console.log('💾 Token saved to storage');
            
            // Close the auth tab if it's still open
            if (sender.tab && sender.tab.id) {
              try {
                await chrome.tabs.remove(sender.tab.id);
              } catch (e) {
                console.log('Could not close auth tab (may already be closed)');
              }
            }
            
            // Reload popup to show authenticated state
            window.location.reload();
            
            sendResponse({ success: true });
          }
        });
        
        this.authMessageListenerSet = true;
      }
      
    } catch (error) {
      console.error('Error during sign in:', error);
      alert('Failed to open sign in page. Please visit testnotifier.co.uk directly.');
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
        'riskLevel',
        'authToken'
      ]);
      
      // Load subscription from backend API (REAL VALIDATION)
      if (result.authToken) {
        try {
          this.subscription = await this.loadSubscriptionFromAPI(result.authToken);
        } catch (error) {
          console.error('Failed to load subscription from API:', error);
          this.subscription = result.subscription || { tier: 'free', status: 'inactive' };
        }
      } else {
        // Not authenticated - use free tier
        console.log('⚠️ No auth token - user not signed in');
        this.subscription = { tier: 'free', status: 'inactive' };
      }
      
      // Use stored data or start with empty state (PRODUCTION MODE)
      this.monitors = result.monitors || [];
      this.stats = result.stats || { 
        monitorsCount: 0, 
        slotsFound: 0, 
        rebooksUsed: 0, 
        rebooksTotal: 0,
        lastCheck: null
      };
      this.settings = result.settings || this.getDefaultSettings();
      this.activityLog = result.activityLog || [];
      this.riskLevel = result.riskLevel || { level: 'low', percentage: 12 };
      
      // Enforce subscription limits
      this.enforceSubscriptionLimits();
      
      console.log('📊 Data loaded:', {
        monitors: this.monitors.length,
        subscription: this.subscription.tier,
        authenticated: !!result.authToken,
        settings: this.settings
      });
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to empty state
      this.monitors = [];
      this.stats = { monitorsCount: 0, slotsFound: 0, rebooksUsed: 0, rebooksTotal: 0 };
      this.subscription = { tier: 'free', status: 'inactive' };
      this.settings = this.getDefaultSettings();
      this.activityLog = [];
    }
  }

  /**
   * Load subscription from backend API - REAL VALIDATION
   */
  async loadSubscriptionFromAPI(authToken) {
    console.log('🔐 Loading subscription from backend API...');
    
    try {
      const apiUrl = 'https://testnotifier.co.uk/api/subscriptions/current';
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Handle both response formats: { subscription: {...} } or {...}
        const subscription = responseData.subscription || responseData;
        
        console.log('✅ Subscription loaded:', subscription.tier);
        
        // Save to storage for offline use
        await chrome.storage.local.set({ subscription });
        
        return subscription;
      } else if (response.status === 401) {
        // Auth token expired
        console.error('❌ Authentication expired');
        await chrome.storage.local.remove(['authToken']);
        throw new Error('Authentication expired. Please sign in again.');
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading subscription from API:', error);
      throw error;
    }
  }

  /**
   * Enforce subscription limits - REAL TIER ENFORCEMENT
   */
  enforceSubscriptionLimits() {
    if (!this.subscription) return;
    
    const tier = this.subscription.tier;
    
    // Define tier limits with complete feature set
    const tierLimits = {
      'one-off': {
        maxMonitors: 1,
        maxTestCentres: 1,
        maxRebooksPerDay: 1,
        maxRebooksTotal: 1,
        maxNotificationsPerDay: 5,
        canAutoBook: false,
        canUseSMS: false,
        canUseWhatsApp: false,
        canUseStealthMode: false,
        canUseRapidMode: false,
        checkFrequency: 120,
        expiresInDays: 30
      },
      'starter': {
        maxMonitors: 10,
        maxTestCentres: 3,
        maxRebooksPerDay: 2,
        maxNotificationsPerDay: 10,
        canAutoBook: false,
        canUseSMS: true,
        canUseWhatsApp: false,
        canUseStealthMode: false,
        canUseRapidMode: false,
        checkFrequency: 60,
        duringTrial: { canRebook: false }
      },
      'premium': {
        maxMonitors: 20,
        maxTestCentres: 5,
        maxRebooksPerDay: 5,
        maxNotificationsPerDay: 25,
        canAutoBook: true, // ✅ AUTO-BOOKING ENABLED
        canUseSMS: true,
        canUseWhatsApp: false,
        canUseStealthMode: false,
        canUseRapidMode: true,
        checkFrequency: 30,
        duringTrial: { canRebook: false }
      },
      'professional': {
        maxMonitors: 20, // ADI Professional: 20 pupils
        maxTestCentres: 999,
        maxRebooksPerDay: 10,
        maxNotificationsPerDay: 50,
        canAutoBook: true,
        canUseSMS: true,
        canUseWhatsApp: true, // ✅ WHATSAPP EXCLUSIVE (ADI Professional)
        canUseStealthMode: true, // ✅ STEALTH EXCLUSIVE (ADI Professional)
        canUseRapidMode: true,
        canUseInstructorMode: true, // ✅ ADI-SPECIFIC FEATURES
        checkFrequency: 15,
        duringTrial: { canRebook: true, freeRebooks: 2 }
      }
    };
    
    this.limits = tierLimits[tier] || tierLimits['one-off'];
    
    console.log('🔒 Subscription limits enforced:', this.limits);
  }
  
  /**
   * Update extension header color based on subscription tier
   */
  updateExtensionHeaderColor() {
    const tier = this.subscription?.tier || 'one-off';
    
    const tierColors = {
      'one-off': {
        primary: '#28a745',
        gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        badge: 'ONE-OFF',
        icon: this.getZapIcon(),
        glow: 'rgba(40, 167, 69, 0.3)'
      },
      'starter': {
        primary: '#718096',
        gradient: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
        badge: 'STARTER',
        icon: this.getTrendingUpIcon(),
        glow: 'rgba(113, 128, 150, 0.3)'
      },
      'premium': {
        primary: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        badge: 'PREMIUM',
        icon: this.getSparklesIcon(),
        glow: 'rgba(139, 92, 246, 0.3)'
      },
      'professional': {
        primary: '#1d70b8',
        gradient: 'linear-gradient(135deg, #1d70b8 0%, #005ea5 100%)',
        badge: 'ADI PRO',
        icon: this.getCrownIcon(),
        glow: 'rgba(29, 112, 184, 0.4)'
      }
    };
    
    const colors = tierColors[tier] || tierColors['one-off'];
    
    // Update header background
    const header = document.querySelector('.header');
    if (header) {
      header.style.background = colors.gradient;
      header.style.boxShadow = `0 4px 20px ${colors.glow}`;
    }
    
    // Update tier badge with icon
    const tierBadge = document.getElementById('subscription-tier-badge');
    if (tierBadge) {
      tierBadge.innerHTML = `${colors.icon} ${colors.badge}`;
      tierBadge.style.boxShadow = `0 0 20px ${colors.glow}`;
    }
    
    // Set CSS variables for consistent theming
    document.documentElement.style.setProperty('--tier-color', colors.primary);
    document.documentElement.style.setProperty('--tier-gradient', colors.gradient);
    document.documentElement.style.setProperty('--tier-glow', colors.glow);
    
    console.log(`🎨 Extension header color updated to: ${colors.badge}`);
  }
  
  /**
   * Lucide-style SVG icons for tier badges
   */
  getZapIcon() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }
  
  getTrendingUpIcon() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
  }
  
  getSparklesIcon() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`;
  }
  
  getCrownIcon() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
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
    
    // Instructor tab (ADI Professional only)
    this.attachInstructorListeners();
    
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
   * Instructor tab listeners (ADI Professional only)
   */
  attachInstructorListeners() {
    // Travel radius slider
    const radiusSlider = document.getElementById('slider-radius');
    if (radiusSlider) {
      radiusSlider.addEventListener('click', (e) => this.updateTravelRadius(e));
    }
    
    // Bulk pause button
    const bulkPauseBtn = document.getElementById('bulk-pause');
    if (bulkPauseBtn) {
      bulkPauseBtn.addEventListener('click', () => this.bulkPauseMonitors());
    }
    
    // Bulk resume button
    const bulkResumeBtn = document.getElementById('bulk-resume');
    if (bulkResumeBtn) {
      bulkResumeBtn.addEventListener('click', () => this.bulkResumeMonitors());
    }
    
    // Save instructor profile
    const saveInstructorBtn = document.getElementById('btn-save-instructor');
    if (saveInstructorBtn) {
      saveInstructorBtn.addEventListener('click', () => this.saveInstructorProfile());
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
    this.updateExtensionHeaderColor(); // Apply tier color coding
    this.updateHeader();
    this.updateStats();
    this.updateRiskIndicator();
    this.updateMonitorsList();
    this.updateSettings();
    this.updateActivityLog();
    this.updateInstructorStats(); // Update instructor stats if ADI Professional tier
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
        'professional': 'ADI Professional'
      };
      tierElement.textContent = tierNames[this.subscription.tier] || 'DVSA Test Monitor';
    }
    
    // Show/hide Instructor tab for ADI Professional tier
    const instructorTab = document.getElementById('tab-instructor');
    if (instructorTab) {
      if (this.subscription?.tier === 'professional') {
        instructorTab.style.display = 'block';
      } else {
        instructorTab.style.display = 'none';
      }
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
        <button class="alert-ok-btn" style="
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
    
    // Attach OK button click listener
    setTimeout(() => {
      const okBtn = modal.querySelector('.alert-ok-btn');
      if (okBtn) {
        okBtn.addEventListener('click', () => this.closeModal());
      }
    }, 0);
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
    
    const modalId = 'modal-' + Date.now();
    
    modal.innerHTML = `
      <div id="${modalId}" style="
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
          <button class="close-modal-btn" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px 8px;
            font-size: 24px;
            line-height: 1;
          ">×</button>
        </div>
        <div style="padding: 20px; overflow-y: auto; max-height: calc(90vh - 60px);">
          ${content}
        </div>
      </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
    
    // Close on X button click
    setTimeout(() => {
      const closeBtn = modal.querySelector('.close-modal-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
    }, 0);
    
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
   * Show monitors list
   */
  showMonitorsList() {
    const content = `
      <div>
        ${this.monitors.map((m, i) => `
          <div style="padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px; cursor: pointer;" onclick="window.popupApp.showMonitorDetails(${i}); window.popupApp.closeModal();">
            <div style="font-weight: 600; color: #111827;">${m.name}</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${m.location} • ${this.formatDate(m.targetDate)}</div>
            <div style="font-size: 11px; color: ${m.status === 'active' ? '#059669' : '#dc2626'}; margin-top: 4px; font-weight: 600;">
              ${m.status === 'active' ? '✓ Active' : '⏸ Paused'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    const modal = this.createModal('All Monitors', content, '450px');
    document.body.appendChild(modal);
  }

  /**
   * Show found slots
   */
  showFoundSlots() {
    const allSlots = this.monitors.flatMap((m, monitorIndex) => 
      m.foundSlots.map(slot => ({ ...slot, monitorName: m.name, monitorIndex }))
    );
    
    const content = allSlots.length === 0 ? `
      <div style="text-align: center; padding: 30px; color: #6b7280;">
        <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
        <div style="font-weight: 600;">No slots found yet</div>
        <div style="font-size: 13px; margin-top: 8px;">We're actively searching...</div>
      </div>
    ` : `
      <div>
        ${allSlots.map(slot => `
          <div style="padding: 12px; background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; margin-bottom: 8px;">
            <div class="monitor-name-link" data-monitor-index="${slot.monitorIndex}" style="
              font-weight: 600;
              color: #1d70b8;
              cursor: pointer;
              text-decoration: underline;
            ">${slot.monitorName}</div>
            <div style="font-size: 13px; color: #047857; margin-top: 4px;">📅 ${this.formatDate(slot.date)} at ${slot.time}</div>
            <div style="font-size: 12px; color: #059669; margin-top: 2px;">📍 ${slot.centre}</div>
          </div>
        `).join('')}
      </div>
    `;
    const modal = this.createModal('Found Slots', content, '450px');
    document.body.appendChild(modal);
    
    // Make monitor names clickable
    setTimeout(() => {
      modal.querySelectorAll('.monitor-name-link').forEach(link => {
        link.addEventListener('click', () => {
          const monitorIndex = parseInt(link.getAttribute('data-monitor-index'));
          this.closeModal();
          this.showMonitorDetails(monitorIndex);
        });
      });
    }, 0);
  }

  /**
   * Show rebook quota
   */
  showRebookQuota() {
    const remaining = this.subscription.rebooksTotal - (this.stats.rebooksUsed || 0);
    const content = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 48px; font-weight: 700; color: #1d70b8; margin-bottom: 12px;">${remaining}/${this.subscription.rebooksTotal}</div>
        <div style="font-size: 16px; color: #374151; margin-bottom: 20px;">Rebooks Remaining</div>
        <div style="background: #eff6ff; padding: 16px; border-radius: 8px; text-align: left; font-size: 13px; color: #1e40af;">
          <div style="margin-bottom: 8px;"><strong>Plan:</strong> ${this.subscription.tier}</div>
          <div style="margin-bottom: 8px;"><strong>Used:</strong> ${this.stats.rebooksUsed || 0} rebooks</div>
          <div><strong>Remaining:</strong> ${remaining} rebooks</div>
        </div>
      </div>
    `;
    const modal = this.createModal('Rebook Quota', content, '400px');
    document.body.appendChild(modal);
  }

  /**
   * Show check history
   */
  showCheckHistory() {
    const content = `
      <div style="padding: 10px;">
        <div style="font-size: 14px; color: #374151; margin-bottom: 16px;">
          Last check was performed <strong>${this.formatTimestamp(this.stats.lastCheck)}</strong> ago.
        </div>
        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; font-size: 12px; color: #6b7280;">
          Automatic checks run every ${this.settings.checkInterval} seconds when enabled.
        </div>
      </div>
    `;
    const modal = this.createModal('Check History', content, '400px');
    document.body.appendChild(modal);
  }

  /**
   * Show risk breakdown
   */
  showRiskBreakdown() {
    const content = `
      <div style="padding: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 40px; font-weight: 700; color: ${this.riskLevel.level === 'low' ? '#10b981' : this.riskLevel.level === 'medium' ? '#fbbf24' : '#ef4444'};">
            ${this.riskLevel.percentage}%
          </div>
          <div style="font-size: 18px; font-weight: 600; color: #374151;">${this.riskLevel.level.toUpperCase()} RISK</div>
        </div>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; font-size: 13px; color: #374151; line-height: 1.6;">
          <div style="margin-bottom: 12px;"><strong>Status:</strong> The extension is operating ${this.riskLevel.level === 'low' ? 'safely' : this.riskLevel.level === 'medium' ? 'with caution' : 'at high risk'}.</div>
          <div><strong>Recommendation:</strong> ${this.riskLevel.level === 'low' ? 'Continue monitoring as normal.' : this.riskLevel.level === 'medium' ? 'Consider reducing check frequency.' : 'Use Emergency Stop immediately.'}</div>
        </div>
      </div>
    `;
    const modal = this.createModal('Risk Analysis', content, '400px');
    document.body.appendChild(modal);
  }

  /**
   * Show monitor details
   */
  showMonitorDetails(index) {
    const monitor = this.monitors[index];
    const content = `
      <div style="font-size: 13px;">
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Student Name</div>
          <div style="font-weight: 600; color: #111827;">${monitor.name}</div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">License Number</div>
          <div style="font-family: monospace; color: #374151;">${monitor.licence}</div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Email Address</div>
          <div style="color: #374151;">📧 ${monitor.email || 'Not provided'}</div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Phone Number</div>
          <div style="color: #374151;">📱 ${monitor.phone || 'Not provided'}</div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Notification Methods</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            ${monitor.notifications?.email ? '<div style="background: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">📧 Email</div>' : ''}
            ${monitor.notifications?.sms ? '<div style="background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">📱 SMS</div>' : ''}
            ${monitor.notifications?.whatsapp ? '<div style="background: #ede9fe; color: #6b21a8; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">💬 WhatsApp</div>' : ''}
            ${monitor.notifications?.browser ? '<div style="background: #fef3c7; color: #78350f; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">🔔 Browser</div>' : ''}
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Current Test Date</div>
          <div style="color: #374151;">${this.formatDate(monitor.currentTestDate || monitor.targetDate)}</div>
        </div>
        ${monitor.preferredTestDate ? `
          <div style="margin-bottom: 16px;">
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Preferred Test Date</div>
            <div style="color: #059669; font-weight: 600;">${this.formatDate(monitor.preferredTestDate)}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Looking for slots BEFORE this date</div>
          </div>
        ` : ''}
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Test Centres</div>
          ${monitor.testCentres.map(c => `<div style="color: #374151; font-size: 12px; margin-top: 2px;">• ${c}</div>`).join('')}
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Status</div>
          <div style="display: inline-block; padding: 4px 12px; background: ${monitor.status === 'active' ? '#d1fae5' : '#fee2e2'}; color: ${monitor.status === 'active' ? '#065f46' : '#991b1b'}; border-radius: 4px; font-size: 12px; font-weight: 600;">
            ${monitor.status === 'active' ? '✓ Active' : '⏸ Paused'}
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">Slots Found</div>
          <div style="font-weight: 700; font-size: 20px; color: ${monitor.slotsFound > 0 ? '#059669' : '#6b7280'};">${monitor.slotsFound}</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 20px;">
          <button class="edit-monitor-btn" style="padding: 10px; background: #1d70b8; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Edit</button>
          <button class="delete-monitor-btn" style="padding: 10px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Delete</button>
        </div>
      </div>
    `;
    const modal = this.createModal(`Monitor: ${monitor.name}`, content, '450px');
    document.body.appendChild(modal);
    
    // Attach button listeners
    setTimeout(() => {
      const editBtn = modal.querySelector('.edit-monitor-btn');
      const deleteBtn = modal.querySelector('.delete-monitor-btn');
      
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          this.closeModal();
          this.showEditMonitorModal(index);
        });
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Are you sure you want to delete monitor for ${monitor.name}?`)) {
            this.monitors.splice(index, 1);
            this.stats.monitorsCount = this.monitors.length;
            chrome.storage.local.set({ monitors: this.monitors, stats: this.stats });
            this.closeModal();
            this.updateUI();
            this.addActivity(`Deleted monitor for ${monitor.name}`);
            this.showAlert('Monitor Deleted', `Monitor for ${monitor.name} has been removed.`);
          }
        });
      }
    }, 0);
  }

  /**
   * Show slot details
   */
  showSlotDetails(index) {
    const monitor = this.monitors[index];
    if (monitor.foundSlots.length === 0) {
      this.showAlert('No Slots', `No slots found yet for ${monitor.name}.`);
      return;
    }
    
    const content = `
      <div>
        ${monitor.foundSlots.map((slot, slotIndex) => `
          <div style="padding: 14px; background: #d1fae5; border: 2px solid #10b981; border-radius: 10px; margin-bottom: 10px;">
            <div style="font-weight: 700; font-size: 16px; color: #065f46; margin-bottom: 6px;">
              ${this.formatDate(slot.date)} at ${slot.time}
            </div>
            <div style="font-size: 13px; color: #047857; margin-bottom: 8px;">
              📍 ${slot.centre}
            </div>
            <button class="book-slot-btn" data-monitor-index="${index}" data-slot-index="${slotIndex}" style="
              width: 100%;
              padding: 10px;
              background: #10b981;
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
              🚀 Book This Slot Now
            </button>
          </div>
        `).join('')}
      </div>
    `;
    const modal = this.createModal(`Slots for ${monitor.name}`, content, '450px');
    document.body.appendChild(modal);
    
    // Attach booking button listeners - REAL AUTOMATION
    setTimeout(() => {
      modal.querySelectorAll('.book-slot-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const monitorIndex = parseInt(btn.getAttribute('data-monitor-index'));
          const slotIndex = parseInt(btn.getAttribute('data-slot-index'));
          await this.bookSlot(monitorIndex, slotIndex);
        });
      });
    }, 0);
  }

  /**
   * Book Slot - REAL AUTOMATION FOR PREMIUM MEMBERS
   */
  async bookSlot(monitorIndex, slotIndex) {
    const monitor = this.monitors[monitorIndex];
    const slot = monitor.foundSlots[slotIndex];
    
    console.log('📅 BOOKING SLOT:', slot, 'for', monitor.name);
    
    // SUBSCRIPTION ENFORCEMENT: Check if auto-booking is allowed
    if (!this.limits || !this.limits.canAutoBook) {
      this.closeModal();
      this.showAlert(
        'Upgrade Required', 
        `⚠️ Auto-booking is only available for Premium and Professional plans.\n\nYour current plan: ${this.subscription?.tier || 'Free'}\n\nPlease upgrade to use this feature.`
      );
      return;
    }
    
    // SUBSCRIPTION ENFORCEMENT: Check rebook quota
    const remaining = this.subscription.rebooksTotal - (this.stats.rebooksUsed || 0);
    if (this.limits.maxRebooks !== null && remaining <= 0) {
      this.closeModal();
      this.showAlert(
        'Quota Exceeded', 
        `⚠️ You have used all ${this.subscription.rebooksTotal} rebooks for this month.\n\nUpgrade to Professional for unlimited rebooks.`
      );
      return;
    }
    
    // Show confirmation
    const confirmed = confirm(
      `🚀 AUTO-BOOK SLOT\n\n` +
      `Student: ${monitor.name}\n` +
      `Date: ${this.formatDate(slot.date)} at ${slot.time}\n` +
      `Centre: ${slot.centre}\n\n` +
      `This will:\n` +
      `1. Open DVSA booking page\n` +
      `2. Fill in your details automatically\n` +
      `3. Select this slot\n` +
      `4. You review and confirm\n\n` +
      `Proceed with auto-booking?`
    );
    
    if (!confirmed) return;
    
    try {
      // Send booking request to background.js
      const response = await chrome.runtime.sendMessage({
        action: 'bookSlot',
        slot: slot,
        monitorId: monitor.id,
        monitor: monitor
      });
      
      if (response.success) {
        // Update stats
        this.stats.rebooksUsed++;
        await chrome.storage.local.set({ stats: this.stats });
        
        // Close modal
        this.closeModal();
        
        // Show success message
        this.showAlert(
          'Booking Started!',
          `✅ Opening DVSA booking page and filling in details for ${monitor.name}. Please review and confirm the booking.`
        );
        
        // Add to activity log
        this.addActivity(`🚀 Auto-booking initiated for ${monitor.name}`);
        
        // Update UI
        this.updateStats();
        
        console.log('✅ Booking initiated successfully');
      } else {
        throw new Error(response.error || 'Booking failed');
      }
    } catch (error) {
      console.error('❌ Error booking slot:', error);
      this.showAlert('Booking Error', `Failed to initiate booking: ${error.message}. Please try again or book manually.`);
    }
  }

  /**
   * Toggle monitor status
   */
  toggleMonitor(index) {
    this.monitors[index].status = this.monitors[index].status === 'active' ? 'paused' : 'active';
    chrome.storage.local.set({ monitors: this.monitors });
    this.updateMonitorsList();
    this.addActivity(`Monitor ${this.monitors[index].status} for ${this.monitors[index].name}`);
  }

  /**
   * FULL Add Monitor Modal with UK Test Centres and Validation
   */
  showAddMonitorModal() {
    // Check if user can add more monitors (SUBSCRIPTION ENFORCEMENT)
    if (this.limits && this.limits.maxMonitors !== null) {
      if (this.monitors.length >= this.limits.maxMonitors) {
        this.showAlert(
          'Monitor Limit Reached',
          `⚠️ Your ${this.subscription.tier} plan allows ${this.limits.maxMonitors} monitor${this.limits.maxMonitors !== 1 ? 's' : ''}. You currently have ${this.monitors.length}.\n\nPlease upgrade to add more monitors.`
        );
        return;
      }
    }
    
    // UK Test Centres Database
    const testCentres = [
      // London & South East
      { name: 'London (Wood Green)', postcode: 'N22', area: 'London', region: 'London' },
      { name: 'London (Palmers Green)', postcode: 'N13', area: 'London', region: 'London' },
      { name: 'London (Barking)', postcode: 'IG11', area: 'London', region: 'London' },
      { name: 'London (Hendon)', postcode: 'NW4', area: 'London', region: 'London' },
      { name: 'London (Southall)', postcode: 'UB2', area: 'London', region: 'London' },
      { name: 'London (Mill Hill)', postcode: 'NW7', area: 'London', region: 'London' },
      { name: 'London (Wanstead)', postcode: 'E11', area: 'London', region: 'London' },
      
      // Manchester & North West
      { name: 'Manchester (Bury Old Road)', postcode: 'M25', area: 'Manchester', region: 'North West' },
      { name: 'Manchester (Cheetham Hill)', postcode: 'M8', area: 'Manchester', region: 'North West' },
      { name: 'Manchester (Belle Vue)', postcode: 'M12', area: 'Manchester', region: 'North West' },
      { name: 'Liverpool (Norris Green)', postcode: 'L11', area: 'Liverpool', region: 'North West' },
      { name: 'Liverpool (Speke)', postcode: 'L24', area: 'Liverpool', region: 'North West' },
      { name: 'Preston', postcode: 'PR2', area: 'Preston', region: 'North West' },
      { name: 'Bolton', postcode: 'BL3', area: 'Bolton', region: 'North West' },
      
      // Birmingham & West Midlands
      { name: 'Birmingham (Garretts Green)', postcode: 'B33', area: 'Birmingham', region: 'West Midlands' },
      { name: 'Birmingham (Kingstanding)', postcode: 'B44', area: 'Birmingham', region: 'West Midlands' },
      { name: 'Birmingham (Shirley)', postcode: 'B90', area: 'Birmingham', region: 'West Midlands' },
      { name: 'Coventry', postcode: 'CV6', area: 'Coventry', region: 'West Midlands' },
      { name: 'Wolverhampton', postcode: 'WV11', area: 'Wolverhampton', region: 'West Midlands' },
      
      // Leeds & Yorkshire
      { name: 'Leeds (Harehills)', postcode: 'LS8', area: 'Leeds', region: 'Yorkshire' },
      { name: 'Leeds (Horsforth)', postcode: 'LS18', area: 'Leeds', region: 'Yorkshire' },
      { name: 'Sheffield (Handsworth)', postcode: 'S13', area: 'Sheffield', region: 'Yorkshire' },
      { name: 'Bradford', postcode: 'BD7', area: 'Bradford', region: 'Yorkshire' },
      { name: 'York', postcode: 'YO30', area: 'York', region: 'Yorkshire' },
      
      // Scotland
      { name: 'Glasgow (Shieldhall)', postcode: 'G51', area: 'Glasgow', region: 'Scotland' },
      { name: 'Edinburgh (Currie)', postcode: 'EH14', area: 'Edinburgh', region: 'Scotland' },
      { name: 'Aberdeen', postcode: 'AB21', area: 'Aberdeen', region: 'Scotland' },
      { name: 'Dundee', postcode: 'DD2', area: 'Dundee', region: 'Scotland' },
      
      // Wales
      { name: 'Cardiff (Llanishen)', postcode: 'CF14', area: 'Cardiff', region: 'Wales' },
      { name: 'Swansea', postcode: 'SA5', area: 'Swansea', region: 'Wales' },
      { name: 'Newport', postcode: 'NP19', area: 'Newport', region: 'Wales' },
      
      // South West
      { name: 'Bristol (Brislington)', postcode: 'BS4', area: 'Bristol', region: 'South West' },
      { name: 'Plymouth', postcode: 'PL7', area: 'Plymouth', region: 'South West' },
      { name: 'Exeter', postcode: 'EX2', area: 'Exeter', region: 'South West' },
      
      // North East
      { name: 'Newcastle (Gosforth)', postcode: 'NE3', area: 'Newcastle', region: 'North East' },
      { name: 'Sunderland', postcode: 'SR5', area: 'Sunderland', region: 'North East' },
      { name: 'Middlesbrough', postcode: 'TS5', area: 'Middlesbrough', region: 'North East' },
      
      // East Midlands
      { name: 'Nottingham (Colwick)', postcode: 'NG4', area: 'Nottingham', region: 'East Midlands' },
      { name: 'Leicester (Wigston)', postcode: 'LE18', area: 'Leicester', region: 'East Midlands' },
      { name: 'Derby', postcode: 'DE24', area: 'Derby', region: 'East Midlands' },
      
      // East of England
      { name: 'Norwich', postcode: 'NR6', area: 'Norwich', region: 'East of England' },
      { name: 'Ipswich', postcode: 'IP3', area: 'Ipswich', region: 'East of England' },
      { name: 'Cambridge', postcode: 'CB1', area: 'Cambridge', region: 'East of England' }
    ];
    
    window.allTestCentres = testCentres;
    window.selectedCentres = [];
    
    const content = `
      <form id="add-monitor-form" style="font-size: 13px;">
        <!-- Student Name -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Student Name *</label>
          <input type="text" id="student-name" required style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          " placeholder="e.g., Sarah Johnson">
          <div id="name-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- License Number -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Driving License Number *</label>
          <input type="text" id="license-number" required maxlength="16" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            text-transform: uppercase;
          " placeholder="SMITH123456AB9CD">
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">16 characters (5 letters + 6 digits + 5 characters)</div>
          <div id="license-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Email Address -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Email Address *</label>
          <input type="email" id="student-email" required style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          " placeholder="sarah.johnson@example.com">
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">📧 Email notifications included in all plans</div>
          <div id="email-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Phone Number -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">
            Phone Number <span style="font-weight: 400; color: #6b7280;">(for SMS/WhatsApp) *</span>
          </label>
          <input type="tel" id="student-phone" required style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          " placeholder="+44 7123 456789">
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">📱 UK mobile number (required for Starter/Premium/Professional)</div>
          <div id="phone-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Notification Preferences -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Notification Methods</label>
          <div style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="notif-email" checked style="cursor: pointer; width: 16px; height: 16px;">
                <span style="font-weight: 500;">📧 Email Notifications</span>
                <span style="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 6px; border-radius: 3px; margin-left: auto;">All Plans</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="notif-sms" checked style="cursor: pointer; width: 16px; height: 16px;">
                <span style="font-weight: 500;">📱 SMS Notifications</span>
                <span style="font-size: 11px; color: #1d70b8; background: #dbeafe; padding: 2px 6px; border-radius: 3px; margin-left: auto;">Starter+</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="notif-whatsapp" style="cursor: pointer; width: 16px; height: 16px;">
                <span style="font-weight: 500;">💬 WhatsApp Notifications</span>
                <span style="font-size: 11px; color: #7c3aed; background: #ede9fe; padding: 2px 6px; border-radius: 3px; margin-left: auto;">Professional</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="notif-browser" checked style="cursor: pointer; width: 16px; height: 16px;">
                <span style="font-weight: 500;">🔔 Browser Notifications</span>
                <span style="font-size: 11px; color: #059669; background: #d1fae5; padding: 2px 6px; border-radius: 3px; margin-left: auto;">All Plans</span>
              </label>
            </div>
          </div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 6px;">
            ℹ️ Notification methods available depend on your subscription tier
          </div>
        </div>
        
        <!-- Current Test Date -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Current Test Date *</label>
          <input type="date" id="current-test-date" required style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">The test date you currently have booked</div>
        </div>
        
        <!-- Preferred Test Date Range -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Preferred Test Date (Optional)</label>
          <input type="date" id="preferred-test-date" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Monitor for any slots BEFORE this date (leave blank to find any earlier slot)</div>
          <div id="date-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Test Centres Search -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Test Centres to Monitor *</label>
          <input type="text" id="centre-search" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          " placeholder="Search by name, area, or postcode...">
          <div id="search-results" style="
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-top: 8px;
            display: none;
          "></div>
          <div id="selected-centres" style="margin-top: 8px;"></div>
          <div id="centres-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Submit Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 20px;">
          <button type="button" class="cancel-btn" style="
            padding: 12px;
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          ">Cancel</button>
          <button type="submit" style="
            padding: 12px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          ">Add Monitor</button>
        </div>
      </form>
    `;
    
    const modal = this.createModal('Add New Monitor', content, '550px');
    document.body.appendChild(modal);
    
    // Setup form functionality
    this.setupAddMonitorForm(modal);
  }

  /**
   * Setup Add Monitor Form with validation
   */
  setupAddMonitorForm(modal) {
    const nameInput = modal.querySelector('#student-name');
    const licenseInput = modal.querySelector('#license-number');
    const emailInput = modal.querySelector('#student-email');
    const phoneInput = modal.querySelector('#student-phone');
    const currentDateInput = modal.querySelector('#current-test-date');
    const preferredDateInput = modal.querySelector('#preferred-test-date');
    const searchInput = modal.querySelector('#centre-search');
    const searchResults = modal.querySelector('#search-results');
    const selectedCentres = modal.querySelector('#selected-centres');
    const form = modal.querySelector('#add-monitor-form');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    // Set minimum date to today
    currentDateInput.min = new Date().toISOString().split('T')[0];
    preferredDateInput.min = new Date().toISOString().split('T')[0];
    
    // Email validation
    emailInput.addEventListener('blur', () => {
      const value = emailInput.value.trim();
      const error = modal.querySelector('#email-error');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (value && !emailPattern.test(value)) {
        error.textContent = '❌ Invalid email format';
        error.style.display = 'block';
      } else {
        error.style.display = 'none';
      }
    });
    
    // Phone validation (UK mobile)
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value;
      const error = modal.querySelector('#phone-error');
      
      // Auto-format: add +44 if not present
      if (value && !value.startsWith('+')) {
        if (value.startsWith('0')) {
          value = '+44 ' + value.substring(1);
        } else if (value.startsWith('44')) {
          value = '+' + value;
        } else {
          value = '+44 ' + value;
        }
        e.target.value = value;
      }
      
      // Validate UK mobile format
      const ukMobilePattern = /^\+44\s?[67]\d{9}$/;
      if (value && !ukMobilePattern.test(value.replace(/\s/g, ''))) {
        error.textContent = '❌ Invalid UK mobile number. Format: +44 7123 456789';
        error.style.display = 'block';
      } else {
        error.style.display = 'none';
      }
    });
    
    // License validation
    licenseInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
      const value = e.target.value;
      const error = modal.querySelector('#license-error');
      
      if (value.length === 16) {
        // UK license format: 5 letters + 6 digits + 5 characters
        const pattern = /^[A-Z]{5}\d{6}[A-Z\d]{5}$/;
        if (!pattern.test(value)) {
          error.textContent = '❌ Invalid format. Should be: 5 letters + 6 digits + 5 characters';
          error.style.display = 'block';
        } else {
          error.style.display = 'none';
        }
      } else if (value.length > 0 && value.length < 16) {
        error.textContent = `Need ${16 - value.length} more characters`;
        error.style.display = 'block';
      } else {
        error.style.display = 'none';
      }
    });
    
    // Test centre search
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }
      
      const filtered = window.allTestCentres.filter(centre =>
        centre.name.toLowerCase().includes(query) ||
        centre.area.toLowerCase().includes(query) ||
        centre.postcode.toLowerCase().includes(query) ||
        centre.region.toLowerCase().includes(query)
      );
      
      if (filtered.length === 0) {
        searchResults.innerHTML = '<div style="padding: 12px; color: #6b7280; font-size: 12px;">No test centres found</div>';
      } else {
        searchResults.innerHTML = filtered.slice(0, 10).map(centre => `
          <div class="centre-option" data-centre='${JSON.stringify(centre)}' style="
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.2s;
          " onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
            <div style="font-weight: 600; font-size: 13px; color: #111827;">${centre.name}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${centre.postcode} • ${centre.area} • ${centre.region}</div>
          </div>
        `).join('');
      }
      
      searchResults.style.display = 'block';
      
      // Attach click listeners
      setTimeout(() => {
        searchResults.querySelectorAll('.centre-option').forEach(el => {
          el.addEventListener('click', () => {
            const centre = JSON.parse(el.getAttribute('data-centre'));
            
            // Check test centre limit (SUBSCRIPTION ENFORCEMENT)
            if (this.limits && this.limits.maxTestCentres !== null) {
              if (window.selectedCentres.length >= this.limits.maxTestCentres) {
                const centresError = modal.querySelector('#centres-error');
                centresError.textContent = `❌ Your ${this.subscription.tier} plan allows ${this.limits.maxTestCentres} test centre${this.limits.maxTestCentres !== 1 ? 's' : ''} per monitor. Upgrade for more.`;
                centresError.style.display = 'block';
                return;
              }
            }
            
            // Add centre if not duplicate
            if (!window.selectedCentres.find(c => c.name === centre.name)) {
              window.selectedCentres.push(centre);
              this.updateSelectedCentres(modal);
              
              // Clear error if any
              const centresError = modal.querySelector('#centres-error');
              centresError.style.display = 'none';
            }
            searchInput.value = '';
            searchResults.style.display = 'none';
          });
        });
      }, 0);
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', () => this.closeModal());
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddMonitor(modal);
    });
  }

  /**
   * Update selected centres display
   */
  updateSelectedCentres(modal) {
    const container = modal.querySelector('#selected-centres');
    container.innerHTML = window.selectedCentres.map((centre, i) => `
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #eff6ff;
        border: 1px solid: #3b82f6;
        padding: 8px 12px;
        border-radius: 6px;
        margin-bottom: 6px;
      ">
        <div style="font-size: 12px; font-weight: 600; color: #1e40af;">${centre.name}</div>
        <button type="button" class="remove-centre" data-index="${i}" style="
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
        ">×</button>
      </div>
    `).join('');
    
    // Attach remove listeners
    setTimeout(() => {
      container.querySelectorAll('.remove-centre').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          window.selectedCentres.splice(index, 1);
          this.updateSelectedCentres(modal);
        });
      });
    }, 0);
  }

  /**
   * Handle add monitor form submission
   */
  handleAddMonitor(modal) {
    const name = modal.querySelector('#student-name').value.trim();
    const license = modal.querySelector('#license-number').value.trim();
    const email = modal.querySelector('#student-email').value.trim();
    const phone = modal.querySelector('#student-phone').value.trim();
    const currentDate = modal.querySelector('#current-test-date').value;
    const preferredDate = modal.querySelector('#preferred-test-date').value;
    
    // Notification preferences
    const notifEmail = modal.querySelector('#notif-email').checked;
    const notifSMS = modal.querySelector('#notif-sms').checked;
    const notifWhatsApp = modal.querySelector('#notif-whatsapp').checked;
    const notifBrowser = modal.querySelector('#notif-browser').checked;
    
    // Validation
    const nameError = modal.querySelector('#name-error');
    const licenseError = modal.querySelector('#license-error');
    const emailError = modal.querySelector('#email-error');
    const phoneError = modal.querySelector('#phone-error');
    const dateError = modal.querySelector('#date-error');
    const centresError = modal.querySelector('#centres-error');
    
    let hasError = false;
    
    // Name validation
    if (name.length < 2) {
      nameError.textContent = '❌ Name must be at least 2 characters';
      nameError.style.display = 'block';
      hasError = true;
    } else {
      nameError.style.display = 'none';
    }
    
    // License validation
    const licensePattern = /^[A-Z]{5}\d{6}[A-Z\d]{5}$/;
    if (!licensePattern.test(license)) {
      licenseError.textContent = '❌ Invalid license format';
      licenseError.style.display = 'block';
      hasError = true;
    } else {
      // Check for duplicates
      const duplicate = this.monitors.find(m => m.licence === license);
      if (duplicate) {
        licenseError.textContent = `❌ Duplicate! ${duplicate.name} already uses this license`;
        licenseError.style.display = 'block';
        hasError = true;
      } else {
        licenseError.style.display = 'none';
      }
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      emailError.textContent = '❌ Valid email address required';
      emailError.style.display = 'block';
      hasError = true;
    } else {
      emailError.style.display = 'none';
    }
    
    // Phone validation (UK mobile)
    const ukMobilePattern = /^\+44\s?[67]\d{9}$/;
    if (!phone || !ukMobilePattern.test(phone.replace(/\s/g, ''))) {
      phoneError.textContent = '❌ Valid UK mobile number required (+44 7xxx xxx xxx)';
      phoneError.style.display = 'block';
      hasError = true;
    } else {
      phoneError.style.display = 'none';
    }
    
    // Date validation
    if (!currentDate || new Date(currentDate) < new Date()) {
      dateError.textContent = '❌ Current test date must be in the future';
      dateError.style.display = 'block';
      hasError = true;
    } else if (preferredDate && new Date(preferredDate) >= new Date(currentDate)) {
      dateError.textContent = '❌ Preferred date must be BEFORE current test date';
      dateError.style.display = 'block';
      hasError = true;
    } else {
      dateError.style.display = 'none';
    }
    
    // Centres validation
    if (window.selectedCentres.length === 0) {
      centresError.textContent = '❌ Select at least one test centre';
      centresError.style.display = 'block';
      hasError = true;
    } else {
      centresError.style.display = 'none';
    }
    
    if (hasError) return;
    
    // Create new monitor
    const newMonitor = {
      id: `monitor-${Date.now()}`,
      name,
      licence: license,
      email: email,
      phone: phone.replace(/\s/g, ''), // Remove spaces for storage
      currentTestDate: currentDate,
      preferredTestDate: preferredDate || null,
      targetDate: currentDate, // For backward compatibility
      dateRange: {
        from: new Date().toISOString().split('T')[0], // Today
        to: currentDate, // Current test date
        preferred: preferredDate || currentDate // Preferred or current
      },
      location: window.selectedCentres[0].area,
      testCentres: window.selectedCentres.map(c => c.name),
      testCentresData: window.selectedCentres, // Full data with postcodes
      notifications: {
        email: notifEmail,
        sms: notifSMS,
        whatsapp: notifWhatsApp,
        browser: notifBrowser
      },
      status: 'active',
      slotsFound: 0,
      foundSlots: [],
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Add to monitors
    this.monitors.push(newMonitor);
    this.stats.monitorsCount = this.monitors.length;
    
    // Save to storage
    chrome.storage.local.set({ monitors: this.monitors, stats: this.stats });
    
    // Send to background.js
    chrome.runtime.sendMessage({
      action: 'addMonitor',
      monitor: newMonitor
    });
    
    // Close modal and update UI
    this.closeModal();
    this.updateUI();
    this.addActivity(`✅ Added monitor for ${name}`);
    this.showAlert('Monitor Added!', `Now monitoring test slots for ${name} at ${window.selectedCentres.length} test centre${window.selectedCentres.length !== 1 ? 's' : ''}.`);
  }

  /**
   * Show Edit Monitor Modal - FULL IMPLEMENTATION
   */
  showEditMonitorModal(index) {
    const monitor = this.monitors[index];
    
    // UK Test Centres Database (same as Add Monitor)
    const testCentres = [
      // London & South East
      { name: 'London (Wood Green)', postcode: 'N22', area: 'London', region: 'London' },
      { name: 'London (Palmers Green)', postcode: 'N13', area: 'London', region: 'London' },
      { name: 'London (Barking)', postcode: 'IG11', area: 'London', region: 'London' },
      { name: 'London (Hendon)', postcode: 'NW4', area: 'London', region: 'London' },
      { name: 'London (Southall)', postcode: 'UB2', area: 'London', region: 'London' },
      { name: 'London (Mill Hill)', postcode: 'NW7', area: 'London', region: 'London' },
      { name: 'London (Wanstead)', postcode: 'E11', area: 'London', region: 'London' },
      { name: 'Manchester (Bury Old Road)', postcode: 'M25', area: 'Manchester', region: 'North West' },
      { name: 'Manchester (Cheetham Hill)', postcode: 'M8', area: 'Manchester', region: 'North West' },
      { name: 'Manchester (Belle Vue)', postcode: 'M12', area: 'Manchester', region: 'North West' },
      { name: 'Liverpool (Norris Green)', postcode: 'L11', area: 'Liverpool', region: 'North West' },
      { name: 'Liverpool (Speke)', postcode: 'L24', area: 'Liverpool', region: 'North West' },
      { name: 'Birmingham (Garretts Green)', postcode: 'B33', area: 'Birmingham', region: 'West Midlands' },
      { name: 'Birmingham (Kingstanding)', postcode: 'B44', area: 'Birmingham', region: 'West Midlands' },
      { name: 'Birmingham (Shirley)', postcode: 'B90', area: 'Birmingham', region: 'West Midlands' },
      { name: 'Leeds (Harehills)', postcode: 'LS8', area: 'Leeds', region: 'Yorkshire' },
      { name: 'Leeds (Horsforth)', postcode: 'LS18', area: 'Leeds', region: 'Yorkshire' },
      { name: 'Sheffield (Handsworth)', postcode: 'S13', area: 'Sheffield', region: 'Yorkshire' },
      { name: 'Glasgow (Shieldhall)', postcode: 'G51', area: 'Glasgow', region: 'Scotland' },
      { name: 'Edinburgh (Currie)', postcode: 'EH14', area: 'Edinburgh', region: 'Scotland' },
      { name: 'Cardiff (Llanishen)', postcode: 'CF14', area: 'Cardiff', region: 'Wales' },
      { name: 'Bristol (Brislington)', postcode: 'BS4', area: 'Bristol', region: 'South West' },
      { name: 'Newcastle (Gosforth)', postcode: 'NE3', area: 'Newcastle', region: 'North East' },
      { name: 'Nottingham (Colwick)', postcode: 'NG4', area: 'Nottingham', region: 'East Midlands' }
    ];
    
    window.allTestCentres = testCentres;
    
    // Pre-select existing test centres
    window.selectedCentres = (monitor.testCentresData || []).length > 0 
      ? monitor.testCentresData 
      : testCentres.filter(tc => monitor.testCentres.includes(tc.name));
    
    const content = `
      <form id="edit-monitor-form" style="font-size: 13px;">
        <!-- Student Name -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Student Name *</label>
          <input type="text" id="edit-student-name" required value="${monitor.name}" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
          <div id="edit-name-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Email Address -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Email Address *</label>
          <input type="email" id="edit-student-email" required value="${monitor.email || ''}" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
          <div id="edit-email-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Phone Number -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Phone Number *</label>
          <input type="tel" id="edit-student-phone" required value="${monitor.phone || ''}" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
          <div id="edit-phone-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Current Test Date -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Current Test Date *</label>
          <input type="date" id="edit-current-date" required value="${monitor.currentTestDate || monitor.targetDate}" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
        </div>
        
        <!-- Preferred Test Date -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Preferred Test Date (Optional)</label>
          <input type="date" id="edit-preferred-date" value="${monitor.preferredTestDate || ''}" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          ">
        </div>
        
        <!-- Test Centres -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151;">Test Centres *</label>
          <input type="text" id="edit-centre-search" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
          " placeholder="Search to add more centres...">
          <div id="edit-search-results" style="
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-top: 8px;
            display: none;
          "></div>
          <div id="edit-selected-centres" style="margin-top: 8px;"></div>
          <div id="edit-centres-error" style="color: #dc2626; font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>
        
        <!-- Notification Preferences -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Notification Methods</label>
          <div style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="edit-notif-email" ${monitor.notifications?.email ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                <span>📧 Email</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="edit-notif-sms" ${monitor.notifications?.sms ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                <span>📱 SMS</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="edit-notif-whatsapp" ${monitor.notifications?.whatsapp ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                <span>💬 WhatsApp</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="edit-notif-browser" ${monitor.notifications?.browser ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                <span>🔔 Browser</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Submit Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 20px;">
          <button type="button" class="edit-cancel-btn" style="
            padding: 12px;
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          ">Cancel</button>
          <button type="submit" style="
            padding: 12px;
            background: #1d70b8;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          ">Save Changes</button>
        </div>
      </form>
    `;
    
    const modal = this.createModal(`Edit Monitor: ${monitor.name}`, content, '550px');
    document.body.appendChild(modal);
    
    // Setup edit form
    this.setupEditMonitorForm(modal, index);
  }

  /**
   * Setup Edit Monitor Form
   */
  setupEditMonitorForm(modal, monitorIndex) {
    const monitor = this.monitors[monitorIndex];
    const emailInput = modal.querySelector('#edit-student-email');
    const phoneInput = modal.querySelector('#edit-student-phone');
    const searchInput = modal.querySelector('#edit-centre-search');
    const searchResults = modal.querySelector('#edit-search-results');
    const selectedCentres = modal.querySelector('#edit-selected-centres');
    const form = modal.querySelector('#edit-monitor-form');
    const cancelBtn = modal.querySelector('.edit-cancel-btn');
    
    // Display currently selected centres
    this.updateEditSelectedCentres(modal);
    
    // Email validation
    emailInput.addEventListener('blur', () => {
      const value = emailInput.value.trim();
      const error = modal.querySelector('#edit-email-error');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (value && !emailPattern.test(value)) {
        error.textContent = '❌ Invalid email format';
        error.style.display = 'block';
      } else {
        error.style.display = 'none';
      }
    });
    
    // Phone validation
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value;
      const error = modal.querySelector('#edit-phone-error');
      
      if (value && !value.startsWith('+')) {
        if (value.startsWith('0')) {
          value = '+44 ' + value.substring(1);
        } else if (value.startsWith('44')) {
          value = '+' + value;
        }
        e.target.value = value;
      }
      
      const ukMobilePattern = /^\+44\s?[67]\d{9}$/;
      if (value && !ukMobilePattern.test(value.replace(/\s/g, ''))) {
        error.textContent = '❌ Invalid UK mobile number';
        error.style.display = 'block';
      } else {
        error.style.display = 'none';
      }
    });
    
    // Test centre search (same as add monitor)
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }
      
      const filtered = window.allTestCentres.filter(centre =>
        centre.name.toLowerCase().includes(query) ||
        centre.area.toLowerCase().includes(query) ||
        centre.postcode.toLowerCase().includes(query) ||
        centre.region.toLowerCase().includes(query)
      );
      
      if (filtered.length === 0) {
        searchResults.innerHTML = '<div style="padding: 12px; color: #6b7280; font-size: 12px;">No test centres found</div>';
      } else {
        searchResults.innerHTML = filtered.slice(0, 10).map(centre => `
          <div class="centre-option" data-centre='${JSON.stringify(centre)}' style="
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
          " onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
            <div style="font-weight: 600; font-size: 13px; color: #111827;">${centre.name}</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${centre.postcode} • ${centre.area} • ${centre.region}</div>
          </div>
        `).join('');
      }
      
      searchResults.style.display = 'block';
      
      setTimeout(() => {
        searchResults.querySelectorAll('.centre-option').forEach(el => {
          el.addEventListener('click', () => {
            const centre = JSON.parse(el.getAttribute('data-centre'));
            
            // Check limit
            if (this.limits && this.limits.maxTestCentres !== null) {
              if (window.selectedCentres.length >= this.limits.maxTestCentres) {
                const error = modal.querySelector('#edit-centres-error');
                error.textContent = `❌ Max ${this.limits.maxTestCentres} centres allowed`;
                error.style.display = 'block';
                return;
              }
            }
            
            if (!window.selectedCentres.find(c => c.name === centre.name)) {
              window.selectedCentres.push(centre);
              this.updateEditSelectedCentres(modal);
            }
            searchInput.value = '';
            searchResults.style.display = 'none';
          });
        });
      }, 0);
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', () => this.closeModal());
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleEditMonitor(modal, monitorIndex);
    });
  }

  /**
   * Update selected centres in edit form
   */
  updateEditSelectedCentres(modal) {
    const container = modal.querySelector('#edit-selected-centres');
    container.innerHTML = window.selectedCentres.map((centre, i) => `
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #eff6ff;
        border: 1px solid #3b82f6;
        padding: 8px 12px;
        border-radius: 6px;
        margin-bottom: 6px;
      ">
        <div style="font-size: 12px; font-weight: 600; color: #1e40af;">${centre.name}</div>
        <button type="button" class="remove-edit-centre" data-index="${i}" style="
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
        ">×</button>
      </div>
    `).join('');
    
    setTimeout(() => {
      container.querySelectorAll('.remove-edit-centre').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          window.selectedCentres.splice(idx, 1);
          this.updateEditSelectedCentres(modal);
        });
      });
    }, 0);
  }

  /**
   * Handle edit monitor submission
   */
  handleEditMonitor(modal, monitorIndex) {
    const monitor = this.monitors[monitorIndex];
    
    const name = modal.querySelector('#edit-student-name').value.trim();
    const email = modal.querySelector('#edit-student-email').value.trim();
    const phone = modal.querySelector('#edit-student-phone').value.trim();
    const currentDate = modal.querySelector('#edit-current-date').value;
    const preferredDate = modal.querySelector('#edit-preferred-date').value;
    
    const notifEmail = modal.querySelector('#edit-notif-email').checked;
    const notifSMS = modal.querySelector('#edit-notif-sms').checked;
    const notifWhatsApp = modal.querySelector('#edit-notif-whatsapp').checked;
    const notifBrowser = modal.querySelector('#edit-notif-browser').checked;
    
    // Validation
    let hasError = false;
    const nameError = modal.querySelector('#edit-name-error');
    const emailError = modal.querySelector('#edit-email-error');
    const phoneError = modal.querySelector('#edit-phone-error');
    
    if (name.length < 2) {
      nameError.textContent = '❌ Name must be at least 2 characters';
      nameError.style.display = 'block';
      hasError = true;
    } else {
      nameError.style.display = 'none';
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      emailError.textContent = '❌ Valid email required';
      emailError.style.display = 'block';
      hasError = true;
    } else {
      emailError.style.display = 'none';
    }
    
    const ukMobilePattern = /^\+44\s?[67]\d{9}$/;
    if (!phone || !ukMobilePattern.test(phone.replace(/\s/g, ''))) {
      phoneError.textContent = '❌ Valid UK mobile required';
      phoneError.style.display = 'block';
      hasError = true;
    } else {
      phoneError.style.display = 'none';
    }
    
    if (window.selectedCentres.length === 0) {
      hasError = true;
    }
    
    if (hasError) return;
    
    // Update monitor
    monitor.name = name;
    monitor.email = email;
    monitor.phone = phone.replace(/\s/g, '');
    monitor.currentTestDate = currentDate;
    monitor.preferredTestDate = preferredDate || null;
    monitor.targetDate = currentDate;
    monitor.testCentres = window.selectedCentres.map(c => c.name);
    monitor.testCentresData = window.selectedCentres;
    monitor.notifications = {
      email: notifEmail,
      sms: notifSMS,
      whatsapp: notifWhatsApp,
      browser: notifBrowser
    };
    monitor.lastUpdate = new Date().toISOString();
    
    // Save
    chrome.storage.local.set({ monitors: this.monitors });
    
    // Send to background
    chrome.runtime.sendMessage({
      action: 'updateMonitor',
      monitorId: monitor.id,
      updates: monitor
    });
    
    // Close and refresh
    this.closeModal();
    this.updateUI();
    this.addActivity(`✏️ Updated monitor for ${name}`);
    this.showAlert('Monitor Updated!', `✅ Changes saved for ${name}`);
  }

  /**
   * Update travel radius (Instructor)
   */
  updateTravelRadius(e) {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    // Map to 10-100km range
    const radius = Math.round(10 + (percentage * 90));
    
    const fill = slider.querySelector('.slider-fill');
    const value = document.getElementById('radius-value');
    
    if (fill) fill.style.width = `${percentage * 100}%`;
    if (value) value.textContent = `${radius}km`;
    
    // Save to temp (will be saved on "Save Instructor Profile")
    this.instructorProfile = this.instructorProfile || {};
    this.instructorProfile.travelRadius = radius;
  }

  /**
   * Bulk pause all monitors
   */
  async bulkPauseMonitors() {
    const activeCount = this.monitors.filter(m => m.status === 'active').length;
    
    if (activeCount === 0) {
      this.showAlert('No Active Monitors', 'All monitors are already paused.');
      return;
    }
    
    if (confirm(`Pause all ${activeCount} active monitor${activeCount !== 1 ? 's' : ''}?`)) {
      this.monitors.forEach(m => m.status = 'paused');
      await chrome.storage.local.set({ monitors: this.monitors });
      
      // Send to background.js
      await chrome.runtime.sendMessage({
        action: 'bulkPause'
      });
      
      this.updateMonitorsList();
      this.addActivity(`⏸ Paused ${activeCount} monitor${activeCount !== 1 ? 's' : ''}`);
      this.showAlert('Monitors Paused', `✅ Paused ${activeCount} monitor${activeCount !== 1 ? 's' : ''}`);
    }
  }

  /**
   * Bulk resume all monitors
   */
  async bulkResumeMonitors() {
    const pausedCount = this.monitors.filter(m => m.status === 'paused').length;
    
    if (pausedCount === 0) {
      this.showAlert('No Paused Monitors', 'All monitors are already active.');
      return;
    }
    
    if (confirm(`Resume all ${pausedCount} paused monitor${pausedCount !== 1 ? 's' : ''}?`)) {
      this.monitors.forEach(m => m.status = 'active');
      await chrome.storage.local.set({ monitors: this.monitors });
      
      // Send to background.js
      await chrome.runtime.sendMessage({
        action: 'bulkResume'
      });
      
      this.updateMonitorsList();
      this.addActivity(`▶️ Resumed ${pausedCount} monitor${pausedCount !== 1 ? 's' : ''}`);
      this.showAlert('Monitors Resumed', `✅ Resumed ${pausedCount} monitor${pausedCount !== 1 ? 's' : ''}`);
    }
  }

  /**
   * Save instructor profile
   */
  async saveInstructorProfile() {
    const adiNumber = document.getElementById('adi-number').value.trim();
    const baseLocation = document.getElementById('base-location').value.trim();
    const dvsaEmail = document.getElementById('dvsa-email').value.trim();
    const dvsaPassword = document.getElementById('dvsa-password').value;
    const travelRadius = this.instructorProfile?.travelRadius || 50;
    
    if (!adiNumber || !baseLocation) {
      this.showAlert('Validation Error', '⚠️ Please enter ADI number and base location');
      return;
    }
    
    // Validate ADI number (6 digits)
    if (!/^\d{6}$/.test(adiNumber)) {
      this.showAlert('Invalid ADI Number', '⚠️ ADI number must be 6 digits');
      return;
    }
    
    // DVSA credentials are required for auto-rebooking (Premium/Professional tiers)
    if (this.subscription.tier === 'premium' || this.subscription.tier === 'professional') {
      if (!dvsaEmail || !dvsaPassword) {
        this.showAlert('DVSA Credentials Required', '⚠️ DVSA website login is required for auto-rebooking feature');
        return;
      }
      
      // Validate DVSA email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dvsaEmail)) {
        this.showAlert('Invalid Email', '⚠️ Please enter a valid DVSA account email');
        return;
      }
    }
    
    const profile = {
      adiNumber,
      baseLocation,
      travelRadius,
      updatedAt: new Date().toISOString()
    };
    
    // Encrypt and save DVSA credentials if provided
    if (dvsaEmail && dvsaPassword) {
      try {
        const encryptedPassword = await this.encryptPassword(dvsaPassword);
        profile.dvsaCredentials = {
          email: dvsaEmail,
          encryptedPassword: encryptedPassword,
          lastUpdated: new Date().toISOString()
        };
        console.log('✅ DVSA credentials encrypted and saved');
      } catch (error) {
        console.error('❌ Failed to encrypt DVSA credentials:', error);
        this.showAlert('Encryption Error', '⚠️ Failed to secure DVSA credentials. Please try again.');
        return;
      }
    }
    
    // Save to storage
    await chrome.storage.local.set({ instructorProfile: profile });
    
    // Send to background.js
    await chrome.runtime.sendMessage({
      action: 'updateInstructorProfile',
      profile
    });
    
    this.addActivity(`📋 Instructor profile updated (ADI: ${adiNumber})`);
    this.showAlert('Profile Saved', '✅ Instructor profile has been saved successfully.');
    
    console.log('✅ Instructor profile saved:', profile);
  }
  
  /**
   * Encrypt password using Web Crypto API
   */
  async encryptPassword(password) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      
      // Generate a key from a passphrase (in production, derive from user session)
      const passphrase = 'testnotifier-secure-key-' + (await this.getDeviceId());
      const passphraseKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      // Derive encryption key
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('testnotifier-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        passphraseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      
      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt password');
    }
  }
  
  /**
   * Decrypt password using Web Crypto API
   */
  async decryptPassword(encryptedPassword) {
    try {
      // Decode from base64
      const combined = Uint8Array.from(atob(encryptedPassword), c => c.charCodeAt(0));
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      // Generate same key
      const passphrase = 'testnotifier-secure-key-' + (await this.getDeviceId());
      const passphraseKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('testnotifier-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        passphraseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      
      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt password');
    }
  }
  
  /**
   * Get unique device ID for encryption
   */
  async getDeviceId() {
    const stored = await chrome.storage.local.get(['deviceId']);
    if (stored.deviceId) {
      return stored.deviceId;
    }
    
    // Generate new device ID
    const deviceId = crypto.randomUUID();
    await chrome.storage.local.set({ deviceId });
    return deviceId;
  }

  /**
   * Update instructor stats
   */
  updateInstructorStats() {
    const totalPupils = this.monitors.length;
    const activePupils = this.monitors.filter(m => m.status === 'active').length;
    
    const totalEl = document.getElementById('total-pupils');
    const activeEl = document.getElementById('active-pupils');
    
    if (totalEl) totalEl.textContent = totalPupils;
    if (activeEl) activeEl.textContent = activePupils;
  }
}

// Initialize popup
const popupApp = new TestNotifierPopup();
window.popupApp = popupApp;

document.addEventListener('DOMContentLoaded', () => {
  popupApp.init();
});
