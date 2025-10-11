import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { retailProducts, categories, brands } from '../data/retailProducts'
import { retailSuppliers } from '../data/retailSuppliers'
import { retailCustomers } from '../data/retailCustomers'

export interface Product {
  sku: string
  name: string
  category: string
  brand: string
  ingredients?: string
  expiryDate?: string
  mrp: number
  costPrice: number
  sellPrice: number
  stock: number
  minStock: number
  unit: string
  isActive: boolean
  barcode?: string
  gstRate: number
  hsnCode?: string
  image?: string
}

export interface StockInRecord {
  id: string
  vendorId: string
  vendorName: string
  challanDate: string
  challanNo: string
  transportName: string
  transportNo: string
  transportCharges: number
  billNo?: string
  billDate?: string
  products: StockInProduct[]
  totalAmount: number
  createdAt: string
}

export interface StockInProduct {
  slNo: number
  productId: string
  productName: string
  inStock: number
  qty: number
  batchNo: string
  mfDate: string
  expDate: string
  unitPrice: number
  totalPrice: number
}

export interface Vendor {
  id: string
  name: string
  contact: string
  gstin: string
  address: string
  outstandingAmount: number
}

export interface Customer {
  id: string
  name: string
  contact: string
  type: "Regular" | "Wholesale" | "VIP"
  outstandingAmount: number
}

export interface ProductState {
  products: Product[]
  categories: string[]
  brands: string[]
  vendors: Vendor[]
  customers: Customer[]
  stockInRecords: StockInRecord[]
  selectedVendor: Vendor | null
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
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
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    },
    updateProduct: (state, action: PayloadAction<{ sku: string; updates: Partial<Product> }>) => {
      const index = state.products.findIndex(p => p.sku === action.payload.sku)
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload.updates }
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.sku !== action.payload)
    },
    updateStock: (state, action: PayloadAction<{ sku: string; quantity: number; operation: 'add' | 'subtract' }>) => {
      const product = state.products.find(p => p.sku === action.payload.sku)
      if (product) {
        if (action.payload.operation === 'add') {
          product.stock += action.payload.quantity
        } else {
          product.stock = Math.max(0, product.stock - action.payload.quantity)
        }
      }
    },
    addStockInRecord: (state, action: PayloadAction<StockInRecord>) => {
      state.stockInRecords.unshift(action.payload)
      // Update product stock
      action.payload.products.forEach(stockProduct => {
        const product = state.products.find(p => p.sku === stockProduct.productId)
        if (product) {
          product.stock += stockProduct.qty
        }
      })
    },
    setSelectedVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.selectedVendor = action.payload
    },
    addVendor: (state, action: PayloadAction<Vendor>) => {
      state.vendors.push(action.payload)
    },
    updateVendor: (state, action: PayloadAction<{ id: string; updates: Partial<Vendor> }>) => {
      const index = state.vendors.findIndex(v => v.id === action.payload.id)
      if (index !== -1) {
        state.vendors[index] = { ...state.vendors[index], ...action.payload.updates }
      }
    },
    deleteVendor: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(v => v.id !== action.payload)
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload)
    },
    updateCustomer: (state, action: PayloadAction<{ id: string; updates: Partial<Customer> }>) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.customers[index] = { ...state.customers[index], ...action.payload.updates }
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(c => c.id !== action.payload)
    }
  }
})

export const {
  setLoading,
  setError,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  addStockInRecord,
  setSelectedVendor,
  addVendor,
  updateVendor,
  deleteVendor,
  addCustomer,
  updateCustomer,
  deleteCustomer
} = productSlice.actions

export default productSlice.reducer