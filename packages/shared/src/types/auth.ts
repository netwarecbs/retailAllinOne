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
  authz?: Authorization; // Authorization JSON returned from login
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

  // RBAC authorization JSON for the current user
  authz: Authorization | null;
}

// RBAC Types
export type TileKey = 'garment' | 'pharmacy';

export type GarmentPageKey = 'dashboard' | 'purchase' | 'inventory' | 'sales' | 'pos';
export type PharmacyPageKey = 'dashboard';
export type PageKey = GarmentPageKey | PharmacyPageKey;

export interface AuthorizationActionMap {
  [actionKey: string]: boolean; // e.g. { create: true, delete: false }
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
