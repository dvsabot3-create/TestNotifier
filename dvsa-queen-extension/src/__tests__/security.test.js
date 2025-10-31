/**
 * Security Component Integration Tests
 */

const AsyncLock = require('../shared/AsyncLock');
const SecureBookingStateMachine = require('../shared/SecureBookingStateMachine');
const SecureConfirmation = require('../shared/SecureConfirmation');
const InputValidator = require('../shared/InputValidator');

describe('Security Components Integration', () => {
  describe('AsyncLock', () => {
    it('should prevent concurrent operations', async() => {
      const results = [];
      const promises = [];

      // Start 3 operations simultaneously
      for (let i = 0; i < 3; i++) {
        promises.push(
          AsyncLock.acquire('test-lock', async() => {
            results.push(`start-${i}`);
            await new Promise(resolve => setTimeout(resolve, 50));
            results.push(`end-${i}`);
            return i;
          })
        );
      }

      await Promise.all(promises);

      // Verify operations executed sequentially
      expect(results).toEqual([
        'start-0', 'end-0',
        'start-1', 'end-1',
        'start-2', 'end-2'
      ]);
    });

    it('should handle errors properly', async() => {
      await expect(
        AsyncLock.acquire('test-lock', async() => {
          throw new Error('Test error');
        })
      ).rejects.toThrow('Test error');
    });
  });

  describe('SecureBookingStateMachine', () => {
    beforeEach(async() => {
      await SecureBookingStateMachine.reset();
    });

    it('should handle valid state transitions', async() => {
      expect(SecureBookingStateMachine.getState()).toBe('IDLE');

      await SecureBookingStateMachine.transitionTo('SEARCHING');
      expect(SecureBookingStateMachine.getState()).toBe('SEARCHING');

      await SecureBookingStateMachine.transitionTo('FOUND');
      expect(SecureBookingStateMachine.getState()).toBe('FOUND');

      await SecureBookingStateMachine.transitionTo('CONFIRMING');
      expect(SecureBookingStateMachine.getState()).toBe('CONFIRMING');
    });

    it('should reject invalid state transitions', async() => {
      await expect(
        SecureBookingStateMachine.transitionTo('BOOKING')
      ).rejects.toThrow('Invalid state transition: IDLE -> BOOKING');
    });

    it('should handle booking timeout', async() => {
      // First transition to CONFIRMING, then to BOOKING
      await SecureBookingStateMachine.transitionTo('SEARCHING');
      await SecureBookingStateMachine.transitionTo('FOUND');
      await SecureBookingStateMachine.transitionTo('CONFIRMING');
      await SecureBookingStateMachine.transitionTo('BOOKING', {
        bookingId: 'test-booking',
        pupilId: 'test-pupil'
      });

      expect(SecureBookingStateMachine.getState()).toBe('BOOKING');

      // Test that timeout is set (we can't easily test the actual timeout without fake timers)
      // But we can verify the state machine handles timeout transitions
      await SecureBookingStateMachine.transitionTo('TIMEOUT', { reason: 'test_timeout' });
      expect(SecureBookingStateMachine.getState()).toBe('TIMEOUT');
    });
  });

  describe('InputValidator', () => {
    it('should sanitize valid pupil data', () => {
      const pupilData = {
        id: 'pupil_123',
        name: 'John Doe-Smith',
        licenceNumber: 'DOEJS123456AB',
        contact: {
          phone: '+447123456789',
          email: 'john.doe@test.com'
        },
        testCentre: 'Leeds Test Centre',
        testReference: 'ABC123456',
        postcode: 'LS1 1AA',
        notes: 'Some notes about the pupil'
      };

      const sanitized = InputValidator.sanitizePupilData(pupilData);

      expect(sanitized.name).toBe('John Doe-Smith');
      expect(sanitized.email).toBe('john.doe@test.com');
      expect(sanitized.phone).toBe('+447123456789');
      expect(sanitized.postcode).toBe('LS1 1AA');
    });

    it('should reject invalid email addresses', () => {
      const pupilData = {
        id: 'test',
        name: 'Test User',
        licenceNumber: 'TEST123456AB',
        contact: {
          email: 'invalid-email',
          phone: '+447123456789'
        },
        testCentre: 'Leeds Test Centre',
        testReference: 'TEST123456'
      };

      expect(() => {
        InputValidator.sanitizePupilData(pupilData);
      }).toThrow('Invalid email format');
    });

    it('should sanitize valid pupil data with proper validation', () => {
      const pupilData = {
        id: 'test',
        name: 'John Doe-Smith', // Valid name with hyphen
        licenceNumber: 'TEST123456AB',
        contact: {
          email: 'john.doe@example.com', // Valid email
          phone: '+447123456789'
        },
        testCentre: 'Leeds Test Centre',
        testReference: 'TEST123456',
        postcode: 'LS1 1AA'
      };

      const sanitized = InputValidator.sanitizePupilData(pupilData);
      expect(sanitized.name).toBe('John Doe-Smith');
      expect(sanitized.email).toBe('john.doe@example.com');
    });

    it('should validate message structure', () => {
      const validMessage = {
        type: 'SEARCH_REQUEST',
        data: {
          pupilId: 'test-pupil',
          testCentre: 'Leeds'
        }
      };

      expect(InputValidator.validateMessage(validMessage, {})).toBe(true);

      const invalidMessage = {
        type: 'INVALID_TYPE',
        data: {}
      };

      expect(InputValidator.validateMessage(invalidMessage, {})).toBe(false);
    });
  });

  describe('SecureConfirmation', () => {
    it('should validate booking details', () => {
      const validDetails = {
        pupilName: 'John Doe',
        testCentre: 'Leeds Test Centre',
        currentTestDate: '2024-12-25',
        currentTestTime: '09:00',
        newTestDate: '2024-12-20',
        newTestTime: '14:30'
      };

      expect(() => {
        SecureConfirmation.validateBookingDetails(validDetails);
      }).not.toThrow();
    });

    it('should reject booking details with past new test date', () => {
      const invalidDetails = {
        pupilName: 'John Doe',
        testCentre: 'Leeds Test Centre',
        currentTestDate: '2024-12-25',
        currentTestTime: '09:00',
        newTestDate: '2020-01-01', // Past date
        newTestTime: '14:30'
      };

      const result = SecureConfirmation.validateBookingDetails(invalidDetails);
      expect(result).toBe(false); // Should return false for past date
    });

    it('should generate secure IDs and tokens', () => {
      const id1 = SecureConfirmation.generateSecureId();
      const id2 = SecureConfirmation.generateSecureId();
      const token1 = SecureConfirmation.generateSecureToken();
      const token2 = SecureConfirmation.generateSecureToken();

      expect(id1).not.toBe(id2);
      expect(token1).not.toBe(token2);
      expect(id1).toMatch(/^conf_\d+_[a-z0-9]+$/);
      expect(token1).toHaveLength(32);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete booking flow with state machine and validation', async() => {
      // Reset state machine first
      await SecureBookingStateMachine.reset();

      // Start booking process
      await SecureBookingStateMachine.transitionTo('SEARCHING', {
        pupilId: 'test-pupil',
        testCentre: 'Leeds'
      });

      expect(SecureBookingStateMachine.getState()).toBe('SEARCHING');

      // Simulate finding a slot
      await SecureBookingStateMachine.transitionTo('FOUND', {
        slotDetails: {
          date: '2024-12-20',
          time: '14:30'
        }
      });

      expect(SecureBookingStateMachine.getState()).toBe('FOUND');

      // Validate the slot details
      const slotData = {
        pupilName: 'John Doe',
        testCentre: 'Leeds Test Centre',
        currentTestDate: '2024-12-25',
        currentTestTime: '09:00',
        newTestDate: '2024-12-20',
        newTestTime: '14:30'
      };

      expect(() => {
        SecureConfirmation.validateBookingDetails(slotData);
      }).not.toThrow();

      // Transition to confirming (this would trigger user consent)
      await SecureBookingStateMachine.transitionTo('CONFIRMING', {
        slotDetails: slotData
      });

      expect(SecureBookingStateMachine.getState()).toBe('CONFIRMING');
    });

    it('should prevent concurrent bookings with AsyncLock', async() => {
      let counter = 0;
      const results = [];

      const bookingPromises = [];
      for (let i = 0; i < 3; i++) {
        bookingPromises.push(
          AsyncLock.acquire('booking-lock', async() => {
            counter++;
            results.push(`booking-${i}-start`);
            results.push(`booking-${i}-end`);
            return counter;
          })
        );
      }

      const resultsArray = await Promise.all(bookingPromises);

      // Should execute sequentially
      expect(results).toEqual([
        'booking-0-start', 'booking-0-end',
        'booking-1-start', 'booking-1-end',
        'booking-2-start', 'booking-2-end'
      ]);

      // Counter should increment properly
      expect(resultsArray).toEqual([1, 2, 3]);
    });
  });
});
