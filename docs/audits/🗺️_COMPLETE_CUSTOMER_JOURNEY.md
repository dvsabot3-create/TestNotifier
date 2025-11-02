# 🗺️ COMPLETE CUSTOMER JOURNEY - END-TO-END AUDIT

**TestNotifier.co.uk - Customer Experience Flow**  
**Date:** November 2, 2025  
**Status:** Testing all steps from visitor → paying customer → active user

---

## 📍 JOURNEY OVERVIEW

```
VISITOR → INTERESTED → SIGN UP → SUBSCRIBE → DOWNLOAD → INSTALL → MONITOR → BOOK SLOT
   ↓          ↓           ↓          ↓           ↓          ↓         ↓         ↓
Website   Explore     Create    Choose      Get       Setup    Add      Auto-
Landing   Features    Account    Plan     Extension  Chrome  Pupils   Booking
```

**Timeline:** 10-15 minutes from landing to first monitor active  
**Conversion Points:** 7 critical steps (any break = lost customer)

---

## 🚶 STEP-BY-STEP CUSTOMER JOURNEY

---

### **STEP 1: LANDING ON WEBSITE** 🌐

#### **User Action:**
- Types `testnotifier.co.uk` in browser
- Page loads

#### **What They See:**
- Hero section with headline: "Never Miss an Earlier Test Slot"
- Trust badge: "Trusted by 500+ learners & driving instructors"
- Two CTA buttons: "View Pricing" and "How Does It Work?"
- Extension preview mockup
- Stats: 500+ Active Users, 95% Success Rate, 8 weeks Avg. Time Saved

#### **What They Do:**
- Read headline
- Scan the page
- Either:
  - Click "View Pricing" (immediate)
  - Scroll to learn more (cautious)
  - Click "How Does It Work?" (research mode)

#### **Backend Required:** ❌ NONE (static content)

#### **Status:** ✅ **WORKING** (Verified in previous fixes)

---

### **STEP 2: EXPLORING FEATURES** 🔍

#### **User Journey:**
Scrolls through sections:

**2a. Problem Section**
- Sees relatable problems (months-long waits, frustration)

**2b. Solution Section**  
- Understands how TestNotifier solves the problem

**2c. How It Works**
- Sees 5-minute installation guide with hover boxes
- Learns about the process

**2d. Pricing Section**
- Sees 4 plans: £30 One-Off, £25 Starter, £45 Premium, £80 Professional
- Compares features
- Decides which plan fits their needs

**2e. FAQ Section**
- Reads common questions
- Understands trial terms, rebook attempts, compatibility

**2f. Social Proof**
- Sees testimonials (if any)
- Builds trust

#### **What They Do:**
- Read features
- Compare pricing plans
- Check FAQ for concerns
- Click "Subscribe - £XX/month" button on chosen plan

#### **Backend Required:** ❌ NONE (static content)

#### **Status:** ⚠️ **NEEDS VERIFICATION**
- [ ] Pricing section visible (recently fixed)
- [ ] All buttons clickable
- [ ] Smooth scroll works
- [ ] Contact Support opens email

---

### **STEP 3: ACCOUNT CREATION** 👤

#### **User Action:**
Clicks "Subscribe - £XX/month" button on pricing card

#### **What Happens:**
**CRITICAL DECISION POINT:** Are they logged in?

**Path A: NOT LOGGED IN (NEW USER)**
1. ⚠️ **QUESTION:** What happens? Do they:
   - Get redirected to sign up?
   - See a modal asking to sign in/register?
   - Go straight to Stripe checkout (guest checkout)?

**Path B: LOGGED IN (EXISTING USER)**
1. Proceed directly to Stripe checkout

#### **Current Implementation:**
Let me check...

#### **Status:** 🔴 **NEEDS INVESTIGATION**
- Must verify what clicking "Subscribe" does when NOT logged in
- Check if AuthModal opens or Stripe checkout opens

---

### **STEP 4A: REGISTRATION (If Not Logged In)** 📝

#### **User Action:**
Opens sign-up modal/page

#### **What They See:**
- Sign Up form with:
  - Name field
  - Email field
  - Password field
  - Confirm Password field
- "Continue with Google" button
- "Already have an account? Sign In" link

#### **What They Do:**
**Option 1: Email/Password**
1. Enter name (e.g., "Sarah Johnson")
2. Enter email (e.g., "sarah@example.com")
3. Enter password (minimum 6 characters)
4. Confirm password
5. Click "Create Account"

