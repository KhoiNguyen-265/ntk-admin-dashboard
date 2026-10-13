import React from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/OrderStatusBadge'
import type { Order, OrderStatus, PaymentStatus } from '@/types/order'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { MapPin, User, Package } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, status: OrderStatus) => void
  onUpdatePayment: (id: string, payment: PaymentStatus) => void
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePayment: _onUpdatePayment,
}: OrderDetailModalProps) {
  const { t } = useLanguageStore()

  if (!order) return null

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t.orders.orderDetails}: ${order.orderNumber}`}
      description={formatDateTime(order.date)}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Quick status change controls inside modal */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">{t.common.status}:</label>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="pending">{t.orders.statusPending}</option>
              <option value="processing">{t.orders.statusProcessing}</option>
              <option value="shipped">{t.orders.statusShipped}</option>
              <option value="delivered">{t.orders.statusDelivered}</option>
              <option value="cancelled">{t.orders.statusCancelled}</option>
            </select>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.orders.close}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Highlights */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">{t.orders.fulfillment}:</span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">{t.orders.payment}:</span>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">{t.common.total}:</span>{' '}
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Customer & Shipping Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <User className="w-3.5 h-3.5 text-indigo-500" /> {t.orders.customerInfo}
            </div>
            <div className="flex items-center gap-3 pt-1">
              {order.customerAvatar && (
                <img
                  src={order.customerAvatar}
                  alt={order.customerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {order.customerName}
                </p>
                <p className="text-xs text-slate-500">{order.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {t.orders.shippingDestination}
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5 pt-1">
              <p className="font-medium text-slate-900 dark:text-white">
                {order.shippingAddress.street}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p className="text-slate-500">{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-indigo-500" /> {t.orders.purchasedItems} ({order.items.length})
          </h4>
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-medium">
                <tr>
                  <th className="py-2.5 px-4">{t.products.productName}</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">{t.products.price}</th>
                  <th className="py-2.5 px-4 text-right">{t.common.total}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>{t.common.subtotal}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.common.shipping}</span>
            <span>
              {order.shippingAmount === 0 ? t.common.free : formatCurrency(order.shippingAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.common.tax}</span>
            <span>{formatCurrency(order.taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>{t.common.total}</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {order.notes && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
            <span className="font-semibold">{t.orders.notes}:</span> {order.notes}
          </div>
        )}
      </div>
    </Modal>
  )
}
