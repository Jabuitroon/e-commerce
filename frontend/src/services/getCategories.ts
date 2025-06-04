import { DropdownOption } from "../components/Dropdown"

// Asegurar que retorna un array de opciones (objetos)
export const categoriesRequest = async (): Promise<[Error?, DropdownOption[]?]> => {
  try {
    const res = await fetch(`http://localhost:3000/categories`)

    if (!res.ok) return [new Error(`Error al buscar data: ${res.statusText}`)]
    const jsonCategories = (await res.json())
    console.log('Initial Categories form services', jsonCategories)
    return [undefined, jsonCategories.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}