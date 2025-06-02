import { type userData } from '../types'

export const login = async (userData: userData): Promise<{}> => {
  try {
    const res = await fetch(`http://localhost:3000/login`, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userData),
    })
    
    if (!res.ok)
      return [new Error(`Error al inicio de sesión: ${res.statusText}`)]

    return res.json()
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
