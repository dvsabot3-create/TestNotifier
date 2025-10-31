/**
 * Input Validation and Sanitization System
 * Prevents XSS, injection attacks, and data corruption
 */

class InputValidator {
  constructor() {
    this.sanitizationRules = {
      name: { maxLength: 100, pattern: /^[a-zA-Z\s\-'\.]+$/ },
      email: { maxLength: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { maxLength: 20, pattern: /^\+?[0-9\s\-\(\)]+$/ },
      licenceNumber: { maxLength: 20, pattern: /^[A-Z0-9]+$/ },
      testCentre: { maxLength: 100, pattern: /^[a-zA-Z0-9\s\-,\.\(\)]+$/ },
      testReference: { maxLength: 16, pattern: /^[A-Z0-9]{8,16}$/ },
      postcode: { maxLength: 10, pattern: /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$/i }
    };

    this.rateLimiter = new Map();
    this.maxAttempts = 10;
    this.timeWindow = 60000; // 1 minute
  }

  /**
   * Sanitize pupil data before storage/processing
   * @param {Object} pupilData - Raw pupil data
   * @returns {Object} Sanitized pupil data
   */
  sanitizePupilData(pupilData) {
    try {
      const sanitized = {
        id: this.sanitizeId(pupilData.id),
        name: this.sanitizeName(pupilData.name),
        licenceNumber: this.validateLicenceNumber(pupilData.licenceNumber),
        phone: this.validatePhoneNumber(pupilData.contact?.phone),
        email: this.validateEmail(pupilData.contact?.email),
        testCentre: this.sanitizeTestCentre(pupilData.testCentre),
        testReference: this.validateTestReference(pupilData.testReference),
        postcode: this.validatePostcode(pupilData.postcode),
        notes: this.sanitizeText(pupilData.notes, 500),
        createdAt: pupilData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Remove any undefined/null values
      Object.keys(sanitized).forEach(key => {
        if (sanitized[key] === undefined || sanitized[key] === null) {
          delete sanitized[key];
        }
      });

      return sanitized;
    } catch (error) {
      console.error('[InputValidator] Error sanitizing pupil data:', error);
      throw new Error(`Invalid pupil data: ${error.message}`);
    }
  }

  /**
   * Sanitize user input text
   * @param {string} text - Raw text input
   * @param {number} maxLength - Maximum allowed length
   * @returns {string} Sanitized text
   */
  sanitizeText(text, maxLength = 1000) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // Trim whitespace
    let sanitized = text.trim();

    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // Remove HTML/script tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Escape special characters to prevent XSS
    sanitized = this.escapeHtml(sanitized);

    // Remove control characters (except common whitespace)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Normalize Unicode to prevent homograph attacks
    sanitized = sanitized.normalize('NFKC');

    return sanitized;
  }

  /**
   * Sanitize name field
   * @param {string} name - Raw name input
   * @returns {string} Sanitized name
   */
  sanitizeName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name is required');
    }

    const sanitized = this.sanitizeText(name, this.sanitizationRules.name.maxLength);

    if (!this.sanitizationRules.name.pattern.test(sanitized)) {
      throw new Error('Name contains invalid characters. Only letters, spaces, hyphens, apostrophes, and periods are allowed.');
    }

    // Capitalize first letter of each word
    return sanitized.replace(/\b\w/g, char => char.toUpperCase());
  }

  /**
   * Sanitize ID field
   * @param {string} id - Raw ID input
   * @returns {string} Sanitized ID
   */
  sanitizeId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('ID is required');
    }

    // Remove any non-alphanumeric characters
    const sanitized = id.replace(/[^a-zA-Z0-9-_]/g, '');

    if (sanitized.length === 0) {
      throw new Error('ID cannot be empty after sanitization');
    }

