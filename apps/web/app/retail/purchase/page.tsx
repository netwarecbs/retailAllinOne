'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { retailSuppliers, retailProducts } from '@retail/shared'
import { useRouter } from 'next/navigation'

interface PurchaseOrder {
    id: string
    supplierId: string
    supplierName: string
    orderDate: string
    expectedDate: string
    status: 'Pending' | 'Received' | 'Partial' | 'Cancelled'
    items: PurchaseItem[]
    totalAmount: number
    paidAmount: number
    balanceAmount: number
}

interface PurchaseItem {
    productId: string
    productName: string
    sku: string
    quantity: number
    unitPrice: number
    totalPrice: number
}

export default function PurchasePage() {
    const router = useRouter()
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
    const [suppliers] = useState(retailSuppliers)
    const [products] = useState(retailProducts)
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState('')
    const [newOrder, setNewOrder] = useState<Partial<PurchaseOrder>>({
        orderDate: new Date().toISOString().split('T')[0],
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Pending',
        items: [],
        totalAmount: 0,
        paidAmount: 0,
        balanceAmount: 0
    })

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false)
            // Load sample purchase orders
            setPurchaseOrders([
                {
                    id: 'PO001',
                    supplierId: 'SUP001',
                    supplierName: 'Sunrise Distributors',
                    orderDate: '2024-01-15',
                    expectedDate: '2024-01-22',
                    status: 'Pending',
                    items: [
                        { productId: 'RT001', productName: 'Parle-G Biscuit 100g', sku: 'RT001', quantity: 50, unitPrice: 6, totalPrice: 300 },
                        { productId: 'RT002', productName: 'Colgate Toothpaste 150g', sku: 'RT002', quantity: 25, unitPrice: 40, totalPrice: 1000 }
                    ],
                    totalAmount: 1300,
                    paidAmount: 0,
                    balanceAmount: 1300
                },
                {
                    id: 'PO002',
                    supplierId: 'SUP002',
                    supplierName: 'Retail Supplies India',
                    orderDate: '2024-01-10',
                    expectedDate: '2024-01-17',
                    status: 'Received',
                    items: [
                        { productId: 'RT003', productName: 'Dettol Handwash 200ml', sku: 'RT003', quantity: 20, unitPrice: 50, totalPrice: 1000 }
                    ],
                    totalAmount: 1000,
                    paidAmount: 1000,
                    balanceAmount: 0
                }
            ])
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const handleCreateOrder = () => {
        if (!selectedSupplier) return

        const supplier = suppliers.find(s => s.id === selectedSupplier)
        if (!supplier) return

        const newPurchaseOrder: PurchaseOrder = {
            id: `PO${String(purchaseOrders.length + 1).padStart(3, '0')}`,
            supplierId: selectedSupplier,
            supplierName: supplier.name,
            orderDate: newOrder.orderDate || new Date().toISOString().split('T')[0],
            expectedDate: newOrder.expectedDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Pending',
            items: [],
            totalAmount: 0,
            paidAmount: 0,
            balanceAmount: 0
        }

        setPurchaseOrders([...purchaseOrders, newPurchaseOrder])
        setShowCreateForm(false)
        setSelectedSupplier('')
        setNewOrder({
            orderDate: new Date().toISOString().split('T')[0],
            expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Pending',
            items: [],
            totalAmount: 0,
            paidAmount: 0,
            balanceAmount: 0
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800'
            case 'Received': return 'bg-green-100 text-green-800'
            case 'Partial': return 'bg-blue-100 text-blue-800'
            case 'Cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
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
                            <h2 className="text-2xl font-bold text-gray-900">Purchase Management</h2>
                            <p className="text-gray-600">Manage purchase orders and supplier relationships</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowCreateForm(true)}
                                className="bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700"
                            >
                                + Create Purchase Order
                            </Button>
                            <Button
                                onClick={() => router.push('/retail/purchase/suppliers')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Manage Suppliers
                            </Button>
                        </div>
                    </div>

                    {/* Create Order Modal */}
                    {showCreateForm && (
                        <Card className="border-2 border-orange-200">
                            <CardHeader className="bg-orange-50">
                                <CardTitle className="text-orange-800">Create New Purchase Order</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Supplier</label>
                                        <select
                                            value={selectedSupplier}
                                            onChange={(e) => setSelectedSupplier(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Choose a supplier</option>
                                            {suppliers.map(supplier => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name} - {supplier.contact}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
                                        <Input
                                            type="date"
                                            value={newOrder.expectedDate}
                                            onChange={(e) => setNewOrder({ ...newOrder, expectedDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateOrder}
                                        disabled={!selectedSupplier}
                                        className="bg-orange-600 hover:bg-orange-700"
                                    >
                                        Create Order
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Purchase Orders List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Order ID</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Supplier</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Order Date</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Expected Date</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Status</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Total Amount</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseOrders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-3 font-medium text-sm">{order.id}</td>
                                                <td className="py-2 px-3 text-sm">{order.supplierName}</td>
                                                <td className="py-2 px-3 text-sm">{order.orderDate}</td>
                                                <td className="py-2 px-3 text-sm">{order.expectedDate}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 font-semibold text-sm">₹{order.totalAmount.toLocaleString()}</td>
                                                <td className="py-2 px-3">
                                                    <div className="flex space-x-1">
                                                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">View</Button>
                                                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">Edit</Button>
                                                        {order.status === 'Pending' && (
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1">
                                                                Receive
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-yellow-600 text-sm">📋</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-600">Total Orders</p>
                                        <p className="text-xl font-semibold">{purchaseOrders.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-yellow-600 text-sm">⏳</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-600">Pending</p>
                                        <p className="text-xl font-semibold">{purchaseOrders.filter(o => o.status === 'Pending').length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 text-sm">✅</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-600">Received</p>
                                        <p className="text-xl font-semibold">{purchaseOrders.filter(o => o.status === 'Received').length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 text-sm">💰</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-600">Total Value</p>
                                        <p className="text-xl font-semibold">₹{purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
