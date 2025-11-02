# ⚠️ MISSING ENVIRONMENT VARIABLES IN RENDER

**Date:** November 2, 2025  
**Checked:** https://dashboard.render.com/web/srv-d42iob6r433s73dmlpt0/env  

---

## ✅ WHAT YOU HAVE (Confirmed)

From your Render dashboard:
- ✅ `DATABASE_URL` (just added - GOOD!)
- ✅ `FRONTEND_URL`
- ✅ `GOOGLE_CALLBACK_URL`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `JWT_SECRET`
- ✅ `NODE_ENV`
- ✅ `PORT`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `API_BASE_URL`
- ✅ `CORS_ORIGIN`

---

## ⚠️ CRITICAL MISSING VARIABLES

### 🔴 1. STRIPE_WEBHOOK_SECRET (CRITICAL!)

**Why you need it:**
- Verifies that webhook events are actually from Stripe
- Without it, webhooks will fail
- Your subscriptions won't activate

**Where to get it:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click on your webhook endpoint
3. Click "Reveal" under "Signing secret"
4. Copy the value (starts with `whsec_...`)

**Add to Render:**
```
Key:   STRIPE_WEBHOOK_SECRET
Value: whsec_xxxxxxxxxxxxxxxxxxxxxx
```

---

### 🟡 2. TWILIO VARIABLES (For SMS/WhatsApp)

**Check if you have these (click "Show more" in Render):**

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `TWILIO_WHATSAPP_NUMBER` (optional)

**If missing, get them from:**
1. https://console.twilio.com
2. Account Info section
3. Copy Account SID and Auth Token

**Add to Render:**
```
Key:   TWILIO_ACCOUNT_SID
Value: AC...

Key:   TWILIO_AUTH_TOKEN
Value: your_auth_token

Key:   TWILIO_PHONE_NUMBER
Value: +44...

Key:   TWILIO_WHATSAPP_NUMBER
Value: whatsapp:+44...
```

---

## 📋 COMPLETE CHECKLIST

### Required for 100% Functionality:

**Authentication & Core:**
- [✅] `DATABASE_URL` - MongoDB connection
- [✅] `FRONTEND_URL` - Your website URL
- [✅] `GOOGLE_CLIENT_ID` - OAuth
- [✅] `GOOGLE_CLIENT_SECRET` - OAuth
- [✅] `GOOGLE_CALLBACK_URL` - OAuth redirect
- [✅] `JWT_SECRET` - Token signing
- [✅] `NODE_ENV` - Environment
- [✅] `PORT` - Server port

**Stripe Payment:**
- [✅] `STRIPE_SECRET_KEY` - Stripe API
- [❌] `STRIPE_WEBHOOK_SECRET` - **MISSING - ADD THIS!**

**SMS/WhatsApp (Optional but recommended):**
- [❓] `TWILIO_ACCOUNT_SID` - Check "Show more"
- [❓] `TWILIO_AUTH_TOKEN` - Check "Show more"
- [❓] `TWILIO_PHONE_NUMBER` - Check "Show more"
- [❓] `TWILIO_WHATSAPP_NUMBER` - Check "Show more"

**Additional (Already set):**
- [✅] `API_BASE_URL`
- [✅] `CORS_ORIGIN`

---

## 🎯 IMMEDIATE ACTION REQUIRED

### 1. Add STRIPE_WEBHOOK_SECRET (Critical!)

**Without this, payments won't activate subscriptions!**

**How to add:**
1. In Render dashboard (where you are now)
2. Click "+ Add Environment Variable" (or Edit button)
3. Add:
   ```
   Key:   STRIPE_WEBHOOK_SECRET
   Value: whsec_... (from Stripe dashboard)
   ```
4. Click "Save"

---

### 2. Verify Twilio Variables

**Click "Show more" in Render to see if you have:**
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

**If you don't see them, add them from Twilio console**

---

## 🔍 HOW TO GET STRIPE_WEBHOOK_SECRET

### Step-by-Step:

1. **Go to Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **Find Your Webhook:**
   - Look for endpoint: `https://testnotifier-website.onrender.com/api/webhooks/stripe`
   - Click on it

3. **Reveal Signing Secret:**
   - Under "Signing secret"
   - Click "Reveal"
   - Copy the value (starts with `whsec_`)

4. **Add to Render:**
   - Go back to Render environment variables
   - Add new variable:
     ```
     STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx
     ```
   - Save

---

## ✅ AFTER ADDING STRIPE_WEBHOOK_SECRET

**Render will automatically:**
1. Restart your service
2. Webhooks will start verifying correctly
3. Subscriptions will activate automatically

**Check logs for:**
```
✅ Webhook signature verified
✅ User subscription activated: user@email.com
✅ Stripe webhook endpoint: /api/webhooks/stripe
```

---

## 🚨 CRITICAL: DATABASE_URL

**You asked: "or do nee noth database_url"**

**Answer: NO - You only need ONE `DATABASE_URL`**

The one you just added is correct:
```
DATABASE_URL=mongodb+srv://dvsabot3_db_user:9Jthbxx1rTsze5bG@cluster0.1622u73.mongodb.net/testnotifier?retryWrites=true&w=majority
```

✅ **This is the ONLY DATABASE_URL you need!**

---

## 📊 PRIORITY

1. **🔴 URGENT:** Add `STRIPE_WEBHOOK_SECRET` NOW
2. **🟡 IMPORTANT:** Verify Twilio variables (click "Show more")
3. **✅ COMPLETE:** Everything else is set!

---

## 🎯 SUMMARY

**What you have:** ✅ Almost everything!  
**What you need:** ❌ `STRIPE_WEBHOOK_SECRET` (critical!)  
**What to check:** ❓ Twilio variables (might be hidden)  

**Add STRIPE_WEBHOOK_SECRET and you're 100% ready!** 🚀

---

**DATABASE_URL is correct! Only add STRIPE_WEBHOOK_SECRET and you're done!**

