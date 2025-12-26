import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Package, ArrowUpRight, AlertCircle, CheckCircle, Clock, Zap, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { Header } from '../components/figma/Header';

interface SubscriptionData {
  tier: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  usage?: {
    monitorsCount: number;
    monitorsLimit: number;
    rebooksToday: number;
    rebooksTotal: number;
    rebooksLimit: number;
    notificationsSent: number;
    notificationsLimit: number;
  };
}

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user') || localStorage.getItem('user_data');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));

      // Fetch real subscription data from API
      const response = await fetch('/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription || data);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          returnUrl: window.location.origin + '/subscription'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.url || data.data?.url) {
          window.location.href = data.url || data.data.url;
        }
      } else {
        alert('Please select a subscription plan first.');
        window.location.href = '/#pricing';
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      alert('Unable to open billing portal.');
    }
  };

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'professional': return <Crown className="w-8 h-8 text-blue-600" />;
      case 'premium': return <Sparkles className="w-8 h-8 text-purple-600" />;
      case 'starter': return <TrendingUp className="w-8 h-8 text-gray-600" />;
      case 'oneoff': return <Zap className="w-8 h-8 text-green-600" />;
      default: return <Package className="w-8 h-8 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'professional': return 'from-blue-500 to-blue-600';
      case 'premium': return 'from-purple-500 to-purple-600';
      case 'starter': return 'from-gray-500 to-gray-600';
      case 'oneoff': return 'from-green-500 to-green-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTierPrice = (tier: string) => {
    switch(tier) {
      case 'professional': return '£80/month';
      case 'premium': return '£45/month';
      case 'starter': return '£25/month';
      case 'oneoff': return '£30 one-time';
      default: return 'Free';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tier = subscription?.tier || 'free';
  const status = subscription?.status || 'inactive';
  const usage = subscription?.usage;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription</h1>
        <p className="text-gray-600 mb-8">Manage your subscription plan and billing</p>

        {/* Current Plan Card */}
        <div className={`bg-gradient-to-r ${getTierColor(tier)} rounded-lg shadow-lg p-8 mb-8 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  {getTierIcon(tier)}
                </div>
                <div>
                  <p className="text-white/80 text-sm">Current Plan</p>
                  <h2 className="text-3xl font-bold capitalize">
                    {tier === 'oneoff' ? 'One-Off Rescue' : tier === 'free' ? 'No Active Plan' : tier}
                  </h2>
                </div>
              </div>
              <p className="text-2xl font-semibold mt-4">{getTierPrice(tier)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === 'active' || status === 'trialing' 
                  ? 'bg-green-400/20 text-green-100' 
                  : 'bg-red-400/20 text-red-100'
              }`}>
                {status === 'active' && <CheckCircle className="w-4 h-4 mr-1" />}
                {status === 'trialing' && <Clock className="w-4 h-4 mr-1" />}
                {status !== 'active' && status !== 'trialing' && <AlertCircle className="w-4 h-4 mr-1" />}
                {status === 'trialing' ? 'Trial Active' : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Billing Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Billing Period
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="font-semibold text-gray-900">
                  {subscription?.currentPeriodEnd 
                    ? formatDate(subscription.currentPeriodEnd)
                    : 'No upcoming billing'}
                </p>
              </div>
              {subscription?.cancelAtPeriodEnd && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Cancellation scheduled.</strong> Your plan will end on {formatDate(subscription.currentPeriodEnd)}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Usage This Period
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Monitors</span>
                <span className="font-semibold">
                  {usage?.monitorsCount || 0} / {usage?.monitorsLimit === -1 ? '∞' : usage?.monitorsLimit || 1}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rebooks Today</span>
                <span className="font-semibold">
                  {usage?.rebooksToday || 0} / {usage?.rebooksLimit === -1 ? '∞' : usage?.rebooksLimit || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Notifications Sent</span>
                <span className="font-semibold">
                  {usage?.notificationsSent || 0} / {usage?.notificationsLimit === -1 ? '∞' : usage?.notificationsLimit || 10}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Manage Subscription
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleManageBilling}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              {tier === 'free' ? 'Choose a Plan' : 'Manage Billing'}
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Package className="w-5 h-5" />
              {tier === 'free' ? 'View Plans' : 'Change Plan'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            You can update payment methods, view invoices, or cancel your subscription through the Stripe billing portal.
          </p>
        </div>

        {/* Plan Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier === 'professional' && (
              <>
                <FeatureItem text="Unlimited test monitors" included />
                <FeatureItem text="Unlimited auto-rebooks" included />
                <FeatureItem text="SMS, Email & WhatsApp notifications" included />
                <FeatureItem text="Priority support" included />
                <FeatureItem text="Stealth mode" included />
                <FeatureItem text="Multiple test centres" included />
              </>
            )}
            {tier === 'premium' && (
              <>
                <FeatureItem text="Up to 10 test monitors" included />
                <FeatureItem text="20 auto-rebooks per day" included />
                <FeatureItem text="SMS & Email notifications" included />
                <FeatureItem text="Email support" included />
                <FeatureItem text="WhatsApp notifications" included={false} />
                <FeatureItem text="Multiple test centres" included />
              </>
            )}
            {tier === 'starter' && (
              <>
                <FeatureItem text="Up to 3 test monitors" included />
                <FeatureItem text="5 auto-rebooks per day" included />
                <FeatureItem text="Email notifications only" included />
                <FeatureItem text="Email support" included />
                <FeatureItem text="SMS notifications" included={false} />
                <FeatureItem text="Multiple test centres" included={false} />
              </>
            )}
            {(tier === 'free' || tier === 'oneoff') && (
              <>
                <FeatureItem text="1 test monitor" included />
                <FeatureItem text="Email notifications" included />
                <FeatureItem text="Auto-rebook" included={tier === 'oneoff'} />
                <FeatureItem text="SMS notifications" included={false} />
              </>
            )}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text, included }: { text: string; included: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {included ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-gray-300" />
      )}
      <span className={included ? 'text-gray-900' : 'text-gray-400'}>{text}</span>
    </div>
  );
}

export default SubscriptionPage;
