'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@retail/ui'
import { RootState, AppDispatch, logoutUser } from '@retail/shared'
import AuthGuard from '../../components/AuthGuard'
import { TileGuard, PageGuard, NotAuthorized } from '../../components/RBAC'

export default function GarmentLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.auth)

    const handleLogout = async () => {
        await dispatch(logoutUser())
        router.push('/login')
    }

    const handleBackToDashboard = () => {
        router.push('/dashboard')
    }

    return (
        <AuthGuard>
            <TileGuard tile="garment" fallback={<NotAuthorized message="You are not authorized to access Garment app." />}>
                <div className="min-h-screen bg-gray-50 saturate-90">
                    {/* Header */}
                    <header className="bg-white shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-bold text-gray-900">Garment Management</h1>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Button variant="outline" onClick={handleBackToDashboard} className="text-sm">Back to Dashboard</Button>
                                    <span className="text-sm text-gray-700">Welcome, {user?.name || 'User'}</span>
                                    <Button variant="outline" onClick={handleLogout} className="text-sm">Logout</Button>
                                    <span className="hidden md:inline-block h-5 w-px bg-gray-300" />
                                    <div className="hidden md:flex items-center space-x-2">
                                        <span className="text-xs text-gray-600 font-medium">Company & Period</span>
                                        <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
                                            <option>Company Name #3744</option>
                                        </select>
                                        <span className="text-xs text-gray-600">01-04-2025 to 31-03-2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Application Navigation Bar */}
                    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-center items-center h-14">
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="outline"
                                        className={`${(pathname === '/garment' || pathname === '/garment/')
                                            ? 'h-9 px-4 text-xs font-semibold bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40 relative backdrop-blur-sm'
                                            : 'h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/15 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-sm'}`}
                                        onClick={() => router.push('/garment')}
                                    >
                                        Dashboard
                                        {(pathname === '/garment' || pathname === '/garment/') && (
                                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-sm"></div>
                                        )}
                                    </Button>
                                    <PageGuard tile="garment" page="purchase" fallback={<></>}>
                                        <Button
                                            variant="outline"
                                            className={`${pathname?.startsWith('/garment/purchase')
                                                ? 'h-9 px-4 text-xs font-semibold bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40 relative backdrop-blur-sm'
                                                : 'h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/15 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-sm'}`}
                                            onClick={() => router.push('/garment/purchase')}
                                        >
                                            Purchase
                                            {pathname?.startsWith('/garment/purchase') && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-sm"></div>
                                            )}
                                        </Button>
                                    </PageGuard>
                                    <PageGuard tile="garment" page="inventory" fallback={<></>}>
                                        <Button
                                            variant="outline"
                                            className={`${pathname?.startsWith('/garment/inventory')
                                                ? 'h-9 px-4 text-xs font-semibold bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40 relative backdrop-blur-sm'
                                                : 'h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/15 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-sm'}`}
                                            onClick={() => router.push('/garment/inventory')}
                                        >
                                            Inventory
                                            {pathname?.startsWith('/garment/inventory') && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-sm"></div>
                                            )}
                                        </Button>
                                    </PageGuard>
                                    <PageGuard tile="garment" page="sales" fallback={<></>}>
                                        <Button
                                            variant="outline"
                                            className={`${pathname?.startsWith('/garment/sales')
                                                ? 'h-9 px-4 text-xs font-semibold bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40 relative backdrop-blur-sm'
                                                : 'h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/15 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-sm'}`}
                                            onClick={() => router.push('/garment/sales')}
                                        >
                                            Sales
                                            {pathname?.startsWith('/garment/sales') && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-sm"></div>
                                            )}
                                        </Button>
                                    </PageGuard>
                                    <PageGuard tile="garment" page="pos" fallback={<></>}>
                                        <Button
                                            variant="outline"
                                            className={`${pathname?.startsWith('/garment/pos')
                                                ? 'h-9 px-4 text-xs font-semibold bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40 relative backdrop-blur-sm'
                                                : 'h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/15 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-sm'}`}
                                            onClick={() => router.push('/garment/pos')}
                                        >
                                            POS
                                            {pathname?.startsWith('/garment/pos') && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-sm"></div>
                                            )}
                                        </Button>
                                    </PageGuard>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">View ▼</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">Accounts ▼</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">Reports ▼</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">Msg ▼</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">Import ▼</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">More ▼</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">Company</Button>
                                    <Button variant="outline" className="h-9 px-4 text-xs font-medium bg-transparent text-white/90 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm">Users</Button>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <PageGuard tile="garment" page={
                        pathname?.startsWith('/garment/purchase') ? 'purchase' :
                            pathname?.startsWith('/garment/inventory') ? 'inventory' :
                                pathname?.startsWith('/garment/sales') ? 'sales' :
                                    pathname?.startsWith('/garment/pos') ? 'pos' : 'dashboard'
                    } fallback={<NotAuthorized />}>
                        {children}
                    </PageGuard>
                </div>
            </TileGuard>
        </AuthGuard>
    )
}