**Option 2: Google OAuth**
1. Click "Continue with Google"
2. Redirected to Google consent screen
3. Grant permissions
4. Redirected back to testnotifier.co.uk

#### **Backend Flow:**

**Email/Password:**
```
POST /api/auth/register
Body: { name, email, password }
↓
Backend creates user in database
↓
Returns: { token, user, subscription }
↓
Frontend stores token in localStorage
↓
Redirects to: Dashboard or Pricing (to complete subscription)
```

**Google OAuth:**
```
GET /api/auth/google
↓
Redirects to Google OAuth
↓
User grants permission
↓
Google redirects to: /api/auth/google/callback?code=...
↓
Backend exchanges code for Google profile
↓
Creates/finds user in database
↓
Redirects to: /auth/callback?accessToken=...&userId=...
↓
Frontend stores tokens
↓
Redirects to: Dashboard
```

#### **Backend Required:**
- ✅ `POST /api/auth/register` endpoint
- ✅ `GET /api/auth/google` endpoint
- ✅ `GET /api/auth/google/callback` endpoint
- ✅ User model in database
- ✅ JWT token generation
- ✅ Password hashing (bcrypt)

#### **Status:** 🟡 **PARTIALLY WORKING**
- ✅ Google OAuth flow implemented (recently fixed)
- ⚠️ Email/password registration - **NEEDS BACKEND VERIFICATION**
- ⚠️ Database connection - **NEEDS VERIFICATION**

---

### **STEP 4B: SIGN IN (Existing Users)** 🔐

#### **User Action:**
Clicks "Sign In" in header or "Already have account" link

#### **What They See:**
- Sign In modal with:
  - Email field
  - Password field
  - "Continue with Google" button
  - "Forgot password?" link
  - "Don't have an account? Sign Up" link

#### **What They Do:**
1. Enter email
2. Enter password
3. Click "Sign In"
   OR
1. Click "Continue with Google"
2. Complete OAuth flow

#### **Backend Flow:**
```
POST /api/auth/login
Body: { email, password }
↓
Backend verifies credentials
↓
Returns: { token, user, subscription }
↓
Frontend stores token
↓
Redirects to: Dashboard
```

#### **Backend Required:**
- ✅ `POST /api/auth/login` endpoint
- ✅ Password verification (bcrypt.compare)
- ✅ JWT token generation
- ✅ User lookup in database

#### **Status:** ⚠️ **NEEDS VERIFICATION**
- Check if login endpoint exists
- Verify password comparison works

---

### **STEP 5: CHOOSING SUBSCRIPTION** 💳

#### **User Action:**
After login/registration, selects a subscription plan

#### **What Happens:**
1. User clicks "Subscribe - £XX/month" button
2. Frontend calls backend to create Stripe checkout session
3. User redirected to Stripe hosted checkout page

#### **Frontend Code:**
```typescript
// components/PricingSection.tsx (or figma/PricingSection.tsx)
const handlePlanSelect = async (planId: string) => {
  setLoading(planId);
  
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      priceId: planId, 
      planName: 'Starter', 
      planType: 'subscription' 
    })
  });
  
  const { sessionId } = await response.json();
  
  const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
  await stripe.redirectToCheckout({ sessionId });
};
```

#### **Backend Flow:**
```
POST /api/create-checkout-session
Body: { priceId, planName, planType }
↓
Backend creates Stripe checkout session
↓
Returns: { sessionId }
↓
Frontend redirects to Stripe
```

#### **What User Sees on Stripe:**
- Plan name and price
- Card details form
- Billing address
- "Subscribe" button
- Trial terms (if applicable)

#### **What They Enter:**
- Card number (test: 4242 4242 4242 4242)
- Expiry date (any future date)
- CVC (any 3 digits)
- Billing address

#### **Backend Required:**
- ✅ `POST /api/create-checkout-session` endpoint
- ✅ Stripe API integration
- ✅ Price IDs configured in Stripe
- ✅ Success/cancel URLs configured

#### **Status:** ⚠️ **NEEDS VERIFICATION**
- Check if endpoint exists and works
- Verify Stripe price IDs are correct
- Test with real Stripe test mode

---

### **STEP 6: PAYMENT COMPLETION** ✅

#### **What Happens:**

