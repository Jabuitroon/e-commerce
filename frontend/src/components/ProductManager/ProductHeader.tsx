import React from 'react'

interface ProductHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onAddProduct: () => void
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddProduct,
}) => (
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
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <button
      onClick={onAddProduct}
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
)
