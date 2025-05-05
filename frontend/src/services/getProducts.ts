import { type ApiGetProducts, type Data } from '../types'
// import { API_HOST } from '../config'

export const loadData = async (): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`http://localhost:3000/products`)

    if (!res.ok) return [new Error(`Error al buscar data: ${res.statusText}`)]
    const jsonFilter = (await res.json()) as ApiGetProducts
    console.log('Initial Data form services', jsonFilter)

    return [undefined, jsonFilter.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
