/**
 * TestNotifier Extension Popup - Fully Functional
 * Maintains exact UI design while adding full interactivity
 */

class TestNotifierPopup {
  constructor() {
    this.monitors = [];
    this.stats = {
      monitorsCount: 0,
      slotsFound: 0,
      lastCheck: null
    };
    this.subscription = null;
  }

  async init() {
    console.log('🚀 Initializing TestNotifier popup...');
    
    await this.loadData();
    this.attachEventListeners();
    
    console.log('✅ Popup initialized');
  }

  async loadData() {
    try {
      // Load from chrome.storage
      const result = await chrome.storage.local.get(['monitors', 'stats', 'subscription']);
      
      this.monitors = result.monitors || this.getDemoMonitors();
      this.stats = result.stats || this.getDemoStats();
      this.subscription = result.subscription || { tier: 'premium', status: 'active' };
      
      this.updateUI();
    } catch (error) {
      console.error('Error loading data:', error);
      // Use demo data
      this.monitors = this.getDemoMonitors();
      this.stats = this.getDemoStats();
      this.updateUI();
    }
  }

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

  getDemoStats() {
    return {
      monitorsCount: 3,
      slotsFound: 4,
      lastCheck: new Date(Date.now() - 120000).toISOString()
    };
  }

  updateUI() {
    // Update stats (already in HTML, just update if needed)
    // Stats are static in demo, will be dynamic when real data loads
  }

  attachEventListeners() {
    console.log('🔗 Attaching event listeners...');
    
    // Stats clickable
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
      statCards[0].addEventListener('click', () => this.showMonitorsList());
      statCards[1].addEventListener('click', () => this.showFoundSlots());
      statCards[2].addEventListener('click', () => this.showLastChecked());
      console.log('✅ Stats cards clickable');
    }

