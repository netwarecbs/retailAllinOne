'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TourStep } from '../data/tourData'

interface UseTourOptions {
    onComplete?: () => void
    onSkip?: () => void
    autoStart?: boolean
}

export const useTour = (options: UseTourOptions = {}) => {
    const router = useRouter()
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState<TourStep | null>(null)
    const [steps, setSteps] = useState<TourStep[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const startTour = useCallback((tourSteps: TourStep[]) => {
        setSteps(tourSteps)
        setCurrentIndex(0)
        setCurrentStep(tourSteps[0])
        setIsActive(true)
    }, [])

    const nextStep = useCallback(() => {
        if (currentIndex < steps.length - 1) {
            const nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
            setCurrentStep(steps[nextIndex])

            // Handle navigation actions
            if (steps[nextIndex].action === 'navigate' && steps[nextIndex].route) {
                router.push(steps[nextIndex].route!)
                setTimeout(() => {
                    // Continue tour after navigation
                }, 1000)
            }
        } else {
            completeTour()
        }
    }, [currentIndex, steps, router])

    const prevStep = useCallback(() => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1
            setCurrentIndex(prevIndex)
            setCurrentStep(steps[prevIndex])
        }
    }, [currentIndex, steps])

    const completeTour = useCallback(() => {
        setIsActive(false)
        setCurrentStep(null)
        setSteps([])
        setCurrentIndex(0)
        options.onComplete?.()
    }, [options])

    const skipTour = useCallback(() => {
        completeTour()
        options.onSkip?.()
    }, [completeTour, options])

    const highlightElement = useCallback((target: string) => {
        const element = document.querySelector(target) as HTMLElement
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Add highlight effect
            element.style.outline = '2px solid #f97316'
            element.style.outlineOffset = '2px'
            setTimeout(() => {
                element.style.outline = ''
                element.style.outlineOffset = ''
            }, 3000)
        }
    }, [])

    const addStep = useCallback((step: TourStep) => {
        setSteps(prev => [...prev, step])
    }, [])

    const updateStep = useCallback((stepId: string, updates: Partial<TourStep>) => {
        setSteps(prev =>
            prev.map(step =>
                step.id === stepId ? { ...step, ...updates } : step
            )
        )
    }, [])

    const removeStep = useCallback((stepId: string) => {
        setSteps(prev => prev.filter(step => step.id !== stepId))
    }, [])

    return {
        isActive,
        currentStep,
        currentIndex,
        totalSteps: steps.length,
        progress: steps.length > 0 ? ((currentIndex + 1) / steps.length) * 100 : 0,
        startTour,
        nextStep,
        prevStep,
        completeTour,
        skipTour,
        highlightElement,
        addStep,
        updateStep,
        removeStep
    }
}

// Predefined tour steps for common features
export const commonTourSteps = {
    dashboard: [
        {
            id: 'dashboard-welcome',
            title: 'Welcome to Retail Hub!',
            description: 'This is your main dashboard where you can see key performance indicators and quick access to all features.',
            target: '.dashboard-header',
            position: 'bottom' as const
        }
    ],
    inventory: [
        {
            id: 'inventory-overview',
            title: 'Inventory Management',
            description: 'Manage your products, track stock levels, and handle inventory operations.',
            target: '.inventory-header',
            position: 'bottom' as const
        }
    ],
    sales: [
        {
            id: 'sales-overview',
            title: 'Sales Management',
            description: 'Process sales transactions, manage customers, and handle payments.',
            target: '.sales-header',
            position: 'bottom' as const
        }
    ],
    settings: [
        {
            id: 'settings-overview',
            title: 'Settings & Configuration',
            description: 'Configure your retail system, manage master data, and set up preferences.',
            target: '.settings-header',
            position: 'bottom' as const
        }
    ]
}

// Tour step builder for dynamic tour creation
export const createTourStep = (
    id: string,
    title: string,
    description: string,
    target: string,
    options: Partial<TourStep> = {}
): TourStep => ({
    id,
    title,
    description,
    target,
    position: 'bottom',
    ...options
})

// Tour section builder
export const createTourSection = (
    id: string,
    name: string,
    description: string,
    icon: string,
    steps: TourStep[]
) => ({
    id,
    name,
    description,
    icon,
    steps,
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0]
})
