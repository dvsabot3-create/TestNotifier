import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, CreditCard, Settings as SettingsIcon, 
  Activity, TrendingUp, Clock, CheckCircle, Bell,
  Crown, Sparkles, Zap, AlertCircle, ChevronRight,
  MapPin, Calendar, Target
} from 'lucide-react';
import { Header } from '../../components/figma/Header';
import { Card } from '../../components/ui/card';

interface ExtensionStats {
  monitorsCount: number;
  slotsFound: number;
  rebooksUsed: number;
  rebooksRemaining: number;
  notificationsSent: number;
  successRate: number;
  lastCheck: string | null;
  minutesSinceLastCheck: number | null;
}

interface Monitor {
  testCentre: string;
  active: boolean;
  lastSlotFound?: string;
  slotsFoundThisWeek: number;
}

const DashboardPageNew: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [extensionStats, setExtensionStats] = useState<ExtensionStats | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [extensionStatus, setExtensionStatus] = useState<'active' | 'offline' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user') || localStorage.getItem('user_data');

      if (!token || !userData) {
        navigate('/');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);

        // Fetch real-time subscription status
        try {
          const subResponse = await fetch('/api/subscriptions/current', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (subResponse.ok) {
            const subscriptionData = await subResponse.json();
            const subData = subscriptionData.subscription || subscriptionData;
            parsedUser.subscription = {
              tier: subData.tier || 'free',
              status: subData.status || 'active',
              currentPeriodEnd: subData.currentPeriodEnd,
              cancelAtPeriodEnd: subData.cancelAtPeriodEnd
            };
            localStorage.setItem('user_data', JSON.stringify(parsedUser));
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
        } catch (apiError) {
          console.error('Failed to fetch subscription:', apiError);
        }

        // Fetch extension stats
        try {
          const statsResponse = await fetch('/api/extension/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (statsResponse.ok) {
            const data = await statsResponse.json();
            if (data.success) {
              setExtensionStats(data.data.stats);
              setMonitors(data.data.monitors || []);
              setExtensionStatus(data.data.extensionStatus);
            }
          }
        } catch (statsError) {
          console.error('Failed to fetch extension stats:', statsError);
          // Set defaults
          setExtensionStats({
            monitorsCount: 0,
            slotsFound: 0,
            rebooksUsed: 0,
            rebooksRemaining: 0,
            notificationsSent: 0,
            successRate: 0,
            lastCheck: null,
            minutesSinceLastCheck: null
          });
        }

        setUser(parsedUser);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Refresh extension stats every 30 seconds
    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (token) {
        try {
          const statsResponse = await fetch('/api/extension/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (statsResponse.ok) {
            const data = await statsResponse.json();
            if (data.success) {
              setExtensionStats(data.data.stats);
              setExtensionStatus(data.data.extensionStatus);
            }
          }
        } catch (err) {
          // Silently fail - just use cached data
        }
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [navigate]);

  const handleDownloadExtension = () => {
    const tier = user?.subscription?.tier || 'free';
    
    const extensionFiles: Record<string, string> = {
      'professional': '/downloads/testnotifier-extension-professional.zip',
      'premium': '/downloads/testnotifier-extension-premium.zip',
      'starter': '/downloads/testnotifier-extension-starter.zip',
      'oneoff': '/downloads/testnotifier-extension-oneoff.zip',
      'free': '/downloads/testnotifier-extension-starter.zip'
    };

    const downloadUrl = extensionFiles[tier] || extensionFiles['starter'];
    const filename = `testnotifier-extension-${tier}.zip`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManageBilling = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please login again to manage billing.');
        navigate('/');
        return;
      }

      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          returnUrl: window.location.origin + '/dashboard'
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
      alert('Unable to open billing portal. Please select a subscription plan.');
      window.location.href = '/#pricing';
    }
  };

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'professional': return <Crown className="w-6 h-6 text-blue-600" />;
      case 'premium': return <Sparkles className="w-6 h-6 text-purple-600" />;
      case 'starter': return <TrendingUp className="w-6 h-6 text-gray-600" />;
      case 'oneoff': return <Zap className="w-6 h-6 text-green-600" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'professional': return '#1d70b8';
      case 'premium': return '#7c3aed';
      case 'starter': return '#6c757d';
      case 'oneoff': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTierLimits = (tier: string) => {
    const limits: Record<string, { rebooks: number; notifications: number; centres: number }> = {
      'professional': { rebooks: 10, notifications: 50, centres: 999 },
      'premium': { rebooks: 5, notifications: 25, centres: 5 },
      'starter': { rebooks: 2, notifications: 10, centres: 3 },
      'oneoff': { rebooks: 1, notifications: 5, centres: 1 },
      'free': { rebooks: 0, notifications: 0, centres: 0 }
    };
    return limits[tier] || limits['free'];
  };

  const formatTimeAgo = (minutes: number | null) => {
    if (!minutes) return 'Never';
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tier = user.subscription?.tier || 'free';
  const status = user.subscription?.status || 'inactive';
  const tierColor = getTierColor(tier);
  const limits = getTierLimits(tier);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Same navbar as homepage */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your driving test monitoring dashboard
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Extension Status */}
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow" style={{ borderColor: extensionStatus === 'active' ? '#28a745' : '#dc3545' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-3 h-3 rounded-full ${extensionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {extensionStatus === 'active' ? 'Active' : 'Offline'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Extension Status
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Last check: {formatTimeAgo(extensionStats?.minutesSinceLastCheck)}
            </div>
          </Card>

          {/* Slots Found */}
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#1d70b8' }}>
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {extensionStats?.slotsFound || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Slots Found
            </div>
            <div className="text-xs text-gray-500 mt-2">
              All time total
            </div>
          </Card>

          {/* Successful Rebooks */}
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#28a745' }}>
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {extensionStats?.rebooksUsed || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Successful Rebooks
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {extensionStats?.successRate || 0}% success rate
            </div>
          </Card>

          {/* Notifications Sent */}
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#7c3aed' }}>
            <div className="flex items-center justify-between mb-4">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {extensionStats?.notificationsSent || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Notifications Sent
            </div>
            <div className="text-xs text-gray-500 mt-2">
              This month
            </div>
          </Card>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Extension & Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Usage Meters */}
            <Card className="p-6 border-2 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" style={{ color: tierColor }} />
                Daily Usage
                <span className="ml-auto text-sm font-normal text-gray-500">Resets at midnight</span>
              </h3>

              <div className="space-y-4">
                {/* Rebook Attempts */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Rebook Attempts</span>
                    <span className="text-sm font-bold" style={{ color: tierColor }}>
                      {extensionStats?.rebooksUsed || 0} / {limits.rebooks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((((extensionStats?.rebooksUsed || 0) / limits.rebooks) * 100), 100)}%`,
                        backgroundColor: tierColor
                      }}
                    ></div>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                    <span className="text-sm font-bold" style={{ color: tierColor }}>
                      {extensionStats?.notificationsSent || 0} / {limits.notifications}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((((extensionStats?.notificationsSent || 0) / limits.notifications) * 100), 100)}%`,
                        backgroundColor: tierColor
                      }}
                    ></div>
                  </div>
                </div>

                {/* Test Centres */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Test Centres Monitored</span>
                    <span className="text-sm font-bold" style={{ color: tierColor }}>
                      {extensionStats?.monitorsCount || 0} / {limits.centres}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((((extensionStats?.monitorsCount || 0) / limits.centres) * 100), 100)}%`,
                        backgroundColor: tierColor
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Upgrade prompt if near limits */}
              {tier !== 'professional' && (
                ((extensionStats?.rebooksUsed || 0) / limits.rebooks > 0.8) ||
                ((extensionStats?.notificationsSent || 0) / limits.notifications > 0.8)
              ) && (
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Approaching daily limits
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Upgrade to get more rebooks and notifications
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.href = '/#pricing'}
                      className="ml-auto text-sm text-yellow-800 hover:text-yellow-900 font-semibold underline"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              )}
            </Card>

            {/* Monitored Test Centres */}
            <Card className="p-6 border-2 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2" style={{ color: tierColor }} />
                Monitored Test Centres
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {monitors.length} active
                </span>
              </h3>

              {monitors.length > 0 ? (
                <div className="space-y-3">
                  {monitors.slice(0, 5).map((monitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${monitor.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{monitor.testCentre}</p>
                          <p className="text-xs text-gray-500">
                            {monitor.slotsFoundThisWeek || 0} slots found this week
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {monitor.lastSlotFound ? formatTimeAgo(Math.floor((Date.now() - new Date(monitor.lastSlotFound).getTime()) / 60000)) : 'No slots yet'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No test centres being monitored</p>
                  <p className="text-sm text-gray-500">
                    Download and configure the extension to start monitoring
                  </p>
                </div>
              )}
            </Card>

          </div>

          {/* Right Column - Subscription & Actions */}
          <div className="space-y-6">
            
            {/* Current Subscription */}
            <Card className="p-6 border-2 shadow-lg" style={{ borderColor: tierColor }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
                {getTierIcon(tier)}
              </div>
              
              <div 
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: `${tierColor}10`, border: `2px solid ${tierColor}30` }}
              >
                <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                <p className="text-2xl font-bold capitalize mb-2" style={{ color: tierColor }}>
                  {tier === 'oneoff' ? 'One-Off' : tier === 'professional' ? 'ADI Professional' : tier}
                </p>
                <p className="text-sm">
                  Status: <span className={`font-semibold ${status === 'active' || status === 'trialing' ? 'text-green-600' : 'text-red-600'}`}>
                    {status === 'trialing' ? 'Trial Active' : status}
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  if (tier === 'free') {
                    window.location.href = '/#pricing';
                  } else {
                    handleManageBilling();
                  }
                }}
                className="w-full text-white px-4 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                style={{ backgroundColor: tierColor }}
              >
                {tier === 'free' ? 'Choose a Plan' : 'Manage Subscription'}
              </button>
            </Card>

            {/* Account Details */}
            <Card className="p-6 border-2 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-2 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                
                <button
                  onClick={handleDownloadExtension}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <div className="flex items-center">
                    <Download className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Download Extension</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleManageBilling}
                  className="w-full flex items-center justify-between p-3 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="font-semibold text-gray-900">Manage Billing</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center justify-between p-3 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <div className="flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-3 text-gray-700" />
                    <span className="font-semibold text-gray-900">Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

              </div>
            </Card>

          </div>

        </div>

        {/* Bottom Section - Installation Guide */}
        {extensionStatus === 'offline' && (
          <Card className="p-8 border-2 border-blue-200 bg-blue-50 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-bold text-blue-900 mb-2">
                  Get Started with TestNotifier
                </h4>
                <p className="text-blue-800 mb-4">
                  Download the Chrome extension to start monitoring DVSA test cancellations and receive instant notifications.
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDownloadExtension}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Download Extension
                  </button>
                  <a 
                    href="/download-extension"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                  >
                    Installation instructions →
                  </a>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Features Overview */}
        <Card className="p-6 border-2 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Where to Find Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Test Monitoring</p>
                <p className="text-sm text-gray-600">Chrome Extension only</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600">Extension + SMS/Email</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Auto-Rebooking</p>
                <p className="text-sm text-gray-600">Chrome Extension only</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Subscription</p>
                <p className="text-sm text-gray-600">This dashboard</p>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DashboardPageNew;

