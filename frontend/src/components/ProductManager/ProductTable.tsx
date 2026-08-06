import React from 'react'
import { Product } from '../../interfaces/interfaces'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void // Recibe el objeto entero
  onMouseEnter: (product: Product, event: React.MouseEvent) => void
  onMouseMove: (event: React.MouseEvent) => void
  onMouseLeave: () => void
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) => (
  <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              ID
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Nombre
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Categoría
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
              Precio
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
              Stock
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Última Actualización
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.pro_id}
                className='hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                  {product.pro_id}
                </td>
                <td
                  className='px-6 py-4 text-sm text-gray-900 cursor-pointer'
                  onMouseEnter={(e) => onMouseEnter(product, e)}
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
                >
                  {product.pro_title}
                </td>
                <td className='px-6 py-4 text-sm text-gray-500'>
                  <span className='inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'>
                    {product.cat_nombre}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm text-gray-900 text-right font-medium'>
                  {`${product.pro_price_symbol} ${product.pro_price}`}
                </td>
                <td className='px-6 py-4 text-sm text-gray-900 text-right'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      Number(product.pro_stock) > 50
                        ? 'bg-green-100 text-green-800'
                        : Number(product.pro_stock) > 20
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.pro_stock}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm text-gray-500'>
                  {product.pro_update_at.substring(0, 10)} /{' '}
                  {product.pro_update_at.substring(11, 16)}
                </td>
                <td className='px-6 py-4 text-right text-sm font-medium'>
                  <div className='flex justify-end gap-2'>
                    <button
                      onClick={() => onEdit(product)}
                      className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title='Editar producto'
                    >
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(product)} // Pasa el objeto producto
                      className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title='Eliminar producto'
                    >
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                <p className='text-lg font-medium'>
                  No se encontraron productos
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)
