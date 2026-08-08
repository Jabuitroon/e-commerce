export type OrderStatus =
  | 'pendiente'
  | 'pago_fallido'
  | 'pagado'
  | 'cancelado'
  | 'enviado'
  | 'entregado'
  | 'reembolso_solicitado'
  | 'reembolsado'
  | 'rechazado'

export type SortColumn =
  | 'customer_name'
  | 'customer_email'
  | 'ord_total'
  | 'ord_expira_en'
  | 'ord_created_at'

export type SortDirection = 'asc' | 'desc'

export interface Order {
  ord_id: number
  customer_name: string
  customer_email: string
  ord_total: number
  ord_estado: OrderStatus
  ord_expira_en: string | null
  ord_created_at: string
}

export interface PaginatedOrders {
  data: Order[]
  page: number
  limit: number
  total: number
}

export interface OrdersQueryParams {
  page: number
  limit: number
  search?: string
  from?: string
  to?: string
  sortBy?: SortColumn
  sortDir?: SortDirection
}
