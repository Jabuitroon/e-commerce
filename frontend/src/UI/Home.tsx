import { useState } from 'react'
import { SearchProduct } from '../components/Search'
import { Cart } from '../components/Cart'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import {
  User,
  ChevronDown,
  Settings,
  Info,
  LogOut,
  X,
  MapPin,
  ShoppingCart,
} from 'lucide-react'

export default function Home() {
  const { profile, logout } = useAuthStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
      <header className='bg-[#e7ecef] w-full fixed z-50 md:h-16 flex justify-center items-center'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between'>
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
              <SearchProduct />
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
              {/* Carrito */}
              <Button
                onClick={toggleCart}
                aria-expanded={isCartOpen}
                size='sm'
                variant='ghost'
                className='relative'
              >
                <ShoppingCart
                  className={`h-6 w-6 transition-colors ${
                    isCartOpen
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                />
              </Button>
              {/* Mi cuenta */}
              {profile?.id_usuario ? (
                /* Estado: Usuario Autenticado */
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none'
                  aria-expanded={isProfileOpen}
                  aria-haspopup='true'
                >
                  <div className='w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 shadow-sm border border-slate-200'>
                    {profile.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <span className='font-medium text-slate-800 text-sm hidden md:inline'>
                    {profile.nombre}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                /* Estado: Usuario no Autenticado */
                <Button size='sm' variant='ghost' className='loginbtn relative'>
                  <Link to='/login' className='flex items-center gap-1'>
                    <User className='h-6 w-6' />
                    <span className='sr-only'>Mi cuenta</span>
                  </Link>
                </Button>
              )}

              {/* Dropdown Menu */}
              {isProfileOpen && profile && (
                <div className='absolute right-0 top-14 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 transform opacity-100 scale-100 transition-all'>
                  {/* Encabezado del Perfil */}
                  <div className='pb-3 mb-2'>
                    <p className='font-semibold text-slate-900 text-base leading-tight truncate'>
                      {profile.nombre}
                    </p>
                    <p className='text-sm text-slate-400 font-normal truncate mt-0.5'>
                      {profile.email}
                    </p>
                  </div>

                  {/* Opciones del Menú */}
                  <div className='space-y-1 text-slate-700 text-sm font-medium'>
                    <Link
                      to='/profile'
                      onClick={() => setIsProfileOpen(false)}
                      className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-200/80 transition-colors text-slate-800'
                    >
                      <User className='h-5 w-5 text-slate-600' />
                      <span>Edit profile</span>
                    </Link>

                    <Link
                      to='/settings'
                      onClick={() => setIsProfileOpen(false)}
                      className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors'
                    >
                      <Settings className='h-5 w-5 text-slate-500' />
                      <span>Account settings</span>
                    </Link>

                    <Link
                      to='/support'
                      onClick={() => setIsProfileOpen(false)}
                      className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors'
                    >
                      <Info className='h-5 w-5 text-slate-500' />
                      <span>Support</span>
                    </Link>

                    <hr className='my-2 border-gray-100' />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        logout()
                      }}
                      className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer'
                    >
                      <LogOut className='h-5 w-5 text-slate-500 hover:text-red-600' />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
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
          <div className='right-0 fixed top-16 shadow-lg z-50 transition-all duration-300 ease-in-out'>
            <Cart onCloseCart={toggleCart} />
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
