# Monitoring & Analytics Setup Guide

This guide covers the complete monitoring and analytics configuration for the TestNotifier project.

## 🚀 Overview

The project includes comprehensive monitoring with:
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior and conversion tracking
- **Custom Analytics**: Business-specific event tracking

## 📊 Backend Monitoring (Sentry)

### Configuration
- **File**: `src/config/sentry.js`
- **Integration**: Automatic error capture, performance tracing, MongoDB query tracing
- **Environment**: Separate DSN for development/production

### Features
- ✅ Automatic error capture
- ✅ Performance monitoring with traces
- ✅ MongoDB operation tracing
- ✅ Request/response tracking
- ✅ Error filtering (excludes validation errors)
- ✅ Profiling for performance bottlenecks

### Environment Variables
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Usage
```javascript
// Manual error capture
const { Sentry } = require('./config/sentry');
Sentry.captureException(error);

// Set custom context
Sentry.configureScope(scope => {
  scope.setTag('user_tier', 'professional');
  scope.setUser({ id: userId, email: userEmail });
});
```

## 📈 Frontend Monitoring

### Google Analytics 4
- **File**: `src/config/monitoring.ts`
- **Package**: `react-ga4`
- **Features**: Page views, custom events, ecommerce tracking

### Sentry React Integration
- **Package**: `@sentry/react`
- **Features**: Error boundaries, session replay, performance tracing

### Key Tracking Events

#### User Registration
```typescript
trackUserRegistration(userId, email, subscriptionTier);
```

#### User Login
```typescript
trackUserLogin(userId, subscriptionTier);
```

#### Subscription Upgrade
```typescript
trackSubscriptionUpgrade(userId, oldTier, newTier);
```

#### Extension Install
```typescript
trackExtensionInstall();
```

#### Notification Sent
```typescript
trackNotificationSent('email' | 'sms' | 'whatsapp', tier);
```

#### Test Check Performance
```typescript
trackTestCheck(userId, tier, success);
```

## 🔧 Environment Configuration

### Backend (.env)
```bash
# Sentry Configuration
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Google Analytics (for server-side if needed)
GOOGLE_ANALYTICS_ID=GA-your-google-analytics-id
```

### Frontend (.env.local)
```bash
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry DSN
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## 📋 Setup Instructions

### 1. Google Analytics Setup

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property for your website
   - Get your Measurement ID (G-XXXXXXXXXX)

2. **Configure Events**:
   - Set up custom events for user actions
   - Configure conversion tracking for subscriptions
   - Set up ecommerce tracking for payments

3. **Add to Environment**:
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 2. Sentry Setup

1. **Create Sentry Project**:
   - Go to [Sentry](https://sentry.io/)
   - Create projects for frontend and backend
   - Get your DSN URLs

2. **Configure Alerts**:
   - Set up error rate alerts
   - Configure performance degradation alerts
   - Set up Slack/email notifications

3. **Add to Environment**:
   ```bash
   SENTRY_DSN=https://your-key@sentry.io/project-id
   VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
   ```

### 3. Test the Setup

#### Backend Test
```bash
cd backend
npm test tests/auth.test.js -- --testNamePattern="should return health status"
```

#### Frontend Test
```bash
cd website
npm run build
npm run preview
```

## 📊 Monitoring Dashboard

### Key Metrics to Track

1. **User Acquisition**
   - Registration conversion rate
   - Traffic sources
   - Campaign effectiveness

2. **User Engagement**
   - Extension install rate
   - Feature usage
   - Session duration

3. **Error Monitoring**
   - Error rate by tier
   - Performance metrics
   - User impact analysis

4. **Business Metrics**
   - Subscription conversion rate
   - Churn rate
   - Revenue per user

### Custom Events

The system automatically tracks:
- ✅ User registrations with tier information
- ✅ User logins with subscription details
- ✅ Page views and navigation
- ✅ Extension installations
- ✅ Test check successes/failures
- ✅ Notification deliveries by type
- ✅ Subscription upgrades

## 🚨 Alerting Setup

### Sentry Alerts
Configure alerts for:
- Error rate > 1% of requests
- Response time > 2 seconds
- Database query failures
- Authentication failures > 10/hour

### Google Analytics Alerts
Set up alerts for:
- Sudden traffic drops
- Conversion rate changes
- Bounce rate increases

## 🔍 Debugging

### Common Issues

1. **Sentry Not Capturing Errors**
   - Verify DSN is correct
   - Check environment variables
   - Ensure middleware order is correct

2. **Google Analytics Not Tracking**
   - Verify Measurement ID
   - Check ad blockers
   - Ensure initialization on page load

3. **Missing Custom Events**
   - Verify event names match GA4 configuration
   - Check console for tracking errors
   - Test events in GA4 debug mode

### Debug Mode

Enable debug mode for development:
```typescript
// In monitoring.ts
initializeSentry(dsn, 'development', { debug: true });
initializeGoogleAnalytics(measurementId, { debug_mode: true });
```

## 📚 Additional Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/)
- [React GA4 Package](https://github.com/PriceRunner/react-ga4)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)

## ✅ Verification Checklist

- [ ] Google Analytics Measurement ID configured
- [ ] Sentry DSN configured for both frontend and backend
- [ ] Environment variables set correctly
- [ ] Frontend builds successfully with monitoring
- [ ] Backend tests pass with Sentry integration
- [ ] Custom events fire correctly
- [ ] Error boundaries catch and report errors
- [ ] Page view tracking works on route changes
- [ ] User action tracking works (login, registration, etc.)
- [ ] Sentry captures and reports errors
- [ ] Performance monitoring active

## 🎯 Next Steps

1. **Production Deployment**: Update DSNs and Measurement IDs for production
2. **Custom Dashboards**: Create custom dashboards in Sentry and GA4
3. **A/B Testing**: Set up experiments for conversion optimization
4. **User Feedback**: Integrate user feedback collection
5. **Performance Budgets**: Set performance budgets and alerts