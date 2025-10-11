export interface RetailSupplier {
    id: string;
    name: string;
    contact: string;
    email?: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    creditLimit: number;
    outstandingAmount: number;
    isActive: boolean;
}
export declare const retailSuppliers: RetailSupplier[];
