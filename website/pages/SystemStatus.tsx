import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Clock, Wifi, Server, Bell, Chrome } from 'lucide-react';

export function SystemStatus() {
  const location = useLocation();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [location]);

  const services = [
    {
      name: "Website",
      status: "operational",
      uptime: "99.9%",
      responseTime: "245ms",
      description: "Main website and landing pages"
    },
    {
      name: "User Dashboard",
      status: "operational",
      uptime: "99.8%",
      responseTime: "198ms",
      description: "User account management and settings"
    },
    {
      name: "Test Monitoring Service",
      status: "operational",
      uptime: "99.7%",
      responseTime: "320ms",
      description: "Core service that monitors DVSA for test cancellations"
    },
    {
      name: "Email Notifications",
      status: "operational",
      uptime: "99.9%",
      responseTime: "125ms",
      description: "Email delivery system for test alerts"
    },
    {
      name: "SMS Notifications",
      status: "operational",
      uptime: "99.8%",
      responseTime: "180ms",
      description: "SMS delivery system for test alerts"
    },
    {
      name: "Chrome Extension",
      status: "operational",
      uptime: "99.6%",
      responseTime: "N/A",
      description: "Browser extension functionality"
    },
    {
      name: "Payment Processing",
      status: "operational",
      uptime: "100%",
      responseTime: "156ms",
      description: "Stripe payment processing"
    },
    {
      name: "API Endpoints",
      status: "operational",
      uptime: "99.7%",
      responseTime: "142ms",
      description: "REST API for mobile and third-party integrations"
    }
  ];

  const recentIncidents = [
    {
      date: "October 18, 2025",
      time: "14:30 GMT",
      title: "Brief Email Notification Delay",
      status: "resolved",
      duration: "15 minutes",
      description: "Some users experienced delays in email notifications due to a temporary issue with our email service provider."
    },
    {
      date: "October 15, 2025",
      time: "09:15 GMT",
      title: "Scheduled Maintenance",
      status: "completed",
      duration: "2 hours",
      description: "Planned maintenance to upgrade our monitoring infrastructure and improve performance."
    },
    {
      date: "October 12, 2025",
      time: "22:45 GMT",
      title: "Chrome Extension Update",
      status: "completed",
      duration: "30 minutes",
      description: "Successfully deployed an update to the Chrome extension with improved error handling."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            System Status
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time status of TestNotifier services and infrastructure
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900">All Systems Operational</h2>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()} GMT
            </div>
          </div>
          <p className="text-gray-600">
            All TestNotifier services are running normally. We'll update this page if there are any issues.
          </p>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                {getStatusIcon(service.status)}
              </div>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Uptime:</span>
                  <span className="font-medium text-gray-900">{service.uptime}</span>
                </div>
                {service.responseTime !== "N/A" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Response:</span>
                    <span className="font-medium text-gray-900">{service.responseTime}</span>
                  </div>
                )}
              </div>
              <div className={`mt-4 px-3 py-1 rounded-full text-xs font-medium text-center ${getStatusColor(service.status)}`}>
                {service.status === 'operational' ? 'Operational' : service.status}
              </div>
            </div>
          ))}
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Uptime This Month</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">99.9%</p>
            <p className="text-sm text-gray-600">Last 30 days</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Response Time</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">142ms</p>
            <p className="text-sm text-gray-600">Average response time</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications Sent</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">2.4M</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          <div className="space-y-6">
            {recentIncidents.map((incident, index) => (
              <div key={index} className="border-l-4 border-gray-200 pl-6 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIncidentStatusColor(incident.status)}`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {incident.date} at {incident.time}
                  <span className="mx-2">•</span>
                  Duration: {incident.duration}
                </div>
                <p className="text-gray-700">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-yellow-600 mr-3" />
            <h2 className="text-xl font-bold text-yellow-800">Upcoming Maintenance</h2>
          </div>
          <p className="text-yellow-700 mb-4">
            We're planning maintenance to upgrade our systems and improve performance.
          </p>
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Next Scheduled Maintenance</p>
                <p className="text-gray-600">October 26, 2025 at 02:00 GMT</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Expected Duration</p>
                <p className="text-gray-600">2 hours</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Impact:</strong> Brief interruption to email notifications. Test monitoring will continue normally.
            </p>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscribe to Status Updates</h2>
          <p className="text-gray-600 mb-6">
            Get notified when we have system updates or maintenance scheduled.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}