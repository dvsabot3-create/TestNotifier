# 🎯 Stripe Products Setup Guide - TestNotifier

## Current Status
- ✅ Stripe account created
- ✅ In TEST mode (perfect for development)
- ⏳ Need to create products & prices

---

## Step 1: Get Your API Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy these two keys:
   - **Publishable key:** `pk_test_xxxxx` (safe to expose)
   - **Secret key:** `sk_test_xxxxx` (KEEP SECRET!)

---

## Step 2: Create Products in Stripe Dashboard

### Product 1: One-Off Rebook

1. In Stripe Dashboard, go to: **Products** → **Add Product**
2. Fill in:
   - **Name:** One-Off Rebook
   - **Description:** Single guaranteed rebook with 30-day validity
   - **Pricing:**
     - Price: **£30.00**
     - Billing period: **One time**
     - Currency: **GBP**
   - **Click "Add product"**
3. **Copy the Price ID** (starts with `price_xxxxx`)

### Product 2: Starter Plan

1. Click **Add Product** again
2. Fill in:
   - **Name:** Starter Plan
   - **Description:** Monitor up to 3 test centers, 2 rebooks per month
   - **Pricing:**
     - Price: **£25.00**
     - Billing period: **Monthly**
     - Currency: **GBP**
   - **Add trial period:** 7 days
   - **Click "Add product"**
3. **Copy the Price ID** (starts with `price_xxxxx`)

### Product 3: Premium Plan (Most Popular)

1. Click **Add Product** again
2. Fill in:
   - **Name:** Premium Plan
   - **Description:** Monitor up to 5 test centers, 5 rebooks per month
   - **Pricing:**
     - Price: **£45.00**
     - Billing period: **Monthly**
     - Currency: **GBP**
   - **Add trial period:** 7 days
   - **Click "Add product"**
3. **Copy the Price ID** (starts with `price_xxxxx`)

### Product 4: Professional Plan

1. Click **Add Product** again
2. Fill in:
   - **Name:** Professional Plan
   - **Description:** Unlimited pupils, centers & rebooks for driving instructors
   - **Pricing:**
     - Price: **£80.00**
     - Billing period: **Monthly**
     - Currency: **GBP**
   - **Add trial period:** 14 days
   - **Click "Add product"**
3. **Copy the Price ID** (starts with `price_xxxxx`)

---

## Step 3: Save Your Keys

Create a file: `/Users/mosman/Documents/DVLA BOT/website/.env.local`

```bash
# Stripe TEST Keys (for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Stripe Price IDs (copy from Stripe dashboard)
STRIPE_PRICE_ONE_OFF=price_xxxxx
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PREMIUM=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
```

---

## Step 4: Configure Webhook (Optional for now)

We'll set this up after deploying to Vercel. For now, skip it.

---

## Quick Setup (Alternative - Using Stripe CLI)

If you prefer automation, I can create a script that sets up all products at once using the Stripe CLI.

Let me know if you want this option!

---

## Next Steps After Setup

Once you have:
- ✅ API keys saved in `.env.local`
- ✅ 4 products created with Price IDs

Then I'll:
1. Wire up the pricing buttons to Stripe Checkout
2. Create payment success/cancel pages
3. Test the full payment flow

---

**Estimated Time:** 15-20 minutes  
**Current Status:** Waiting for API keys & Product setup

