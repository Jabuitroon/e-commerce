import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '../hooks/custHooks'
import { CheckoutForm } from '../components/CheckoutForm'
import { useAuthStore } from '../../store/auth.store'
import { getTokenFromLocalStorage } from '../services/getToken'
import { createCheckoutSession } from '../services/checkouts'
import { StepProgressBar, Step } from '../components/StepProgressBar'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(stripePublicKey)

const CHECKOUT_STEPS: Step[] = [
  { id: 1, label: 'Confirmar orden' },
  { id: 2, label: 'Método de pago' },
  { id: 3, label: 'Confirmación de pago' },
]

export function CheckoutPage() {
  const { cart } = useCart()
  const tokenFromStore = useAuthStore((state) => state.token)

  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cart.length === 0) {
      setLoading(false)
      return
    }

    // 1. Extraemos el token (prioriza la store, o directamente la lectura del localStorage)
    const token = tokenFromStore || getTokenFromLocalStorage()

    // 2. Mapeamos los items
    const itemsPayload = cart.map((item) => ({
      productId: item.pro_id,
      quantity: Number(item.count),
    }))

    // 3. Petición HTTP con Authorization Header en servicio de checkouts
    createCheckoutSession(itemsPayload, token)
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
      .catch((err: Error) => {
        console.error(err)
        setError(err.message || 'No se pudo conectar con el servidor de pagos.')
      })
      .finally(() => setLoading(false))
  }, [cart, tokenFromStore])

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent'></div>
      </div>
    )
  }

  if (error || !clientSecret) {
    return (
      <div className='mx-auto my-12 max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm'>
        <p className='font-medium'>
          {error || 'El carrito está vacío o no se pudo iniciar el proceso.'}
        </p>
      </div>
    )
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4f46e5',
      borderRadius: '8px',
    },
  }

  return (
    <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
      {/* Paso 1 Activo */}
      <div className='container mx-auto px-4 pt-24'>
        <StepProgressBar steps={CHECKOUT_STEPS} currentStep={2} />
      </div>
      <CheckoutForm />
    </Elements>
  )
}
