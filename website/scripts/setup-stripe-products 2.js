#!/usr/bin/env node

/**
 * Automated Stripe Product Setup Script
 * This script creates all TestNotifier products, prices, and webhooks automatically
 * 
 * Usage: node setup-stripe-products.js
 * 
 * Requirements:
 * 1. Set STRIPE_SECRET_KEY in your environment
 * 2. Run: npm install stripe
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// TestNotifier Product Configuration
const products = [
  {
    name: "One-Off Rebook",
    description: "Single rebook attempt - perfect for urgent test date needs",
    metadata: {
      type: "one-time",
      category: "rebook",
      features: "monitor-1-center,1-rebook-attempt,5-daily-notifications,email-notifications,30-day-validity"
    },
    prices: [
      {
        unit_amount: 2500, // £25.00 in pence
        currency: "gbp",
        nickname: "One-Off Rebook - Limited Time",
        metadata: {
          original_price: "3500", // £35.00 original price
          discount: "29%",
          savings: "1000" // £10.00 savings
        }
      }
    ]
  },
  {
    name: "Starter Plan",
    description: "For occasional needs - monitor up to 3 test centers with 2 rebook attempts per day",
    metadata: {
      type: "subscription",
      category: "monthly",
      features: "monitor-3-centers,2-rebook-attempts-day,10-daily-notifications,sms-email-notifications,chrome-extension,3-day-preview"
    },
    prices: [
      {
        unit_amount: 1900, // £19.00 in pence
        currency: "gbp",
        recurring: {
          interval: "month"
        },
        nickname: "Starter Monthly - Limited Time",
        metadata: {
          original_price: "2900", // £29.00 original price
          discount: "34%",
          savings: "1000", // £10.00 savings
          extra_rebook_price: "1500" // £15.00 per extra rebook
        }
      }
    ]
  },
  {
    name: "Premium Plan",
    description: "Best for active learners - monitor up to 8 test centers with 5 rebook attempts per day",
    metadata: {
      type: "subscription",
      category: "monthly",
      features: "monitor-8-centers,5-rebook-attempts-day,25-daily-notifications,priority-notifications,rapid-mode,advanced-filtering,3-day-preview"
    },
    prices: [
      {
        unit_amount: 2900, // £29.00 in pence
        currency: "gbp",
        recurring: {
          interval: "month"
        },
        nickname: "Premium Monthly - Limited Time",
        metadata: {
          original_price: "4900", // £49.00 original price
          discount: "41%",
          savings: "2000", // £20.00 savings
          extra_rebook_price: "1200" // £12.00 per extra rebook
        }
      }
    ]
  },
  {
    name: "Professional Plan",
    description: "For driving schools - up to 20 pupils, 999 test centers, and 10 daily booking attempts",
    metadata: {
      type: "subscription",
      category: "monthly",
      features: "20-pupils-999-centers,10-daily-attempts,50-daily-notifications,multi-pupil-dashboard,whatsapp-alerts,analytics,phone-support,stealth-mode"
    },
    prices: [
      {
        unit_amount: 4900, // £49.00 in pence
        currency: "gbp",
        recurring: {
          interval: "month"
        },
        nickname: "Professional Monthly - Limited Time",
        metadata: {
          original_price: "8900", // £89.00 original price
          discount: "45%",
          savings: "4000", // £40.00 savings
          extra_rebook_price: "0" // No extra fees
        }
      }
    ]
  }
];

// Webhook Configuration
const webhookConfig = {
  url: "https://testnotifier.co.uk/api/webhooks/stripe",
  events: [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed"
  ]
};

async function setupStripeProducts() {
  console.log("🚀 Starting TestNotifier Stripe Setup...\n");

  try {
    // 1. Create Products and Prices
    console.log("📦 Creating products and pricing...");
    const createdProducts = [];

    for (const product of products) {
      console.log(`   Creating: ${product.name}`);
      
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: product.metadata,
        active: true
      });

      console.log(`   ✅ Product created: ${stripeProduct.id}`);

      // Create prices for this product
      for (const price of product.prices) {
        const priceData = {
          product: stripeProduct.id,
          unit_amount: price.unit_amount,
          currency: price.currency,
          nickname: price.nickname,
          metadata: price.metadata,
          active: true
        };

        if (price.recurring) {
          priceData.recurring = price.recurring;
        }

        const stripePrice = await stripe.prices.create(priceData);
        console.log(`   ✅ Price created: ${stripePrice.id} (${price.unit_amount / 100} ${price.currency.toUpperCase()})`);
      }

      createdProducts.push({
        product: stripeProduct,
        name: product.name
      });
    }

    // 2. Create Webhook Endpoint
    console.log("\n🔗 Setting up webhook endpoint...");
    try {
      const webhook = await stripe.webhookEndpoints.create({
        url: webhookConfig.url,
        enabled_events: webhookConfig.events,
        description: "TestNotifier Payment Webhooks"
      });
      console.log(`   ✅ Webhook created: ${webhook.id}`);
      console.log(`   📡 Webhook URL: ${webhook.url}`);
      console.log(`   🔑 Webhook Secret: ${webhook.secret}`);
    } catch (webhookError) {
      console.log(`   ⚠️  Webhook creation failed: ${webhookError.message}`);
      console.log(`   💡 You'll need to create this manually in Stripe Dashboard`);
    }

    // 3. Display Summary
    console.log("\n🎉 Stripe Setup Complete!");
    console.log("\n📋 Created Products:");
    createdProducts.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (ID: ${item.product.id})`);
    });

    console.log("\n🔧 Next Steps:");
    console.log("   1. Copy the product IDs above");
    console.log("   2. Update your frontend with these product IDs");
    console.log("   3. Test payments with Stripe test cards");
    console.log("   4. Switch to live mode when ready");

    console.log("\n💳 Test Cards (Sandbox Mode):");
    console.log("   Success: 4242 4242 4242 4242");
    console.log("   Decline: 4000 0000 0000 0002");
    console.log("   Insufficient Funds: 4000 0000 0000 9995");

    console.log("\n🔑 Environment Variables Needed:");
    console.log("   STRIPE_PUBLISHABLE_KEY=pk_test_...");
    console.log("   STRIPE_SECRET_KEY=sk_test_...");
    console.log("   STRIPE_WEBHOOK_SECRET=whsec_...");

  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY environment variable is required");
    console.log("💡 Set it with: export STRIPE_SECRET_KEY=sk_test_...");
    process.exit(1);
  }
  
  setupStripeProducts();
}

module.exports = { setupStripeProducts, products, webhookConfig };

