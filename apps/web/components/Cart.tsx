'use client'

import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardContent } from '@retail/ui';
import { RootState, AppDispatch, updateCartItem, removeFromCart } from '@retail/shared';

export default function Cart() {
    const dispatch = useDispatch<AppDispatch>();
    const { cart, subtotal, discount, tax, total } = useSelector((state: RootState) => state.sales);

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity > 0) {
            dispatch(updateCartItem({ id, quantity: newQuantity }));
        } else {
            dispatch(removeFromCart(id));
        }
    };

    const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
    };

    if (cart.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-sm">No items in cart</p>
                        <p className="text-xs text-gray-400 mt-1">Add products to start a sale</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                <th className="px-3 py-2 text-left">#</th>
                                <th className="px-3 py-2 text-left">DESCRIPTION</th>
                                <th className="px-3 py-2 text-left">SIZE</th>
                                <th className="px-3 py-2 text-left">COLOR</th>
                                <th className="px-3 py-2 text-left">MRP</th>
                                <th className="px-3 py-2 text-left">QTY</th>
                                <th className="px-3 py-2 text-left">UNIT</th>
                                <th className="px-3 py-2 text-right">PRICE</th>
                                <th className="px-3 py-2 text-right">RATE</th>
                                <th className="px-3 py-2 text-right">VALUE</th>
                                <th className="px-3 py-2 text-right">DISC.</th>
                                <th className="px-3 py-2 text-right">GST%</th>
                                <th className="px-3 py-2 text-right">TOTAL VALUE</th>
                                <th className="px-3 py-2 text-right"> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2">
                                        <div>
                                            <div className="font-medium">{item.productName}</div>
                                            <div className="text-gray-500 text-[10px]">SKU: {item.sku}</div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        {item.size ? (
                                            <div>
                                                <div>{item.size}</div>
                                                <div className="text-[10px] text-gray-500">
                                                    Stock: {item.product.sizes.find(s => s.name === item.size)?.stock || 0}
                                                </div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-3 py-2">{item.color || '-'}</td>
                                    <td className="px-3 py-2">{item.product.mrp}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                className="h-5 w-5 p-0 text-xs"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </Button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                                className="w-12 text-center border rounded px-1 py-0.5 text-xs"
                                                min="1"
                                                max={item.size ? (item.product.sizes.find(s => s.name === item.size)?.stock || 0) : item.product.stock}
                                            />
                                            <Button
                                                variant="outline"
                                                className="h-5 w-5 p-0 text-xs"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= (item.size ? (item.product.sizes.find(s => s.name === item.size)?.stock || 0) : item.product.stock)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">{item.product.unit}</td>
                                    <td className="px-3 py-2 text-right">{item.unitPrice}</td>
                                    <td className="px-3 py-2 text-right">{item.unitPrice}</td>
                                    <td className="px-3 py-2 text-right">{item.quantity * item.unitPrice}</td>
                                    <td className="px-3 py-2 text-right">{item.discount}</td>
                                    <td className="px-3 py-2 text-right">5%</td>
                                    <td className="px-3 py-2 text-right font-medium">{item.total}</td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Button
                                                variant="outline"
                                                className="h-6 px-2 text-xs"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                🗑
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Cart Summary */}
                <div className="px-3 py-2 bg-gray-50 border-t">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                            <span>Total Items: {cart.length}</span>
                            <span>Total Qty: {cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-medium">Subtotal: ₹{subtotal.toFixed(2)}</div>
                            <div className="text-gray-500">Discount: ₹{discount.toFixed(2)}</div>
                            <div className="text-gray-500">GST (5%): ₹{tax.toFixed(2)}</div>
                            <div className="font-bold text-lg">Total: ₹{total.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
