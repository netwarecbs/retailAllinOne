'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { useRouter } from 'next/navigation'
import { RootState, AppDispatch } from '@retail/shared'
import {
    addProduct,
    updateProduct,
    deleteProduct,
    addVendor,
    updateVendor,
    deleteVendor,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from '@retail/shared'

interface ShopSettings {
    shopName: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
    email: string
    gstin: string
    currency: string
    timezone: string
    dateFormat: string
    theme: string
}

interface UserSettings {
    name: string
    email: string
    role: string
    notifications: {
        email: boolean
        sms: boolean
        push: boolean
    }
}

interface Material {
    id: string
    description: string
    category: string
    uom: string
    mrp: number
    reorderLevel: number
    hsnCode: string
    gstRate: number
}

interface Customer {
    id: string
    name: string
    customerType: string
    address1: string
    address2: string
    pin: string
    contactNumber: string
    email: string
    faxNo: string
    gstNo: string
    mfmsId: string
    mrDealerNo: string
}

interface Vendor {
    id: string
    name: string
    vendorType: string
    contactNo: string
    address: string
    ps: string
    gstNo: string
    email: string
    po: string
    pin: string
    mfmsId: string
}

interface Branch {
    id: string
    branchType: string
    branchName: string
    address: string
    village: string
    pin: string
    contactNumber: string
    emailId: string
    gstNo: string
    giMasCode: string
}

interface CustomerType {
    id: string
    name: string
    description: string
    isActive: boolean
}

interface MaterialRate {
    materialId: string
    customerTypeId: string
    rate: number
    startDate: string
    endDate?: string
    isActive: boolean
}

interface RateChartEntry {
    id: string
    materialCode: string
    materialName: string
    rates: MaterialRate[]
    isActive: boolean
}

export default function SettingsPage() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { products, vendors, customers } = useSelector((state: RootState) => state.products)
    const [activeTab, setActiveTab] = useState('shop')
    const [isLoading, setIsLoading] = useState(true)

    // Rate Chart State
    const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([
        { id: 'CT001', name: 'RUNNING/NONMEMBER', description: 'Running/Non-member customers', isActive: true },
        { id: 'CT002', name: 'SOCIETY', description: 'Society customers', isActive: true },
        { id: 'CT003', name: 'WHOLE SELLER', description: 'Wholesale customers', isActive: true },
        { id: 'CT004', name: 'GOVT./SEMI GOVT.', description: 'Government and Semi-government', isActive: true },
        { id: 'CT005', name: 'MEMBER', description: 'Member customers', isActive: true }
    ])

    const [rateChartEntries, setRateChartEntries] = useState<RateChartEntry[]>([
        {
            id: 'RC001',
            materialCode: 'MM-1',
            materialName: 'D.A.P (IFFCO)',
            rates: [
                { materialId: 'MM-1', customerTypeId: 'CT001', rate: 27.00, startDate: '11.06.2017', isActive: true },
                { materialId: 'MM-1', customerTypeId: 'CT003', rate: 23.00, startDate: '01.06.2017', isActive: true },
                { materialId: 'MM-1', customerTypeId: 'CT005', rate: 27.00, startDate: '09.10.2025', isActive: true }
            ],
            isActive: true
        },
        {
            id: 'RC002',
            materialCode: 'MM-10',
            materialName: 'SHAKTI DANA',
            rates: [],
            isActive: true
        },
        {
            id: 'RC003',
            materialCode: 'MM-100',
            materialName: 'YUJO (100ML)',
            rates: [],
            isActive: true
        }
    ])

    const [editingRate, setEditingRate] = useState<{ materialId: string; customerTypeId: string } | null>(null)
    const [newRate, setNewRate] = useState({ rate: 0, startDate: '' })

    // Edit functionality
    const [editingEntry, setEditingEntry] = useState<RateChartEntry | null>(null)
    const [editingRateIndex, setEditingRateIndex] = useState<number | null>(null)
    const [editForm, setEditForm] = useState({
        materialId: '',
        materialName: '',
        materialCode: '',
        customerTypeId: '',
        customerTypeName: '',
        rate: 0,
        startDate: '',
        endDate: '',
        notes: ''
    })

    // Form and Grid State
    const [showRateForm, setShowRateForm] = useState(false)
    const [rateForm, setRateForm] = useState({
        materialId: '',
        materialName: '',
        materialCode: '',
        customerTypeId: '',
        customerTypeName: '',
        rate: 0,
        startDate: '',
        endDate: '',
        notes: ''
    })

    // Search and Pagination for Rate Chart
    const [rateSearchTerm, setRateSearchTerm] = useState('')
    const [rateCurrentPage, setRateCurrentPage] = useState(1)
    const [rateItemsPerPage] = useState(10)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    // Rate History
    const [rateHistory, setRateHistory] = useState<{ [key: string]: any[] }>({})
    const [shopSettings, setShopSettings] = useState<ShopSettings>({
        shopName: 'Retail Hub',
        address: '456 Retail Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210',
        email: 'info@retailhub.com',
        gstin: '27ABCDE1234F1Z5',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light'
    })
    const [userSettings, setUserSettings] = useState<UserSettings>({
        name: 'Admin User',
        email: 'admin@retailhub.com',
        role: 'Administrator',
        notifications: {
            email: true,
            sms: false,
            push: true
        }
    })

    // Local state for branches (not in Redux yet)
    const [branches, setBranches] = useState<Branch[]>([
        { id: 'B-1', branchType: 'Online', branchName: 'Nimo U.C.A.C.S Ltd. (Koleypara Banch)', address: 'Kolepara', village: 'Kolepara', pin: '713151', contactNumber: '03214245272', emailId: '', gstNo: '', giMasCode: 'GI001' }
    ])

    // Form states
    const [newMaterial, setNewMaterial] = useState<Partial<Material>>({})
    const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})
    const [newVendor, setNewVendor] = useState<Partial<Vendor>>({})
    const [newBranch, setNewBranch] = useState<Partial<Branch>>({})
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Form collapse states
    const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false)
    const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false)
    const [isVendorFormOpen, setIsVendorFormOpen] = useState(false)
    const [isBranchFormOpen, setIsBranchFormOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const handleShopSettingsSave = () => {
        // Save shop settings logic here
        alert('Shop settings saved successfully!')
    }

    const handleUserSettingsSave = () => {
        // Save user settings logic here
        alert('User settings saved successfully!')
    }

    const handleBackup = () => {
        // Backup logic here
        alert('Backup initiated successfully!')
    }

    const handleRestore = () => {
        // Restore logic here
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                alert('Restore process initiated!')
            }
        }
        input.click()
    }

    // Masters handlers
    const handleAddMaterial = () => {
        if (!newMaterial.description || !newMaterial.category || !newMaterial.uom || !newMaterial.mrp) {
            alert('Please fill in all required fields')
            return
        }
        const product = {
            sku: `MM-${Date.now()}`,
            name: newMaterial.description || '',
            category: newMaterial.category || '',
            brand: 'Generic',
            mrp: newMaterial.mrp || 0,
            costPrice: (newMaterial.mrp || 0) * 0.7, // 70% of MRP as cost
            sellPrice: newMaterial.mrp || 0,
            stock: 0,
            minStock: newMaterial.reorderLevel || 0,
            unit: newMaterial.uom || '',
            isActive: true,
            gstRate: newMaterial.gstRate || 0,
            hsnCode: newMaterial.hsnCode || '',
            image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop&crop=center'
        }
        dispatch(addProduct(product))
        setNewMaterial({})
        alert('Material added successfully!')
    }

    const handleAddCustomer = () => {
        if (!newCustomer.name || !newCustomer.customerType || !newCustomer.mrDealerNo) {
            alert('Please fill in all required fields')
            return
        }
        const customer = {
            id: `C-${Date.now()}`,
            name: newCustomer.name || '',
            contact: newCustomer.contactNumber || '',
            type: newCustomer.customerType as "Regular" | "Wholesale" | "VIP",
            outstandingAmount: 0
        }
        dispatch(addCustomer(customer))
        setNewCustomer({})
        alert('Customer added successfully!')
    }

    const handleAddVendor = () => {
        if (!newVendor.name || !newVendor.vendorType) {
            alert('Please fill in all required fields')
            return
        }
        const vendor = {
            id: `V-${Date.now()}`,
            name: newVendor.name || '',
            contact: newVendor.contactNo || '',
            gstin: newVendor.gstNo || '',
            address: newVendor.address || '',
            outstandingAmount: 0
        }
        dispatch(addVendor(vendor))
        setNewVendor({})
        alert('Vendor added successfully!')
    }

    const handleAddBranch = () => {
        if (!newBranch.branchType || !newBranch.branchName || !newBranch.giMasCode) {
            alert('Please fill in all required fields')
            return
        }
        const branch: Branch = {
            id: `B-${Date.now()}`,
            branchType: newBranch.branchType || '',
            branchName: newBranch.branchName || '',
            address: newBranch.address || '',
            village: newBranch.village || '',
            pin: newBranch.pin || '',
            contactNumber: newBranch.contactNumber || '',
            emailId: newBranch.emailId || '',
            gstNo: newBranch.gstNo || '',
            giMasCode: newBranch.giMasCode || ''
        }
        setBranches([...branches, branch])
        setNewBranch({})
        alert('Branch added successfully!')
    }

    const handleDeleteItem = (type: string, id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            switch (type) {
                case 'material':
                    dispatch(deleteProduct(id))
                    break
                case 'customer':
                    dispatch(deleteCustomer(id))
                    break
                case 'vendor':
                    dispatch(deleteVendor(id))
                    break
                case 'branch':
                    setBranches(branches.filter(b => b.id !== id))
                    break
            }
            alert('Item deleted successfully!')
        }
    }

    // Rate Chart Handlers
    const handleMaterialSelect = (material: any) => {
        setRateForm({
            ...rateForm,
            materialId: material.sku,
            materialName: material.name,
            materialCode: material.sku
        })
    }

    const handleCustomerTypeSelect = (customerType: CustomerType) => {
        setRateForm({
            ...rateForm,
            customerTypeId: customerType.id,
            customerTypeName: customerType.name
        })
    }

    const handleAddRate = () => {
        if (!rateForm.materialId || !rateForm.customerTypeId || !rateForm.rate || !rateForm.startDate) {
            alert('Please fill all required fields')
            return
        }

        // Add to rate chart entries
        const existingEntry = rateChartEntries.find(entry => entry.materialCode === rateForm.materialCode)

        if (existingEntry) {
            // Update existing entry
            const updatedEntries = rateChartEntries.map(entry => {
                if (entry.id === existingEntry.id) {
                    const updatedRates = entry.rates.filter(r => r.customerTypeId !== rateForm.customerTypeId)
                    updatedRates.push({
                        materialId: rateForm.materialId,
                        customerTypeId: rateForm.customerTypeId,
                        rate: rateForm.rate,
                        startDate: rateForm.startDate,
                        endDate: rateForm.endDate || undefined,
                        isActive: true
                    })
                    return { ...entry, rates: updatedRates }
                }
                return entry
            })
            setRateChartEntries(updatedEntries)
        } else {
            // Create new entry
            const newEntry: RateChartEntry = {
                id: `RC${Date.now()}`,
                materialCode: rateForm.materialCode,
                materialName: rateForm.materialName,
                rates: [{
                    materialId: rateForm.materialId,
                    customerTypeId: rateForm.customerTypeId,
                    rate: rateForm.rate,
                    startDate: rateForm.startDate,
                    endDate: rateForm.endDate || undefined,
                    isActive: true
                }],
                isActive: true
            }
            setRateChartEntries([...rateChartEntries, newEntry])
        }

        // Add to history
        const historyKey = `${rateForm.materialCode}-${rateForm.customerTypeId}`
        const historyEntry = {
            id: Date.now(),
            materialName: rateForm.materialName,
            customerTypeName: rateForm.customerTypeName,
            rate: rateForm.rate,
            startDate: rateForm.startDate,
            endDate: rateForm.endDate,
            notes: rateForm.notes,
            timestamp: new Date().toLocaleString(),
            action: 'Added'
        }

        setRateHistory(prev => ({
            ...prev,
            [historyKey]: [...(prev[historyKey] || []), historyEntry]
        }))

        // Reset form
        setRateForm({
            materialId: '',
            materialName: '',
            materialCode: '',
            customerTypeId: '',
            customerTypeName: '',
            rate: 0,
            startDate: '',
            endDate: '',
            notes: ''
        })
        setShowRateForm(false)
    }

    const toggleRowExpansion = (entryId: string) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(entryId)) {
            newExpanded.delete(entryId)
        } else {
            newExpanded.add(entryId)
        }
        setExpandedRows(newExpanded)
    }

    // Edit handlers
    const handleEditEntry = (entry: RateChartEntry) => {
        setEditingEntry(entry)
        setEditForm({
            materialId: entry.materialCode,
            materialName: entry.materialName,
            materialCode: entry.materialCode,
            customerTypeId: '',
            customerTypeName: '',
            rate: 0,
            startDate: '',
            endDate: '',
            notes: ''
        })
        setShowRateForm(true)
    }

    const handleEditRate = (entry: RateChartEntry, rateIndex: number) => {
        const rate = entry.rates[rateIndex]
        const customerType = customerTypes.find(ct => ct.id === rate.customerTypeId)

        setEditingEntry(entry)
        setEditingRateIndex(rateIndex)
        setEditForm({
            materialId: entry.materialCode,
            materialName: entry.materialName,
            materialCode: entry.materialCode,
            customerTypeId: rate.customerTypeId,
            customerTypeName: customerType?.name || '',
            rate: rate.rate,
            startDate: rate.startDate,
            endDate: rate.endDate || '',
            notes: ''
        })
        setShowRateForm(true)
    }

    const handleUpdateRate = () => {
        if (!editForm.materialId || !editForm.customerTypeId || !editForm.rate || !editForm.startDate) {
            alert('Please fill all required fields')
            return
        }

        if (editingEntry && editingRateIndex !== null) {
            // Update existing rate
            const updatedEntries = rateChartEntries.map(entry => {
                if (entry.id === editingEntry.id) {
                    const updatedRates = [...entry.rates]
                    updatedRates[editingRateIndex] = {
                        materialId: editForm.materialId,
                        customerTypeId: editForm.customerTypeId,
                        rate: editForm.rate,
                        startDate: editForm.startDate,
                        endDate: editForm.endDate || undefined,
                        isActive: true
                    }
                    return { ...entry, rates: updatedRates }
                }
                return entry
            })
            setRateChartEntries(updatedEntries)

            // Add to history
            const historyKey = `${editForm.materialId}-${editForm.customerTypeId}`
            const historyEntry = {
                id: Date.now(),
                materialName: editForm.materialName,
                customerTypeName: editForm.customerTypeName,
                rate: editForm.rate,
                startDate: editForm.startDate,
                endDate: editForm.endDate,
                notes: editForm.notes,
                timestamp: new Date().toLocaleString(),
                action: 'Updated'
            }

            setRateHistory(prev => ({
                ...prev,
                [historyKey]: [...(prev[historyKey] || []), historyEntry]
            }))
        } else if (editingEntry) {
            // Add new rate to existing entry
            const updatedEntries = rateChartEntries.map(entry => {
                if (entry.id === editingEntry.id) {
                    const updatedRates = entry.rates.filter(r => r.customerTypeId !== editForm.customerTypeId)
                    updatedRates.push({
                        materialId: editForm.materialId,
                        customerTypeId: editForm.customerTypeId,
                        rate: editForm.rate,
                        startDate: editForm.startDate,
                        endDate: editForm.endDate || undefined,
                        isActive: true
                    })
                    return { ...entry, rates: updatedRates }
                }
                return entry
            })
            setRateChartEntries(updatedEntries)

            // Add to history
            const historyKey = `${editForm.materialId}-${editForm.customerTypeId}`
            const historyEntry = {
                id: Date.now(),
                materialName: editForm.materialName,
                customerTypeName: editForm.customerTypeName,
                rate: editForm.rate,
                startDate: editForm.startDate,
                endDate: editForm.endDate,
                notes: editForm.notes,
                timestamp: new Date().toLocaleString(),
                action: 'Added'
            }

            setRateHistory(prev => ({
                ...prev,
                [historyKey]: [...(prev[historyKey] || []), historyEntry]
            }))
        }

        // Reset edit state
        setEditingEntry(null)
        setEditingRateIndex(null)
        setEditForm({
            materialId: '',
            materialName: '',
            materialCode: '',
            customerTypeId: '',
            customerTypeName: '',
            rate: 0,
            startDate: '',
            endDate: '',
            notes: ''
        })
        setShowRateForm(false)
    }

    const handleCancelEdit = () => {
        setEditingEntry(null)
        setEditingRateIndex(null)
        setEditForm({
            materialId: '',
            materialName: '',
            materialCode: '',
            customerTypeId: '',
            customerTypeName: '',
            rate: 0,
            startDate: '',
            endDate: '',
            notes: ''
        })
        setShowRateForm(false)
    }

    const handleDeleteRate = (entryId: string, rateIndex: number) => {
        if (confirm('Are you sure you want to delete this rate?')) {
            const updatedEntries = rateChartEntries.map(entry => {
                if (entry.id === entryId) {
                    const updatedRates = entry.rates.filter((_, index) => index !== rateIndex)
                    return { ...entry, rates: updatedRates }
                }
                return entry
            })
            setRateChartEntries(updatedEntries)
        }
    }

    // Filtered and paginated data
    const filteredRateEntries = rateChartEntries.filter(entry =>
        entry.materialName.toLowerCase().includes(rateSearchTerm.toLowerCase()) ||
        entry.materialCode.toLowerCase().includes(rateSearchTerm.toLowerCase())
    )

    const rateTotalPages = Math.ceil(filteredRateEntries.length / rateItemsPerPage)
    const paginatedRateEntries = filteredRateEntries.slice(
        (rateCurrentPage - 1) * rateItemsPerPage,
        rateCurrentPage * rateItemsPerPage
    )

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                            <p className="text-gray-600">Manage shop settings, user preferences, and system configuration</p>
                        </div>
                        <Button
                            onClick={() => router.push('/retail')}
                            variant="outline"
                        >
                            Back to Dashboard
                        </Button>
                    </div>

                    {/* Settings Tabs */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="flex border-b overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('shop')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'shop'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    🏪 Shop
                                </button>
                                <button
                                    onClick={() => setActiveTab('user')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'user'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    👤 User
                                </button>
                                <button
                                    onClick={() => setActiveTab('material')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'material'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    📦 Material
                                </button>
                                <button
                                    onClick={() => setActiveTab('customer')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'customer'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    👥 Customer
                                </button>
                                <button
                                    onClick={() => setActiveTab('vendor')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'vendor'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    🏢 Vendor
                                </button>
                                <button
                                    onClick={() => setActiveTab('branch')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'branch'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    🏪 Branch
                                </button>
                                <button
                                    onClick={() => setActiveTab('system')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'system'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    ⚙️ System
                                </button>
                                <button
                                    onClick={() => setActiveTab('rate-chart')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'rate-chart'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    📊 Sales Rate Chart
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Shop Settings Tab */}
                                {activeTab === 'shop' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                                                    <Input
                                                        id="shopName"
                                                        value={shopSettings.shopName}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, shopName: e.target.value })}
                                                        placeholder="Enter shop name"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <Input
                                                        id="phone"
                                                        value={shopSettings.phone}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, phone: e.target.value })}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={shopSettings.email}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, email: e.target.value })}
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                                                    <Input
                                                        id="gstin"
                                                        value={shopSettings.gstin}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, gstin: e.target.value })}
                                                        placeholder="Enter GSTIN"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                    <Input
                                                        id="address"
                                                        value={shopSettings.address}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, address: e.target.value })}
                                                        placeholder="Enter shop address"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <Input
                                                        id="city"
                                                        value={shopSettings.city}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, city: e.target.value })}
                                                        placeholder="Enter city"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                    <Input
                                                        id="state"
                                                        value={shopSettings.state}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, state: e.target.value })}
                                                        placeholder="Enter state"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                                    <Input
                                                        id="pincode"
                                                        value={shopSettings.pincode}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, pincode: e.target.value })}
                                                        placeholder="Enter pincode"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                                    <select
                                                        id="currency"
                                                        value={shopSettings.currency}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, currency: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="INR">Indian Rupee (₹)</option>
                                                        <option value="USD">US Dollar ($)</option>
                                                        <option value="EUR">Euro (€)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                                                    <select
                                                        id="timezone"
                                                        value={shopSettings.timezone}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, timezone: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                                                        <option value="Asia/Dubai">Asia/Dubai</option>
                                                        <option value="America/New_York">America/New_York</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                                                    <select
                                                        id="dateFormat"
                                                        value={shopSettings.dateFormat}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, dateFormat: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                                                    <select
                                                        id="theme"
                                                        value={shopSettings.theme}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, theme: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="light">Light</option>
                                                        <option value="dark">Dark</option>
                                                        <option value="auto">Auto</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button onClick={handleShopSettingsSave} className="bg-orange-600 hover:bg-orange-700">
                                                Save Shop Settings
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* User Settings Tab */}
                                {activeTab === 'user' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <Input
                                                        id="userName"
                                                        value={userSettings.name}
                                                        onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                                                        placeholder="Enter full name"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                    <Input
                                                        id="userEmail"
                                                        type="email"
                                                        value={userSettings.email}
                                                        onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                    <Input
                                                        id="role"
                                                        value={userSettings.role}
                                                        disabled
                                                        className="bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label htmlFor="emailNotifications" className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                                                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                                                    </div>
                                                    <input
                                                        id="emailNotifications"
                                                        type="checkbox"
                                                        checked={userSettings.notifications.email}
                                                        onChange={(e) => setUserSettings({
                                                            ...userSettings,
                                                            notifications: { ...userSettings.notifications, email: e.target.checked }
                                                        })}
                                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label htmlFor="smsNotifications" className="block text-sm font-medium text-gray-700 mb-1">SMS Notifications</label>
                                                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                                    </div>
                                                    <input
                                                        id="smsNotifications"
                                                        type="checkbox"
                                                        checked={userSettings.notifications.sms}
                                                        onChange={(e) => setUserSettings({
                                                            ...userSettings,
                                                            notifications: { ...userSettings.notifications, sms: e.target.checked }
                                                        })}
                                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label htmlFor="pushNotifications" className="block text-sm font-medium text-gray-700 mb-1">Push Notifications</label>
                                                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                                                    </div>
                                                    <input
                                                        id="pushNotifications"
                                                        type="checkbox"
                                                        checked={userSettings.notifications.push}
                                                        onChange={(e) => setUserSettings({
                                                            ...userSettings,
                                                            notifications: { ...userSettings.notifications, push: e.target.checked }
                                                        })}
                                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button onClick={handleUserSettingsSave} className="bg-orange-600 hover:bg-orange-700">
                                                Save User Settings
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* System Settings Tab */}
                                {activeTab === 'system' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-sm">Backup Data</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-gray-600 mb-3">Create a backup of all your data</p>
                                                        <Button onClick={handleBackup} className="w-full bg-green-600 hover:bg-green-700">
                                                            💾 Create Backup
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-sm">Restore Data</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-gray-600 mb-3">Restore data from a backup file</p>
                                                        <Button onClick={handleRestore} variant="outline" className="w-full">
                                                            📁 Restore from Backup
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-700">Application Version:</span>
                                                        <span className="ml-2 text-gray-600">v1.0.0</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Last Backup:</span>
                                                        <span className="ml-2 text-gray-600">2024-01-22 10:30 AM</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Database Size:</span>
                                                        <span className="ml-2 text-gray-600">2.5 MB</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Total Records:</span>
                                                        <span className="ml-2 text-gray-600">1,247</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Sales Rate Chart Tab */}
                                {activeTab === 'rate-chart' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">Sales Rate Chart</h3>
                                                    <p className="text-sm text-gray-600">Manage pricing rates for different customer types and materials.</p>
                                                </div>
                                                <Button
                                                    onClick={() => setShowRateForm(!showRateForm)}
                                                    className="bg-orange-600 hover:bg-orange-700"
                                                >
                                                    {showRateForm ? 'Hide Form' : 'Add New Rate'}
                                                </Button>
                                            </div>

                                            {/* Rate Entry Form */}
                                            {showRateForm && (
                                                <Card className="mb-6">
                                                    <CardHeader>
                                                        <CardTitle className='text-lg'>
                                                            {editingEntry ? 'Edit Rate' : 'Add New Rate'}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* Material Selection */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
                                                                <div className="relative">
                                                                    <Input
                                                                        placeholder="Search material by name or SKU..."
                                                                        value={editingEntry ? editForm.materialName : rateForm.materialName}
                                                                        onChange={(e) => {
                                                                            const searchTerm = e.target.value
                                                                            if (editingEntry) {
                                                                                setEditForm({ ...editForm, materialName: searchTerm })
                                                                            } else {
                                                                                setRateForm({ ...rateForm, materialName: searchTerm })
                                                                            }
                                                                        }}
                                                                        disabled={editingEntry && editingRateIndex !== null ? true : false}
                                                                        className="w-full"
                                                                    />
                                                                    {(editingEntry ? editForm.materialName : rateForm.materialName) && !editingEntry && (
                                                                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                                                            {products.filter(p =>
                                                                                p.name.toLowerCase().includes((editingEntry ? editForm.materialName : rateForm.materialName).toLowerCase()) ||
                                                                                p.sku.toLowerCase().includes((editingEntry ? editForm.materialName : rateForm.materialName).toLowerCase())
                                                                            ).slice(0, 5).map((product) => (
                                                                                <div
                                                                                    key={product.sku}
                                                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b flex items-center space-x-3"
                                                                                    onClick={() => {
                                                                                        if (editingEntry) {
                                                                                            setEditForm({
                                                                                                ...editForm,
                                                                                                materialId: product.sku,
                                                                                                materialName: product.name,
                                                                                                materialCode: product.sku
                                                                                            })
                                                                                        } else {
                                                                                            handleMaterialSelect(product)
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                                                        {product.image ? (
                                                                                            <img
                                                                                                src={product.image}
                                                                                                alt={product.name}
                                                                                                className="w-full h-full object-cover"
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                                                📦
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="font-medium truncate">{product.name}</div>
                                                                                        <div className="text-xs text-gray-500">SKU: {product.sku} | Stock: {product.stock}</div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Customer Type Selection */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type *</label>
                                                                <select
                                                                    value={editingEntry ? editForm.customerTypeId : rateForm.customerTypeId}
                                                                    onChange={(e) => {
                                                                        const selectedType = customerTypes.find(ct => ct.id === e.target.value)
                                                                        if (selectedType) {
                                                                            if (editingEntry) {
                                                                                setEditForm({
                                                                                    ...editForm,
                                                                                    customerTypeId: selectedType.id,
                                                                                    customerTypeName: selectedType.name
                                                                                })
                                                                            } else {
                                                                                handleCustomerTypeSelect(selectedType)
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                >
                                                                    <option value="">Select Customer Type</option>
                                                                    {customerTypes.map((type) => (
                                                                        <option key={type.id} value={type.id}>{type.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Rate */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹) *</label>
                                                                <Input
                                                                    type="number"
                                                                    value={editingEntry ? editForm.rate : rateForm.rate}
                                                                    onChange={(e) => {
                                                                        const value = parseFloat(e.target.value) || 0
                                                                        if (editingEntry) {
                                                                            setEditForm({ ...editForm, rate: value })
                                                                        } else {
                                                                            setRateForm({ ...rateForm, rate: value })
                                                                        }
                                                                    }}
                                                                    placeholder="0.00"
                                                                    className="w-full"
                                                                />
                                                            </div>

                                                            {/* Start Date */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                                                <Input
                                                                    type="date"
                                                                    value={editingEntry ? editForm.startDate : rateForm.startDate}
                                                                    onChange={(e) => {
                                                                        if (editingEntry) {
                                                                            setEditForm({ ...editForm, startDate: e.target.value })
                                                                        } else {
                                                                            setRateForm({ ...rateForm, startDate: e.target.value })
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                />
                                                            </div>

                                                            {/* End Date */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                                <Input
                                                                    type="date"
                                                                    value={editingEntry ? editForm.endDate : rateForm.endDate}
                                                                    onChange={(e) => {
                                                                        if (editingEntry) {
                                                                            setEditForm({ ...editForm, endDate: e.target.value })
                                                                        } else {
                                                                            setRateForm({ ...rateForm, endDate: e.target.value })
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                />
                                                            </div>

                                                            {/* Notes */}
                                                            <div className="md:col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                                                <textarea
                                                                    value={editingEntry ? editForm.notes : rateForm.notes}
                                                                    onChange={(e) => {
                                                                        if (editingEntry) {
                                                                            setEditForm({ ...editForm, notes: e.target.value })
                                                                        } else {
                                                                            setRateForm({ ...rateForm, notes: e.target.value })
                                                                        }
                                                                    }}
                                                                    placeholder="Additional notes..."
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end space-x-3 mt-4">
                                                            <Button
                                                                onClick={editingEntry ? handleCancelEdit : () => setShowRateForm(false)}
                                                                variant="outline"
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={editingEntry ? handleUpdateRate : handleAddRate}
                                                                className="bg-orange-600 hover:bg-orange-700"
                                                            >
                                                                {editingEntry ? 'Update Rate' : 'Add Rate'}
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Search and Filter */}
                                            <div className="mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Search by material name or code..."
                                                            value={rateSearchTerm}
                                                            onChange={(e) => setRateSearchTerm(e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {filteredRateEntries.length} entries found
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rate Chart Grid */}
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full border border-gray-200 rounded-lg">
                                                    <thead className="bg-blue-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
                                                                Material
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
                                                                Customer Type
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
                                                                Rate (₹)
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
                                                                Start Date
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
                                                                End Date
                                                            </th>
                                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {paginatedRateEntries.map((entry) => (
                                                            <React.Fragment key={entry.id}>
                                                                <tr className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r">
                                                                        <div>
                                                                            <div className="font-medium">{entry.materialName}</div>
                                                                            <div className="text-xs text-gray-500">{entry.materialCode}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900 border-r">
                                                                        {entry.rates.length} customer type(s)
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900 border-r">
                                                                        {entry.rates.length > 0 ? (
                                                                            <div className="space-y-1">
                                                                                {entry.rates.slice(0, 2).map((rate, index) => (
                                                                                    <div key={index} className="text-sm">
                                                                                        ₹{rate.rate.toFixed(2)}
                                                                                    </div>
                                                                                ))}
                                                                                {entry.rates.length > 2 && (
                                                                                    <div className="text-xs text-gray-500">+{entry.rates.length - 2} more</div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-400">No rates</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900 border-r">
                                                                        {entry.rates.length > 0 ? (
                                                                            <div className="space-y-1">
                                                                                {entry.rates.slice(0, 2).map((rate, index) => (
                                                                                    <div key={index} className="text-sm">
                                                                                        {rate.startDate}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-400">-</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900 border-r">
                                                                        {entry.rates.length > 0 ? (
                                                                            <div className="space-y-1">
                                                                                {entry.rates.slice(0, 2).map((rate, index) => (
                                                                                    <div key={index} className="text-sm">
                                                                                        {rate.endDate || '-'}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-400">-</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <div className="flex items-center justify-center space-x-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => toggleRowExpansion(entry.id)}
                                                                                className="text-xs px-2 py-1"
                                                                            >
                                                                                {expandedRows.has(entry.id) ? '▼' : '▶'}
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleEditEntry(entry)}
                                                                                className="text-xs px-2 py-1"
                                                                            >
                                                                                ✏️
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                {/* Expanded Row - History */}
                                                                {expandedRows.has(entry.id) && (
                                                                    <tr className="bg-gray-50">
                                                                        <td colSpan={6} className="px-4 py-3">
                                                                            <div className="space-y-3">
                                                                                <h4 className="font-medium text-gray-900">Rate History</h4>
                                                                                <div className="space-y-2">
                                                                                    {entry.rates.map((rate, index) => {
                                                                                        const customerType = customerTypes.find(ct => ct.id === rate.customerTypeId)
                                                                                        return (
                                                                                            <div key={index} className="bg-white p-3 rounded border">
                                                                                                <div className="flex items-center justify-between">
                                                                                                    <div>
                                                                                                        <div className="font-medium">{customerType?.name || 'Unknown Type'}</div>
                                                                                                        <div className="text-sm text-gray-600">
                                                                                                            Rate: ₹{rate.rate.toFixed(2)} |
                                                                                                            Start: {rate.startDate} |
                                                                                                            End: {rate.endDate || 'No end date'}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex items-center space-x-2">
                                                                                                        <div className="text-xs text-gray-500">
                                                                                                            {rate.isActive ? 'Active' : 'Inactive'}
                                                                                                        </div>
                                                                                                        <Button
                                                                                                            size="sm"
                                                                                                            variant="outline"
                                                                                                            onClick={() => handleEditRate(entry, index)}
                                                                                                            className="text-xs px-2 py-1"
                                                                                                        >
                                                                                                            ✏️
                                                                                                        </Button>
                                                                                                        <Button
                                                                                                            size="sm"
                                                                                                            variant="outline"
                                                                                                            onClick={() => handleDeleteRate(entry.id, index)}
                                                                                                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                                                                                                        >
                                                                                                            🗑️
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            {rateTotalPages > 1 && (
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="text-sm text-gray-600">
                                                        Showing {((rateCurrentPage - 1) * rateItemsPerPage) + 1} to {Math.min(rateCurrentPage * rateItemsPerPage, filteredRateEntries.length)} of {filteredRateEntries.length} entries
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            onClick={() => setRateCurrentPage(Math.max(1, rateCurrentPage - 1))}
                                                            disabled={rateCurrentPage === 1}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-gray-600">
                                                            Page {rateCurrentPage} of {rateTotalPages}
                                                        </span>
                                                        <Button
                                                            onClick={() => setRateCurrentPage(Math.min(rateTotalPages, rateCurrentPage + 1))}
                                                            disabled={rateCurrentPage === rateTotalPages}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Material Management Tab */}
                                {activeTab === 'material' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Material Master Entry Form</h3>
                                                <Button
                                                    onClick={() => setIsMaterialFormOpen(!isMaterialFormOpen)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center space-x-2"
                                                >
                                                    <span>{isMaterialFormOpen ? 'Hide Form' : 'Show Form'}</span>
                                                    <span className={`transform transition-transform ${isMaterialFormOpen ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </Button>
                                            </div>
                                            {isMaterialFormOpen && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="materialDescription" className="block text-sm font-medium text-gray-700 mb-1">Material Description *</label>
                                                            <Input
                                                                id="materialDescription"
                                                                value={newMaterial.description || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                                                placeholder="Enter material description"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                                            <select
                                                                id="category"
                                                                value={newMaterial.category || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Plant Protection Chemicals">Plant Protection Chemicals</option>
                                                                <option value="Fertilizers">Fertilizers</option>
                                                                <option value="Seeds">Seeds</option>
                                                                <option value="Tools">Tools</option>
                                                                <option value="Food">Food</option>
                                                                <option value="Personal Care">Personal Care</option>
                                                                <option value="Hygiene">Hygiene</option>
                                                                <option value="Beverages">Beverages</option>
                                                                <option value="Dairy">Dairy</option>
                                                                <option value="Household">Household</option>
                                                                <option value="Electronics">Electronics</option>
                                                                <option value="Clothing">Clothing</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="uom" className="block text-sm font-medium text-gray-700 mb-1">UOM *</label>
                                                            <select
                                                                id="uom"
                                                                value={newMaterial.uom || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, uom: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="kg">Kilogram</option>
                                                                <option value="pkt">Packet</option>
                                                                <option value="pcs">Pieces</option>
                                                                <option value="ltr">Liter</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-1">MRP *</label>
                                                            <Input
                                                                id="mrp"
                                                                type="number"
                                                                value={newMaterial.mrp || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, mrp: parseFloat(e.target.value) })}
                                                                placeholder="Enter MRP"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                                                            <Input
                                                                id="reorderLevel"
                                                                type="number"
                                                                value={newMaterial.reorderLevel || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, reorderLevel: parseFloat(e.target.value) })}
                                                                placeholder="Enter reorder level"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="hsnCode" className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                                                            <Input
                                                                id="hsnCode"
                                                                value={newMaterial.hsnCode || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, hsnCode: e.target.value })}
                                                                placeholder="Enter HSN code"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                                                            <Input
                                                                id="gstRate"
                                                                type="number"
                                                                value={newMaterial.gstRate || ''}
                                                                onChange={(e) => setNewMaterial({ ...newMaterial, gstRate: parseFloat(e.target.value) })}
                                                                placeholder="Enter GST rate"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Button onClick={handleAddMaterial} className="bg-orange-600 hover:bg-orange-700">
                                                            Enter
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Material List</h3>
                                                <div className="flex space-x-2">
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value={5}>Show 5 entries</option>
                                                        <option value={10}>Show 10 entries</option>
                                                        <option value={25}>Show 25 entries</option>
                                                    </select>
                                                    <Input
                                                        placeholder="Search..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-48"
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Srl</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Material</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Category</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Reorder Level</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">MRP</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">HSN Code</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">GST(%)</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Operation</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {products
                                                            .filter(product =>
                                                                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                product.category.toLowerCase().includes(searchTerm.toLowerCase())
                                                            )
                                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                            .map((product, index) => (
                                                                <tr key={product.sku} className="border-b hover:bg-gray-50">
                                                                    <td className="py-2 px-3 text-sm">{index + 1}</td>
                                                                    <td className="py-2 px-3 text-sm">{product.name}[{product.sku}]</td>
                                                                    <td className="py-2 px-3 text-sm">{product.category}</td>
                                                                    <td className="py-2 px-3 text-sm">{product.minStock} {product.unit}</td>
                                                                    <td className="py-2 px-3 text-sm">₹{product.mrp.toFixed(2)}</td>
                                                                    <td className="py-2 px-3 text-sm">{product.hsnCode}</td>
                                                                    <td className="py-2 px-3 text-sm">{product.gstRate}%</td>
                                                                    <td className="py-2 px-3">
                                                                        <div className="flex space-x-1">
                                                                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">Edit</Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                                                                                onClick={() => handleDeleteItem('material', product.sku)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-4 flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} entries
                                                </p>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="bg-orange-100 text-orange-700">
                                                        {currentPage}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.min(Math.ceil(products.length / itemsPerPage), currentPage + 1))}
                                                        disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Customer Management Tab */}
                                {activeTab === 'customer' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">New Customer Entry Form</h3>
                                                <Button
                                                    onClick={() => setIsCustomerFormOpen(!isCustomerFormOpen)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center space-x-2"
                                                >
                                                    <span>{isCustomerFormOpen ? 'Hide Form' : 'Show Form'}</span>
                                                    <span className={`transform transition-transform ${isCustomerFormOpen ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </Button>
                                            </div>
                                            {isCustomerFormOpen && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                                            <Input
                                                                id="customerName"
                                                                value={newCustomer.name || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                                                placeholder="Enter customer name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="customerType" className="block text-sm font-medium text-gray-700 mb-1">Customer Type *</label>
                                                            <select
                                                                id="customerType"
                                                                value={newCustomer.customerType || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, customerType: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Cooperative Trade Debtors">Cooperative Trade Debtors</option>
                                                                <option value="Govt./Semi-Govt. Trade Debtors">Govt./Semi-Govt. Trade Debtors</option>
                                                                <option value="Regular Customers">Regular Customers</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Village/Address 1</label>
                                                            <Input
                                                                id="address1"
                                                                value={newCustomer.address1 || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, address1: e.target.value })}
                                                                placeholder="Enter address"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">P.O./Address 2</label>
                                                            <Input
                                                                id="address2"
                                                                value={newCustomer.address2 || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, address2: e.target.value })}
                                                                placeholder="Enter P.O."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">Pin</label>
                                                            <Input
                                                                id="pin"
                                                                value={newCustomer.pin || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, pin: e.target.value })}
                                                                placeholder="Enter pin code"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                            <Input
                                                                id="contactNumber"
                                                                value={newCustomer.contactNumber || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, contactNumber: e.target.value })}
                                                                placeholder="Enter contact number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Id</label>
                                                            <Input
                                                                id="customerEmail"
                                                                type="email"
                                                                value={newCustomer.email || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                                                placeholder="Enter email"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="faxNo" className="block text-sm font-medium text-gray-700 mb-1">Fax No</label>
                                                            <Input
                                                                id="faxNo"
                                                                value={newCustomer.faxNo || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, faxNo: e.target.value })}
                                                                placeholder="Enter fax number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="customerGstNo" className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                                                            <Input
                                                                id="customerGstNo"
                                                                value={newCustomer.gstNo || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, gstNo: e.target.value })}
                                                                placeholder="Enter GST number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="mfmsId" className="block text-sm font-medium text-gray-700 mb-1">MFMS ID</label>
                                                            <Input
                                                                id="mfmsId"
                                                                value={newCustomer.mfmsId || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, mfmsId: e.target.value })}
                                                                placeholder="Enter MFMS ID"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="mrDealerNo" className="block text-sm font-medium text-gray-700 mb-1">MR Dealer No *</label>
                                                            <Input
                                                                id="mrDealerNo"
                                                                value={newCustomer.mrDealerNo || ''}
                                                                onChange={(e) => setNewCustomer({ ...newCustomer, mrDealerNo: e.target.value })}
                                                                placeholder="Enter MR dealer number"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Button onClick={handleAddCustomer} className="bg-orange-600 hover:bg-orange-700">
                                                            Submit
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Customer List</h3>
                                                <div className="flex space-x-2">
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value={5}>Show 5 entries</option>
                                                        <option value={10}>Show 10 entries</option>
                                                        <option value={25}>Show 25 entries</option>
                                                    </select>
                                                    <Input
                                                        placeholder="Search..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-48"
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Srl</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">ID</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Name</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Customer Type</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Address</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Contact No</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Email Id</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">GST No</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Operation</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {customers
                                                            .filter(customer =>
                                                                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                customer.customerType.toLowerCase().includes(searchTerm.toLowerCase())
                                                            )
                                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                            .map((customer, index) => (
                                                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                                                    <td className="py-2 px-3 text-sm">{index + 1}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.id}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.name}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.customerType}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.address1} {customer.address2 && `, ${customer.address2}`}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.contactNumber}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.email}</td>
                                                                    <td className="py-2 px-3 text-sm">{customer.gstNo}</td>
                                                                    <td className="py-2 px-3">
                                                                        <div className="flex space-x-1">
                                                                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">Edit</Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                                                                                onClick={() => handleDeleteItem('customer', customer.id)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-4 flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, customers.length)} of {customers.length} entries
                                                </p>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="bg-orange-100 text-orange-700">
                                                        {currentPage}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.min(Math.ceil(customers.length / itemsPerPage), currentPage + 1))}
                                                        disabled={currentPage >= Math.ceil(customers.length / itemsPerPage)}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Vendor Management Tab */}
                                {activeTab === 'vendor' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">New Vendor Entry Form</h3>
                                                <Button
                                                    onClick={() => setIsVendorFormOpen(!isVendorFormOpen)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center space-x-2"
                                                >
                                                    <span>{isVendorFormOpen ? 'Hide Form' : 'Show Form'}</span>
                                                    <span className={`transform transition-transform ${isVendorFormOpen ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </Button>
                                            </div>
                                            {isVendorFormOpen && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                                                            <Input
                                                                id="vendorName"
                                                                value={newVendor.name || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                                                placeholder="Enter vendor name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorType" className="block text-sm font-medium text-gray-700 mb-1">Vendor Type *</label>
                                                            <select
                                                                id="vendorType"
                                                                value={newVendor.vendorType || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, vendorType: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Govt./Semi-Govt.">Govt./Semi-Govt.</option>
                                                                <option value="Other Co-Operatives">Other Co-Operatives</option>
                                                                <option value="Other Sources">Other Sources</option>
                                                                <option value="Iffco/Kribho">Iffco/Kribho</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorContactNo" className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                                                            <Input
                                                                id="vendorContactNo"
                                                                value={newVendor.contactNo || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, contactNo: e.target.value })}
                                                                placeholder="Enter contact number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                            <Input
                                                                id="vendorAddress"
                                                                value={newVendor.address || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                                                                placeholder="Enter address"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="ps" className="block text-sm font-medium text-gray-700 mb-1">PS</label>
                                                            <Input
                                                                id="ps"
                                                                value={newVendor.ps || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, ps: e.target.value })}
                                                                placeholder="Enter PS"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorGstNo" className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                                                            <Input
                                                                id="vendorGstNo"
                                                                value={newVendor.gstNo || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, gstNo: e.target.value })}
                                                                placeholder="Enter GST number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                            <Input
                                                                id="vendorEmail"
                                                                type="email"
                                                                value={newVendor.email || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                                                                placeholder="Enter email"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="po" className="block text-sm font-medium text-gray-700 mb-1">PO</label>
                                                            <Input
                                                                id="po"
                                                                value={newVendor.po || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, po: e.target.value })}
                                                                placeholder="Enter PO"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorPin" className="block text-sm font-medium text-gray-700 mb-1">Pin</label>
                                                            <Input
                                                                id="vendorPin"
                                                                value={newVendor.pin || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, pin: e.target.value })}
                                                                placeholder="Enter pin code"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="vendorMfmsId" className="block text-sm font-medium text-gray-700 mb-1">MFMS ID</label>
                                                            <Input
                                                                id="vendorMfmsId"
                                                                value={newVendor.mfmsId || ''}
                                                                onChange={(e) => setNewVendor({ ...newVendor, mfmsId: e.target.value })}
                                                                placeholder="Enter MFMS ID"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Button onClick={handleAddVendor} className="bg-orange-600 hover:bg-orange-700">
                                                            Submit
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Vendor List</h3>
                                                <div className="flex space-x-2">
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value={10}>Show 10 entries</option>
                                                        <option value={25}>Show 25 entries</option>
                                                        <option value={50}>Show 50 entries</option>
                                                    </select>
                                                    <Input
                                                        placeholder="Search..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-48"
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Id</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Name</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Type</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Contact No</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Address</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Email</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">GST No</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">MFMS ID</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Operation</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {vendors
                                                            .filter(vendor =>
                                                                vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                vendor.vendorType.toLowerCase().includes(searchTerm.toLowerCase())
                                                            )
                                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                            .map((vendor, index) => (
                                                                <tr key={vendor.id} className="border-b hover:bg-gray-50">
                                                                    <td className="py-2 px-3 text-sm">{vendor.id}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.name}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.vendorType}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.contactNo}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.address} {vendor.ps && `, ${vendor.ps}`}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.email}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.gstNo}</td>
                                                                    <td className="py-2 px-3 text-sm">{vendor.mfmsId}</td>
                                                                    <td className="py-2 px-3">
                                                                        <div className="flex space-x-1">
                                                                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">Edit</Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                                                                                onClick={() => handleDeleteItem('vendor', vendor.id)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-4 flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, vendors.length)} of {vendors.length} entries
                                                </p>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="bg-orange-100 text-orange-700">
                                                        {currentPage}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.min(Math.ceil(vendors.length / itemsPerPage), currentPage + 1))}
                                                        disabled={currentPage >= Math.ceil(vendors.length / itemsPerPage)}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Branch Management Tab */}
                                {activeTab === 'branch' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Branch Entry Form</h3>
                                                <Button
                                                    onClick={() => setIsBranchFormOpen(!isBranchFormOpen)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center space-x-2"
                                                >
                                                    <span>{isBranchFormOpen ? 'Hide Form' : 'Show Form'}</span>
                                                    <span className={`transform transition-transform ${isBranchFormOpen ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </Button>
                                            </div>
                                            {isBranchFormOpen && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="branchType" className="block text-sm font-medium text-gray-700 mb-1">Branch Type *</label>
                                                            <select
                                                                id="branchType"
                                                                value={newBranch.branchType || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, branchType: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Online">Online</option>
                                                                <option value="Offline">Offline</option>
                                                                <option value="Hybrid">Hybrid</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                                                            <Input
                                                                id="branchName"
                                                                value={newBranch.branchName || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                                                                placeholder="Enter branch name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                            <Input
                                                                id="branchAddress"
                                                                value={newBranch.address || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                                                                placeholder="Enter address"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchVillage" className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                                                            <Input
                                                                id="branchVillage"
                                                                value={newBranch.village || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, village: e.target.value })}
                                                                placeholder="Enter village"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchPin" className="block text-sm font-medium text-gray-700 mb-1">Pin</label>
                                                            <Input
                                                                id="branchPin"
                                                                value={newBranch.pin || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, pin: e.target.value })}
                                                                placeholder="Enter pin code"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchContactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                            <Input
                                                                id="branchContactNumber"
                                                                value={newBranch.contactNumber || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, contactNumber: e.target.value })}
                                                                placeholder="Enter contact number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchEmailId" className="block text-sm font-medium text-gray-700 mb-1">Email Id</label>
                                                            <Input
                                                                id="branchEmailId"
                                                                type="email"
                                                                value={newBranch.emailId || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, emailId: e.target.value })}
                                                                placeholder="Enter email"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="branchGstNo" className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
                                                            <Input
                                                                id="branchGstNo"
                                                                value={newBranch.gstNo || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, gstNo: e.target.value })}
                                                                placeholder="Enter GST number"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="giMasCode" className="block text-sm font-medium text-gray-700 mb-1">GI Mas Code *</label>
                                                            <Input
                                                                id="giMasCode"
                                                                value={newBranch.giMasCode || ''}
                                                                onChange={(e) => setNewBranch({ ...newBranch, giMasCode: e.target.value })}
                                                                placeholder="Enter GI Mas Code"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Button onClick={handleAddBranch} className="bg-orange-600 hover:bg-orange-700">
                                                            Submit
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Branch List</h3>
                                                <div className="flex space-x-2">
                                                    <select
                                                        value={itemsPerPage}
                                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value={5}>Show 5 entries</option>
                                                        <option value={10}>Show 10 entries</option>
                                                        <option value={25}>Show 25 entries</option>
                                                    </select>
                                                    <Input
                                                        placeholder="Search..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-48"
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Sr. No.</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Name</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Address</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Pin</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Contact No</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Email Id</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Type</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">GST No</th>
                                                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Operation</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {branches
                                                            .filter(branch =>
                                                                branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                branch.branchType.toLowerCase().includes(searchTerm.toLowerCase())
                                                            )
                                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                            .map((branch, index) => (
                                                                <tr key={branch.id} className="border-b hover:bg-gray-50">
                                                                    <td className="py-2 px-3 text-sm">{index + 1}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.branchName}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.address}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.pin}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.contactNumber}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.emailId}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.branchType}</td>
                                                                    <td className="py-2 px-3 text-sm">{branch.gstNo}</td>
                                                                    <td className="py-2 px-3">
                                                                        <div className="flex space-x-1">
                                                                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">Edit</Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                                                                                onClick={() => handleDeleteItem('branch', branch.id)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-4 flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, branches.length)} of {branches.length} entries
                                                </p>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="bg-orange-100 text-orange-700">
                                                        {currentPage}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setCurrentPage(Math.min(Math.ceil(branches.length / itemsPerPage), currentPage + 1))}
                                                        disabled={currentPage >= Math.ceil(branches.length / itemsPerPage)}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
