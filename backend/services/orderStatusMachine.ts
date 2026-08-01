//  Máquina de estados de una orden.
//  Transiciones NO listadas aquí quedan prohibidas por diseño (whitelist).

import { OrderStatus } from 'backend/types/order'

const TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> =
  Object.freeze({
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

export { TRANSITIONS }
