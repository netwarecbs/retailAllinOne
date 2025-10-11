'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { useRouter } from 'next/navigation'
import { tourSections, tourConfig } from '../data/tourData'
import '../styles/tour.css'

export default function TourPage() {
    const router = useRouter()
    const [tourProgress, setTourProgress] = useState<{ [key: string]: number }>({})


    const startTour = (sectionId: string) => {
        const section = tourSections.find(s => s.id === sectionId)
        if (section) {
            console.log('Starting tour for section:', sectionId, 'Route:', section.route)

            // Navigate to the section's route with tour parameter
            const url = new URL(section.route, window.location.origin)
            url.searchParams.set('startTour', 'true')

            router.push(url.pathname + url.search)

            console.log('Navigating to:', url.pathname + url.search)
        }
    }





    const getProgressPercentage = (sectionId: string) => {
        const section = tourSections.find(s => s.id === sectionId)
        const completed = tourProgress[sectionId] || 0
        return section ? (completed / section.steps.length) * 100 : 0
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">🎯 Tour & Guide</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Learn how to use Retail Hub effectively with our interactive tour system
                        </p>
                    </div>

                    {/* Tour Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tourSections.map((section) => (
                            <Card key={section.id} className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{section.icon}</div>
                                        <div>
                                            <CardTitle className="text-lg">{section.name}</CardTitle>
                                            <p className="text-sm text-gray-600">{section.description}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>{Math.round(getProgressPercentage(section.id))}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${getProgressPercentage(section.id)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Steps Count */}
                                        <div className="text-sm text-gray-500">
                                            {tourProgress[section.id] || 0} of {section.steps.length} steps completed
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => startTour(section.id)}
                                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                                            >
                                                {tourProgress[section.id] === section.steps.length ? 'Restart Tour' : 'Start Tour'}
                                            </Button>
                                            {tourProgress[section.id] > 0 && tourProgress[section.id] < section.steps.length && (
                                                <Button
                                                    onClick={() => startTour(section.id)}
                                                    variant="outline"
                                                    className="px-3"
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>

                                        {/* Tour Info */}
                                        <div className="text-xs text-gray-500 mt-2">
                                            <div className="flex items-center space-x-1">
                                                <span>📍</span>
                                                <span>Route: {section.route}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>📝</span>
                                                <span>{section.steps.length} steps</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Start Guide */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>🚀</span>
                                <span>Quick Start Guide</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">1️⃣</div>
                                    <h3 className="font-semibold mb-2">Setup Your Shop</h3>
                                    <p className="text-sm text-gray-600">
                                        Go to Settings and configure your shop information, add products, customers, and vendors.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">2️⃣</div>
                                    <h3 className="font-semibold mb-2">Manage Inventory</h3>
                                    <p className="text-sm text-gray-600">
                                        Add products, record stock-in, and set up your inventory management system.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">3️⃣</div>
                                    <h3 className="font-semibold mb-2">Start Selling</h3>
                                    <p className="text-sm text-gray-600">
                                        Process sales, manage customers, and track your business performance.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tour Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>🔧</span>
                                <span>Tour Management</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">Tour System Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Version:</span> {tourConfig.version}
                                        </div>
                                        <div>
                                            <span className="font-medium">Last Updated:</span> {tourConfig.lastUpdated}
                                        </div>
                                        <div>
                                            <span className="font-medium">Total Sections:</span> {tourSections.length}
                                        </div>
                                        <div>
                                            <span className="font-medium">Total Steps:</span> {tourSections.reduce((total, section) => total + section.steps.length, 0)}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-900 mb-2">Features</h4>
                                    <ul className="text-sm text-green-800 space-y-1">
                                        {tourConfig.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-2">
                                                <span>✅</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-900 mb-2">Update Instructions</h4>
                                    <ul className="text-sm text-yellow-800 space-y-1">
                                        {tourConfig.updateInstructions.map((instruction, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <span>📝</span>
                                                <span>{instruction}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => {
                                            // Reset all tour progress
                                            setTourProgress({})
                                            alert('Tour progress has been reset!')
                                        }}
                                        variant="outline"
                                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                    >
                                        🔄 Reset Progress
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            // Export tour data
                                            const dataStr = JSON.stringify(tourSections, null, 2)
                                            const dataBlob = new Blob([dataStr], { type: 'application/json' })
                                            const url = URL.createObjectURL(dataBlob)
                                            const link = document.createElement('a')
                                            link.href = url
                                            link.download = 'tour-data.json'
                                            link.click()
                                            URL.revokeObjectURL(url)
                                        }}
                                        variant="outline"
                                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                    >
                                        📥 Export Tour Data
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>
            </main>
        </div>
    )
}
