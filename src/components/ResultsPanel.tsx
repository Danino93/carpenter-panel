import React from 'react'
import type { JobResult } from '../calculators'
import { JobInput } from '../calculators'
import { formatCurrency, formatNumber } from '../utils/format'

interface Props {
  result: JobResult | null
  input: JobInput
}

export const ResultsPanel: React.FC<Props> = ({ result, input }) => {
  if (!result) {
    return (
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📊 תוצאות החישוב</div>
            <div className="card-description">
              אחרי שתמלא את הטופס ותלחץ &quot;לחשב&quot; – פה תופיע רשימת החומרים
              והעלות.
            </div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📐</div>
          <div className="muted">
            אפשר לחשוב על זה כ&quot;פתק עבודה&quot; לנגר – ובשלב הבא PDF ללקוח.
          </div>
        </div>
      </div>
    )
  }

  const { pieces, hardware, cost } = result

  return (
    <div className="card results-enter">
      <div className="card-header">
        <div>
          <div className="card-title">📊 חומרים ועלויות</div>
          <div className="card-description">
            זה חישוב ראשון בלבד – הנגר תמיד יכול לשנות ולהתאים ידנית.
          </div>
        </div>
        <span className="tag">טיוטה לחישוב</span>
      </div>

      <section>
        <h3>📋 סיכום מהיר</h3>
        <div className="pill-row">
          <span className="pill">פרויקט: {input.title || 'ללא שם'}</span>
          {input.customerName && <span className="pill">לקוח: {input.customerName}</span>}
          <span className="pill">
            מידות: {input.widthCm}×{input.depthCm}×{input.heightCm} ס״מ
          </span>
          <span className="pill">מגירות: {input.drawers}</span>
          <span className="pill">דלתות: {input.doors}</span>
        </div>
      </section>

      <section style={{ marginTop: 10 }}>
        <h3>✂️ רשימת חיתוכים</h3>
        <div className="muted">כל המידות בסנטימטרים.</div>
        <div style={{ maxHeight: 220, overflow: 'auto', marginTop: 4 }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>שם חלק</th>
                <th>רוחב</th>
                <th>גובה</th>
                <th>עובי</th>
                <th>כמות</th>
                <th>קנטים</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p, idx) => (
                <tr key={p.id + idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{formatNumber(p.widthCm)}</td>
                  <td>{formatNumber(p.heightCm)}</td>
                  <td>{formatNumber(p.thicknessMm)}</td>
                  <td><strong>{p.quantity}</strong></td>
                  <td>{p.edgeBandSides ? `${p.edgeBandSides} צדדים` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 10 }}>
        <h3>🔧 פרזול ותזכורות</h3>
        <div style={{ maxHeight: 150, overflow: 'auto', marginTop: 4 }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>פריט</th>
                <th>כמות</th>
                <th>יחידה</th>
                <th>הערות</th>
              </tr>
            </thead>
            <tbody>
              {hardware.map((h, idx) => (
                <tr key={h.id + idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{h.name}</strong></td>
                  <td><strong>{h.quantity}</strong></td>
                  <td>{h.unit}</td>
                  <td>{h.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 10 }}>
        <h3>💰 כסף</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <div className="cost-card">
            <div className="cost-label">עלות לוחות (כולל קנטים)</div>
            <div className="cost-value">{formatCurrency(cost.panelsCost)}</div>
          </div>
          <div className="cost-card">
            <div className="cost-label">עלות פרזול</div>
            <div className="cost-value">{formatCurrency(cost.hardwareCost)}</div>
          </div>
          <div className="cost-card">
            <div className="cost-label">עלות עבודה</div>
            <div className="cost-value">{formatCurrency(cost.laborCost)}</div>
          </div>
          <div className="cost-card">
            <div className="cost-label">עלות כוללת (לפני רווח)</div>
            <div className="cost-value">{formatCurrency(cost.totalCost)}</div>
          </div>
          <div className="cost-card highlight" style={{ gridColumn: '1 / -1' }}>
            <div className="cost-label">הצעה מומלצת ללקוח (כולל רווח)</div>
            <div className="cost-value" style={{ fontSize: '1.5rem' }}>
              {formatCurrency(cost.suggestedPrice)}
            </div>
          </div>
        </div>
        <div className="muted" style={{ marginTop: 4 }}>
          חשוב: זה חישוב פתיחה. תמיד להשאיר לעצמך מקום לשינוי ידני לפי ניסיון בפועל.
        </div>
      </section>
    </div>
  )
}
