# Access Control System for TestNotifier Chrome Extension

A comprehensive access control system that manages trial mode, subscription tiers, device fingerprinting, and user limitations to prevent abuse and ensure proper monetization.

## 🎯 Overview

This access control system prevents the business model flaw where users could download the extension without subscribing. It implements:

- **Trial Mode**: Demo data with visible but non-functional features
- **Device Fingerprinting**: Prevents subscription sharing across devices
- **Tier-Based Restrictions**: Different feature sets for each subscription tier
- **Usage Monitoring**: Tracks and enforces usage limits
- **User Communication**: Clear UI showing current limitations and upgrade options

## 🏗️ Architecture

### Core Components

1. **TrialManager.js** - Manages trial/demo mode
2. **DeviceFingerprint.js** - Device identification and session management
3. **UserLimitationsUI.js** - User interface for limitations display
4. **AccessControlManager.js** - Central coordination system
5. **ExtensionIntegration.js** - Chrome extension integration layer

### Subscription Tiers

| Tier | Pupils | Daily Bookings | Notifications | Key Features |
|------|--------|----------------|---------------|--------------|
| Trial | 1 | 0 | 0 | Demo data only |
| One-Off | 1 | 1 | 5 | Manual operations |
| Starter | 3 | 2 | 10 | Basic monitoring |
| Premium | 10 | 5 | 25 | Auto-booking enabled |
| Professional | 20 | 10 | 50 | All features + bulk operations |

## 🚀 Quick Start

### 1. Include Required Scripts

```html
<!-- In your extension HTML files -->
<script src="access-control/trial-manager.js"></script>
<script src="access-control/device-fingerprint.js"></script>
<script src="access-control/user-limitations-ui.js"></script>
<script src="access-control/access-control-manager.js"></script>
<script src="access-control/extension-integration.js"></script>
```

### 2. Initialize Access Control

```javascript
// In your background script or main extension code
const accessControl = new AccessControlManager();
await accessControl.initialize();
```

### 3. Validate Operations

```javascript
// Before performing any restricted operation
const validation = await accessControl.validateAccess('add_pupil', {
    pupilData: newPupilData,
    timestamp: Date.now()
});

if (validation.allowed) {
    // Proceed with operation
    await performAddPupil(newPupilData);

    // Record successful operation
    await accessControl.recordOperation('add_pupil', {
        pupilId: result.pupilId
    });
} else {
    // Handle access denied
    handleAccessDenied(validation.reason);
}
```

## 🔧 Integration Examples

### Background Script Integration

```javascript
class BackgroundService {
    constructor() {
        this.accessControl = new AccessControlManager();
    }

    async initialize() {
        await this.accessControl.initialize();
        this.setupMessageHandlers();
    }

    setupMessageHandlers() {
        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
            switch (request.action) {
                case 'addPupil':
                    const result = await this.handleAddPupil(request.data);
                    sendResponse(result);
                    break;
                // ... other handlers
            }
            return true;
        });
    }

    async handleAddPupil(pupilData) {
        // Validate access first
        const validation = await this.accessControl.validateAccess('add_pupil', {
            pupilData: pupilData
        });

        if (!validation.allowed) {
            return {
                success: false,
                error: validation.reason,
                message: this.getErrorMessage(validation.reason)
            };
        }

        // Perform actual operation
        const result = await this.performAddPupilOperation(pupilData);

        // Record successful operation
        await this.accessControl.recordOperation('add_pupil', {
            pupilId: result.id,
            timestamp: Date.now()
        });

        return { success: true, data: result };
    }
}
```

### Content Script Integration

