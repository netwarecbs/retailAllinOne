import { Product } from '../types/product';

export const sampleProducts: Product[] = [
    // Boys' Shirts - Enhanced with more products
    {
        id: '1',
        name: "Boys' Cotton Formal Shirt",
        description: 'Comfortable cotton formal shirt for boys, perfect for school and special occasions',
        category: "Boys' Wear",
        subcategory: 'Shirts',
        brand: 'KidsFashion',
        sku: 'BS-COT-001',
        barcode: '8901234567890',
        price: 599,
        mrp: 799,
        costPrice: 350,
        stock: 45,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '1-1', name: '2-3Y', stock: 15, price: 599 },
            { id: '1-2', name: '4-5Y', stock: 12, price: 599 },
            { id: '1-3', name: '6-7Y', stock: 10, price: 599 },
            { id: '1-4', name: '8-9Y', stock: 8, price: 599 }
        ],
        colors: [
            { id: '1-1', name: 'White', code: '#FFFFFF', stock: 15 },
            { id: '1-2', name: 'Light Blue', code: '#87CEEB', stock: 12 },
            { id: '1-3', name: 'Pink', code: '#FFC0CB', stock: 10 },
            { id: '1-4', name: 'Yellow', code: '#FFFF00', stock: 8 }
        ],
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 'shirt', 'formal', 'cotton', 'school'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        name: "Boys' Casual T-Shirt",
        description: 'Comfortable casual t-shirt for daily wear',
        category: "Boys' Wear",
        subcategory: 'T-Shirts',
        brand: 'ComfortKids',
        sku: 'BS-CAS-002',
        barcode: '8901234567891',
        price: 299,
        mrp: 399,
        costPrice: 180,
        stock: 78,
        minStock: 15,
        maxStock: 150,
        unit: 'PCS',
        sizes: [
            { id: '2-1', name: '2-3Y', stock: 20, price: 299 },
            { id: '2-2', name: '4-5Y', stock: 18, price: 299 },
            { id: '2-3', name: '6-7Y', stock: 15, price: 299 },
            { id: '2-4', name: '8-9Y', stock: 12, price: 299 },
            { id: '2-5', name: '10-11Y', stock: 13, price: 299 }
        ],
        colors: [
            { id: '2-1', name: 'Red', code: '#FF0000', stock: 20 },
            { id: '2-2', name: 'Blue', code: '#0000FF', stock: 18 },
            { id: '2-3', name: 'Green', code: '#008000', stock: 15 },
            { id: '2-4', name: 'Orange', code: '#FFA500', stock: 12 },
            { id: '2-5', name: 'Purple', code: '#800080', stock: 13 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 't-shirt', 'casual', 'daily-wear'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '3',
        name: "Boys' Polo Shirt",
        description: 'Classic polo shirt for boys, perfect for semi-formal occasions',
        category: "Boys' Wear",
        subcategory: 'Polo Shirts',
        brand: 'ClassicKids',
        sku: 'BS-POL-003',
        barcode: '8901234567892',
        price: 449,
        mrp: 599,
        costPrice: 250,
        stock: 32,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '3-1', name: '2-3Y', stock: 10, price: 449 },
            { id: '3-2', name: '4-5Y', stock: 8, price: 449 },
            { id: '3-3', name: '6-7Y', stock: 7, price: 449 },
            { id: '3-4', name: '8-9Y', stock: 7, price: 449 }
        ],
        colors: [
            { id: '3-1', name: 'Navy Blue', code: '#000080', stock: 10 },
            { id: '3-2', name: 'Red', code: '#FF0000', stock: 8 },
            { id: '3-3', name: 'Green', code: '#008000', stock: 7 },
            { id: '3-4', name: 'White', code: '#FFFFFF', stock: 7 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 'polo', 'semi-formal', 'classic'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Junior Baby Category - Enhanced
    {
        id: '4',
        name: 'Baby Romper Set',
        description: 'Adorable romper set for babies, soft and comfortable fabric',
        category: 'Junior Baby',
        subcategory: 'Rompers',
        brand: 'BabySoft',
        sku: 'JB-ROP-004',
        barcode: '8901234567893',
        price: 449,
        mrp: 599,
        costPrice: 250,
        stock: 32,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '4-1', name: '0-3M', stock: 10, price: 449 },
            { id: '4-2', name: '3-6M', stock: 8, price: 449 },
            { id: '4-3', name: '6-9M', stock: 7, price: 449 },
            { id: '4-4', name: '9-12M', stock: 7, price: 449 }
        ],
        colors: [
            { id: '4-1', name: 'Pink', code: '#FFC0CB', stock: 10 },
            { id: '4-2', name: 'Blue', code: '#87CEEB', stock: 8 },
            { id: '4-3', name: 'Yellow', code: '#FFFF00', stock: 7 },
            { id: '4-4', name: 'Mint Green', code: '#98FF98', stock: 7 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'romper', 'set', 'soft', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '5',
        name: 'Baby Onesie',
        description: 'Soft cotton onesie for babies, perfect for daily wear',
        category: 'Junior Baby',
        subcategory: 'Onesies',
        brand: 'BabyComfort',
        sku: 'JB-ONE-005',
        barcode: '8901234567894',
        price: 299,
        mrp: 399,
        costPrice: 180,
        stock: 56,
        minStock: 12,
        maxStock: 120,
        unit: 'PCS',
        sizes: [
            { id: '5-1', name: '0-3M', stock: 15, price: 299 },
            { id: '5-2', name: '3-6M', stock: 12, price: 299 },
            { id: '5-3', name: '6-9M', stock: 10, price: 299 },
            { id: '5-4', name: '9-12M', stock: 9, price: 299 },
            { id: '5-5', name: '12-18M', stock: 10, price: 299 }
        ],
        colors: [
            { id: '5-1', name: 'White', code: '#FFFFFF', stock: 15 },
            { id: '5-2', name: 'Pink', code: '#FFC0CB', stock: 12 },
            { id: '5-3', name: 'Blue', code: '#87CEEB', stock: 10 },
            { id: '5-4', name: 'Yellow', code: '#FFFF00', stock: 9 },
            { id: '5-5', name: 'Green', code: '#98FF98', stock: 10 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'onesie', 'cotton', 'daily-wear'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '6',
        name: 'Baby Sleepsuit',
        description: 'Warm and cozy sleepsuit for babies, perfect for bedtime',
        category: 'Junior Baby',
        subcategory: 'Sleepsuits',
        brand: 'BabyWarm',
        sku: 'JB-SLE-006',
        barcode: '8901234567895',
        price: 399,
        mrp: 549,
        costPrice: 220,
        stock: 28,
        minStock: 6,
        maxStock: 70,
        unit: 'PCS',
        sizes: [
            { id: '6-1', name: '0-3M', stock: 8, price: 399 },
            { id: '6-2', name: '3-6M', stock: 7, price: 399 },
            { id: '6-3', name: '6-9M', stock: 6, price: 399 },
            { id: '6-4', name: '9-12M', stock: 7, price: 399 }
        ],
        colors: [
            { id: '6-1', name: 'Light Blue', code: '#87CEEB', stock: 8 },
            { id: '6-2', name: 'Pink', code: '#FFC0CB', stock: 7 },
            { id: '6-3', name: 'Yellow', code: '#FFFF00', stock: 6 },
            { id: '6-4', name: 'White', code: '#FFFFFF', stock: 7 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'sleepsuit', 'warm', 'bedtime', 'cozy'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Sarees - Enhanced with more variety
    {
        id: '7',
        name: 'Silk Saree - Traditional',
        description: 'Beautiful traditional silk saree with intricate designs',
        category: 'Women\'s Wear',
        subcategory: 'Sarees',
        brand: 'TraditionalWeaves',
        sku: 'WW-SAR-007',
        barcode: '8901234567896',
        price: 2499,
        mrp: 3499,
        costPrice: 1500,
        stock: 18,
        minStock: 5,
        maxStock: 50,
        unit: 'PCS',
        sizes: [
            { id: '7-1', name: 'Free Size', stock: 18, price: 2499 }
        ],
        colors: [
            { id: '7-1', name: 'Red', code: '#FF0000', stock: 6 },
            { id: '7-2', name: 'Green', code: '#008000', stock: 4 },
            { id: '7-3', name: 'Blue', code: '#0000FF', stock: 4 },
            { id: '7-4', name: 'Purple', code: '#800080', stock: 4 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['saree', 'silk', 'traditional', 'women', 'ethnic'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '8',
        name: 'Cotton Saree - Casual',
        description: 'Comfortable cotton saree for daily wear',
        category: 'Women\'s Wear',
        subcategory: 'Sarees',
        brand: 'ComfortWeaves',
        sku: 'WW-SAR-008',
        barcode: '8901234567897',
        price: 899,
        mrp: 1199,
        costPrice: 500,
        stock: 42,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '8-1', name: 'Free Size', stock: 42, price: 899 }
        ],
        colors: [
            { id: '8-1', name: 'White', code: '#FFFFFF', stock: 12 },
            { id: '8-2', name: 'Light Blue', code: '#87CEEB', stock: 10 },
            { id: '8-3', name: 'Pink', code: '#FFC0CB', stock: 8 },
            { id: '8-4', name: 'Yellow', code: '#FFFF00', stock: 6 },
            { id: '8-5', name: 'Green', code: '#98FF98', stock: 6 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['saree', 'cotton', 'casual', 'daily-wear', 'women'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '9',
        name: 'Georgette Saree - Party Wear',
        description: 'Elegant georgette saree perfect for parties and celebrations',
        category: 'Women\'s Wear',
        subcategory: 'Sarees',
        brand: 'ElegantWeaves',
        sku: 'WW-SAR-009',
        barcode: '8901234567898',
        price: 1899,
        mrp: 2499,
        costPrice: 1000,
        stock: 25,
        minStock: 5,
        maxStock: 60,
        unit: 'PCS',
        sizes: [
            { id: '9-1', name: 'Free Size', stock: 25, price: 1899 }
        ],
        colors: [
            { id: '9-1', name: 'Gold', code: '#FFD700', stock: 8 },
            { id: '9-2', name: 'Silver', code: '#C0C0C0', stock: 6 },
            { id: '9-3', name: 'Maroon', code: '#800000', stock: 5 },
            { id: '9-4', name: 'Navy Blue', code: '#000080', stock: 6 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['saree', 'georgette', 'party-wear', 'elegant', 'celebration'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Men's Wear - Enhanced
    {
        id: '10',
        name: 'Men\'s Formal Shirt',
        description: 'Premium cotton formal shirt for men',
        category: 'Men\'s Wear',
        subcategory: 'Shirts',
        brand: 'PremiumWear',
        sku: 'MW-SHR-010',
        barcode: '8901234567899',
        price: 899,
        mrp: 1199,
        costPrice: 500,
        stock: 67,
        minStock: 15,
        maxStock: 150,
        unit: 'PCS',
        sizes: [
            { id: '10-1', name: 'S', stock: 15, price: 899 },
            { id: '10-2', name: 'M', stock: 18, price: 899 },
            { id: '10-3', name: 'L', stock: 16, price: 899 },
            { id: '10-4', name: 'XL', stock: 10, price: 899 },
            { id: '10-5', name: 'XXL', stock: 8, price: 899 }
        ],
        colors: [
            { id: '10-1', name: 'White', code: '#FFFFFF', stock: 20 },
            { id: '10-2', name: 'Light Blue', code: '#87CEEB', stock: 18 },
            { id: '10-3', name: 'Pink', code: '#FFC0CB', stock: 15 },
            { id: '10-4', name: 'Yellow', code: '#FFFF00', stock: 14 }
        ],
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'shirt', 'formal', 'cotton', 'premium'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '11',
        name: 'Men\'s Casual Shirt',
        description: 'Comfortable casual shirt for men, perfect for daily wear',
        category: 'Men\'s Wear',
        subcategory: 'Shirts',
        brand: 'ComfortWear',
        sku: 'MW-SHR-011',
        barcode: '8901234567900',
        price: 699,
        mrp: 899,
        costPrice: 400,
        stock: 45,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '11-1', name: 'S', stock: 10, price: 699 },
            { id: '11-2', name: 'M', stock: 12, price: 699 },
            { id: '11-3', name: 'L', stock: 11, price: 699 },
            { id: '11-4', name: 'XL', stock: 8, price: 699 },
            { id: '11-5', name: 'XXL', stock: 4, price: 699 }
        ],
        colors: [
            { id: '11-1', name: 'Blue', code: '#0000FF', stock: 12 },
            { id: '11-2', name: 'Green', code: '#008000', stock: 10 },
            { id: '11-3', name: 'Red', code: '#FF0000', stock: 8 },
            { id: '11-4', name: 'Orange', code: '#FFA500', stock: 7 },
            { id: '11-5', name: 'Purple', code: '#800080', stock: 8 }
        ],
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'shirt', 'casual', 'daily-wear', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '12',
        name: 'Men\'s Jeans',
        description: 'Comfortable denim jeans for men',
        category: 'Men\'s Wear',
        subcategory: 'Jeans',
        brand: 'DenimStyle',
        sku: 'MW-JEA-012',
        barcode: '8901234567901',
        price: 1299,
        mrp: 1699,
        costPrice: 700,
        stock: 34,
        minStock: 10,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '12-1', name: '30', stock: 8, price: 1299 },
            { id: '12-2', name: '32', stock: 10, price: 1299 },
            { id: '12-3', name: '34', stock: 8, price: 1299 },
            { id: '12-4', name: '36', stock: 6, price: 1299 },
            { id: '12-5', name: '38', stock: 2, price: 1299 }
        ],
        colors: [
            { id: '12-1', name: 'Blue', code: '#0000FF', stock: 20 },
            { id: '12-2', name: 'Black', code: '#000000', stock: 14 }
        ],
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'jeans', 'denim', 'casual'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '13',
        name: 'Men\'s T-Shirt',
        description: 'Comfortable cotton t-shirt for men',
        category: 'Men\'s Wear',
        subcategory: 'T-Shirts',
        brand: 'ComfortWear',
        sku: 'MW-TSH-013',
        barcode: '8901234567902',
        price: 399,
        mrp: 549,
        costPrice: 250,
        stock: 89,
        minStock: 20,
        maxStock: 200,
        unit: 'PCS',
        sizes: [
            { id: '13-1', name: 'S', stock: 18, price: 399 },
            { id: '13-2', name: 'M', stock: 20, price: 399 },
            { id: '13-3', name: 'L', stock: 22, price: 399 },
            { id: '13-4', name: 'XL', stock: 16, price: 399 },
            { id: '13-5', name: 'XXL', stock: 13, price: 399 }
        ],
        colors: [
            { id: '13-1', name: 'White', code: '#FFFFFF', stock: 20 },
            { id: '13-2', name: 'Black', code: '#000000', stock: 18 },
            { id: '13-3', name: 'Gray', code: '#808080', stock: 16 },
            { id: '13-4', name: 'Navy Blue', code: '#000080', stock: 15 },
            { id: '13-5', name: 'Red', code: '#FF0000', stock: 20 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['men', 't-shirt', 'cotton', 'casual', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Women's Wear - Enhanced
    {
        id: '14',
        name: 'Women\'s Kurti',
        description: 'Elegant kurti for women, perfect for casual and semi-formal occasions',
        category: 'Women\'s Wear',
        subcategory: 'Kurtis',
        brand: 'ElegantWear',
        sku: 'WW-KUR-014',
        barcode: '8901234567903',
        price: 699,
        mrp: 899,
        costPrice: 400,
        stock: 89,
        minStock: 20,
        maxStock: 200,
        unit: 'PCS',
        sizes: [
            { id: '14-1', name: 'XS', stock: 18, price: 699 },
            { id: '14-2', name: 'S', stock: 20, price: 699 },
            { id: '14-3', name: 'M', stock: 22, price: 699 },
            { id: '14-4', name: 'L', stock: 16, price: 699 },
            { id: '14-5', name: 'XL', stock: 13, price: 699 }
        ],
        colors: [
            { id: '14-1', name: 'Red', code: '#FF0000', stock: 20 },
            { id: '14-2', name: 'Blue', code: '#0000FF', stock: 18 },
            { id: '14-3', name: 'Green', code: '#008000', stock: 16 },
            { id: '14-4', name: 'Purple', code: '#800080', stock: 15 },
            { id: '14-5', name: 'Orange', code: '#FFA500', stock: 20 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'kurti', 'casual', 'elegant', 'ethnic'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '15',
        name: 'Women\'s Salwar Kameez',
        description: 'Traditional salwar kameez set for women',
        category: 'Women\'s Wear',
        subcategory: 'Salwar Kameez',
        brand: 'TraditionalWeaves',
        sku: 'WW-SAL-015',
        barcode: '8901234567904',
        price: 1899,
        mrp: 2499,
        costPrice: 1000,
        stock: 23,
        minStock: 5,
        maxStock: 60,
        unit: 'PCS',
        sizes: [
            { id: '15-1', name: 'XS', stock: 5, price: 1899 },
            { id: '15-2', name: 'S', stock: 6, price: 1899 },
            { id: '15-3', name: 'M', stock: 5, price: 1899 },
            { id: '15-4', name: 'L', stock: 4, price: 1899 },
            { id: '15-5', name: 'XL', stock: 3, price: 1899 }
        ],
        colors: [
            { id: '15-1', name: 'Red', code: '#FF0000', stock: 8 },
            { id: '15-2', name: 'Green', code: '#008000', stock: 6 },
            { id: '15-3', name: 'Blue', code: '#0000FF', stock: 5 },
            { id: '15-4', name: 'Purple', code: '#800080', stock: 4 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'salwar', 'kameez', 'traditional', 'ethnic'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '16',
        name: 'Women\'s T-Shirt',
        description: 'Comfortable cotton t-shirt for women',
        category: 'Women\'s Wear',
        subcategory: 'T-Shirts',
        brand: 'ComfortWear',
        sku: 'WW-TSH-016',
        barcode: '8901234567905',
        price: 349,
        mrp: 449,
        costPrice: 200,
        stock: 67,
        minStock: 15,
        maxStock: 150,
        unit: 'PCS',
        sizes: [
            { id: '16-1', name: 'XS', stock: 12, price: 349 },
            { id: '16-2', name: 'S', stock: 15, price: 349 },
            { id: '16-3', name: 'M', stock: 16, price: 349 },
            { id: '16-4', name: 'L', stock: 14, price: 349 },
            { id: '16-5', name: 'XL', stock: 10, price: 349 }
        ],
        colors: [
            { id: '16-1', name: 'White', code: '#FFFFFF', stock: 15 },
            { id: '16-2', name: 'Black', code: '#000000', stock: 14 },
            { id: '16-3', name: 'Pink', code: '#FFC0CB', stock: 12 },
            { id: '16-4', name: 'Blue', code: '#0000FF', stock: 13 },
            { id: '16-5', name: 'Green', code: '#008000', stock: 13 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['women', 't-shirt', 'cotton', 'casual', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '17',
        name: 'Women\'s Jeans',
        description: 'Stylish denim jeans for women',
        category: 'Women\'s Wear',
        subcategory: 'Jeans',
        brand: 'DenimStyle',
        sku: 'WW-JEA-017',
        barcode: '8901234567906',
        price: 999,
        mrp: 1299,
        costPrice: 550,
        stock: 41,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '17-1', name: '26', stock: 8, price: 999 },
            { id: '17-2', name: '28', stock: 10, price: 999 },
            { id: '17-3', name: '30', stock: 9, price: 999 },
            { id: '17-4', name: '32', stock: 8, price: 999 },
            { id: '17-5', name: '34', stock: 6, price: 999 }
        ],
        colors: [
            { id: '17-1', name: 'Blue', code: '#0000FF', stock: 25 },
            { id: '17-2', name: 'Black', code: '#000000', stock: 16 }
        ],
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'jeans', 'denim', 'stylish', 'casual'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Additional Products - Batch 1 (18-67)
    {
        id: '18',
        name: 'Girls\' Party Dress',
        description: 'Beautiful party dress for girls with elegant design',
        category: 'Girls\' Wear',
        subcategory: 'Dresses',
        brand: 'PrincessFashion',
        sku: 'GW-DRS-018',
        barcode: '8901234567907',
        price: 899,
        mrp: 1199,
        costPrice: 450,
        stock: 28,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '18-1', name: '2-3Y', stock: 8, price: 899 },
            { id: '18-2', name: '4-5Y', stock: 7, price: 899 },
            { id: '18-3', name: '6-7Y', stock: 6, price: 899 },
            { id: '18-4', name: '8-9Y', stock: 7, price: 899 }
        ],
        colors: [
            { id: '18-1', name: 'Pink', code: '#FFC0CB', stock: 10 },
            { id: '18-2', name: 'Purple', code: '#800080', stock: 8 },
            { id: '18-3', name: 'Blue', code: '#87CEEB', stock: 5 },
            { id: '18-4', name: 'Red', code: '#FF0000', stock: 5 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'dress', 'party', 'elegant', 'formal'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '19',
        name: 'Girls\' Casual Top',
        description: 'Comfortable casual top for daily wear',
        category: 'Girls\' Wear',
        subcategory: 'Tops',
        brand: 'KidsComfort',
        sku: 'GW-TOP-019',
        barcode: '8901234567908',
        price: 399,
        mrp: 549,
        costPrice: 200,
        stock: 45,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '19-1', name: '2-3Y', stock: 12, price: 399 },
            { id: '19-2', name: '4-5Y', stock: 10, price: 399 },
            { id: '19-3', name: '6-7Y', stock: 8, price: 399 },
            { id: '19-4', name: '8-9Y', stock: 7, price: 399 },
            { id: '19-5', name: '10-11Y', stock: 8, price: 399 }
        ],
        colors: [
            { id: '19-1', name: 'Yellow', code: '#FFFF00', stock: 10 },
            { id: '19-2', name: 'Green', code: '#98FF98', stock: 8 },
            { id: '19-3', name: 'Orange', code: '#FFA500', stock: 7 },
            { id: '19-4', name: 'Pink', code: '#FFC0CB', stock: 9 },
            { id: '19-5', name: 'Purple', code: '#DDA0DD', stock: 11 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'top', 'casual', 'daily-wear', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '20',
        name: 'Girls\' Jeans',
        description: 'Stylish jeans for girls with comfortable fit',
        category: 'Girls\' Wear',
        subcategory: 'Jeans',
        brand: 'DenimKids',
        sku: 'GW-JEA-020',
        barcode: '8901234567909',
        price: 599,
        mrp: 799,
        costPrice: 300,
        stock: 32,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '20-1', name: '2-3Y', stock: 8, price: 599 },
            { id: '20-2', name: '4-5Y', stock: 7, price: 599 },
            { id: '20-3', name: '6-7Y', stock: 6, price: 599 },
            { id: '20-4', name: '8-9Y', stock: 5, price: 599 },
            { id: '20-5', name: '10-11Y', stock: 6, price: 599 }
        ],
        colors: [
            { id: '20-1', name: 'Blue', code: '#0000FF', stock: 18 },
            { id: '20-2', name: 'Black', code: '#000000', stock: 14 }
        ],
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'jeans', 'denim', 'stylish', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '21',
        name: 'Men\'s Formal Suit',
        description: 'Premium formal suit for professional occasions',
        category: 'Men\'s Wear',
        subcategory: 'Suits',
        brand: 'PremiumFormal',
        sku: 'MW-SUT-021',
        barcode: '8901234567910',
        price: 3499,
        mrp: 4999,
        costPrice: 2000,
        stock: 15,
        minStock: 5,
        maxStock: 50,
        unit: 'PCS',
        sizes: [
            { id: '21-1', name: 'S', stock: 3, price: 3499 },
            { id: '21-2', name: 'M', stock: 4, price: 3499 },
            { id: '21-3', name: 'L', stock: 4, price: 3499 },
            { id: '21-4', name: 'XL', stock: 2, price: 3499 },
            { id: '21-5', name: 'XXL', stock: 2, price: 3499 }
        ],
        colors: [
            { id: '21-1', name: 'Black', code: '#000000', stock: 8 },
            { id: '21-2', name: 'Navy Blue', code: '#000080', stock: 4 },
            { id: '21-3', name: 'Gray', code: '#808080', stock: 3 }
        ],
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'suit', 'formal', 'professional', 'premium'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '22',
        name: 'Women\'s Evening Gown',
        description: 'Elegant evening gown for special occasions',
        category: 'Women\'s Wear',
        subcategory: 'Gowns',
        brand: 'ElegantEvening',
        sku: 'WW-GWN-022',
        barcode: '8901234567911',
        price: 2999,
        mrp: 3999,
        costPrice: 1500,
        stock: 12,
        minStock: 3,
        maxStock: 30,
        unit: 'PCS',
        sizes: [
            { id: '22-1', name: 'XS', stock: 2, price: 2999 },
            { id: '22-2', name: 'S', stock: 3, price: 2999 },
            { id: '22-3', name: 'M', stock: 3, price: 2999 },
            { id: '22-4', name: 'L', stock: 2, price: 2999 },
            { id: '22-5', name: 'XL', stock: 2, price: 2999 }
        ],
        colors: [
            { id: '22-1', name: 'Red', code: '#FF0000', stock: 4 },
            { id: '22-2', name: 'Black', code: '#000000', stock: 4 },
            { id: '22-3', name: 'Gold', code: '#FFD700', stock: 2 },
            { id: '22-4', name: 'Silver', code: '#C0C0C0', stock: 2 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'gown', 'evening', 'elegant', 'special-occasion'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '23',
        name: 'Baby Winter Jacket',
        description: 'Warm winter jacket for babies',
        category: 'Junior Baby',
        subcategory: 'Jackets',
        brand: 'BabyWarm',
        sku: 'JB-JKT-023',
        barcode: '8901234567912',
        price: 799,
        mrp: 999,
        costPrice: 400,
        stock: 25,
        minStock: 6,
        maxStock: 60,
        unit: 'PCS',
        sizes: [
            { id: '23-1', name: '0-3M', stock: 6, price: 799 },
            { id: '23-2', name: '3-6M', stock: 5, price: 799 },
            { id: '23-3', name: '6-9M', stock: 5, price: 799 },
            { id: '23-4', name: '9-12M', stock: 4, price: 799 },
            { id: '23-5', name: '12-18M', stock: 5, price: 799 }
        ],
        colors: [
            { id: '23-1', name: 'Blue', code: '#87CEEB', stock: 8 },
            { id: '23-2', name: 'Pink', code: '#FFC0CB', stock: 7 },
            { id: '23-3', name: 'Yellow', code: '#FFFF00', stock: 5 },
            { id: '23-4', name: 'Green', code: '#98FF98', stock: 5 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'jacket', 'winter', 'warm', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Additional Products - Batch 2 (24-33)
    {
        id: '24',
        name: 'Men\'s Winter Sweater',
        description: 'Warm and cozy winter sweater for men',
        category: 'Men\'s Wear',
        subcategory: 'Sweaters',
        brand: 'WarmStyle',
        sku: 'MW-SWE-024',
        barcode: '8901234567913',
        price: 1299,
        mrp: 1699,
        costPrice: 650,
        stock: 38,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '24-1', name: 'S', stock: 8, price: 1299 },
            { id: '24-2', name: 'M', stock: 10, price: 1299 },
            { id: '24-3', name: 'L', stock: 9, price: 1299 },
            { id: '24-4', name: 'XL', stock: 7, price: 1299 },
            { id: '24-5', name: 'XXL', stock: 4, price: 1299 }
        ],
        colors: [
            { id: '24-1', name: 'Navy Blue', code: '#000080', stock: 12 },
            { id: '24-2', name: 'Gray', code: '#808080', stock: 10 },
            { id: '24-3', name: 'Black', code: '#000000', stock: 8 },
            { id: '24-4', name: 'Brown', code: '#8B4513', stock: 8 }
        ],
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'sweater', 'winter', 'warm', 'cozy'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '25',
        name: 'Women\'s Summer Dress',
        description: 'Light and breezy summer dress for women',
        category: 'Women\'s Wear',
        subcategory: 'Dresses',
        brand: 'SummerStyle',
        sku: 'WW-DRS-025',
        barcode: '8901234567914',
        price: 899,
        mrp: 1199,
        costPrice: 450,
        stock: 52,
        minStock: 12,
        maxStock: 120,
        unit: 'PCS',
        sizes: [
            { id: '25-1', name: 'XS', stock: 10, price: 899 },
            { id: '25-2', name: 'S', stock: 12, price: 899 },
            { id: '25-3', name: 'M', stock: 11, price: 899 },
            { id: '25-4', name: 'L', stock: 10, price: 899 },
            { id: '25-5', name: 'XL', stock: 9, price: 899 }
        ],
        colors: [
            { id: '25-1', name: 'Floral Print', code: '#FF69B4', stock: 15 },
            { id: '25-2', name: 'Blue', code: '#87CEEB', stock: 12 },
            { id: '25-3', name: 'Yellow', code: '#FFFF00', stock: 10 },
            { id: '25-4', name: 'White', code: '#FFFFFF', stock: 15 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'dress', 'summer', 'light', 'breezy'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '26',
        name: 'Boys\' Sports Jersey',
        description: 'Comfortable sports jersey for active boys',
        category: "Boys' Wear",
        subcategory: 'Sports Wear',
        brand: 'SportsKids',
        sku: 'BS-SPO-026',
        barcode: '8901234567915',
        price: 549,
        mrp: 749,
        costPrice: 275,
        stock: 41,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '26-1', name: '2-3Y', stock: 10, price: 549 },
            { id: '26-2', name: '4-5Y', stock: 9, price: 549 },
            { id: '26-3', name: '6-7Y', stock: 8, price: 549 },
            { id: '26-4', name: '8-9Y', stock: 7, price: 549 },
            { id: '26-5', name: '10-11Y', stock: 7, price: 549 }
        ],
        colors: [
            { id: '26-1', name: 'Red', code: '#FF0000', stock: 12 },
            { id: '26-2', name: 'Blue', code: '#0000FF', stock: 10 },
            { id: '26-3', name: 'Green', code: '#008000', stock: 9 },
            { id: '26-4', name: 'Yellow', code: '#FFFF00', stock: 10 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 'jersey', 'sports', 'active', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '27',
        name: 'Girls\' Ballet Dress',
        description: 'Elegant ballet dress for dance performances',
        category: 'Girls\' Wear',
        subcategory: 'Dance Wear',
        brand: 'DanceElegance',
        sku: 'GW-DAN-027',
        barcode: '8901234567916',
        price: 799,
        mrp: 999,
        costPrice: 400,
        stock: 23,
        minStock: 6,
        maxStock: 60,
        unit: 'PCS',
        sizes: [
            { id: '27-1', name: '2-3Y', stock: 6, price: 799 },
            { id: '27-2', name: '4-5Y', stock: 5, price: 799 },
            { id: '27-3', name: '6-7Y', stock: 5, price: 799 },
            { id: '27-4', name: '8-9Y', stock: 4, price: 799 },
            { id: '27-5', name: '10-11Y', stock: 3, price: 799 }
        ],
        colors: [
            { id: '27-1', name: 'Pink', code: '#FFC0CB', stock: 8 },
            { id: '27-2', name: 'White', code: '#FFFFFF', stock: 6 },
            { id: '27-3', name: 'Light Blue', code: '#87CEEB', stock: 5 },
            { id: '27-4', name: 'Lavender', code: '#E6E6FA', stock: 4 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'ballet', 'dance', 'elegant', 'performance'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '28',
        name: 'Baby Summer Hat',
        description: 'Protective summer hat for babies',
        category: 'Junior Baby',
        subcategory: 'Hats',
        brand: 'BabyProtect',
        sku: 'JB-HAT-028',
        barcode: '8901234567917',
        price: 199,
        mrp: 299,
        costPrice: 100,
        stock: 67,
        minStock: 15,
        maxStock: 150,
        unit: 'PCS',
        sizes: [
            { id: '28-1', name: '0-3M', stock: 15, price: 199 },
            { id: '28-2', name: '3-6M', stock: 14, price: 199 },
            { id: '28-3', name: '6-9M', stock: 13, price: 199 },
            { id: '28-4', name: '9-12M', stock: 12, price: 199 },
            { id: '28-5', name: '12-18M', stock: 13, price: 199 }
        ],
        colors: [
            { id: '28-1', name: 'White', code: '#FFFFFF', stock: 18 },
            { id: '28-2', name: 'Yellow', code: '#FFFF00', stock: 15 },
            { id: '28-3', name: 'Blue', code: '#87CEEB', stock: 14 },
            { id: '28-4', name: 'Pink', code: '#FFC0CB', stock: 20 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'hat', 'summer', 'protective', 'sun-safe'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '29',
        name: 'Men\'s Leather Jacket',
        description: 'Stylish leather jacket for men',
        category: 'Men\'s Wear',
        subcategory: 'Jackets',
        brand: 'LeatherStyle',
        sku: 'MW-JKT-029',
        barcode: '8901234567918',
        price: 2499,
        mrp: 3499,
        costPrice: 1250,
        stock: 18,
        minStock: 5,
        maxStock: 50,
        unit: 'PCS',
        sizes: [
            { id: '29-1', name: 'S', stock: 4, price: 2499 },
            { id: '29-2', name: 'M', stock: 5, price: 2499 },
            { id: '29-3', name: 'L', stock: 4, price: 2499 },
            { id: '29-4', name: 'XL', stock: 3, price: 2499 },
            { id: '29-5', name: 'XXL', stock: 2, price: 2499 }
        ],
        colors: [
            { id: '29-1', name: 'Black', code: '#000000', stock: 10 },
            { id: '29-2', name: 'Brown', code: '#8B4513', stock: 8 }
        ],
        images: [
            'https://images.unsplash.com/photo-1521223890158-4d089d2d7439?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'jacket', 'leather', 'stylish', 'premium'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '30',
        name: 'Women\'s Winter Coat',
        description: 'Warm winter coat for women',
        category: 'Women\'s Wear',
        subcategory: 'Coats',
        brand: 'WarmElegance',
        sku: 'WW-COT-030',
        barcode: '8901234567919',
        price: 1899,
        mrp: 2499,
        costPrice: 950,
        stock: 28,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '30-1', name: 'XS', stock: 6, price: 1899 },
            { id: '30-2', name: 'S', stock: 7, price: 1899 },
            { id: '30-3', name: 'M', stock: 6, price: 1899 },
            { id: '30-4', name: 'L', stock: 5, price: 1899 },
            { id: '30-5', name: 'XL', stock: 4, price: 1899 }
        ],
        colors: [
            { id: '30-1', name: 'Black', code: '#000000', stock: 10 },
            { id: '30-2', name: 'Navy Blue', code: '#000080', stock: 8 },
            { id: '30-3', name: 'Gray', code: '#808080', stock: 6 },
            { id: '30-4', name: 'Red', code: '#FF0000', stock: 4 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'coat', 'winter', 'warm', 'elegant'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '31',
        name: 'Boys\' Formal Blazer',
        description: 'Smart formal blazer for boys',
        category: "Boys' Wear",
        subcategory: 'Blazers',
        brand: 'SmartKids',
        sku: 'BS-BLA-031',
        barcode: '8901234567920',
        price: 999,
        mrp: 1299,
        costPrice: 500,
        stock: 22,
        minStock: 6,
        maxStock: 60,
        unit: 'PCS',
        sizes: [
            { id: '31-1', name: '2-3Y', stock: 6, price: 999 },
            { id: '31-2', name: '4-5Y', stock: 5, price: 999 },
            { id: '31-3', name: '6-7Y', stock: 4, price: 999 },
            { id: '31-4', name: '8-9Y', stock: 4, price: 999 },
            { id: '31-5', name: '10-11Y', stock: 3, price: 999 }
        ],
        colors: [
            { id: '31-1', name: 'Navy Blue', code: '#000080', stock: 8 },
            { id: '31-2', name: 'Black', code: '#000000', stock: 6 },
            { id: '31-3', name: 'Gray', code: '#808080', stock: 4 },
            { id: '31-4', name: 'Brown', code: '#8B4513', stock: 4 }
        ],
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 'blazer', 'formal', 'smart', 'school'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '32',
        name: 'Girls\' Raincoat',
        description: 'Colorful raincoat for girls',
        category: 'Girls\' Wear',
        subcategory: 'Rainwear',
        brand: 'RainbowKids',
        sku: 'GW-RAI-032',
        barcode: '8901234567921',
        price: 449,
        mrp: 599,
        costPrice: 225,
        stock: 35,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '32-1', name: '2-3Y', stock: 8, price: 449 },
            { id: '32-2', name: '4-5Y', stock: 7, price: 449 },
            { id: '32-3', name: '6-7Y', stock: 6, price: 449 },
            { id: '32-4', name: '8-9Y', stock: 5, price: 449 },
            { id: '32-5', name: '10-11Y', stock: 9, price: 449 }
        ],
        colors: [
            { id: '32-1', name: 'Yellow', code: '#FFFF00', stock: 10 },
            { id: '32-2', name: 'Pink', code: '#FFC0CB', stock: 8 },
            { id: '32-3', name: 'Blue', code: '#87CEEB', stock: 7 },
            { id: '32-4', name: 'Green', code: '#98FF98', stock: 10 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'raincoat', 'rainy', 'colorful', 'protective'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '33',
        name: 'Baby Sleep Sack',
        description: 'Comfortable sleep sack for babies',
        category: 'Junior Baby',
        subcategory: 'Sleepwear',
        brand: 'BabySleep',
        sku: 'JB-SLE-033',
        barcode: '8901234567922',
        price: 349,
        mrp: 449,
        costPrice: 175,
        stock: 48,
        minStock: 12,
        maxStock: 120,
        unit: 'PCS',
        sizes: [
            { id: '33-1', name: '0-3M', stock: 12, price: 349 },
            { id: '33-2', name: '3-6M', stock: 10, price: 349 },
            { id: '33-3', name: '6-9M', stock: 9, price: 349 },
            { id: '33-4', name: '9-12M', stock: 8, price: 349 },
            { id: '33-5', name: '12-18M', stock: 9, price: 349 }
        ],
        colors: [
            { id: '33-1', name: 'Light Blue', code: '#87CEEB', stock: 12 },
            { id: '33-2', name: 'Pink', code: '#FFC0CB', stock: 10 },
            { id: '33-3', name: 'Yellow', code: '#FFFF00', stock: 8 },
            { id: '33-4', name: 'Mint Green', code: '#98FF98', stock: 9 },
            { id: '33-5', name: 'White', code: '#FFFFFF', stock: 9 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'sleep', 'sack', 'comfortable', 'bedtime'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },

    // Additional Products - Batch 3 (34-43)
    {
        id: '34',
        name: 'Men\'s Track Suit',
        description: 'Comfortable track suit for men, perfect for sports and casual wear',
        category: 'Men\'s Wear',
        subcategory: 'Track Suits',
        brand: 'SportsComfort',
        sku: 'MW-TRK-034',
        barcode: '8901234567923',
        price: 899,
        mrp: 1199,
        costPrice: 450,
        stock: 35,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '34-1', name: 'S', stock: 8, price: 899 },
            { id: '34-2', name: 'M', stock: 10, price: 899 },
            { id: '34-3', name: 'L', stock: 9, price: 899 },
            { id: '34-4', name: 'XL', stock: 6, price: 899 },
            { id: '34-5', name: 'XXL', stock: 2, price: 899 }
        ],
        colors: [
            { id: '34-1', name: 'Black', code: '#000000', stock: 12 },
            { id: '34-2', name: 'Navy Blue', code: '#000080', stock: 10 },
            { id: '34-3', name: 'Gray', code: '#808080', stock: 8 },
            { id: '34-4', name: 'Red', code: '#FF0000', stock: 5 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'track', 'suit', 'sports', 'casual'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '35',
        name: 'Women\'s Yoga Pants',
        description: 'Comfortable yoga pants for women, perfect for workouts',
        category: 'Women\'s Wear',
        subcategory: 'Activewear',
        brand: 'FitStyle',
        sku: 'WW-YOG-035',
        barcode: '8901234567924',
        price: 649,
        mrp: 849,
        costPrice: 325,
        stock: 42,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '35-1', name: 'XS', stock: 8, price: 649 },
            { id: '35-2', name: 'S', stock: 10, price: 649 },
            { id: '35-3', name: 'M', stock: 9, price: 649 },
            { id: '35-4', name: 'L', stock: 8, price: 649 },
            { id: '35-5', name: 'XL', stock: 7, price: 649 }
        ],
        colors: [
            { id: '35-1', name: 'Black', code: '#000000', stock: 15 },
            { id: '35-2', name: 'Gray', code: '#808080', stock: 12 },
            { id: '35-3', name: 'Navy Blue', code: '#000080', stock: 8 },
            { id: '35-4', name: 'Purple', code: '#800080', stock: 7 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'yoga', 'pants', 'activewear', 'workout'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '36',
        name: 'Boys\' Winter Cap',
        description: 'Warm winter cap for boys',
        category: "Boys' Wear",
        subcategory: 'Caps',
        brand: 'WarmKids',
        sku: 'BS-CAP-036',
        barcode: '8901234567925',
        price: 199,
        mrp: 299,
        costPrice: 100,
        stock: 58,
        minStock: 12,
        maxStock: 120,
        unit: 'PCS',
        sizes: [
            { id: '36-1', name: '2-3Y', stock: 12, price: 199 },
            { id: '36-2', name: '4-5Y', stock: 11, price: 199 },
            { id: '36-3', name: '6-7Y', stock: 10, price: 199 },
            { id: '36-4', name: '8-9Y', stock: 9, price: 199 },
            { id: '36-5', name: '10-11Y', stock: 16, price: 199 }
        ],
        colors: [
            { id: '36-1', name: 'Blue', code: '#0000FF', stock: 15 },
            { id: '36-2', name: 'Red', code: '#FF0000', stock: 12 },
            { id: '36-3', name: 'Green', code: '#008000', stock: 10 },
            { id: '36-4', name: 'Black', code: '#000000', stock: 11 },
            { id: '36-5', name: 'Gray', code: '#808080', stock: 10 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 'cap', 'winter', 'warm', 'comfortable'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '37',
        name: 'Girls\' Hair Accessories Set',
        description: 'Beautiful hair accessories set for girls',
        category: 'Girls\' Wear',
        subcategory: 'Accessories',
        brand: 'PrettyAccessories',
        sku: 'GW-HAI-037',
        barcode: '8901234567926',
        price: 299,
        mrp: 399,
        costPrice: 150,
        stock: 75,
        minStock: 15,
        maxStock: 150,
        unit: 'PCS',
        sizes: [
            { id: '37-1', name: 'One Size', stock: 75, price: 299 }
        ],
        colors: [
            { id: '37-1', name: 'Pink Set', code: '#FFC0CB', stock: 20 },
            { id: '37-2', name: 'Purple Set', code: '#800080', stock: 18 },
            { id: '37-3', name: 'Blue Set', code: '#0000FF', stock: 15 },
            { id: '37-4', name: 'Rainbow Set', code: '#FF69B4', stock: 22 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'hair', 'accessories', 'pretty', 'decorative'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '38',
        name: 'Baby Bib Set',
        description: 'Soft cotton bib set for babies',
        category: 'Junior Baby',
        subcategory: 'Bibs',
        brand: 'BabySoft',
        sku: 'JB-BIB-038',
        barcode: '8901234567927',
        price: 249,
        mrp: 349,
        costPrice: 125,
        stock: 82,
        minStock: 20,
        maxStock: 200,
        unit: 'PCS',
        sizes: [
            { id: '38-1', name: '0-6M', stock: 20, price: 249 },
            { id: '38-2', name: '6-12M', stock: 18, price: 249 },
            { id: '38-3', name: '12-18M', stock: 16, price: 249 },
            { id: '38-4', name: '18-24M', stock: 14, price: 249 },
            { id: '38-5', name: '2-3Y', stock: 14, price: 249 }
        ],
        colors: [
            { id: '38-1', name: 'White', code: '#FFFFFF', stock: 20 },
            { id: '38-2', name: 'Pink', code: '#FFC0CB', stock: 18 },
            { id: '38-3', name: 'Blue', code: '#87CEEB', stock: 16 },
            { id: '38-4', name: 'Yellow', code: '#FFFF00', stock: 14 },
            { id: '38-5', name: 'Green', code: '#98FF98', stock: 14 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'bib', 'cotton', 'feeding', 'protective'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '39',
        name: 'Men\'s Waistcoat',
        description: 'Elegant waistcoat for men, perfect for formal occasions',
        category: 'Men\'s Wear',
        subcategory: 'Waistcoats',
        brand: 'ElegantFormal',
        sku: 'MW-WAI-039',
        barcode: '8901234567928',
        price: 1499,
        mrp: 1999,
        costPrice: 750,
        stock: 18,
        minStock: 5,
        maxStock: 50,
        unit: 'PCS',
        sizes: [
            { id: '39-1', name: 'S', stock: 4, price: 1499 },
            { id: '39-2', name: 'M', stock: 5, price: 1499 },
            { id: '39-3', name: 'L', stock: 4, price: 1499 },
            { id: '39-4', name: 'XL', stock: 3, price: 1499 },
            { id: '39-5', name: 'XXL', stock: 2, price: 1499 }
        ],
        colors: [
            { id: '39-1', name: 'Black', code: '#000000', stock: 8 },
            { id: '39-2', name: 'Navy Blue', code: '#000080', stock: 6 },
            { id: '39-3', name: 'Gray', code: '#808080', stock: 4 }
        ],
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['men', 'waistcoat', 'formal', 'elegant', 'professional'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '40',
        name: 'Women\'s Shawl',
        description: 'Elegant shawl for women, perfect for ethnic wear',
        category: 'Women\'s Wear',
        subcategory: 'Shawls',
        brand: 'ElegantWeaves',
        sku: 'WW-SHA-040',
        barcode: '8901234567929',
        price: 799,
        mrp: 999,
        costPrice: 400,
        stock: 31,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '40-1', name: 'Free Size', stock: 31, price: 799 }
        ],
        colors: [
            { id: '40-1', name: 'Red', code: '#FF0000', stock: 8 },
            { id: '40-2', name: 'Green', code: '#008000', stock: 6 },
            { id: '40-3', name: 'Blue', code: '#0000FF', stock: 5 },
            { id: '40-4', name: 'Purple', code: '#800080', stock: 4 },
            { id: '40-5', name: 'Gold', code: '#FFD700', stock: 8 }
        ],
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['women', 'shawl', 'ethnic', 'elegant', 'traditional'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '41',
        name: 'Boys\' School Bag',
        description: 'Durable school bag for boys',
        category: "Boys' Wear",
        subcategory: 'Bags',
        brand: 'SchoolEssentials',
        sku: 'BS-BAG-041',
        barcode: '8901234567930',
        price: 599,
        mrp: 799,
        costPrice: 300,
        stock: 28,
        minStock: 8,
        maxStock: 80,
        unit: 'PCS',
        sizes: [
            { id: '41-1', name: 'Small', stock: 8, price: 599 },
            { id: '41-2', name: 'Medium', stock: 10, price: 599 },
            { id: '41-3', name: 'Large', stock: 10, price: 599 }
        ],
        colors: [
            { id: '41-1', name: 'Blue', code: '#0000FF', stock: 10 },
            { id: '41-2', name: 'Black', code: '#000000', stock: 8 },
            { id: '41-3', name: 'Red', code: '#FF0000', stock: 5 },
            { id: '41-4', name: 'Green', code: '#008000', stock: 5 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['boys', 'bag', 'school', 'durable', 'backpack'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '42',
        name: 'Girls\' Sunglasses',
        description: 'Stylish sunglasses for girls',
        category: 'Girls\' Wear',
        subcategory: 'Accessories',
        brand: 'CoolKids',
        sku: 'GW-SUN-042',
        barcode: '8901234567931',
        price: 399,
        mrp: 549,
        costPrice: 200,
        stock: 45,
        minStock: 10,
        maxStock: 100,
        unit: 'PCS',
        sizes: [
            { id: '42-1', name: 'Kids Size', stock: 45, price: 399 }
        ],
        colors: [
            { id: '42-1', name: 'Pink Frame', code: '#FFC0CB', stock: 12 },
            { id: '42-2', name: 'Blue Frame', code: '#87CEEB', stock: 10 },
            { id: '42-3', name: 'Purple Frame', code: '#DDA0DD', stock: 8 },
            { id: '42-4', name: 'Black Frame', code: '#000000', stock: 8 },
            { id: '42-5', name: 'Rainbow Frame', code: '#FF69B4', stock: 7 }
        ],
        images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
        ],
        tags: ['girls', 'sunglasses', 'stylish', 'protective', 'fashion'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '43',
        name: 'Baby Mittens Set',
        description: 'Soft mittens set for babies',
        category: 'Junior Baby',
        subcategory: 'Mittens',
        brand: 'BabySoft',
        sku: 'JB-MIT-043',
        barcode: '8901234567932',
        price: 149,
        mrp: 199,
        costPrice: 75,
        stock: 95,
        minStock: 20,
        maxStock: 200,
        unit: 'PCS',
        sizes: [
            { id: '43-1', name: '0-3M', stock: 20, price: 149 },
            { id: '43-2', name: '3-6M', stock: 18, price: 149 },
            { id: '43-3', name: '6-9M', stock: 16, price: 149 },
            { id: '43-4', name: '9-12M', stock: 15, price: 149 },
            { id: '43-5', name: '12-18M', stock: 26, price: 149 }
        ],
        colors: [
            { id: '43-1', name: 'White', code: '#FFFFFF', stock: 20 },
            { id: '43-2', name: 'Pink', code: '#FFC0CB', stock: 18 },
            { id: '43-3', name: 'Blue', code: '#87CEEB', stock: 16 },
            { id: '43-4', name: 'Yellow', code: '#FFFF00', stock: 15 },
            { id: '43-5', name: 'Green', code: '#98FF98', stock: 26 }
        ],
        images: [
            'https://images.unsplash.com/photo-1553451191-6d5f2c2c1c1c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
        ],
        tags: ['baby', 'mittens', 'soft', 'protective', 'warm'],
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    }


];

export const sampleCategories = [
    { id: '1', name: "Boys' Wear", description: 'Clothing for boys', isActive: true },
    { id: '2', name: 'Junior Baby', description: 'Clothing for babies and toddlers', isActive: true },
    { id: '3', name: "Women's Wear", description: 'Clothing for women', isActive: true },
    { id: '4', name: "Men's Wear", description: 'Clothing for men', isActive: true },
    { id: '5', name: "Girls' Wear", description: 'Clothing for girls', isActive: true },
    { id: '6', name: 'Accessories', description: 'Fashion accessories', isActive: true },
    { id: '7', name: 'Home & Living', description: 'Home decor and textiles', isActive: true },
    { id: '8', name: 'Footwear', description: 'Shoes and sandals', isActive: true }
];
