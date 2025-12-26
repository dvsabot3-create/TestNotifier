import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, Clock, AlertCircle, Settings, Filter } from 'lucide-react';
import { Header } from '../components/figma/Header';

interface Notification {
  id: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  title: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  createdAt: string;
  testCentre?: string;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'email' | 'sms' | 'whatsapp'>('all');

  // Notification preferences
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    push: true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user') || localStorage.getItem('user_data');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));

      // For now, show sample notifications
      // In production, this would fetch from /api/notifications
      setNotifications([
        {
          id: '1',
          type: 'email',
          title: 'Test Cancellation Found!',
          message: 'A test slot has become available at Birmingham (Garretts Green) for 15th January 2025 at 10:30 AM',
          status: 'sent',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          testCentre: 'Birmingham (Garretts Green)'
        },
        {
          id: '2',
          type: 'sms',
          title: 'Auto-Rebook Successful',
          message: 'Your test has been rebooked to 15th January 2025 at 10:30 AM',
          status: 'sent',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          testCentre: 'Birmingham (Garretts Green)'
        },
        {
          id: '3',
          type: 'email',
          title: 'Monitoring Started',
          message: 'We are now monitoring Birmingham (Garretts Green) for earlier test dates',
          status: 'sent',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          testCentre: 'Birmingham (Garretts Green)'
        }
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'sms': return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-GB');
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || n.type === filter
  );

  const handleSavePreferences = () => {
    // In production, this would save to /api/user/preferences
    alert('Notification preferences saved!');
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

  const tier = user.subscription?.tier || 'free';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600 mb-8">View notification history and manage preferences</p>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            Notification Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">Receive email notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={(e) => setPreferences({...preferences, email: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className={`flex items-center justify-between p-4 border rounded-lg ${
              tier === 'free' || tier === 'starter' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
            }`}>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">SMS</p>
                  <p className="text-sm text-gray-500">
                    {tier === 'free' || tier === 'starter' ? 'Premium+ required' : 'Receive SMS alerts'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.sms}
                onChange={(e) => setPreferences({...preferences, sms: e.target.checked})}
                disabled={tier === 'free' || tier === 'starter'}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className={`flex items-center justify-between p-4 border rounded-lg ${
              tier !== 'professional' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
            }`}>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">
                    {tier !== 'professional' ? 'Professional only' : 'Receive WhatsApp messages'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.whatsapp}
                onChange={(e) => setPreferences({...preferences, whatsapp: e.target.checked})}
                disabled={tier !== 'professional'}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Browser Push</p>
                  <p className="text-sm text-gray-500">Extension notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.push}
                onChange={(e) => setPreferences({...preferences, push: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>
          <button
            onClick={handleSavePreferences}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Preferences
          </button>
        </div>

        {/* Notification History */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Notification History
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Notifications will appear here when we find test cancellations
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      {getStatusIcon(notification.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {notification.testCentre && (
                      <p className="text-xs text-gray-400 mt-1">
                        Test Centre: {notification.testCentre}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500">{formatTime(notification.createdAt)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                      notification.type === 'email' ? 'bg-blue-100 text-blue-700' :
                      notification.type === 'sms' ? 'bg-green-100 text-green-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {notification.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default NotificationsPage;
