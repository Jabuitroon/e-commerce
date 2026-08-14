import { Package, User, SquareChartGantt } from 'lucide-react'
import { NavItem } from '../interfaces/nav'

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Orders',
    to: '/admin/orders',
    role: 'administrador',
    icon: Package,
  },
  {
    label: 'Products Manager',
    to: '/admin/products',
    role: 'administrador',
    icon: SquareChartGantt,
  },
  {
    label: 'Users Manager',
    to: '/admin/users',
    role: 'administrador',
    icon: User,
  },
  // items de 'cliente' van acá cuando los definas, ej:
  // { label: 'Mis pedidos', to: '/my-orders', role: 'cliente', icon: ShoppingCart },
]
