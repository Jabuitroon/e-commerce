import React, { useState } from 'react'

import { ShoppingCart, User, MapPin, ChevronDown, X } from 'lucide-react'
import { Search } from '../components/Search'
import { Cart } from '../components/Cart'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function Home() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const showProfile = isAuth ? 'profile' : 'login'

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'outline' | 'ghost' | 'danger'
    size?: 'default' | 'sm'
  }

  const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'default',
    size = 'default',
    ...props
  }) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

    const variants: Record<string, string> = {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'border border-gray-200 bg-transparent hover:bg-gray-100',
      ghost: 'hover:bg-gray-100',
    }

    const sizes: Record<string, string> = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md text-sm',
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }

  // Para los inputs radio
  const nameCategory = ['prime', 'home', 'sale', 'alternative', 'todo']

  let convertCat: {
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

  // Controladores de mini menús
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCaertOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleCart = () => {
    setIsCaertOpen(!isCartOpen)
  }

  return (
    <>
      <header className='bg-[#e7ecef] w-full fixed z-50 md:h-16'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between py-3'>
            {/* Logo y Menú */}
            <div className='flex items-center gap-4'>
              <div className='text-2xl font-bold'>
                <Link to='/'>
                  <span className='text-black'>My e-commerce</span>
                </Link>
              </div>
              <button
                className='flex items-center gap-1 text-black bg-[#e7ecef] hover:bg-gray-100 px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer'
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label='Menú principal'
              >
                <div className='flex items-center'>
                  <div className='h-6 w-6 flex flex-col justify-center gap-1 mr-2'>
                    {isMenuOpen ? (
                      <X className='h-5 w-5' />
                    ) : (
                      <>
                        <div className='h-0.5 w-5 bg-black'></div>
                        <div className='h-0.5 w-5 bg-black'></div>
                        <div className='h-0.5 w-5 bg-black'></div>
                      </>
                    )}
                  </div>
                  <span>Menú</span>
                </div>
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className='relative flex-1 max-w-xl mx-4'>
              <Search />
            </div>

            {/* Opciones de usuario */}
            <div className='flex items-center gap-6'>
              {/* Opciones de entrega */}
              <div className='flex items-center gap-1 text-sm'>
                <MapPin className='h-5 w-5' />
                <div className='flex flex-col'>
                  <span className='font-bold'>¿Cómo quieres</span>
                  <span className='font-bold'>recibir tu pedido?</span>
                </div>
                <ChevronDown className='h-4 w-4' />
              </div>

              {/* Mi cuenta */}
              <Link to={showProfile}>
                <Button size='sm' variant='ghost' className='loginbtn relative'>
                  <User className='h-6 w-6' />
                  <span className='sr-only'>Mi cuenta</span>
                </Button>
              </Link>

              {/* Carrito */}
              <Button
                onClick={toggleCart}
                aria-expanded={isCartOpen}
                size='sm'
                variant='ghost'
                className='relative'
              >
                <ShoppingCart className='h-6 w-6' />
              </Button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
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
        )}
        {isCartOpen && (
          <div className='absolute top-0 right-0 w-2xl bg-white shadow-lg z-50 transition-all duration-300 ease-in-out h-screen'>
            <div className='container mx-auto px-4 py-4 overflow-y-auto'>
              <div className='flex flex-col gap-6 h-screen'>
                <Cart />
              </div>
            </div>
          </div>
        )}
        {/* Overlay para cerrar el menú al hacer clic fuera */}
        {isMenuOpen && (
          <div
            className='fixed inset-0 z-40'
            onClick={toggleMenu}
            aria-hidden='true'
          ></div>
        )}
      </header>
    </>
  )
}
