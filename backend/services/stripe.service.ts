import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

/**
 * Crea un Payment Intent en Stripe. COP es moneda "cero decimales":
 * el monto se manda tal cual, sin multiplicar por 100 (a diferencia de USD).
 */
export async function createPaymentIntent(
  amountCOP: number,
  orderId: number,
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: Math.round(amountCOP),
    currency: 'cop',
    metadata: { orderId: String(orderId) },
  })
}

export function constructWebhookEvent(
  rawBody: Buffer,
  signature: string | string[] | undefined,
): Stripe.Event {
  if (!signature) {
    throw new Error('Falta el header stripe-signature')
  }
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  )
}
