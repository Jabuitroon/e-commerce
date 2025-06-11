import { Search as SearchIcon } from 'lucide-react'

import { ProductsContext } from '../context/filters'
import { useDebounce } from '@uidotdev/usehooks'
import { useContext, useEffect, useState } from 'react'
import { Product } from '../../../packages/types/src/types'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm'
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  const variants: Record<string, string> = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-100',
    ghost: 'hover:bg-gray-100',
  }

  const sizes: Record<string, string> = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md text-sm',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const Search = () => {
  const context = useContext(ProductsContext)

  if (!context) {
    throw new Error('ProductsContext debe usarse dentro de un ProductsProvider')
  }
  const { initData, setProducts } = context

  const [search, setSearch] = useState<String>(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('q') ?? ''
  })

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()

  //   // Un loadig para setAppStatus(APP_STATUS.UPLOADING)
  // }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const DEBOUNCE_TIME = 500
  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME)

  useEffect(() => {
    const newPathName =
      search == '' ? window.location.pathname : `?q=${debouncedSearch}`

    window.history.pushState({}, '', newPathName)
  }, [debouncedSearch, initData])

  useEffect(() => {
    if (!debouncedSearch) {
      setProducts(initData)
      return
    }

    const toSearch = search.toString().toLowerCase()
    console.log(toSearch)

    let filterFromData = initData.filter((product: Product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(toSearch)
      )
    )
    setProducts(filterFromData.length > 0 ? filterFromData : initData)
    return
  }, [debouncedSearch])

  return (
    <>
      <form>
        <input
          onChange={handleSearch}
          type='Search'
          placeholder='Buscar en acá.com'
          className='pl-4 pr-10 py-2 rounded-md border border-gray-300 w-full'
        />
        <Button
          size='sm'
          variant='ghost'
          className='absolute right-0 top-0 h-full px-3 bg-gray-200 rounded-l-none rounded-r-md'
        >
          <SearchIcon className='h-5 w-5 text-gray-500' />
        </Button>
      </form>
    </>
  )
}
