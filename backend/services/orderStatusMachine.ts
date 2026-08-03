import { OrderStatus } from '../types/order'

/**
 * Subconjunto de TRANSITIONS que un ADMIN puede disparar manualmente
 * desde el panel. 'pendiente' y 'pago_fallido' quedan vacíos a propósito:
 * salir de esos dos estados es exclusivo del webhook de Stripe (pago
 * confirmado/fallido) o del job de expiración (timeout -> cancelado).
 * Un admin nunca debe poder "forzar" un pago que no ocurrió.
 */

export const TRANSITIONS: Readonly<
  Record<OrderStatus, readonly OrderStatus[]>
> = Object.freeze({
  pendiente: ['pagado', 'pago_fallido', 'cancelado'],
  pago_fallido: ['pendiente'],
  pagado: ['enviado'],
  enviado: ['entregado'],
  entregado: ['reembolso_solicitado'],
  reembolso_solicitado: ['reembolsado', 'rechazado'],
  rechazado: ['entregado'],
  reembolsado: [],
  cancelado: [],
})

const ALL_STATUSES = Object.keys(TRANSITIONS) as OrderStatus[]

export function isOrderStatus(value: string): value is OrderStatus {
  return (ALL_STATUSES as string[]).includes(value)
}

export function isValidTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): boolean {
  return TRANSITIONS[currentStatus].includes(newStatus)
}

export function getValidNextStatuses(
  currentStatus: OrderStatus,
): readonly OrderStatus[] {
  return TRANSITIONS[currentStatus] ?? []
}

const ADMIN_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> =
  Object.freeze({
    pendiente: [],
    pago_fallido: [],
    pagado: ['enviado'],
    enviado: ['entregado'],
    entregado: ['reembolso_solicitado'],
    reembolso_solicitado: ['reembolsado', 'rechazado'],
    rechazado: ['entregado'],
    reembolsado: [],
    cancelado: [],
  })

export function isValidAdminTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): boolean {
  return ADMIN_TRANSITIONS[currentStatus].includes(newStatus)
}

export function getValidAdminNextStatuses(
  currentStatus: OrderStatus,
): readonly OrderStatus[] {
  return ADMIN_TRANSITIONS[currentStatus] ?? []
}
