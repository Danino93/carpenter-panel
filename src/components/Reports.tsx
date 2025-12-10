import React, { useState, useEffect } from 'react'
import { Job } from '../calculators/types'
import { getAllJobs } from '../services/storage'
import { formatCurrency, formatNumber } from '../utils/format'

export const Reports: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'quarter' | 'year'>('all')

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    const allJobs = await getAllJobs()
    setJobs(allJobs)
  }

  const getFilteredJobs = () => {
    const now = Date.now()
    const filters = {
      all: () => true,
      month: (job: Job) => now - job.createdAt < 30 * 24 * 60 * 60 * 1000,
      quarter: (job: Job) => now - job.createdAt < 90 * 24 * 60 * 60 * 1000,
      year: (job: Job) => now - job.createdAt < 365 * 24 * 60 * 60 * 1000,
    }
    return jobs.filter(filters[timeRange])
  }

  const filteredJobs = getFilteredJobs()

  // סטטיסטיקות כלליות
  const totalJobs = filteredJobs.length
  const completedJobs = filteredJobs.filter((j) => j.status === 'completed').length
  const draftJobs = filteredJobs.filter((j) => j.status === 'draft').length
  const sentJobs = filteredJobs.filter((j) => j.status === 'sent').length
  const approvedJobs = filteredJobs.filter((j) => j.status === 'approved').length

  // סטטיסטיקות כספיות
  const totalRevenue = filteredJobs.reduce((sum, job) => {
    return sum + (job.result?.cost.suggestedPrice || 0)
  }, 0)

  const completedRevenue = filteredJobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, job) => {
      return sum + (job.result?.cost.suggestedPrice || 0)
    }, 0)

  const averageJobPrice = totalJobs > 0 ? totalRevenue / totalJobs : 0

  // סטטיסטיקות לפי סוג עבודה
  const jobsByType = filteredJobs.reduce((acc, job) => {
    acc[job.projectType] = (acc[job.projectType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // סטטיסטיקות לפי חומר
  const jobsByMaterial = filteredJobs.reduce((acc, job) => {
    acc[job.material] = (acc[job.material] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // עבודות לפי חודש (לאחרונה)
  const jobsByMonth = filteredJobs.reduce((acc, job) => {
    const date = new Date(job.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    acc[monthKey] = (acc[monthKey] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // לקוחות הכי פעילים
  const customersActivity = filteredJobs.reduce((acc, job) => {
    if (job.customerName) {
      acc[job.customerName] = (acc[job.customerName] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topCustomers = Object.entries(customersActivity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>📊 דוחות וסטטיסטיקות</h2>
        <div className="time-range-selector">
          <button
            className={`time-range-btn ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            הכל
          </button>
          <button
            className={`time-range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            חודש אחרון
          </button>
          <button
            className={`time-range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
            onClick={() => setTimeRange('quarter')}
          >
            רבעון
          </button>
          <button
            className={`time-range-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            שנה
          </button>
        </div>
      </div>

      {/* סטטיסטיקות כלליות */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">סה״כ עבודות</div>
            <div className="stat-value">{totalJobs}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">הושלמו</div>
            <div className="stat-value">{completedJobs}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-label">טיוטות</div>
            <div className="stat-value">{draftJobs}</div>
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">סה״כ הכנסות (משוער)</div>
            <div className="stat-value">{formatCurrency(completedRevenue)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">ממוצע לעבודה</div>
            <div className="stat-value">{formatCurrency(averageJobPrice)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-label">נשלחו</div>
            <div className="stat-value">{sentJobs}</div>
          </div>
        </div>
      </div>

      {/* עבודות לפי סוג */}
      <div className="report-section">
        <h3>עבודות לפי סוג</h3>
        <div className="chart-container">
          {Object.entries(jobsByType).map(([type, count]) => {
            const percentage = totalJobs > 0 ? (count / totalJobs) * 100 : 0
            const typeLabels: Record<string, string> = {
              desk: 'שולחן',
              cabinet: 'ארון',
              sideboard: 'שידה',
              dresser: 'קומדייה',
              shelf: 'מדף',
              custom: 'מותאם אישית',
            }
            return (
              <div key={type} className="chart-bar-item">
                <div className="chart-bar-label">
                  <span>{typeLabels[type] || type}</span>
                  <span className="chart-bar-value">{count}</span>
                </div>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="chart-bar-percentage">{formatNumber(percentage)}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* עבודות לפי חומר */}
      <div className="report-section">
        <h3>עבודות לפי חומר</h3>
        <div className="chart-container">
          {Object.entries(jobsByMaterial).map(([material, count]) => {
            const percentage = totalJobs > 0 ? (count / totalJobs) * 100 : 0
            const materialLabels: Record<string, string> = {
              mdf: 'MDF',
              plywood: 'סנדוויץ',
              solid: 'עץ מלא',
            }
            return (
              <div key={material} className="chart-bar-item">
                <div className="chart-bar-label">
                  <span>{materialLabels[material] || material}</span>
                  <span className="chart-bar-value">{count}</span>
                </div>
                <div className="chart-bar">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="chart-bar-percentage">{formatNumber(percentage)}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* לקוחות הכי פעילים */}
      {topCustomers.length > 0 && (
        <div className="report-section">
          <h3>לקוחות הכי פעילים</h3>
          <div className="customers-list">
            {topCustomers.map(([customer, count]) => (
              <div key={customer} className="customer-stat-item">
                <span className="customer-name">{customer}</span>
                <span className="customer-count">{count} עבודות</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* עבודות לפי חודש */}
      {Object.keys(jobsByMonth).length > 0 && (
        <div className="report-section">
          <h3>עבודות לפי חודש</h3>
          <div className="monthly-stats">
            {Object.entries(jobsByMonth)
              .sort()
              .slice(-6)
              .map(([month, count]) => {
                const [year, monthNum] = month.split('-')
                const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('he-IL', {
                  month: 'long',
                  year: 'numeric',
                })
                return (
                  <div key={month} className="month-stat-item">
                    <span className="month-name">{monthName}</span>
                    <span className="month-count">{count} עבודות</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>אין נתונים להצגה</h3>
          <p>צור עבודות כדי לראות סטטיסטיקות</p>
        </div>
      )}
    </div>
  )
}

