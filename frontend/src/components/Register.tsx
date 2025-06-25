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
    <div className='container h-full flex justify-center items-center mx-auto'>
      <div className='grid grid-cols-2 max-2xl:h-130 w-4xl shadow-xl rounded-3xl bg-gray-300'>
        <div className='loginImg'>
          <img
            className='w-full h-full object-cover rounded-s-3xl'
            src={shopping}
          />
        </div>

        <div className='registerContainer px-8 py-6 flex flex-col justify-center items-center'>
          <div className='divide-y divide-blue-600 px-8'>
            <div className='w-xs max-w-xs'>
              <h2 className='text-2xl text-pretty text-center'>
                Crea una cuenta
              </h2>
              <form
                id='register'
                className='space-y-4 h-vh mx-auto my-5'
                action=''
                method='´POST'
                onSubmit={handleSubmit((dataUser) => {
                  addUser(dataUser)
                })}
              >
                <label htmlFor='username' className='text-xs'>
                  Nombre
                </label>
                <div className='inputDiv flex gap-1.5'>
                  <FaUser className='icon h-10 w-10' />
                  <input
                    type='text'
                    {...register('username', {
                      required: 'Este Campo es requerido',
                    })}
                    placeholder='Ingresa un nombre de usuario'
                    className='w-full p-2 border rounded text-sm'
                  />
                </div>
                <label htmlFor='email' className='text-xs'>
                  Correo
                </label>
                <div className='inputDiv flex gap-1.5'>
                  <MdEmail className='icon h-10 w-10' />
                  <input
                    type='email'
                    {...register('email', {
                      required: 'Este Campo es requerido',
                      minLength: {
                        value: 8,
                        message:
                          'Escribe una contraseña de al menors 8 caracteres',
                      },
                    })}
                    placeholder='Ingresa un correo'
                    className='w-full p-2 border rounded text-sm'
                  />
                </div>
                <label htmlFor='password' className='text-xs'>
                  Password
                </label>
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
                    className='w-full p-2 border rounded text-sm'
                  />
                </div>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full'
                >
                  Continuar
                </button>
              </form>
            </div>

            <div className='footerText flex flex-col justify-center items-center my-1.5 gap-1.5'>
              <span>¿Ya tienes una cuenta?</span>
              <Link to='/login'>
                <button className='btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                  Login
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
