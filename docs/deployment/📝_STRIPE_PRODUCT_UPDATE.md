# 📝 STRIPE PRODUCT NAME UPDATE
## Update Professional → ADI Professional in Stripe Dashboard

**Date:** November 3, 2025  
**Action Required:** Update Stripe product name to match website branding

---

## ✅ WHAT'S BEEN UPDATED IN CODE

All references to "Professional" tier have been changed to "ADI Professional":

✅ Website pricing cards  
✅ Extension popup display  
✅ FAQs (both versions)  
✅ Subscription modal  
✅ Download page  
✅ Stripe webhook mapping  
✅ Auth callback page  

---

## 🎯 STRIPE DASHBOARD UPDATE REQUIRED

### Current State:
Your Stripe product is likely named: **"Professional"** or **"Professional Plan"**

### Required Change:
Rename to: **"ADI Professional"**

---

## 📝 HOW TO UPDATE STRIPE PRODUCT NAME

### Step 1: Login to Stripe Dashboard
Go to: https://dashboard.stripe.com/products

### Step 2: Find the Professional Product
- Look for product with price ID: `price_1SMSgl0xPOxdopWPQqujVkKi`
- Current name: "Professional" or "Professional Plan"
- Price: £80.00 GBP / month

### Step 3: Edit Product
1. Click on the product
2. Click **"Edit product"** button (top right)
3. Change **Name** field to: `ADI Professional`
4. Optionally update **Description** to:
   ```
   Premium tier for Approved Driving Instructors (ADIs). 
   Manage up to 20 pupils with multi-pupil dashboard, 
   WhatsApp notifications, and DVSA-compliant workflow.
   ```
5. Click **"Save product"**

---

## ⚠️ IMPORTANT NOTES

### Price ID Stays the Same
- ✅ `price_1SMSgl0xPOxdopWPQqujVkKi` - DO NOT CHANGE
- The price ID is what connects Stripe to your database
- Only the DISPLAY NAME changes

### Existing Customers
- ✅ Existing subscribers NOT affected
- They'll see updated product name in Stripe invoices
- Their subscription continues normally

### Webhook Mapping
✅ Already handles both names:
```javascript
'ADI Professional': 'professional',  // New name
'Professional': 'professional',      // Legacy mapping (backwards compatible)
```

---

## 🔍 VERIFICATION

After updating Stripe product name:

### 1. Test New Checkout
1. Go to testnotifier.co.uk
2. Click "Subscribe - £80/month" on ADI Professional tier
3. Verify Stripe checkout page shows: **"ADI Professional"**
4. Complete test purchase (use Stripe test card if in test mode)

### 2. Check Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Check recent events for `checkout.session.completed`
4. Verify `metadata.planName` = "ADI Professional"

### 3. Check Customer Invoice
1. Stripe Dashboard → Customers
2. Find test customer
3. View invoice
4. Should show "ADI Professional" as product name

---

## 🎯 OPTIONAL: Update Stripe Product Metadata

While editing the product, consider adding metadata for internal tracking:

```json
{
  "target_market": "driving_instructors",
  "adi_tier": "true",
  "pupils_limit": "20",
  "dvsa_compliant": "true",
  "april_2025_regulations": "compliant"
}
```

This helps with:
- Analytics
- Future reporting
- Product differentiation

---

## ✅ CHECKLIST

- [ ] Login to Stripe Dashboard
- [ ] Navigate to Products
- [ ] Find Professional tier (price_1SMSgl0xPOxdopWPQqujVkKi)
- [ ] Edit product name to "ADI Professional"
- [ ] Update description (optional)
- [ ] Save changes
- [ ] Test checkout flow
- [ ] Verify webhook receives "ADI Professional"
- [ ] Check customer invoice displays correctly

---

**Estimated Time:** 5 minutes

**Risk:** ZERO - Existing subscriptions continue normally, price ID unchanged


