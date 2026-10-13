import { create } from 'zustand'
import type { Product, ProductFilters, ProductFormData } from '@/types/product'
import { initialProducts } from '@/data/mockProducts'

interface ProductState {
  products: Product[]
  filters: ProductFilters
  currentPage: number
  pageSize: number
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void
  resetFilters: () => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  addProduct: (data: ProductFormData, categoryName: string) => Product
  updateProduct: (id: string, data: Partial<ProductFormData>, categoryName?: string) => void
  deleteProduct: (id: string) => void
  getFilteredProducts: () => Product[]
}

const defaultFilters: ProductFilters = {
  search: '',
  categoryId: 'all',
  status: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts,
  filters: defaultFilters,
  currentPage: 1,
  pageSize: 8,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1, // reset to page 1 on filter change
    }))
  },

  resetFilters: () => {
    set({ filters: defaultFilters, currentPage: 1 })
  },

  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

  addProduct: (data, categoryName) => {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      categoryName: categoryName || 'Uncategorized',
      salesCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ products: [newProduct, ...state.products] }))
    return newProduct
  },

  updateProduct: (id, data, categoryName) => {
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          ...data,
          categoryName: categoryName || p.categoryName,
        }
      }),
    }))
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }))
  },

  getFilteredProducts: () => {
    const { products, filters } = get()
    let result = [...products]

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (filters.categoryId !== 'all') {
      result = result.filter((p) => p.categoryId === filters.categoryId)
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'price') {
        comparison = a.price - b.price
      } else if (filters.sortBy === 'stock') {
        comparison = a.stock - b.stock
      } else if (filters.sortBy === 'salesCount') {
        comparison = a.salesCount - b.salesCount
      } else if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (filters.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  },
}))
