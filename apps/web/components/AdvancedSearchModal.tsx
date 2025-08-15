'use client'

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardContent } from '@retail/ui';
import { RootState, AppDispatch, fetchProducts, sampleCategories, addToCart } from '@retail/shared';
import toast, { Toaster } from 'react-hot-toast';

interface AdvancedSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductSelect?: (product: any) => void;
}

interface SearchFilters {
    query: string;
    category: string;
    subcategory: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    minStock: string;
    maxStock: string;
    tags: string;
    isActive: boolean | null;
}

interface SelectedProduct {
    product: any;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
}

export default function AdvancedSearchModal({
    isOpen,
    onClose,
    onProductSelect
}: AdvancedSearchModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        category: '',
        subcategory: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        minStock: '',
        maxStock: '',
        tags: '',
        isActive: null
    });

    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
    const [uniqueSubcategories, setUniqueSubcategories] = useState<string[]>([]);

    // Extract unique brands and subcategories from products
    useEffect(() => {
        if (products.length > 0) {
            const brands = [...new Set(products.map(p => p.brand).filter((brand): brand is string => Boolean(brand)))].sort();
            const subcategories = [...new Set(products.map(p => p.subcategory).filter((subcategory): subcategory is string => Boolean(subcategory)))].sort();
            setUniqueBrands(brands);
            setUniqueSubcategories(subcategories);
        }
    }, [products]);

    // Apply filters when filters change
    useEffect(() => {
        if (isOpen) {
            applyFilters();
        }
    }, [filters, products, isOpen]);

    const applyFilters = () => {
        let filtered = [...products];

        // Text search
        if (filters.query.trim()) {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.sku.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                (product.barcode && product.barcode.includes(query))
            );
        }

        // Category filter
        if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Subcategory filter
        if (filters.subcategory) {
            filtered = filtered.filter(product => product.subcategory === filters.subcategory);
        }

        // Brand filter
        if (filters.brand) {
            filtered = filtered.filter(product => product.brand === filters.brand);
        }

        // Price range filter
        if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
        }

        // Stock range filter
        if (filters.minStock) {
            filtered = filtered.filter(product => product.stock >= parseInt(filters.minStock));
        }
        if (filters.maxStock) {
            filtered = filtered.filter(product => product.stock <= parseInt(filters.maxStock));
        }

        // Tags filter
        if (filters.tags.trim()) {
            const tagQuery = filters.tags.toLowerCase();
            filtered = filtered.filter(product =>
                product.tags.some((tag: string) => tag.toLowerCase().includes(tagQuery))
            );
        }

        // Active status filter
        if (filters.isActive !== null) {
            filtered = filtered.filter(product => product.isActive === filters.isActive);
        }

        setFilteredProducts(filtered);
    };

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            query: '',
            category: '',
            subcategory: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            minStock: '',
            maxStock: '',
            tags: '',
            isActive: null
        });
    };

    const handleProductToggle = (product: any) => {
        const existingIndex = selectedProducts.findIndex(sp => sp.product.id === product.id);

        if (existingIndex >= 0) {
            // Remove product
            setSelectedProducts(prev => prev.filter((_, index) => index !== existingIndex));
        } else {
            // Add product with default values
            setSelectedProducts(prev => [...prev, {
                product,
                selectedSize: '',
                selectedColor: '',
                quantity: 1
            }]);
        }
    };

    const handleSelectionModalOpen = () => {
        if (selectedProducts.length > 0) {
            setShowSelectionModal(true);
        }
    };

    const handleSelectionModalClose = () => {
        setShowSelectionModal(false);
        setSelectedProducts([]);
    };

    const handleProductConfigChange = (productId: string, field: keyof Omit<SelectedProduct, 'product'>, value: any) => {
        setSelectedProducts(prev => prev.map(sp =>
            sp.product.id === productId
                ? { ...sp, [field]: value }
                : sp
        ));

        // Clear validation error for this product if the issue is fixed
        if (field === 'selectedSize' && value) {
            setValidationErrors(prev => prev.filter(id => id !== productId));
        }
        if (field === 'quantity' && value > 0) {
            setValidationErrors(prev => prev.filter(id => id !== productId));
        }
    };

    const handleAddToCart = () => {
        // Validate all selections
        const invalidProducts = selectedProducts.filter(sp => {
            if (sp.product.sizes.length > 0 && !sp.selectedSize) return true;
            if (sp.quantity <= 0) return true;
            return false;
        });

        if (invalidProducts.length > 0) {
            // Track validation errors for highlighting
            const errorProductIds = invalidProducts.map(sp => sp.product.id);
            setValidationErrors(errorProductIds);

            // Show detailed error toast
            const errorMessages = invalidProducts.map(sp => {
                if (sp.product.sizes.length > 0 && !sp.selectedSize) {
                    return `"${sp.product.name}" - Please select a size`;
                }
                if (sp.quantity <= 0) {
                    return `"${sp.product.name}" - Please set a valid quantity`;
                }
                return `"${sp.product.name}" - Configuration incomplete`;
            });

            toast.error(
                <div>
                    <div className="font-semibold mb-2">Please fix the following issues:</div>
                    {errorMessages.map((msg, index) => (
                        <div key={index} className="text-sm">• {msg}</div>
                    ))}
                </div>,
                {
                    duration: 5000,
                    style: {
                        maxWidth: '500px',
                        padding: '16px',
                    },
                }
            );
            return;
        }

        // Clear any previous validation errors
        setValidationErrors([]);

        // Add all products to cart
        selectedProducts.forEach(sp => {
            dispatch(addToCart({
                product: sp.product,
                quantity: sp.quantity,
                size: sp.selectedSize,
                color: sp.selectedColor
            }));
        });

        // Show success toast
        toast.success(
            <div>
                <div className="font-semibold">Successfully added to cart!</div>
                <div className="text-sm text-gray-600">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} added
                </div>
            </div>,
            {
                duration: 3000,
                style: {
                    padding: '16px',
                },
            }
        );

        onProductSelect?.(selectedProducts[0].product); // Call with first product for compatibility
        handleSelectionModalClose();
        onClose();
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (stock < 10) return { text: 'Low Stock', color: 'text-yellow-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    const isProductSelected = (productId: string) => {
        return selectedProducts.some(sp => sp.product.id === productId);
    };

    const hasValidationError = (productId: string) => {
        return validationErrors.includes(productId);
    };

    const getProductValidationError = (productId: string) => {
        const selectedProduct = selectedProducts.find(sp => sp.product.id === productId);
        if (!selectedProduct) return null;

        if (selectedProduct.product.sizes.length > 0 && !selectedProduct.selectedSize) {
            return 'Size selection required';
        }
        if (selectedProduct.quantity <= 0) {
            return 'Invalid quantity';
        }
        return null;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Product Search</h3>
                    <div className="flex items-center gap-3">
                        {selectedProducts.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {selectedProducts.length} selected
                                </span>
                                <Button
                                    onClick={handleSelectionModalOpen}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                                >
                                    Configure & Add to Cart
                                </Button>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex h-[calc(90vh-80px)]">
                    {/* Filters Panel */}
                    <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
                        <h4 className="font-medium text-gray-900 mb-4">Search Filters</h4>

                        {/* Text Search */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Text
                            </label>
                            <input
                                type="text"
                                value={filters.query}
                                onChange={(e) => handleFilterChange('query', e.target.value)}
                                placeholder="Product name, SKU, description, barcode"
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">All Categories</option>
                                {sampleCategories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategory */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subcategory
                            </label>
                            <select
                                value={filters.subcategory}
                                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">All Subcategories</option>
                                {uniqueSubcategories.map((subcategory) => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Brand */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <select
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">All Brands</option>
                                {uniqueBrands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range (₹)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    placeholder="Min"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="Max"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Stock Range */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Range
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    value={filters.minStock}
                                    onChange={(e) => handleFilterChange('minStock', e.target.value)}
                                    placeholder="Min"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                                <input
                                    type="number"
                                    value={filters.maxStock}
                                    onChange={(e) => handleFilterChange('maxStock', e.target.value)}
                                    placeholder="Max"
                                    className="border rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={filters.tags}
                                onChange={(e) => handleFilterChange('tags', e.target.value)}
                                placeholder="Search by tags"
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Active Status */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.isActive === null ? '' : filters.isActive.toString()}
                                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? null : e.target.value === 'true')}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button
                                onClick={handleResetFilters}
                                variant="outline"
                                className="w-full"
                            >
                                Reset Filters
                            </Button>
                            <div className="text-xs text-gray-500 text-center">
                                {filteredProducts.length} products found
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4">
                            {loading ? (
                                <div className="text-center text-gray-500 py-8">Loading products...</div>
                            ) : error ? (
                                <div className="text-center text-red-500 py-8">{error}</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No products found matching your criteria
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredProducts.map((product) => {
                                        const stockStatus = getStockStatus(product.stock);
                                        const isSelected = isProductSelected(product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                                onClick={() => handleProductToggle(product)}
                                            >

                                                {/* First Row */}
                                                <div className="flex items-start gap-3 mb-3">
                                                    {/* Selection Indicator */}
                                                    {/* <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div> */}

                                                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        ) : (
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className={`text-xs font-medium ${stockStatus.color}`}>
                                                                {stockStatus.text}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                Stock: {product.stock}
                                                            </span>
                                                            {product.sizes && product.sizes.length > 0 && (
                                                                <span className="text-xs text-gray-500">
                                                                    Sizes: {product.sizes.map((s: any) => `${s.name}(${s.stock})`).join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {product.tags.slice(0, 3).map((tag: string, index: number) => (
                                                                    <span
                                                                        key={index}
                                                                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {product.tags.length > 3 && (
                                                                    <span className="text-xs text-gray-500">
                                                                        +{product.tags.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Second Row */}
                                                <div className="border-t pt-3">
                                                    <h4 className="font-medium text-sm text-gray-900 truncate">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        SKU: {product.sku}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {product.category} • {product.subcategory}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Brand: {product.brand}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Multi-Product Selection Modal */}
                {showSelectionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Configure Selected Products ({selectedProducts.length})
                                </h3>
                                <button
                                    onClick={handleSelectionModalClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="space-y-4">
                                    {selectedProducts.map((selectedProduct, index) => {
                                        const product = selectedProduct.product;
                                        const getMaxQuantity = () => {
                                            if (selectedProduct.selectedSize) {
                                                const sizeData = product.sizes.find((s: any) => s.name === selectedProduct.selectedSize);
                                                return sizeData ? sizeData.stock : 0;
                                            }
                                            return product.stock;
                                        };

                                        const hasError = hasValidationError(product.id);
                                        const errorMessage = getProductValidationError(product.id);

                                        return (
                                            <div key={product.id} className={`border rounded-lg p-4 ${hasError ? 'border-red-500 bg-red-50' : ''
                                                }`}>
                                                <div className="flex items-start gap-4">
                                                    {/* Product Image */}
                                                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        ) : (
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                                        <p className="text-sm text-gray-500">₹{product.price}</p>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleProductToggle(product)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Configuration Options */}
                                                <div className="mt-4 space-y-4">
                                                    {/* First Row - Size and Color */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Size Selection */}
                                                        {product.sizes && product.sizes.length > 0 && (
                                                            <div>
                                                                <label className={`block text-sm font-medium mb-2 ${hasError && !selectedProduct.selectedSize ? 'text-red-600' : 'text-gray-700'
                                                                    }`}>
                                                                    Size *
                                                                </label>
                                                                <select
                                                                    value={selectedProduct.selectedSize}
                                                                    onChange={(e) => handleProductConfigChange(product.id, 'selectedSize', e.target.value)}
                                                                    className={`w-full border rounded px-3 py-2 text-sm ${hasError && !selectedProduct.selectedSize ? 'border-red-500 focus:border-red-500' : ''
                                                                        }`}
                                                                >
                                                                    <option value="">Select Size</option>
                                                                    {product.sizes.map((size: any) => (
                                                                        <option key={size.id} value={size.name}>
                                                                            {size.name} (Stock: {size.stock})
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {hasError && !selectedProduct.selectedSize && (
                                                                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Color Selection */}
                                                        {product.colors && product.colors.length > 0 && (
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Color
                                                                </label>
                                                                <select
                                                                    value={selectedProduct.selectedColor}
                                                                    onChange={(e) => handleProductConfigChange(product.id, 'selectedColor', e.target.value)}
                                                                    className="w-full border rounded px-3 py-2 text-sm"
                                                                >
                                                                    <option value="">Select Color</option>
                                                                    {product.colors.map((color: any) => (
                                                                        <option key={color.id} value={color.name}>
                                                                            {color.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Second Row - Quantity */}
                                                    <div>
                                                        <label className={`block text-sm font-medium mb-2 ${hasError && selectedProduct.quantity <= 0 ? 'text-red-600' : 'text-gray-700'
                                                            }`}>
                                                            Quantity
                                                        </label>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleProductConfigChange(product.id, 'quantity', Math.max(1, selectedProduct.quantity - 1))}
                                                                className="w-8 h-8 border rounded flex items-center justify-center"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={selectedProduct.quantity}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value) || 1;
                                                                    const maxQty = getMaxQuantity();
                                                                    handleProductConfigChange(product.id, 'quantity', Math.max(1, Math.min(value, maxQty)));
                                                                }}
                                                                className={`w-16 text-center border rounded px-2 py-1 text-sm ${hasError && selectedProduct.quantity <= 0 ? 'border-red-500 focus:border-red-500' : ''
                                                                    }`}
                                                                min="1"
                                                                max={getMaxQuantity()}
                                                            />
                                                            <button
                                                                onClick={() => handleProductConfigChange(product.id, 'quantity', Math.min(getMaxQuantity(), selectedProduct.quantity + 1))}
                                                                className="w-8 h-8 border rounded flex items-center justify-center"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Max: {getMaxQuantity()}
                                                        </p>
                                                        {hasError && selectedProduct.quantity <= 0 && (
                                                            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Total Items: {selectedProducts.reduce((sum, sp) => sum + sp.quantity, 0)}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleSelectionModalClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddToCart}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Add All to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
        </div>
    );
}
