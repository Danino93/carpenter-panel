import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Wizard } from './components/Wizard'
import { JobsList } from './components/JobsList'
import { AuthGuard } from './components/Auth/AuthGuard'
import { calculateJob, JobInput, JobResult } from './calculators'
import { Job } from './calculators/types'
import { saveJob, createJobFromInput } from './services/storage'

// Lazy loading למסכים גדולים
const PricingManager = lazy(() => import('./components/PricingManager').then(m => ({ default: m.PricingManager })))
const CustomersManager = lazy(() => import('./components/CustomersManager').then(m => ({ default: m.CustomersManager })))
const TemplatesManager = lazy(() => import('./components/TemplatesManager').then(m => ({ default: m.TemplatesManager })))
const Reports = lazy(() => import('./components/Reports').then(m => ({ default: m.Reports })))

type AppView = 'jobs' | 'wizard' | 'settings' | 'pricing' | 'customers' | 'templates' | 'reports'

const createDefaultJob = (): JobInput => ({
  projectType: 'desk',
  title: '',
  customerName: '',
  widthCm: 140,
  depthCm: 60,
  heightCm: 75,
  material: 'mdf',
  thicknessMm: 18,
  drawers: 3,
  doors: 0,
  includeBackPanel: true,
  includeEdgeBanding: true,
  laborHours: 6,
  notes: '',
})

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('jobs')
  const [currentJob, setCurrentJob] = useState<JobInput>(createDefaultJob())
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [result, setResult] = useState<JobResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleNewJob = () => {
    setCurrentJob(createDefaultJob())
    setEditingJob(null)
    setResult(null)
    setCurrentView('wizard')
  }

  const handleSelectJob = (job: Job) => {
    setCurrentJob({
      projectType: job.projectType,
      title: job.title,
      customerName: job.customerName,
      widthCm: job.widthCm,
      depthCm: job.depthCm,
      heightCm: job.heightCm,
      material: job.material,
      thicknessMm: job.thicknessMm,
      drawers: job.drawers,
      doors: job.doors,
      includeBackPanel: job.includeBackPanel,
      includeEdgeBanding: job.includeEdgeBanding,
      laborHours: job.laborHours,
      notes: job.notes,
    })
    setEditingJob(job)
    setResult(job.result || null)
    setCurrentView('wizard')
  }

  const handleJobChange = async (job: JobInput) => {
    setCurrentJob(job)
    // שמירה אוטומטית
    if (editingJob) {
      const updatedJob: Job = {
        ...editingJob,
        ...job,
        updatedAt: Date.now(),
      }
      await saveJob(updatedJob)
      setEditingJob(updatedJob)
    }
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    setTimeout(async () => {
      try {
        const res = calculateJob(currentJob)
        setResult(res)
        
        // שמירה אוטומטית אחרי חישוב
        if (editingJob) {
          const updatedJob: Job = {
            ...editingJob,
            ...currentJob,
            result: res,
            updatedAt: Date.now(),
          }
          await saveJob(updatedJob)
          setEditingJob(updatedJob)
        } else {
          // יצירת עבודה חדשה
          const newJob = createJobFromInput(currentJob, res)
          await saveJob(newJob)
          setEditingJob(newJob)
        }
      } catch (err) {
        console.error(err)
        alert('ארעה שגיאה בזמן החישוב. בדוק את הערכים ונסה שוב.')
      } finally {
        setIsCalculating(false)
      }
    }, 300)
  }

  const handleBackToJobs = () => {
    setCurrentView('jobs')
    setEditingJob(null)
    setResult(null)
  }

  return (
    <AuthGuard>
      <div className="app-shell">
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/logo.svg" alt="לוגו" style={{ width: '48px', height: '48px' }} />
            <div>
              <div className="app-title">פאנל נגרות • מחשבון חומרים ליוסף חיים הגבר</div>
              <div className="app-subtitle">
                מערכת מתקדמת לחישוב חומרים והצעת מחיר לנגרים ליוסף חיים הגבר
              </div>
            </div>
          </div>
          <span className="badge">Professional • V3</span>
        </header>

      {currentView === 'jobs' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button active"
              onClick={() => setCurrentView('jobs')}
            >
              📋 עבודות
            </button>
            <button
              className="nav-button"
              onClick={handleNewJob}
            >
              ➕ עבודה חדשה
            </button>
            <button
              className="nav-button"
              onClick={() => setCurrentView('customers')}
            >
              👥 לקוחות
            </button>
            <button
              className="nav-button"
              onClick={() => setCurrentView('pricing')}
            >
              💰 מחירון
            </button>
            <button
              className="nav-button"
              onClick={() => setCurrentView('templates')}
            >
              📋 תבניות
            </button>
            <button
              className="nav-button"
              onClick={() => setCurrentView('reports')}
            >
              📊 דוחות
            </button>
            <button
              className="nav-button"
              onClick={() => setCurrentView('settings')}
            >
              ⚙️ הגדרות
            </button>
          </div>
          <JobsList onSelectJob={handleSelectJob} onNewJob={handleNewJob} />
        </>
      )}

      {currentView === 'customers' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button"
              onClick={() => setCurrentView('jobs')}
            >
              ← חזרה
            </button>
            <button className="nav-button active">👥 לקוחות</button>
          </div>
          <Suspense fallback={<div className="loading-state">טוען...</div>}>
            <CustomersManager
              onSelectCustomer={(customer) => {
                setCurrentJob({ ...currentJob, customerName: customer.name })
                setCurrentView('wizard')
              }}
            />
          </Suspense>
        </>
      )}

      {currentView === 'pricing' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button"
              onClick={() => setCurrentView('jobs')}
            >
              ← חזרה
            </button>
            <button className="nav-button active">💰 מחירון</button>
          </div>
          <Suspense fallback={<div className="loading-state">טוען...</div>}>
            <PricingManager />
          </Suspense>
        </>
      )}

      {currentView === 'templates' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button"
              onClick={() => setCurrentView('jobs')}
            >
              ← חזרה
            </button>
            <button className="nav-button active">📋 תבניות</button>
          </div>
          <Suspense fallback={<div className="loading-state">טוען...</div>}>
            <TemplatesManager
              currentJob={currentView === 'templates' ? currentJob : undefined}
              onSelectTemplate={(template) => {
                setCurrentJob(template.jobInput)
                setEditingJob(null)
                setResult(null)
                setCurrentView('wizard')
              }}
            />
          </Suspense>
        </>
      )}

      {currentView === 'reports' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button"
              onClick={() => setCurrentView('jobs')}
            >
              ← חזרה
            </button>
            <button className="nav-button active">📊 דוחות</button>
          </div>
          <Suspense fallback={<div className="loading-state">טוען...</div>}>
            <Reports />
          </Suspense>
        </>
      )}

      {currentView === 'wizard' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button"
              onClick={handleBackToJobs}
            >
              ← חזרה לרשימה
            </button>
            <button className="nav-button active">
              ✏️ {editingJob ? 'עריכת עבודה' : 'עבודה חדשה'}
            </button>
          </div>
      <Wizard
        initialJob={currentJob}
        onJobChange={handleJobChange}
        result={result}
        isCalculating={isCalculating}
        onCalculate={handleCalculate}
        currentJob={editingJob || undefined}
      />
        </>
      )}

      {currentView === 'settings' && (
        <>
          <div className="app-navigation">
            <button
              className="nav-button"
              onClick={() => setCurrentView('jobs')}
            >
              ← חזרה
            </button>
            <button className="nav-button active">⚙️ הגדרות</button>
          </div>
          <div className="wizard-step-card">
            <h2>⚙️ הגדרות</h2>
            <p className="muted">מסך הגדרות יגיע בקרוב...</p>
          </div>
        </>
      )}
      </div>
    </AuthGuard>
  )
}

export default App
