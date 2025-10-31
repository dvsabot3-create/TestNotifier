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