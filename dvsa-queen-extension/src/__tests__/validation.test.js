/**
 * Test suite for validation utilities
 */

const { validateEmail, validatePhoneNumber, validateTestCentre } = require('../shared/validation');

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('instructor@testnotifier.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate UK phone numbers', () => {
      expect(validatePhoneNumber('+447123456789')).toBe(true);
      expect(validatePhoneNumber('07123456789')).toBe(true);
      expect(validatePhoneNumber('+447113123456')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('invalid')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
    });
  });

  describe('validateTestCentre', () => {
    it('should validate test centre format', () => {
      expect(validateTestCentre('Leeds')).toBe(true);
      expect(validateTestCentre('London - Croydon')).toBe(true);
      expect(validateTestCentre('Manchester (Cheetham Hill)')).toBe(true);
    });

    it('should reject invalid test centre names', () => {
      expect(validateTestCentre('')).toBe(false);
      expect(validateTestCentre('   ')).toBe(false);
    });
  });
});
