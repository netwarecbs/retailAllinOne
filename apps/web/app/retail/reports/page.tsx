'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { retailProducts, retailCustomers, retailSuppliers } from '@retail/shared'
import { useRouter } from 'next/navigation'

interface ReportData {
    sales: {
        daily: number
        monthly: number
        topProducts: Array<{ name: string; sales: number; quantity: number }>
        categoryWise: Record<string, number>
    }
    inventory: {
        stockValue: number
        lowStockItems: number
        expiringItems: number
        totalProducts: number
    }
    customers: {
        total: number
        regular: number
        wholesale: number
        vip: number
        outstanding: number
    }
    suppliers: {
        total: number
        outstanding: number
        pendingOrders: number
    }
}

export default function ReportsPage() {
    const router = useRouter()
    const [products] = useState(retailProducts)
    const [customers] = useState(retailCustomers)
    const [suppliers] = useState(retailSuppliers)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState('sales')
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const reportData: ReportData = useMemo(() => {
        // Calculate sales data
        const dailySales = products.reduce((sum, p) => sum + (p.sellPrice * Math.floor(Math.random() * 10)), 0)
        const monthlySales = dailySales * 30
        const topProducts = products.slice(0, 5).map(p => ({
            name: p.name,
            sales: p.sellPrice * Math.floor(Math.random() * 20),
            quantity: Math.floor(Math.random() * 50)
        }))
        const categoryWise = products.reduce((acc, p) => {
            const sales = p.sellPrice * Math.floor(Math.random() * 15)
            acc[p.category] = (acc[p.category] || 0) + sales
            return acc
        }, {} as Record<string, number>)

        // Calculate inventory data
        const stockValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0)
        const lowStockItems = products.filter(p => p.stock <= p.minStock).length
        const today = new Date()
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        const expiringItems = products.filter(p => {
            if (!p.expiryDate) return false
            const expiryDate = new Date(p.expiryDate)
            return expiryDate <= thirtyDaysFromNow && expiryDate > today
        }).length

        // Calculate customer data
        const regularCustomers = customers.filter(c => c.type === 'Regular').length
        const wholesaleCustomers = customers.filter(c => c.type === 'Wholesale').length
        const vipCustomers = customers.filter(c => c.type === 'VIP').length
        const outstanding = customers.reduce((sum, c) => sum + c.outstandingAmount, 0)

        // Calculate supplier data
        const supplierOutstanding = suppliers.reduce((sum, s) => sum + s.outstandingAmount, 0)
        const pendingOrders = Math.floor(Math.random() * 5) + 1

        return {
            sales: {
                daily: dailySales,
                monthly: monthlySales,
                topProducts,
                categoryWise
            },
            inventory: {
                stockValue,
                lowStockItems,
                expiringItems,
                totalProducts: products.length
            },
            customers: {
                total: customers.length,
                regular: regularCustomers,
                wholesale: wholesaleCustomers,
                vip: vipCustomers,
                outstanding
            },
            suppliers: {
                total: suppliers.length,
                outstanding: supplierOutstanding,
                pendingOrders
            }
        }
    }, [products, customers, suppliers])

    const renderSalesReport = () => (
        <div className="space-y-6">
            {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-sm">📈</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Daily Sales</p>
                                <p className="text-xl font-semibold">₹{reportData.sales.daily.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm">📊</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Monthly Sales</p>
                                <p className="text-xl font-semibold">₹{reportData.sales.monthly.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 text-sm">🏆</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Top Products</p>
                                <p className="text-xl font-semibold">{reportData.sales.topProducts.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Selling Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {reportData.sales.topProducts.map((product, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-1">
                                <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">₹{product.sales.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Category-wise Sales */}
            <Card>
                <CardHeader>
                    <CardTitle>Category-wise Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(reportData.sales.categoryWise).map(([category, sales], index) => {
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']
                            const color = colors[index % colors.length]
                            const percentage = (sales / Object.values(reportData.sales.categoryWise).reduce((a, b) => a + b, 0)) * 100

                            return (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded ${color}`}></div>
                                        <span className="text-xs font-medium">{category}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="text-xs font-semibold w-16 text-right">₹{sales.toLocaleString()}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const renderInventoryReport = () => (
        <div className="space-y-6">
            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm">📦</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-xl font-semibold">{reportData.inventory.totalProducts}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-sm">💰</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Stock Value</p>
                                <p className="text-xl font-semibold">₹{reportData.inventory.stockValue.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 text-sm">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Low Stock</p>
                                <p className="text-xl font-semibold">{reportData.inventory.lowStockItems}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 text-sm">⏰</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Expiring Soon</p>
                                <p className="text-xl font-semibold">{reportData.inventory.expiringItems}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stock Valuation */}
            <Card>
                <CardHeader>
                    <CardTitle>Stock Valuation Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {products.slice(0, 10).map((product) => {
                            const stockValue = product.costPrice * product.stock
                            return (
                                <div key={product.sku} className="flex justify-between items-center border-b pb-1">
                                    <div>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-500">Stock: {product.stock} units</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">₹{stockValue.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">@ ₹{product.costPrice}/unit</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const renderCustomerReport = () => (
        <div className="space-y-6">
            {/* Customer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm">👥</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Customers</p>
                                <p className="text-xl font-semibold">{reportData.customers.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 text-sm">🛒</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Regular</p>
                                <p className="text-xl font-semibold">{reportData.customers.regular}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 text-sm">🏢</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Wholesale</p>
                                <p className="text-xl font-semibold">{reportData.customers.wholesale}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-yellow-600 text-sm">⭐</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">VIP</p>
                                <p className="text-xl font-semibold">{reportData.customers.vip}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Outstanding Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Outstanding Payments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {customers.filter(c => c.outstandingAmount > 0).map((customer) => (
                            <div key={customer.id} className="flex justify-between items-center border-b pb-1">
                                <div>
                                    <p className="font-medium text-sm">{customer.name}</p>
                                    <p className="text-xs text-gray-500">{customer.type} • {customer.contact}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-red-600 text-sm">₹{customer.outstandingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )

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
                            <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                            <p className="text-gray-600">Generate comprehensive reports and analytics</p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => window.print()}
                                className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                            >
                                Print Report
                            </Button>
                            <Button
                                onClick={() => {/* Export logic */ }}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Export Excel
                            </Button>
                        </div>
                    </div>

                    {/* Report Type Selection */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant={selectedReport === 'sales' ? 'default' : 'outline'}
                                    onClick={() => setSelectedReport('sales')}
                                    className={selectedReport === 'sales' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    Sales Reports
                                </Button>
                                <Button
                                    variant={selectedReport === 'inventory' ? 'default' : 'outline'}
                                    onClick={() => setSelectedReport('inventory')}
                                    className={selectedReport === 'inventory' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    Inventory Reports
                                </Button>
                                <Button
                                    variant={selectedReport === 'customers' ? 'default' : 'outline'}
                                    onClick={() => setSelectedReport('customers')}
                                    className={selectedReport === 'customers' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    Customer Reports
                                </Button>
                                <Button
                                    variant={selectedReport === 'suppliers' ? 'default' : 'outline'}
                                    onClick={() => setSelectedReport('suppliers')}
                                    className={selectedReport === 'suppliers' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    Supplier Reports
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Date Range Filter */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <Input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <Input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={() => {/* Refresh report */ }}>
                                        Generate Report
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Content */}
                    {selectedReport === 'sales' && renderSalesReport()}
                    {selectedReport === 'inventory' && renderInventoryReport()}
                    {selectedReport === 'customers' && renderCustomerReport()}
                    {selectedReport === 'suppliers' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600 text-sm">🏢</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-gray-600">Total Suppliers</p>
                                                <p className="text-xl font-semibold">{reportData.suppliers.total}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                <span className="text-red-600 text-sm">💰</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-gray-600">Outstanding</p>
                                                <p className="text-xl font-semibold">₹{reportData.suppliers.outstanding.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <span className="text-yellow-600 text-sm">📋</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-gray-600">Pending Orders</p>
                                                <p className="text-xl font-semibold">{reportData.suppliers.pendingOrders}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}