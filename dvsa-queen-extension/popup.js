/**
 * DVSA Queen - Popup JavaScript
 * Manages the extension popup interface and instructor functionality
 */

class PopupManager {
  constructor() {
    this.currentInstructor = null;
    this.pupils = [];
    this.settings = {
      autoCheck: true,
      soundEnabled: true,
      notifications: true
    };

    this.isInitialized = false;
  }

  /**
   * Initialize popup when DOM is ready
   */
  async initialize() {
    console.log('🚀 Initializing popup...');

    await this.loadSettings();
    await this.loadExtensionState();
    this.setupEventListeners();
    this.updateUI();

    console.log('✅ Popup initialized');
  }

  /**
   * Load settings from storage
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
   * Load extension state from storage
   */
  async loadExtensionState() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getState' });
      if (response.success) {
        const state = response.state;
        this.currentInstructor = state.currentInstructor;
        this.pupils = state.pupils || [];
        console.log('✅ Extension state loaded:', { instructor: this.currentInstructor, pupils: this.pupils.length });
      }
    } catch (error) {
      console.error('❌ Error loading extension state:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Instructor setup
    const setupBtn = document.getElementById('setup-instructor');
    if (setupBtn) {
      setupBtn.addEventListener('click', () => this.setupInstructor());
    }

    // Add pupil
    const addPupilBtn = document.getElementById('add-pupil');
    if (addPupilBtn) {
      addPupilBtn.addEventListener('click', () => this.addPupil());
    }

    // Manual check
    const manualCheckBtn = document.getElementById('manual-check');
    if (manualCheckBtn) {
      manualCheckBtn.addEventListener('click', () => this.manualCheck());
    }

    // Open options
    const openOptionsBtn = document.getElementById('open-options');
    if (openOptionsBtn) {
      openOptionsBtn.addEventListener('click', () => this.openOptions());
    }

    // Settings toggles
    this.setupSettingsToggles();

    // Save settings
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    }

    // Input validation
    this.setupInputValidation();
  }

  /**
   * Setup instructor configuration
   */
  async setupInstructor() {
    console.log('📝 Setting up instructor...');

    const adiNumber = document.getElementById('adi-number').value.trim();
    const baseLocation = document.getElementById('base-location').value.trim();
    const travelRadius = parseInt(document.getElementById('travel-radius').value) || 50;

    // Validation
    if (!adiNumber || !baseLocation) {
      this.showError('Please fill in all required fields');
      return;
    }

    if (!/^ADI\d{6}$/i.test(adiNumber)) {
      this.showError('ADI number must be in format ADI123456');
      return;
    }

    if (travelRadius < 10 || travelRadius > 100) {
      this.showError('Travel radius must be between 10-100km');
      return;
    }

    try {
      this.showLoading('Setting up instructor...');

      const instructorData = {
        adiNumber: adiNumber.toUpperCase(),
        name: 'Instructor ' + adiNumber.slice(3), // Extract number part
        baseLocation: {
          city: baseLocation,
          postcode: 'SW1A 1AA', // Would get real postcode
          lat: 51.5074, // Would get real coordinates
          lon: -0.1278
        },
        travelRadius: travelRadius,
        phone: '+447700900123', // Would get real phone
        email: 'instructor@example.com' // Would get real email
      };

      // Send to background script for processing
      const response = await chrome.runtime.sendMessage({
        action: 'setupInstructor',
        data: instructorData
      });

      if (response.success) {
        this.currentInstructor = response.instructor;
        this.showSuccess('Instructor setup successful!');
        this.updateUI();

        // Auto-start monitoring
        setTimeout(() => this.startMonitoring(), 1000);
      } else {
        this.showError(response.error || 'Setup failed');
      }

    } catch (error) {
      console.error('❌ Error setting up instructor:', error);
      this.showError('Setup failed: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Add new pupil
   */
  async addPupil() {
    console.log('➕ Adding new pupil...');

    const licenceInput = document.getElementById('new-pupil-licence');
    const licence = licenceInput.value.trim();

    if (!licence) {
      this.showError('Please enter pupil licence number');
      return;
    }

    if (!/^[A-Z]{2}\d{6}[A-Z]$/i.test(licence)) {
      this.showError('Licence must be in format: XX123456X (e.g., SMITH123456S)');
      return;
    }

    // Check for duplicates
    if (this.pupils.some(p => p.licence.toUpperCase() === licence.toUpperCase())) {
      this.showError('Pupil already exists');
      return;
    }

    try {
      const pupilData = {
        licence: licence.toUpperCase(),
        name: licence.slice(0, -1), // Extract name part
        phone: '+447700900456', // Would get real phone
        centres: ['LONDON-WD', 'LONDON-WG'], // Would get from settings
        earliest: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
        latest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +90 days
        status: 'QUEUED'
      };

      const response = await chrome.runtime.sendMessage({
        action: 'addPupil',
        data: pupilData
      });

      if (response.success) {
        this.pupils.push(pupilData);
        licenceInput.value = '';
        this.renderPupilsList();
        this.showSuccess('Pupil added successfully!');
      } else {
        this.showError(response.error || 'Failed to add pupil');
      }

    } catch (error) {
      console.error('❌ Error adding pupil:', error);
      this.showError('Failed to add pupil: ' + error.message);
    }
  }

  /**
   * Render pupils list
   */
  renderPupilsList() {
    const listContainer = document.getElementById('pupils-list');
    if (!listContainer) return;

    if (this.pupils.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-text">No pupils added yet</div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = this.pupils.map(pupil => `
      <div class="pupil-item">
        <div class="pupil-info">
          <div class="pupil-name">${pupil.name}</div>
          <div class="pupil-licence">${pupil.licence}</div>
        </div>
        <div class="pupil-status ${pupil.status.toLowerCase()}">${pupil.status}</div>
      </div>
    `).join('');
  }

  /**
   * Manual check for cancellations
   */
  async manualCheck() {
    console.log('🔄 Manual check requested');

    if (!this.currentInstructor) {
      this.showError('Please set up instructor first');
      return;
    }

    this.showLoading('Checking for cancellations...');

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'manualCheck',
        data: { instructorId: this.currentInstructor.adiNumber }
      });

      if (response.success) {
        this.showSuccess('Check completed successfully');
      } else {
        this.showError(response.error || 'Check failed');
      }

    } catch (error) {
      console.error('❌ Error during manual check:', error);
      this.showError('Check failed: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Setup settings toggles
   */
  setupSettingsToggles() {
    const toggles = [
      { id: 'auto-check-toggle', setting: 'autoCheck' },
      { id: 'sound-toggle', setting: 'soundEnabled' },
      { id: 'notifications-toggle', setting: 'notifications' }
    ];

    toggles.forEach(({ id, setting }) => {
      const toggle = document.getElementById(id);
      if (toggle) {
        this.setupToggleSwitch(toggle, setting);
      }
    });
  }

  /**
   * Setup individual toggle switch
   */
  setupToggleSwitch(toggleElement, settingName) {
    const isActive = this.settings[settingName];
    toggleElement.classList.toggle('active', isActive);

    toggleElement.addEventListener('click', async () => {
      const newValue = !this.settings[settingName];
      this.settings[settingName] = newValue;
      toggleElement.classList.toggle('active', newValue);

      // Save to storage
      try {
        await chrome.runtime.sendMessage({
          action: 'updateSettings',
          data: { [settingName]: newValue }
        });
      } catch (error) {
        console.error(`❌ Error updating ${settingName}:`, error);
      }
    });
  }

  /**
   * Save settings
   */
  async saveSettings() {
    console.log('💾 Saving settings...');

    try {
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        data: this.settings
      });

      this.showSuccess('Settings saved successfully!');
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      this.showError('Failed to save settings');
    }
  }

  /**
   * Open advanced options page
   */
  async openOptions() {
    try {
      await chrome.runtime.openOptionsPage();
      window.close(); // Close popup after opening options
    } catch (error) {
      console.error('❌ Error opening options page:', error);
      this.showError('Could not open options page');
    }
  }

  /**
   * Start monitoring
   */
  async startMonitoring() {
    console.log('🔍 Starting monitoring...');

    try {
      await chrome.runtime.sendMessage({
        action: 'startMonitoring'
      });

      this.updateStatus('Monitoring', 'active');
    } catch (error) {
      console.error('❌ Error starting monitoring:', error);
      this.showError('Failed to start monitoring');
    }
  }

  /**
   * Update UI based on current state
   */
  updateUI() {
    const instructorSetup = document.getElementById('instructor-setup');
    const pupilsSection = document.getElementById('pupils-section');
    const statisticsSection = document.getElementById('statistics-section');
    const settingsSection = document.getElementById('settings-section');

    if (this.currentInstructor) {
      // Instructor is set up - show all sections
      if (instructorSetup) instructorSetup.style.display = 'none';
      if (pupilsSection) pupilsSection.style.display = 'block';
      if (statisticsSection) statisticsSection.style.display = 'block';
      if (settingsSection) settingsSection.style.display = 'block';

      this.renderPupilsList();
      this.updateStatistics();

      // Pre-fill instructor info
      const adiNumberInput = document.getElementById('adi-number');
      const baseLocationInput = document.getElementById('base-location');
      const travelRadiusInput = document.getElementById('travel-radius');

      if (adiNumberInput) adiNumberInput.value = this.currentInstructor.adiNumber;
      if (baseLocationInput) baseLocationInput.value = this.currentInstructor.baseLocation.city;
      if (travelRadiusInput) travelRadiusInput.value = this.currentInstructor.travelRadius;

    } else {
      // No instructor set up - show only setup section
      if (instructorSetup) instructorSection.style.display = 'block';
      if (pupilsSection) pupilsSection.style.display = 'none';
      if (statisticsSection) statisticsSection.style.display = 'none';
      if (settingsSection) settingsSection.style.display = 'none';
    }

    // Update settings toggles
    this.setupSettingsToggles();
  }

  /**
   * Update statistics display
   */
  updateStatistics() {
    const totalChecks = document.getElementById('total-checks');
    const successfulChanges = document.getElementById('successful-changes');
    const successRate = document.getElementById('success-rate');

    if (totalChecks) totalChecks.textContent = '0'; // Would get from storage
    if (successfulChanges) successfulChanges.textContent = '0'; // Would get from storage
    if (successRate) successRate.textContent = '0%'; // Would calculate
  }

  /**
   * Setup input validation
   */
  setupInputValidation() {
    const adiInput = document.getElementById('adi-number');
    if (adiInput) {
      adiInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      });
    }

    const licenceInput = document.getElementById('new-pupil-licence');
    if (licenceInput) {
      licenceInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      });
    }
  }

  /**
   * Utility: Show loading state
   */
  showLoading(message) {
    // Would show loading indicator
    console.log('⏳ Loading:', message);
  }

  /**
   * Utility: Hide loading state
   */
  hideLoading() {
    // Would hide loading indicator
    console.log('✅ Loading complete');
  }

  /**
   * Utility: Show success message
   */
  showSuccess(message) {
    console.log('✅ Success:', message);
    // Would show success notification
  }

  /**
   * Utility: Show error message
   */
  showError(message) {
    console.error('❌ Error:', message);
    // Would show error notification
  }
}

/**
 * Initialize popup when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Popup DOM loaded');

  const popupManager = new PopupManager();
  await popupManager.initialize();

  console.log('✅ Popup fully initialized');
});