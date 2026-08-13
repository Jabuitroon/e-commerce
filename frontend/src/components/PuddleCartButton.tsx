/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Button } from '../UI/Button'
import { FaShoppingCart } from 'react-icons/fa'

export const PuddleCartButton = ({
  objProduct,
  quantity,
  addToCart,
  navigateTo,
  isAllow,
}: any) => {
  const [isRippling, setIsRippling] = useState(false)

  const handleClick = () => {
    // Activar la animación solo la primer vez
    if (quantity == 0) setIsRippling(true)

    // Ejecutar la lógica de agregar al carrito (tu lógica original)
    if (isAllow) {
      addToCart(objProduct)
    } else {
      navigateTo('login')
    }

    // Desactivar la animación después de que termine (0.6s definidos en el CSS)
    setTimeout(() => {
      setIsRippling(false)
    }, 600)
  }

  return (
    <Button
      size='sm'
      variant='ghost'
      // 2. Importante: relative y overflow-hidden para contener la onda
      className='h-10 w-10 p-0 rounded-full relative overflow-hidden transition-all duration-300'
      onClick={handleClick}
    >
      {/* 3. El elemento que crea el efecto de charco (se renderiza solo al hacer clic) */}
      {isRippling && (
        <span
          className='animate-puddle absolute inset-0 rounded-full bg-blue-400 opacity-50 pointer-events-none'
          style={{ transformOrigin: 'center center' }} // Expansión desde el centro
        />
      )}

      {/* Contenido original del botón (con z-index para estar sobre el charco) */}
      <div className='relative z-10 flex items-center justify-center'>
        {quantity > 0 ? (
          <span className='bg-blue-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center'>
            {quantity}
          </span>
        ) : (
          <div
            className='relative flex items-center justify-center'
            title='Agregar producto al carrito'
          >
            {/* Icono del Carrito Principal */}
            <FaShoppingCart className='text-2xl text-gray-700' />

            {/* Icono + en la esquina superior derecha */}
            <span className='absolute -top-1.5 -right-1.5 text-slate-600 rounded-full text-[16px] font-extrabold w-3 h-3 flex items-center justify-center leading-none shadow-sm'>
              ++
            </span>
          </div>
        )}
      </div>
    </Button>
  )
}
