'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { tourSections } from '../data/tourData'

interface SimpleTourOverlayProps {
    isActive: boolean
    sectionId: string
    currentStep: number
    onNext: () => void
    onPrev: () => void
    onComplete: () => void
    onSkip: () => void
}

export const SimpleTourOverlay: React.FC<SimpleTourOverlayProps> = ({
    isActive,
    sectionId,
    currentStep,
    onNext,
    onPrev,
    onComplete,
    onSkip
}) => {
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
    const [stepIndicator, setStepIndicator] = useState<HTMLElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const section = tourSections.find(s => s.id === sectionId)
    const currentStepData = section?.steps[currentStep]

    console.log('SimpleTourOverlay render:', { isActive, currentStepData, sectionId, currentStep })

    // Highlight target element
    useEffect(() => {
        if (isActive && currentStepData) {
            console.log('Highlighting element:', currentStepData.target)

            // Clean up previous highlight
            if (highlightedElement) {
                highlightedElement.classList.remove('tour-highlight')
                highlightedElement.classList.remove('tour-highlight-pulse')
            }
            if (stepIndicator) {
                stepIndicator.remove()
            }

            // Wait for page to load
            const timer = setTimeout(() => {
                const element = document.querySelector(currentStepData.target) as HTMLElement
                if (element) {
                    console.log('Element found, highlighting:', element)
                    setHighlightedElement(element)

                    // Scroll to element
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })

                    // Add highlighting
                    element.classList.add('tour-highlight')
                    element.classList.add('tour-highlight-pulse')

                    // Add step indicator
                    const indicator = document.createElement('div')
                    indicator.className = 'tour-step-indicator'
                    indicator.textContent = (currentStep + 1).toString()
                    indicator.style.position = 'absolute'
                    indicator.style.top = `${element.offsetTop - 10}px`
                    indicator.style.left = `${element.offsetLeft + element.offsetWidth - 10}px`
                    indicator.style.zIndex = '10002'
                    document.body.appendChild(indicator)
                    setStepIndicator(indicator)
                } else {
                    console.warn('Element not found:', currentStepData.target)
                }
            }, 500)

            return () => clearTimeout(timer)
        } else {
            // Clean up when tour is not active
            if (highlightedElement) {
                highlightedElement.classList.remove('tour-highlight')
                highlightedElement.classList.remove('tour-highlight-pulse')
            }
            if (stepIndicator) {
                stepIndicator.remove()
            }
            setHighlightedElement(null)
            setStepIndicator(null)
        }
    }, [isActive, currentStepData, currentStep])

    // Position tooltip relative to highlighted element
    useEffect(() => {
        if (highlightedElement && tooltipRef.current && currentStepData) {
            const targetRect = highlightedElement.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()

            let top = 0
            let left = 0

            // Position tooltip based on step position preference
            switch (currentStepData.position) {
                case 'top':
                    top = targetRect.top - tooltipRect.height - 20
                    left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
                    break
                case 'bottom':
                    top = targetRect.bottom + 20
                    left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
                    break
                case 'left':
                    top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
                    left = targetRect.left - tooltipRect.width - 20
                    break
                case 'right':
                    top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
                    left = targetRect.right + 20
                    break
                default: // Default to bottom
                    top = targetRect.bottom + 20
                    left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
            }

            // Keep tooltip within viewport
            if (top < 0) top = 10
            if (left < 0) left = 10
            if (top + tooltipRect.height > window.innerHeight) top = window.innerHeight - tooltipRect.height - 10
            if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - 10

            tooltipRef.current.style.top = `${top}px`
            tooltipRef.current.style.left = `${left}px`
        }
    }, [highlightedElement, currentStepData])

    if (!isActive || !currentStepData) {
        console.log('SimpleTourOverlay: Not rendering - isActive:', isActive, 'currentStepData:', currentStepData)
        return null
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onSkip}
            ></div>

            {/* Tour Tooltip */}
            <div
                ref={tooltipRef}
                className="absolute z-10 max-w-md"
                style={{
                    zIndex: 10001
                }}
            >
                <Card className="bg-white shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                            <Button
                                onClick={onSkip}
                                variant="outline"
                                size="sm"
                                className="text-gray-500"
                            >
                                ✕
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">{currentStepData.description}</p>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Step {currentStep + 1} of {section?.steps.length}</span>
                                <span>{Math.round(((currentStep + 1) / (section?.steps.length || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / (section?.steps.length || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between">
                            <div className="flex space-x-2">
                                <Button
                                    onClick={onPrev}
                                    disabled={currentStep === 0}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={currentStep === (section?.steps.length || 1) - 1 ? onComplete : onNext}
                                    className="bg-orange-600 hover:bg-orange-700"
                                    size="sm"
                                >
                                    {currentStep === (section?.steps.length || 1) - 1 ? 'Complete' : 'Next'}
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
