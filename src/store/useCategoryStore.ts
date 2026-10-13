import { create } from 'zustand'
import type { Category, CategoryFormData, CategoryStatus } from '@/types/category'
import { initialCategories } from '@/data/mockCategories'

interface CategoryState {
  categories: Category[]
  search: string
  statusFilter: CategoryStatus | 'all'
  setSearch: (search: string) => void
  setStatusFilter: (status: CategoryStatus | 'all') => void
  addCategory: (data: CategoryFormData) => Category
  updateCategory: (id: string, data: Partial<CategoryFormData>) => void
  deleteCategory: (id: string) => void
  getFilteredCategories: () => Category[]
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: initialCategories,
  search: '',
  statusFilter: 'all',

  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  addCategory: (data) => {
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ categories: [newCategory, ...state.categories] }))
    return newCategory
  },

  updateCategory: (id, data) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }))
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }))
  },

  getFilteredCategories: () => {
    const { categories, search, statusFilter } = get()
    return categories.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
  },
}))
