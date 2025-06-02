import { useAuthStore } from '../../store/auth'

export const profileRequest = async () => {
  try {
    const token = useAuthStore.getState().token
    const res = await fetch(`http://localhost:3000/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok)
      return [new Error(`Error al buscar perfíles: ${res.statusText}`)]

    return res.json()
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
