import ReactGA from 'react-ga4';
import * as Sentry from '@sentry/react';

// Google Analytics Configuration
export const initializeGoogleAnalytics = (measurementId: string) => {
  if (measurementId) {
    ReactGA.initialize(measurementId);
    console.log('✅ Google Analytics initialized');
  } else {
    console.log('⚠️  Google Analytics measurement ID not provided');
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Sentry Configuration
export const initializeSentry = (dsn: string, environment: string) => {
  if (dsn) {
    Sentry.init({
      dsn,
      environment,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      // Session Replay
      replaysSessionSampleRate: environment === 'production' ? 0.1 : 0.5,
      replaysOnErrorSampleRate: environment === 'production' ? 1.0 : 1.0,
      // Error filtering
      beforeSend(event) {
        // Filter out specific errors or add context
        if (event.exception) {
          const error = event.exception.values?.[0];
          // Ignore specific error types if needed
          if (error?.type === 'ChunkLoadError') {
            return null; // Don't send chunk load errors to Sentry
          }
        }
        return event;
      },
    });
    console.log('✅ Sentry initialized');
  } else {
    console.log('⚠️  Sentry DSN not provided, error monitoring disabled');
  }
};

// Analytics helper functions
export const trackUserRegistration = (userId: string, email: string, tier: string) => {
  trackEvent('User', 'Registration', tier);
  ReactGA.gtag('config', 'G-XXXXXXXXXX', {
    user_id: userId,
    custom_map: {
      dimension1: 'subscription_tier',
    },
  });
  ReactGA.gtag('event', 'sign_up', {
    method: 'email',
    subscription_tier: tier,
  });
};

export const trackUserLogin = (userId: string, tier: string) => {
  trackEvent('User', 'Login', tier);
  ReactGA.gtag('event', 'login', {
    method: 'email',
    subscription_tier: tier,
  });
};

export const trackSubscriptionUpgrade = (userId: string, oldTier: string, newTier: string) => {
  trackEvent('Subscription', 'Upgrade', `${oldTier}_to_${newTier}`);
  ReactGA.gtag('event', 'purchase', {
    currency: 'GBP',
    value: getTierValue(newTier),
    items: [{
      item_id: newTier,
      item_name: `${newTier}_subscription`,
      item_category: 'subscription',
    }],
  });
};

export const trackExtensionInstall = () => {
  trackEvent('Extension', 'Install');
  ReactGA.gtag('event', 'extension_install');
};

export const trackNotificationSent = (type: 'email' | 'sms' | 'whatsapp', tier: string) => {
  trackEvent('Notification', 'Sent', `${type}_${tier}`);
};

export const trackTestCheck = (userId: string, tier: string, success: boolean) => {
  trackEvent('TestCheck', success ? 'Success' : 'Failed', tier);
};

// Helper function to get tier values for analytics
const getTierValue = (tier: string): number => {
  const values: Record<string, number> = {
    'free': 0,
    'one-off': 25,
    'starter': 25,
    'premium': 50,
    'professional': 80,
  };
  return values[tier] || 0;
};