export interface RetailProduct {
    sku: string;
    name: string;
    category: string;
    brand: string;
    ingredients?: string;
    expiryDate?: string;
    mrp: number;
    costPrice: number;
    sellPrice: number;
    stock: number;
    minStock: number;
    unit: string;
    isActive: boolean;
    barcode?: string;
    gstRate: number;
    hsnCode?: string;
    image?: string;
}
export declare const retailProducts: RetailProduct[];
export declare const categories: string[];
export declare const brands: string[];