    return sanitized;
  }

  /**
   * Validate and sanitize email address
   * @param {string} email - Raw email input
   * @returns {string} Validated email
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail.length > this.sanitizationRules.email.maxLength) {
      throw new Error(`Email too long (max ${this.sanitizationRules.email.maxLength} characters)`);
    }

    if (!this.sanitizationRules.email.pattern.test(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    // Additional email validation
    const [localPart, domain] = trimmedEmail.split('@');

    if (localPart.length === 0 || domain.length === 0) {
      throw new Error('Invalid email format');
    }

    if (localPart.length > 64) {
      throw new Error('Email local part too long (max 64 characters)');
    }

    // Check for suspicious patterns
    if (this.isSuspiciousEmail(trimmedEmail)) {
      throw new Error('Email address appears suspicious');
    }

    return trimmedEmail;
  }

  /**
   * Validate phone number
   * @param {string} phone - Raw phone input
   * @returns {string} Validated phone number
   */
  validatePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Phone number is required');
    }

    const cleanedPhone = phone.replace(/[\s-\(\)]/g, '');

    if (cleanedPhone.length > this.sanitizationRules.phone.maxLength) {
      throw new Error(`Phone number too long (max ${this.sanitizationRules.phone.maxLength} characters)`);
    }

    if (!this.sanitizationRules.phone.pattern.test(cleanedPhone)) {
      throw new Error('Invalid phone number format');
    }

    // UK phone number validation (simplified)
    if (cleanedPhone.startsWith('+44')) {
      if (cleanedPhone.length !== 13) {
        throw new Error('Invalid UK international phone number format');
      }
    } else if (cleanedPhone.startsWith('0')) {
      if (cleanedPhone.length !== 11) {
        throw new Error('Invalid UK phone number format');
      }
    } else {
      throw new Error('Phone number must start with +44 or 0');
    }

    return cleanedPhone;
  }

  /**
   * Validate driving licence number
   * @param {string} licenceNumber - Raw licence number
   * @returns {string} Validated licence number
   */
  validateLicenceNumber(licenceNumber) {
    if (!licenceNumber || typeof licenceNumber !== 'string') {
      throw new Error('Licence number is required');
    }

    const cleaned = licenceNumber.toUpperCase().replace(/[\s-]/g, '');

    if (cleaned.length > this.sanitizationRules.licenceNumber.maxLength) {
      throw new Error(`Licence number too long (max ${this.sanitizationRules.licenceNumber.maxLength} characters)`);
    }

    if (!this.sanitizationRules.licenceNumber.pattern.test(cleaned)) {
      throw new Error('Licence number can only contain letters and numbers');
    }

    return cleaned;
  }

  /**
   * Sanitize test centre name
   * @param {string} testCentre - Raw test centre name
   * @returns {string} Sanitized test centre name
   */
  sanitizeTestCentre(testCentre) {
    if (!testCentre || typeof testCentre !== 'string') {
      throw new Error('Test centre is required');
    }

    const sanitized = this.sanitizeText(testCentre, this.sanitizationRules.testCentre.maxLength);

    if (!this.sanitizationRules.testCentre.pattern.test(sanitized)) {
      throw new Error('Test centre name contains invalid characters');
    }

    return sanitized;
  }

  /**
   * Validate test reference number
   * @param {string} testReference - Raw test reference
   * @returns {string} Validated test reference
   */
  validateTestReference(testReference) {
    if (!testReference || typeof testReference !== 'string') {
      throw new Error('Test reference is required');
    }

    const cleaned = testReference.toUpperCase().replace(/[\s-]/g, '');

    if (cleaned.length > this.sanitizationRules.testReference.maxLength) {
      throw new Error(`Test reference too long (max ${this.sanitizationRules.testReference.maxLength} characters)`);
    }

    if (!this.sanitizationRules.testReference.pattern.test(cleaned)) {
      throw new Error('Test reference must be 8-16 alphanumeric characters');
    }

    return cleaned;
  }

  /**
   * Validate UK postcode
   * @param {string} postcode - Raw postcode
   * @returns {string} Validated postcode
   */
  validatePostcode(postcode) {
    if (!postcode || typeof postcode !== 'string') {
      throw new Error('Postcode is required');
    }

    const cleaned = postcode.toUpperCase().replace(/\s/g, '');

    if (cleaned.length > this.sanitizationRules.postcode.maxLength) {
      throw new Error(`Postcode too long (max ${this.sanitizationRules.postcode.maxLength} characters)`);
    }

    if (!this.sanitizationRules.postcode.pattern.test(cleaned)) {
      throw new Error('Invalid UK postcode format');
    }

    // Format postcode properly (add space)
    const outward = cleaned.slice(0, -3);
    const inward = cleaned.slice(-3);
    return `${outward} ${inward}`;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '/': '&#x2F;'
    };

    return text.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
  }

  /**
   * Check if email appears suspicious
   * @param {string} email - Email to check
   * @returns {boolean} True if suspicious
   */
  isSuspiciousEmail(email) {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /test\d*@/i,
      /fake\d*@/i,
      /temp\d*@/i,
      /\d{4,}@/,
      /[a-z]{20,}@/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(email));
  }

  /**
   * Rate limiting for operations
   * @param {string} identifier - User/session identifier
   * @param {string} operation - Operation type
   * @returns {boolean} True if allowed
   */
  checkRateLimit(identifier, operation) {
    const key = `${identifier}_${operation}`;
    const now = Date.now();

    if (!this.rateLimiter.has(key)) {
      this.rateLimiter.set(key, { count: 1, firstAttempt: now });
      return true;
    }

    const limitData = this.rateLimiter.get(key);

    // Reset if time window has passed
    if (now - limitData.firstAttempt > this.timeWindow) {
      this.rateLimiter.set(key, { count: 1, firstAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (limitData.count >= this.maxAttempts) {
      console.warn(`[InputValidator] Rate limit exceeded for ${key}`);
      return false;
    }

    // Increment counter
    limitData.count++;
    return true;
  }

  /**
   * Clean up old rate limit entries
   */
  cleanupRateLimits() {
    const now = Date.now();
    for (const [key, data] of this.rateLimiter.entries()) {
      if (now - data.firstAttempt > this.timeWindow * 2) {
        this.rateLimiter.delete(key);
      }
    }
  }

  /**
   * Validate message structure and content
   * @param {Object} message - Message to validate
   * @param {Object} sender - Message sender info
   * @returns {boolean} Validation result
   */
  validateMessage(message, sender) {
    try {
      // Check message structure
      if (!message || typeof message !== 'object') {
        throw new Error('Invalid message format');
      }

      // Validate required fields
      const requiredFields = ['type', 'data'];
      for (const field of requiredFields) {
        if (!message[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate message type
      const validTypes = ['SEARCH_REQUEST', 'BOOKING_REQUEST', 'CANCEL_REQUEST', 'STATUS_UPDATE'];
      if (!validTypes.includes(message.type)) {
        throw new Error('Invalid message type');
      }

      // Sanitize message data
      message.data = this.sanitizeMessageData(message.data, message.type);

      return true;
    } catch (error) {
      console.error('[InputValidator] Message validation failed:', error);
      return false;
    }
  }

  /**
   * Sanitize message data based on type
   * @param {Object} data - Message data
   * @param {string} messageType - Type of message
   * @returns {Object} Sanitized data
   */
  sanitizeMessageData(data, messageType) {
    switch (messageType) {
    case 'SEARCH_REQUEST':
      return {
        pupilId: this.sanitizeId(data.pupilId),
        testCentre: this.sanitizeTestCentre(data.testCentre),
        preferredDates: data.preferredDates ? data.preferredDates.map(date => this.sanitizeText(date, 10)) : []
      };

    case 'BOOKING_REQUEST':
      return {
        pupilId: this.sanitizeId(data.pupilId),
        testReference: this.validateTestReference(data.testReference),
        newTestDate: this.sanitizeText(data.newTestDate, 10),
        newTestTime: this.sanitizeText(data.newTestTime, 5)
      };

    default:
      return data;
    }
  }
}

// Export singleton instance
module.exports = new InputValidator();
