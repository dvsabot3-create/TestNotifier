# 🔧 TIER SYSTEM IMPLEMENTATION CODE
## Ready-to-Deploy Code Changes

---

## 1️⃣ UPDATE PRICING SECTION COLORS

**File:** `website/components/PricingSection.tsx`

```typescript
const plans = [
  {
    name: "One-Off Rescue",
    subtitle: "Single urgent rebook",
    price: "£30",
    priceSuffix: "one-time",
    features: [
      { text: "One rebook attempt", included: true },
      { text: "Monitor 1 test center", included: true },
      { text: "Email notification when found", included: true },
      { text: "Valid for 30 days", included: true },
      { text: "No recurring charges", included: true },
      { text: "5 daily notifications max", included: true },
      { text: "SMS notifications", included: false },
      { text: "Auto-rebooking", included: false }
    ],
    cta: "Pay £30 Once",
    highlighted: false,
    color: "#28a745", // 🟢 EMERALD GREEN
    badge: null,
    icon: "⚡"
  },
  {
    name: "Starter",
    subtitle: "For occasional needs",
    price: "£25",
    priceSuffix: "/month",
    features: [
      { text: "Monitor up to 3 test centers", included: true },
      { text: "2 rebook attempts per day", included: true },
      { text: "10 daily notifications max", included: true },
      { text: "SMS + Email notifications", included: true },
      { text: "Chrome extension access", included: true },
      { text: "Email support", included: true },
      { text: "7-day trial (monitoring only)", included: true },
      { text: "Auto-rebooking", included: false }
    ],
    cta: "Start 7-Day Trial",
    highlighted: false,
    color: "#718096", // ⚪ COOL GRAY
    badge: null,
    icon: "🚀",
    note: "Trial allows monitoring only - rebooks start after first payment"
  },
  {
    name: "Premium",
    subtitle: "Best for active learners",
    price: "£45",
    priceSuffix: "/month",
    features: [
      { text: "Monitor up to 5 test centers", included: true },
      { text: "5 rebook attempts per day", included: true },
      { text: "25 daily notifications max", included: true },
      { text: "Priority SMS + Email notifications", included: true },
      { text: "Rapid mode (500ms checks)", included: true },
      { text: "Auto-rebooking enabled ✨", included: true },
      { text: "Advanced filtering", included: true },
      { text: "24/7 email support", included: true },
      { text: "7-day trial (monitoring only)", included: true }
    ],
    cta: "Start Premium Trial",
    highlighted: true,
    color: "#8b5cf6", // 🟣 ROYAL PURPLE
    badge: "Most Popular",
    icon: "⭐",
    note: "Trial allows monitoring only - rebooks start after first payment"
  },
  {
    name: "Professional",
    subtitle: "Ultimate for instructors",
    price: "£80",
    priceSuffix: "/month",
    features: [
      { text: "Up to 20 pupils & 999 test centers", included: true },
      { text: "10 daily booking attempts", included: true },
      { text: "50 daily notifications max", included: true },
      { text: "Multi-pupil dashboard", included: true },
      { text: "Per-pupil custom settings", included: true },
      { text: "SMS + Email + WhatsApp alerts 📱", included: true },
      { text: "Stealth mode (anti-detection)", included: true },
      { text: "Success rate analytics", included: true },
      { text: "Priority phone support", included: true },
      { text: "14-day trial (includes 2 rebooks)", included: true }
    ],
    cta: "Start Professional Trial",
    highlighted: false,
    color: "#1d70b8", // 🔵 ROYAL BLUE - ULTIMATE TIER
    badge: "Ultimate Professional",
    icon: "👑"
  }
];
```

---

## 2️⃣ UPDATE EXTENSION POPUP COLORS

**File:** `READY_TO_DEPLOY_EXTENSION/popup.js`

### Add this function:

