export const getTokenFromLocalStorage = (): string | null => {
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