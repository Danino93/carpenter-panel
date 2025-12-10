import React from 'react'
import type { JobInput, MaterialType, ProjectType } from '../calculators'

interface Props {
  value: JobInput
  onChange: (value: JobInput) => void
  onCalculate: () => void
  isCalculating?: boolean
}

const toNumber = (value: string, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const JobForm: React.FC<Props> = ({ value, onChange, onCalculate, isCalculating = false }) => {
  const updateField = <K extends keyof JobInput>(key: K, v: JobInput[K]) => {
    onChange({ ...value, [key]: v })
  }

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateField('material', e.target.value as MaterialType)
  }

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateField('projectType', e.target.value as ProjectType)
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">פרטי עבודה בסיסיים</div>
          <div className="card-description">
            אלה השדות שהנגר ימלא מול הלקוח לפני חישוב החומרים.
          </div>
        </div>
      </div>

      <div className="field-group">
        <div className="field">
          <label>שם הפרויקט / לקוח</label>
          <input
            type="text"
            value={value.title}
            placeholder="שולחן מחשב לחדר עבודה..."
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>

        <div className="field">
          <label>שם הלקוח (לא חובה)</label>
          <input
            type="text"
            value={value.customerName ?? ''}
            placeholder="דני כהן"
            onChange={(e) => updateField('customerName', e.target.value)}
          />
        </div>

        <div className="field">
          <label>סוג עבודה</label>
          <select value={value.projectType} onChange={handleProjectTypeChange}>
            <option value="desk">שולחן מחשב</option>
          </select>
        </div>

        <div className="field">
          <label>חומר</label>
          <select value={value.material} onChange={handleMaterialChange}>
            <option value="mdf">MDF</option>
            <option value="plywood">סנדוויץ'</option>
            <option value="solid">עץ מלא</option>
          </select>
        </div>
      </div>

      <div className="field-group">
        <div className="field">
          <label>📏 רוחב חיצוני</label>
          <div className="field-with-unit" data-unit="ס״מ">
            <input
              type="number"
              min={40}
              value={value.widthCm}
              onChange={(e) => updateField('widthCm', toNumber(e.target.value, value.widthCm))}
            />
          </div>
        </div>
        <div className="field">
          <label>📏 עומק חיצוני</label>
          <div className="field-with-unit" data-unit="ס״מ">
            <input
              type="number"
              min={40}
              value={value.depthCm}
              onChange={(e) => updateField('depthCm', toNumber(e.target.value, value.depthCm))}
            />
          </div>
        </div>
        <div className="field">
          <label>📏 גובה חיצוני</label>
          <div className="field-with-unit" data-unit="ס״מ">
            <input
              type="number"
              min={60}
              value={value.heightCm}
              onChange={(e) => updateField('heightCm', toNumber(e.target.value, value.heightCm))}
            />
          </div>
        </div>
        <div className="field">
          <label>📏 עובי לוח</label>
          <div className="field-with-unit" data-unit="מ״מ">
            <input
              type="number"
              min={12}
              value={value.thicknessMm}
              onChange={(e) =>
                updateField('thicknessMm', toNumber(e.target.value, value.thicknessMm))
              }
            />
          </div>
        </div>
      </div>

      <div className="field-group">
        <div className="field">
          <label>🗄️ מספר מגירות</label>
          <input
            type="number"
            min={0}
            value={value.drawers}
            onChange={(e) => updateField('drawers', Math.max(0, Math.round(toNumber(e.target.value, value.drawers))))}
          />
        </div>

        <div className="field">
          <label>🚪 מספר דלתות</label>
          <input
            type="number"
            min={0}
            value={value.doors}
            onChange={(e) => updateField('doors', Math.max(0, Math.round(toNumber(e.target.value, value.doors))))}
          />
        </div>

        <div className="field">
          <label>גב לשולחן / ארונית</label>
          <select
            value={value.includeBackPanel ? 'yes' : 'no'}
            onChange={(e) => updateField('includeBackPanel', e.target.value === 'yes')}
          >
            <option value="yes">כן</option>
            <option value="no">לא</option>
          </select>
        </div>

        <div className="field">
          <label>קנטים לחזיתות</label>
          <select
            value={value.includeEdgeBanding ? 'yes' : 'no'}
            onChange={(e) => updateField('includeEdgeBanding', e.target.value === 'yes')}
          >
            <option value="yes">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
      </div>

      <div className="field-group">
        <div className="field">
          <label>⏱️ שעות עבודה משוערות</label>
          <div className="field-with-unit" data-unit="שעות">
            <input
              type="number"
              min={1}
              value={value.laborHours}
              onChange={(e) =>
                updateField('laborHours', Math.max(1, toNumber(e.target.value, value.laborHours)))
              }
            />
          </div>
          <span className="muted">אחר כך אפשר לחלק לפי סוגי עבודות.</span>
        </div>

        <div className="field">
          <label>הערות פנימיות (לא ללקוח)</label>
          <input
            type="text"
            value={value.notes ?? ''}
            placeholder="צבע מיוחד, דרישות מיוחדות ..."
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>
      </div>

      <button
        className={`primary ${isCalculating ? 'loading' : ''}`}
        type="button"
        onClick={onCalculate}
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
  )
}
