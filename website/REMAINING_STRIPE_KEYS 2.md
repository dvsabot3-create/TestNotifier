# Stripe Configuration - Remaining Keys

## ✅ **What You Already Have:**
- Secret key: `sk_test_...` ✅
- Publishable key: `pk_test_...` ✅

## 🔧 **What You Need:**

### **1. VITE_STRIPE_PUBLISHABLE_KEY**
**This is the SAME as your publishable key!** 
Just use the same `pk_test_...` value you already have.

### **2. STRIPE_WEBHOOK_SECRET (whsec_...)**

**To get your webhook secret, you need to:**

1. **Go to Developers section** (left sidebar at the bottom)
2. Click **"Webhooks"**
3. Click **"Add endpoint"**
4. Enter your webhook URL: `https://testnotifier.co.uk/api/webhooks/stripe`
5. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **"Add endpoint"**
7. **Copy the "Signing secret"** - this is your webhook secret (starts with `whsec_`)

## 📝 **Final Configuration**

Your `.env.local` should have:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY  # Same as above!
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

## 🎯 **Quick Summary**

1. ✅ **VITE_STRIPE_PUBLISHABLE_KEY** = Same as your publishable key
2. ⏳ **STRIPE_WEBHOOK_SECRET** = Create webhook endpoint first, then get the secret
3. 🔄 **Restart server** after updating all values

The webhook secret is generated AFTER you create the webhook endpoint, so you need to do that step in Stripe first! 🚀
