/**
 * Device Fingerprinting - Prevent subscription sharing and abuse
 * Generates unique device/browser fingerprints for session management
 */

class DeviceFingerprint {
  constructor() {
    this.fingerprint = null;
    this.sessionData = null;
    this.maxSessions = 2; // Maximum concurrent sessions per subscription
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  /**
   * Generate comprehensive device fingerprint
   */
  async generateFingerprint() {
    try {
      const components = await this.collectFingerprintComponents();
      const fingerprint = this.hashComponents(components);

      console.log('🔍 Device fingerprint generated:', fingerprint.substring(0, 8) + '...');
      return fingerprint;
    } catch (error) {
      console.error('❌ Failed to generate device fingerprint:', error);
      return this.generateFallbackFingerprint();
    }
  }

  /**
   * Collect all fingerprint components
   */
  async collectFingerprintComponents() {
    const components = {
      // Browser and system info
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,

      // Screen and display info
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenDepth: screen.colorDepth,
      screenOrientation: screen.orientation?.type || 'unknown',
      devicePixelRatio: window.devicePixelRatio,

      // Browser capabilities
      webglVendor: await this.getWebGLVendor(),
      webglRenderer: await this.getWebGLRenderer(),
      canvasFingerprint: await this.getCanvasFingerprint(),
      audioFingerprint: await this.getAudioFingerprint(),

      // Timezone and locale
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),

      // Browser plugins and features
      plugins: this.getPluginsList(),
      fonts: await this.getFontsList(),

      // Hardware info (if available)
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      memory: navigator.deviceMemory || 0,

      // Network info
      connection: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 0,

      // Touch and input capabilities
      maxTouchPoints: navigator.maxTouchPoints || 0,
      touchSupport: 'ontouchstart' in window,

      // Storage info
      localStorage: this.checkLocalStorageSupport(),
      sessionStorage: this.checkSessionStorageSupport(),
      indexedDB: this.checkIndexedDBSupport(),

      // Advanced features
      webRTCSupport: this.checkWebRTCSupport(),
      serviceWorkerSupport: 'serviceWorker' in navigator,

      // Browser specific
      chromeRuntime: typeof chrome !== 'undefined' && chrome.runtime,
      extensionId: chrome.runtime?.id || 'unknown'
    };

    return components;
  }

