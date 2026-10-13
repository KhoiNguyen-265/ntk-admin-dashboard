import type {
  TimeRangeFilter,
  StatItem,
  RevenueChartPoint,
  CategorySalesPoint,
  CustomerGrowthPoint,
  OrderStatusDistribution,
} from '@/types/analytics'

export const mockDashboardStats: Record<TimeRangeFilter, StatItem[]> = {
  '7days': [
    {
      title: 'Total Revenue',
      value: '$24,780.00',
      change: 14.8,
      trend: 'up',
      timeframe: 'vs last 7 days',
    },
    {
      title: 'Total Orders',
      value: '382',
      change: 8.2,
      trend: 'up',
      timeframe: 'vs last 7 days',
    },
    {
      title: 'New Customers',
      value: '148',
      change: 19.5,
      trend: 'up',
      timeframe: 'vs last 7 days',
    },
    {
      title: 'Active Products',
      value: '160',
      change: -1.2,
      trend: 'down',
      timeframe: 'vs last 7 days',
    },
  ],
  '30days': [
    {
      title: 'Total Revenue',
      value: '$98,450.00',
      change: 22.4,
      trend: 'up',
      timeframe: 'vs last 30 days',
    },
    {
      title: 'Total Orders',
      value: '1,428',
      change: 12.6,
      trend: 'up',
      timeframe: 'vs last 30 days',
    },
    {
      title: 'New Customers',
      value: '592',
      change: 24.1,
      trend: 'up',
      timeframe: 'vs last 30 days',
    },
    {
      title: 'Active Products',
      value: '160',
      change: 4.5,
      trend: 'up',
      timeframe: 'vs last 30 days',
    },
  ],
  '3months': [
    {
      title: 'Total Revenue',
      value: '$284,120.00',
      change: 18.2,
      trend: 'up',
      timeframe: 'vs last 3 months',
    },
    {
      title: 'Total Orders',
      value: '4,190',
      change: 15.3,
      trend: 'up',
      timeframe: 'vs last 3 months',
    },
    {
      title: 'New Customers',
      value: '1,820',
      change: 21.0,
      trend: 'up',
      timeframe: 'vs last 3 months',
    },
    {
      title: 'Active Products',
      value: '160',
      change: 7.8,
      trend: 'up',
      timeframe: 'vs last 3 months',
    },
  ],
  '12months': [
    {
      title: 'Total Revenue',
      value: '$1,142,500.00',
      change: 34.6,
      trend: 'up',
      timeframe: 'vs last year',
    },
    {
      title: 'Total Orders',
      value: '16,840',
      change: 28.4,
      trend: 'up',
      timeframe: 'vs last year',
    },
    {
      title: 'New Customers',
      value: '7,340',
      change: 38.2,
      trend: 'up',
      timeframe: 'vs last year',
    },
    {
      title: 'Active Products',
      value: '160',
      change: 12.0,
      trend: 'up',
      timeframe: 'vs last year',
    },
  ],
}

export const mockRevenueChartData: Record<TimeRangeFilter, RevenueChartPoint[]> = {
  '7days': [
    { name: 'Mon', revenue: 3200, orders: 48, profit: 1280 },
    { name: 'Tue', revenue: 4100, orders: 56, profit: 1640 },
    { name: 'Wed', revenue: 2900, orders: 42, profit: 1120 },
    { name: 'Thu', revenue: 5400, orders: 74, profit: 2160 },
    { name: 'Fri', revenue: 6200, orders: 86, profit: 2480 },
    { name: 'Sat', revenue: 4800, orders: 68, profit: 1920 },
    { name: 'Sun', revenue: 3800, orders: 52, profit: 1520 },
  ],
  '30days': [
    { name: 'Week 1', revenue: 21400, orders: 310, profit: 8560 },
    { name: 'Week 2', revenue: 26800, orders: 390, profit: 10720 },
    { name: 'Week 3', revenue: 24100, orders: 350, profit: 9640 },
    { name: 'Week 4', revenue: 29500, orders: 420, profit: 11800 },
  ],
  '3months': [
    { name: 'Month 1', revenue: 86400, orders: 1240, profit: 34560 },
    { name: 'Month 2', revenue: 94200, orders: 1390, profit: 37680 },
    { name: 'Month 3', revenue: 103520, orders: 1560, profit: 41400 },
  ],
  '12months': [
    { name: 'Jan', revenue: 68000, orders: 1020, profit: 27200 },
    { name: 'Feb', revenue: 74000, orders: 1110, profit: 29600 },
    { name: 'Mar', revenue: 82000, orders: 1240, profit: 32800 },
    { name: 'Apr', revenue: 79000, orders: 1190, profit: 31600 },
    { name: 'May', revenue: 91000, orders: 1380, profit: 36400 },
    { name: 'Jun', revenue: 98000, orders: 1470, profit: 39200 },
    { name: 'Jul', revenue: 104000, orders: 1560, profit: 41600 },
    { name: 'Aug', revenue: 96000, orders: 1440, profit: 38400 },
    { name: 'Sep', revenue: 112000, orders: 1680, profit: 44800 },
    { name: 'Oct', revenue: 118000, orders: 1770, profit: 47200 },
    { name: 'Nov', revenue: 132000, orders: 1980, profit: 52800 },
    { name: 'Dec', revenue: 148000, orders: 2220, profit: 59200 },
  ],
}

export const mockSalesByCategory: CategorySalesPoint[] = [
  { name: 'Audio & Sound', value: 38400, color: '#6366f1' },
  { name: 'Wearables', value: 29100, color: '#06b6d4' },
  { name: 'Gaming & VR', value: 24500, color: '#ec4899' },
  { name: 'Electronics', value: 19800, color: '#f59e0b' },
  { name: 'Smart Home', value: 11200, color: '#10b981' },
  { name: 'Office & Desk', value: 7200, color: '#8b5cf6' },
]

export const mockCustomerGrowth: CustomerGrowthPoint[] = [
  { month: 'Jan', newCustomers: 320, returningCustomers: 740 },
  { month: 'Feb', newCustomers: 380, returningCustomers: 820 },
  { month: 'Mar', newCustomers: 450, returningCustomers: 910 },
  { month: 'Apr', newCustomers: 410, returningCustomers: 950 },
  { month: 'May', newCustomers: 520, returningCustomers: 1040 },
  { month: 'Jun', newCustomers: 590, returningCustomers: 1180 },
]

export const mockOrderStatusDistribution: OrderStatusDistribution[] = [
  { name: 'Delivered', count: 890, color: '#10b981' },
  { name: 'Processing', count: 320, color: '#3b82f6' },
  { name: 'Shipped', count: 180, color: '#8b5cf6' },
  { name: 'Pending', count: 65, color: '#f59e0b' },
  { name: 'Cancelled', count: 32, color: '#ef4444' },
]
