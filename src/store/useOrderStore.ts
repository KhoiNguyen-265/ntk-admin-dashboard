import { create } from 'zustand'
import type { Order, OrderFilters, OrderStatus, PaymentStatus } from '@/types/order'
import { initialOrders } from '@/data/mockOrders'

interface OrderState {
  orders: Order[]
  filters: OrderFilters
  selectedOrderId: string | null
  currentPage: number
  pageSize: number
  setFilter: <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => void
  resetFilters: () => void
  setSelectedOrderId: (id: string | null) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) => void
  deleteOrder: (id: string) => void
  getFilteredOrders: () => Order[]
}

const defaultFilters: OrderFilters = {
  search: '',
  status: 'all',
  paymentStatus: 'all',
  dateRange: 'all',
  sortBy: 'date',
  sortDirection: 'desc',
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: initialOrders,
  filters: defaultFilters,
  selectedOrderId: null,
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

  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }))
  },

  updatePaymentStatus: (id, paymentStatus) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, paymentStatus } : o)),
    }))
  },

  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
      selectedOrderId: state.selectedOrderId === id ? null : state.selectedOrderId,
    }))
  },

  getFilteredOrders: () => {
    const { orders, filters } = get()
    let result = [...orders]

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((o) => o.status === filters.status)
    }

    // Payment Status filter
    if (filters.paymentStatus !== 'all') {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus)
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date().getTime()
      result = result.filter((o) => {
        const orderTime = new Date(o.date).getTime()
        const diffDays = (now - orderTime) / (1000 * 3600 * 24)
        if (filters.dateRange === 'today') return diffDays <= 1
        if (filters.dateRange === '7days') return diffDays <= 7
        if (filters.dateRange === '30days') return diffDays <= 30
        return true
      })
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (filters.sortBy === 'totalAmount') {
        comparison = a.totalAmount - b.totalAmount
      } else if (filters.sortBy === 'customerName') {
        comparison = a.customerName.localeCompare(b.customerName)
      } else if (filters.sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  },
}))