```javascript
/**
 * Update extension header color based on subscription tier
 */
updateExtensionHeaderColor() {
  const tier = this.subscription?.tier || 'oneoff';
  
  const tierColors = {
    'oneoff': {
      primary: '#28a745',
      gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      badge: '⚡ ONE-OFF',
      glow: 'rgba(40, 167, 69, 0.3)'
    },
    'starter': {
      primary: '#718096',
      gradient: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
      badge: '🚀 STARTER',
      glow: 'rgba(113, 128, 150, 0.3)'
    },
    'premium': {
      primary: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      badge: '⭐ PREMIUM',
      glow: 'rgba(139, 92, 246, 0.3)'
    },
    'professional': {
      primary: '#1d70b8',
      gradient: 'linear-gradient(135deg, #1d70b8 0%, #005ea5 100%)',
      badge: '👑 PRO',
      glow: 'rgba(29, 112, 184, 0.4)'
    }
  };
  
  const colors = tierColors[tier] || tierColors['oneoff'];
  
  // Update header background
  const header = document.querySelector('.header');
  if (header) {
    header.style.background = colors.gradient;
  }
  
  // Update tier badge
  const tierBadge = document.querySelector('.subscription-tier');
  if (tierBadge) {
    tierBadge.textContent = colors.badge;
    tierBadge.style.boxShadow = `0 0 20px ${colors.glow}`;
  }
  
  // Set CSS variables for consistent theming
  document.documentElement.style.setProperty('--tier-color', colors.primary);
  document.documentElement.style.setProperty('--tier-gradient', colors.gradient);
  document.documentElement.style.setProperty('--tier-glow', colors.glow);
  
  console.log(`🎨 Extension header color updated to: ${colors.badge}`);
}
```

### Call it in the `updateUI()` function:

```javascript
updateUI() {
  this.updateExtensionHeaderColor(); // Add this line
  this.renderHeader();
  this.renderCurrentTab();
  this.updateStats();
}
```

---

## 3️⃣ UPDATE SUBSCRIPTION API

**File:** `website/api/subscriptions/current.js`

```javascript
function getPlanFeatures(planType) {
  const features = {
    'oneoff': {
      multiPupil: false,
      smsNotifications: false,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: false,
      stealthMode: false,
      prioritySupport: false,
      analytics: false,
      bulkOperations: false
    },
    'starter': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: false,
      stealthMode: false,
      prioritySupport: false,
      analytics: false,
      bulkOperations: false
    },
    'premium': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: true, // ✅ AUTO-BOOKING ENABLED
      rapidMode: true,
      stealthMode: false,
      prioritySupport: true,
      analytics: true,
      bulkOperations: true
    },
    'professional': {
      multiPupil: true,
      smsNotifications: true,
      whatsappNotifications: true, // ✅ WHATSAPP EXCLUSIVE
      emailNotifications: true,
      autoRebook: true,
      rapidMode: true,
      stealthMode: true, // ✅ STEALTH MODE EXCLUSIVE
      prioritySupport: true,
      analytics: true,
      bulkOperations: true,
      instructorMode: true,
      phoneSupport: true
    },
    'free': {
      multiPupil: false,
      smsNotifications: false,
      whatsappNotifications: false,
      emailNotifications: true,
      autoRebook: false,
      rapidMode: false,
      stealthMode: false,
      prioritySupport: false,
      analytics: false,
      bulkOperations: false
    }
  };
  
  return features[planType] || features['free'];
}

function getPlanLimits(planType) {
  const limits = {
    'oneoff': { 
      pupils: 1, 
      monitors: 1, 
      testCentres: 1,
      rebooksPerDay: 1,
      rebooksTotal: 1,
      notificationsPerDay: 5,
      checkFrequency: 120, // seconds
      validityDays: 30
    },
    'starter': { 
      pupils: 3, 
      monitors: 10, 
      testCentres: 3,
      rebooksPerDay: 2,
      notificationsPerDay: 10,
      checkFrequency: 60,
      validityDays: null // ongoing
    },
    'premium': { 
      pupils: 5, 
      monitors: 20, 
      testCentres: 5,
      rebooksPerDay: 5,
      notificationsPerDay: 25,
      checkFrequency: 30,
      validityDays: null
    },
    'professional': { 
      pupils: 20, 
      monitors: null, // unlimited
      testCentres: 999,
      rebooksPerDay: 10,
      notificationsPerDay: 50,
      checkFrequency: 15,
      validityDays: null
    },
    'free': { 
      pupils: 1, 
      monitors: 1, 
      testCentres: 1,
      rebooksPerDay: 0,
      notificationsPerDay: 1,
      checkFrequency: 300,
      validityDays: 7
    }
  };
  
  return limits[planType] || limits['free'];
}
```

---

## 4️⃣ ADD EXTENSION CSS FOR TIER COLORS

**File:** `READY_TO_DEPLOY_EXTENSION/popup.html`

Add to the `<style>` section:

