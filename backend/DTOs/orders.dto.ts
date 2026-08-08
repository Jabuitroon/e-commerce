import { z } from 'zod'

const ORDER_STATUSES = [
  'pendiente',
  'pago_fallido',
  'pagado',
  'cancelado',
  'enviado',
  'entregado',
  'reembolso_solicitado',
  'reembolsado',
  'rechazado',
] as const

const SORTABLE_COLUMNS = [
  'customer_name',
  'customer_email',
  'ord_total',
  'ord_expira_en',
  'ord_created_at',
  'ord_estado',
] as const

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}/, 'Formato de fecha inválido')

export const OrdersFilterDTO = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(ORDER_STATUSES).optional(),
  customerId: z.coerce.number().int().positive().optional(),
  from: dateOnly.optional(),
  to: dateOnly.optional(),
  search: z.string().trim().min(1).max(150).optional(),
  sortBy: z.enum(SORTABLE_COLUMNS).default('ord_created_at'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
})

// Para /export: mismos filtros, sin paginación
export const OrdersExportFilterDTO = OrdersFilterDTO.omit({
  page: true,
  limit: true,
})

export type OrdersFilterInput = z.infer<typeof OrdersFilterDTO>
