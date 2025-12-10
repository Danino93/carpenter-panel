import React, { useState, useEffect } from 'react'
import { JobInput } from '../../calculators'
import { validateJobInput, getErrorsForField } from '../../utils/validation'

interface Props {
  value: JobInput
  onChange: (updates: Partial<JobInput>) => void
  onNext: () => void
  onPrev: () => void
}

const toNumber = (value: string, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const Step3Dimensions: React.FC<Props> = ({ value, onChange, onNext, onPrev }) => {
  const [errors, setErrors] = useState<ReturnType<typeof validateJobInput>>([])

  useEffect(() => {
    const validationErrors = validateJobInput(value)
    setErrors(validationErrors)
  }, [value])

  const getFieldError = (field: string) => {
    return getErrorsForField(errors, field)[0]
  }

  const canProceed = errors.filter((e) => e.severity === 'error').length === 0

  return (
    <div className="wizard-step-card">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">📏</div>
        <div>
          <h2 className="wizard-step-title">מידות הפרויקט</h2>
          <p className="wizard-step-description">
            הזן את המידות החיצוניות של הפרויקט בסנטימטרים
          </p>
        </div>
      </div>

      <div className="dimensions-visual">
        <div className="dimension-box">
          <div className="dimension-label">רוחב</div>
          <div className="dimension-value">{value.widthCm} ס״מ</div>
        </div>
        <div className="dimension-box">
          <div className="dimension-label">עומק</div>
          <div className="dimension-value">{value.depthCm} ס״מ</div>
        </div>
        <div className="dimension-box">
          <div className="dimension-label">גובה</div>
          <div className="dimension-value">{value.heightCm} ס״מ</div>
        </div>
      </div>

      <div className="wizard-form">
        <div className="dimensions-grid">
          <div className="wizard-field">
            <label>
              <span className="field-icon">↔️</span>
              רוחב חיצוני (ס״מ)
            </label>
            <input
              type="number"
              min={40}
              value={value.widthCm}
              onChange={(e) => onChange({ widthCm: toNumber(e.target.value, value.widthCm) })}
              className={getFieldError('widthCm') ? 'field-error' : ''}
            />
            {getFieldError('widthCm') && (
              <span className={`field-error-message ${getFieldError('widthCm')?.severity}`}>
                {getFieldError('widthCm')?.message}
              </span>
            )}
          </div>

          <div className="wizard-field">
            <label>
              <span className="field-icon">↕️</span>
              עומק חיצוני (ס״מ)
            </label>
            <input
              type="number"
              min={40}
              value={value.depthCm}
              onChange={(e) => onChange({ depthCm: toNumber(e.target.value, value.depthCm) })}
              className={getFieldError('depthCm') ? 'field-error' : ''}
            />
            {getFieldError('depthCm') && (
              <span className={`field-error-message ${getFieldError('depthCm')?.severity}`}>
                {getFieldError('depthCm')?.message}
              </span>
            )}
          </div>

          <div className="wizard-field">
            <label>
              <span className="field-icon">⬆️</span>
              גובה חיצוני (ס״מ)
            </label>
            <input
              type="number"
              min={60}
              value={value.heightCm}
              onChange={(e) => onChange({ heightCm: toNumber(e.target.value, value.heightCm) })}
              className={getFieldError('heightCm') ? 'field-error' : ''}
            />
            {getFieldError('heightCm') && (
              <span className={`field-error-message ${getFieldError('heightCm')?.severity}`}>
                {getFieldError('heightCm')?.message}
              </span>
            )}
          </div>

          <div className="wizard-field">
            <label>
              <span className="field-icon">📐</span>
              עובי לוח (מ״מ)
            </label>
            <input
              type="number"
              min={12}
              value={value.thicknessMm}
              onChange={(e) =>
                onChange({ thicknessMm: toNumber(e.target.value, value.thicknessMm) })
              }
              className={getFieldError('thicknessMm') ? 'field-error' : ''}
            />
            {getFieldError('thicknessMm') && (
              <span className={`field-error-message ${getFieldError('thicknessMm')?.severity}`}>
                {getFieldError('thicknessMm')?.message}
              </span>
            )}
            <span className="field-hint">עוביים נפוצים: 12, 16, 18, 25, 30 מ״מ</span>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="validation-summary">
          <h4>⚠️ שימו לב:</h4>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx} className={error.severity}>
                {error.severity === 'error' ? '❌' : '⚠️'} {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

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

