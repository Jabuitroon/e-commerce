export const deleteProduct = async (productId: String): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:3000/products/${productId}`, {
      method: 'delete',
      headers: { 'content-type': 'application/json' },
    })
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
