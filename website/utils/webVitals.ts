import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

interface WebVitalsReport {
  name: string;
  value: number;
  delta?: number;
  id: string;
  navigationType?: string;
}

interface WebVitalsConfig {
  onReport: (metric: WebVitalsReport) => void;
  onCLS?: (metric: Metric) => void;
  onFID?: (metric: Metric) => void;
  onFCP?: (metric: Metric) => void;
  onLCP?: (metric: Metric) => void;
  onTTFB?: (metric: Metric) => void;
  reportAllChanges?: boolean;
}

class WebVitalsMonitor {
  private config: WebVitalsConfig;
  private metrics: Map<string, WebVitalsReport[]> = new Map();
  private isMonitoring: boolean = false;

  constructor(config: WebVitalsConfig) {
    this.config = config;
    this.initializeMetrics();
  }

  /**
   * Initialize Web Vitals monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    try {
      // Monitor all Core Web Vitals
      getCLS(this.handleCLS.bind(this), { reportAllChanges: this.config.reportAllChanges });
      getFID(this.handleFID.bind(this));
      getFCP(this.handleFCP.bind(this));
      getLCP(this.handleLCP.bind(this), { reportAllChanges: this.config.reportAllChanges });
      getTTFB(this.handleTTFB.bind(this));

      this.isMonitoring = true;
      console.log('Web Vitals monitoring started');
    } catch (error) {
      console.error('Failed to start Web Vitals monitoring:', error);
    }
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('Web Vitals monitoring stopped');
  }

  /**
   * Handle CLS (Cumulative Layout Shift)
   */
  private handleCLS(metric: Metric): void {
    this.processMetric('CLS', metric);
    if (this.config.onCLS) {
      this.config.onCLS(metric);
    }
  }

  /**
   * Handle FID (First Input Delay)
   */
  private handleFID(metric: Metric): void {
    this.processMetric('FID', metric);
    if (this.config.onFID) {
      this.config.onFID(metric);
    }
  }

  /**
   * Handle FCP (First Contentful Paint)
   */
  private handleFCP(metric: Metric): void {
    this.processMetric('FCP', metric);
    if (this.config.onFCP) {
      this.config.onFCP(metric);
    }
  }

  /**
   * Handle LCP (Largest Contentful Paint)
   */
  private handleLCP(metric: Metric): void {
    this.processMetric('LCP', metric);
    if (this.config.onLCP) {
      this.config.onLCP(metric);
    }
  }

  /**
   * Handle TTFB (Time to First Byte)
   */
  private handleTTFB(metric: Metric): void {
    this.processMetric('TTFB', metric);
    if (this.config.onTTFB) {
      this.config.onTTFB(metric);
    }
  }

  /**
   * Process and store metric
   */
  private processMetric(metricName: string, metric: Metric): void {
    const report: WebVitalsReport = {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };

    // Store metric
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }
    this.metrics.get(metricName)!.push(report);

    // Call main report handler
    this.config.onReport(report);

    // Send to analytics
    this.sendToAnalytics(report);
  }

  /**
   * Send metric to analytics
   */
  private sendToAnalytics(report: WebVitalsReport): void {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', report.name, {
        event_category: 'Web Vitals',
        event_label: report.id,
        value: Math.round(report.name === 'CLS' ? report.value * 1000 : report.value),
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: report.name,
          value: report.value,
          delta: report.delta,
          id: report.id,
          navigationType: report.navigationType,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
        keepalive: true, // Ensure it sends even if page is unloading
      }).catch(error => {
        console.warn('Failed to send Web Vitals to analytics:', error);
      });
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): Map<string, WebVitalsReport[]> {
    return new Map(this.metrics);
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): WebVitalsReport[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get latest metric by name
   */
  getLatestMetric(name: string): WebVitalsReport | null {
    const metrics = this.getMetricsByName(name);
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }

  /**
   * Get average metric value
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  /**
   * Check if metrics are within good thresholds
   */
  getPerformanceStatus(): {
    cls: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    lcp: 'good' | 'needs-improvement' | 'poor';
    fcp: 'good' | 'needs-improvement' | 'poor';
    ttfb: 'good' | 'needs-improvement' | 'poor';
  } {
    const latestCLS = this.getLatestMetric('CLS');
    const latestFID = this.getLatestMetric('FID');
    const latestLCP = this.getLatestMetric('LCP');
    const latestFCP = this.getLatestMetric('FCP');
    const latestTTFB = this.getLatestMetric('TTFB');

    return {
      cls: latestCLS ? this.getCLSStatus(latestCLS.value) : 'good',
      fid: latestFID ? this.getFIDStatus(latestFID.value) : 'good',
      lcp: latestLCP ? this.getLCPStatus(latestLCP.value) : 'good',
      fcp: latestFCP ? this.getFCPStatus(latestFCP.value) : 'good',
      ttfb: latestTTFB ? this.getTTFBStatus(latestTTFB.value) : 'good',
    };
  }

  /**
   * Get CLS performance status
   */
  private getCLSStatus(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get FID performance status
   */
  private getFIDStatus(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get LCP performance status
   */
  private getLCPStatus(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get FCP performance status
   */
  private getFCPStatus(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get TTFB performance status
   */
  private getTTFBStatus(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    overall: 'good' | 'needs-improvement' | 'poor';
    metrics: ReturnType<WebVitalsMonitor['getPerformanceStatus']>;
    scores: {
      cls: number;
      fid: number;
      lcp: number;
      fcp: number;
      ttfb: number;
    };
  } {
    const status = this.getPerformanceStatus();
    const scores = {
      cls: this.getMetricScore('CLS'),
      fid: this.getMetricScore('FID'),
      lcp: this.getMetricScore('LCP'),
      fcp: this.getMetricScore('FCP'),
      ttfb: this.getMetricScore('TTFB'),
    };

    const averageScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    return {
      overall: averageScore >= 90 ? 'good' : averageScore >= 50 ? 'needs-improvement' : 'poor',
      metrics: status,
      scores,
    };
  }

  /**
   * Get metric score (0-100)
   */
  private getMetricScore(name: string): number {
    const latest = this.getLatestMetric(name);
    if (!latest) return 100;

    switch (name) {
      case 'CLS':
        return latest.value <= 0.1 ? 100 : latest.value <= 0.25 ? 75 : 50;
      case 'FID':
        return latest.value <= 100 ? 100 : latest.value <= 300 ? 75 : 50;
      case 'LCP':
        return latest.value <= 2500 ? 100 : latest.value <= 4000 ? 75 : 50;
      case 'FCP':
        return latest.value <= 1800 ? 100 : latest.value <= 3000 ? 75 : 50;
      case 'TTFB':
        return latest.value <= 800 ? 100 : latest.value <= 1800 ? 75 : 50;
      default:
        return 100;
    }
  }

  /**
   * Initialize metrics storage
   */
  private initializeMetrics(): void {
    const metrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'];
    metrics.forEach(metric => {
      this.metrics.set(metric, []);
    });
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.initializeMetrics();
  }

  /**
   * Export metrics data
   */
  exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      summary: this.getPerformanceSummary(),
    };
    return JSON.stringify(data, null, 2);
  }
}

// Create default instance
export const webVitalsMonitor = new WebVitalsMonitor({
  onReport: (metric) => {
    console.log('Web Vital:', metric);
  },
});

// Export types
export type { WebVitalsReport, WebVitalsConfig };

export default WebVitalsMonitor;