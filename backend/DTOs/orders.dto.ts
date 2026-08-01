import { z } from 'zod'

export const OrdersFilterDTO = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  status: z.string().optional(), // Puedes usar z.enum(['PENDING', 'PAID', 'SHIPPED']).optional() si tienes estados fijos
  customerId: z.coerce.number().int().positive().optional(),

  // Si esperas un formato de fecha específico (ej: ISO 8601), puedes usar .datetime() o .date()
  from: z.string().date().optional(),
  to: z.string().date().optional(),
})

// Puedes inferir el tipo directamente desde el esquema para no tener que mantener la interfaz a mano:
export type OrdersFilter = z.infer<typeof OrdersFilterDTO>
