import { useState } from 'react'
import { Button } from '../UI/Button'

export const HeaderMenu = () => {
  // Para los inputs radio
  const nameCategory = ['prime', 'home', 'sale', 'alternative', 'todo']

  const convertCat: {
    value: string
    label: string
  }[] = nameCategory.map((name) => ({
    value: name,
    label: name,
  }))
  const [value, setValue] = useState<string | null>(null)
  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    console.log(value)
  }
  return (
    <div className='absolute top-full left-0 w-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out'>
      <div className='container mx-auto px-4 py-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='flex flex-col space-y-2 items-start'>
            <h3 className='font-bold text-lg mb-3'>Categorías</h3>
            <form className='form' onSubmit={handleSubmit}>
              {convertCat.map((category) => (
                <div key={category.value}>
                  <input
                    type='radio'
                    name='category'
                    value={category.value}
                    id={category.value}
                    checked={value == category.value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <label htmlFor={category.value}>
                    <span className='hover:text-yellow-600 px-2 font-medium'>
                      {category.label}
                    </span>
                  </label>
                </div>
              ))}
              <div>
                <Button variant='ghost' type='submit'>
                  Aplicar
                </Button>
              </div>
            </form>
          </div>
          <div>
            <h3 className='font-bold text-lg mb-3'>Mi Cuenta</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Mis pedidos
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Mis datos
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Mis direcciones
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Mis favoritos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold text-lg mb-3'>Ayuda</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-yellow-600'>
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
