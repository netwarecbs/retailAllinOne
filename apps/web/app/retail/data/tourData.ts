export interface TourStep {
    id: string
    title: string
    description: string
    target: string
    position: 'top' | 'bottom' | 'left' | 'right'
    action?: 'click' | 'navigate'
    route?: string
    highlight?: boolean
}

export interface TourSection {
    id: string
    name: string
    description: string
    icon: string
    route: string
    steps: TourStep[]
    lastUpdated: string
    version: string
}

export const tourSections: TourSection[] = [
    {
        id: 'dashboard',
        name: 'Dashboard Overview',
        description: 'Learn about the main dashboard and key metrics',
        icon: '📊',
        route: '/retail',
        version: '1.0.0',
        lastUpdated: '2024-01-22',
        steps: [
            {
                id: 'dashboard-welcome',
                title: 'Welcome to Retail Hub!',
                description: 'This is your main dashboard where you can see key performance indicators, recent activities, and quick access to all features.',
                target: '.dashboard-header',
                position: 'bottom'
            },
            {
                id: 'dashboard-kpis',
                title: 'Key Performance Indicators',
                description: 'Monitor your business performance with real-time KPIs including sales, inventory, customers, and revenue metrics.',
                target: '.kpi-cards',
                position: 'top'
            },
            {
                id: 'dashboard-charts',
                title: 'Analytics Charts',
                description: 'Visualize your business data with interactive charts showing sales trends, category performance, and growth metrics.',
                target: '.analytics-charts',
                position: 'top'
            },
            {
                id: 'dashboard-alerts',
                title: 'Alerts & Notifications',
                description: 'Stay informed with low stock alerts, expiring products, and important business notifications.',
                target: '.alerts-section',
                position: 'top'
            }
        ]
    },
    {
        id: 'inventory',
        name: 'Inventory Management',
        description: 'Master inventory operations, stock management, and product tracking',
        icon: '📦',
        route: '/retail/inventory',
        version: '1.0.0',
        lastUpdated: '2024-01-22',
        steps: [
            {
                id: 'inventory-overview',
                title: 'Inventory Dashboard',
                description: 'View all your products, track stock levels, and manage inventory efficiently.',
                target: '.inventory-header',
                position: 'bottom'
            },
            {
                id: 'inventory-products',
                title: 'Product Management',
                description: 'Add, edit, and organize your products with categories, pricing, and stock information.',
                target: '.product-table',
                position: 'top'
            },
            {
                id: 'inventory-stock-in',
                title: 'Stock-In Operations',
                description: 'Record incoming stock with vendor details, batch information, and expiry dates.',
                target: '.stock-in-button',
                position: 'right',
                action: 'navigate',
                route: '/retail/inventory/stock-in'
            },
            {
                id: 'inventory-stock-adjustment',
                title: 'Stock Adjustment',
                description: 'Adjust stock levels, handle discrepancies, and maintain accurate inventory counts.',
                target: '.stock-adjustment-button',
                position: 'right',
                action: 'navigate',
                route: '/retail/inventory/stock-adjustment'
            },
            {
                id: 'inventory-returns',
                title: 'Stock Returns',
                description: 'Process returns from customers or vendors with detailed tracking and reason codes.',
                target: '.returns-button',
                position: 'right'
            },
            {
                id: 'inventory-search',
                title: 'Search & Filter',
                description: 'Quickly find products using search, filters, and category-based browsing.',
                target: '.inventory-search',
                position: 'top'
            }
        ]
    },
    {
        id: 'sales',
        name: 'Sales Management',
        description: 'Learn point-of-sale operations, customer management, and sales processing',
        icon: '💰',
        route: '/retail/sales',
        version: '1.0.0',
        lastUpdated: '2024-01-22',
        steps: [
            {
                id: 'sales-overview',
                title: 'Sales Dashboard',
                description: 'Process sales transactions, manage customers, and handle various payment methods.',
                target: '.sales-header',
                position: 'bottom'
            },
            {
                id: 'sales-customer',
                title: 'Customer Selection',
                description: 'Select or add customers with autocomplete search and customer type management.',
                target: '.customer-selection',
                position: 'top'
            },
            {
                id: 'sales-products',
                title: 'Product Selection',
                description: 'Add products to cart with barcode scanning, autocomplete search, and category filtering.',
                target: '.product-selection',
                position: 'top'
            },
            {
                id: 'sales-cart',
                title: 'Shopping Cart',
                description: 'Manage cart items, apply discounts, and calculate taxes automatically.',
                target: '.cart-section',
                position: 'top'
            },
            {
                id: 'sales-payment',
                title: 'Payment Processing',
                description: 'Handle multiple payment methods including cash, card, UPI, and digital wallets.',
                target: '.payment-section',
                position: 'top'
            },
            {
                id: 'sales-returns',
                title: 'Sales Returns',
                description: 'Process returns with bill-wise tracking and customer-specific return policies.',
                target: '.sales-return-button',
                position: 'right'
            }
        ]
    },
    {
        id: 'purchase',
        name: 'Purchase Management',
        description: 'Manage purchase bills, vendor challans, and inventory procurement',
        icon: '🛒',
        route: '/retail/purchase',
        version: '1.0.0',
        lastUpdated: '2024-01-22',
        steps: [
            {
                id: 'purchase-overview',
                title: 'Purchase Dashboard',
                description: 'Create purchase bills from vendor challans and manage procurement processes.',
                target: '.purchase-header',
                position: 'bottom'
            },
            {
                id: 'purchase-vendor',
                title: 'Vendor Selection',
                description: 'Select vendors to view their pending challans and create purchase bills.',
                target: '.vendor-selector',
                position: 'top'
            },
            {
                id: 'purchase-challans',
                title: 'Pending Challans',
                description: 'View and select challans from the selected vendor to create purchase bills.',
                target: '.challans-table',
                position: 'top'
            },
            {
                id: 'purchase-products',
                title: 'Product Details',
                description: 'Review and edit product quantities, rates, and tax calculations.',
                target: '.product-table',
                position: 'top'
            },
            {
                id: 'purchase-payment',
                title: 'Payment Entry',
                description: 'Enter payment details with multiple transaction types (Cash, Cheque, Credit, Discount).',
                target: '.payment-form',
                position: 'top'
            },
            {
                id: 'purchase-submit',
                title: 'Submit Purchase Bill',
                description: 'Finalize and submit the purchase bill to update inventory stock.',
                target: '.bill-summary',
                position: 'top'
            }
        ]
    },
    {
        id: 'settings',
        name: 'Settings & Configuration',
        description: 'Configure your retail system, manage master data, and set up preferences',
        icon: '⚙️',
        route: '/retail/settings',
        version: '1.0.0',
        lastUpdated: '2024-01-22',
        steps: [
            {
                id: 'settings-overview',
                title: 'Settings Dashboard',
                description: 'Configure your retail system with shop information, user management, and system preferences.',
                target: '.settings-header',
                position: 'bottom'
            },
            {
                id: 'settings-shop',
                title: 'Shop Information',
                description: 'Set up your shop details, contact information, and business registration.',
                target: '.shop-tab',
                position: 'top'
            },
            {
                id: 'settings-materials',
                title: 'Material Management',
                description: 'Add and manage your product catalog with categories, pricing, and specifications.',
                target: '.material-tab',
                position: 'top'
            },
            {
                id: 'settings-customers',
                title: 'Customer Management',
                description: 'Manage customer information, types, and loyalty programs.',
                target: '.customer-tab',
                position: 'top'
            },
            {
                id: 'settings-vendors',
                title: 'Vendor Management',
                description: 'Add and manage supplier information, contact details, and payment terms.',
                target: '.vendor-tab',
                position: 'top'
            },
            {
                id: 'settings-rate-chart',
                title: 'Rate Chart Management',
                description: 'Set up pricing for different customer types and manage rate structures.',
                target: '.rate-chart-tab',
                position: 'top'
            },
            {
                id: 'settings-system',
                title: 'System Settings',
                description: 'Configure backup, restore, and system maintenance options.',
                target: '.system-tab',
                position: 'top'
            }
        ]
    },
    {
        id: 'reports',
        name: 'Reports & Analytics',
        description: 'Generate reports, analyze data, and track business performance',
        icon: '📈',
        route: '/retail/reports',
        version: '1.0.0',
        lastUpdated: '2024-01-22',
        steps: [
            {
                id: 'reports-overview',
                title: 'Reports Dashboard',
                description: 'Access comprehensive reports for sales, inventory, customers, and financial data.',
                target: '.reports-header',
                position: 'bottom'
            },
            {
                id: 'reports-sales',
                title: 'Sales Reports',
                description: 'Generate sales reports by date, product, customer, and payment method.',
                target: '.sales-reports',
                position: 'top'
            },
            {
                id: 'reports-inventory',
                title: 'Inventory Reports',
                description: 'Track stock levels, movement, and inventory valuation reports.',
                target: '.inventory-reports',
                position: 'top'
            },
            {
                id: 'reports-customers',
                title: 'Customer Reports',
                description: 'Analyze customer behavior, purchase patterns, and loyalty metrics.',
                target: '.customer-reports',
                position: 'top'
            },
            {
                id: 'reports-financial',
                title: 'Financial Reports',
                description: 'Generate profit & loss, balance sheet, and cash flow reports.',
                target: '.financial-reports',
                position: 'top'
            }
        ]
    }
]

