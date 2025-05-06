import React, { useState } from 'react'

interface FormData {
  field1: string
  field2: string
  field3: string
}

export function Register() {
  const [formData, setFormData] = useState<FormData>({
    field1: '',
    field2: '',
    field3: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    // Aquí podrías hacer algo con los datos, como enviarlos a una API
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='p-4 space-y-4 h-vh max-w-md mx-auto'
      >
        <input
          type='text'
          name='field1'
          placeholder='Campo 1'
          value={formData.field1}
          onChange={handleChange}
          className='w-full p-2 border rounded'
        />
        <input
          type='text'
          name='field2'
          placeholder='Campo 2'
          value={formData.field2}
          onChange={handleChange}
          className='w-full p-2 border rounded'
        />
        <input
          type='text'
          name='field3'
          placeholder='Campo 3'
          value={formData.field3}
          onChange={handleChange}
          className='w-full p-2 border rounded'
        />
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
