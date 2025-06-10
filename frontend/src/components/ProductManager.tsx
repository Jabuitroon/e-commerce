import { useEffect, useState } from 'react'

import UseProductManager, { ProductForm } from './Forms'
import { Product } from '../../../packages/types/src/types'
import { getProducts } from '../services/getProducts'
import { DataProducts } from '../types'

export default function ProductManagement() {
  // Controles de modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false)
  }

  const [products, setInitProducts] = useState<DataProducts>([])

  useEffect(() => {
    getProducts().then((response) => {
      const [, initialData] = response

      if (initialData) {
        setInitProducts(initialData)
      }
    })
  }, [])

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  )
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.pro_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.pro_title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función onclick para abrir modal de añadir producto
  const handleAddProduct = () => {
    setIsAddModalOpen(true)
  }

  const handleUpdateProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsUpdateModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    // setSelectedProduct(product)
    // setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedProduct) {
      //   setProducts(products.filter((p) => p.id !== selectedProduct.id))
      //   setIsDeleteModalOpen(false)
      //   setSelectedProduct(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedProduct(undefined)
  }

  return (
    <div className='space-y-6'>
      {/* Header con búsqueda y botón añadir */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='relative w-full sm:w-80'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <input
            type='text'
            placeholder='Buscar productos...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddProduct}
          className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
        >
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Añadir Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nombre
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Categoría
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Precio
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stock
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Última Actualización
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.pro_id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.pro_id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {product.pro_title}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span className='inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'>
                        {product.cat_nombre}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium'>
                      {`${product.pro_price_symbol} ${product.pro_price}`}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right'>
                      <span
                        //   Acá va el stock
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
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      Una fecha
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => handleUpdateProduct(product)}
                          className='inline-flex items-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
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
                          className='inline-flex items-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
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
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-gray-500'
                  >
                    <div className='flex flex-col items-center'>
                      <svg
                        className='h-12 w-12 text-gray-300 mb-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                        />
                      </svg>
                      <p className='text-lg font-medium'>
                        No se encontraron productos
                      </p>
                      <p className='text-sm'>
                        Intenta con otros términos de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de añadir producto */}
      {isAddModalOpen && (
        <div className='fixed inset-0 bg-gray-400/80 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Añadir Nuevo Producto
                </h3>
                <button
                  onClick={handleCloseAddModal}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <UseProductManager />
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className='fixed inset-0 bg-gray-400/80 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Editando el Producto...
                </h3>
                <button
                  onClick={handleCloseUpdateModal}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <UseProductManager product={selectedProduct} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='p-6'>
              <div className='flex items-center mb-4'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-6 w-6 text-red-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Confirmar eliminación
                  </h3>
                </div>
              </div>
              <div className='mb-6'>
                <p className='text-sm text-gray-500'>
                  ¿Estás seguro de que deseas eliminar el producto{' '}
                  <span className='font-medium text-gray-900'>
                    &quot;{selectedProduct?.pro_title}&quot;
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className='flex gap-3 justify-end'>
                <button
                  onClick={cancelDelete}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors'
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors'
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
