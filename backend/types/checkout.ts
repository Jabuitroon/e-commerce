import { PoolConnection } from 'mysql2/promise'
import { CheckoutResult } from './order'

export interface CartItem {
  productId: number
  quantity: number
}

export interface Product {
  pro_id: number
  pro_precio: number
  pro_stock: number
  pro_sale: boolean | number
  pro_descuento_porcentaje: number
}

export interface ICheckoutDAO {
  create(userId: number, cartItems: CartItem[]): Promise<CheckoutResult>
  setPaymentIntent(orderId: number, paymentIntentId: string): Promise<void>
  findOrderByPaymentIntent(paymentIntentId: string): Promise<{ ord_id: number; ord_estado: string } | null>
  releaseStock(connection: PoolConnection, orderId: number): Promise<void>
}
