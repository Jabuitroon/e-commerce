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

export type OrderSortColumn =
  | 'customer_name'
  | 'customer_email'
  | 'ord_total'
  | 'ord_expira_en'
  | 'ord_created_at'
  | 'ord_estado'

export type SortDirection = 'asc' | 'desc'

export interface Order {
  ord_id: number
  ord_id_usuario: number
  customer_name: string
  customer_email: string
  ord_subtotal: number
  ord_costo_envio: number
  ord_descuento: number
  ord_total: number
  ord_estado: OrderStatus
  ord_expira_en: string | null
  ord_created_at: string
  ord_updated_at?: string
  ord_metodo_pago?: string | null
  ord_motivo_cancelacion?: string | null
  ord_motivo_reembolso?: string | null
  stripe_payment_intent_id?: string | null
  // ord_expira_en: Date | null
  // ord_created_at: Date
  // ord_updated_at: Date
}

export interface CheckoutResult {
  orderId: number
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export interface PaginatedOrders {
  data: Order[]
  page: number
  limit: number
  total: number
}

export interface ListOrdersParams {
  page?: number
  limit?: number
  status?: OrderStatus
  customerId?: number
  from?: string
  to?: string
  search?: string
  sortBy?: OrderSortColumn
  sortDir?: SortDirection
}

export interface PaginatedOrders {
  data: Order[]
  page: number
  limit: number
  total: number
}

export interface UpdateStatusParams {
  orderId: number
  newStatus: OrderStatus
  reason?: string | null
}

export interface IOrdersDAO {
  getAll(params?: ListOrdersParams): Promise<PaginatedOrders>
  findById(orderId: string): Promise<Order | null>
  updateStatus(params: UpdateStatusParams): Promise<Order>
  getHistory(orderId: string): Promise<UpdateStatusParams[]>
}
