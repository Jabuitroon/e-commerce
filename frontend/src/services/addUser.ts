import { type userData } from '../types'

export const addUser = async (userData: userData): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:3000/register`, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (!res.ok)
      return [new Error(`Error al inicio de sesión: ${res.statusText}`)]

    const jsonres = (await res.json())
    console.log('Respuesta:', jsonres)
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
