import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    purchaseOrders: [],
    currentPurchaseOrder: null,
    suppliers: [],
    selectedSupplier: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
};
// Async thunks
export const fetchPurchaseOrders = createAsyncThunk('purchase/fetchPurchaseOrders', async (params) => {
    // In a real app, this would call the API
    // For now, return mock data
    return {
        purchaseOrders: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 0
    };
});
export const createPurchaseOrder = createAsyncThunk('purchase/createPurchaseOrder', async (purchaseOrder) => {
    // In a real app, this would call the API
    const newPurchaseOrder = {
        ...purchaseOrder,
        id: `PO-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return newPurchaseOrder;
});
export const fetchSuppliers = createAsyncThunk('purchase/fetchSuppliers', async () => {
    // In a real app, this would call the API
    // For now, return mock data
    return [];
});
export const createSupplier = createAsyncThunk('purchase/createSupplier', async (supplier) => {
    // In a real app, this would call the API
    const newSupplier = {
        ...supplier,
        id: `SUP-${Date.now()}`
    };
    return newSupplier;
});
const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        setCurrentPurchaseOrder: (state, action) => {
            state.currentPurchaseOrder = action.payload;
        },
        addPurchaseItem: (state, action) => {
            if (state.currentPurchaseOrder) {
                const existingItem = state.currentPurchaseOrder.items.find(item => item.productId === action.payload.productId);
                if (existingItem) {
                    state.currentPurchaseOrder.items = state.currentPurchaseOrder.items.map(item => item.productId === action.payload.productId
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.purchaseRate }
                        : item);
                }
                else {
                    state.currentPurchaseOrder.items.push(action.payload);
                }
                // Recalculate totals
                const subtotal = state.currentPurchaseOrder.items.reduce((sum, item) => sum + item.total, 0);
                const totalGST = state.currentPurchaseOrder.items.reduce((sum, item) => sum + (item.total * item.gstPercentage / 100), 0);
                state.currentPurchaseOrder.totals = {
                    subtotal,
                    totalGST,
                    grandTotal: subtotal + totalGST
                };
            }
        },
        updatePurchaseItem: (state, action) => {
            if (state.currentPurchaseOrder) {
                const { id, field, value } = action.payload;
                state.currentPurchaseOrder.items = state.currentPurchaseOrder.items.map(item => {
                    if (item.id === id) {
                        const updatedItem = { ...item, [field]: value };
                        // Recalculate totals
                        if (field === 'quantity' || field === 'purchaseRate') {
                            updatedItem.total = updatedItem.quantity * updatedItem.purchaseRate;
                        }
                        // Recalculate sale price based on profit percentage
                        if (field === 'purchaseRate' || field === 'profitPercentage') {
                            const profitAmount = (updatedItem.purchaseRate * updatedItem.profitPercentage) / 100;
                            updatedItem.salePrice = updatedItem.purchaseRate + profitAmount;
                        }
                        return updatedItem;
                    }
                    return item;
                });
                // Recalculate totals
                const subtotal = state.currentPurchaseOrder.items.reduce((sum, item) => sum + item.total, 0);
                const totalGST = state.currentPurchaseOrder.items.reduce((sum, item) => sum + (item.total * item.gstPercentage / 100), 0);
                state.currentPurchaseOrder.totals = {
                    subtotal,
                    totalGST,
                    grandTotal: subtotal + totalGST
                };
            }
        },
        removePurchaseItem: (state, action) => {
            if (state.currentPurchaseOrder) {
                state.currentPurchaseOrder.items = state.currentPurchaseOrder.items.filter(item => item.id !== action.payload);
                // Recalculate totals
                const subtotal = state.currentPurchaseOrder.items.reduce((sum, item) => sum + item.total, 0);
                const totalGST = state.currentPurchaseOrder.items.reduce((sum, item) => sum + (item.total * item.gstPercentage / 100), 0);
                state.currentPurchaseOrder.totals = {
                    subtotal,
                    totalGST,
                    grandTotal: subtotal + totalGST
                };
            }
        },
        updateSupplier: (state, action) => {
            if (state.currentPurchaseOrder) {
                state.currentPurchaseOrder.supplier = {
                    ...state.currentPurchaseOrder.supplier,
                    ...action.payload
                };
            }
        },
        updatePaymentMethods: (state, action) => {
            if (state.currentPurchaseOrder) {
                state.currentPurchaseOrder.paymentMethods = action.payload;
            }
        },
        setExpenseCategory: (state, action) => {
            if (state.currentPurchaseOrder) {
                state.currentPurchaseOrder.expenseCategory = action.payload;
            }
        },
        clearCurrentPurchaseOrder: (state) => {
            state.currentPurchaseOrder = null;
        },
        setSelectedSupplier: (state, action) => {
            state.selectedSupplier = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.purchaseOrders = action.payload.purchaseOrders;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
        })
            .addCase(fetchPurchaseOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch purchase orders';
        })
            .addCase(createPurchaseOrder.fulfilled, (state, action) => {
            state.purchaseOrders.unshift(action.payload);
            state.currentPurchaseOrder = null;
        })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
            state.suppliers = action.payload;
        })
            .addCase(createSupplier.fulfilled, (state, action) => {
            state.suppliers.push(action.payload);
        });
    }
});
export const { setCurrentPurchaseOrder, addPurchaseItem, updatePurchaseItem, removePurchaseItem, updateSupplier, updatePaymentMethods, setExpenseCategory, clearCurrentPurchaseOrder, setSelectedSupplier, clearError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
