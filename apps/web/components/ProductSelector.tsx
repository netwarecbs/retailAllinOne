'use client'

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardContent } from '@retail/ui';
import { RootState, AppDispatch, fetchProducts, searchProductsByBarcode, sampleCategories } from '@retail/shared';
import ProductSelectionModal from './ProductSelectionModal';
import AdvancedSearchModal from './AdvancedSearchModal';

interface ProductSelectorProps {
    onProductSelect?: (product: any) => void;
}

export default function ProductSelector({ onProductSelect }: ProductSelectorProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const { cart } = useSelector((state: RootState) => state.sales);

    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeQuery, setBarcodeQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showProductList, setShowProductList] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [filteredProductsList, setFilteredProductsList] = useState<any[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load initial products
        dispatch(fetchProducts());
    }, [dispatch]);

    // Auto-complete functionality
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered.slice(0, 5)); // Show max 5 results
            setShowDropdown(true);
        } else {
            setFilteredProducts([]);
            setShowDropdown(false);
        }
    }, [searchQuery, products]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter products when category changes
    useEffect(() => {
        if (showProductList) {
            if (selectedCategory) {
                const filtered = products.filter(product => product.category === selectedCategory);
                setFilteredProductsList(filtered);
            } else {
                setFilteredProductsList(products);
            }
        }
    }, [selectedCategory, products, showProductList]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            dispatch(fetchProducts({ query: searchQuery, category: selectedCategory }));
            setShowProductList(true);
            setShowDropdown(false);
        }
    };

    const handleBarcodeSearch = () => {
        if (barcodeQuery.trim()) {
            dispatch(searchProductsByBarcode(barcodeQuery));
            setShowProductList(true);
        }
    };

    const handleProductSelect = (product: any) => {
        setSelectedProduct(product);
        setShowModal(true);
        setShowProductList(false);
        setShowDropdown(false);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setSearchQuery('');
        setBarcodeQuery('');
    };

    const handleModalProductSelect = (product: any) => {
        onProductSelect?.(product);
    };

    const handleAdvancedSearchOpen = () => {
        setShowAdvancedSearch(true);
    };

    const handleAdvancedSearchClose = () => {
        setShowAdvancedSearch(false);
    };

    const handleAdvancedSearchProductSelect = (product: any) => {
        onProductSelect?.(product);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (stock < 10) return { text: 'Low Stock', color: 'text-yellow-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    return (
        <div className="space-y-4">
            {/* Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-gray-600 mb-1 text-xs">Search Products</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Product name, SKU, or description"
                            className="flex-1 border rounded px-2 py-1 text-xs"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                        />
                        <Button
                            onClick={handleSearch}
                            className="h-7 bg-blue-600 hover:bg-blue-700 text-xs px-3"
                        >
                            Search
                        </Button>
                        <button
                            onClick={handleAdvancedSearchOpen}
                            className="h-7 w-7 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center justify-center transition-colors"
                            title="Advanced Search"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </button>
                    </div>

                    {/* Auto-complete Dropdown */}
                    {showDropdown && filteredProducts.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                SKU: {product.sku} | ₹{product.price}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Sizes: {product.sizes.map(size => `${size.name}(${size.stock})`).join(', ')}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Total: {product.stock}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-gray-600 mb-1 text-xs">Barcode</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={barcodeQuery}
                            onChange={(e) => setBarcodeQuery(e.target.value)}
                            placeholder="Scan barcode"
                            className="flex-1 border rounded px-2 py-1 text-xs"
                            onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                        />
                        <Button
                            onClick={handleBarcodeSearch}
                            className="h-7 bg-green-600 hover:bg-green-700 text-xs px-3"
                        >
                            Scan
                        </Button>
                    </div>
                </div>

                {showProductList && (
                    <div>
                        <label className="block text-gray-600 mb-1 text-xs">Filter by Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-xs"
                        >
                            <option value="">All Categories</option>
                            {sampleCategories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Product List */}
            {showProductList && (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading products...</div>
                            ) : error ? (
                                <div className="p-4 text-center text-red-500">{error}</div>
                            ) : filteredProductsList.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    {selectedCategory ? `No products found in ${selectedCategory}` : 'No products found'}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {filteredProductsList.map((product) => {
                                        const stockStatus = getStockStatus(product.stock);
                                        return (
                                            <div
                                                key={product.id}
                                                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => handleProductSelect(product)}
                                            >
                                                <div className="flex items-start gap-3">
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
                                                        <h4 className="font-medium text-sm text-gray-900 truncate">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            SKU: {product.sku}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Category: {product.category}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
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
                                                                    Sizes: {product.sizes.map(s => `${s.name}(${s.stock})`).join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
                <Button
                    onClick={() => setShowProductList(!showProductList)}
                    variant="outline"
                    className="h-8 text-xs px-4"
                >
                    {showProductList ? 'Hide Products' : 'Show All Products'}
                </Button>
                <Button
                    onClick={() => {
                        setSearchQuery('');
                        setBarcodeQuery('');
                        setSelectedCategory('');
                        setShowProductList(false);
                        setFilteredProductsList([]);
                    }}
                    variant="outline"
                    className="h-8 text-xs px-4"
                >
                    Clear
                </Button>
            </div>

            {/* Product Selection Modal */}
            <ProductSelectionModal
                product={selectedProduct}
                isOpen={showModal}
                onClose={handleModalClose}
                onProductSelect={handleModalProductSelect}
            />

            {/* Advanced Search Modal */}
            <AdvancedSearchModal
                isOpen={showAdvancedSearch}
                onClose={handleAdvancedSearchClose}
                onProductSelect={handleAdvancedSearchProductSelect}
            />
        </div>
    );
}
