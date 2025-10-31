/**
 * Test Centre Autocomplete Component
 * Searchable dropdown for selecting DVSA test centres
 */

// Import test centre data
try {
  if (typeof importScripts !== 'undefined') {
    importScripts('test-centres-database.js');
  }
} catch (error) {
  console.warn('⚠️ Could not load test centres database, using minimal data');
}

// Fallback data if import fails
const TEST_CENTRE_SEARCH_INDEX = self.TEST_CENTRE_SEARCH_INDEX || [
  { name: 'London Test Centre', city: 'London', region: 'London', postcode: 'SW1A', searchTerms: 'london test centre' }
];

const ALL_TEST_CENTRES = self.ALL_TEST_CENTRES || TEST_CENTRE_SEARCH_INDEX;

class TestCentreAutocomplete {
  constructor(inputId, containerId, onSelect) {
    this.inputId = inputId;
    this.containerId = containerId;
    this.onSelect = onSelect;
    this.selectedCentres = [];
    this.maxSelections = 10;
    this.init();
  }

  init() {
    this.input = document.getElementById(this.inputId);
    this.container = document.getElementById(this.containerId);

    if (!this.input || !this.container) {
      console.error('Autocomplete elements not found');
      return;
    }

    this.setupEventListeners();
    this.renderSelectedCentres();
  }

  setupEventListeners() {
    // Input typing - search
    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        this.showSuggestions(query);
      } else {
        this.hideSuggestions();
      }
    });

    // Input focus - show popular centres
    this.input.addEventListener('focus', () => {
      if (!this.input.value) {
        this.showPopularCentres();
      }
    });

    // Click outside - hide suggestions
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.hideSuggestions();
      }
    });
  }

  searchCentres(query) {
    if (!query || query.length < 2) return [];

    const searchTerm = query.toLowerCase();

    return TEST_CENTRE_SEARCH_INDEX
      .filter(centre => centre.searchTerms.includes(searchTerm))
      .slice(0, 10) // Max 10 results
      .map(centre => ({
        name: centre.name,
        city: centre.city,
        region: centre.region,
        postcode: centre.postcode
      }));
  }

  showSuggestions(query) {
    const results = this.searchCentres(query);

    if (results.length === 0) {
      this.showNoResults(query);
      return;
    }

    const dropdown = this.createDropdown(results);
    this.container.appendChild(dropdown);
  }

  showPopularCentres() {
    // Top 20 most popular test centres (by search volume)
    const popular = [
      'Manchester (Belle Vue)',
      'London Wembley (Empire Way)',
      'Birmingham (Garretts Green)',
      'Leeds (Harehills)',
      'Liverpool (Garston)',
      'Glasgow (Anniesland)',
      'Cardiff (Llanishen)',
      'Bristol (Brislington)',
      'Newcastle (Gosforth)',
      'Nottingham (Beeston)'
    ];

    const popularCentres = popular
      .map(name => ALL_TEST_CENTRES.find(c => c.name === name))
      .filter(c => c);

    const dropdown = this.createDropdown(popularCentres, 'Popular Test Centres');
    this.container.appendChild(dropdown);
  }

  createDropdown(centres, title = null) {
    // Remove existing dropdown
    this.hideSuggestions();

    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #1d70b8;
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 8px 24px rgba(29, 112, 184, 0.15);
      z-index: 1000;
      margin-top: -1px;
    `;

    if (title) {
      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.cssText = `
        padding: 10px 14px;
        background: #f8f9fa;
        font-size: 12px;
        font-weight: 600;
        color: #6c757d;
        border-bottom: 1px solid #e9ecef;
      `;
      dropdown.appendChild(titleEl);
    }

    centres.forEach(centre => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.cssText = `
        padding: 12px 14px;
        cursor: pointer;
        border-bottom: 1px solid #f8f9fa;
        transition: background 0.2s;
      `;

      item.innerHTML = `
        <div style="font-weight: 500; color: #1d70b8; margin-bottom: 2px;">${this.escapeHtml(centre.name)}</div>
        <div style="font-size: 11px; color: #6c757d;">${this.escapeHtml(centre.city)} • ${this.escapeHtml(centre.region)} • ${this.escapeHtml(centre.postcode)}</div>
      `;

      item.addEventListener('mouseenter', () => {
        item.style.background = '#f0f7ff';
      });

      item.addEventListener('mouseleave', () => {
        item.style.background = 'white';
      });

      item.addEventListener('click', () => {
        this.selectCentre(centre);
      });

      dropdown.appendChild(item);
    });

    return dropdown;
  }

  showNoResults(query) {
    this.hideSuggestions();

    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #e9ecef;
      border-top: none;
      border-radius: 0 0 8px 8px;
      padding: 20px;
      text-align: center;
      color: #6c757d;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    `;

    dropdown.innerHTML = `
      <div style="margin-bottom: 8px;">❌ No test centres found for "${this.escapeHtml(query)}"</div>
      <div style="font-size: 11px; color: #adb5bd;">Try searching by city name or postcode</div>
    `;

    this.container.appendChild(dropdown);
  }

  hideSuggestions() {
    const existingDropdown = this.container.querySelector('.autocomplete-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }
  }

  selectCentre(centre) {
    // Check if already selected
    if (this.selectedCentres.some(c => c.name === centre.name)) {
      alert(`"${centre.name}" is already added`);
      return;
    }

    // Check max limit
    if (this.selectedCentres.length >= this.maxSelections) {
      alert(`Maximum ${this.maxSelections} test centres allowed`);
      return;
    }

    this.selectedCentres.push(centre);
    this.input.value = '';
    this.hideSuggestions();
    this.renderSelectedCentres();

    if (this.onSelect) {
      this.onSelect(this.selectedCentres);
    }
  }

  removeCentre(centreName) {
    this.selectedCentres = this.selectedCentres.filter(c => c.name !== centreName);
    this.renderSelectedCentres();

    if (this.onSelect) {
      this.onSelect(this.selectedCentres);
    }
  }

  renderSelectedCentres() {
    const selectedContainer = document.getElementById('selected-centres');
    if (!selectedContainer) return;

    if (this.selectedCentres.length === 0) {
      selectedContainer.innerHTML = `
        <div style="padding: 16px; text-align: center; color: #6c757d; font-size: 13px;">
          No test centres selected yet
        </div>
      `;
      return;
    }

    selectedContainer.innerHTML = this.selectedCentres.map(centre => `
      <div class="selected-centre-tag" style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #1d70b8, #2e8bc0);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        margin: 4px;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(29, 112, 184, 0.2);
      ">
        <span>${this.escapeHtml(centre.name)}</span>
        <button 
          onclick="testCentreAutocomplete.removeCentre('${this.escapeHtml(centre.name)}')"
          style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            line-height: 1;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        >×</button>
      </div>
    `).join('');
  }

  getSelectedCentreNames() {
    return this.selectedCentres.map(c => c.name);
  }

  setSelectedCentres(centreNames) {
    this.selectedCentres = centreNames
      .map(name => ALL_TEST_CENTRES.find(c => c.name === name))
      .filter(c => c);

    this.renderSelectedCentres();
  }

  clear() {
    this.selectedCentres = [];
    this.input.value = '';
    this.renderSelectedCentres();
    this.hideSuggestions();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

