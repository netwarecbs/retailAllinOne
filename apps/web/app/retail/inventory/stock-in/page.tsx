'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { RootState, AppDispatch } from '@retail/shared'
import {
  addStockInRecord,
  setSelectedVendor,
  addVendor,
  updateStock,
  setLoading,
  setError
} from '@retail/shared'

interface StockInForm {
  challanDate: string
  challanNo: string
  transportName: string
  transportNo: string
  transportCharges: number
  billNo: string
  billDate: string
  products: StockInProduct[]
}

interface StockInProduct {
  slNo: number
  productId: string
  productName: string
  inStock: number
  qty: number
  batchNo: string
  mfDate: string
  expDate: string
  unitPrice: number
  totalPrice: number
}

export default function StockInPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { products, vendors, stockInRecords, selectedVendor, loading } = useSelector((state: RootState) => state.products)

  const [form, setForm] = useState<StockInForm>({
    challanDate: new Date().toLocaleDateString('en-GB'),
    challanNo: '',
    transportName: '',
    transportNo: '',
    transportCharges: 0,
    billNo: '',
    billDate: '',
    products: [{
      slNo: 1,
      productId: '',
      productName: '',
      inStock: 0,
      qty: 0,
      batchNo: '',
      mfDate: '',
      expDate: '',
      unitPrice: 0,
      totalPrice: 0
    }]
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [showProductSuggestions, setShowProductSuggestions] = useState(false)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [vendorSearchTerm, setVendorSearchTerm] = useState('')
  const [isFormCollapsed, setIsFormCollapsed] = useState(true)

  useEffect(() => {
    dispatch(setLoading(false))
  }, [dispatch])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProductSuggestions) {
        setShowProductSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProductSuggestions])

  const handleVendorSearch = () => {
    setShowVendorModal(true)
  }

  const handleVendorSelect = (vendor: any) => {
    dispatch(setSelectedVendor(vendor))
    setShowVendorModal(false)
    setVendorSearchTerm('')
  }

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
    vendor.contact.includes(vendorSearchTerm) ||
    vendor.gstin.toLowerCase().includes(vendorSearchTerm.toLowerCase())
  )

  const handleBarcodeScan = () => {
    // Simulate barcode scanner
    const barcode = prompt('Enter barcode or scan:')
    if (barcode) {
      const product = products.find(p => p.barcode === barcode)
      if (product) {
        setProductSearchTerm(product.name)
        setShowProductSuggestions(false)
      } else {
        alert('Product not found with this barcode')
      }
    }
  }

  const handleProductSearch = (searchValue: string) => {
    setProductSearchTerm(searchValue)
    setShowProductSuggestions(searchValue.length > 0)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.barcode?.includes(productSearchTerm)
  )

  const handleProductSelect = (productIndex: number, product: any) => {
    if (product) {
      const updatedProducts = [...form.products]
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        productId: product.sku,
        productName: product.name,
        inStock: product.stock,
        unitPrice: product.costPrice
      }
      setForm({ ...form, products: updatedProducts })
      setProductSearchTerm('')
      setShowProductSuggestions(false)
    }
  }

  const handleQuantityChange = (productIndex: number, qty: number) => {
    const updatedProducts = [...form.products]
    const product = updatedProducts[productIndex]
    updatedProducts[productIndex] = {
      ...product,
      qty,
      totalPrice: product.unitPrice * qty
    }
    setForm({ ...form, products: updatedProducts })
  }

  const addProductRow = () => {
    const newProduct: StockInProduct = {
      slNo: form.products.length + 1,
      productId: '',
      productName: '',
      inStock: 0,
      qty: 0,
      batchNo: '',
      mfDate: '',
      expDate: '',
      unitPrice: 0,
      totalPrice: 0
    }
    setForm({ ...form, products: [...form.products, newProduct] })
  }

  const removeProductRow = (index: number) => {
    if (form.products.length > 1) {
      const updatedProducts = form.products.filter((_, i) => i !== index)
      // Renumber the slNo
      const renumberedProducts = updatedProducts.map((product, i) => ({
        ...product,
        slNo: i + 1
      }))
      setForm({ ...form, products: renumberedProducts })
    }
  }

  const handleSubmit = () => {
    if (!selectedVendor) {
      alert('Please select a vendor first')
      return
    }

    if (form.challanNo === '') {
      alert('Please enter challan number')
      return
    }

    if (form.products.some(p => p.productId === '' || p.qty === 0)) {
      alert('Please fill in all product details')
      return
    }

    const totalAmount = form.products.reduce((sum, product) => sum + product.totalPrice, 0)

    const stockInRecord = {
      id: `SI-${Date.now()}`,
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      challanDate: form.challanDate,
      challanNo: form.challanNo,
      transportName: form.transportName,
      transportNo: form.transportNo,
      transportCharges: form.transportCharges,
      billNo: form.billNo || 'N/A',
      billDate: form.billDate || 'N/A',
      products: form.products,
      totalAmount,
      createdAt: new Date().toISOString()
    }

    dispatch(addStockInRecord(stockInRecord))

    // Reset form
    setForm({
      challanDate: new Date().toLocaleDateString('en-GB'),
      challanNo: '',
      transportName: '',
      transportNo: '',
      transportCharges: 0,
      billNo: '',
      billDate: '',
      products: [{
        slNo: 1,
        productId: '',
        productName: '',
        inStock: 0,
        qty: 0,
        batchNo: '',
        mfDate: '',
        expDate: '',
        unitPrice: 0,
        totalPrice: 0
      }]
    })

    dispatch(setSelectedVendor(null))
    alert('Stock-in record added successfully!')
  }

  const filteredRecords = stockInRecords.filter(record =>
    record.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.challanNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
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
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/retail/inventory')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Inventory</span>
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">STOCK-IN</h2>
                <p className="text-gray-600">Manage incoming stock and inventory</p>
              </div>
            </div>
          </div>

          {/* Stock-In Form */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Stock-In Entry</CardTitle>
                <Button
                  onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>{isFormCollapsed ? 'Show Form' : 'Hide Form'}</span>
                  <span className={`transform transition-transform ${isFormCollapsed ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </Button>
              </div>
            </CardHeader>
            {isFormCollapsed ? (
              <CardContent className="p-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {selectedVendor ? `Vendor: ${selectedVendor.name}` : 'No vendor selected'} •
                        {form.products.length} product(s) •
                        Challan: {form.challanNo || 'Not entered'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setIsFormCollapsed(false)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Continue Entry
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="space-y-6">
                {/* Vendor and General Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vendor Information */}
                  <div className="space-y-4">
                    <div>
                      <Button
                        onClick={handleVendorSearch}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {selectedVendor ? 'Change Vendor' : 'Search Vendor'}
                      </Button>
                      {selectedVendor && (
                        <Button
                          onClick={() => dispatch(setSelectedVendor(null))}
                          variant="outline"
                          size="sm"
                          className="ml-2 text-red-600 hover:bg-red-50"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Information:</label>
                      <div className="bg-gray-50 border rounded-lg p-4 min-h-[120px]">
                        {selectedVendor ? (
                          <div>
                            <p className="font-medium text-lg">{selectedVendor.name}</p>
                            <p className="text-sm text-gray-600">📞 {selectedVendor.contact}</p>
                            <p className="text-sm text-gray-600">📍 {selectedVendor.address}, {selectedVendor.city}</p>
                            <p className="text-sm text-gray-600">🏢 GST: {selectedVendor.gstin}</p>
                            <p className="text-sm text-gray-600">💰 Outstanding: ₹{selectedVendor.outstandingAmount.toLocaleString()}</p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <p>No vendor selected</p>
                            <p className="text-xs mt-1">Click "Search Vendor" to select a vendor</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* General Entry Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date: *</label>
                        <Input
                          type="date"
                          value={form.challanDate}
                          onChange={(e) => setForm({ ...form, challanDate: e.target.value })}
                          className="w-full text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chalan No: *</label>
                        <Input
                          placeholder="Please enter Chalan No"
                          value={form.challanNo}
                          onChange={(e) => setForm({ ...form, challanNo: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trans. Name:</label>
                        <Input
                          placeholder="Please enter Trans. Name"
                          value={form.transportName}
                          onChange={(e) => setForm({ ...form, transportName: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trans. No:</label>
                        <Input
                          placeholder="Please enter Trans. No"
                          value={form.transportNo}
                          onChange={(e) => setForm({ ...form, transportNo: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Charges:</label>
                      <Input
                        type="number"
                        placeholder="Please enter Charges"
                        value={form.transportCharges}
                        onChange={(e) => setForm({ ...form, transportCharges: parseFloat(e.target.value) || 0 })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-orange-100">
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Sl No.</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Product *</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">In Stock</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Qty*</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Batch No</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Mf. Date</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Exp Date</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.products.map((product, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-3 text-sm">{product.slNo}</td>
                            <td className="py-2 px-3">
                              <div className="relative">
                                <div className="flex space-x-1">
                                  <Input
                                    placeholder="Search product or scan barcode"
                                    value={product.productName || productSearchTerm}
                                    onChange={(e) => {
                                      handleProductSearch(e.target.value)
                                      // Clear the selected product if user starts typing
                                      if (product.productName && e.target.value !== product.productName) {
                                        const updatedProducts = [...form.products]
                                        updatedProducts[index] = {
                                          ...updatedProducts[index],
                                          productId: '',
                                          productName: '',
                                          inStock: 0,
                                          unitPrice: 0
                                        }
                                        setForm({ ...form, products: updatedProducts })
                                      }
                                    }}
                                    onFocus={() => setShowProductSuggestions(true)}
                                    className="flex-1 text-sm"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handleBarcodeScan}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                                  >
                                    📷
                                  </Button>
                                </div>
                                {showProductSuggestions && filteredProducts.length > 0 && (
                                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {filteredProducts.slice(0, 5).map((p) => (
                                      <div
                                        key={p.sku}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                                        onClick={() => handleProductSelect(index, p)}
                                      >
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-gray-500">SKU: {p.sku} | Stock: {p.stock}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3 text-sm">{product.inStock}</td>
                            <td className="py-2 px-3">
                              <Input
                                type="number"
                                value={product.qty}
                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                value={product.batchNo}
                                onChange={(e) => {
                                  const updatedProducts = [...form.products]
                                  updatedProducts[index].batchNo = e.target.value
                                  setForm({ ...form, products: updatedProducts })
                                }}
                                className="w-24"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="date"
                                value={product.mfDate || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...form.products]
                                  updatedProducts[index].mfDate = e.target.value
                                  setForm({ ...form, products: updatedProducts })
                                }}
                                className="w-28 text-sm"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="date"
                                value={product.expDate || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...form.products]
                                  updatedProducts[index].expDate = e.target.value
                                  setForm({ ...form, products: updatedProducts })
                                }}
                                className="w-28 text-sm"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={addProductRow}
                                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                >
                                  +
                                </Button>
                                {form.products.length > 1 && (
                                  <Button
                                    size="sm"
                                    onClick={() => removeProductRow(index)}
                                    className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                                  >
                                    -
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                      Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Stock-In Records Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Stock-In Records</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Print</Button>
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">SI No.</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Vendor Name</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Challan Date</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Challan No.</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Transportation Name</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Transportation Charges</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Bill No</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Bill Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{record.id}</td>
                        <td className="py-2 px-3 text-sm">{record.vendorName}</td>
                        <td className="py-2 px-3 text-sm">{record.challanDate}</td>
                        <td className="py-2 px-3 text-sm">{record.challanNo}</td>
                        <td className="py-2 px-3 text-sm">{record.transportName}</td>
                        <td className="py-2 px-3 text-sm">₹{record.transportCharges.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm">{record.billNo}</td>
                        <td className="py-2 px-3 text-sm">{record.billDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
                </p>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button size="sm" variant="outline" className="bg-orange-100 text-orange-700">
                    {currentPage}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredRecords.length / itemsPerPage), currentPage + 1))}
                    disabled={currentPage >= Math.ceil(filteredRecords.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Search Modal */}
        {showVendorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Vendor</h3>
                <Button
                  onClick={() => setShowVendorModal(false)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <div className="mb-4">
                <Input
                  placeholder="Search vendors by name, contact, or GSTIN..."
                  value={vendorSearchTerm}
                  onChange={(e) => setVendorSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Name</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Contact</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">GSTIN</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Outstanding</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-600 text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm font-medium">{vendor.name}</td>
                        <td className="py-2 px-3 text-sm">{vendor.contact}</td>
                        <td className="py-2 px-3 text-sm">{vendor.gstin}</td>
                        <td className="py-2 px-3 text-sm">₹{vendor.outstandingAmount.toLocaleString()}</td>
                        <td className="py-2 px-3">
                          <Button
                            size="sm"
                            onClick={() => handleVendorSelect(vendor)}
                            className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1"
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredVendors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No vendors found matching your search.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

