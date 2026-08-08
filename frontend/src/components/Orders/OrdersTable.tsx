/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ChevronDown, Download, Search, ArrowLeft, ArrowRight, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { StatusBadge } from './StatusBadge'
import { exportOrdersCSV } from '../../services/getOrders'
import { DATE_RANGE_LABELS, DateRangePreset } from '../../utils/dateRange'
import { Order, SortColumn } from '../../interfaces/order'

const SORTABLE_COLUMNS: { key: SortColumn; label: string }[] = [
  { key: 'customer_name', label: 'Customer' },
  { key: 'customer_email', label: 'Email' },
  { key: 'ord_total', label: 'Total Amount' },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

export function OrdersTable() {
  const {
    orders, total, page, setPage, PAGE_SIZE,
    searchInput, setSearchInput,
    datePreset, setDatePreset,
    sortBy, sortDir, toggleSort,
    isLoading, error,
    exportParams,
  } = useOrders()

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  const allSelected = orders.length > 0 && orders.every((o) => selected.has(o.ord_id))

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(orders.map((o) => o.ord_id)))
  }

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportOrdersCSV(exportParams)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-500">Your most recent transactions list</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="w-56 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDateMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {DATE_RANGE_LABELS[datePreset]}
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDateMenuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {(Object.keys(DATE_RANGE_LABELS) as DateRangePreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setDatePreset(preset)
                      setIsDateMenuOpen(false)
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {DATE_RANGE_LABELS[preset]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="w-10 px-6 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-gray-300" />
              </th>
              <th className="px-3 py-3 font-medium">Order ID</th>
              {SORTABLE_COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-3 font-medium">
                  <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 hover:text-gray-700">
                    {col.label}
                    <span className="text-[10px]">
                      {sortBy === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
              ))}
              <th className="px-3 py-3 font-medium">Due Date</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading...</td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-red-500">{error}</td>
              </tr>
            )}
            {!isLoading && !error && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">No transactions found</td>
              </tr>
            )}
            {!isLoading && !error && orders.map((order: Order) => (
              <tr key={order.ord_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selected.has(order.ord_id)}
                    onChange={() => toggleOne(order.ord_id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-3 py-4 font-medium text-gray-900">#{order.ord_id}</td>
                <td className="px-3 py-4 font-medium text-gray-900">{order.customer_name}</td>
                <td className="px-3 py-4 text-blue-600">{order.customer_email}</td>
                <td className="px-3 py-4 text-gray-900">{formatCurrency(order.ord_total)}</td>
                <td className="px-3 py-4 text-gray-500">{formatDate(order.ord_expira_en)}</td>
                <td className="px-3 py-4"><StatusBadge status={order.ord_estado} /></td>
                <td className="px-3 py-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
          <span className="font-medium">{total}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                p === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}