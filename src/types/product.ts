export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'draft'

export interface Product {
  id: string
  name: string
  sku: string
  categoryId: string
  categoryName: string
  price: number
  originalPrice?: number
  stock: number
  status: ProductStatus
  image: string
  rating: number
  salesCount: number
  createdAt: string
  description: string
}

export interface ProductFilters {
  search: string
  categoryId: string
  status: ProductStatus | 'all'
  sortBy: 'price' | 'stock' | 'salesCount' | 'name' | 'createdAt'
  sortDirection: 'asc' | 'desc'
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating' | 'categoryName'>
