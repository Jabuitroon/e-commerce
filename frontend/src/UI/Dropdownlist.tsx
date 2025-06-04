import { useEffect, useState } from 'react'
import { Dropdown, type DropdownOption } from '../components/Dropdown'
import { categoriesRequest } from '../services/getCategories'

export function DropdownList() {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  )

  const [options, setOptions] = useState<DropdownOption[]>([])

  useEffect(() => {
    categoriesRequest().then((response) => {
      const [, initialData] = response
      console.log(initialData)

      if (initialData) {
        setOptions(initialData)
      }
    })
  }, [])

  const handleChange = (option: DropdownOption) => {
    setSelectedOption(option)
    console.log('Selected option:', option)
  }

  return (
    <>
      <div className='space-y-2'>
        <label
          htmlFor='dropdown'
          className='block text-sm font-medium text-gray-700'
        >
          Selecciona una Categoría:
        </label>
        <Dropdown
          options={options}
          placeholder='Seleccionar...'
          onChange={handleChange}
        />
      </div>

      {selectedOption && (
        <div className='mt-4 p-4 bg-gray-50 rounded-md'>
          <p className='text-sm text-gray-700'>
            Opción seleccionada:{' '}
            <span className='font-medium'>{selectedOption.cat_nombre}</span>
          </p>
          <p className='text-sm text-gray-700'>
            Descripción:{' '}
            <span className='font-medium'>
              {selectedOption.cat_descripcion}
            </span>
          </p>
          <p className='text-sm text-gray-700'>
            Valor: <span className='font-medium'>{selectedOption.cat_id}</span>
          </p>
        </div>
      )}
    </>
  )
}
