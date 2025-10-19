'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@retail/ui'
import { Vendor } from '@retail/shared'

interface VendorSelectorProps {
  selectedVendor: string | null
  selectedVendorData: Vendor | undefined
  onVendorSearch: () => void
  showVendorModal: boolean
  onCloseModal: () => void
  vendorSearchTerm: string
  onSearchTermChange: (term: string) => void
  onVendorSelect: (vendorId: string) => void
  vendors: Vendor[]
}

export default function VendorSelector({
  selectedVendor,
  selectedVendorData,
  onVendorSearch,
  showVendorModal,
  onCloseModal,
  vendorSearchTerm,
  onSearchTermChange,
  onVendorSelect,
  vendors
}: VendorSelectorProps) {
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
    vendor.contact?.toLowerCase().includes(vendorSearchTerm.toLowerCase())
  )

  return (
    <Card className="vendor-selector">
      <CardHeader>
        <CardTitle>Vendor Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vendor Search */}
        <div className="flex space-x-3">
          <Input
            placeholder="Search vendor..."
            value={vendorSearchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={onVendorSearch}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Search vendor
          </Button>
        </div>

        {/* Selected Vendor Details */}
        {selectedVendorData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Selected Vendor</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>ID:</strong> {selectedVendorData.id}</p>
              <p><strong>Name:</strong> {selectedVendorData.name}</p>
              <p><strong>Address:</strong> {selectedVendorData.address}</p>
              <p><strong>Contact No:</strong> {selectedVendorData.contact}</p>
              <p><strong>GST NO:</strong> {selectedVendorData.gstNo || 'Not Registered'}</p>
            </div>
          </div>
        )}

        {/* Vendor Search Modal */}
        {showVendorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Select Vendor</h3>
                <Button
                  onClick={onCloseModal}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredVendors.map(vendor => (
                  <div
                    key={vendor.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onVendorSelect(vendor.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-sm text-gray-600">{vendor.address}</p>
                        <p className="text-sm text-gray-500">Contact: {vendor.contact}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">ID: {vendor.id}</p>
                        {vendor.gstNo && (
                          <p className="text-sm text-gray-500">GST: {vendor.gstNo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredVendors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No vendors found matching your search.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
