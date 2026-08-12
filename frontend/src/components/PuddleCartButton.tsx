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
    // Activar la animación
    setIsRippling(true)

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
          <div className='flex items-center gap-4'>
            <FaShoppingCart className='text-2xl' />
          </div>
        )}
      </div>
    </Button>
  )
}
