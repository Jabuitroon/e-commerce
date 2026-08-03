import { Request, Response, NextFunction } from 'express'
import { CheckoutDAO, CheckoutError } from '../DAO/CheckoutDAO'
import * as stripeService from '../services/stripe.service'
import { CartItem } from '../types/checkout'

const checkoutDAO = new CheckoutDAO()

interface CheckoutBody {
  items: CartItem[]
}

export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items } = req.body as CheckoutBody
    const userId = req.user!.usu_id

    const order = await checkoutDAO.create(userId, items)

    const paymentIntent = await stripeService.createPaymentIntent(
      order.total,
      order.orderId,
    )
    await checkoutDAO.setPaymentIntent(order.orderId, paymentIntent.id)

    return res.status(201).json({
      orderId: order.orderId,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    if (err instanceof CheckoutError) {
      res.status(err.statusCode).json({ message: err.message })
      return
    }
    next(err)
  }
}
