'use client'


import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent } from '@retail/ui'
import { ActionGate } from '../../../components/RBAC'
import { RootState, AppDispatch } from '@retail/shared'
import ProductSelector from '../../../components/ProductSelector'
import CustomerSelector from '../../../components/CustomerSelector'
import Cart from '../../../components/Cart'

export default function GarmentSalesPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
    const { cart, subtotal, discount, tax, total, customer } = useSelector((state: RootState) => state.sales)

    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`)
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [cashAmount, setCashAmount] = useState(0)
    const [cardAmount, setCardAmount] = useState(0)
    const [upiAmount, setUpiAmount] = useState(0)
    const [changeGiven, setChangeGiven] = useState(0)

    const handleSaveSale = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Sale saved successfully!')
        setLoading(false)
        setInvoiceNumber(`INV-${Date.now()}`)
        setNotes('')
    }

    const handlePaymentChange = (type: string, value: number) => {
        switch (type) {
            case 'cash':
                setCashAmount(value)
                setChangeGiven(Math.max(0, value - total))
                break
            case 'card':
                setCardAmount(value)
                break
            case 'upi':
                setUpiAmount(value)
                break
        }
    }

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method)
        // Reset other payment amounts when method changes
        if (method === 'cash') {
            setCardAmount(0)
            setUpiAmount(0)
        } else if (method === 'card') {
            setCashAmount(0)
            setUpiAmount(0)
        } else if (method === 'upi') {
            setCashAmount(0)
            setCardAmount(0)
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
                                    <input
                                        type="text"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </div>

                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Invoice Date</label>
                                    <input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Notes</label>
                                    <input
                                        type="text"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Optional notes"
                                        className="w-full border rounded px-2 py-1"
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
                                        <div className="text-gray-700 font-medium">₹{total.toFixed(2)}</div>
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
                                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
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
                                    <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 items-center pt-2">
                                    <span>Payment in Cash</span>
                                    <input
                                        type="number"
                                        value={cashAmount}
                                        onChange={(e) => handlePaymentChange('cash', parseFloat(e.target.value) || 0)}
                                        className="border rounded px-2 py-1 text-right"
                                        disabled={paymentMethod !== 'cash'}
                                    />
                                    <span>Payment in Card</span>
                                    <input
                                        type="number"
                                        value={cardAmount}
                                        onChange={(e) => handlePaymentChange('card', parseFloat(e.target.value) || 0)}
                                        className="border rounded px-2 py-1 text-right"
                                        disabled={paymentMethod !== 'card'}
                                    />
                                    <span>Payment in UPI</span>
                                    <input
                                        type="number"
                                        value={upiAmount}
                                        onChange={(e) => handlePaymentChange('upi', parseFloat(e.target.value) || 0)}
                                        className="border rounded px-2 py-1 text-right"
                                        disabled={paymentMethod !== 'upi'}
                                    />
                                    <span>Change Given</span>
                                    <input
                                        type="number"
                                        value={changeGiven}
                                        className="border rounded px-2 py-1 text-right bg-gray-100"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom action buttons + hold */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center gap-3">
                        <ActionGate tile="garment" page="sales" action="save" fallback={null}>
                            <Button
                                onClick={handleSaveSale}
                                disabled={loading || cart.length === 0}
                                className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </ActionGate>
                        <ActionGate tile="garment" page="sales" action="print" fallback={null}>
                            <Button
                                onClick={handleSaveSale}
                                disabled={loading || cart.length === 0}
                                className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4"
                            >
                                {loading ? 'Saving...' : 'Save & Print'}
                            </Button>
                        </ActionGate>
                        <ActionGate tile="garment" page="sales" action="pdf" fallback={null}>
                            <Button variant="outline" className="h-8 text-xs px-4">PDF</Button>
                        </ActionGate>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span>- -</span>
                        <Button variant="outline" className="h-8 text-xs px-4">Hold</Button>
                        <span>- -</span>
                        <Button variant="outline" className="h-8 text-xs px-4">View</Button>
                        <span>- on Hold(0)</span>
                    </div>
                </div>
            </div>
        </main>
    )
}




