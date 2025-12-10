import React from 'react'
import { JobInput } from '../../calculators'

interface Props {
  value: JobInput
  onChange: (updates: Partial<JobInput>) => void
  onNext: () => void
  onPrev: () => void
}

export const Step2BasicInfo: React.FC<Props> = ({ value, onChange, onNext, onPrev }) => {
  const canProceed = value.title.trim().length > 0

  return (
    <div className="wizard-step-card">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">📝</div>
        <div>
          <h2 className="wizard-step-title">פרטים בסיסיים</h2>
          <p className="wizard-step-description">
            נסה לתת שם ברור לפרויקט כדי שיהיה קל לזהות אותו אחר כך
          </p>
        </div>
      </div>

      <div className="wizard-form">
        <div className="wizard-field">
          <label>
            <span className="field-icon">📋</span>
            שם הפרויקט *
          </label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="לדוגמה: שולחן מחשב לחדר עבודה"
            autoFocus
          />
          <span className="field-hint">זה השם שיופיע בכל המסמכים והצעות המחיר</span>
        </div>

        <div className="wizard-field">
          <label>
            <span className="field-icon">👤</span>
            שם הלקוח (לא חובה)
          </label>
          <input
            type="text"
            value={value.customerName ?? ''}
            onChange={(e) => onChange({ customerName: e.target.value })}
            placeholder="לדוגמה: דני כהן"
          />
          <span className="field-hint">אם יש לקוח ספציפי, זה יעזור לך לזהות את הפרויקט</span>
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn-secondary" onClick={onPrev}>
          ← חזרה
        </button>
        <button
          type="button"
          className="wizard-btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          המשך →
        </button>
      </div>
    </div>
  )
}

