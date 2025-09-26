import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse, Authorization } from '../types/auth';
import { Product, ProductSearchParams, ProductResponse } from '../types/product';
import { Sale, SaleSearchParams, SaleResponse, Customer } from '../types/sales';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://35.154.89.77:8000';

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

        // Also store user, branches and authorization data
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

  // Product API methods
  async getProducts(params?: ProductSearchParams): Promise<ProductResponse> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      const { sampleProducts } = await import('../data/sampleProducts');

      let filteredProducts = [...sampleProducts];

      if (params?.query) {
        const query = params.query.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.barcode?.toLowerCase().includes(query)
        );
      }

      if (params?.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category === params.category
        );
      }

      if (params?.inStock) {
        filteredProducts = filteredProducts.filter(product => product.stock > 0);
      }

      const page = params?.page || 1;
      //const limit = params?.limit || 200;
      const limit = 200;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit)
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      const { sampleProducts } = await import('../data/sampleProducts');
      const product = sampleProducts.find(p => p.id === id);

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  async searchProductsByBarcode(barcode: string): Promise<Product | null> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      const { sampleProducts } = await import('../data/sampleProducts');
      const product = sampleProducts.find(p => p.barcode === barcode);

      return product || null;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search product');
    }
  }

  // Sales API methods
  async createSale(saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sale> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      const newSale: Sale = {
        ...saleData,
        id: `sale_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return newSale;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create sale');
    }
  }

  async getSales(params?: SaleSearchParams): Promise<SaleResponse> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      const mockSales: Sale[] = [];

      return {
        sales: mockSales,
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sales');
    }
  }

  async getSaleById(id: string): Promise<Sale> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      throw new Error('Sale not found');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sale');
    }
  }

  // Customer API methods
  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      // For now, return mock data. In real implementation, this would be an API call
      const { sampleCustomers } = await import('../data/sampleCustomers');

      if (query) {
        const searchQuery = query.toLowerCase();
        return sampleCustomers.filter(customer =>
          customer.name.toLowerCase().includes(searchQuery) ||
          customer.phone?.includes(query) ||
          customer.email?.toLowerCase().includes(searchQuery) ||
          customer.pan?.toLowerCase().includes(searchQuery) ||
          customer.gstin?.toLowerCase().includes(searchQuery)
        );
      }

      return sampleCustomers;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search customers');
    }
  }
}

export const apiService = new ApiService();
export default apiService;
