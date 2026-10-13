export type CustomerStatus = 'active' | 'inactive' | 'blocked'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  status: CustomerStatus
  totalSpent: number
  ordersCount: number
  lastOrderDate: string
  joinedDate: string
  address: string
  city: string
  country: string
}

export interface CustomerFilters {
  search: string
  status: CustomerStatus | 'all'
  sortBy: 'totalSpent' | 'ordersCount' | 'name' | 'joinedDate'
  sortDirection: 'asc' | 'desc'
}

export type CustomerFormData = Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'lastOrderDate' | 'joinedDate'>
