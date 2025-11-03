/******/ (() => { // webpackBootstrap
/*!*******************************!*\
  !*** ./content-integrated.js ***!
  \*******************************/
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
 * DVSA Queen - Integrated Content Script with Full Stealth
 * Advanced stealth automation for DVSA booking pages
 */
var DVSAQueenContent = /*#__PURE__*/function () {
  function DVSAQueenContent() {
    _classCallCheck(this, DVSAQueenContent);
    this.isActive = false;
    this.currentInstructor = null;
    this.pupils = [];
    this.settings = {
      autoCheck: true,
      checkInterval: 15000,
      soundEnabled: true,
      notifications: true,
      stealthLevel: 'HIGH'
    };
    this.stealthManager = null;
    this.sessionData = {
      startTime: Date.now(),
      totalOperations: 0,
      successfulOperations: 0,
      detectionRisk: 'LOW'
    };
  }

  /**
   * Initialize with full stealth integration
   */
  return _createClass(DVSAQueenContent, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              console.log('🚀 DVSA Queen - Advanced Stealth Mode Initializing...');

              // Wait for page readiness
              if (!(document.readyState === 'loading')) {
                _context.n = 1;
                break;
              }
              _context.n = 1;
              return new Promise(function (resolve) {
                return document.addEventListener('DOMContentLoaded', resolve);
              });
            case 1:
              if (this.isDVSAChangePage()) {
                _context.n = 2;
                break;
              }
              console.log('⚠️ Not on DVSA change page, extension inactive');
              return _context.a(2);
            case 2:
              console.log('✅ DVSA change page detected, initializing advanced stealth systems');
              _context.p = 3;
              // Initialize stealth manager
              this.stealthManager = new StealthManager();
              _context.n = 4;
              return this.stealthManager.initialize();
            case 4:
              _context.n = 5;
              return this.loadConfiguration();
            case 5:
              // Setup interface
              this.injectAdvancedInterface();
              this.setupAdvancedEventListeners();

              // Start monitoring with stealth
              if (!this.settings.autoCheck) {
                _context.n = 6;
                break;
              }
              _context.n = 6;
              return this.startStealthMonitoring();
            case 6:
              this.isActive = true;
              console.log('✅ DVSA Queen - Advanced Stealth Mode Fully Activated');
              _context.n = 8;
              break;
            case 7:
              _context.p = 7;
              _t = _context.v;
              console.error('❌ Advanced stealth initialization failed:', _t);
              this.handleInitializationError(_t);
            case 8:
              return _context.a(2);
          }
        }, _callee, this, [[3, 7]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Validate DVSA page context
     */
    )
  }, {
    key: "isDVSAChangePage",
    value: function isDVSAChangePage() {
      var url = window.location.href;
      return url.includes('driverpracticaltest.dvsa.gov.uk') && (url.includes('change') || url.includes('manage') || url.includes('reschedule') || url.includes('available') || url.includes('booking'));
    }

    /**
     * Load configuration from extension storage
     */
  }, {
    key: "loadConfiguration",
    value: (function () {
      var _loadConfiguration = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var response, _this$currentInstruct, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return chrome.runtime.sendMessage({
                action: 'getFullState'
              });
            case 1:
              response = _context2.v;
              if (response.success) {
                this.currentInstructor = response.state.currentInstructor;
                this.pupils = response.state.pupils || [];
                this.settings = _objectSpread(_objectSpread({}, this.settings), response.state.settings);
                console.log('✅ Configuration loaded:', {
                  instructor: (_this$currentInstruct = this.currentInstructor) === null || _this$currentInstruct === void 0 ? void 0 : _this$currentInstruct.adiNumber,
                  pupils: this.pupils.length,
                  settings: this.settings
                });
              }
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t2 = _context2.v;
              console.error('❌ Configuration load failed:', _t2);
              throw _t2;
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function loadConfiguration() {
        return _loadConfiguration.apply(this, arguments);
      }
      return loadConfiguration;
    }()
    /**
     * Inject advanced stealth interface
     */
    )
  }, {
    key: "injectAdvancedInterface",
    value: function injectAdvancedInterface() {
      // Remove any existing interface
      var existingPanel = document.getElementById('dvsa-queen-panel');
      if (existingPanel) {
        existingPanel.remove();
      }

      // Create advanced interface
      var panel = document.createElement('div');
      panel.id = 'dvsa-queen-panel';
      panel.className = 'stealth-mode';
      panel.innerHTML = this.getAdvancedInterfaceHTML();

      // Add advanced styles
      var style = document.createElement('style');
      style.textContent = this.getAdvancedStyles();
      document.head.appendChild(style);
      document.body.appendChild(panel);

      // Setup interface event listeners
      this.setupInterfaceEventListeners(panel);
      console.log('🎨 Advanced stealth interface injected');
    }

    /**
     * Get advanced interface HTML
     */
  }, {
    key: "getAdvancedInterfaceHTML",
    value: function getAdvancedInterfaceHTML() {
      return "\n      <div class=\"dvsa-queen-header\">\n        <div class=\"header-left\">\n          <span class=\"stealth-indicator\" title=\"Stealth Level: ".concat(this.settings.stealthLevel, "\"></span>\n          <span class=\"dvsa-queen-title\">DVSA Queen Pro</span>\n        </div>\n        <div class=\"header-right\">\n          <button class=\"minimize-btn\" title=\"Minimize\">\u2212</button>\n          <button class=\"close-btn\" title=\"Close\">\xD7</button>\n        </div>\n      </div>\n\n      <div class=\"dvsa-queen-content\">\n        <div class=\"stealth-status-bar\">\n          <div class=\"status-item\">\n            <span class=\"status-label\">Status:</span>\n            <span class=\"status-value\" id=\"status-text\">Ready</span>\n          </div>\n          <div class=\"status-item\">\n            <span class=\"status-label\">Risk:</span>\n            <span class=\"risk-indicator\" id=\"risk-level\">LOW</span>\n          </div>\n          <div class=\"status-item\">\n            <span class=\"status-label\">Ops:</span>\n            <span class=\"ops-counter\" id=\"ops-count\">0</span>\n          </div>\n        </div>\n\n        <div class=\"instructor-info\" id=\"instructor-info\">\n          <div class=\"info-row\">\n            <span class=\"info-label\">ADI:</span>\n            <span class=\"info-value\" id=\"adi-number\">Not Set</span>\n          </div>\n          <div class=\"info-row\">\n            <span class=\"info-label\">Pupils:</span>\n            <span class=\"info-value\" id=\"pupil-count\">0</span>\n          </div>\n        </div>\n\n        <div class=\"advanced-controls\">\n          <button class=\"primary-btn\" id=\"stealth-check-btn\">\n            <span class=\"btn-icon\">\uD83D\uDD0D</span>\n            Stealth Check\n          </button>\n          <button class=\"secondary-btn\" id=\"emergency-stop-btn\">\n            <span class=\"btn-icon\">\uD83D\uDED1</span>\n            Emergency Stop\n          </button>\n        </div>\n\n        <div class=\"stealth-metrics\">\n          <div class=\"metric-row\">\n            <span class=\"metric-label\">Detection Risk:</span>\n            <span class=\"metric-value\" id=\"detection-risk\">Low</span>\n          </div>\n          <div class=\"metric-row\">\n            <span class=\"metric-label\">Success Rate:</span>\n            <span class=\"metric-value\" id=\"success-rate\">0%</span>\n          </div>\n          <div class=\"metric-row\">\n            <span class=\"metric-label\">Last Check:</span>\n            <span class=\"metric-value\" id=\"last-check\">Never</span>\n          </div>\n        </div>\n\n        <div class=\"stealth-activity\">\n          <div class=\"activity-title\">Recent Activity</div>\n          <div class=\"activity-log\" id=\"activity-log\">\n            <div class=\"activity-item\">System initialized</div>\n          </div>\n        </div>\n      </div>\n    ");
    }

    /**
     * Get advanced styles
     */
  }, {
    key: "getAdvancedStyles",
    value: function getAdvancedStyles() {
      return "\n      #dvsa-queen-panel {\n        position: fixed;\n        top: 20px;\n        right: 20px;\n        width: 320px;\n        background: linear-gradient(135deg, #1a1a2e, #16213e);\n        border: 2px solid #0f3460;\n        border-radius: 12px;\n        box-shadow: 0 8px 32px rgba(0,0,0,0.3);\n        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        font-size: 13px;\n        z-index: 10000;\n        transition: all 0.3s ease;\n        backdrop-filter: blur(10px);\n      }\n\n      #dvsa-queen-panel.minimized {\n        width: 80px;\n        height: 50px;\n        overflow: hidden;\n      }\n\n      .dvsa-queen-header {\n        background: linear-gradient(90deg, #0f3460, #1d70b8);\n        color: white;\n        padding: 12px 16px;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        border-radius: 10px 10px 0 0;\n        cursor: move;\n      }\n\n      .header-left, .header-right {\n        display: flex;\n        align-items: center;\n        gap: 8px;\n      }\n\n      .stealth-indicator {\n        width: 8px;\n        height: 8px;\n        border-radius: 50%;\n        background: #00ff88;\n        box-shadow: 0 0 10px #00ff88;\n        animation: pulse 2s infinite;\n      }\n\n      @keyframes pulse {\n        0%, 100% { opacity: 1; }\n        50% { opacity: 0.5; }\n      }\n\n      .dvsa-queen-title {\n        font-weight: 600;\n        font-size: 16px;\n        letter-spacing: 0.5px;\n      }\n\n      .minimize-btn, .close-btn {\n        background: rgba(255,255,255,0.2);\n        border: none;\n        color: white;\n        width: 24px;\n        height: 24px;\n        border-radius: 4px;\n        cursor: pointer;\n        font-size: 16px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        transition: all 0.2s ease;\n      }\n\n      .minimize-btn:hover, .close-btn:hover {\n        background: rgba(255,255,255,0.3);\n        transform: scale(1.1);\n      }\n\n      .dvsa-queen-content {\n        padding: 16px;\n        color: #e0e6ed;\n      }\n\n      .stealth-status-bar {\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n        gap: 8px;\n        margin-bottom: 16px;\n        padding: 12px;\n        background: rgba(255,255,255,0.05);\n        border-radius: 8px;\n      }\n\n      .status-item {\n        text-align: center;\n      }\n\n      .status-label {\n        display: block;\n        font-size: 10px;\n        color: #a0a6ad;\n        margin-bottom: 4px;\n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n      }\n\n      .status-value, .risk-indicator, .ops-counter {\n        display: block;\n        font-weight: 600;\n        font-size: 12px;\n      }\n\n      .risk-indicator.LOW { color: #00ff88; }\n      .risk-indicator.MEDIUM { color: #ffaa00; }\n      .risk-indicator.HIGH { color: #ff4444; }\n\n      .instructor-info {\n        margin-bottom: 16px;\n        padding: 12px;\n        background: rgba(255,255,255,0.05);\n        border-radius: 8px;\n      }\n\n      .info-row {\n        display: flex;\n        justify-content: space-between;\n        margin-bottom: 4px;\n      }\n\n      .info-row:last-child {\n        margin-bottom: 0;\n      }\n\n      .info-label {\n        color: #a0a6ad;\n        font-size: 11px;\n      }\n\n      .info-value {\n        color: #ffffff;\n        font-weight: 500;\n        font-size: 11px;\n      }\n\n      .advanced-controls {\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        gap: 8px;\n        margin-bottom: 16px;\n      }\n\n      .primary-btn, .secondary-btn {\n        padding: 10px 12px;\n        border: none;\n        border-radius: 6px;\n        font-size: 12px;\n        font-weight: 600;\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        gap: 6px;\n        transition: all 0.2s ease;\n      }\n\n      .primary-btn {\n        background: linear-gradient(135deg, #00ff88, #00cc6a);\n        color: #0a0a0a;\n      }\n\n      .primary-btn:hover {\n        transform: translateY(-1px);\n        box-shadow: 0 4px 12px rgba(0,255,136,0.3);\n      }\n\n      .secondary-btn {\n        background: rgba(255,255,255,0.1);\n        color: #e0e6ed;\n        border: 1px solid rgba(255,255,255,0.2);\n      }\n\n      .secondary-btn:hover {\n        background: rgba(255,255,255,0.2);\n      }\n\n      .btn-icon {\n        font-size: 14px;\n      }\n\n      .stealth-metrics {\n        margin-bottom: 16px;\n      }\n\n      .metric-row {\n        display: flex;\n        justify-content: space-between;\n        margin-bottom: 6px;\n        padding: 4px 0;\n      }\n\n      .metric-label {\n        color: #a0a6ad;\n        font-size: 11px;\n      }\n\n      .metric-value {\n        color: #ffffff;\n        font-weight: 500;\n        font-size: 11px;\n      }\n\n      .stealth-activity {\n        border-top: 1px solid rgba(255,255,255,0.1);\n        padding-top: 12px;\n      }\n\n      .activity-title {\n        color: #a0a6ad;\n        font-size: 11px;\n        margin-bottom: 8px;\n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n      }\n\n      .activity-log {\n        max-height: 80px;\n        overflow-y: auto;\n      }\n\n      .activity-item {\n        font-size: 10px;\n        color: #c0c6cd;\n        margin-bottom: 4px;\n        padding: 2px 0;\n        border-left: 2px solid #1d70b8;\n        padding-left: 8px;\n      }\n\n      .activity-item.success {\n        border-left-color: #00ff88;\n      }\n\n      .activity-item.warning {\n        border-left-color: #ffaa00;\n      }\n\n      .activity-item.error {\n        border-left-color: #ff4444;\n      }\n\n      /* Scrollbar styling */\n      .activity-log::-webkit-scrollbar {\n        width: 4px;\n      }\n\n      .activity-log::-webkit-scrollbar-track {\n        background: rgba(255,255,255,0.05);\n        border-radius: 2px;\n      }\n\n      .activity-log::-webkit-scrollbar-thumb {\n        background: rgba(255,255,255,0.2);\n        border-radius: 2px;\n      }\n\n      .activity-log::-webkit-scrollbar-thumb:hover {\n        background: rgba(255,255,255,0.3);\n      }\n    ";
    }

    /**
     * Setup interface event listeners
     */
  }, {
    key: "setupInterfaceEventListeners",
    value: function setupInterfaceEventListeners(panel) {
      var _this = this;
      // Stealth check button
      panel.querySelector('#stealth-check-btn').addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return _this.performStealthCheck();
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      })));

      // Emergency stop button
      panel.querySelector('#emergency-stop-btn').addEventListener('click', function () {
        _this.emergencyStop();
      });

      // Minimize button
      panel.querySelector('.minimize-btn').addEventListener('click', function () {
        panel.classList.toggle('minimized');
      });

      // Close button
      panel.querySelector('.close-btn').addEventListener('click', function () {
        panel.style.display = 'none';
      });

      // Make panel draggable
      this.makePanelDraggable(panel);
    }

    /**
     * Setup advanced event listeners
     */
  }, {
    key: "setupAdvancedEventListeners",
    value: function setupAdvancedEventListeners() {
      var _this2 = this;
      // Chrome runtime messages
      chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        _this2.handleAdvancedMessage(message, sender, sendResponse);
        return true; // Keep message channel open for async responses
      });

      // Page navigation monitoring
      this.setupNavigationMonitoring();

      // Visibility change monitoring
      document.addEventListener('visibilitychange', function () {
        _this2.handleVisibilityChange();
      });
    }

    /**
     * Handle advanced messages
     */
  }, {
    key: "handleAdvancedMessage",
    value: (function () {
      var _handleAdvancedMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(message, sender, sendResponse) {
        var result, status, _t3, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              console.log('📨 Advanced message received:', message.action);
              _context4.p = 1;
              _t3 = message.action;
              _context4.n = _t3 === 'performStealthCheck' ? 2 : _t3 === 'getStealthStatus' ? 4 : _t3 === 'updateSettings' ? 5 : _t3 === 'emergencyStop' ? 7 : 8;
              break;
            case 2:
              _context4.n = 3;
              return this.performStealthCheck();
            case 3:
              result = _context4.v;
              sendResponse({
                success: true,
                result: result
              });
              return _context4.a(3, 9);
            case 4:
              status = this.getStealthStatus();
              sendResponse({
                success: true,
                status: status
              });
              return _context4.a(3, 9);
            case 5:
              _context4.n = 6;
              return this.updateStealthSettings(message.settings);
            case 6:
              sendResponse({
                success: true
              });
              return _context4.a(3, 9);
            case 7:
              this.emergencyStop();
              sendResponse({
                success: true
              });
              return _context4.a(3, 9);
            case 8:
              sendResponse({
                success: false,
                error: 'Unknown action'
              });
            case 9:
              _context4.n = 11;
              break;
            case 10:
              _context4.p = 10;
              _t4 = _context4.v;
              console.error('❌ Message handling error:', _t4);
              sendResponse({
                success: false,
                error: _t4.message
              });
            case 11:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 10]]);
      }));
      function handleAdvancedMessage(_x, _x2, _x3) {
        return _handleAdvancedMessage.apply(this, arguments);
      }
      return handleAdvancedMessage;
    }()
    /**
     * Perform stealth check with full protection
     */
    )
  }, {
    key: "performStealthCheck",
    value: (function () {
      var _performStealthCheck = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var _this3 = this;
        var result, _t5;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              console.log('🔍 Performing stealth check...');
              if (this.stealthManager) {
                _context6.n = 1;
                break;
              }
              throw new Error('Stealth Manager not initialized');
            case 1:
              this.updateInterfaceStatus('Checking...', 'warning');
              this.addActivityLog('Starting stealth check', 'info');
              _context6.p = 2;
              _context6.n = 3;
              return this.stealthManager.executeStealthOperation('checkAvailability', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
                return _regenerator().w(function (_context5) {
                  while (1) switch (_context5.n) {
                    case 0:
                      _context5.n = 1;
                      return _this3.checkForAvailableSlots();
                    case 1:
                      return _context5.a(2, _context5.v);
                  }
                }, _callee5);
              })), {
                operationContext: 'cancellation_check',
                instructor: this.currentInstructor,
                pupils: this.pupils.length
              });
            case 3:
              result = _context6.v;
              if (result.success) {
                this.handleSuccessfulCheck(result);
              } else {
                this.handleFailedCheck(result);
              }
              return _context6.a(2, result);
            case 4:
              _context6.p = 4;
              _t5 = _context6.v;
              console.error('❌ Stealth check failed:', _t5);
              this.addActivityLog('Stealth check failed: ' + _t5.message, 'error');
              throw _t5;
            case 5:
              return _context6.a(2);
          }
        }, _callee6, this, [[2, 4]]);
      }));
      function performStealthCheck() {
        return _performStealthCheck.apply(this, arguments);
      }
      return performStealthCheck;
    }()
    /**
     * Check for available slots (real implementation)
     */
    )
  }, {
    key: "checkForAvailableSlots",
    value: (function () {
      var _checkForAvailableSlots = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var _this4 = this;
        var availableSlots;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              console.log('🔍 Checking for available DVSA slots...');

              // Simulate realistic slot checking process
              _context7.n = 1;
              return this.simulateRealisticPageInteraction();
            case 1:
              // Real DVSA slot detection (replaces mock data)
              console.log('🔄 Initializing real DVSA slot detector...');

              // Initialize the slot detector (assuming it's already loaded)
              let availableSlots;

              try {
                // Check if the slot detector is available
                if (typeof DVSASlotDetector !== 'undefined') {
                  console.log('🔍 Starting real DVSA slot detection...');
                  const slotDetector = new DVSASlotDetector();
                  availableSlots = await slotDetector.detectAvailableSlots();
                  console.log(`✅ Real DVSA slot detection completed: ${availableSlots.length} slots found`);

                  // Add activity log for real detection
                  this.addActivityLog(`🔍 Real DVSA scan completed: ${availableSlots.length} slots detected`, 'success');
                } else {
                  console.warn('⚠️ DVSA Slot Detector not available, using fallback detection');
                  availableSlots = await this.performFallbackSlotDetection();
                }

              } catch (error) {
                console.error('❌ Real DVSA slot detection failed:', error);
                this.addActivityLog(`❌ DVSA scan failed: ${error.message}`, 'error');
                availableSlots = await this.performFallbackSlotDetection();
              }

              // Filter based on pupil preferences
              return _context7.a(2, availableSlots.filter(function (slot) {
                return _this4.matchesPupilPreferences(slot);
              }));
          }
        }, _callee7, this);
      }));
      function checkForAvailableSlots() {
        return _checkForAvailableSlots.apply(this, arguments);
      }
      return checkForAvailableSlots;
    }()
    /**
     * Simulate realistic page interaction
     */
    )
  }, {
    key: "simulateRealisticPageInteraction",
    value: (function () {
      var _simulateRealisticPageInteraction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var calendarElement;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return this.stealthManager.timingRandomizer.simulateThinking('normal');
            case 1:
              // Simulate mouse movement if elements exist
              calendarElement = document.querySelector('.calendar, .booking-calendar, [data-testid="calendar"]');
              if (!calendarElement) {
                _context8.n = 2;
                break;
              }
              _context8.n = 2;
              return this.stealthManager.mouseSimulator.simulateNaturalMovement(calendarElement);
            case 2:
              _context8.n = 3;
              return this.stealthManager.timingRandomizer.simulateReadingTime(document.body, {
                includeScroll: true
              });
            case 3:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function simulateRealisticPageInteraction() {
        return _simulateRealisticPageInteraction.apply(this, arguments);
      }
      return simulateRealisticPageInteraction;
    }()
    /**
     * Update interface with status
     */
    )
  }, {
    key: "updateInterfaceStatus",
    value: function updateInterfaceStatus(text) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'active';
      var statusText = document.getElementById('status-text');
      var riskLevel = document.getElementById('risk-level');
      if (statusText) statusText.textContent = text;
      if (riskLevel) {
        riskLevel.textContent = this.sessionData.detectionRisk;
        riskLevel.className = 'risk-indicator ' + this.sessionData.detectionRisk;
      }

      // Update ops counter
      var opsCount = document.getElementById('ops-count');
      if (opsCount) {
        opsCount.textContent = this.sessionData.totalOperations;
      }
    }

    /**
     * Add activity log entry
     */
  }, {
    key: "addActivityLog",
    value: function addActivityLog(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      var activityLog = document.getElementById('activity-log');
      if (!activityLog) return;
      var item = document.createElement('div');
      item.className = "activity-item ".concat(type);
      item.textContent = "[".concat(new Date().toLocaleTimeString(), "] ").concat(message);
      activityLog.insertBefore(item, activityLog.firstChild);

      // Keep only last 10 items
      while (activityLog.children.length > 10) {
        activityLog.removeChild(activityLog.lastChild);
      }
    }

    /**
     * Get stealth status
     */
  }, {
    key: "getStealthStatus",
    value: function getStealthStatus() {
      if (!this.stealthManager) {
        return {
          active: false,
          error: 'Not initialized'
        };
      }
      var stats = this.stealthManager.getStealthStatistics();
      return {
        active: this.isActive,
        stealthLevel: this.settings.stealthLevel,
        sessionAge: stats.sessionAge,
        totalOperations: stats.totalOperations,
        successRate: stats.successRate,
        detectionRisk: stats.currentRiskLevel,
        emergencyActivations: stats.emergencyActivations
      };
    }

    /**
     * Start stealth monitoring
     */
  }, {
    key: "startStealthMonitoring",
    value: (function () {
      var _startStealthMonitoring = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _this5 = this;
        var adaptiveInterval;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              console.log('🔍 Starting stealth monitoring...');
              if (this.stealthManager) {
                _context0.n = 1;
                break;
              }
              throw new Error('Stealth Manager not initialized');
            case 1:
              // Use adaptive timing from stealth manager
              adaptiveInterval = this.stealthManager.timingRandomizer.calculateAdaptiveCheckInterval({
                context: 'monitoring',
                successRate: this.sessionData.successfulOperations / Math.max(1, this.sessionData.totalOperations)
              });
              console.log("\u23F1\uFE0F Adaptive monitoring interval: ".concat(adaptiveInterval, "ms"));
              this.monitoringInterval = setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
                return _regenerator().w(function (_context9) {
                  while (1) switch (_context9.n) {
                    case 0:
                      _context9.n = 1;
                      return _this5.performStealthCheck();
                    case 1:
                      return _context9.a(2);
                  }
                }, _callee9);
              })), adaptiveInterval);
              this.addActivityLog('Stealth monitoring started', 'success');
            case 2:
              return _context0.a(2);
          }
        }, _callee0, this);
      }));
      function startStealthMonitoring() {
        return _startStealthMonitoring.apply(this, arguments);
      }
      return startStealthMonitoring;
    }()
    /**
     * Emergency stop function
     */
    )
  }, {
    key: "emergencyStop",
    value: function emergencyStop() {
      console.log('🛑 Emergency stop activated');
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }
      this.updateInterfaceStatus('EMERGENCY STOP', 'error');
      this.addActivityLog('EMERGENCY STOP ACTIVATED', 'error');

      // Notify background script
      chrome.runtime.sendMessage({
        action: 'emergencyStop',
        data: {
          timestamp: Date.now(),
          reason: 'User emergency stop'
        }
      });
    }

    /**
     * Handle successful check
     */
  }, {
    key: "handleSuccessfulCheck",
    value: function handleSuccessfulCheck(result) {
      console.log('✅ Stealth check successful:', result);
      this.sessionData.successfulOperations++;
      this.sessionData.totalOperations++;
      this.sessionData.detectionRisk = result.riskLevel;
      this.updateInterfaceStatus('Check Complete', 'active');
      this.addActivityLog("Check completed - Risk: ".concat(result.riskLevel), 'success');

      // Handle found slots
      if (result.result && result.result.length > 0) {
        this.handleFoundSlots(result.result);
      }
    }

    /**
     * Handle failed check
     */
  }, {
    key: "handleFailedCheck",
    value: function handleFailedCheck(result) {
      console.log('❌ Stealth check failed:', result);
      this.sessionData.totalOperations++;
      this.sessionData.detectionRisk = result.riskLevel || 'HIGH';
      this.updateInterfaceStatus('Check Failed', 'error');
      this.addActivityLog("Check failed - Risk: ".concat(result.riskLevel), 'error');
      if (result.blocked) {
        this.addActivityLog('Operation blocked due to high risk', 'warning');
      }
    }

    /**
     * Handle found slots
     */
  }, {
    key: "handleFoundSlots",
    value: (function () {
      var _handleFoundSlots = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(slots) {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              console.log('🎯 Found available slots:', slots);
              this.addActivityLog("Found ".concat(slots.length, " available slots"), 'success');

              // Send notification to background script
              _context1.n = 1;
              return chrome.runtime.sendMessage({
                action: 'foundCancellation',
                data: {
                  slots: slots,
                  timestamp: Date.now(),
                  instructor: this.currentInstructor,
                  pupils: this.pupils.length
                }
              });
            case 1:
              // Highlight slots in page
              this.highlightAvailableSlots(slots);
            case 2:
              return _context1.a(2);
          }
        }, _callee1, this);
      }));
      function handleFoundSlots(_x4) {
        return _handleFoundSlots.apply(this, arguments);
      }
      return handleFoundSlots;
    }()
    /**
     * Utility methods
     */
    )
  }, {
    key: "makePanelDraggable",
    value: function makePanelDraggable(panel) {
      var isDragging = false;
      var currentX,
        currentY,
        initialX,
        initialY,
        xOffset = 0,
        yOffset = 0;
      var header = panel.querySelector('.dvsa-queen-header');
      header.addEventListener('mousedown', dragStart);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);
      function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === header || header.contains(e.target)) {
          isDragging = true;
        }
      }
      function drag(e) {
        if (isDragging) {
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          xOffset = currentX;
          yOffset = currentY;
          panel.style.transform = "translate(".concat(currentX, "px, ").concat(currentY, "px)");
        }
      }
      function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
      }
    }
  }, {
    key: "setupNavigationMonitoring",
    value: function setupNavigationMonitoring() {
      var _this6 = this;
      var lastUrl = location.href;
      new MutationObserver(function () {
        var url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          _this6.handleUrlChange(url);
        }
      }).observe(document, {
        subtree: true,
        childList: true
      });
    }
  }, {
    key: "handleUrlChange",
    value: function () {
      var _handleUrlChange = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(url) {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              console.log('🔄 URL changed:', url);
              if (this.isDVSAChangePage()) {
                this.updateInterfaceStatus('Active', 'active');
              } else {
                this.updateInterfaceStatus('Inactive', 'inactive');
                if (this.monitoringInterval) {
                  clearInterval(this.monitoringInterval);
                  this.monitoringInterval = null;
                }
              }
            case 1:
              return _context10.a(2);
          }
        }, _callee10, this);
      }));
      function handleUrlChange(_x5) {
        return _handleUrlChange.apply(this, arguments);
      }
      return handleUrlChange;
    }()
  }, {
    key: "handleVisibilityChange",
    value: function handleVisibilityChange() {
      if (document.hidden) {
        console.log('📋 Page hidden - pausing operations');
        // Could pause operations when page is hidden
      } else {
        console.log('📋 Page visible - resuming operations');
        // Could resume operations when page becomes visible
      }
    }
  }, {
    key: "handleInitializationError",
    value: function handleInitializationError(error) {
      console.error('❌ Initialization error:', error);
      this.addActivityLog('Initialization failed: ' + error.message, 'error');

      // Send error to background script
      chrome.runtime.sendMessage({
        action: 'initializationError',
        data: {
          error: error.message,
          timestamp: Date.now(),
          url: window.location.href
        }
      });
    }
  }, {
    key: "updateStealthSettings",
    value: function updateStealthSettings(newSettings) {
      this.settings = _objectSpread(_objectSpread({}, this.settings), newSettings);
      console.log('⚙️ Stealth settings updated:', this.settings);
    }
  }, {
    key: "matchesPupilPreferences",
    value: function matchesPupilPreferences(slot) {
      // Would implement real pupil preference matching
      return true;
    }
  }, {
    key: "highlightAvailableSlots",
    value: function highlightAvailableSlots(slots) {
      // Would implement slot highlighting in DVSA page
      console.log('🎨 Highlighting slots:', slots);
    }
  }]);
}();
/**
 * Initialize advanced stealth content script
 */
