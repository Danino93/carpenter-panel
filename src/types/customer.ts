export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

