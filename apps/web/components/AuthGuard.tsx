'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState, apiService } from '@retail/shared'

interface AuthGuardProps {
    children: React.ReactNode
    redirectTo?: string
}

export default function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
    const router = useRouter()
    const { isAuthenticated, tokens } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated || !tokens) {
            console.log('Authentication failed: No valid tokens found')
            router.push(redirectTo)
            return
        }

        // Check if access token is expired
        if (apiService.isTokenExpired()) {
            console.log('Authentication failed: Access token expired')
            // Could implement token refresh logic here
            router.push(redirectTo)
            return
        }

        console.log('Authentication valid: Access granted')
    }, [isAuthenticated, tokens, router, redirectTo])

    // Show loading state while checking authentication
    if (!isAuthenticated || !tokens) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        )
    }

    // Show loading state if token is expired
    if (apiService.isTokenExpired()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Session expired, redirecting...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
