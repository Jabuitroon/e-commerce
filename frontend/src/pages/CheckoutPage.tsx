import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '../hooks/custHooks'
import { CheckoutForm } from '../components/CheckoutForm'
import { useAuthStore } from '../../store/auth' // O tu store de auth

const stripePromise = loadStripe('pk_test_51TzdnhLKGqyknYdO9d3x84SXCNFYlIwfKx6T6nm7TOiEEYULfToybuRbRuaUQMT8vOb1nF1weaKIFYJ7VrC1gPHg00YBPoHVZM')

// Función helper por si prefieres extraerlo directamente del localStorage
const getTokenFromLocalStorage = (): string | null => {
  try {
    const authData = localStorage.getItem('auth')
    if (!authData) return null
    const parsed = JSON.parse(authData)
    return parsed?.state?.token || null
  } catch (error) {
    console.error('Error al obtener el token del localStorage:', error)
    return null
  }
}

export function CheckoutPage() {
  const { cart } = useCart()
  // También puedes obtener el token directo de tu store de Zustand si lo tienes así:
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

    // 3. Petición HTTP con Authorization Header
    fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ items: itemsPayload }),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Sesión no válida o expirada. Por favor, vuelve a iniciar sesión.')
        }
        if (!res.ok) throw new Error('Error al generar la orden')
        return res.json()
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          throw new Error('No se recibió el clientSecret de la API')
        }
      })
      .catch((err: Error) => {
        console.error(err)
        setError(err.message || 'No se pudo conectar con el servidor de pagos.')
      })
      .finally(() => setLoading(false))
  }, [cart, tokenFromStore])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !clientSecret) {
    return (
      <div className="mx-auto max-w-md my-12 rounded-xl bg-red-50 p-6 text-center text-red-700 border border-red-200 shadow-sm">
        <p className="font-medium">{error || 'El carrito está vacío o no se pudo iniciar el proceso.'}</p>
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
      <CheckoutForm />
    </Elements>
  )
}