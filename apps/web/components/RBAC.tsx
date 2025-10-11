'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState, authzUtils } from '@retail/shared'

interface TileGuardProps {
    tile: 'garment' | 'pharmacy' | 'retail'
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function TileGuard({ tile, children, fallback = null }: TileGuardProps) {
    const { authz } = useSelector((state: RootState) => state.auth)
    const allowed = authzUtils.isTileAllowed(authz, tile)
    return <>{allowed ? children : fallback}</>
}

interface PageGuardProps {
    tile: 'garment' | 'pharmacy' | 'retail'
    page: string
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function PageGuard({ tile, page, children, fallback = null }: PageGuardProps) {
    const { authz } = useSelector((state: RootState) => state.auth)
    const allowed = authzUtils.isPageAllowed(authz, tile, page as any)
    return <>{allowed ? children : fallback}</>
}

interface ActionGateProps {
    tile: 'garment' | 'pharmacy' | 'retail'
    page: string
    action: string
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function ActionGate({ tile, page, action, children, fallback = null }: ActionGateProps) {
    const { authz } = useSelector((state: RootState) => state.auth)
    const allowed = authzUtils.isActionAllowed(authz, tile, page as any, action)
    return <>{allowed ? children : fallback}</>
}

export function NotAuthorized({ message = 'You are not authorized to access this resource.' }: { message?: string }) {
    return (
        <div className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded p-4">
                {message}
            </div>
        </div>
    )
}


