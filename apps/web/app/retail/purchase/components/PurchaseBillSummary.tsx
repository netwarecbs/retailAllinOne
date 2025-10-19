'use client'

import { Card, CardContent, CardHeader, CardTitle, Button } from '@retail/ui'

interface PurchaseBillSummaryProps {
  totals: {
    discount: number
    taxableValue: number
    sgst: number
    cgst: number
    total: number
  }
  remainingAmount: number
  onSubmit: () => void
}

export default function PurchaseBillSummary({
  totals,
  remainingAmount,
  onSubmit
}: PurchaseBillSummaryProps) {
  return (
    <Card className="bill-summary">
      <CardHeader>
        <CardTitle>Bill Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totals Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Discount:</span>
            <span>₹{totals.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxable Value:</span>
            <span>₹{totals.taxableValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>S.GST:</span>
            <span>₹{totals.sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>C.GST:</span>
            <span>₹{totals.cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium border-t pt-2">
            <span>Total:</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Remaining Amount:</span>
            <span className="text-lg font-bold text-gray-900">
              ₹{remainingAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={onSubmit}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={remainingAmount > 0}
          >
            {remainingAmount > 0 ? 'Complete Payment First' : 'Final Submit'}
          </Button>
        </div>

        {/* Payment Status */}
        {remainingAmount === 0 && (
          <div className="text-center text-green-600 text-sm">
            ✓ Payment Complete - Ready to Submit
          </div>
        )}
      </CardContent>
    </Card>
  )
}
