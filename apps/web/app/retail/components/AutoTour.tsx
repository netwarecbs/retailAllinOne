'use client'

import React from 'react'
import { useActiveTour } from '../hooks/useActiveTour'
import { SimpleTourOverlay } from './SimpleTourOverlay'
import { tourSections } from '../data/tourData'

export const AutoTour: React.FC = () => {
    const { activeTour, clearActiveTour, isOnCorrectRoute } = useActiveTour()

    if (!activeTour || !isOnCorrectRoute) {
        return null
    }

    const section = tourSections.find(s => s.id === activeTour.sectionId)
    const currentStepData = section?.steps[activeTour.currentStep]

    const handleNext = () => {
        if (activeTour.currentStep < (section?.steps.length || 1) - 1) {
            const newStep = activeTour.currentStep + 1
            const updatedTour = { ...activeTour, currentStep: newStep }
            sessionStorage.setItem('activeTour', JSON.stringify(updatedTour))
            // Force re-render by updating the tour state
            window.location.reload()
        } else {
            clearActiveTour()
        }
    }

    const handlePrev = () => {
        if (activeTour.currentStep > 0) {
            const newStep = activeTour.currentStep - 1
            const updatedTour = { ...activeTour, currentStep: newStep }
            sessionStorage.setItem('activeTour', JSON.stringify(updatedTour))
            // Force re-render by updating the tour state
            window.location.reload()
        }
    }

    const handleComplete = () => {
        clearActiveTour()
    }

    const handleSkip = () => {
        clearActiveTour()
    }

    return (
        <SimpleTourOverlay
            isActive={true}
            sectionId={activeTour.sectionId}
            currentStep={activeTour.currentStep}
            onNext={handleNext}
            onPrev={handlePrev}
            onComplete={handleComplete}
            onSkip={handleSkip}
        />
    )
}