**Success Path:**
1. Stripe processes payment
2. User redirected to: `https://testnotifier.co.uk/success?session_id=...`
3. Success page shows confirmation
4. Stripe sends webhook to: `POST /api/webhooks/stripe`
5. Backend processes webhook
6. Backend updates user subscription status to "active"
7. Backend grants access to features

**Cancel Path:**
1. User clicks "Back" on Stripe page
2. Redirected to: `https://testnotifier.co.uk/cancel`
3. Cancel page shows message
4. No payment processed

#### **Backend Webhook Flow:**
```
Stripe sends webhook: checkout.session.completed
↓
POST /api/webhooks/stripe
↓
Verify webhook signature (security)
↓
Extract session data
↓
Find user by customer_id or email
↓
Update user.subscription:
  - status: 'active'
  - tier: 'starter' | 'premium' | 'professional'
  - currentPeriodEnd: Date
  - stripeCustomerId: customer_id
  - stripeSubscriptionId: subscription_id
↓
Save to database
↓
Send confirmation email (optional)
↓
Return 200 OK to Stripe
```

#### **Backend Required:**
- ✅ `POST /api/webhooks/stripe` endpoint
- ✅ Webhook signature verification
- ✅ Event handlers for:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`
- ✅ Database update logic (JUST IMPLEMENTED)

#### **Status:** ✅ **JUST FIXED** (webhook handlers implemented)

---

### **STEP 7: POST-PAYMENT DASHBOARD** 📊

#### **User Action:**
After successful payment, clicks "Go to Dashboard" or navigates to dashboard

#### **What They See:**
- Welcome message with their name
- Current subscription tier badge
- Subscription details:
  - Plan name
  - Price
  - Status (Active/Trial/Past Due)
  - Next billing date
- Quick actions:
  - Download Extension
  - Manage Billing
  - Settings

#### **What They Can Do:**
1. **Download Extension** - Opens download page or downloads ZIP
2. **Manage Billing** - Opens Stripe Customer Portal
3. **View Extension Setup** - Scroll to installation guide

#### **Frontend Requirements:**
- ✅ `DashboardPage.tsx` component
- ✅ Fetch user data from localStorage or API
- ✅ Display subscription status
- ✅ Billing portal button (JUST FIXED)

#### **Backend Requirements:**
- ✅ `GET /api/subscriptions/current` - Fetch user subscription
- ✅ `POST /api/billing/create-portal-session` - Generate billing portal URL

#### **Status:** 🟡 **PARTIALLY WORKING**
- ✅ Dashboard UI exists
- ⚠️ Subscription data fetch - **NEEDS VERIFICATION**
- ✅ Billing portal - JUST FIXED
- ⚠️ Extension download - **NEEDS VERIFICATION**

---

### **STEP 8: DOWNLOADING EXTENSION** 📥

#### **User Action:**
Clicks "Download Extension" button

#### **What Should Happen:**
1. Extension ZIP file downloads to user's Downloads folder
2. Custom modal shows (not alert) - JUST FIXED
3. Page scrolls to installation guide

#### **Current Implementation:**
```typescript
// HeroSection.tsx - JUST UPDATED
const handleInstallClick = () => {
  // Scrolls to installation guide
  // Shows custom modal (not alert)
};
```

#### **What We Need:**
- Extension ZIP file available at: `/downloads/testnotifier-extension.zip`
- OR: Direct download link
- OR: Google Chrome Web Store link (preferred for production)

#### **Status:** 🔴 **CRITICAL GAP IDENTIFIED**
- ⚠️ No actual extension ZIP file in `/public/downloads/`
- ⚠️ Extension download mechanism unclear
- ⚠️ Need to verify extension is available for download

**FIX NEEDED:**
1. Package extension as ZIP
2. Host in `/public/downloads/testnotifier-extension.zip`
3. OR: Publish to Chrome Web Store (production method)

---

### **STEP 9: INSTALLING EXTENSION** 🔧

#### **User Action:**
Follows installation guide

#### **What They Do:**
1. Extract ZIP file (if downloaded as ZIP)
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select extracted folder
6. Extension appears in toolbar

#### **What They See in Extension:**
- TestNotifier icon in Chrome toolbar
- Click icon → Popup opens
- See: TN brand logo (JUST FIXED), subscription tier, stats

#### **Backend Required:** ❌ NONE (local Chrome installation)

#### **Status:** ✅ **EXTENSION FILES READY**
- ✅ Extension exists in `READY_TO_DEPLOY_EXTENSION/`
- ✅ All files present (popup.html, popup.js, background.js, etc.)
- ✅ TN logo integrated
- ⚠️ Needs to be packaged as ZIP for download

---

### **STEP 10: AUTHENTICATING EXTENSION** 🔐

#### **User Action:**
Opens extension popup for first time

#### **What Happens:**
**CRITICAL QUESTION:** How does extension know user's subscription?

**Option 1: Login in Extension**
- User enters email/password in extension
- Extension calls `/api/auth/login`
- Gets token + subscription data

**Option 2: Auto-Sync from Website**
- Extension reads localStorage from website (same domain)
- Gets auth_token automatically
- Validates with backend

**Option 3: API Key**
- User generates API key in dashboard
- Pastes into extension
- Extension validates key

#### **Current Implementation:**
Let me check...

#### **Status:** 🔴 **CRITICAL GAP - NEEDS INVESTIGATION**
- Must verify how extension authenticates
- Must verify how extension knows subscription tier
- Must verify subscription enforcement works

---

### **STEP 11: ADDING FIRST MONITOR** 👥

#### **User Action:**
Clicks "+ Add Monitor" button in extension

#### **What They See:**
- Modal with form:
  - Student Name *
  - Email Address *
  - Phone Number * (UK mobile)
  - Current Test Date *
  - Preferred Test Date (optional)
  - Test Centres * (searchable list)
  - Notification Preferences (Email/SMS/WhatsApp/Browser)

#### **What They Enter:**
Example:
- Name: "Sarah Johnson"
- Email: "sarah.j@example.com"
- Phone: "+44 7123 456789"
- Current Date: "2025-03-15"
- Preferred: "2025-02-01"
- Centres: London (Wood Green), London (Hendon), Manchester (Bury Old Road)
- Notifications: ✅ Email, ✅ SMS, ✅ Browser

#### **What They Click:**
- "Add Monitor" submit button

#### **What Happens:**
1. Extension validates form
2. Checks subscription limits (e.g., Starter = max 3 monitors, max 3 centres)
3. Saves monitor to `chrome.storage.local`
4. Sends to background.js to start monitoring
5. UI updates showing new monitor card

#### **Backend Flow:**
```
OPTION A: Extension-only (offline)
- Stored in chrome.storage.local ✅
- No backend call
- Monitoring happens in background.js

