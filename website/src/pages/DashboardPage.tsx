import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, CreditCard, Settings, LogOut, Crown, Sparkles, Zap, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.clear();
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDownloadExtension = () => {
    window.open('/download-extension', '_blank');
  };

  const handleManageBilling = async () => {
    try {
      // Create Stripe billing portal session via backend
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank');
      } else {
        console.error('Failed to create billing portal session');
        alert('Unable to open billing portal. Please contact support.');
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      alert('Unable to open billing portal. Please contact support.');
    }
  };

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'professional': return <Crown className="w-6 h-6 text-blue-600" />;
      case 'premium': return <Sparkles className="w-6 h-6 text-purple-600" />;
      case 'starter': return <TrendingUp className="w-6 h-6 text-gray-600" />;
      case 'oneoff': return <Zap className="w-6 h-6 text-green-600" />;
      default: return <Zap className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'professional': return 'bg-blue-50 border-blue-200';
      case 'premium': return 'bg-purple-50 border-purple-200';
      case 'starter': return 'bg-gray-50 border-gray-200';
      case 'oneoff': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tier = user.subscription?.tier || 'free';
  const status = user.subscription?.status || 'inactive';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Account Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.avatar && (
                  <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Download Extension - Most Important */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Ready to Start Monitoring?</h2>
              <p className="text-blue-100 mb-4 max-w-2xl">
                Download the Chrome Extension to begin monitoring DVSA test cancellations and receiving instant notifications.
              </p>
              <button
                onClick={handleDownloadExtension}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Chrome Extension</span>
              </button>
            </div>
            <Download className="w-24 h-24 text-white opacity-20" />
          </div>
        </div>

        {/* Subscription Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
              {getTierIcon(tier)}
            </div>
            <div className={`${getTierColor(tier)} border-2 rounded-lg p-4 mb-4`}>
              <p className="text-sm text-gray-600 mb-1">Subscription Tier</p>
              <p className="text-2xl font-bold capitalize mb-2">
                {tier === 'oneoff' ? 'One-Off Rescue' : tier}
              </p>
              <p className="text-sm">
                Status: <span className={`font-semibold ${status === 'active' || status === 'trialing' ? 'text-green-600' : 'text-red-600'}`}>
                  {status === 'trialing' ? 'Trial Active' : status}
                </span>
              </p>
            </div>
            {status === 'inactive' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>No active subscription.</strong> Choose a plan to start monitoring.
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/#pricing')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {status === 'inactive' ? 'Choose a Plan' : 'Upgrade Plan'}
            </button>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-lg shadow p-6">
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
                <p className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleManageBilling}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Manage Billing</p>
                <p className="text-sm text-gray-600">Payment & invoices</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <Settings className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Manage preferences</p>
              </div>
            </button>

            <button
              onClick={handleDownloadExtension}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Download className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Get Extension</p>
                <p className="text-sm text-gray-600">Download again</p>
              </div>
            </button>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Where to Find Features</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>• <strong>Test Monitoring:</strong> Chrome Extension only</p>
                <p>• <strong>Notifications:</strong> Chrome Extension + SMS/Email</p>
                <p>• <strong>Auto-Rebooking:</strong> Chrome Extension only</p>
                <p>• <strong>Subscription Management:</strong> This portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
