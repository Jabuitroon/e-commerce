import {
  IOrdersDAO,
  ListOrdersParams,
  Order,
  OrderStatus,
  OrderStatusChange,
  PaginatedOrders,
} from '../types/order'
import { pool } from '../config/db'
import { RowDataPacket } from 'mysql2/promise'

const DEFAULT_PAGE_SIZE = 20

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
  async getAll(params: ListOrdersParams = {}): Promise<PaginatedOrders> {
    const {
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
      status,
      customerId,
      from,
      to,
    } = params

    const where = []
    const values = []

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
      values.push(to)
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const offset = (Math.max(page, 1) - 1) * limit
    const SQL_QUERY = `SELECT o.ord_id, o.ord_id_usuario, u.usu_nombre AS customer_name,
            o.ord_subtotal, o.ord_costo_envio, o.ord_descuento, o.ord_total,
            o.ord_estado, o.ord_created_at
     FROM tbl_orden o
     JOIN tbl_usuario u ON u.usu_id = o.ord_id_usuario
     ${whereClause}
     ORDER BY o.ord_created_at DESC
     LIMIT ? OFFSET ?`
    const [rows] = await pool.query<OrderRow[]>(SQL_QUERY, [
      ...values,
      limit,
      offset,
    ])

    const [countRows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM tbl_orden o ${whereClause}`,
      values,
    )

    return { data: rows, page, limit, total: countRows[0].total }
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
    previousStatus,
    newStatus,
    reason,
  }: OrderStatusChange): Promise<boolean> {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

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

      await connection.query('UPDATE orders SET status = ? WHERE id = ?', [
        newStatus,
        orderId,
      ])

      await connection.query(
        `INSERT INTO tbl_orden_historial (his_id_orden, his_estado_anterior, his_estado_nuevo, his_id_usuario)
       VALUES (?, ?, ?, ?)`,
        [orderId, previousStatus, newStatus, reason],
      )

      await connection.commit()
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }
    return true
  }

  async getHistory(orderId: string): Promise<OrderStatusChange[]> {
    const [rows] = await pool.query(
      `SELECT h.his_id, h.his_estado_anterior, h.his_estado_nuevo,
            h.his_id_usuario, u.usu_nombre AS changed_by_name, h.his_created_at
     FROM tbl_orden_historial h
     LEFT JOIN tbl_usuario u ON u.usu_id = h.his_id_usuario
     WHERE h.his_id_orden = ?
     ORDER BY h.his_created_at DESC`,
      [orderId],
    )
    return rows as OrderStatusChange[]
  }
}
