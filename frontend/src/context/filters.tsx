import { Filters, type DataProducts } from '../types'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { loadData } from '../services/getProducts'

interface ProductProviderProps {
  children: ReactNode
}

type ProductsContextType = {
  initData: DataProducts
  setInitData: Dispatch<SetStateAction<DataProducts>>
  products: DataProducts
  setProducts: Dispatch<SetStateAction<DataProducts>>
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
)

export function ProductsProvider({ children }: ProductProviderProps) {
  const [initData, setInitData] = useState<DataProducts>([])
  const [products, setProducts] = useState<DataProducts>(initData)
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    minPrices: 200,
  })

  // Llamar a la bd para traer información inicial
  useEffect(() => {
    loadData().then((response) => {
      const [, initialData] = response

      if (initialData) {
        setInitData(initialData)
        setProducts(initialData)
      }
    })
  }, [])

  return (
    <ProductsContext.Provider
      value={{
        initData,
        setInitData,
        products,
        setProducts,
        filters,
        setFilters,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
