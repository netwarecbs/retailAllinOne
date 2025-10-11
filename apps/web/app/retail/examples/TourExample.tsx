'use client'

import React from 'react'
import { usePageTour } from '../hooks/usePageTour'
import { TourOverlay } from '../components/TourOverlay'

// Example of how to use tours in a page component
const TourExample: React.FC = () => {
    const tour = usePageTour('/retail/inventory', {
        autoStart: false, // Set to true to auto-start tour when page loads
        delay: 1000, // Delay before starting tour
        onComplete: () => console.log('Tour completed!'),
        onSkip: () => console.log('Tour skipped!')
    })

    return (
        <div>
            {/* Your page content */}
            <div className="inventory-header">
                <h1>Inventory Management</h1>
                <p>Manage your products and stock levels</p>
            </div>

            <div className="product-table">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sample Product</td>
                            <td>100</td>
                            <td>$10.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Tour trigger button */}
            <button
                onClick={tour.startTour}
                className="bg-orange-600 text-white px-4 py-2 rounded"
            >
                Start Inventory Tour
            </button>

            {/* Tour overlay */}
            {tour.isActive && tour.currentStep && (
                <TourOverlay
                    step={tour.currentStep}
                    currentIndex={tour.currentIndex}
                    totalSteps={tour.totalSteps}
                    onNext={tour.nextStep}
                    onPrev={tour.prevStep}
                    onComplete={tour.completeTour}
                    onSkip={tour.skipTour}
                    isVisible={tour.isActive}
                />
            )}
        </div>
    )
}

export default TourExample
