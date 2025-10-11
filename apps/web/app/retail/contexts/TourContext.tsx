'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

interface TourStep {
    id: string
    title: string
    description: string
    target: string
    position: 'top' | 'bottom' | 'left' | 'right'
    action?: 'click' | 'navigate'
    route?: string
    highlight?: boolean
}

interface TourContextType {
    isTourActive: boolean
    currentStep: TourStep | null
    tourProgress: { [key: string]: number }
    startTour: (steps: TourStep[]) => void
    nextStep: () => void
    prevStep: () => void
    completeTour: () => void
    skipTour: () => void
    highlightElement: (target: string) => void
    addTourStep: (step: TourStep) => void
    updateTourStep: (stepId: string, updates: Partial<TourStep>) => void
    removeTourStep: (stepId: string) => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export const useTour = () => {
    const context = useContext(TourContext)
    if (!context) {
        throw new Error('useTour must be used within a TourProvider')
    }
    return context
}

interface TourProviderProps {
    children: React.ReactNode
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
    const [isTourActive, setIsTourActive] = useState(false)
    const [currentStep, setCurrentStep] = useState<TourStep | null>(null)
    const [tourSteps, setTourSteps] = useState<TourStep[]>([])
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [tourProgress, setTourProgress] = useState<{ [key: string]: number }>({})
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    const startTour = (steps: TourStep[]) => {
        setTourSteps(steps)
        setCurrentStepIndex(0)
        setCurrentStep(steps[0])
        setIsTourActive(true)
    }

    const nextStep = () => {
        if (currentStepIndex < tourSteps.length - 1) {
            const nextIndex = currentStepIndex + 1
            setCurrentStepIndex(nextIndex)
            setCurrentStep(tourSteps[nextIndex])
        } else {
            completeTour()
        }
    }

    const prevStep = () => {
        if (currentStepIndex > 0) {
            const prevIndex = currentStepIndex - 1
            setCurrentStepIndex(prevIndex)
            setCurrentStep(tourSteps[prevIndex])
        }
    }

    const completeTour = () => {
        setIsTourActive(false)
        setCurrentStep(null)
        setTourSteps([])
        setCurrentStepIndex(0)
        setHighlightedElement(null)
    }

    const skipTour = () => {
        completeTour()
    }

    const highlightElement = (target: string) => {
        const element = document.querySelector(target) as HTMLElement
        if (element) {
            setHighlightedElement(element)
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    const addTourStep = (step: TourStep) => {
        setTourSteps(prev => [...prev, step])
    }

    const updateTourStep = (stepId: string, updates: Partial<TourStep>) => {
        setTourSteps(prev =>
            prev.map(step =>
                step.id === stepId ? { ...step, ...updates } : step
            )
        )
    }

    const removeTourStep = (stepId: string) => {
        setTourSteps(prev => prev.filter(step => step.id !== stepId))
    }

    useEffect(() => {
        if (isTourActive && currentStep) {
            highlightElement(currentStep.target)
        }
    }, [isTourActive, currentStep])

    const value: TourContextType = {
        isTourActive,
        currentStep,
        tourProgress,
        startTour,
        nextStep,
        prevStep,
        completeTour,
        skipTour,
        highlightElement,
        addTourStep,
        updateTourStep,
        removeTourStep
    }

    return (
        <TourContext.Provider value={value}>
            {children}
            {/* Tour Overlay */}
            {isTourActive && currentStep && (
                <TourOverlay
                    step={currentStep}
                    currentIndex={currentStepIndex}
                    totalSteps={tourSteps.length}
                    onNext={nextStep}
                    onPrev={prevStep}
                    onComplete={completeTour}
                    onSkip={skipTour}
                />
            )}
            {/* Highlight Overlay */}
            {highlightedElement && (
                <div
                    className="fixed inset-0 z-40 pointer-events-none"
                    style={{
                        boxShadow: `0 0 0 4px rgba(249, 115, 22, 0.5)`,
                        borderRadius: '8px'
                    }}
                ></div>
            )}
        </TourContext.Provider>
    )
}

interface TourOverlayProps {
    step: TourStep
    currentIndex: number
    totalSteps: number
    onNext: () => void
    onPrev: () => void
    onComplete: () => void
    onSkip: () => void
}

const TourOverlay: React.FC<TourOverlayProps> = ({
    step,
    currentIndex,
    totalSteps,
    onNext,
    onPrev,
    onComplete,
    onSkip
}) => {
    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onSkip}></div>

            {/* Tour Tooltip */}
            <div className="absolute z-10">
                <div className="max-w-md bg-white rounded-lg shadow-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <button
                            onClick={onSkip}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

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
                            <button
                                onClick={onPrev}
                                disabled={currentIndex === 0}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={currentIndex === totalSteps - 1 ? onComplete : onNext}
                                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
                            >
                                {currentIndex === totalSteps - 1 ? 'Complete' : 'Next'}
                            </button>
                        </div>
                        <button
                            onClick={onSkip}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Skip Tour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
