import { trackUserAction, trackConversion, trackExtensionEvent, trackSubscriptionEvent, trackPerformance } from './logging';

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

// Conversion funnel stages
export enum ConversionFunnel {
  LANDING_PAGE = 'landing_page',
  AUTH_MODAL_OPEN = 'auth_modal_open',
  AUTH_SUCCESS = 'auth_success',
  SUBSCRIPTION_MODAL_OPEN = 'subscription_modal_open',
  SUBSCRIPTION_SUCCESS = 'subscription_success',
  EXTENSION_INSTALL_CLICK = 'extension_install_click',
  EXTENSION_INSTALL_SUCCESS = 'extension_install_success',
  FIRST_TEST_FOUND = 'first_test_found'
}

// User journey events
export enum UserJourneyEvent {
  PAGE_VIEW = 'page_view',
  SECTION_SCROLL = 'section_scroll',
  CTA_CLICK = 'cta_click',
  DEMO_PLAY = 'demo_play',
  FAQ_EXPAND = 'faq_expand',
  PRICING_VIEW = 'pricing_view',
  TESTIMONIAL_READ = 'testimonial_read'
}

// Extension events
export enum ExtensionEvent {
  INSTALLED = 'extension_installed',
  ENABLED = 'extension_enabled',
  DISABLED = 'extension_disabled',
  UPDATED = 'extension_updated',
  UNINSTALLED = 'extension_uninstalled',
  NOTIFICATION_CLICKED = 'notification_clicked',
  TEST_FOUND = 'test_found',
  BOOKING_ATTEMPT = 'booking_attempt',
  BOOKING_SUCCESS = 'booking_success'
}

// Subscription events
export enum SubscriptionEvent {
  PLAN_VIEWED = 'plan_viewed',
  PLAN_SELECTED = 'plan_selected',
  CHECKOUT_STARTED = 'checkout_started',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  SUBSCRIPTION_ACTIVATED = 'subscription_activated',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  TRIAL_STARTED = 'trial_started',
  TRIAL_ENDED = 'trial_ended'
}

// Performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 's' | 'percent' | 'count';
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled: boolean;
  private userId?: string;
  private sessionId: string;
  private pageLoadTime: number;

  constructor() {
    this.isEnabled = this.checkAnalyticsEnabled();
    this.userId = this.getUserId();
    this.sessionId = this.getSessionId();
    this.pageLoadTime = performance.now();

    this.initializeAnalytics();
  }

  private checkAnalyticsEnabled(): boolean {
    // Check if user has opted out
    const analyticsOptOut = localStorage.getItem('analytics_opt_out');
    if (analyticsOptOut === 'true') return false;

    // Check if we're in a development environment
    if (process.env.NODE_ENV === 'development') {
      return localStorage.getItem('enable_analytics_dev') === 'true';
    }

    return true;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('user_id') || undefined;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics(): void {
    if (!this.isEnabled) return;

    // Track page load performance
    this.trackPageLoadPerformance();

    // Track page view
    this.trackPageView();

    // Set up click tracking
    this.setupClickTracking();

    // Set up scroll tracking
    this.setupScrollTracking();

    // Track extension installation status
    this.trackExtensionStatus();
  }

  private trackPageLoadPerformance(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.pageLoadTime;
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigationTiming) {
        const metrics = {
          pageLoadTime: loadTime,
          domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
          firstPaint: navigationTiming.responseStart - navigationTiming.requestStart,
          dnsLookup: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
          tcpConnection: navigationTiming.connectEnd - navigationTiming.connectStart
        };

        Object.entries(metrics).forEach(([name, value]) => {
          if (value > 0) {
            this.trackPerformance(name, value, 'ms', { metric_type: 'page_load' });
          }
        });
      }
    });
  }

  private trackPageView(): void {
    const pageViewData = {
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.trackEvent('page_view', 'engagement', 'page_view', undefined, pageViewData);
  }

  private setupClickTracking(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const trackedElement = target.closest('[data-track]') as HTMLElement;

      if (trackedElement) {
        const trackData = trackedElement.dataset.track;
        if (trackData) {
          try {
            const data = JSON.parse(trackData);
            this.trackClick(data.category, data.action, data.label, data.value, data.metadata);
          } catch (error) {
            console.error('Invalid track data:', error);
          }
        }
      }
    });
  }

  private setupScrollTracking(): void {
    let scrollTimeout: NodeJS.Timeout;
    let maxScrollDepth = 0;
    let totalScrollTime = 0;
    let scrollStartTime = Date.now();
    let isScrolling = false;

    const trackScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        scrollStartTime = Date.now();
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isScrolling) {
          totalScrollTime += Date.now() - scrollStartTime;
          isScrolling = false;
        }

        const scrollDepth = Math.round(
          (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
        );

        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
        }

        // Track scroll depth milestones
        const milestones = [25, 50, 75, 90, 100];
        milestones.forEach(milestone => {
          if (scrollDepth >= milestone && maxScrollDepth === milestone) {
            this.trackEvent('scroll_depth', 'engagement', `scroll_${milestone}_percent`, milestone);
          }
        });
      }, 1000);
    };

    window.addEventListener('scroll', trackScroll, { passive: true });

    // Track scroll time on page unload
    window.addEventListener('beforeunload', () => {
      if (isScrolling) {
        totalScrollTime += Date.now() - scrollStartTime;
      }
      this.trackEvent('scroll_time', 'engagement', 'total_scroll_time', Math.round(totalScrollTime / 1000));
    });
  }

  private trackExtensionStatus(): void {
    // Check if extension is installed
    if (window.chrome && chrome.runtime) {
      chrome.runtime.sendMessage('testnotifier-extension-id', { action: 'ping' }, (response) => {
        if (response && response.success) {
          this.trackExtensionEvent(ExtensionEvent.ENABLED, { detected: true });
        } else {
          this.trackExtensionEvent(ExtensionEvent.DISABLED, { detected: false });
        }
      });
    } else {
      this.trackExtensionEvent(ExtensionEvent.DISABLED, { detected: false, reason: 'chrome_not_available' });
    }
  }

  public trackEvent(
    eventName: string,
    category: string,
    action: string,
    label?: string,
    customParameters?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      category,
      action,
      label,
      customParameters
    };

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        custom_parameters: customParameters
      });
    }

    // Log to our logging service
    trackUserAction(`${category}:${action}`, {
      eventName,
      label,
      ...customParameters,
      userId: this.userId,
      sessionId: this.sessionId
    });

    // Send to custom analytics endpoint
    this.sendToAnalyticsEndpoint(event);
  }

  public trackConversionFunnel(stage: ConversionFunnel, metadata?: Record<string, any>): void {
    this.trackEvent('conversion_funnel', 'conversion', stage, undefined, {
      stage,
      ...metadata
    });

    trackConversion(`funnel_${stage}`, undefined, {
      stage,
      ...metadata
    });
  }

  public trackUserJourney(event: UserJourneyEvent, metadata?: Record<string, any>): void {
    this.trackEvent('user_journey', 'engagement', event, undefined, {
      event,
      ...metadata
    });
  }

  public trackExtensionEvent(event: ExtensionEvent, metadata?: Record<string, any>): void {
    trackExtensionEvent(event, {
      ...metadata,
      userId: this.userId,
      sessionId: this.sessionId
    });
  }

  public trackSubscriptionEvent(event: SubscriptionEvent, plan?: string, metadata?: Record<string, any>): void {
    trackSubscriptionEvent(event, plan, {
      ...metadata,
      userId: this.userId,
      sessionId: this.sessionId
    });
  }

  public trackPerformance(name: string, value: number, unit: 'ms' | 's' | 'percent' | 'count', metadata?: Record<string, any>): void {
    trackPerformance(name, value, unit, {
      ...metadata,
      userId: this.userId,
      sessionId: this.sessionId
    });
  }

  public trackClick(category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>): void {
    this.trackEvent('click', category, action, label, {
      element: metadata?.element || 'unknown',
      ...metadata
    });
  }

  public trackFormInteraction(formName: string, action: string, fieldName?: string, metadata?: Record<string, any>): void {
    this.trackEvent('form_interaction', 'engagement', `${formName}_${action}`, fieldName, {
      formName,
      action,
      fieldName,
      ...metadata
    });
  }

  public trackError(error: Error, context?: string, metadata?: Record<string, any>): void {
    this.trackEvent('javascript_error', 'error', error.name, context, {
      message: error.message,
      stack: error.stack,
      context,
      ...metadata
    });
  }

  private async sendToAnalyticsEndpoint(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          event,
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }
  }

  public clearUserId(): void {
    this.userId = undefined;
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: null
      });
    }
  }

  public optOut(): void {
    this.isEnabled = false;
    localStorage.setItem('analytics_opt_out', 'true');
  }

  public optIn(): void {
    this.isEnabled = true;
    localStorage.removeItem('analytics_opt_out');
  }

  public isOptedOut(): boolean {
    return !this.isEnabled;
  }
}

// Create and export the analytics service instance
export const analytics = new AnalyticsService();

// Export convenience functions
export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackConversionFunnel = analytics.trackConversionFunnel.bind(analytics);
export const trackUserJourney = analytics.trackUserJourney.bind(analytics);
export const trackExtensionEvent = analytics.trackExtensionEvent.bind(analytics);
export const trackSubscriptionEvent = analytics.trackSubscriptionEvent.bind(analytics);
export const trackPerformance = analytics.trackPerformance.bind(analytics);
export const trackClick = analytics.trackClick.bind(analytics);
export const trackFormInteraction = analytics.trackFormInteraction.bind(analytics);
export const trackError = analytics.trackError.bind(analytics);

// Add global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    analytics.trackError(event.error, 'global_error', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), 'unhandled_promise_rejection');
  });
}

export default analytics;