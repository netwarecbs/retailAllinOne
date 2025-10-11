export interface Product {
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
export interface StockInRecord {
    id: string;
    vendorId: string;
    vendorName: string;
    challanDate: string;
    challanNo: string;
    transportName: string;
    transportNo: string;
    transportCharges: number;
    billNo?: string;
    billDate?: string;
    products: StockInProduct[];
    totalAmount: number;
    createdAt: string;
}
export interface StockInProduct {
    slNo: number;
    productId: string;
    productName: string;
    inStock: number;
    qty: number;
    batchNo: string;
    mfDate: string;
    expDate: string;
    unitPrice: number;
    totalPrice: number;
}
export interface Vendor {
    id: string;
    name: string;
    contact: string;
    gstin: string;
    address: string;
    outstandingAmount: number;
}
export interface Customer {
    id: string;
    name: string;
    contact: string;
    type: "Regular" | "Wholesale" | "VIP";
    outstandingAmount: number;
}
export interface ProductState {
    products: Product[];
    categories: string[];
    brands: string[];
    vendors: Vendor[];
    customers: Customer[];
    stockInRecords: StockInRecord[];
    selectedVendor: Vendor | null;
    loading: boolean;
    error: string | null;
}
export declare const setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "products/setLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "products/setError">, addProduct: import("@reduxjs/toolkit").ActionCreatorWithPayload<Product, "products/addProduct">, updateProduct: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    sku: string;
    updates: Partial<Product>;
}, "products/updateProduct">, deleteProduct: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "products/deleteProduct">, updateStock: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    sku: string;
    quantity: number;
    operation: "add" | "subtract";
}, "products/updateStock">, addStockInRecord: import("@reduxjs/toolkit").ActionCreatorWithPayload<StockInRecord, "products/addStockInRecord">, setSelectedVendor: import("@reduxjs/toolkit").ActionCreatorWithPayload<Vendor | null, "products/setSelectedVendor">, addVendor: import("@reduxjs/toolkit").ActionCreatorWithPayload<Vendor, "products/addVendor">, updateVendor: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    updates: Partial<Vendor>;
}, "products/updateVendor">, deleteVendor: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "products/deleteVendor">, addCustomer: import("@reduxjs/toolkit").ActionCreatorWithPayload<Customer, "products/addCustomer">, updateCustomer: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    updates: Partial<Customer>;
}, "products/updateCustomer">, deleteCustomer: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "products/deleteCustomer">;
declare const _default: import("redux").Reducer<ProductState>;
export default _default;
