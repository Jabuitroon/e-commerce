import React from 'react'
import { Product } from '../../interfaces/interfaces'

interface ProductTooltipProps {
  product: Product | null
  position: { x: number; y: number }
}

export const ProductTooltip: React.FC<ProductTooltipProps> = ({
  product,
  position,
}) => {
  if (!product) return null

  return (
    <div
      className='fixed z-50 pointer-events-none'
      style={{ left: position.x + 15, top: position.y - 10 }}
    >
      <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-w-xs'>
        <img
          src={product.pro_image || '/placeholder.svg'}
          alt={product.pro_title}
          className='w-48 h-32 object-cover rounded'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.svg?height=128&width=192'
          }}
        />
      </div>
    </div>
  )
}
