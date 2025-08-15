import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
const initialState = {
    cart: [],
    customer: null,
    paymentDetails: {
        cashAmount: 0,
        cardAmount: 0,
        upiAmount: 0,
        bankTransferAmount: 0,
        changeGiven: 0
    },
    loading: false,
    error: null,
    sales: [],
    salesTotal: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
};
export const createSale = createAsyncThunk('sales/createSale', async (saleData) => {
    const response = await apiService.createSale(saleData);
    return response;
});
export const searchCustomers = createAsyncThunk('sales/searchCustomers', async (query) => {
    const response = await apiService.searchCustomers(query);
    return response;
});
const calculateTotals = (cart) => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const discount = 0; // Can be calculated based on business logic
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
};
const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity, size, color } = action.payload;
            // Check if item already exists in cart
            const existingItemIndex = state.cart.findIndex(item => item.productId === product.id && item.size === size && item.color === color);
            if (existingItemIndex >= 0) {
                // Update existing item
                const existingItem = state.cart[existingItemIndex];
                const newQuantity = existingItem.quantity + quantity;
                const newTotal = newQuantity * existingItem.unitPrice;
                state.cart[existingItemIndex] = {
                    ...existingItem,
                    quantity: newQuantity,
                    total: newTotal
                };
            }
            else {
                // Add new item
                const newItem = {
                    id: `cart_${Date.now()}_${Math.random()}`,
                    productId: product.id,
                    productName: product.name,
                    sku: product.sku,
                    size,
                    color,
                    quantity,
                    unitPrice: product.price,
                    discount: 0,
                    tax: product.price * quantity * 0.05, // 5% GST
                    total: product.price * quantity,
                    stockAfterSale: product.stock - quantity,
                    product
                };
                state.cart.push(newItem);
            }
            // Recalculate totals
            const totals = calculateTotals(state.cart);
            state.subtotal = totals.subtotal;
            state.discount = totals.discount;
            state.tax = totals.tax;
            state.total = totals.total;
        },
        updateCartItem: (state, action) => {
            const { id, quantity } = action.payload;
            const itemIndex = state.cart.findIndex(item => item.id === id);
            if (itemIndex >= 0) {
                const item = state.cart[itemIndex];
                const newTotal = quantity * item.unitPrice;
                state.cart[itemIndex] = {
                    ...item,
                    quantity,
                    total: newTotal,
                    tax: newTotal * 0.05,
                    stockAfterSale: item.product.stock - quantity
                };
                // Recalculate totals
                const totals = calculateTotals(state.cart);
                state.subtotal = totals.subtotal;
                state.discount = totals.discount;
                state.tax = totals.tax;
                state.total = totals.total;
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cart = state.cart.filter(item => item.id !== id);
            // Recalculate totals
            const totals = calculateTotals(state.cart);
            state.subtotal = totals.subtotal;
            state.discount = totals.discount;
            state.tax = totals.tax;
            state.total = totals.total;
        },
        clearCart: (state) => {
            state.cart = [];
            state.subtotal = 0;
            state.discount = 0;
            state.tax = 0;
            state.total = 0;
        },
        setCustomer: (state, action) => {
            state.customer = action.payload;
        },
        updatePaymentDetails: (state, action) => {
            state.paymentDetails = { ...state.paymentDetails, ...action.payload };
        },
        setDiscount: (state, action) => {
            state.discount = action.payload;
            state.total = state.subtotal - state.discount + state.tax;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSale.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createSale.fulfilled, (state, action) => {
            state.loading = false;
            state.sales.unshift(action.payload);
            // Clear cart after successful sale
            state.cart = [];
            state.customer = null;
            state.paymentDetails = {
                cashAmount: 0,
                cardAmount: 0,
                upiAmount: 0,
                bankTransferAmount: 0,
                changeGiven: 0
            };
            state.subtotal = 0;
            state.discount = 0;
            state.tax = 0;
            state.total = 0;
        })
            .addCase(createSale.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create sale';
        });
    }
});
export const { addToCart, updateCartItem, removeFromCart, clearCart, setCustomer, updatePaymentDetails, setDiscount, clearError } = salesSlice.actions;
export default salesSlice.reducer;
