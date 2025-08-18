'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@retail/ui'
import { sampleProducts } from '@retail/shared/src/data/sampleProducts'
import { sampleCustomers } from '@retail/shared/src/data/sampleCustomers'
import { Product } from '@retail/shared/src/types/product'
import { Customer } from '@retail/shared/src/types/sales'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GarmentPage() {
    const router = useRouter()
    const [products] = useState<Product[]>(sampleProducts)
    const [customers] = useState<Customer[]>(sampleCustomers)

    // Loading state for the main garment page
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
        const wholesaleCustomers = customers.filter(c => c.isWholesale).length
        const retailCustomers = customers.filter(c => !c.isWholesale).length
        const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingAmount || 0), 0)

        // Calculate sales metrics (simulated)
        const totalSales = products.reduce((sum, p) => sum + (p.price * Math.floor(Math.random() * 100)), 0)
        const cashSales = totalSales * 0.6
        const cardSales = totalSales * 0.25
        const upiSales = totalSales * 0.15

        // Calculate expenses (simulated)
        const totalExpenses = {
            carriage: 15000,
            courier: 8000,
            labour: 25000,
            packaging: 12000
        }

        return {
            totalProducts,
            activeProducts,
            totalStock,
            lowStockItems,
            outOfStockItems,
            totalCustomers,
            wholesaleCustomers,
            retailCustomers,
            totalOutstanding,
            totalSales,
            cashSales,
            cardSales,
            upiSales,
            totalExpenses
        }
    }, [products, customers])

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

    // Get expiring stock items (simulated)
    const expiringStockItems = useMemo(() => {
        return products
            .slice(0, 4)
            .map(p => ({
                name: p.name,
                stock: p.stock,
                isExpiring: Math.random() > 0.7
            }))
    }, [products])

    // Navigation handlers
    const handleNavigation = (path: string) => {
        router.push(path)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                    {/* Loading State */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Left Column skeleton */}
                            <div className="lg:col-span-1 space-y-4">
                                {/* Sales Shortcuts skeleton */}
                                <Card className="h-fit shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-24 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="h-16 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded flex flex-col items-center justify-center">
                                                    <Skeleton className="w-5 h-5 rounded-md mb-1" />
                                                    <Skeleton className="h-3 w-12 mb-1" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Purchase Shortcuts skeleton */}
                                <Card className="h-fit mt-4 shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-28 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="h-16 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded flex flex-col items-center justify-center">
                                                    <Skeleton className="w-5 h-5 rounded-md mb-1" />
                                                    <Skeleton className="h-3 w-12 mb-1" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Other Shortcuts skeleton */}
                                <Card className="h-fit mt-4 shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-24 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="h-14 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded flex flex-col items-center justify-center">
                                                    <Skeleton className="w-4 h-4 rounded-md mb-1" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Middle Column skeleton */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Company Details skeleton */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-28 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Skeleton className="h-3 w-32 mb-1" />
                                                <Skeleton className="h-3 w-40" />
                                            </div>
                                            <Skeleton className="h-6 w-24 rounded" />
                                        </div>

                                        <div className="mt-4 flex items-center space-x-3">
                                            <Skeleton className="w-3 h-3 rounded" />
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-6 w-24 rounded" />
                                        </div>

                                        {/* Financial Cards skeleton */}
                                        <div className="mt-4 grid grid-cols-4 gap-3">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg text-center shadow-md">
                                                    <Skeleton className="h-3 w-8 mx-auto mb-1 bg-white/30" />
                                                    <Skeleton className="h-6 w-16 mx-auto bg-white/30" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            {Array.from({ length: 2 }).map((_, index) => (
                                                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg text-center shadow-sm">
                                                    <Skeleton className="h-3 w-20 mx-auto mb-1" />
                                                    <Skeleton className="h-4 w-16 mx-auto" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg text-center shadow-sm">
                                                    <Skeleton className="h-3 w-16 mx-auto mb-1" />
                                                    <Skeleton className="h-4 w-12 mx-auto" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex space-x-3">
                                                <Skeleton className="h-3 w-20" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                            <Skeleton className="h-6 w-24 rounded" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Expenses Chart skeleton */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="pb-3">
                                        <Skeleton className="h-4 w-32" />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-center">
                                            <Skeleton className="w-32 h-32 rounded-full" />
                                            <div className="ml-6">
                                                <div className="space-y-1.5">
                                                    {Array.from({ length: 4 }).map((_, index) => (
                                                        <div key={index} className="flex items-center">
                                                            <Skeleton className="w-3 h-3 rounded mr-2" />
                                                            <Skeleton className="h-3 w-24" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column skeleton */}
                            <div className="lg:col-span-1 space-y-4">
                                {/* Purchase - Sales Chart skeleton */}
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 text-white rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-32 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3">
                                        <Skeleton className="h-48 w-full rounded" />
                                        <div className="mt-3 text-center">
                                            <Skeleton className="h-4 w-32 mx-auto" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Expiring Stock Items skeleton */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-indigo-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-32 bg-white/20" />
                                            <Skeleton className="h-4 w-8 bg-white/20" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="max-h-36 overflow-y-auto">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="flex justify-between items-center px-3 py-1.5 border-b border-gray-100">
                                                    <Skeleton className="h-3 w-20" />
                                                    <Skeleton className="h-3 w-8" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Low Stock Items skeleton */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white/95 rounded-t-lg pb-3">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-24 bg-white/20" />
                                            <Skeleton className="h-4 w-8 bg-white/20" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="max-h-36 overflow-y-auto">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="flex justify-between items-center px-3 py-1.5 border-b border-gray-100">
                                                    <Skeleton className="h-3 w-20" />
                                                    <Skeleton className="h-3 w-8" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats skeleton */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-green-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <Skeleton className="h-4 w-20 bg-white/20" />
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        {Array.from({ length: 8 }).map((_, index) => (
                                            <div key={index} className="flex justify-between text-xs">
                                                <Skeleton className="h-3 w-20" />
                                                <Skeleton className="h-3 w-8" />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                            {/* Left Column - Sales Shortcuts */}
                            <div className="lg:col-span-1">
                                <Card className="h-fit shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Sales Shortcuts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 hover:border-indigo-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/sales')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Delivery Note<br />(Challan)</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 hover:border-indigo-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/sales')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Quotation (PI)</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 hover:border-indigo-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/sales')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Credit Note<br />(Sale Return)</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 hover:border-indigo-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/sales')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Sales</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Purchase Shortcuts */}
                                <Card className="h-fit mt-4 shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Purchase Shortcuts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 hover:border-purple-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/purchase')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Purchase Order</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 hover:border-purple-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/purchase')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Purchase</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 hover:border-purple-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/purchase')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Debit Note<br />(Purchase Return)</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-16 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 hover:border-purple-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/purchase')}
                                            >
                                                <div className="w-5 h-5 mb-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New<br />Delivery Note<br />(Challan)</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Other Shortcuts */}
                                <Card className="h-fit mt-4 shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Other Shortcuts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-14 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/inventory')}
                                            >
                                                <div className="w-4 h-4 mb-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">Inventory</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-14 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 transition-all duration-200"
                                                onClick={() => handleNavigation('/garment/pos')}
                                            >
                                                <div className="w-4 h-4 mb-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">POS</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-14 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 transition-all duration-200"
                                            >
                                                <div className="w-4 h-4 mb-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">Balance Sheet</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-14 flex flex-col items-center justify-center text-xs bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 transition-all duration-200"
                                            >
                                                <div className="w-4 h-4 mb-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-center text-xs font-medium">New Transaction</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Middle Column - Company Details & Financial Summary */}
                            <div className="lg:col-span-2 space-y-4">

                                {/* Company Details */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Company Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Invoice: #4 | Fashion Store</p>
                                                <p className="text-xs text-gray-500">123 Fashion Street, Kolkata - 700001</p>
                                            </div>
                                            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xs px-3 py-1.5">
                                                🛒 Online Store
                                            </Button>
                                        </div>

                                        {/* Profit Section */}
                                        <div className="mt-4 flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                <input type="checkbox" className="w-3 h-3" />
                                                <label className="text-xs font-medium text-gray-600">Profit -</label>
                                                <input
                                                    type="date"
                                                    defaultValue={new Date().toISOString().split('T')[0]}
                                                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Financial Cards */}
                                        <div className="mt-4 grid grid-cols-4 gap-3">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">Sale</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.totalSales.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">Cash</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.cashSales.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">Card</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.cardSales.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-lg text-center shadow-md">
                                                <h3 className="text-xs font-medium">UPI</h3>
                                                <p className="text-lg font-bold">₹{dashboardMetrics.upiSales.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg text-center shadow-sm">
                                                <h3 className="text-xs font-medium text-gray-600">Pending Received</h3>
                                                <p className="text-sm font-bold">₹{dashboardMetrics.totalOutstanding.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg text-center shadow-sm">
                                                <h3 className="text-xs font-medium text-gray-600">Pending Payment</h3>
                                                <p className="text-sm font-bold">₹0</p>
                                            </div>
                                        </div>

                                        {/* Totals */}
                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg text-center shadow-sm">
                                                <p className="text-xs text-blue-600 font-medium">Total Payable</p>
                                                <p className="text-sm font-bold text-blue-800">₹0</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg text-center shadow-sm">
                                                <p className="text-xs text-green-600 font-medium">Total Receivable</p>
                                                <p className="text-sm font-bold text-green-800">₹{dashboardMetrics.totalOutstanding.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-lg text-center shadow-sm">
                                                <p className="text-xs text-purple-600 font-medium">Today Expense</p>
                                                <p className="text-sm font-bold text-purple-800">₹{(dashboardMetrics.totalExpenses.carriage + dashboardMetrics.totalExpenses.courier + dashboardMetrics.totalExpenses.labour + dashboardMetrics.totalExpenses.packaging).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Hold Section */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex space-x-3">
                                                <span className="text-xs text-gray-600">Hold Purch: <strong>0</strong></span>
                                                <span className="text-xs text-gray-600">Hold Sale: <strong>0</strong></span>
                                            </div>
                                            <Button variant="outline" className="bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-300 text-xs px-3 py-1.5">
                                                Add Expense
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Expenses Chart */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Total Expenses</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-center">
                                            <div className="relative w-32 h-32">
                                                {/* Donut Chart Placeholder */}
                                                <div className="w-32 h-32 rounded-full border-6 border-gray-200 relative">
                                                    <div className="absolute inset-0 rounded-full border-6 border-l-slate-600 border-t-red-500 border-r-yellow-400 border-b-green-500"></div>
                                                    <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-gray-600">₹{(dashboardMetrics.totalExpenses.carriage + dashboardMetrics.totalExpenses.courier + dashboardMetrics.totalExpenses.labour + dashboardMetrics.totalExpenses.packaging).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-slate-600 rounded mr-2"></div>
                                                        <span className="text-xs">Carriage: ₹{dashboardMetrics.totalExpenses.carriage.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                                                        <span className="text-xs">Courier: ₹{dashboardMetrics.totalExpenses.courier.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                                                        <span className="text-xs">Labour: ₹{dashboardMetrics.totalExpenses.labour.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                                                        <span className="text-xs">Packaging: ₹{dashboardMetrics.totalExpenses.packaging.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Charts & Stock Items */}
                            <div className="lg:col-span-1 space-y-4">

                                {/* Purchase - Sales Chart */}
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 text-white rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Purchase - Sales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3">
                                        {/* Bar Chart Placeholder */}
                                        <div className="h-48 flex items-end justify-between space-x-1">
                                            {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => (
                                                <div key={month} className="flex flex-col items-center">
                                                    <div className="bg-gradient-to-t from-green-500 to-green-600 w-4" style={{ height: `${Math.random() * 120 + 30}px` }}></div>
                                                    <span className="text-xs mt-1 rotate-45 origin-bottom-left">{month}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-center">
                                            <span className="text-sm font-bold text-green-600">💰 Like it? !!Buy Now!!</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Expiring Stock Items */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-indigo-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="flex justify-between items-center text-sm font-medium tracking-wide">
                                            <span>Expiring Stock Items</span>
                                            <span className="text-xs bg-white text-blue-600 px-2 py-0.5 rounded">Qty</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="max-h-36 overflow-y-auto">
                                            <table className="w-full">
                                                <tbody>
                                                    {expiringStockItems.map((item, index) => (
                                                        <tr key={index} className="border-b border-gray-100">
                                                            <td className="px-3 py-1.5 text-xs">{item.name}</td>
                                                            <td className={`px-3 py-1.5 text-xs text-right ${item.isExpiring ? 'text-red-600' : ''}`}>
                                                                {item.isExpiring ? `-${item.stock}` : item.stock}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Low Stock Items */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="flex justify-between items-center text-sm font-medium tracking-wide">
                                            <span>Low Stock Items</span>
                                            <span className="text-xs bg-white text-purple-600 px-2 py-0.5 rounded">Qty</span>
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

                                {/* Quick Stats */}
                                <Card className="shadow-md border-0">
                                    <CardHeader className="bg-gradient-to-br from-green-400 to-blue-500 text-white/95 rounded-t-lg pb-3">
                                        <CardTitle className="text-sm font-medium tracking-wide">Quick Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
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
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Out of Stock:</span>
                                            <span className="font-semibold text-red-600">{dashboardMetrics.outOfStockItems}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Total Customers:</span>
                                            <span className="font-semibold">{dashboardMetrics.totalCustomers}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Wholesale:</span>
                                            <span className="font-semibold text-blue-600">{dashboardMetrics.wholesaleCustomers}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Retail:</span>
                                            <span className="font-semibold text-green-600">{dashboardMetrics.retailCustomers}</span>
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