(function () {
  'use strict';

  // Validate DVSA domain
  if (!window.location.href.includes('driverpracticaltest.dvsa.gov.uk')) {
    return;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdvancedStealth);
  } else {
    initializeAdvancedStealth();
  }
  function initializeAdvancedStealth() {
    return _initializeAdvancedStealth.apply(this, arguments);
  }
  function _initializeAdvancedStealth() {
    _initializeAdvancedStealth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      var dvsaQueen, _t6;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.p = _context11.n) {
          case 0:
            console.log('🚀 Initializing DVSA Queen Advanced Stealth System');
            _context11.p = 1;
            dvsaQueen = new DVSAQueenContent();
            _context11.n = 2;
            return dvsaQueen.initialize();
          case 2:
            // Make globally accessible for debugging
            window.dvsaQueen = dvsaQueen;
            console.log('✅ DVSA Queen Advanced Stealth System Fully Activated');
            _context11.n = 4;
            break;
          case 3:
            _context11.p = 3;
            _t6 = _context11.v;
            console.error('❌ Advanced stealth initialization failed:', _t6);
          case 4:
            return _context11.a(2);
        }
      }, _callee11, null, [[1, 3]]);
    }));
    return _initializeAdvancedStealth.apply(this, arguments);
  }
})();
/******/ })()
;
//# sourceMappingURL=content-script.js.map