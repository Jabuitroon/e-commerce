import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/custHooks'
import { useAuthStore } from '../../store/auth.store'
import { ProductInCart } from '../interfaces/interfaces'

interface CartProps {
  onCheckout?: () => void
  onViewBag?: () => void
  onCloseCart?: () => void
}

export function Cart({ onViewBag, onCloseCart }: CartProps) {
  const { cart, addToCart, decreaseQuantify, removeFromCart, clearCart } =
    useCart()
  // const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuth = useAuthStore((state) => !!state.token && !!state.profile)
  const cartCheckId = useId()
  const navigate = useNavigate()

  const handleCheckoutClick = () => {
    if (onCloseCart) onCloseCart()
    navigate('/cart')
  }

  // Manejo de estados vacíos / no autenticado
  // if (!hasHydrated) return <Loading />; 
  if (!isAuth) {
    return (
      <div className='w-80 rounded-2xl bg-white p-6 shadow-xl border border-gray-100 text-center'>
        <p className='text-sm font-medium text-gray-600'>
          Inicia sesión para comenzar
        </p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className='w-80 rounded-2xl bg-white p-6 shadow-xl border border-gray-100 text-center'>
        <p className='text-sm font-medium text-gray-500'>
          Carrito vacío, agrega productos que te gusten.
        </p>
      </div>
    )
  }

  return (
    <div className='w-80 sm:w-96 rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 transition-all'>
      <input id={cartCheckId} type='checkbox' hidden />

      {/* Lista de productos con separadores */}
      <div className='divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1'>
        {cart.map((product: ProductInCart) => (
          <div
            key={product.pro_id}
            className='flex items-center gap-4 py-4 first:pt-0 last:pb-4'
          >
            {/* Imagen con contenedor gris suave */}
            <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2 flex items-center justify-center'>
              <img
                src={product.pro_image}
                alt={product.pro_title}
                className='h-full w-full object-contain'
              />
            </div>

            {/* Información del Producto */}
            <div className='flex flex-1 flex-col justify-center min-w-0'>
              <div className='flex justify-between items-start'>
                <h4 className='text-sm font-semibold text-gray-900 truncate pr-2'>
                  {product.pro_title}
                </h4>
                <button
                  onClick={() => removeFromCart(product)}
                  className='text-gray-300 hover:text-red-500 transition-colors text-xs p-1'
                  title='Eliminar producto'
                >
                  ✕
                </button>
              </div>

              <p className='text-xs text-gray-400 mt-0.5'>
                {product.cat_nombre}
              </p>

              {/* Controles de Cantidad y Precio */}
              <div className='flex items-center justify-between mt-2'>
                <span className='text-xs font-bold text-gray-800'>
                  {product.pro_price_symbol}
                  {product.pro_price}
                </span>

                <div className='flex items-center gap-2 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200'>
                  <button
                    onClick={() => decreaseQuantify(product)}
                    className='text-xs text-gray-600 hover:text-indigo-600 font-bold px-1'
                  >
                    -
                  </button>
                  <span className='text-xs font-semibold text-gray-700'>
                    {product.count}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className='text-xs text-gray-600 hover:text-indigo-600 font-bold px-1'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones principales / Footer del Modal */}
      <div className='mt-4 pt-3 flex flex-col gap-2'>
        <button
          onClick={handleCheckoutClick}
          className='w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all'
        >
          Ir al Carrito
        </button>

        <button
          onClick={onViewBag || clearCart}
          className='w-full py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors'
        >
          {onViewBag ? 'View Shopping Bag' : 'Vaciar Carrito'}
        </button>
      </div>
    </div>
  )
}
