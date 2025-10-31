// TestNotifier Multi-Pupil Management
// Main popup logic for managing multiple pupils

class PupilManager {
  constructor() {
    this.currentPupil = null;
    this.pupils = [];
    this.userPlan = 'pro'; // Default to pro for testing (will be set from backend)
    this.init();
  }

  async init() {
    try {
      await this.loadPupils();
      await this.loadSubscriptionData(); // Load subscription from backend
      this.setupEventListeners();
      this.setupTabs();
      this.renderPupils();
      this.updateDashboard();

      // Check for data corruption on load
      this.validateDataIntegrity();

      // Load Twilio configuration
      await this.loadTwilioSettings();

      // Check subscription tier and show/hide Twilio config
      await this.updateTwilioVisibility();

    } catch (error) {
      console.error('❌ Fatal error during initialization:', error);
      this.showMessage('❌ Failed to initialize extension. Please refresh.', 'error');

      // Try to recover
      this.attemptDataRecovery();
    }
  }

  // Load subscription data from backend
  async loadSubscriptionData() {
    try {
      const authToken = localStorage.getItem('auth_token');

      if (!authToken) {
        console.log('ℹ️ No auth token found, using free plan');
        this.userPlan = 'free';
        return;
      }

      const response = await fetch('https://testnotifier.co.uk/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 404) {
        // No subscription found - user on free plan
        this.userPlan = 'free';
        console.log('ℹ️ No active subscription found, using free plan');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      this.userPlan = data.subscription.planType;

      console.log('✅ Subscription loaded:', this.userPlan);

      // Store subscription data for offline use
      await chrome.storage.local.set({
        userPlan: this.userPlan,
        subscriptionData: data.subscription
      });

    } catch (error) {
      console.error('❌ Failed to load subscription data:', error);
      // Fallback to free plan
      this.userPlan = 'free';
    }
  }

  // Show upgrade prompt when limits are reached
  showUpgradePrompt(currentPlan, currentLimit) {
    const upgradeOptions = {
      'free': { nextPlan: 'Starter', nextLimit: 3, price: '£19/month' },
      'starter': { nextPlan: 'Premium', nextLimit: 8, price: '£29/month' },
      'premium': { nextPlan: 'Professional', nextLimit: 'Unlimited', price: '£89/month' }
    };

    const upgrade = upgradeOptions[currentPlan];

    if (!upgrade) {
      return; // Already on highest plan
    }

    const upgradeHtml = `
      <div class="upgrade-prompt" style="
        background: linear-gradient(135deg, #1d70b8, #2e8bc0);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin: 15px 0;
        text-align: center;
        box-shadow: 0 4px 15px rgba(29, 112, 184, 0.3);
      ">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚀 Upgrade to ${upgrade.nextPlan}</h3>
        <p style="margin: 0 0 15px 0; opacity: 0.9;">
          Add up to ${upgrade.nextLimit} pupils • ${upgrade.price}
        </p>
        <button id="upgrade-btn" style="
          background: white;
          color: #1d70b8;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          Upgrade Now
        </button>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
          Cancel anytime • 3-day preview access
        </p>
      </div>
    `;

    // Insert upgrade prompt after the pupil list
    const pupilList = document.getElementById('pupil-list');
    if (pupilList) {
      pupilList.insertAdjacentHTML('afterend', upgradeHtml);

      // Add click handler for upgrade button
      document.getElementById('upgrade-btn').addEventListener('click', () => {
        window.open('https://testnotifier.co.uk/#pricing', '_blank');
      });
    }
  }

  // Data integrity checks
  validateDataIntegrity() {
    let corruptionFound = false;

    // Check for duplicate booking refs
    const bookingRefs = this.pupils.map(p => p.bookingRef);
    const duplicates = bookingRefs.filter((ref, index) => bookingRefs.indexOf(ref) !== index);

    if (duplicates.length > 0) {
      corruptionFound = true;
      this.showMessage(`⚠️ Warning: Found ${duplicates.length} duplicate booking reference(s). Please review your pupils.`, 'error');
    }

    // Check for duplicate IDs
    const ids = this.pupils.map(p => p.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      corruptionFound = true;
      this.showMessage('⚠️ Data corruption detected. Attempting to fix...', 'error');
      this.attemptDataRecovery();
    }

    return !corruptionFound;
  }

  attemptDataRecovery() {
    try {
      // Remove duplicates by booking ref (keep first occurrence)
      const seen = new Set();
      this.pupils = this.pupils.filter(p => {
        if (seen.has(p.bookingRef)) {
          return false;
        }
        seen.add(p.bookingRef);
        return true;
      });

      // Regenerate IDs if duplicates found
      const idsSeen = new Set();
      this.pupils.forEach(p => {
        if (idsSeen.has(p.id)) {
          p.id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
        }
        idsSeen.add(p.id);
      });

      // Save recovered data
      this.savePupils();
      this.showMessage('✅ Data recovered successfully', 'success');

    } catch (error) {
      console.error('Recovery failed:', error);
      this.showMessage('❌ Could not recover data. You may need to re-add pupils.', 'error');
    }
  }

  // Storage Management
  async loadPupils() {
    try {
      const result = await chrome.storage.local.get(['pupils', 'currentPupil', 'userPlan']);

      // Validate loaded data
      if (result.pupils && Array.isArray(result.pupils)) {
        // Sanitize and validate each pupil
        this.pupils = result.pupils.filter(p => {
          return p && p.id && p.name && p.bookingRef;
        });
      } else {
        this.pupils = [];
      }

      this.currentPupil = result.currentPupil || null;
      this.userPlan = result.userPlan || 'free'; // free, starter, premium, pro

      // Remove currentPupil if it no longer exists
      if (this.currentPupil && !this.pupils.find(p => p.id === this.currentPupil)) {
        this.currentPupil = this.pupils.length > 0 ? this.pupils[0].id : null;
      }

    } catch (error) {
      console.error('Error loading pupils:', error);
      this.showMessage('❌ Failed to load pupils. Please refresh the extension.', 'error');
      this.pupils = [];
      this.currentPupil = null;
    }
  }

  async savePupils() {
    try {
      // Validate data before saving
      if (!Array.isArray(this.pupils)) {
        throw new Error('Pupils data corrupted');
      }

      // Check storage quota
      const dataToSave = {
        pupils: this.pupils,
        currentPupil: this.currentPupil
      };

      const dataSize = JSON.stringify(dataToSave).length;
      if (dataSize > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Storage quota exceeded');
      }

      await chrome.storage.local.set(dataToSave);

    } catch (error) {
      console.error('Error saving pupils:', error);

      if (error.message.includes('quota')) {
        this.showMessage('❌ Storage full! Please delete some pupils.', 'error');
      } else if (error.message.includes('corrupted')) {
        this.showMessage('❌ Data corrupted. Please contact support.', 'error');
      } else {
        this.showMessage('❌ Failed to save changes. Please try again.', 'error');
      }

      throw error; // Re-throw so caller knows it failed
    }
  }

  // Pupil CRUD Operations
  addPupil(pupilData) {
    // ========== PLAN LIMITS ENFORCEMENT ==========
    const planLimits = {
      free: 1,
      starter: 3,
      premium: 5,
      pro: 999 // Unlimited (high number)
    };

    const currentPlan = this.userPlan || 'free';
    const maxPupils = planLimits[currentPlan];

    if (this.pupils.length >= maxPupils) {
      this.showMessage(
        `❌ Pupil limit reached (${maxPupils} on ${currentPlan.toUpperCase()} plan). Upgrade to add more pupils.`,
        'error'
      );

      // Show upgrade prompt
      this.showUpgradePrompt(currentPlan, maxPupils);
      return null;
    }

    // ========== CREATE PUPIL ==========
    const pupil = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9), // Unique ID
      name: pupilData.name,
      bookingRef: pupilData.bookingRef,
      testDate: pupilData.testDate || null,
      testCenters: pupilData.testCenters || [],
      notificationPref: pupilData.notificationPref || 'all',
      status: pupilData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        checksPerformed: 0,
        slotsFound: 0,
        lastChecked: null,
        successRate: 0
      },
      settings: {
        dateRange: {
          start: null,
          end: null
        },
        timePreferences: [],
        autoRebook: false,
        rapidMode: false
      }
    };

    this.pupils.push(pupil);
    this.currentPupil = pupil.id;

    try {
      this.savePupils();
      this.renderPupils();
      this.updateDashboard();
      this.showMessage(`✅ ${pupil.name} added successfully!`, 'success');

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'PUPIL_ADDED',
        pupil: pupil
      }).catch(err => {
        console.warn('Background script not responding:', err);
        // Don't show error to user - background script might not be ready yet
      });

      return pupil;

    } catch (error) {
      // Rollback on save failure
      this.pupils = this.pupils.filter(p => p.id !== pupil.id);
      this.showMessage('❌ Failed to add pupil. Please try again.', 'error');
      return null;
    }
  }

  updatePupil(pupilId, updates) {
    const index = this.pupils.findIndex(p => p.id === pupilId);
    if (index === -1) {
      this.showMessage('❌ Pupil not found', 'error');
      return null;
    }

    // Keep backup for rollback
    const backup = { ...this.pupils[index] };

    try {
      // Add updatedAt timestamp
      this.pupils[index] = {
        ...this.pupils[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.savePupils();
      this.renderPupils();
      this.showMessage(`✅ ${this.pupils[index].name} updated successfully!`, 'success');

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'PUPIL_UPDATED',
        pupil: this.pupils[index]
      }).catch(err => console.warn('Background script not responding:', err));

      return this.pupils[index];

    } catch (error) {
      // Rollback on failure
      this.pupils[index] = backup;
      this.showMessage('❌ Failed to update pupil. Please try again.', 'error');
      return null;
    }
  }

  deletePupil(pupilId) {
    console.log('🗑️ Delete pupil called with ID:', pupilId);
    const pupil = this.pupils.find(p => p.id === pupilId);
    if (!pupil) {
      console.error('❌ Pupil not found:', pupilId);
      this.showMessage('❌ Pupil not found', 'error');
      return;
    }

    // Confirmation with details
    const confirmMessage = `Delete ${pupil.name}?\n\nBooking Ref: ${pupil.bookingRef}\nTest Centers: ${pupil.testCenters.length}\n\n⚠️ This cannot be undone.`;

    if (!confirm(confirmMessage)) {
      console.log('❌ User cancelled deletion');
      return;
    }

    console.log('✅ User confirmed deletion of:', pupil.name);

    // Keep backup for rollback
    const backup = [...this.pupils];
    const backupCurrent = this.currentPupil;

    try {
      this.pupils = this.pupils.filter(p => p.id !== pupilId);

      if (this.currentPupil === pupilId) {
        this.currentPupil = this.pupils.length > 0 ? this.pupils[0].id : null;
      }

      this.savePupils();
      this.renderPupils();
      this.updateDashboard();
      this.showMessage(`✅ ${pupil.name} deleted`, 'info');

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'PUPIL_DELETED',
        pupilId: pupilId
      }).catch(err => console.warn('Background script not responding:', err));

    } catch (error) {
      // Rollback on failure
      this.pupils = backup;
      this.currentPupil = backupCurrent;
      this.renderPupils();
      this.showMessage('❌ Failed to delete pupil. Please try again.', 'error');
    }
  }

  togglePupilStatus(pupilId) {
    console.log('⏸️ Toggle pupil status called with ID:', pupilId);
    const pupil = this.pupils.find(p => p.id === pupilId);
    if (!pupil) {
      console.error('❌ Pupil not found:', pupilId);
      this.showMessage('❌ Pupil not found', 'error');
      return;
    }

    const backup = { ...pupil };
    const statusCycle = { 'active': 'paused', 'paused': 'inactive', 'inactive': 'active' };
    const newStatus = statusCycle[pupil.status] || 'active';

    console.log(`🔄 Changing ${pupil.name} status from ${pupil.status} to ${newStatus}`);

    try {
      pupil.status = newStatus;
      pupil.updatedAt = new Date().toISOString();

      this.savePupils();
      this.renderPupils();

      const statusLabels = { 'active': 'activated', 'paused': 'paused', 'inactive': 'deactivated' };
      this.showMessage(`✅ ${pupil.name} ${statusLabels[newStatus]}`, 'info');

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'PUPIL_STATUS_CHANGED',
        pupilId: pupilId,
        status: newStatus
      }).catch(err => console.warn('Background script not responding:', err));

    } catch (error) {
      // Rollback
      Object.assign(pupil, backup);
      this.renderPupils();
      this.showMessage('❌ Failed to change status. Please try again.', 'error');
    }
  }

  setCurrentPupil(pupilId) {
    if (!this.pupils.find(p => p.id === pupilId)) {
      this.showMessage('❌ Pupil not found', 'error');
      return;
    }

    const backup = this.currentPupil;

    try {
      this.currentPupil = pupilId;
      this.savePupils();
      this.renderPupils();

      const pupil = this.pupils.find(p => p.id === pupilId);
      this.showMessage(`✅ Now monitoring ${pupil.name}`, 'info');

      // Notify background script to focus on this pupil
      chrome.runtime.sendMessage({
        type: 'SET_CURRENT_PUPIL',
        pupilId: pupilId
      }).catch(err => console.warn('Background script not responding:', err));

    } catch (error) {
      // Rollback
      this.currentPupil = backup;
      this.renderPupils();
      this.showMessage('❌ Failed to set active pupil. Please try again.', 'error');
    }
  }

  // UI Rendering
  renderPupils() {
    const container = document.getElementById('pupils-list');

    if (this.pupils.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-text">No pupils yet. Add your first pupil to get started!</div>
        </div>
      `;
      return;
    }

    container.innerHTML = this.pupils.map(pupil => `
      <div class="pupil-card ${pupil.id === this.currentPupil ? 'active' : ''}" data-pupil-id="${pupil.id}">
        <div class="pupil-header">
          <div class="pupil-info">
            <div class="pupil-name">${this.escapeHtml(pupil.name)}</div>
            <div class="pupil-booking-ref">${this.escapeHtml(pupil.bookingRef)}</div>
          </div>
          <span class="pupil-status ${pupil.status}">${this.getStatusLabel(pupil.status)}</span>
        </div>
        
        <div class="pupil-meta">
          <div class="pupil-meta-item">
            📍 ${pupil.testCenters.length} center${pupil.testCenters.length !== 1 ? 's' : ''}
          </div>
          <div class="pupil-meta-item">
            📊 ${pupil.stats.slotsFound} slot${pupil.stats.slotsFound !== 1 ? 's' : ''} found
          </div>
          ${pupil.testDate ? `<div class="pupil-meta-item">📅 ${this.formatDate(pupil.testDate)}</div>` : ''}
        </div>

        ${pupil.testCenters.length > 0 ? `
          <div class="center-tags">
            ${pupil.testCenters.slice(0, 3).map(center => `
              <span class="center-tag">${this.escapeHtml(center)}</span>
            `).join('')}
            ${pupil.testCenters.length > 3 ? `<span class="center-tag">+${pupil.testCenters.length - 3} more</span>` : ''}
          </div>
        ` : ''}

        <div class="pupil-actions">
          <button class="btn btn-sm btn-primary" onclick="pupilManager.setCurrentPupil('${pupil.id}')">
            ${pupil.id === this.currentPupil ? '✓ Active' : 'Set Active'}
          </button>
          <button class="btn btn-sm btn-outline" onclick="pupilManager.editPupil('${pupil.id}')">
            ✏️ Edit
          </button>
          <button class="btn btn-sm btn-outline" onclick="pupilManager.togglePupilStatus('${pupil.id}')">
            ${this.getStatusToggleIcon(pupil.status)}
          </button>
          <button class="btn btn-sm btn-danger" onclick="pupilManager.deletePupil('${pupil.id}')">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  }

  editPupil(pupilId) {
    console.log('🔧 Edit pupil called with ID:', pupilId);
    const pupil = this.pupils.find(p => p.id === pupilId);
    if (!pupil) {
      console.error('❌ Pupil not found:', pupilId);
      this.showMessage('❌ Pupil not found', 'error');
      return;
    }

    console.log('✅ Found pupil:', pupil.name);
    this.showPupilModal(pupil);
  }

  showPupilModal(pupil = null) {
    console.log('📝 Show pupil modal called with:', pupil ? pupil.name : 'new pupil');
    const modal = document.getElementById('pupil-modal');
    const title = document.getElementById('modal-title');

    if (!modal) {
      console.error('❌ Modal element not found!');
      this.showMessage('❌ Modal not found. Please refresh the extension.', 'error');
      return;
    }

    if (!title) {
      console.error('❌ Modal title element not found!');
      this.showMessage('❌ Modal title not found. Please refresh the extension.', 'error');
      return;
    }

    console.log('✅ Modal elements found, proceeding...');

    // Initialize autocomplete if not already done
    if (!window.testCentreAutocomplete) {
      window.testCentreAutocomplete = new TestCentreAutocomplete(
        'test-centre-search',
        'test-centre-autocomplete',
        (selectedCentres) => {
          // Callback when centres are selected
          console.log('Selected centres:', selectedCentres);
        }
      );
    }

    if (pupil) {
      title.textContent = `Edit ${pupil.name}`;
      document.getElementById('pupil-name').value = pupil.name;
      document.getElementById('booking-ref').value = pupil.bookingRef;
      document.getElementById('test-date').value = pupil.testDate || '';
      document.getElementById('notification-pref').value = pupil.notificationPref;
      document.getElementById('pupil-status').value = pupil.status;

      // Set selected test centres in autocomplete
      window.testCentreAutocomplete.setSelectedCentres(pupil.testCenters || []);

      // Store current editing pupil ID
      modal.dataset.editingId = pupil.id;
    } else {
      title.textContent = 'Add New Pupil';
      document.getElementById('pupil-name').value = '';
      document.getElementById('booking-ref').value = '';
      document.getElementById('test-date').value = '';
      document.getElementById('notification-pref').value = 'all';
      document.getElementById('pupil-status').value = 'active';

      // Clear autocomplete
      window.testCentreAutocomplete.clear();

      delete modal.dataset.editingId;
    }

    modal.classList.add('active');
  }

  hidePupilModal() {
    const modal = document.getElementById('pupil-modal');
    modal.classList.remove('active');
  }

  savePupilFromModal() {
    const modal = document.getElementById('pupil-modal');
    const name = document.getElementById('pupil-name').value.trim();
    const bookingRef = document.getElementById('booking-ref').value.trim().toUpperCase();
    const testDate = document.getElementById('test-date').value;
    const notificationPref = document.getElementById('notification-pref').value;
    const status = document.getElementById('pupil-status').value;
    const editingId = modal.dataset.editingId;

    // Get test centres from autocomplete
    const testCenters = window.testCentreAutocomplete ?
      window.testCentreAutocomplete.getSelectedCentreNames() :
      [];

    // ========== COMPREHENSIVE VALIDATION ==========

    // Clear previous errors
    this.clearFieldErrors();

    // 1. Name validation
    if (!name || name.length < 2) {
      this.showFieldError('pupil-name', 'name-error', 'Must be at least 2 characters');
      return;
    }

    if (name.length > 50) {
      this.showFieldError('pupil-name', 'name-error', 'Too long (max 50 characters)');
      return;
    }

    // Enhanced name validation - proper full name format
    const namePattern = /^[a-zA-Z\s\-'\.]+$/;
    if (!namePattern.test(name)) {
      this.showFieldError('pupil-name', 'name-error', 'Only letters, spaces, hyphens, apostrophes, and periods allowed');
      return;
    }

    // Check for proper name structure (should have at least first and last name)
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      this.showFieldError('pupil-name', 'name-error', 'Please enter full name (First Last)');
      return;
    }

    // Check each name part is valid
    for (const part of nameParts) {
      if (part.length < 2) {
        this.showFieldError('pupil-name', 'name-error', 'Each name part must be at least 2 characters');
        return;
      }
      if (!/^[a-zA-Z]+$/.test(part)) {
        this.showFieldError('pupil-name', 'name-error', 'Name parts should only contain letters');
        return;
      }
    }

    // Check for duplicate names (unless editing same pupil)
    const duplicateName = this.pupils.find(p =>
      p.name.toLowerCase() === name.toLowerCase() &&
      p.id !== editingId
    );
    if (duplicateName) {
      this.showFieldError('pupil-name', 'name-error', `"${name}" already exists. Try "${name} 2"`);
      return;
    }

    // 2. Booking reference validation
    if (!bookingRef) {
      this.showFieldError('booking-ref', 'ref-error', 'Required field');
      return;
    }

    // Validate booking ref format (DVSA format: letter + 9 digits or similar)
    if (bookingRef.length < 5) {
      this.showFieldError('booking-ref', 'ref-error', 'Too short (min 5 chars)');
      return;
    }

    if (bookingRef.length > 20) {
      this.showFieldError('booking-ref', 'ref-error', 'Too long (max 20 chars)');
      return;
    }

    // Check for invalid characters
    if (!/^[A-Z0-9]+$/.test(bookingRef)) {
      this.showFieldError('booking-ref', 'ref-error', 'Letters & numbers only (no spaces or symbols)');
      return;
    }

    // Enhanced DVSA booking reference validation
    // Format: Should start with letter(s) followed by numbers, or be all alphanumeric
    const dvsaPattern1 = /^[A-Z]{1,3}[0-9]{6,12}$/; // e.g., A123456789, SMITH123456
    const dvsaPattern2 = /^[A-Z0-9]{8,16}$/; // e.g., A123456789, SMITH123456S

    if (!dvsaPattern1.test(bookingRef) && !dvsaPattern2.test(bookingRef)) {
      this.showFieldError('booking-ref', 'ref-error', 'Invalid DVSA format. Use format like: A123456789 or SMITH123456S');
      return;
    }

    // ⚠️ CRITICAL: Check for duplicate booking references
    const duplicateRef = this.pupils.find(p =>
      p.bookingRef === bookingRef &&
      p.id !== editingId
    );
    if (duplicateRef) {
      this.showFieldError('booking-ref', 'ref-error', `Already used by ${duplicateRef.name}`);
      this.showMessage(`❌ Booking reference "${bookingRef}" is already in use`, 'error');
      return;
    }

    // 3. Test date validation
    if (testDate) {
      const selectedDate = new Date(testDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        this.showMessage('❌ Test date cannot be in the past', 'error');
        document.getElementById('test-date').focus();
        return;
      }

      // Check if date is more than 2 years in future (unlikely to be valid)
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      if (selectedDate > twoYearsFromNow) {
        this.showMessage('❌ Test date seems too far in the future. Please check the date.', 'error');
        return;
      }
    }

    // 4. Test centres validation
    if (!testCenters || testCenters.length === 0) {
      this.showFieldError('test-centre-search', 'centres-error', 'Select at least 1 centre');
      this.showMessage('❌ Please select at least one test centre', 'error');
      return;
    }

    // Validate test centres are from official database
    const validCenters = testCenters.filter(name => {
      return ALL_TEST_CENTRES.some(c => c.name === name);
    });

    if (validCenters.length !== testCenters.length) {
      this.showMessage('⚠️ Some test centres were invalid and removed', 'info');
    }

    if (validCenters.length === 0) {
      this.showFieldError('test-centre-search', 'centres-error', 'No valid centres');
      this.showMessage('❌ No valid test centres selected', 'error');
      return;
    }

    // 5. Check storage quota before saving
    try {
      const estimatedSize = JSON.stringify(this.pupils).length + JSON.stringify({
        name, bookingRef, testDate, testCenters: validCenters
      }).length;

      // Chrome local storage quota is ~10MB, warn at 5MB
      if (estimatedSize > 5 * 1024 * 1024) {
        this.showMessage('⚠️ Warning: Storage nearly full. Consider removing old/inactive pupils.', 'error');
        return;
      }
    } catch (e) {
      console.error('Storage check failed:', e);
    }

    // 6. Validate notification preference
    const validNotifPrefs = ['all', 'sms-email', 'sms', 'email', 'whatsapp'];
    if (!validNotifPrefs.includes(notificationPref)) {
      this.showMessage('❌ Invalid notification preference', 'error');
      return;
    }

    // 7. Validate status
    const validStatuses = ['active', 'paused', 'inactive'];
    if (!validStatuses.includes(status)) {
      this.showMessage('❌ Invalid pupil status', 'error');
      return;
    }

    // ========== ALL VALIDATIONS PASSED ==========

    const pupilData = {
      name,
      bookingRef,
      testDate: testDate || null,
      testCenters: validCenters,
      notificationPref,
      status
    };

    if (editingId) {
      // Update existing pupil
      this.updatePupil(editingId, pupilData);
    } else {
      // Add new pupil
      this.addPupil(pupilData);
    }

    this.hidePupilModal();
  }

  // Dashboard
  updateDashboard() {
    const totalPupils = this.pupils.length;
    const activePupils = this.pupils.filter(p => p.status === 'active').length;
    const totalSlotsFound = this.pupils.reduce((sum, p) => sum + p.stats.slotsFound, 0);
    const totalChecks = this.pupils.reduce((sum, p) => sum + p.stats.checksPerformed, 0);
    const successRate = totalChecks > 0 ? Math.round((totalSlotsFound / totalChecks) * 100) : 0;

    document.getElementById('total-pupils').textContent = totalPupils;
    document.getElementById('active-pupils').textContent = activePupils;
    document.getElementById('slots-found').textContent = totalSlotsFound;
    document.getElementById('success-rate').textContent = `${successRate}%`;
  }

  // Event Listeners
  setupEventListeners() {
    // Add pupil button
    document.getElementById('add-pupil-btn').addEventListener('click', () => {
      this.showPupilModal();
    });

    // Modal actions
    document.getElementById('cancel-modal').addEventListener('click', () => {
      this.hidePupilModal();
    });

    document.getElementById('save-pupil').addEventListener('click', () => {
      this.savePupilFromModal();
    });

    // Close modal on background click
    document.getElementById('pupil-modal').addEventListener('click', (e) => {
      if (e.target.id === 'pupil-modal') {
        this.hidePupilModal();
      }
    });

    // Toggle switches
    this.setupToggle('monitoring-toggle', 'monitoring');
    this.setupToggle('rapid-mode-toggle', 'rapidMode');
    this.setupToggle('stealth-toggle', 'stealthMode');
    this.setupToggle('browser-notif-toggle', 'browserNotifications');
    this.setupToggle('sound-toggle', 'soundAlerts');

    // Twilio configuration
    this.setupTwilioEventListeners();

    // Test suite button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'test-suite-btn' || e.target.textContent.includes('Test Notification System')) {
        this.openTestSuite();
      }
    });

    // Time Delay preset buttons
    this.setupTimeDelayControls();
  }

  setupToggle(elementId, settingKey) {
    const toggle = document.getElementById(elementId);

    // Load saved state
    chrome.storage.local.get([settingKey], (result) => {
      if (result[settingKey] !== undefined) {
        toggle.classList.toggle('active', result[settingKey]);
      }
    });

    // Handle clicks
    toggle.addEventListener('click', () => {
      const newState = !toggle.classList.contains('active');
      toggle.classList.toggle('active', newState);

      chrome.storage.local.set({ [settingKey]: newState });

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'SETTING_CHANGED',
        key: settingKey,
        value: newState
      });
    });
  }

  setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.querySelector(`[data-content="${tabName}"]`).classList.add('active');
      });
    });
  }

  // Utility Functions
  showMessage(text, type = 'info') {
    const container = document.getElementById('message-container');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    container.innerHTML = '';
    container.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 4000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getStatusLabel(status) {
    const labels = {
      'active': '● Active',
      'paused': '⏸ Paused',
      'inactive': '○ Inactive'
    };
    return labels[status] || status;
  }

  getStatusToggleIcon(status) {
    const icons = {
      'active': '⏸',
      'paused': '▶',
      'inactive': '▶'
    };
    return icons[status] || '●';
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Field validation UI helpers
  showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(errorId);

    if (field) {
      field.classList.add('error');
      field.focus();
    }

    if (errorSpan) {
      errorSpan.textContent = `❌ ${message}`;
    }
  }

  clearFieldErrors() {
    // Clear all error states
    const fields = document.querySelectorAll('.form-input');
    fields.forEach(field => field.classList.remove('error'));

    // Clear error messages
    const errorSpans = ['name-error', 'ref-error', 'centres-error'];
    errorSpans.forEach(id => {
      const span = document.getElementById(id);
      if (span) span.textContent = '';
    });
  }

  // Twilio Configuration Methods
  async loadTwilioSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success && response.settings) {
        const settings = response.settings;

        // Load Twilio settings if they exist
        if (settings.twilio) {
          document.getElementById('twilio-sid').value = settings.twilio.accountSid || '';
          document.getElementById('twilio-token').value = settings.twilio.authToken || '';
          document.getElementById('twilio-phone').value = settings.twilio.phoneNumber || '';
        }
      }
    } catch (error) {
      console.error('❌ Error loading Twilio settings:', error);
    }
  }

  async updateTwilioVisibility() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSubscription' });
      if (response.success && response.subscription) {
        const subscription = response.subscription;
        const twilioConfig = document.getElementById('twilio-config');

        // Show Twilio config only for Professional tier
        if (subscription.tier === 'professional') {
          twilioConfig.style.display = 'block';
        } else {
          twilioConfig.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('❌ Error checking subscription tier:', error);
    }
  }

  async saveTwilioSettings() {
    try {
      const twilioSettings = {
        accountSid: document.getElementById('twilio-sid').value.trim(),
        authToken: document.getElementById('twilio-token').value.trim(),
        phoneNumber: document.getElementById('twilio-phone').value.trim()
      };

      // Validate settings
      if (twilioSettings.accountSid && !twilioSettings.accountSid.startsWith('AC')) {
        this.showMessage('❌ Invalid Account SID format. Must start with "AC"', 'error');
        return false;
      }

      if (twilioSettings.phoneNumber && !twilioSettings.phoneNumber.match(/^\+44\d{10}$/)) {
        this.showMessage('❌ Invalid UK phone number format. Use +447XXXXXXXXX', 'error');
        return false;
      }

      // Save to background script
      const response = await chrome.runtime.sendMessage({
        action: 'updateSettings',
        data: { twilio: twilioSettings }
      });

      if (response.success) {
        this.showMessage('✅ Twilio settings saved successfully!', 'success');
        return true;
      } else {
        this.showMessage('❌ Failed to save Twilio settings', 'error');
        return false;
      }

    } catch (error) {
      console.error('❌ Error saving Twilio settings:', error);
      this.showMessage('❌ Error saving Twilio settings', 'error');
      return false;
    }
  }

  setupTwilioEventListeners() {
    // Add event listeners for Twilio inputs
    const twilioInputs = ['twilio-sid', 'twilio-token', 'twilio-phone'];
    twilioInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('blur', () => this.saveTwilioSettings());
        input.addEventListener('input', () => {
          // Auto-format phone number
          if (id === 'twilio-phone') {
            let value = input.value.replace(/[^\d+]/g, '');
            if (value && !value.startsWith('+')) {
              value = '+' + value;
            }
            input.value = value;
          }
        });
      }
    });
  }

  // Test suite functionality
  openTestSuite() {
    console.log('🧪 Opening TestNotifier notification system test suite...');

    // Open the test suite in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('run-tests.html'),
      active: true
    }).then(tab => {
      console.log('✅ Test suite opened in new tab:', tab.id);
    }).catch(error => {
      console.error('❌ Failed to open test suite:', error);
      this.showMessage('❌ Failed to open test suite', 'error');
    });
  }

  setupTimeDelayControls() {
    const timeDelayInput = document.getElementById('time-delay-input');
    const presetButtons = document.querySelectorAll('.delay-preset-btn');

    if (!timeDelayInput) {
      console.warn('⚠️ Time delay input not found');
      return;
    }

    // Load saved time delay value
    chrome.storage.local.get(['timeDelay'], (result) => {
      if (result.timeDelay) {
        timeDelayInput.value = result.timeDelay;
        this.updatePresetButtons(result.timeDelay);
      }
    });

    // Handle input changes
    timeDelayInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (value >= 100 && value <= 10000) {
        this.saveTimeDelay(value);
        this.updatePresetButtons(value);
      }
    });

    // Handle preset button clicks
    presetButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const value = parseInt(e.target.dataset.value);
        timeDelayInput.value = value;
        this.saveTimeDelay(value);
        this.updatePresetButtons(value);

        console.log(`⏱️ Time delay set to ${value}ms`);
        this.showMessage(`⏱️ Time delay set to ${value}ms`, 'info');
      });
    });
  }

  updatePresetButtons(activeValue) {
    const presetButtons = document.querySelectorAll('.delay-preset-btn');
    presetButtons.forEach(button => {
      const value = parseInt(button.dataset.value);
      if (value === activeValue) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  saveTimeDelay(value) {
    chrome.storage.local.set({ timeDelay: value }, () => {
      console.log('💾 Time delay saved:', value);

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'TIME_DELAY_CHANGED',
        value: value
      }).catch(err => console.warn('Background script not responding:', err));
    });
  }
}

// Initialize
const pupilManager = new PupilManager();

// Make pupilManager globally accessible for onclick handlers
window.pupilManager = pupilManager;

// Listen for updates from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PUPIL_STATS_UPDATED') {
    pupilManager.loadPupils().then(() => {
      pupilManager.renderPupils();
      pupilManager.updateDashboard();
    });
  }

  if (request.type === 'SLOT_FOUND') {
    pupilManager.showMessage(`Slot found for ${request.pupilName}!`, 'success');
  }
});

