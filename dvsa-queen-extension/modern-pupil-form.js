/**
 * Modern Add New Pupil Component
 * Matches website design system with card-based layout
 * Professional form styling with Inter font and modern animations
 */

class ModernPupilForm {
  constructor() {
    this.container = null;
    this.formData = {
      name: '',
      licenceNumber: '',
      testCentre: '',
      preferredDates: '',
      phone: '',
      email: ''
    };
  }

  /**
   * Create modern pupil form interface
   */
  createForm() {
    const formHTML = `
      <div class="dvsa-modern-card">
        <div class="dvsa-card-header">
          <div class="dvsa-card-title-section">
            <h3 class="dvsa-card-title">Add New Pupil</h3>
            <p class="dvsa-card-subtitle">Enter pupil details to start monitoring</p>
          </div>
          <button class="dvsa-card-close" onclick="this.closest('.dvsa-modern-card').remove()">×</button>
        </div>

        <div class="dvsa-card-content">
          <form class="dvsa-modern-form" id="add-pupil-form">

            <div class="dvsa-form-group">
              <label class="dvsa-form-label" for="pupil-name">
                Full Name *
                <span class="dvsa-form-hint">As it appears on driving licence</span>
              </label>
              <input
                type="text"
                id="pupil-name"
                class="dvsa-form-input"
                placeholder="e.g., John Smith"
                required
                autocomplete="name"
              >
            </div>

            <div class="dvsa-form-group">
              <label class="dvsa-form-label" for="licence-number">
                Driving Licence Number *
                <span class="dvsa-form-hint">16 characters, no spaces</span>
              </label>
              <input
                type="text"
                id="licence-number"
                class="dvsa-form-input"
                placeholder="e.g., SMITH123456AB7CD"
                pattern="[A-Z0-9]{16}"
                maxlength="16"
                required
                autocomplete="off"
              >
              <div class="dvsa-form-validation">
                <span class="dvsa-validation-icon">✓</span>
                <span class="dvsa-validation-text">Valid licence format</span>
              </div>
            </div>

            <div class="dvsa-form-group">
              <label class="dvsa-form-label" for="test-centre">
                Preferred Test Centre *
                <span class="dvsa-form-hint">Start typing to search</span>
              </label>
              <div class="dvsa-input-with-icon">
                <input
                  type="text"
                  id="test-centre"
                  class="dvsa-form-input"
                  placeholder="e.g., London Wood Green"
                  required
                  autocomplete="off"
                >
                <div class="dvsa-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
              </div>
              <div class="dvsa-autocomplete-dropdown" id="centre-dropdown"></div>
            </div>

            <div class="dvsa-form-group">
              <label class="dvsa-form-label" for="preferred-dates">
                Preferred Date Range
                <span class="dvsa-form-hint">Optional - we'll look for dates within this range</span>
              </label>
              <div class="dvsa-date-range-inputs">
                <input
                  type="date"
                  id="date-from"
                  class="dvsa-form-input dvsa-date-input"
                  min="${new Date().toISOString().split('T')[0]}"
                >
                <span class="dvsa-date-separator">to</span>
                <input
                  type="date"
                  id="date-to"
                  class="dvsa-form-input dvsa-date-input"
                  min="${new Date().toISOString().split('T')[0]}"
                >
              </div>
            </div>

            <div class="dvsa-form-row">
              <div class="dvsa-form-group dvsa-form-half">
                <label class="dvsa-form-label" for="phone">
                  Phone Number
                  <span class="dvsa-form-hint">For SMS notifications</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  class="dvsa-form-input"
                  placeholder="e.g., 07123 456789"
                  pattern="[0-9\s]{10,}"
                  autocomplete="tel"
                >
              </div>

              <div class="dvsa-form-group dvsa-form-half">
                <label class="dvsa-form-label" for="email">
                  Email Address
                  <span class="dvsa-form-hint">For email notifications</span>
                </label>
                <input
                  type="email"
                  id="email"
                  class="dvsa-form-input"
                  placeholder="e.g., john@example.com"
                  autocomplete="email"
                >
              </div>
            </div>

            <div class="dvsa-form-actions">
              <button type="button" class="dvsa-btn dvsa-btn-secondary" onclick="this.closest('.dvsa-modern-card').remove()">
                Cancel
              </button>
              <button type="submit" class="dvsa-btn dvsa-btn-primary">
                <span class="dvsa-btn-text">Add Pupil</span>
                <span class="dvsa-btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    return formHTML;
  }

  /**
   * Inject modern form styles
   */
  injectFormStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Modern Card Container */
      .dvsa-modern-card {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        background: var(--color-extension-card, #ffffff);
        border: 1px solid var(--color-gray-200, #dee2e6);
        border-radius: var(--border-radius-xl, 12px);
        box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
        z-index: var(--z-modal, 1040);
        font-family: var(--font-family-primary, 'Inter', sans-serif);
        animation: scaleIn 0.3s ease-out;
      }

      .dvsa-card-header {
        background: var(--gradient-extension-header, linear-gradient(135deg, #1d70b8, #2e8bc0));
        color: var(--color-white, #ffffff);
        padding: var(--spacing-5, 20px) var(--spacing-6, 24px);
        border-radius: var(--border-radius-xl, 12px) var(--border-radius-xl, 12px) 0 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .dvsa-card-title-section {
        flex: 1;
      }

      .dvsa-card-title {
        font-size: var(--font-size-xl, 20px);
        font-weight: var(--font-weight-bold, 700);
        margin: 0 0 var(--spacing-1, 4px) 0;
        line-height: var(--line-height-tight, 1.25);
      }

      .dvsa-card-subtitle {
        font-size: var(--font-size-sm, 14px);
        opacity: 0.9;
        margin: 0;
        font-weight: var(--font-weight-normal, 400);
      }

      .dvsa-card-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: var(--color-white, #ffffff);
        font-size: 24px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: var(--border-radius-full, 9999px);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast, 150ms ease);
      }

      .dvsa-card-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      .dvsa-card-content {
        padding: var(--spacing-6, 24px);
      }

      /* Modern Form Styles */
      .dvsa-modern-form {
        margin: 0;
      }

      .dvsa-form-group {
        margin-bottom: var(--spacing-5, 20px);
      }

      .dvsa-form-label {
        display: block;
        font-weight: var(--font-weight-medium, 500);
        color: var(--color-gray-700, #343a40);
        margin-bottom: var(--spacing-2, 8px);
        font-size: var(--font-size-sm, 14px);
        line-height: var(--line-height-normal, 1.5);
      }

      .dvsa-form-hint {
        display: block;
        font-weight: var(--font-weight-normal, 400);
        color: var(--color-gray-500, #6c757d);
        font-size: var(--font-size-xs, 12px);
        margin-top: 2px;
      }

      .dvsa-form-input {
        width: 100%;
        padding: var(--spacing-3, 12px) var(--spacing-4, 16px);
        border: 1px solid var(--color-gray-300, #ced4da);
        border-radius: var(--border-radius-lg, 8px);
        font-size: var(--font-size-sm, 14px);
        font-family: var(--font-family-primary, 'Inter', sans-serif);
        transition: all var(--transition-fast, 150ms ease);
        background: var(--color-white, #ffffff);
        color: var(--color-gray-800, #212529);
      }

      .dvsa-form-input:focus {
        outline: none;
        border-color: var(--color-primary-blue, #1d70b8);
        box-shadow: 0 0 0 3px rgba(29, 112, 184, 0.1);
      }

      .dvsa-form-input:hover {
        border-color: var(--color-primary-blue-light, #2e8bc0);
      }

      .dvsa-form-input::placeholder {
        color: var(--color-gray-400, #adb5bd);
      }

      /* Input with Icon */
      .dvsa-input-with-icon {
        position: relative;
      }

      .dvsa-input-icon {
        position: absolute;
        right: var(--spacing-3, 12px);
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-gray-400, #adb5bd);
        pointer-events: none;
      }

      /* Date Range Inputs */
      .dvsa-date-range-inputs {
        display: flex;
        align-items: center;
        gap: var(--spacing-3, 12px);
      }

      .dvsa-date-input {
        flex: 1;
      }

      .dvsa-date-separator {
        color: var(--color-gray-500, #6c757d);
        font-size: var(--font-size-sm, 14px);
        font-weight: var(--font-weight-medium, 500);
      }

      /* Form Row for Side-by-Side Inputs */
      .dvsa-form-row {
        display: flex;
        gap: var(--spacing-4, 16px);
      }

      .dvsa-form-half {
        flex: 1;
      }

      /* Validation */
      .dvsa-form-validation {
        display: none;
        align-items: center;
        gap: var(--spacing-2, 8px);
        margin-top: var(--spacing-2, 8px);
        color: var(--color-success-green, #28a745);
        font-size: var(--font-size-xs, 12px);
      }

      .dvsa-form-input:valid + .dvsa-form-validation {
        display: flex;
      }

      .dvsa-validation-icon {
        font-weight: var(--font-weight-bold, 700);
      }

      /* Autocomplete Dropdown */
      .dvsa-autocomplete-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--color-white, #ffffff);
        border: 1px solid var(--color-gray-300, #ced4da);
        border-top: none;
        border-radius: 0 0 var(--border-radius-lg, 8px) var(--border-radius-lg, 8px);
        max-height: 200px;
        overflow-y: auto;
        z-index: var(--z-dropdown, 1000);
        display: none;
      }

      .dvsa-autocomplete-item {
        padding: var(--spacing-3, 12px) var(--spacing-4, 16px);
        cursor: pointer;
        font-size: var(--font-size-sm, 14px);
        color: var(--color-gray-700, #343a40);
        transition: background var(--transition-fast, 150ms ease);
      }

      .dvsa-autocomplete-item:hover {
        background: var(--color-gray-50, #f8f9fa);
      }

      .dvsa-autocomplete-item.selected {
        background: var(--color-primary-blue, #1d70b8);
        color: var(--color-white, #ffffff);
      }

      /* Form Actions */
      .dvsa-form-actions {
        display: flex;
        gap: var(--spacing-3, 12px);
        justify-content: flex-end;
        margin-top: var(--spacing-6, 24px);
        padding-top: var(--spacing-4, 16px);
        border-top: 1px solid var(--color-gray-200, #e9ecef);
      }

      /* Modern Buttons */
      .dvsa-btn {
        padding: var(--spacing-3, 12px) var(--spacing-4, 16px);
        border: none;
        border-radius: var(--border-radius-lg, 8px);
        font-size: var(--font-size-sm, 14px);
        font-weight: var(--font-weight-semibold, 600);
        cursor: pointer;
        transition: all var(--transition-fast, 150ms ease);
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-2, 8px);
        position: relative;
        overflow: hidden;
      }

      .dvsa-btn-primary {
        background: var(--gradient-blue, linear-gradient(135deg, #1d70b8, #2e8bc0));
        color: var(--color-white, #ffffff);
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      }

      .dvsa-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      }

      .dvsa-btn-secondary {
        background: var(--color-white, #ffffff);
        color: var(--color-gray-700, #343a40);
        border: 1px solid var(--color-gray-300, #ced4da);
      }

      .dvsa-btn-secondary:hover {
        background: var(--color-gray-50, #f8f9fa);
        border-color: var(--color-gray-400, #adb5bd);
      }

      .dvsa-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left var(--transition-slow, 350ms ease);
      }

      .dvsa-btn:hover::before {
        left: 100%;
      }

      .dvsa-btn-icon {
        display: flex;
        align-items: center;
      }

      /* Responsive Design */
      @media (max-width: 480px) {
        .dvsa-modern-card {
          width: calc(100vw - 32px);
          margin: 16px;
        }

        .dvsa-form-row {
          flex-direction: column;
          gap: var(--spacing-3, 12px);
        }

        .dvsa-date-range-inputs {
          flex-direction: column;
          align-items: stretch;
        }

        .dvsa-date-separator {
          text-align: center;
          padding: var(--spacing-1, 4px) 0;
        }
      }

      /* Animations */
      @keyframes scaleIn {
        from {
          transform: scale(0.95);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* Scrollbar Styling */
      .dvsa-modern-card::-webkit-scrollbar {
        width: 6px;
      }

      .dvsa-modern-card::-webkit-scrollbar-track {
        background: var(--color-gray-100, #e9ecef);
        border-radius: var(--border-radius-sm, 2px);
      }

      .dvsa-modern-card::-webkit-scrollbar-thumb {
        background: var(--color-gray-400, #adb5bd);
        border-radius: var(--border-radius-sm, 2px);
      }

      .dvsa-modern-card::-webkit-scrollbar-thumb:hover {
        background: var(--color-gray-500, #6c757d);
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Show the modern form
   */
  show() {
    // Remove any existing forms
    const existingForm = document.querySelector('.dvsa-modern-card');
    if (existingForm) {
      existingForm.remove();
    }

    // Inject styles if not already present
    if (!document.querySelector('style[data-dvsa-form-styles]')) {
      this.injectFormStyles();
    }

    // Create and show form
    const formContainer = document.createElement('div');
    formContainer.innerHTML = this.createForm();
    document.body.appendChild(formContainer.firstElementChild);

    // Add form event listeners
    this.setupFormListeners();
  }

  /**
   * Show edit form with existing pupil data
   */
  showEditForm(pupil) {
    this.editingPupil = pupil;
    this.show();

    // Populate form with existing data
    setTimeout(() => {
      this.populateEditForm(pupil);
    }, 100);
  }

  /**
   * Populate form with existing pupil data for editing
   */
  populateEditForm(pupil) {
    document.getElementById('pupil-name').value = pupil.name || '';
    document.getElementById('licence-number').value = pupil.licenceNumber || '';
    document.getElementById('test-centre').value = pupil.testCentre || '';

    if (pupil.preferredDates) {
      document.getElementById('date-from').value = pupil.preferredDates.from || '';
      document.getElementById('date-to').value = pupil.preferredDates.to || '';
    }

    if (pupil.contact) {
      document.getElementById('phone').value = pupil.contact.phone || '';
      document.getElementById('email').value = pupil.contact.email || '';
    }

    // Update form title and button
    const title = document.querySelector('.dvsa-card-title');
    if (title) title.textContent = 'Edit Pupil';

    const submitButton = document.querySelector('button[type="submit"] .dvsa-btn-text');
    if (submitButton) submitButton.textContent = 'Update Pupil';
  }

  /**
   * Setup form event listeners
   */
  setupFormListeners() {
    const form = document.getElementById('add-pupil-form');
    if (!form) return;

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Licence number validation and formatting
    const licenceInput = document.getElementById('licence-number');
    if (licenceInput) {
      licenceInput.addEventListener('input', (e) => {
        // Remove spaces and convert to uppercase
        e.target.value = e.target.value.replace(/\s/g, '').toUpperCase();

        // Basic validation
        const isValid = /^[A-Z0-9]{16}$/.test(e.target.value);
        if (isValid) {
          e.target.classList.add('valid');
        } else {
          e.target.classList.remove('valid');
        }
      });
    }

    // Test centre autocomplete
    const centreInput = document.getElementById('test-centre');
    if (centreInput) {
      this.setupTestCentreAutocomplete(centreInput);
    }

    // Date validation
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    if (dateFrom && dateTo) {
      dateFrom.addEventListener('change', () => {
        dateTo.min = dateFrom.value;
        if (dateTo.value && dateTo.value < dateFrom.value) {
          dateTo.value = dateFrom.value;
        }
      });
    }
  }

  /**
   * Setup test centre autocomplete
   */
  setupTestCentreAutocomplete(input) {
    const testCentres = [
      'London Wood Green',
      'London Wanstead',
      'London Tottenham',
      'London Southgate',
      'London Sidcup',
      'London Pinner',
      'London Mill Hill',
      'London Morden',
      'London Isleworth',
      'London Hendon',
      'London Greenford',
      'London Goodmayes',
      'London Enfield',
      'London Chingford',
      'London Borehamwood',
      'London Barnet',
      'London Yeading',
      'London Croydon',
      'London Bromley',
      'London Barking'
    ];

    let currentFocus = -1;

    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      const dropdown = document.getElementById('centre-dropdown');

      dropdown.innerHTML = '';
      currentFocus = -1;

      if (!value) {
        dropdown.style.display = 'none';
        return;
      }

      const matches = testCentres.filter(centre =>
        centre.toLowerCase().includes(value)
      );

      if (matches.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      dropdown.style.display = 'block';

      matches.forEach((match, index) => {
        const item = document.createElement('div');
        item.className = 'dvsa-autocomplete-item';
        item.textContent = match;
        item.addEventListener('click', function() {
          input.value = match;
          dropdown.style.display = 'none';
        });
        dropdown.appendChild(item);
      });
    });

    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
      const dropdown = document.getElementById('centre-dropdown');
      const items = dropdown.getElementsByClassName('dvsa-autocomplete-item');

      if (e.keyCode === 40) { // Arrow down
        currentFocus++;
        addActive(items);
      } else if (e.keyCode === 38) { // Arrow up
        currentFocus--;
        addActive(items);
      } else if (e.keyCode === 13) { // Enter
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
          items[currentFocus].click();
        }
      } else if (e.keyCode === 27) { // Escape
        dropdown.style.display = 'none';
      }
    });

    function addActive(items) {
      if (!items) return false;
      removeActive(items);
      if (currentFocus >= items.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (items.length - 1);
      if (items[currentFocus]) {
        items[currentFocus].classList.add('selected');
      }
    }

    function removeActive(items) {
      for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('selected');
      }
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (e.target !== input) {
        document.getElementById('centre-dropdown').style.display = 'none';
      }
    });
  }

  /**
   * Handle form submission with proper data structure - supports both add and edit
   */
  handleFormSubmit() {
    const formData = {
      name: document.getElementById('pupil-name').value,
      licenceNumber: document.getElementById('licence-number').value,
      testCentre: document.getElementById('test-centre').value,
      dateFrom: document.getElementById('date-from').value,
      dateTo: document.getElementById('date-to').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value
    };

    // Validate required fields
    if (!formData.name || !formData.licenceNumber || !formData.testCentre) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate licence number format
    if (!/^[A-Z0-9]{16}$/.test(formData.licenceNumber)) {
      alert('Please enter a valid 16-character driving licence number');
      return;
    }

    // Determine if this is an edit or new pupil
    const isEdit = this.editingPupil !== null;
    const action = isEdit ? 'updatePupil' : 'addPupil';

    const messageData = {
      action: action,
      data: formData
    };

    if (isEdit) {
      messageData.pupilId = this.editingPupil.id;
      messageData.updates = formData;
    }

    // Send data to background script with proper error handling
    chrome.runtime.sendMessage(messageData, (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Message sending failed:', chrome.runtime.lastError);
        alert('Failed to communicate with extension. Please try again.');
        return;
      }

      if (response && response.success) {
        // Close form and show success message
        const formCard = document.querySelector('.dvsa-modern-card');
        if (formCard) {
          formCard.remove();
        }

        const actionText = isEdit ? 'updated' : 'added';
        this.showSuccessMessage(`Pupil ${formData.name} ${actionText} successfully!`);

        // Update extension panel if available
        this.updateExtensionPanel();

        // Clear editing state
        this.editingPupil = null;
      } else {
        const errorMessage = response?.error || 'Unknown error occurred';
        const actionText = isEdit ? 'updating' : 'adding';
        alert(`Error ${actionText} pupil: ${errorMessage}`);
        console.error(`❌ ${isEdit ? 'Update' : 'Add'} pupil failed:`, errorMessage);
      }
    });
  }

  /**
   * Update extension panel with new pupil data
   */
  updateExtensionPanel() {
    // Send message to content script to refresh pupil list
    chrome.tabs.query({ url: '*://driverpracticaltest.dvsa.gov.uk/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'refreshPupilList'
        }).catch(error => {
          console.log('Could not refresh pupil list in tab:', error);
        });
      });
    });
  }

  /**
   * Show success message
   */
  showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'dvsa-success-notification';
    successDiv.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✓</div>
        <div class="success-message">${message}</div>
      </div>
    `;

    // Add success styles
    const successStyle = document.createElement('style');
    successStyle.textContent = `
      .dvsa-success-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success-green, #28a745);
        color: var(--color-white, #ffffff);
        padding: var(--spacing-4, 16px);
        border-radius: var(--border-radius-lg, 8px);
        box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
        z-index: var(--z-tooltip, 1060);
        animation: slideInRight 0.3s ease-out;
        font-family: var(--font-family-primary, 'Inter', sans-serif);
      }

      .success-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-3, 12px);
      }

      .success-icon {
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--border-radius-full, 9999px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: var(--font-weight-bold, 700);
        font-size: var(--font-size-sm, 14px);
      }

      .success-message {
        font-size: var(--font-size-sm, 14px);
        font-weight: var(--font-weight-medium, 500);
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(successStyle);
    document.body.appendChild(successDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, 5000);
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernPupilForm;
} else {
  window.ModernPupilForm = ModernPupilForm;
}

// Make sure the class is available globally for the content script
console.log('✅ ModernPupilForm class loaded and available globally');
