/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order, OrdersQueryParams, PaginatedOrders } from '../interfaces/order'
const BASE_URL = import.meta.env.VITE_API_URL

function buildQueryString(params: Record<string, any>): string {
  const cleanParams: Record<string, string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = String(value)
    }
  })

  return new URLSearchParams(cleanParams).toString()
}

export async function fetchOrders(
  params: OrdersQueryParams,
  token: string | null,
): Promise<PaginatedOrders> {
  const query = buildQueryString(params)

  const response = await fetch(`${BASE_URL}/orders?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`)
  }

  const data: PaginatedOrders = await response.json()
  return data
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`)
  if (!response.ok) {
    throw new Error(`Error fetching order: ${response.statusText}`)
  }

  return await response.json()
}

export async function exportOrdersCSV(
  params: Omit<OrdersQueryParams, 'page' | 'limit'>,
  token: string | null,
): Promise<void> {
  const queryParams = new URLSearchParams(
    params as Record<string, string>,
  ).toString()

  const response = await fetch(`${BASE_URL}/orders/export?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Error al exportar CSV: ${response.statusText}`)
  }

  // Obtenemos el archivo como Blob directamente
  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `orders_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