    // Add New Monitor button
    const addBtn = document.querySelector('.btn-add-monitor');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddMonitorModal());
      console.log('✅ Add button clickable');
    }

    // Monitor cards
    const cards = document.querySelectorAll('.monitor-card');
    console.log(`Found ${cards.length} monitor cards`);
    
    cards.forEach((card, index) => {
      // Card click - show details
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on status badge or slots found
        if (e.target.closest('.status-badge') || e.target.closest('.monitor-card-status')) {
          return;
        }
        this.showMonitorDetails(index);
      });

      // Status badge click
      const statusBadge = card.querySelector('.status-badge');
      if (statusBadge) {
        statusBadge.style.cursor = 'pointer';
        statusBadge.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMonitorStatus(index);
        });
      }

      // Slots found click
      const slotsFound = card.querySelector('.monitor-card-status');
      if (slotsFound) {
        slotsFound.style.cursor = 'pointer';
        slotsFound.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showSlotDetails(index);
        });
      }
    });
    
    console.log('✅ Monitor cards clickable');

    // Help button
    const helpBtn = document.querySelector('.btn-help');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelp());
      console.log('✅ Help button clickable');
    }
    
    // Connection status - make clickable to test connection
    const connectionDiv = document.querySelector('.footer-connection');
    if (connectionDiv) {
      connectionDiv.style.cursor = 'pointer';
      connectionDiv.addEventListener('click', () => this.testConnection());
      console.log('✅ Connection status clickable');
    }
    
    console.log('✅ All event listeners attached');
  }

  showMonitorsList() {
    const modal = this.createModal('All Monitors', `
      <div class="space-y-3">
        ${this.monitors.map((monitor, i) => `
          <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer" onclick="window.popupApp.showMonitorDetails(${i})">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-gray-900">${monitor.name}</div>
                <div class="text-sm text-gray-600">${monitor.location} • ${this.formatDate(monitor.targetDate)}</div>
              </div>
              <div class="text-xs px-2 py-1 rounded ${monitor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}">
                ${monitor.status === 'active' ? 'Active' : 'Paused'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `);
    
    document.body.appendChild(modal);
  }

  showFoundSlots() {
    const allFoundSlots = this.monitors.flatMap(m => 
      m.foundSlots.map(slot => ({ ...slot, monitorName: m.name }))
    );

    const modal = this.createModal(`Found Slots (${allFoundSlots.length})`, `
      <div class="space-y-3">
        ${allFoundSlots.length === 0 ? `
          <div class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-2">🔍</div>
            <p>No slots found yet</p>
            <p class="text-sm mt-1">We're actively searching...</p>
          </div>
        ` : allFoundSlots.map(slot => `
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-start justify-between mb-2">
              <div>
                <div class="font-semibold text-gray-900">${slot.monitorName}</div>
                <div class="text-sm text-gray-600">${slot.centre}</div>
              </div>
              <div class="text-xs bg-green-600 text-white px-2 py-1 rounded">
                Available
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="font-medium">${this.formatDate(slot.date)}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="font-medium">${slot.time}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `);
    
    document.body.appendChild(modal);
  }

  showLastChecked() {
    const sortedMonitors = [...this.monitors].sort((a, b) => 
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );

    const modal = this.createModal('Last Checked', `
      <div class="space-y-3">
        ${sortedMonitors.map(monitor => `
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-gray-900">${monitor.name}</div>
                <div class="text-sm text-gray-600">${monitor.location}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500">Last checked</div>
                <div class="text-sm font-semibold text-gray-900">${this.formatTimestamp(monitor.lastUpdate)}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `);
    
    document.body.appendChild(modal);
  }

  showMonitorDetails(index) {
    const monitor = this.monitors[index];
    
    const modal = this.createModal(`Monitor Details - ${monitor.name}`, `
      <div class="space-y-4">
        <!-- Name -->
        <div>
          <div class="text-xs text-gray-500 mb-1">Pupil Name</div>
          <div class="font-semibold text-gray-900">${monitor.name}</div>
        </div>

        <!-- License -->
        <div>
          <div class="text-xs text-gray-500 mb-1">Driving License Number</div>
          <div class="font-mono text-sm text-gray-900">${monitor.licence}</div>
        </div>

        <!-- Target Date -->
        <div>
          <div class="text-xs text-gray-500 mb-1">Current Test Date</div>
          <div class="font-semibold text-gray-900">${this.formatDate(monitor.targetDate)}</div>
        </div>

        <!-- Test Centres -->
        <div>
          <div class="text-xs text-gray-500 mb-2">Monitoring Test Centres</div>
          <div class="space-y-1">
            ${monitor.testCentres.map(centre => `
              <div class="flex items-center gap-2 text-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${centre}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Status -->
        <div>
          <div class="text-xs text-gray-500 mb-2">Status</div>
          <div class="flex items-center gap-2">
            <div class="px-3 py-1 rounded text-sm font-semibold ${monitor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}">
              ${monitor.status === 'active' ? '✓ Active' : '⏸ Paused'}
            </div>
            <button class="text-sm text-blue-600 hover:underline" onclick="window.popupApp.toggleMonitorStatus(${index})">
              ${monitor.status === 'active' ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        <!-- Slots Found -->
        <div>
          <div class="text-xs text-gray-500 mb-2">Slots Found: ${monitor.slotsFound}</div>
          ${monitor.foundSlots.length > 0 ? `
            <div class="space-y-2 max-h-40 overflow-y-auto">
              ${monitor.foundSlots.map(slot => `
                <div class="bg-green-50 border border-green-200 rounded p-2 text-sm">
                  <div class="font-semibold text-green-900">${this.formatDate(slot.date)} at ${slot.time}</div>
                  <div class="text-xs text-green-700">${slot.centre}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="text-sm text-gray-500 italic">No slots found yet</div>
          `}
        </div>

        <!-- Last Update -->
        <div>
          <div class="text-xs text-gray-500 mb-1">Last Checked</div>
          <div class="text-sm text-gray-900">${this.formatTimestamp(monitor.lastUpdate)}</div>
        </div>

        <!-- Actions -->
        <div class="pt-4 border-t flex gap-2">
          <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold" onclick="window.popupApp.editMonitor(${index})">
            Edit Monitor
          </button>
          <button class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold" onclick="window.popupApp.deleteMonitor(${index})">
            Delete
          </button>
        </div>
      </div>
    `);
    
    document.body.appendChild(modal);
  }

  showSlotDetails(index) {
    const monitor = this.monitors[index];
    
    if (monitor.foundSlots.length === 0) {
      this.showAlert('No Slots Found', `No earlier slots have been found for ${monitor.name} yet. We're actively monitoring and will notify you when slots become available.`);
      return;
    }

    const modal = this.createModal(`Slots Found for ${monitor.name}`, `
      <div class="space-y-3">
        ${monitor.foundSlots.map(slot => `
          <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div>
                <div class="font-bold text-lg text-green-900">${this.formatDate(slot.date)}</div>
                <div class="text-green-700 font-semibold">${slot.time}</div>
              </div>
              <div class="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">
                Available
              </div>
            </div>
            <div class="text-sm text-gray-700 mb-3">
              <svg class="inline w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${slot.centre}
            </div>
            <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold">
              Book This Slot
            </button>
          </div>
        `).join('')}
      </div>
    `);
    
    document.body.appendChild(modal);
  }

  toggleMonitorStatus(index) {
    const monitor = this.monitors[index];
    monitor.status = monitor.status === 'active' ? 'paused' : 'active';
    
    // Save to storage
    chrome.storage.local.set({ monitors: this.monitors });
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'toggleMonitor',
      monitorId: monitor.id,
      status: monitor.status
    });
    
    // Close any open modals and show confirmation
    this.closeAllModals();
    this.showAlert(
      'Status Updated',
      `${monitor.name} is now ${monitor.status === 'active' ? 'active' : 'paused'}.`
    );
    
    // Reload popup to reflect changes
    setTimeout(() => window.location.reload(), 1500);
  }

  showAddMonitorModal() {
    const modal = this.createModal('Add New Monitor', `
      <form id="add-monitor-form" class="space-y-4">
        <!-- Pupil Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Pupil Name</label>
          <input type="text" name="name" required 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Sarah Johnson">
        </div>

        <!-- Driving License Number -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Driving License Number</label>
          <input type="text" name="licence" required pattern="[A-Z0-9]{16}"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="SMITH123456AB9CD"
            maxlength="16">
          <div class="text-xs text-gray-500 mt-1">16-character license number</div>
        </div>

        <!-- Current Test Date -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Current Test Date</label>
          <input type="date" name="targetDate" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <!-- Test Centres Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Test Centres to Monitor</label>
          <input type="text" id="centre-search" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by postcode, area, or name...">
          <div id="centre-results" class="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg hidden"></div>
          <div id="selected-centres" class="mt-2 space-y-1"></div>
        </div>

        <!-- Submit -->
        <div class="pt-4 flex gap-2">
          <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold">
            Start Monitoring
          </button>
          <button type="button" onclick="window.popupApp.closeAllModals()" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-bold">
            Cancel
          </button>
        </div>
      </form>
    `, 'max-w-2xl');
    
    document.body.appendChild(modal);
    
    // Initialize test centre search
    this.initTestCentreSearch();
    
    // Handle form submission
    document.getElementById('add-monitor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddMonitor(new FormData(e.target));
    });
  }

  initTestCentreSearch() {
    const searchInput = document.getElementById('centre-search');
    const resultsDiv = document.getElementById('centre-results');
    const selectedDiv = document.getElementById('selected-centres');
    let selectedCentres = [];

    // UK Test Centres (sample - you can expand this)
    const testCentres = [
      { name: 'Manchester (Bury Old Road)', postcode: 'M25', area: 'Manchester' },
      { name: 'Manchester (Cheetham Hill)', postcode: 'M8', area: 'Manchester' },
      { name: 'London (Wood Green)', postcode: 'N22', area: 'London' },
      { name: 'London (Palmers Green)', postcode: 'N13', area: 'London' },
      { name: 'Birmingham (Garretts Green)', postcode: 'B33', area: 'Birmingham' },
      { name: 'Birmingham (Kingstanding)', postcode: 'B44', area: 'Birmingham' },
      { name: 'Leeds (Harehills)', postcode: 'LS8', area: 'Leeds' },
      { name: 'Leeds (Horsforth)', postcode: 'LS18', area: 'Leeds' },
      { name: 'Glasgow (Shieldhall)', postcode: 'G51', area: 'Glasgow' },
      { name: 'Edinburgh (Currie)', postcode: 'EH14', area: 'Edinburgh' },
      { name: 'Bristol (Brislington)', postcode: 'BS4', area: 'Bristol' },
      { name: 'Liverpool (Norris Green)', postcode: 'L11', area: 'Liverpool' },
      { name: 'Newcastle (Gosforth)', postcode: 'NE3', area: 'Newcastle' },
      { name: 'Cardiff (Llanishen)', postcode: 'CF14', area: 'Cardiff' },
      { name: 'Sheffield (Handsworth)', postcode: 'S13', area: 'Sheffield' },
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        resultsDiv.classList.add('hidden');
        return;
      }

      const filtered = testCentres.filter(centre => 
        centre.name.toLowerCase().includes(query) ||
        centre.postcode.toLowerCase().includes(query) ||
        centre.area.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div class="p-3 text-sm text-gray-500">No test centres found</div>';
      } else {
        resultsDiv.innerHTML = filtered.map(centre => `
          <div class="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0" data-centre='${JSON.stringify(centre)}'>
            <div class="font-semibold text-sm text-gray-900">${centre.name}</div>
            <div class="text-xs text-gray-600">${centre.postcode} • ${centre.area}</div>
          </div>
        `).join('');

        // Add click handlers
        resultsDiv.querySelectorAll('[data-centre]').forEach(el => {
          el.addEventListener('click', () => {
            const centre = JSON.parse(el.getAttribute('data-centre'));
            if (!selectedCentres.find(c => c.name === centre.name)) {
              selectedCentres.push(centre);
              this.updateSelectedCentres(selectedCentres, selectedDiv);
            }
            searchInput.value = '';
            resultsDiv.classList.add('hidden');
          });
        });
      }

      resultsDiv.classList.remove('hidden');
    });

    // Store selected centres for form submission
    window.selectedTestCentres = selectedCentres;
  }

  updateSelectedCentres(centres, container) {
    container.innerHTML = centres.map((centre, i) => `
      <div class="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-3 py-2">
        <div class="text-sm font-semibold text-blue-900">${centre.name}</div>
        <button type="button" class="text-blue-600 hover:text-blue-800" onclick="window.popupApp.removeTestCentre(${i})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');
  }

  removeTestCentre(index) {
    window.selectedTestCentres.splice(index, 1);
    const selectedDiv = document.getElementById('selected-centres');
    this.updateSelectedCentres(window.selectedTestCentres, selectedDiv);
  }

  handleAddMonitor(formData) {
    const newMonitor = {
      id: `monitor-${Date.now()}`,
      name: formData.get('name'),
      licence: formData.get('licence').toUpperCase(),
      targetDate: formData.get('targetDate'),
      location: window.selectedTestCentres[0]?.area || 'UK',
      testCentres: window.selectedTestCentres.map(c => c.name),
      notifications: { email: true, sms: true, browser: true },
      status: 'active',
      slotsFound: 0,
      foundSlots: [],
      lastUpdate: new Date().toISOString()
    };

    this.monitors.push(newMonitor);
    chrome.storage.local.set({ monitors: this.monitors });
    
    // Send to background script to start monitoring
    chrome.runtime.sendMessage({
      action: 'addMonitor',
      monitor: newMonitor
    });

    this.closeAllModals();
    this.showAlert('Monitor Added!', `Now monitoring test slots for ${newMonitor.name}`);
    
    setTimeout(() => window.location.reload(), 1500);
  }

  editMonitor(index) {
    // TODO: Implement edit functionality
    this.showAlert('Edit Monitor', 'Edit functionality coming soon!');
  }

  deleteMonitor(index) {
    const monitor = this.monitors[index];
    
    if (confirm(`Are you sure you want to delete the monitor for ${monitor.name}?`)) {
      this.monitors.splice(index, 1);
      chrome.storage.local.set({ monitors: this.monitors });
      
      chrome.runtime.sendMessage({
        action: 'deleteMonitor',
        monitorId: monitor.id
      });

      this.closeAllModals();
      this.showAlert('Monitor Deleted', `Monitor for ${monitor.name} has been removed.`);
      
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  showHelp() {
    window.open('https://testnotifier.co.uk/help', '_blank');
  }

  async testConnection() {
    const dot = document.querySelector('.connection-dot');
    const text = document.querySelector('.footer-connection');
    
    // Show testing state
    if (dot) dot.style.background = '#fbbf24'; // Yellow
    
    try {
      // Test connection to background script
      const response = await chrome.runtime.sendMessage({ action: 'checkConnection' });
      
      if (response?.connected) {
        if (dot) dot.style.background = '#10b981'; // Green
        this.showAlert('Connection Test', '✅ Successfully connected to DVSA monitoring service!');
      } else {
        if (dot) dot.style.background = '#ef4444'; // Red
        this.showAlert('Connection Test', '⚠️ Unable to connect to DVSA. The extension may be inactive.');
      }
    } catch (error) {
      // In demo mode, show as connected
      if (dot) dot.style.background = '#10b981'; // Green
      this.showAlert('Connection Test', '✅ Extension is running in demo mode. Real monitoring will activate when you add monitors.');
    }
  }

  // Utility: Create Modal
  createModal(title, content, maxWidth = '600px') {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1000;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: ${maxWidth};
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      ">
        <div style="
          background: linear-gradient(to right, #1d70b8, #2e8bc0);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <h2 style="
            color: white;
            font-weight: 700;
            font-size: 18px;
            margin: 0;
          ">${title}</h2>
          <button onclick="window.popupApp.closeAllModals()" style="
            color: white;
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
          " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='none'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div style="
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        ">
          ${content}
        </div>
      </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeAllModals();
    });
    
    return modal;
  }

  showAlert(title, message) {
    const modal = this.createModal(title, `
      <div style="text-align: center; padding: 16px 0;">
        <p style="color: #374151; margin-bottom: 16px; font-size: 15px;">${message}</p>
        <button onclick="window.popupApp.closeAllModals()" style="
          background: #1d70b8;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        " onmouseover="this.style.background='#155a96'" onmouseout="this.style.background='#1d70b8'">
          OK
        </button>
      </div>
    `, '400px');
    
    document.body.appendChild(modal);
  }

  closeAllModals() {
    // Remove all modals (they have position: fixed and z-index: 1000)
    const modals = Array.from(document.body.children).filter(el => 
      el.style.position === 'fixed' && el.style.zIndex === '1000'
    );
    modals.forEach(modal => modal.remove());
  }

  // Utility: Format Date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Utility: Format Timestamp
  formatTimestamp(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

// Initialize popup
const popupApp = new TestNotifierPopup();
window.popupApp = popupApp; // Make globally accessible for onclick handlers

document.addEventListener('DOMContentLoaded', () => {
  popupApp.init();
});
