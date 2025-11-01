import { v4 as uuidv4 } from 'uuid';

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// Log categories
export enum LogCategory {
  USER_ACTIVITY = 'user_activity',
  SYSTEM = 'system',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  CONVERSION = 'conversion',
  EXTENSION = 'extension',
  API = 'api',
  SUBSCRIPTION = 'subscription'
}

// Log interface
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
  userAgent: string;
  url: string;
  ipAddress?: string;
}

// Configuration
interface LoggingConfig {
  apiEndpoint: string;
  enableConsole: boolean;
  enableRemote: boolean;
  minLevel: LogLevel;
  sessionTimeout: number; // milliseconds
}

class LoggingService {
  private config: LoggingConfig;
  private sessionId: string;
  private userId?: string;
  private logQueue: LogEntry[] = [];
  private isFlushing = false;
  private flushInterval: number;

  constructor(config: LoggingConfig) {
    this.config = config;
    this.sessionId = this.getOrCreateSessionId();
    this.userId = this.getUserId();
    this.flushInterval = window.setInterval(() => this.flushLogs(), 30000); // Flush every 30 seconds

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.flushLogs(true); // Force flush on page unload
    });
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('session_id', sessionId);
      sessionStorage.setItem('session_start', new Date().toISOString());
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('user_id') || undefined;
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      userId: this.userId,
      sessionId: this.sessionId,
      metadata,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ipAddress: undefined // Will be added server-side for security
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.minLevel;
  }

  private async flushLogs(force = false): Promise<void> {
    if (this.logQueue.length === 0 || (this.isFlushing && !force)) return;

    this.isFlushing = true;
    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    if (this.config.enableConsole) {
      logsToSend.forEach(log => {
        this.consoleLog(log);
      });
    }

    if (this.config.enableRemote) {
      try {
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({ logs: logsToSend })
        });

        if (!response.ok) {
          console.error('Failed to send logs to server');
          // Re-add logs to queue for retry
          this.logQueue.unshift(...logsToSend);
        }
      } catch (error) {
        console.error('Error sending logs:', error);
        // Re-add logs to queue for retry
        this.logQueue.unshift(...logsToSend);
      }
    }

    this.isFlushing = false;
  }

  private consoleLog(log: LogEntry): void {
    const logMessage = `[${log.category}] ${log.message}`;
    const logData = {
      id: log.id,
      timestamp: log.timestamp,
      userId: log.userId,
      sessionId: log.sessionId,
      metadata: log.metadata
    };

    switch (log.level) {
      case LogLevel.ERROR:
        console.error(logMessage, logData);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, logData);
        break;
      case LogLevel.INFO:
        console.info(logMessage, logData);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, logData);
        break;
    }
  }

  public log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.createLogEntry(level, category, message, metadata);
    this.logQueue.push(logEntry);

    // Immediate flush for errors
    if (level === LogLevel.ERROR) {
      this.flushLogs();
    }
  }

  public error(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, category, message, metadata);
  }

  public warn(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, category, message, metadata);
  }

  public info(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, category, message, metadata);
  }

  public debug(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, category, message, metadata);
  }

  // Specific logging methods for common scenarios
  public trackUserAction(action: string, metadata?: Record<string, any>): void {
    this.info(LogCategory.USER_ACTIVITY, `User action: ${action}`, {
      action,
      ...metadata
    });
  }

  public trackConversion(event: string, value?: number, metadata?: Record<string, any>): void {
    this.info(LogCategory.CONVERSION, `Conversion: ${event}`, {
      event,
      value,
      ...metadata
    });
  }

  public trackExtensionEvent(event: string, metadata?: Record<string, any>): void {
    this.info(LogCategory.EXTENSION, `Extension event: ${event}`, {
      event,
      ...metadata
    });
  }

  public trackApiCall(endpoint: string, method: string, status: number, duration?: number): void {
    this.info(LogCategory.API, `API call: ${method} ${endpoint}`, {
      endpoint,
      method,
      status,
      duration,
      success: status >= 200 && status < 300
    });
  }

  public trackSubscriptionEvent(event: string, plan?: string, metadata?: Record<string, any>): void {
    this.info(LogCategory.SUBSCRIPTION, `Subscription event: ${event}`, {
      event,
      plan,
      ...metadata
    });
  }

  public trackSecurityEvent(event: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, any>): void {
    const level = severity === 'high' ? LogLevel.ERROR : severity === 'medium' ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, LogCategory.SECURITY, `Security event: ${event}`, {
      event,
      severity,
      ...metadata
    });
  }

  public trackPerformance(metric: string, value: number, unit: string, metadata?: Record<string, any>): void {
    this.info(LogCategory.PERFORMANCE, `Performance metric: ${metric}`, {
      metric,
      value,
      unit,
      ...metadata
    });
  }

  public updateUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('user_id', userId);
    this.info(LogCategory.SYSTEM, 'User ID updated', { userId });
  }

  public clearUserId(): void {
    this.userId = undefined;
    localStorage.removeItem('user_id');
    this.info(LogCategory.SYSTEM, 'User ID cleared');
  }

  public destroy(): void {
    this.flushLogs(true); // Force flush all remaining logs
    clearInterval(this.flushInterval);
    window.removeEventListener('beforeunload', this.flushLogs as any);
  }
}

// Create and export the logging service instance
export const logger = new LoggingService({
  apiEndpoint: '/api/logs',
  enableConsole: process.env.NODE_ENV === 'development',
  enableRemote: true,
  minLevel: LogLevel.INFO,
  sessionTimeout: 30 * 60 * 1000 // 30 minutes
});

// Export convenience functions
export const logError = (category: LogCategory, message: string, metadata?: Record<string, any>) =>
  logger.error(category, message, metadata);

export const logWarn = (category: LogCategory, message: string, metadata?: Record<string, any>) =>
  logger.warn(category, message, metadata);

export const logInfo = (category: LogCategory, message: string, metadata?: Record<string, any>) =>
  logger.info(category, message, metadata);

export const logDebug = (category: LogCategory, message: string, metadata?: Record<string, any>) =>
  logger.debug(category, message, metadata);

export const trackUserAction = (action: string, metadata?: Record<string, any>) =>
  logger.trackUserAction(action, metadata);

export const trackConversion = (event: string, value?: number, metadata?: Record<string, any>) =>
  logger.trackConversion(event, value, metadata);

export const trackExtensionEvent = (event: string, metadata?: Record<string, any>) =>
  logger.trackExtensionEvent(event, metadata);

export const trackApiCall = (endpoint: string, method: string, status: number, duration?: number) =>
  logger.trackApiCall(endpoint, method, status, duration);

export const trackSubscriptionEvent = (event: string, plan?: string, metadata?: Record<string, any>) =>
  logger.trackSubscriptionEvent(event, plan, metadata);

export const trackSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, any>) =>
  logger.trackSecurityEvent(event, severity, metadata);

export const trackPerformance = (metric: string, value: number, unit: string, metadata?: Record<string, any>) =>
  logger.trackPerformance(metric, value, unit, metadata);

export default logger;