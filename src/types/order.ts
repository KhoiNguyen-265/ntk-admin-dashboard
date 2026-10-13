export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'
export type PaymentMethod = 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Apple Pay'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerAvatar?: string
  date: string
  totalAmount: number
  taxAmount: number
  shippingAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  notes?: string
}

export interface OrderFilters {
  search: string
  status: OrderStatus | 'all'
  paymentStatus: PaymentStatus | 'all'
  dateRange: 'all' | 'today' | '7days' | '30days'
  sortBy: 'date' | 'totalAmount' | 'customerName'
  sortDirection: 'asc' | 'desc'
}
