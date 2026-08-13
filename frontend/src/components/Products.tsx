import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/custHooks'
import { ProductsContext } from '../context/filters'
import { useAuthStore } from '../../store/auth.store'
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa'

import { Badge } from '../UI/Badge'
import { Button } from '../UI/Button'
import { PuddleCartButton } from './PuddleCartButton'

export const Products = () => {
  const context = useContext(ProductsContext)

  if (!context) {
    throw new Error('ProductsContext debe usarse dentro de un ProductsProvider')
  }
  const { products } = context
  const { cart, addToCart } = useCart()

  const isAllow = useAuthStore((s) => !!s.token && !!s.profile)
  const navigateTo = useNavigate()

  const getProductQuantity = (productId: string) => {
    const item = cart.find(
      (item) => item.pro_id === productId || item.pro_id === productId,
    )
    return item ? Number(item.count) : 0
  }

  return (
    <>
      <div className='container w-5xl mx-auto px-4 md:pt-18 flex flex-col gap-6'>
        <h1 className='text-3xl font-bold text-center md:text-left'>
          Descubre Nuestros Productos
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-6 md:grid-rows-6 gap-4 md:gap-6 mb-12'>
          {products?.map((objProduct) => {
            const quantity = getProductQuantity(objProduct.pro_id)
            return objProduct.pro_id == 'B0XYZ5678' ? (
              <div
                className='md:col-span-4 md:row-span-4 group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl'
                key={objProduct.pro_id}
              >
                {objProduct.pro_sale && (
                  <div className='absolute top-2 right-2 z-10'>
                    <Badge className='absolute top-2 left-2'>
                      {objProduct.pro_sale}
                    </Badge>
                  </div>
                )}
                <div className='h-[300px] md:h-[500px] w-full relative'>
                  <img
                    src={objProduct.pro_image}
                    alt={objProduct.pro_title}
                    className='h-full w-full object-contain transition-transform group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
                    <div className='p-4 text-white'>
                      <Button
                        className='w-full mb-2'
                        onClick={() =>
                          isAllow ? addToCart(objProduct) : navigateTo('login')
                        }
                      >
                        Añadir al carrito
                        {quantity > 0 && (
                          <span className='ml-2 bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs'>
                            {quantity}
                          </span>
                        )}
                      </Button>
                      <div className='flex justify-between'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='text-white hover:text-white hover:bg-white/20'
                        >
                          <FaHeart className='h-4 w-4 mr-1' />
                          Guardar
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='text-white hover:text-white hover:bg-white/20'
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='text-xl font-semibold mb-2'>
                    {objProduct.pro_title}
                  </h3>
                  <div className='flex items-center mb-2'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(Number(objProduct.pro_star_rating))
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm text-gray-500 ml-2'>
                      {objProduct.pro_global_ratings}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <span className='text-xl font-bold'>
                        €{Number(objProduct.pro_price).toFixed(2)}
                      </span>
                    </div>
                    <Badge className='flex items-center gap-1 bg-gray-100 text-gray-800'>
                      Popular
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl'
                key={objProduct.pro_id}
              >
                <div className='h-[200px] w-full relative'>
                  <img
                    src={objProduct.pro_image}
                    alt={objProduct.pro_title}
                    className='h-full w-full object-contain transition-transform group-hover:scale-105'
                  />
                </div>
                {objProduct.pro_sale && (
                  <div className='absolute top-2 left-2'>
                    <Badge className='bg-red-500 text-white'>
                      {objProduct.pro_sale}
                    </Badge>
                  </div>
                )}
                <div className='p-4'>
                  <h3 className='font-semibold'>{objProduct.pro_title}</h3>
                  <div className='flex items-center justify-between mt-2'>
                    <span className='font-bold'>
                      {objProduct.pro_price_symbol}
                      {objProduct.pro_price}
                    </span>
                    <div className='flex items-center gap-2'>
                      <PuddleCartButton
                        objProduct={objProduct}
                        quantity={quantity}
                        addToCart={addToCart}
                        navigateTo={navigateTo}
                        isAllow={isAllow}
                      />

                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-10 w-10 flex items-center gap-4'
                      >
                        <div className='flex items-center gap-4'>
                          <FaRegHeart className='text-2xl' />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
