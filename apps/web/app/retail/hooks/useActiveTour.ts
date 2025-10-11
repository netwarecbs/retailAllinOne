'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const useActiveTour = () => {
    const [activeTour, setActiveTour] = useState<any>(null)
    const pathname = usePathname()

    useEffect(() => {
        const checkForActiveTour = () => {
            const activeTourData = sessionStorage.getItem('activeTour')
            if (activeTourData) {
                try {
                    const tourData = JSON.parse(activeTourData)
                    console.log('useActiveTour: Found active tour:', tourData)
                    console.log('useActiveTour: Current pathname:', pathname)
                    console.log('useActiveTour: Tour route:', tourData.route)

                    // Check if we're on the correct route
                    if (pathname === tourData.route) {
                        console.log('useActiveTour: On correct route, tour should be active')
                        setActiveTour(tourData)
                    } else {
                        console.log('useActiveTour: Not on correct route yet')
                        setActiveTour(null)
                    }
                } catch (error) {
                    console.error('useActiveTour: Error parsing tour data:', error)
                    sessionStorage.removeItem('activeTour')
                    setActiveTour(null)
                }
            } else {
                setActiveTour(null)
            }
        }

        // Check immediately
        checkForActiveTour()

        // Check again after a short delay to ensure page is loaded
        const timer = setTimeout(checkForActiveTour, 1000)

        return () => clearTimeout(timer)
    }, [pathname])

    const clearActiveTour = () => {
        sessionStorage.removeItem('activeTour')
        setActiveTour(null)
    }

    return {
        activeTour,
        clearActiveTour,
        isOnCorrectRoute: activeTour && pathname === activeTour.route
    }
}
