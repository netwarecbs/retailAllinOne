'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@retail/ui'
import { ActionGate } from '../../../components/RBAC'
import PurchaseProductModal from '../../../components/PurchaseProductModal'
import { AppDispatch, RootState, fetchProducts, searchProductsByBarcode, Product } from '@retail/shared'
import toast, { Toaster } from 'react-hot-toast'

interface PurchaseItem {
    id: string
    productId: string
    productName: string
    sku: string
    barcode?: string
    category: string
    unit: string
    quantity: number
    purchaseRate: number
    profitPercentage: number
    hsnCode: string
    gstPercentage: number
    salePrice: number
    mrp: number
    total: number
}

interface Supplier {
    id: string
    name: string
    reference: string
    mobile: string
    address: string
    shipTo: string
    loyaltyCard: string
    gstNo: string
    state: string
}

export default function GarmentPurchasePage() {
    const dispatch = useDispatch<AppDispatch>()
    const { products, selectedProduct, loading } = useSelector((state: RootState) => state.products)

    // State management
    const [supplier, setSupplier] = useState<Supplier>({
        id: '',
        name: '',
        reference: '',
        mobile: '',
        address: '',
        shipTo: '',
        loyaltyCard: '',
        gstNo: '',
        state: 'West Bengal (19)'
    })

    const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [barcodeSearch, setBarcodeSearch] = useState('')
    const [brandSearch, setBrandSearch] = useState('')
    const [descriptionSearch, setDescriptionSearch] = useState('')
    const [showProductModal, setShowProductModal] = useState(false)
    const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null)
    const [expenseCategory, setExpenseCategory] = useState('')
    const [paymentMethods, setPaymentMethods] = useState({
        cash: 0,
        card: 0,
        upi: 0
    })

    // Load products on component mount
    useEffect(() => {
        dispatch(fetchProducts({ limit: 50 }))
    }, [dispatch])

    // Handle barcode search
    const handleBarcodeSearch = useCallback(async (barcode: string) => {
        if (barcode.trim()) {
            try {
                await dispatch(searchProductsByBarcode(barcode)).unwrap()
                toast.success('Product found!')
            } catch (error) {
                toast.error('Product not found')
            }
        }
    }, [dispatch])

    // Add product to purchase items
    const addProductToPurchase = (product: Product) => {
        const existingItem = purchaseItems.find(item => item.productId === product.id)

        if (existingItem) {
            setPurchaseItems(prev => prev.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.purchaseRate }
                    : item
            ))
        } else {
            const newItem: PurchaseItem = {
                id: Date.now().toString(),
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                barcode: product.barcode,
                category: product.category,
                unit: product.unit,
                quantity: 1,
                purchaseRate: product.costPrice,
                profitPercentage: 20, // Default 20% profit
                hsnCode: '',
                gstPercentage: 18, // Default 18% GST
                salePrice: product.price,
                mrp: product.mrp,
                total: product.costPrice
            }
            setPurchaseItems(prev => [...prev, newItem])
        }
        toast.success(`${product.name} added to purchase order`)
    }

    // Update purchase item
    const updatePurchaseItem = (id: string, field: keyof PurchaseItem, value: any) => {
        setPurchaseItems(prev => prev.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value }

                // Recalculate totals
                if (field === 'quantity' || field === 'purchaseRate') {
                    updatedItem.total = updatedItem.quantity * updatedItem.purchaseRate
                }

                // Recalculate sale price based on profit percentage
                if (field === 'purchaseRate' || field === 'profitPercentage') {
                    const profitAmount = (updatedItem.purchaseRate * updatedItem.profitPercentage) / 100
                    updatedItem.salePrice = updatedItem.purchaseRate + profitAmount
                }

                return updatedItem
            }
            return item
        }))
    }

    // Remove purchase item
    const removePurchaseItem = (id: string) => {
        setPurchaseItems(prev => prev.filter(item => item.id !== id))
        toast.success('Item removed from purchase order')
    }

    // Calculate totals
    const calculateTotals = () => {
        const subtotal = purchaseItems.reduce((sum, item) => sum + item.total, 0)
        const totalGST = purchaseItems.reduce((sum, item) => sum + (item.total * item.gstPercentage / 100), 0)
        const grandTotal = subtotal + totalGST

        return { subtotal, totalGST, grandTotal }
    }

    // Handle save purchase order
    const handleSavePurchase = () => {
        if (purchaseItems.length === 0) {
            toast.error('Please add items to the purchase order')
            return
        }

        if (!supplier.name.trim()) {
            toast.error('Please enter supplier name')
            return
        }

        // Here you would typically save to backend
        const purchaseOrder = {
            id: `PO-${Date.now()}`,
            supplier,
            items: purchaseItems,
            totals: calculateTotals(),
            paymentMethods,
            expenseCategory,
            createdAt: new Date().toISOString()
        }

        console.log('Saving purchase order:', purchaseOrder)
        toast.success('Purchase order saved successfully!')

        // Reset form
        setPurchaseItems([])
        setSupplier({
            id: '',
            name: '',
            reference: '',
            mobile: '',
            address: '',
            shipTo: '',
            loyaltyCard: '',
            gstNo: '',
            state: 'West Bengal (19)'
        })
        setPaymentMethods({ cash: 0, card: 0, upi: 0 })
    }

    // Handle save and print
    const handleSaveAndPrint = () => {
        handleSavePurchase()
        // Here you would trigger print functionality
        toast.success('Purchase order saved and sent to printer!')
    }

    // Filter products based on search
    const filteredProducts = products.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesBrand = !brandSearch || product.brand?.toLowerCase().includes(brandSearch.toLowerCase())
        const matchesDescription = !descriptionSearch || product.description.toLowerCase().includes(descriptionSearch.toLowerCase())

        return matchesQuery && matchesBrand && matchesDescription
    })

    const { subtotal, totalGST, grandTotal } = calculateTotals()

    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Title bar */}
                <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">
                    {'<<'} PURCHASE ORDER
                </div>

                {/* Header form */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                            {/* Left column - Supplier Info */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Type</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>Purchase</option>
                                        <option>Return</option>
                                    </select>
                                </div>
                                <div className="col-span-8">
                                    <label className="block text-gray-600 mb-1">Supplier Name</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.name}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter supplier name"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Reference</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.reference}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, reference: e.target.value }))}
                                        placeholder="Ref. No."
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Mobile</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.mobile}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, mobile: e.target.value }))}
                                        placeholder="Mobile number"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="block text-gray-600 mb-1">Address</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.address}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="Supplier address"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="block text-gray-600 mb-1">Ship To</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.shipTo}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, shipTo: e.target.value }))}
                                        placeholder="Shipping address"
                                    />
                                </div>
                            </div>

                            {/* Right column - Additional Info */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-12 grid grid-cols-3 gap-2">
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Previous Orders</div>
                                        <div className="text-gray-700 font-medium">12</div>
                                    </div>
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Credit Limit</div>
                                        <div className="text-gray-700 font-medium">₹50,000</div>
                                    </div>
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Outstanding</div>
                                        <div className="text-gray-700 font-medium">₹15,000</div>
                                    </div>
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Loyalty Card</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.loyaltyCard}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, loyaltyCard: e.target.value }))}
                                        placeholder="Card No."
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Invoice Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-2 py-1"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">GST No.</label>
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.gstNo}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, gstNo: e.target.value }))}
                                        placeholder="GST Number"
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">State</label>
                                    <select
                                        className="w-full border rounded px-2 py-1"
                                        value={supplier.state}
                                        onChange={(e) => setSupplier(prev => ({ ...prev, state: e.target.value }))}
                                    >
                                        <option>West Bengal (19)</option>
                                        <option>Maharashtra (27)</option>
                                        <option>Karnataka (29)</option>
                                        <option>Tamil Nadu (33)</option>
                                        <option>Delhi (07)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Search row */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                            <label className="inline-flex items-center gap-1">
                                <input type="checkbox" /> List Up
                            </label>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-4 h-4 inline-flex items-center justify-center border rounded">🏷️</span>
                            </span>
                            <input
                                className="border rounded px-2 py-1"
                                placeholder="Barcode"
                                value={barcodeSearch}
                                onChange={(e) => setBarcodeSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch(barcodeSearch)}
                            />
                            <input
                                className="border rounded px-2 py-1"
                                placeholder="Brand"
                                value={brandSearch}
                                onChange={(e) => setBrandSearch(e.target.value)}
                            />
                            <input
                                className="border rounded px-2 py-1 w-64"
                                placeholder="Description"
                                value={descriptionSearch}
                                onChange={(e) => setDescriptionSearch(e.target.value)}
                            />
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                                onClick={() => setShowProductModal(true)}
                            >
                                Browse Products
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Items grid + sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm md:col-span-3">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                            <th className="px-3 py-2 text-left">#</th>
                                            <th className="px-3 py-2 text-left">Description</th>
                                            <th className="px-3 py-2 text-left">Category</th>
                                            <th className="px-3 py-2 text-left">Unit</th>
                                            <th className="px-3 py-2 text-right">Qty</th>
                                            <th className="px-3 py-2 text-right">Purch Rate</th>
                                            <th className="px-3 py-2 text-right">Profit%</th>
                                            <th className="px-3 py-2 text-right">HSN</th>
                                            <th className="px-3 py-2 text-right">GST%</th>
                                            <th className="px-3 py-2 text-right">Sale Price</th>
                                            <th className="px-3 py-2 text-right">MRP</th>
                                            <th className="px-3 py-2 text-right">Total</th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseItems.map((item, index) => (
                                            <tr key={item.id} className="border-t">
                                                <td className="px-3 py-2">{index + 1}</td>
                                                <td className="px-3 py-2">
                                                    <div>
                                                        <div className="font-medium">{item.productName}</div>
                                                        <div className="text-gray-500 text-[10px]">{item.sku}</div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">{item.category}</td>
                                                <td className="px-3 py-2">{item.unit}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-20 border rounded px-2 py-1 text-right"
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        min="1"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-24 border rounded px-2 py-1 text-right"
                                                        type="number"
                                                        value={item.purchaseRate}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'purchaseRate', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-20 border rounded px-2 py-1 text-right"
                                                        type="number"
                                                        value={item.profitPercentage}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'profitPercentage', parseFloat(e.target.value) || 0)}
                                                        step="0.1"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-24 border rounded px-2 py-1 text-right"
                                                        value={item.hsnCode}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'hsnCode', e.target.value)}
                                                        placeholder="HSN Code"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-20 border rounded px-2 py-1 text-right"
                                                        type="number"
                                                        value={item.gstPercentage}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'gstPercentage', parseFloat(e.target.value) || 0)}
                                                        step="0.1"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-24 border rounded px-2 py-1 text-right"
                                                        type="number"
                                                        value={item.salePrice}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'salePrice', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <input
                                                        className="w-24 border rounded px-2 py-1 text-right"
                                                        type="number"
                                                        value={item.mrp}
                                                        onChange={(e) => updatePurchaseItem(item.id, 'mrp', parseFloat(e.target.value) || 0)}
                                                        step="0.01"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right font-medium">
                                                    ₹{item.total.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <Button
                                                        className="bg-red-600 hover:bg-red-700 h-7 px-3 text-xs"
                                                        onClick={() => removePurchaseItem(item.id)}
                                                    >
                                                        ×
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {purchaseItems.length === 0 && (
                                            <tr>
                                                <td colSpan={13} className="px-3 py-8 text-center text-gray-500">
                                                    No items added to purchase order. Use the search above to add products.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-3 py-2 text-[11px] text-gray-600">
                                TOTAL {purchaseItems.length} ITEMS
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <Card className="border-0 shadow-sm md:col-span-1">
                        <CardContent className="p-3 space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span>Expense Category</span>
                                <select
                                    className="border rounded px-2 py-1"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="inventory">Inventory</option>
                                    <option value="operational">Operational</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="utilities">Utilities</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>GST:</span>
                                    <span className="font-bold">₹{totalGST.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t pt-2">
                                    <span>Grand Total:</span>
                                    <span className="font-bold text-lg">₹{grandTotal.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 items-center mt-4">
                                    <span>Payment in Cash</span>
                                    <input
                                        className="border rounded px-2 py-1 text-right"
                                        type="number"
                                        value={paymentMethods.cash}
                                        onChange={(e) => setPaymentMethods(prev => ({ ...prev, cash: parseFloat(e.target.value) || 0 }))}
                                        step="0.01"
                                    />
                                    <span>Payment in Card</span>
                                    <input
                                        className="border rounded px-2 py-1 text-right"
                                        type="number"
                                        value={paymentMethods.card}
                                        onChange={(e) => setPaymentMethods(prev => ({ ...prev, card: parseFloat(e.target.value) || 0 }))}
                                        step="0.01"
                                    />
                                    <span>Payment in UPI</span>
                                    <input
                                        className="border rounded px-2 py-1 text-right"
                                        type="number"
                                        value={paymentMethods.upi}
                                        onChange={(e) => setPaymentMethods(prev => ({ ...prev, upi: parseFloat(e.target.value) || 0 }))}
                                        step="0.01"
                                    />
                                    <div className="col-span-2 text-center text-gray-500 text-[10px]">
                                        Total: ₹{(paymentMethods.cash + paymentMethods.card + paymentMethods.upi).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom action buttons */}
                <div className="flex items-center justify-center gap-3">
                    <ActionGate tile="garment" page="purchase" action="save" fallback={null}>
                        <Button
                            className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4"
                            onClick={handleSavePurchase}
                            disabled={purchaseItems.length === 0}
                        >
                            Save Purchase Order
                        </Button>
                    </ActionGate>
                    <ActionGate tile="garment" page="purchase" action="print" fallback={null}>
                        <Button
                            className="h-8 bg-green-600 hover:bg-green-700 text-xs px-4"
                            onClick={handleSaveAndPrint}
                            disabled={purchaseItems.length === 0}
                        >
                            Save & Print
                        </Button>
                    </ActionGate>
                    <ActionGate tile="garment" page="purchase" action="pdf" fallback={null}>
                        <Button variant="outline" className="h-8 text-xs px-4">
                            Export PDF
                        </Button>
                    </ActionGate>
                </div>
            </div>

            {/* Product Selection Modal */}
            <PurchaseProductModal
                products={products}
                isOpen={showProductModal}
                onClose={() => setShowProductModal(false)}
                onProductSelect={addProductToPurchase}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

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



