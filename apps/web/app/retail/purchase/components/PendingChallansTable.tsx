'use client'

import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'
import { Challan } from '@retail/shared'

interface PendingChallansTableProps {
  challans: Challan[]
  selectedChallans: string[]
  onChallanSelect: (challanId: string) => void
  onChallanDeselect: (challanId: string) => void
}

export default function PendingChallansTable({
  challans,
  selectedChallans,
  onChallanSelect,
  onChallanDeselect
}: PendingChallansTableProps) {
  if (challans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Challans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No pending challans found for the selected vendor.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="challans-table">
      <CardHeader>
        <CardTitle>Pending Challans</CardTitle>
        <p className="text-sm text-gray-600">
          Select challans to create purchase bill
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challans.map(challan => {
            const isSelected = selectedChallans.includes(challan.id)
            return (
              <div
                key={challan.id}
                className={`p-4 border rounded-lg ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        isSelected
                          ? onChallanDeselect(challan.id)
                          : onChallanSelect(challan.id)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Challan No: {challan.challanNo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Date: {challan.challanDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        Products: {challan.products.length} items
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{challan.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {challan.products.length} products
                    </p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-3 ml-6">
                  <div className="text-sm text-gray-600">
                    <strong>Products:</strong>
                  </div>
                  <div className="mt-1 space-y-1">
                    {challan.products.map((product, index) => (
                      <div key={index} className="text-sm text-gray-500">
                        • {product.productName} - Qty: {product.quantity} - ₹{product.totalPrice.toLocaleString()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selectedChallans.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{selectedChallans.length}</strong> challan(s) selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
