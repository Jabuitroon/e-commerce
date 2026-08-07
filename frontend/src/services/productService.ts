/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorDependenciesResponse } from '../interfaces/interfaces'

interface DeleteProductResponse {
  success: boolean
  hasDependencies?: boolean
  relatedRecords?: any[]
  message?: string
}

export const deleteProductApi = async (
  id: string,
  token: string | null,
  force = false,
): Promise<DeleteProductResponse> => {
  const endpoint = force
    ? `http://localhost:3000/products/${id}?force=true`
    : `http://localhost:3000/products/${id}`

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (response.status === 409) {
    const errorData = data as ErrorDependenciesResponse
    return {
      success: false,
      hasDependencies: true,
      relatedRecords: errorData.relatedRecords,
    }
  }

  if (response.ok) {
    return { success: true }
  }

  return { success: false, message: data.message || 'Error al eliminar' }
}
