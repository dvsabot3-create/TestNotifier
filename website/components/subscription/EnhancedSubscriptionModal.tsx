/**
 * Enhanced Subscription Modal - Hybrid Model
 * Abuse-proof pricing with trial limitations
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Check, X, Star, Shield, Clock, Loader2, AlertCircle, Crown, Zap, TrendingUp, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { PaymentForm } from './PaymentForm';
import { getCurrentSubscription } from '../../utils/stripe';

interface Plan {
  id: 'oneoff' | 'starter' | 'premium' | 'pro';
  name: string;
  displayName: string;
  price: number;
  priceAnnual?: number;
  interval: 'once' | 'month' | 'year';
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  trialDays?: number;
  trialLimitation?: string;
  icon: React.ReactNode;
  gradient: string;
  priceId: string;
  limits: {
    testCenters: number;
    rebooksPerMonth: number;
    extraRebookPrice?: number;
  };
}

const plans: Plan[] = [
  {
    id: 'oneoff',
    name: 'One-Off',
    displayName: 'One-Off Rebook',
    price: 30.00,
    interval: 'once',
    description: 'Single rebook attempt',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600',
    priceId: 'price_oneoff',
    features: [
      'One rebook attempt',
      'Monitor 1 test center',
      'Email notification when found',
      'Valid for 30 days',
      'No recurring charges',
      '5 daily notifications max',
      'No subscription needed',
    ],
    notIncluded: [
      'SMS notifications',
      'Multiple rebooks',
      'Ongoing monitoring after 30 days',
    ],
    limits: {
      testCenters: 1,
      rebooksPerMonth: 1,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    displayName: 'Starter',
    price: 25.00,
    priceAnnual: 240.00,
    interval: 'month',
    description: 'For occasional needs',
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-gray-500 to-gray-700',
    priceId: 'price_starter_monthly',
    trialDays: 7,
    trialLimitation: 'Trial: Monitoring only - no rebooks until first payment',
    features: [
      'Monitor up to 3 test centers',
      '2 rebook attempts per day',
      '10 daily notifications max',
      'SMS + Email notifications',
      'Chrome extension access',
      'Email support',
      '7-day monitoring trial',
      'Cancel anytime',
    ],
    limits: {
      testCenters: 3,
      rebooksPerDay: 2,
      notificationsPerDay: 10,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium',
    price: 45.00,
    priceAnnual: 432.00,
    interval: 'month',
    description: 'Best for active learners',
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-violet-600 to-purple-600',
    priceId: 'price_premium_monthly',
    popular: true,
    trialDays: 7,
    trialLimitation: 'Trial: Monitoring only - no rebooks until first payment',
    features: [
      'Monitor up to 5 test centers',
      '5 rebook attempts per day',
      '25 daily notifications max',
      'Priority SMS + Email notifications',
      'Rapid mode (500ms checks)',
      'Auto-rebooking enabled',
      'Advanced date filtering',
      'Analytics dashboard',
      'Chrome extension full access',
      '24/7 email support',
      '7-day monitoring trial',
      'Cancel anytime',
    ],
    limits: {
      testCenters: 5,
      rebooksPerDay: 5,
      notificationsPerDay: 25,
    },
  },
  {
    id: 'pro',
    name: 'Professional',
    displayName: 'Professional',
    price: 80.00,
    priceAnnual: 768.00,
    interval: 'month',
    description: 'Ultimate for driving instructors',
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-blue-600 to-blue-700',
    priceId: 'price_pro_monthly',
    trialDays: 14,
    trialLimitation: 'Trial: Full access including 2 free rebooks',
    features: [
      'Up to 20 pupils & 999 test centers',
      '10 daily booking attempts',
      '50 daily notifications max',
      'Multi-pupil management',
      'All notification types (Email, SMS, WhatsApp)',
      'Advanced analytics dashboard',
      'Pupil progress tracking',
      'Custom notification preferences',
      'Priority phone support',
      'Stealth mode (anti-detection)',
      '14-day full-access trial',
      'Cancel anytime',
    ],
    limits: {
      testCenters: 999,
      rebooksPerDay: 10,
      notificationsPerDay: 50,
    },
  },
];

interface EnhancedSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function EnhancedSubscriptionModal({
  isOpen,
  onClose,
  source = 'unknown',
}: EnhancedSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[2]); // Default to Premium
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCurrentSubscription();
      trackModalOpen();
    }
  }, [isOpen]);

  const loadCurrentSubscription = async () => {
    setIsLoading(true);
    try {
      const { subscription, error } = await getCurrentSubscription();
      if (error) {
        console.error('Error loading subscription:', error);
      } else {
        setCurrentSubscription(subscription);
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const trackModalOpen = () => {
    if (window.gtag) {
      window.gtag('event', 'subscription_modal_view', {
        event_category: 'subscription',
        event_label: source,
      });
    }
  };

  const trackPlanSelection = (plan: Plan) => {
    if (window.gtag) {
      window.gtag('event', 'subscription_plan_selected', {
        event_category: 'subscription',
        event_label: `${plan.id}_${billingInterval}`,
        value: plan.price,
      });
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    trackPlanSelection(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (subscriptionId: string) => {
    console.log('Payment successful:', subscriptionId);

    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: subscriptionId,
        value: selectedPlan.price,
        currency: 'GBP',
        items: [
          {
            item_id: selectedPlan.id,
            item_name: selectedPlan.displayName,
            price: selectedPlan.price,
            quantity: 1,
          },
        ],
      });
    }

    setTimeout(() => {
      window.location.href = '/dashboard?subscription=success';
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setError(null);
  };

  const getPlanPrice = (plan: Plan) => {
    if (plan.interval === 'once') return plan.price;

    if (billingInterval === 'year' && plan.priceAnnual) {
      return plan.priceAnnual;
    }

    return plan.price;
  };

  const calculateSavings = (plan: Plan) => {
    if (billingInterval === 'year' && plan.priceAnnual && plan.price) {
      const monthlyCost = plan.price * 12;
      const annualCost = plan.priceAnnual;
      return monthlyCost - annualCost;
    }
    return 0;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#1d70b8] animate-spin mb-4" />
            <p className="text-gray-600">Loading subscription details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showPaymentForm) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handlePaymentCancel()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Complete Your {selectedPlan.interval === 'once' ? 'Purchase' : 'Subscription'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Secure payment powered by Stripe
            </DialogDescription>
          </DialogHeader>

          <PaymentForm
            planType={selectedPlan.id as any}
            planName={selectedPlan.displayName}
            planPrice={getPlanPrice(selectedPlan)}
            trialDays={selectedPlan.trialDays}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6 border-b">
          <DialogTitle className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Fair, abuse-proof pricing. Pay per use or subscribe for better value.
          </DialogDescription>
        </DialogHeader>

        {/* Important Notice */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-sm font-medium text-yellow-800">
            <strong>Trial Period Note:</strong> Starter & Premium trials include monitoring only.
            Rebook credits activate after your first payment. Professional trial includes 2 free rebooks.
          </AlertDescription>
        </Alert>

        {/* Billing Interval Toggle (for recurring plans only) */}
        <div className="flex justify-center items-center gap-4 py-4">
          <div className="bg-gray-100 rounded-full p-1 flex shadow-inner">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                billingInterval === 'month'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                billingInterval === 'year'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </div>
          {billingInterval === 'year' && (
            <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
              <Star className="w-3 h-3 mr-1" />
              Save 20%
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          {plans.map((plan) => {
            const price = getPlanPrice(plan);
            const savings = calculateSavings(plan);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer ${
                  selectedPlan.id === plan.id
                    ? 'border-[#1d70b8] bg-blue-50/50 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                } ${plan.popular ? 'ring-4 ring-[#1d70b8]/20' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Most Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge
                      className={`bg-gradient-to-r ${plan.gradient} text-white px-4 py-1.5 shadow-lg`}
                    >
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    {plan.icon}
                  </div>
                </div>

                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.displayName}</h3>
                  <p className="text-gray-600 text-xs mb-3 min-h-[32px]">{plan.description}</p>

                  {/* Price Display */}
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-3xl font-extrabold text-gray-900">
                      £{price.toFixed(2)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      /{plan.interval === 'once' ? 'once' : billingInterval === 'year' ? 'year' : 'mo'}
                    </span>
                  </div>

                  {/* Included Rebooks */}
                  {plan.limits.rebooksPerMonth > 0 && plan.limits.rebooksPerMonth !== -1 && (
                    <p className="text-xs font-semibold text-[#1d70b8]">
                      {plan.limits.rebooksPerMonth} rebooks/month included
                    </p>
                  )}

                  {plan.limits.rebooksPerMonth === -1 && (
                    <p className="text-xs font-semibold text-green-600">
                      Unlimited rebooks - no extra fees!
                    </p>
                  )}

                  {/* Annual Savings */}
                  {billingInterval === 'year' && savings > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Save £{savings.toFixed(2)}/year
                    </p>
                  )}

                  {/* Trial Period */}
                  {plan.trialDays && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700">
                        {plan.trialDays}-day trial
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-2.5 h-2.5 text-green-600 font-bold" />
                      </div>
                      <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Trial Limitation Warning */}
                {plan.trialLimitation && (
                  <div className="mb-4 text-xs bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-800">
                    <strong>⚠️ Trial:</strong> {plan.trialLimitation}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan);
                  }}
                  className={`w-full py-5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    selectedPlan.id === plan.id
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105`
                      : 'border-2 border-gray-300 text-gray-700 hover:border-[#1d70b8] hover:text-[#1d70b8]'
                  }`}
                  variant={selectedPlan.id === plan.id ? 'default' : 'outline'}
                >
                  {plan.interval === 'once' ? 'Pay £30 Once' : plan.trialDays ? `Start ${plan.trialDays}-Day Trial` : 'Subscribe Now'}
                </Button>

                {/* Extra Rebook Pricing */}
                {plan.limits.extraRebookPrice && plan.limits.extraRebookPrice > 0 && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Extra rebooks: £{plan.limits.extraRebookPrice} each
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Anti-Abuse Explanation */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h4 className="font-bold text-gray-900 mb-3 text-center">🛡️ How We Prevent Trial Abuse</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">During Trial Period:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ You can monitor test centers</li>
                <li>✓ You'll see all available slots</li>
                <li>✓ You'll get notifications</li>
                <li>✗ You cannot rebook during trial</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">After First Payment:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Your rebook credits activate</li>
                <li>✓ Can complete test rebooks</li>
                <li>✓ Monthly quota resets on billing date</li>
                <li>✓ Extra rebooks billed automatically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1d70b8]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#1d70b8]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Secure Payment</p>
                <p className="text-xs text-gray-600">
                  PCI DSS Level 1 compliant. Your card details are encrypted and secure.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">Fair Pricing</p>
                <p className="text-xs text-gray-600">
                  Only pay for what you use. Extra rebooks billed transparently at discounted rates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">30-Day Guarantee</p>
                <p className="text-xs text-gray-600">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EnhancedSubscriptionModal;
