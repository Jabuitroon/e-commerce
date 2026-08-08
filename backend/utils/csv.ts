import { Order } from '../types/order'

const EXPORT_HEADERS: { key: keyof Order; label: string }[] = [
  { key: 'ord_id', label: 'Order ID' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'customer_email', label: 'Email' },
  { key: 'ord_total', label: 'Total Amount' },
  { key: 'ord_expira_en', label: 'Due Date' },
  { key: 'ord_estado', label: 'Status' },
  { key: 'ord_created_at', label: 'Created At' },
]

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function ordersToCSV(orders: Order[]): string {
  const headerRow = EXPORT_HEADERS.map((h) => h.label).join(',')
  const rows = orders.map((order) =>
    EXPORT_HEADERS.map((h) => escapeCSV(order[h.key])).join(','),
  )
  return [headerRow, ...rows].join('\n')
}