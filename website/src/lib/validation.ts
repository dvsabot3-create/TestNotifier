/**
 * Email validation utility
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation utility
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * UK phone number validation utility
 */
export function validatePhoneNumber(phone: string): boolean {
  // Remove spaces and common formatting
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // UK phone number patterns
  const ukPhoneRegex = /^(\+44|0)7\d{9}$/;

  return ukPhoneRegex.test(cleanPhone);
}

/**
 * Form validation helper
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateForm(data: Record<string, any>, rules: Record<string, Function>): ValidationResult {
  const errors: string[] = [];

  Object.keys(rules).forEach(field => {
    const validator = rules[field];
    const value = data[field];

    if (!validator(value)) {
      errors.push(`${field} is invalid`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate URL to prevent open redirects
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate that string doesn't contain potential injection attacks
 */
export function containsInjectionAttempt(input: string): boolean {
  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /eval\(/i,
    /expression\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /document\.cookie/i,
    /window\.location/i,
  ];

  return injectionPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate string length with bounds
 */
export function validateLength(
  str: string,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (str.length < min) {
    return { valid: false, error: `Must be at least ${min} characters` };
  }
  if (str.length > max) {
    return { valid: false, error: `Must be no more than ${max} characters` };
  }
  return { valid: true };
}

/**
 * Comprehensive input validation with sanitization
 */
export function validateAndSanitize(
  input: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowHtml?: boolean;
    checkInjection?: boolean;
  } = {}
): { valid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  let sanitized = input;

  // Length validation
  if (options.minLength !== undefined || options.maxLength !== undefined) {
    const lengthResult = validateLength(
      input,
      options.minLength ?? 0,
      options.maxLength ?? Infinity
    );
    if (!lengthResult.valid && lengthResult.error) {
      errors.push(lengthResult.error);
    }
  }

  // Injection check
  if (options.checkInjection !== false && containsInjectionAttempt(input)) {
    errors.push('Input contains potentially malicious code');
  }

  // Sanitize if not allowing HTML
  if (!options.allowHtml) {
    sanitized = sanitizeInput(input);
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}