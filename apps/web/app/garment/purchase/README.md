# Purchase Page - Garment Retail System

## Overview

The Purchase Page is a comprehensive purchase order management system designed for garment retail businesses. It provides a complete workflow for creating, managing, and processing purchase orders with suppliers.

## Features

### 🏢 Supplier Management
- **Supplier Information**: Complete supplier details including name, reference, contact information, and addresses
- **GST Integration**: GST number and state management for tax compliance
- **Credit Management**: Track previous orders, credit limits, and outstanding amounts
- **Loyalty System**: Loyalty card integration for supplier rewards

### 📦 Product Management
- **Product Search**: Multiple search options including barcode scanning, brand, and description
- **Product Catalog**: Browse complete product catalog with images, pricing, and stock information
- **Real-time Stock**: Live stock updates and availability checking
- **Product Details**: Comprehensive product information including SKU, category, unit, and pricing

### 💰 Purchase Order Processing
- **Dynamic Pricing**: Automatic calculation of purchase rates, profit percentages, and sale prices
- **Tax Management**: HSN codes and GST percentage handling
- **Quantity Management**: Flexible quantity input with stock validation
- **Total Calculations**: Automatic subtotal, GST, and grand total calculations

### 💳 Payment Processing
- **Multiple Payment Methods**: Cash, Card, and UPI payment options
- **Payment Distribution**: Split payments across different methods
- **Payment Validation**: Ensure payment amounts match total order value

### 📊 Expense Management
- **Expense Categories**: Categorize purchases (Inventory, Operational, Marketing, Utilities)
- **Financial Tracking**: Complete financial record keeping for accounting

### 🔐 Security & Permissions
- **Role-Based Access Control (RBAC)**: Secure access based on user roles
- **Action Permissions**: Granular permissions for save, print, and PDF export
- **Audit Trail**: Complete tracking of purchase order changes

## Architecture

### State Management
The purchase page uses a combination of local state and Redux for optimal performance:

- **Local State**: UI interactions, form data, and temporary calculations
- **Redux Store**: Product data, purchase orders, and supplier information
- **Real-time Updates**: Automatic recalculation of totals and pricing

### Component Structure
```
PurchasePage/
├── Header Form (Supplier Information)
├── Search Controls (Product Search)
├── Purchase Items Table
├── Sidebar (Totals & Payments)
├── Action Buttons
└── Product Selection Modal
```

### Data Flow
1. **Product Selection**: Users search and select products from the catalog
2. **Item Configuration**: Configure quantities, pricing, and tax information
3. **Supplier Setup**: Enter or select supplier information
4. **Payment Setup**: Configure payment methods and amounts
5. **Order Processing**: Save, print, or export the purchase order

## Usage Guide

### Creating a Purchase Order

1. **Enter Supplier Information**
   - Fill in supplier name, reference, and contact details
   - Add GST number and state information
   - Review credit history and limits

2. **Add Products**
   - Use barcode scanner or search functionality
   - Browse product catalog using the "Browse Products" button
   - Select products and they'll be added to the purchase order

3. **Configure Items**
   - Adjust quantities as needed
   - Modify purchase rates and profit percentages
   - Add HSN codes and GST percentages
   - Review calculated sale prices and MRP

4. **Set Payment Details**
   - Choose expense category
   - Distribute payments across cash, card, and UPI
   - Ensure payment total matches order total

5. **Process Order**
   - Save the purchase order
   - Print the order for physical records
   - Export to PDF for digital storage

### Key Features

#### Barcode Scanning
- Enter barcode in the search field and press Enter
- System automatically finds and adds the product
- Supports multiple barcode formats

#### Product Search
- Search by product name, SKU, or category
- Filter by brand and description
- Real-time search results

#### Automatic Calculations
- **Purchase Rate**: Base cost price from product catalog
- **Profit Percentage**: Configurable profit margin (default 20%)
- **Sale Price**: Automatically calculated based on purchase rate and profit
- **GST**: Applied based on configured percentage (default 18%)
- **Totals**: Real-time calculation of line items and order totals

#### Payment Validation
- System ensures payment amounts match order total
- Supports partial payments and payment splitting
- Tracks payment method distribution

## Technical Implementation

### Dependencies
- **React**: Frontend framework
- **Redux Toolkit**: State management
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Hot Toast**: Notifications

### Key Components

#### PurchaseProductModal
- Specialized modal for product selection
- Advanced search and filtering
- Product preview with images and details
- Stock availability checking

#### Purchase Items Table
- Editable inline fields for quantities and pricing
- Real-time total calculations
- Remove items functionality
- Responsive design for mobile devices

#### Supplier Form
- Comprehensive supplier information capture
- Validation and error handling
- Credit history display
- GST compliance fields

### State Management

#### Local State
```typescript
interface PurchaseState {
  supplier: Supplier;
  purchaseItems: PurchaseItem[];
  paymentMethods: PaymentMethods;
  expenseCategory: string;
  searchQuery: string;
  showProductModal: boolean;
}
```

#### Redux Store
```typescript
interface PurchaseSlice {
  purchaseOrders: PurchaseOrder[];
  currentPurchaseOrder: PurchaseOrder | null;
  suppliers: Supplier[];
  products: Product[];
  loading: boolean;
  error: string | null;
}
```

## Business Logic

### Pricing Calculations
1. **Purchase Rate**: Base cost from supplier
2. **Profit Margin**: Configurable percentage (default 20%)
3. **Sale Price**: Purchase Rate + (Purchase Rate × Profit %)
4. **GST Amount**: Line Total × GST %
5. **Line Total**: Quantity × Purchase Rate
6. **Order Total**: Sum of all line totals + GST

### Validation Rules
- Supplier name is required
- At least one product must be added
- Payment total must match order total
- Quantities must be positive numbers
- Stock availability must be considered

### Error Handling
- Form validation with user-friendly messages
- Network error handling for API calls
- Graceful degradation for missing data
- Toast notifications for user feedback

## Future Enhancements

### Planned Features
- **Supplier Management**: Dedicated supplier management interface
- **Purchase History**: View and manage previous purchase orders
- **Approval Workflow**: Multi-level approval system
- **Inventory Integration**: Automatic stock updates
- **Reporting**: Purchase analytics and reports
- **Email Integration**: Send purchase orders via email
- **Mobile App**: Native mobile application

### Technical Improvements
- **Offline Support**: Work offline and sync when connected
- **Real-time Collaboration**: Multiple users can work on same order
- **Advanced Search**: Full-text search with filters
- **Bulk Operations**: Import/export purchase orders
- **API Integration**: Connect with supplier APIs for real-time pricing

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Author**: Senior Architect Team
