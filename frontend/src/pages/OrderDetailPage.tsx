import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchOrderById } from '../services/getOrders'
import { StatusBadge } from '../components/Orders/StatusBadge'
import { Order } from '../interfaces/order'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    fetchOrderById(id)
      .then((data) => {
        if (!cancelled) setOrder(data)
      })
      .catch((err) => {
        if (!cancelled && err?.response?.status === 404) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (isLoading) return <div className='p-6 text-gray-400'>Loading...</div>

  if (notFound || !order) {
    return (
      <div className='p-6'>
        <p className='text-gray-500'>Orden no encontrada.</p>
        <Link
          to='/admin/orders'
          className='text-sm text-blue-600 hover:underline'
        >
          Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <button
        onClick={() => navigate(-1)}
        className='mb-4 text-sm text-gray-500 hover:text-gray-700'
      >
        ← Volver
      </button>
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-lg font-semibold text-gray-900'>
            Orden #{order.ord_id}
          </h1>
          <StatusBadge status={order.ord_estado} />
        </div>
        <dl className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <dt className='text-gray-500'>Cliente</dt>
            <dd className='font-medium text-gray-900'>{order.customer_name}</dd>
          </div>
          <div>
            <dt className='text-gray-500'>Email</dt>
            <dd className='font-medium text-gray-900'>
              {order.customer_email}
            </dd>
          </div>
          <div>
            <dt className='text-gray-500'>Total</dt>
            <dd className='font-medium text-gray-900'>${order.ord_total}</dd>
          </div>
          <div>
            <dt className='text-gray-500'>Fecha límite</dt>
            <dd className='font-medium text-gray-900'>
              {order.ord_expira_en ?? '—'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
