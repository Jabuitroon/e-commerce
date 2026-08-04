import React from 'react'
import { RelatedOrder } from '../../interfaces/interfaces'

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
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h3>Atención: Registro en uso</h3>
        <p>
          El producto <strong>{productId}</strong> está asociado a los
          siguientes <strong>{records.length}</strong> registro(s) de detalle:
        </p>

        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID Detalle</th>
                <th>ID Órden</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.odt_id}>
                  <td>{item.odt_id}</td>
                  <td>{item.odt_id_orden}</td>
                  <td>{item.odt_cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='warning-text'>
          ¿Deseas eliminar permanentemente estos registros vinculados junto con
          el producto?
        </p>

        <div className='modal-actions'>
          <button type='button' onClick={onClose} className='btn-cancel'>
            Cancelar
          </button>
          <button type='button' onClick={onConfirm} className='btn-danger'>
            Sí, eliminar todo
          </button>
        </div>
      </div>
    </div>
  )
}
