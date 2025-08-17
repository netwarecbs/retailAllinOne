export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    brand?: string;
    sku: string;
    barcode?: string;
    price: number;
    mrp: number;
    costPrice: number;
    stock: number;
    minStock: number;
    maxStock: number;
    unit: string;
    sizes: ProductSize[];
    colors: ProductColor[];
    images: string[];
    sizeImages?: ProductSizeImage[];
    colorImages?: ProductColorImage[];
    tags: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ProductSize {
    id: string;
    name: string;
    stock: number;
    price?: number;
}
export interface ProductColor {
    id: string;
    name: string;
    code: string;
    stock: number;
    price?: number;
}
export interface ProductSizeImage {
    id: string;
    imageUrl: string;
    sizeId: string;
    sizeName: string;
    description?: string;
    isMain: boolean;
}
export interface ProductColorImage {
    id: string;
    imageUrl: string;
    colorId: string;
    colorName: string;
    colorCode: string;
    description?: string;
    isMain: boolean;
}
export interface Category {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    isActive: boolean;
}
export interface ProductSearchParams {
    query?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    limit?: number;
}
export interface ProductResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
