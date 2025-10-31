// Stripe Products Setup Script for TestNotifier
// This script creates all products with exact pricing from your website

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());

async function setupStripeProducts() {
  console.log('🚀 Setting up TestNotifier Stripe Products...');

  try {
    // Product 1: One-Off Rebook
    console.log('📦 Creating One-Off Rebook product...');
    const oneOffProduct = await stripe.products.create({
      name: 'One-Off Rebook',
      description: 'Single guaranteed rebook - Monitor 1 test center with email notifications',
      metadata: {
        plan_type: 'one-time',
        features: 'One successful rebook guaranteed, Monitor 1 test center, Email notification, Valid for 30 days',
        original_price: '35.21',
        discount: '29% OFF',
        savings: '10.21'
      }
    });

    const oneOffPrice = await stripe.prices.create({
      product: oneOffProduct.id,
      unit_amount: 2500, // £25.00 in pence
      currency: 'gbp',
      metadata: {
        plan_name: 'One-Off Rebook',
        plan_type: 'one-time'
      }
    });

    console.log(`✅ One-Off Rebook created:`);
    console.log(`   Product ID: ${oneOffProduct.id}`);
    console.log(`   Price ID: ${oneOffPrice.id}`);
    console.log(`   Price: £25.00 (one-time)`);

    // Product 2: Starter Plan
    console.log('\n📦 Creating Starter Plan product...');
    const starterProduct = await stripe.products.create({
      name: 'Starter Plan',
      description: 'For occasional needs - Monitor up to 3 test centers with 2 rebooks/month',
      metadata: {
        plan_type: 'subscription',
        features: 'Monitor up to 3 test centers, 2 rebooks/month, Extra rebooks at £15, SMS + Email notifications, Chrome extension, Email support',
        original_price: '28.79',
        discount: '34% OFF',
        savings: '9.79',
        rebooks_included: '2',
        extra_rebook_price: '15'
      }
    });

    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      unit_amount: 1900, // £19.00 in pence
      currency: 'gbp',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan_name: 'Starter',
        plan_type: 'subscription',
        rebooks_included: '2',
        extra_rebook_price: '1500' // £15 in pence
      }
    });

    console.log(`✅ Starter Plan created:`);
    console.log(`   Product ID: ${starterProduct.id}`);
    console.log(`   Price ID: ${starterPrice.id}`);
    console.log(`   Price: £19.00/month`);

    // Product 3: Premium Plan
    console.log('\n📦 Creating Premium Plan product...');
    const premiumProduct = await stripe.products.create({
      name: 'Premium Plan',
      description: 'Best for active learners - Monitor up to 8 test centers with 5 rebooks/month',
      metadata: {
        plan_type: 'subscription',
        features: 'Monitor up to 8 test centers, 5 rebooks/month, Extra rebooks at £12, Priority SMS + Email, Rapid mode (500ms), Advanced filtering, 24/7 email support',
        original_price: '49.15',
        discount: '41% OFF',
        savings: '20.15',
        rebooks_included: '5',
        extra_rebook_price: '12',
        most_popular: 'true'
      }
    });

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 2900, // £29.00 in pence
      currency: 'gbp',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan_name: 'Premium',
        plan_type: 'subscription',
        rebooks_included: '5',
        extra_rebook_price: '1200', // £12 in pence
        most_popular: 'true'
      }
    });

    console.log(`✅ Premium Plan created:`);
    console.log(`   Product ID: ${premiumProduct.id}`);
    console.log(`   Price ID: ${premiumPrice.id}`);
    console.log(`   Price: £29.00/month`);

    // Product 4: Professional Plan
    console.log('\n📦 Creating Professional Plan product...');
    const professionalProduct = await stripe.products.create({
      name: 'Professional Plan',
      description: 'For driving schools - UNLIMITED pupils & test centers with UNLIMITED rebooks',
      metadata: {
        plan_type: 'subscription',
        features: 'UNLIMITED pupils & test centers, UNLIMITED rebooks, Multi-pupil dashboard, Per-pupil settings, SMS + Email + WhatsApp, Success rate analytics, Priority phone support, Stealth mode',
        original_price: '161.82',
        discount: '45% OFF',
        savings: '72.82',
        unlimited_pupils: 'true',
        unlimited_rebooks: 'true',
        for_instructors: 'true'
      }
    });

    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 8900, // £89.00 in pence
      currency: 'gbp',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan_name: 'Professional',
        plan_type: 'subscription',
        unlimited_pupils: 'true',
        unlimited_rebooks: 'true',
        for_instructors: 'true'
      }
    });

    console.log(`✅ Professional Plan created:`);
    console.log(`   Product ID: ${professionalProduct.id}`);
    console.log(`   Price ID: ${professionalPrice.id}`);
    console.log(`   Price: £89.00/month`);

    // Summary
    console.log('\n🎉 STRIPE SETUP COMPLETE!');
    console.log('\n📋 UPDATE YOUR CONFIGURATION WITH THESE VALUES:');
    console.log('');
    console.log('// Update /Users/mosman/Documents/DVLA BOT/website/lib/stripe-config.ts');
    console.log('export const STRIPE_CONFIG = {');
    console.log('  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),');
    console.log('  products: {');
    console.log(`    oneOff: { priceId: '${oneOffPrice.id}', productId: '${oneOffProduct.id}', name: 'One-Off Rebook', price: 25.00, type: 'one-time' },`);
    console.log(`    starter: { priceId: '${starterPrice.id}', productId: '${starterProduct.id}', name: 'Starter Plan', price: 19.00, type: 'subscription' },`);
    console.log(`    premium: { priceId: '${premiumPrice.id}', productId: '${premiumProduct.id}', name: 'Premium Plan', price: 29.00, type: 'subscription' },`);
    console.log(`    professional: { priceId: '${professionalPrice.id}', productId: '${professionalProduct.id}', name: 'Professional Plan', price: 89.00, type: 'subscription' }`);
    console.log('  }');
    console.log('};');

    return {
      oneOff: { productId: oneOffProduct.id, priceId: oneOffPrice.id },
      starter: { productId: starterProduct.id, priceId: starterPrice.id },
      premium: { productId: premiumProduct.id, priceId: premiumPrice.id },
      professional: { productId: professionalProduct.id, priceId: professionalPrice.id }
    };

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    throw error;
  }
}

// Run the setup
setupStripeProducts().then((result) => {
  console.log('\n✨ Setup completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});
