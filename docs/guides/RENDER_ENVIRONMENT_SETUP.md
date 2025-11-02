# 🔧 RENDER ENVIRONMENT VARIABLES - COMPLETE SETUP

**Service:** testnotifier-website  
**Purpose:** Final environment configuration for 100% deployment  

---

## 📋 ALL REQUIRED ENVIRONMENT VARIABLES

### Copy these into Render (if not already there):

```env
# ============================================
# AUTHENTICATION
# ============================================

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://testnotifier-website.onrender.com/api/auth/google/callback

JWT_SECRET=your_jwt_secret_key_here

# ============================================
# FRONTEND
# ============================================

FRONTEND_URL=https://testnotifier.co.uk

# ============================================
# STRIPE PAYMENTS
# ============================================

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================
# SMS & WHATSAPP (Already Set)
# ============================================

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+44...
TWILIO_WHATSAPP_NUMBER=whatsapp:+44...

# ============================================
# DATABASE (ADD THIS NOW!)
# ============================================

DATABASE_URL=mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.1622u73.mongodb.net/testnotifier?retryWrites=true&w=majority
```

---

## 🎯 THE CRITICAL ONE (Add This Now):

### DATABASE_URL

**Key:**
```
DATABASE_URL
```

**Value:**
```
mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.1622u73.mongodb.net/testnotifier?retryWrites=true&w=majority
```

**Why it's critical:**
- ✅ Connects backend to MongoDB
- ✅ Saves subscriptions from Stripe webhooks
- ✅ Enables real user accounts
- ✅ Powers subscription validation
- ✅ Makes everything work together

**Without it:**
- ❌ Webhooks can't save data
- ❌ Extension can't validate subscriptions
- ❌ System uses mock data
- ❌ Users can't get access after payment

---

## 📍 HOW TO ADD IN RENDER

### Step-by-Step with Screenshots:

1. **Go to Render Dashboard**
   ```
   URL: https://dashboard.render.com
   ```

2. **Find Your Service**
   ```
   Services List → testnotifier-website
   Click on it
   ```

3. **Navigate to Environment**
   ```
   Left Sidebar:
   ├─ Overview
   ├─ Events
   ├─ Logs
   ├─ Shell
   ├─ Environment  ← CLICK HERE
   ├─ Settings
   └─ ...
   ```

4. **You'll See Current Variables**
   ```
   Should already have:
   ✅ GOOGLE_CLIENT_ID
   ✅ GOOGLE_CLIENT_SECRET
   ✅ JWT_SECRET
   ✅ STRIPE_SECRET_KEY
   ✅ TWILIO_ACCOUNT_SID
   ... etc
   ```

5. **Add New Variable**
   ```
   Click button: "+ Add Environment Variable"
   
   A form appears:
   ┌─────────────────────────────┐
   │ Key:   [DATABASE_URL]       │
   │                             │
   │ Value: [mongodb+srv://...]  │
   │                             │
   │ [Cancel]    [Add Variable]  │
   └─────────────────────────────┘
   ```

6. **Fill In:**
   ```
   Key:   DATABASE_URL
   Value: mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.1622u73.mongodb.net/testnotifier?retryWrites=true&w=majority
   ```

7. **Save**
   ```
   Click "Add Variable" or "Save Changes"
   ```

8. **Auto-Restart Happens**
   ```
   Render will show:
   "Deploying changes..."
   
   Takes 2-3 minutes
   ```

9. **Verify**
   ```
   Go to "Logs" tab
   Watch for:
   ==> Starting server...
   ✅ Database connected successfully
   ✅ TestNotifier website server running on port 10000
   ```

---

## ✅ VERIFICATION

### What to Look For in Logs:

