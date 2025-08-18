'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from '@retail/ui'
import { ActionGate } from '../../../components/RBAC'
import { sampleProducts } from '@retail/shared/src/data/sampleProducts'
import { Product, ProductSize, ProductColor } from '@retail/shared/src/types/product'
import toast, { Toaster } from 'react-hot-toast'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Scatter, ScatterChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const ITEMS_PER_PAGE = 10

export default function GarmentInventoryPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [brandFilter, setBrandFilter] = useState('')
    const [sizeFilter, setSizeFilter] = useState('')
    const [lowStockOnly, setLowStockOnly] = useState(false)
    const [expiringDays, setExpiringDays] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [stockRange, setStockRange] = useState({ min: '', max: '' })
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        mrp: 0,
        costPrice: 0,
        minStock: 0,
        maxStock: 0,
        isActive: true,
        sizes: [] as ProductSize[],
        colors: [] as ProductColor[],
        images: [] as string[]
    })
    const [newSize, setNewSize] = useState({ name: '', stock: 0, price: 0 })
    const [newColor, setNewColor] = useState({ name: '', code: '#000000', stock: 0, price: 0 })
    const [newImage, setNewImage] = useState('')
    const [selectedSizeForImage, setSelectedSizeForImage] = useState('')
    const [selectedColorForImage, setSelectedColorForImage] = useState('')
    const [showImageEditor, setShowImageEditor] = useState(false)
    const [editingImage, setEditingImage] = useState<{ url: string; index: number } | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
    const [analyticsData, setAnalyticsData] = useState<any>(null)
    const [analyticsLoading, setAnalyticsLoading] = useState(false)
    const [selectedProductForAnalytics, setSelectedProductForAnalytics] = useState<Product | null>(null)

    // Add Product Modal State
    const [showAddProductModal, setShowAddProductModal] = useState(false)
    const [addProductForm, setAddProductForm] = useState({
        name: '',
        description: '',
        category: '',
        brand: '',
        sku: '',
        barcode: '',
        price: 0,
        mrp: 0,
        costPrice: 0,
        minStock: 0,
        maxStock: 0,
        isActive: true,
        sizes: [] as ProductSize[],
        colors: [] as ProductColor[],
        images: [] as string[]
    })
    const [newSizeForAdd, setNewSizeForAdd] = useState({ name: '', stock: 0, price: 0 })
    const [newColorForAdd, setNewColorForAdd] = useState({ name: '', code: '#000000', stock: 0, price: 0 })
    const [newImageForAdd, setNewImageForAdd] = useState('')
    const [selectedSizeForAddImage, setSelectedSizeForAddImage] = useState('')
    const [selectedColorForAddImage, setSelectedColorForAddImage] = useState('')
    const [currentStep, setCurrentStep] = useState(1)
    const [addProductLoading, setAddProductLoading] = useState(false)

    // Add Product Image Enhancement State
    const [imageFileForAdd, setImageFileForAdd] = useState<File | null>(null)
    const [imagePreviewForAdd, setImagePreviewForAdd] = useState<string>('')
    const [showImageEditorForAdd, setShowImageEditorForAdd] = useState(false)
    const [editingImageForAdd, setEditingImageForAdd] = useState<{ url: string; index: number } | null>(null)
    const [showPreviewModal, setShowPreviewModal] = useState(false)

    // Size and Color Images State
    const [showSizeImageModal, setShowSizeImageModal] = useState(false)
    const [showColorImageModal, setShowColorImageModal] = useState(false)
    const [selectedSizeForImageModal, setSelectedSizeForImageModal] = useState<ProductSize | null>(null)
    const [selectedColorForImageModal, setSelectedColorForImageModal] = useState<ProductColor | null>(null)
    const [newSizeImage, setNewSizeImage] = useState({ imageUrl: '', description: '', isMain: false })
    const [newColorImage, setNewColorImage] = useState({ imageUrl: '', description: '', isMain: false })
    const [editingSizeImage, setEditingSizeImage] = useState<{ id: string; imageUrl: string; description: string; isMain: boolean } | null>(null)
    const [editingColorImage, setEditingColorImage] = useState<{ id: string; imageUrl: string; description: string; isMain: boolean } | null>(null)

    // Products state - initialize with sample products
    const [products, setProducts] = useState<Product[]>(sampleProducts)

    // Loading state for the main inventory page
    const [isLoading, setIsLoading] = useState(true)

    // Simulate loading on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500) // Simulate 1.5 seconds loading time

        return () => clearTimeout(timer)
    }, [])

    // Get unique categories and brands for filters
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))]
        return uniqueCategories.sort()
    }, [products])

    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))]
        return uniqueBrands.sort()
    }, [products])

    // Generate search suggestions
    useEffect(() => {
        if (searchTerm.length > 1) {
            const suggestions = [
                ...products.map(p => p.name),
                ...products.map(p => p.sku),
                ...products.map(p => p.brand).filter((brand): brand is string => Boolean(brand)),
                ...products.map(p => p.category)
            ].filter((item): item is string =>
                Boolean(item) && item.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 5)
            setSearchSuggestions([...new Set(suggestions)])
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }, [searchTerm, products])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = !searchTerm ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.barcode && product.barcode.includes(searchTerm))

            const matchesCategory = !categoryFilter || product.category === categoryFilter
            const matchesBrand = !brandFilter || product.brand === brandFilter
            const matchesSize = !sizeFilter || product.sizes.some(s => s.name.includes(sizeFilter))
            const matchesLowStock = !lowStockOnly || product.stock <= product.minStock
            const matchesPriceRange = (!priceRange.min || product.price >= Number(priceRange.min)) &&
                (!priceRange.max || product.price <= Number(priceRange.max))
            const matchesStockRange = (!stockRange.min || product.stock >= Number(stockRange.min)) &&
                (!stockRange.max || product.stock <= Number(stockRange.max))

            return matchesSearch && matchesCategory && matchesBrand && matchesSize &&
                matchesLowStock && matchesPriceRange && matchesStockRange
        })

        // Sort products
        filtered.sort((a, b) => {
            let aValue: any, bValue: any

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
                    break
                case 'price':
                    aValue = a.price
                    bValue = b.price
                    break
                case 'stock':
                    aValue = a.stock
                    bValue = b.stock
                    break
                case 'category':
                    aValue = a.category.toLowerCase()
                    bValue = b.category.toLowerCase()
                    break
                case 'brand':
                    aValue = (a.brand || '').toLowerCase()
                    bValue = (b.brand || '').toLowerCase()
                    break
                default:
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    }, [searchTerm, categoryFilter, brandFilter, sizeFilter, lowStockOnly,
        priceRange, stockRange, sortBy, sortOrder])

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, categoryFilter, brandFilter, sizeFilter, lowStockOnly, priceRange, stockRange])

    // Calculate GST percentage
    const getGSTPercentage = (product: Product) => {
        const priceDiff = product.mrp - product.costPrice
        return Math.round((priceDiff / product.costPrice) * 100)
    }

    // Get stock status
    const getStockStatus = (product: Product) => {
        if (product.stock <= 0) return { text: `${Math.abs(product.stock)} PCS`, className: 'text-red-600 font-semibold' }
        if (product.stock <= product.minStock) return { text: `${product.stock} PCS`, className: 'text-orange-600 font-semibold' }
        return { text: `${product.stock} PCS`, className: 'text-green-600' }
    }

    // Get ageing
    const getAgeing = (product: Product) => {
        const createdDate = new Date(product.createdAt)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - createdDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
    }

    // Toggle row expansion
    const toggleRowExpansion = (productId: string) => {
        const newExpandedRows = new Set(expandedRows)
        if (newExpandedRows.has(productId)) {
            newExpandedRows.delete(productId)
        } else {
            newExpandedRows.add(productId)
        }
        setExpandedRows(newExpandedRows)
    }

    // Handle edit product
    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product)
        setEditForm({
            name: product.name,
            description: product.description,
            category: product.category,
            brand: product.brand || '',
            price: product.price,
            mrp: product.mrp,
            costPrice: product.costPrice,
            minStock: product.minStock,
            maxStock: product.maxStock,
            isActive: product.isActive,
            sizes: [...product.sizes],
            colors: [...product.colors],
            images: [...product.images]
        })
        setShowEditModal(true)
    }

    // Handle save edit
    const handleSaveEdit = () => {
        if (selectedProduct) {
            // Update the product in the products state
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            ...editForm,
                            sizeImages: p.sizeImages || [],
                            colorImages: p.colorImages || [],
                            updatedAt: new Date().toISOString()
                        }
                        : p
                )
            )
            setShowEditModal(false)
            setSelectedProduct(null)
            toast.success(`Product "${editForm.name}" updated successfully!`, {
                duration: 4000,
                position: 'top-right',
            })
        }
    }

    // Handle delete product
    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product)
        setShowDeleteModal(true)
    }

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (selectedProduct) {
            // Remove the product from the products state
            setProducts(prevProducts => prevProducts.filter(p => p.id !== selectedProduct.id))
            setShowDeleteModal(false)
            setSelectedProduct(null)
            toast.success(`Product "${selectedProduct.name}" deleted successfully!`, {
                duration: 4000,
                position: 'top-right',
            })
        }
    }

    // Handle toggle active status
    const handleToggleActive = (product: Product) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === product.id
                    ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() }
                    : p
            )
        )
        toast.success(`Product "${product.name}" ${!product.isActive ? 'activated' : 'deactivated'} successfully!`, {
            duration: 3000,
            position: 'top-right',
        })
    }

    // Handle add new size
    const handleAddSize = () => {
        if (newSize.name && newSize.stock >= 0) {
            const sizeId = `size_${Date.now()}`
            const newSizeObj: ProductSize = {
                id: sizeId,
                name: newSize.name,
                stock: newSize.stock,
                price: newSize.price || editForm.price
            }
            setEditForm(prev => ({
                ...prev,
                sizes: [...prev.sizes, newSizeObj]
            }))
            setNewSize({ name: '', stock: 0, price: 0 })
            toast.success(`Size "${newSizeObj.name}" added successfully!`, {
                duration: 3000,
                position: 'top-right',
            })
        } else {
            toast.error('Please enter a valid size name and stock quantity', {
                duration: 4000,
                position: 'top-right',
            })
        }
    }

    // Handle remove size
    const handleRemoveSize = (sizeId: string) => {
        const sizeToRemove = editForm.sizes.find(size => size.id === sizeId)
        setEditForm(prev => ({
            ...prev,
            sizes: prev.sizes.filter(size => size.id !== sizeId)
        }))
        if (sizeToRemove) {
            toast.success(`Size "${sizeToRemove.name}" removed successfully!`, {
                duration: 3000,
                position: 'top-right',
            })
        }
    }

    // Handle add new color
    const handleAddColor = () => {
        if (newColor.name && newColor.stock >= 0) {
            const colorId = `color_${Date.now()}`
            const newColorObj: ProductColor = {
                id: colorId,
                name: newColor.name,
                code: newColor.code,
                stock: newColor.stock,
                price: newColor.price || editForm.price
            }
            setEditForm(prev => ({
                ...prev,
                colors: [...prev.colors, newColorObj]
            }))
            setNewColor({ name: '', code: '#000000', stock: 0, price: 0 })
            toast.success(`Color "${newColorObj.name}" added successfully!`, {
                duration: 3000,
                position: 'top-right',
            })
        } else {
            toast.error('Please enter a valid color name and stock quantity', {
                duration: 4000,
                position: 'top-right',
            })
        }
    }

    // Handle remove color
    const handleRemoveColor = (colorId: string) => {
        const colorToRemove = editForm.colors.find(color => color.id === colorId)
        setEditForm(prev => ({
            ...prev,
            colors: prev.colors.filter(color => color.id !== colorId)
        }))
        if (colorToRemove) {
            toast.success(`Color "${colorToRemove.name}" removed successfully!`, {
                duration: 3000,
                position: 'top-right',
            })
        }
    }

    // Add Product Handlers
    const handleAddSizeForAdd = () => {
        if (newSizeForAdd.name && newSizeForAdd.stock >= 0) {
            const size: ProductSize = {
                id: Date.now().toString(),
                name: newSizeForAdd.name,
                stock: newSizeForAdd.stock,
                price: newSizeForAdd.price || addProductForm.price
            }
            setAddProductForm(prev => ({
                ...prev,
                sizes: [...prev.sizes, size]
            }))
            setNewSizeForAdd({ name: '', stock: 0, price: 0 })
            toast.success(`Size "${size.name}" added successfully!`)
        }
    }

    const handleRemoveSizeForAdd = (sizeId: string) => {
        setAddProductForm(prev => ({
            ...prev,
            sizes: prev.sizes.filter(size => size.id !== sizeId)
        }))
    }

    const handleAddColorForAdd = () => {
        if (newColorForAdd.name && newColorForAdd.stock >= 0) {
            const color: ProductColor = {
                id: Date.now().toString(),
                name: newColorForAdd.name,
                code: newColorForAdd.code,
                stock: newColorForAdd.stock,
                price: newColorForAdd.price || addProductForm.price
            }
            setAddProductForm(prev => ({
                ...prev,
                colors: [...prev.colors, color]
            }))
            setNewColorForAdd({ name: '', code: '#000000', stock: 0, price: 0 })
            toast.success(`Color "${color.name}" added successfully!`)
        }
    }

    const handleRemoveColorForAdd = (colorId: string) => {
        setAddProductForm(prev => ({
            ...prev,
            colors: prev.colors.filter(color => color.id !== colorId)
        }))
    }

    const handleAddImageForAdd = () => {
        if (newImageForAdd.trim()) {
            setAddProductForm(prev => ({
                ...prev,
                images: [...prev.images, newImageForAdd]
            }))
            setNewImageForAdd('')
            toast.success('Image added successfully!')
        }
    }

    const handleRemoveImageForAdd = (index: number) => {
        setAddProductForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSaveAddProduct = async () => {
        if (!addProductForm.name || !addProductForm.category) {
            toast.error('Please fill in all required fields')
            return
        }

        setAddProductLoading(true)

        // Simulate API call
        setTimeout(() => {
            const newProduct: Product = {
                id: (products.length + 1).toString(),
                name: addProductForm.name,
                description: addProductForm.description,
                category: addProductForm.category,
                brand: addProductForm.brand,
                sku: addProductForm.sku || `SKU-${Date.now()}`,
                barcode: addProductForm.barcode,
                price: addProductForm.price,
                mrp: addProductForm.mrp,
                costPrice: addProductForm.costPrice,
                minStock: addProductForm.minStock,
                maxStock: addProductForm.maxStock,
                stock: addProductForm.sizes.reduce((total, size) => total + size.stock, 0) +
                    addProductForm.colors.reduce((total, color) => total + color.stock, 0),
                unit: 'PCS',
                isActive: addProductForm.isActive,
                sizes: addProductForm.sizes,
                colors: addProductForm.colors,
                images: addProductForm.images,
                sizeImages: [],
                colorImages: [],
                tags: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            // Add the new product to the products list
            setProducts(prevProducts => [...prevProducts, newProduct])

            toast.success('Product added successfully!')
            setShowAddProductModal(false)
            resetAddProductForm()
            setAddProductLoading(false)
        }, 1000)
    }

    const resetAddProductForm = () => {
        setAddProductForm({
            name: '',
            description: '',
            category: '',
            brand: '',
            sku: '',
            barcode: '',
            price: 0,
            mrp: 0,
            costPrice: 0,
            minStock: 0,
            maxStock: 0,
            isActive: true,
            sizes: [],
            colors: [],
            images: []
        })
        setNewSizeForAdd({ name: '', stock: 0, price: 0 })
        setNewColorForAdd({ name: '', code: '#000000', stock: 0, price: 0 })
        setNewImageForAdd('')
        setCurrentStep(1)

        // Reset image enhancement state
        setImageFileForAdd(null)
        setImagePreviewForAdd('')
        setShowImageEditorForAdd(false)
        setEditingImageForAdd(null)
        setShowPreviewModal(false)
    }

    // Generate barcode function
    const generateBarcode = () => {
        // Generate a unique 13-digit barcode (EAN-13 format)
        const timestamp = Date.now().toString()
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        const barcode = `890${timestamp.slice(-8)}${random}`

        // Ensure it's exactly 13 digits
        const paddedBarcode = barcode.padEnd(13, '0').slice(0, 13)

        setAddProductForm(prev => ({ ...prev, barcode: paddedBarcode }))
        toast.success('Barcode generated successfully!', {
            duration: 3000,
            position: 'top-right',
        })
    }

    // Enhanced Add Product Image Functions
    const handleFileUploadForAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file', {
                    duration: 4000,
                    position: 'top-right',
                })
                return
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB', {
                    duration: 4000,
                    position: 'top-right',
                })
                return
            }

            setImageFileForAdd(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                setImagePreviewForAdd(result)

                // Check image dimensions
                const img = new Image()
                img.onload = () => {
                    const { width, height } = img

                    // Optimal dimensions for product images
                    const minWidth = 400
                    const minHeight = 400
                    const maxWidth = 1200
                    const maxHeight = 1200
                    const aspectRatio = width / height

                    if (width < minWidth || height < minHeight) {
                        toast.error(`Image is too small. Minimum dimensions: ${minWidth}x${minHeight}px. Current: ${width}x${height}px`, {
                            duration: 5000,
                            position: 'top-right',
                        })
                        setShowImageEditorForAdd(true)
                        setEditingImageForAdd({ url: result, index: -1 })
                    } else if (width > maxWidth || height > maxHeight) {
                        toast.error(`Image is too large. Maximum dimensions: ${maxWidth}x${maxHeight}px. Current: ${width}x${height}px`, {
                            duration: 5000,
                            position: 'top-right',
                        })
                        setShowImageEditorForAdd(true)
                        setEditingImageForAdd({ url: result, index: -1 })
                    } else if (aspectRatio < 0.8 || aspectRatio > 1.2) {
                        toast.error(`Image aspect ratio should be close to 1:1 (square). Current ratio: ${aspectRatio.toFixed(2)}`, {
                            duration: 5000,
                            position: 'top-right',
                        })
                        setShowImageEditorForAdd(true)
                        setEditingImageForAdd({ url: result, index: -1 })
                    } else {
                        // Image is optimal, add directly
                        setAddProductForm(prev => ({
                            ...prev,
                            images: [...prev.images, result]
                        }))
                        setImageFileForAdd(null)
                        setImagePreviewForAdd('')
                        toast.success('Image added successfully!', {
                            duration: 3000,
                            position: 'top-right',
                        })
                    }
                }
                img.src = result
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditImageForAdd = (imageUrl: string, index: number) => {
        setEditingImageForAdd({ url: imageUrl, index })
        setImagePreviewForAdd(imageUrl)
        setShowImageEditorForAdd(true)
    }

    const handleSaveEditedImageForAdd = (editedImageUrl: string) => {
        if (editingImageForAdd) {
            if (editingImageForAdd.index >= 0) {
                // Update existing image
                setAddProductForm(prev => ({
                    ...prev,
                    images: prev.images.map((img, idx) =>
                        idx === editingImageForAdd.index ? editedImageUrl : img
                    )
                }))
                toast.success('Image edited and saved successfully!', {
                    duration: 3000,
                    position: 'top-right',
                })
            } else {
                // Add new image
                setAddProductForm(prev => ({
                    ...prev,
                    images: [...prev.images, editedImageUrl]
                }))
                toast.success('Image processed and added successfully!', {
                    duration: 3000,
                    position: 'top-right',
                })
            }
        }
        setShowImageEditorForAdd(false)
        setEditingImageForAdd(null)
        setImagePreviewForAdd('')
        setImageFileForAdd(null)
    }

    const handleShowPreview = () => {
        if (!addProductForm.name || !addProductForm.category) {
            toast.error('Please fill in all required fields')
            return
        }
        setShowPreviewModal(true)
    }

    const handleConfirmSave = () => {
        setShowPreviewModal(false)
        handleSaveAddProduct()
    }

    // Handle add image
    const handleAddImage = () => {
        if (newImage.trim()) {
            setEditForm(prev => ({
                ...prev,
                images: [...prev.images, newImage.trim()]
            }))
            setNewImage('')
            toast.success('Image URL added successfully!', {
                duration: 3000,
                position: 'top-right',
            })
        } else {
            toast.error('Please enter a valid image URL', {
                duration: 4000,
                position: 'top-right',
            })
        }
    }

    // Handle remove image
    const handleRemoveImage = (imageIndex: number) => {
        setEditForm(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== imageIndex)
        }))
        toast.success('Image removed successfully!', {
            duration: 3000,
            position: 'top-right',
        })
    }

    // Handle link image to size/color
    const handleLinkImage = () => {
        if (newImage.trim() && (selectedSizeForImage || selectedColorForImage)) {
            const linkedImage = {
                url: newImage.trim(),
                size: selectedSizeForImage,
                color: selectedColorForImage
            }
            // This would be stored in a more complex data structure
            // For now, we'll just add it to images
            setEditForm(prev => ({
                ...prev,
                images: [...prev.images, newImage.trim()]
            }))
            setNewImage('')
            setSelectedSizeForImage('')
            setSelectedColorForImage('')
        }
    }

    // Size Image Management Functions
    const handleOpenSizeImageModal = (size: ProductSize) => {
        setSelectedSizeForImageModal(size)
        setShowSizeImageModal(true)
        setNewSizeImage({ imageUrl: '', description: '', isMain: false })
    }

    const handleAddSizeImage = () => {
        if (!newSizeImage.imageUrl.trim()) {
            toast.error('Please enter an image URL', {
                duration: 4000,
                position: 'top-right',
            })
            return
        }

        if (selectedProduct && selectedSizeForImageModal) {
            const newSizeImageObj = {
                id: `size-img-${Date.now()}`,
                imageUrl: newSizeImage.imageUrl.trim(),
                sizeId: selectedSizeForImageModal.id,
                sizeName: selectedSizeForImageModal.name,
                description: newSizeImage.description,
                isMain: newSizeImage.isMain
            }

            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            sizeImages: [...(p.sizeImages || []), newSizeImageObj]
                        }
                        : p
                )
            )

            setNewSizeImage({ imageUrl: '', description: '', isMain: false })
            toast.success(`Image added for size ${selectedSizeForImageModal.name}!`, {
                duration: 3000,
                position: 'top-right',
            })
        }
    }

    const handleRemoveSizeImage = (imageId: string) => {
        if (selectedProduct) {
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            sizeImages: (p.sizeImages || []).filter(img => img.id !== imageId)
                        }
                        : p
                )
            )
            toast.success('Size image removed successfully!', {
                duration: 3000,
                position: 'top-right',
            })
        }
    }

    const handleEditSizeImage = (image: any) => {
        setEditingSizeImage(image)
        setNewSizeImage({
            imageUrl: image.imageUrl,
            description: image.description || '',
            isMain: image.isMain
        })
    }

    const handleSaveSizeImageEdit = () => {
        if (!editingSizeImage || !selectedProduct) return

        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === selectedProduct.id
                    ? {
                        ...p,
                        sizeImages: (p.sizeImages || []).map(img =>
                            img.id === editingSizeImage.id
                                ? {
                                    ...img,
                                    imageUrl: newSizeImage.imageUrl,
                                    description: newSizeImage.description,
                                    isMain: newSizeImage.isMain
                                }
                                : img
                        )
                    }
                    : p
            )
        )

        setEditingSizeImage(null)
        setNewSizeImage({ imageUrl: '', description: '', isMain: false })
        toast.success('Size image updated successfully!', {
            duration: 3000,
            position: 'top-right',
        })
    }

    // Color Image Management Functions
    const handleOpenColorImageModal = (color: ProductColor) => {
        setSelectedColorForImageModal(color)
        setShowColorImageModal(true)
        setNewColorImage({ imageUrl: '', description: '', isMain: false })
    }

    const handleAddColorImage = () => {
        if (!newColorImage.imageUrl.trim()) {
            toast.error('Please enter an image URL', {
                duration: 4000,
                position: 'top-right',
            })
            return
        }

        if (selectedProduct && selectedColorForImageModal) {
            const newColorImageObj = {
                id: `color-img-${Date.now()}`,
                imageUrl: newColorImage.imageUrl.trim(),
                colorId: selectedColorForImageModal.id,
                colorName: selectedColorForImageModal.name,
                colorCode: selectedColorForImageModal.code,
                description: newColorImage.description,
                isMain: newColorImage.isMain
            }

            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            colorImages: [...(p.colorImages || []), newColorImageObj]
                        }
                        : p
                )
            )

            setNewColorImage({ imageUrl: '', description: '', isMain: false })
            toast.success(`Image added for color ${selectedColorForImageModal.name}!`, {
                duration: 3000,
                position: 'top-right',
            })
        }
    }

    const handleRemoveColorImage = (imageId: string) => {
        if (selectedProduct) {
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            colorImages: (p.colorImages || []).filter(img => img.id !== imageId)
                        }
                        : p
                )
            )
            toast.success('Color image removed successfully!', {
                duration: 3000,
                position: 'top-right',
            })
        }
    }

    const handleEditColorImage = (image: any) => {
        setEditingColorImage(image)
        setNewColorImage({
            imageUrl: image.imageUrl,
            description: image.description || '',
            isMain: image.isMain
        })
    }

    const handleSaveColorImageEdit = () => {
        if (!editingColorImage || !selectedProduct) return

        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === selectedProduct.id
                    ? {
                        ...p,
                        colorImages: (p.colorImages || []).map(img =>
                            img.id === editingColorImage.id
                                ? {
                                    ...img,
                                    imageUrl: newColorImage.imageUrl,
                                    description: newColorImage.description,
                                    isMain: newColorImage.isMain
                                }
                                : img
                        )
                    }
                    : p
            )
        )

        setEditingColorImage(null)
        setNewColorImage({ imageUrl: '', description: '', isMain: false })
        toast.success('Color image updated successfully!', {
            duration: 3000,
            position: 'top-right',
        })
    }

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file', {
                    duration: 4000,
                    position: 'top-right',
                })
                return
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB', {
                    duration: 4000,
                    position: 'top-right',
                })
                return
            }

            setImageFile(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                setImagePreview(result)

                // Check image dimensions
                const img = new Image()
                img.onload = () => {
                    const { width, height } = img

                    // Optimal dimensions for product images
                    const minWidth = 400
                    const minHeight = 400
                    const maxWidth = 1200
                    const maxHeight = 1200
                    const aspectRatio = width / height

                    if (width < minWidth || height < minHeight) {
                        toast.error(`Image is too small. Minimum dimensions: ${minWidth}x${minHeight}px. Current: ${width}x${height}px`, {
                            duration: 5000,
                            position: 'top-right',
                        })
                        setShowImageEditor(true)
                        setEditingImage({ url: result, index: -1 })
                    } else if (width > maxWidth || height > maxHeight) {
                        toast.error(`Image is too large. Maximum dimensions: ${maxWidth}x${maxHeight}px. Current: ${width}x${height}px`, {
                            duration: 5000,
                            position: 'top-right',
                        })
                        setShowImageEditor(true)
                        setEditingImage({ url: result, index: -1 })
                    } else if (aspectRatio < 0.8 || aspectRatio > 1.2) {
                        toast.error(`Image aspect ratio should be close to 1:1 (square). Current ratio: ${aspectRatio.toFixed(2)}`, {
                            duration: 5000,
                            position: 'top-right',
                        })
                        setShowImageEditor(true)
                        setEditingImage({ url: result, index: -1 })
                    } else {
                        // Image is optimal, add directly
                        setEditForm(prev => ({
                            ...prev,
                            images: [...prev.images, result]
                        }))
                        setImageFile(null)
                        setImagePreview('')
                        toast.success('Image added successfully!', {
                            duration: 3000,
                            position: 'top-right',
                        })
                    }
                }
                img.src = result
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle image edit
    const handleEditImage = (imageUrl: string, index: number) => {
        setEditingImage({ url: imageUrl, index })
        setImagePreview(imageUrl)
        setShowImageEditor(true)
    }

    // Handle save edited image
    const handleSaveEditedImage = (editedImageUrl: string) => {
        if (editingImage) {
            if (editingImage.index >= 0) {
                // Update existing image
                setEditForm(prev => ({
                    ...prev,
                    images: prev.images.map((img, idx) =>
                        idx === editingImage.index ? editedImageUrl : img
                    )
                }))
                toast.success('Image edited and saved successfully!', {
                    duration: 3000,
                    position: 'top-right',
                })
            } else {
                // Add new image
                setEditForm(prev => ({
                    ...prev,
                    images: [...prev.images, editedImageUrl]
                }))
                toast.success('Image processed and added successfully!', {
                    duration: 3000,
                    position: 'top-right',
                })
            }
        }
        setShowImageEditor(false)
        setEditingImage(null)
        setImagePreview('')
        setImageFile(null)
    }

    // Analytics service function
    const fetchProductAnalytics = async (productId: string, dateRange: string) => {
        try {
            setAnalyticsLoading(true)

            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Sample analytics data - this would come from your backend
            const sampleAnalyticsData = {
                productId,
                dateRange,
                overview: {
                    totalSales: 15420,
                    totalRevenue: 1250000,
                    totalUnits: 1250,
                    averageOrderValue: 1000,
                    profitMargin: 0.35,
                    stockTurnover: 4.2
                },
                salesTrends: {
                    daily: [
                        { date: '2024-01-01', sales: 45, revenue: 45000, units: 45 },
                        { date: '2024-01-02', sales: 52, revenue: 52000, units: 52 },
                        { date: '2024-01-03', sales: 38, revenue: 38000, units: 38 },
                        { date: '2024-01-04', sales: 61, revenue: 61000, units: 61 },
                        { date: '2024-01-05', sales: 48, revenue: 48000, units: 48 },
                        { date: '2024-01-06', sales: 55, revenue: 55000, units: 55 },
                        { date: '2024-01-07', sales: 42, revenue: 42000, units: 42 }
                    ],
                    weekly: [
                        { week: 'Week 1', sales: 320, revenue: 320000, units: 320 },
                        { week: 'Week 2', sales: 285, revenue: 285000, units: 285 },
                        { week: 'Week 3', sales: 310, revenue: 310000, units: 310 },
                        { week: 'Week 4', sales: 295, revenue: 295000, units: 295 }
                    ],
                    monthly: [
                        { month: 'Jan', sales: 1250, revenue: 1250000, units: 1250 },
                        { month: 'Feb', sales: 1180, revenue: 1180000, units: 1180 },
                        { month: 'Mar', sales: 1320, revenue: 1320000, units: 1320 }
                    ]
                },
                sizeAnalytics: [
                    { size: 'S', sales: 280, revenue: 280000, stock: 45, turnover: 6.2 },
                    { size: 'M', sales: 420, revenue: 420000, stock: 65, turnover: 6.5 },
                    { size: 'L', sales: 380, revenue: 380000, stock: 55, turnover: 6.9 },
                    { size: 'XL', sales: 220, revenue: 220000, stock: 35, turnover: 6.3 },
                    { size: 'XXL', sales: 150, revenue: 150000, stock: 25, turnover: 6.0 }
                ],
                colorAnalytics: [
                    { color: 'Black', sales: 320, revenue: 320000, stock: 50, turnover: 6.4 },
                    { color: 'White', sales: 280, revenue: 280000, stock: 45, turnover: 6.2 },
                    { color: 'Blue', sales: 250, revenue: 250000, stock: 40, turnover: 6.3 },
                    { color: 'Red', sales: 200, revenue: 200000, stock: 35, turnover: 5.7 },
                    { color: 'Green', sales: 180, revenue: 180000, stock: 30, turnover: 6.0 }
                ],
                customerAnalytics: {
                    topCustomers: [
                        { customerId: 'CUST001', name: 'John Doe', orders: 15, totalSpent: 15000, lastOrder: '2024-01-05' },
                        { customerId: 'CUST002', name: 'Jane Smith', orders: 12, totalSpent: 12000, lastOrder: '2024-01-06' },
                        { customerId: 'CUST003', name: 'Mike Johnson', orders: 10, totalSpent: 10000, lastOrder: '2024-01-04' },
                        { customerId: 'CUST004', name: 'Sarah Wilson', orders: 8, totalSpent: 8000, lastOrder: '2024-01-03' },
                        { customerId: 'CUST005', name: 'David Brown', orders: 6, totalSpent: 6000, lastOrder: '2024-01-02' }
                    ],
                    customerSegments: [
                        { segment: 'High Value', count: 25, totalRevenue: 500000, avgOrderValue: 20000 },
                        { segment: 'Medium Value', count: 45, totalRevenue: 450000, avgOrderValue: 10000 },
                        { segment: 'Low Value', count: 80, totalRevenue: 300000, avgOrderValue: 3750 }
                    ]
                },
                inventoryAnalytics: {
                    stockLevels: {
                        current: 260,
                        minimum: 100,
                        maximum: 500,
                        reorderPoint: 150,
                        daysOfStock: 45
                    },
                    stockMovements: [
                        { date: '2024-01-01', type: 'IN', quantity: 50, reason: 'Purchase Order' },
                        { date: '2024-01-03', type: 'OUT', quantity: 25, reason: 'Sales' },
                        { date: '2024-01-05', type: 'IN', quantity: 30, reason: 'Purchase Order' },
                        { date: '2024-01-07', type: 'OUT', quantity: 20, reason: 'Sales' }
                    ],
                    stockAlerts: [
                        { type: 'Low Stock', size: 'XXL', current: 5, threshold: 10 },
                        { type: 'Overstock', size: 'S', current: 80, threshold: 60 }
                    ]
                },
                performanceMetrics: {
                    conversionRate: 0.15,
                    averageSessionDuration: 180,
                    bounceRate: 0.25,
                    returnRate: 0.08,
                    customerSatisfaction: 4.2
                },
                geographicAnalytics: {
                    topRegions: [
                        { region: 'North India', sales: 450, revenue: 450000, percentage: 35 },
                        { region: 'South India', sales: 380, revenue: 380000, percentage: 30 },
                        { region: 'East India', sales: 290, revenue: 290000, percentage: 22 },
                        { region: 'West India', sales: 200, revenue: 200000, percentage: 13 }
                    ]
                },
                seasonalityAnalysis: {
                    monthlyTrends: [
                        { month: 'Jan', sales: 1250, trend: 'peak' },
                        { month: 'Feb', sales: 1180, trend: 'decline' },
                        { month: 'Mar', sales: 1320, trend: 'growth' },
                        { month: 'Apr', sales: 1100, trend: 'stable' },
                        { month: 'May', sales: 980, trend: 'decline' },
                        { month: 'Jun', sales: 850, trend: 'low' }
                    ]
                }
            }

            setAnalyticsData(sampleAnalyticsData)
            toast.success('Analytics data loaded successfully!', {
                duration: 3000,
                position: 'top-right',
            })
        } catch (error) {
            toast.error('Failed to load analytics data. Please try again.', {
                duration: 4000,
                position: 'top-right',
            })
        } finally {
            setAnalyticsLoading(false)
        }
    }

    // Handle view analytics
    const handleViewAnalytics = (product: Product) => {
        setSelectedProductForAnalytics(product)
        setShowAnalyticsModal(true)
        fetchProductAnalytics(product.id, '30d') // Default to 30 days
    }

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('')
        setCategoryFilter('')
        setBrandFilter('')
        setSizeFilter('')
        setLowStockOnly(false)
        setExpiringDays(0)
        setPriceRange({ min: '', max: '' })
        setStockRange({ min: '', max: '' })
        setSortBy('name')
        setSortOrder('asc')
    }

    // Get active filters count
    const activeFiltersCount = [
        searchTerm,
        categoryFilter,
        brandFilter,
        sizeFilter,
        lowStockOnly,
        expiringDays,
        priceRange.min,
        priceRange.max,
        stockRange.min,
        stockRange.max
    ].filter(Boolean).length

    // Analytics Modal Component
    const AnalyticsModal = ({
        product,
        data,
        loading,
        onClose,
        onDateRangeChange
    }: {
        product: Product
        data: any
        loading: boolean
        onClose: () => void
        onDateRangeChange: (range: string) => void
    }) => {
        const [activeTab, setActiveTab] = useState('overview')
        const [dateRange, setDateRange] = useState('30d')

        const handleDateRangeChange = (range: string) => {
            setDateRange(range)
            onDateRangeChange(range)
        }

        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount)
        }

        const formatNumber = (num: number) => {
            return new Intl.NumberFormat('en-IN').format(num)
        }

        const getTrendIcon = (trend: string) => {
            switch (trend) {
                case 'growth': return '📈'
                case 'decline': return '📉'
                case 'stable': return '➡️'
                case 'peak': return '🔥'
                case 'low': return '📉'
                default: return '➡️'
            }
        }

        const getStockStatusColor = (current: number, threshold: number, type: string) => {
            if (type === 'Low Stock') {
                return current < threshold ? 'text-red-600' : 'text-green-600'
            } else {
                return current > threshold ? 'text-orange-600' : 'text-green-600'
            }
        }

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Product Analytics</h2>
                                <p className="text-blue-100 text-sm">{product.name} - {product.sku}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={dateRange}
                                    onChange={(e) => handleDateRangeChange(e.target.value)}
                                    className="bg-white text-gray-800 px-2 py-1 rounded text-xs"
                                    disabled={loading}
                                >
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                    <option value="1y">Last 1 Year</option>
                                </select>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-blue-200 text-xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex h-[calc(95vh-120px)]">
                            {/* Sidebar Skeleton */}
                            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                                <div className="space-y-2">
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                </div>
                            </div>

                            {/* Main Content Skeleton */}
                            <div className="flex-1 p-6">
                                <Skeleton className="h-8 w-48 mb-6" />

                                {/* Key Metrics Skeleton */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Card key={i} className="border-0 shadow-sm">
                                            <CardContent className="p-4">
                                                <div className="text-center">
                                                    <Skeleton className="h-8 w-20 mx-auto mb-2" />
                                                    <Skeleton className="h-4 w-24 mx-auto" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Charts Skeleton */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="border-0 shadow-sm">
                                        <CardHeader>
                                            <Skeleton className="h-6 w-32" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-64 w-full" />
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-sm">
                                        <CardHeader>
                                            <Skeleton className="h-6 w-32" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-64 w-full" />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && data && (
                        <div className="flex h-[calc(95vh-120px)]">
                            {/* Sidebar */}
                            <div className="w-56 bg-gray-50 border-r border-gray-200 p-3">
                                <nav className="space-y-1">
                                    {[
                                        { id: 'overview', label: '📊 Overview', icon: '📊' },
                                        { id: 'sales', label: '📈 Sales Trends', icon: '📈' },
                                        { id: 'inventory', label: '📦 Inventory', icon: '📦' },
                                        { id: 'customers', label: '👥 Customers', icon: '👥' },
                                        { id: 'performance', label: '🎯 Performance', icon: '🎯' },
                                        { id: 'geographic', label: '🌍 Geographic', icon: '🌍' },
                                        { id: 'seasonality', label: '📅 Seasonality', icon: '📅' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors ${activeTab === tab.id
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Overview</h3>

                                        {/* Key Metrics */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-blue-600">
                                                            {formatNumber(data.overview.totalSales)}
                                                        </div>
                                                        <div className="text-xs text-gray-600">Total Sales</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-green-600">
                                                            {formatCurrency(data.overview.totalRevenue)}
                                                        </div>
                                                        <div className="text-xs text-gray-600">Total Revenue</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-purple-600">
                                                            {formatNumber(data.overview.totalUnits)}
                                                        </div>
                                                        <div className="text-xs text-gray-600">Units Sold</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-orange-600">
                                                            {formatCurrency(data.overview.averageOrderValue)}
                                                        </div>
                                                        <div className="text-xs text-gray-600">Avg Order Value</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Size & Color Analytics Charts */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Card className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Size Performance</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <BarChart data={data.sizeAnalytics}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="size" />
                                                            <YAxis />
                                                            <Tooltip
                                                                formatter={(value: any, name: any) => [
                                                                    name === 'sales' ? formatNumber(value) : formatCurrency(value),
                                                                    name === 'sales' ? 'Sales' : 'Revenue'
                                                                ]}
                                                            />
                                                            <Legend />
                                                            <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
                                                            <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                                                        </BarChart>
                                                    </ResponsiveContainer>

                                                    {/* Stock Levels */}
                                                    <div className="mt-3">
                                                        <h4 className="text-xs font-medium text-gray-700 mb-2">Stock Levels</h4>
                                                        <div className="space-y-1">
                                                            {data.sizeAnalytics.map((size: any) => (
                                                                <div key={size.size} className="flex items-center justify-between">
                                                                    <span className="text-xs text-gray-600">{size.size}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                                            <div
                                                                                className="bg-blue-600 h-1.5 rounded-full"
                                                                                style={{ width: `${(size.stock / 100) * 100}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs text-gray-500">{size.stock}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Color Performance</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <PieChart>
                                                            <Pie
                                                                data={data.colorAnalytics}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ color, percent }) => `${color} ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="sales"
                                                            >
                                                                {data.colorAnalytics.map((entry: any, index: number) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color.toLowerCase()} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                formatter={(value: any, name: any) => [
                                                                    name === 'sales' ? formatNumber(value) : formatCurrency(value),
                                                                    name === 'sales' ? 'Sales' : 'Revenue'
                                                                ]}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>

                                                    {/* Color Legend */}
                                                    <div className="mt-3">
                                                        <h4 className="text-xs font-medium text-gray-700 mb-2">Color Details</h4>
                                                        <div className="grid grid-cols-2 gap-1">
                                                            {data.colorAnalytics.map((color: any) => (
                                                                <div key={color.color} className="flex items-center gap-1 p-1 bg-gray-50 rounded">
                                                                    <div
                                                                        className="w-3 h-3 rounded-full border border-gray-300"
                                                                        style={{ backgroundColor: color.color.toLowerCase() }}
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="text-xs font-medium">{color.color}</div>
                                                                        <div className="text-xs text-gray-500">{formatNumber(color.sales)} sales</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}

                                {/* Sales Trends Tab */}
                                {activeTab === 'sales' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Sales Trends</h3>

                                        {/* Daily Sales Chart */}
                                        <Card className="border-0 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Daily Sales Trend</CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <ResponsiveContainer width="100%" height={350}>
                                                    <ComposedChart data={data.salesTrends.daily}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis
                                                            dataKey="date"
                                                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                                        />
                                                        <YAxis yAxisId="left" />
                                                        <YAxis yAxisId="right" orientation="right" />
                                                        <Tooltip
                                                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                                            formatter={(value: any, name: any) => [
                                                                name === 'sales' ? formatNumber(value) :
                                                                    name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                                                                name === 'sales' ? 'Orders' :
                                                                    name === 'revenue' ? 'Revenue' : 'Units'
                                                            ]}
                                                        />
                                                        <Legend />
                                                        <Bar yAxisId="left" dataKey="sales" fill="#3B82F6" name="Orders" />
                                                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>

                                        {/* Weekly and Monthly Trends */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Card className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Weekly Trends</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <AreaChart data={data.salesTrends.weekly}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="week" />
                                                            <YAxis />
                                                            <Tooltip
                                                                formatter={(value: any, name: any) => [
                                                                    name === 'sales' ? formatNumber(value) : formatCurrency(value),
                                                                    name === 'sales' ? 'Sales' : 'Revenue'
                                                                ]}
                                                            />
                                                            <Legend />
                                                            <Area type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Sales" />
                                                            <Area type="monotone" dataKey="revenue" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Revenue" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Monthly Trends</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <BarChart data={data.salesTrends.monthly}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="month" />
                                                            <YAxis />
                                                            <Tooltip
                                                                formatter={(value: any, name: any) => [
                                                                    name === 'sales' ? formatNumber(value) : formatCurrency(value),
                                                                    name === 'sales' ? 'Sales' : 'Revenue'
                                                                ]}
                                                            />
                                                            <Legend />
                                                            <Bar dataKey="sales" fill="#8B5CF6" name="Sales" />
                                                            <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}

                                {/* Inventory Tab */}
                                {activeTab === 'inventory' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Inventory Analytics</h3>

                                        {/* Stock Levels */}
                                        <Card className="border-0 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Stock Levels</CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                        <div className="text-xl font-bold text-blue-600">{data.inventoryAnalytics.stockLevels.current}</div>
                                                        <div className="text-xs text-gray-600">Current Stock</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                                        <div className="text-xl font-bold text-green-600">{data.inventoryAnalytics.stockLevels.daysOfStock}</div>
                                                        <div className="text-xs text-gray-600">Days of Stock</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                                        <div className="text-xl font-bold text-orange-600">{data.inventoryAnalytics.stockLevels.reorderPoint}</div>
                                                        <div className="text-xs text-gray-600">Reorder Point</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                        <div className="text-xl font-bold text-purple-600">{data.overview.stockTurnover}</div>
                                                        <div className="text-xs text-gray-600">Stock Turnover</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Stock Alerts */}
                                        <Card className="border-0 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Stock Alerts</CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="space-y-2">
                                                    {data.inventoryAnalytics.stockAlerts.map((alert: any, index: number) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-red-800">{alert.type}</div>
                                                                    <div className="text-xs text-red-600">Size: {alert.size}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className={`text-sm font-semibold ${getStockStatusColor(alert.current, alert.threshold, alert.type)}`}>
                                                                    {alert.current} / {alert.threshold}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Customers Tab */}
                                {activeTab === 'customers' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Customer Analytics</h3>

                                        {/* Top Customers */}
                                        <Card className="border-0 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Top Customers</CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="space-y-2">
                                                    {data.customerAnalytics.topCustomers.map((customer: any) => (
                                                        <div key={customer.customerId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <div className="text-sm font-medium">{customer.name}</div>
                                                                <div className="text-xs text-gray-500">ID: {customer.customerId}</div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-center">
                                                                    <div className="text-sm font-semibold">{customer.orders}</div>
                                                                    <div className="text-xs text-gray-500">Orders</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-sm font-semibold">{formatCurrency(customer.totalSpent)}</div>
                                                                    <div className="text-xs text-gray-500">Total Spent</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-sm font-semibold">{new Date(customer.lastOrder).toLocaleDateString()}</div>
                                                                    <div className="text-xs text-gray-500">Last Order</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Performance Tab */}
                                {activeTab === 'performance' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>

                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-blue-600">
                                                            {(data.performanceMetrics.conversionRate * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-gray-600">Conversion Rate</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-green-600">
                                                            {data.performanceMetrics.customerSatisfaction}/5
                                                        </div>
                                                        <div className="text-xs text-gray-600">Customer Satisfaction</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-0 shadow-sm">
                                                <CardContent className="p-3">
                                                    <div className="text-center">
                                                        <div className="text-xl font-bold text-purple-600">
                                                            {(data.performanceMetrics.returnRate * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-gray-600">Return Rate</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}

                                {/* Geographic Tab */}
                                {activeTab === 'geographic' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Geographic Analytics</h3>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Card className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Regional Performance</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <PieChart>
                                                            <Pie
                                                                data={data.geographicAnalytics.topRegions}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ region, percentage }) => `${region} ${percentage}%`}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="sales"
                                                            >
                                                                {data.geographicAnalytics.topRegions.map((entry: any, index: number) => (
                                                                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                formatter={(value: any, name: any) => [
                                                                    name === 'sales' ? formatNumber(value) : formatCurrency(value),
                                                                    name === 'sales' ? 'Sales' : 'Revenue'
                                                                ]}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Regional Metrics</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <RadarChart data={data.geographicAnalytics.topRegions}>
                                                            <PolarGrid />
                                                            <PolarAngleAxis dataKey="region" />
                                                            <PolarRadiusAxis />
                                                            <Radar
                                                                name="Sales"
                                                                dataKey="sales"
                                                                stroke="#3B82F6"
                                                                fill="#3B82F6"
                                                                fillOpacity={0.6}
                                                            />
                                                            <Tooltip
                                                                formatter={(value: any, name: any) => [
                                                                    formatNumber(value),
                                                                    name === 'sales' ? 'Sales' : 'Revenue'
                                                                ]}
                                                            />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Regional Details */}
                                        <Card className="border-0 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Regional Details</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {data.geographicAnalytics.topRegions.map((region: any) => (
                                                        <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                                    {region.percentage}%
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{region.region}</div>
                                                                    <div className="text-sm text-gray-500">{formatNumber(region.sales)} sales</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-semibold">{formatCurrency(region.revenue)}</div>
                                                                <div className="text-sm text-gray-500">Revenue</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Seasonality Tab */}
                                {activeTab === 'seasonality' && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-gray-800">Seasonality Analysis</h3>

                                        <Card className="border-0 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Monthly Sales Trends</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <LineChart data={data.seasonalityAnalysis.monthlyTrends}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="month" />
                                                        <YAxis />
                                                        <Tooltip
                                                            formatter={(value: any) => [formatNumber(value), 'Sales']}
                                                            labelFormatter={(label) => `${label} - ${data.seasonalityAnalysis.monthlyTrends.find((m: any) => m.month === label)?.trend} trend`}
                                                        />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="sales"
                                                            stroke="#3B82F6"
                                                            strokeWidth={3}
                                                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                                                            activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                                                            name="Sales"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>

                                        {/* Trend Analysis */}
                                        <Card className="border-0 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Trend Analysis</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {data.seasonalityAnalysis.monthlyTrends.map((month: any) => (
                                                        <div key={month.month} className="text-center p-4 bg-gray-50 rounded-lg">
                                                            <div className="text-3xl mb-2">{getTrendIcon(month.trend)}</div>
                                                            <div className="font-semibold text-lg">{month.month}</div>
                                                            <div className="text-sm text-gray-600 capitalize">{month.trend}</div>
                                                            <div className="text-lg font-bold text-blue-600 mt-1">
                                                                {formatNumber(month.sales)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Image Editor Component
    const ImageEditor = ({
        imageUrl,
        onSave,
        onCancel,
        zIndex = 50
    }: {
        imageUrl: string
        onSave: (editedImageUrl: string) => void
        onCancel: () => void
        zIndex?: number
    }) => {
        const [scale, setScale] = useState(1)
        const [rotation, setRotation] = useState(0)
        const [brightness, setBrightness] = useState(100)
        const [contrast, setContrast] = useState(100)
        const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)

        const applyFilters = () => {
            if (!canvasRef) return

            const canvas = canvasRef
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const img = new Image()
            img.onload = () => {
                // Set canvas size to optimal dimensions (800x800)
                canvas.width = 800
                canvas.height = 800

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // Save context
                ctx.save()

                // Move to center
                ctx.translate(canvas.width / 2, canvas.height / 2)

                // Apply transformations
                ctx.scale(scale, scale)
                ctx.rotate((rotation * Math.PI) / 180)

                // Calculate scaled dimensions to maintain aspect ratio
                const aspectRatio = img.width / img.height
                let drawWidth = 800
                let drawHeight = 800

                if (aspectRatio > 1) {
                    drawHeight = 800 / aspectRatio
                } else {
                    drawWidth = 800 * aspectRatio
                }

                // Draw image
                ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)

                // Restore context
                ctx.restore()

                // Apply brightness and contrast filters
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const data = imageData.data

                for (let i = 0; i < data.length; i += 4) {
                    // Brightness
                    data[i] = Math.min(255, data[i] * (brightness / 100))
                    data[i + 1] = Math.min(255, data[i + 1] * (brightness / 100))
                    data[i + 2] = Math.min(255, data[i + 2] * (brightness / 100))

                    // Contrast
                    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
                    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
                    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
                    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
                }

                ctx.putImageData(imageData, 0, 0)
            }
            img.src = imageUrl
        }

        useEffect(() => {
            applyFilters()
        }, [scale, rotation, brightness, contrast, imageUrl])

        const handleSave = () => {
            if (canvasRef) {
                const editedImageUrl = canvasRef.toDataURL('image/jpeg', 0.9)
                onSave(editedImageUrl)
            }
        }

        const resetFilters = () => {
            setScale(1)
            setRotation(0)
            setBrightness(100)
            setContrast(100)
        }

        return (
            <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center`} style={{ zIndex }}>
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Image Editor</h2>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Image Preview */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700">Preview</h3>
                            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                                <canvas
                                    ref={setCanvasRef}
                                    className="w-full h-80 object-contain border border-gray-200 rounded"
                                />
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                Optimal size: 800x800px | Format: JPEG | Quality: 90%
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-700">Adjustments</h3>

                            {/* Scale */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scale: {Math.round(scale * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => setScale(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Rotation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rotation: {rotation}°
                                </label>
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    step="1"
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Brightness */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brightness: {brightness}%
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    step="1"
                                    value={brightness}
                                    onChange={(e) => setBrightness(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Contrast */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contrast: {contrast}%
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    step="1"
                                    value={contrast}
                                    onChange={(e) => setContrast(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <Button
                                    onClick={resetFilters}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Reset Filters
                                </Button>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={onCancel}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        Save Image
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Product Details Component
    const ProductDetails = ({ product }: { product: Product }) => {
        const stockStatus = getStockStatus(product)
        const ageing = getAgeing(product)
        const gstPercentage = getGSTPercentage(product)

        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            SKU: {product.sku}
                        </span>
                        {product.barcode && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                Barcode: {product.barcode}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Images */}
                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700">Product Images</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Main Image */}
                                    <div className="relative">
                                        {product.images && product.images.length > 0 ? (
                                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                <div className="hidden w-full h-full flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-4xl mb-2">👕</div>
                                                        <div className="text-xs text-gray-500">Image not available</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-4xl mb-2">👕</div>
                                                    <div className="text-xs text-gray-500">No images available</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            Main
                                        </div>
                                    </div>

                                    {/* Thumbnail Images */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.images && product.images.length > 1 ? (
                                            product.images.slice(1, 5).map((image, index) => (
                                                <div key={index} className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors">
                                                    <img
                                                        src={image}
                                                        alt={`${product.name} - Image ${index + 2}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            target.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                    <div className="hidden w-full h-full flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">Img {index + 2}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            // Show placeholder thumbnails if no additional images
                                            Array.from({ length: 4 }, (_, i) => (
                                                <div key={i} className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">No img {i + 1}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Basic Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-1">Category</div>
                                        <div className="font-medium">{product.category}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Brand</div>
                                        <div className="font-medium">{product.brand || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Description</div>
                                        <div className="font-medium line-clamp-2">{product.description}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Age</div>
                                        <div className="font-medium">{ageing}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700">Pricing Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-1">Selling Price</div>
                                        <div className="font-semibold text-green-600">₹{product.price}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">MRP</div>
                                        <div className="font-medium line-through text-gray-500">₹{product.mrp}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Cost Price</div>
                                        <div className="font-medium text-red-600">₹{product.costPrice}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">GST</div>
                                        <div className="font-medium">{gstPercentage}%</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Size and Stock Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700">Size & Stock Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Size Grid */}
                                    <div>
                                        <div className="text-xs text-gray-500 mb-2">Available Sizes</div>
                                        <div className="grid grid-cols-6 gap-2">
                                            {product.sizes.map((size, index) => (
                                                <div key={index} className="text-center p-2 bg-gray-100 rounded border">
                                                    <div className="text-xs font-medium">{size.name}</div>
                                                    <div className="text-xs text-gray-500">{size.stock} pcs</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Summary */}
                                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 mb-1">Total Stock</div>
                                            <div className={`font-semibold text-sm ${stockStatus.className}`}>
                                                {stockStatus.text}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 mb-1">Min Stock</div>
                                            <div className="font-medium text-sm">{product.minStock} pcs</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 mb-1">Status</div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${product.stock <= 0 ? 'bg-red-100 text-red-800' :
                                                product.stock <= product.minStock ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {product.stock <= 0 ? 'Out of Stock' :
                                                    product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700">Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-1">Created</div>
                                        <div className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Updated</div>
                                        <div className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Unit</div>
                                        <div className="font-medium">{product.unit}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-1">Max Stock</div>
                                        <div className="font-medium">{product.maxStock} pcs</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                    <button
                        onClick={() => handleToggleActive(product)}
                        className={`h-8 px-4 text-xs rounded border transition-colors ${product.isActive
                            ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                            }`}
                    >
                        {product.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </button>
                    <ActionGate tile="garment" page="inventory" action="update" fallback={null}>
                        <Button
                            variant="outline"
                            className="h-8 px-4 text-xs"
                            onClick={() => handleEditProduct(product)}
                        >
                            ✎ Edit Product
                        </Button>
                    </ActionGate>
                    <ActionGate tile="garment" page="inventory" action="delete" fallback={null}>
                        <Button
                            variant="outline"
                            className="h-8 px-4 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(product)}
                        >
                            🗑 Delete Product
                        </Button>
                    </ActionGate>
                    <Button
                        className="h-8 px-4 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleViewAnalytics(product)}
                    >
                        📊 View Analytics
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Loading State */}
                {isLoading ? (
                    <>
                        {/* Title bar skeleton */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-lg flex justify-between items-center">
                            <Skeleton className="h-6 w-48 bg-blue-500" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-32 bg-blue-500" />
                                <Skeleton className="h-4 w-28 bg-blue-500" />
                            </div>
                        </div>

                        {/* Search bar skeleton */}
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 relative">
                                                <Skeleton className="h-12 w-full rounded-lg" />
                                            </div>
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Skeleton className="h-8 w-32 rounded" />
                                        <Skeleton className="h-8 w-28 rounded" />
                                        <Skeleton className="h-8 w-20 rounded" />
                                        <Skeleton className="h-8 w-24 rounded" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results summary skeleton */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>

                        {/* Products table skeleton */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs w-8"></th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">#</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Product</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Category</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Brand</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">SKU</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Price</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Stock</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Status</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Active</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from({ length: 10 }).map((_, index) => (
                                                <tr key={index} className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-4 w-4" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-4 w-6" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="space-y-1">
                                                            <Skeleton className="h-4 w-32" />
                                                            <Skeleton className="h-3 w-24" />
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-5 w-16 rounded-full" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-4 w-20" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-4 w-16" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="space-y-1">
                                                            <Skeleton className="h-4 w-12" />
                                                            <Skeleton className="h-3 w-10" />
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-4 w-12 mx-auto" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="space-y-1">
                                                            <Skeleton className="h-3 w-16" />
                                                            <Skeleton className="h-3 w-12" />
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="flex items-center gap-1">
                                                            <Skeleton className="h-5 w-5 rounded" />
                                                            <Skeleton className="h-5 w-5 rounded" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination skeleton */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <Skeleton className="h-8 w-8 rounded" />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Title bar with stats */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-lg flex justify-between items-center">
                            <span>{'<<'} Inventory Management</span>
                            <div className="flex items-center gap-4 text-xs">
                                <span>Total Products: {sampleProducts.length}</span>
                                <span>Active Filters: {activeFiltersCount}</span>
                            </div>
                        </div>

                        {/* Advanced Search Bar */}
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Main Search */}
                                    <div className="relative">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 relative">
                                                <Input
                                                    className="h-12 pl-12 pr-4 text-base border-2 border-blue-200 focus:border-blue-500 rounded-lg shadow-sm"
                                                    placeholder="Search products by name, SKU, barcode, or description..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                                                    🔍
                                                </div>
                                                {showSuggestions && searchSuggestions.length > 0 && (
                                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                                                        {searchSuggestions.map((suggestion, index) => (
                                                            <div
                                                                key={index}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                                                onClick={() => {
                                                                    setSearchTerm(suggestion)
                                                                    setShowSuggestions(false)
                                                                }}
                                                            >
                                                                {suggestion}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                                className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center justify-center"
                                                title={showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                            </Button>
                                            <Button
                                                onClick={() => setShowAddProductModal(true)}
                                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md flex items-center justify-center"
                                                title="Add Product"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </Button>
                                            {activeFiltersCount > 0 && (
                                                <Button
                                                    onClick={clearAllFilters}
                                                    variant="outline"
                                                    className="h-12 px-6 border-red-300 text-red-600 hover:bg-red-50"
                                                >
                                                    Clear All
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Filters */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            className="h-8 px-2 border border-gray-300 rounded text-xs focus:border-blue-500"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="h-8 px-2 border border-gray-300 rounded text-xs focus:border-blue-500"
                                            value={brandFilter}
                                            onChange={(e) => setBrandFilter(e.target.value)}
                                        >
                                            <option value="">All Brands</option>
                                            {brands.map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                        <Input
                                            className="h-8 w-24 text-xs"
                                            placeholder="Size"
                                            value={sizeFilter}
                                            onChange={(e) => setSizeFilter(e.target.value)}
                                        />
                                        <label className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded text-xs">
                                            <input
                                                type="checkbox"
                                                checked={lowStockOnly}
                                                onChange={(e) => setLowStockOnly(e.target.checked)}
                                                className="text-orange-600"
                                            />
                                            <span className="font-medium text-orange-800">Low Stock</span>
                                        </label>
                                    </div>

                                    {/* Advanced Filters Panel */}
                                    {showAdvancedFilters && (
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                            <h3 className="text-base font-semibold mb-3 text-gray-800">Advanced Filters</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            className="h-8 text-xs"
                                                            placeholder="Min ₹"
                                                            type="number"
                                                            value={priceRange.min}
                                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                                        />
                                                        <Input
                                                            className="h-8 text-xs"
                                                            placeholder="Max ₹"
                                                            type="number"
                                                            value={priceRange.max}
                                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Stock Range</label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            className="h-8 text-xs"
                                                            placeholder="Min Qty"
                                                            type="number"
                                                            value={stockRange.min}
                                                            onChange={(e) => setStockRange(prev => ({ ...prev, min: e.target.value }))}
                                                        />
                                                        <Input
                                                            className="h-8 text-xs"
                                                            placeholder="Max Qty"
                                                            type="number"
                                                            value={stockRange.max}
                                                            onChange={(e) => setStockRange(prev => ({ ...prev, max: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            className="h-8 px-2 border border-gray-300 rounded text-xs flex-1"
                                                            value={sortBy}
                                                            onChange={(e) => setSortBy(e.target.value)}
                                                        >
                                                            <option value="name">Name</option>
                                                            <option value="price">Price</option>
                                                            <option value="stock">Stock</option>
                                                            <option value="category">Category</option>
                                                            <option value="brand">Brand</option>
                                                        </select>
                                                        <Button
                                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                            variant="outline"
                                                            className="h-8 px-2 text-xs"
                                                        >
                                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Results Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-600 font-medium">
                                        Total Value: ₹{filteredProducts.reduce((sum, p) => sum + (p.stock * p.costPrice), 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Results table */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs w-8"></th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">#</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Product</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Category</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Brand</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">SKU</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Price</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Stock</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Status</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Active</th>
                                                <th className="px-2 py-1.5 text-left font-semibold text-xs">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts.map((product, index) => {
                                                const stockStatus = getStockStatus(product)
                                                const ageing = getAgeing(product)
                                                const gstPercentage = getGSTPercentage(product)
                                                const isExpanded = expandedRows.has(product.id)

                                                return (
                                                    <>
                                                        <tr
                                                            key={product.id}
                                                            className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                                                            onClick={() => toggleRowExpansion(product.id)}
                                                        >
                                                            <td className="px-2 py-1">
                                                                <div className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                                                                    ▶
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1 text-gray-600 text-xs">{startIndex + index + 1}</td>
                                                            <td className="px-2 py-1">
                                                                <div className="space-y-0.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold text-gray-900 text-xs">{product.name}</span>
                                                                        {product.sizes.length > 1 && (
                                                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded-full">
                                                                                {product.sizes.length} sizes
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">{product.description.substring(0, 35)}...</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full">
                                                                    {product.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 py-1 text-gray-700 text-xs">{product.brand || '-'}</td>
                                                            <td className="px-2 py-1 font-mono text-xs">{product.sku}</td>
                                                            <td className="px-2 py-1">
                                                                <div className="text-right space-y-0.5">
                                                                    <div className="font-semibold text-green-600 text-xs">₹{product.price}</div>
                                                                    <div className="text-xs text-gray-500 line-through">₹{product.mrp}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className={`text-center font-semibold text-xs ${stockStatus.className}`}>
                                                                    {stockStatus.text}
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-xs text-gray-600">{ageing}</span>
                                                                    <span className="text-xs text-gray-600">{gstPercentage}% GST</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                                                    <button
                                                                        onClick={() => handleToggleActive(product)}
                                                                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${product.isActive
                                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                            }`}
                                                                        title={product.isActive ? 'Click to deactivate' : 'Click to activate'}
                                                                    >
                                                                        {product.isActive ? 'Active' : 'Inactive'}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                                    <ActionGate tile="garment" page="inventory" action="update" fallback={null}>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="h-5 w-5 p-0 text-blue-600 hover:bg-blue-50 text-xs"
                                                                            title="Edit"
                                                                            onClick={() => handleEditProduct(product)}
                                                                        >
                                                                            ✎
                                                                        </Button>
                                                                    </ActionGate>
                                                                    <ActionGate tile="garment" page="inventory" action="delete" fallback={null}>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="h-5 w-5 p-0 text-red-600 hover:bg-red-50 text-xs"
                                                                            title="Delete"
                                                                            onClick={() => handleDeleteProduct(product)}
                                                                        >
                                                                            🗑
                                                                        </Button>
                                                                    </ActionGate>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {isExpanded && (
                                                            <tr>
                                                                <td colSpan={11} className="p-0">
                                                                    <ProductDetails product={product} />
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                Page {currentPage} of {totalPages}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="h-8 px-3"
                                                >
                                                    ← Previous
                                                </Button>

                                                {/* Page numbers */}
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i
                                                        } else {
                                                            pageNum = currentPage - 2 + i
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        )
                                                    })}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="h-8 px-3"
                                                >
                                                    Next →
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </>
                )}
            </div>
            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 overflow-y-auto flex-1 px-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <Input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <Input
                                        value={editForm.brand}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, brand: e.target.value }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setEditForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${editForm.isActive ? 'bg-green-600' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${editForm.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                                {editForm.isActive ? '🟢 Active' : '🔴 Inactive'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({editForm.isActive ? 'Saleable' : 'Not Saleable'})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                                    <Input
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                                    <Input
                                        type="number"
                                        value={editForm.mrp}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, mrp: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹)</label>
                                    <Input
                                        type="number"
                                        value={editForm.costPrice}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                                    <Input
                                        type="number"
                                        value={editForm.minStock}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                                    <Input
                                        type="number"
                                        value={editForm.maxStock}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Sizes Management */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Sizes Management</h3>

                                {/* Existing Sizes */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Sizes</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                        {editForm.sizes.map((size, index) => (
                                            <div key={size.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{size.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Stock: {size.stock} | Price: ₹{size.price || editForm.price}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenSizeImageModal(size)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                                                        title="Manage images for this size"
                                                    >
                                                        📷
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveSize(size.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                        title="Remove size"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {editForm.sizes.length === 0 && (
                                            <div className="text-gray-500 text-sm italic">No sizes added yet</div>
                                        )}
                                    </div>
                                </div>

                                {/* Add New Size */}
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Size</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            placeholder="Size name (e.g., S, M, L)"
                                            value={newSize.name}
                                            onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                                            className="col-span-1"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Stock"
                                            value={newSize.stock}
                                            onChange={(e) => setNewSize(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                            className="col-span-1"
                                        />
                                        <div className="col-span-1 flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Price (optional)"
                                                value={newSize.price}
                                                onChange={(e) => setNewSize(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleAddSize}
                                                className="px-3 bg-blue-600 hover:bg-blue-700 text-white"
                                                disabled={!newSize.name}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Colors Management */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Colors Management</h3>

                                {/* Existing Colors */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Colors</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                        {editForm.colors.map((color, index) => (
                                            <div key={color.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div
                                                        className="w-4 h-4 rounded border"
                                                        style={{ backgroundColor: color.code }}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-sm">{color.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            Stock: {color.stock} | Price: ₹{color.price || editForm.price}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenColorImageModal(color)}
                                                        className="text-purple-600 hover:text-purple-800 text-sm px-2 py-1 rounded bg-purple-50 hover:bg-purple-100"
                                                        title="Manage images for this color"
                                                    >
                                                        📷
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveColor(color.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                        title="Remove color"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {editForm.colors.length === 0 && (
                                            <div className="text-gray-500 text-sm italic">No colors added yet</div>
                                        )}
                                    </div>
                                </div>

                                {/* Add New Color */}
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Color</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        <Input
                                            placeholder="Color name"
                                            value={newColor.name}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                                            className="col-span-1"
                                        />
                                        <Input
                                            type="color"
                                            value={newColor.code}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, code: e.target.value }))}
                                            className="col-span-1 h-10"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Stock"
                                            value={newColor.stock}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                            className="col-span-1"
                                        />
                                        <div className="col-span-1 flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Price (optional)"
                                                value={newColor.price}
                                                onChange={(e) => setNewColor(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleAddColor}
                                                className="px-3 bg-green-600 hover:bg-green-700 text-white"
                                                disabled={!newColor.name}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images Management */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Images Management</h3>

                                {/* Existing Images */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                                        {editForm.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`Product image ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded border cursor-pointer"
                                                    onClick={() => handleEditImage(image, index)}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                <div className="hidden w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">Image {index + 1}</span>
                                                </div>
                                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEditImage(image, index)
                                                        }}
                                                        className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs"
                                                        title="Edit image"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRemoveImage(index)
                                                        }}
                                                        className="bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                                        title="Remove image"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {editForm.images.length === 0 && (
                                            <div className="text-gray-500 text-sm italic col-span-full">No images added yet</div>
                                        )}
                                    </div>
                                </div>

                                {/* Add New Image */}
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Image</label>
                                    <div className="space-y-3">
                                        {/* File Upload */}
                                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <div className="text-purple-600 text-2xl mb-2">📁</div>
                                                <div className="text-sm font-medium text-gray-700 mb-1">
                                                    Click to upload image from your computer
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Supports: JPG, PNG, GIF (Max: 5MB)
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Optimal: 800x800px, Square aspect ratio
                                                </div>
                                            </label>
                                        </div>

                                        {/* URL Input */}
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Or enter image URL"
                                                value={newImage}
                                                onChange={(e) => setNewImage(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleAddImage}
                                                className="px-4 bg-purple-600 hover:bg-purple-700 text-white"
                                                disabled={!newImage.trim()}
                                            >
                                                Add URL
                                            </Button>
                                        </div>

                                        {/* Link Image to Size/Color */}
                                        <div className="bg-white p-2 rounded border">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Link to Size/Color (Optional)</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <select
                                                    value={selectedSizeForImage}
                                                    onChange={(e) => setSelectedSizeForImage(e.target.value)}
                                                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                                                >
                                                    <option value="">Select Size</option>
                                                    {editForm.sizes.map(size => (
                                                        <option key={size.id} value={size.name}>{size.name}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={selectedColorForImage}
                                                    onChange={(e) => setSelectedColorForImage(e.target.value)}
                                                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                                                >
                                                    <option value="">Select Color</option>
                                                    {editForm.colors.map(color => (
                                                        <option key={color.id} value={color.name}>{color.name}</option>
                                                    ))}
                                                </select>
                                                <Button
                                                    onClick={handleLinkImage}
                                                    className="px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                                    disabled={!newImage.trim() || (!selectedSizeForImage && !selectedColorForImage)}
                                                >
                                                    Link
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t bg-white shadow-lg">
                            <Button
                                variant="outline"
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-2 shadow-md hover:shadow-lg transition-shadow"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-shadow"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Modal */}
            {showAnalyticsModal && selectedProductForAnalytics && (
                <AnalyticsModal
                    product={selectedProductForAnalytics}
                    data={analyticsData}
                    loading={analyticsLoading}
                    onClose={() => {
                        setShowAnalyticsModal(false)
                        setSelectedProductForAnalytics(null)
                        setAnalyticsData(null)
                    }}
                    onDateRangeChange={(range) => {
                        if (selectedProductForAnalytics) {
                            fetchProductAnalytics(selectedProductForAnalytics.id, range)
                        }
                    }}
                />
            )}

            {/* Image Editor Modal */}
            {showImageEditor && editingImage && (
                <ImageEditor
                    imageUrl={editingImage.url}
                    onSave={handleSaveEditedImage}
                    onCancel={() => {
                        setShowImageEditor(false)
                        setEditingImage(null)
                        setImagePreview('')
                        setImageFile(null)
                    }}
                    zIndex={70}
                />
            )}

            {/* Add Product Image Editor Modal */}
            {showImageEditorForAdd && editingImageForAdd && (
                <ImageEditor
                    imageUrl={editingImageForAdd.url}
                    onSave={handleSaveEditedImageForAdd}
                    onCancel={() => {
                        setShowImageEditorForAdd(false)
                        setEditingImageForAdd(null)
                        setImagePreviewForAdd('')
                        setImageFileForAdd(null)
                    }}
                    zIndex={70}
                />
            )}

            {/* Product Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Product Preview</h2>
                                    <p className="text-blue-100 mt-1">Review your product before saving</p>
                                </div>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="text-white hover:text-blue-200 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Product Details */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Product Name</label>
                                                <p className="text-gray-800 font-medium">{addProductForm.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Category</label>
                                                <p className="text-gray-800">{addProductForm.category}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Brand</label>
                                                <p className="text-gray-800">{addProductForm.brand || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">SKU</label>
                                                <p className="text-gray-800">{addProductForm.sku || 'Auto-generated'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Barcode</label>
                                                <p className="text-gray-800">{addProductForm.barcode || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Status</label>
                                                <p className={`font-medium ${addProductForm.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                    {addProductForm.isActive ? '🟢 Active' : '🔴 Inactive'}
                                                </p>
                                            </div>
                                            {addProductForm.description && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Description</label>
                                                    <p className="text-gray-800 text-sm">{addProductForm.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Stock</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Selling Price</label>
                                                <p className="text-gray-800 font-medium">₹{addProductForm.price}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">MRP</label>
                                                <p className="text-gray-800">₹{addProductForm.mrp}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Cost Price</label>
                                                <p className="text-gray-800">₹{addProductForm.costPrice}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Min Stock</label>
                                                <p className="text-gray-800">{addProductForm.minStock}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Max Stock</label>
                                                <p className="text-gray-800">{addProductForm.maxStock}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {addProductForm.sizes.length > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sizes ({addProductForm.sizes.length})</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {addProductForm.sizes.map((size, index) => (
                                                    <div key={index} className="bg-white rounded p-3 border">
                                                        <div className="font-medium text-gray-800">{size.name}</div>
                                                        <div className="text-sm text-gray-600">Stock: {size.stock} | Price: ₹{size.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {addProductForm.colors.length > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Colors ({addProductForm.colors.length})</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {addProductForm.colors.map((color, index) => (
                                                    <div key={index} className="bg-white rounded p-3 border">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded border"
                                                                style={{ backgroundColor: color.code }}
                                                            ></div>
                                                            <span className="font-medium text-gray-800">{color.name}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">Stock: {color.stock} | Price: ₹{color.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Images */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images ({addProductForm.images.length})</h3>
                                        {addProductForm.images.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                {addProductForm.images.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={image}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-full h-48 object-cover rounded-lg border"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Error'
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p>No images added</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-6 pt-4 border-t bg-white shadow-lg">
                            <Button
                                variant="outline"
                                onClick={() => setShowPreviewModal(false)}
                                className="px-6 py-2"
                            >
                                Back to Edit
                            </Button>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleConfirmSave}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-shadow"
                                    disabled={addProductLoading}
                                >
                                    {addProductLoading ? 'Saving...' : 'Confirm & Save Product'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Product Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Delete Product</h2>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete this product?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-800 font-medium">{selectedProduct.name}</p>
                                <p className="text-red-600 text-sm">SKU: {selectedProduct.sku}</p>
                            </div>
                            <p className="text-red-600 text-sm mt-2">
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="px-4 bg-red-600 hover:bg-red-700"
                            >
                                Delete Product
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Add New Product</h2>
                                    <p className="text-green-100 mt-1">Create a new product in your inventory</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowAddProductModal(false)
                                        resetAddProductForm()
                                    }}
                                    className="text-white hover:text-green-200 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center justify-center mt-6 space-x-4">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= step
                                            ? 'bg-white text-green-600'
                                            : 'bg-green-500 text-white'
                                            }`}>
                                            {step}
                                        </div>
                                        {step < 4 && (
                                            <div className={`w-12 h-1 mx-2 ${currentStep > step ? 'bg-white' : 'bg-green-500'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                value={addProductForm.name}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Enter product name"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={addProductForm.category}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                            <Input
                                                value={addProductForm.brand}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, brand: e.target.value }))}
                                                placeholder="Enter brand name"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                            <Input
                                                value={addProductForm.sku}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, sku: e.target.value }))}
                                                placeholder="Auto-generated if empty"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={addProductForm.barcode}
                                                    onChange={(e) => setAddProductForm(prev => ({ ...prev, barcode: e.target.value }))}
                                                    placeholder="Enter barcode"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    onClick={generateBarcode}
                                                    className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center justify-center"
                                                    title="Generate Barcode"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setAddProductForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${addProductForm.isActive ? 'bg-green-600' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addProductForm.isActive ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                                <span className={`text-sm font-medium ${addProductForm.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {addProductForm.isActive ? '🟢 Active' : '🔴 Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={addProductForm.description}
                                            onChange={(e) => setAddProductForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter product description"
                                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Pricing */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Selling Price (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={addProductForm.price}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                placeholder="0.00"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹)</label>
                                            <Input
                                                type="number"
                                                value={addProductForm.mrp}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, mrp: Number(e.target.value) }))}
                                                placeholder="0.00"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price (₹)</label>
                                            <Input
                                                type="number"
                                                value={addProductForm.costPrice}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                                                placeholder="0.00"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
                                            <Input
                                                type="number"
                                                value={addProductForm.minStock}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                                                placeholder="0"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Stock</label>
                                            <Input
                                                type="number"
                                                value={addProductForm.maxStock}
                                                onChange={(e) => setAddProductForm(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
                                                placeholder="0"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Sizes & Colors */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Sizes & Colors</h3>

                                    {/* Sizes Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-700">Product Sizes</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Size Name</label>
                                                <Input
                                                    value={newSizeForAdd.name}
                                                    onChange={(e) => setNewSizeForAdd(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g., S, M, L, XL"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                                <Input
                                                    type="number"
                                                    value={newSizeForAdd.stock}
                                                    onChange={(e) => setNewSizeForAdd(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                                    placeholder="0"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                                <Input
                                                    type="number"
                                                    value={newSizeForAdd.price}
                                                    onChange={(e) => setNewSizeForAdd(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                    placeholder="0.00"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    onClick={handleAddSizeForAdd}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    disabled={!newSizeForAdd.name}
                                                >
                                                    Add Size
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Added Sizes */}
                                        {addProductForm.sizes.length > 0 && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-3">Added Sizes</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {addProductForm.sizes.map((size) => (
                                                        <div key={size.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                                            <div>
                                                                <div className="font-medium">{size.name}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    Stock: {size.stock} | ₹{size.price}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveSizeForAdd(size.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Colors Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-700">Product Colors</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Name</label>
                                                <Input
                                                    value={newColorForAdd.name}
                                                    onChange={(e) => setNewColorForAdd(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g., Red, Blue"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
                                                <Input
                                                    type="color"
                                                    value={newColorForAdd.code}
                                                    onChange={(e) => setNewColorForAdd(prev => ({ ...prev, code: e.target.value }))}
                                                    className="w-full h-10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                                <Input
                                                    type="number"
                                                    value={newColorForAdd.stock}
                                                    onChange={(e) => setNewColorForAdd(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                                    placeholder="0"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                                <Input
                                                    type="number"
                                                    value={newColorForAdd.price}
                                                    onChange={(e) => setNewColorForAdd(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                    placeholder="0.00"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    onClick={handleAddColorForAdd}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    disabled={!newColorForAdd.name}
                                                >
                                                    Add Color
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Added Colors */}
                                        {addProductForm.colors.length > 0 && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-3">Added Colors</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {addProductForm.colors.map((color) => (
                                                        <div key={color.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-6 h-6 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: color.code }}
                                                                />
                                                                <div>
                                                                    <div className="font-medium">{color.name}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        Stock: {color.stock} | ₹{color.price}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveColorForAdd(color.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Images */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h3>

                                    <div className="space-y-6">
                                        {/* File Upload Section */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h5 className="text-sm font-medium text-blue-800 mb-3">Upload Image File</h5>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUploadForAdd}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                />
                                                {imageFileForAdd && (
                                                    <div className="text-sm text-gray-600">
                                                        Selected: {imageFileForAdd.name}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Supported formats: JPG, PNG, GIF. Max size: 5MB. Recommended: 400x400 to 1200x1200px, square aspect ratio.
                                            </p>
                                        </div>

                                        {/* URL Input Section */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-3">Add Image URL</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2">
                                                    <Input
                                                        value={newImageForAdd}
                                                        onChange={(e) => setNewImageForAdd(e.target.value)}
                                                        placeholder="Enter image URL"
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <Button
                                                        onClick={handleAddImageForAdd}
                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                        disabled={!newImageForAdd.trim()}
                                                    >
                                                        Add Image
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Added Images */}
                                        {addProductForm.images.length > 0 && (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <h5 className="text-sm font-medium text-gray-700 mb-3">Added Images ({addProductForm.images.length})</h5>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {addProductForm.images.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={image}
                                                                alt={`Product ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg border cursor-pointer"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Error'
                                                                }}
                                                                onClick={() => handleEditImageForAdd(image, index)}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveImageForAdd(index)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title="Remove image"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floating Buttons */}
                        <div className="flex items-center justify-between p-6 pt-4 border-t bg-white shadow-lg">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (currentStep > 1) {
                                        setCurrentStep(currentStep - 1)
                                    } else {
                                        setShowAddProductModal(false)
                                        resetAddProductForm()
                                    }
                                }}
                                className="px-6 py-2 shadow-md hover:shadow-lg transition-shadow"
                            >
                                {currentStep === 1 ? 'Cancel' : 'Previous'}
                            </Button>

                            <div className="flex items-center gap-3">
                                {currentStep < 4 ? (
                                    <Button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-shadow"
                                        disabled={!addProductForm.name || !addProductForm.category}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleShowPreview}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-shadow"
                                        disabled={addProductLoading}
                                    >
                                        Preview & Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Size Image Modal */}
            {showSizeImageModal && selectedSizeForImageModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Manage Images for Size: {selectedSizeForImageModal.name}</h2>
                                    <p className="text-blue-100 mt-1">Add, edit, or remove images for this size</p>
                                </div>
                                <button
                                    onClick={() => setShowSizeImageModal(false)}
                                    className="text-white hover:text-blue-200 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Add New Image */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Image</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter image URL"
                                            value={newSizeImage.imageUrl}
                                            onChange={(e) => setNewSizeImage(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter image description"
                                            value={newSizeImage.description}
                                            onChange={(e) => setNewSizeImage(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isMainSize"
                                            checked={newSizeImage.isMain}
                                            onChange={(e) => setNewSizeImage(prev => ({ ...prev, isMain: e.target.checked }))}
                                            className="mr-2"
                                        />
                                        <label htmlFor="isMainSize" className="text-sm text-gray-700">
                                            Set as main image for this size
                                        </label>
                                    </div>
                                    <Button
                                        onClick={handleAddSizeImage}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    >
                                        Add Image
                                    </Button>
                                </div>
                            </div>

                            {/* Existing Images */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Images</h3>
                                {selectedProduct.sizeImages && selectedProduct.sizeImages.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedProduct.sizeImages
                                            .filter(img => img.sizeId === selectedSizeForImageModal.id)
                                            .map((image) => (
                                                <div key={image.id} className="border rounded-lg p-4">
                                                    <div className="relative group">
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.description || `Size ${selectedSizeForImageModal.name} image`}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Error'
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleEditSizeImage(image)}
                                                                    className="bg-blue-600 text-white p-2 rounded-full mr-2"
                                                                    title="Edit image"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveSizeImage(image.id)}
                                                                    className="bg-red-600 text-white p-2 rounded-full"
                                                                    title="Remove image"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {image.isMain && (
                                                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                                                Main
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600">{image.description || 'No description'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No images added for this size yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSizeImageModal(false)}
                                    className="px-6 py-2"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Color Image Modal */}
            {showColorImageModal && selectedColorForImageModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Manage Images for Color: {selectedColorForImageModal.name}</h2>
                                    <p className="text-purple-100 mt-1">Add, edit, or remove images for this color</p>
                                </div>
                                <button
                                    onClick={() => setShowColorImageModal(false)}
                                    className="text-white hover:text-purple-200 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Add New Image */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Image</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter image URL"
                                            value={newColorImage.imageUrl}
                                            onChange={(e) => setNewColorImage(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter image description"
                                            value={newColorImage.description}
                                            onChange={(e) => setNewColorImage(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isMainColor"
                                            checked={newColorImage.isMain}
                                            onChange={(e) => setNewColorImage(prev => ({ ...prev, isMain: e.target.checked }))}
                                            className="mr-2"
                                        />
                                        <label htmlFor="isMainColor" className="text-sm text-gray-700">
                                            Set as main image for this color
                                        </label>
                                    </div>
                                    <Button
                                        onClick={handleAddColorImage}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                                    >
                                        Add Image
                                    </Button>
                                </div>
                            </div>

                            {/* Existing Images */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Images</h3>
                                {selectedProduct.colorImages && selectedProduct.colorImages.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedProduct.colorImages
                                            .filter(img => img.colorId === selectedColorForImageModal.id)
                                            .map((image) => (
                                                <div key={image.id} className="border rounded-lg p-4">
                                                    <div className="relative group">
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.description || `Color ${selectedColorForImageModal.name} image`}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Error'
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleEditColorImage(image)}
                                                                    className="bg-purple-600 text-white p-2 rounded-full mr-2"
                                                                    title="Edit image"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveColorImage(image.id)}
                                                                    className="bg-red-600 text-white p-2 rounded-full"
                                                                    title="Remove image"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {image.isMain && (
                                                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                                                Main
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600">{image.description || 'No description'}</p>
                                                        <div className="flex items-center mt-1">
                                                            <div
                                                                className="w-4 h-4 rounded-full mr-2 border"
                                                                style={{ backgroundColor: image.colorCode }}
                                                            ></div>
                                                            <span className="text-xs text-gray-500">{image.colorName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No images added for this color yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowColorImageModal(false)}
                                    className="px-6 py-2"
                                >
                                    Close
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
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </main>
    )
}


