# 🎯 TESTNOTIFIER SUBSCRIPTION TIER SYSTEM
## Professional System Specification & Implementation Guide

**Date:** November 2, 2025  
**Version:** 3.0 - Professional Edition  
**Specialist:** Professional System Developer - Subscription Architecture  

---

## 📊 EXECUTIVE SUMMARY

**Current Status:** 4-Tier subscription system with partial enforcement  
**Requirement:** Complete tier system with proper color-coding, feature embedding, and correlation  
**Goal:** Professional-grade subscription management with visual tier identification

---

## 🎨 TIER SYSTEM ARCHITECTURE

### **Tier 1: ONE-OFF RESCUE** 
**Color Identity:** `#28a745` (Emerald Green) - Entry/Rescue Tier  
**Extension Header:** Emerald Green top bar  
**Price:** £30 one-time payment  
**Valid:** 30 days from purchase  

#### Core Specifications:
```javascript
{
  id: 'oneoff',
  name: 'One-Off Rescue',
  tierLevel: 1,
  color: '#28a745',
  colorGradient: 'from-emerald-500 to-emerald-600',
  accentColor: '#28a745',
  borderColor: '#28a745',
  
  pricing: {
    amount: 30.00,
    currency: 'GBP',
    type: 'one_time',
    validity: 30, // days
    stripePrice: 'price_oneoff'
  },
  
  limits: {
    pupils: 1,
    testCentres: 1,
    monitorsActive: 1,
    rebookAttempts: 1,
    notificationsPerDay: 5,
    checkFrequency: 120, // seconds
    validityDays: 30
  },
  
  features: {
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    browserNotifications: true,
    
    // Automation
    autoMonitoring: true,
    autoRebooking: false,
    rapidMode: false,
    stealthMode: false,
    
    // Management
    multiPupil: false,
    bulkOperations: false,
    advancedFiltering: false,
    
    // Support
    emailSupport: true,
    prioritySupport: false,
    phoneSupport: false,
    
    // Analytics
    basicStats: true,
    analytics: false,
    reports: false
  },
  
  extensionBehavior: {
    headerColor: '#28a745',
    tierBadge: 'ONE-OFF',
    tierIcon: '⚡',
    showUpgradePrompts: true,
    autoDeactivateAfter: 30 // days
  }
}
```

---

### **Tier 2: STARTER SUBSCRIPTION**
**Color Identity:** `#718096` (Cool Gray/Silver) - Regular User Tier  
**Extension Header:** Cool Gray top bar  
**Price:** £25/month  
**Trial:** 7 days (monitoring only, no rebooks)  

#### Core Specifications:
```javascript
{
  id: 'starter',
  name: 'Starter',
  tierLevel: 2,
  color: '#718096',
  colorGradient: 'from-gray-500 to-gray-600',
  accentColor: '#718096',
  borderColor: '#718096',
  
  pricing: {
    amount: 25.00,
    currency: 'GBP',
    type: 'subscription',
    interval: 'month',
    trialDays: 7,
    trialLimitation: 'monitoring_only',
    stripePrice: 'price_starter_monthly'
  },
  
  limits: {
    pupils: 3,
    testCentres: 3, // per pupil
    monitorsActive: 10, // can set up many
    rebookAttemptsPerDay: 2,
    notificationsPerDay: 10,
    checkFrequency: 60, // seconds
    validityDays: null // ongoing subscription
  },
  
  features: {
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    browserNotifications: true,
    
    // Automation
    autoMonitoring: true,
    autoRebooking: false, // Manual booking only
    rapidMode: false,
    stealthMode: false,
    
    // Management
    multiPupil: true,
    bulkOperations: false,
    advancedFiltering: true,
    
    // Support
    emailSupport: true,
    prioritySupport: false,
    phoneSupport: false,
    
    // Analytics
    basicStats: true,
    analytics: false,
    reports: false
  },
  
  extensionBehavior: {
    headerColor: '#718096',
    tierBadge: 'STARTER',
    tierIcon: '🚀',
    showUpgradePrompts: true,
    duringTrial: {
      rebookingBlocked: true,
      upgradePromptsOn: ['rebook_attempt'],
      message: 'Upgrade to start rebooking'
    }
  }
}
```

