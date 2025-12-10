import React from 'react'
import { JobInput } from '../../calculators'

interface Props {
  value: JobInput
  onChange: (updates: Partial<JobInput>) => void
  onNext: () => void
  onPrev: () => void
}

const toNumber = (value: string, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

export const Step5Features: React.FC<Props> = ({ value, onChange, onNext, onPrev }) => {
  return (
    <div className="wizard-step-card">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">⚙️</div>
        <div>
          <h2 className="wizard-step-title">תכונות נוספות</h2>
          <p className="wizard-step-description">
            מה עוד צריך להוסיף לפרויקט?
          </p>
        </div>
      </div>

      <div className="wizard-form">
        <div className="features-grid">
          <div className="wizard-field">
            <label>
              <span className="field-icon">🗄️</span>
              מספר מגירות
            </label>
            <input
              type="number"
              min={0}
              value={value.drawers}
              onChange={(e) =>
                onChange({ drawers: Math.max(0, Math.round(toNumber(e.target.value, value.drawers))) })
              }
            />
          </div>

          <div className="wizard-field">
            <label>
              <span className="field-icon">🚪</span>
              מספר דלתות
            </label>
            <input
              type="number"
              min={0}
              value={value.doors}
              onChange={(e) =>
                onChange({ doors: Math.max(0, Math.round(toNumber(e.target.value, value.doors))) })
              }
            />
          </div>
        </div>

        <div className="features-options">
          <label className="feature-toggle">
            <input
              type="checkbox"
              checked={value.includeBackPanel}
              onChange={(e) => onChange({ includeBackPanel: e.target.checked })}
            />
            <span className="feature-toggle-label">
              <span className="field-icon">🔲</span>
              גב לשולחן / ארונית
            </span>
          </label>

          <label className="feature-toggle">
            <input
              type="checkbox"
              checked={value.includeEdgeBanding}
              onChange={(e) => onChange({ includeEdgeBanding: e.target.checked })}
            />
            <span className="feature-toggle-label">
              <span className="field-icon">🎨</span>
              קנטים לחזיתות
            </span>
          </label>
        </div>

        <div className="wizard-field">
          <label>
            <span className="field-icon">📝</span>
            הערות פנימיות (לא ללקוח)
          </label>
          <input
            type="text"
            value={value.notes ?? ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="צבע מיוחד, דרישות מיוחדות..."
          />
        </div>
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

