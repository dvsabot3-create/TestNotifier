import { trackSecurityEvent } from './analytics';
import { logSecurityEvent } from './logging';

// Security configuration
interface SecurityConfig {
  rateLimitWindow: number; // milliseconds
  maxRequestsPerWindow: number;
  maxFailedAttempts: number;
  lockoutDuration: number; // milliseconds
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number; // milliseconds
  enableCSRFProtection: boolean;
  enableInputValidation: boolean;
  enableXSSProtection: boolean;
  enableRateLimiting: boolean;
}

const securityConfig: SecurityConfig = {
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  maxRequestsPerWindow: 100,
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  enableCSRFProtection: true,
  enableInputValidation: true,
  enableXSSProtection: true,
  enableRateLimiting: true
};

// Rate limiting storage
class RateLimiter {
  private requests = new Map<string, number[]>();
  private failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

  /**
   * Check if request should be rate limited
   */
  checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    if (!securityConfig.enableRateLimiting) {
      return { allowed: true, remaining: securityConfig.maxRequestsPerWindow, resetTime: Date.now() };
    }

    const now = Date.now();
    const windowStart = now - securityConfig.rateLimitWindow;

    // Clean old requests
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => time > windowStart);

    // Check failed attempts lockout
    const failedData = this.failedAttempts.get(identifier);
    if (failedData && failedData.count >= securityConfig.maxFailedAttempts) {
      const lockoutEnd = failedData.lastAttempt + securityConfig.lockoutDuration;
      if (now < lockoutEnd) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: lockoutEnd
        };
      } else {
        // Reset failed attempts after lockout period
        this.failedAttempts.delete(identifier);
      }
    }

    // Check rate limit
    if (validRequests.length >= securityConfig.maxRequestsPerWindow) {
      const oldestRequest = validRequests[0];
      const resetTime = oldestRequest + securityConfig.rateLimitWindow;

      return {
        allowed: false,
        remaining: 0,
        resetTime
      };
    }

    return {
      allowed: true,
      remaining: securityConfig.maxRequestsPerWindow - validRequests.length,
      resetTime: now + securityConfig.rateLimitWindow
    };
  }

  /**
   * Record successful request
   */
  recordRequest(identifier: string): void {
    if (!securityConfig.enableRateLimiting) return;

    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    userRequests.push(now);
    this.requests.set(identifier, userRequests);
  }

  /**
   * Record failed attempt
   */
  recordFailedAttempt(identifier: string): void {
    if (!securityConfig.enableRateLimiting) return;

    const now = Date.now();
    const failedData = this.failedAttempts.get(identifier) || { count: 0, lastAttempt: 0 };

    failedData.count++;
    failedData.lastAttempt = now;

    this.failedAttempts.set(identifier, failedData);

    // Track security event
    trackSecurityEvent('failed_attempt_recorded', 'medium', {
      identifier,
      attemptCount: failedData.count
    });
  }

  /**
   * Clean up old entries
   */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - securityConfig.rateLimitWindow;
    const lockoutStart = now - securityConfig.lockoutDuration;

    // Clean old requests
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }

    // Clean old failed attempts
    for (const [identifier, failedData] of this.failedAttempts.entries()) {
      if (failedData.lastAttempt < lockoutStart) {
        this.failedAttempts.delete(identifier);
      }
    }
  }
}

