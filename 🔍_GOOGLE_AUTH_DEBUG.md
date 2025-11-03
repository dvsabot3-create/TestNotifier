# 🔍 GOOGLE SIGN-IN DEBUG - ROOT CAUSE ANALYSIS

**Issue:** Google Sign-In keeps redirecting to homepage  
**Reported:** Extension AND website  
**Status:** 🔴 CRITICAL

---

## 🐛 **IDENTIFIED PROBLEMS:**

### **PROBLEM #1: Google OAuth State Parameter Not Preserved**

**How OAuth State Works:**
```
1. User initiates: /api/auth?action=google&state=/extension-login
2. Backend sends to Google WITH state parameter
3. Google redirects back WITH state parameter
4. Backend reads req.query.state
5. Passes to frontend in redirect URL
```

**Current Issue:**
- Line 78: We SET state: `state: redirectUrl`
- Line 93: We READ state: `const redirectUrl = req.query.state`
- **BUT:** Passport Google Strategy doesn't preserve custom state by default!

**Root Cause:**
```javascript
// GoogleStrategy config (Line 44-67)
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    // ❌ MISSING: passReqToCallback: true
  }, ...)
);
```

**Without `passReqToCallback: true`:**
- Passport doesn't give us access to `req.query.state` in callback
- State parameter is lost during OAuth flow
- We default to '/' → homepage redirect

---

### **PROBLEM #2: Extension Authentication Flow Broken**

**Extension Flow:**
```
1. Extension opens: /api/auth?action=google&state=/extension-login
2. OAuth completes
3. Redirects to: /auth/callback?redirect=/ (WRONG - should be /extension-login)
4. Frontend checks: redirectUrl.includes('extension-login') → FALSE
5. Goes to dashboard instead of /extension-auth-success
6. Token never sent to extension
```

**Why It Fails:**
- State parameter lost (Problem #1)
- Defaults to '/'
- Extension never receives token

---

### **PROBLEM #3: Website Sign-In Also Affected**

**Website Flow:**
```
1. User clicks "Sign In" (no state param)
2. OAuth completes
3. Should go to: /dashboard
4. Actually goes to: / (homepage) then immediately /dashboard
5. Extra redirect causes "redirect loop" feeling
```

---

## 🔧 **THE FIXES NEEDED:**

### **FIX #1: Enable State Preservation in Passport**

```javascript
// website/api/auth/index.js - Line 44-50

// BEFORE:
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => { ... })
);

// AFTER:
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,  // ✅ ADD THIS!
    store: true  // ✅ ADD THIS!
  }, 
  async (req, accessToken, refreshToken, profile, done) => {  // ✅ ADD req PARAM
    // Now req.query.state is accessible!
    try {
      const userData = {
        googleId: profile.id,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
        firstName: profile.name.givenName || '',
        lastName: profile.name.familyName || '',
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
        state: req.query.state || '/'  // ✅ PRESERVE STATE HERE
      };
      done(null, userData);
    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error, null);
    }
  })
);
```

### **FIX #2: Read State from userData**

```javascript
// website/api/auth/index.js - Line 93

// BEFORE:
const redirectUrl = req.query.state || '/';

// AFTER:
const redirectUrl = userData.state || req.query.state || '/';
// userData.state comes from Passport strategy (more reliable)
```

---

## 🧪 **HOW TO TEST:**

### **Test 1: Website Sign-In**
```
1. Go to https://testnotifier.co.uk
2. Click "Sign In"
3. Sign in with Google
4. Should go STRAIGHT to Dashboard (no homepage flash)
```

### **Test 2: Extension Sign-In**
```
1. Load extension
2. Click "Sign In with Google"
3. Opens: /api/auth?action=google&state=/extension-login
4. Sign in with Google
5. Should redirect to: /extension-auth-success
6. Token should sync to extension
7. Extension should reload showing authenticated
```

### **Test 3: Select Plan Flow**
```
1. Click "£45/month Premium"
2. Sign in modal appears
3. Sign in with Google
4. Should go STRAIGHT to Stripe checkout (no dashboard, no homepage)
```

---

## 📊 **CURRENT VS FIXED FLOW:**

### **CURRENT (BROKEN):**
```
Extension → /api/auth?action=google&state=/extension-login
  ↓
Google OAuth (state parameter LOST)
  ↓
Callback: /auth/callback?redirect=/  (defaults to '/')
  ↓
Frontend: redirectUrl = '/' → navigate('/')
  ↓
Homepage → Then redirects to dashboard
  ↓
Extension never gets token ❌
```

### **FIXED:**
```
Extension → /api/auth?action=google&state=/extension-login
  ↓
Google OAuth (state parameter PRESERVED via passReqToCallback)
  ↓
Strategy: userData.state = '/extension-login'
  ↓
Callback: /auth/callback?redirect=/extension-login ✅
  ↓
Frontend: redirectUrl.includes('extension-login') → TRUE
  ↓
Navigate to: /extension-auth-success
  ↓
Token sent via chrome.runtime.sendMessage
  ↓
Extension receives token ✅
```

---

## 🔥 **WHY THIS IS CRITICAL:**

1. **Extension is UNUSABLE** without authentication
2. **Website sign-in feels broken** (redirect loop)
3. **Every user will hit this issue**
4. **Blocks deployment completely**

---

## ✅ **THE SOLUTION:**

**2 line changes:**
1. Add `passReqToCallback: true` to GoogleStrategy config
2. Add `req` parameter to strategy function
3. Preserve `state` in userData object
4. Read `userData.state` in callback

**Time to implement:** 5 minutes  
**Impact:** Fixes BOTH extension AND website auth  
**Risk:** None - standard Passport pattern  

---

**Let me implement this fix NOW.**

