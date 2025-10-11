'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { useRouter } from 'next/navigation'

export default function HelpPage() {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState('getting-started')

    const faqs = [
        {
            question: "How do I add a new product?",
            answer: "Go to Inventory > Add Product. Fill in the product details including SKU, name, category, brand, pricing, and stock information."
        },
        {
            question: "How do I process a sale?",
            answer: "Go to POS > Search for products by name or barcode > Add to cart > Select customer > Process payment."
        },
        {
            question: "How do I create a purchase order?",
            answer: "Go to Purchase > Create Purchase Order > Select supplier > Add products > Save order."
        },
        {
            question: "How do I generate reports?",
            answer: "Go to Reports > Select report type > Choose date range > Generate report. You can export to Excel or print."
        },
        {
            question: "How do I backup my data?",
            answer: "Go to Settings > System Settings > Data Management > Create Backup. This will download a backup file."
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
                            <p className="text-gray-600">Get help with using the Retail Shop application</p>
                        </div>
                        <Button
                            onClick={() => router.push('/retail')}
                            variant="outline"
                        >
                            Back to Dashboard
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Help Topics</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <nav className="space-y-1">
                                        <button
                                            onClick={() => setActiveSection('getting-started')}
                                            className={`w-full text-left px-4 py-2 text-sm ${activeSection === 'getting-started'
                                                    ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            🚀 Getting Started
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('inventory')}
                                            className={`w-full text-left px-4 py-2 text-sm ${activeSection === 'inventory'
                                                    ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            📦 Inventory Management
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('pos')}
                                            className={`w-full text-left px-4 py-2 text-sm ${activeSection === 'pos'
                                                    ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            💳 Point of Sale
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('reports')}
                                            className={`w-full text-left px-4 py-2 text-sm ${activeSection === 'reports'
                                                    ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            📊 Reports & Analytics
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('faq')}
                                            className={`w-full text-left px-4 py-2 text-sm ${activeSection === 'faq'
                                                    ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            ❓ Frequently Asked Questions
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('contact')}
                                            className={`w-full text-left px-4 py-2 text-sm ${activeSection === 'contact'
                                                    ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            📞 Contact Support
                                        </button>
                                    </nav>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3">
                            {activeSection === 'getting-started' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Getting Started</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Welcome to Retail Shop Management</h3>
                                            <p className="text-gray-600">
                                                This application helps you manage your retail business efficiently. Here's how to get started:
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                                                <div>
                                                    <h4 className="font-medium">Set up your shop information</h4>
                                                    <p className="text-sm text-gray-600">Go to Settings to configure your shop details, GSTIN, and business information.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                                                <div>
                                                    <h4 className="font-medium">Add your products</h4>
                                                    <p className="text-sm text-gray-600">Go to Inventory to add products with SKU, pricing, and stock information.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                                                <div>
                                                    <h4 className="font-medium">Set up suppliers</h4>
                                                    <p className="text-sm text-gray-600">Go to Purchase to add supplier information for managing purchase orders.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                                                <div>
                                                    <h4 className="font-medium">Start selling</h4>
                                                    <p className="text-sm text-gray-600">Go to POS to process sales transactions and generate invoices.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeSection === 'faq' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Frequently Asked Questions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {faqs.map((faq, index) => (
                                                <div key={index} className="border-b pb-4">
                                                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                                                    <p className="text-sm text-gray-600">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeSection === 'contact' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Support</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                                <p className="text-sm text-gray-600 mb-2">Get help via email</p>
                                                <a href="mailto:support@retailhub.com" className="text-orange-600 hover:text-orange-700">
                                                    support@retailhub.com
                                                </a>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                                                <p className="text-sm text-gray-600 mb-2">Call us for immediate assistance</p>
                                                <a href="tel:+919876543210" className="text-orange-600 hover:text-orange-700">
                                                    +91 9876543210
                                                </a>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                                                <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                                <p className="text-sm text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                                                <p className="text-sm text-gray-600">Email: Within 24 hours</p>
                                                <p className="text-sm text-gray-600">Phone: Immediate</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {(activeSection === 'inventory' || activeSection === 'pos' || activeSection === 'reports') && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {activeSection === 'inventory' && 'Inventory Management'}
                                            {activeSection === 'pos' && 'Point of Sale'}
                                            {activeSection === 'reports' && 'Reports & Analytics'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-4">
                                                {activeSection === 'inventory' && '📦'}
                                                {activeSection === 'pos' && '💳'}
                                                {activeSection === 'reports' && '📊'}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {activeSection === 'inventory' && 'Inventory Management Guide'}
                                                {activeSection === 'pos' && 'Point of Sale Guide'}
                                                {activeSection === 'reports' && 'Reports & Analytics Guide'}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Detailed guides for this section are coming soon. For now, you can explore the features directly in the application.
                                            </p>
                                            <Button
                                                onClick={() => router.push(`/retail/${activeSection}`)}
                                                className="bg-orange-600 hover:bg-orange-700"
                                            >
                                                Go to {activeSection === 'inventory' ? 'Inventory' : activeSection === 'pos' ? 'POS' : 'Reports'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
