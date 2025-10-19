export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    auth: import("..").AuthState;
    products: import("./productSlice").ProductState;
    sales: import("./salesSlice").SalesState;
    purchase: import("./purchaseSlice").PurchaseState;
    challan: import("./challanSlice").ChallanState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        auth: import("..").AuthState;
        products: import("./productSlice").ProductState;
        sales: import("./salesSlice").SalesState;
        purchase: import("./purchaseSlice").PurchaseState;
        challan: import("./challanSlice").ChallanState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