// Tour configuration for easy updates
export const tourConfig = {
    version: '1.0.0',
    lastUpdated: '2024-01-22',
    features: [
        'Interactive step-by-step guidance',
        'Progress tracking and completion status',
        'Contextual help and tooltips',
        'Easy tour updates for new features',
        'Responsive design for all devices',
        'Keyboard navigation support'
    ],
    updateInstructions: [
        'To add new tour steps: Add entries to the steps array in the relevant section',
        'To update existing steps: Modify the step object properties',
        'To add new sections: Create new TourSection objects and add to tourSections array',
        'To remove steps: Delete the step object from the steps array',
        'Always update the lastUpdated date when making changes',
        'Test tours after updates to ensure all targets exist'
    ]
}

// Helper functions for tour management
export const getTourSection = (sectionId: string): TourSection | undefined => {
    return tourSections.find(section => section.id === sectionId)
}

export const getTourStep = (sectionId: string, stepId: string): TourStep | undefined => {
    const section = getTourSection(sectionId)
    return section?.steps.find(step => step.id === stepId)
}

export const addTourStep = (sectionId: string, step: TourStep): void => {
    const section = getTourSection(sectionId)
    if (section) {
        section.steps.push(step)
        section.lastUpdated = new Date().toISOString().split('T')[0]
    }
}

export const updateTourStep = (sectionId: string, stepId: string, updates: Partial<TourStep>): void => {
    const section = getTourSection(sectionId)
    if (section) {
        const stepIndex = section.steps.findIndex(step => step.id === stepId)
        if (stepIndex !== -1) {
            section.steps[stepIndex] = { ...section.steps[stepIndex], ...updates }
            section.lastUpdated = new Date().toISOString().split('T')[0]
        }
    }
}

export const removeTourStep = (sectionId: string, stepId: string): void => {
    const section = getTourSection(sectionId)
    if (section) {
        section.steps = section.steps.filter(step => step.id !== stepId)
        section.lastUpdated = new Date().toISOString().split('T')[0]
    }
}
