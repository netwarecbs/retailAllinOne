export interface RetailCustomer {
    id: string;
    name: string;
    contact: string;
    email?: string;
    type: 'Regular' | 'Wholesale' | 'VIP';
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    creditLimit?: number;
    outstandingAmount: number;
    totalPurchases: number;
    lastPurchaseDate?: string;
    isActive: boolean;
}
export declare const retailCustomers: RetailCustomer[];
