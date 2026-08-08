import {
  IOrdersDAO,
  ListOrdersParams,
  Order,
  OrderStatus,
  PaginatedOrders,
  UpdateStatusParams,
} from '../types/order'
import { pool } from '../config/db'
import { RowDataPacket } from 'mysql2/promise'

import {
  isValidTransition,
  getValidNextStatuses,
} from '../services/orderStatusMachine'

const DEFAULT_PAGE_SIZE = 20
const MAX_EXPORT_ROWS = 10000
const SORT_COLUMN_MAP: Record<string, string> = {
  customer_name: 'u.usu_nombre',
  customer_email: 'u.usu_email',
  ord_total: 'o.ord_total',
  ord_expira_en: 'o.ord_expira_en',
  ord_created_at: 'o.ord_created_at',
  ord_estado: 'o.ord_estado',
}

export class OrderNotFoundError extends Error {
  constructor(orderId: number) {
    super(`Orden ${orderId} no encontrada`)
  }
}

export class InvalidTransitionError extends Error {
  validNextStatuses: OrderStatus[]
  constructor(
    current: OrderStatus,
    attempted: OrderStatus,
    validNextStatuses: readonly OrderStatus[],
  ) {
    super(`Transición inválida: '${current}' -> '${attempted}'`)
    this.validNextStatuses = [...validNextStatuses]
  }
}

export interface UpdateOrderStatusParams {
  orderId: number
  newStatus: OrderStatus
  reason?: string | null
}

interface OrderRow extends Order, RowDataPacket {}
interface CountRow extends RowDataPacket {
  total: number
}
const REASON_COLUMN_BY_STATUS: Record<string, string> = {
  cancelado: 'ord_motivo_cancelacion',
  reembolso_solicitado: 'ord_motivo_reembolso',
}

// Listado paginado de órdenes con filtros opcionales.
export class OrdersDAO implements IOrdersDAO {
  private buildWhere(params: ListOrdersParams) {
    const { status, customerId, from, to, search } = params
    const where: string[] = []
    const values: unknown[] = []

    if (status) {
      where.push('o.ord_estado = ?')
      values.push(status)
    }
    if (customerId) {
      where.push('o.ord_id_usuario = ?')
      values.push(customerId)
    }
    if (from) {
      where.push('o.ord_created_at >= ?')
      values.push(from)
    }
    if (to) {
      where.push('o.ord_created_at <= ?')
      values.push(`${to} 23:59:59`)
    }
    if (search) {
      where.push('(u.usu_nombre LIKE ? OR u.usu_email LIKE ?)')
      values.push(`%${search}%`, `%${search}%`)
    }

    return {
      whereClause: where.length ? `WHERE ${where.join(' AND ')}` : '',
      values,
    }
  }

