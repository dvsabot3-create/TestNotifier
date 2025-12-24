import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, XCircle, Clock, ArrowRight, Crown, Star, Shield } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "./ui/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    monitors: number;
    notifications: number;
    alerts: number;
  };
  formattedPrice: string;
}

interface SubscriptionStatus {
  planId: string;
  planName: string;
  status: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    monitors: number;
    notifications: number;
    alerts: number;
  };
  currentPeriodStart: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  daysUntilExpiry: number | null;
  isActive: boolean;
}

interface SubscriptionManagerProps {
  className?: string;
  showDetailed?: boolean;
}

function SubscriptionContent({ className = "", showDetailed = false }: SubscriptionManagerProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch subscription plans
      const plansResponse = await fetch('/api/billing/plans');
      const plansData = await plansResponse.json();
      if (plansData.success) {
        setPlans(plansData.data);
      }

      // Fetch current subscription
      const subscriptionResponse = await fetch('/api/billing/subscription');
      const subscriptionData = await subscriptionResponse.json();
      if (subscriptionData.success) {
        setSubscription(subscriptionData.data);
      }
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planId: string) => {
    if (planId === subscription?.planId) {
      toast({
        title: "Already subscribed",
        description: "You are already subscribed to this plan.",
        variant: "default",
      });
      return;
    }

    // Handle One-Off plan differently - direct payment without subscription
    if (planId === 'oneoff') {
      toast({
        title: "One-Off Payment",
        description: "One-off payments are processed differently. Please contact support.",
        variant: "default",
      });
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/billing/cancel`,
        }),
      });

      const data = await response.json();
      if (data.success && data.data.sessionUrl) {
        window.location.href = data.data.sessionUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async (atPeriodEnd: boolean = true) => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ atPeriodEnd }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Subscription cancelled",
          description: data.message,
          variant: "default",
        });
        fetchSubscriptionData();
        setShowCancelDialog(false);
      } else {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/billing/reactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Subscription reactivated",
          description: data.message,
          variant: "default",
        });
        fetchSubscriptionData();
      } else {
        throw new Error(data.error || 'Failed to reactivate subscription');
      }
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      toast({
        title: "Error",
        description: "Failed to reactivate subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();
      if (data.success && data.data.sessionUrl) {
        window.location.href = data.data.sessionUrl;
      } else {
        throw new Error(data.error || 'Failed to create billing portal session');
      }
    } catch (err) {
      console.error('Error creating billing portal session:', err);
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'premium':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'professional':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'oneoff':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string, isActive: boolean, cancelAtPeriodEnd: boolean) => {
    if (status === 'active' && !cancelAtPeriodEnd) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
    } else if (status === 'active' && cancelAtPeriodEnd) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Cancelling</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d70b8]"></div>
            <span className="ml-2 text-gray-600">Loading subscription data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {/* Current Subscription Status */}
      {subscription && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPlanIcon(subscription.planId)}
                <div>
                  <CardTitle>Current Plan: {subscription.planName}</CardTitle>
                  <CardDescription>Your subscription details</CardDescription>
                </div>
              </div>
              {getStatusBadge(subscription.status, subscription.isActive, subscription.cancelAtPeriodEnd)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-semibold">{new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: subscription.currency.toUpperCase(),
                }).format(subscription.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Billing Cycle</p>
                <p className="text-lg font-semibold capitalize">{subscription.interval}</p>
              </div>
            </div>

            {subscription.currentPeriodEnd && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Current Period</p>
                <div className="flex justify-between text-sm">
                  <span>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</span>
                  <span>to</span>
                  <span>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                </div>
                <Progress
                  value={subscription.daysUntilExpiry ? Math.max(0, 100 - (subscription.daysUntilExpiry / 30) * 100) : 100}
                  className="h-2"
                />
                {subscription.daysUntilExpiry && (
                  <p className="text-xs text-gray-500">{subscription.daysUntilExpiry} days remaining</p>
                )}
              </div>
            )}

            {subscription.cancelAtPeriodEnd && (
              <Alert>
                <AlertDescription>
                  Your subscription will be cancelled at the end of the current billing period.
                  You can reactivate it anytime before then.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3 pt-4">
              {subscription.isActive && !subscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel Subscription
                </Button>
              )}
              <Button
                onClick={handleManageBilling}
                disabled={isProcessing || subscription.planId === 'free'}
                className="flex-1 bg-[#1d70b8] hover:bg-[#165a9f]"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${subscription?.planId === plan.id ? 'ring-2 ring-[#1d70b8]' : ''}`}
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(plan.id)}
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                    {subscription?.planId === plan.id && (
                      <Badge className="bg-[#1d70b8] text-white">Current</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{plan.formattedPrice}</p>
                    <p className="text-sm text-gray-600">per {plan.interval}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={isProcessing || subscription?.planId === plan.id}
                    className="w-full"
                    variant={subscription?.planId === plan.id ? "outline" : "default"}
                  >
                    {subscription?.planId === plan.id ? 'Current Plan' : 'Upgrade'}
                    {subscription?.planId !== plan.id && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Cancel Subscription</CardTitle>
              <CardDescription>
                Are you sure you want to cancel your subscription?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                You can choose to cancel immediately or at the end of your current billing period.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={() => handleCancelSubscription(true)}
                  disabled={isProcessing}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  Cancel at Period End
                </Button>
                <Button
                  onClick={() => handleCancelSubscription(false)}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Cancel Immediately
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export function SubscriptionManager({ className = "", showDetailed = false }: SubscriptionManagerProps) {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionContent className={className} showDetailed={showDetailed} />
    </Elements>
  );
}

export default SubscriptionManager;