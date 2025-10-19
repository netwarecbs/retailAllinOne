import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import salesReducer from './salesSlice';
import purchaseReducer from './purchaseSlice';
import challanReducer from './challanSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        sales: salesReducer,
        purchase: purchaseReducer,
        challan: challanReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
        },
    }),
});
