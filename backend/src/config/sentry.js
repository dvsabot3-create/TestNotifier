const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

const initializeSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        // HTTP integration for tracing HTTP requests
        Sentry.httpIntegration(),
        // Express integration for Express apps
        Sentry.expressIntegration(),
        // MongoDB integration for database tracing
        Sentry.mongoIntegration(),
        // Profiling integration
        nodeProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Profiling
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Error filtering
      beforeSend(event) {
        // Filter out specific errors or add context
        if (event.exception) {
          const error = event.exception.values[0];
          // Ignore specific error types if needed
          if (error.type === 'ValidationError') {
            return null; // Don't send validation errors to Sentry
          }
        }
        return event;
      },
    });

    console.log('✅ Sentry initialized successfully');
  } else {
    console.log('⚠️  Sentry DSN not provided, error monitoring disabled');
  }
};

module.exports = { initializeSentry, Sentry };