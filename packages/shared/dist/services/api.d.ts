import { LoginRequest, LoginResponse } from '../types/auth';
import { Product, ProductSearchParams, ProductResponse } from '../types/product';
import { Sale, SaleSearchParams, SaleResponse, Customer } from '../types/sales';
declare class ApiService {
    private api;
    private baseURL;
    constructor();
    private getAccessToken;
    private setTokens;
    private clearTokens;
    private getToken;
    login(credentials: LoginRequest): Promise<LoginResponse>;
    logout(): Promise<void>;
    getProfile(): Promise<any>;
    getStoredTokens(): {
        accessToken: string | null;
        refreshToken: string | null;
        idToken: string | null;
        expiresAt: string | null;
    } | null;
    isTokenExpired(): boolean;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data?: any): Promise<T>;
    put<T>(url: string, data?: any): Promise<T>;
    delete<T>(url: string): Promise<T>;
    getProducts(params?: ProductSearchParams): Promise<ProductResponse>;
    getProductById(id: string): Promise<Product>;
    searchProductsByBarcode(barcode: string): Promise<Product | null>;
    createSale(saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sale>;
    getSales(params?: SaleSearchParams): Promise<SaleResponse>;
    getSaleById(id: string): Promise<Sale>;
    searchCustomers(query: string): Promise<Customer[]>;
}
export declare const apiService: ApiService;
export default apiService;
