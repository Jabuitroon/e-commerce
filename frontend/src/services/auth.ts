import { userDataLogin } from '../types'
import { Perfil } from '../../store/auth.store'
const BASE_URL = import.meta.env.VITE_API_URL

interface LoginResponse {
  token?: string
  msg?: string
}

export const loginService = async (
  credentials: userDataLogin,
): Promise<string> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const result: LoginResponse = await response.json()

  if (result.msg || !result.token) {
    throw new Error(result.msg || 'Error al iniciar sesión')
  }

  return result.token
}

export const getProfileService = async (token: string): Promise<Perfil> => {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error('Error al obtener el perfil de usuario')
  }

  return await response.json()
}
