'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Input } from '@retail/ui'
import { ActionGate } from '../../../components/RBAC'
import { RootState, AppDispatch, setExtraLess, setSavings, updatePaymentAmount, holdInvoice, loadHeldInvoice, removeHeldInvoice, setInvoiceNumber, createSale } from '@retail/shared'
import ProductSelector from '../../../components/ProductSelector'
import CustomerSelector from '../../../components/CustomerSelector'
import Cart from '../../../components/Cart'
import toast, { Toaster } from 'react-hot-toast'

export default function GarmentSalesPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
    const {
        cart,
        subtotal,
        discount,
        tax,
        total,
        customer,
        extraLess,
        savings,
        invoiceTotal,
        paymentDetails,
        heldInvoices,
        currentInvoiceNumber,
        loading
    } = useSelector((state: RootState) => state.sales)

    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')

    // New states for payment inputs
    const [extraLessInput, setExtraLessInput] = useState('')
    const [savingsInput, setSavingsInput] = useState('')
    const [cashInput, setCashInput] = useState('')
    const [cardInput, setCardInput] = useState('')
    const [upiInput, setUpiInput] = useState('')
    const [changeInput, setChangeInput] = useState('')

    // Modal states
    const [showHeldInvoicesModal, setShowHeldInvoicesModal] = useState(false)
    const [showInvoicePreview, setShowInvoicePreview] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

    // Initialize invoice number on component mount
    useEffect(() => {
        if (!currentInvoiceNumber) {
            const newInvoiceNumber = `INV-${Date.now()}`
            dispatch(setInvoiceNumber(newInvoiceNumber))
        }
    }, [dispatch, currentInvoiceNumber])

    // Update input fields when Redux state changes
    useEffect(() => {
        setExtraLessInput(extraLess.toString())
        setSavingsInput(savings.toString())
        setCashInput(paymentDetails.cashAmount.toString())
        setCardInput(paymentDetails.cardAmount.toString())
        setUpiInput(paymentDetails.upiAmount.toString())
        setChangeInput(paymentDetails.changeGiven.toString())
    }, [extraLess, savings, paymentDetails])

    // New handler functions for payment and invoice management
    const handleExtraLessChange = (value: string) => {
        setExtraLessInput(value)
        const numValue = parseFloat(value) || 0
        dispatch(setExtraLess(numValue))
    }

    const handleSavingsChange = (value: string) => {
        setSavingsInput(value)
        const numValue = parseFloat(value) || 0
        dispatch(setSavings(numValue))
    }

    const handlePaymentChange = (method: 'cashAmount' | 'cardAmount' | 'upiAmount', value: string) => {
        const numValue = parseFloat(value) || 0
        dispatch(updatePaymentAmount({ method, amount: numValue }))
    }

    const handleSaveSale = async () => {
        if (cart.length === 0) {
            toast.error('No items in cart to save', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        if (!customer) {
            toast.error('Please select a customer', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        try {
            const saleData = {
                invoiceNumber: currentInvoiceNumber,
                customerId: customer.id,
                customerName: customer.name,
                customerPhone: customer.phone,
                customerAddress: customer.address,
                customerGstNo: customer.gstin,
                items: cart.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    productName: item.productName,
                    sku: item.sku,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount,
                    tax: item.tax,
                    total: item.total,
                    stockAfterSale: item.stockAfterSale
                })),
                subtotal,
                discount,
                tax,
                total: invoiceTotal,
                paymentMethod: { type: 'cash' as const, amount: paymentDetails.cashAmount },
                paymentDetails,
                status: 'completed' as const,
                notes: `Extra/Less: ${extraLess}, Savings: ${savings}`
            }

            await dispatch(createSale(saleData)).unwrap()
            toast.success('Sale saved successfully!', {
                duration: 3000,
                style: {
                    background: '#10B981',
                    color: '#fff',
                },
            })
        } catch (error) {
            console.error('Error saving sale:', error)
            toast.error('Failed to save sale. Please try again.', {
                duration: 5000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
        }
    }

    const handleSaveAndPrint = async () => {
        if (cart.length === 0) {
            toast.error('No items in cart to save', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        if (!customer) {
            toast.error('Please select a customer', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        setShowInvoicePreview(true)
    }

    const handleGeneratePDF = async () => {
        if (cart.length === 0) {
            toast.error('No items in cart to generate PDF', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        // TODO: Implement PDF generation
        toast('PDF generation feature will be implemented soon!', {
            duration: 4000,
            style: {
                background: '#3B82F6',
                color: '#fff',
            },
        })
    }

    const handleHoldInvoice = () => {
        if (cart.length === 0) {
            toast.error('No items in cart to hold', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        dispatch(holdInvoice())
        toast.success('Invoice held successfully!', {
            duration: 3000,
            style: {
                background: '#10B981',
                color: '#fff',
            },
        })
    }

    const handleViewAllHeld = () => {
        setShowHeldInvoicesModal(true)
    }

    const handleLoadHeldInvoice = (invoiceId: string) => {
        dispatch(loadHeldInvoice(invoiceId))
        setShowHeldInvoicesModal(false)
        toast.success('Invoice loaded successfully!', {
            duration: 3000,
            style: {
                background: '#10B981',
                color: '#fff',
            },
        })
    }

    const handleRemoveHeldInvoice = (invoiceId: string) => {
        setInvoiceToDelete(invoiceId)
        setShowConfirmModal(true)
    }

    const confirmRemoveHeldInvoice = () => {
        if (invoiceToDelete) {
            dispatch(removeHeldInvoice(invoiceToDelete))
            toast.success('Held invoice removed successfully!', {
                duration: 3000,
                style: {
                    background: '#10B981',
                    color: '#fff',
                },
            })
            setInvoiceToDelete(null)
            setShowConfirmModal(false)
        }
    }

    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Title bar - compact */}
                <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">{'<<'} SALES</div>

                {/* Header form */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                            {/* Left column */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Type</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>Sales</option>
                                    </select>
                                </div>
                                <div className="col-span-8">
                                    <label className="block text-gray-600 mb-1">Invoice No.</label>
                                    <Input
                                        className="h-8"
                                        value={currentInvoiceNumber}
                                        onChange={(e) => dispatch(setInvoiceNumber(e.target.value))}
                                    />
                                </div>

                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Invoice Date</label>
                                    <Input
                                        type="date"
                                        className="h-8"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Notes</label>
                                    <Input
                                        className="h-8"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Optional notes"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Status</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>Draft</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-12 grid grid-cols-3 gap-2">
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Items</div>
                                        <div className="text-gray-700 font-medium">{cart.length}</div>
                                    </div>
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Total Qty</div>
                                        <div className="text-gray-700 font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                                    </div>
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Total</div>
                                        <div className="text-gray-700 font-medium">₹{invoiceTotal.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">State</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>West Bengal (19)</option>
                                    </select>
                                </div>
                                <div className="col-span-12">
                                    <label className="inline-flex items-center gap-2 mt-1">
                                        <input
                                            type="checkbox"
                                            checked={customer?.isWholesale || false}
                                            readOnly
                                        />
                                        Wholesale
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Selection */}
                <CustomerSelector
                    selectedCustomer={customer}
                    onCustomerSelect={(selectedCustomer) => {
                        console.log('Customer selected:', selectedCustomer);
                    }}
                />

                {/* Product Selection */}
                <ProductSelector />

                {/* Cart and Payment */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Cart */}
                    <div className="md:col-span-3">
                        <Cart />
                    </div>

                    {/* Payment Sidebar */}
                    <Card className="border-0 shadow-sm md:col-span-1">
                        <CardContent className="p-3 space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span>Payment Method</span>
                                <select
                                    className="border rounded px-2 py-1"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal :</span>
                                    <span className="font-medium text-gray-600">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Discount :</span>
                                    <span className="font-medium text-gray-600">₹{discount.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>GST (5%) :</span>
                                    <span className="font-medium text-gray-600">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t pt-2">
                                    <span>Invoice Total :</span>
                                    <span className="font-bold text-lg">₹{invoiceTotal.toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 items-center pt-2">
                                    <span>Payment in Cash</span>
                                    <Input
                                        type="number"
                                        className="h-7 text-right"
                                        value={cashInput}
                                        onChange={(e) => handlePaymentChange('cashAmount', e.target.value)}
                                        disabled={paymentMethod !== 'cash'}
                                    />
                                    <span>Payment in Card</span>
                                    <Input
                                        type="number"
                                        className="h-7 text-right"
                                        value={cardInput}
                                        onChange={(e) => handlePaymentChange('cardAmount', e.target.value)}
                                        disabled={paymentMethod !== 'card'}
                                    />
                                    <span>Payment in UPI</span>
                                    <Input
                                        type="number"
                                        className="h-7 text-right"
                                        value={upiInput}
                                        onChange={(e) => handlePaymentChange('upiAmount', e.target.value)}
                                        disabled={paymentMethod !== 'upi'}
                                    />
                                    <span>Change Given</span>
                                    <Input
                                        type="number"
                                        className="h-7 text-right bg-gray-100"
                                        value={changeInput}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom payment summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
                    <div className="lg:col-span-7 grid grid-cols-7 gap-2">
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Extra/Less</div>
                            <Input
                                className="h-7 text-right"
                                value={extraLessInput}
                                onChange={(e) => handleExtraLessChange(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Savings</div>
                            <Input
                                className="h-7 text-right"
                                value={savingsInput}
                                onChange={(e) => handleSavingsChange(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Invoice Total</div>
                            <Input
                                className="h-7 text-right font-semibold"
                                value={invoiceTotal.toFixed(2)}
                                readOnly
                            />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Cash</div>
                            <Input
                                className="h-7 text-right"
                                value={cashInput}
                                onChange={(e) => handlePaymentChange('cashAmount', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Card</div>
                            <Input
                                className="h-7 text-right"
                                value={cardInput}
                                onChange={(e) => handlePaymentChange('cardAmount', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">UPI</div>
                            <Input
                                className="h-7 text-right"
                                value={upiInput}
                                onChange={(e) => handlePaymentChange('upiAmount', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Change Given</div>
                            <Input
                                className="h-7 text-right"
                                value={changeInput}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-3">
                        <ActionGate tile="garment" page="sales" action="save" fallback={null}>
                            <Button
                                className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                onClick={handleSaveSale}
                                disabled={loading || cart.length === 0}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </ActionGate>
                        <ActionGate tile="garment" page="sales" action="print" fallback={null}>
                            <Button
                                className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                onClick={handleSaveAndPrint}
                                disabled={loading || cart.length === 0}
                            >
                                Save & Print
                            </Button>
                        </ActionGate>
                        <ActionGate tile="garment" page="sales" action="pdf" fallback={null}>
                            <Button
                                className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                onClick={handleGeneratePDF}
                                disabled={cart.length === 0}
                            >
                                PDF
                            </Button>
                        </ActionGate>
                        <Button
                            className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                            onClick={handleHoldInvoice}
                            disabled={cart.length === 0}
                        >
                            Hold
                        </Button>
                        <Button
                            className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                            onClick={handleViewAllHeld}
                        >
                            View({heldInvoices.length})
                        </Button>
                    </div>
                </div>
            </div>

            {/* Held Invoices Modal */}
            {showHeldInvoicesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Held Invoices ({heldInvoices.length})</h3>
                            <button
                                onClick={() => setShowHeldInvoicesModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Held Invoices List */}
                        <div className="p-4">
                            {heldInvoices.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No held invoices found
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {heldInvoices.map((invoice) => (
                                        <div key={invoice.id} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        Invoice: {invoice.invoiceNumber}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Customer: {invoice.customer?.name || 'No Customer'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Held: {new Date(invoice.heldAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        ₹{invoice.invoiceTotal.toFixed(2)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {invoice.cart.length} items
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Invoice Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Subtotal:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.subtotal.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Savings:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.savings.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Extra/Less:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.extraLess.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Tax:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.tax.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Cart Items Preview */}
                                            <div className="mb-3">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Items:</h5>
                                                <div className="max-h-32 overflow-y-auto">
                                                    {invoice.cart.map((item, index) => (
                                                        <div key={item.id} className="flex justify-between text-xs py-1">
                                                            <span className="truncate flex-1">
                                                                {index + 1}. {item.productName}
                                                                {item.size && ` (${item.size})`}
                                                                {item.color && ` - ${item.color}`}
                                                            </span>
                                                            <span className="ml-2">
                                                                {item.quantity} × ₹{item.unitPrice} = ₹{item.total.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
                                                    onClick={() => handleLoadHeldInvoice(invoice.id)}
                                                >
                                                    Load Invoice
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="h-8 text-red-600 border-red-300 hover:bg-red-50 text-xs px-3"
                                                    onClick={() => handleRemoveHeldInvoice(invoice.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowHeldInvoicesModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Preview Modal */}
            {showInvoicePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
                            <button
                                onClick={() => setShowInvoicePreview(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Invoice Preview */}
                        <div className="p-4">
                            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg max-w-md mx-auto" id="invoice-print">
                                {/* Header */}
                                <div className="text-center p-4 border-b-2 border-gray-300">
                                    <div className="text-2xl font-bold text-gray-800 mb-1">FASHION STORE</div>
                                    <div className="text-sm text-gray-600 mb-1">Your Style, Your Way</div>
                                    <div className="text-xs text-gray-500">
                                        123 Fashion Street, Kolkata - 700001<br />
                                        Phone: +91 98765 43210 | GST: 19ABCDE1234F1Z5
                                    </div>
                                </div>

                                {/* Invoice Details */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">Invoice No:</div>
                                            <div className="text-sm text-gray-600">{currentInvoiceNumber}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-800">Date:</div>
                                            <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-sm font-semibold text-gray-800 mb-1">Customer Details:</div>
                                        <div className="text-sm text-gray-600">
                                            <div className="font-medium">{customer?.name}</div>
                                            <div>{customer?.phone}</div>
                                            <div>{customer?.address}</div>
                                            {customer?.gstin && <div>GST: {customer.gstin}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Items:</div>
                                    <div className="space-y-2">
                                        {cart.map((item, index) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.productName}</div>
                                                    <div className="text-xs text-gray-500">
                                                        SKU: {item.sku}
                                                        {item.size && ` | Size: ${item.size}`}
                                                        {item.color && ` | Color: ${item.color}`}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>{item.quantity} × ₹{item.unitPrice}</div>
                                                    <div className="font-semibold">₹{item.total.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        {savings > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Savings:</span>
                                                <span>-₹{savings.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Tax (5% GST):</span>
                                            <span>₹{tax.toFixed(2)}</span>
                                        </div>
                                        {extraLess !== 0 && (
                                            <div className="flex justify-between">
                                                <span>Extra/Less:</span>
                                                <span className={extraLess > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {extraLess > 0 ? '+' : ''}₹{extraLess.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-bold border-t pt-1">
                                            <span>Total:</span>
                                            <span>₹{invoiceTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Payment Details:</div>
                                    <div className="space-y-1 text-sm">
                                        {paymentDetails.cashAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span>Cash:</span>
                                                <span>₹{paymentDetails.cashAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {paymentDetails.cardAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span>Card:</span>
                                                <span>₹{paymentDetails.cardAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {paymentDetails.upiAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span>UPI:</span>
                                                <span>₹{paymentDetails.upiAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {paymentDetails.changeGiven > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Change:</span>
                                                <span>₹{paymentDetails.changeGiven.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 text-center">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Thank you for shopping with us!
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <div>Exchange/Return within 7 days with original receipt</div>
                                        <div>Keep this invoice for warranty purposes</div>
                                        <div className="mt-2">Visit us online: www.fashionstore.com</div>
                                    </div>
                                    <div className="mt-3 text-xs text-gray-400">
                                        Generated on {new Date().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowInvoicePreview(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={async () => {
                                    try {
                                        await handleSaveSale()
                                        // Print the invoice
                                        const printContent = document.getElementById('invoice-print')
                                        if (printContent) {
                                            const printWindow = window.open('', '_blank')
                                            if (printWindow) {
                                                printWindow.document.write(`
                                                    <html>
                                                        <head>
                                                            <title>Invoice - ${currentInvoiceNumber}</title>
                                                            <style>
                                                                body { 
                                                                    font-family: Arial, sans-serif; 
                                                                    margin: 0; 
                                                                    padding: 20px; 
                                                                    background: white;
                                                                }
                                                                @media print {
                                                                    body { margin: 0; }
                                                                    .no-print { display: none; }
                                                                }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            ${printContent.outerHTML}
                                                            <div class="no-print" style="margin-top: 20px; text-align: center;">
                                                                <button onclick="window.print()">Print Invoice</button>
                                                                <button onclick="window.close()">Close</button>
                                                            </div>
                                                        </body>
                                                    </html>
                                                `)
                                                printWindow.document.close()
                                            }
                                        }
                                        setShowInvoicePreview(false)
                                    } catch (error) {
                                        console.error('Error saving sale:', error)
                                        toast.error('Failed to save sale. Please try again.', {
                                            duration: 5000,
                                            style: {
                                                background: '#EF4444',
                                                color: '#fff',
                                            },
                                        })
                                    }
                                }}
                            >
                                Save & Print
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to remove this held invoice?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowConfirmModal(false)
                                        setInvoiceToDelete(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={confirmRemoveHeldInvoice}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10B981',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
        </main>
    )
}




