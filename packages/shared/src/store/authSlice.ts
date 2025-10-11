import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginRequest, User, Authorization } from '../types/auth';
import { apiService } from '../services/api';
import { getAuthzForRole } from '../services/roles';

const getInitialData = () => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    const branchesData = localStorage.getItem('branches_data');
    const authzData = localStorage.getItem('authz_data');

    return {
      tokens: accessToken ? {
        accessToken,
        refreshToken: localStorage.getItem('refresh_token') || '',
        idToken: localStorage.getItem('id_token') || '',
        expiresIn: 3600
      } : null,
      user: userData ? JSON.parse(userData) : null,
      branches: branchesData ? JSON.parse(branchesData) : [],
      authz: authzData ? JSON.parse(authzData) as Authorization : null,
      isAuthenticated: !!accessToken
    };
  }

  return {
    tokens: null,
    user: null,
    branches: [],
    authz: null,
    isAuthenticated: false
  };
};

const initialData = getInitialData();

const initialState: AuthState = {
  user: initialData.user,
  tokens: initialData.tokens,
  branches: initialData.branches,
  authz: initialData.authz,
  isAuthenticated: initialData.isAuthenticated,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      if (response.status === 'success' && response.tokens && response.user) {
        // Since API doesn't return authz, generate full access authorization
        if (!response.authz) {
          response.authz = {
            version: 1,
            tiles: {
              garment: {
                allowed: true,
                pages: {
                  dashboard: { allowed: true },
                  purchase: { allowed: true, actions: { create: true, save: true, print: true, pdf: true, delete: true } },
                  inventory: { allowed: true, actions: { create: true, update: true, delete: true, export: true, print: true, generateBarcode: true, manageHSN: true, manageUnits: true, categories: true, brand: true, size: true } },
                  sales: { allowed: true, actions: { save: true, print: true, pdf: true, hold: true, view: true } },
                  pos: { allowed: true, actions: { save: true, print: true, pdf: true, hold: true, view: true } }
                }
              },
              pharmacy: {
                allowed: true,
                pages: {
                  dashboard: { allowed: true, actions: { addMedicine: true, viewPrescriptions: true, viewExpiring: true, viewRevenue: true } }
                }
              },
              retail: {
                allowed: true,
                pages: {
                  dashboard: { allowed: true, actions: { viewSales: true, viewInventory: true, viewCustomers: true, viewOrders: true } },
                  inventory: { allowed: true, actions: { create: true, update: true, delete: true, export: true, print: true, generateBarcode: true, manageCategories: true, manageBrands: true, stockAdjustment: true, lowStockAlert: true } },
                  sales: { allowed: true, actions: { create: true, update: true, delete: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true } },
                  customers: { allowed: true, actions: { create: true, update: true, delete: true, view: true, export: true, import: true, manageLoyalty: true, viewHistory: true } },
                  reports: { allowed: true, actions: { viewSales: true, viewInventory: true, viewCustomers: true, viewProfit: true, export: true, print: true, schedule: true, custom: true } },
                  pos: { allowed: true, actions: { create: true, save: true, print: true, pdf: true, hold: true, view: true, refund: true, exchange: true, discount: true, tax: true } }
                }
              }
            }
          };
        }
        return response;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiService.getProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setTokens: (state, action: PayloadAction<any>) => {
      state.tokens = action.payload;
      state.isAuthenticated = true;
    },
    setAuthorization: (state, action: PayloadAction<Authorization | null>) => {
      state.authz = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.tokens = action.payload.tokens;
        state.user = action.payload.user;
        state.branches = action.payload.branches;
        // Prefer authz from API. If missing, generate from role and persist
        const computedAuthz = action.payload.authz ?? (action.payload.user?.role ? getAuthzForRole(action.payload.user.role) : null);
        state.authz = computedAuthz ?? null;
        if (typeof window !== 'undefined') {
          if (computedAuthz) localStorage.setItem('authz_data', JSON.stringify(computedAuthz));
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.branches = [];
        state.authz = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
