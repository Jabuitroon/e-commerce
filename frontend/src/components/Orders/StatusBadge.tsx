import { OrderStatus } from '../../interfaces/order'

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> =
  {
    pendiente: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
    pago_fallido: { label: 'Failed', className: 'bg-red-100 text-red-700' },
    pagado: {
      label: 'Completed',
      className: 'bg-emerald-100 text-emerald-700',
    },
    cancelado: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600' },
    enviado: { label: 'Shipped', className: 'bg-blue-100 text-blue-700' },
    entregado: {
      label: 'Delivered',
      className: 'bg-emerald-100 text-emerald-700',
    },
    reembolso_solicitado: {
      label: 'Refund Requested',
      className: 'bg-orange-100 text-orange-700',
    },
    reembolsado: {
      label: 'Refunded',
      className: 'bg-purple-100 text-purple-700',
    },
    rechazado: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  }

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  )
}
