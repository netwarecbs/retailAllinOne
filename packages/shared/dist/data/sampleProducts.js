export const sampleProducts = [
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
    }
];
export const sampleCategories = [
    { id: '1', name: "Boys' Wear", description: 'Clothing for boys', isActive: true },
    { id: '2', name: 'Junior Baby', description: 'Clothing for babies and toddlers', isActive: true },
    { id: '3', name: "Women's Wear", description: 'Clothing for women', isActive: true },
    { id: '4', name: "Men's Wear", description: 'Clothing for men', isActive: true }
];
