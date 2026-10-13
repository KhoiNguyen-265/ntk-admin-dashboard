export type CategoryStatus = 'active' | 'inactive'

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  status: CategoryStatus
  productCount: number
  createdAt: string
  icon?: string
}

export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'productCount'>
