# 📧 Stripe Email Consolidation Checklist

## Overview
This checklist outlines the steps to consolidate all Stripe customer communications to use `hello@testnotifier.co.uk` as the main email address.

## ✅ Code Updates Completed

### **1. Webhook Handlers** - ✅ DONE
- ✅ Added `updateCustomerEmail()` function to set customer email to `hello@testnotifier.co.uk`
- ✅ Updated all webhook handlers to automatically update customer email
- ✅ Added metadata tracking for email consolidation

### **2. Checkout Session Creation** - ✅ DONE
- ✅ Added `customer_email: 'hello@testnotifier.co.uk'` to all checkout sessions
- ✅ Added business email metadata
- ✅ Set support email in session metadata

### **3. Webhook Event Handlers** - ✅ DONE
- ✅ `checkout.session.completed` - Updates customer email
- ✅ `customer.subscription.created` - Updates customer email
- ✅ `customer.subscription.updated` - Updates customer email
- ✅ `customer.subscription.deleted` - Updates customer email
- ✅ `invoice.payment_succeeded` - Updates customer email
- ✅ `invoice.payment_failed` - Updates customer email
- ✅ `payment_intent.succeeded` - Updates customer email
- ✅ `payment_intent.payment_failed` - Updates customer email

## 🔧 Manual Stripe Dashboard Updates Required

### **1. Business Profile Settings** (High Priority)
- [ ] Log into [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Go to **Settings** → **Account details**
- [ ] Update **Support email** to: `hello@testnotifier.co.uk`
- [ ] Update **Business website** to: `https://testnotifier.co.uk`
- [ ] Save changes

### **2. Customer Communication Settings** (High Priority)
- [ ] Go to **Settings** → **Customer emails**
- [ ] Update **Invoice emails** sender to: `hello@testnotifier.co.uk`
- [ ] Update **Receipt emails** sender to: `hello@testnotifier.co.uk`
- [ ] Update **Failed payment emails** sender to: `hello@testnotifier.co.uk`
- [ ] Update **Subscription emails** sender to: `hello@testnotifier.co.uk`
- [ ] Save all changes

### **3. Branding Settings** (High Priority)
- [ ] Go to **Settings** → **Branding**
- [ ] Update **Support email** to: `hello@testnotifier.co.uk`
- [ ] Update **Business name** to: `TestNotifier`
- [ ] Upload your logo if not already done
- [ ] Save changes

### **4. Invoice Settings** (Medium Priority)
- [ ] Go to **Settings** → **Invoices**
- [ ] Update **Invoice footer** to include support contact: `Support: hello@testnotifier.co.uk`
- [ ] Configure invoice email templates if needed
- [ ] Save changes

### **5. Email Templates** (Medium Priority)
- [ ] Review all email templates in **Settings** → **Customer emails**
- [ ] Ensure all templates reference `hello@testnotifier.co.uk` for support
- [ ] Test email templates if possible
- [ ] Save changes

### **6. Webhook Configuration Verification** (Medium Priority)
- [ ] Go to **Developers** → **Webhooks**
- [ ] Verify webhook endpoint: `https://testnotifier.co.uk/api/webhooks/stripe`
- [ ] Test webhook endpoint to ensure it's receiving events
- [ ] Verify all required events are selected:
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.created`
  - ✅ `customer.subscription.updated`
  - ✅ `customer.subscription.deleted`
  - ✅ `invoice.payment_succeeded`
  - ✅ `invoice.payment_failed`
  - ✅ `payment_intent.succeeded`
  - ✅ `payment_intent.payment_failed`

## 📊 Testing & Verification

### **1. Test Stripe Integration** (High Priority)
- [ ] Create a test checkout session
- [ ] Verify customer email is set to `hello@testnotifier.co.uk`
- [ ] Check Stripe dashboard for customer record
- [ ] Verify webhook receives and processes the event

### **2. Test Email Delivery** (High Priority)
- [ ] Process a test payment
- [ ] Verify invoice/receipt is sent from `hello@testnotifier.co.uk`
- [ ] Check hello@testnotifier.co.uk receives the email
- [ ] Verify email formatting and content

### **3. Test Failed Payment** (Medium Priority)
- [ ] Simulate a failed payment (use test card 4000000000000002)
- [ ] Verify failure notification comes from `hello@testnotifier.co.uk`
- [ ] Check retry logic still works

### **4. Test Subscription Lifecycle** (Medium Priority)
- [ ] Create a test subscription
- [ ] Update the subscription (upgrade/downgrade)
- [ ] Cancel the subscription
- [ ] Verify all notifications use `hello@testnotifier.co.uk`

## 🎯 Expected Results

After completing all updates:

✅ **All Stripe customer communications** will use `hello@testnotifier.co.uk`
✅ **All invoices and receipts** will come from `hello@testnotifier.co.uk`
✅ **All support emails** will be sent to `hello@testnotifier.co.uk`
✅ **Customer records** will have `hello@testnotifier.co.uk` as their email
✅ **Webhook processing** will automatically update customer emails
✅ **Unified email presence** across all Stripe communications

## 🚨 Important Notes

1. **Live Environment**: These changes affect your live Stripe account
2. **Customer Impact**: Existing customers will have their email updated to `hello@testnotifier.co.uk`
3. **Email Volume**: hello@testnotifier.co.uk will receive all Stripe-related emails
4. **Backup**: Consider backing up current settings before making changes
5. **Testing**: Test thoroughly in Stripe's test mode first if possible

## 📞 Support

For any issues with Stripe configuration:
- **Stripe Support**: https://support.stripe.com/
- **TestNotifier**: hello@testnotifier.co.uk (your main email)
- **Webhook Issues**: Check Stripe dashboard webhook logs

---

**Status**: Code updates completed ✅ | Manual dashboard updates required 🔧

**Next**: Complete manual Stripe dashboard updates, then proceed to Phase 3 (system configuration updates)**