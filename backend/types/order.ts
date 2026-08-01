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

export interface Order {
  ord_id: number
  ord_id_usuario: number
  customer_name?: string
  ord_subtotal: number
  ord_costo_envio: number
  ord_descuento: number
  ord_total: number
  ord_estado: OrderStatus
  ord_metodo_pago: string | null
  stripe_payment_intent_id: string | null
  ord_motivo_cancelacion: string | null
  ord_motivo_reembolso: string | null
  ord_expira_en: Date | null
  ord_created_at: Date
  ord_updated_at: Date
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
  status?: string
  customerId?: number
  from?: string
  to?: string
}

export interface OrderStatusChange {
  orderId: number
  previousStatus: string
  newStatus: string
  reason: string | null
}

export interface IOrdersDAO {
  getAll(
    filter: ListOrdersParams,
  ): Promise<{ data: Order[]; page: number; limit: number; total: number }>
  findById(id: string): Promise<Order | null>
  //   create(order: Order): Promise<Order | null>
  updateStatus({
    orderId,
    previousStatus,
    newStatus,
    reason,
  }: OrderStatusChange): Promise<boolean>
  getHistory(orderId: string): Promise<OrderStatusChange[]>
}