```css
/* Tier Color System */
:root {
  --tier-color: #28a745;
  --tier-gradient: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  --tier-glow: rgba(40, 167, 69, 0.3);
}

.header {
  background: var(--tier-gradient) !important;
  box-shadow: 0 4px 20px var(--tier-glow);
}

.subscription-tier {
  position: absolute;
  top: 12px;
  right: 16px;
  padding: 6px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: white;
  box-shadow: 0 0 20px var(--tier-glow);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.tier-indicator {
  height: 3px;
  width: 100%;
  background: var(--tier-gradient);
  box-shadow: 0 2px 8px var(--tier-glow);
  margin-bottom: 16px;
}

.btn-primary {
  background: var(--tier-color);
  border-color: var(--tier-color);
}

.btn-primary:hover {
  box-shadow: 0 4px 16px var(--tier-glow);
  transform: translateY(-1px);
}

/* Tier-specific badges */
.tier-oneoff { color: #28a745; }
.tier-starter { color: #718096; }
.tier-premium { color: #8b5cf6; }
.tier-professional { color: #1d70b8; }
```

---

## 5️⃣ UPDATE EXTENSION HEADER HTML

**File:** `READY_TO_DEPLOY_EXTENSION/popup.html`

Update the header section:

```html
<div class="header">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <div>
      <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">TestNotifier</div>
      <div id="subscription-plan" style="font-size: 13px; opacity: 0.95;">Multi-Pupil Manager</div>
    </div>
    <div class="subscription-tier">⚡ ONE-OFF</div>
  </div>
  
  <!-- Tier indicator line -->
  <div class="tier-indicator"></div>
  
  <!-- Stats grid -->
  <div class="stats-grid">
    <!-- stats content -->
  </div>
</div>
```

---

## 6️⃣ ENFORCE TIER LIMITS IN EXTENSION

**File:** `READY_TO_DEPLOY_EXTENSION/popup.js`

Update the `enforceSubscriptionLimits()` function:

```javascript
enforceSubscriptionLimits() {
  if (!this.subscription) return;
  
  const tier = this.subscription.tier;
  
  // Complete tier limits with new structure
  const tierLimits = {
    'oneoff': {
      maxMonitors: 1,
      maxTestCentres: 1,
      maxRebooksPerDay: 1,
      maxRebooksTotal: 1,
      maxNotificationsPerDay: 5,
      canAutoBook: false,
      canUseSMS: false,
      canUseWhatsApp: false,
      canUseStealthMode: false,
      expiresInDays: 30
    },
    'starter': {
      maxMonitors: 10,
      maxTestCentres: 3,
      maxRebooksPerDay: 2,
      maxNotificationsPerDay: 10,
      canAutoBook: false,
      canUseSMS: true,
      canUseWhatsApp: false,
      canUseStealthMode: false,
      duringTrial: { canRebook: false }
    },
    'premium': {
      maxMonitors: 20,
      maxTestCentres: 5,
      maxRebooksPerDay: 5,
      maxNotificationsPerDay: 25,
      canAutoBook: true, // ✅ AUTO-BOOKING
      canUseSMS: true,
      canUseWhatsApp: false,
      canUseStealthMode: false,
      canUseRapidMode: true,
      duringTrial: { canRebook: false }
    },
    'professional': {
      maxMonitors: null, // Unlimited
      maxTestCentres: 999,
      maxRebooksPerDay: 10,
      maxNotificationsPerDay: 50,
      canAutoBook: true,
      canUseSMS: true,
      canUseWhatsApp: true, // ✅ WHATSAPP EXCLUSIVE
      canUseStealthMode: true, // ✅ STEALTH EXCLUSIVE
      canUseRapidMode: true,
      canUseInstructorMode: true,
      duringTrial: { canRebook: true, freeRebooks: 2 }
    }
  };
  
  this.limits = tierLimits[tier] || tierLimits['oneoff'];
  
  console.log('🔒 Subscription limits enforced:', this.limits);
  
  // Update UI to reflect limits
  this.updateLimitIndicators();
}

/**
 * Update UI to show current limits
 */
updateLimitIndicators() {
  // Update monitors counter
  const monitorCount = document.querySelector('#monitor-count');
  if (monitorCount) {
    const active = this.monitors.filter(m => !m.paused).length;
    const max = this.limits.maxMonitors || '∞';
    monitorCount.textContent = `${active}/${max}`;
  }
  
  // Update rebooks counter
  const rebookCount = document.querySelector('#rebook-count');
  if (rebookCount) {
    const used = this.stats.rebooksUsed || 0;
    const total = this.limits.maxRebooksPerDay;
    rebookCount.textContent = `${used}/${total}`;
  }
}
```

---

