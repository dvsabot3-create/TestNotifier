/**
 * Secure Confirmation System for Auto-Booking
 * Ensures user consent before any booking operations
 * Prevents programmatic bypass and provides audit trail
 */

class SecureConfirmation {
  constructor() {
    this.confirmationTimeout = 30000; // 30 seconds
    this.confirmationId = null;
    this.userResponse = null;
    this.startTime = null;
    this.auditLog = [];
  }

  /**
   * Request user confirmation for auto-booking
   * @param {Object} bookingDetails - Details of the booking to confirm
   * @returns {Promise<Object>} Confirmation result
   */
  async requestConfirmation(bookingDetails) {
    console.log('[SecureConfirmation] Requesting user confirmation', bookingDetails);

    this.confirmationId = this.generateSecureId();
    this.startTime = Date.now();
    this.userResponse = null;

    // Validate booking details
    if (!this.validateBookingDetails(bookingDetails)) {
      throw new Error('Invalid booking details provided');
    }

    // Create secure confirmation popup
    const confirmationResult = await this.createSecurePopup(bookingDetails);

    // Log the confirmation request
    this.logConfirmationRequest(bookingDetails, confirmationResult);

    return confirmationResult;
  }

  /**
   * Create secure confirmation popup
   * @param {Object} bookingDetails - Booking details to display
   * @returns {Promise<Object>} User response
   */
  async createSecurePopup(bookingDetails) {
    return new Promise((resolve, reject) => {
      // Generate secure confirmation token
      const secureToken = this.generateSecureToken();

      // Create popup window
      const popup = this.createPopupWindow(bookingDetails, secureToken);

      // Set up timeout
      const timeoutId = setTimeout(() => {
        this.handleTimeout(popup);
        resolve({
          confirmed: false,
          reason: 'timeout',
          confirmationId: this.confirmationId,
          timestamp: Date.now()
        });
      }, this.confirmationTimeout);

      // Set up message listener for user response
      const messageHandler = (message, sender, sendResponse) => {
        if (message.type === 'CONFIRMATION_RESPONSE' &&
            message.confirmationId === this.confirmationId) {

          clearTimeout(timeoutId);
          chrome.runtime.onMessage.removeListener(messageHandler);

          // Validate response integrity
          if (this.validateResponse(message, secureToken)) {
            this.userResponse = {
              confirmed: message.confirmed,
              timestamp: Date.now(),
              confirmationId: this.confirmationId,
              userAgent: message.userAgent,
              reason: message.reason || 'user_action'
            };

            this.logUserResponse(this.userResponse);
            resolve(this.userResponse);
          } else {
            reject(new Error('Invalid confirmation response'));
          }
        }
      };

      chrome.runtime.onMessage.addListener(messageHandler);

      // Handle popup closure
      const popupClosedCheck = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupClosedCheck);
          clearTimeout(timeoutId);
          chrome.runtime.onMessage.removeListener(messageHandler);

          if (!this.userResponse) {
            resolve({
              confirmed: false,
              reason: 'popup_closed',
              confirmationId: this.confirmationId,
              timestamp: Date.now()
            });
          }
        }
      }, 500);
    });
  }

  /**
   * Create popup window with booking details
   * @param {Object} bookingDetails - Booking information
   * @param {string} secureToken - Security token
   * @returns {Window} Popup window reference
   */
  createPopupWindow(bookingDetails, secureToken) {
    const popupWidth = 450;
    const popupHeight = 600;
    const left = (screen.width - popupWidth) / 2;
    const top = (screen.height - popupHeight) / 2;

    const popup = window.open(
      '',
      'booking_confirmation',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=no,scrollbars=no`
    );

    if (!popup) {
      throw new Error('Failed to create confirmation popup - popup blocker may be enabled');
    }

    // Generate secure HTML content
    const htmlContent = this.generateSecureHTML(bookingDetails, secureToken);
    popup.document.write(htmlContent);
    popup.document.close();

    return popup;
  }

  /**
   * Generate secure HTML content for confirmation popup
   * @param {Object} bookingDetails - Booking details
   * @param {string} secureToken - Security token
   * @returns {string} HTML content
   */
  generateSecureHTML(bookingDetails, secureToken) {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatTime = (timeString) => {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TestNotifier - Booking Confirmation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          .header h1 {
            color: #0f172a;
            margin: 0 0 8px 0;
            font-size: 20px;
          }
          .header p {
            color: #64748b;
            margin: 0;
            font-size: 14px;
          }
          .booking-details {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            color: #64748b;
            font-weight: 500;
          }
          .detail-value {
            color: #0f172a;
            font-weight: 600;
            text-align: right;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 13px;
            color: #92400e;
          }
          .warning-icon {
            display: inline-block;
            margin-right: 6px;
          }
          .timer {
            text-align: center;
            font-size: 16px;
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 20px;
          }
          .buttons {
            display: flex;
            gap: 12px;
          }
          .btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-approve {
            background: #10b981;
            color: white;
          }
          .btn-approve:hover {
            background: #059669;
          }
          .btn-approve:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
          .btn-cancel {
            background: #e5e7eb;
            color: #374151;
          }
          .btn-cancel:hover {
            background: #d1d5db;
          }
          .secure-indicator {
            text-align: center;
            margin-top: 16px;
            font-size: 12px;
            color: #6b7280;
          }
          .secure-indicator::before {
            content: "🔒 ";
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Booking Confirmation Required</h1>
            <p>A driving test slot has been found. Please review and confirm.</p>
          </div>

          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Current Test:</span>
              <span class="detail-value">${formatDate(bookingDetails.currentTestDate)} at ${formatTime(bookingDetails.currentTestTime)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">New Slot:</span>
              <span class="detail-value">${formatDate(bookingDetails.newTestDate)} at ${formatTime(bookingDetails.newTestTime)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Test Centre:</span>
              <span class="detail-value">${bookingDetails.testCentre}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Pupil:</span>
              <span class="detail-value">${bookingDetails.pupilName}</span>
            </div>
          </div>

          <div class="warning">
            <span class="warning-icon">⚠️</span>
            This action will cancel your current test and book the new slot. This cannot be undone.
          </div>

          <div class="timer" id="timer">30 seconds remaining</div>

          <div class="buttons">
            <button id="approveBtn" class="btn btn-approve">✓ Approve Booking</button>
            <button id="cancelBtn" class="btn btn-cancel">✗ Cancel</button>
          </div>

          <div class="secure-indicator">
            Secure confirmation • ID: ${this.confirmationId}
          </div>
        </div>

        <script>
          const confirmationId = '${this.confirmationId}';
          const secureToken = '${secureToken}';
          let timeRemaining = 30;
          let timerInterval;

          // Timer countdown
          function updateTimer() {
            const timerElement = document.getElementById('timer');
            if (timeRemaining <= 0) {
              clearInterval(timerInterval);
              timerElement.textContent = 'Time expired - booking cancelled';
              document.getElementById('approveBtn').disabled = true;

              // Send timeout response
              window.opener.postMessage({
                type: 'CONFIRMATION_RESPONSE',
                confirmationId: confirmationId,
                confirmed: false,
                reason: 'timeout',
                userAgent: navigator.userAgent,
                secureToken: secureToken
              }, '*');

              setTimeout(() => window.close(), 2000);
              return;
            }

            timerElement.textContent = timeRemaining + ' seconds remaining';
            timeRemaining--;
          }

          // Start timer
          timerInterval = setInterval(updateTimer, 1000);
          updateTimer();

          // Approve button
          document.getElementById('approveBtn').addEventListener('click', function() {
            clearInterval(timerInterval);
            this.disabled = true;
            this.textContent = 'Processing...';

            window.opener.postMessage({
              type: 'CONFIRMATION_RESPONSE',
              confirmationId: confirmationId,
              confirmed: true,
              reason: 'user_approved',
              userAgent: navigator.userAgent,
              secureToken: secureToken
            }, '*');

            setTimeout(() => window.close(), 1000);
          });

          // Cancel button
          document.getElementById('cancelBtn').addEventListener('click', function() {
            clearInterval(timerInterval);

            window.opener.postMessage({
              type: 'CONFIRMATION_RESPONSE',
              confirmationId: confirmationId,
              confirmed: false,
              reason: 'user_cancelled',
              userAgent: navigator.userAgent,
              secureToken: secureToken
            }, '*');

            window.close();
          });

          // Handle window close
          window.addEventListener('beforeunload', function() {
            if (timeRemaining > 0) {
              window.opener.postMessage({
                type: 'CONFIRMATION_RESPONSE',
                confirmationId: confirmationId,
                confirmed: false,
                reason: 'window_closed',
                userAgent: navigator.userAgent,
                secureToken: secureToken
              }, '*');
            }
          });
        </script>
      </body>
      </html>
    `;
  }

  /**
   * Validate booking details
   * @param {Object} bookingDetails - Booking details to validate
   * @returns {boolean} Validation result
   */
  validateBookingDetails(bookingDetails) {
    const requiredFields = ['pupilName', 'testCentre', 'currentTestDate', 'currentTestTime', 'newTestDate', 'newTestTime'];

    for (const field of requiredFields) {
      if (!bookingDetails[field] || typeof bookingDetails[field] !== 'string') {
        console.error(`[SecureConfirmation] Missing or invalid field: ${field}`);
        return false;
      }
    }

    // Validate dates
    try {
      const newDate = new Date(bookingDetails.newTestDate);
      const currentDate = new Date(bookingDetails.currentTestDate);

      if (isNaN(newDate.getTime()) || isNaN(currentDate.getTime())) {
        console.error('[SecureConfirmation] Invalid date format');
        return false;
      }

      if (newDate <= new Date()) {
        console.error('[SecureConfirmation] New test date is in the past');
        return false;
      }
    } catch (error) {
      console.error('[SecureConfirmation] Date validation error:', error);
      return false;
    }

    return true;
  }

  /**
   * Generate secure confirmation ID
   * @returns {string} Secure ID
   */
  generateSecureId() {
    return 'conf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate secure token for response validation
   * @returns {string} Secure token
   */
  generateSecureToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Validate response integrity
   * @param {Object} response - User response
   * @param {string} expectedToken - Expected security token
   * @returns {boolean} Validation result
   */
  validateResponse(response, expectedToken) {
    if (!response || typeof response !== 'object') {
      console.error('[SecureConfirmation] Invalid response format');
      return false;
    }

    if (response.confirmationId !== this.confirmationId) {
      console.error('[SecureConfirmation] Confirmation ID mismatch');
      return false;
    }

    if (response.secureToken !== expectedToken) {
      console.error('[SecureConfirmation] Security token mismatch');
      return false;
    }

    if (typeof response.confirmed !== 'boolean') {
      console.error('[SecureConfirmation] Invalid confirmed value');
      return false;
    }

    return true;
  }

  /**
   * Log confirmation request for audit trail
   * @param {Object} bookingDetails - Booking details
   * @param {Object} result - Confirmation result
   */
  logConfirmationRequest(bookingDetails, result) {
    const logEntry = {
      type: 'confirmation_request',
      confirmationId: this.confirmationId,
      timestamp: this.startTime,
      bookingDetails: {
        pupilName: bookingDetails.pupilName,
        testCentre: bookingDetails.testCentre,
        currentTestDate: bookingDetails.currentTestDate,
        newTestDate: bookingDetails.newTestDate
      },
      result: result,
      userAgent: result.userAgent
    };

    this.auditLog.push(logEntry);
    console.log('[SecureConfirmation] Audit log:', logEntry);

    // Store in Chrome storage for persistence
    this.storeAuditLog(logEntry);
  }

  /**
   * Log user response for audit trail
   * @param {Object} response - User response
   */
  logUserResponse(response) {
    const logEntry = {
      type: 'user_response',
      confirmationId: this.confirmationId,
      timestamp: response.timestamp,
      confirmed: response.confirmed,
      reason: response.reason,
      responseTime: response.timestamp - this.startTime,
      userAgent: response.userAgent
    };

    this.auditLog.push(logEntry);
    console.log('[SecureConfirmation] User response logged:', logEntry);

    // Store in Chrome storage for persistence
    this.storeAuditLog(logEntry);
  }

  /**
   * Store audit log in Chrome storage
   * @param {Object} logEntry - Log entry to store
   */
  async storeAuditLog(logEntry) {
    try {
      const key = `confirmation_audit_${this.confirmationId}_${Date.now()}`;
      await chrome.storage.local.set({ [key]: logEntry });
    } catch (error) {
      console.error('[SecureConfirmation] Failed to store audit log:', error);
    }
  }

  /**
   * Handle timeout scenario
   * @param {Window} popup - Popup window reference
   */
  handleTimeout(popup) {
    console.log('[SecureConfirmation] Confirmation timed out');
    if (popup && !popup.closed) {
      try {
        popup.close();
      } catch (error) {
        console.error('[SecureConfirmation] Error closing popup:', error);
      }
    }
  }

  /**
   * Get audit trail for this confirmation session
   * @returns {Array} Audit log entries
   */
  getAuditTrail() {
    return [...this.auditLog];
  }

  /**
   * Clear audit log (for testing)
   */
  clearAuditLog() {
    this.auditLog = [];
  }
}

// Export singleton instance
module.exports = new SecureConfirmation();
