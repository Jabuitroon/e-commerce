import { useId } from 'react'
import { useCart } from '../hooks/custHooks'
import { Button } from './Products'
import { useAuthStore } from '../../store/auth'

export function Cart() {
  const { cart, addToCart, decreaseQuantify, removeFromCart, clearCart } =
    useCart()

  const cartCheckId = useId()
  const setIsAllow = useAuthStore((state) => state.isAuth)
  return cart.length == 0 ? (
    setIsAllow == true? <h2>Carrito vacío, agrega productos que te gusten.</h2> : <h2>Inicia sesión para comenzar</h2>
  ) : (
    <>
      <input id={cartCheckId} type='checkbox' hidden />
      {/* Para cada producto que haya en el carrito se renderiza el cartItem */}
      {cart.map((objProduct: any) => (
        <div className='group relative rounded-xl bg-white shadow-md transition-all hover:shadow-xl'>
          <div className='h-[200px] w-full relative'>
            <img
              src={objProduct.image}
              alt={objProduct.title}
              className='h-full w-full object-contain transition-transform group-hover:scale-105'
            />
            <Button
              onClick={() => {
                removeFromCart(objProduct)
              }}
              variant='danger'
              className='absolute top-0 right-0'
              size='sm'
            >
              <span>x</span>
            </Button>
          </div>
          <div className='p-4'>
            <h3 className='font-semibold'>{objProduct.title}</h3>
            <div className='flex items-center justify-between mt-2'>
              <span className='font-bold'>
                {objProduct.price_symbol}
                {objProduct.price}
              </span>
              <div className='flex items-center justify-between w-36'>
                <Button
                  className='button is-danger is-outlined'
                  onClick={() => {
                    decreaseQuantify(objProduct)
                  }}
                  variant='light'
                >
                  <span>-1</span>
                </Button>
                <span>{objProduct.count}</span>
                <Button
                  onClick={() => {
                    addToCart(objProduct)
                  }}
                  variant='alternative'
                >
                  <span>+1</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={() => {
          clearCart()
        }}
        variant='ghost'
        size='sm'
      >
        <span>Vaciar Carrito</span>
      </Button>
    </>
  )
}
