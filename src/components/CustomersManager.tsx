import React, { useState, useEffect } from 'react'
import { Customer } from '../types/customer'
import {
  getAllCustomers,
  saveCustomer,
  deleteCustomer,
  createCustomer,
} from '../services/customers'
import { getAllJobs } from '../services/storage'

export const CustomersManager: React.FC<{
  onSelectCustomer?: (customer: Customer) => void
}> = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  useEffect(() => {
    loadCustomers()
    loadJobs()
  }, [])

  const loadJobs = async () => {
    const allJobs = await getAllJobs()
    setJobs(allJobs)
  }

  const loadCustomers = () => {
    const allCustomers = getAllCustomers()
    setCustomers(allCustomers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('שם הלקוח הוא חובה')
      return
    }

    if (editingCustomer) {
      const updated = {
        ...editingCustomer,
        ...formData,
        updatedAt: Date.now(),
      }
      saveCustomer(updated)
    } else {
      const newCustomer = createCustomer(formData)
      saveCustomer(newCustomer)
    }

    loadCustomers()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    })
    setEditingCustomer(null)
    setShowForm(false)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      notes: customer.notes || '',
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק את הלקוח הזה?')) {
      deleteCustomer(id)
      loadCustomers()
    }
  }

  const getCustomerJobsCount = (customerName: string) => {
    return jobs.filter((job) => job.customerName === customerName).length
  }

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="customers-manager-container">
      <div className="customers-manager-header">
        <div>
          <h2>👥 ניהול לקוחות</h2>
          <p className="muted">נהל את רשימת הלקוחות שלך</p>
        </div>
        <button
          type="button"
          className="wizard-btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          ➕ לקוח חדש
        </button>
      </div>

      {showForm && (
        <div className="customer-form-card">
          <h3>{editingCustomer ? 'ערוך לקוח' : 'לקוח חדש'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="wizard-field">
              <label>שם הלקוח *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="wizard-field">
              <label>טלפון</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="wizard-field">
              <label>אימייל</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="wizard-field">
              <label>כתובת</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="wizard-field">
              <label>הערות</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="wizard-actions">
              <button
                type="button"
                className="wizard-btn-secondary"
                onClick={resetForm}
              >
                ביטול
              </button>
              <button type="submit" className="wizard-btn-primary">
                {editingCustomer ? 'עדכן' : 'שמור'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="customers-search">
        <input
          type="text"
          placeholder="חפש לקוח..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="customers-grid">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>אין לקוחות</h3>
            <p>הוסף לקוח חדש כדי להתחיל</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const jobsCount = getCustomerJobsCount(customer.name)
            return (
              <div key={customer.id} className="customer-card">
                <div className="customer-card-header">
                  <h3>{customer.name}</h3>
                  <div className="customer-actions">
                    {onSelectCustomer && (
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onSelectCustomer(customer)}
                        title="בחר לקוח"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleEdit(customer)}
                      title="ערוך"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="btn-icon delete"
                      onClick={() => handleDelete(customer.id)}
                      title="מחק"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="customer-card-body">
                  {customer.phone && (
                    <div className="customer-info">
                      <span className="info-label">📞 טלפון:</span>
                      <span className="info-value">{customer.phone}</span>
                    </div>
                  )}
                  {customer.email && (
                    <div className="customer-info">
                      <span className="info-label">📧 אימייל:</span>
                      <span className="info-value">{customer.email}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="customer-info">
                      <span className="info-label">📍 כתובת:</span>
                      <span className="info-value">{customer.address}</span>
                    </div>
                  )}
                  <div className="customer-info">
                    <span className="info-label">📋 עבודות:</span>
                    <span className="info-value highlight">{jobsCount} עבודות</span>
                  </div>
                  {customer.notes && (
                    <div className="customer-notes">
                      <strong>הערות:</strong> {customer.notes}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

