/**
 * Secure Payment Form Component
 * Uses Stripe Elements for PCI-compliant card collection
 */

import React, { useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Lock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { getStripe, cardElementOptions, createSubscription, getStripeErrorMessage } from '../../utils/stripe';

interface PaymentFormProps {
  planType: 'premium' | 'pro';
  planName: string;
  planPrice: number;
  trialDays?: number;
  onSuccess: (subscriptionId: string) => void;
  onCancel: () => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({
  planType,
  planName,
  planPrice,
  trialDays,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'GB',
    },
  });

  useEffect(() => {
    // Load user info if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setBillingDetails((prev) => ({
        ...prev,
        email: user.email,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      }));
    }
  }, []);

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (!cardComplete) {
      setError('Please complete all card details');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone || undefined,
          address: {
            line1: billingDetails.address.line1 || undefined,
            city: billingDetails.address.city || undefined,
            postal_code: billingDetails.address.postal_code || undefined,
            country: billingDetails.address.country,
          },
        },
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Create subscription on backend
      const priceId = planType === 'premium' ? 'price_premium_monthly' : 'price_pro_monthly';
      const result = await createSubscription({
        priceId,
        paymentMethodId: paymentMethod.id,
        trialPeriodDays: trialDays,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.subscription) {
        setSuccess(true);
        
        // Track successful subscription
        if (window.gtag) {
          window.gtag('event', 'purchase', {
            transaction_id: result.subscription.id,
            value: planPrice,
            currency: 'GBP',
            items: [{
              item_id: planType,
              item_name: planName,
              price: planPrice,
              quantity: 1,
            }],
          });
        }

        // Notify parent component
        setTimeout(() => {
          onSuccess(result.subscription.id);
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(getStripeErrorMessage(errorMessage) || errorMessage);
      
      // Track failed payment
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: 'payment_failed',
          fatal: false,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setBillingDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">
          {trialDays
            ? `Your ${trialDays}-day free trial has started. You won't be charged until ${new Date(
                Date.now() + trialDays * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}.`
            : 'Your subscription is now active.'}
        </p>
        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{planName} Plan</h3>
            <p className="text-sm text-gray-600">
              {trialDays ? `${trialDays}-day free trial, then ` : ''}
              £{planPrice}/month
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1d70b8]">
              £{trialDays ? '0.00' : planPrice}
            </div>
            <div className="text-xs text-gray-600">
              {trialDays ? 'Today' : 'Per month'}
            </div>
          </div>
        </div>
        {trialDays && (
          <Alert>
            <AlertDescription className="text-sm">
              You'll be charged £{planPrice} on{' '}
              {new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toLocaleDateString()}.
              Cancel anytime before then to avoid charges.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Billing Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Billing Information
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={billingDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1d70b8] focus:ring-2 focus:ring-[#1d70b8]/20 outline-none transition-all"
              placeholder="John Smith"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={billingDetails.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1d70b8] focus:ring-2 focus:ring-[#1d70b8]/20 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={billingDetails.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#1d70b8] focus:ring-2 focus:ring-[#1d70b8]/20 outline-none transition-all"
              placeholder="+44 7700 900000"
            />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Card Details
        </h4>

        <div className="border-2 border-gray-300 rounded-xl p-4 focus-within:border-[#1d70b8] focus-within:ring-2 focus-within:ring-[#1d70b8]/20 transition-all">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Your payment information is encrypted and secure. We use Stripe to process payments
            and never store your card details on our servers.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing || !cardComplete}
          className="flex-1 bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white hover:opacity-90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              {trialDays ? `Start ${trialDays}-Day Trial` : `Subscribe for £${planPrice}/mo`}
            </>
          )}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By subscribing, you agree to our{' '}
        <a href="/terms" className="text-[#1d70b8] hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-[#1d70b8] hover:underline">
          Privacy Policy
        </a>
        . You can cancel anytime.
      </p>
    </form>
  );
};

/**
 * Payment Form Wrapper with Stripe Elements Provider
 */
export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const [stripePromise] = useState(() => getStripe());

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm;

