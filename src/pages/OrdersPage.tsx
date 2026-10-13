import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { OrderDetailModal } from '@/components/orders/OrderDetailModal'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/OrderStatusBadge'
import { useOrderStore } from '@/store/useOrderStore'
import { useToastStore } from '@/store/useToastStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { OrderStatus, PaymentStatus } from '@/types/order'
import { formatCurrency, formatDate, exportToCSV } from '@/lib/utils'
import {
  Download,
  Filter,
  Eye,
  Trash2,
  RotateCcw,
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
} from 'lucide-react'

export function OrdersPage() {
  const {
    orders,
    filters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    selectedOrderId,
    setSelectedOrderId,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    getFilteredOrders,
  } = useOrderStore()

  const { success, info } = useToastStore()
  const { t } = useLanguageStore()

  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)

  const filteredOrders = getFilteredOrders()
  const totalOrders = filteredOrders.length

  // Pagination slice
  const startIndex = (currentPage - 1) * pageSize
  const currentOrders = filteredOrders.slice(startIndex, startIndex + pageSize)

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null

  const handleExportCSV = () => {
    const data = filteredOrders.map((o) => ({
      OrderNumber: o.orderNumber,
      Customer: o.customerName,
      Email: o.customerEmail,
      Date: o.date,
      TotalAmount: o.totalAmount,
      Status: o.status,
      PaymentStatus: o.paymentStatus,
      PaymentMethod: o.paymentMethod,
    }))
    exportToCSV('orders-list', data)
    info('Exported orders list to CSV')
  }

  const handleConfirmDelete = () => {
    if (!deletingOrderId) return
    const ord = orders.find((o) => o.id === deletingOrderId)
    deleteOrder(deletingOrderId)
    setDeletingOrderId(null)
    success('Order deleted', `Removed ${ord?.orderNumber || 'order'}`)
  }

  // Summary statistics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.orders.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.orders.subtitle}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4" />}
        >
          {t.common.exportCSV}
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.orders.totalSales}</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalRevenue)}
            </h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.totalOrders}</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{orders.length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.orders.pendingOrders}</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pendingCount}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.orders.completedDeliveries}</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{deliveredCount}</h3>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card noPadding className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="w-full lg:w-72">
            <SearchInput
              value={filters.search}
              onChange={(val) => setFilter('search', val)}
              placeholder="Search order #, customer, email..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilter('status', e.target.value as OrderStatus | 'all')
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.common.all} {t.common.status}</option>
                <option value="pending">{t.orders.statusPending}</option>
                <option value="processing">{t.orders.statusProcessing}</option>
                <option value="shipped">{t.orders.statusShipped}</option>
                <option value="delivered">{t.orders.statusDelivered}</option>
                <option value="cancelled">{t.orders.statusCancelled}</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  setFilter('paymentStatus', e.target.value as PaymentStatus | 'all')
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.common.all} {t.orders.payment}</option>
                <option value="paid">{t.orders.payPaid}</option>
                <option value="pending">{t.orders.payUnpaid}</option>
                <option value="refunded">{t.orders.payRefunded}</option>
                <option value="failed">{t.orders.payFailed}</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilter('dateRange', e.target.value as 'all' | 'today' | '7days' | '30days')
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.common.all}</option>
                <option value="today">{t.dashboard.filter7Days}</option>
                <option value="7days">{t.dashboard.filter7Days}</option>
                <option value="30days">{t.dashboard.filter30Days}</option>
              </select>
            </div>

            {/* Reset */}
            {(filters.search ||
              filters.status !== 'all' ||
              filters.paymentStatus !== 'all' ||
              filters.dateRange !== 'all') && (
              <button
                onClick={resetFilters}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs inline-flex items-center gap-1"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.reset}</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-5 sm:px-6">{t.orders.order}</th>
                <th className="py-3 px-4">{t.dashboard.customer}</th>
                <th className="py-3 px-4">{t.common.date}</th>
                <th className="py-3 px-4">{t.common.total}</th>
                <th className="py-3 px-4">{t.orders.payment}</th>
                <th className="py-3 px-4">{t.orders.fulfillment}</th>
                <th className="py-3 px-5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
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
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {order.customerName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                    </td>

                    {/* Quick status selector */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                          success(
                            'Status updated',
                            `Order ${order.orderNumber} is now ${e.target.value}`
                          )
                        }}
                        className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="pending">{t.orders.statusPending}</option>
                        <option value="processing">{t.orders.statusProcessing}</option>
                        <option value="shipped">{t.orders.statusShipped}</option>
                        <option value="delivered">{t.orders.statusDelivered}</option>
                        <option value="cancelled">{t.orders.statusCancelled}</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingOrderId(order.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalOrders}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onUpdateStatus={(id, status) => {
          updateOrderStatus(id, status)
          success('Order updated', `Fulfillment status changed to ${status}`)
        }}
        onUpdatePayment={(id, payment) => {
          updatePaymentStatus(id, payment)
          success('Payment updated', `Payment status changed to ${payment}`)
        }}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingOrderId}
        onClose={() => setDeletingOrderId(null)}
        onConfirm={handleConfirmDelete}
        title={t.orders.deleteTitle}
        message={t.orders.deleteConfirm}
      />
    </div>
  )
}