---

### **Tier 3: PREMIUM SUBSCRIPTION**
**Color Identity:** `#8b5cf6` (Royal Purple/Violet) - Premium User Tier  
**Extension Header:** Royal Purple top bar  
**Price:** £45/month  
**Trial:** 7 days (monitoring only, no rebooks)  

#### Core Specifications:
```javascript
{
  id: 'premium',
  name: 'Premium',
  tierLevel: 3,
  color: '#8b5cf6',
  colorGradient: 'from-violet-600 to-purple-600',
  accentColor: '#8b5cf6',
  borderColor: '#8b5cf6',
  
  pricing: {
    amount: 45.00,
    currency: 'GBP',
    type: 'subscription',
    interval: 'month',
    trialDays: 7,
    trialLimitation: 'monitoring_only',
    stripePrice: 'price_premium_monthly',
    badge: 'MOST POPULAR'
  },
  
  limits: {
    pupils: 5,
    testCentres: 5, // per pupil
    monitorsActive: 20,
    rebookAttemptsPerDay: 5,
    notificationsPerDay: 25,
    checkFrequency: 30, // seconds (rapid mode)
    validityDays: null
  },
  
  features: {
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    browserNotifications: true,
    priorityNotifications: true,
    
    // Automation
    autoMonitoring: true,
    autoRebooking: true, // AUTO-BOOKING ENABLED
    rapidMode: true, // 500ms checks
    stealthMode: false,
    
    // Management
    multiPupil: true,
    bulkOperations: true,
    advancedFiltering: true,
    dateRangeFiltering: true,
    
    // Support
    emailSupport: true,
    prioritySupport: true,
    phoneSupport: false,
    
    // Analytics
    basicStats: true,
    analytics: true,
    reports: false
  },
  
  extensionBehavior: {
    headerColor: '#8b5cf6',
    tierBadge: 'PREMIUM',
    tierIcon: '⭐',
    showUpgradePrompts: true,
    duringTrial: {
      rebookingBlocked: true,
      upgradePromptsOn: ['rebook_attempt'],
      message: 'Complete payment to unlock rebooking'
    },
    enabledFeatures: [
      'rapid_checking',
      'auto_booking',
      'advanced_filters',
      'priority_notifications'
    ]
  }
}
```

---

### **Tier 4: PROFESSIONAL SUBSCRIPTION** 🔵
**Color Identity:** `#1d70b8` (Royal Blue) - **ULTIMATE PROFESSIONAL TIER**  
**Extension Header:** Royal Blue top bar (Matches Gov.UK blue - professional authority)  
**Price:** £80/month  
**Trial:** 14 days (FULL ACCESS + 2 free rebooks)  

