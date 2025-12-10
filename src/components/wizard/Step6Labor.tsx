import React from 'react'
import { JobInput } from '../../calculators'

interface Props {
  value: JobInput
  onChange: (updates: Partial<JobInput>) => void
  onNext: () => void
  onPrev: () => void
  onCalculate: () => void
  isCalculating: boolean
}

const toNumber = (value: string, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const Step6Labor: React.FC<Props> = ({
  value,
  onChange,
  onNext,
  onPrev,
  onCalculate,
  isCalculating,
}) => {
  const handleCalculate = () => {
    onCalculate()
    setTimeout(() => onNext(), 500)
  }

  return (
    <div className="wizard-step-card">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">🔨</div>
        <div>
          <h2 className="wizard-step-title">שעות עבודה</h2>
          <p className="wizard-step-description">
            כמה שעות עבודה משוערות נדרשות לפרויקט הזה?
          </p>
        </div>
      </div>

      <div className="wizard-form">
        <div className="wizard-field">
          <label>
            <span className="field-icon">⏱️</span>
            שעות עבודה משוערות
          </label>
          <input
            type="number"
            min={1}
            value={value.laborHours}
            onChange={(e) =>
              onChange({ laborHours: Math.max(1, toNumber(e.target.value, value.laborHours)) })
            }
          />
          <span className="field-hint">
            אחר כך אפשר לחלק לפי סוגי עבודות (חיתוך, הרכבה, ליטוש וכו')
          </span>
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn-secondary" onClick={onPrev}>
          ← חזרה
        </button>
        <button
          type="button"
          className="wizard-btn-primary wizard-btn-calculate"
          onClick={handleCalculate}
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <span className="spinner"></span>
              מחשב...
            </>
          ) : (
            <>
              💰 לחשב חומרים והצעת מחיר
            </>
          )}
        </button>
      </div>
    </div>
  )
}

