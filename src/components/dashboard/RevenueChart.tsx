import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/common/Card'
import type { RevenueChartPoint } from '@/types/analytics'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useThemeStore } from '@/store/useThemeStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface RevenueChartProps {
  data: RevenueChartPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-500 dark:text-slate-400 capitalize">
                  {entry.name}:
                </span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {entry.name === 'revenue' || entry.name === 'profit'
                  ? formatCurrency(entry.value)
                  : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { isDark } = useThemeStore()
  const { t } = useLanguageStore()
  const { settings } = useSettingsStore()
  const accentColor = settings.appearance.accentColor || '#6366f1'
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders'>('revenue')

  const gridColor = isDark ? '#1e293b' : '#f1f5f9'
  const textColor = isDark ? '#64748b' : '#94a3b8'

  return (
    <Card className="col-span-1 lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {t.dashboard.revenuePerformance}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.dashboard.revenueSubtitle}
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'revenue'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.dashboard.revenueMetric}
          </button>
          <button
            onClick={() => setActiveMetric('orders')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'orders'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.dashboard.ordersMetric}
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis
              dataKey="name"
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) =>
                activeMetric === 'revenue'
                  ? `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                  : `${val}`
              }
            />

            <Tooltip content={<CustomChartTooltip />} />

            {activeMetric === 'revenue' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={accentColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="profit"
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorOrders)"
                name="orders"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
