import React from 'react'
import { Product } from '../../interfaces/interfaces'

interface ConfirmDeleteModalProps {
  product: Product | null
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  if (!product) return null

  return (
    <div className='fixed inset-0 bg-gray-500/80 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          Confirmar eliminación
        </h3>
        <p className='text-sm text-gray-500 mb-6'>
          ¿Estás seguro de que deseas eliminar el producto{' '}
          <strong className='text-gray-900'>"{product.pro_title}"</strong> (ID:{' '}
          {product.pro_id})?
        </p>
        <div className='flex gap-3 justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700'
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
