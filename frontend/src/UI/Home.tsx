import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/custHooks'
import { useAuthStore } from '../../store/auth.store'
import { SearchProduct } from '../components/Search'
import { Cart } from '../components/Cart'
import { useIsAdmin } from '../utils/permissions'
import {
  User,
  ChevronDown,
  Settings,
  Info,
  LogOut,
  X,
  MapPin,
  ShoppingCart,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from './Button'
import { HeaderMenu } from '../components/HeaderMenu'

export default function HeaderHome() {
  const { profile, logout } = useAuthStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const isAdmin = useIsAdmin()
  const { cart } = useCart()

  // Controladores de mini menús
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <>
      <header className='bg-[#e7ecef] w-full md:h-16 flex justify-center items-center fixed top-0 z-50'>
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
                {cart.length > 0 && (
                  <span className='absolute bg-white text-blue-600 h-5 w-5 font-bold rounded-full text-[14px] right-0 top-0'>
                    {cart.length}
                  </span>
                )}
              </Button>
              {/* Mi cuenta */}
              {profile?.id_usuario ? (
                /* Estado: Usuario Autenticado */
                <button
                  // Para testing con crypress
                  data-cy='user-dropdown-trigger'
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
                  <div
                    data-cy='user-dropdown-menu'
                    className='space-y-1 text-slate-700 text-sm font-medium'
                  >
                    {isAdmin && (
                      <Link
                        to='/admin'
                        className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-200/80 transition-colors text-slate-800'
                      >
                        <LayoutDashboard className='h-5 w-5 text-slate-600' />
                        Dashboard
                      </Link>
                    )}
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
        {isMenuOpen && <HeaderMenu />}
        {/* Overlay para cerrar el menú al hacer clic fuera */}
        {isMenuOpen && (
          <div
            className='fixed inset-0 z-40'
            onClick={toggleMenu}
            aria-hidden='true'
          ></div>
        )}
        {isCartOpen && (
          <div className='right-0 fixed top-16 shadow-lg z-50 transition-all duration-300 ease-in-out'>
            <Cart onCloseCart={toggleCart} />
          </div>
        )}
      </header>
    </>
  )
}
