import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
const initialState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    searchParams: {}
};
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params) => {
    const response = await apiService.getProducts(params);
    return response;
});
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
    const response = await apiService.getProductById(id);
    return response;
});
export const searchProductsByBarcode = createAsyncThunk('products/searchProductsByBarcode', async (barcode) => {
    const response = await apiService.searchProductsByBarcode(barcode);
    return response;
});
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProducts: (state) => {
            state.products = [];
            state.selectedProduct = null;
            state.error = null;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setSearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
        })
            .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch products';
        })
            .addCase(fetchProductById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchProductById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        })
            .addCase(fetchProductById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch product';
        })
            .addCase(searchProductsByBarcode.fulfilled, (state, action) => {
            if (action.payload) {
                state.selectedProduct = action.payload;
            }
        });
    }
});
export const { clearProducts, setSelectedProduct, setSearchParams, clearError } = productSlice.actions;
export default productSlice.reducer;
