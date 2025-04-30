import { Products } from './Products'
import { ProductsProvider } from '../src/context/filters'
import { CartProvider } from './context/cart.jsx'

import './App.css'
import Home from './UI/Home'

function App() {
  return (
    <>
      <ProductsProvider>
        <CartProvider>
          <Home />
          <Products />
        </CartProvider>
      </ProductsProvider>
    </>
  )
}

export default App
