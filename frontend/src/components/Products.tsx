import { useContext } from 'react'
import { ProductsContext } from '../context/filters'
import { useCart } from '../hooks/custHooks'

import type React from 'react'
// Importamos los iconos necesarios de react-icons
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaSortAmountUpAlt,
} from 'react-icons/fa'
import { Filters, Product } from '../types'

// Definimos interfaces para los props de nuestros componentes
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  className?: string
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'light' | 'alternative'
  size?: 'default' | 'sm'
}

// Definimos la interfaz para una categoría
interface Category {
  id: number
  name: string
  image: string
}

// Componente Badge con TypeScript
const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

// Componente Button con TypeScript
export const Button: React.FC<ButtonProps> = ({
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
    danger:
      'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900',
    light:
      'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
    alternative:
      'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
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

export const Products = () => {
  const { products } = useContext(ProductsContext)
  const { addToCart } = useCart()

  return (
    <>
      <div className='container mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold mb-8 text-center md:text-left'>
          Descubre Nuestros Productos
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-6 md:grid-rows-6 gap-4 md:gap-6 mb-12'>
          {products?.map((objProduct: Product) =>
            objProduct.pro_is_best_seller ? (
              <div className='md:col-span-4 md:row-span-4 group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl '>
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
                      <Button className='w-full mb-2'>Añadir al carrito</Button>
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
                      {objProduct.pro_originalPrice && (
                        <span className='text-sm text-gray-500 line-through ml-2'>
                          {objProduct.pro_price_symbol}
                        </span>
                      )}
                    </div>
                    <Badge className='flex items-center gap-1 bg-gray-100 text-gray-800'>
                      Popular
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className='md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl'>
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
                    <div className='flex'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-10 w-10 p-0'
                        onClick={() => {
                          addToCart(objProduct)
                        }}
                      >
                        <FaShoppingCart className='h-6 w-6' />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-10 w-10 p-0'
                      >
                        <FaSortAmountUpAlt />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}
