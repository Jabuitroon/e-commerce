import { ProductInCart, Product } from '../../../packages/types'
import { type DataProducts } from '../types'
import { cartReducer } from '../reducers/cartReducer'

import { createContext, ReactNode, useReducer } from 'react'

interface CartProviderProps {
  children: ReactNode
}

interface CartContextType {
  cart: DataProducts
  addToCart: (product: Product) => void
  decreaseQuantify: (product: ProductInCart) => void
  removeFromCart: (product: ProductInCart) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCartReducer() {
  const initialState: DataProducts = []
  const [state, dispatch] = useReducer(cartReducer, initialState)
  console.log('Estado del carrito', state)

  // Agregar al carrito
  const addToCart = (product: Product) =>
    dispatch({
      type: 'ADD_AT_CART',
      payload: product,
    })

  // Disminuir en 1 al producto dentro del carrito
  const decreaseQuantify = (product: ProductInCart) =>
    dispatch({
      type: 'DECREASE_QUANTIFY',
      payload: product,
    })

  // Remover del carrito
  const removeFromCart = (product: ProductInCart) =>
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: product,
    })

  // limpiar carrito
  const clearCart = () => dispatch({ type: 'REMOVE_ALL_CART' })

  return { state, clearCart, addToCart, decreaseQuantify, removeFromCart }
}

export function CartProvider({ children }: CartProviderProps) {
  const { state, addToCart, decreaseQuantify, removeFromCart, clearCart } =
    useCartReducer()
  return (
    <CartContext.Provider
      value={{
        cart: state,
        clearCart,
        addToCart,
        decreaseQuantify,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