```javascript
class ContentScriptController {
    constructor() {
        this.accessControl = null;
    }

    async initialize() {
        // Access control is available through extension integration
        this.accessControl = window.AccessControlManager ?
            new AccessControlManager() : null;
    }

    async handleBookingAttempt(slotData) {
        // Validate access through background script
        const validation = await chrome.runtime.sendMessage({
            action: 'validateAccess',
            operation: 'auto_book',
            context: { slotData: slotData }
        });

        if (!validation.validation.allowed) {
            this.showAccessDeniedMessage(validation.validation.reason);
            return { success: false, error: validation.validation.reason };
        }

        // Proceed with booking
        return await this.performBooking(slotData);
    }

    showAccessDeniedMessage(reason) {
        const messages = {
            'trial_mode_restricted': 'Auto-booking requires a paid subscription',
            'tier_restricted': 'This feature requires a Premium subscription',
            'daily_booking_limit_reached': 'Daily booking limit reached',
            'max_pupils_reached': 'Maximum pupils limit reached'
        };

        this.showNotification(messages[reason] || 'Access denied');
    }
}
```

### Popup Script Integration

```javascript
class PopupController {
    constructor() {
        this.accessControl = null;
    }

    async initialize() {
        // Add UI elements
        this.addStatusIndicator();
        this.addLimitationsButton();

        // Get current access status
        await this.updateAccessStatus();
    }

    addStatusIndicator() {
        const statusContainer = document.createElement('div');
        statusContainer.id = 'access-control-status';
        statusContainer.className = 'access-control-status';
        statusContainer.addEventListener('click', () => {
            this.showLimitations();
        });
        document.body.appendChild(statusContainer);
    }

    async updateAccessStatus() {
        const response = await chrome.runtime.sendMessage({
            action: 'getAccessStatus'
        });

        if (response.success) {
            this.updateUIBasedOnStatus(response.status);
        }
    }

    updateUIBasedOnStatus(status) {
        const statusContainer = document.getElementById('access-control-status');

        // Update based on subscription tier
        const tierColors = {
            'trial': '#f59e0b',
            'one-off': '#10b981',
            'starter': '#3b82f6',
            'premium': '#8b5cf6',
            'professional': '#dc2626'
        };

        const color = tierColors[status.subscription?.tier] || '#6b7280';
        const tierName = status.subscription?.tier || 'Unknown';

        statusContainer.style.background = color;
        statusContainer.style.color = 'white';
        statusContainer.textContent = `${tierName} Plan`;
        statusContainer.title = 'Click to view your subscription limits';
    }

    async showLimitations() {
        await chrome.runtime.sendMessage({ action: 'showLimitations' });
    }
}
```

## 📊 Testing

### Run Test Suite

Open the test file in your browser:

```bash
# Navigate to the access-control directory
open simple-test.html
```

Or run individual tests:

```javascript
// Test trial mode
const trialManager = new TrialManager();
await trialManager.initialize({ tier: 'trial', status: 'trial' });
console.log('Trial mode:', trialManager.isInTrialMode());

// Test device fingerprint
const deviceFingerprint = new DeviceFingerprint();
const fingerprint = await deviceFingerprint.getFingerprint();
console.log('Device fingerprint:', fingerprint);

// Test access validation
const accessControl = new AccessControlManager();
await accessControl.initialize();
const validation = await accessControl.validateAccess('add_pupil', {});
console.log('Access validation:', validation);
```

### Mock Testing (Node.js)

```javascript
// Set up mock Chrome API
global.chrome = {
    storage: { local: { get: async () => ({}), set: async () => {} } },
    runtime: { sendMessage: async () => ({ success: true }) }
};

// Run tests
const testSuite = new AccessControlTestSuite();
await testSuite.runAllTests();
```

## 🔒 Security Features

### Device Fingerprinting
- WebGL vendor/renderer detection
- Canvas fingerprinting
- Audio context fingerprinting
- Screen resolution and color depth
- Browser capabilities detection
- Hardware concurrency information

### Session Management
- Maximum 2 concurrent sessions per subscription
- 24-hour session timeout
- Automatic session validation
- Force logout on device limit exceeded

### Abuse Prevention
- Usage tracking and limits enforcement
- Real-time subscription validation
- Automatic abuse detection
- Rate limiting for operations

## 🎨 User Interface

### Limitations Display
The system automatically shows users their current limitations:

