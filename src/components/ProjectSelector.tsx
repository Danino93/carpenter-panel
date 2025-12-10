import React from 'react'
import type { ProjectType } from '../calculators'

interface Props {
  value: ProjectType
  onChange: (value: ProjectType) => void
}

const options: { value: ProjectType; label: string; description: string }[] = [
  {
    value: 'desk',
    label: 'שולחן מחשב',
    description: 'פלטה עליונה, רגליים, מגירות ודלתות לפי בחירה',
  },
]

export const ProjectSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">סוג עבודה</div>
          <div className="card-description">
            בחר מה אתה בונה כדי שיתאים את השאלות והחישוב.
          </div>
        </div>
        <span className="tag">גרסת בסיס • V1</span>
      </div>
      <div className="pill-row">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="secondary"
            onClick={() => onChange(opt.value)}
            style={{
              borderColor: value === opt.value ? '#22c55e' : undefined,
              background:
                value === opt.value ? 'rgba(34,197,94,0.15)' : undefined,
            }}
          >
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        בעתיד אפשר להוסיף: ארונות קיר, מזנונים, שידות ועוד.
      </div>
    </div>
  )
}