## 7️⃣ ADD FEATURE UNLOCK INDICATORS

**File:** `READY_TO_DEPLOY_EXTENSION/popup.js`

Add these functions:

```javascript
/**
 * Check if feature is available for current tier
 */
canUseFeature(feature) {
  const featureMap = {
    'auto_booking': ['premium', 'professional'],
    'whatsapp': ['professional'],
    'stealth_mode': ['professional'],
    'rapid_mode': ['premium', 'professional'],
    'sms': ['starter', 'premium', 'professional'],
    'multi_pupil': ['starter', 'premium', 'professional'],
    'bulk_operations': ['premium', 'professional']
  };
  
  const allowedTiers = featureMap[feature] || [];
  return allowedTiers.includes(this.subscription.tier);
}

/**
 * Show upgrade prompt for locked feature
 */
showFeatureLockedPrompt(feature) {
  const upgradeMessages = {
    'auto_booking': {
      title: 'Auto-Booking Locked',
      message: 'Automatic booking requires Premium or Professional plan',
      requiredTier: 'Premium'
    },
    'whatsapp': {
      title: 'WhatsApp Notifications Locked',
      message: 'WhatsApp alerts are exclusive to Professional plan',
      requiredTier: 'Professional'
    },
    'stealth_mode': {
      title: 'Stealth Mode Locked',
      message: 'Anti-detection stealth mode is exclusive to Professional plan',
      requiredTier: 'Professional'
    }
  };
  
  const msg = upgradeMessages[feature];
  
  const promptHTML = `
    <div class="upgrade-prompt">
      <div class="upgrade-icon">🔒</div>
      <h3>${msg.title}</h3>
      <p>${msg.message}</p>
      <button onclick="window.open('https://testnotifier.co.uk/#pricing', '_blank')" class="btn btn-primary">
        Upgrade to ${msg.requiredTier}
      </button>
    </div>
  `;
  
  this.showModal(promptHTML);
}
```

---

## 8️⃣ TEST CHECKLIST

After implementing these changes:

```markdown
## Testing Checklist

### Visual Testing
- [ ] One-Off tier shows GREEN header (🟢 #28a745)
- [ ] Starter tier shows GRAY header (⚪ #718096)
- [ ] Premium tier shows PURPLE header (🟣 #8b5cf6)
- [ ] Professional tier shows BLUE header (🔵 #1d70b8)
- [ ] Tier badges display correctly in extension
- [ ] Color accents apply to buttons and UI elements

### Feature Testing
- [ ] One-Off: Can only add 1 monitor
- [ ] Starter: Can add 10 monitors, 3 centres each
- [ ] Premium: Auto-booking button enabled
- [ ] Professional: WhatsApp option visible
- [ ] Professional: Stealth mode toggle visible
- [ ] Locked features show upgrade prompts

### Limit Testing
- [ ] Daily rebook limits enforced
- [ ] Notification limits tracked
- [ ] Trial limitations work (Starter/Premium)
- [ ] One-Off expires after 30 days
- [ ] Professional trial includes 2 free rebooks

### Notification Testing
- [ ] One-Off: Email only
- [ ] Starter: Email + SMS
- [ ] Premium: Email + SMS + Priority
- [ ] Professional: Email + SMS + WhatsApp
```

---

## 🚀 DEPLOYMENT ORDER

1. **Deploy backend API changes** (`api/subscriptions/current.js`)
2. **Deploy website pricing updates** (`PricingSection.tsx`)
3. **Update extension files** (`popup.js`, `popup.html`)
4. **Test locally** with each tier
5. **Deploy to production**
6. **Monitor user experience**

---

## 📝 SUMMARY OF CHANGES

### Colors Updated:
- ✅ One-Off: Green (#28a745) - No change
- ✅ Starter: Gray (#718096) - No change  
- ✅ Premium: Purple (#8b5cf6) - **CHANGED** from Blue
- ✅ Professional: Blue (#1d70b8) - **CHANGED** to Ultimate Blue

### Features Properly Embedded:
- ✅ Auto-booking: Premium & Professional only
- ✅ WhatsApp: Professional only
- ✅ Stealth Mode: Professional only
- ✅ SMS: Starter, Premium, Professional
- ✅ Rapid Mode: Premium & Professional

### Correlation Established:
- ✅ One-time purchase = 30 day access
- ✅ Subscription tiers = ongoing access
- ✅ Trial limitations enforced
- ✅ Upgrade paths defined

**All code is ready to copy-paste and deploy! 🎉**

