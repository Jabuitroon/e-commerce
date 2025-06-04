import { LoginResponse, type userData } from '../types'

export const login = async (userData: userData): Promise<LoginResponse> => {
  try {
    const res = await fetch(`http://localhost:3000/login`, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!res.ok)
      return {
        success: false,
        data: { msg: `Error al inicio de sesión: ${res.statusText}` },
      }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      data: { msg: 'Unknown error' },
    }
  }
}
