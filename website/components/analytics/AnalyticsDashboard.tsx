import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  TrendingUp,
  Users,
  Chrome,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import { analyticsAPI } from '../../utils/api';
import { analytics, trackEvent } from '../../utils/analytics';
import { logger } from '../../utils/logging';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalTestsFound: number;
    successRate: number;
    avgTimeToFind: number;
  };
  trends: {
    users: Array<{ date: string; count: number }>;
    testsFound: Array<{ date: string; count: number }>;
    conversion: Array<{ date: string; rate: number }>;
  };
  topCenters: Array<{
    centerId: string;
    centerName: string;
    testsFound: number;
    successRate: number;
  }>;
  userBehavior: {
    avgSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
  };
  extensionMetrics: {
    installs: number;
    activeInstalls: number;
    uninstalls: number;
    avgRating: number;
  };
}

interface RealTimeMetrics {
  activeUsers: number;
  testsFoundToday: number;
  conversionRate: number;
  extensionActive: number;
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    testsFoundToday: 0,
    conversionRate: 0,
    extensionActive: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAnalyticsData();

    if (autoRefresh) {
      const interval = setInterval(() => {
        loadRealTimeMetrics();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);

      const startDate = getStartDate(selectedTimeRange);
      const endDate = new Date().toISOString();

      const response = await analyticsAPI.getAnalyticsSummary(startDate, endDate);

      if (response.success) {
        setAnalyticsData(response.data);
        logger.info('analytics', 'Analytics data loaded successfully');
        trackEvent('analytics_dashboard_loaded', 'analytics', 'dashboard');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      logger.error('analytics', 'Failed to load analytics data', { error });
      trackEvent('analytics_load_failed', 'error', 'dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealTimeMetrics = async () => {
    try {
      // Simulate real-time metrics (in production, this would be WebSocket or SSE)
      setRealTimeMetrics({
        activeUsers: Math.floor(Math.random() * 100) + 50,
        testsFoundToday: Math.floor(Math.random() * 50) + 20,
        conversionRate: Math.floor(Math.random() * 30) + 60,
        extensionActive: Math.floor(Math.random() * 200) + 100
      });
    } catch (error) {
      logger.error('analytics', 'Failed to load real-time metrics', { error });
    }
  };

  const getStartDate = (range: string): string => {
    const now = new Date();
    switch (range) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    className = ""
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    trend?: { value: number; isPositive: boolean };
    className?: string;
  }) => (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Icon className="w-5 h-5 text-gray-400" />
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-3 h-3 ${
                  trend.isPositive ? '' : 'rotate-180'
                }`} />
                {trend.value}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RealTimeCard = () => (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Activity className="w-5 h-5" />
          Real-Time Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Active Users</p>
              <p className="text-lg font-semibold text-gray-900">{realTimeMetrics.activeUsers}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Tests Today</p>
              <p className="text-lg font-semibold text-gray-900">{realTimeMetrics.testsFoundToday}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Conversion Rate</p>
              <p className="text-lg font-semibold text-gray-900">{realTimeMetrics.conversionRate}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Chrome className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Extension Active</p>
              <p className="text-lg font-semibold text-gray-900">{realTimeMetrics.extensionActive}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700">Live Data</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="text-green-700"
          >
            {autoRefresh ? 'Pause Updates' : 'Resume Updates'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d70b8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load analytics data</p>
          <Button onClick={loadAnalyticsData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <!-- Header -->
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your TestNotifier performance and user engagement</p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d70b8] focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <Button
            onClick={loadAnalyticsData}
            variant="outline"
            className="border-[#1d70b8] text-[#1d70b8]"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Real-Time Metrics -->
      <RealTimeCard />

      <!-- Key Metrics -->
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={analyticsData.overview.totalUsers.toLocaleString()}
          subtitle="Registered users"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />

        <MetricCard
          title="Active Users"
          value={analyticsData.overview.activeUsers.toLocaleString()}
          subtitle="Currently using extension"
          icon={Activity}
          trend={{ value: 8, isPositive: true }}
        />

        <MetricCard
          title="Tests Found"
          value={analyticsData.overview.totalTestsFound.toLocaleString()}
          subtitle="Total cancellations found"
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />

        <MetricCard
          title="Success Rate"
          value={`${analyticsData.overview.successRate}%`}
          subtitle="Average success rate"
          icon={Target}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <!-- Top Performing Centers -->
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Top Performing Test Centers
          </CardTitle>
          <CardDescription>Centers with highest success rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.topCenters.slice(0, 5).map((center, index) => (
              <div key={center.centerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1d70b8] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{center.centerName}</p>
                    <p className="text-sm text-gray-600">{center.testsFound} tests found</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{center.successRate}%</p>
                  <p className="text-xs text-gray-600">success rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <!-- User Behavior Insights -->
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            User Behavior Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.floor(analyticsData.userBehavior.avgSessionDuration / 60)}m
              </div>
              <p className="text-sm text-gray-600">Avg Session Duration</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {analyticsData.userBehavior.pagesPerSession}
              </div>
              <p className="text-sm text-gray-600">Pages per Session</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {analyticsData.userBehavior.bounceRate}%
              </div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Extension Metrics -->
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Chrome className="w-5 h-5" />
            Chrome Extension Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Installs"
              value={analyticsData.extensionMetrics.installs.toLocaleString()}
              subtitle="All time installs"
              icon={Chrome}
            />

            <MetricCard
              title="Active Installs"
              value={analyticsData.extensionMetrics.activeInstalls.toLocaleString()}
              subtitle="Currently active"
              icon={Activity}
            />

            <MetricCard
              title="Uninstalls"
              value={analyticsData.extensionMetrics.uninstalls.toLocaleString()}
              subtitle="Total uninstalls"
              icon={AlertCircle}
            />

            <MetricCard
              title="Avg Rating"
              value={analyticsData.extensionMetrics.avgRating.toFixed(1)}
              subtitle="Chrome Web Store"
              icon={Target}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}