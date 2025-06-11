import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { categoriesRequest } from '../services/getCategories'
import { Dropdown, DropdownOption } from './Dropdown'

import { Product } from '../../../packages/types'
import { updateProduct } from '../services/updateProduct'
import { addProduct } from '../services/addProduct'

export interface ProductFormProps {
  product?: Product
}

export interface ProductForm {
  id: string
  name: string
  image: string
  ratingstar: string
  global_ratings?: string
  bought_in_past_month?: string
  symbol: string
  price: string
  is_prime?: string
  is_climate_pledge_friendly?: string
  is_best_seller?: string
  is_sponsored?: string
  is_limited_time_deal?: string
  originalPrice?: string
  sale?: string
  idcategory: string
  category: string
  stock: string
}

export default function UseProductManager({ product }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: product
      ? {
          id: product.pro_id,
          name: product.pro_title,
          image: product.pro_image,
          ratingstar: product.pro_star_rating,
          global_ratings: product.pro_global_ratings,
          bought_in_past_month: product.pro_bought_in_past_month,
          symbol: product.pro_price_symbol,
          price: product.pro_price,
          is_prime: product.pro_is_prime,
          is_best_seller: product.pro_is_best_seller,
          sale: product.pro_sale,
          idcategory: product.cat_id,
          stock: product.pro_stock,
        }
      : undefined,
  })

  const [options, setOptions] = useState<DropdownOption[]>([])
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  )

  const handleChange = (option: DropdownOption) => {
    setSelectedOption(option)
    console.log('Selected option:', option)
  }

  useEffect(() => {
    categoriesRequest().then((response) => {
      const [, initialData] = response
      console.log(initialData)

      if (initialData) {
        setOptions(initialData)
      }
    })
  }, [])

  useEffect(() => {
    setValue('idcategory', String(selectedOption?.cat_id))
    setValue('category', String(selectedOption?.cat_nombre))
  }, [selectedOption])

  async function onSubmit(data: ProductForm) {
    console.log(typeof product, product)

    if (product) {
      await updateProduct(data).then((response) => {
        const { msg, id } = response
        // Abstraer numero de filas afectadas para poner un condicional y decidir un mensaje
        const str = `${msg} con identificador ${id}`
        setFormMsg(str)
      })
    }
    if (product == undefined) {
      await addProduct(data).then((response) => {
        const { msg, id } = response
        // Abstraer numero de filas afectadas para poner un condicional y decidir un mensaje
        const str = `${msg} con identificador ${id}`
        setFormMsg(str)
      })
    }
  }

  const [formMsg, setFormMsg] = useState('')
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Campo Nombre */}
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Nombre del Producto *
          </label>
          <input
            type='text'
            id='name'
            {...register('name', {
              required: 'Se requiere un nombre de producto',
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Ej: Laptop HP Pavilion'
          />
          {errors.name && (
            <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
          )}
        </div>

        {/* Campo Imagen */}
        <div>
          <label
            htmlFor='image'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            URL de la Imagen *
          </label>
          <input
            type='url'
            id='image'
            {...register('image', {
              required: 'Se requiere el link de una imagen',
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='https://ejemplo.com/imagen.jpg'
          />
          {errors.image && (
            <p className='text-red-500 text-xs mt-1'>{errors.image.message}</p>
          )}
        </div>

        {/* Campo Precio */}
        <label
          htmlFor='symbol'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Precio
        </label>
        <div className='flex'>
          <div className='flex justify-center items-center'>
            <select className='text-center' {...register('symbol')}>
              <option value=''>
                {product ? product.pro_price_symbol : 'Symbol*...'}
              </option>
              <option value='$'>$</option>
              <option value='€'>€</option>
            </select>
          </div>

          <input
            type='number'
            id='price'
            {...register('price', {
              required: 'Se requiere un precio',
            })}
            step='0.01'
            min='0'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='99.99'
          />
          {errors.price && (
            <p className='text-red-500 text-xs mt-1'>{errors.price.message}</p>
          )}
        </div>

        {/* Campo Categoría */}
        {!product && (
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
        )}

        {selectedOption && (
          <div className='mt-4 p-4 bg-gray-50 rounded-md'>
            <p className='text-sm text-gray-700'>
              Opción seleccionada:{' '}
              <span className='font-medium'>{selectedOption.cat_nombre}</span>
            </p>
            <p className='text-sm text-gray-700'>
              Identificador:{' '}
              <span className='font-medium'>{selectedOption.cat_id}</span>
            </p>
            <p className='text-sm text-gray-700'>
              Descripción:{' '}
              <span className='font-medium'>
                {selectedOption.cat_descripcion}
              </span>
            </p>
          </div>
        )}

        {/* Campo Stock */}
        <label
          htmlFor='stock'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Stock
        </label>
        <div>
          <input
            type='number'
            id='stock'
            {...register('stock', {
              required: 'Se requiere un stock inicial',
            })}
            step='1'
            min='0'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='400'
          />
          {errors.stock && (
            <p className='text-red-500 text-xs mt-1'>{errors.stock.message}</p>
          )}
        </div>

        {/* Rating */}
        <label
          htmlFor='rating'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Valoración (0 a 5 Estrellas)
        </label>
        <div>
          <input
            type='number'
            id='ratingstar'
            {...register('ratingstar', {
              required: 'Se requiere una valoración inicial',
            })}
            step='0.1'
            min='0'
            max='5'
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.ratingstar ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='4.8'
          />
          {errors.ratingstar && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.ratingstar.message}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className='flex gap-3 justify-end pt-4'>
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
          >
            {product? 'Actualizar Producto':'Aceptar'}
          </button>
        </div>
      </form>
      <div>{formMsg}</div>
    </>
  )
}
