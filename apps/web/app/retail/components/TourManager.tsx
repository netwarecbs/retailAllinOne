'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { tourSections } from '../data/tourData'
import { TourStep } from '../data/tourData'

interface TourManagerProps {
    isActive: boolean
    sectionId: string
    currentStep: number
    onNext: () => void
    onPrev: () => void
    onComplete: () => void
    onSkip: () => void
}

export const TourManager: React.FC<TourManagerProps> = ({
    isActive,
    sectionId,
    currentStep,
    onNext,
    onPrev,
    onComplete,
    onSkip
}) => {
    const section = tourSections.find(s => s.id === sectionId)
    const currentStepData = section?.steps[currentStep]

    console.log('TourManager render:', { isActive, currentStepData, sectionId, currentStep })

    const handleNext = () => {
        onNext()
    }

    console.log('TourManager render:', { isActive, currentStepData, sectionId, currentStep })

    if (!isActive || !currentStepData) {
        console.log('TourManager: Not rendering - isActive:', isActive, 'currentStepData:', currentStepData)
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
                className="absolute z-10 max-w-md"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
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
                                    onClick={currentStep === (section?.steps.length || 1) - 1 ? onComplete : handleNext}
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
