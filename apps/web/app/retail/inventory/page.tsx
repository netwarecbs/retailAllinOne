'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { useRouter } from 'next/navigation'
import { RootState, AppDispatch } from '@retail/shared'
import { updateStock, addStockInRecord } from '@retail/shared'

interface StockReturnForm {
    returnType: 'vendor' | 'customer'
    returnTo: string // vendor/customer ID
    returnToName: string
    returnScenario: 'before_bill' | 'after_bill'
    challanNo: string
    billNo: string
    productId: string
    productName: string
    quantity: number
    reason: string
    batchNo: string
    returnDate: string
}

export default function InventoryPage() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { products, vendors, customers } = useSelector((state: RootState) => state.products)

    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [showStockReturn, setShowStockReturn] = useState(false)
    const [showVendorSuggestions, setShowVendorSuggestions] = useState(false)
    const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false)
    const [showProductSuggestions, setShowProductSuggestions] = useState(false)
    const [vendorSearchTerm, setVendorSearchTerm] = useState('')
    const [customerSearchTerm, setCustomerSearchTerm] = useState('')
    const [productSearchTerm, setProductSearchTerm] = useState('')
    const [selectedProductCategory, setSelectedProductCategory] = useState('')
    const [stockReturnForm, setStockReturnForm] = useState<StockReturnForm>({
        returnType: 'vendor',
        returnTo: '',
        returnToName: '',
        returnScenario: 'before_bill',
        challanNo: '',
        billNo: '',
        productId: '',
        productName: '',
        quantity: 0,
        reason: '',
        batchNo: '',
        returnDate: new Date().toLocaleDateString('en-GB')
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showVendorSuggestions || showCustomerSuggestions || showProductSuggestions) {
                setShowVendorSuggestions(false)
                setShowCustomerSuggestions(false)
                setShowProductSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showVendorSuggestions, showCustomerSuggestions, showProductSuggestions])

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode?.includes(searchTerm)
            const matchesCategory = !selectedCategory || product.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [products, searchTerm, selectedCategory])

    const lowStockProducts = useMemo(() => {
        return products.filter(product => product.stock <= product.minStock)
    }, [products])

    const outOfStockProducts = useMemo(() => {
        return products.filter(product => product.stock === 0)
    }, [products])

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor =>
            vendor.name.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
            vendor.contact.includes(vendorSearchTerm) ||
            vendor.gstin.toLowerCase().includes(vendorSearchTerm.toLowerCase())
        )
    }, [vendors, vendorSearchTerm])

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
            customer.contact.includes(customerSearchTerm)
        )
    }, [customers, customerSearchTerm])

    const filteredProductsForReturn = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.barcode?.includes(productSearchTerm)
            const matchesCategory = !selectedProductCategory || product.category === selectedProductCategory
            return matchesSearch && matchesCategory
        })
    }, [products, productSearchTerm, selectedProductCategory])

    const handleStockAdjustment = (sku: string, adjustment: number) => {
        dispatch(updateStock({ sku, quantity: Math.abs(adjustment), operation: adjustment > 0 ? 'add' : 'subtract' }))
    }

    const handleStockReturn = () => {
        if (!stockReturnForm.productId || stockReturnForm.quantity <= 0) {
            alert('Please select a product and enter valid quantity')
            return
        }

        if (!stockReturnForm.returnTo) {
            alert('Please select a vendor or customer')
            return
        }

        if (stockReturnForm.returnScenario === 'before_bill' && !stockReturnForm.challanNo) {
            alert('Please enter challan number for before bill return')
            return
        }

        if (stockReturnForm.returnScenario === 'after_bill' && !stockReturnForm.billNo) {
            alert('Please enter bill number for after bill return')
            return
        }

        // Create stock return record
        const stockReturnRecord = {
            id: `SR-${Date.now()}`,
            vendorId: stockReturnForm.returnTo,
            vendorName: stockReturnForm.returnToName,
            challanDate: stockReturnForm.returnDate,
            challanNo: stockReturnForm.returnScenario === 'before_bill' ? stockReturnForm.challanNo : 'N/A',
            transportName: 'N/A',
            transportNo: 'N/A',
            transportCharges: 0,
            billNo: stockReturnForm.returnScenario === 'after_bill' ? stockReturnForm.billNo : 'N/A',
            billDate: stockReturnForm.returnDate,
            products: [{
                slNo: 1,
                productId: stockReturnForm.productId,
                productName: stockReturnForm.productName,
                inStock: 0,
                qty: -stockReturnForm.quantity, // Negative quantity for return
                batchNo: stockReturnForm.batchNo,
                mfDate: '',
                expDate: '',
                unitPrice: 0,
                totalPrice: 0
            }],
            totalAmount: 0,
            createdAt: new Date().toISOString()
        }

        dispatch(addStockInRecord(stockReturnRecord))

        // Reset form
        setStockReturnForm({
            returnType: 'vendor',
            returnTo: '',
            returnToName: '',
            returnScenario: 'before_bill',
            challanNo: '',
            billNo: '',
            productId: '',
            productName: '',
            quantity: 0,
            reason: '',
            batchNo: '',
            returnDate: new Date().toLocaleDateString('en-GB')
        })
        setShowStockReturn(false)

        alert('Stock return recorded successfully!')
    }

    const handleProductSelect = (product: any) => {
        setStockReturnForm({
            ...stockReturnForm,
            productId: product.sku,
            productName: product.name
        })
    }

    const handleVendorSelect = (vendor: any) => {
        setStockReturnForm({
            ...stockReturnForm,
            returnTo: vendor.id,
            returnToName: vendor.name
        })
        setVendorSearchTerm('')
        setShowVendorSuggestions(false)
    }

    const handleCustomerSelect = (customer: any) => {
        setStockReturnForm({
            ...stockReturnForm,
            returnTo: customer.id,
            returnToName: customer.name
        })
        setCustomerSearchTerm('')
        setShowCustomerSuggestions(false)
    }

    const handleProductSelectForReturn = (product: any) => {
        setStockReturnForm({
            ...stockReturnForm,
            productId: product.sku,
            productName: product.name
        })
        setProductSearchTerm('')
        setShowProductSuggestions(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
                            <p className="text-gray-600">Manage products, stock levels, and inventory operations</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => router.push('/retail/inventory/stock-in')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Stock-In
                            </Button>
                            <Button
                                onClick={() => setShowStockReturn(true)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Stock Return
                            </Button>
                            <Button
                                onClick={() => router.push('/retail/inventory/stock-adjustment')}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Stock Adjustment
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 text-lg">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                                        <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 text-lg">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">In Stock</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {products.filter(p => p.stock > 0).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-600 text-lg">⚠️</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Low Stock</p>
                                        <p className="text-2xl font-semibold text-gray-900">{lowStockProducts.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <span className="text-red-600 text-lg">❌</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                                        <p className="text-2xl font-semibold text-gray-900">{outOfStockProducts.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search products by name, SKU, or barcode..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">All Categories</option>
                                        {Array.from(new Set(products.map(p => p.category))).map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Inventory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-orange-100">
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Image</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">SKU</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Product Name</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Category</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Brand</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Stock</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">MRP</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Cost Price</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Sell Price</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.sku} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-3">
                                                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-100">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none'
                                                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                                                    if (nextElement) {
                                                                        nextElement.style.display = 'flex'
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{ display: product.image ? 'none' : 'flex' }}>
                                                            📦
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 font-medium text-sm">{product.sku}</td>
                                                <td className="py-2 px-3">
                                                    <div>
                                                        <p className="font-medium text-sm">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.unit}</p>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-sm">{product.brand}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${product.stock <= 0 ? 'bg-red-100 text-red-800' :
                                                        product.stock <= product.minStock ? 'bg-orange-100 text-orange-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-sm">₹{product.mrp}</td>
                                                <td className="py-2 px-3 text-sm">₹{product.costPrice}</td>
                                                <td className="py-2 px-3 font-semibold text-sm">₹{product.sellPrice}</td>
                                                <td className="py-2 px-3">
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs px-2 py-1"
                                                            onClick={() => handleStockAdjustment(product.sku, 1)}
                                                        >
                                                            +1
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs px-2 py-1"
                                                            onClick={() => handleStockAdjustment(product.sku, -1)}
                                                        >
                                                            -1
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Return Modal */}
                    {showStockReturn && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Stock Return</h3>
                                    <Button
                                        onClick={() => setShowStockReturn(false)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        ✕
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {/* Return Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Return Type *</label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="returnType"
                                                    value="vendor"
                                                    checked={stockReturnForm.returnType === 'vendor'}
                                                    onChange={(e) => setStockReturnForm({ ...stockReturnForm, returnType: e.target.value as 'vendor' | 'customer', returnTo: '', returnToName: '' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Return to Vendor</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="returnType"
                                                    value="customer"
                                                    checked={stockReturnForm.returnType === 'customer'}
                                                    onChange={(e) => setStockReturnForm({ ...stockReturnForm, returnType: e.target.value as 'vendor' | 'customer', returnTo: '', returnToName: '' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Return from Customer</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Vendor/Customer Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {stockReturnForm.returnType === 'vendor' ? 'Select Vendor *' : 'Select Customer *'}
                                        </label>
                                        <div className="relative">
                                            <Input
                                                placeholder={`Search ${stockReturnForm.returnType === 'vendor' ? 'vendor' : 'customer'} by name, contact, or GSTIN...`}
                                                value={stockReturnForm.returnToName || (stockReturnForm.returnType === 'vendor' ? vendorSearchTerm : customerSearchTerm)}
                                                onChange={(e) => {
                                                    if (stockReturnForm.returnType === 'vendor') {
                                                        setVendorSearchTerm(e.target.value)
                                                        setShowVendorSuggestions(e.target.value.length > 0)
                                                        // Clear selection if user starts typing
                                                        if (stockReturnForm.returnTo && e.target.value !== stockReturnForm.returnToName) {
                                                            setStockReturnForm({
                                                                ...stockReturnForm,
                                                                returnTo: '',
                                                                returnToName: ''
                                                            })
                                                        }
                                                    } else {
                                                        setCustomerSearchTerm(e.target.value)
                                                        setShowCustomerSuggestions(e.target.value.length > 0)
                                                        // Clear selection if user starts typing
                                                        if (stockReturnForm.returnTo && e.target.value !== stockReturnForm.returnToName) {
                                                            setStockReturnForm({
                                                                ...stockReturnForm,
                                                                returnTo: '',
                                                                returnToName: ''
                                                            })
                                                        }
                                                    }
                                                }}
                                                onFocus={() => {
                                                    if (stockReturnForm.returnType === 'vendor') {
                                                        setShowVendorSuggestions(true)
                                                    } else {
                                                        setShowCustomerSuggestions(true)
                                                    }
                                                }}
                                                className="w-full"
                                            />

                                            {/* Vendor Suggestions */}
                                            {stockReturnForm.returnType === 'vendor' && showVendorSuggestions && filteredVendors.length > 0 && (
                                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                                    {filteredVendors.slice(0, 5).map((vendor) => (
                                                        <div
                                                            key={vendor.id}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                                                            onClick={() => handleVendorSelect(vendor)}
                                                        >
                                                            <div className="font-medium">{vendor.name}</div>
                                                            <div className="text-xs text-gray-500">📞 {vendor.contact} | 🏢 {vendor.gstin}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Customer Suggestions */}
                                            {stockReturnForm.returnType === 'customer' && showCustomerSuggestions && filteredCustomers.length > 0 && (
                                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                                    {filteredCustomers.slice(0, 5).map((customer) => (
                                                        <div
                                                            key={customer.id}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                                                            onClick={() => handleCustomerSelect(customer)}
                                                        >
                                                            <div className="font-medium">{customer.name}</div>
                                                            <div className="text-xs text-gray-500">📞 {customer.contact} | 👤 {customer.type}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Return Scenario */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Return Scenario *</label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="returnScenario"
                                                    value="before_bill"
                                                    checked={stockReturnForm.returnScenario === 'before_bill'}
                                                    onChange={(e) => setStockReturnForm({ ...stockReturnForm, returnScenario: e.target.value as 'before_bill' | 'after_bill', challanNo: '', billNo: '' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Before Bill (Challan)</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="returnScenario"
                                                    value="after_bill"
                                                    checked={stockReturnForm.returnScenario === 'after_bill'}
                                                    onChange={(e) => setStockReturnForm({ ...stockReturnForm, returnScenario: e.target.value as 'before_bill' | 'after_bill', challanNo: '', billNo: '' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">After Bill</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Challan/Bill Number */}
                                    {stockReturnForm.returnScenario === 'before_bill' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Challan Number *</label>
                                            <Input
                                                placeholder="Enter challan number"
                                                value={stockReturnForm.challanNo}
                                                onChange={(e) => setStockReturnForm({ ...stockReturnForm, challanNo: e.target.value })}
                                                className="w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number *</label>
                                            <Input
                                                placeholder="Enter bill number"
                                                value={stockReturnForm.billNo}
                                                onChange={(e) => setStockReturnForm({ ...stockReturnForm, billNo: e.target.value })}
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    {/* Product Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>

                                        {/* Category Filter */}
                                        <div className="mb-2">
                                            <select
                                                value={selectedProductCategory}
                                                onChange={(e) => setSelectedProductCategory(e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                            >
                                                <option value="">All Categories</option>
                                                {Array.from(new Set(products.map(p => p.category))).map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="relative">
                                            <Input
                                                placeholder="Search product by name, SKU, or barcode..."
                                                value={stockReturnForm.productName || productSearchTerm}
                                                onChange={(e) => {
                                                    setProductSearchTerm(e.target.value)
                                                    setShowProductSuggestions(e.target.value.length > 0)
                                                    // Clear selection if user starts typing
                                                    if (stockReturnForm.productId && e.target.value !== stockReturnForm.productName) {
                                                        setStockReturnForm({
                                                            ...stockReturnForm,
                                                            productId: '',
                                                            productName: ''
                                                        })
                                                    }
                                                }}
                                                onFocus={() => setShowProductSuggestions(true)}
                                                className="w-full"
                                            />

                                            {/* Product Suggestions */}
                                            {showProductSuggestions && filteredProductsForReturn.length > 0 && (
                                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                                    {filteredProductsForReturn.slice(0, 8).map((product) => (
                                                        <div
                                                            key={product.sku}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b flex items-center space-x-3"
                                                            onClick={() => handleProductSelectForReturn(product)}
                                                        >
                                                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                                {product.image ? (
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none'
                                                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                                                            if (nextElement) {
                                                                                nextElement.style.display = 'flex'
                                                                            }
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{ display: product.image ? 'none' : 'flex' }}>
                                                                    📦
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium truncate">{product.name}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    SKU: {product.sku} | Stock: {product.stock} | ₹{product.sellPrice}
                                                                </div>
                                                                <div className="text-xs text-gray-400">{product.category} - {product.brand}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                                            <Input
                                                type="number"
                                                value={stockReturnForm.quantity}
                                                onChange={(e) => setStockReturnForm({ ...stockReturnForm, quantity: parseInt(e.target.value) || 0 })}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch No</label>
                                            <Input
                                                value={stockReturnForm.batchNo}
                                                onChange={(e) => setStockReturnForm({ ...stockReturnForm, batchNo: e.target.value })}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Return Date *</label>
                                        <Input
                                            type="date"
                                            value={stockReturnForm.returnDate}
                                            onChange={(e) => setStockReturnForm({ ...stockReturnForm, returnDate: e.target.value })}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                                        <select
                                            value={stockReturnForm.reason}
                                            onChange={(e) => setStockReturnForm({ ...stockReturnForm, reason: e.target.value })}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Select Reason</option>
                                            <option value="Damaged">Damaged Goods</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Defective">Defective</option>
                                            <option value="Wrong Order">Wrong Order</option>
                                            <option value="Customer Return">Customer Return</option>
                                            <option value="Quality Issue">Quality Issue</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <Button
                                        onClick={() => setShowStockReturn(false)}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleStockReturn}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Process Return
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}