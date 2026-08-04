import React, { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/custHooks'
import { ProductInCart } from '../interfaces/interfaces'

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { cart, removeFromCart } = useCart()

  const [email, setEmail] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    amount: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Cálculos de la orden
  const subtotal = cart.reduce(
    (acc, item) => acc + parseFloat(item.pro_price) * Number(item.count),
    0,
  )
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0
  const taxes = subtotal * 0.08 // Ejemplo de cálculo del 8% de impuestos
  const shipping = cart.length > 0 ? 15.0 : 0.0
  const total = subtotal - discountAmount + taxes + shipping

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    if (discountCode.toUpperCase() === 'CHEAPSKATE') {
      setAppliedDiscount({ code: 'CHEAPSKATE', amount: 24.0 })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        receipt_email: email,
      },
    })

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message || 'Error en el pago')
    } else {
      setErrorMessage('Ocurrió un error inesperado.')
    }

    setIsProcessing(false)
  }

  return (
    <div className='min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12'>
        {/* COLUMNA IZQUIERDA: Formulario de Pago */}
        <div className='lg:col-span-7 space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2'>
                Email address
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2'>
                Shipping & Payment Details
              </label>
              {/* Contenedor oficial de Stripe Elements (maneja tarjetas, direcciones, etc.) */}
              <div className='p-4 border border-gray-200 rounded-lg bg-white shadow-sm'>
                <PaymentElement />
              </div>
            </div>

            <div className='flex items-center gap-2 pt-2'>
              <input
                id='billing-same'
                type='checkbox'
                defaultChecked
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label
                htmlFor='billing-same'
                className='text-xs font-medium text-gray-700'
              >
                Billing address is the same as shipping address
              </label>
            </div>

            {errorMessage && (
              <div className='text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-200'>
                {errorMessage}
              </div>
            )}

            <button
              type='submit'
              disabled={!stripe || isProcessing}
              className='w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50'
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>

            <p className='text-center text-xs text-gray-400 flex items-center justify-center gap-1'>
              <span>🔒</span> Payment details stored securely
            </p>
          </form>
        </div>

        {/* COLUMNA DERECHA: Resumen del Pedido */}
        <div className='lg:col-span-5 bg-gray-50/70 p-6 rounded-2xl border border-gray-100 h-fit space-y-6'>
          {/* Lista de Productos */}
          <div className='divide-y divide-gray-200/60 max-h-80 overflow-y-auto pr-1'>
            {cart.map((product: ProductInCart) => (
              <div key={product.pro_id} className='flex gap-4 py-4 first:pt-0'>
                <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-2'>
                  <img
                    src={product.pro_image}
                    alt={product.pro_title}
                    className='h-full w-full object-contain'
                  />
                </div>
                <div className='flex flex-1 flex-col justify-between'>
                  <div>
                    <h4 className='text-sm font-semibold text-gray-900'>
                      {product.pro_title}
                    </h4>
                    <p className='text-sm font-bold text-gray-800 mt-0.5'>
                      {product.pro_price_symbol}
                      {product.pro_price}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {product.cat_nombre}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Qty: {product.count}
                    </p>
                  </div>
                  <div className='flex gap-4 text-xs font-semibold text-indigo-600 mt-2'>
                    <button
                      onClick={() => navigate('/cart')}
                      className='hover:underline'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeFromCart(product)}
                      className='hover:underline text-gray-400 hover:text-red-500'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Código de Descuento */}
          <form onSubmit={handleApplyDiscount} className='flex gap-2 pt-2'>
            <input
              type='text'
              placeholder='Discount code'
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
            />
            <button
              type='submit'
              className='rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition'
            >
              Apply
            </button>
          </form>

          {/* Desglose Financiero */}
          <div className='space-y-3 pt-4 border-t border-gray-200 text-sm'>
            <div className='flex justify-between text-gray-600'>
              <span>Subtotal</span>
              <span className='font-semibold text-gray-900'>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {appliedDiscount && (
              <div className='flex justify-between items-center text-gray-600'>
                <span className='flex items-center gap-2'>
                  Discount
                  <span className='rounded-md bg-gray-200 px-2 py-0.5 text-xs font-bold uppercase text-gray-700'>
                    {appliedDiscount.code}
                  </span>
                </span>
                <span className='font-semibold text-gray-900'>
                  -${appliedDiscount.amount.toFixed(2)}
                </span>
              </div>
            )}

            <div className='flex justify-between text-gray-600'>
              <span>Taxes</span>
              <span className='font-semibold text-gray-900'>
                ${taxes.toFixed(2)}
              </span>
            </div>

            <div className='flex justify-between text-gray-600'>
              <span>Shipping</span>
              <span className='font-semibold text-gray-900'>
                ${shipping.toFixed(2)}
              </span>
            </div>

            <div className='flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900'>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
