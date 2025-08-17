export interface PurchaseItem {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    barcode?: string;
    category: string;
    unit: string;
    quantity: number;
    purchaseRate: number;
    profitPercentage: number;
    hsnCode: string;
    gstPercentage: number;
    salePrice: number;
    mrp: number;
    total: number;
}
export interface Supplier {
    id: string;
    name: string;
    reference: string;
    mobile: string;
    address: string;
    shipTo: string;
    loyaltyCard: string;
    gstNo: string;
    state: string;
    previousOrders?: number;
    creditLimit?: number;
    outstandingAmount?: number;
}
export interface PurchaseOrder {
    id: string;
    supplier: Supplier;
    items: PurchaseItem[];
    totals: {
        subtotal: number;
        totalGST: number;
        grandTotal: number;
    };
    paymentMethods: {
        cash: number;
        card: number;
        upi: number;
    };
    expenseCategory: string;
    status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}
export interface PurchaseState {
    purchaseOrders: PurchaseOrder[];
    currentPurchaseOrder: PurchaseOrder | null;
    suppliers: Supplier[];
    selectedSupplier: Supplier | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare const fetchPurchaseOrders: import("@reduxjs/toolkit").AsyncThunk<{
    purchaseOrders: never[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}, {
    page?: number;
    limit?: number;
    status?: string;
} | undefined, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createPurchaseOrder: import("@reduxjs/toolkit").AsyncThunk<PurchaseOrder, Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchSuppliers: import("@reduxjs/toolkit").AsyncThunk<never[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createSupplier: import("@reduxjs/toolkit").AsyncThunk<Supplier, Omit<Supplier, "id">, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const setCurrentPurchaseOrder: import("@reduxjs/toolkit").ActionCreatorWithPayload<PurchaseOrder | null, "purchase/setCurrentPurchaseOrder">, addPurchaseItem: import("@reduxjs/toolkit").ActionCreatorWithPayload<PurchaseItem, "purchase/addPurchaseItem">, updatePurchaseItem: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    field: keyof PurchaseItem;
    value: any;
}, "purchase/updatePurchaseItem">, removePurchaseItem: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "purchase/removePurchaseItem">, updateSupplier: import("@reduxjs/toolkit").ActionCreatorWithPayload<Partial<Supplier>, "purchase/updateSupplier">, updatePaymentMethods: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    cash: number;
    card: number;
    upi: number;
}, "purchase/updatePaymentMethods">, setExpenseCategory: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "purchase/setExpenseCategory">, clearCurrentPurchaseOrder: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"purchase/clearCurrentPurchaseOrder">, setSelectedSupplier: import("@reduxjs/toolkit").ActionCreatorWithPayload<Supplier | null, "purchase/setSelectedSupplier">, clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"purchase/clearError">;
declare const _default: import("redux").Reducer<PurchaseState>;
export default _default;
