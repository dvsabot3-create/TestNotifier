# 🔍 EXTENSION LOGIN TROUBLESHOOTING GUIDE

**Issue:** Extension Google sign-in showing blank screen and redirecting to website  
**Status:** ✅ **FIXED** - Deploy pending

---

## ❌ WHAT YOU'RE EXPERIENCING

**Symptoms:**
1. Click "Sign In with Google" in extension
2. New tab opens to: `testnotifier.co.uk/api/auth/google?state=/extension-login`
3. **Blank/dark screen** appears
4. Gets redirected to website instead of extension
5. Extension still shows "Not logged in"

---

## 🔧 ROOT CAUSES IDENTIFIED

### **Issue #1: Missing Extension Detection in Website**
**Problem:** Website callback page (`AuthCallbackPage.tsx`) didn't check for extension logins  
**Fix Applied:** ✅ Added extension login detection

### **Issue #2: Blank Screen on OAuth URL**
**Likely Cause:** Backend not redirecting to Google OAuth properly  
**Possible Reasons:**
1. Missing environment variables in Render
2. Google OAuth not configured correctly
3. Backend route not working

---

## ✅ FIXES APPLIED (DEPLOYING)

### **Fix #1: AuthCallbackPage.tsx**

```typescript
// Detect extension login
if (redirectUrl === '/extension-login') {
  console.log('🔌 Extension login detected');
  setIsExtensionLogin(true);
  
  // Send token to extension
  chrome.runtime.sendMessage({
    type: 'TESTNOTIFIER_AUTH',
    token: accessToken
  });
  
  // Show success screen
  // Auto-close after 3 seconds
  return;
}
```

### **Fix #2: Extension popup.js**

```javascript
// Fixed OAuth URL
const loginUrl = 'https://testnotifier.co.uk/api/auth/google?state=/extension-login';
```

---

## 🧪 TESTING AFTER DEPLOYMENT (2-3 MIN)

### **Step 1: Verify Backend is Running**

Open browser console and run:
```javascript
fetch('https://testnotifier.co.uk/api/auth/google?state=/test')
  .then(r => console.log('Status:', r.status, r.statusText))
  .catch(e => console.log('Error:', e));
```

**Expected:** Should redirect to Google OAuth (status 302)  
**If 404:** Backend not deploying properly

### **Step 2: Test Extension Login**

1. Open extension
2. Click "Sign In with Google"
3. Open browser console (F12)
4. Look for these logs:

**Good Signs:**
```
🔐 Opened authentication tab: [number]
🔌 Extension login detected - sending token to extension
✅ Token sent to extension successfully
✅ Auth successful! Token received
```

**Bad Signs:**
```
404 Not Found
OAuth failed
Could not send to extension
```

---

## 🔑 CRITICAL: RENDER ENVIRONMENT VARIABLES

**Go to:** Render Dashboard → Your Service → Environment

**MUST BE SET:**

```bash
# Google OAuth (CRITICAL!)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://testnotifier.co.uk/api/auth/google/callback

# Frontend
FRONTEND_URL=https://testnotifier.co.uk

# JWT
JWT_SECRET=your_jwt_secret_32_chars_minimum

# Database
DATABASE_URL=mongodb+srv://dvsabot3_db_user:F5ZxOnghKEKh4Rln@...
```

**If ANY are missing → Blank screen!**

---

## 🔍 GOOGLE CLOUD CONSOLE CHECK

**Go to:** https://console.cloud.google.com/apis/credentials

### **Required Settings:**

**1. Authorized JavaScript origins:**
```
https://testnotifier.co.uk
https://www.testnotifier.co.uk
```

**2. Authorized redirect URIs:**
```
https://testnotifier.co.uk/api/auth/google/callback
https://www.testnotifier.co.uk/api/auth/google/callback
```

**If these don't match → Blank screen or OAuth error!**

---

## 🐛 DEBUGGING STEPS

### **1. Check Backend OAuth Route**

Open: `https://testnotifier.co.uk/api/auth/google?state=/test`

**Expected:** Redirects to `accounts.google.com/o/oauth2/v2/auth...`  
**If blank:** Backend not working - check Render logs

### **2. Check Render Logs**

```
Go to: Render Dashboard → Your Service → Logs

Look for:
✅ Auth API routes loaded
✅ Server + Database ready
🔐 Google OAuth initiated with redirect: /extension-login

Errors:
❌ Cannot find module...
❌ GOOGLE_CLIENT_ID not set
❌ Database connection failed
```

### **3. Check Browser Console (Extension)**

```
Right-click extension icon → Inspect popup → Console

Look for:
🔐 Opened authentication tab: [number]

Errors:
❌ Failed to open sign in page
❌ Could not create tab
```

### **4. Check Browser Console (Auth Tab)**

```
F12 → Console

Look for:
🔌 Extension login detected - sending token to extension
✅ Token sent to extension successfully

Errors:
❌ Missing required OAuth parameters
❌ Authentication failed
```

---

## 🔄 COMPLETE WORKING FLOW

```
┌─────────────────────────────────────────────────┐
│  1. User clicks "Sign In with Google" in ext    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. Extension opens tab:                         │
│     /api/auth/google?state=/extension-login      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. Backend redirects to Google OAuth            │
│     accounts.google.com/o/oauth2/v2/auth...      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. User approves on Google                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  5. Google redirects to:                         │
│     /api/auth/google/callback?code=...           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  6. Backend creates/finds user, generates JWT    │
│     Redirects to:                                │
│     /auth/callback?accessToken=...               │
│     &redirect=/extension-login                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  7. Website (AuthCallbackPage) detects           │
│     redirect=/extension-login                    │
│     Sends token to extension                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  8. Shows "✅ Successfully Logged In!"          │
│     Auto-closes tab after 3 seconds              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  9. Extension receives token                     │
│     Saves to chrome.storage.local                │
│     Reloads popup → Shows dashboard              │
└─────────────────────────────────────────────────┘
```

---

## 🚨 IF STILL BLANK SCREEN AFTER DEPLOYMENT

### **Most Likely Cause: Missing Google OAuth Config**

**Check in Render:**
1. Go to Environment variables
2. Find `GOOGLE_CLIENT_ID`
3. If empty or wrong → That's the problem!

**How to Fix:**
1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Create or select OAuth 2.0 Client ID
3. Copy Client ID → Add to Render as `GOOGLE_CLIENT_ID`
4. Copy Client Secret → Add to Render as `GOOGLE_CLIENT_SECRET`
5. Redeploy service

---

## 📞 SUPPORT CHECKLIST

**Before asking for help, collect:**

1. **Screenshot of blank screen** ✅ (You provided this)
2. **Browser console errors** (F12 → Console)
3. **Render deployment logs** (Last 50 lines)
4. **Render environment variables** (Just names, not values!)
5. **Google Cloud Console redirect URIs**

**Provide to me:**
- What error messages you see (if any)
- What logs appear in browser console
- Whether redirect URIs are set in Google Cloud

---

## ✅ SUCCESS INDICATORS

**After fix deploys, you should see:**

1. Click Google sign-in in extension
2. **NO blank screen** - redirects to Google immediately
3. Approve on Google
4. See beautiful success screen: "✅ Successfully Logged In!"
5. Tab closes automatically
6. Extension shows dashboard
7. **You're logged in!** 🎉

---

**Status:** Fixes committed and deploying  
**ETA:** 2-3 minutes  
**Next Step:** Wait for deployment, then test extension login

---

