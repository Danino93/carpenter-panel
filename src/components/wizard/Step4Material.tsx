import React from 'react'
import { JobInput, MaterialType } from '../../calculators'

interface Props {
  value: JobInput
  onChange: (updates: Partial<JobInput>) => void
  onNext: () => void
  onPrev: () => void
}

const materials: {
  value: MaterialType
  label: string
  description: string
  icon: string
  color: string
}[] = [
  {
    value: 'mdf',
    label: 'MDF',
    description: 'לוח MDF - איכותי וחזק, מתאים לרוב העבודות',
    icon: '🟫',
    color: '#8b4513',
  },
  {
    value: 'plywood',
    label: 'סנדוויץ',
    description: 'לוח סנדוויץ - חזק ועמיד, מתאים לעבודות חוץ',
    icon: '🟨',
    color: '#daa520',
  },
  {
    value: 'solid',
    label: 'עץ מלא',
    description: 'עץ מלא - יוקרתי וטבעי, מחיר גבוה יותר',
    icon: '🪵',
    color: '#654321',
  },
]

export const Step4Material: React.FC<Props> = ({ value, onChange, onNext, onPrev }) => {
  return (
    <div className="wizard-step-card">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">🪵</div>
        <div>
          <h2 className="wizard-step-title">בחר חומר</h2>
          <p className="wizard-step-description">
            איזה חומר תרצה להשתמש בפרויקט הזה?
          </p>
        </div>
      </div>

      <div className="materials-grid">
        {materials.map((material) => (
          <button
            key={material.value}
            type="button"
            className={`material-card ${value.material === material.value ? 'selected' : ''}`}
            onClick={() => onChange({ material: material.value })}
            style={{
              '--material-color': material.color,
            } as React.CSSProperties}
          >
            <div className="material-icon">{material.icon}</div>
            <div className="material-label">{material.label}</div>
            <div className="material-description">{material.description}</div>
            {value.material === material.value && (
              <div className="material-check">✓</div>
            )}
          </button>
        ))}
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn-secondary" onClick={onPrev}>
          ← חזרה
        </button>
        <button type="button" className="wizard-btn-primary" onClick={onNext}>
          המשך →
        </button>
      </div>
    </div>
  )
}

