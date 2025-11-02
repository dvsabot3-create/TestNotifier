# 🚀 Automated Stripe Setup for TestNotifier

This script automatically creates all your Stripe products, pricing plans, and webhooks - **no manual work required!**

## ⚡ Quick Setup (2 minutes)

### 1. Get Your Stripe Keys
```bash
# Go to: https://dashboard.stripe.com/apikeys
# Copy your "Secret key" (starts with sk_test_...)
```

### 2. Install Stripe SDK
```bash
cd website
npm install stripe
```

### 3. Set Environment Variable
```bash
# Replace sk_test_... with your actual secret key
export STRIPE_SECRET_KEY="sk_test_51ABC123..."
```

### 4. Run the Setup Script
```bash
node scripts/setup-stripe-products.js
```

## 🎯 What This Script Creates

### Products Created:
1. **One-Off Rebook** - £25 (was £35) - 29% OFF
2. **Starter Plan** - £19/month (was £29) - 34% OFF  
3. **Premium Plan** - £29/month (was £49) - 41% OFF
4. **Professional Plan** - £49/month (was £89) - 45% OFF

### Features:
- ✅ All products with correct pricing
- ✅ Discount metadata included
- ✅ Webhook endpoint configured
- ✅ Test card information provided
- ✅ Environment variables listed

## 📋 After Running the Script

The script will output:
- Product IDs (copy these to your frontend)
- Webhook secret (add to your environment)
- Test card numbers for testing
- Next steps for implementation

## 🔧 Manual Alternative

If you prefer manual setup:
1. Go to Stripe Dashboard → Products
2. Click "Add a product" for each plan
3. Set up pricing and metadata
4. Create webhook endpoint manually

## 🚨 Important Notes

- **Sandbox Mode**: This creates test products (safe to experiment)
- **Live Mode**: Switch to live keys when ready for real payments
- **Webhook URL**: Update the webhook URL to your actual domain
- **Testing**: Always test with Stripe test cards first

## 💡 Pro Tip

The automated script is **10x faster** than manual setup and ensures consistency across all products!

