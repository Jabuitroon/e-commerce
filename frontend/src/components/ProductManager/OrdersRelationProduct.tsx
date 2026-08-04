import React, { useState } from 'react'
import { DeleteProductModal } from './DeleteProductModal'
import {
  ModalState,
  ErrorDependenciesResponse,
} from '../../interfaces/interfaces'

export const ProductList: React.FC = () => {
  const [modalData, setModalData] = useState<ModalState>({
    isOpen: false,
    productId: null,
    records: [],
  })

  const handleDelete = async (id: string, force = false): Promise<void> => {
    try {
      const endpoint = force
        ? `http://localhost:3000/api/products/${id}?force=true`
        : `http://localhost:3000/api/products/${id}`

      const response = await fetch(endpoint, { method: 'DELETE' })
      const data = await response.json()

      // Si captura el conflicto por clave foránea (409)
      if (response.status === 409) {
        const errorData = data as ErrorDependenciesResponse
        setModalData({
          isOpen: true,
          productId: id,
          records: errorData.relatedRecords,
        })
        return
      }

      if (response.ok) {
        alert('Producto eliminado exitosamente')
        setModalData({ isOpen: false, productId: null, records: [] })
        // Refrescar estado o lista de productos aquí
      } else {
        alert(data.message || 'Error al eliminar')
      }
    } catch (error) {
      console.error('Error al intentar eliminar el producto:', error)
    }
  }

  return (
    <div>
      <button type='button' onClick={() => handleDelete('TEL0026')}>
        Eliminar TEL0026
      </button>

      <DeleteProductModal
        isOpen={modalData.isOpen}
        productId={modalData.productId}
        records={modalData.records}
        onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (modalData.productId) {
            handleDelete(modalData.productId, true)
          }
        }}
      />
    </div>
  )
}
