'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@retail/ui'
import { tourSections } from '../data/tourData'
import { SimpleTourOverlay } from './SimpleTourOverlay'

interface TourButtonProps {
    sectionId: string
    className?: string
    size?: 'sm' | 'lg' | 'default' | 'icon'
    variant?: 'default' | 'outline' | 'ghost'
}

export const TourButton: React.FC<TourButtonProps> = ({
    sectionId,
    className = '',
    size = 'sm',
    variant = 'outline'
}) => {
    const [isTourActive, setIsTourActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [showOverlay, setShowOverlay] = useState(false)
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
    const [stepIndicator, setStepIndicator] = useState<HTMLElement | null>(null)

    const section = tourSections.find(s => s.id === sectionId)
    const currentStepData = section?.steps[currentStep]

    // Check for tour trigger from URL parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const startTourParam = urlParams.get('startTour')

        if (startTourParam === 'true') {
            console.log('Starting tour from URL parameter for section:', sectionId)
            startTour()
        }
    }, [sectionId])

    const startTour = () => {
        console.log('Starting tour for section:', sectionId)
        setIsTourActive(true)
        setCurrentStep(0)
        setShowOverlay(true)

        // Start highlighting the first step
        setTimeout(() => {
            highlightCurrentStep()
        }, 100)
    }

    const highlightCurrentStep = () => {
        if (!section) return

        const currentStepData = section.steps[currentStep]
        if (!currentStepData) {
            console.log('No step data for current step:', currentStep)
            return
        }

        console.log('Highlighting step:', currentStep, 'Target:', currentStepData.target)

        // Clean up previous highlight
        if (highlightedElement) {
            highlightedElement.classList.remove('tour-highlight')
            highlightedElement.classList.remove('tour-highlight-pulse')
        }
        if (stepIndicator) {
            stepIndicator.remove()
        }

        const element = document.querySelector(currentStepData.target) as HTMLElement
        if (element) {
            console.log('Element found and highlighting:', currentStepData.target, element)
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
            console.warn('Element not found for selector:', currentStepData.target)
            console.log('Available elements on page:')
            console.log(document.querySelectorAll('*'))
        }
    }

    const nextStep = () => {
        if (currentStep < (section?.steps.length || 1) - 1) {
            setCurrentStep(currentStep + 1)
            // Highlight the next step
            setTimeout(() => {
                highlightCurrentStep()
            }, 100)
        } else {
            completeTour()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            // Highlight the previous step
            setTimeout(() => {
                highlightCurrentStep()
            }, 100)
        }
    }

    const completeTour = () => {
        console.log('Completing tour')
        setIsTourActive(false)
        setShowOverlay(false)
        setCurrentStep(0)

        // Clean up highlighting
        if (highlightedElement) {
            highlightedElement.classList.remove('tour-highlight')
            highlightedElement.classList.remove('tour-highlight-pulse')
        }
        if (stepIndicator) {
            stepIndicator.remove()
        }
        setHighlightedElement(null)
        setStepIndicator(null)

        // Remove URL parameter
        const url = new URL(window.location.href)
        url.searchParams.delete('startTour')
        window.history.replaceState({}, '', url.toString())
    }

    const skipTour = () => {
        console.log('Skipping tour')
        completeTour()
    }

    if (!section) {
        return null
    }

    return (
        <>
            {/* Tour Button */}
            <Button
                onClick={startTour}
                variant={variant}
                size={size}
                className={`flex items-center space-x-2 ${className}`}
                title={`Start ${section.name} Tour`}
            >
                <span>🎯</span>
                <span className="hidden sm:inline">Tour</span>
            </Button>

            {/* Tour Overlay */}
            {isTourActive && showOverlay && (
                <SimpleTourOverlay
                    isActive={true}
                    sectionId={sectionId}
                    currentStep={currentStep}
                    onNext={nextStep}
                    onPrev={prevStep}
                    onComplete={completeTour}
                    onSkip={skipTour}
                />
            )}
        </>
    )
}
