/******/ (() => { // webpackBootstrap
/*!******************!*\
  !*** ./popup.js ***!
  \******************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * DVSA Queen - Popup JavaScript
 * Manages the extension popup interface and instructor functionality
 */
var PopupManager = /*#__PURE__*/function () {
  function PopupManager() {
    _classCallCheck(this, PopupManager);
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
  return _createClass(PopupManager, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              console.log('🚀 Initializing popup...');
              _context.n = 1;
              return this.loadSettings();
            case 1:
              _context.n = 2;
              return this.loadExtensionState();
            case 2:
              this.setupEventListeners();
              this.updateUI();
              console.log('✅ Popup initialized');
            case 3:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Load settings from storage
     */
    )
  }, {
    key: "loadSettings",
    value: (function () {
      var _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var response, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return chrome.runtime.sendMessage({
                action: 'getSettings'
              });
            case 1:
              response = _context2.v;
              if (response.success) {
                this.settings = _objectSpread(_objectSpread({}, this.settings), response.settings);
                console.log('✅ Settings loaded:', this.settings);
              }
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t = _context2.v;
              console.error('❌ Error loading settings:', _t);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function loadSettings() {
        return _loadSettings.apply(this, arguments);
      }
      return loadSettings;
    }()
    /**
     * Load extension state from storage
     */
    )
  }, {
    key: "loadExtensionState",
    value: (function () {
      var _loadExtensionState = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var response, state, _t2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return chrome.runtime.sendMessage({
                action: 'getState'
              });
            case 1:
              response = _context3.v;
              if (response.success) {
                state = response.state;
                this.currentInstructor = state.currentInstructor;
                this.pupils = state.pupils || [];
                console.log('✅ Extension state loaded:', {
                  instructor: this.currentInstructor,
                  pupils: this.pupils.length
                });
              }
              _context3.n = 3;
              break;
            case 2:
              _context3.p = 2;
              _t2 = _context3.v;
              console.error('❌ Error loading extension state:', _t2);
            case 3:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 2]]);
      }));
      function loadExtensionState() {
        return _loadExtensionState.apply(this, arguments);
      }
      return loadExtensionState;
    }()
    /**
     * Setup event listeners
     */
    )
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // Instructor setup
      var setupBtn = document.getElementById('setup-instructor');
      if (setupBtn) {
        setupBtn.addEventListener('click', function () {
          return _this.setupInstructor();
        });
      }

      // Add pupil
      var addPupilBtn = document.getElementById('add-pupil');
      if (addPupilBtn) {
        addPupilBtn.addEventListener('click', function () {
          return _this.addPupil();
        });
      }

      // Manual check
      var manualCheckBtn = document.getElementById('manual-check');
      if (manualCheckBtn) {
        manualCheckBtn.addEventListener('click', function () {
          return _this.manualCheck();
        });
      }

      // Open options
      var openOptionsBtn = document.getElementById('open-options');
      if (openOptionsBtn) {
        openOptionsBtn.addEventListener('click', function () {
          return _this.openOptions();
        });
      }

      // Settings toggles
      this.setupSettingsToggles();

      // Save settings
      var saveSettingsBtn = document.getElementById('save-settings');
      if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function () {
          return _this.saveSettings();
        });
      }

      // Input validation
      this.setupInputValidation();
    }

    /**
     * Setup instructor configuration
     */
  }, {
    key: "setupInstructor",
    value: (function () {
      var _setupInstructor = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _this2 = this;
        var adiNumber, baseLocation, travelRadius, instructorData, response, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              console.log('📝 Setting up instructor...');
              adiNumber = document.getElementById('adi-number').value.trim();
              baseLocation = document.getElementById('base-location').value.trim();
              travelRadius = parseInt(document.getElementById('travel-radius').value) || 50; // Validation
              if (!(!adiNumber || !baseLocation)) {
                _context4.n = 1;
                break;
              }
              this.showError('Please fill in all required fields');
              return _context4.a(2);
            case 1:
              if (/^ADI\d{6}$/i.test(adiNumber)) {
                _context4.n = 2;
                break;
              }
              this.showError('ADI number must be in format ADI123456');
              return _context4.a(2);
            case 2:
              if (!(travelRadius < 10 || travelRadius > 100)) {
                _context4.n = 3;
                break;
              }
              this.showError('Travel radius must be between 10-100km');
              return _context4.a(2);
            case 3:
              _context4.p = 3;
              this.showLoading('Setting up instructor...');
              instructorData = {
                adiNumber: adiNumber.toUpperCase(),
                name: 'Instructor ' + adiNumber.slice(3),
                // Extract number part
                baseLocation: {
                  city: baseLocation,
                  postcode: 'SW1A 1AA',
                  // Would get real postcode
                  lat: 51.5074,
                  // Would get real coordinates
                  lon: -0.1278
                },
                travelRadius: travelRadius,
                phone: '+447700900123',
                // Would get real phone
                email: 'instructor@example.com' // Would get real email
              }; // Send to background script for processing
              _context4.n = 4;
              return chrome.runtime.sendMessage({
                action: 'setupInstructor',
                data: instructorData
              });
            case 4:
              response = _context4.v;
              if (response.success) {
                this.currentInstructor = response.instructor;
                this.showSuccess('Instructor setup successful!');
                this.updateUI();

                // Auto-start monitoring
                setTimeout(function () {
                  return _this2.startMonitoring();
                }, 1000);
              } else {
                this.showError(response.error || 'Setup failed');
              }
              _context4.n = 6;
              break;
            case 5:
              _context4.p = 5;
              _t3 = _context4.v;
              console.error('❌ Error setting up instructor:', _t3);
              this.showError('Setup failed: ' + _t3.message);
            case 6:
              _context4.p = 6;
              this.hideLoading();
              return _context4.f(6);
            case 7:
              return _context4.a(2);
          }
        }, _callee4, this, [[3, 5, 6, 7]]);
      }));
      function setupInstructor() {
        return _setupInstructor.apply(this, arguments);
      }
      return setupInstructor;
    }()
    /**
     * Add new pupil
     */
    )
  }, {
    key: "addPupil",
    value: (function () {
      var _addPupil = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var licenceInput, licence, pupilData, response, _t4;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              console.log('➕ Adding new pupil...');
              licenceInput = document.getElementById('new-pupil-licence');
              licence = licenceInput.value.trim();
              if (licence) {
                _context5.n = 1;
                break;
              }
              this.showError('Please enter pupil licence number');
              return _context5.a(2);
            case 1:
              if (/^[A-Z]{2}\d{6}[A-Z]$/i.test(licence)) {
                _context5.n = 2;
                break;
              }
              this.showError('Licence must be in format: XX123456X (e.g., SMITH123456S)');
              return _context5.a(2);
            case 2:
              if (!this.pupils.some(function (p) {
                return p.licence.toUpperCase() === licence.toUpperCase();
              })) {
                _context5.n = 3;
                break;
              }
              this.showError('Pupil already exists');
              return _context5.a(2);
            case 3:
              _context5.p = 3;
              pupilData = {
                licence: licence.toUpperCase(),
                name: licence.slice(0, -1),
                // Extract name part
                phone: '+447700900456',
                // Would get real phone
                centres: ['LONDON-WD', 'LONDON-WG'],
                // Would get from settings
                earliest: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                // +7 days
                latest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                // +90 days
                status: 'QUEUED'
              };
              _context5.n = 4;
              return chrome.runtime.sendMessage({
                action: 'addPupil',
                data: pupilData
              });
            case 4:
              response = _context5.v;
              if (response.success) {
                this.pupils.push(pupilData);
                licenceInput.value = '';
                this.renderPupilsList();
                this.showSuccess('Pupil added successfully!');
              } else {
                this.showError(response.error || 'Failed to add pupil');
              }
              _context5.n = 6;
              break;
            case 5:
              _context5.p = 5;
              _t4 = _context5.v;
              console.error('❌ Error adding pupil:', _t4);
              this.showError('Failed to add pupil: ' + _t4.message);
            case 6:
              return _context5.a(2);
          }
        }, _callee5, this, [[3, 5]]);
      }));
      function addPupil() {
        return _addPupil.apply(this, arguments);
      }
      return addPupil;
    }()
    /**
     * Render pupils list
     */
    )
  }, {
    key: "renderPupilsList",
    value: function renderPupilsList() {
      var listContainer = document.getElementById('pupils-list');
      if (!listContainer) return;
      if (this.pupils.length === 0) {
        listContainer.innerHTML = "\n        <div class=\"empty-state\">\n          <div class=\"empty-state-icon\">\uD83D\uDC65</div>\n          <div class=\"empty-state-text\">No pupils added yet</div>\n        </div>\n      ";
        return;
      }
      listContainer.innerHTML = this.pupils.map(function (pupil) {
        return "\n      <div class=\"pupil-item\">\n        <div class=\"pupil-info\">\n          <div class=\"pupil-name\">".concat(pupil.name, "</div>\n          <div class=\"pupil-licence\">").concat(pupil.licence, "</div>\n        </div>\n        <div class=\"pupil-status ").concat(pupil.status.toLowerCase(), "\">").concat(pupil.status, "</div>\n      </div>\n    ");
      }).join('');
    }

    /**
     * Manual check for cancellations
     */
  }, {
    key: "manualCheck",
    value: (function () {
      var _manualCheck = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var response, _t5;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              console.log('🔄 Manual check requested');
              if (this.currentInstructor) {
                _context6.n = 1;
                break;
              }
              this.showError('Please set up instructor first');
              return _context6.a(2);
            case 1:
              this.showLoading('Checking for cancellations...');
              _context6.p = 2;
              _context6.n = 3;
              return chrome.runtime.sendMessage({
                action: 'manualCheck',
                data: {
                  instructorId: this.currentInstructor.adiNumber
                }
              });
            case 3:
              response = _context6.v;
              if (response.success) {
                this.showSuccess('Check completed successfully');
              } else {
                this.showError(response.error || 'Check failed');
              }
              _context6.n = 5;
              break;
            case 4:
              _context6.p = 4;
              _t5 = _context6.v;
              console.error('❌ Error during manual check:', _t5);
              this.showError('Check failed: ' + _t5.message);
            case 5:
              _context6.p = 5;
              this.hideLoading();
              return _context6.f(5);
            case 6:
              return _context6.a(2);
          }
        }, _callee6, this, [[2, 4, 5, 6]]);
      }));
      function manualCheck() {
        return _manualCheck.apply(this, arguments);
      }
      return manualCheck;
    }()
    /**
     * Setup settings toggles
     */
    )
  }, {
    key: "setupSettingsToggles",
    value: function setupSettingsToggles() {
      var _this3 = this;
      var toggles = [{
        id: 'auto-check-toggle',
        setting: 'autoCheck'
      }, {
        id: 'sound-toggle',
        setting: 'soundEnabled'
      }, {
        id: 'notifications-toggle',
        setting: 'notifications'
      }];
      toggles.forEach(function (_ref) {
        var id = _ref.id,
          setting = _ref.setting;
        var toggle = document.getElementById(id);
        if (toggle) {
          _this3.setupToggleSwitch(toggle, setting);
        }
      });
    }

    /**
     * Setup individual toggle switch
     */
  }, {
    key: "setupToggleSwitch",
    value: function setupToggleSwitch(toggleElement, settingName) {
      var _this4 = this;
      var isActive = this.settings[settingName];
      toggleElement.classList.toggle('active', isActive);
      toggleElement.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var newValue, _t6;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              newValue = !_this4.settings[settingName];
              _this4.settings[settingName] = newValue;
              toggleElement.classList.toggle('active', newValue);

              // Save to storage
              _context7.p = 1;
              _context7.n = 2;
              return chrome.runtime.sendMessage({
                action: 'updateSettings',
                data: _defineProperty({}, settingName, newValue)
              });
            case 2:
              _context7.n = 4;
              break;
            case 3:
              _context7.p = 3;
              _t6 = _context7.v;
              console.error("\u274C Error updating ".concat(settingName, ":"), _t6);
            case 4:
              return _context7.a(2);
          }
        }, _callee7, null, [[1, 3]]);
      })));
    }

    /**
     * Save settings
     */
  }, {
    key: "saveSettings",
    value: (function () {
      var _saveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var _t7;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              console.log('💾 Saving settings...');
              _context8.p = 1;
              _context8.n = 2;
              return chrome.runtime.sendMessage({
                action: 'updateSettings',
                data: this.settings
              });
            case 2:
              this.showSuccess('Settings saved successfully!');
              _context8.n = 4;
              break;
            case 3:
              _context8.p = 3;
              _t7 = _context8.v;
              console.error('❌ Error saving settings:', _t7);
              this.showError('Failed to save settings');
            case 4:
              return _context8.a(2);
          }
        }, _callee8, this, [[1, 3]]);
      }));
      function saveSettings() {
        return _saveSettings.apply(this, arguments);
      }
      return saveSettings;
    }()
    /**
     * Open advanced options page
     */
    )
  }, {
    key: "openOptions",
    value: (function () {
      var _openOptions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var _t8;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              _context9.n = 1;
              return chrome.runtime.openOptionsPage();
            case 1:
              window.close(); // Close popup after opening options
              _context9.n = 3;
              break;
            case 2:
              _context9.p = 2;
              _t8 = _context9.v;
              console.error('❌ Error opening options page:', _t8);
              this.showError('Could not open options page');
            case 3:
              return _context9.a(2);
          }
        }, _callee9, this, [[0, 2]]);
      }));
      function openOptions() {
        return _openOptions.apply(this, arguments);
      }
      return openOptions;
    }()
    /**
     * Start monitoring
     */
    )
  }, {
    key: "startMonitoring",
    value: (function () {
      var _startMonitoring = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _t9;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              console.log('🔍 Starting monitoring...');
              _context0.p = 1;
              _context0.n = 2;
              return chrome.runtime.sendMessage({
                action: 'startMonitoring'
              });
            case 2:
              this.updateStatus('Monitoring', 'active');
              _context0.n = 4;
              break;
            case 3:
              _context0.p = 3;
              _t9 = _context0.v;
              console.error('❌ Error starting monitoring:', _t9);
              this.showError('Failed to start monitoring');
            case 4:
              return _context0.a(2);
          }
        }, _callee0, this, [[1, 3]]);
      }));
      function startMonitoring() {
        return _startMonitoring.apply(this, arguments);
      }
      return startMonitoring;
    }()
    /**
     * Update UI based on current state
     */
    )
  }, {
    key: "updateUI",
    value: function updateUI() {
      var instructorSetup = document.getElementById('instructor-setup');
      var pupilsSection = document.getElementById('pupils-section');
      var statisticsSection = document.getElementById('statistics-section');
      var settingsSection = document.getElementById('settings-section');
      if (this.currentInstructor) {
        // Instructor is set up - show all sections
        if (instructorSetup) instructorSetup.style.display = 'none';
        if (pupilsSection) pupilsSection.style.display = 'block';
        if (statisticsSection) statisticsSection.style.display = 'block';
        if (settingsSection) settingsSection.style.display = 'block';
        this.renderPupilsList();
        this.updateStatistics();

        // Pre-fill instructor info
        var adiNumberInput = document.getElementById('adi-number');
        var baseLocationInput = document.getElementById('base-location');
        var travelRadiusInput = document.getElementById('travel-radius');
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
  }, {
    key: "updateStatistics",
    value: function updateStatistics() {
      var totalChecks = document.getElementById('total-checks');
      var successfulChanges = document.getElementById('successful-changes');
      var successRate = document.getElementById('success-rate');
      if (totalChecks) totalChecks.textContent = '0'; // Would get from storage
      if (successfulChanges) successfulChanges.textContent = '0'; // Would get from storage
      if (successRate) successRate.textContent = '0%'; // Would calculate
    }

    /**
     * Setup input validation
     */
  }, {
    key: "setupInputValidation",
    value: function setupInputValidation() {
      var adiInput = document.getElementById('adi-number');
      if (adiInput) {
        adiInput.addEventListener('input', function (e) {
          e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
      }
      var licenceInput = document.getElementById('new-pupil-licence');
      if (licenceInput) {
        licenceInput.addEventListener('input', function (e) {
          e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
      }
    }

    /**
     * Utility: Show loading state
     */
  }, {
    key: "showLoading",
    value: function showLoading(message) {
      // Would show loading indicator
      console.log('⏳ Loading:', message);
    }

    /**
     * Utility: Hide loading state
     */
  }, {
    key: "hideLoading",
    value: function hideLoading() {
      // Would hide loading indicator
      console.log('✅ Loading complete');
    }

    /**
     * Utility: Show success message
     */
  }, {
    key: "showSuccess",
    value: function showSuccess(message) {
      console.log('✅ Success:', message);
      // Would show success notification
    }

    /**
     * Utility: Show error message
     */
  }, {
    key: "showError",
    value: function showError(message) {
      console.error('❌ Error:', message);
      // Would show error notification
    }
  }]);
}();
/**
 * Initialize popup when DOM is ready
 */
document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
  var popupManager;
  return _regenerator().w(function (_context1) {
    while (1) switch (_context1.n) {
      case 0:
        console.log('🚀 Popup DOM loaded');
        popupManager = new PopupManager();
        _context1.n = 1;
        return popupManager.initialize();
      case 1:
        console.log('✅ Popup fully initialized');
      case 2:
        return _context1.a(2);
    }
  }, _callee1);
})));
/******/ })()
;
//# sourceMappingURL=popup.js.map