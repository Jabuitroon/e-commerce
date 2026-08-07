import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FaUser, FaShieldAlt } from 'react-icons/fa'
import { userDataLogin } from '../types'

interface LoginFormProps {
  onSubmit: (data: userDataLogin) => Promise<void>
  isLoading: boolean
  apiError: string | null
}

export function LoginForm({ onSubmit, isLoading, apiError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userDataLogin>()

  return (
    <div className='w-xs max-w-xs'>
      <h2 className='text-2xl text-pretty text-center mb-4'>
        Encuentra extraordinarios productos
      </h2>

      {apiError && (
        <div className='p-2 mb-3 text-xs text-red-700 bg-red-100 rounded text-center'>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 my-5'>
        <div>
          <label htmlFor='email' className='text-xs font-medium block mb-1'>
            Correo Electrónico
          </label>
          <div className='inputDiv flex items-center gap-1.5'>
            <FaUser className='icon h-5 w-5 text-gray-600 flex-shrink-0' />
            <input
              id='email'
              type='email'
              {...register('email', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Ingresa un correo electrónico válido',
                },
              })}
              placeholder='Ingresa tu correo electrónico'
              className='inputemail w-full p-2 border rounded text-sm'
            />
          </div>
          {errors.email && (
            <span className='text-red-500 text-xs block mt-1'>
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor='password' className='text-xs font-medium block mb-1'>
            Contraseña
          </label>
          <div className='inputDiv flex items-center gap-1.5'>
            <FaShieldAlt className='icon h-5 w-5 text-gray-600 flex-shrink-0' />
            <input
              id='password'
              type='password'
              {...register('password', {
                required: 'Este campo es requerido',
                minLength: {
                  value: 8,
                  message: 'Escribe una contraseña de al menos 8 caracteres',
                },
              })}
              placeholder='Ingresa una contraseña'
              className='inputpassword w-full p-2 border rounded text-sm'
            />
          </div>
          {errors.password && (
            <span className='text-red-500 text-xs block mt-1'>
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full disabled:bg-blue-300 transition-colors'
        >
          {isLoading ? 'Cargando...' : 'Login'}
        </button>
      </form>

      <div className='footerText flex flex-col justify-center items-center my-1.5 gap-1.5'>
        <span className='text-sm'>¿No tienes una cuenta?</span>
        <Link to='/register'>
          <button className='btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  )
}
