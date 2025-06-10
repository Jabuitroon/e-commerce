import { ApiGetProducts, type DataProducts } from '../types'

export const searchData = async (search: String): Promise<[Error?, DataProducts?]> => {
  try {
    const res = await fetch(`http://localhost:3000/search?q=${search}`)

    if (!res.ok) return [new Error(`Error al buscar data: ${res.statusText}`)]
    const jsonFilter = await res.json() as ApiGetProducts
    console.log(jsonFilter, 'Search')
    return [undefined, jsonFilter.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
  