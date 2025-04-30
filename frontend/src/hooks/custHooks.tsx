import { useContext } from 'react'
import { CartContext } from '../context/cart'

// export function useFilter() {

// }

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error(
      'No tiene acceso a este contexto, estoy pretendiendo usar este CH en un sitio que no puedo'
    )
  }
  return context
}
