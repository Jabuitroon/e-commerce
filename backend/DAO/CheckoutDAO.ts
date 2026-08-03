import { ICheckoutDAO, CartItem, Product } from '../types/checkout'
import { pool } from '../config/db'
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { CheckoutResult } from '../types/order'

const SHIPPING_COST_COP = 30000
const EXPIRATION_MINUTES = Number(process.env.CHECKOUT_EXPIRATION_MINUTES || 15)

export class CheckoutError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

interface ProductRow extends Product, RowDataPacket {}
interface ItemToInsert {
  productId: string
  quantity: number
  unitPrice: number
}

interface OrderLookupRow extends RowDataPacket {
  ord_id: number
  ord_estado: string
}

interface OrderItemRow extends RowDataPacket {
  odt_id_producto: string
  odt_cantidad: number
}

export class CheckoutDAO implements ICheckoutDAO {
  async create(userId: number, cartItems: CartItem[]): Promise<CheckoutResult> {
    if (!cartItems || cartItems.length === 0) {
      throw new CheckoutError('El carrito está vacío', 400)
    }

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      let subtotal = 0
      let discount = 0
      const itemsToInsert: ItemToInsert[] = []

      for (const item of cartItems) {
        // Quité pro_descuento_porcentaje pendiendte por agregar en la tabla dentro de la bd
        const [rows] = await connection.query<ProductRow[]>(
          `SELECT pro_id, pro_price, pro_stock, pro_sale
         FROM tbl_producto
         WHERE pro_id = ?
         FOR UPDATE`,
          [item.productId],
        )
        const product = rows[0]
        if (!product) {
          throw new CheckoutError(`Producto ${item.productId} no existe`, 404)
        }
        if (product.pro_stock < item.quantity) {
          throw new CheckoutError(
            `Stock insuficiente para el producto ${item.productId}`,
            409,
          )
        }
        
        console.log('Product fetched:', product, 'tipo de id', typeof(item.productId)) // Debugging line
        const listPrice = Number(product.pro_price)
        const hasDiscount =
          Boolean(product.pro_sale) &&
          Number(product.pro_descuento_porcentaje) > 0
        const finalUnitPrice = hasDiscount
          ? Number(
              (
                listPrice *
                (1 - product.pro_descuento_porcentaje / 100)
              ).toFixed(2),
            )
          : listPrice

        subtotal += finalUnitPrice * item.quantity
        if (hasDiscount) {
          discount += (listPrice - finalUnitPrice) * item.quantity
        }

        itemsToInsert.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: finalUnitPrice,
        })

        await connection.query(
          'UPDATE tbl_producto SET pro_stock = pro_stock - ? WHERE pro_id = ?',
          [item.quantity, item.productId],
        )
      }

      const total = subtotal + SHIPPING_COST_COP

      const [orderResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO tbl_orden
        (ord_id_usuario, ord_estado, ord_subtotal, ord_costo_envio, ord_descuento, ord_total, ord_expira_en)
       VALUES (?, 'pendiente', ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
        [
          userId,
          subtotal,
          SHIPPING_COST_COP,
          discount,
          total,
          EXPIRATION_MINUTES,
        ],
      )
      const orderId = orderResult.insertId

      for (const item of itemsToInsert) {
        await connection.query(
          `INSERT INTO tbl_orden_detalle (odt_id_orden, odt_id_producto, odt_cantidad, odt_precio_unitario)
         VALUES (?, ?, ?, ?)`,
          [orderId, item.productId, item.quantity, item.unitPrice],
        )
      }

      await connection.commit()

      return { orderId, subtotal, discount, shipping: SHIPPING_COST_COP, total }
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }
  }

  async setPaymentIntent(
    orderId: number,
    paymentIntentId: string,
  ): Promise<void> {
    await pool.query(
      'UPDATE tbl_orden SET stripe_payment_intent_id = ? WHERE ord_id = ?',
      [paymentIntentId, orderId],
    )
  }

  async findOrderByPaymentIntent(
    paymentIntentId: string,
  ): Promise<{ ord_id: number; ord_estado: string } | null> {
    const [rows] = await pool.query<OrderLookupRow[]>(
      'SELECT ord_id, ord_estado FROM tbl_orden WHERE stripe_payment_intent_id = ?',
      [paymentIntentId],
    )
    return rows[0] ?? null
  }

  async releaseStock(
    connection: PoolConnection,
    orderId: number,
  ): Promise<void> {
    const [items] = await connection.query<OrderItemRow[]>(
      'SELECT odt_id_producto, odt_cantidad FROM tbl_orden_detalle WHERE odt_id_orden = ?',
      [orderId],
    )
    for (const item of items) {
      await connection.query(
        'UPDATE tbl_producto SET pro_stock = pro_stock + ? WHERE pro_id = ?',
        [item.odt_cantidad, item.odt_id_producto],
      )
    }
  }
}
