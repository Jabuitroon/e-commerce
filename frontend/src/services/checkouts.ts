export interface CheckoutItemPayload {
  productId: string
  quantity: number
}

const API_URL = import.meta.env.VITE_API_URL

export async function createCheckoutSession(
  items: CheckoutItemPayload[],
  token?: string | null
): Promise<{ clientSecret: string }> {
  const response = await fetch(`${API_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ items }),
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error('Sesión no válida o expirada. Por favor, vuelve a iniciar sesión.')
  }

  if (!response.ok) {
    throw new Error('Error al generar la orden')
  }

  const data = await response.json()

  if (!data.clientSecret) {
    throw new Error('No se recibió el clientSecret de la API')
  }

  return data
}