OPTION B: Sync to backend (recommended)
POST /api/monitors/create
Body: { monitor data }
↓
Backend saves monitor
↓
Associates with user account
↓
Returns: { monitorId }
```

#### **Status:** ⚠️ **NEEDS INVESTIGATION**
- ✅ Add Monitor form fully implemented (verified)
- ✅ Form validation works
- ✅ chrome.storage.local saves data
- ⚠️ Backend sync - **CHECK IF IMPLEMENTED**
- ⚠️ Subscription limit enforcement - **VERIFY**

---

### **STEP 12: MONITORING STARTS** 🔄

#### **User Action:**
NONE (automatic)

#### **What Happens:**
1. background.js receives new monitor from popup.js
2. Starts checking DVSA website at intervals
3. For each monitor:
   - Opens DVSA booking page
   - Checks for slots earlier than current test date
   - Compares with preferred date (if set)
   - If found → Triggers notification

#### **Backend Flow:**
```
OPTION A: Extension-only (current)
background.js → content-script.js → Scrapes DVSA
↓
Finds slots
↓
Stores in chrome.storage.local
↓
Sends notifications

OPTION B: Backend monitoring (scalable)
Extension → POST /api/monitors/check → Backend scrapes
↓
Backend finds slots
↓
Backend stores results
↓
Backend sends notifications (Email/SMS/WhatsApp)
↓
Extension polls for updates
```

#### **Status:** ⚠️ **NEEDS CLARIFICATION**
- ✅ background.js exists
- ✅ content-script.js exists
- ⚠️ Is monitoring happening in extension OR backend?
- ⚠️ How often does it check? (avoid DVSA rate limiting)

---

### **STEP 13: SLOT FOUND NOTIFICATION** 🔔

#### **User Action:**
NONE (receives notification)

#### **What Happens:**
1. Monitoring finds earlier slot
2. Notification system triggers based on user preferences:
   - ✅ Browser notification (Chrome)
   - 📧 Email notification (if enabled)
   - 📱 SMS notification (if Starter+)
   - 💬 WhatsApp notification (if Professional)

#### **Extension Flow:**
```
background.js detects slot
↓
notificationsManager.sendSlotFoundNotification(monitor, slot, subscription)
↓
Sends based on tier:
- Browser: chrome.notifications.create()
- Email/SMS/WhatsApp: POST /api/notifications/send
```

#### **Backend Flow:**
```
POST /api/notifications/send
Body: { 
  type: 'slot_found',
  monitorId,
  email,
  phone,
  slot: { date, time, centre },
  notificationTypes: ['email', 'sms', 'whatsapp']
}
↓
Backend sends notifications:
- Email: SendGrid/Nodemailer
- SMS: Twilio
- WhatsApp: Twilio/WhatsApp Business API
```

#### **Backend Required:**
- ⚠️ `POST /api/notifications/send` endpoint
- ⚠️ Email service integration (SendGrid, etc.)
- ⚠️ SMS service integration (Twilio)
- ⚠️ WhatsApp integration

#### **Status:** 🔴 **CRITICAL - NEEDS IMPLEMENTATION**
- ✅ Extension notification logic exists
- ⚠️ Backend notification endpoint - **MISSING?**
- ⚠️ Twilio integration - **MISSING?**
- ⚠️ Email service - **MISSING?**

---

### **STEP 14: VIEWING FOUND SLOTS** 👀

#### **User Action:**
1. Opens extension popup
2. Sees monitor card showing "3 slots found"
3. Clicks on "3 slots found" badge

#### **What They See:**
- Modal showing all found slots:
  - Date & Time
  - Test Centre
  - "Book This Slot Now" button for each slot

#### **What They Do:**
- Review slots
- Choose best one
- Click "Book This Slot Now"

#### **Status:** ✅ **WORKING** (verified in extension)

---

### **STEP 15: AUTO-BOOKING SLOT** 🎯

#### **CRITICAL FEATURE - The Main Value Proposition**

#### **User Action:**
Clicks "Book This Slot Now" button

#### **What Should Happen:**

**Pre-Flight Checks:**
1. Verify subscription tier allows auto-booking
2. Check daily rebook quota (Starter: 2/day, Premium: 5/day, Professional: 10/day)
3. Verify license number is saved
4. Confirm user wants to proceed

**Auto-Booking Flow:**
```
popup.js → "Book This Slot Now" clicked
↓
Check subscription tier and quota
↓
Send to background.js: { action: 'bookSlot', slot, monitor }
↓
background.js → dvsa-auto-booking.js
↓
Stealth mode activates (anti-detection)
↓
Navigate to DVSA change booking page
↓
Fill in license number
↓
Select test centre
↓
Select date
↓
Select time slot
↓
Confirm booking
↓
Send confirmation to user (Email/SMS)
↓
Update monitor status: "Booked"
```

#### **Backend Flow (Optional but Recommended):**
```
Extension → POST /api/bookings/attempt
Body: { monitorId, slot, userId }
↓
Backend logs booking attempt
↓
Backend updates quota usage
↓
Backend sends confirmation notification
↓
Returns: { success, remainingQuota }
```

#### **Backend Required:**
- ⚠️ `POST /api/bookings/attempt` - Log booking attempts
- ⚠️ Quota tracking per user per day
- ⚠️ Confirmation notification sending

#### **Status:** 🟡 **PARTIALLY IMPLEMENTED**
- ✅ Auto-booking logic exists (`dvsa-auto-booking.js`)
- ✅ Stealth mode integrated
- ✅ Subscription checks in popup.js
- ⚠️ Backend quota tracking - **NEEDS VERIFICATION**
- ⚠️ Backend logging - **NEEDS VERIFICATION**

---

### **STEP 16: POST-BOOKING** 🎉

#### **What User Sees:**
- Success notification (Email/SMS/WhatsApp/Browser)
- Extension shows booking confirmed
- Monitor status updated
- Activity log shows booking attempt

#### **What Backend Does:**
- Logs successful booking
- Updates quota (decrements daily attempts)
- Sends confirmation email
- Updates monitor status in database (if synced)

#### **Status:** ⚠️ **NEEDS FULL VERIFICATION**

---

## 🔍 CRITICAL BACKEND VERIFICATION NEEDED

Let me now check what backend endpoints ACTUALLY exist...

---


