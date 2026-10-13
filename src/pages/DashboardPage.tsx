import React, { useState } from 'react'
import { StatCard } from '@/components/dashboard/StatCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable'
import { TopProductsCard } from '@/components/dashboard/TopProductsCard'
import { mockDashboardStats, mockRevenueChartData } from '@/data/mockAnalytics'
import type { TimeRangeFilter } from '@/types/analytics'
import { Calendar, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useToastStore } from '@/store/useToastStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { exportToCSV } from '@/lib/utils'

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30days')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { success } = useToastStore()
  const { t } = useLanguageStore()

  const currentStats = mockDashboardStats[timeRange]
  const currentChartData = mockRevenueChartData[timeRange]

  const timeFilterLabels: { key: TimeRangeFilter; label: string }[] = [
    { key: '7days', label: t.dashboard.filter7Days },
    { key: '30days', label: t.dashboard.filter30Days },
    { key: '3months', label: t.dashboard.filter3Months },
    { key: '12months', label: t.dashboard.filter12Months },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      success('Dashboard data refreshed successfully')
    }, 600)
  }

  const handleExportSummary = () => {
    const summaryRows = currentStats.map((s) => ({
      Metric: s.title,
      Value: s.value,
      ChangePercent: `${s.change}%`,
      Trend: s.trend,
      Timeframe: s.timeframe,
    }))
    exportToCSV(`dashboard-summary-${timeRange}`, summaryRows)
    success('Exported dashboard summary to CSV')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Greeting & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{t.dashboard.welcome}</span>
          </p>
        </div>

        {/* Filter controls & Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 7d / 30d / 3m / 12m Filter */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            {timeFilterLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeRange(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === key
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {t.common.refresh}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportSummary}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {t.common.export}
          </Button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title={t.dashboard.totalRevenue}
          value={currentStats[0].value}
          change={currentStats[0].change}
          trend={currentStats[0].trend}
          timeframe={currentStats[0].timeframe}
          type="revenue"
        />
        <StatCard
          title={t.dashboard.totalOrders}
          value={currentStats[1].value}
          change={currentStats[1].change}
          trend={currentStats[1].trend}
          timeframe={currentStats[1].timeframe}
          type="orders"
        />
        <StatCard
          title={t.dashboard.newCustomers}
          value={currentStats[2].value}
          change={currentStats[2].change}
          trend={currentStats[2].trend}
          timeframe={currentStats[2].timeframe}
          type="customers"
        />
        <StatCard
          title={t.dashboard.activeProducts}
          value={currentStats[3].value}
          change={currentStats[3].change}
          trend={currentStats[3].trend}
          timeframe={currentStats[3].timeframe}
          type="products"
        />
      </div>

      {/* Charts & Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={currentChartData} />
        <TopProductsCard />
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable />
    </div>
  )
}
