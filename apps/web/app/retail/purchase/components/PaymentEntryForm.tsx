'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { PaymentEntry } from '@retail/shared'

interface PaymentEntryFormProps {
  paymentEntry: PaymentEntry
  remainingAmount: number
  advanceAmount: number
  onPaymentUpdate: (paymentData: Partial<PaymentEntry>) => void
  onAdvanceUpdate: (amount: number) => void
}

const PAYMENT_TYPES = [
  { type: 'cash', label: 'Cash', icon: '💵' },
  { type: 'cheque', label: 'Cheque', icon: '📄' },
  { type: 'credit', label: 'Credit', icon: '💳' },
  { type: 'discount', label: 'Discount', icon: '🏷️' },
  { type: 'upi', label: 'UPI', icon: '📱' }
] as const

export default function PaymentEntryForm({
  paymentEntry,
  remainingAmount,
  advanceAmount,
  onPaymentUpdate,
  onAdvanceUpdate
}: PaymentEntryFormProps) {
  const [localAdvanceAmount, setLocalAdvanceAmount] = useState(advanceAmount.toString())
  const [selectedTypes, setSelectedTypes] = useState<string[]>(paymentEntry.transactionTypes || [])
  const [amounts, setAmounts] = useState(paymentEntry.amounts || {})

  useEffect(() => {
    setSelectedTypes(paymentEntry.transactionTypes || [])
    setAmounts(paymentEntry.amounts || {})
  }, [paymentEntry])

  const handleAdvanceChange = (value: string) => {
    setLocalAdvanceAmount(value)
    const amount = parseFloat(value) || 0
    onAdvanceUpdate(amount)
  }

  const handleTransactionTypeChange = (type: string, checked: boolean) => {
    let newTypes: string[]
    if (checked) {
      newTypes = [...selectedTypes, type]
    } else {
      newTypes = selectedTypes.filter(t => t !== type)
      // Clear amount for unchecked type
      const newAmounts = { ...amounts }
      delete newAmounts[type as keyof typeof amounts]
      setAmounts(newAmounts)
    }
    setSelectedTypes(newTypes)
    onPaymentUpdate({
      transactionTypes: newTypes as PaymentEntry['transactionTypes'],
      amounts: checked ? amounts : { ...amounts, [type]: undefined }
    })
  }

  const handleAmountChange = (type: string, value: string) => {
    const amount = parseFloat(value) || 0
    const newAmounts = { ...amounts, [type]: amount }
    setAmounts(newAmounts)
    onPaymentUpdate({ amounts: newAmounts })
  }

  const handlePaymentDateChange = (value: string) => {
    onPaymentUpdate({ paymentDate: value })
  }

  const handleReferenceChange = (value: string) => {
    onPaymentUpdate({ reference: value })
  }

  const getTotalAmount = () => {
    return Object.values(amounts).reduce((sum, amount) => sum + (amount || 0), 0)
  }

  const getTypeConfig = (type: string) => {
    return PAYMENT_TYPES.find(p => p.type === type) || { type, label: 'Amount', icon: '💰' }
  }

  return (
    <Card className="payment-form">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Payment Entry for Bill No: {paymentEntry.reference || 'N/A'}</CardTitle>
        <p className="text-xs text-gray-600">
          Remaining Bill Amount: ₹{remainingAmount.toFixed(2)}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {/* Transaction Types */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Payment Methods (Select Multiple):
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PAYMENT_TYPES.map(({ type, label, icon }) => (
              <label key={type} className="flex items-center space-x-1 p-1.5 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => handleTransactionTypeChange(type, e.target.checked)}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-xs font-medium">{icon} {label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advance Amount */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Advance Amount:
          </label>
          <Input
            type="number"
            step="0.01"
            value={localAdvanceAmount}
            onChange={(e) => handleAdvanceChange(e.target.value)}
            placeholder="0.00"
            className="w-full text-xs h-7"
          />
        </div>

        {/* Payment Amounts for Selected Methods */}
        {selectedTypes.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Payment Amounts:
            </label>
            <div className="space-y-2">
              {selectedTypes.map(type => {
                const typeConfig = getTypeConfig(type)

                return (
                  <div key={type} className="flex items-center space-x-2">
                    <span className="text-xs font-medium w-20">{typeConfig.icon} {typeConfig.label}:</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={amounts[type as keyof typeof amounts] || ''}
                      onChange={(e) => handleAmountChange(type, e.target.value)}
                      placeholder="0.00"
                      className="flex-1 text-xs h-7"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment Date */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Payment Date:
          </label>
          <Input
            type="date"
            value={paymentEntry.paymentDate}
            onChange={(e) => handlePaymentDateChange(e.target.value)}
            className="w-full text-xs h-7"
          />
        </div>

        {/* Reference */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Reference:
          </label>
          <Input
            value={paymentEntry.reference || ''}
            onChange={(e) => handleReferenceChange(e.target.value)}
            placeholder="Enter reference number"
            className="w-full text-xs h-7"
          />
        </div>

        {/* Cheque Details (if cheque selected) */}
        {selectedTypes.includes('cheque') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cheque No:
              </label>
              <Input
                value={paymentEntry.chequeNo || ''}
                onChange={(e) => onPaymentUpdate({ chequeNo: e.target.value })}
                placeholder="Enter cheque number"
                className="w-full text-xs h-7"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bank Name:
              </label>
              <Input
                value={paymentEntry.bankName || ''}
                onChange={(e) => onPaymentUpdate({ bankName: e.target.value })}
                placeholder="Enter bank name"
                className="w-full text-xs h-7"
              />
            </div>
          </div>
        )}

        {/* UPI Details (if UPI selected) */}
        {selectedTypes.includes('upi') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                UPI ID:
              </label>
              <Input
                value={paymentEntry.upiId || ''}
                onChange={(e) => onPaymentUpdate({ upiId: e.target.value })}
                placeholder="Enter UPI ID (e.g., 1234567890@paytm)"
                className="w-full text-xs h-7"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                UPI Transaction ID:
              </label>
              <Input
                value={paymentEntry.upiTransactionId || ''}
                onChange={(e) => onPaymentUpdate({ upiTransactionId: e.target.value })}
                placeholder="Enter UPI transaction ID"
                className="w-full text-xs h-7"
              />
            </div>
          </div>
        )}

        {/* Discount Reason (if discount selected) */}
        {selectedTypes.includes('discount') && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Discount Reason:
            </label>
            <Input
              value={paymentEntry.discountReason || ''}
              onChange={(e) => onPaymentUpdate({ discountReason: e.target.value })}
              placeholder="Enter reason for discount"
              className="w-full text-xs h-7"
            />
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-gray-50 p-2 rounded">
          <h4 className="font-medium text-gray-900 mb-1 text-xs">Payment Summary</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Total Bill Amount:</span>
              <span>₹{(remainingAmount + advanceAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Advance Amount:</span>
              <span>₹{advanceAmount.toFixed(2)}</span>
            </div>

            {/* Individual Payment Method Amounts */}
            {selectedTypes.map(type => {
              const amount = amounts[type as keyof typeof amounts] || 0
              const typeConfig = getTypeConfig(type)

              if (amount <= 0) return null

              return (
                <div key={type} className="flex justify-between">
                  <span>{typeConfig.icon} {typeConfig.label}:</span>
                  <span>₹{amount.toFixed(2)}</span>
                </div>
              )
            })}

            <div className="flex justify-between font-medium border-t pt-1">
              <span>Total Payment:</span>
              <span>₹{getTotalAmount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-1">
              <span>Remaining Amount:</span>
              <span>₹{(remainingAmount - getTotalAmount()).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}