#### Core Specifications:
```javascript
{
  id: 'professional',
  name: 'Professional',
  tierLevel: 4,
  color: '#1d70b8', // ULTIMATE BLUE
  colorGradient: 'from-blue-600 to-blue-700',
  accentColor: '#1d70b8',
  borderColor: '#1d70b8',
  
  pricing: {
    amount: 80.00,
    currency: 'GBP',
    type: 'subscription',
    interval: 'month',
    trialDays: 14,
    trialLimitation: 'full_access_2_rebooks',
    stripePrice: 'price_professional_monthly',
    badge: 'ULTIMATE'
  },
  
  limits: {
    pupils: 20, // For driving instructors
    testCentres: 999, // Unlimited practically
    monitorsActive: null, // Unlimited
    rebookAttemptsPerDay: 10,
    notificationsPerDay: 50,
    checkFrequency: 15, // seconds (hyper-rapid)
    validityDays: null
  },
  
  features: {
    // Notifications (ALL CHANNELS)
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true, // EXCLUSIVE
    browserNotifications: true,
    priorityNotifications: true,
    customNotificationTemplates: true,
    
    // Automation (FULL SUITE)
    autoMonitoring: true,
    autoRebooking: true,
    rapidMode: true,
    hyperRapidMode: true, // 250ms checks
    stealthMode: true, // ANTI-DETECTION
    
    // Management (INSTRUCTOR FEATURES)
    multiPupil: true,
    bulkOperations: true,
    advancedFiltering: true,
    dateRangeFiltering: true,
    geoFiltering: true,
    priorityQueue: true,
    
    // Instructor Specific
    adiNumber: true,
    instructorProfile: true,
    pupilManagement: true,
    baseLocation: true,
    travelRadius: true,
    
    // Support (PREMIUM)
    emailSupport: true,
    prioritySupport: true,
    phoneSupport: true,
    dedicatedSupport: true,
    
    // Analytics (COMPREHENSIVE)
    basicStats: true,
    analytics: true,
    reports: true,
    successRateTracking: true,
    pupilProgressTracking: true,
    exportData: true
  },
  
  extensionBehavior: {
    headerColor: '#1d70b8', // ROYAL BLUE
    tierBadge: 'PRO',
    tierIcon: '👑',
    showUpgradePrompts: false,
    duringTrial: {
      rebookingBlocked: false, // TRIAL INCLUDES REBOOKS!
      freeRebooksInTrial: 2,
      message: 'Professional trial - 2 free rebooks included'
    },
    enabledFeatures: [
      'all_features',
      'stealth_mode',
      'whatsapp_alerts',
      'multi_pupil_dashboard',
      'analytics',
      'priority_support'
    ],
    specialFeatures: {
      instructorMode: true,
      bulkPupilImport: true,
      pupilProgressDashboard: true,
      customNotifications: true,
      apiAccess: false // Future feature
    }
  }
}
```

---

## 🎨 EXTENSION COLOR IMPLEMENTATION

### Extension Header Color Coding

```javascript
// popup.js - Header color implementation
function updateExtensionHeaderColor(tier) {
  const colorMap = {
    'oneoff': {
      primary: '#28a745',
      gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      textColor: '#ffffff',
      badge: '⚡ ONE-OFF',
      accentGlow: 'rgba(40, 167, 69, 0.3)'
    },
    'starter': {
      primary: '#718096',
      gradient: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
      textColor: '#ffffff',
      badge: '🚀 STARTER',
      accentGlow: 'rgba(113, 128, 150, 0.3)'
    },
    'premium': {
      primary: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      textColor: '#ffffff',
      badge: '⭐ PREMIUM',
      accentGlow: 'rgba(139, 92, 246, 0.3)'
    },
    'professional': {
      primary: '#1d70b8', // ULTIMATE BLUE
      gradient: 'linear-gradient(135deg, #1d70b8 0%, #005ea5 100%)',
      textColor: '#ffffff',
      badge: '👑 PRO',
      accentGlow: 'rgba(29, 112, 184, 0.4)'
    }
  };
  
  const colors = colorMap[tier] || colorMap['oneoff'];
  
  // Apply to extension header
  document.querySelector('.extension-header').style.background = colors.gradient;
  document.querySelector('.tier-badge').textContent = colors.badge;
  document.querySelector('.tier-badge').style.boxShadow = `0 0 20px ${colors.accentGlow}`;
  
  // Apply accent colors throughout UI
  document.documentElement.style.setProperty('--tier-color', colors.primary);
  document.documentElement.style.setProperty('--tier-gradient', colors.gradient);
  document.documentElement.style.setProperty('--tier-glow', colors.accentGlow);
}
```

### Visual Tier Indicators

