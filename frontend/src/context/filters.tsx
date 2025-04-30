import { Filters, type Data } from '../types'
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
  initData: Data
  setProducts: Dispatch<SetStateAction<Data>>
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
)

export function ProductsProvider({ children }: ProductProviderProps) {
  const [initData, setProducts] = useState<Data>([])
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    minPrices: 200,
  })

  // Llamar a la api para traer información inicial
  useEffect(() => {
    loadData().then((response) => {
      const [, initialData] = response

      if (initialData) setProducts(initialData)
    })
  }, [])

  return (
    <ProductsContext.Provider
      value={{ initData, setProducts, filters, setFilters }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
