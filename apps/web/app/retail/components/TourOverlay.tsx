'use client'

import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { TourStep } from '../data/tourData'

interface TourOverlayProps {
    step: TourStep
    currentIndex: number
    totalSteps: number
    onNext: () => void
    onPrev: () => void
    onComplete: () => void
    onSkip: () => void
    isVisible: boolean
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
    step,
    currentIndex,
    totalSteps,
    onNext,
    onPrev,
    onComplete,
    onSkip,
    isVisible
}) => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isVisible && step) {
            // Wait a bit for the page to fully load
            const timer = setTimeout(() => {
                // Highlight the target element
                const targetElement = document.querySelector(step.target) as HTMLElement
                if (targetElement) {
                    // Scroll to element
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

                    // Add CSS class for highlighting
                    targetElement.classList.add('tour-highlight')

                    // Add step indicator
                    const indicator = document.createElement('div')
                    indicator.className = 'tour-step-indicator'
                    indicator.textContent = (currentIndex + 1).toString()
                    targetElement.appendChild(indicator)
                }

                // Position tooltip
                positionTooltip(targetElement)
            }, 500)

            return () => clearTimeout(timer)
        }

        return () => {
            // Clean up highlight
            const targetElement = document.querySelector(step.target) as HTMLElement
            if (targetElement) {
                targetElement.classList.remove('tour-highlight')
                const indicator = targetElement.querySelector('.tour-step-indicator')
                if (indicator) {
                    indicator.remove()
                }
            }
        }
    }, [isVisible, step, currentIndex])

    const positionTooltip = (targetElement: HTMLElement | null) => {
        if (!targetElement || !tooltipRef.current) return

        const tooltip = tooltipRef.current
        const rect = targetElement.getBoundingClientRect()
        const tooltipRect = tooltip.getBoundingClientRect()

        let top = rect.top + window.scrollY
        let left = rect.left + window.scrollX

        switch (step.position) {
            case 'top':
                top = rect.top + window.scrollY - tooltipRect.height - 20
                left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2)
                break
            case 'bottom':
                top = rect.bottom + window.scrollY + 20
                left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2)
                break
            case 'left':
                top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2)
                left = rect.left + window.scrollX - tooltipRect.width - 20
                break
            case 'right':
                top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2)
                left = rect.right + window.scrollX + 20
                break
        }

        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (left < 10) left = 10
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10
        }
        if (top < 10) top = 10
        if (top + tooltipRect.height > viewportHeight - 10) {
            top = viewportHeight - tooltipRect.height - 10
        }

        tooltip.style.top = `${top}px`
        tooltip.style.left = `${left}px`
    }

    if (!isVisible || !step) return null

    return (
        <div className="tour-overlay">
            {/* Backdrop */}
            <div
                ref={overlayRef}
                className="tour-backdrop"
                onClick={onSkip}
            ></div>

            {/* Tour Tooltip */}
            <div
                ref={tooltipRef}
                className="tour-tooltip"
            >
                <Card className="bg-white shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{step.title}</CardTitle>
                            <Button
                                onClick={onSkip}
                                variant="outline"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">{step.description}</p>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Step {currentIndex + 1} of {totalSteps}</span>
                                <span>{Math.round(((currentIndex + 1) / totalSteps) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between">
                            <div className="flex space-x-2">
                                <Button
                                    onClick={onPrev}
                                    disabled={currentIndex === 0}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={currentIndex === totalSteps - 1 ? onComplete : onNext}
                                    className="bg-orange-600 hover:bg-orange-700"
                                    size="sm"
                                >
                                    {currentIndex === totalSteps - 1 ? 'Complete' : 'Next'}
                                </Button>
                            </div>
                            <Button
                                onClick={onSkip}
                                variant="outline"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Skip Tour
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Tour trigger button component
interface TourTriggerProps {
    onStart: () => void
    className?: string
    children?: React.ReactNode
}

export const TourTrigger: React.FC<TourTriggerProps> = ({
    onStart,
    className = '',
    children
}) => {
    return (
        <Button
            onClick={onStart}
            className={`bg-orange-600 hover:bg-orange-700 ${className}`}
        >
            {children || '🎯 Start Tour'}
        </Button>
    )
}

// Tour progress indicator
interface TourProgressProps {
    current: number
    total: number
    className?: string
}

export const TourProgress: React.FC<TourProgressProps> = ({
    current,
    total,
    className = ''
}) => {
    const percentage = (current / total) * 100

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <span className="text-sm text-gray-600">
                {current} of {total}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="text-sm text-gray-600">
                {Math.round(percentage)}%
            </span>
        </div>
    )
}
