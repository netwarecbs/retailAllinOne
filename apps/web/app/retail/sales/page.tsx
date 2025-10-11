'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { RootState, AppDispatch } from '@retail/shared'
import { addCustomer, updateStock } from '@retail/shared'

interface SalesProduct {
  slNo: number
  productId: string
  productName: string
  inStock: number
  avgRate: number
  qty: number
  gstRate: number
  rate: number
  gross: number
  discount: number
  taxableValue: number
  sgst: number
  cgst: number
  invoiceValue: number
}

interface SalesForm {
  billNo: string
  billDate: string
  customerType: string
  customerName: string
  customerId: string
  customerDescription: string
  customerDetails: {
    id: string
    name: string
    fatherName: string
    address: string
    pincode: string
    contactNo: string
    mfmsId: string
    panNo: string
    gstNo: string
  }
  products: SalesProduct[]
  roundOff: number
  freightAmt: number
  totalAfterRoundOff: number
  paymentMethod: string
  paymentDetails: {
    cash: number
    cheque: number
    upi: number
    phonepe: number
    paytm: number
    gpay: number
    credit: number
    savingAccount: number
  }
  remarks: string
}

interface SalesReturnForm {
  returnType: 'bill_wise' | 'product_wise'
  billNo: string
  billDate: string
  customerName: string
  customerType: string
  returnProducts: SalesProduct[]
  returnReason: string
  returnDate: string
  totalReturnValue: number
}

interface SalesRecord {
  siNo: number
  billNo: string
  billDate: string
  customerName: string
  customerType: string
  taxableValue: number
  totalGstValue: number
  netValue: number
  products: SalesProduct[]
}