#### ✅ SUCCESS Messages:
```
==> Building...
==> Installing dependencies...
npm WARN deprecated ...
==> Build successful
==> Starting server...
✅ Database connected successfully
✅ MongoDB URI: mongodb+srv://dvsabot3_db_user@cluster0.1622u73.mongodb.net/testnotifier
✅ TestNotifier website server running on port 10000
✅ CORS enabled for: https://testnotifier.co.uk
✅ Auth API routes loaded
✅ Stripe webhook endpoint: /api/webhooks/stripe
```

#### ❌ ERROR Messages (and fixes):

**Error: "Cannot connect to MongoDB"**
```
Fix: Check IP whitelist in MongoDB Atlas
Should have: 0.0.0.0/0 ✅ (you already did this)
```

**Error: "Authentication failed"**
```
Fix: Check connection string username/password
Username: dvsabot3_db_user ✅
Password: 9Jthbxx1rTsze5bG ✅
```

**Error: "Database name not found"**
```
Fix: MongoDB will auto-create "testnotifier" database ✅
Not an actual error - will work on first write
```

---

## 🧪 TEST THE CONNECTION

### After DATABASE_URL is Added:

#### Test 1: Check Render Logs
```
Look for: "Database connected successfully" ✅
```

#### Test 2: Make Test Payment
```
1. Go to website
2. Select any plan
3. Use test card: 4242 4242 4242 4242
4. Complete payment
5. Check Render logs for:
   "✅ User subscription activated: test@email.com"
```

#### Test 3: Check MongoDB
```
1. Go to MongoDB Atlas
2. Browse Collections
3. Database: testnotifier
4. Collection: users
5. Should see new user created ✅
```

#### Test 4: Test Extension
```
1. Download extension
2. Sign in
3. Should show real subscription tier ✅
4. No demo data ✅
```

---

## 🔍 ENVIRONMENT VARIABLE CHECKLIST

### Authentication ✅
```
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ GOOGLE_CALLBACK_URL
✅ JWT_SECRET
```

### Frontend ✅
```
✅ FRONTEND_URL
```

### Payment ✅
```
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
```

### Notifications ✅
```
✅ TWILIO_ACCOUNT_SID
✅ TWILIO_AUTH_TOKEN
✅ TWILIO_PHONE_NUMBER
✅ TWILIO_WHATSAPP_NUMBER
```

### Database ⏳
```
⏳ DATABASE_URL (adding now)
```

---

## 🎯 FINAL CHECK

### Before Adding DATABASE_URL:
- ✅ MongoDB cluster created
- ✅ Database user created
- ✅ IP whitelist configured (0.0.0.0/0)
- ✅ Connection string ready
- ✅ All code deployed to GitHub
- ✅ Render service running

### After Adding DATABASE_URL:
- ✅ Database connection established
- ✅ Webhooks saving to database
- ✅ Subscriptions activated automatically
- ✅ Extension showing real data
- ✅ 100% production ready

---

## 🚀 DEPLOYMENT TIMELINE

```
Now: 99% complete
     ↓
Add DATABASE_URL (30 seconds)
     ↓
Render restarts (2-3 minutes)
     ↓
Database connects (instant)
     ↓
Logs show success (instant)
     ↓
100% COMPLETE! 🎉
```

**Total time:** ~4 minutes

---

## 📞 SUPPORT

### If Something Goes Wrong:

1. **Check Render logs first**
   - Logs tab shows all errors
   - Look for red error messages

2. **Verify MongoDB**
   - Atlas dashboard shows connection attempts
   - Network Access shows allowed IPs

3. **Test connection string**
   - Copy from this document exactly
   - No extra spaces or characters

4. **Check all required env vars**
   - Every variable above should be set
   - No typos in names

---

## 🎉 READY TO GO

**Your connection string (copy this):**
```
mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.1622u73.mongodb.net/testnotifier?retryWrites=true&w=majority
```

**Add it to Render now as DATABASE_URL and you're done!** 🚀

---

**Once you see "Database connected successfully" in the logs, you're 100% LIVE!** ✅

