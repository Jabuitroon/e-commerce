import { useAuthStore } from '../../store/auth'
import ProductManagement from './ProductManager'

export const Profile = () => {
  const logout = useAuthStore((state) => state.logout)

  return (
    <>
      <h1>Perfil administrador</h1>
      <main className='container mx-auto py-8 px-4 max-w-7xl'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Gestión de Productos
        </h1>
        <ProductManagement />
      </main>
      <button onClick={logout}>logout</button>
    </>
  )
}
