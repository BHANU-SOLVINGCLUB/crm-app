import type { LucideIcon } from 'lucide-react'
import {
  BadgePlus,
  BarChart3,
  FolderTree,
  LayoutList,
  Package2,
  Shapes,
} from 'lucide-react'

export interface ProductCatalogRouteItem {
  path: string
  label: string
  icon: LucideIcon
}

export const productCatalogRoutes: ProductCatalogRouteItem[] = [
  { path: '/products', label: 'Product List', icon: LayoutList },
  { path: '/products/new', label: 'Add Product', icon: BadgePlus },
  { path: '/products/categories', label: 'Categories', icon: FolderTree },
  { path: '/products/brands', label: 'Brands', icon: Package2 },
  { path: '/products/variants', label: 'Variants', icon: Shapes },
  { path: '/products/reports', label: 'Reports', icon: BarChart3 },
]