```css
/* Extension CSS - Tier identification */
.extension-header {
  position: relative;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  /* Background set dynamically by tier */
}

.tier-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  /* Shadow set dynamically */
}

.tier-indicator {
  height: 4px;
  width: 100%;
  background: var(--tier-gradient);
  box-shadow: 0 2px 8px var(--tier-glow);
}

.action-button {
  background: var(--tier-color);
  border: 2px solid var(--tier-color);
}

.action-button:hover {
  box-shadow: 0 4px 20px var(--tier-glow);
}
```

---

## 🔒 FEATURE ENFORCEMENT SYSTEM

### Backend API Validation

```javascript
// api/subscriptions/validate-feature.js
export async function validateFeatureAccess(userId, feature) {
  const subscription = await getActiveSubscription(userId);
  
  const featureMatrix = {
    'whatsapp_notifications': ['professional'],
    'auto_rebooking': ['premium', 'professional'],
    'stealth_mode': ['professional'],
    'rapid_mode': ['premium', 'professional'],
    'multi_pupil': ['starter', 'premium', 'professional'],
    'bulk_operations': ['premium', 'professional'],
    'analytics': ['premium', 'professional'],
    'phone_support': ['professional']
  };
  
  const allowedTiers = featureMatrix[feature] || [];
  const hasAccess = allowedTiers.includes(subscription.tier);
  
  if (!hasAccess) {
    return {
      allowed: false,
      tier: subscription.tier,
      requiredTier: allowedTiers[0],
      upgradeUrl: `/upgrade?feature=${feature}`,
      message: `This feature requires ${allowedTiers[0]} plan or higher`
    };
  }
  
  return { allowed: true };
}
```

### Extension Limit Enforcement

```javascript
// popup.js - Limit enforcement
async function enforceSubscriptionLimits() {
  const subscription = await loadSubscription();
  const tier = subscription.tier;
  
  // Define tier limits
  const limits = {
    'oneoff': {
      maxMonitors: 1,
      maxTestCentres: 1,
      maxRebooksPerDay: 1,
      maxNotificationsPerDay: 5,
      canAutoBook: false,
      expiresIn: 30 // days
    },
    'starter': {
      maxMonitors: 10,
      maxTestCentres: 3,
      maxRebooksPerDay: 2,
      maxNotificationsPerDay: 10,
      canAutoBook: false,
      duringTrial: { canRebook: false }
    },
    'premium': {
      maxMonitors: 20,
      maxTestCentres: 5,
      maxRebooksPerDay: 5,
      maxNotificationsPerDay: 25,
      canAutoBook: true,
      duringTrial: { canRebook: false }
    },
    'professional': {
      maxMonitors: null, // Unlimited
      maxTestCentres: 999,
      maxRebooksPerDay: 10,
      maxNotificationsPerDay: 50,
      canAutoBook: true,
      duringTrial: { canRebook: true, freeRebooks: 2 }
    }
  };
  
  this.limits = limits[tier];
  
  // Enforce limits in UI
  this.enforceMonitorLimit();
  this.enforceRebookLimit();
  this.enforceFeatureAccess();
}

function canAddMonitor() {
  if (!this.limits.maxMonitors) return true; // Unlimited
  
  const activeMonitors = this.monitors.filter(m => !m.paused).length;
  
  if (activeMonitors >= this.limits.maxMonitors) {
    this.showUpgradePrompt(
      `You've reached your limit of ${this.limits.maxMonitors} active monitors`,
      'Upgrade to monitor more pupils'
    );
    return false;
  }
  
  return true;
}

