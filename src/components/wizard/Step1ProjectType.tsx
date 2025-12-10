import React from 'react'
import { JobInput, ProjectType } from '../../calculators'

interface Props {
  value: JobInput
  onChange: (updates: Partial<JobInput>) => void
  onNext: () => void
}

const projectOptions: {
  value: ProjectType
  label: string
  description: string
  icon: string
  color: string
}[] = [
  {
    value: 'desk',
    label: 'שולחן מחשב',
    description: 'שולחן עבודה עם מגירות ודלתות',
    icon: '💻',
    color: '#3b82f6',
  },
  {
    value: 'cabinet',
    label: 'ארון קיר',
    description: 'ארון קיר עם דלתות ומדפים',
    icon: '🚪',
    color: '#8b5cf6',
  },
  {
    value: 'sideboard',
    label: 'מזנון',
    description: 'מזנון לחדר אוכל או סלון',
    icon: '🍽️',
    color: '#ec4899',
  },
  {
    value: 'dresser',
    label: 'שידה / קומפוד',
    description: 'שידת חדר שינה או קומפוד',
    icon: '🛏️',
    color: '#f59e0b',
  },
  {
    value: 'shelf',
    label: 'מדף / ספרייה',
    description: 'מדף קיר או ספרייה',
    icon: '📚',
    color: '#10b981',
  },
  {
    value: 'custom',
    label: 'עבודה מותאמת אישית',
    description: 'פרויקט מיוחד לפי דרישה',
    icon: '✨',
    color: '#6366f1',
  },
]

export const Step1ProjectType: React.FC<Props> = ({ value, onChange, onNext }) => {
  const handleSelect = (projectType: ProjectType) => {
    onChange({ projectType })
    setTimeout(() => onNext(), 300)
  }

  return (
    <div className="wizard-step-card">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">🎯</div>
        <div>
          <h2 className="wizard-step-title">מה אתה בונה היום?</h2>
          <p className="wizard-step-description">
            בחר את סוג העבודה כדי להתאים את השאלות והחישובים
          </p>
        </div>
      </div>

      <div className="project-grid">
        {projectOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`project-card ${value.projectType === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
            style={{
              '--project-color': option.color,
            } as React.CSSProperties}
          >
            <div className="project-icon">{option.icon}</div>
            <div className="project-label">{option.label}</div>
            <div className="project-description">{option.description}</div>
            {value.projectType === option.value && (
              <div className="project-check">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

