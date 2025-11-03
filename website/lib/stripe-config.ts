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
      productId: 'prod_TLwdmLRFxOI3ce',
      priceId: 'price_1SPEkE0xPOxdopWPVF6IYYUr',
      name: 'One-Off Rebook',
      price: 30.00,
      originalPrice: 35.00,
      discount: '14% OFF',
      savings: 5.00,
      currency: 'GBP',
      type: 'one-time'
    },
    starter: {
      productId: 'prod_TLwdyk2XHaOszO',
      priceId: 'price_1SPEkG0xPOxdopWPVVWGWu4M',
      name: 'Starter Plan',
      price: 25.00,
      originalPrice: 29.00,
      discount: '14% OFF',
      savings: 4.00,
      currency: 'GBP',
      type: 'subscription',
      interval: 'month'
    },
    premium: {
      productId: 'prod_TLwd5JryUvDXDw',
      priceId: 'price_1SPEkH0xPOxdopWPUiOBFDPd',
      name: 'Premium Plan',
      price: 45.00,
      originalPrice: 49.00,
      discount: '8% OFF',
      savings: 4.00,
      currency: 'GBP',
      type: 'subscription',
      interval: 'month'
    },
    professional: {
      productId: 'prod_TLwdxBnmgFialF',
      priceId: 'price_1SPEkI0xPOxdopWP5bwrFwY5',
      name: 'ADI Professional',
      price: 80.00,
      originalPrice: 89.00,
      discount: '10% OFF',
      savings: 9.00,
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

