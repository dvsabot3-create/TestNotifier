/**
 * Secure Configuration Loader
 * Handles sensitive environment variables with proper validation
 */

const crypto = require('crypto');

class SecureConfig {
  constructor() {
    this.validateEnvironment();
  }

  /**
   * Validate that all required environment variables are set
   */
  validateEnvironment() {
    const requiredVars = [
      'POSTGRES_DB',
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'EMAIL_SMTP_PASS'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Validate JWT secrets are strong enough
    if (process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    if (process.env.JWT_REFRESH_SECRET.length < 32) {
      throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
    }
  }

  /**
   * Get database configuration
   */
  getDatabaseConfig() {
    return {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  /**
   * Get JWT configuration
   */
  getJwtConfig() {
    return {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
  }

  /**
   * Get Stripe configuration
   */
  getStripeConfig() {
    return {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    };
  }

  /**
   * Get email configuration
   */
  getEmailConfig() {
    return {
      host: process.env.EMAIL_SMTP_HOST,
      port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
    };
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash sensitive data for logging (keep first/last few chars)
   */
  hashForLogging(data, visibleChars = 4) {
    if (!data || data.length <= visibleChars * 2) {
      return '***';
    }
    return data.substring(0, visibleChars) + '***' + data.substring(data.length - visibleChars);
  }
}

module.exports = SecureConfig;