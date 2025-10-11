'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@retail/ui'
import { retailProducts, retailCustomers, retailSuppliers } from '@retail/shared'
import { useRouter } from 'next/navigation'

export default function RetailPage() {
    const router = useRouter()
    const [products] = useState(retailProducts)
    const [customers] = useState(retailCustomers)
    const [suppliers] = useState(retailSuppliers)

    // Loading state for the main retail page
    const [isLoading, setIsLoading] = useState(true)

    // Simulate loading on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500) // Simulate 1.5 seconds loading time

        return () => clearTimeout(timer)
    }, [])

    // Calculate dashboard metrics
    const dashboardMetrics = useMemo(() => {
        const totalProducts = products.length
        const activeProducts = products.filter(p => p.isActive).length
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
        const lowStockItems = products.filter(p => p.stock <= p.minStock).length
        const outOfStockItems = products.filter(p => p.stock <= 0).length
        const totalCustomers = customers.length
        const regularCustomers = customers.filter(c => c.type === 'Regular').length
        const wholesaleCustomers = customers.filter(c => c.type === 'Wholesale').length
        const vipCustomers = customers.filter(c => c.type === 'VIP').length
        const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingAmount, 0)
        const totalSuppliers = suppliers.length
        const supplierOutstanding = suppliers.reduce((sum, s) => sum + s.outstandingAmount, 0)

        // Calculate sales metrics (simulated based on retail data)
        const totalSales = products.reduce((sum, p) => sum + (p.sellPrice * Math.floor(Math.random() * 20)), 0)
        const cashSales = totalSales * 0.7
        const cardSales = totalSales * 0.2
        const upiSales = totalSales * 0.1

        // Calculate stock value
        const stockValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0)

        // Calculate expiring products (within 30 days)
        const today = new Date()
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        const expiringProducts = products.filter(p => {
            if (!p.expiryDate) return false
            const expiryDate = new Date(p.expiryDate)
            return expiryDate <= thirtyDaysFromNow && expiryDate > today
        }).length

        // Calculate category-wise sales
        const categorySales = products.reduce((acc, p) => {
            const sales = p.sellPrice * Math.floor(Math.random() * 15)
            acc[p.category] = (acc[p.category] || 0) + sales
            return acc
        }, {} as Record<string, number>)

        return {
            totalProducts,
            activeProducts,
            totalStock,
            lowStockItems,
            outOfStockItems,
            totalCustomers,
            regularCustomers,
            wholesaleCustomers,
            vipCustomers,
            totalOutstanding,
            totalSuppliers,
            supplierOutstanding,
            totalSales,
            cashSales,
            cardSales,
            upiSales,
            stockValue,
            expiringProducts,
            categorySales
        }
    }, [products, customers, suppliers])

    // Get low stock items
    const lowStockItems = useMemo(() => {
        return products
            .filter(p => p.stock <= p.minStock)
            .slice(0, 4)
            .map(p => ({
                name: p.name,
                stock: p.stock,
                minStock: p.minStock
            }))
    }, [products])

    // Navigation handlers
    const handleNavigation = (path: string) => {
        router.push(path)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Loading State */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Left Column skeleton */}
                            <div className="lg:col-span-1 space-y-4">
                                {/* Sales Shortcuts skeleton */}
                                <Card className="h-fit shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-24 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="h-16 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded flex flex-col items-center justify-center">
                                                    <Skeleton className="w-5 h-5 rounded-md mb-1" />
                                                    <Skeleton className="h-3 w-12 mb-1" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Middle Column skeleton */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-28 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-32 w-full" />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column skeleton */}
                            <div className="lg:col-span-1 space-y-4">
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-32 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3">
                                        <Skeleton className="h-48 w-full rounded" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                            {/* Left Column - Sales Shortcuts */}
                            <div className="lg:col-span-1">
                                <Card className="h-fit shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Sales Shortcuts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 hover:border-orange-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/sales')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Sale</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 hover:border-orange-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/pos')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">POS<br />System</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 hover:border-orange-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/sales')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">Return<br />Sale</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 hover:border-orange-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/customers')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Customer</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Inventory Shortcuts */}
                                <Card className="h-fit mt-4 shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-red-400 via-pink-400 to-orange-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Inventory Shortcuts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 hover:border-red-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/inventory')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">Add<br />Product</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 hover:border-red-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/inventory')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">Stock<br />Adjustment</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 hover:border-red-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/inventory')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">View<br />Inventory</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200 hover:border-red-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/retail/reports')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-red-500 to-pink-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">Stock<br />Report</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Middle Column - Store Details & Financial Summary */}
                            <div className="lg:col-span-2 space-y-4">

                                {/* Store Details */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Retail Store Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Store: #1 | Fashion Retail Store</p>
                                                <p className="text-xs text-gray-500">123 Main Street, Downtown - 12345</p>
                                            </div>
                                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xs px-3 py-1.5">
                                                🏪 Store Open
                                            </Button>
                                        </div>

                                        {/* Financial Cards */}
                                        <div className="mt-4 grid grid-cols-4 gap-3">
                                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">Today Sales</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.totalSales.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">Cash</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.cashSales.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">Card</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.cardSales.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">UPI</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.upiSales.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* KPI Cards */}
                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg text-center shadow-sm">
                                                <h3 className="text-xs font-medium text-indigo-600">Stock Value</h3>
                                                <p className="text-sm font-bold text-indigo-800">₹{dashboardMetrics.stockValue.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg text-center shadow-sm">
                                                <h3 className="text-xs font-medium text-red-600">Expiring Soon</h3>
                                                <p className="text-sm font-bold text-red-800">{dashboardMetrics.expiringProducts} items</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg text-center shadow-sm">
                                                <h3 className="text-xs font-medium text-gray-600">Pending Receivables</h3>
                                                <p className="text-sm font-bold">₹{dashboardMetrics.totalOutstanding.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg text-center shadow-sm">
                                                <h3 className="text-xs font-medium text-gray-600">Total Customers</h3>
                                                <p className="text-sm font-bold">{dashboardMetrics.totalCustomers}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex space-x-3">
                                                <span className="text-xs text-gray-600">Hold Sales: <strong>0</strong></span>
                                                <span className="text-xs text-gray-600">Returns: <strong>0</strong></span>
                                            </div>
                                            <Button variant="outline" className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-300 text-xs px-3 py-1.5">
                                                Add Expense
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Alerts Section */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-red-500 to-pink-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">⚠️ Alerts & Notifications</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            {dashboardMetrics.lowStockItems > 0 && (
                                                <div className="flex items-center space-x-3 p-2 bg-orange-50 border border-orange-200 rounded">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    <span className="text-sm text-orange-700">
                                                        {dashboardMetrics.lowStockItems} items are running low on stock
                                                    </span>
                                                </div>
                                            )}
                                            {dashboardMetrics.expiringProducts > 0 && (
                                                <div className="flex items-center space-x-3 p-2 bg-red-50 border border-red-200 rounded">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    <span className="text-sm text-red-700">
                                                        {dashboardMetrics.expiringProducts} products expiring within 30 days
                                                    </span>
                                                </div>
                                            )}
                                            {dashboardMetrics.outOfStockItems > 0 && (
                                                <div className="flex items-center space-x-3 p-2 bg-red-50 border border-red-200 rounded">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    <span className="text-sm text-red-700">
                                                        {dashboardMetrics.outOfStockItems} items are out of stock
                                                    </span>
                                                </div>
                                            )}
                                            {dashboardMetrics.totalOutstanding > 50000 && (
                                                <div className="flex items-center space-x-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <span className="text-sm text-yellow-700">
                                                        High outstanding amount: ₹{dashboardMetrics.totalOutstanding.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Category-wise Sales Chart */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Category-wise Sales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {Object.entries(dashboardMetrics.categorySales).map(([category, sales], index) => {
                                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']
                                                const color = colors[index % colors.length]
                                                const percentage = (sales / Object.values(dashboardMetrics.categorySales).reduce((a, b) => a + b, 0)) * 100

                                                return (
                                                    <div key={category} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`w-3 h-3 rounded ${color}`}></div>
                                                            <span className="text-xs text-gray-600">{category}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                                <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                            <span className="text-xs font-semibold">₹{sales.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Store Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Total Products:</span>
                                                    <span className="font-semibold">{dashboardMetrics.totalProducts}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Active Products:</span>
                                                    <span className="font-semibold text-green-600">{dashboardMetrics.activeProducts}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Total Stock:</span>
                                                    <span className="font-semibold">{dashboardMetrics.totalStock.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Low Stock Items:</span>
                                                    <span className="font-semibold text-orange-600">{dashboardMetrics.lowStockItems}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Out of Stock:</span>
                                                    <span className="font-semibold text-red-600">{dashboardMetrics.outOfStockItems}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Total Customers:</span>
                                                    <span className="font-semibold">{dashboardMetrics.totalCustomers}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Regular:</span>
                                                    <span className="font-semibold text-blue-600">{dashboardMetrics.regularCustomers}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Wholesale:</span>
                                                    <span className="font-semibold text-green-600">{dashboardMetrics.wholesaleCustomers}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Charts & Stock Items */}
                            <div className="lg:col-span-1 space-y-4">

                                {/* Sales Chart */}
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Daily Sales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3">
                                        {/* Bar Chart Placeholder */}
                                        <div className="h-48 flex items-end justify-between space-x-1">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                                <div key={day} className="flex flex-col items-center">
                                                    <div className="bg-gradient-to-t from-orange-500 to-red-600 w-4" style={{ height: `${Math.random() * 120 + 30}px` }}></div>
                                                    <span className="text-xs mt-1">{day}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-center">
                                            <span className="text-sm font-bold text-orange-600">📈 Sales Trending Up!</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Low Stock Items */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-red-400 to-pink-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="flex justify-between items-center text-sm font-medium tracking-wide">
                                            <span>Low Stock Items</span>
                                            <span className="text-xs bg-white text-red-600 px-2 py-0.5 rounded">Qty</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="max-h-36 overflow-y-auto">
                                            <table className="w-full">
                                                <tbody>
                                                    {lowStockItems.map((item, index) => (
                                                        <tr key={index} className="border-b border-gray-100">
                                                            <td className="px-3 py-1.5 text-xs">{item.name}</td>
                                                            <td className={`px-3 py-1.5 text-xs text-right ${item.stock <= 5 ? 'text-red-600' : item.stock <= 10 ? 'text-orange-600' : ''}`}>
                                                                {item.stock}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-pink-400 to-orange-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <Button
                                            variant="outline"
                                            className="w-full h-8 text-xs bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 hover:border-orange-300"
                                            onClick={() => handleNavigation('/retail/pos')}
                                        >
                                            🛒 Start POS
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-8 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300"
                                            onClick={() => handleNavigation('/retail/inventory')}
                                        >
                                            📦 Manage Inventory
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-8 text-xs bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300"
                                            onClick={() => handleNavigation('/retail/reports')}
                                        >
                                            📊 View Reports
                                        </Button>
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
