import { Customer } from '../types/customer'

const STORAGE_KEY = 'carpenter_panel_customers'

export function getAllCustomers(): Customer[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCustomer(customer: Customer): void {
  const customers = getAllCustomers()
  const existingIndex = customers.findIndex((c) => c.id === customer.id)

  if (existingIndex >= 0) {
    customers[existingIndex] = { ...customer, updatedAt: Date.now() }
  } else {
    customers.push({ ...customer, updatedAt: Date.now() })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

export function getCustomerById(id: string): Customer | null {
  const customers = getAllCustomers()
  return customers.find((c) => c.id === id) || null
}

export function deleteCustomer(id: string): void {
  const customers = getAllCustomers()
  const filtered = customers.filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
  return {
    ...data,
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function generateId(): string {
  return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

