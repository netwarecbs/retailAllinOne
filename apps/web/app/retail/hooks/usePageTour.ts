'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { tourSections } from '../data/tourData'
import { TourStep } from '../data/tourData'

interface UsePageTourOptions {
    autoStart?: boolean
    delay?: number
    onComplete?: () => void
    onSkip?: () => void
}

export const usePageTour = (pagePath: string, options: UsePageTourOptions = {}) => {
    const router = useRouter()
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState<TourStep | null>(null)
    const [steps, setSteps] = useState<TourStep[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    // Find the tour section for this page
    const tourSection = tourSections.find(section => section.route === pagePath)

    useEffect(() => {
        if (options.autoStart && tourSection) {
            const timer = setTimeout(() => {
                startTour()
            }, options.delay || 1000)

            return () => clearTimeout(timer)
        }
    }, [options.autoStart, options.delay, tourSection])

    const startTour = () => {
        if (tourSection) {
            setSteps(tourSection.steps)
            setCurrentIndex(0)
            setCurrentStep(tourSection.steps[0])
            setIsActive(true)

            // Highlight the first step
            setTimeout(() => {
                highlightElement(tourSection.steps[0].target)
            }, 500)
        }
    }

    const nextStep = () => {
        if (currentIndex < steps.length - 1) {
            const nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
            setCurrentStep(steps[nextIndex])

            // Handle navigation actions
            if (steps[nextIndex].action === 'navigate' && steps[nextIndex].route) {
                router.push(steps[nextIndex].route!)
                setTimeout(() => {
                    highlightElement(steps[nextIndex].target)
                }, 1000)
            } else {
                highlightElement(steps[nextIndex].target)
            }
        } else {
            completeTour()
        }
    }

    const prevStep = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1
            setCurrentIndex(prevIndex)
            setCurrentStep(steps[prevIndex])
            highlightElement(steps[prevIndex].target)
        }
    }

    const completeTour = () => {
        setIsActive(false)
        setCurrentStep(null)
        setSteps([])
        setCurrentIndex(0)
        options.onComplete?.()
    }

    const skipTour = () => {
        completeTour()
        options.onSkip?.()
    }

    const highlightElement = (target: string) => {
        const element = document.querySelector(target) as HTMLElement
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('tour-highlight')

            // Add step indicator
            const indicator = document.createElement('div')
            indicator.className = 'tour-step-indicator'
            indicator.textContent = (currentIndex + 1).toString()
            element.appendChild(indicator)
        }
    }

    const stopHighlight = () => {
        const element = document.querySelector(currentStep?.target || '') as HTMLElement
        if (element) {
            element.classList.remove('tour-highlight')
            const indicator = element.querySelector('.tour-step-indicator')
            if (indicator) {
                indicator.remove()
            }
        }
    }

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
        stopHighlight
    }
}

// Predefined page tours
export const pageTours = {
    dashboard: {
        autoStart: false,
        steps: [
            {
                id: 'dashboard-welcome',
                title: 'Welcome to Dashboard!',
                description: 'This is your main dashboard with key business metrics.',
                target: '.dashboard-header',
                position: 'bottom' as const
            }
        ]
    },
    inventory: {
        autoStart: false,
        steps: [
            {
                id: 'inventory-overview',
                title: 'Inventory Management',
                description: 'Manage your products and track stock levels here.',
                target: '.inventory-header',
                position: 'bottom' as const
            }
        ]
    },
    sales: {
        autoStart: false,
        steps: [
            {
                id: 'sales-overview',
                title: 'Sales Management',
                description: 'Process sales transactions and manage customers.',
                target: '.sales-header',
                position: 'bottom' as const
            }
        ]
    },
    settings: {
        autoStart: false,
        steps: [
            {
                id: 'settings-overview',
                title: 'Settings & Configuration',
                description: 'Configure your retail system and manage master data.',
                target: '.settings-header',
                position: 'bottom' as const
            }
        ]
    }
}
