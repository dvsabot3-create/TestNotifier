/**
 * Secure Booking State Machine
 * Prevents duplicate bookings and ensures proper state management
 */
class SecureBookingStateMachine {
  constructor() {
    this.state = 'IDLE';
    this.context = {};
    this.stateHistory = [];
    this.maxHistorySize = 50;
    this.lock = require('./AsyncLock');
  }

  /**
   * Valid state transitions
   */
  getValidTransitions() {
    return {
      'IDLE': ['SEARCHING', 'CANCELLED'],
      'SEARCHING': ['FOUND', 'NOT_FOUND', 'ERROR', 'CANCELLED'],
      'FOUND': ['CONFIRMING', 'CANCELLED'],
      'CONFIRMING': ['BOOKING', 'CANCELLED', 'TIMEOUT'],
      'BOOKING': ['SUCCESS', 'FAILED', 'CANCELLED', 'TIMEOUT'],
      'SUCCESS': ['COMPLETED'],
      'FAILED': ['IDLE', 'CANCELLED'],
      'COMPLETED': ['IDLE'],
      'CANCELLED': ['IDLE'],
      'NOT_FOUND': ['IDLE', 'SEARCHING'],
      'ERROR': ['IDLE'],
      'TIMEOUT': ['IDLE', 'CANCELLED']
    };
  }

  /**
   * Transition to a new state with validation
   * @param {string} newState - Target state
   * @param {Object} context - Additional context for the transition
   * @returns {Promise<boolean>} Success status
   */
  async transitionTo(newState, context = {}) {
    return this.lock.acquire(`booking-state-${this.context.bookingId || 'default'}`, async() => {
      const validTransitions = this.getValidTransitions();

      if (!validTransitions[this.state]?.includes(newState)) {
        throw new Error(`Invalid state transition: ${this.state} -> ${newState}`);
      }

      // Log state transition
      const transition = {
        from: this.state,
        to: newState,
        timestamp: Date.now(),
        context: { ...this.context, ...context }
      };

      console.log(`[BookingState] ${this.state} -> ${newState}`, context);

      // Update state and context
      this.stateHistory.push(transition);
      if (this.stateHistory.length > this.maxHistorySize) {
        this.stateHistory.shift();
      }

      this.state = newState;
      this.context = { ...this.context, ...context };

      // Execute state-specific actions
      await this.executeStateActions(newState, this.context);

      return true;
    });
  }

  /**
   * Execute actions specific to the new state
   * @param {string} state - Current state
   * @param {Object} context - Current context
   */
  async executeStateActions(state, context) {
    switch (state) {
    case 'BOOKING':
      await this.onBookingStart(context);
      break;
    case 'SUCCESS':
      await this.onBookingSuccess(context);
      break;
    case 'FAILED':
      await this.onBookingFailed(context);
      break;
    case 'CANCELLED':
      await this.onBookingCancelled(context);
      break;
    case 'TIMEOUT':
      await this.onBookingTimeout(context);
      break;
    }
  }

  /**
   * Actions when booking starts
   */
  async onBookingStart(context) {
    console.log('[BookingState] Starting booking process', context);

    // Set booking timeout
    this.bookingTimeout = setTimeout(async() => {
      if (this.state === 'BOOKING') {
        await this.transitionTo('TIMEOUT', { reason: 'booking_timeout' });
      }
    }, 60000); // 1 minute timeout
  }

  /**
   * Actions when booking succeeds
   */
  async onBookingSuccess(context) {
    console.log('[BookingState] Booking successful', context);
    this.clearTimeout();

    // Store successful booking info
    await this.storeBookingResult(context);
  }

  /**
   * Actions when booking fails
   */
  async onBookingFailed(context) {
    console.log('[BookingState] Booking failed', context);
    this.clearTimeout();

    // Log failure for analysis
    await this.logBookingFailure(context);
  }

  /**
   * Actions when booking is cancelled
   */
  async onBookingCancelled(context) {
    console.log('[BookingState] Booking cancelled', context);
    this.clearTimeout();
  }

  /**
   * Actions when booking times out
   */
  async onBookingTimeout(context) {
    console.log('[BookingState] Booking timed out', context);

    // Clean up any partial state
    await this.cleanupPartialBooking(context);
  }

  /**
   * Clear any active timeouts
   */
  clearTimeout() {
    if (this.bookingTimeout) {
      clearTimeout(this.bookingTimeout);
      this.bookingTimeout = null;
    }
  }

  /**
   * Store booking result
   */
  async storeBookingResult(context) {
    try {
      await chrome.storage.local.set({
        [`booking_${context.bookingId}`]: {
          success: true,
          timestamp: Date.now(),
          pupilId: context.pupilId,
          testCentre: context.testCentre,
          testDate: context.testDate
        }
      });
    } catch (error) {
      console.error('[BookingState] Failed to store booking result:', error);
    }
  }

  /**
   * Log booking failure
   */
  async logBookingFailure(context) {
    try {
      await chrome.storage.local.set({
        [`booking_failure_${Date.now()}`]: {
          timestamp: Date.now(),
          reason: context.reason || 'unknown',
          pupilId: context.pupilId,
          error: context.error?.message
        }
      });
    } catch (error) {
      console.error('[BookingState] Failed to log booking failure:', error);
    }
  }

  /**
   * Cleanup partial booking state
   */
  async cleanupPartialBooking(context) {
    console.log('[BookingState] Cleaning up partial booking', context);
    // Implementation depends on what needs to be cleaned up
  }

  /**
   * Get current state
   */
  getState() {
    return this.state;
  }

  /**
   * Get current context
   */
  getContext() {
    return { ...this.context };
  }

  /**
   * Get state history
   */
  getStateHistory() {
    return [...this.stateHistory];
  }

  /**
   * Check if booking is in progress
   */
  isBookingInProgress() {
    return ['SEARCHING', 'FOUND', 'CONFIRMING', 'BOOKING'].includes(this.state);
  }

  /**
   * Check if booking can be cancelled
   */
  canCancel() {
    return ['SEARCHING', 'FOUND', 'CONFIRMING', 'BOOKING'].includes(this.state);
  }

  /**
   * Reset to initial state
   */
  async reset() {
    return this.lock.acquire('booking-reset', async() => {
      this.clearTimeout();
      this.state = 'IDLE';
      this.context = {};
      console.log('[BookingState] Reset to IDLE state');
    });
  }

  /**
   * Emergency stop - force reset regardless of current state
   */
  async emergencyStop() {
    console.warn('[BookingState] Emergency stop triggered');
    this.lock.clear(); // Clear any pending operations
    this.clearTimeout();
    this.state = 'IDLE';
    this.context = {};
    this.stateHistory.push({
      from: 'EMERGENCY',
      to: 'IDLE',
      timestamp: Date.now(),
      context: { reason: 'emergency_stop' }
    });
  }
}

// Export singleton instance
module.exports = new SecureBookingStateMachine();
