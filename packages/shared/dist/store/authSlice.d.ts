import { AuthState, LoginRequest, User } from '../types/auth';
export declare const loginUser: import("@reduxjs/toolkit").AsyncThunk<import("../types/auth").LoginResponse, LoginRequest, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const logoutUser: import("@reduxjs/toolkit").AsyncThunk<undefined, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchUserProfile: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/clearError">, setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<User, "auth/setUser">, setTokens: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "auth/setTokens">, updateAuthorizationWithPurchase: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/updateAuthorizationWithPurchase">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
