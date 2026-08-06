import React from 'react'
import { RelatedOrder } from '../../interfaces/interfaces'
import { HiExclamation, HiOutlineX } from 'react-icons/hi'

interface DeleteProductModalProps {
  isOpen: boolean
  productId: string | null
  records: RelatedOrder[]
  onClose: () => void
  onConfirm: () => void
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  productId,
  records,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-200/60 p-4'>
      <div className='relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors'
        >
          <HiOutlineX size={24} />
        </button>
        <h3 className='text-xl font-bold text-gray-900 text-center mb-5 mt-1'>
          Se Encontraron Registros Vinculados
        </h3>
        <p className='text-gray-500 text-center mb-6 px-3'>
          ¿Estás seguro de que deseas eliminar el producto{' '}
          <strong className='text-gray-900'>{productId}</strong>?
        </p>
        <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-2 mb-2'>
            <HiExclamation className='text-orange-600' size={20} />
            <h4 className='text-orange-800 font-semibold'>Atención</h4>
          </div>
          <p className='text-orange-700 text-sm'>
            Al eliminar este producto, también se eliminarán permanentemente los{' '}
            <strong>{records.length}</strong> registro(s) de detalle asociados:
          </p>
          <div className='mt-3 bg-white bg-opacity-60 rounded border border-orange-100 overflow-hidden'>
            <div className='max-h-40 overflow-y-auto'>
              <table className='w-full text-sm text-left text-orange-900'>
                <thead className='text-xs uppercase bg-orange-100 text-orange-800'>
                  <tr>
                    <th className='px-4 py-2 font-medium'>ID Órden</th>
                    <th className='px-4 py-2 font-medium text-right'>
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-orange-100'>
                  {records.map((item) => (
                    <tr key={item.odt_id} className='hover:bg-orange-100/50'>
                      <td className='px-4 py-2'>{item.odt_id_orden}</td>
                      <td className='px-4 py-2 text-right'>
                        {item.odt_cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='flex justify-center gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all'
          >
            No, cancelar
          </button>

          <button
            type='button'
            onClick={onConfirm}
            className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all'
          >
            Sí, eliminar todo
          </button>
        </div>
      </div>
    </div>
  )
}
