# 🔧 Stripe Payment Error - Configuration Required

## ❌ **Error: "There was an error processing your request"**

The subscription button fails because **Stripe API keys are not configured**. You need to set up your Stripe account and add the API keys to fix this error.

## 🚀 **Quick Setup Steps**

### **Step 1: Get Stripe API Keys**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to Developers → API keys**
3. **Copy these keys**:
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)

### **Step 2: Update Environment Variables**

Replace the placeholder values in your `.env.local` file:

```bash
# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### **Step 3: Create Stripe Products**

You need to create products in Stripe that match your pricing plans:

1. Go to **Products** in Stripe Dashboard
2. Click **"Add Product"**
3. Create these products:
   - **One-Off Rebook** - £25 (one-time payment)
   - **Basic Monthly** - £19/month (recurring)
   - **Premium Monthly** - £29/month (recurring)
   - **Professional Monthly** - £89/month (recurring)

### **Step 4: Copy Price IDs**

After creating products, copy the **Price ID** for each (e.g., `price_1234567890`) and update your pricing section component.

## 📝 **Current Issue**

The error occurs because:
1. ❌ **Stripe API keys are missing** (placeholder values)
2. ❌ **Stripe products haven't been created yet**
3. ❌ **Price IDs not configured** in the pricing section

## ✅ **What Needs to Happen**

1. **Add your real Stripe API keys** to `.env.local`
2. **Create Stripe products** for each pricing tier
3. **Update the PricingSection.tsx** with real Price IDs
4. **Restart your server**

## 🎯 **Quick Test**

Once configured, test with:
- **Test mode**: Use `sk_test_...` and `pk_test_...` keys
- **Test cards**: `4242 4242 4242 4242` (any future expiry date)
- **3D Secure**: Will be required in test mode

## 📚 **Stripe Documentation**

- **Getting Started**: https://stripe.com/docs/payments/checkout
- **API Keys**: https://dashboard.stripe.com/test/apikeys
- **Test Cards**: https://stripe.com/docs/testing

## ⚠️ **Important**

- **Never commit API keys** to version control
- **Use test keys** for development
- **Switch to live keys** only in production
- **Keep keys secret** - never expose them publicly

Once you add your Stripe API keys, the subscription buttons will work! 🚀
