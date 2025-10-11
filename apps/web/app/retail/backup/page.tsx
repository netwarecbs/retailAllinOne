'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { useRouter } from 'next/navigation'

export default function BackupPage() {
    const router = useRouter()
    const [isBackingUp, setIsBackingUp] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)

    const handleBackup = async () => {
        setIsBackingUp(true)
        // Simulate backup process
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsBackingUp(false)
        alert('Backup completed successfully!')
    }

    const handleRestore = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                setIsRestoring(true)
                // Simulate restore process
                await new Promise(resolve => setTimeout(resolve, 2000))
                setIsRestoring(false)
                alert('Data restored successfully!')
            }
        }
        input.click()
    }

    const backupHistory = [
        { date: '2024-01-22 10:30 AM', size: '2.5 MB', type: 'Full Backup' },
        { date: '2024-01-21 6:00 PM', size: '2.3 MB', type: 'Full Backup' },
        { date: '2024-01-20 6:00 PM', size: '2.1 MB', type: 'Full Backup' },
        { date: '2024-01-19 6:00 PM', size: '1.9 MB', type: 'Full Backup' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Backup & Restore</h2>
                            <p className="text-gray-600">Manage your data backups and restore from previous backups</p>
                        </div>
                        <Button
                            onClick={() => router.push('/retail')}
                            variant="outline"
                        >
                            Back to Dashboard
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Backup Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    💾 Create Backup
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Create a complete backup of all your data including products, customers, sales, and settings.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <h4 className="font-medium text-blue-900 mb-1">What's included in backup:</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• All product information and inventory</li>
                                        <li>• Customer database and transaction history</li>
                                        <li>• Sales records and reports</li>
                                        <li>• Shop settings and user preferences</li>
                                        <li>• Purchase orders and supplier data</li>
                                    </ul>
                                </div>
                                <Button
                                    onClick={handleBackup}
                                    disabled={isBackingUp}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {isBackingUp ? 'Creating Backup...' : 'Create Backup Now'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Restore Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    📁 Restore from Backup
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Restore your data from a previously created backup file.
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <h4 className="font-medium text-yellow-900 mb-1">⚠️ Important:</h4>
                                    <ul className="text-sm text-yellow-800 space-y-1">
                                        <li>• This will replace all current data</li>
                                        <li>• Make sure to backup current data first</li>
                                        <li>• Restore process cannot be undone</li>
                                    </ul>
                                </div>
                                <Button
                                    onClick={handleRestore}
                                    disabled={isRestoring}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {isRestoring ? 'Restoring Data...' : 'Select Backup File'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Backup History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Backup History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Date & Time</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Type</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Size</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Status</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {backupHistory.map((backup, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-3 text-sm">{backup.date}</td>
                                                <td className="py-2 px-3 text-sm">{backup.type}</td>
                                                <td className="py-2 px-3 text-sm">{backup.size}</td>
                                                <td className="py-2 px-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                        Completed
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex space-x-1">
                                                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                                            Download
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                                            Restore
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>System Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Database Size</h4>
                                    <p className="text-2xl font-bold text-blue-600">2.5 MB</p>
                                    <p className="text-sm text-gray-500">Total data size</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Total Records</h4>
                                    <p className="text-2xl font-bold text-green-600">1,247</p>
                                    <p className="text-sm text-gray-500">Data entries</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Last Backup</h4>
                                    <p className="text-2xl font-bold text-orange-600">2 hours ago</p>
                                    <p className="text-sm text-gray-500">Auto backup</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
