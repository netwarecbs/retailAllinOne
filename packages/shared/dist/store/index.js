import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import salesReducer from './salesSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        sales: salesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
        },
    }),
});
