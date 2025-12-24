import { trackApiCall } from './analytics';
import { logError, logInfo } from './logging';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  || (import.meta.env.PROD ? 'https://testnotifier.co.uk/api' : 'http://localhost:3001');

const API_TIMEOUT = 30000; // 30 seconds

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  subscription?: Subscription;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'instructor';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: 'free' | 'premium' | 'pro';
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  features: string[];
  limits: {
    maxCenters: number;
    maxUsers: number;
    checkInterval: number;
  };
}

export interface TestCenter {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface AutomationConfig {
  startDate: string;
  endDate: string;
  centers: string[];
  userId: string;
  rapidMode: boolean;
  delay: number;
  maxRetries: number;
  retryDelay: number;
}

export interface AutomationStatus {
  status: 'stopped' | 'running' | 'paused';
  startTime?: string;
  currentUser?: User;
  config: AutomationConfig;
  stats: {
    totalChecks: number;
    successfulChanges: number;
    clickCount: number;
    successRate: number;
  };
}

// API Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timed out') {
    super(message, 408, 'TIMEOUT_ERROR');
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private csrfToken: string | null = null;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Version': '1.0.0',
      'X-Platform': 'web'
    };
    
    // Fetch CSRF token on initialization
    this.fetchCsrfToken();
  }

  /**
   * Fetch CSRF token from server
   */
  private async fetchCsrfToken(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/auth/csrf`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const csrfToken = response.headers.get('X-CSRF-Token');
      if (csrfToken) {
        this.csrfToken = csrfToken;
      }
    } catch (error) {
      logError('api', 'Failed to fetch CSRF token', error);
    }
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers: Record<string, string> = {},
    timeoutOverride?: number
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && this.csrfToken) {
      requestHeaders['X-CSRF-Token'] = this.csrfToken;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include', // Include cookies for CSRF
      signal: AbortSignal.timeout(timeoutOverride || this.timeout)
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      logInfo('api', `Making ${method} request to ${endpoint}`);

      const response = await fetch(url, requestOptions);
      const duration = Date.now() - startTime;

      // Update CSRF token if server sends a new one
      const newCsrfToken = response.headers.get('X-CSRF-Token');
      if (newCsrfToken) {
        this.csrfToken = newCsrfToken;
      }

      // Track API call for analytics
      trackApiCall(endpoint, method, response.status, duration);

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { message: response.statusText };
      }

      if (!response.ok) {
        throw this.createApiError(response.status, responseData);
      }

      logInfo('api', `Request successful: ${endpoint}`, { status: response.status });

      return {
        success: true,
        data: responseData,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const duration = Date.now() - startTime;

      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        logError('api', `Request timeout: ${endpoint}`, { duration });
        throw new TimeoutError();
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        logError('api', `Network error: ${endpoint}`, { error: error.message });
        throw new NetworkError();
      }

      if (error instanceof ApiError) {
        throw error;
      }

      logError('api', `Request failed: ${endpoint}`, { error: error.message });
      throw new ApiError('Request failed', 500);
    }
  }

  /**
   * Create appropriate API error based on status code
   */
  private createApiError(status: number, responseData: any): ApiError {
    const message = responseData.message || responseData.error || 'Request failed';
    const errorCode = responseData.code;

    switch (status) {
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new ApiError(message, status, 'FORBIDDEN');
      case 404:
        return new ApiError(message, status, 'NOT_FOUND');
      case 409:
        return new ApiError(message, status, 'CONFLICT');
      case 422:
        return new ApiError(message, status, 'VALIDATION_ERROR');
      case 429:
        return new RateLimitError(message);
      case 500:
        return new ApiError(message, status, 'SERVER_ERROR');
      case 502:
      case 503:
      case 504:
        return new ApiError(message, status, 'SERVICE_UNAVAILABLE');
      default:
        return new ApiError(message, status, errorCode);
    }
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Remove authentication token (logout)
   */
  private clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Authentication Endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('POST', '/auth/login', { email, password });
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('POST', '/auth/register', { name, email, password });
  }

  async googleLogin(idToken: string): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('POST', '/auth/google', { idToken });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new AuthenticationError('No refresh token available');
    }

    return this.makeRequest<{ token: string }>('POST', '/auth/refresh', { refreshToken });
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await this.makeRequest<null>('POST', '/auth/logout');
      this.clearAuthToken();
      return response;
    } catch (error) {
      this.clearAuthToken(); // Clear token even if logout fails
      throw error;
    }
  }

  // User Management Endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('GET', '/users/me');
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('PATCH', '/users/me', data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('POST', '/users/change-password', {
      currentPassword,
      newPassword
    });
  }

  async deleteAccount(): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('DELETE', '/users/me');
  }

  // Subscription Management Endpoints
  async getSubscription(): Promise<ApiResponse<Subscription>> {
    return this.makeRequest<Subscription>('GET', '/subscription');
  }

  async getSubscriptionPlans(): Promise<ApiResponse<Subscription[]>> {
    return this.makeRequest<Subscription[]>('GET', '/subscription/plans');
  }

  async createCheckoutSession(planId: string, interval: 'month' | 'year'): Promise<ApiResponse<{ sessionId: string; url: string }>> {
    return this.makeRequest<{ sessionId: string; url: string }>('POST', '/subscription/checkout', {
      planId,
      interval
    });
  }

  async activateFreePlan(): Promise<ApiResponse<Subscription>> {
    return this.makeRequest<Subscription>('POST', '/subscription/free');
  }

  async cancelSubscription(): Promise<ApiResponse<Subscription>> {
    return this.makeRequest<Subscription>('POST', '/subscription/cancel');
  }

  async updateSubscriptionPlan(newPlanId: string): Promise<ApiResponse<Subscription>> {
    return this.makeRequest<Subscription>('PATCH', '/subscription/plan', {
      planId: newPlanId
    });
  }

  // Test Centers Endpoints
  async getTestCenters(): Promise<ApiResponse<TestCenter[]>> {
    return this.makeRequest<TestCenter[]>('GET', '/centers');
  }

  async searchTestCenters(query: string): Promise<ApiResponse<TestCenter[]>> {
    return this.makeRequest<TestCenter[]>('GET', `/centers/search?q=${encodeURIComponent(query)}`);
  }

  async getTestCenterById(centerId: string): Promise<ApiResponse<TestCenter>> {
    return this.makeRequest<TestCenter>('GET', `/centers/${centerId}`);
  }

  // Automation Endpoints
  async getAutomationStatus(): Promise<ApiResponse<AutomationStatus>> {
    return this.makeRequest<AutomationStatus>('GET', '/automation/status');
  }

  async startAutomation(config: AutomationConfig): Promise<ApiResponse<{ sessionId: string }>> {
    return this.makeRequest<{ sessionId: string }>('POST', '/automation/start', config);
  }

  async stopAutomation(): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('POST', '/automation/stop');
  }

  async updateAutomationConfig(config: Partial<AutomationConfig>): Promise<ApiResponse<AutomationConfig>> {
    return this.makeRequest<AutomationConfig>('PATCH', '/automation/config', config);
  }

  async getAutomationHistory(limit: number = 50): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('GET', `/automation/history?limit=${limit}`);
  }

  // Analytics Endpoints
  async trackEvent(event: string, data: Record<string, any>): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('POST', '/analytics/events', {
      event,
      data,
      timestamp: new Date().toISOString()
    });
  }

  async getAnalyticsSummary(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return this.makeRequest<any>('GET', `/analytics/summary?${params.toString()}`);
  }

  // Support Endpoints
  async createSupportTicket(subject: string, message: string, priority: 'low' | 'medium' | 'high'): Promise<ApiResponse<{ ticketId: string }>> {
    return this.makeRequest<{ ticketId: string }>('POST', '/support/tickets', {
      subject,
      message,
      priority
    });
  }

  async getSupportTickets(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('GET', '/support/tickets');
  }

  // Logging Endpoints
  async submitLogs(logs: any[]): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('POST', '/logs', { logs });
  }

  // Extension Download
  async getExtensionDownloadUrl(): Promise<ApiResponse<{ url: string }>> {
    return this.makeRequest<{ url: string }>('GET', '/extension/download');
  }

  async getExtensionManifest(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('GET', '/extension/manifest');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export convenience functions for common operations
export const authAPI = {
  login: apiClient.login.bind(apiClient),
  register: apiClient.register.bind(apiClient),
  googleLogin: apiClient.googleLogin.bind(apiClient),
  refreshToken: apiClient.refreshToken.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
  getCurrentUser: apiClient.getCurrentUser.bind(apiClient),
  updateProfile: apiClient.updateUserProfile.bind(apiClient),
  changePassword: apiClient.changePassword.bind(apiClient),
  deleteAccount: apiClient.deleteAccount.bind(apiClient)
};

export const subscriptionAPI = {
  getSubscription: apiClient.getSubscription.bind(apiClient),
  getPlans: apiClient.getSubscriptionPlans.bind(apiClient),
  createCheckoutSession: apiClient.createCheckoutSession.bind(apiClient),
  activateFreePlan: apiClient.activateFreePlan.bind(apiClient),
  cancelSubscription: apiClient.cancelSubscription.bind(apiClient),
  updatePlan: apiClient.updateSubscriptionPlan.bind(apiClient)
};

export const centersAPI = {
  getAll: apiClient.getTestCenters.bind(apiClient),
  search: apiClient.searchTestCenters.bind(apiClient),
  getById: apiClient.getTestCenterById.bind(apiClient)
};

export const automationAPI = {
  getStatus: apiClient.getAutomationStatus.bind(apiClient),
  start: apiClient.startAutomation.bind(apiClient),
  stop: apiClient.stopAutomation.bind(apiClient),
  updateConfig: apiClient.updateAutomationConfig.bind(apiClient),
  getHistory: apiClient.getAutomationHistory.bind(apiClient)
};

export const analyticsAPI = {
  trackEvent: apiClient.trackEvent.bind(apiClient),
  getSummary: apiClient.getAnalyticsSummary.bind(apiClient)
};

export const supportAPI = {
  createTicket: apiClient.createSupportTicket.bind(apiClient),
  getTickets: apiClient.getSupportTickets.bind(apiClient)
};

export const loggingAPI = {
  submitLogs: apiClient.submitLogs.bind(apiClient)
};

export const extensionAPI = {
  getDownloadUrl: apiClient.getExtensionDownloadUrl.bind(apiClient),
  getManifest: apiClient.getExtensionManifest.bind(apiClient)
};

export default apiClient;