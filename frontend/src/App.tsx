import { ProductsProvider } from '../src/context/filters'
import { CartProvider } from './context/cart.jsx'

import './App.css'
import { AppRouter } from './components/AppRouter'

function App() {
  return (
    <>
      <ProductsProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </ProductsProvider>
    </>
  )
}

export default App
