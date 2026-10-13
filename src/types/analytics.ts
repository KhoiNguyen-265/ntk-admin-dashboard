export type TimeRangeFilter = '7days' | '30days' | '3months' | '12months'

export interface StatItem {
  title: string
  value: string | number
  change: number // percentage, e.g. 12.5 or -3.2
  trend: 'up' | 'down'
  timeframe: string
}

export interface RevenueChartPoint {
  name: string
  revenue: number
  orders: number
  profit: number
}

export interface CategorySalesPoint {
  name: string
  value: number
  color: string
}

export interface CustomerGrowthPoint {
  month: string
  newCustomers: number
  returningCustomers: number
}

export interface OrderStatusDistribution {
  name: string
  count: number
  color: string
}
