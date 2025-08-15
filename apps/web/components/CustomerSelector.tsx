'use client'

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@retail/ui';
import { AppDispatch, setCustomer } from '@retail/shared';
import { Customer } from '@retail/shared';

interface CustomerSelectorProps {
    selectedCustomer: Customer | null;
    onCustomerSelect?: (customer: Customer) => void;
}

// Utility function to mask PAN number (show only last 4 characters)
const maskPAN = (pan: string): string => {
    if (!pan || pan.length < 4) return pan;
    return '*'.repeat(pan.length - 4) + pan.slice(-4);
};

// Utility function to mask phone number (show only last 4 digits)
const maskPhone = (phone: string): string => {
    if (!phone || phone.length < 4) return phone;
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
};

export default function CustomerSelector({
    selectedCustomer,
    onCustomerSelect
}: CustomerSelectorProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock customer data - in real app, this would come from API
    const mockCustomers: Customer[] = [
        {
            id: '1',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@email.com',
            phone: '+91-9876543210',
            address: '123 Main Street, Mumbai, Maharashtra 400001',
            pan: 'ABCDE1234F',
            gstin: '27ABCDE1234F1Z5',
            isWholesale: false,
            creditLimit: 50000,
            outstandingAmount: 15000,
            customerType: 'retail',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
        },
        {
            id: '2',
            name: 'Priya Patel',
            email: 'priya.patel@email.com',
            phone: '+91-8765432109',
            address: '456 Park Avenue, Delhi, Delhi 110001',
            pan: 'FGHIJ5678K',
            gstin: '07FGHIJ5678K2Z6',
            isWholesale: false,
            creditLimit: 30000,
            outstandingAmount: 5000,
            customerType: 'retail',
            createdAt: '2024-01-16T11:00:00Z',
            updatedAt: '2024-01-16T11:00:00Z'
        },
        {
            id: '3',
            name: 'Amit Kumar',
            email: 'amit.kumar@email.com',
            phone: '+91-7654321098',
            address: '789 Business Park, Bangalore, Karnataka 560001',
            pan: 'KLMNO9012P',
            gstin: '29KLMNO9012P3Z7',
            isWholesale: true,
            creditLimit: 200000,
            outstandingAmount: 75000,
            customerType: 'wholesale',
            createdAt: '2024-01-17T12:00:00Z',
            updatedAt: '2024-01-17T12:00:00Z'
        },
        {
            id: '4',
            name: 'Sneha Gupta',
            email: 'sneha.gupta@email.com',
            phone: '+91-6543210987',
            address: '321 Mall Road, Chennai, Tamil Nadu 600001',
            pan: 'PQRST3456U',
            gstin: '33PQRST3456U4Z8',
            isWholesale: false,
            creditLimit: 40000,
            outstandingAmount: 0,
            customerType: 'retail',
            createdAt: '2024-01-18T13:00:00Z',
            updatedAt: '2024-01-18T13:00:00Z'
        },
        {
            id: '5',
            name: 'Vikram Singh',
            email: 'vikram.singh@email.com',
            phone: '+91-5432109876',
            address: '654 Industrial Area, Hyderabad, Telangana 500001',
            pan: 'UVWXY7890Z',
            gstin: '36UVWXY7890Z5Z9',
            isWholesale: true,
            creditLimit: 150000,
            outstandingAmount: 25000,
            customerType: 'wholesale',
            createdAt: '2024-01-19T14:00:00Z',
            updatedAt: '2024-01-19T14:00:00Z'
        }
    ];

    // Filter customers based on search query
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = mockCustomers.filter(customer =>
                customer.name.toLowerCase().includes(query) ||
                customer.phone?.includes(query) ||
                customer.email?.toLowerCase().includes(query) ||
                customer.pan?.toLowerCase().includes(query) ||
                customer.gstin?.toLowerCase().includes(query)
            );
            setFilteredCustomers(filtered);
            setShowDropdown(true);
        } else {
            setFilteredCustomers([]);
            setShowDropdown(false);
        }
    }, [searchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCustomerSelect = (customer: Customer) => {
        dispatch(setCustomer(customer));
        setSearchQuery(customer.name);
        setShowDropdown(false);
        onCustomerSelect?.(customer);
    };

    const handleClearCustomer = () => {
        dispatch(setCustomer(null));
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (!e.target.value.trim()) {
            dispatch(setCustomer(null));
        }
    };

    const handleInputFocus = () => {
        if (searchQuery.trim()) {
            setShowDropdown(true);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="mb-4">
                <label className="block text-gray-600 mb-1 text-xs">Search Customer</label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Search by name, phone, email, PAN, or GSTIN..."
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {selectedCustomer && (
                        <button
                            onClick={handleClearCustomer}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Customer Dropdown */}
            {showDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-sm text-gray-900">{customer.name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full ${customer.isWholesale
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {customer.isWholesale ? 'Wholesale' : 'Retail'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                                        <div>📧 {customer.email}</div>
                                        <div>📞 {maskPhone(customer.phone || '')}</div>
                                        <div>🏠 {customer.address}</div>
                                        {customer.pan && (
                                            <div>🆔 PAN: {maskPAN(customer.pan)}</div>
                                        )}
                                        {customer.gstin && (
                                            <div>🏢 GSTIN: {customer.gstin}</div>
                                        )}
                                        {customer.creditLimit && (
                                            <div>💳 Credit Limit: ₹{customer.creditLimit.toLocaleString()}</div>
                                        )}
                                        {customer.outstandingAmount !== undefined && (
                                            <div className={`${customer.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                💰 Outstanding: ₹{customer.outstandingAmount.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Customer Display */}
            {selectedCustomer && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{selectedCustomer.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${selectedCustomer.isWholesale
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                    {selectedCustomer.isWholesale ? 'Wholesale' : 'Retail'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>📧 {selectedCustomer.email}</div>
                                <div>📞 {selectedCustomer.phone}</div>
                                <div>🏠 {selectedCustomer.address}</div>
                                {selectedCustomer.pan && (
                                    <div>🆔 PAN: {maskPAN(selectedCustomer.pan)}</div>
                                )}
                                {selectedCustomer.gstin && (
                                    <div>🏢 GSTIN: {selectedCustomer.gstin}</div>
                                )}
                                {selectedCustomer.creditLimit && (
                                    <div>💳 Credit Limit: ₹{selectedCustomer.creditLimit.toLocaleString()}</div>
                                )}
                                {selectedCustomer.outstandingAmount !== undefined && (
                                    <div className={`${selectedCustomer.outstandingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'
                                        }`}>
                                        💰 Outstanding: ₹{selectedCustomer.outstandingAmount.toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleClearCustomer}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
