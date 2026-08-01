import { RowDataPacket } from 'mysql2'
import { pool } from '../config/db'
import { CheckoutDAO } from '../DAO/CheckoutDAO'

const checkoutDAO = new CheckoutDAO()
interface ExpiredOrderRow extends RowDataPacket {
  ord_id: number
}

/**
 * Busca órdenes 'pendiente' con ord_expira_en vencido, libera su stock
 * reservado y las pasa a 'cancelado'. Pensado para correr por cron
 * (ej. cada minuto).
 */
export async function expireStaleOrders(): Promise<number> {
  const [expiredOrders] = await pool.query<ExpiredOrderRow[]>(
    `SELECT ord_id FROM tbl_orden
     WHERE ord_estado = 'pendiente' AND ord_expira_en IS NOT NULL AND ord_expira_en < NOW()`,
  )

  for (const { ord_id: orderId } of expiredOrders) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      await checkoutDAO.releaseStock(connection, orderId)
      await connection.query(
        `UPDATE tbl_orden SET ord_estado = 'cancelado', ord_motivo_cancelacion = ? WHERE ord_id = ?`,
        ['Expiración de la reserva de pago', orderId],
      )
      await connection.commit()
    } catch (err) {
      await connection.rollback()
      console.error(`Error expirando orden ${orderId}:`, err)
    } finally {
      connection.release()
    }
  }

  return expiredOrders.length
}
