// Script to check actual Stripe price IDs
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());

async function checkStripePrices() {
  try {
    console.log('🔍 Checking Stripe prices...');

    // List all prices
    const prices = await stripe.prices.list({
      limit: 100,
      active: true
    });

    console.log('📋 Found prices:');
    prices.data.forEach((price, index) => {
      console.log(`${index + 1}.`);
      console.log(`   Price ID: ${price.id}`);
      console.log(`   Product ID: ${price.product}`);
      console.log(`   Amount: ${price.unit_amount / 100} ${price.currency.toUpperCase()}`);
      console.log(`   Type: ${price.type}`);
      console.log(`   Recurring: ${price.recurring ? price.recurring.interval : 'One-time'}`);
      console.log('');
    });

    if (prices.data.length === 0) {
      console.log('❌ No prices found in your Stripe account.');
      console.log('📝 You need to create products and prices in your Stripe Dashboard first.');
      console.log('🔗 Go to: https://dashboard.stripe.com/products');
    }

  } catch (error) {
    console.error('❌ Error checking Stripe prices:', error.message);
    if (error.message.includes('Invalid API Key')) {
      console.log('🔑 Please check your STRIPE_SECRET_KEY environment variable');
    }
  }
}

checkStripePrices();