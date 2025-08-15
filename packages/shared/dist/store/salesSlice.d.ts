import { Sale, SaleItem, Customer, PaymentDetails } from '../types/sales';
import { Product } from '../types/product';
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
    salesTotal: number;
    page: number;
    limit: number;
    totalPages: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    extraLess: number;
    savings: number;
    invoiceTotal: number;
    heldInvoices: HeldInvoice[];
    currentInvoiceNumber: string;
}
export declare const createSale: import("@reduxjs/toolkit").AsyncThunk<Sale, Omit<Sale, "id" | "createdAt" | "updatedAt">, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const searchCustomers: import("@reduxjs/toolkit").AsyncThunk<Customer[], string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const addToCart: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    product: Product;
    quantity: number;
    size?: string;
    color?: string;
}, "sales/addToCart">, updateCartItem: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    quantity: number;
}, "sales/updateCartItem">, removeFromCart: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "sales/removeFromCart">, clearCart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"sales/clearCart">, setCustomer: import("@reduxjs/toolkit").ActionCreatorWithPayload<Customer | null, "sales/setCustomer">, updatePaymentDetails: import("@reduxjs/toolkit").ActionCreatorWithPayload<Partial<PaymentDetails>, "sales/updatePaymentDetails">, setDiscount: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "sales/setDiscount">, setExtraLess: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "sales/setExtraLess">, setSavings: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "sales/setSavings">, updatePaymentAmount: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    method: keyof PaymentDetails;
    amount: number;
}, "sales/updatePaymentAmount">, holdInvoice: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"sales/holdInvoice">, loadHeldInvoice: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "sales/loadHeldInvoice">, removeHeldInvoice: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "sales/removeHeldInvoice">, setInvoiceNumber: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "sales/setInvoiceNumber">, clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"sales/clearError">;
declare const _default: import("redux").Reducer<SalesState>;
export default _default;
