import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Sale, SaleItem, Customer, PaymentDetails } from '../types/sales';
import { Product } from '../types/product';
import { apiService } from '../services/api';

interface CartItem extends SaleItem {
    product: Product;
}

interface HeldInvoice {
    id: string;
    customer: Customer | null;
    cart: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    extraLess: number;
    savings: number;
    invoiceTotal: number;
    paymentDetails: PaymentDetails;
    heldAt: string;
    invoiceNumber: string;
}

export interface SalesState {
    cart: CartItem[];
    customer: Customer | null;
    paymentDetails: PaymentDetails;
    loading: boolean;
    error: string | null;
    sales: Sale[];
    salesTotal: number; // Renamed to avoid conflict
    page: number;
    limit: number;
    totalPages: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    // New POS-specific fields
    extraLess: number;
    savings: number;
    invoiceTotal: number;
    heldInvoices: HeldInvoice[];
    currentInvoiceNumber: string;
}

const initialState: SalesState = {
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
    total: 0,
    // New POS-specific fields
    extraLess: 0,
    savings: 0,
    invoiceTotal: 0,
    heldInvoices: [],
    currentInvoiceNumber: ''
};

export const createSale = createAsyncThunk(
    'sales/createSale',
    async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await apiService.createSale(saleData);
        return response;
    }
);

export const searchCustomers = createAsyncThunk(
    'sales/searchCustomers',
    async (query: string) => {
        const response = await apiService.searchCustomers(query);
        return response;
    }
);

const calculateTotals = (cart: CartItem[], extraLess: number = 0, savings: number = 0) => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const discount = savings; // Use savings as discount
    const tax = (subtotal - discount) * 0.05; // 5% GST on net amount
    const total = subtotal - discount + tax + extraLess;

    return { subtotal, discount, tax, total };
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ product: Product; quantity: number; size?: string; color?: string }>) => {
            const { product, quantity, size, color } = action.payload;

            // Check if item already exists in cart
            const existingItemIndex = state.cart.findIndex(
                item => item.productId === product.id && item.size === size && item.color === color
            );

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
            } else {
                // Add new item
                const newItem: CartItem = {
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
            const totals = calculateTotals(state.cart, state.extraLess, state.savings);
            state.subtotal = totals.subtotal;
            state.discount = totals.discount;
            state.tax = totals.tax;
            state.total = totals.total;
            state.invoiceTotal = totals.total;
        },

        updateCartItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
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
                const totals = calculateTotals(state.cart, state.extraLess, state.savings);
                state.subtotal = totals.subtotal;
                state.discount = totals.discount;
                state.tax = totals.tax;
                state.total = totals.total;
                state.invoiceTotal = totals.total;
            }
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.cart = state.cart.filter(item => item.id !== id);

            // Recalculate totals
            const totals = calculateTotals(state.cart, state.extraLess, state.savings);
            state.subtotal = totals.subtotal;
            state.discount = totals.discount;
            state.tax = totals.tax;
            state.total = totals.total;
            state.invoiceTotal = totals.total;
        },

        clearCart: (state) => {
            state.cart = [];
            state.subtotal = 0;
            state.discount = 0;
            state.tax = 0;
            state.total = 0;
            state.extraLess = 0;
            state.savings = 0;
            state.invoiceTotal = 0;
        },

        setCustomer: (state, action: PayloadAction<Customer | null>) => {
            state.customer = action.payload;
        },

        updatePaymentDetails: (state, action: PayloadAction<Partial<PaymentDetails>>) => {
            state.paymentDetails = { ...state.paymentDetails, ...action.payload };
        },

        setDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
            state.total = state.subtotal - state.discount + state.tax;
        },

        // New POS-specific actions
        setExtraLess: (state, action: PayloadAction<number>) => {
            state.extraLess = action.payload;
            const totals = calculateTotals(state.cart, state.extraLess, state.savings);
            state.total = totals.total;
            state.invoiceTotal = totals.total;
        },

        setSavings: (state, action: PayloadAction<number>) => {
            state.savings = action.payload;
            const totals = calculateTotals(state.cart, state.extraLess, state.savings);
            state.discount = totals.discount;
            state.tax = totals.tax;
            state.total = totals.total;
            state.invoiceTotal = totals.total;
        },

        updatePaymentAmount: (state, action: PayloadAction<{ method: keyof PaymentDetails; amount: number }>) => {
            const { method, amount } = action.payload;
            state.paymentDetails[method] = amount;

            // Calculate change given
            const totalPaid = Object.values(state.paymentDetails).reduce((sum, val) => sum + val, 0) - state.paymentDetails.changeGiven;
            state.paymentDetails.changeGiven = Math.max(0, totalPaid - state.invoiceTotal);
        },

        holdInvoice: (state) => {
            if (state.cart.length === 0) return;

            const heldInvoice: HeldInvoice = {
                id: `held_${Date.now()}`,
                customer: state.customer,
                cart: [...state.cart],
                subtotal: state.subtotal,
                discount: state.discount,
                tax: state.tax,
                total: state.total,
                extraLess: state.extraLess,
                savings: state.savings,
                invoiceTotal: state.invoiceTotal,
                paymentDetails: { ...state.paymentDetails },
                heldAt: new Date().toISOString(),
                invoiceNumber: state.currentInvoiceNumber || `INV-${Date.now()}`
            };

            state.heldInvoices.push(heldInvoice);

            // Clear current cart
            state.cart = [];
            state.customer = null;
            state.subtotal = 0;
            state.discount = 0;
            state.tax = 0;
            state.total = 0;
            state.extraLess = 0;
            state.savings = 0;
            state.invoiceTotal = 0;
            state.paymentDetails = {
                cashAmount: 0,
                cardAmount: 0,
                upiAmount: 0,
                bankTransferAmount: 0,
                changeGiven: 0
            };
        },

        loadHeldInvoice: (state, action: PayloadAction<string>) => {
            const heldInvoice = state.heldInvoices.find(invoice => invoice.id === action.payload);
            if (heldInvoice) {
                state.cart = [...heldInvoice.cart];
                state.customer = heldInvoice.customer;
                state.subtotal = heldInvoice.subtotal;
                state.discount = heldInvoice.discount;
                state.tax = heldInvoice.tax;
                state.total = heldInvoice.total;
                state.extraLess = heldInvoice.extraLess;
                state.savings = heldInvoice.savings;
                state.invoiceTotal = heldInvoice.invoiceTotal;
                state.paymentDetails = { ...heldInvoice.paymentDetails };
                state.currentInvoiceNumber = heldInvoice.invoiceNumber;

                // Remove from held invoices
                state.heldInvoices = state.heldInvoices.filter(invoice => invoice.id !== action.payload);
            }
        },

        removeHeldInvoice: (state, action: PayloadAction<string>) => {
            state.heldInvoices = state.heldInvoices.filter(invoice => invoice.id !== action.payload);
        },

        setInvoiceNumber: (state, action: PayloadAction<string>) => {
            state.currentInvoiceNumber = action.payload;
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
            .addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
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
                state.extraLess = 0;
                state.savings = 0;
                state.invoiceTotal = 0;
                state.currentInvoiceNumber = '';
            })
            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create sale';
            });
    }
});

export const {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setCustomer,
    updatePaymentDetails,
    setDiscount,
    // New POS-specific actions
    setExtraLess,
    setSavings,
    updatePaymentAmount,
    holdInvoice,
    loadHeldInvoice,
    removeHeldInvoice,
    setInvoiceNumber,
    clearError
} = salesSlice.actions;

export default salesSlice.reducer;
