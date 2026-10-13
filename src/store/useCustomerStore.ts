import { create } from 'zustand'
import type { Customer, CustomerFilters, CustomerFormData } from '@/types/customer'
import { initialCustomers } from '@/data/mockCustomers'

interface CustomerState {
  customers: Customer[]
  filters: CustomerFilters
  selectedCustomerId: string | null
  currentPage: number
  pageSize: number
  setFilter: <K extends keyof CustomerFilters>(key: K, value: CustomerFilters[K]) => void
  resetFilters: () => void
  setSelectedCustomerId: (id: string | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  addCustomer: (data: CustomerFormData) => Customer
  updateCustomer: (id: string, data: Partial<CustomerFormData>) => void
  deleteCustomer: (id: string) => void
  getFilteredCustomers: () => Customer[]
}

const defaultFilters: CustomerFilters = {
  search: '',
  status: 'all',
  sortBy: 'totalSpent',
  sortDirection: 'desc',
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: initialCustomers,
  filters: defaultFilters,
  selectedCustomerId: null,
  currentPage: 1,
  pageSize: 8,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1,
    }))
  },

  resetFilters: () => {
    set({ filters: defaultFilters, currentPage: 1 })
  },

  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

  addCustomer: (data) => {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      totalSpent: 0,
      ordersCount: 0,
      lastOrderDate: new Date().toISOString(),
      joinedDate: new Date().toISOString(),
    }
    set((state) => ({ customers: [newCustomer, ...state.customers] }))
    return newCustomer
  },

  updateCustomer: (id, data) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }))
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
      selectedCustomerId: state.selectedCustomerId === id ? null : state.selectedCustomerId,
    }))
  },

  getFilteredCustomers: () => {
    const { customers, filters } = get()
    let result = [...customers]

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'totalSpent') {
        comparison = a.totalSpent - b.totalSpent
      } else if (filters.sortBy === 'ordersCount') {
        comparison = a.ordersCount - b.ordersCount
      } else if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (filters.sortBy === 'joinedDate') {
        comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  },
}))
