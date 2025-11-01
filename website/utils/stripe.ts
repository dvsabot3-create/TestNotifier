/**
 * Stripe Client-Side Integration
 * Secure payment processing utilities for TestNotifier
 */

import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

// Stripe publishable key (safe to expose on client-side)
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Singleton Stripe instance
let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance (lazy loaded)
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Card element styling to match TestNotifier design system
 */
export const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#adb5bd',
      },
      padding: '12px',
    },
    invalid: {
      color: '#dc3545',
      iconColor: '#dc3545',
    },
  },
  hidePostalCode: false,
};

/**
 * Create payment method from card element
 */
export const createPaymentMethod = async (
  stripe: Stripe,
  cardElement: StripeCardElement,
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  }
) => {
  try {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { paymentMethod, error: null };
  } catch (error) {
    console.error('Error creating payment method:', error);
    return {
      paymentMethod: null,
      error: error instanceof Error ? error.message : 'Failed to create payment method',
    };
  }
};

/**
 * Confirm card payment with Payment Intent
 */
export const confirmCardPayment = async (
  stripe: Stripe,
  clientSecret: string,
  paymentMethodId?: string
) => {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { paymentIntent: result.paymentIntent, error: null };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return {
      paymentIntent: null,
      error: error instanceof Error ? error.message : 'Payment confirmation failed',
    };
  }
};

/**
 * Create subscription with trial period
 */
export interface CreateSubscriptionParams {
  priceId: string;
  paymentMethodId: string;
  trialPeriodDays?: number;
  couponCode?: string;
}

export const createSubscription = async (params: CreateSubscriptionParams) => {
  try {
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        planType: params.priceId.includes('premium') ? 'premium' : 'pro',
        paymentMethodId: params.paymentMethodId,
        trialPeriodDays: params.trialPeriodDays,
        couponCode: params.couponCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subscription');
    }

    const data = await response.json();
    return { subscription: data.subscription, error: null };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      subscription: null,
      error: error instanceof Error ? error.message : 'Subscription creation failed',
    };
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
  try {
    const response = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ cancelAtPeriodEnd }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    const data = await response.json();
    return { message: data.message, error: null };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      message: null,
      error: error instanceof Error ? error.message : 'Cancellation failed',
    };
  }
};

/**
 * Reactivate cancelled subscription
 */
export const reactivateSubscription = async () => {
  try {
    const response = await fetch('/api/subscriptions/reactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reactivate subscription');
    }

    const data = await response.json();
    return { message: data.message, error: null };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return {
      message: null,
      error: error instanceof Error ? error.message : 'Reactivation failed',
    };
  }
};

/**
 * Upgrade subscription to new plan
 */
export const upgradeSubscription = async (newPlanType: 'premium' | 'pro') => {
  try {
    const response = await fetch('/api/subscriptions/upgrade', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ planType: newPlanType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upgrade subscription');
    }

    const data = await response.json();
    return { subscription: data.subscription, error: null };
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return {
      subscription: null,
      error: error instanceof Error ? error.message : 'Upgrade failed',
    };
  }
};

/**
 * Get current subscription status
 */
export const getCurrentSubscription = async () => {
  try {
    const response = await fetch('/api/subscriptions/current', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { subscription: null, error: null }; // No subscription found
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to get subscription');
    }

    const data = await response.json();
    return { subscription: data.subscription, error: null };
  } catch (error) {
    console.error('Error getting subscription:', error);
    return {
      subscription: null,
      error: error instanceof Error ? error.message : 'Failed to fetch subscription',
    };
  }
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (limit: number = 10, offset: number = 0) => {
  try {
    const response = await fetch(
      `/api/payments/history?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment history');
    }

    const data = await response.json();
    return { payments: data.payments, pagination: data.pagination, error: null };
  } catch (error) {
    console.error('Error getting payment history:', error);
    return {
      payments: null,
      pagination: null,
      error: error instanceof Error ? error.message : 'Failed to fetch payment history',
    };
  }
};

/**
 * Get upcoming invoice
 */
export const getUpcomingInvoice = async () => {
  try {
    const response = await fetch('/api/payments/upcoming-invoice', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { invoice: null, error: null }; // No upcoming invoice
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to get upcoming invoice');
    }

    const data = await response.json();
    return { invoice: data.upcomingInvoice, error: null };
  } catch (error) {
    console.error('Error getting upcoming invoice:', error);
    return {
      invoice: null,
      error: error instanceof Error ? error.message : 'Failed to fetch upcoming invoice',
    };
  }
};

/**
 * Open Stripe Customer Portal
 */
export const openCustomerPortal = async () => {
  try {
    const response = await fetch('/api/payments/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create portal session');
    }

    const data = await response.json();
    
    // Redirect to Stripe Customer Portal
    window.location.href = data.url;
    
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Error opening customer portal:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Failed to open customer portal',
    };
  }
};

/**
 * Validate card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Format card number for display
 */
export const formatCardNumber = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
};

/**
 * Get card brand from number
 */
export const getCardBrand = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  if (/^35/.test(digits)) return 'jcb';

  return 'unknown';
};

/**
 * Error messages for better UX
 */
export const getStripeErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    card_declined: 'Your card was declined. Please try a different payment method.',
    expired_card: 'Your card has expired. Please use a different card.',
    incorrect_cvc: 'The security code is incorrect. Please check and try again.',
    processing_error: 'An error occurred while processing your card. Please try again.',
    incorrect_number: 'The card number is incorrect. Please check and try again.',
    invalid_expiry_month: 'The expiration month is invalid.',
    invalid_expiry_year: 'The expiration year is invalid.',
    invalid_cvc: 'The security code is invalid.',
    insufficient_funds: 'Insufficient funds. Please use a different card.',
    authentication_required: 'Authentication is required. Please complete the verification.',
    payment_intent_authentication_failure: 'Payment authentication failed. Please try again.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

export default {
  getStripe,
  createPaymentMethod,
  confirmCardPayment,
  createSubscription,
  cancelSubscription,
  reactivateSubscription,
  upgradeSubscription,
  getCurrentSubscription,
  getPaymentHistory,
  getUpcomingInvoice,
  openCustomerPortal,
  validateCardNumber,
  formatCardNumber,
  getCardBrand,
  getStripeErrorMessage,
  cardElementOptions,
};