- **Subscription Status**: Current tier and expiration info
- **Feature List**: Available vs restricted features
- **Usage Statistics**: Current usage vs limits with progress bars
- **Upgrade Prompts**: Clear calls-to-action for upgrading

### Trial Mode UI
Special UI for trial users:

- **Trial Banner**: Prominent display of trial status
- **Demo Data Indicators**: Clear labeling of demo content
- **Upgrade Prompts**: Frequent but non-intrusive upgrade suggestions
- **Feature Previews**: Show premium features with upgrade CTAs

## 📈 Analytics & Tracking

### Tracked Events
- `trial_upgrade_click` - User clicks upgrade from trial
- `limitations_ui_shown` - Limitations UI displayed
- `limitations_upgrade_click` - Upgrade clicked from limitations UI
- `device_limit_exceeded` - User hits device session limit
- `usage_limit_reached` - User hits usage limit (pupils, bookings, etc.)

### Usage Metrics
- Pupil count per user
- Daily booking attempts
- Notification sends
- Feature usage by tier
- Upgrade conversion rates

## 🚨 Error Handling

### Common Issues

1. **Extension Context Not Available**
   ```javascript
   // Check if in extension context
   if (typeof chrome !== 'undefined' && chrome.runtime) {
       // Safe to use extension APIs
   }
   ```

2. **Access Control Not Initialized**
   ```javascript
   // Always check initialization
   if (!accessControl.isInitialized) {
       await accessControl.initialize();
   }
   ```

3. **Network Errors During Validation**
   ```javascript
   // Implement fallback behavior
   try {
       const validation = await accessControl.validateAccess('operation', context);
       return validation;
   } catch (error) {
       console.error('Validation failed:', error);
       // Return conservative fallback
       return { allowed: false, reason: 'validation_error' };
   }
   ```

## 🔧 Configuration

### Environment Variables
```javascript
// API endpoints (set these in your build process)
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.testnotifier.co.uk';
const WS_BASE_URL = process.env.WS_BASE_URL || 'wss://ws.testnotifier.co.uk';
```

### Custom Limits
```javascript
// Override default limits if needed
const customLimits = {
    'trial': { pupils: 1, dailyBookings: 0, notifications: 0 },
    'starter': { pupils: 5, dailyBookings: 3, notifications: 15 }, // Custom starter limits
    // ... other tiers
};

// Pass to usage monitor
usageMonitor.setCustomLimits(customLimits);
```

## 📚 API Reference

### AccessControlManager

#### Methods
- `initialize()` - Initialize the access control system
- `validateAccess(operation, context)` - Validate if operation is allowed
- `showUserLimitations()` - Display limitations UI
- `recordOperation(operation, context)` - Record successful operation
- `getStatus()` - Get current access control status

#### Operations
- `add_pupil` - Adding new pupils
- `monitor_slots` - Monitoring test slots
- `auto_book` - Automatic booking
- `notifications` - Sending notifications
- `bulk_operations` - Bulk operations
- `stealth_mode` - Stealth mode features

### TrialManager

#### Methods
- `initialize(subscription)` - Initialize with subscription data
- `isInTrialMode()` - Check if in trial mode
- `isTrialExpired()` - Check if trial has expired
- `getRemainingTrialTime()` - Get remaining trial time
- `blockRealOperation(operation, context)` - Block real operations in trial

### DeviceFingerprint

#### Methods
- `getFingerprint()` - Get device fingerprint
- `validateSession(userId, authToken)` - Validate session
- `registerSession(userId, authToken)` - Register new session
- `isSessionValid(userId, authToken)` - Check session validity
- `forceLogout()` - Force logout current session

## 🤝 Contributing

When modifying the access control system:

1. **Test thoroughly** - Run the full test suite
2. **Maintain backward compatibility** - Don't break existing integrations
3. **Update documentation** - Keep this README current
4. **Consider edge cases** - Trial expiration, network failures, etc.
5. **Test in real extension** - Verify in actual Chrome extension environment

## 📄 License

This access control system is part of the TestNotifier Chrome Extension and follows the same licensing terms.