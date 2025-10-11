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
  customerType: string
  customerName: string
  customerId: string
  products: SalesProduct[]
  roundOff: number
  freightAmt: number
  totalAfterRoundOff: number
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
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [isReturnFormCollapsed, setIsReturnFormCollapsed] = useState(true)
  const [billSearchTerm, setBillSearchTerm] = useState('')
  const [showBillSuggestions, setShowBillSuggestions] = useState(false)

  const [form, setForm] = useState<SalesForm>({
    customerType: '',
    customerName: '',
    customerId: '',
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
    totalAfterRoundOff: 0
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
      billNo: '306',
      billDate: '11-10-2025',
      customerName: 'abdul rajjak mallik',
      customerType: 'Regular',
      taxableValue: 1614.40,
      totalGstValue: 290.60,
      netValue: 1905.00,
      products: []
    },
    {
      siNo: 5691,
      billNo: '305',
      billDate: '09-10-2025',
      customerName: 'rakhi majhi',
      customerType: 'Regular',
      taxableValue: 1816.68,
      totalGstValue: 103.32,
      netValue: 1920.00,
      products: []
    },
    {
      siNo: 5690,
      billNo: '304',
      billDate: '08-10-2025',
      customerName: 'sirajul nasir mollick',
      customerType: 'VIP',
      taxableValue: 127.12,
      totalGstValue: 22.88,
      netValue: 150.00,
      products: []
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
      if (showCustomerSuggestions || showProductSuggestions) {
        setShowCustomerSuggestions(false)
        setShowProductSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCustomerSuggestions, showProductSuggestions])

  // Get unique customer types from Redux customers
  const customerTypes = useMemo(() => {
    return Array.from(new Set(customers.map(c => c.type)))
  }, [customers])

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.contact.includes(customerSearchTerm)
    )
  }, [customers, customerSearchTerm])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.barcode?.includes(productSearchTerm)
      const matchesCategory = !selectedProductCategory || product.category === selectedProductCategory
      return matchesSearch && matchesCategory
    })
  }, [products, productSearchTerm, selectedProductCategory])

  const filteredBills = useMemo(() => {
    return salesRecords.filter(bill => 
      bill.billNo.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      bill.customerName.toLowerCase().includes(billSearchTerm.toLowerCase())
    )
  }, [salesRecords, billSearchTerm])

  const handleCustomerSelect = (customer: any) => {
    setForm({
      ...form,
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type
    })
    setCustomerSearchTerm('')
    setShowCustomerSuggestions(false)
  }

  const handleProductSelect = (product: any, productIndex: number) => {
    const updatedProducts = [...form.products]
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      productId: product.sku,
      productName: product.name,
      inStock: product.stock,
      avgRate: product.sellPrice,
      rate: product.sellPrice,
      gstRate: product.gstRate
    }
    setForm({ ...form, products: updatedProducts })
    calculateProductTotals(updatedProducts[productIndex], productIndex)
  }

  const calculateProductTotals = (product: SalesProduct, index: number) => {
    const gross = product.qty * product.rate
    const taxableValue = gross - product.discount
    const sgst = (taxableValue * product.gstRate) / 200 // Half of GST rate
    const cgst = (taxableValue * product.gstRate) / 200 // Half of GST rate
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

    // Create sales record
    const newSalesRecord: SalesRecord = {
      siNo: salesRecords.length + 1,
      billNo: `BILL-${Date.now()}`,
      billDate: new Date().toLocaleDateString('en-GB'),
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
      customerType: '',
      customerName: '',
      customerId: '',
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
      totalAfterRoundOff: 0
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
    setIsReturnFormCollapsed(false)
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
    setIsReturnFormCollapsed(false)
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
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
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

          {/* Customer Information */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type: *</label>
                  <select
                    value={form.customerType}
                    onChange={(e) => setForm({ ...form, customerType: e.target.value, customerId: '', customerName: '' })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">--none--</option>
                    {customerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name: *</label>
                  <Input
                    placeholder="Search customer by name or contact..."
                    value={form.customerName || customerSearchTerm}
                    onChange={(e) => {
                      setCustomerSearchTerm(e.target.value)
                      setShowCustomerSuggestions(e.target.value.length > 0)
                      // Clear selection if user starts typing
                      if (form.customerId && e.target.value !== form.customerName) {
                        setForm({
                          ...form,
                          customerId: '',
                          customerName: '',
                          customerType: ''
                        })
                      }
                    }}
                    onFocus={() => setShowCustomerSuggestions(true)}
                    className="w-full"
                  />

                  {/* Customer Suggestions */}
                  {showCustomerSuggestions && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                      {filteredCustomers.slice(0, 5).map((customer) => (
                        <div
                          key={customer.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-500">📞 {customer.contact} | 👤 {customer.type}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="bg-orange-600 text-white p-3 rounded">Product Entry</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Sl No.</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Product *</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">In Stock</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Avg Rate</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Qty *</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">incl.GST Rate</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Rate *</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Gross</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Discount</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Taxable Value GST (After Discount)</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">GST %</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">SGST*</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">CGST*</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Invoice Value</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.products.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3 text-sm">{product.slNo}</td>
                        <td className="py-2 px-3">
                          <div className="relative">
                            <Input
                              placeholder="Search product..."
                              value={product.productName || productSearchTerm}
                              onChange={(e) => {
                                setProductSearchTerm(e.target.value)
                                setShowProductSuggestions(e.target.value.length > 0)
                                // Clear selection if user starts typing
                                if (product.productId && e.target.value !== product.productName) {
                                  handleProductChange(index, 'productId', '')
                                  handleProductChange(index, 'productName', '')
                                  handleProductChange(index, 'inStock', 0)
                                  handleProductChange(index, 'avgRate', 0)
                                  handleProductChange(index, 'rate', 0)
                                  handleProductChange(index, 'gstRate', 0)
                                }
                              }}
                              onFocus={() => setShowProductSuggestions(true)}
                              className="w-32 text-sm"
                            />

                            {/* Product Suggestions */}
                            {showProductSuggestions && filteredProducts.length > 0 && (
                              <div className="absolute z-10 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                {filteredProducts.slice(0, 5).map((p) => (
                                  <div
                                    key={p.sku}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                                    onClick={() => handleProductSelect(p, index)}
                                  >
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-xs text-gray-500">SKU: {p.sku} | Stock: {p.stock} | ₹{p.sellPrice}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-sm">{product.inStock}</td>
                        <td className="py-2 px-3 text-sm">{product.avgRate.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={product.qty}
                            onChange={(e) => handleProductChange(index, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={product.gstRate}
                            onChange={(e) => handleProductChange(index, 'gstRate', parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={product.rate}
                            onChange={(e) => handleProductChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm"
                          />
                        </td>
                        <td className="py-2 px-3 text-sm">{product.gross.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={product.discount}
                            onChange={(e) => handleProductChange(index, 'discount', parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm"
                          />
                        </td>
                        <td className="py-2 px-3 text-sm">{product.taxableValue.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">{product.gstRate}%</td>
                        <td className="py-2 px-3 text-sm">{product.sgst.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">{product.cgst.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">{product.invoiceValue.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              onClick={addProductRow}
                              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => removeProductRow(index)}
                              className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                            >
                              -
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-2 px-3 text-sm">Total:</td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3 text-sm">{totals.gross.toFixed(2)}</td>
                      <td className="py-2 px-3 text-sm">{totals.discount.toFixed(2)}</td>
                      <td className="py-2 px-3 text-sm">{totals.taxableValue.toFixed(2)}</td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3 text-sm">{totals.sgst.toFixed(2)}</td>
                      <td className="py-2 px-3 text-sm">{totals.cgst.toFixed(2)}</td>
                      <td className="py-2 px-3 text-sm">{totals.invoiceValue.toFixed(2)}</td>
                      <td className="py-2 px-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Round Off :₹</label>
                    <Input
                      type="number"
                      value={form.roundOff}
                      onChange={(e) => setForm({ ...form, roundOff: parseFloat(e.target.value) || 0 })}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Freight Amt:₹</label>
                    <Input
                      type="number"
                      value={form.freightAmt}
                      onChange={(e) => setForm({ ...form, freightAmt: parseFloat(e.target.value) || 0 })}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Total(After Round Off): ₹₹</label>
                    <span className="text-lg font-bold text-orange-600">{totalAfterRoundOff.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handleSubmit}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Save Sale
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales History */}
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">SI No.</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Bill No</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Bill Date</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Customer Name</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Taxable Value</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Total GST Value</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Net Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesRecords.map((record) => (
                      <tr key={record.siNo} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{record.siNo}</td>
                        <td className="py-2 px-3 text-sm">{record.billNo}</td>
                        <td className="py-2 px-3 text-sm">{record.billDate}</td>
                        <td className="py-2 px-3 text-sm">{record.customerName}</td>
                        <td className="py-2 px-3 text-sm">{record.taxableValue.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">{record.totalGstValue.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm font-semibold">{record.netValue.toFixed(2)}</td>
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
                  {/* Bill Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Bill for Return *</label>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Bill No</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Date</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Customer</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Net Value</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesRecords.map((bill) => (
                            <tr key={bill.siNo} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-3 text-sm">{bill.billNo}</td>
                              <td className="py-2 px-3 text-sm">{bill.billDate}</td>
                              <td className="py-2 px-3 text-sm">{bill.customerName}</td>
                              <td className="py-2 px-3 text-sm">₹{bill.netValue.toFixed(2)}</td>
                              <td className="py-2 px-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleBillSelect(bill)}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                                >
                                  Select
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Return Details */}
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date *</label>
                          <Input
                            type="date"
                            value={returnForm.returnDate}
                            onChange={(e) => setReturnForm({ ...returnForm, returnDate: e.target.value })}
                            className="w-full"
                          />
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