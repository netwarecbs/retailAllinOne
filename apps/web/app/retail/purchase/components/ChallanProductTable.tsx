'use client'

import { Card, CardContent, CardHeader, CardTitle, Input } from '@retail/ui'
import { PurchaseBillProduct } from '@retail/shared'

interface ChallanProductTableProps {
  products: PurchaseBillProduct[]
  onProductUpdate: (productId: string, field: string, value: any) => void
  onProductSelection?: (productId: string, isSelected: boolean) => void
  onPartialPayment?: (productId: string, paymentData: Partial<PartialPaymentEntry>) => void
  showSelection?: boolean
  showPaymentStatus?: boolean
}

export default function ChallanProductTable({
  products,
  onProductUpdate,
  onProductSelection,
  onPartialPayment,
  showSelection = false,
  showPaymentStatus = false
}: ChallanProductTableProps) {
  const handleInputChange = (productId: string, field: string, value: string | number) => {
    onProductUpdate(productId, field, value)
  }

  const handleSelectionChange = (productId: string, isSelected: boolean) => {
    if (onProductSelection) {
      onProductSelection(productId, isSelected)
    }
  }

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'fully_paid':
        return 'bg-green-100 text-green-800'
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'unpaid':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status?: string) => {
    switch (status) {
      case 'fully_paid':
        return 'Paid'
      case 'partially_paid':
        return 'Partial'
      case 'pending':
        return 'Pending'
      case 'unpaid':
      default:
        return 'Unpaid'
    }
  }

  return (
    <Card className="product-table">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Product Details</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {showSelection && (
                  <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Select</th>
                )}
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Sl No.</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Product</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Qty</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Rate *</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Discount</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Taxable Value</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">S.GST *</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">C.GST *</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Bill No *</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Date *</th>
                <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Total</th>
                {showPaymentStatus && (
                  <th className="text-left py-1 px-2 text-xs font-medium text-gray-600">Payment Status</th>
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.productId} className={`border-b hover:bg-gray-50 ${!product.isEditable ? 'bg-gray-50' : ''}`}>
                  {showSelection && (
                    <td className="py-1 px-2 text-xs">
                      <input
                        type="checkbox"
                        checked={product.isSelected || false}
                        onChange={(e) => handleSelectionChange(product.productId, e.target.checked)}
                        disabled={!product.isEditable}
                        className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  <td className="py-1 px-2 text-xs">{product.slNo}</td>
                  <td className="py-1 px-2 text-xs">
                    <div>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                    </div>
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleInputChange(product.productId, 'quantity', Number(e.target.value))}
                      className="w-16 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={product.rate}
                      onChange={(e) => handleInputChange(product.productId, 'rate', Number(e.target.value))}
                      className="w-20 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={product.discount}
                      onChange={(e) => handleInputChange(product.productId, 'discount', Number(e.target.value))}
                      className="w-16 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={product.taxableValue}
                      onChange={(e) => handleInputChange(product.productId, 'taxableValue', Number(e.target.value))}
                      className="w-20 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={product.sgst}
                      onChange={(e) => handleInputChange(product.productId, 'sgst', Number(e.target.value))}
                      className="w-16 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={product.cgst}
                      onChange={(e) => handleInputChange(product.productId, 'cgst', Number(e.target.value))}
                      className="w-16 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      value={product.billNo}
                      onChange={(e) => handleInputChange(product.productId, 'billNo', e.target.value)}
                      className="w-16 text-xs h-7"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="date"
                      value={product.billDate}
                      onChange={(e) => handleInputChange(product.productId, 'billDate', e.target.value)}
                      className="w-20 text-xs h-7"
                      disabled={!product.isEditable}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={product.total}
                      onChange={(e) => handleInputChange(product.productId, 'total', Number(e.target.value))}
                      className="w-20 text-xs h-7"
                      min="0"
                      disabled={!product.isEditable}
                    />
                  </td>
                  {showPaymentStatus && (
                    <td className="py-1 px-2 text-xs">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(product.paymentStatus)}`}>
                        {getPaymentStatusText(product.paymentStatus)}
                      </span>
                      {product.partialPaymentAmount && product.paymentStatus === 'partially_paid' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Paid: ₹{product.partialPaymentAmount.toFixed(2)}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-gray-50">
                {showSelection && <td></td>}
                <td colSpan={5} className="py-1 px-2 text-xs font-medium text-right">
                  Total:
                </td>
                <td className="py-1 px-2 text-xs font-medium">
                  ₹{products.reduce((sum, p) => sum + p.taxableValue, 0).toFixed(2)}
                </td>
                <td className="py-1 px-2 text-xs font-medium">
                  ₹{products.reduce((sum, p) => sum + p.sgst, 0).toFixed(2)}
                </td>
                <td className="py-1 px-2 text-xs font-medium">
                  ₹{products.reduce((sum, p) => sum + p.cgst, 0).toFixed(2)}
                </td>
                <td colSpan={2}></td>
                <td className="py-1 px-2 text-xs font-medium">
                  ₹{products.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
                </td>
                {showPaymentStatus && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
