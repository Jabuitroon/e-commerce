import { ProductForm } from '../components/Forms'

export const updateProduct = async (productData: ProductForm): Promise<any> => {
  try {
    const res = await fetch(
      `http://localhost:3000/products/${productData.id}`,
      {
        method: 'put',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(productData),
      }
    )
    if (!res.ok)
      return [new Error(`Error al crear Producto: ${res.statusText}`)]

    const jsonres = await res.json()

    return jsonres
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Unknown error'),
    }
  }
}
