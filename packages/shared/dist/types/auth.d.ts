export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    status: string;
    message: string;
    user: User;
    tokens: Tokens;
    branches: Branch[];
    authz?: Authorization;
}
export interface User {
    id: string;
    name: string;
    contact_no: string;
    role: string;
}
export interface Tokens {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
}
export interface Branch {
    bid: number;
    branch_name: string;
    db_name: string;
}
export interface AuthState {
    user: User | null;
    tokens: Tokens | null;
    branches: Branch[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    authz: Authorization | null;
}
export type TileKey = 'garment' | 'pharmacy' | 'retail';
export type GarmentPageKey = 'dashboard' | 'purchase' | 'inventory' | 'sales' | 'pos';
export type PharmacyPageKey = 'dashboard';
export type RetailPageKey = 'dashboard' | 'inventory' | 'purchase' | 'sales' | 'customers' | 'reports' | 'pos';
export type PageKey = GarmentPageKey | PharmacyPageKey | RetailPageKey;
export interface AuthorizationActionMap {
    [actionKey: string]: boolean;
}
export interface AuthorizationPage {
    allowed: boolean;
    actions?: AuthorizationActionMap;
}
export interface AuthorizationTile {
    allowed: boolean;
    pages: Record<string, AuthorizationPage>;
}
export interface Authorization {
    version: number;
    tiles: Record<TileKey, AuthorizationTile | undefined>;
}
