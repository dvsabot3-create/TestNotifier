# 🔧 FIX GOOGLE OAUTH - EXACT STEPS

**Issue:** Getting "oauth_failed" error  
**Fix Time:** 2 minutes  
**Required:** Google Cloud Console access

---

## 🎯 **STEP 1: OPEN GOOGLE CLOUD CONSOLE**

**Go to this URL:**
```
https://console.cloud.google.com/apis/credentials
```

**You'll see:** A list of credentials

---

## 🎯 **STEP 2: FIND YOUR OAUTH CLIENT**

**Look for:** 
- Type: "OAuth 2.0 Client IDs"
- Name: Something like "Web client 1" or "TestNotifier"
- Client ID starts with: `838852765083-...`

**Click on it**

---

## 🎯 **STEP 3: CHECK AUTHORIZED REDIRECT URIs**

Scroll down to section: **"Authorized redirect URIs"**

**What you SHOULD see:**
```
✅ https://testnotifier.co.uk/api/auth/google/callback
```

**What you MIGHT see (WRONG):**
```
❌ http://localhost:3002/api/auth/google/callback
❌ https://www.testnotifier.co.uk/api/auth/google/callback (has www.)
❌ https://testnotifier.co.uk/auth/google/callback (missing /api)
```

---

## 🎯 **STEP 4: ADD THE CORRECT URI**

**If it's NOT there:**

1. Click **"+ ADD URI"** button
2. Paste this EXACT URL:
   ```
   https://testnotifier.co.uk/api/auth/google/callback
   ```
3. Press Enter or click elsewhere
4. Scroll to bottom
5. Click **"SAVE"** button
6. Wait for confirmation message

**Important:** The URI must be EXACTLY as shown (https, no www, /api/auth/google/callback)

---

## 🎯 **STEP 5: WAIT & TEST**

**Wait:** 1-2 minutes for Google to propagate changes

**Then test:**
1. Open new incognito window (Cmd+Shift+N)
2. Go to: https://testnotifier.co.uk
3. Click "Sign In"
4. Click Google sign-in
5. Should work! ✅

---

## ✅ **HOW TO VERIFY IT WORKED:**

**SUCCESS:**
- Google login page appears
- You select your Google account
- Redirects to Dashboard (or pricing if no subscription)
- No "oauth_failed" error

**STILL BROKEN:**
- Still shows "Authentication Failed" error
- URL still has `?error=oauth_failed`

---

## 🆘 **IF STILL BROKEN AFTER ADDING URI:**

### **Check #1: Verify Environment Variable in Render**

Go to: https://dashboard.render.com/web/srv-d42iob6r433s73dmlpt0/env

**Find:** `GOOGLE_CALLBACK_URL`  
**Should be:** `https://testnotifier.co.uk/api/auth/google/callback`

**If different:** Update it and redeploy

---

### **Check #2: Look at Render Logs**

Go to: Render Dashboard → Logs

**Search for:**
```
Google OAuth callback error:
```

**The error message will tell you EXACTLY what Google said**

Common errors:
- `redirect_uri_mismatch` → URI not whitelisted (Step 4)
- `invalid_client` → Wrong Client ID/Secret
- `access_denied` → User cancelled login

---

### **Check #3: Verify Client ID/Secret Match**

**In Google Cloud Console:**
- Copy your Client ID
- Copy your Client Secret

**In Render Environment:**
- Paste into `GOOGLE_CLIENT_ID`
- Paste into `GOOGLE_CLIENT_SECRET`

Make sure they EXACTLY match (no spaces, no line breaks)

---

## 📋 **CHECKLIST:**

**In Google Cloud Console:**
- [ ] OAuth 2.0 Client exists
- [ ] Redirect URI: `https://testnotifier.co.uk/api/auth/google/callback`
- [ ] Clicked "Save"
- [ ] Waited 1-2 minutes

**In Render:**
- [ ] `GOOGLE_CLIENT_ID` matches Console
- [ ] `GOOGLE_CLIENT_SECRET` matches Console  
- [ ] `GOOGLE_CALLBACK_URL=https://testnotifier.co.uk/api/auth/google/callback`
- [ ] Latest deployment is "Live"

**Test:**
- [ ] Cleared browser cache
- [ ] Tried sign-in in incognito mode
- [ ] Works! ✅

---

## 🎯 **WHAT'S IN THE EXTENSION ZIPS:**

The extension ZIPs do NOT contain backend OAuth code.

**Extension has:**
- ✅ Login screen UI
- ✅ "Sign In with Google" button
- ✅ Opens website URL: `https://testnotifier.co.uk/api/auth?action=google&state=/extension-login`
- ✅ Listens for token via `chrome.runtime.onMessage`
- ✅ Stores token in `chrome.storage.local`

**Backend has (on Render):**
- ✅ Google OAuth strategy (with `passReqToCallback: true`)
- ✅ State preservation
- ✅ JWT token generation
- ✅ User database creation

**The extension relies on the BACKEND (Render) to handle Google OAuth.**

---

## 🚀 **SO:**

**Extension ZIPs:** ✅ Have latest code (created 16:50-16:58 today)  
**Backend OAuth:** ✅ Deployed to Render (pushed at 16:48 today)  
**Google Cloud Console:** ❌ NEEDS redirect URI added (YOU must do this)

---

**Add the redirect URI in Google Cloud Console and it will work! The code is ready - Google just needs to trust the callback URL. 🔧**

