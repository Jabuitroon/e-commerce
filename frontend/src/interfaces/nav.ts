import type { ComponentType } from 'react'

export type AppRole = 'cliente' | 'administrador'

export interface NavItem {
  label: string
  to: string
  role: AppRole
  icon?: ComponentType<{ className?: string }>
}