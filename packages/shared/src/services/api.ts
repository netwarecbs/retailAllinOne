import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse } from '../types/auth';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ecs-netware-view-lb-949622788.ap-south-1.elb.amazonaws.com';

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
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
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearTokens();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private setTokens(tokens: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      localStorage.setItem('id_token', tokens.idToken);
      localStorage.setItem('token_expires_at', (Date.now() + tokens.expiresIn * 1000).toString());
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('token_expires_at');
      // Keep old token key for backward compatibility
      localStorage.removeItem('auth_token');
    }
  }

  private getToken(): string | null {
    // For backward compatibility, try both new and old token keys
    return this.getAccessToken() || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Try real API call first
      const response: AxiosResponse<LoginResponse> = await this.api.post('/v1/auth/login', credentials);

      // Check if the response matches the expected format
      if (response.data.status === 'success' && response.data.tokens && response.data.user) {
        // Store all tokens in localStorage
        this.setTokens(response.data.tokens);

        // Also store user and branches data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
          localStorage.setItem('branches_data', JSON.stringify(response.data.branches));
        }

        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Login API error:', error);

      // For demo purposes when API is not available, provide mock authentication
      if (credentials.username === 'rajesh' && credentials.password === 'password') {
        const mockResponse: LoginResponse = {
          status: 'success',
          message: 'Login successful (demo mode)',
          user: {
            id: 'rajesh',
            name: 'Rajesh Karmakar',
            contact_no: '9474664779',
            role: 'ceo'
          },
          tokens: {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            idToken: 'mock-id-token-' + Date.now(),
            expiresIn: 3600
          },
          branches: [
            {
              bid: 4,
              branch_name: 'Head',
              db_name: 'head'
            }
          ]
        };

        // Store mock tokens and data
        this.setTokens(mockResponse.tokens);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(mockResponse.user));
          localStorage.setItem('branches_data', JSON.stringify(mockResponse.branches));
        }

        return mockResponse;
      }

      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
        localStorage.removeItem('branches_data');
      }
    }
  }

  async getProfile(): Promise<any> {
    try {
      const response = await this.api.get('/v1/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  // Token utilities
  getStoredTokens() {
    if (typeof window !== 'undefined') {
      return {
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
        idToken: localStorage.getItem('id_token'),
        expiresAt: localStorage.getItem('token_expires_at')
      };
    }
    return null;
  }

  isTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiresAt = localStorage.getItem('token_expires_at');
      if (expiresAt) {
        return Date.now() > parseInt(expiresAt);
      }
    }
    return true;
  }

  // Generic API methods
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
