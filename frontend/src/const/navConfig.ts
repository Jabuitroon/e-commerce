import { Package, User } from 'lucide-react'
import { NavItem } from '../interfaces/nav'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Orders', to: '/admin/orders', role: 'administrador', icon: Package },
  { label: 'Profile', to: '/profile', role: 'administrador', icon: User },
  // items de 'cliente' van acá cuando los definas, ej:
  // { label: 'Mis pedidos', to: '/my-orders', role: 'cliente', icon: ShoppingCart },
]