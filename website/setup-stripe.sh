#!/bin/bash

# 🚀 TestNotifier Stripe Automated Setup
# This script sets up all your Stripe products automatically

echo "🚀 TestNotifier Stripe Setup"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the website directory"
    echo "💡 Run: cd website && ./setup-stripe.sh"
    exit 1
fi

# Check if Stripe is installed
if ! npm list stripe > /dev/null 2>&1; then
    echo "📦 Installing Stripe SDK..."
    npm install stripe
    echo "✅ Stripe SDK installed"
    echo ""
fi

# Check for Stripe secret key
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "🔑 STRIPE_SECRET_KEY not found!"
    echo ""
    echo "📋 To get your Stripe secret key:"
    echo "   1. Go to: https://dashboard.stripe.com/apikeys"
    echo "   2. Copy your 'Secret key' (starts with sk_test_...)"
    echo "   3. Run: export STRIPE_SECRET_KEY='sk_test_...'"
    echo "   4. Then run this script again"
    echo ""
    echo "💡 Or run: STRIPE_SECRET_KEY='sk_test_...' ./setup-stripe.sh"
    exit 1
fi

echo "✅ Stripe secret key found"
echo ""

# Run the setup script
echo "🚀 Setting up Stripe products..."
echo ""

node scripts/setup-stripe-products.js

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy the product IDs from above"
echo "   2. Update your frontend with these IDs"
echo "   3. Test with Stripe test cards"
echo "   4. Switch to live mode when ready"
echo ""
echo "💳 Test cards:"
echo "   Success: 4242 4242 4242 4242"
echo "   Decline: 4000 0000 0000 0002"