function canAttemptRebook() {
  const today = new Date().toDateString();
  const rebooksToday = this.stats.rebooksToday || 0;
  
  if (rebooksToday >= this.limits.maxRebooksPerDay) {
    this.showUpgradePrompt(
      `Daily rebook limit reached (${this.limits.maxRebooksPerDay})`,
      'Upgrade for more daily rebooks'
    );
    return false;
  }
  
  // Check if in trial
  if (this.subscription.status === 'trialing') {
    if (!this.limits.duringTrial?.canRebook) {
      this.showTrialLimitation();
      return false;
    }
  }
  
  return true;
}
```

---

## 📧 NOTIFICATION CHANNEL CORRELATION

### Tier-Based Notification Matrix

```javascript
const notificationChannels = {
  'oneoff': {
    email: true,
    sms: false,
    whatsapp: false,
    browser: true,
    maxPerDay: 5
  },
  'starter': {
    email: true,
    sms: true,
    whatsapp: false,
    browser: true,
    maxPerDay: 10
  },
  'premium': {
    email: true,
    sms: true,
    whatsapp: false,
    browser: true,
    priority: true,
    maxPerDay: 25
  },
  'professional': {
    email: true,
    sms: true,
    whatsapp: true, // EXCLUSIVE
    browser: true,
    priority: true,
    custom: true,
    maxPerDay: 50
  }
};

// Enforce channel access
function canUseNotificationChannel(tier, channel) {
  return notificationChannels[tier][channel] === true;
}

// Show appropriate options in UI
function renderNotificationOptions(tier) {
  const channels = notificationChannels[tier];
  
  return `
    <div class="notification-channels">
      ${channels.email ? '<label><input type="checkbox" checked> 📧 Email</label>' : ''}
      ${channels.sms ? '<label><input type="checkbox"> 📱 SMS</label>' : '<span class="locked">📱 SMS (Starter+)</span>'}
      ${channels.whatsapp ? '<label><input type="checkbox"> 💬 WhatsApp</label>' : '<span class="locked">💬 WhatsApp (Pro only)</span>'}
    </div>
  `;
}
```

---

## 🔄 ONE-TIME TO SUBSCRIPTION CORRELATION

### Upgrade Path System

```javascript
// Handle one-off to subscription upgrade
function handleOneOffUpgrade(currentUserId) {
  const upgradeOptions = {
    oneoffToStarter: {
      discount: 0, // No discount
      message: 'Upgrade to Starter for ongoing monitoring',
      benefits: [
        'Continue monitoring after 30 days',
        'Monitor 3 test centres',
        '2 rebook attempts per day',
        'SMS notifications included'
      ]
    },
    oneoffToPremium: {
      discount: 5.00, // £5 off first month
      message: 'Upgrade to Premium - Get £5 off',
      benefits: [
        'Auto-booking enabled',
        'Monitor 5 test centres',
        '5 rebook attempts per day',
        'Rapid mode (500ms checks)'
      ],
      priceOverride: 40.00 // £45 - £5
    },
    oneoffToProfessional: {
      discount: 10.00, // £10 off first month
      message: 'Upgrade to Professional - Best value!',
      benefits: [
        'WhatsApp notifications',
        'Stealth mode',
        'Unlimited monitoring',
        '10 rebook attempts per day',
        'Multi-pupil management'
      ],
      priceOverride: 70.00 // £80 - £10
    }
  };
  
  return upgradeOptions;
}

