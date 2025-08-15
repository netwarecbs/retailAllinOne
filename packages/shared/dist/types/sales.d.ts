export interface Sale {
    id: string;
    invoiceNumber: string;
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    customerAddress?: string;
    customerGstNo?: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentDetails: PaymentDetails;
    status: SaleStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
export interface SaleItem {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    tax: number;
    total: number;
    stockAfterSale: number;
}
export interface Customer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    pan?: string;
    gstin?: string;
    gstNo?: string;
    loyaltyCard?: string;
    isWholesale: boolean;
    creditLimit?: number;
    outstandingAmount?: number;
    customerType?: 'retail' | 'wholesale';
    createdAt: string;
    updatedAt: string;
}
export interface PaymentMethod {
    type: 'cash' | 'card' | 'upi' | 'bank_transfer';
    amount: number;
}
export interface PaymentDetails {
    cashAmount: number;
    cardAmount: number;
    upiAmount: number;
    bankTransferAmount: number;
    changeGiven: number;
}
export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded' | 'on_hold';
export interface SaleSearchParams {
    startDate?: string;
    endDate?: string;
    customerName?: string;
    invoiceNumber?: string;
    status?: SaleStatus;
    page?: number;
    limit?: number;
}
export interface SaleResponse {
    sales: Sale[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface SaleSummary {
    totalSales: number;
    totalRevenue: number;
    totalItems: number;
    averageOrderValue: number;
}
