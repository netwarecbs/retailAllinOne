'use client'

import { useState, useEffect } from 'react'
import { Button } from '@retail/ui'

export interface ToastProps {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
        }, duration)

        return () => clearTimeout(timer)
    }, [id, duration, onClose])

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅'
            case 'error': return '❌'
            case 'warning': return '⚠️'
            case 'info': return 'ℹ️'
            default: return 'ℹ️'
        }
    }

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200'
            case 'error': return 'bg-red-50 border-red-200'
            case 'warning': return 'bg-yellow-50 border-yellow-200'
            case 'info': return 'bg-blue-50 border-blue-200'
            default: return 'bg-gray-50 border-gray-200'
        }
    }

    const getTextColor = () => {
        switch (type) {
            case 'success': return 'text-green-800'
            case 'error': return 'text-red-800'
            case 'warning': return 'text-yellow-800'
            case 'info': return 'text-blue-800'
            default: return 'text-gray-800'
        }
    }

    if (!isVisible) return null

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${getBgColor()}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <span className="text-lg">{getIcon()}</span>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className={`text-sm font-medium ${getTextColor()}`}>
                            {title}
                        </p>
                        {message && (
                            <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
                                {message}
                            </p>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsVisible(false)
                                setTimeout(() => onClose(id), 300)
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <span className="sr-only">Close</span>
                            ✕
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export interface ToastContainerProps {
    toasts: ToastProps[]
    onRemoveToast: (id: string) => void
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={onRemoveToast}
                />
            ))}
        </div>
    )
}
