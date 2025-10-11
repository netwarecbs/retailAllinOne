'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { RootState, AppDispatch } from '@retail/shared'
import { updateStock } from '@retail/shared'

interface StockAdjustmentForm {
    productId: string
    productName: string
    currentStock: number
    newStock: number
    adjustment: number
    reason: string
    adjustmentDate: string
}

export default function StockAdjustmentPage() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { products } = useSelector((state: RootState) => state.products)

    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAdjustmentForm, setShowAdjustmentForm] = useState(false)
    const [showProductSuggestions, setShowProductSuggestions] = useState(false)
    const [productSearchTerm, setProductSearchTerm] = useState('')
    const [selectedProductCategory, setSelectedProductCategory] = useState('')
    const [adjustmentForm, setAdjustmentForm] = useState<StockAdjustmentForm>({
        productId: '',
        productName: '',
        currentStock: 0,
        newStock: 0,
        adjustment: 0,
        reason: '',
        adjustmentDate: new Date().toLocaleDateString('en-GB')
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
            if (showProductSuggestions) {
                setShowProductSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showProductSuggestions])

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
    )

    const filteredProductsForAdjustment = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
            product.barcode?.includes(productSearchTerm)
        const matchesCategory = !selectedProductCategory || product.category === selectedProductCategory
        return matchesSearch && matchesCategory
    })

    const handleProductSelect = (product: any) => {
        setAdjustmentForm({
            ...adjustmentForm,
            productId: product.sku,
            productName: product.name,
            currentStock: product.stock
        })
    }

    const handleProductSelectForAdjustment = (product: any) => {
        setAdjustmentForm({
            ...adjustmentForm,
            productId: product.sku,
            productName: product.name,
            currentStock: product.stock
        })
        setProductSearchTerm('')
        setShowProductSuggestions(false)
    }

    const handleNewStockChange = (newStock: number) => {
        const adjustment = newStock - adjustmentForm.currentStock
        setAdjustmentForm({
            ...adjustmentForm,
            newStock,
            adjustment
        })
    }

    const handleStockAdjustment = () => {
        if (!adjustmentForm.productId || adjustmentForm.reason === '') {
            alert('Please select a product and provide a reason')
            return
        }

        if (adjustmentForm.adjustment === 0) {
            alert('No stock adjustment needed')
            return
        }

        dispatch(updateStock({
            sku: adjustmentForm.productId,
            quantity: Math.abs(adjustmentForm.adjustment),
            operation: adjustmentForm.adjustment > 0 ? 'add' : 'subtract'
        }))

        // Reset form
        setAdjustmentForm({
            productId: '',
            productName: '',
            currentStock: 0,
            newStock: 0,
            adjustment: 0,
            reason: '',
            adjustmentDate: new Date().toLocaleDateString('en-GB')
        })
        setShowAdjustmentForm(false)

        alert('Stock adjustment completed successfully!')
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
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={() => router.push('/retail/inventory')}
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-2"
                            >
                                <span>←</span>
                                <span>Back to Inventory</span>
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Stock Adjustment</h2>
                                <p className="text-gray-600">Adjust stock levels and correct inventory discrepancies</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowAdjustmentForm(true)}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            New Adjustment
                        </Button>
                    </div>

                    {/* Search */}
                    <Card>
                        <CardContent className="p-6">
                            <Input
                                placeholder="Search products by name, SKU, or barcode..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </CardContent>
                    </Card>

                    {/* Products Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Stock Levels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-orange-100">
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">SKU</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Product Name</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Category</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Current Stock</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Min Stock</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Status</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.sku} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-3 font-medium text-sm">{product.sku}</td>
                                                <td className="py-2 px-3">
                                                    <div>
                                                        <p className="font-medium text-sm">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.brand}</p>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-sm font-medium">{product.stock}</td>
                                                <td className="py-2 px-3 text-sm">{product.minStock}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${product.stock <= 0 ? 'bg-red-100 text-red-800' :
                                                        product.stock <= product.minStock ? 'bg-orange-100 text-orange-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                        {product.stock <= 0 ? 'Out of Stock' :
                                                            product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            handleProductSelect(product)
                                                            setShowAdjustmentForm(true)
                                                        }}
                                                        className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1"
                                                    >
                                                        Adjust
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Adjustment Modal */}
                    {showAdjustmentForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Stock Adjustment</h3>
                                    <Button
                                        onClick={() => setShowAdjustmentForm(false)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        ✕
                                    </Button>
                                </div>

                                <div className="space-y-4">
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
                                                value={adjustmentForm.productName || productSearchTerm}
                                                onChange={(e) => {
                                                    setProductSearchTerm(e.target.value)
                                                    setShowProductSuggestions(e.target.value.length > 0)
                                                    // Clear selection if user starts typing
                                                    if (adjustmentForm.productId && e.target.value !== adjustmentForm.productName) {
                                                        setAdjustmentForm({
                                                            ...adjustmentForm,
                                                            productId: '',
                                                            productName: '',
                                                            currentStock: 0
                                                        })
                                                    }
                                                }}
                                                onFocus={() => setShowProductSuggestions(true)}
                                                className="w-full"
                                            />

                                            {/* Product Suggestions */}
                                            {showProductSuggestions && filteredProductsForAdjustment.length > 0 && (
                                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                                    {filteredProductsForAdjustment.slice(0, 8).map((product) => (
                                                        <div
                                                            key={product.sku}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b flex items-center space-x-3"
                                                            onClick={() => handleProductSelectForAdjustment(product)}
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
                                                                    SKU: {product.sku} | Current: {product.stock} | ₹{product.sellPrice}
                                                                </div>
                                                                <div className="text-xs text-gray-400">{product.category} - {product.brand}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {adjustmentForm.productId && (
                                        <>
                                            <div className="bg-gray-50 p-3 rounded">
                                                <p className="text-sm text-gray-600">Current Stock: <span className="font-medium">{adjustmentForm.currentStock}</span></p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Stock *</label>
                                                <Input
                                                    type="number"
                                                    value={adjustmentForm.newStock}
                                                    onChange={(e) => handleNewStockChange(parseInt(e.target.value) || 0)}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="bg-blue-50 p-3 rounded">
                                                <p className="text-sm">
                                                    Adjustment: <span className={`font-medium ${adjustmentForm.adjustment > 0 ? 'text-green-600' : adjustmentForm.adjustment < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                                        {adjustmentForm.adjustment > 0 ? '+' : ''}{adjustmentForm.adjustment}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Date *</label>
                                                <Input
                                                    type="date"
                                                    value={adjustmentForm.adjustmentDate}
                                                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, adjustmentDate: e.target.value })}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                                                <select
                                                    value={adjustmentForm.reason}
                                                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <option value="">Select Reason</option>
                                                    <option value="Physical Count">Physical Count Discrepancy</option>
                                                    <option value="Damaged Goods">Damaged Goods</option>
                                                    <option value="Theft">Theft/Loss</option>
                                                    <option value="Expired">Expired Products</option>
                                                    <option value="Transfer">Stock Transfer</option>
                                                    <option value="Correction">Data Correction</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <Button
                                        onClick={() => setShowAdjustmentForm(false)}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleStockAdjustment}
                                        className="bg-orange-600 hover:bg-orange-700"
                                        disabled={!adjustmentForm.productId || adjustmentForm.reason === ''}
                                    >
                                        Apply Adjustment
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
