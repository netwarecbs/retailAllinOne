import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Challan, PurchaseBill, PaymentEntry, PaymentHistory, PartialPaymentEntry, ProductSelectionState } from '../types/challan'

export interface ChallanState {
    challans: Challan[]
    pendingChallans: Challan[]
    selectedChallans: string[]
    currentPurchaseBill: PurchaseBill | null
    paymentHistory: PaymentHistory[]
    selectedVendor: string | null
    loading: boolean
    error: string | null
}

const initialState: ChallanState = {
    challans: [],
    pendingChallans: [],
    selectedChallans: [],
    currentPurchaseBill: null,
    paymentHistory: [],
    selectedVendor: null,
    loading: false,
    error: null
}

const challanSlice = createSlice({
    name: 'challan',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setChallans: (state, action: PayloadAction<Challan[]>) => {
            state.challans = action.payload
            state.pendingChallans = action.payload.filter(challan => challan.status === 'pending')
        },
        setSelectedVendor: (state, action: PayloadAction<string | null>) => {
            console.log('Setting selected vendor:', action.payload)
            console.log('Current challans:', state.challans.map(c => ({ id: c.id, vendorId: c.vendorId, status: c.status })))
            state.selectedVendor = action.payload
            if (action.payload) {
                // Filter pending challans for selected vendor
                const filteredChallans = state.challans.filter(
                    challan => challan.vendorId === action.payload && challan.status === 'pending'
                )
                console.log('Filtered challans for vendor:', filteredChallans)
                state.pendingChallans = filteredChallans
            } else {
                state.pendingChallans = []
            }
            state.selectedChallans = []
        },
        selectChallan: (state, action: PayloadAction<string>) => {
            if (!state.selectedChallans.includes(action.payload)) {
                state.selectedChallans.push(action.payload)
            }
        },
        deselectChallan: (state, action: PayloadAction<string>) => {
            state.selectedChallans = state.selectedChallans.filter(id => id !== action.payload)
        },
        clearSelectedChallans: (state) => {
            state.selectedChallans = []
        },
        createPurchaseBill: (state, action: PayloadAction<{
            billNo: string
            billDate: string
            vendorId: string
            vendorName: string
            challanIds: string[]
        }>) => {
            const { billNo, billDate, vendorId, vendorName, challanIds } = action.payload

            // Get selected challans
            const selectedChallans = state.challans.filter(challan =>
                challanIds.includes(challan.id)
            )

            // Create products from challans
            const products: any[] = []
            let slNo = 1

            selectedChallans.forEach(challan => {
                challan.products.forEach(product => {
                    products.push({
                        slNo: slNo++,
                        productId: product.productId,
                        productName: product.productName,
                        sku: product.sku,
                        quantity: product.quantity,
                        rate: product.unitPrice,
                        discount: 0,
                        taxableValue: product.taxableValue,
                        sgst: product.sgst,
                        cgst: product.cgst,
                        total: product.totalPrice,
                        billNo,
                        billDate,
                        challanId: challan.id,
                        challanNo: challan.challanNo
                    })
                })
            })

            // Calculate totals
            const totals = products.reduce((acc, product) => ({
                discount: acc.discount + product.discount,
                taxableValue: acc.taxableValue + product.taxableValue,
                sgst: acc.sgst + product.sgst,
                cgst: acc.cgst + product.cgst,
                total: acc.total + product.total
            }), { discount: 0, taxableValue: 0, sgst: 0, cgst: 0, total: 0 })

            const newPurchaseBill: PurchaseBill = {
                id: `PB-${Date.now()}`,
                billNo,
                billDate,
                vendorId,
                vendorName,
                challanIds,
                challanNumbers: selectedChallans.map(c => c.challanNo),
                products,
                paymentEntry: {
                    transactionTypes: ['cash'],
                    amounts: { cash: 0 },
                    paymentDate: new Date().toISOString().split('T')[0]
                },
                totals,
                status: 'draft',
                remainingAmount: totals.total,
                advanceAmount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            state.currentPurchaseBill = newPurchaseBill
        },
        updatePurchaseBillProduct: (state, action: PayloadAction<{
            productId: string
            field: string
            value: any
        }>) => {
            if (state.currentPurchaseBill) {
                const { productId, field, value } = action.payload
                const productIndex = state.currentPurchaseBill.products.findIndex(
                    p => p.productId === productId
                )

                if (productIndex !== -1) {
                    const product = state.currentPurchaseBill.products[productIndex]
                    const updatedProduct = { ...product, [field]: value }

                    // Recalculate product totals
                    if (field === 'quantity' || field === 'rate' || field === 'discount') {
                        const discountAmount = (updatedProduct.quantity * updatedProduct.rate * updatedProduct.discount) / 100
                        updatedProduct.taxableValue = (updatedProduct.quantity * updatedProduct.rate) - discountAmount
                        updatedProduct.sgst = (updatedProduct.taxableValue * 9) / 100 // Assuming 9% SGST
                        updatedProduct.cgst = (updatedProduct.taxableValue * 9) / 100 // Assuming 9% CGST
                        updatedProduct.total = updatedProduct.taxableValue + updatedProduct.sgst + updatedProduct.cgst
                    }

                    state.currentPurchaseBill.products[productIndex] = updatedProduct

                    // Recalculate bill totals
                    const totals = state.currentPurchaseBill.products.reduce((acc, product) => ({
                        discount: acc.discount + product.discount,
                        taxableValue: acc.taxableValue + product.taxableValue,
                        sgst: acc.sgst + product.sgst,
                        cgst: acc.cgst + product.cgst,
                        total: acc.total + product.total
                    }), { discount: 0, taxableValue: 0, sgst: 0, cgst: 0, total: 0 })

                    state.currentPurchaseBill.totals = totals
                    state.currentPurchaseBill.remainingAmount = totals.total - state.currentPurchaseBill.advanceAmount
                }
            }
        },
        updatePaymentEntry: (state, action: PayloadAction<Partial<PaymentEntry>>) => {
            if (state.currentPurchaseBill) {
                state.currentPurchaseBill.paymentEntry = {
                    ...state.currentPurchaseBill.paymentEntry,
                    ...action.payload
                }
            }
        },
        updateAdvanceAmount: (state, action: PayloadAction<number>) => {
            if (state.currentPurchaseBill) {
                state.currentPurchaseBill.advanceAmount = action.payload
                state.currentPurchaseBill.remainingAmount = state.currentPurchaseBill.totals.total - action.payload
            }
        },
        submitPurchaseBill: (state) => {
            if (state.currentPurchaseBill) {
                state.currentPurchaseBill.status = 'paid'

                // Mark selected challans as processed
                state.challans = state.challans.map(challan =>
                    state.currentPurchaseBill!.challanIds.includes(challan.id)
                        ? { ...challan, status: 'processed' as const }
                        : challan
                )

                // Update pending challans
                state.pendingChallans = state.challans.filter(
                    challan => challan.vendorId === state.selectedVendor && challan.status === 'pending'
                )

                // Clear current purchase bill
                state.currentPurchaseBill = null
                state.selectedChallans = []
            }
        },
        clearCurrentPurchaseBill: (state) => {
            state.currentPurchaseBill = null
            state.selectedChallans = []
        },
        addPaymentHistory: (state, action: PayloadAction<PaymentHistory>) => {
            state.paymentHistory.unshift(action.payload)
        },
        setPaymentHistory: (state, action: PayloadAction<PaymentHistory[]>) => {
            state.paymentHistory = action.payload
        },
        addChallanFromStockIn: (state, action: PayloadAction<{
            id: string
            vendorId: string
            vendorName: string
            challanDate: string
            challanNo: string
            transportName: string
            transportNo: string
            transportCharges: number
            products: any[]
            totalAmount: number
        }>) => {
            const stockInRecord = action.payload

            console.log('Adding challan from stock-in:', {
                vendorId: stockInRecord.vendorId,
                vendorName: stockInRecord.vendorName,
                challanNo: stockInRecord.challanNo,
                currentSelectedVendor: state.selectedVendor
            })

            // Convert stock-in record to challan format
            const challan: Challan = {
                id: stockInRecord.id,
                challanNo: stockInRecord.challanNo,
                challanDate: stockInRecord.challanDate,
                vendorId: stockInRecord.vendorId,
                vendorName: stockInRecord.vendorName,
                transportName: stockInRecord.transportName,
                transportNo: stockInRecord.transportNo,
                transportCharges: stockInRecord.transportCharges,
                status: 'pending',
                products: stockInRecord.products.map(product => ({
                    productId: product.productId,
                    productName: product.productName,
                    sku: product.productId,
                    quantity: product.qty,
                    unitPrice: product.unitPrice,
                    totalPrice: product.totalPrice,
                    batchNo: product.batchNo,
                    mfDate: product.mfDate,
                    expDate: product.expDate,
                    hsnCode: '',
                    gstRate: 18, // Default GST rate
                    taxableValue: product.totalPrice,
                    sgst: (product.totalPrice * 9) / 100,
                    cgst: (product.totalPrice * 9) / 100,
                    isSelected: false,
                    paymentStatus: 'unpaid',
                    isEditable: true
                })),
                totalAmount: stockInRecord.totalAmount,
                taxableAmount: stockInRecord.totalAmount,
                totalGst: (stockInRecord.totalAmount * 18) / 100,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            state.challans.push(challan)
            console.log('Challan added to store. Total challans:', state.challans.length)

            // Update pending challans if vendor is selected
            if (state.selectedVendor === challan.vendorId) {
                state.pendingChallans.push(challan)
                console.log('Challan added to pending list for selected vendor')
            } else {
                console.log('Vendor not selected, challan not added to pending list')
            }
        },
        // New actions for partial payment management
        selectProductForPayment: (state, action: PayloadAction<{
            challanId: string
            productId: string
            isSelected: boolean
        }>) => {
            const { challanId, productId, isSelected } = action.payload

            // Update challan product selection
            state.challans = state.challans.map(challan => {
                if (challan.id === challanId) {
                    return {
                        ...challan,
                        products: challan.products.map(product =>
                            product.productId === productId
                                ? { ...product, isSelected }
                                : product
                        )
                    }
                }
                return challan
            })

            // Update pending challans
            state.pendingChallans = state.pendingChallans.map(challan => {
                if (challan.id === challanId) {
                    return {
                        ...challan,
                        products: challan.products.map(product =>
                            product.productId === productId
                                ? { ...product, isSelected }
                                : product
                        )
                    }
                }
                return challan
            })
        },
        updateProductPaymentStatus: (state, action: PayloadAction<{
            challanId: string
            productId: string
            paymentStatus: 'unpaid' | 'partially_paid' | 'fully_paid' | 'pending'
            partialPaymentAmount?: number
            billId?: string
            billNo?: string
            paymentDate?: string
        }>) => {
            const { challanId, productId, paymentStatus, partialPaymentAmount, billId, billNo, paymentDate } = action.payload

            // Update challan product payment status
            state.challans = state.challans.map(challan => {
                if (challan.id === challanId) {
                    return {
                        ...challan,
                        products: challan.products.map(product =>
                            product.productId === productId
                                ? {
                                    ...product,
                                    paymentStatus,
                                    partialPaymentAmount,
                                    billId,
                                    billNo,
                                    paymentDate,
                                    isEditable: paymentStatus === 'unpaid' || paymentStatus === 'pending'
                                }
                                : product
                        )
                    }
                }
                return challan
            })

            // Update pending challans
            state.pendingChallans = state.pendingChallans.map(challan => {
                if (challan.id === challanId) {
                    return {
                        ...challan,
                        products: challan.products.map(product =>
                            product.productId === productId
                                ? {
                                    ...product,
                                    paymentStatus,
                                    partialPaymentAmount,
                                    billId,
                                    billNo,
                                    paymentDate,
                                    isEditable: paymentStatus === 'unpaid' || paymentStatus === 'pending'
                                }
                                : product
                        )
                    }
                }
                return challan
            })
        },
        processPartialPayment: (state, action: PayloadAction<{
            challanId: string
            productId: string
            paymentAmount: number
            paymentMethods: {
                cash?: number
                cheque?: number
                credit?: number
                discount?: number
                upi?: number
            }
            paymentDate: string
            reference?: string
        }>) => {
            const { challanId, productId, paymentAmount, paymentMethods, paymentDate, reference } = action.payload

            // Find the product and update its payment status
            state.challans = state.challans.map(challan => {
                if (challan.id === challanId) {
                    return {
                        ...challan,
                        products: challan.products.map(product => {
                            if (product.productId === productId) {
                                const currentPaidAmount = product.partialPaymentAmount || 0
                                const newPaidAmount = currentPaidAmount + paymentAmount
                                const totalAmount = product.totalPrice

                                let newPaymentStatus: 'unpaid' | 'partially_paid' | 'fully_paid' | 'pending'
                                if (newPaidAmount >= totalAmount) {
                                    newPaymentStatus = 'fully_paid'
                                } else if (newPaidAmount > 0) {
                                    newPaymentStatus = 'partially_paid'
                                } else {
                                    newPaymentStatus = 'unpaid'
                                }

                                return {
                                    ...product,
                                    paymentStatus: newPaymentStatus,
                                    partialPaymentAmount: newPaidAmount,
                                    isEditable: newPaymentStatus === 'unpaid' || newPaymentStatus === 'pending'
                                }
                            }
                            return product
                        })
                    }
                }
                return challan
            })

            // Update pending challans
            state.pendingChallans = state.pendingChallans.map(challan => {
                if (challan.id === challanId) {
                    return {
                        ...challan,
                        products: challan.products.map(product => {
                            if (product.productId === productId) {
                                const currentPaidAmount = product.partialPaymentAmount || 0
                                const newPaidAmount = currentPaidAmount + paymentAmount
                                const totalAmount = product.totalPrice

                                let newPaymentStatus: 'unpaid' | 'partially_paid' | 'fully_paid' | 'pending'
                                if (newPaidAmount >= totalAmount) {
                                    newPaymentStatus = 'fully_paid'
                                } else if (newPaidAmount > 0) {
                                    newPaymentStatus = 'partially_paid'
                                } else {
                                    newPaymentStatus = 'unpaid'
                                }

                                return {
                                    ...product,
                                    paymentStatus: newPaymentStatus,
                                    partialPaymentAmount: newPaidAmount,
                                    isEditable: newPaymentStatus === 'unpaid' || newPaymentStatus === 'pending'
                                }
                            }
                            return product
                        })
                    }
                }
                return challan
            })
        }
    }
})

export const {
    setLoading,
    setError,
    setChallans,
    setSelectedVendor,
    selectChallan,
    deselectChallan,
    clearSelectedChallans,
    createPurchaseBill,
    updatePurchaseBillProduct,
    updatePaymentEntry,
    updateAdvanceAmount,
    submitPurchaseBill,
    clearCurrentPurchaseBill,
    addPaymentHistory,
    setPaymentHistory,
    addChallanFromStockIn,
    selectProductForPayment,
    updateProductPaymentStatus,
    processPartialPayment
} = challanSlice.actions

export default challanSlice.reducer
