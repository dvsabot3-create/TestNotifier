# 🧪 Stripe Payment Testing Guide

## ✅ **Environment Variables Added to Vercel**

All Stripe environment variables are now configured in production:
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Frontend key
- ✅ `STRIPE_SECRET_KEY` - Backend key  
- ✅ `STRIPE_WEBHOOK_SECRET` - Webhook verification

## 🚀 **Website Deployed**

Your updated website with Stripe integration is now live at:
**https://testnotifier.co.uk**

## 💳 **Testing Payments**

### **Test Cards (Sandbox Mode)**

| Card Number | Description | Expected Result |
|-------------|-------------|-----------------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0000 0000 0002` | Visa | ❌ Declined |
| `4000 0000 0000 9995` | Visa | ❌ Insufficient Funds |
| `4000 0000 0000 0069` | Visa | ❌ Expired Card |
| `4000 0000 0000 0119` | Visa | ❌ Processing Error |

### **Test Details**
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any valid UK postcode (e.g., SW1A 1AA)

## 🧪 **How to Test**

1. **Go to**: https://testnotifier.co.uk
2. **Scroll to**: Pricing section
3. **Click any**: "Start Now" or "Pay £25 Once" button
4. **Currently shows**: "Coming Soon" modal
5. **To enable payments**: Uncomment Stripe Checkout code in `handlePlanSelect`

## 🔧 **Enable Real Payments**

To activate actual Stripe Checkout:

1. **Edit**: `website/components/figma/PricingSection.tsx`
2. **Find**: `handlePlanSelect` function
3. **Uncomment**: The Stripe Checkout code (lines 17-25)
4. **Deploy**: `vercel --prod`

## 🎯 **Test Scenarios**

### **Scenario 1: Successful Payment**
- Use card: `4242 4242 4242 4242`
- Should redirect to success page
- Check Stripe dashboard for payment

### **Scenario 2: Declined Payment**
- Use card: `4000 0000 0000 0002`
- Should show error message
- User stays on pricing page

### **Scenario 3: Insufficient Funds**
- Use card: `4000 0000 0000 9995`
- Should show error message
- User can retry with different card

## 📊 **Monitor in Stripe Dashboard**

1. **Go to**: https://dashboard.stripe.com/test/payments
2. **Check**: All test payments appear here
3. **Verify**: Customer details and amounts
4. **Test**: Webhook notifications

## 🔄 **Switch to Live Mode**

When ready for real payments:

1. **Get Live Keys**: https://dashboard.stripe.com/apikeys
2. **Update Environment**: Replace test keys with live keys
3. **Test Thoroughly**: With small amounts first
4. **Monitor**: Payment success rates

## 🚨 **Important Notes**

- **Sandbox Mode**: All payments are fake (safe to test)
- **Live Mode**: Real money transactions
- **Webhooks**: Automatically configured for payment notifications
- **Security**: All sensitive data handled by Stripe

## 🎉 **Ready to Test!**

Your Stripe integration is complete and ready for testing. The website is live with all environment variables configured. When you're ready to enable actual payments, just uncomment the Stripe Checkout code!

