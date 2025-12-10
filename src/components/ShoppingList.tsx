import React from 'react'
import { ShoppingList as ShoppingListType } from '../calculators/types'
import { formatNumber, formatCurrency } from '../utils/format'

interface Props {
  shoppingList: ShoppingListType
  materialPricePerSqm: number
}

export const ShoppingListComponent: React.FC<Props> = ({
  shoppingList,
  materialPricePerSqm,
}) => {
  const calculatePanelCost = (area: number) => {
    return area * materialPricePerSqm
  }

  const totalCost = shoppingList.panels.reduce(
    (sum, panel) => sum + calculatePanelCost(panel.totalArea),
    0
  )

  return (
    <div className="shopping-list-container">
      <div className="shopping-list-header">
        <h3>🛒 רשימת קניות - מה לקנות בחנות</h3>
        <p className="muted">
          זה בדיוק מה שצריך לקנות - לוחות סטנדרטיים מהחנות
        </p>
      </div>

      <div className="shopping-summary">
        <div className="summary-item">
          <span className="summary-label">סה״כ לוחות לקנייה:</span>
          <span className="summary-value highlight">{shoppingList.totalPanels} לוחות</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">פסולת משוערת:</span>
          <span className="summary-value">
            {formatNumber(shoppingList.totalWastePercentage)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">עלות כוללת לוחות:</span>
          <span className="summary-value price">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      <div className="shopping-panels">
        {shoppingList.panels.map((panel, idx) => {
          const panelCost = calculatePanelCost(panel.totalArea)
          return (
            <div key={idx} className="shopping-panel-card">
              <div className="panel-card-header">
                <div>
                  <h4>{panel.panelName}</h4>
                  <p className="panel-size">{panel.panelSize}</p>
                </div>
                <div className="panel-quantity-badge">
                  {panel.quantity} לוחות
                </div>
              </div>

              <div className="panel-details">
                <div className="detail-row">
                  <span className="detail-label">עובי:</span>
                  <span className="detail-value">{panel.thicknessMm} מ״מ</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">חומר:</span>
                  <span className="detail-value">
                    {panel.material === 'mdf' && 'MDF'}
                    {panel.material === 'plywood' && 'סנדוויץ'}
                    {panel.material === 'solid' && 'עץ מלא'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">שטח כולל:</span>
                  <span className="detail-value">
                    {formatNumber(panel.totalArea)} מ״ר
                  </span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">עלות:</span>
                  <span className="detail-value price">
                    {formatCurrency(panelCost)}
                  </span>
                </div>
              </div>

              <div className="panel-instructions">
                <p className="instruction-text">
                  💡 <strong>איך לקנות:</strong> בקש מהמוכר {panel.quantity} לוחות{' '}
                  {panel.panelSize} עובי {panel.thicknessMm} מ״מ{' '}
                  {panel.material === 'mdf' ? 'MDF' : panel.material === 'plywood' ? 'סנדוויץ' : 'עץ מלא'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="shopping-tips">
        <h4>💡 טיפים לקנייה:</h4>
        <ul>
          <li>ודא שהלוחות ישרים ולא מעוקלים</li>
          <li>בדוק שאין נזקים או שריטות</li>
          <li>קנה קצת יותר ממה שצריך (פסולת חיתוך)</li>
          <li>שאל על מחיר סיטונאי אם קונים הרבה</li>
        </ul>
      </div>
    </div>
  )
}

