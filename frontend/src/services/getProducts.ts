import { type ApiGetProducts, type DataProducts } from '../types'
// import { API_HOST } from '../config'

export const loadData = async (): Promise<[Error?, DataProducts?]> => {
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

export const getProducts = async (): Promise<[Error?, DataProducts?]> => {
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
