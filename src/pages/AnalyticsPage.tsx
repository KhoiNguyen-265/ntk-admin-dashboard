import React, { useState } from 'react'
import { Card, CardHeader } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  mockRevenueChartData,
  mockSalesByCategory,
  mockCustomerGrowth,
  mockOrderStatusDistribution,
} from '@/data/mockAnalytics'
import { useProductStore } from '@/store/useProductStore'
import { useToastStore } from '@/store/useToastStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import type { TimeRangeFilter } from '@/types/analytics'
import { formatCurrency, formatNumber, exportToCSV } from '@/lib/utils'
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Target,
  Download,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30days')
  const { products } = useProductStore()
  const { isDark } = useThemeStore()
  const { info } = useToastStore()
  const { t } = useLanguageStore()
  const { settings } = useSettingsStore()
  const accentColor = settings.appearance.accentColor || '#6366f1'

  const revenueData = mockRevenueChartData[timeRange]
  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5)

  const gridColor = isDark ? '#1e293b' : '#f1f5f9'
  const textColor = isDark ? '#64748b' : '#94a3b8'

  const handleExportReport = () => {
    const reportData = revenueData.map((d) => ({
      Period: d.name,
      Revenue: d.revenue,
      Orders: d.orders,
      Profit: d.profit,
    }))
    exportToCSV(`analytics-report-${timeRange}`, reportData)
    info('Exported analytics report to CSV')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.analytics.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.analytics.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Buttons */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            {(['7days', '30days', '3months', '12months'] as TimeRangeFilter[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {range === '7days'
                  ? t.dashboard.filter7Days
                  : range === '30days'
                  ? t.dashboard.filter30Days
                  : range === '3months'
                  ? t.dashboard.filter3Months
                  : t.dashboard.filter12Months}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {t.common.export}
          </Button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.dashboard.totalRevenue}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                $98,450.00
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+22.4% vs last period</span>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.dashboard.totalOrders}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,428</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.6% vs last period</span>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.dashboard.newCustomers}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">592</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.1% new signups</span>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.analytics.conversionRate}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3.42%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+0.8% increase</span>
          </div>
        </Card>
      </div>

      {/* Main Charts Grid: Revenue & Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={t.analytics.revenueTrajectory}
            subtitle={t.dashboard.revenueSubtitle}
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="anProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(value: unknown, name: unknown) => [
                    formatCurrency(typeof value === 'number' ? value : 0),
                    String(name).charAt(0).toUpperCase() + String(name).slice(1),
                  ]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={accentColor}
                  strokeWidth={2.5}
                  fill="url(#anRevenue)"
                  name="revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#anProfit)"
                  name="profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sales by Category Donut Chart */}
        <Card>
          <CardHeader
            title={t.analytics.salesByCategory}
            subtitle={t.analytics.salesByCategorySub}
          />
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockSalesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockSalesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [formatCurrency(typeof val === 'number' ? val : 0), 'Sales']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2">
            {mockSalesByCategory.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Secondary Charts: Customer Growth & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Bar Chart */}
        <Card>
          <CardHeader
            title={t.analytics.customerGrowth}
            subtitle={t.analytics.customerGrowthSub}
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCustomerGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="month" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="newCustomers" name={t.analytics.newCustomersLabel} fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="returningCustomers"
                  name={t.analytics.returningCustomersLabel}
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader
            title={t.analytics.orderStatusDist}
            subtitle={t.analytics.orderStatusDistSub}
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={mockOrderStatusDistribution}
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name={t.dashboard.totalOrders} fill="#10b981" radius={[0, 4, 4, 0]}>
                  {mockOrderStatusDistribution.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Products Analytics Table */}
      <Card noPadding>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {t.analytics.topPerforming}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.analytics.topPerformingSub}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-5">{t.analytics.rank}</th>
                <th className="py-3 px-4">{t.products.productName}</th>
                <th className="py-3 px-4">{t.products.category}</th>
                <th className="py-3 px-4">{t.products.price}</th>
                <th className="py-3 px-4">{t.common.units} {t.common.sold}</th>
                <th className="py-3 px-5 text-right">{t.analytics.grossRevenue}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {topProducts.map((prod, idx) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-5 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span>{prod.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{prod.categoryName}</td>
                  <td className="py-3.5 px-4 font-medium">{formatCurrency(prod.price)}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {formatNumber(prod.salesCount)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(prod.price * prod.salesCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
