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
}
