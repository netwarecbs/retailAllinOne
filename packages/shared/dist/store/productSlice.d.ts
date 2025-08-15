import { Product, ProductSearchParams, ProductResponse } from '../types/product';
export interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    searchParams: ProductSearchParams;
}
export declare const fetchProducts: import("@reduxjs/toolkit").AsyncThunk<ProductResponse, ProductSearchParams | undefined, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchProductById: import("@reduxjs/toolkit").AsyncThunk<Product, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const searchProductsByBarcode: import("@reduxjs/toolkit").AsyncThunk<Product | null, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const clearProducts: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"products/clearProducts">, setSelectedProduct: import("@reduxjs/toolkit").ActionCreatorWithPayload<Product | null, "products/setSelectedProduct">, setSearchParams: import("@reduxjs/toolkit").ActionCreatorWithPayload<ProductSearchParams, "products/setSearchParams">, clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"products/clearError">;
declare const _default: import("redux").Reducer<ProductState>;
export default _default;
