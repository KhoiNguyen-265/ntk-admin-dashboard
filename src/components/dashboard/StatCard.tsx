import React from 'react'
import { Card } from '@/components/common/Card'
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  timeframe: string
  type: 'revenue' | 'orders' | 'customers' | 'products'
}

export function StatCard({
  title,
  value,
  change,
  trend,
  timeframe,
  type,
}: StatCardProps) {
  const iconConfig = {
    revenue: {
      icon: DollarSign,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    },
    orders: {
      icon: ShoppingCart,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    },
    customers: {
      icon: Users,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/60',
    },
    products: {
      icon: Package,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
    },
  }

  const { icon: Icon, color, bg } = iconConfig[type]
  const isPositive = trend === 'up'

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            {value}
          </h3>
        </div>

        <div className={cn('p-2.5 rounded-xl', bg, color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md',
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
              : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          )}
          {Math.abs(change)}%
        </span>
        <span className="text-slate-400 dark:text-slate-500">{timeframe}</span>
      </div>
    </Card>
  )
}
