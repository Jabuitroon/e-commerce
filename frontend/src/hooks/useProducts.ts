import { useState, useEffect } from 'react'
import { Product, ModalState } from '../interfaces/interfaces'
import { DataProducts } from '../types'
import { getProducts } from '../services/getProducts'
import { deleteProductApi } from '../services/productService'
import { useAuthStore } from '../../store/auth'

export const useProducts = () => {
  const [products, setProducts] = useState<DataProducts>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Modal 1: Confirmación inicial simple
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  // Modal 2: Conflicto de Clave Foránea (Registros Vinculados)
  const [dependencyModalData, setDependencyModalData] = useState<ModalState>({
    isOpen: false,
    productId: null,
    records: [],
  })

  const token = useAuthStore((state) => state.token)

  const fetchProducts = async () => {
    const response = await getProducts()
    const [, initialData] = response
    if (initialData) setProducts(initialData)
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedProduct, isModalOpen])

  const filteredProducts = products.filter((product) =>
    product.pro_title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // PASO 1: El usuario hace clic en el ícono de basurero en la tabla
  const handleInitiateDelete = (product: Product) => {
    setProductToDelete(product) // Esto abre la Modal 1
  }

  // PASO 2: El usuario hace clic en "Sí, eliminar" dentro de la Modal 1 o confirma la eliminación forzada en la Modal 2
  const handleExecuteDelete = async (
    id: string,
    force = false,
  ): Promise<void> => {
    const result = await deleteProductApi(id, token, force)
    console.log('Resultado de la eliminación:', result)

    // Si la BD rebota con 409 (Constraint Error)
    if (result.hasDependencies && result.relatedRecords) {
      setProductToDelete(null) // Cerramos la modal simple
      setDependencyModalData({
        isOpen: true,
        productId: id,
        records: result.relatedRecords,
      }) // Abrimos la modal de dependencias
      return
    }

    if (result.success) {
      alert('Producto eliminado exitosamente')
      setProductToDelete(null)
      setDependencyModalData({ isOpen: false, productId: null, records: [] })
      fetchProducts()
    } else {
      alert(result.message || 'Error al eliminar el producto')
    }
  }

  const handleCloseDeleteModals = () => {
    setProductToDelete(null)
    setDependencyModalData({ isOpen: false, productId: null, records: [] })
  }

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    selectedProduct,
    isModalOpen,
    productToDelete,
    dependencyModalData,
    handleInitiateDelete,
    handleExecuteDelete,
    handleCloseDeleteModals,
    handleOpenAddModal: () => {
      setSelectedProduct(undefined)
      setIsModalOpen(true)
    },
    handleOpenEditModal: (product: Product) => {
      setSelectedProduct(product)
      setIsModalOpen(true)
    },
    handleCloseModal: () => {
      setIsModalOpen(false)
      setSelectedProduct(undefined)
    },
  }
}