// Track one-off expiration
function checkOneOffExpiration() {
  if (this.subscription.tier === 'oneoff') {
    const purchaseDate = new Date(this.subscription.purchaseDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 7) {
      this.showExpirationWarning(daysRemaining);
    }
    
    if (daysRemaining <= 0) {
      this.deactivateOneOffAccess();
    }
  }
}
```

---

## 📊 COMPLETE FEATURE MATRIX

| Feature | One-Off<br/>🟢 | Starter<br/>⚪ | Premium<br/>🟣 | Professional<br/>🔵 |
|---------|:-----------:|:-----------:|:-----------:|:----------------:|
| **MONITORING** ||||
| Pupils | 1 | 3 | 5 | 20 |
| Test Centres | 1 | 3 | 5 | 999 |
| Active Monitors | 1 | 10 | 20 | Unlimited |
| Check Frequency | 120s | 60s | 30s | 15s |
| **REBOOKING** ||||
| Daily Attempts | 1 total | 2/day | 5/day | 10/day |
| Auto-Booking | ❌ | ❌ | ✅ | ✅ |
| Rapid Mode | ❌ | ❌ | ✅ | ✅ |
| Stealth Mode | ❌ | ❌ | ❌ | ✅ |
| **NOTIFICATIONS** ||||
| Email | ✅ | ✅ | ✅ | ✅ |
| SMS | ❌ | ✅ | ✅ | ✅ |
| WhatsApp | ❌ | ❌ | ❌ | ✅ |
| Priority | ❌ | ❌ | ✅ | ✅ |
| Daily Limit | 5 | 10 | 25 | 50 |
| **MANAGEMENT** ||||
| Multi-Pupil | ❌ | ✅ | ✅ | ✅ |
| Bulk Operations | ❌ | ❌ | ✅ | ✅ |
| Advanced Filters | ❌ | ✅ | ✅ | ✅ |
| ADI Profile | ❌ | ❌ | ❌ | ✅ |
| **ANALYTICS** ||||
| Basic Stats | ✅ | ✅ | ✅ | ✅ |
| Analytics Dashboard | ❌ | ❌ | ✅ | ✅ |
| Success Tracking | ❌ | ❌ | ❌ | ✅ |
| Export Data | ❌ | ❌ | ❌ | ✅ |
| **SUPPORT** ||||
| Email | ✅ | ✅ | ✅ | ✅ |
| Priority Email | ❌ | ❌ | ✅ | ✅ |
| Phone Support | ❌ | ❌ | ❌ | ✅ |
| **TRIAL** ||||
| Trial Period | - | 7 days | 7 days | 14 days |
| Trial Rebooking | - | ❌ | ❌ | ✅ (2 free) |
| **VALIDITY** ||||
| Duration | 30 days | Ongoing | Ongoing | Ongoing |

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Color System Implementation
- [ ] Update `PricingSection.tsx` with new color scheme
- [ ] Update `EnhancedSubscriptionModal.tsx` colors
- [ ] Update extension `popup.js` header colors
- [ ] Update extension CSS variables
- [ ] Create color constants file
- [ ] Test color accessibility (WCAG AA)

### Phase 2: Feature Enforcement
- [ ] Update `api/subscriptions/current.js` with complete feature matrix
- [ ] Implement feature validation API endpoint
- [ ] Update extension `enforceSubscriptionLimits()` function
- [ ] Add trial limitation logic
- [ ] Implement one-off expiration tracking
- [ ] Add upgrade prompts at feature boundaries

### Phase 3: Notification System
- [ ] Implement tier-based notification channel filtering
- [ ] Add WhatsApp integration (Professional only)
- [ ] Update notification preferences UI
- [ ] Enforce daily notification limits
- [ ] Track notification usage per tier

### Phase 4: Extension UI Updates
- [ ] Add tier color to extension header
- [ ] Implement tier badge display
- [ ] Add visual indicators for locked features
- [ ] Create upgrade prompt modals
- [ ] Add expiration countdown (one-off)

### Phase 5: Testing & Validation
- [ ] Test each tier's feature access
- [ ] Verify color coding in all contexts
- [ ] Test upgrade paths
- [ ] Verify trial limitations
- [ ] Test notification channel restrictions

---

## 📝 NEXT STEPS

1. **Review & Approve** this specification
2. **Implement Color Changes** in website and extension
3. **Update API** with complete feature matrix
4. **Deploy Backend** feature enforcement
5. **Update Extension** with tier colors and limits
6. **Test All Tiers** thoroughly
7. **Document** for users and support team

---

**This professional tier system provides:**
✅ Clear visual tier identification via color  
✅ Proper feature enforcement at all levels  
✅ Logical upgrade paths  
✅ Professional appearance  
✅ Scalable architecture  
✅ Complete correlation between one-time and subscriptions  

**Ready for implementation! 🚀**