export default function SalesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { products, customers } = useSelector((state: RootState) => state.products)

  const [isLoading, setIsLoading] = useState(true)
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false)
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [showProductSuggestions, setShowProductSuggestions] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [selectedProductCategory, setSelectedProductCategory] = useState('')
  const [showSalesReturn, setShowSalesReturn] = useState(false)
  const [billSearchTerm, setBillSearchTerm] = useState('')
  const [showBillSuggestions, setShowBillSuggestions] = useState(false)

  const [form, setForm] = useState<SalesForm>({
    billNo: '',
    billDate: new Date().toLocaleDateString('en-GB'),
    customerType: '',
    customerName: '',
    customerId: '',
    customerDescription: '',
    customerDetails: {
      id: '',
      name: '',
      fatherName: '',
      address: '',
      pincode: '',
      contactNo: '',
      mfmsId: '',
      panNo: '',
      gstNo: ''
    },
    products: [{
      slNo: 1,
      productId: '',
      productName: '',
      inStock: 0,
      avgRate: 0,
      qty: 0,
      gstRate: 0,
      rate: 0,
      gross: 0,
      discount: 0,
      taxableValue: 0,
      sgst: 0,
      cgst: 0,
      invoiceValue: 0
    }],
    roundOff: 0,
    freightAmt: 0,
    totalAfterRoundOff: 0,
    paymentMethod: '',
    paymentDetails: {
      cash: 0,
      cheque: 0,
      upi: 0,
      phonepe: 0,
      paytm: 0,
      gpay: 0,
      credit: 0,
      savingAccount: 0
    },
    remarks: ''
  })

  const [returnForm, setReturnForm] = useState<SalesReturnForm>({
    returnType: 'bill_wise',
    billNo: '',
    billDate: '',
    customerName: '',
    customerType: '',
    returnProducts: [],
    returnReason: '',
    returnDate: new Date().toLocaleDateString('en-GB'),
    totalReturnValue: 0
  })

  // Sample sales records - in real app, this would come from Redux
  const [salesRecords] = useState<SalesRecord[]>([
    {
      siNo: 5692,
      billNo: 'BILL-001',
      billDate: '15-01-2024',
      customerName: 'Rahul Sharma',
      customerType: 'Regular',
      taxableValue: 1500,
      totalGstValue: 270,
      netValue: 1770,
      products: [{
        slNo: 1,
        productId: 'RT001',
        productName: 'Parle-G Biscuit 100g',
        inStock: 50,
        avgRate: 6,
        qty: 10,
        gstRate: 5,
        rate: 10,
        gross: 100,
        discount: 0,
        taxableValue: 100,
        sgst: 2.5,
        cgst: 2.5,
        invoiceValue: 105
      }]
    },
    {
      siNo: 5693,
      billNo: 'BILL-002',
      billDate: '16-01-2024',
      customerName: 'Priya Singh',
      customerType: 'VIP',
      taxableValue: 2500,
      totalGstValue: 450,
      netValue: 2950,
      products: [{
        slNo: 1,
        productId: 'RT002',
        productName: 'Colgate Toothpaste 100g',
        inStock: 30,
        avgRate: 45,
        qty: 2,
        gstRate: 18,
        rate: 50,
        gross: 100,
        discount: 10,
        taxableValue: 90,
        sgst: 8.1,
        cgst: 8.1,
        invoiceValue: 106.2
      }]
    }
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.product-search-container')) {
        setShowProductSuggestions(false)
        setShowCustomerSuggestions(false)
        setShowBillSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debug form state changes
  useEffect(() => {
    console.log('Form state changed:', {
      customerName: form.customerName,
      customerId: form.customerId,
      customerType: form.customerType
    })
  }, [form.customerName, form.customerId, form.customerType])

  // Auto-generate bill number
  useEffect(() => {
    const generateBillNumber = () => {
      const today = new Date()
      const year = today.getFullYear().toString().slice(-2)
      const month = (today.getMonth() + 1).toString().padStart(2, '0')
      const day = today.getDate().toString().padStart(2, '0')
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `${year}${month}${day}${randomNum}`
    }

    if (!form.billNo) {
      setForm(prev => ({ ...prev, billNo: generateBillNumber() }))
    }
  }, [form.billNo])

  const filteredCustomers = useMemo(() => {
    console.log('Available customers:', customers)
    console.log('Search term:', customerSearchTerm)

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.contact.includes(customerSearchTerm)
    )

    console.log('Filtered customers:', filtered)
    return filtered
  }, [customers, customerSearchTerm])

  const filteredProducts = useMemo(() => {
    if (!productSearchTerm.trim()) return []

    const searchTerm = productSearchTerm.toLowerCase().trim()

    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.barcode?.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      const matchesCategory = !selectedProductCategory || product.category === selectedProductCategory
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      // Sort by exact matches first, then by name similarity
      const aExact = a.name.toLowerCase() === searchTerm || a.sku.toLowerCase() === searchTerm
      const bExact = b.name.toLowerCase() === searchTerm || b.sku.toLowerCase() === searchTerm

      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      return a.name.localeCompare(b.name)
    })
  }, [products, productSearchTerm, selectedProductCategory])

  const filteredBills = useMemo(() => {
    return salesRecords.filter(bill =>
      bill.billNo.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(billSearchTerm.toLowerCase())
    )
  }, [salesRecords, billSearchTerm])

  const handleCustomerSelect = (customer: any) => {
    console.log('Customer selected:', customer)
    console.log('Current form state:', form)

    setForm({
      ...form,
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type,
      customerDetails: {
        ...form.customerDetails,
        id: customer.id,
        name: customer.name,
        contactNo: customer.contact
      }
    })
    setCustomerSearchTerm('')
    setShowCustomerSuggestions(false)

    console.log('Form updated with customer:', {
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type
    })
  }

  const handleProductSelect = (product: any, index: number) => {
    const updatedProducts = [...form.products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      productId: product.sku,
      productName: product.name,
      inStock: product.stock,
      avgRate: product.costPrice,
      rate: product.sellPrice,
      gstRate: product.gstRate
    }
    setForm({ ...form, products: updatedProducts })
    setProductSearchTerm('')
    setShowProductSuggestions(false)
    calculateProductTotals(updatedProducts[index], index)
  }

  const calculateProductTotals = (product: SalesProduct, index: number) => {
    const gross = product.qty * product.rate
    const taxableValue = gross - product.discount
    const sgst = (taxableValue * product.gstRate) / 200
    const cgst = (taxableValue * product.gstRate) / 200
    const invoiceValue = taxableValue + sgst + cgst

    const updatedProducts = [...form.products]
    updatedProducts[index] = {
      ...product,
      gross,
      taxableValue,
      sgst,
      cgst,
      invoiceValue
    }
    setForm({ ...form, products: updatedProducts })
  }

  const handleProductChange = (index: number, field: keyof SalesProduct, value: string | number) => {
    const updatedProducts = [...form.products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    }
    setForm({ ...form, products: updatedProducts })
    calculateProductTotals(updatedProducts[index], index)
  }

  const handleProductSearch = (searchTerm: string, index: number) => {
    setProductSearchTerm(searchTerm)
    setShowProductSuggestions(searchTerm.length > 0)

    // Clear product selection if user starts typing
    if (form.products[index].productName && searchTerm !== form.products[index].productName) {
      const updatedProducts = [...form.products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: '',
        productName: '',
        inStock: 0,
        avgRate: 0,
        rate: 0,
        gstRate: 0
      }
      setForm({ ...form, products: updatedProducts })
    }
  }

  const addProductRow = () => {
    const newProduct: SalesProduct = {
      slNo: form.products.length + 1,
      productId: '',
      productName: '',
      inStock: 0,
      avgRate: 0,
      qty: 0,
      gstRate: 0,
      rate: 0,
      gross: 0,
      discount: 0,
      taxableValue: 0,
      sgst: 0,
      cgst: 0,
      invoiceValue: 0
    }
    setForm({
      ...form,
      products: [...form.products, newProduct]
    })
  }

  const removeProductRow = (index: number) => {
    if (form.products.length > 1) {
      const updatedProducts = form.products.filter((_, i) => i !== index)
      // Update slNo for remaining products
      const renumberedProducts = updatedProducts.map((product, i) => ({
        ...product,
        slNo: i + 1
      }))
      setForm({ ...form, products: renumberedProducts })
    }
  }

  const totals = useMemo(() => {
    return form.products.reduce((acc, product) => ({
      gross: acc.gross + product.gross,
      discount: acc.discount + product.discount,
      taxableValue: acc.taxableValue + product.taxableValue,
      sgst: acc.sgst + product.sgst,
      cgst: acc.cgst + product.cgst,
      invoiceValue: acc.invoiceValue + product.invoiceValue
    }), { gross: 0, discount: 0, taxableValue: 0, sgst: 0, cgst: 0, invoiceValue: 0 })
  }, [form.products])

  const totalAfterRoundOff = useMemo(() => {
    return totals.invoiceValue + form.freightAmt + form.roundOff
  }, [totals.invoiceValue, form.freightAmt, form.roundOff])

  // Update form state when totalAfterRoundOff changes
  useEffect(() => {
    setForm(prev => ({ ...prev, totalAfterRoundOff }))
  }, [totalAfterRoundOff])

  const handleSubmit = () => {
    if (!form.customerName || !form.customerType) {
      alert('Please select customer type and customer name')
      return
    }

    if (form.products.some(p => !p.productName || p.qty <= 0 || p.rate <= 0)) {
      alert('Please fill all required product fields')
      return
    }

    // Validate payment
    const totalPayment = Object.values(form.paymentDetails).reduce((sum, amount) => sum + amount, 0)
    if (totalPayment !== totalAfterRoundOff) {
      alert(`Payment amount (₹${totalPayment.toFixed(2)}) must equal total amount (₹${totalAfterRoundOff.toFixed(2)})`)
      return
    }

    // Create sales record
    const newSalesRecord: SalesRecord = {
      siNo: salesRecords.length + 1,
      billNo: form.billNo,
      billDate: form.billDate,
      customerName: form.customerName,
      customerType: form.customerType,
      taxableValue: totals.taxableValue,
      totalGstValue: totals.sgst + totals.cgst,
      netValue: totalAfterRoundOff,
      products: form.products
    }

    // Update stock for each product
    form.products.forEach(product => {
      if (product.productId) {
        dispatch(updateStock({
          sku: product.productId,
          quantity: product.qty,
          operation: 'subtract'
        }))
      }
    })

    alert('Sales record created successfully!')

    // Reset form
    setForm({
      billNo: '',
      billDate: new Date().toLocaleDateString('en-GB'),
      customerType: '',
      customerName: '',
      customerId: '',
      customerDescription: '',
      customerDetails: {
        id: '',
        name: '',
        fatherName: '',
        address: '',
        pincode: '',
        contactNo: '',
        mfmsId: '',
        panNo: '',
        gstNo: ''
      },
      products: [{
        slNo: 1,
        productId: '',
        productName: '',
        inStock: 0,
        avgRate: 0,
        qty: 0,
        gstRate: 0,
        rate: 0,
        gross: 0,
        discount: 0,
        taxableValue: 0,
        sgst: 0,
        cgst: 0,
        invoiceValue: 0
      }],
      roundOff: 0,
      freightAmt: 0,
      totalAfterRoundOff: 0,
      paymentMethod: '',
      paymentDetails: {
        cash: 0,
        cheque: 0,
        upi: 0,
        phonepe: 0,
        paytm: 0,
        gpay: 0,
        credit: 0,
        savingAccount: 0
      },
      remarks: ''
    })
  }

  const handleBillSearch = (searchTerm: string) => {
    setBillSearchTerm(searchTerm)
    setShowBillSuggestions(searchTerm.length > 0)
  }

  const handleBillScan = () => {
    // Simulate barcode scanning
    const scannedBill = salesRecords[0] // Simulate finding a bill
    setReturnForm({
      ...returnForm,
      billNo: scannedBill.billNo,
      billDate: scannedBill.billDate,
      customerName: scannedBill.customerName,
      customerType: scannedBill.customerType,
      returnProducts: scannedBill.products || []
    })
    setBillSearchTerm(scannedBill.billNo)
    setShowBillSuggestions(false)
  }

  const handleBillSelect = (bill: SalesRecord) => {
    setReturnForm({
      ...returnForm,
      billNo: bill.billNo,
      billDate: bill.billDate,
      customerName: bill.customerName,
      customerType: bill.customerType,
      returnProducts: bill.products || []
    })
    setBillSearchTerm(bill.billNo)
    setShowBillSuggestions(false)
  }

  const handleReturnProductChange = (index: number, field: keyof SalesProduct, value: string | number) => {
    const updatedProducts = [...returnForm.returnProducts]
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    }

    // Recalculate totals for return product
    const product = updatedProducts[index]
    const gross = product.qty * product.rate
    const taxableValue = gross - product.discount
    const sgst = (taxableValue * product.gstRate) / 200
    const cgst = (taxableValue * product.gstRate) / 200
    const invoiceValue = taxableValue + sgst + cgst

    updatedProducts[index] = {
      ...product,
      gross,
      taxableValue,
      sgst,
      cgst,
      invoiceValue
    }

    const totalReturnValue = updatedProducts.reduce((sum, p) => sum + p.invoiceValue, 0)

    setReturnForm({
      ...returnForm,
      returnProducts: updatedProducts,
      totalReturnValue
    })
  }

  const handleSalesReturn = () => {
    if (!returnForm.billNo || !returnForm.customerName) {
      alert('Please select a bill and customer for return')
      return
    }

    if (returnForm.returnProducts.length === 0) {
      alert('Please add products to return')
      return
    }

    if (!returnForm.returnReason) {
      alert('Please provide a reason for return')
      return
    }

    // Update stock for returned products (add back to stock)
    returnForm.returnProducts.forEach(product => {
      if (product.productId) {
        dispatch(updateStock({
          sku: product.productId,
          quantity: product.qty,
          operation: 'add'
        }))
      }
    })

    alert(`Sales return processed successfully!\nReturn Value: ₹${returnForm.totalReturnValue.toFixed(2)}`)

    // Reset return form
    setReturnForm({
      returnType: 'bill_wise',
      billNo: '',
      billDate: '',
      customerName: '',
      customerType: '',
      returnProducts: [],
      returnReason: '',
      returnDate: new Date().toLocaleDateString('en-GB'),
      totalReturnValue: 0
    })
    setShowSalesReturn(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sales Entry</h2>
              <p className="text-gray-600">Create sales transactions and manage customer orders</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowSalesReturn(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Sales Return
              </Button>
            </div>
          </div>

          {/* Bill Information */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill No: *</label>
                  <Input
                    value={form.billNo}
                    onChange={(e) => setForm({ ...form, billNo: e.target.value })}
                    className="w-full bg-gray-100"
                    placeholder="Auto-generated"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date: *</label>
                  <Input
                    type="date"
                    value={form.billDate}
                    onChange={(e) => setForm({ ...form, billDate: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                  <Input
                    type="number"
                    value="0"
                    disabled
                    className="w-full bg-gray-100"
                    placeholder="₹ 0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type *</label>
                  <select
                    value={form.customerType}
                    onChange={(e) => setForm({ ...form, customerType: e.target.value, customerName: '', customerId: '' })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Customer Type</option>
                    <option value="Cooperative Trade Debtors">Cooperative Trade Debtors</option>
                    <option value="Regular">Regular</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <div className="relative">
                    <div className="flex space-x-1">
                      <Input
                        placeholder="Search customer by name or contact"
                        value={form.customerName || customerSearchTerm}
                        onChange={(e) => {
                          setCustomerSearchTerm(e.target.value)
                          setShowCustomerSuggestions(e.target.value.length > 0)
                          if (form.customerName && e.target.value !== form.customerName) {
                            setForm({ ...form, customerName: '', customerId: '' })
                          }
                        }}
                        onFocus={() => {
                          if (!form.customerName) {
                            setShowCustomerSuggestions(true)
                          }
                        }}
                        className="flex-1"
                        readOnly={!!form.customerName}
                      />
                      {form.customerName && (
                        <Button
                          onClick={() => {
                            setForm({ ...form, customerName: '', customerId: '' })
                            setCustomerSearchTerm('')
                            setShowCustomerSuggestions(false)
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          ✕
                        </Button>
                      )}
                    </div>

                    {/* Selected Customer Display */}
                    {form.customerName && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-green-800">✓ Customer Selected: {form.customerName}</div>
                            <div className="text-xs text-green-600">Type: {form.customerType} | ID: {form.customerId}</div>
                          </div>
                          <Button
                            onClick={() => {
                              setForm({ ...form, customerName: '', customerId: '', customerType: '' })
                              setCustomerSearchTerm('')
                              setShowCustomerSuggestions(false)
                            }}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 text-xs"
                          >
                            Change Customer
                          </Button>
                        </div>
                      </div>
                    )}

                    {showCustomerSuggestions && filteredCustomers.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                        {filteredCustomers.slice(0, 5).map((customer) => (
                          <div
                            key={customer.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Customer clicked:', customer)
                              handleCustomerSelect(customer)
                            }}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.contact} • {customer.type}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Description</label>
                <textarea
                  value={form.customerDescription}
                  onChange={(e) => setForm({ ...form, customerDescription: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none"
                  placeholder="Enter customer description..."
                />
              </div>

              {/* Debug Info - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="font-medium text-yellow-800">Debug Info:</div>
                  <div>Customer Name: {form.customerName || 'Not selected'}</div>
                  <div>Customer ID: {form.customerId || 'Not selected'}</div>
                  <div>Customer Type: {form.customerType || 'Not selected'}</div>
                  <div>Search Term: {customerSearchTerm || 'Empty'}</div>
                </div>
              )}

              {/* Customer Details */}
              {form.customerName && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID:</label>
                    <Input
                      value={form.customerDetails.id}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, id: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NAME:</label>
                    <Input
                      value={form.customerDetails.name}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, name: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father Name:</label>
                    <Input
                      value={form.customerDetails.fatherName}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, fatherName: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address:,, Pincode</label>
                    <Input
                      value={form.customerDetails.address}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, address: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact No:</label>
                    <Input
                      value={form.customerDetails.contactNo}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, contactNo: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MFMS ID:</label>
                    <Input
                      value={form.customerDetails.mfmsId}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, mfmsId: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pan NO:</label>
                    <Input
                      value={form.customerDetails.panNo}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, panNo: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST NO:</label>
                    <Input
                      value={form.customerDetails.gstNo}
                      onChange={(e) => setForm({ ...form, customerDetails: { ...form.customerDetails, gstNo: e.target.value } })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Entry */}
          <Card>
            <CardHeader>
              <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
                <CardTitle className="text-gray-800">Product Entry</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Header Row */}
              <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rounded-lg text-xs font-medium text-gray-600">
                <div className="w-12 text-center">Sl No.</div>
                <div className="w-48 text-center">Product *</div>
                <div className="w-16 text-center">In Stock</div>
                <div className="w-16 text-center">Avg Rate</div>
                <div className="w-16 text-center">Qty *</div>
                <div className="w-16 text-center">GST Rate</div>
                <div className="w-16 text-center">Rate *</div>
                <div className="w-16 text-center">Gross</div>
                <div className="w-16 text-center">Discount</div>
                <div className="w-16 text-center">Taxable</div>
                <div className="w-16 text-center">SGST*</div>
                <div className="w-16 text-center">CGST*</div>
                <div className="w-20 text-center">Action</div>
              </div>

              {/* Product Rows */}
              <div className="space-y-3">
                {form.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    {/* Sl No */}
                    <div className="w-12 text-center">
                      <span className="text-sm font-medium text-gray-700">{product.slNo}</span>
                    </div>

                    {/* Product Search */}
                    <div className="w-48">
                      <div className="relative product-search-container">
                        <div className="flex space-x-1">
                          <Input
                            placeholder="Search product or scan barcode"
                            value={product.productName || productSearchTerm}
                            onChange={(e) => handleProductSearch(e.target.value, index)}
                            onFocus={() => setShowProductSuggestions(true)}
                            className="w-full text-sm border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                          />
                          <Button
                            onClick={() => {
                              // Simulate barcode scanning
                              const randomProduct = products[Math.floor(Math.random() * products.length)]
                              handleProductSelect(randomProduct, index)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-8 w-8 flex items-center justify-center flex-shrink-0"
                          >
                            📷
                          </Button>
                        </div>

                        {/* Product Suggestions */}
                        {showProductSuggestions && filteredProducts.length > 0 && (
                          <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                            {filteredProducts.slice(0, 8).map((p) => (
                              <div
                                key={p.sku}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b flex items-center space-x-3"
                                onClick={() => handleProductSelect(p, index)}
                              >
                                <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                  {p.image ? (
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                        if (nextElement) {
                                          nextElement.style.display = 'flex'
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{ display: p.image ? 'none' : 'flex' }}>
                                    📦
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                                  <div className="text-xs text-gray-500">SKU: {p.sku} | Stock: {p.stock} | ₹{p.sellPrice}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* In Stock */}
                    <div className="w-16 text-center">
                      <span className="text-sm text-gray-600">{product.inStock} pcs</span>
                    </div>

                    {/* Avg Rate */}
                    <div className="w-16 text-center">
                      <span className="text-sm text-gray-600">{product.avgRate}</span>
                    </div>

                    {/* Qty */}
                    <div className="w-16">
                      <Input
                        type="number"
                        value={product.qty}
                        onChange={(e) => handleProductChange(index, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full text-sm text-center"
                        placeholder="0"
                      />
                    </div>

                    {/* GST Rate */}
                    <div className="w-16">
                      <Input
                        type="number"
                        value={product.gstRate}
                        onChange={(e) => handleProductChange(index, 'gstRate', parseFloat(e.target.value) || 0)}
                        className="w-full text-sm text-center"
                        placeholder="0"
                      />
                    </div>

                    {/* Rate */}
                    <div className="w-16">
                      <Input
                        type="number"
                        value={product.rate}
                        onChange={(e) => handleProductChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full text-sm text-center"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Gross */}
                    <div className="w-16 text-center">
                      <span className="text-sm text-gray-600">{product.gross}</span>
                    </div>

                    {/* Discount */}
                    <div className="w-16">
                      <Input
                        type="number"
                        value={product.discount}
                        onChange={(e) => handleProductChange(index, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full text-sm text-center"
                        placeholder="0"
                      />
                    </div>

                    {/* Taxable Value */}
                    <div className="w-16 text-center">
                      <span className="text-sm text-gray-600">{product.taxableValue}</span>
                    </div>

                    {/* SGST */}
                    <div className="w-16 text-center">
                      <span className="text-sm text-gray-600">{product.sgst}</span>
                    </div>

                    {/* CGST */}
                    <div className="w-16 text-center">
                      <span className="text-sm text-gray-600">{product.cgst}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-20 flex items-center justify-center space-x-1">
                      <Button
                        size="sm"
                        className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white h-6 w-6 flex items-center justify-center"
                        onClick={addProductRow}
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 h-6 w-6 flex items-center justify-center"
                        onClick={() => removeProductRow(index)}
                      >
                        -
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Value Display */}
              <div className="flex justify-end items-center mt-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Invoice Value</div>
                  <div className="text-lg font-bold text-gray-900">₹{totals.invoiceValue.toFixed(2)}</div>
                </div>
              </div>

              {/* Totals Row */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-lg font-semibold">Total:</span>
                  <div className="flex space-x-8">
                    <span>Gross: ₹{totals.gross.toFixed(2)}</span>
                    <span>Discount: ₹{totals.discount.toFixed(2)}</span>
                    <span>Taxable Value: ₹{totals.taxableValue.toFixed(2)}</span>
                    <span>SGST*: ₹{totals.sgst.toFixed(2)}</span>
                    <span>CGST*: ₹{totals.cgst.toFixed(2)}</span>
                    <span>Invoice Value: ₹{totals.invoiceValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary and Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Round Off ₹</label>
                    <Input
                      type="number"
                      value={form.roundOff}
                      onChange={(e) => setForm({ ...form, roundOff: parseFloat(e.target.value) || 0 })}
                      className="w-24 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Freight Amt:₹</label>
                    <Input
                      type="number"
                      value={form.freightAmt}
                      onChange={(e) => setForm({ ...form, freightAmt: parseFloat(e.target.value) || 0 })}
                      className="w-24 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Total(After Round Off): ₹₹</label>
                    <span className="text-lg font-bold text-orange-600">{totalAfterRoundOff.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <div className="bg-gray-100 px-4 py-2 rounded-t-lg">
                  <CardTitle className="text-gray-800">Received Entry</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'cash'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'cash' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">Cash</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'cheque'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'cheque' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">Cheque</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'upi'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'upi' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">UPI</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'phonepe'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'phonepe' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">PhonePe</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'paytm'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'paytm' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">Paytm</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'gpay'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'gpay' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">GPay</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'credit'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'credit' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">Credit</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.paymentMethod === 'savingAccount'}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.checked ? 'savingAccount' : '' })}
                          className="rounded"
                        />
                        <span className="text-sm">Saving A/c</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Amount Fields */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Cash:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.cash}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, cash: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">UPI:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.upi}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, upi: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">PhonePe:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.phonepe}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, phonepe: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Paytm:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.paytm}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, paytm: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">GPay:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.gpay}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, gpay: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Credit:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.credit}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, credit: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Saving A/c:</label>
                      <Input
                        type="number"
                        value={form.paymentDetails.savingAccount}
                        onChange={(e) => setForm({ ...form, paymentDetails: { ...form.paymentDetails, savingAccount: parseFloat(e.target.value) || 0 } })}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks:</label>
                    <textarea
                      value={form.remarks}
                      onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none text-sm"
                      placeholder="Enter remarks..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Print
            </Button>
            <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
              Final Submit
            </Button>
          </div>

          {/* Sales History */}
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">SI No</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Bill No</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Bill Date</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Customer Name</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Taxable Value</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Total GST Value</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Net Value</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesRecords.map((record) => (
                      <tr key={record.siNo} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{record.siNo}</td>
                        <td className="py-2 px-3 text-sm">{record.billNo}</td>
                        <td className="py-2 px-3 text-sm">{record.billDate}</td>
                        <td className="py-2 px-3 text-sm">{record.customerName}</td>
                        <td className="py-2 px-3 text-sm">₹{record.taxableValue.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">₹{record.totalGstValue.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">₹{record.netValue.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">Print</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sales Return Modal */}
          {showSalesReturn && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Sales Return - Bill Wise</h3>
                  <Button
                    onClick={() => setShowSalesReturn(false)}
                    variant="outline"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Bill Search and Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bill Number *</label>
                      <div className="relative">
                        <div className="flex space-x-1">
                          <Input
                            placeholder="Search bill number or scan barcode"
                            value={billSearchTerm}
                            onChange={(e) => handleBillSearch(e.target.value)}
                            onFocus={() => setShowBillSuggestions(true)}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleBillScan}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            📷
                          </Button>
                        </div>

                        {/* Bill Suggestions */}
                        {showBillSuggestions && filteredBills.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                            {filteredBills.slice(0, 5).map((bill) => (
                              <div
                                key={bill.siNo}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                                onClick={() => handleBillSelect(bill)}
                              >
                                <div className="font-medium">{bill.billNo}</div>
                                <div className="text-xs text-gray-500">
                                  {bill.billDate} • {bill.customerName} • ₹{bill.netValue.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                      <Input
                        type="date"
                        value={returnForm.returnDate}
                        onChange={(e) => setReturnForm({ ...returnForm, returnDate: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Return Details - Only show if bill is selected */}
                  {returnForm.billNo && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bill No</label>
                          <Input value={returnForm.billNo} disabled className="bg-gray-100" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                          <Input value={returnForm.customerName} disabled className="bg-gray-100" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Return Reason *</label>
                          <select
                            value={returnForm.returnReason}
                            onChange={(e) => setReturnForm({ ...returnForm, returnReason: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Select Reason</option>
                            <option value="Defective">Defective Product</option>
                            <option value="Wrong Size">Wrong Size</option>
                            <option value="Customer Request">Customer Request</option>
                            <option value="Quality Issue">Quality Issue</option>
                            <option value="Damaged">Damaged in Transit</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Return Products */}
                      {returnForm.returnProducts.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold mb-3">Return Products</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-red-100">
                                <tr>
                                  <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Product</th>
                                  <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Qty</th>
                                  <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Rate</th>
                                  <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Discount</th>
                                  <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Return Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {returnForm.returnProducts.map((product, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="py-2 px-3 text-sm">{product.productName}</td>
                                    <td className="py-2 px-3">
                                      <Input
                                        type="number"
                                        value={product.qty}
                                        onChange={(e) => handleReturnProductChange(index, 'qty', parseFloat(e.target.value) || 0)}
                                        className="w-16 text-sm"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-sm">₹{product.rate.toFixed(2)}</td>
                                    <td className="py-2 px-3">
                                      <Input
                                        type="number"
                                        value={product.discount}
                                        onChange={(e) => handleReturnProductChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                        className="w-16 text-sm"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-sm">₹{product.invoiceValue.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Return Summary */}
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Return Value:</span>
                          <span className="text-xl font-bold text-red-600">₹{returnForm.totalReturnValue.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    onClick={() => setShowSalesReturn(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSalesReturn}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!returnForm.billNo || !returnForm.returnReason}
                  >
                    Process Return
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
