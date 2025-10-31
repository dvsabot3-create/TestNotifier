/**
 * Email validation utility
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * UK phone number validation utility
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid UK phone number
 */
function validatePhoneNumber(phone) {
  // Remove spaces and common formatting
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // UK phone number patterns
  const ukPhoneRegex = /^(\+44|0)7\d{9}$/;

  return ukPhoneRegex.test(cleanPhone);
}

/**
 * Test centre name validation
 * @param {string} testCentre - Test centre name to validate
 * @returns {boolean} - True if valid test centre name
 */
function validateTestCentre(testCentre) {
  if (!testCentre || typeof testCentre !== 'string') {
    return false;
  }

  const trimmed = testCentre.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

/**
 * DVSA test reference validation
 * @param {string} testReference - Test reference number to validate
 * @returns {boolean} - True if valid test reference format
 */
function validateTestReference(testReference) {
  if (!testReference || typeof testReference !== 'string') {
    return false;
  }

  // DVSA test reference format: typically 8-12 alphanumeric characters
  const testRefRegex = /^[A-Z0-9]{8,12}$/i;
  return testRefRegex.test(testReference.trim());
}

/**
 * Date validation for test dates
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if valid future date
 */
function validateTestDate(date) {
  if (!date) {
    return false;
  }

  const testDate = new Date(date);
  const now = new Date();
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(now.getFullYear() + 1);

  return testDate instanceof Date &&
         !isNaN(testDate.getTime()) &&
         testDate > now &&
         testDate <= maxFutureDate;
}

/**
 * Postcode validation for UK postcodes
 * @param {string} postcode - Postcode to validate
 * @returns {boolean} - True if valid UK postcode
 */
function validatePostcode(postcode) {
  if (!postcode || typeof postcode !== 'string') {
    return false;
  }

  // UK postcode regex (simplified but effective)
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim());
}

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validateTestCentre,
  validateTestReference,
  validateTestDate,
  validatePostcode
};
