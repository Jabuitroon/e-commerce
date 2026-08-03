import { Request, Response } from 'express'
import Stripe from 'stripe'
import * as stripeService from '../services/stripe.service'
import { CheckoutDAO } from '../DAO/CheckoutDAO'
const checkoutDAO = new CheckoutDAO()
import { OrdersDAO } from '../DAO/OrdersDAO'
const ordersDAO = new OrdersDAO()

/**
 * POST /api/webhooks/stripe
 * IMPORTANTE: esta ruta debe montarse con express.raw({ type: 'application/json' }),
 * NO con express.json(), porque Stripe necesita el body crudo para verificar la firma.
 */
export async function handleStripeWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  let event: Stripe.Event
  try {
    event = stripeService.constructWebhookEvent(
      req.body as Buffer,
      req.headers['stripe-signature'],
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'firma inválida'
    res.status(400).send(`Webhook signature verification failed: ${message}`)
    return
  }

  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed'
  ) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const order = await checkoutDAO.findOrderByPaymentIntent(paymentIntent.id)

    if (!order) {
      res.status(200).json({
        received: true,
        warning: 'orden no encontrada para este payment_intent',
      })
      return
    }

    // Idempotencia: Stripe puede reenviar el mismo evento más de una vez
    if (order.ord_estado !== 'pendiente') {
      res.status(200).json({ received: true, skipped: true })
      return
    }

    const newStatus =
      event.type === 'payment_intent.succeeded' ? 'pagado' : 'pago_fallido'

    await ordersDAO.updateStatus({
      orderId: order.ord_id,
      newStatus,
      reason: `Actualizado automáticamente por webhook de Stripe: ${event.type}`,
    })
  }

  res.status(200).json({ received: true })
}
