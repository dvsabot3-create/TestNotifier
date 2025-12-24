/**
 * Billing Dashboard Component
 * Complete subscription and payment management interface
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  CreditCard,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Loader2,
  Shield,
  TrendingUp,
} from 'lucide-react';
import {
  getCurrentSubscription,
  getPaymentHistory,
  getUpcomingInvoice,
  cancelSubscription,
  reactivateSubscription,
  openCustomerPortal,
} from '../../utils/stripe';
import { formatDistanceToNow } from 'date-fns';

export function BillingDashboard() {
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [upcomingInvoice, setUpcomingInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load current subscription
      const subResult = await getCurrentSubscription();
      if (subResult.subscription) {
        setSubscription(subResult.subscription);
      }

      // Load payment history
      const paymentResult = await getPaymentHistory(10, 0);
      if (paymentResult.payments) {
        setPaymentHistory(paymentResult.payments);
      }

      // Load upcoming invoice (if exists)
      const invoiceResult = await getUpcomingInvoice();
      if (invoiceResult.invoice) {
        setUpcomingInvoice(invoiceResult.invoice);
      }
    } catch (err) {
      console.error('Error loading billing data:', err);
      setError('Failed to load billing information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You\'ll keep access until the end of your billing period.')) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await cancelSubscription(true);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Subscription cancelled. You\'ll keep access until the end of your billing period.');
        await loadBillingData();
      }
    } catch (err) {
      setError('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await reactivateSubscription();
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Subscription reactivated successfully!');
        await loadBillingData();
      }
    } catch (err) {
      setError('Failed to reactivate subscription. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCustomerPortal = async () => {
    setIsProcessing(true);
    try {
      await openCustomerPortal();
    } catch (err) {
      setError('Failed to open billing portal. Please try again.');
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; icon: any }> = {
      active: { variant: 'default', label: 'Active', icon: <CheckCircle className="w-4 h-4" /> },
      trialing: { variant: 'secondary', label: 'Trial', icon: <Clock className="w-4 h-4" /> },
      past_due: { variant: 'destructive', label: 'Past Due', icon: <AlertCircle className="w-4 h-4" /> },
      cancelled: { variant: 'outline', label: 'Cancelled', icon: <X className="w-4 h-4" /> },
      unpaid: { variant: 'destructive', label: 'Unpaid', icon: <AlertCircle className="w-4 h-4" /> },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getPlanName = (planType: string) => {
    const names: Record<string, string> = {
      free: 'Free',
      premium: 'Premium',
      pro: 'Professional',
    };
    return names[planType] || planType;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1d70b8] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription, payment methods, and billing history</p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Current Subscription Card */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Current Subscription
              </CardTitle>
              <CardDescription className="mt-2">
                {subscription ? 'Your active subscription plan' : 'No active subscription'}
              </CardDescription>
            </div>
            {subscription && getStatusBadge(subscription.status)}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {subscription ? (
            <div className="space-y-6">
              {/* Plan Details */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getPlanName(subscription.planType)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    £{(subscription.price / 100).toFixed(2)}
                    <span className="text-sm text-gray-600 font-normal">/month</span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Cancellation Warning */}
              {subscription.cancelAtPeriodEnd && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Your subscription will end on{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB')}.
                    You'll be downgraded to the Free plan.
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {subscription.cancelAtPeriodEnd ? (
                  <Button
                    onClick={handleReactivateSubscription}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reactivate Subscription
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleOpenCustomerPortal}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0]"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Billing
                    </Button>

                    <Button
                      onClick={handleCancelSubscription}
                      disabled={isProcessing}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">You're currently on the Free plan</p>
              <Button className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0]">
                Upgrade to Premium
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Invoice */}
      {upcomingInvoice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1d70b8]" />
              Upcoming Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{(upcomingInvoice.amountDue / 100).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Billing Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(upcomingInvoice.date).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#1d70b8]" />
            Payment History
          </CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No payment history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        payment.status === 'succeeded'
                          ? 'bg-green-100'
                          : payment.status === 'failed'
                          ? 'bg-red-100'
                          : 'bg-yellow-100'
                      }`}
                    >
                      {payment.status === 'succeeded' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : payment.status === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.description || `${payment.planName} Subscription`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      £{(payment.amount / 100).toFixed(2)}
                    </p>
                    {payment.invoiceUrl && (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1d70b8] hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Invoice
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {paymentHistory.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={handleOpenCustomerPortal}>
                View All Invoices
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleOpenCustomerPortal}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#1d70b8]" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Update your payment method or add a backup card
            </p>
            <Button variant="outline" className="w-full" disabled={isProcessing}>
              Manage Payment Methods
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleOpenCustomerPortal}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1d70b8]" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Update your billing address and contact details
            </p>
            <Button variant="outline" className="w-full" disabled={isProcessing}>
              Update Billing Info
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1d70b8] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Our support team is here to help with any billing questions or concerns.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="ghost" size="sm">
                  View FAQ
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BillingDashboard;

