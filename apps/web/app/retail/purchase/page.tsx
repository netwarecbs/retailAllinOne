'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { useRouter } from 'next/navigation'
import { RootState, AppDispatch } from '@retail/shared'
import {
    setChallanSelectedVendor,
    selectChallan,
    deselectChallan,
    createPurchaseBill,
    updatePurchaseBillProduct,
    updatePaymentEntry,
    updateAdvanceAmount,
    submitPurchaseBill,
    processPurchaseBill,
    addChallanFromStockIn,
    selectProductForPayment,
    updateProductPaymentStatus,
    processPartialPayment
} from '@retail/shared'
import { useToast } from '../hooks/useToast'
import VendorSelector from './components/VendorSelector'
import PendingChallansTable from './components/PendingChallansTable'
import ChallanProductTable from './components/ChallanProductTable'
import PaymentEntryForm from './components/PaymentEntryForm'
import PurchaseBillSummary from './components/PurchaseBillSummary'

export default function PurchasePage() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { showSuccess, showError, showWarning, showInfo } = useToast()

    const {
        selectedVendor,
        pendingChallans,
        selectedChallans,
        currentPurchaseBill,
        paymentHistory,
        loading,
        challans
    } = useSelector((state: RootState) => state.challan)

    const { vendors } = useSelector((state: RootState) => state.products)

    const [showVendorModal, setShowVendorModal] = useState(false)
    const [vendorSearchTerm, setVendorSearchTerm] = useState('')
    const [billNo, setBillNo] = useState('')
    const [billDate, setBillDate] = useState(new Date().toLocaleDateString('en-GB'))

    // Debug: Log when pending challans change
    useEffect(() => {
        console.log('Pending challans updated:', pendingChallans)
        console.log('Selected vendor:', selectedVendor)
    }, [pendingChallans, selectedVendor])

    // Debug: Log initial state when component mounts
    useEffect(() => {
        console.log('Purchase page mounted - Initial state:')
        console.log('All challans:', challans)
        console.log('Pending challans:', pendingChallans)
        console.log('Selected vendor:', selectedVendor)
    }, [])

    const handleVendorSelect = (vendorId: string) => {
        console.log('Selected vendor ID:', vendorId, 'Type:', typeof vendorId)
        console.log('All challans in store:', challans)
        console.log('Challans for this vendor:', challans.filter(c => c.vendorId === vendorId))
        dispatch(setChallanSelectedVendor(vendorId))
        setShowVendorModal(false)
        setVendorSearchTerm('')
        showInfo('Vendor Selected', `Selected vendor with ${pendingChallans.length} pending challans`)
    }

    // Debug function to add a test challan
    const addTestChallan = () => {
        console.log('Adding test challan for SUP001')
        dispatch(addChallanFromStockIn({
            id: `TEST-${Date.now()}`,
            vendorId: 'SUP001',
            vendorName: 'Sunrise Distributors',
            challanDate: new Date().toLocaleDateString('en-GB'),
            challanNo: `TEST-${Date.now()}`,
            transportName: 'Test Transport',
            transportNo: 'TT001',
            transportCharges: 100,
            products: [{
                productId: 'TEST-PROD',
                productName: 'Test Product',
                qty: 10,
                unitPrice: 50,
                totalPrice: 500,
                batchNo: 'BATCH001',
                mfDate: new Date().toLocaleDateString('en-GB'),
                expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
            }],
            totalAmount: 500
        }))
        showSuccess('Test Challan Added', 'Test challan created for Sunrise Distributors')
    }

    const handleChallanSelect = (challanId: string) => {
        dispatch(selectChallan(challanId))
        showInfo('Challan Selected', 'Challan added to selection')
    }

    const handleChallanDeselect = (challanId: string) => {
        dispatch(deselectChallan(challanId))
        showInfo('Challan Deselected', 'Challan removed from selection')
    }

    const handleCreateBill = () => {
        if (!billNo || !billDate) {
            showError('Missing Information', 'Please fill in bill number and date')
            return
        }

        dispatch(createPurchaseBill({
            billNo,
            billDate,
            challanIds: selectedChallans
        }))

        showSuccess('Purchase Bill Created', 'Bill created successfully')
    }

    const handleSubmitBill = () => {
        if (currentPurchaseBill) {
            // Update inventory stock
            dispatch(processPurchaseBill({
                products: currentPurchaseBill.products.map(product => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice
                }))
            }))

            // Submit the purchase bill
            dispatch(submitPurchaseBill())

            // Show success message
            showSuccess('Purchase Bill Submitted', 'Bill has been submitted successfully')

            // Reset form
            setBillNo('')
            setBillDate(new Date().toLocaleDateString('en-GB'))
        }
    }

    const handleProductSelection = (productId: string, isSelected: boolean) => {
        // Find the challan and product to update
        const challan = pendingChallans.find(c =>
            c.products.some(p => p.productId === productId)
        )

        if (challan) {
            dispatch(selectProductForPayment({
                challanId: challan.id,
                productId,
                isSelected
            }))
        }
    }

    const handlePartialPayment = (productId: string, paymentData: any) => {
        // Find the challan and product to update
        const challan = pendingChallans.find(c =>
            c.products.some(p => p.productId === productId)
        )

        if (challan) {
            dispatch(processPartialPayment({
                challanId: challan.id,
                productId,
                paymentAmount: paymentData.amount,
                paymentMethods: paymentData.paymentMethods,
                paymentDate: paymentData.paymentDate,
                reference: paymentData.reference
            }))

            showSuccess('Partial Payment Processed', `Payment of ₹${paymentData.amount} processed for product`)
        }
    }

    const selectedVendorData = vendors.find(v => v.id === selectedVendor)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-64"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="h-32 bg-gray-200 rounded"></div>
                                <div className="h-48 bg-gray-200 rounded"></div>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-3 py-2">
                {/* Compact Header */}
                <div className="mb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/retail')}
                                className="flex items-center space-x-1 text-xs h-7"
                            >
                                <span>←</span>
                                <span>Back</span>
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Purchase Management</h1>
                                <p className="text-xs text-gray-600">Create purchase bills from pending challans</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={addTestChallan}
                                size="sm"
                                className="bg-yellow-600 hover:bg-yellow-700 text-xs h-7"
                            >
                                Test Challan
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Compact Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Left Column - Vendor & Challans */}
                    <div className="lg:col-span-1 space-y-3">
                        {/* Compact Vendor Selection */}
                        <Card className="h-fit">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium">Vendor Selection</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 p-3">
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Search vendor..."
                                        value={vendorSearchTerm}
                                        onChange={(e) => setVendorSearchTerm(e.target.value)}
                                        className="flex-1 text-xs h-7"
                                    />
                                    <Button
                                        onClick={() => setShowVendorModal(true)}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-xs h-7"
                                    >
                                        Search
                                    </Button>
                                </div>

                                {selectedVendor && (
                                    <div className="bg-gray-50 p-2 rounded">
                                        <div className="text-xs">
                                            <p className="font-medium text-gray-900">
                                                {vendors.find(v => v.id === selectedVendor)?.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {pendingChallans.length} pending challans
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Compact Pending Challans */}
                        {selectedVendor && (
                            <Card className="h-fit">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium">
                                        Pending Challans ({pendingChallans.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {pendingChallans.map((challan) => (
                                            <div
                                                key={challan.id}
                                                className={`p-2 border rounded cursor-pointer transition-colors ${selectedChallans.includes(challan.id)
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => handleChallanSelect(challan.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-xs font-medium">{challan.challanNo}</p>
                                                        <p className="text-xs text-gray-600">{challan.challanDate}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium">₹{challan.totalAmount.toLocaleString()}</p>
                                                        <p className="text-xs text-gray-600">{challan.products.length} items</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Products & Payment */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Bill Creation */}
                        {selectedChallans.length > 0 && !currentPurchaseBill && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium">Create Purchase Bill</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 p-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Bill No *
                                            </label>
                                            <Input
                                                value={billNo}
                                                onChange={(e) => setBillNo(e.target.value)}
                                                placeholder="Enter bill number"
                                                className="text-xs h-7"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Bill Date *
                                            </label>
                                            <Input
                                                type="date"
                                                value={billDate}
                                                onChange={(e) => setBillDate(e.target.value)}
                                                className="text-xs h-7"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleCreateBill}
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-xs h-7"
                                        >
                                            Create Bill
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Selected Challan Products */}
                        {currentPurchaseBill && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium">
                                        Selected Products ({currentPurchaseBill.products.length} items)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <ChallanProductTable
                                        products={currentPurchaseBill.products}
                                        onProductUpdate={(productId, field, value) =>
                                            dispatch(updatePurchaseBillProduct({ productId, field, value }))
                                        }
                                        onProductSelection={handleProductSelection}
                                        onPartialPayment={handlePartialPayment}
                                        showSelection={true}
                                        showPaymentStatus={true}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Payment & Bill Summary */}
                        {currentPurchaseBill && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Payment Entry */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium">Payment Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2">
                                        <PaymentEntryForm
                                            paymentEntry={currentPurchaseBill.paymentEntry}
                                            remainingAmount={currentPurchaseBill.remainingAmount}
                                            advanceAmount={currentPurchaseBill.advanceAmount}
                                            onPaymentUpdate={(paymentData) =>
                                                dispatch(updatePaymentEntry(paymentData))
                                            }
                                            onAdvanceUpdate={(amount) =>
                                                dispatch(updateAdvanceAmount(amount))
                                            }
                                        />
                                    </CardContent>
                                </Card>

                                {/* Bill Summary */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-medium">Bill Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2">
                                        <PurchaseBillSummary
                                            totals={currentPurchaseBill.totals}
                                            remainingAmount={currentPurchaseBill.remainingAmount}
                                            onSubmit={handleSubmitBill}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Payment History */}
                        {paymentHistory.length > 0 && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium">Recent Payments</CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-1 px-1 text-xs font-medium text-gray-600">Date</th>
                                                    <th className="text-left py-1 px-1 text-xs font-medium text-gray-600">Invoice</th>
                                                    <th className="text-left py-1 px-1 text-xs font-medium text-gray-600">Vendor</th>
                                                    <th className="text-left py-1 px-1 text-xs font-medium text-gray-600">Amount</th>
                                                    <th className="text-left py-1 px-1 text-xs font-medium text-gray-600">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paymentHistory.slice(0, 5).map((payment, index) => (
                                                    <tr key={index} className="border-b hover:bg-gray-50">
                                                        <td className="py-1 px-1 text-xs">{payment.actionDate}</td>
                                                        <td className="py-1 px-1 text-xs">{payment.taxInvoiceNo}</td>
                                                        <td className="py-1 px-1 text-xs">{payment.vendorDescription}</td>
                                                        <td className="py-1 px-1 text-xs">₹{payment.amount.toLocaleString()}</td>
                                                        <td className="py-1 px-1 text-xs">
                                                            <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                                                {payment.operation}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Vendor Search Modal */}
                {showVendorModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-96 overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Select Vendor</h3>
                                <Button
                                    onClick={() => setShowVendorModal(false)}
                                    variant="outline"
                                    size="sm"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {vendors.filter(vendor =>
                                    vendor.name.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
                                    vendor.contact?.toLowerCase().includes(vendorSearchTerm.toLowerCase())
                                ).map(vendor => (
                                    <div
                                        key={vendor.id}
                                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleVendorSelect(vendor.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-sm">{vendor.name}</p>
                                                <p className="text-xs text-gray-600">{vendor.address}</p>
                                                <p className="text-xs text-gray-500">Contact: {vendor.contact}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">ID: {vendor.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
