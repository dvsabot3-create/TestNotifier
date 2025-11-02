# Stripe Webhook Setup - Step by Step

## 🎯 **Current Step: Select Events**

### **Step 1: Events From**
- Choose **"Your account"** (the left card)
- This receives events from your TestNotifier account

### **Step 2: API Version**
- Keep the default: **"2025-09-30.clover"**

### **Step 3: Search for Required Events**

In the search box "Find event by name or description...", search for these events one by one:

**1. Checkout events:**
- Search: `checkout`
- Select: `checkout.session.completed`
- Select: `checkout.session.async_payment_succeeded`
- Select: `checkout.session.async_payment_failed`

**2. Subscription events:**
- Search: `customer.subscription`
- Select: `customer.subscription.created`
- Select: `customer.subscription.updated`
- Select: `customer.subscription.deleted`
- Select: `customer.subscription.trial_will_end`

**3. Invoice events:**
- Search: `invoice`
- Select: `invoice.payment_succeeded`
- Select: `invoice.payment_failed`
- Select: `invoice.paid`

**4. Payment events:**
- Search: `payment_intent`
- Select: `payment_intent.succeeded`
- Select: `payment_intent.payment_failed`

### **Step 4: After Selecting Events**

1. Click **"Continue →"** button (bottom right)
2. **Choose destination type**: Select **"Webhook endpoint"**
3. Enter your webhook URL:
   ```
   https://testnotifier.co.uk/api/webhooks/stripe
   ```
4. Click **"Continue"** to create the webhook
5. You'll get the **Signing secret** (starts with `whsec_`)

## ✅ **Required Events Checklist**

Check these events in your "Selected events" tab:

- [ ] checkout.session.completed
- [ ] customer.subscription.created
- [ ] customer.subscription.updated
- [ ] customer.subscription.deleted
- [ ] invoice.payment_succeeded
- [ ] invoice.payment_failed
- [ ] payment_intent.succeeded
- [ ] payment_intent.payment_failed

## 🎯 **Quick Instructions**

1. **Click "Your account"** (left card)
2. **Search for each event** in the search box
3. **Click the checkbox** next to each event to select it
4. **Watch the "Selected events" tab** - it will show your count increasing
5. **Click "Continue →"** when done
6. **Choose "Webhook endpoint"**
7. **Enter URL**: `https://testnotifier.co.uk/api/webhooks/stripe`
8. **Complete setup** and copy the signing secret!

Let me know when you've selected all the events! 🚀
