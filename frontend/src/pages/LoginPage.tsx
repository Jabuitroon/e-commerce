import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { loginService, getProfileService } from '../services/auth'
import { LoginForm } from '../components/LoginForm'
import { userDataLogin } from '../types'
import shopping from '../assets/shopping.jpg'

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const loginToStore = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async (data: userDataLogin) => {
    setIsLoading(true)
    setErrorMsg(null)

    try {
      // 1. Obtener Token
      const token = await loginService(data)

      // 2. Obtener Perfil usando el token recibido
      const profile = await getProfileService(token)

      // 3. Guardar estado global atómicamente
      loginToStore(token, profile)

      // 4. Redirigir al inicio solo tras éxito
      navigate('/')
    } catch (error) {
      console.error('Error de autenticación:', error)
      setErrorMsg('Credenciales inválidas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container h-full flex justify-center items-center mx-auto min-h-screen'>
      <div className='grid grid-cols-2 max-2xl:h-130 w-4xl shadow-xl rounded-3xl bg-gray-300 overflow-hidden'>
        <div className='loginImg'>
          <img
            className='w-full h-full object-cover rounded-s-3xl'
            src={shopping}
            alt='Shopping Banner'
          />
        </div>

        <div className='loginContainer px-8 py-6 flex flex-col justify-center items-center'>
          <div className='divide-y divide-blue-600 px-8 w-full flex flex-col items-center'>
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              apiError={errorMsg}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
