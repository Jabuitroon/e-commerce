import { useEffect, useMemo, useState } from 'react'
import { fetchOrders } from '../services/getOrders'
import { Order, SortColumn, SortDirection } from '../interfaces/order'
import { DateRangePreset, resolveDateRange } from '../utils/dateRange'

const PAGE_SIZE = 10

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState<DateRangePreset>('7d')
  const [sortBy, setSortBy] = useState<SortColumn>('ord_created_at')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce de búsqueda (300ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const { from, to } = useMemo(() => resolveDateRange(datePreset), [datePreset])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchOrders({ page, limit: PAGE_SIZE, search: search || undefined, from, to, sortBy, sortDir })
      .then((result) => {
        if (cancelled) return
        setOrders(result.data)
        setTotal(result.total)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar las órdenes')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, search, from, to, sortBy, sortDir])

  const toggleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
  }

  return {
    orders, total, page, setPage, PAGE_SIZE,
    searchInput, setSearchInput,
    datePreset, setDatePreset,
    sortBy, sortDir, toggleSort,
    isLoading, error,
    exportParams: { search: search || undefined, from, to, sortBy, sortDir },
  }
}