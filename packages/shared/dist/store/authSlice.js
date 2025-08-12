import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
const getInitialData = () => {
    if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');
        const branchesData = localStorage.getItem('branches_data');
        return {
            tokens: accessToken ? {
                accessToken,
                refreshToken: localStorage.getItem('refresh_token') || '',
                idToken: localStorage.getItem('id_token') || '',
                expiresIn: 3600
            } : null,
            user: userData ? JSON.parse(userData) : null,
            branches: branchesData ? JSON.parse(branchesData) : [],
            isAuthenticated: !!accessToken
        };
    }
    return {
        tokens: null,
        user: null,
        branches: [],
        isAuthenticated: false
    };
};
const initialData = getInitialData();
const initialState = {
    user: initialData.user,
    tokens: initialData.tokens,
    branches: initialData.branches,
    isAuthenticated: initialData.isAuthenticated,
    isLoading: false,
    error: null,
};
// Async thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await apiService.login(credentials);
        if (response.status === 'success' && response.tokens && response.user) {
            return response;
        }
        else {
            return rejectWithValue(response.message || 'Login failed');
        }
    }
    catch (error) {
        return rejectWithValue(error.message || 'Login failed');
    }
});
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await apiService.logout();
    }
    catch (error) {
        return rejectWithValue(error.message || 'Logout failed');
    }
});
export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
    try {
        const user = await apiService.getProfile();
        return user;
    }
    catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch profile');
    }
});
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setTokens: (state, action) => {
            state.tokens = action.payload;
            state.isAuthenticated = true;
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
            state.error = null;
        })
            .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.tokens = null;
            state.branches = [];
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
            state.error = action.payload;
        });
    },
});
export const { clearError, setUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
