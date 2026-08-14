import { useProducts } from '../../hooks/useProducts'
import { useProductTooltip } from '../../hooks/useProductTooltip'
import { ProductHeader } from './ProductHeader'
import { ProductTable } from './ProductTable'
import { ProductTooltip } from './ProductTooltip'
import { ModalProducts } from '../../UI/ModalProduct'
import { DeleteProductModal } from './DeleteProductModal'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'

export default function ProductManagement() {
  const {
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
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
  } = useProducts()

  const {
    hoveredProduct,
    mousePosition,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  } = useProductTooltip()

  return (
    <div className='space-y-6 p-4'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        Gestión de Productos
      </h1>
      <ProductHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddProduct={handleOpenAddModal}
      />

      <ProductTable
        products={filteredProducts}
        onEdit={handleOpenEditModal}
        onDelete={handleInitiateDelete} // Paso 1: Pasa la orden de iniciar el borrado
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Modal 1: Confirmación de borrado simple */}
      <ConfirmDeleteModal
        product={productToDelete}
        onClose={handleCloseDeleteModals}
        onConfirm={() => {
          if (productToDelete) {
            handleExecuteDelete(productToDelete.pro_id, false) // Paso 2: Ejecuta intento sin fuerza
          }
        }}
      />

      {/* Modal 2: Conflicto de Clave Foránea (Solamente se abre si el servidor devuelve HTTP 409) */}

      <DeleteProductModal
        isOpen={dependencyModalData.isOpen}
        productId={dependencyModalData.productId}
        records={dependencyModalData.records}
        onClose={handleCloseDeleteModals}
        onConfirm={() => {
          if (dependencyModalData.productId) {
            handleExecuteDelete(dependencyModalData.productId, true) // Paso 3: Borrado en cascada (force=true)
          }
        }}
      />

      {isModalOpen && (
        <ModalProducts
          selectedProduct={selectedProduct}
          closeModal={handleCloseModal}
        />
      )}

      <ProductTooltip product={hoveredProduct} position={mousePosition} />
    </div>
  )
}
