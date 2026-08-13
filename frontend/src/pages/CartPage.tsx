import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/custHooks'
import { ProductInCart } from '../interfaces/interfaces'

import { LiaExclamationCircleSolid } from 'react-icons/lia'
import { StepProgressBar, Step } from '../components/StepProgressBar'

const CHECKOUT_STEPS: Step[] = [
  { id: 1, label: 'Confirmar orden' },
  { id: 2, label: 'Método de pago' },
  { id: 3, label: 'Confirmación de pago' },
]

// Datos simulados de direcciones para el selector (luego los conectarás con tu API/DB)
const MOCK_ADDRESSES = [
  { id: 'addr_1', label: 'Casa - Cl. 5 #10-20, Popayán' },
  { id: 'addr_2', label: 'Oficina - Cra. 9 #4-15, Popayán' },
  { id: 'addr_3', label: 'Nueva dirección (+)' },
]

export function CartPage() {
  const { cart, addToCart, decreaseQuantify, removeFromCart } = useCart()
  const navigate = useNavigate()

  const [selectedAddress, setSelectedAddress] = useState<string>(
    MOCK_ADDRESSES[0].id,
  )

  // Cálculos del resumen
  const subtotal = cart.reduce(
    (acc, item) => acc + parseFloat(item.pro_price) * Number(item.count),
    0,
  )
  const shippingEstimate = cart.length > 0 ? 5.0 : 0.0
  const taxEstimate = subtotal * 0.08
  const total = subtotal + shippingEstimate + taxEstimate

  const handleProceedToCheckout = () => {
    // Redireccionamos a la página de checkout enviando opcionalmente la dirección seleccionada en el estado de navegación
    navigate('/checkout', { state: { addressId: selectedAddress } })
  }

  if (cart.length === 0) {
    return (
      <div className='min-h-[70vh] flex flex-col items-center justify-center p-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Tu carrito está vacío
        </h2>
        <p className='text-gray-500 mt-2'>
          Agrega productos para comenzar el proceso de compra.
        </p>
        <button
          onClick={() => navigate('/')}
          className='mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition'
        >
          Explorar Productos
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white pt-18 p-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-6xl'>
        {/* Paso 1 Activo */}
        <div className='container mx-auto p-4'>
          <StepProgressBar steps={CHECKOUT_STEPS} currentStep={1} />
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Shopping Cart</h1>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          {/* COLUMNA IZQUIERDA: Lista de productos */}
          <div className='lg:col-span-7 divide-y divide-gray-200'>
            {cart.map((product: ProductInCart) => (
              <div key={product.pro_id} className='py-6 first:pt-0 flex gap-6'>
                {/* Imagen del producto */}
                <div className='h-36 w-36 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2 flex items-center justify-center'>
                  <img
                    src={product.pro_image}
                    alt={product.pro_title}
                    className='h-full w-full object-contain'
                  />
                </div>

                {/* Detalles e interacción */}
                <div className='flex flex-1 flex-col justify-between'>
                  <div>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='text-base font-semibold text-gray-900'>
                          {product.pro_title}
                        </h3>
                        <p className='text-xs text-gray-400 mt-1'>
                          {product.cat_nombre}
                        </p>
                      </div>

                      {/* Selector de Cantidad + Botón Eliminar */}
                      <div className='flex items-center gap-4'>
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

                        <button
                          onClick={() => removeFromCart(product)}
                          className='text-gray-400 hover:text-gray-600 text-lg transition-colors p-1'
                          title='Remover'
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <p className='text-sm font-bold text-gray-900 mt-2'>
                      {product.pro_price_symbol}
                      {parseFloat(product.pro_price).toFixed(2)}
                    </p>
                  </div>

                  {/* Estado del Stock */}
                  <div className='flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-4'>
                    <span>✓</span>
                    <span>In stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Resumen de Orden y Selección de Dirección */}
          <div className='lg:col-span-5'>
            <div className='rounded-2xl bg-gray-50/70 p-6 border border-gray-100 space-y-6'>
              <h2 className='text-lg font-bold text-gray-900'>Order summary</h2>

              {/* MINI SECCIÓN: Dirección de Destino del Envío */}
              <div className='space-y-2 pt-2 border-t border-gray-200/60'>
                <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                  Shipping destination
                </label>
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition'
                >
                  {MOCK_ADDRESSES.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desglose de Precios */}
              <div className='space-y-3 pt-4 border-t border-gray-200/60 text-sm'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold text-gray-900'>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className='flex justify-between text-gray-600 items-center'>
                  <span className='flex items-center gap-1'>
                    Shipping estimate
                    <span
                      className='text-gray-400 text-xs cursor-help'
                      title='Envío estándar basado en ubicación'
                    >
                      ⓘ
                    </span>
                  </span>
                  <span className='font-semibold text-gray-900'>
                    ${shippingEstimate.toFixed(2)}
                  </span>
                </div>

                <div className='flex justify-between text-gray-600 items-center'>
                  <span className='flex items-center gap-1'>
                    Tax estimate
                    <span
                      className='text-gray-400 text-xs cursor-help'
                      title='Impuesto estimado del 8%'
                    >
                      ⓘ
                    </span>
                  </span>
                  <span className='font-semibold text-gray-900'>
                    ${taxEstimate.toFixed(2)}
                  </span>
                </div>

                <div className='flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900'>
                  <span>Order total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* ALERTA UX: Aclaración sobre la orden */}
              <div className='mb-8 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-amber-800 text-sm'>
                <LiaExclamationCircleSolid className='h-16 w-16' />
                <div>
                  <p className='font-semibold'>
                    Información importante sobre tu pedido
                  </p>
                  <p className='text-amber-700 text-xs mt-0.5'>
                    Al hacer clic en <strong>Checkout</strong>, se congelará la
                    lista de productos y se creará la orden en el sistema. Una
                    vez en el paso de pago,{' '}
                    <strong>
                      no será posible editar ni modificar la lista de ítems
                    </strong>
                    .
                  </p>
                </div>
              </div>
              {/* Botón Principal a Checkout */}
              <button
                onClick={handleProceedToCheckout}
                className='w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all'
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
