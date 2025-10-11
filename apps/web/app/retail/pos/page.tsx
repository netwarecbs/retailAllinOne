'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { retailProducts, retailCustomers } from '@retail/shared'
import { useRouter } from 'next/navigation'

interface CartItem {
    productId: string
    sku: string
    name: string
    price: number
    quantity: number
    total: number
    discount: number
}

interface PaymentMethod {
    type: 'cash' | 'card' | 'upi' | 'mixed'
    amount: number
}

export default function POSPage() {
    const router = useRouter()
    const [products] = useState(retailProducts)
    const [customers] = useState(retailCustomers)
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState('')
    const [barcodeSearch, setBarcodeSearch] = useState('')
    const [nameSearch, setNameSearch] = useState('')
    const [discount, setDiscount] = useState(0)
    const [gst, setGst] = useState(0)
    const [roundOff, setRoundOff] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ type: 'cash', amount: 0 })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesBarcode = !barcodeSearch || product.barcode?.includes(barcodeSearch)
            const matchesName = !nameSearch || product.name.toLowerCase().includes(nameSearch.toLowerCase())
            return matchesBarcode || matchesName
        })
    }, [products, barcodeSearch, nameSearch])

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.total, 0)
    }, [cart])

    const subtotal = useMemo(() => {
        return cartTotal - discount
    }, [cartTotal, discount])

    const gstAmount = useMemo(() => {
        return (subtotal * gst) / 100
    }, [subtotal, gst])

    const finalTotal = useMemo(() => {
        return subtotal + gstAmount + roundOff
    }, [subtotal, gstAmount, roundOff])

    const addToCart = (product: any) => {
        const existingItem = cart.find(item => item.productId === product.sku)
        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.sku
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                    : item
            ))
        } else {
            setCart([...cart, {
                productId: product.sku,
                sku: product.sku,
                name: product.name,
                price: product.sellPrice,
                quantity: 1,
                total: product.sellPrice,
                discount: 0
            }])
        }
    }

    const updateCartItem = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(cart.filter(item => item.productId !== productId))
        } else {
            setCart(cart.map(item =>
                item.productId === productId
                    ? { ...item, quantity, total: quantity * item.price }
                    : item
            ))
        }
    }

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.productId !== productId))
    }

    const clearCart = () => {
        setCart([])
        setSelectedCustomer('')
        setDiscount(0)
        setGst(0)
        setRoundOff(0)
        setPaymentMethod({ type: 'cash', amount: 0 })
    }

    const processPayment = () => {
        if (cart.length === 0) return

        // Generate invoice
        const invoiceNumber = `INV${Date.now()}`
        const invoice = {
            number: invoiceNumber,
            date: new Date().toISOString().split('T')[0],
            customer: selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name : 'Walk-in Customer',
            items: cart,
            subtotal,
            discount,
            gst: gstAmount,
            roundOff,
            total: finalTotal,
            paymentMethod: paymentMethod.type,
            paidAmount: paymentMethod.amount
        }

        console.log('Invoice generated:', invoice)
        alert(`Invoice ${invoiceNumber} generated successfully!`)
        clearCart()
    }

    if (isLoading) {
        return (
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
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Point of Sale (POS)</h2>
                            <p className="text-gray-600">Process sales transactions and generate invoices</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={clearCart}
                                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                            >
                                Clear Cart
                            </Button>
                            <Button
                                onClick={() => router.push('/retail/pos/history')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                View History
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Search & Selection */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Search */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Search</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Search</label>
                                            <Input
                                                placeholder="Scan or enter barcode..."
                                                value={barcodeSearch}
                                                onChange={(e) => setBarcodeSearch(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                            <Input
                                                placeholder="Search by product name..."
                                                value={nameSearch}
                                                onChange={(e) => setNameSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Products Grid */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Products ({filteredProducts.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                                        {filteredProducts.map((product) => (
                                            <div key={product.sku} className="border rounded-lg p-2 hover:shadow-md transition-shadow bg-white">
                                                <div className="flex items-start space-x-2 mb-2">
                                                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none'
                                                                    e.currentTarget.nextElementSibling.style.display = 'flex'
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm" style={{ display: product.image ? 'none' : 'flex' }}>
                                                            📦
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-xs text-gray-900 truncate">{product.name}</h3>
                                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                                                {product.stock}
                                                            </span>
                                                            <span className="font-semibold text-orange-600 text-xs">₹{product.sellPrice}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => addToCart(product)}
                                                    disabled={product.stock <= 0}
                                                    className="w-full bg-orange-600 hover:bg-orange-700 text-xs py-1"
                                                >
                                                    {product.stock <= 0 ? 'Out of Stock' : 'Add'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Cart & Payment */}
                        <div className="space-y-6">
                            {/* Customer Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <select
                                        value={selectedCustomer}
                                        onChange={(e) => setSelectedCustomer(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Walk-in Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name} ({customer.type})
                                            </option>
                                        ))}
                                    </select>
                                </CardContent>
                            </Card>

                            {/* Cart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cart ({cart.length} items)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {cart.map((item) => (
                                            <div key={item.productId} className="flex justify-between items-center border-b pb-1">
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium">{item.name}</p>
                                                    <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs px-2 py-1"
                                                        onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="text-xs font-medium">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs px-2 py-1"
                                                        onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                                                        onClick={() => removeFromCart(item.productId)}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {cart.length === 0 && (
                                            <p className="text-center text-gray-500 py-4">Cart is empty</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Discount:</span>
                                            <span>-₹{discount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>GST ({gst}%):</span>
                                            <span>₹{gstAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Round Off:</span>
                                            <span>₹{roundOff.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total:</span>
                                                <span>₹{finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Controls */}
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
                                            <Input
                                                type="number"
                                                value={discount}
                                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">GST (%)</label>
                                            <Input
                                                type="number"
                                                value={gst}
                                                onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                            <select
                                                value={paymentMethod.type}
                                                onChange={(e) => setPaymentMethod({ ...paymentMethod, type: e.target.value as any })}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="upi">UPI</option>
                                                <option value="mixed">Mixed</option>
                                            </select>
                                        </div>
                                        <Button
                                            onClick={processPayment}
                                            disabled={cart.length === 0}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            Process Payment (₹{finalTotal.toFixed(2)})
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}