  /**
   * Get WebGL vendor and renderer info
   */
  async getWebGLVendor() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'not_supported';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      }
      return 'unknown';
    } catch (e) {
      return 'error';
    }
  }

  /**
   * Get WebGL renderer info
   */
  async getWebGLRenderer() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'not_supported';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      return 'unknown';
    } catch (e) {
      return 'error';
    }
  }

  /**
   * Get canvas fingerprint
   */
  async getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Draw some text and shapes
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('TestNotifier Device Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Chrome Extension', 4, 45);

      // Add some noise
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
        ctx.fillRect(Math.random() * 200, Math.random() * 100, Math.random() * 10, Math.random() * 10);
      }

      return canvas.toDataURL();
    } catch (e) {
      return 'canvas_error';
    }
  }

  /**
   * Get audio fingerprint
   */
  async getAudioFingerprint() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(audioContext.destination);

      return new Promise((resolve) => {
        scriptProcessor.onaudioprocess = function(bins) {
          const data = bins.inputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum += Math.abs(data[i]);
          }

          audioContext.close();
          resolve(sum.toString());
        };

        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 0.1);
      });
    } catch (e) {
      return 'audio_error';
    }
  }

  /**
   * Get plugins list
   */
  getPluginsList() {
    try {
      const plugins = [];
      if (navigator.plugins) {
        for (let i = 0; i < navigator.plugins.length; i++) {
          plugins.push(navigator.plugins[i].name);
        }
      }
      return plugins.join(',');
    } catch (e) {
      return 'plugins_error';
    }
  }

  /**
   * Get fonts list (basic detection)
   */
  async getFontsList() {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmwwwwwww';
    const testSize = '72px';
    const h = document.getElementsByTagName('body')[0];
    const baseFontsDiv = document.createElement('div');

    baseFontsDiv.style.position = 'absolute';
    baseFontsDiv.style.left = '-9999px';
    baseFontsDiv.style.fontSize = testSize;
    baseFontsDiv.innerHTML = testString;
    h.appendChild(baseFontsDiv);

    const baseWidth = baseFontsDiv.offsetWidth;
    const baseHeight = baseFontsDiv.offsetHeight;

    const fontsToTest = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact'
    ];

    const detectedFonts = [];

    for (let font of fontsToTest) {
      baseFontsDiv.style.fontFamily = font + ',' + baseFonts[0];
      if (baseFontsDiv.offsetWidth !== baseWidth || baseFontsDiv.offsetHeight !== baseHeight) {
        detectedFonts.push(font);
      }
    }

    h.removeChild(baseFontsDiv);
    return detectedFonts.join(',');
  }

  /**
   * Check storage support
   */
  checkLocalStorageSupport() {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check session storage support
   */
  checkSessionStorageSupport() {
    try {
      return typeof sessionStorage !== 'undefined' && sessionStorage !== null;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check IndexedDB support
   */
  checkIndexedDBSupport() {
    try {
      return typeof indexedDB !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  /**
   * Check WebRTC support
   */
  checkWebRTCSupport() {
    try {
      return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
    } catch (e) {
      return false;
    }
  }

  /**
   * Generate fallback fingerprint if main generation fails
   */
  generateFallbackFingerprint() {
    const basicComponents = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset()
    ];

    return this.hashComponents(basicComponents.join('|'));
  }

  /**
   * Hash fingerprint components
   */
  hashComponents(components) {
    // Simple hash function (not cryptographically secure but sufficient for fingerprinting)
    let hash = 0;
    const str = JSON.stringify(components);

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Get or generate device fingerprint
   */
  async getFingerprint() {
    if (!this.fingerprint) {
      this.fingerprint = await this.generateFingerprint();
    }
    return this.fingerprint;
  }

  /**
   * Validate session against device fingerprint
   */
  async validateSession(userId, authToken) {
    try {
      const fingerprint = await this.getFingerprint();

      // Get active sessions for this user
      const response = await fetch(`${API_BASE_URL}/api/sessions/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          userId: userId,
          deviceFingerprint: fingerprint,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Session validation failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Session validation error:', error);
      return { valid: false, reason: 'validation_error' };
    }
  }

  /**
   * Register device session
   */
  async registerSession(userId, authToken) {
    try {
      const fingerprint = await this.getFingerprint();

      const response = await fetch(`${API_BASE_URL}/api/sessions/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          userId: userId,
          deviceFingerprint: fingerprint,
          userAgent: navigator.userAgent,
          screenInfo: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          },
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Session registration failed');
      }

      const result = await response.json();

      // Store session data locally
      this.sessionData = {
        sessionId: result.sessionId,
        userId: userId,
        deviceFingerprint: fingerprint,
        expiresAt: Date.now() + this.sessionTimeout
      };

      // Store in Chrome storage
      await chrome.storage.local.set({
        sessionData: this.sessionData
      });

      console.log('✅ Device session registered:', result.sessionId);
      return result;
    } catch (error) {
      console.error('❌ Session registration error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if current session is valid
   */
  async isSessionValid(userId, authToken) {
    try {
      // Check if session data exists locally
      const result = await chrome.storage.local.get('sessionData');
      const localSession = result.sessionData;

      if (!localSession || Date.now() > localSession.expiresAt) {
        console.log('⚠️ Local session expired or missing');
        return false;
      }

      // Validate with server
      const validation = await this.validateSession(userId, authToken);

      if (!validation.valid) {
        console.log('⚠️ Server session validation failed:', validation.reason);

        // Handle specific cases
        if (validation.reason === 'device_limit_exceeded') {
          this.showDeviceLimitExceeded();
        } else if (validation.reason === 'session_expired') {
          this.showSessionExpired();
        }

        return false;
      }

      // Update local session expiry
      localSession.expiresAt = Date.now() + this.sessionTimeout;
      await chrome.storage.local.set({ sessionData: localSession });

      return true;
    } catch (error) {
      console.error('❌ Session validation error:', error);
      return false;
    }
  }

  /**
   * Force logout (for when device limit is exceeded)
   */
  async forceLogout() {
    try {
      // Clear local session data
      await chrome.storage.local.remove('sessionData');
      await chrome.storage.local.remove('auth_token');
      await chrome.storage.local.remove('user_data');

      this.sessionData = null;

      // Notify components
      chrome.runtime.sendMessage({
        action: 'forceLogout',
        reason: 'device_limit_exceeded'
      });

      console.log('🔒 Force logout completed');
    } catch (error) {
      console.error('❌ Force logout error:', error);
    }
  }

  /**
   * Show device limit exceeded message
   */
  showDeviceLimitExceeded() {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: {
        type: 'device_limit_exceeded',
        title: '🚫 Device Limit Reached',
        message: 'You have reached the maximum number of devices for your subscription. Please log out from other devices or upgrade your plan.',
        cta: 'Manage Devices',
        ctaLink: 'https://testnotifier.co.uk/account/devices'
      }
    });
  }

  /**
   * Show session expired message
   */
  showSessionExpired() {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      notification: {
        type: 'session_expired',
        title: '⌛ Session Expired',
        message: 'Your session has expired. Please log in again to continue using TestNotifier.',
        cta: 'Log In',
        ctaLink: 'https://testnotifier.co.uk/auth/login'
      }
    });
  }

  /**
   * Get session info for display
   */
  getSessionInfo() {
    if (!this.sessionData) return null;

    return {
      sessionId: this.sessionData.sessionId,
      deviceFingerprint: this.sessionData.deviceFingerprint,
      expiresAt: this.sessionData.expiresAt,
      isExpired: Date.now() > this.sessionData.expiresAt,
      timeRemaining: Math.max(0, this.sessionData.expiresAt - Date.now())
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeviceFingerprint;
} else {
  window.DeviceFingerprint = DeviceFingerprint;
}