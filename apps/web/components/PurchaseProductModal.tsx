'use client'

import { useState, useEffect } from 'react';
import { Button, Card, CardContent } from '@retail/ui';
import { Product } from '@retail/shared';
import toast from 'react-hot-toast';

interface PurchaseProductModalProps {
    products: Product[];
    isOpen: boolean;
    onClose: () => void;
    onProductSelect: (product: Product) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function PurchaseProductModal({
    products,
    isOpen,
    onClose,
    onProductSelect,
    searchQuery,
    onSearchChange
}: PurchaseProductModalProps) {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Filter products based on search query
    useEffect(() => {
        const filtered = products.filter(product => {
            const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesQuery;
        });
        setFilteredProducts(filtered);
    }, [products, searchQuery]);

    if (!isOpen) return null;

    const handleProductSelect = (product: Product) => {
        onProductSelect(product);
        onClose();
        toast.success(`${product.name} added to purchase order`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Select Products for Purchase</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Search by name, SKU, barcode, or category..."
                        className="w-full border rounded px-3 py-2"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        autoFocus
                    />
                    <div className="mt-2 text-sm text-gray-500">
                        Found {filteredProducts.length} products
                    </div>
                </div>

                {/* Products Grid */}
                <div className="p-4">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-3">
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
                                                <h4 className="font-medium text-gray-900 text-sm truncate" title={product.name}>
                                                    {product.name}
                                                </h4>
                                                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                                                {product.barcode && (
                                                    <p className="text-xs text-gray-500">Barcode: {product.barcode}</p>
                                                )}
                                                <p className="text-xs text-gray-500">Category: {product.category}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div>
                                                        <span className="text-sm font-semibold text-gray-900">₹{product.costPrice}</span>
                                                        <span className="text-xs text-gray-500 ml-1">(Cost)</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-gray-500">MRP: ₹{product.mrp}</span>
                                                    <span className="text-xs text-gray-500">Unit: {product.unit}</span>
                                                </div>
                                                <Button
                                                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1"
                                                    onClick={() => handleProductSelect(product)}
                                                    disabled={product.stock === 0}
                                                >
                                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Purchase'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Click on a product to add it to your purchase order
                        </div>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-sm"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
