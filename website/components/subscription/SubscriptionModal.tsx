import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Check, X, Star, Shield, Clock, Loader2, Zap, Crown, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Badge } from "../ui/badge";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'once' | 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  trialDays?: number;
  buttonText: string;
  priceId: string;
  rebooksPerMonth?: number;
  extraRebookPrice?: number;
  trialLimitation?: string;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  currentPlan?: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'oneoff',
    name: 'One-Off Rebook',
    price: 30.00,
    interval: 'once',
    description: 'Single guaranteed rebook',
    features: [
      'One successful rebook guaranteed',
      'Monitor 1 test center',
      'Email notification',
      'Valid for 30 days',
      'No recurring charges'
    ],
    buttonText: 'Pay £30 Once',
    priceId: 'price_oneoff'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 25.00,
    interval: 'month',
    description: 'For occasional needs',
    features: [
      'Monitor 3 test centers',
      '2 rebooks/month included',
      'Extra rebooks: £12 each',
      'SMS + Email notifications',
      'Cancel anytime'
    ],
    trialDays: 7,
    trialLimitation: 'Monitoring only during trial',
    buttonText: 'Start 7-Day Trial',
    priceId: 'price_starter_monthly',
    rebooksPerMonth: 2,
    extraRebookPrice: 12
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 45.00,
    interval: 'month',
    description: 'Best for active learners',
    features: [
      'Monitor 5 test centers',
      '5 rebooks/month included',
      'Extra rebooks: £8 each',
      'Rapid mode (500ms)',
      'Priority notifications',
      'SMS + Email alerts',
      'Cancel anytime'
    ],
    popular: true,
    trialDays: 7,
    trialLimitation: 'Monitoring only during trial',
    buttonText: 'Start 7-Day Trial',
    priceId: 'price_premium_monthly',
    rebooksPerMonth: 5,
    extraRebookPrice: 8
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 80.00,
    interval: 'month',
    description: 'For driving instructors',
    features: [
      'UNLIMITED test centers',
      'UNLIMITED rebooks (no extra fees!)',
      'UNLIMITED pupils',
      'Multi-pupil management',
      'All notifications',
      'Advanced analytics',
      'Priority phone support',
      'API access'
    ],
    trialDays: 14,
    trialLimitation: 'Full access + 2 rebooks during trial',
    buttonText: 'Start 14-Day Trial',
    priceId: 'price_pro_monthly'
  }
];

export function SubscriptionModal({ isOpen, onClose, source, currentPlan }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const trackEvent = (eventName: string, eventCategory: string, eventLabel: string, value?: number) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        value: value
      });
    }
  };

  const handlePlanSelect = async (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    trackEvent('subscription_plan_selected', 'subscription', `${planId}_${billingInterval}`, plan.price);

    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planId: planId,
          billingInterval: billingInterval,
          successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      trackEvent('subscription_error', 'error', 'checkout_session_failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingIntervalChange = (interval: 'month' | 'year') => {
    setBillingInterval(interval);
    trackEvent('billing_interval_changed', 'subscription', `${interval}_billing`);
  };

  useEffect(() => {
    if (isOpen) {
      trackEvent('subscription_modal_open', 'engagement', source || 'unknown');
    }
  }, [isOpen]);

  const getPlanPrice = (plan: SubscriptionPlan) => {
    if (plan.interval === 'once') return plan.price;

    if (billingInterval === 'year') {
      return Math.round(plan.price * 12 * 0.8); // 20% discount for annual
    }

    return plan.price;
  };

  if (subscriptionSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated!</h3>
            <p className="text-gray-600">
              Your subscription has been successfully activated.
              Redirecting to your dashboard...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Pay once or subscribe. All subscription plans include free trials with monitoring only.
          </DialogDescription>
        </DialogHeader>

        {/* Important Trial Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-900 text-center">
            <strong>⚠️ Trial Limitation:</strong> Starter & Premium trials allow monitoring only.
            Rebook credits activate after first payment. Professional trial includes 2 free rebooks.
          </p>
        </div>

        {/* Billing interval toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => handleBillingIntervalChange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingIntervalChange('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'year'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-[#1d70b8] bg-blue-50/50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              } ${plan.popular ? 'ring-2 ring-[#1d70b8] ring-opacity-50' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-xs mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">£{getPlanPrice(plan)}</span>
                  <span className="text-gray-600 ml-1 text-sm">/{plan.interval === 'once' ? 'once' : billingInterval}</span>
                </div>
                
                {plan.rebooksPerMonth && (
                  <p className="text-xs text-[#1d70b8] font-semibold mt-2">
                    {plan.rebooksPerMonth} rebooks/month
                  </p>
                )}
                
                {plan.trialDays && (
                  <p className="text-xs text-green-600 mt-1">{plan.trialDays}-day trial</p>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-xs">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.trialLimitation && (
                <div className="mb-4 text-xs bg-yellow-50 p-2 rounded border border-yellow-200 text-yellow-800">
                  ⚠️ {plan.trialLimitation}
                </div>
              )}

              <Button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={isLoading}
                className={`w-full ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-[#1d70b8] hover:text-[#1d70b8]'
                }`}
                variant={selectedPlan === plan.id ? 'default' : 'outline'}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>

              {plan.extraRebookPrice && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Extra: £{plan.extraRebookPrice}/rebook
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Security notice */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Secure & Flexible</p>
              <p>All payments are processed securely through Stripe. Cancel anytime, no hidden fees. Extra rebooks billed automatically.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-4">
          <div className="text-center text-sm text-gray-600">
            Need help choosing?{' '}
            <a href="/contact" className="text-[#1d70b8] hover:underline font-medium">
              Contact support
            </a>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <Clock className="w-3 h-3 inline mr-1" />
            30-day money-back guarantee on subscriptions
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
