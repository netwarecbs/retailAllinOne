import { LoginRequest, LoginResponse } from '../types/auth';
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
}
export declare const apiService: ApiService;
export default apiService;
