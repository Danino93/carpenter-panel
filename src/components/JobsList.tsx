import React, { useState, useEffect } from 'react'
import { Job } from '../calculators/types'
import { getAllJobs, deleteJob } from '../services/storage'
import { formatCurrency } from '../utils/format'
import { isSupabaseAvailable } from '../services/supabase'

interface Props {
  onSelectJob: (job: Job) => void
  onNewJob: () => void
}

export const JobsList: React.FC<Props> = ({ onSelectJob, onNewJob }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadJobs()
    // עדכון כל 5 שניות (אם נפתח חלון אחר)
    const interval = setInterval(loadJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadJobs = async () => {
    const allJobs = await getAllJobs()
    setJobs(allJobs.sort((a, b) => b.updatedAt - a.updatedAt))
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('האם אתה בטוח שברצונך למחוק עבודה זו?')) {
      await deleteJob(id)
      await loadJobs()
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ''
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'draft':
        return '#9ca3af'
      case 'sent':
        return '#3b82f6'
      case 'approved':
        return '#22c55e'
      case 'completed':
        return '#10b981'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#9ca3af'
    }
  }

  const getStatusLabel = (status: Job['status']) => {
    switch (status) {
      case 'draft':
        return 'טיוטה'
      case 'sent':
        return 'נשלח'
      case 'approved':
        return 'אושר'
      case 'completed':
        return 'הושלם'
      case 'cancelled':
        return 'בוטל'
      default:
        return status
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="jobs-list-container">
      <div className="jobs-list-header">
        <div>
          <h2>📋 רשימת עבודות</h2>
          <p className="muted">כל העבודות השמורות שלך</p>
        </div>
        <button className="wizard-btn-primary" onClick={onNewJob}>
          ➕ עבודה חדשה
        </button>
      </div>

      <div className="jobs-list-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 חיפוש לפי שם, לקוח..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            הכל
          </button>
          <button
            className={`filter-btn ${filterStatus === 'draft' ? 'active' : ''}`}
            onClick={() => setFilterStatus('draft')}
          >
            טיוטות
          </button>
          <button
            className={`filter-btn ${filterStatus === 'sent' ? 'active' : ''}`}
            onClick={() => setFilterStatus('sent')}
          >
            נשלחו
          </button>
          <button
            className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            אושרו
          </button>
        </div>
      </div>

      {!isSupabaseAvailable() && (
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            fontSize: '0.9rem',
            color: '#fbbf24',
          }}
        >
          ⚠️ <strong>שימו לב:</strong> העבודות נשמרות רק בדפדפן המקומי. להגדרת מסד
          נתונים מקצועי, עיין ב-<code>DATABASE_SETUP.md</code>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="empty-jobs">
          <div className="empty-state-icon">📋</div>
          <h3>אין עבודות</h3>
          <p className="muted">
            {jobs.length === 0
              ? 'עדיין לא נוצרו עבודות. צור עבודה חדשה כדי להתחיל!'
              : 'לא נמצאו עבודות התואמות לחיפוש'}
          </p>
          {jobs.length === 0 && (
            <button className="wizard-btn-primary" onClick={onNewJob}>
              ➕ צור עבודה ראשונה
            </button>
          )}
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => onSelectJob(job)}
            >
              <div className="job-card-header">
                <div className="job-title-section">
                  <h3>{job.title || 'ללא שם'}</h3>
                  {job.customerName && (
                    <p className="job-customer">👤 {job.customerName}</p>
                  )}
                </div>
                <div
                  className="job-status-badge"
                  style={{ backgroundColor: getStatusColor(job.status) }}
                >
                  {getStatusLabel(job.status)}
                </div>
              </div>

              <div className="job-card-body">
                <div className="job-info-row">
                  <span className="job-info-label">סוג:</span>
                  <span className="job-info-value">
                    {job.projectType === 'desk' && '💻 שולחן מחשב'}
                    {job.projectType === 'cabinet' && '🚪 ארון קיר'}
                    {job.projectType === 'sideboard' && '🍽️ מזנון'}
                    {job.projectType === 'dresser' && '🛏️ שידה'}
                    {job.projectType === 'shelf' && '📚 מדף'}
                    {job.projectType === 'custom' && '✨ מותאם אישית'}
                  </span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">מידות:</span>
                  <span className="job-info-value">
                    {job.widthCm}×{job.depthCm}×{job.heightCm} ס״מ
                  </span>
                </div>
                <div className="job-info-row">
                  <span className="job-info-label">חומר:</span>
                  <span className="job-info-value">
                    {job.material === 'mdf' && 'MDF'}
                    {job.material === 'plywood' && 'סנדוויץ'}
                    {job.material === 'solid' && 'עץ מלא'}
                  </span>
                </div>
                {job.result && (
                  <div className="job-info-row highlight">
                    <span className="job-info-label">מחיר מוצע:</span>
                    <span className="job-info-value price">
                      {formatCurrency(job.result.cost.suggestedPrice)}
                    </span>
                  </div>
                )}
              </div>

              <div className="job-card-footer">
                <div className="job-date">
                  {job.completedAt && (
                    <span>הושלם: {new Date(job.completedAt).toLocaleDateString('he-IL')}</span>
                  )}
                  {!job.completedAt && <span>עודכן: {formatDate(job.updatedAt)}</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {job.status !== 'completed' && (
                    <button
                      className="job-status-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: עדכן סטטוס ל-completed
                      }}
                      title="סמן כהושלם"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="job-delete-btn"
                    onClick={(e) => handleDelete(job.id, e)}
                    title="מחק עבודה"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

