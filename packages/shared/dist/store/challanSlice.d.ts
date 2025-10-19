import { Challan, PurchaseBill, PaymentEntry, PaymentHistory } from '../types/challan';
export interface ChallanState {
    challans: Challan[];
    pendingChallans: Challan[];
    selectedChallans: string[];
    currentPurchaseBill: PurchaseBill | null;
    paymentHistory: PaymentHistory[];
    selectedVendor: string | null;
    loading: boolean;
    error: string | null;
}
export declare const setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "challan/setLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "challan/setError">, setChallans: import("@reduxjs/toolkit").ActionCreatorWithPayload<Challan[], "challan/setChallans">, setSelectedVendor: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "challan/setSelectedVendor">, selectChallan: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "challan/selectChallan">, deselectChallan: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "challan/deselectChallan">, clearSelectedChallans: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"challan/clearSelectedChallans">, createPurchaseBill: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    billNo: string;
    billDate: string;
    vendorId: string;
    vendorName: string;
    challanIds: string[];
}, "challan/createPurchaseBill">, updatePurchaseBillProduct: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    productId: string;
    field: string;
    value: any;
}, "challan/updatePurchaseBillProduct">, updatePaymentEntry: import("@reduxjs/toolkit").ActionCreatorWithPayload<Partial<PaymentEntry>, "challan/updatePaymentEntry">, updateAdvanceAmount: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "challan/updateAdvanceAmount">, submitPurchaseBill: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"challan/submitPurchaseBill">, clearCurrentPurchaseBill: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"challan/clearCurrentPurchaseBill">, addPaymentHistory: import("@reduxjs/toolkit").ActionCreatorWithPayload<PaymentHistory, "challan/addPaymentHistory">, setPaymentHistory: import("@reduxjs/toolkit").ActionCreatorWithPayload<PaymentHistory[], "challan/setPaymentHistory">, addChallanFromStockIn: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    vendorId: string;
    vendorName: string;
    challanDate: string;
    challanNo: string;
    transportName: string;
    transportNo: string;
    transportCharges: number;
    products: any[];
    totalAmount: number;
}, "challan/addChallanFromStockIn">;
declare const _default: import("redux").Reducer<ChallanState>;
export default _default;
