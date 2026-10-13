import React from 'react'
import { Badge, type BadgeVariant } from '@/components/common/Badge'
import type { OrderStatus, PaymentStatus } from '@/types/order'
import { useLanguageStore } from '@/store/useLanguageStore'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useLanguageStore()

  const config: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: t.orders.statusPending, variant: 'amber' },
    processing: { label: t.orders.statusProcessing, variant: 'indigo' },
    shipped: { label: t.orders.statusShipped, variant: 'sky' },
    delivered: { label: t.orders.statusDelivered, variant: 'emerald' },
    cancelled: { label: t.orders.statusCancelled, variant: 'rose' },
  }

  const { label, variant } = config[status] || { label: status, variant: 'slate' }

  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  )
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useLanguageStore()

  const config: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
    paid: { label: t.orders.payPaid, variant: 'emerald' },
    pending: { label: t.orders.payUnpaid, variant: 'amber' },
    failed: { label: t.orders.payFailed, variant: 'rose' },
    refunded: { label: t.orders.payRefunded, variant: 'purple' },
  }

  const { label, variant } = config[status] || { label: status, variant: 'slate' }

  return <Badge variant={variant}>{label}</Badge>
}
