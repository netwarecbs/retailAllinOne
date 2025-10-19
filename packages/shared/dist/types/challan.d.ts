export interface ChallanProduct {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    batchNo?: string;
    mfDate?: string;
    expDate?: string;
    hsnCode?: string;
    gstRate: number;
    taxableValue: number;
    sgst: number;
    cgst: number;
}
export interface Challan {
    id: string;
    challanNo: string;
    challanDate: string;
    vendorId: string;
    vendorName: string;
    vendorAddress?: string;
    vendorContact?: string;
    vendorGstNo?: string;
    transportName?: string;
    transportNo?: string;
    transportCharges: number;
    status: 'pending' | 'processed' | 'cancelled';
    products: ChallanProduct[];
    totalAmount: number;
    taxableAmount: number;
    totalGst: number;
    createdAt: string;
    updatedAt: string;
}
export interface PurchaseBillProduct {
    slNo: number;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    rate: number;
    discount: number;
    taxableValue: number;
    sgst: number;
    cgst: number;
    total: number;
    billNo: string;
    billDate: string;
    challanId: string;
    challanNo: string;
}
export interface PaymentEntry {
    transactionTypes: ('cash' | 'cheque' | 'credit' | 'discount' | 'upi')[];
    amounts: {
        cash?: number;
        cheque?: number;
        credit?: number;
        discount?: number;
        upi?: number;
    };
    paymentDate: string;
    reference?: string;
    chequeNo?: string;
    bankName?: string;
    discountReason?: string;
    upiId?: string;
    upiTransactionId?: string;
}
export interface PurchaseBill {
    id: string;
    billNo: string;
    billDate: string;
    vendorId: string;
    vendorName: string;
    vendorAddress?: string;
    vendorContact?: string;
    vendorGstNo?: string;
    challanIds: string[];
    challanNumbers: string[];
    products: PurchaseBillProduct[];
    paymentEntry: PaymentEntry;
    totals: {
        discount: number;
        taxableValue: number;
        sgst: number;
        cgst: number;
        total: number;
    };
    status: 'draft' | 'pending' | 'paid' | 'cancelled';
    remainingAmount: number;
    advanceAmount: number;
    createdAt: string;
    updatedAt: string;
}
export interface PaymentHistory {
    srlNo: number;
    actionDate: string;
    taxInvoiceNo: string;
    vendorDescription: string;
    amount: number;
    discountAmount: number;
    netAmount: number;
    cash: number;
    cheque: number;
    credit: number;
    adjust: number;
    operation: string;
}
