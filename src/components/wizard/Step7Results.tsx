import React from 'react'
import { JobInput, JobResult } from '../../calculators'
import { Job } from '../../calculators/types'
import { formatCurrency, formatNumber } from '../../utils/format'
import { generateCustomerPDF, generateInternalPDF } from '../../services/pdfExport'
import { ShoppingListComponent } from '../ShoppingList'
import { PANEL_PRICES_PER_SQM } from '../../config/pricing'

interface Props {
  result: JobResult | null
  input: JobInput
  job?: Job
  onPrev: () => void
  onRecalculate: () => void
}

export const Step7Results: React.FC<Props> = ({
  result,
  input,
  job,
  onPrev,
  onRecalculate,
}) => {
  const handleExportCustomerPDF = () => {
    if (result && job) {
      generateCustomerPDF(job, result)
    }
  }

  const handleExportInternalPDF = () => {
    if (result && job) {
      generateInternalPDF(job, result)
    }
  }
  if (!result) {
    return (
      <div className="wizard-step-card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h2>אין תוצאות להצגה</h2>
          <p>נא לחזור לשלב הקודם ולבצע חישוב</p>
          <button type="button" className="wizard-btn-primary" onClick={onPrev}>
            ← חזרה
          </button>
        </div>
      </div>
    )
  }

  const { pieces, hardware, cost, additionalMaterials } = result

  return (
    <div className="wizard-step-card results-enter">
      <div className="wizard-step-header">
        <div className="wizard-step-icon-large">📊</div>
        <div>
          <h2 className="wizard-step-title">תוצאות החישוב</h2>
          <p className="wizard-step-description">
            זה חישוב ראשון בלבד – הנגר תמיד יכול לשנות ולהתאים ידנית
          </p>
        </div>
      </div>

      <div className="results-summary">
        <div className="summary-card">
          <div className="summary-label">פרויקט</div>
          <div className="summary-value">{input.title || 'ללא שם'}</div>
        </div>
        {input.customerName && (
          <div className="summary-card">
            <div className="summary-label">לקוח</div>
            <div className="summary-value">{input.customerName}</div>
          </div>
        )}
        <div className="summary-card">
          <div className="summary-label">מידות</div>
          <div className="summary-value">
            {input.widthCm}×{input.depthCm}×{input.heightCm} ס״מ
          </div>
        </div>
      </div>

      <section className="results-section">
        <h3>✂️ רשימת חיתוכים</h3>
        <div className="table-container">
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

      <section className="results-section">
        <h3>🔧 פרזול ותזכורות</h3>
        <div className="table-container">
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

      {additionalMaterials && additionalMaterials.length > 0 && (
        <section className="results-section">
          <h3>🧪 חומרים נוספים</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>חומר</th>
                  <th>כמות</th>
                  <th>יחידה</th>
                  <th>עלות משוערת</th>
                  <th>הערות</th>
                </tr>
              </thead>
              <tbody>
                {additionalMaterials.map((mat, idx) => (
                  <tr key={mat.id + idx}>
                    <td>{idx + 1}</td>
                    <td><strong>{mat.name}</strong></td>
                    <td><strong>{formatNumber(mat.quantity)}</strong></td>
                    <td>{mat.unit}</td>
                    <td>{formatCurrency(mat.estimatedCost)}</td>
                    <td>{mat.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {result.shoppingList && (
        <section className="results-section">
          <h3>🛒 רשימת קניות</h3>
          <ShoppingListComponent
            shoppingList={result.shoppingList}
            materialPricePerSqm={PANEL_PRICES_PER_SQM[input.material]}
          />
        </section>
      )}

      <section className="results-section">
        <h3>💰 כסף</h3>
        <div className="cost-cards-grid">
          <div className="cost-card">
            <div className="cost-label">עלות לוחות (כולל קנטים)</div>
            <div className="cost-value">{formatCurrency(cost.panelsCost)}</div>
          </div>
          {cost.wasteCost > 0 && (
            <div className="cost-card">
              <div className="cost-label">עלות פסולת (15%)</div>
              <div className="cost-value">{formatCurrency(cost.wasteCost)}</div>
            </div>
          )}
          <div className="cost-card">
            <div className="cost-label">עלות פרזול</div>
            <div className="cost-value">{formatCurrency(cost.hardwareCost)}</div>
          </div>
          {cost.additionalMaterialsCost > 0 && (
            <div className="cost-card">
              <div className="cost-label">חומרים נוספים</div>
              <div className="cost-value">{formatCurrency(cost.additionalMaterialsCost)}</div>
            </div>
          )}
          <div className="cost-card">
            <div className="cost-label">עלות עבודה</div>
            <div className="cost-value">{formatCurrency(cost.laborCost)}</div>
          </div>
          <div className="cost-card">
            <div className="cost-label">עלות כוללת (לפני רווח)</div>
            <div className="cost-value">{formatCurrency(cost.totalCost)}</div>
          </div>
          <div className="cost-card highlight">
            <div className="cost-label">הצעה מומלצת ללקוח (כולל רווח)</div>
            <div className="cost-value-large">{formatCurrency(cost.suggestedPrice)}</div>
          </div>
        </div>
      </section>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn-secondary" onClick={onPrev}>
          ← חזרה
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {job && (
            <>
              <button
                type="button"
                className="wizard-btn-secondary"
                onClick={handleExportCustomerPDF}
              >
                📄 PDF ללקוח
              </button>
              <button
                type="button"
                className="wizard-btn-secondary"
                onClick={handleExportInternalPDF}
              >
                🔧 PDF פנימי
              </button>
            </>
          )}
          <button type="button" className="wizard-btn-primary" onClick={onRecalculate}>
            🔄 חישוב מחדש
          </button>
        </div>
      </div>
    </div>
  )
}

