import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    challans: [],
    pendingChallans: [],
    selectedChallans: [],
    currentPurchaseBill: null,
    paymentHistory: [],
    selectedVendor: null,
    loading: false,
    error: null
};
const challanSlice = createSlice({
    name: 'challan',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setChallans: (state, action) => {
            state.challans = action.payload;
            state.pendingChallans = action.payload.filter(challan => challan.status === 'pending');
        },
        setSelectedVendor: (state, action) => {
            console.log('Setting selected vendor:', action.payload);
            console.log('Current challans:', state.challans.map(c => ({ id: c.id, vendorId: c.vendorId, status: c.status })));
            state.selectedVendor = action.payload;
            if (action.payload) {
                // Filter pending challans for selected vendor
                const filteredChallans = state.challans.filter(challan => challan.vendorId === action.payload && challan.status === 'pending');
                console.log('Filtered challans for vendor:', filteredChallans);
                state.pendingChallans = filteredChallans;
            }
            else {
                state.pendingChallans = [];
            }
            state.selectedChallans = [];
        },
        selectChallan: (state, action) => {
            if (!state.selectedChallans.includes(action.payload)) {
                state.selectedChallans.push(action.payload);
            }
        },
        deselectChallan: (state, action) => {
            state.selectedChallans = state.selectedChallans.filter(id => id !== action.payload);
        },
        clearSelectedChallans: (state) => {
            state.selectedChallans = [];
        },
        createPurchaseBill: (state, action) => {
            const { billNo, billDate, vendorId, vendorName, challanIds } = action.payload;
            // Get selected challans
            const selectedChallans = state.challans.filter(challan => challanIds.includes(challan.id));
            // Create products from challans
            const products = [];
            let slNo = 1;
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
                    });
                });
            });
            // Calculate totals
            const totals = products.reduce((acc, product) => ({
                discount: acc.discount + product.discount,
                taxableValue: acc.taxableValue + product.taxableValue,
                sgst: acc.sgst + product.sgst,
                cgst: acc.cgst + product.cgst,
                total: acc.total + product.total
            }), { discount: 0, taxableValue: 0, sgst: 0, cgst: 0, total: 0 });
            const newPurchaseBill = {
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
            };
            state.currentPurchaseBill = newPurchaseBill;
        },
        updatePurchaseBillProduct: (state, action) => {
            if (state.currentPurchaseBill) {
                const { productId, field, value } = action.payload;
                const productIndex = state.currentPurchaseBill.products.findIndex(p => p.productId === productId);
                if (productIndex !== -1) {
                    const product = state.currentPurchaseBill.products[productIndex];
                    const updatedProduct = { ...product, [field]: value };
                    // Recalculate product totals
                    if (field === 'quantity' || field === 'rate' || field === 'discount') {
                        const discountAmount = (updatedProduct.quantity * updatedProduct.rate * updatedProduct.discount) / 100;
                        updatedProduct.taxableValue = (updatedProduct.quantity * updatedProduct.rate) - discountAmount;
                        updatedProduct.sgst = (updatedProduct.taxableValue * 9) / 100; // Assuming 9% SGST
                        updatedProduct.cgst = (updatedProduct.taxableValue * 9) / 100; // Assuming 9% CGST
                        updatedProduct.total = updatedProduct.taxableValue + updatedProduct.sgst + updatedProduct.cgst;
                    }
                    state.currentPurchaseBill.products[productIndex] = updatedProduct;
                    // Recalculate bill totals
                    const totals = state.currentPurchaseBill.products.reduce((acc, product) => ({
                        discount: acc.discount + product.discount,
                        taxableValue: acc.taxableValue + product.taxableValue,
                        sgst: acc.sgst + product.sgst,
                        cgst: acc.cgst + product.cgst,
                        total: acc.total + product.total
                    }), { discount: 0, taxableValue: 0, sgst: 0, cgst: 0, total: 0 });
                    state.currentPurchaseBill.totals = totals;
                    state.currentPurchaseBill.remainingAmount = totals.total - state.currentPurchaseBill.advanceAmount;
                }
            }
        },
        updatePaymentEntry: (state, action) => {
            if (state.currentPurchaseBill) {
                state.currentPurchaseBill.paymentEntry = {
                    ...state.currentPurchaseBill.paymentEntry,
                    ...action.payload
                };
            }
        },
        updateAdvanceAmount: (state, action) => {
            if (state.currentPurchaseBill) {
                state.currentPurchaseBill.advanceAmount = action.payload;
                state.currentPurchaseBill.remainingAmount = state.currentPurchaseBill.totals.total - action.payload;
            }
        },
        submitPurchaseBill: (state) => {
            if (state.currentPurchaseBill) {
                state.currentPurchaseBill.status = 'paid';
                // Mark selected challans as processed
                state.challans = state.challans.map(challan => state.currentPurchaseBill.challanIds.includes(challan.id)
                    ? { ...challan, status: 'processed' }
                    : challan);
                // Update pending challans
                state.pendingChallans = state.challans.filter(challan => challan.vendorId === state.selectedVendor && challan.status === 'pending');
                // Clear current purchase bill
                state.currentPurchaseBill = null;
                state.selectedChallans = [];
            }
        },
        clearCurrentPurchaseBill: (state) => {
            state.currentPurchaseBill = null;
            state.selectedChallans = [];
        },
        addPaymentHistory: (state, action) => {
            state.paymentHistory.unshift(action.payload);
        },
        setPaymentHistory: (state, action) => {
            state.paymentHistory = action.payload;
        },
        addChallanFromStockIn: (state, action) => {
            const stockInRecord = action.payload;
            console.log('Adding challan from stock-in:', {
                vendorId: stockInRecord.vendorId,
                vendorName: stockInRecord.vendorName,
                challanNo: stockInRecord.challanNo,
                currentSelectedVendor: state.selectedVendor
            });
            // Convert stock-in record to challan format
            const challan = {
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
                    cgst: (product.totalPrice * 9) / 100
                })),
                totalAmount: stockInRecord.totalAmount,
                taxableAmount: stockInRecord.totalAmount,
                totalGst: (stockInRecord.totalAmount * 18) / 100,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            state.challans.push(challan);
            console.log('Challan added to store. Total challans:', state.challans.length);
            // Update pending challans if vendor is selected
            if (state.selectedVendor === challan.vendorId) {
                state.pendingChallans.push(challan);
                console.log('Challan added to pending list for selected vendor');
            }
            else {
                console.log('Vendor not selected, challan not added to pending list');
            }
        }
    }
});
export const { setLoading, setError, setChallans, setSelectedVendor, selectChallan, deselectChallan, clearSelectedChallans, createPurchaseBill, updatePurchaseBillProduct, updatePaymentEntry, updateAdvanceAmount, submitPurchaseBill, clearCurrentPurchaseBill, addPaymentHistory, setPaymentHistory, addChallanFromStockIn } = challanSlice.actions;
export default challanSlice.reducer;