// Input validation utilities
export class InputValidator {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < securityConfig.passwordMinLength) {
      errors.push(`Password must be at least ${securityConfig.passwordMinLength} characters long`);
    }

    if (securityConfig.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (securityConfig.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (securityConfig.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (securityConfig.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common passwords
    const commonPasswords = [
      'password', '123456', '12345678', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a stronger password');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate phone number
   */
  static isValidPhoneNumber(phone: string): boolean {
    // UK phone number validation
    const ukPhoneRegex = /^(\+44|0)[1-9]\d{9,10}$/;
    return ukPhoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validate postal code
   */
  static isValidPostalCode(postcode: string): boolean {
    // UK postal code validation
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim());
  }

  /**
   * Validate DVSA license number format
   */
  static isValidLicenseNumber(licenseNumber: string): boolean {
    // UK driving license number validation
    const licenseRegex = /^[A-Z9]{5}\d{6}[A-Z9]{2}\d[A-Z]{2}$/i;
    return licenseRegex.test(licenseNumber.replace(/\s/g, ''));
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    if (!securityConfig.enableXSSProtection) return input;

    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/\u003cscript\u003e/gi, '')
      .replace(/javascript:/gi, '');
  }

  /**
   * Validate input length
   */
  static validateLength(input: string, minLength: number, maxLength: number): boolean {
    return input.length >= minLength && input.length <= maxLength;
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file: File, allowedTypes: string[], maxSizeMB: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Check for potential malicious content in filename
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    const hasDangerousExtension = dangerousExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (hasDangerousExtension) {
      errors.push('File type is potentially dangerous and not allowed');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// CSRF Protection
export class CSRFProtection {
  private static token: string | null = null;

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get or create CSRF token
   */
  static getToken(): string {
    if (!this.token) {
      this.token = this.generateToken();
      sessionStorage.setItem('csrf_token', this.token);
    }
    return this.token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }

  /**
   * Clear CSRF token
   */
  static clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('csrf_token');
  }
}

// Session Management
export class SessionManager {
  private static sessionTimeout: NodeJS.Timeout | null = null;

  /**
   * Start session timeout
   */
  static startSessionTimeout(): void {
    this.clearSessionTimeout();

    this.sessionTimeout = setTimeout(() => {
      this.handleSessionTimeout();
    }, securityConfig.sessionTimeout);
  }

  /**
   * Clear session timeout
   */
  static clearSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  /**
   * Reset session timeout
   */
  static resetSessionTimeout(): void {
    this.startSessionTimeout();
  }

  /**
   * Handle session timeout
   */
  private static handleSessionTimeout(): void {
    logSecurityEvent('session_timeout', 'low');
    trackSecurityEvent('session_timeout', 'low');

    // Clear authentication
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    CSRFProtection.clearToken();

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?timeout=true';
    }
  }

  /**
   * Check if session is valid
   */
  static isSessionValid(): boolean {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token || !userData) {
      return false;
    }

    try {
      const user = JSON.parse(userData);
      const tokenExpiry = user.tokenExpiry;

      if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Security Headers
export class SecurityHeaders {
  /**
   * Get recommended security headers
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    };
  }

  /**
   * Apply security headers to fetch request
   */
  static applySecurityHeaders(headers: Record<string, string> = {}): Record<string, string> {
    return {
      ...headers,
      ...this.getSecurityHeaders()
    };
  }
}

// Main Security Manager
export class SecurityManager {
  private static rateLimiter = new RateLimiter();

  /**
   * Initialize security features
   */
  static initialize(): void {
    // Start rate limiter cleanup
    setInterval(() => {
      this.rateLimiter.cleanup();
    }, 5 * 60 * 1000); // Clean up every 5 minutes

    // Start session timeout if user is logged in
    if (SessionManager.isSessionValid()) {
      SessionManager.startSessionTimeout();
    }

    // Add event listeners for user activity
    this.setupActivityListeners();

    logInfo('security', 'Security manager initialized');
  }

  /**
   * Setup activity listeners for session management
   */
  private static setupActivityListeners(): void {
    if (typeof window === 'undefined') return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        if (SessionManager.isSessionValid()) {
          SessionManager.resetSessionTimeout();
        }
      }, true);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && SessionManager.isSessionValid()) {
        SessionManager.resetSessionTimeout();
      }
    });
  }

  /**
   * Check rate limit for a user/action
   */
  static checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const result = this.rateLimiter.checkRateLimit(identifier);

    if (!result.allowed) {
      trackSecurityEvent('rate_limit_exceeded', 'medium', {
        identifier,
        remaining: result.remaining
      });
    }

    return result;
  }

  /**
   * Record successful request
   */
  static recordRequest(identifier: string): void {
    this.rateLimiter.recordRequest(identifier);
  }

  /**
   * Record failed attempt
   */
  static recordFailedAttempt(identifier: string): void {
    this.rateLimiter.recordFailedAttempt(identifier);
  }

  /**
   * Validate authentication token
   */
  static validateAuthToken(token: string): boolean {
    if (!token || token.length < 10) {
      return false;
    }

    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize data for API requests
   */
  static sanitizeApiData(data: any): any {
    if (typeof data === 'string') {
      return InputValidator.sanitizeInput(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeApiData(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeApiData(data[key]);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Generate secure random string
   */
  static generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash sensitive data (one-way)
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt sensitive data (reversible)
   */
  static async encryptData(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(key);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const ivArray = Array.from(iv);

    return btoa(JSON.stringify({
      iv: ivArray.map(b => b.toString(16).padStart(2, '0')).join(''),
      data: encryptedArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }));
  }

  /**
   * Decrypt sensitive data
   */
  static async decryptData(encryptedData: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(key);

    const { iv, data } = JSON.parse(atob(encryptedData));

    const ivArray = iv.match(/.{2}/g).map((byte: string) => parseInt(byte, 16));
    const dataArray = data.match(/.{2}/g).map((byte: string) => parseInt(byte, 16));

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(ivArray) },
      cryptoKey,
      new Uint8Array(dataArray)
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }
}

// Export singleton instance
export const securityManager = SecurityManager;

// Export utility functions
export {
  InputValidator,
  CSRFProtection,
  SessionManager,
  SecurityHeaders,
  RateLimiter
};

export default securityManager;