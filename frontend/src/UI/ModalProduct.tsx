import { MouseEventHandler } from 'react'
import UseProductManager from '../components/Forms'
import { Product } from '../../../packages/types/src/types'

type modalProps = {
  selectedProduct: Product | undefined
  closeModal: MouseEventHandler
}

export function ModalProducts({ selectedProduct, closeModal }: modalProps) {
  console.log(typeof selectedProduct, 'paso por UI')

  return (
    <div className='fixed inset-0 bg-gray-400/80 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            {selectedProduct != undefined ? (
              <h3 className='text-lg font-medium text-gray-900'>
                Editando el Producto...
              </h3>
            ) : (
              <h3 className='text-lg font-medium text-gray-900'>
                Agregando un Producto...
              </h3>
            )}

            <button
              onClick={closeModal}
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
  )
}
