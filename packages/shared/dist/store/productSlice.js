import { createSlice } from '@reduxjs/toolkit';
import { retailProducts, categories, brands } from '../data/retailProducts';
import { retailSuppliers } from '../data/retailSuppliers';
import { retailCustomers } from '../data/retailCustomers';
const initialState = {
    products: retailProducts,
    categories: categories,
    brands: brands,
    vendors: retailSuppliers,
    customers: retailCustomers,
    stockInRecords: [
        {
            id: 'SI-826',
            vendorId: 'V-1',
            vendorName: 'AMADPUR U.C.A.C.S LTD',
            challanDate: '11-10-2025',
            challanNo: '3330',
            transportName: 'AKS CARRIAR',
            transportNo: 'AKS001',
            transportCharges: 0.00,
            billNo: 'N/A',
            billDate: 'N/A',
            products: [
                {
                    slNo: 1,
                    productId: 'RT009',
                    productName: 'Gohan (500gm)',
                    inStock: 15,
                    qty: 10,
                    batchNo: 'B001',
                    mfDate: '2025-01-01',
                    expDate: '2026-12-31',
                    unitPrice: 4225,
                    totalPrice: 42250
                }
            ],
            totalAmount: 42250,
            createdAt: '2025-10-11T10:30:00Z'
        },
        {
            id: 'SI-825',
            vendorId: 'V-8',
            vendorName: 'SRIDHARPUR CO. BANK',
            challanDate: '09-10-2025',
            challanNo: '3108',
            transportName: 'SELF',
            transportNo: 'SELF001',
            transportCharges: 0.00,
            billNo: 'N/A',
            billDate: 'N/A',
            products: [
                {
                    slNo: 1,
                    productId: 'RT011',
                    productName: 'Nano D.A.P (250ml) Iffco',
                    inStock: 25,
                    qty: 20,
                    batchNo: 'B002',
                    mfDate: '2025-02-01',
                    expDate: '2027-06-30',
                    unitPrice: 350,
                    totalPrice: 7000
                }
            ],
            totalAmount: 7000,
            createdAt: '2025-10-09T14:20:00Z'
        },
        {
            id: 'SI-821',
            vendorId: 'V-3',
            vendorName: 'HATDALUIBAZAR S.U.O.B.S.S LTD',
            challanDate: '26-09-2025',
            challanNo: '3202',
            transportName: 'A.K.SAHA',
            transportNo: 'AKS002',
            transportCharges: 0.00,
            billNo: 'N/A',
            billDate: 'N/A',
            products: [
                {
                    slNo: 1,
                    productId: 'RT012',
                    productName: 'Duet (140gm)',
                    inStock: 12,
                    qty: 8,
                    batchNo: 'B003',
                    mfDate: '2025-03-01',
                    expDate: '2026-08-15',
                    unitPrice: 850,
                    totalPrice: 6800
                }
            ],
            totalAmount: 6800,
            createdAt: '2025-09-26T16:45:00Z'
        }
    ],
    selectedVendor: null,
    loading: false,
    error: null
};
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p.sku === action.payload.sku);
            if (index !== -1) {
                state.products[index] = { ...state.products[index], ...action.payload.updates };
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p.sku !== action.payload);
        },
        updateStock: (state, action) => {
            const product = state.products.find(p => p.sku === action.payload.sku);
            if (product) {
                if (action.payload.operation === 'add') {
                    product.stock += action.payload.quantity;
                }
                else {
                    product.stock = Math.max(0, product.stock - action.payload.quantity);
                }
            }
        },
        addStockInRecord: (state, action) => {
            state.stockInRecords.unshift(action.payload);
            // Update product stock
            action.payload.products.forEach(stockProduct => {
                const product = state.products.find(p => p.sku === stockProduct.productId);
                if (product) {
                    product.stock += stockProduct.qty;
                }
            });
        },
        setSelectedVendor: (state, action) => {
            state.selectedVendor = action.payload;
        },
        addVendor: (state, action) => {
            state.vendors.push(action.payload);
        },
        updateVendor: (state, action) => {
            const index = state.vendors.findIndex(v => v.id === action.payload.id);
            if (index !== -1) {
                state.vendors[index] = { ...state.vendors[index], ...action.payload.updates };
            }
        },
        deleteVendor: (state, action) => {
            state.vendors = state.vendors.filter(v => v.id !== action.payload);
        },
        addCustomer: (state, action) => {
            state.customers.push(action.payload);
        },
        updateCustomer: (state, action) => {
            const index = state.customers.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.customers[index] = { ...state.customers[index], ...action.payload.updates };
            }
        },
        deleteCustomer: (state, action) => {
            state.customers = state.customers.filter(c => c.id !== action.payload);
        }
    }
});
export const { setLoading, setError, addProduct, updateProduct, deleteProduct, updateStock, addStockInRecord, setSelectedVendor, addVendor, updateVendor, deleteVendor, addCustomer, updateCustomer, deleteCustomer } = productSlice.actions;
export default productSlice.reducer;
