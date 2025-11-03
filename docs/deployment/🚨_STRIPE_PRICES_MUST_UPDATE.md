# 🚨 STRIPE PRICES & NAMES - CRITICAL UPDATE REQUIRED

**DATE:** November 3, 2025  
**STATUS:** ⚠️ URGENT - Prices in Stripe DO NOT match website  
**IMPACT:** Customers will be charged WRONG amounts

---

## ❌ CURRENT STRIPE CONFIGURATION (WRONG)

Based on `stripe-config.ts`, your Stripe dashboard currently has:

| Plan | Stripe Name | Stripe Price | Website Price | Status |
|------|-------------|--------------|---------------|--------|
| One-Off | "One-Off Rebook" | **£25.00** | **£30.00** | ❌ WRONG |
| Starter | "Starter Plan" | **£19.00** | **£25.00/month** | ❌ WRONG |
| Premium | "Premium Plan" | **£29.00** | **£45.00/month** | ❌ WRONG |
| Professional | **"Professional Plan"** | **£89.00** | **£80.00/month** | ❌ WRONG NAME & PRICE |

---

## ✅ CORRECT CONFIGURATION (What Stripe MUST have)

| Plan | Product Name | Price | Billing | Price ID (Keep Same) | Product ID (Keep Same) |
|------|--------------|-------|---------|----------------------|------------------------|
| **One-Off** | "One-Off Rebook" | **£30.00** | One-time payment | `price_1SMSgh0xPOxdopWPJGe2jU3M` | `prod_TJ4qcziQSrpl7S` |
| **Starter** | "Starter Plan" | **£25.00** | Monthly subscription | `price_1SMSgi0xPOxdopWPUKIVTL2s` | `prod_TJ4q6D7u5ApACP` |
| **Premium** | "Premium Plan" | **£45.00** | Monthly subscription | `price_1SMSgj0xPOxdopWPWujQSxG8` | `prod_TJ4qJczQ4kGUDD` |
| **ADI Professional** | **"ADI Professional"** | **£80.00** | Monthly subscription | `price_1SMSgl0xPOxdopWPQqujVkKi` | `prod_TJ4qbd9Lc5OSeX` |

---

## 📋 STEP-BY-STEP: UPDATE STRIPE DASHBOARD

### **CRITICAL: You CANNOT edit existing prices in Stripe**
You must create NEW prices and update your code with new Price IDs.

---

### **PLAN 1: One-Off Rebook**

1. Go to: https://dashboard.stripe.com/products/prod_TJ4qcziQSrpl7S
2. **Product name:** Should already be "One-Off Rebook" ✅
3. Click **"Add another price"**
4. Set:
   - **Price:** `30.00` GBP
   - **Billing period:** One time
   - **Price description:** "One-off urgent rebook service"
5. Click **"Save price"**
6. Copy the NEW price ID (format: `price_xxxxx`)
7. **Archive the OLD price** `price_1SMSgh0xPOxdopWPJGe2jU3M`

---

### **PLAN 2: Starter Plan**

1. Go to: https://dashboard.stripe.com/products/prod_TJ4q6D7u5ApACP
2. **Product name:** Should already be "Starter Plan" ✅
3. Click **"Add another price"**
4. Set:
   - **Price:** `25.00` GBP
   - **Billing period:** Monthly
   - **Price description:** "Starter subscription - 2 rebooks/day, 3 test centres"
5. Click **"Save price"**
6. Copy the NEW price ID
7. **Archive the OLD price** `price_1SMSgi0xPOxdopWPUKIVTL2s`

---

### **PLAN 3: Premium Plan**

1. Go to: https://dashboard.stripe.com/products/prod_TJ4qJczQ4kGUDD
2. **Product name:** Should already be "Premium Plan" ✅
3. Click **"Add another price"**
4. Set:
   - **Price:** `45.00` GBP
   - **Billing period:** Monthly
   - **Price description:** "Premium subscription - 5 rebooks/day, 5 test centres"
5. Click **"Save price"**
6. Copy the NEW price ID
7. **Archive the OLD price** `price_1SMSgj0xPOxdopWPWujQSxG8`

---

### **PLAN 4: ADI Professional** ⭐ (NAME CHANGE REQUIRED)

1. Go to: https://dashboard.stripe.com/products/prod_TJ4qbd9Lc5OSeX
2. **Edit product name:**
   - Click "..." (three dots) → "Edit product"
   - Change name from **"Professional Plan"** to **"ADI Professional"**
   - Click "Save"
3. Click **"Add another price"**
4. Set:
   - **Price:** `80.00` GBP
   - **Billing period:** Monthly
   - **Price description:** "ADI Professional - 10 rebooks/day, 20 pupils, 999 test centres"
5. Click **"Save price"**
6. Copy the NEW price ID
7. **Archive the OLD price** `price_1SMSgl0xPOxdopWPQqujVkKi`

---

## 🔄 AFTER CREATING NEW PRICES: UPDATE CODE

Once you have the 4 NEW price IDs from Stripe, I will update these files:

### Files that need updating:
1. ✅ `website/lib/stripe-config.ts` - Product config
2. ✅ `website/components/PricingSection.tsx` - PLAN_TO_PRICE_ID mapping
3. ✅ `website/src/pages/AuthCallbackPage.tsx` - PLAN_TO_PRICE_ID mapping
4. ✅ `website/components/subscription/SubscriptionModal.tsx` - priceId for each plan
5. ✅ `website/api/webhooks/stripe.js` - tierMap for webhook processing

---

## 📝 PROVIDE ME WITH NEW PRICE IDs

After creating prices in Stripe, give me:

```
One-Off new price ID: price_xxxxx
Starter new price ID: price_xxxxx
Premium new price ID: price_xxxxx
ADI Professional new price ID: price_xxxxx
```

**Then I will update all 5 files automatically.**

---

## ⚠️ WHY THIS IS CRITICAL

1. **Customer Charge Mismatch:**
   - Website says "£30 one-time" but Stripe charges £25
   - Website says "£45/month" but Stripe charges £29
   - Customers will complain about wrong amounts

2. **Legal/Trust Issues:**
   - Advertising one price but charging another = fraud claim
   - Damages brand reputation immediately

3. **ADI Branding:**
   - Professional plan is now rebranded as "ADI Professional"
   - Stripe receipts will say "Professional Plan" not "ADI Professional"

---

## 🎯 CURRENT STATUS

- ❌ Stripe prices DO NOT match website
- ⚠️ DO NOT launch until this is fixed
- ⏱️ Takes 10 minutes to fix in Stripe dashboard
- ✅ I will update all code once you provide new price IDs

---

**Your move: Update Stripe prices → Give me new Price IDs → I update code → Deploy! 🚀**

