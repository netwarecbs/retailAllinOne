'use client'

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, CardContent } from '@retail/ui';
import { AppDispatch, addToCart } from '@retail/shared';
import toast, { Toaster } from 'react-hot-toast';

interface ProductSelectionModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
    onProductSelect?: (product: any) => void;
}

export default function ProductSelectionModal({
    product,
    isOpen,
    onClose,
    onProductSelect
}: ProductSelectionModalProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    // Reset selections when modal opens with new product
    useEffect(() => {
        if (isOpen && product) {
            setSelectedSize('');
            setSelectedColor('');
            setQuantity(1);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes.length > 0) {
            toast.error('Please select a size for this product', {
                duration: 3000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
            return;
        }

        setLoading(true);

        // Add to cart with selected options
        dispatch(addToCart({
            product,
            quantity,
            size: selectedSize,
            color: selectedColor
        }));

        // Show success toast
        toast.success(`${product.name} added to cart successfully!`, {
            duration: 2000,
            style: {
                background: '#10B981',
                color: '#fff',
            },
        });

        onProductSelect?.(product);

        // Close modal after a brief delay to show success
        setTimeout(() => {
            setLoading(false);
            onClose();
        }, 500);
    };

    const getMaxQuantity = () => {
        if (selectedSize) {
            const sizeData = product.sizes.find((s: any) => s.name === selectedSize);
            return sizeData ? sizeData.stock : 0;
        }
        return product.stock;
    };

    const maxQuantity = getMaxQuantity();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Select Product Options</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4 border-b">
                    <div className="flex items-start gap-4">
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
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                            <p className="text-sm text-gray-500">Category: {product.category}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                                <span className="text-sm text-gray-500">MRP: ₹{product.mrp}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="p-4 border-b">
                        <h5 className="font-medium text-gray-900 mb-3">Select Size</h5>
                        <div className="grid grid-cols-3 gap-2">
                            {product.sizes.map((size: any) => (
                                <button
                                    key={size.id}
                                    onClick={() => setSelectedSize(size.name)}
                                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${selectedSize === size.name
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={size.stock === 0}
                                >
                                    <div>{size.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Stock: {size.stock}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                    <div className="p-4 border-b">
                        <h5 className="font-medium text-gray-900 mb-3">Select Color</h5>
                        <div className="grid grid-cols-4 gap-2">
                            {product.colors.map((color: any) => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${selectedColor === color.name
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                        } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={color.stock === 0}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color.code }}
                                        />
                                        <span>{color.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Stock: {color.stock}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity Selection */}
                <div className="p-4 border-b">
                    <h5 className="font-medium text-gray-900 mb-3">Quantity</h5>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="w-10 h-10 p-0"
                        >
                            -
                        </Button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                setQuantity(Math.max(1, Math.min(value, maxQuantity)));
                            }}
                            className="w-20 text-center border rounded px-2 py-1"
                            min="1"
                            max={maxQuantity}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                            disabled={quantity >= maxQuantity}
                            className="w-10 h-10 p-0"
                        >
                            +
                        </Button>
                        <span className="text-sm text-gray-500">
                            Max: {maxQuantity}
                        </span>
                    </div>
                </div>

                {/* Summary */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Price:</p>
                            <p className="text-lg font-semibold text-gray-900">₹{(product.price * quantity).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                            <p className="text-sm text-gray-600">
                                {selectedSize && `Size: ${selectedSize}`}
                                {selectedColor && ` | Color: ${selectedColor}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddToCart}
                        disabled={loading || (product.sizes.length > 0 && !selectedSize) || maxQuantity === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                </div>
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
