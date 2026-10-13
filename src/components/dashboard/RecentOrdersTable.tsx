import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader } from '@/components/common/Card'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ChevronRight, Eye } from 'lucide-react'
import { useOrderStore } from '@/store/useOrderStore'
import { useLanguageStore } from '@/store/useLanguageStore'

export function RecentOrdersTable() {
  const navigate = useNavigate()
  const { orders, setSelectedOrderId } = useOrderStore()
  const { t } = useLanguageStore()
  const recentOrders = orders.slice(0, 5)

  const handleViewOrder = (id: string) => {
    setSelectedOrderId(id)
    navigate('/orders')
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader
        title={t.dashboard.recentOrders}
        subtitle={t.dashboard.recentOrdersSubtitle}
        action={
          <Link
            to="/orders"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 group"
          >
            {t.nav.viewAllOrders}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 font-medium">
            <tr>
              <th className="py-3 px-5 sm:px-6">{t.dashboard.orderId}</th>
              <th className="py-3 px-4">{t.dashboard.customer}</th>
              <th className="py-3 px-4">{t.common.date}</th>
              <th className="py-3 px-4">{t.dashboard.amount}</th>
              <th className="py-3 px-4">{t.common.status}</th>
              <th className="py-3 px-5 text-right">{t.dashboard.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3.5 px-5 sm:px-6 font-semibold text-slate-900 dark:text-white">
                  {order.orderNumber}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    {order.customerAvatar ? (
                      <img
                        src={order.customerAvatar}
                        alt={order.customerName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {order.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {order.customerEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                  {formatDate(order.date)}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs font-medium"
                    title="View order details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.dashboard.view}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