  async getAll(params: ListOrdersParams = {}): Promise<PaginatedOrders> {
    const {
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
      sortBy = 'ord_created_at',
      sortDir = 'desc',
    } = params

    const { whereClause, values } = this.buildWhere(params)
    const offset = (Math.max(page, 1) - 1) * limit
    const sortColumn = SORT_COLUMN_MAP[sortBy] ?? 'o.ord_created_at'
    const sortDirection = sortDir === 'asc' ? 'ASC' : 'DESC'

    const SQL_QUERY = `SELECT o.ord_id, o.ord_id_usuario,
            u.usu_nombre AS customer_name, u.usu_email AS customer_email,
            o.ord_subtotal, o.ord_costo_envio, o.ord_descuento, o.ord_total,
            o.ord_estado, o.ord_expira_en, o.ord_created_at
     FROM tbl_orden o
     JOIN tbl_usuario u ON u.usu_id = o.ord_id_usuario
     ${whereClause}
     ORDER BY ${sortColumn} ${sortDirection}
     LIMIT ? OFFSET ?`

    const [rows] = await pool.query<OrderRow[]>(SQL_QUERY, [
      ...values,
      limit,
      offset,
    ])

    const [countRows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) AS total
       FROM tbl_orden o
       JOIN tbl_usuario u ON u.usu_id = o.ord_id_usuario
       ${whereClause}`,
      values,
    )

    return { data: rows, page, limit, total: countRows[0].total }
  }

  // Reutiliza el mismo WHERE/ORDER, sin paginación (tope de seguridad).
  async getAllForExport(params: ListOrdersParams = {}): Promise<Order[]> {
    const { sortBy = 'ord_created_at', sortDir = 'desc' } = params
    const { whereClause, values } = this.buildWhere(params)
    const sortColumn = SORT_COLUMN_MAP[sortBy] ?? 'o.ord_created_at'
    const sortDirection = sortDir === 'asc' ? 'ASC' : 'DESC'

    const [rows] = await pool.query<OrderRow[]>(
      `SELECT o.ord_id, o.ord_id_usuario,
              u.usu_nombre AS customer_name, u.usu_email AS customer_email,
              o.ord_subtotal, o.ord_costo_envio, o.ord_descuento, o.ord_total,
              o.ord_estado, o.ord_expira_en, o.ord_created_at
       FROM tbl_orden o
       JOIN tbl_usuario u ON u.usu_id = o.ord_id_usuario
       ${whereClause}
       ORDER BY ${sortColumn} ${sortDirection}
       LIMIT ?`,
      [...values, MAX_EXPORT_ROWS],
    )
    return rows
  }

  async findById(orderId: string): Promise<Order | null> {
    const [rows] = await pool.query<OrderRow[]>(
      `SELECT o.ord_id, o.ord_id_usuario, u.usu_nombre AS customer_name,
            o.ord_subtotal, o.ord_costo_envio, o.ord_descuento, o.ord_total,
            o.ord_estado, o.ord_metodo_pago, o.stripe_payment_intent_id,
            o.ord_motivo_cancelacion, o.ord_motivo_reembolso,
            o.ord_created_at, o.ord_updated_at
     FROM tbl_orden o
     JOIN tbl_usuario u ON u.usu_id = o.ord_id_usuario
     WHERE o.ord_id = ?`,
      [orderId],
    )
    return rows[0] ?? null
  }

  /**
   * Actualiza el estado de una orden. Si el nuevo estado tiene columna de
   * motivo asociada (cancelación, reembolso), la actualiza también.
   * Sin tabla de auditoría: solo queda el estado actual + ord_updated_at.
   */

  async updateStatus({
    orderId,
    newStatus,
    reason,
  }: UpdateStatusParams): Promise<Order> {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT ord_estado FROM tbl_orden WHERE ord_id = ? FOR UPDATE',
        [orderId],
      )
      const current = rows[0]
      if (!current) {
        throw new OrderNotFoundError(orderId)
      }
      const previousStatus = current.ord_estado as OrderStatus

      if (!isValidTransition(previousStatus, newStatus)) {
        throw new InvalidTransitionError(
          previousStatus,
          newStatus,
          getValidNextStatuses(previousStatus),
        )
      }

      const reasonColumn = REASON_COLUMN_BY_STATUS[newStatus]
      if (reasonColumn) {
        await connection.query(
          `UPDATE tbl_orden SET ord_estado = ?, ${reasonColumn} = ? WHERE ord_id = ?`,
          [newStatus, reason, orderId],
        )
      } else {
        await connection.query(
          'UPDATE tbl_orden SET ord_estado = ? WHERE ord_id = ?',
          [newStatus, orderId],
        )
      }

      await connection.query(
        `INSERT INTO tbl_orden_historial (his_id_orden, his_estado_anterior, his_estado_nuevo)
       VALUES (?, ?, ?)`,
        [orderId, previousStatus, newStatus],
      )

      await connection.commit()
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    return (await this.findById(String(orderId))) as Order
  }

  async getHistory(orderId: string): Promise<UpdateStatusParams[]> {
    const [rows] = await pool.query(
      `SELECT h.his_id, h.his_estado_anterior, h.his_estado_nuevo,
            h.his_id_usuario, u.usu_nombre AS changed_by_name, h.his_created_at
     FROM tbl_orden_historial h
     LEFT JOIN tbl_usuario u ON u.usu_id = h.his_id_usuario
     WHERE h.his_id_orden = ?
     ORDER BY h.his_created_at DESC`,
      [orderId],
    )
    return rows as UpdateStatusParams[]
  }
}
