import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '../hooks/custHooks'
import { StepProgressBar, Step } from '../components/StepProgressBar'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(stripePublicKey)

const CHECKOUT_STEPS: Step[] = [
  { id: 1, label: 'Confirmar orden' },
  { id: 2, label: 'Método de pago' },
  { id: 3, label: 'Confirmación de pago' },
]

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const [status, setStatus] = useState<
    'loading' | 'succeeded' | 'processing' | 'failed'
  >('loading')
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clientSecret = searchParams.get('payment_intent_client_secret')

  useEffect(() => {
    if (!clientSecret) {
      setStatus('failed')
      setErrorMessage('No se encontró información de la transacción.')
      return
    }

    stripePromise.then(async (stripe) => {
      if (!stripe) return

      const { paymentIntent, error } =
        await stripe.retrievePaymentIntent(clientSecret)

      if (error) {
        setStatus('failed')
        setErrorMessage(
          error.message || 'Error al consultar el estado del pago.',
        )
        return
      }

      if (paymentIntent) {
        setPaymentIntentId(paymentIntent.id)

        switch (paymentIntent.status) {
          case 'succeeded':
            setStatus('succeeded')
            // Limpiamos el carrito local una vez confirmado el pago exitoso
            clearCart()
            break
          case 'processing':
            setStatus('processing')
            break
          case 'requires_payment_method':
            setStatus('failed')
            setErrorMessage(
              'El pago no se pudo completar. Intenta con otro método de pago.',
            )
            break
          default:
            setStatus('failed')
            setErrorMessage('Algo salió mal con el procesamiento del pago.')
            break
        }
      }
    })
  }, [clientSecret, clearCart])

  if (status === 'loading') {
    return (
      <div className='flex min-h-[70vh] flex-col items-center justify-center space-y-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent'></div>
        <p className='text-sm font-medium text-gray-600'>
          Verificando el estado de tu pago...
        </p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='w-full max-w-lg rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-gray-100 text-center space-y-6'>
        <div className='container mx-auto px-4'>
          <StepProgressBar steps={CHECKOUT_STEPS} currentStep={4} />
        </div>
        {/* Estado: ÉXITO */}
        {status === 'succeeded' && (
          <>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                ¡Gracias por tu compra!
              </h1>
              <p className='text-sm text-gray-500 mt-2'>
                Tu pago ha sido procesado con éxito. Hemos enviado el recibo y
                los detalles de tu pedido a tu correo electrónico.
              </p>
            </div>

            <div className='rounded-2xl bg-gray-50 p-4 border border-gray-100 text-left space-y-2 text-xs'>
              <div className='flex justify-between text-gray-600'>
                <span className='font-semibold'>ID de Transacción:</span>
                <span className='font-mono text-gray-800'>
                  {paymentIntentId}
                </span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span className='font-semibold'>Estado:</span>
                <span className='font-bold text-emerald-600'>Completado</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className='w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all'
            >
              Volver a la Tienda
            </button>
          </>
        )}

        {/* Estado: PROCESANDO */}
        {status === 'processing' && (
          <>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
              <svg
                className='h-10 w-10 animate-spin'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
            </div>

            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Pago en Proceso
              </h1>
              <p className='text-sm text-gray-500 mt-2'>
                Estamos procesando tu transacción. Te notificaremos por correo
                electrónico tan pronto como se confirme la orden.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className='w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all'
            >
              Ir al Inicio
            </button>
          </>
        )}

        {/* Estado: FALLIDO */}
        {status === 'failed' && (
          <>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600'>
              <svg
                className='h-10 w-10'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={3}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>

            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                No se pudo procesar el pago
              </h1>
              <p className='text-sm text-red-600 mt-2 font-medium'>
                {errorMessage || 'Hubo un inconveniente con tu método de pago.'}
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              <button
                onClick={() => navigate('/checkout')}
                className='w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all'
              >
                Reintentar Pago
              </button>
              <button
                onClick={() => navigate('/cart')}
                className='w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors'
              >
                Volver al Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
