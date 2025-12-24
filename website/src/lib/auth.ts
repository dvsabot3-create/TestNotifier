import axios from 'axios';
import { trackUserRegistration, trackUserLogin } from '../config/monitoring';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (import.meta.env.PROD ? 'https://testnotifier.co.uk/api' : 'http://localhost:5001/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  subscription: {
    tier: 'free' | 'one-off' | 'starter' | 'premium' | 'professional';
    status: 'active' | 'cancelled' | 'expired' | 'past_due';
  };
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dataProcessingConsent: boolean;
  marketingConsent?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Auth service
class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.loadAuthData();
  }

  private loadAuthData() {
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.clearAuthData();
      }
    }
  }

  private saveAuthData(token: string, user: User) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data.data;
      this.saveAuthData(token, user);

      // Track successful login
      trackUserLogin(user.id, user.subscription.tier);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      this.saveAuthData(token, user);

      // Track successful registration
      trackUserRegistration(user.id, user.email, user.subscription.tier);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    this.clearAuthData();
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      this.clearAuthData();
      throw this.handleError(error);
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      const user = response.data.data.user;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.put(`/auth/reset-password/${token}`, { password: newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      await api.post('/auth/resend-verification');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await api.get(`/auth/verify-email/${token}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  hasSubscription(): boolean {
    return this.user?.subscription?.status === 'active' && this.user?.subscription?.tier !== 'free';
  }

  getSubscriptionTier(): string {
    return this.user?.subscription?.tier || 'free';
  }

  canAccessFeature(requiredTier: string): boolean {
    const tierHierarchy = {
      'free': 0,
      'one-off': 1,
      'starter': 2,
      'premium': 3,
      'professional': 4
    };

    const userTierLevel = tierHierarchy[this.getSubscriptionTier()] || 0;
    const requiredTierLevel = tierHierarchy[requiredTier] || 0;

    return userTierLevel >= requiredTierLevel;
  }

  isEmailVerified(): boolean {
    return this.user?.isEmailVerified || false;
  }

  private handleError(error: any): Error {
    if (error.response?.data) {
      const { message, errors } = error.response.data;
      if (errors) {
        const errorMessages = errors.map((err: any) => err.msg || err.message).join(', ');
        return new Error(errorMessages || message || 'Validation error');
      }
      return new Error(message || 'Request failed');
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('An unexpected error occurred');
  }
}

// Create and export auth instance
export const auth = new AuthService();

// Export API instance for direct use
export { api };

// React Hook for authentication
export const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(auth.getUser());
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (auth.isAuthenticated() && !user) {
      auth.getCurrentUser().then(setUser).catch(console.error);
    }
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auth.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await auth.register(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: auth.isAuthenticated(),
    hasSubscription: auth.hasSubscription(),
    getSubscriptionTier: auth.getSubscriptionTier(),
    canAccessFeature: auth.canAccessFeature.bind(auth),
    isEmailVerified: auth.isEmailVerified()
  };
};

// Context for authentication
import React from 'react';

export const AuthContext = React.createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authValue = useAuth();
  return React.createElement(AuthContext.Provider, { value: authValue }, children);
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};