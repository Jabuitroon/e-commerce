import { ProductsProvider } from '../src/context/filters'
import { CartProvider } from './context/cart.jsx'

import './App.css'
import Home from './UI/Home'
import { AppRouter } from './components/AppRouter'

function App() {
  return (
    <>
      <ProductsProvider>
        <CartProvider>
          <Home />
          <AppRouter />
        </CartProvider>
      </ProductsProvider>
    </>
  )
}

export default App
