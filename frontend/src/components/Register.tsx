import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { addUser } from '../services/addUser'
import { userData } from '../types'

import { FaUser, FaShieldAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import shopping from '../assets/shopping.jpg'

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userData>()

  console.log('Errors?', errors)

  return (
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
          action=''
          method='´POST'
          onSubmit={handleSubmit((dataUser) => {
            addUser(dataUser)
          })}
          className='p-4 space-y-4 h-vh max-w-md mx-auto'
        >
          <div className='inputDiv flex gap-1.5'>
            <FaUser className='icon h-10 w-10' />
            <input
              type='text'
              {...register('username', { required: 'Este Campo es requerido' })}
              placeholder='Ingresa un nombre de usuario'
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='inputDiv flex gap-1.5'>
            <MdEmail className='icon h-10 w-10' />
            <input
              type='email'
              {...register('email', {
                required: 'Este Campo es requerido',
                minLength: {
                  value: 8,
                  message: 'Escribe una contraseña de al menors 8 caracteres',
                },
              })}
              placeholder='Ingresa un correo'
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='inputDiv flex gap-1.5'>
            <FaShieldAlt className='icon h-10 w-10' />
            <input
              type='password'
              {...register('password', {
                required: 'Este Campo es requerido',
                minLength: {
                  value: 8,
                  message: 'Escribe una contraseña de al menors 8 caracteres',
                },
              })}
              placeholder='Ingresa una constraseña'
              className='w-full p-2 border rounded'
            />
          </div>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Register
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
  )
}
