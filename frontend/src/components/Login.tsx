import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/auth'

import { FaUser, FaShieldAlt } from 'react-icons/fa'
import shopping from '../assets/shopping.jpg'
import { login } from '../services/login'
import { profileRequest } from '../services/getProfile'
import { userData } from '../types'

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userData>()

  console.log('Errors?', errors)

  const setToken = useAuthStore((state) => state.setToken)
  const setProfile = useAuthStore((state) => state.setProfile)
  const setIsAuth = useAuthStore((state) => state.setIsAuth)

  const navigateTo = useNavigate()

  return (
    <>
      <div className='container h-full flex justify-center items-center'>
        <div className='grid grid-cols-2 max-2xl:h-130 w-4xl shadow-xl rounded-3xl bg-gray-300'>
          <div className='loginImg'>
            <img
              className='w-full h-full object-cover rounded-s-3xl'
              src={shopping}
            />
          </div>
          <div className='loginContainer'>
            <h2>Encuentra extraordinarios productos</h2>
            <p>Crea tu lista de deseos</p>

            <form
              id='login'
              action=''
              method='´POST'
              onSubmit={handleSubmit((data) => {
                login(data).then((response) => {
                  const data = response.data

                  if ('token' in data) {
                    setToken(data.token)
                    setIsAuth(true)
                  } else if ('msg' in data) {
                    console.warn('Mensaje del servidor:', data.msg)
                    setIsAuth(false)
                  }
                })

                navigateTo('/')

                profileRequest().then((response) => {
                  if (response) {
                    console.log(response)

                    setProfile(response)
                  }
                })
              })}
              className='p-4 space-y-4 h-vh max-w-md mx-auto'
            >
              <label htmlFor='username'>Nombre</label>
              <div className='inputDiv flex gap-1.5'>
                <FaUser className='icon h-10 w-10' />
                <input
                  type='text'
                  {...register('username', {
                    required: 'Este Campo es requerido',
                  })}
                  placeholder='Ingresa un nombre de usuario'
                  className='inputusername w-full p-2 border rounded'
                />
              </div>
              <label htmlFor='username'>Contraseña</label>
              <div className='inputDiv flex gap-1.5'>
                <FaShieldAlt className='icon h-10 w-10' />
                <input
                  type='password'
                  {...register('password', {
                    required: 'Este Campo es requerido',
                    minLength: {
                      value: 8,
                      message:
                        'Escribe una contraseña de al menors 8 caracteres',
                    },
                  })}
                  placeholder='Ingresa una constraseña'
                  className='inputpassword w-full p-2 border rounded'
                />
              </div>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Login
              </button>
            </form>

            <div className='footerText'>
              <span className='forgotPassword'>
                ¿Olvidaste tu contraseña? <a href=''>Click Aquí</a>
              </span>
              <span>¿No tienes una cuenta?</span>
              <Link to='/register'>
                <button className='btn'>Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
