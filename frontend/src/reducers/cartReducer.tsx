import { ProductInCart, Product, type Data } from '../types'

type ReducerAction =
  | {
      type: 'ADD_AT_CART'
      payload: Product
    }
  | {
      type: 'DECREASE_QUANTIFY'
      payload: ProductInCart
    }
  | {
      type: 'REMOVE_FROM_CART'
      payload: ProductInCart
    }
  | {
      type: 'REMOVE_ALL_CART'
    }

//
export const cartReducer = (state: Data, action: ReducerAction): Data => {
  switch (action.type) {
    case 'ADD_AT_CART': {
      const { pro_id } = action.payload
      const productInCartIndex = state.findIndex(
        (item) => item.pro_id === pro_id
      )

      // Si el producto no está en el carrito
      if (productInCartIndex >= 0) {
        const newState = structuredClone(state)
        let quantify = Number(newState[productInCartIndex].count)
        quantify += 1
        newState[productInCartIndex].count = String(quantify)
        return newState
      }

      return [
        ...state,
        {
          ...action.payload,
          count: '1',
        },
      ]
    }

    case 'DECREASE_QUANTIFY': {
      const { pro_id } = action.payload

      const productInCartIndex = state.findIndex(
        (item) => item.pro_id === pro_id
      )

      if (Number(state[productInCartIndex].count) > 1) {
        console.log('resta')

        const newState = structuredClone(state)
        let quantify = Number(newState[productInCartIndex].count)
        quantify -= 1
        newState[productInCartIndex].count = String(quantify)
        return newState
      }
      return state
    }

    // Remover un producto del carrito
    case 'REMOVE_FROM_CART': {
      const { pro_id } = action.payload
      console.log(pro_id)

      // Donde estaba el set tales tales ahora se retorna un newState
      return state.filter((item) => item.pro_id !== pro_id)
    }
    case 'REMOVE_ALL_CART': {
      // Donde estaba el set tales tales ahora se retorna un newState
      return []
    }
  }
}
