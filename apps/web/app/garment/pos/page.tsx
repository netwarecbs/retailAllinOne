'use client'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Input, Skeleton } from '@retail/ui'
import { PageGuard, NotAuthorized } from '../../../components/RBAC'
import { AppDispatch, RootState, setCustomer, addToCart, removeFromCart, updateCartItem, setExtraLess, setSavings, updatePaymentAmount, holdInvoice, loadHeldInvoice, removeHeldInvoice, setInvoiceNumber, createSale } from '@retail/shared'
import { Customer, Product } from '@retail/shared'
import { sampleCustomers, sampleProducts } from '@retail/shared'
import ProductSelectionModal from '../../../components/ProductSelectionModal'
import toast, { Toaster } from 'react-hot-toast'

interface RecentItem {
    id: string
    productId: string
    productName: string
    sku: string
    price: number
    size?: string
    color?: string
    images?: string[]
    addedAt: Date
}

export default function GarmentPOSPage() {
    const dispatch = useDispatch<AppDispatch>()
    const {
        customer,
        cart,
        subtotal,
        discount,
        tax,
        total,
        extraLess,
        savings,
        invoiceTotal,
        paymentDetails,
        heldInvoices,
        currentInvoiceNumber,
        loading
    } = useSelector((state: RootState) => state.sales)

    const [searchQuery, setSearchQuery] = useState('')
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [isAddingCustomer, setIsAddingCustomer] = useState(false)
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        gstin: '',
        pan: '',
        loyaltyCard: '',
        isWholesale: false
    })

    // Product scanning states
    const [barcodeInput, setBarcodeInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [quantityInput, setQuantityInput] = useState('')
    const [priceInput, setPriceInput] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [showProductModal, setShowProductModal] = useState(false)

    // Recent items states
    const [recentItems, setRecentItems] = useState<RecentItem[]>([])
    const [showRecentModal, setShowRecentModal] = useState(false)

    // New states for payment inputs
    const [extraLessInput, setExtraLessInput] = useState('')
    const [savingsInput, setSavingsInput] = useState('')
    const [cashInput, setCashInput] = useState('')
    const [cardInput, setCardInput] = useState('')
    const [upiInput, setUpiInput] = useState('')
    const [changeInput, setChangeInput] = useState('')

    // Modal states
    const [showHeldInvoicesModal, setShowHeldInvoicesModal] = useState(false)
    const [showInvoicePreview, setShowInvoicePreview] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

    // Loading state for the main POS page
    const [isLoading, setIsLoading] = useState(true)

    // Simulate loading on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500) // Simulate 1.5 seconds loading time

        return () => clearTimeout(timer)
    }, [])

    const dropdownRef = useRef<HTMLDivElement>(null)

    // Initialize invoice number on component mount
    useEffect(() => {
        if (!currentInvoiceNumber) {
            const newInvoiceNumber = `INV-${Date.now()}`
            dispatch(setInvoiceNumber(newInvoiceNumber))
        }
    }, [dispatch, currentInvoiceNumber])

    // Update input fields when Redux state changes
    useEffect(() => {
        setExtraLessInput(extraLess.toString())
        setSavingsInput(savings.toString())
        setCashInput(paymentDetails.cashAmount.toString())
        setCardInput(paymentDetails.cardAmount.toString())
        setUpiInput(paymentDetails.upiAmount.toString())
        setChangeInput(paymentDetails.changeGiven.toString())
    }, [extraLess, savings, paymentDetails])

    // Load recent items from localStorage on component mount
    useEffect(() => {
        const savedRecentItems = localStorage.getItem('pos_recent_items')
        if (savedRecentItems) {
            try {
                const parsed = JSON.parse(savedRecentItems)
                setRecentItems(parsed.map((item: any) => ({
                    ...item,
                    addedAt: new Date(item.addedAt)
                })))
            } catch (error) {
                console.error('Error parsing recent items:', error)
            }
        }
    }, [])

    // Save recent items to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('pos_recent_items', JSON.stringify(recentItems))
    }, [recentItems])

    // Filter customers based on search query
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            const filtered = sampleCustomers.filter(customer =>
                customer.name.toLowerCase().includes(query) ||
                customer.phone?.includes(query) ||
                customer.email?.toLowerCase().includes(query) ||
                customer.pan?.toLowerCase().includes(query) ||
                customer.gstin?.toLowerCase().includes(query)
            )
            setFilteredCustomers(filtered)
            setShowDropdown(true)
        } else {
            setFilteredCustomers([])
            setShowDropdown(false)
        }
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleCustomerSelect = (selectedCustomer: Customer) => {
        dispatch(setCustomer(selectedCustomer))
        setSearchQuery(selectedCustomer.name)
        setShowDropdown(false)
        setIsAddingCustomer(false)
    }

    const handleAddNewCustomer = () => {
        setIsAddingCustomer(true)
        setShowDropdown(false)
        setNewCustomer({
            name: searchQuery,
            phone: '',
            email: '',
            address: '',
            gstin: '',
            pan: '',
            loyaltyCard: '',
            isWholesale: false
        })
    }

    const handleSaveNewCustomer = () => {
        if (!newCustomer.name.trim()) {
            toast.error('Customer name is required', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        const customer: Customer = {
            id: `new_${Date.now()}`,
            name: newCustomer.name,
            phone: newCustomer.phone,
            email: newCustomer.email,
            address: newCustomer.address,
            gstin: newCustomer.gstin,
            gstNo: newCustomer.gstin,
            pan: newCustomer.pan,
            loyaltyCard: newCustomer.loyaltyCard,
            isWholesale: newCustomer.isWholesale,
            creditLimit: newCustomer.isWholesale ? 100000 : 50000,
            outstandingAmount: 0,
            customerType: newCustomer.isWholesale ? 'wholesale' : 'retail',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        dispatch(setCustomer(customer))
        setIsAddingCustomer(false)
        setSearchQuery(customer.name)
    }

    const handleClearCustomer = () => {
        dispatch(setCustomer(null))
        setSearchQuery('')
        setIsAddingCustomer(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        if (!e.target.value.trim()) {
            dispatch(setCustomer(null))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredCustomers.length > 0) {
            handleCustomerSelect(filteredCustomers[0])
        }
    }

    const handleNewCustomerChange = (field: string, value: string | boolean) => {
        setNewCustomer(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Add item to recent items
    const addToRecentItems = (product: Product, size?: string, color?: string) => {
        console.log(`📸 Adding to recent items: ${product.name}`, {
            images: product.images,
            imageCount: product.images?.length
        })

        const recentItem: RecentItem = {
            id: `recent_${Date.now()}`,
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            price: product.price,
            size,
            color,
            images: product.images,
            addedAt: new Date()
        }

        setRecentItems(prev => {
            // Remove if already exists (to avoid duplicates)
            const filtered = prev.filter(item =>
                !(item.productId === product.id && item.size === size && item.color === color)
            )
            // Add new item at the beginning and keep only last 50 items
            return [recentItem, ...filtered].slice(0, 50)
        })
    }

    // Check if item is in cart
    const isItemInCart = (productId: string, size?: string, color?: string) => {
        return cart.some(item =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
        )
    }

    // Handle recent item click
    const handleRecentItemClick = (recentItem: RecentItem) => {
        const product = sampleProducts.find(p => p.id === recentItem.productId)
        if (!product) return

        // If product has multiple sizes/colors, show modal
        if (product.sizes.length > 1 || product.colors.length > 1) {
            setSelectedProduct(product)
            setShowProductModal(true)
        } else {
            const size = recentItem.size || product.sizes[0]?.name || ''
            const color = recentItem.color || product.colors[0]?.name || ''

            // Check if item already exists in cart with same size/color
            const existingItem = cart.find(item =>
                item.productId === product.id &&
                item.size === size &&
                item.color === color
            )

            if (existingItem) {
                // Increase quantity of existing item
                dispatch(updateCartItem({ id: existingItem.id, quantity: existingItem.quantity + 1 }))
                console.log(`✅ Increased quantity of ${product.name} to ${existingItem.quantity + 1}`)
            } else {
                // Add directly to cart
                dispatch(addToCart({
                    product,
                    quantity: 1,
                    size,
                    color
                }))
                console.log(`✅ Added ${product.name} to cart from recent items`)
            }

            // Add to recent items
            addToRecentItems(product, size, color)
        }
    }

    // Product scanning functions
    const handleBarcodeScan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setBarcodeInput(value)

        // Auto-search when barcode is entered
        if (value.trim()) {
            const product = sampleProducts.find(p =>
                p.barcode === value || p.sku === value
            )

            if (product) {
                setSelectedProduct(product)
                setDescriptionInput(product.name)
                setPriceInput(product.price.toString())

                // If product has multiple sizes/colors, show modal
                if (product.sizes.length > 1 || product.colors.length > 1) {
                    setShowProductModal(true)
                } else {
                    // Check if item already exists in cart with same size/color
                    const existingItem = cart.find(item =>
                        item.productId === product.id &&
                        item.size === (product.sizes[0]?.name || '') &&
                        item.color === (product.colors[0]?.name || '')
                    )

                    if (existingItem) {
                        // Increase quantity of existing item
                        dispatch(updateCartItem({ id: existingItem.id, quantity: existingItem.quantity + 1 }))
                        console.log(`✅ Increased quantity of ${product.name} to ${existingItem.quantity + 1}`)
                    } else {
                        // Auto-add to cart if single size/color and not already in cart
                        handleQuickAddToCart(product)
                    }
                }
            }
        }
    }

    const handleQuickAddToCart = (product: Product) => {
        const quantity = parseInt(quantityInput) || 1
        const price = parseFloat(priceInput) || product.price
        const size = product.sizes[0]?.name || ''
        const color = product.colors[0]?.name || ''

        // Check if item already exists in cart with same size/color
        const existingItem = cart.find(item =>
            item.productId === product.id &&
            item.size === size &&
            item.color === color
        )

        if (existingItem) {
            // Increase quantity of existing item
            dispatch(updateCartItem({ id: existingItem.id, quantity: existingItem.quantity + quantity }))
            console.log(`✅ Increased quantity of ${product.name} to ${existingItem.quantity + quantity}`)
        } else {
            // Add new item to cart
            dispatch(addToCart({
                product,
                quantity,
                size,
                color
            }))
            console.log(`✅ Added ${quantity}x ${product.name} to cart`)
        }

        // Add to recent items
        addToRecentItems(product, size, color)

        // Clear inputs
        setBarcodeInput('')
        setDescriptionInput('')
        setQuantityInput('')
        setPriceInput('')
        setSelectedProduct(null)

        // Focus back to barcode input for next scan
        setTimeout(() => {
            const barcodeInput = document.querySelector('input[placeholder="Scan barcode/SKU"]') as HTMLInputElement
            barcodeInput?.focus()
        }, 100)
    }

    const handleEnterProduct = () => {
        if (!selectedProduct) {
            toast.error('Please scan a product first', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        const quantity = parseInt(quantityInput) || 1
        const price = parseFloat(priceInput) || selectedProduct.price

        if (selectedProduct.sizes.length > 1 || selectedProduct.colors.length > 1) {
            setShowProductModal(true)
        } else {
            handleQuickAddToCart(selectedProduct)
        }
    }

    const handleProductModalClose = () => {
        setShowProductModal(false)
        setSelectedProduct(null)
        setBarcodeInput('')
        setDescriptionInput('')
        setQuantityInput('')
        setPriceInput('')
    }

    const handleProductModalSelect = (product: Product) => {
        setShowProductModal(false)
        setSelectedProduct(null)
        setBarcodeInput('')
        setDescriptionInput('')
        setQuantityInput('')
        setPriceInput('')

        // Add to recent items when product is selected from modal
        addToRecentItems(product)
    }

    const handleRemoveFromCart = (itemId: string) => {
        dispatch(removeFromCart(itemId))
    }

    const handleUpdateCartItem = (itemId: string, quantity: number) => {
        dispatch(updateCartItem({ id: itemId, quantity }))
    }

    // New handler functions for payment and invoice management
    const handleExtraLessChange = (value: string) => {
        setExtraLessInput(value)
        const numValue = parseFloat(value) || 0
        dispatch(setExtraLess(numValue))
    }

    const handleSavingsChange = (value: string) => {
        setSavingsInput(value)
        const numValue = parseFloat(value) || 0
        dispatch(setSavings(numValue))
    }

    const handlePaymentChange = (method: 'cashAmount' | 'cardAmount' | 'upiAmount', value: string) => {
        const numValue = parseFloat(value) || 0
        dispatch(updatePaymentAmount({ method, amount: numValue }))
    }

    const handleSaveInvoice = async () => {
        if (cart.length === 0) {
            toast.error('No items in cart to save', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        if (!customer) {
            toast.error('Please select a customer', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        try {
            const saleData = {
                invoiceNumber: currentInvoiceNumber,
                customerId: customer.id,
                customerName: customer.name,
                customerPhone: customer.phone,
                customerAddress: customer.address,
                customerGstNo: customer.gstin,
                items: cart.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    productName: item.productName,
                    sku: item.sku,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount,
                    tax: item.tax,
                    total: item.total,
                    stockAfterSale: item.stockAfterSale
                })),
                subtotal,
                discount,
                tax,
                total: invoiceTotal,
                paymentMethod: { type: 'cash' as const, amount: paymentDetails.cashAmount },
                paymentDetails,
                status: 'completed' as const,
                notes: `Extra/Less: ${extraLess}, Savings: ${savings}`
            }

            await dispatch(createSale(saleData)).unwrap()
            toast.success('Invoice saved successfully!', {
                duration: 3000,
                style: {
                    background: '#10B981',
                    color: '#fff',
                },
            })
        } catch (error) {
            console.error('Error saving invoice:', error)
            toast.error('Failed to save invoice. Please try again.', {
                duration: 5000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
        }
    }

    const handleSaveAndPrint = async () => {
        if (cart.length === 0) {
            toast.error('No items in cart to save', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        if (!customer) {
            toast.error('Please select a customer', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        setShowInvoicePreview(true)
    }

    const handleGeneratePDF = async () => {
        if (cart.length === 0) {
            toast.error('No items in cart to generate PDF', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        // TODO: Implement PDF generation
        toast('PDF generation feature will be implemented soon!', {
            duration: 4000,
            style: {
                background: '#3B82F6',
                color: '#fff',
            },
        })
    }

    const handleHoldInvoice = () => {
        if (cart.length === 0) {
            toast.error('No items in cart to hold', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            })
            return
        }

        dispatch(holdInvoice())
        toast.success('Invoice held successfully!', {
            duration: 3000,
            style: {
                background: '#10B981',
                color: '#fff',
            },
        })
    }

    const handleViewAllHeld = () => {
        setShowHeldInvoicesModal(true)
    }

    const handleLoadHeldInvoice = (invoiceId: string) => {
        dispatch(loadHeldInvoice(invoiceId))
        setShowHeldInvoicesModal(false)
    }

    const handleRemoveHeldInvoice = (invoiceId: string) => {
        setInvoiceToDelete(invoiceId)
        setShowConfirmModal(true)
    }

    const confirmRemoveHeldInvoice = () => {
        if (invoiceToDelete) {
            dispatch(removeHeldInvoice(invoiceToDelete))
            toast.success('Held invoice removed successfully!', {
                duration: 3000,
                style: {
                    background: '#10B981',
                    color: '#fff',
                },
            })
            setInvoiceToDelete(null)
            setShowConfirmModal(false)
        }
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Focus barcode input on F2
            if (e.key === 'F2') {
                e.preventDefault()
                const barcodeInput = document.querySelector('input[placeholder="Scan barcode/SKU"]') as HTMLInputElement
                barcodeInput?.focus()
            }

            // Focus customer search on F3
            if (e.key === 'F3') {
                e.preventDefault()
                const customerInput = document.querySelector('input[placeholder="Search customer..."]') as HTMLInputElement
                customerInput?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [])

    // Get recent items for display (4 items per row, max 3 rows = 12 items)
    const displayRecentItems = recentItems.slice(0, 12)

    return (
        <PageGuard tile="garment" page="pos" fallback={<NotAuthorized />}>
            <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 space-y-4">
                    {/* Loading State */}
                    {isLoading ? (
                        <>
                            {/* Title bar skeleton */}
                            <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">
                                <Skeleton className="h-4 w-12" />
                            </div>

                            {/* Header form skeleton */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                                        {/* Left column skeleton */}
                                        <div className="md:col-span-7 grid grid-cols-12 gap-3">
                                            <div className="col-span-6 relative">
                                                <Skeleton className="h-3 w-16 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-3">
                                                <Skeleton className="h-3 w-12 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-1">
                                                <Skeleton className="h-3 w-12 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-2">
                                                <Skeleton className="h-3 w-8 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-6">
                                                <Skeleton className="h-3 w-12 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-6">
                                                <Skeleton className="h-3 w-12 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-12">
                                                <Skeleton className="h-3 w-16 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                            <div className="col-span-4">
                                                <Skeleton className="h-3 w-10 mb-1" />
                                                <Skeleton className="h-8 w-full rounded" />
                                            </div>
                                        </div>

                                        {/* Right info widgets skeleton */}
                                        <div className="md:col-span-5 grid grid-cols-2 gap-2 items-start">
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <Skeleton className="h-3 w-16 mb-1" />
                                                <Skeleton className="h-4 w-12" />
                                            </div>
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <Skeleton className="h-3 w-20 mb-1" />
                                                <Skeleton className="h-4 w-12" />
                                            </div>
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <Skeleton className="h-3 w-8 mb-1" />
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <Skeleton className="h-3 w-12 mb-1" />
                                                <Skeleton className="h-4 w-12" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick entry row skeleton */}
                                    <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-2 text-xs items-center">
                                        <div className="lg:col-span-1 flex items-center gap-2">
                                            <Skeleton className="h-5 w-5 rounded" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <div className="lg:col-span-3">
                                            <Skeleton className="h-8 w-full rounded" />
                                        </div>
                                        <div className="lg:col-span-4">
                                            <Skeleton className="h-8 w-full rounded" />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <Skeleton className="h-8 w-full rounded" />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <Skeleton className="h-8 w-full rounded" />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <Skeleton className="h-8 w-full rounded" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Main grid skeleton */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* Left table skeleton */}
                                <Card className="border-0 shadow-sm lg:col-span-8">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                                        <th className="px-3 py-2 text-left">#</th>
                                                        <th className="px-3 py-2 text-left">DESCRIPTION</th>
                                                        <th className="px-3 py-2 text-left">LOCATE</th>
                                                        <th className="px-3 py-2 text-left">OFFERS</th>
                                                        <th className="px-3 py-2 text-left">NET QTY</th>
                                                        <th className="px-3 py-2 text-right">PRICE</th>
                                                        <th className="px-3 py-2 text-right">DISC.</th>
                                                        <th className="px-3 py-2 text-right">TOTAL VALUE</th>
                                                        <th className="px-3 py-2 text-right"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.from({ length: 3 }).map((_, index) => (
                                                        <tr key={index} className="border-t">
                                                            <td className="px-3 py-2">
                                                                <Skeleton className="h-4 w-4" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Skeleton className="h-4 w-32" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Skeleton className="h-4 w-16" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Skeleton className="h-4 w-12" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <Skeleton className="h-4 w-8" />
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <Skeleton className="h-4 w-12 ml-auto" />
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <Skeleton className="h-4 w-8 ml-auto" />
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <Skeleton className="h-4 w-16 ml-auto" />
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <div className="flex items-center gap-2 justify-end">
                                                                    <Skeleton className="h-6 w-6 rounded" />
                                                                    <Skeleton className="h-6 w-6 rounded" />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="px-3 py-2 text-[11px] text-gray-600 flex items-center gap-4">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-12 ml-auto" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Right tiles area skeleton */}
                                <div className="lg:col-span-4 space-y-3">
                                    {/* Quick Products skeleton */}
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-2 text-xs">
                                            <Skeleton className="h-6 w-24 rounded" />
                                        </CardContent>
                                    </Card>
                                    {/* Recent Items skeleton */}
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-6 w-16 rounded" />
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {Array.from({ length: 8 }).map((_, index) => (
                                                    <div key={index} className="border rounded p-2">
                                                        <Skeleton className="h-16 w-full rounded mb-2" />
                                                        <div className="flex items-center justify-between">
                                                            <Skeleton className="h-3 w-8" />
                                                            <Skeleton className="h-3 w-6" />
                                                        </div>
                                                        <Skeleton className="h-3 w-full mt-1" />
                                                        <Skeleton className="h-2 w-12 mt-1" />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Bottom payment summary skeleton */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
                                <div className="lg:col-span-7 grid grid-cols-7 gap-2">
                                    {Array.from({ length: 7 }).map((_, index) => (
                                        <div key={index} className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                            <Skeleton className="h-3 w-16 mb-1" />
                                            <Skeleton className="h-7 w-full rounded" />
                                        </div>
                                    ))}
                                </div>
                                <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-3">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Skeleton key={index} className="h-8 w-20 rounded" />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Title bar - compact */}
                            <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">{'<<'} POS</div>

                            {/* Header form */}
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                                        {/* Left column */}
                                        <div className="md:col-span-7 grid grid-cols-12 gap-3">
                                            <div className="col-span-6 relative" ref={dropdownRef}>
                                                <label className="block text-gray-600 mb-1">Name (F3)</label>
                                                <div className="relative">
                                                    <Input
                                                        className="h-8 pr-8"
                                                        value={searchQuery}
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleKeyDown}
                                                        placeholder="Search customer..."
                                                    />
                                                    {customer && (
                                                        <button
                                                            onClick={handleClearCustomer}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Customer Dropdown */}
                                                {showDropdown && filteredCustomers.length > 0 && (
                                                    <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                                        {filteredCustomers.map((customer) => (
                                                            <div
                                                                key={customer.id}
                                                                onClick={() => handleCustomerSelect(customer)}
                                                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-xs"
                                                            >
                                                                <div className="font-medium">{customer.name}</div>
                                                                <div className="text-gray-500">{customer.phone} • {customer.email}</div>
                                                            </div>
                                                        ))}
                                                        <div
                                                            onClick={handleAddNewCustomer}
                                                            className="p-2 hover:bg-blue-50 cursor-pointer border-t border-gray-200 text-blue-600 font-medium text-xs"
                                                        >
                                                            + Add New Customer: "{searchQuery}"
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Selected Customer Info */}
                                                {customer && !showDropdown && (
                                                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium text-blue-900">{customer.name}</div>
                                                                <div className="text-blue-700">{customer.phone} • {customer.email}</div>
                                                            </div>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${customer.isWholesale
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {customer.isWholesale ? 'Wholesale' : 'Retail'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-span-3">
                                                <label className="block text-gray-600 mb-1">L.Card</label>
                                                <Input
                                                    className="h-8"
                                                    value={customer?.loyaltyCard || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-gray-600 mb-1">Invoice</label>
                                                <Input
                                                    className="h-8 text-right"
                                                    value={currentInvoiceNumber}
                                                    onChange={(e) => dispatch(setInvoiceNumber(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-gray-600 mb-1">Date</label>
                                                <Input type="date" className="h-8" defaultValue="2025-08-11" />
                                            </div>
                                            <div className="col-span-6">
                                                <label className="block text-gray-600 mb-1">Mobile</label>
                                                <Input
                                                    className="h-8"
                                                    value={customer?.phone || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-span-6">
                                                <label className="block text-gray-600 mb-1">GSTNo.</label>
                                                <Input
                                                    className="h-8"
                                                    value={customer?.gstin || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-span-12">
                                                <label className="block text-gray-600 mb-1">Address</label>
                                                <Input
                                                    className="h-8"
                                                    value={customer?.address || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="block text-gray-600 mb-1">State</label>
                                                <select className="w-full border rounded px-2 py-1 h-8">
                                                    <option>West Bengal (19)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Right info widgets */}
                                        <div className="md:col-span-5 grid grid-cols-2 gap-2 items-start">
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <div className="text-gray-500">Credit Limit</div>
                                                <div className="text-gray-700 font-medium">
                                                    {customer ? `₹${customer.creditLimit?.toLocaleString() || '0'}` : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <div className="text-gray-500">Outstanding</div>
                                                <div className={`font-medium ${customer?.outstandingAmount && customer.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {customer ? `₹${customer.outstandingAmount?.toLocaleString() || '0'}` : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <div className="text-gray-500">Type</div>
                                                <div className="text-gray-700 font-medium">
                                                    {customer ? (customer.isWholesale ? 'Wholesale' : 'Retail') : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                                <div className="text-gray-500">Status</div>
                                                <div className="text-gray-700 font-medium">
                                                    {customer ? (customer.outstandingAmount && customer.outstandingAmount > customer.creditLimit! ? 'Overdue' : 'Active') : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick entry row */}
                                    <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-2 text-xs items-center">
                                        <div className="lg:col-span-1 flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-5 h-5 border rounded">🏷️</span>
                                            <span>Barcode (F2)</span>
                                        </div>
                                        <div className="lg:col-span-3">
                                            <div className="relative">
                                                <Input
                                                    className={`h-8 ${selectedProduct ? 'border-green-500 bg-green-50' : ''}`}
                                                    placeholder="Scan barcode/SKU"
                                                    value={barcodeInput}
                                                    onChange={handleBarcodeScan}
                                                />
                                                {selectedProduct && (
                                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600">
                                                        ✓
                                                    </div>
                                                )}
                                                {selectedProduct && (
                                                    <div className="absolute -bottom-6 left-0 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                                        Found: {selectedProduct.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="lg:col-span-4">
                                            <Input
                                                className="h-8"
                                                placeholder="Description"
                                                value={descriptionInput}
                                                onChange={(e) => setDescriptionInput(e.target.value)}
                                            />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <Input
                                                className="h-8 text-right"
                                                placeholder="Qty"
                                                value={quantityInput}
                                                onChange={(e) => setQuantityInput(e.target.value)}
                                            />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <Input
                                                className="h-8 text-right"
                                                placeholder="Sale Price"
                                                value={priceInput}
                                                onChange={(e) => setPriceInput(e.target.value)}
                                            />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <Button
                                                className="h-8 bg-blue-600 hover:bg-blue-700 w-full"
                                                onClick={handleEnterProduct}
                                            >
                                                Enter
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Add New Customer Modal */}
                            {isAddingCustomer && (
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold">Add New Customer</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsAddingCustomer(false)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <label className="block text-gray-600 mb-1">Name *</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.name}
                                                    onChange={(e) => handleNewCustomerChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 mb-1">Phone</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.phone}
                                                    onChange={(e) => handleNewCustomerChange('phone', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 mb-1">Email</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.email}
                                                    onChange={(e) => handleNewCustomerChange('email', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 mb-1">GSTIN</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.gstin}
                                                    onChange={(e) => handleNewCustomerChange('gstin', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 mb-1">PAN</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.pan}
                                                    onChange={(e) => handleNewCustomerChange('pan', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 mb-1">Loyalty Card</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.loyaltyCard}
                                                    onChange={(e) => handleNewCustomerChange('loyaltyCard', e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-gray-600 mb-1">Address</label>
                                                <Input
                                                    className="h-8"
                                                    value={newCustomer.address}
                                                    onChange={(e) => handleNewCustomerChange('address', e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={newCustomer.isWholesale}
                                                        onChange={(e) => handleNewCustomerChange('isWholesale', e.target.checked)}
                                                    />
                                                    <span className="text-gray-600">Wholesale Customer</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                onClick={handleSaveNewCustomer}
                                                className="h-8 bg-blue-600 hover:bg-blue-700 text-xs"
                                            >
                                                Save Customer
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsAddingCustomer(false)}
                                                className="h-8 text-xs"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Main grid: left table, right tiles */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* Left table */}
                                <Card className="border-0 shadow-sm lg:col-span-8">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                                        <th className="px-3 py-2 text-left">#</th>
                                                        <th className="px-3 py-2 text-left">DESCRIPTION</th>
                                                        <th className="px-3 py-2 text-left">LOCATE</th>
                                                        <th className="px-3 py-2 text-left">OFFERS</th>
                                                        <th className="px-3 py-2 text-left">NET QTY</th>
                                                        <th className="px-3 py-2 text-right">PRICE</th>
                                                        <th className="px-3 py-2 text-right">DISC.</th>
                                                        <th className="px-3 py-2 text-right">TOTAL VALUE</th>
                                                        <th className="px-3 py-2 text-right"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                                                                No items in cart. Scan a product to get started.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        cart.map((item, index) => (
                                                            <tr key={item.id} className="border-t">
                                                                <td className="px-3 py-2">{index + 1}</td>
                                                                <td className="px-3 py-2">{item.productName}</td>
                                                                <td className="px-3 py-2">{item.sku}</td>
                                                                <td className="px-3 py-2">
                                                                    {item.size && (
                                                                        <div className="bg-yellow-200 text-yellow-900 text-[10px] px-1">
                                                                            {item.size}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2">{item.quantity}</td>
                                                                <td className="px-3 py-2 text-right">₹{item.unitPrice}</td>
                                                                <td className="px-3 py-2 text-right">₹{item.discount}</td>
                                                                <td className="px-3 py-2 text-right">₹{item.total}</td>
                                                                <td className="px-3 py-2 text-right">
                                                                    <div className="flex items-center gap-2 justify-end">
                                                                        <Button
                                                                            variant="outline"
                                                                            className="h-6 px-2"
                                                                            onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                                                                        >
                                                                            ✎
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="h-6 px-2"
                                                                            onClick={() => handleRemoveFromCart(item.id)}
                                                                        >
                                                                            🗑
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="px-3 py-2 text-[11px] text-gray-600 flex items-center gap-4">
                                            <div>TOTAL {cart.length}</div>
                                            <div className="ml-auto">₹{total.toFixed(2)}</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Right tiles area */}
                                <div className="lg:col-span-4 space-y-3">
                                    {/* Quick Products */}
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-2 text-xs">
                                            <div className="bg-yellow-200 text-gray-800 inline-block px-2 py-1 rounded border border-yellow-300">Quick Products</div>
                                        </CardContent>
                                    </Card>
                                    {/* Recent Items */}
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-700">Recent Items</h3>
                                                {recentItems.length > 12 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowRecentModal(true)}
                                                        className="text-xs px-2 py-1"
                                                    >
                                                        More ({recentItems.length})
                                                    </Button>
                                                )}
                                            </div>
                                            {displayRecentItems.length === 0 ? (
                                                <div className="text-center text-gray-500 text-xs py-4">
                                                    No recent items
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-4 gap-2">
                                                    {displayRecentItems.map((item) => {
                                                        const isInCart = isItemInCart(item.productId, item.size, item.color)
                                                        const cartItem = cart.find(cartItem =>
                                                            cartItem.productId === item.productId &&
                                                            cartItem.size === item.size &&
                                                            cartItem.color === item.color
                                                        )
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => handleRecentItemClick(item)}
                                                                className={`border rounded p-2 cursor-pointer transition-colors ${isInCart
                                                                    ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                                                    : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                                                    }`}
                                                            >
                                                                {/* Product Image */}
                                                                <div className="relative mb-2">
                                                                    {item.images && item.images.length > 0 ? (
                                                                        <div className="w-full h-16 rounded border overflow-hidden bg-gray-50">
                                                                            <img
                                                                                src={item.images[0]}
                                                                                alt={item.productName}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    const target = e.target as HTMLImageElement
                                                                                    target.style.display = 'none'
                                                                                    const parent = target.parentElement
                                                                                    if (parent) {
                                                                                        parent.innerHTML = '<div class="w-full h-full bg-gray-100 flex items-center justify-center"><span class="text-gray-400 text-xs">No Image</span></div>'
                                                                                    }
                                                                                    console.log(`❌ Image failed to load for ${item.productName}:`, item.images?.[0])
                                                                                }}
                                                                                onLoad={() => {
                                                                                    console.log(`✅ Image loaded for ${item.productName}:`, item.images?.[0])
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center">
                                                                            <span className="text-gray-400 text-xs">No Image</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center justify-between text-[10px] font-semibold">
                                                                    <span>₹{item.price}</span>
                                                                    {isInCart && (
                                                                        <span className="text-blue-600 text-xs">
                                                                            Qty: {cartItem?.quantity || 1}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-1 text-xs font-medium text-gray-700 truncate">
                                                                    {item.productName}
                                                                </div>
                                                                {item.size && (
                                                                    <div className="text-[10px] text-gray-500">
                                                                        Size: {item.size}
                                                                    </div>
                                                                )}
                                                                {item.color && (
                                                                    <div className="text-[10px] text-gray-500">
                                                                        Color: {item.color}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>


                                </div>
                            </div>

                            {/* Bottom payment summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
                                <div className="lg:col-span-7 grid grid-cols-7 gap-2">
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">Extra/Less</div>
                                        <Input
                                            className="h-7 text-right"
                                            value={extraLessInput}
                                            onChange={(e) => handleExtraLessChange(e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">Savings</div>
                                        <Input
                                            className="h-7 text-right"
                                            value={savingsInput}
                                            onChange={(e) => handleSavingsChange(e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">Invoice Total</div>
                                        <Input
                                            className="h-7 text-right font-semibold"
                                            value={invoiceTotal.toFixed(2)}
                                            readOnly
                                        />
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">Cash</div>
                                        <Input
                                            className="h-7 text-right"
                                            value={cashInput}
                                            onChange={(e) => handlePaymentChange('cashAmount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">Card</div>
                                        <Input
                                            className="h-7 text-right"
                                            value={cardInput}
                                            onChange={(e) => handlePaymentChange('cardAmount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">UPI</div>
                                        <Input
                                            className="h-7 text-right"
                                            value={upiInput}
                                            onChange={(e) => handlePaymentChange('upiAmount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                        <div className="text-[10px] text-gray-700">Change Given</div>
                                        <Input
                                            className="h-7 text-right"
                                            value={changeInput}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-3">
                                    <Button
                                        className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                        onClick={handleSaveInvoice}
                                        disabled={loading || cart.length === 0}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                        onClick={handleSaveAndPrint}
                                        disabled={loading || cart.length === 0}
                                    >
                                        Save & Print
                                    </Button>
                                    <Button
                                        className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                        onClick={handleGeneratePDF}
                                        disabled={cart.length === 0}
                                    >
                                        PDF
                                    </Button>
                                    <Button
                                        className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                        onClick={handleHoldInvoice}
                                        disabled={cart.length === 0}
                                    >
                                        Hold
                                    </Button>
                                    <Button
                                        className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4"
                                        onClick={handleViewAllHeld}
                                    >
                                        View({heldInvoices.length})
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Product Selection Modal */}
            {selectedProduct && (
                <ProductSelectionModal
                    product={selectedProduct}
                    isOpen={showProductModal}
                    onClose={handleProductModalClose}
                    onProductSelect={handleProductModalSelect}
                />
            )}

            {/* Recent Items Modal */}
            {showRecentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">All Recent Items</h3>
                            <button
                                onClick={() => setShowRecentModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Recent Items List */}
                        <div className="p-4">
                            {recentItems.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No recent items found
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {recentItems.map((item) => {
                                        const isInCart = isItemInCart(item.productId, item.size, item.color)
                                        const cartItem = cart.find(cartItem =>
                                            cartItem.productId === item.productId &&
                                            cartItem.size === item.size &&
                                            cartItem.color === item.color
                                        )
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleRecentItemClick(item)}
                                                className={`border rounded p-3 cursor-pointer transition-colors ${isInCart
                                                    ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                                    : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                                    }`}
                                            >
                                                {/* Product Image */}
                                                <div className="relative mb-3">
                                                    {item.images && item.images.length > 0 ? (
                                                        <div className="w-full h-32 rounded border overflow-hidden bg-gray-50">
                                                            <img
                                                                src={item.images[0]}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement
                                                                    target.style.display = 'none'
                                                                    const parent = target.parentElement
                                                                    if (parent) {
                                                                        parent.innerHTML = '<div class="w-full h-full bg-gray-100 flex items-center justify-center"><span class="text-gray-400 text-sm">No Image</span></div>'
                                                                    }
                                                                    console.log(`❌ Image failed to load for ${item.productName}:`, item.images?.[0])
                                                                }}
                                                                onLoad={() => {
                                                                    console.log(`✅ Image loaded for ${item.productName}:`, item.images?.[0])
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                                                            <span className="text-gray-400 text-sm">No Image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-900">₹{item.price}</span>
                                                    {isInCart && (
                                                        <span className="text-blue-600 text-sm">
                                                            Qty: {cartItem?.quantity || 1}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="font-medium text-gray-700 mb-1">
                                                    {item.productName}
                                                </div>
                                                <div className="text-sm text-gray-500 mb-1">
                                                    SKU: {item.sku}
                                                </div>
                                                {item.size && (
                                                    <div className="text-sm text-gray-500">
                                                        Size: {item.size}
                                                    </div>
                                                )}
                                                {item.color && (
                                                    <div className="text-sm text-gray-500">
                                                        Color: {item.color}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-2">
                                                    Added: {item.addedAt.toLocaleDateString()} {item.addedAt.toLocaleTimeString()}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowRecentModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Held Invoices Modal */}
            {showHeldInvoicesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Held Invoices ({heldInvoices.length})</h3>
                            <button
                                onClick={() => setShowHeldInvoicesModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Held Invoices List */}
                        <div className="p-4">
                            {heldInvoices.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No held invoices found
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {heldInvoices.map((invoice) => (
                                        <div key={invoice.id} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        Invoice: {invoice.invoiceNumber}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Customer: {invoice.customer?.name || 'No Customer'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Held: {new Date(invoice.heldAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        ₹{invoice.invoiceTotal.toFixed(2)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {invoice.cart.length} items
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Invoice Details */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Subtotal:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.subtotal.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Savings:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.savings.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Extra/Less:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.extraLess.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Tax:</span>
                                                    <span className="ml-2 font-medium">₹{invoice.tax.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Cart Items Preview */}
                                            <div className="mb-3">
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">Items:</h5>
                                                <div className="max-h-32 overflow-y-auto">
                                                    {invoice.cart.map((item, index) => (
                                                        <div key={item.id} className="flex justify-between text-xs py-1">
                                                            <span className="truncate flex-1">
                                                                {index + 1}. {item.productName}
                                                                {item.size && ` (${item.size})`}
                                                                {item.color && ` - ${item.color}`}
                                                            </span>
                                                            <span className="ml-2">
                                                                {item.quantity} × ₹{item.unitPrice} = ₹{item.total.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
                                                    onClick={() => handleLoadHeldInvoice(invoice.id)}
                                                >
                                                    Load Invoice
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="h-8 text-red-600 border-red-300 hover:bg-red-50 text-xs px-3"
                                                    onClick={() => handleRemoveHeldInvoice(invoice.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowHeldInvoicesModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Preview Modal */}
            {showInvoicePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
                            <button
                                onClick={() => setShowInvoicePreview(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Invoice Preview */}
                        <div className="p-4">
                            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg max-w-md mx-auto" id="invoice-print">
                                {/* Header */}
                                <div className="text-center p-4 border-b-2 border-gray-300">
                                    <div className="text-2xl font-bold text-gray-800 mb-1">FASHION STORE</div>
                                    <div className="text-sm text-gray-600 mb-1">Your Style, Your Way</div>
                                    <div className="text-xs text-gray-500">
                                        123 Fashion Street, Kolkata - 700001<br />
                                        Phone: +91 98765 43210 | GST: 19ABCDE1234F1Z5
                                    </div>
                                </div>

                                {/* Invoice Details */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">Invoice No:</div>
                                            <div className="text-sm text-gray-600">{currentInvoiceNumber}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-800">Date:</div>
                                            <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-sm font-semibold text-gray-800 mb-1">Customer Details:</div>
                                        <div className="text-sm text-gray-600">
                                            <div className="font-medium">{customer?.name}</div>
                                            <div>{customer?.phone}</div>
                                            <div>{customer?.address}</div>
                                            {customer?.gstin && <div>GST: {customer.gstin}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Items:</div>
                                    <div className="space-y-2">
                                        {cart.map((item, index) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.productName}</div>
                                                    <div className="text-xs text-gray-500">
                                                        SKU: {item.sku}
                                                        {item.size && ` | Size: ${item.size}`}
                                                        {item.color && ` | Color: ${item.color}`}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div>{item.quantity} × ₹{item.unitPrice}</div>
                                                    <div className="font-semibold">₹{item.total.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        {savings > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Savings:</span>
                                                <span>-₹{savings.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Tax (5% GST):</span>
                                            <span>₹{tax.toFixed(2)}</span>
                                        </div>
                                        {extraLess !== 0 && (
                                            <div className="flex justify-between">
                                                <span>Extra/Less:</span>
                                                <span className={extraLess > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {extraLess > 0 ? '+' : ''}₹{extraLess.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-bold border-t pt-1">
                                            <span>Total:</span>
                                            <span>₹{invoiceTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="text-sm font-semibold text-gray-800 mb-2">Payment Details:</div>
                                    <div className="space-y-1 text-sm">
                                        {paymentDetails.cashAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span>Cash:</span>
                                                <span>₹{paymentDetails.cashAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {paymentDetails.cardAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span>Card:</span>
                                                <span>₹{paymentDetails.cardAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {paymentDetails.upiAmount > 0 && (
                                            <div className="flex justify-between">
                                                <span>UPI:</span>
                                                <span>₹{paymentDetails.upiAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {paymentDetails.changeGiven > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Change:</span>
                                                <span>₹{paymentDetails.changeGiven.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 text-center">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Thank you for shopping with us!
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <div>Exchange/Return within 7 days with original receipt</div>
                                        <div>Keep this invoice for warranty purposes</div>
                                        <div className="mt-2">Visit us online: www.fashionstore.com</div>
                                    </div>
                                    <div className="mt-3 text-xs text-gray-400">
                                        Generated on {new Date().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowInvoicePreview(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={async () => {
                                    try {
                                        await handleSaveInvoice()
                                        // Print the invoice
                                        const printContent = document.getElementById('invoice-print')
                                        if (printContent) {
                                            const printWindow = window.open('', '_blank')
                                            if (printWindow) {
                                                printWindow.document.write(`
                                                    <html>
                                                        <head>
                                                            <title>Invoice - ${currentInvoiceNumber}</title>
                                                            <style>
                                                                body { 
                                                                    font-family: Arial, sans-serif; 
                                                                    margin: 0; 
                                                                    padding: 20px; 
                                                                    background: white;
                                                                }
                                                                @media print {
                                                                    body { margin: 0; }
                                                                    .no-print { display: none; }
                                                                }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            ${printContent.outerHTML}
                                                            <div class="no-print" style="margin-top: 20px; text-align: center;">
                                                                <button onclick="window.print()">Print Invoice</button>
                                                                <button onclick="window.close()">Close</button>
                                                            </div>
                                                        </body>
                                                    </html>
                                                `)
                                                printWindow.document.close()
                                            }
                                        }
                                        setShowInvoicePreview(false)
                                    } catch (error) {
                                        console.error('Error saving invoice:', error)
                                        toast.error('Failed to save invoice. Please try again.', {
                                            duration: 5000,
                                            style: {
                                                background: '#EF4444',
                                                color: '#fff',
                                            },
                                        })
                                    }
                                }}
                            >
                                Save & Print
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to remove this held invoice?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowConfirmModal(false)
                                        setInvoiceToDelete(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={confirmRemoveHeldInvoice}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10B981',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
        </PageGuard>
    )
}


