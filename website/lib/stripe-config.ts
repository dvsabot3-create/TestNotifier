// Stripe Configuration for TestNotifier
// This file contains all the product IDs and pricing information

export const STRIPE_CONFIG = {
  // Environment - trim whitespace to handle newline issues
  publishableKey: (() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
    if (!key) {
      console.error('❌ STRIPE_PUBLISHABLE_KEY not set in environment variables');
      throw new Error('Stripe publishable key is required');
    }
    return key;
  })(),
  
  // Product IDs (Live Stripe - created by automated setup)
  products: {
    oneOff: {
      productId: 'prod_TJ4qcziQSrpl7S',
      priceId: 'price_1SMSgh0xPOxdopWPJGe2jU3M',
      name: 'One-Off Rebook',
      price: 25.00,
      originalPrice: 35.21,
      discount: '29% OFF',
      savings: 10.21,
      currency: 'GBP',
      type: 'one-time'
    },
    starter: {
      productId: 'prod_TJ4q6D7u5ApACP',
      priceId: 'price_1SMSgi0xPOxdopWPUKIVTL2s',
      name: 'Starter Plan',
      price: 19.00,
      originalPrice: 28.79,
      discount: '34% OFF',
      savings: 9.79,
      currency: 'GBP',
      type: 'subscription',
      interval: 'month'
    },
    premium: {
      productId: 'prod_TJ4qJczQ4kGUDD',
      priceId: 'price_1SMSgj0xPOxdopWPWujQSxG8',
      name: 'Premium Plan',
      price: 29.00,
      originalPrice: 49.15,
      discount: '41% OFF',
      savings: 20.15,
      currency: 'GBP',
      type: 'subscription',
      interval: 'month'
    },
    professional: {
      productId: 'prod_TJ4qbd9Lc5OSeX',
      priceId: 'price_1SMSgl0xPOxdopWPQqujVkKi',
      name: 'Professional Plan',
      price: 89.00,
      originalPrice: 161.82,
      discount: '45% OFF',
      savings: 72.82,
      currency: 'GBP',
      type: 'subscription',
      interval: 'month'
    }
  },

  // Webhook Configuration
  webhook: {
    secret: (() => {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!secret) {
        console.error('❌ STRIPE_WEBHOOK_SECRET not set in environment variables');
        throw new Error('Stripe webhook secret is required');
      }
      return secret;
    })(),
    url: 'https://testnotifier.co.uk/api/webhooks/stripe'
  },

  // Test Cards (for development)
  testCards: {
    success: '4242 4242 4242 4242',
    decline: '4000 0000 0000 0002',
    insufficientFunds: '4000 0000 0000 9995'
  }
};

// Helper function to get product by name
export const getProductByName = (name: string) => {
  const products = Object.values(STRIPE_CONFIG.products);
  return products.find(product => product.name.toLowerCase().includes(name.toLowerCase()));
};

// Helper function to get all subscription products
export const getSubscriptionProducts = () => {
  return Object.values(STRIPE_CONFIG.products).filter(product => product.type === 'subscription');
};

// Helper function to get one-time products
export const getOneTimeProducts = () => {
  return Object.values(STRIPE_CONFIG.products).filter(product => product.type === 'one-time');
};

