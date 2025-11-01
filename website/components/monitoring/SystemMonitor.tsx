/**
 * System Monitoring Dashboard
 * Real-time monitoring of system health, performance, and security
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Server,
  Database,
  Network,
  Zap,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff
} from 'lucide-react';
import { logger } from '../../utils/logging';
import { trackEvent } from '../../utils/analytics';

interface SystemMetrics {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  errorRate: number;
  requestRate: number;
  responseTime: number;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'unknown';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  message?: string;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  resolved: boolean;
}

interface PerformanceMetric {
  name: string;
  current: number;
  average: number;
  trend: 'up' | 'down' | 'stable';
  threshold: number;
  unit: string;
}

export function SystemMonitor() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkLatency: 23,
    errorRate: 0.3,
    requestRate: 1250,
    responseTime: 145
  });

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([
    {
      name: 'API Server',
      status: 'operational',
      uptime: 99.9,
      responseTime: 145,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: 99.8,
      responseTime: 89,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Chrome Extension',
      status: 'operational',
      uptime: 98.5,
      responseTime: 234,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Notification Service',
      status: 'degraded',
      uptime: 97.2,
      responseTime: 456,
      lastChecked: new Date().toISOString(),
      message: 'High latency detected'
    }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Rate Limit Threshold',
      description: 'Multiple IP addresses approaching rate limits',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: 'Rate Limiter',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Security Update Available',
      description: 'New security patches available for deployment',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      source: 'Security Scanner',
      resolved: false
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'API Response Time',
      current: 145,
      average: 132,
      trend: 'up',
      threshold: 200,
      unit: 'ms'
    },
    {
      name: 'Database Queries',
      current: 89,
      average: 76,
      trend: 'up',
      threshold: 150,
      unit: 'ms'
    },
    {
      name: 'Extension Load Time',
      current: 234,
      average: 198,
      trend: 'up',
      threshold: 300,
      unit: 'ms'
    },
    {
      name: 'Memory Usage',
      current: 62,
      average: 58,
      trend: 'up',
      threshold: 80,
      unit: '%'
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        updateMetrics();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const updateMetrics = () => {
    // Simulate real-time metric updates
    setSystemMetrics(prev => ({
      uptime: Math.max(99, prev.uptime + (Math.random() - 0.5) * 0.1),
      cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 5)),
      memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 3)),
      diskUsage: Math.max(0, Math.min(100, prev.diskUsage + (Math.random() - 0.5) * 2)),
      networkLatency: Math.max(0, prev.networkLatency + (Math.random() - 0.5) * 10),
      errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.2),
      requestRate: Math.max(0, prev.requestRate + (Math.random() - 0.5) * 50),
      responseTime: Math.max(0, prev.responseTime + (Math.random() - 0.5) * 20)
    }));

    logger.info('monitoring', 'System metrics updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 text-gray-500">→</div>;
    }
  };

  const MetricCard = ({
    title,
    value,
    unit,
    icon: Icon,
    progress,
    color = "blue"
  }: {
    title: string;
    value: number;
    unit?: string;
    icon: any;
    progress?: number;
    color?: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{title}</p>
          <Icon className={`w-5 h-5 text-${color}-500`} />
        </div>
        <div className="flex items-baseline gap-1">
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {unit && <p className="text-sm text-gray-500">{unit}</p>}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className={`h-2 mt-2 bg-${color}-100`} />
        )}
      </CardContent>
    </Card>
  );

  const PerformanceMetricCard = ({
    metric
  }: {
    metric: PerformanceMetric;
  }) => {
    const isOverThreshold = metric.current > metric.threshold;
    const statusColor = isOverThreshold ? 'red' : metric.trend === 'up' ? 'orange' : 'green';

    return (
      <Card className={`border-${statusColor}-200 bg-${statusColor}-50`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900">{metric.name}</p>
            {getTrendIcon(metric.trend)}
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2"
              <p className={`text-xl font-bold text-${statusColor}-600`}>{metric.current}</p>
              <p className="text-sm text-gray-500">{metric.unit}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Avg: {metric.average}{metric.unit}</span>
              <span>Threshold: {metric.threshold}{metric.unit}</span>
            </div>
            {isOverThreshold && (
              <div className={`mt-2 text-xs text-${statusColor}-600 bg-${statusColor}-100 px-2 py-1 rounded`}>
                Above threshold
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleAlertAction = async (alertId: string, action: 'resolve' | 'dismiss') => {
    try {
      setSecurityAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, resolved: action === 'resolve' }
            : alert
        )
      );

      logger.info('monitoring', `Security alert ${action}d`, { alertId, action });
      trackEvent(`security_alert_${action}`, 'monitoring', 'security');
    } catch (error) {
      logger.error('monitoring', `Failed to ${action} alert`, { error });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/*  Header  *}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
          <p className="text-gray-600">Real-time system health and performance monitoring</p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="5m">Last 5 minutes</option>
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
          </select>

          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
        </div>
      </div>

      {/*  System Overview  *}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            System Overview
          </CardTitle>
          <CardDescription>Core system metrics and health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="System Uptime"
              value={systemMetrics.uptime}
              unit="%"
              icon={CheckCircle}
              progress={systemMetrics.uptime}
              color="green"
            />

            <MetricCard
              title="CPU Usage"
              value={systemMetrics.cpuUsage}
              unit="%"
              icon={Zap}
              progress={systemMetrics.cpuUsage}
              color="orange"
            />

            <MetricCard
              title="Memory Usage"
              value={systemMetrics.memoryUsage}
              unit="%"
              icon={Server}
              progress={systemMetrics.memoryUsage}
              color="blue"
            />

            <MetricCard
              title="Error Rate"
              value={systemMetrics.errorRate}
              unit="%"
              icon={AlertTriangle}
              progress={systemMetrics.errorRate * 10}
              color="red"
            />
          </div>
        </CardContent>
      </Card>

      {/*  Service Status  *}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            Service Status
          </CardTitle>
          <CardDescription>Health status of all system services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceStatus.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'operational' ? 'bg-green-500' :
                    service.status === 'degraded' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    {service.message && (
                      <p className="text-sm text-gray-600">{service.message}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{service.uptime}% uptime</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/*  Performance Metrics  *}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Detailed performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceMetrics.map((metric) => (
              <PerformanceMetricCard key={metric.name} metric={metric} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/*  Security Alerts  *}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security Alerts
          </CardTitle>
          <CardDescription>Recent security events and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityAlerts.map((alert) => (
            <Alert
              key={alert.id}
              className={`border-l-4 ${
                alert.type === 'critical'
                  ? 'border-red-500 bg-red-50'
                  : alert.type === 'warning'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-blue-500 bg-blue-50'
              }`}
            >
              <AlertTitle className="flex items-center gap-2">
                {alert.type === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
                {alert.title}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p>{alert.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.timestamp).toLocaleString()} • {alert.source}
                </p>
                {!alert.resolved && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleAlertAction(alert.id, 'resolve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Resolved
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAlertAction(alert.id, 'dismiss')}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}