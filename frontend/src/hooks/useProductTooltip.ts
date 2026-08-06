import { useState } from 'react'
import { Product } from '../interfaces/interfaces'

export const useProductTooltip = () => {
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (product: Product, event: React.MouseEvent) => {
    setHoveredProduct(product)
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredProduct(null)
  }

  return {
    hoveredProduct,
    mousePosition,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  }
}
