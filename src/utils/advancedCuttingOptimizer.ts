/**
 * אופטימיזציה מתקדמת של חיתוכים
 * אלגוריתם Bin Packing משופר עם First Fit Decreasing ו-Best Fit
 */

import { PanelPiece } from '../calculators/types'

export interface CutPiece {
  piece: PanelPiece
  x: number
  y: number
  width: number
  height: number
  rotated: boolean
  panelId: string
}

export interface OptimizedPanel {
  id: string
  width: number
  height: number
  pieces: CutPiece[]
  wasteArea: number
  wastePercentage: number
  efficiency: number
}

/**
 * מחשב איך לחתוך לוח בצורה הכי יעילה
 * אלגוריתם: First Fit Decreasing + Best Fit
 */
export function optimizeCuttingAdvanced(
  panelWidth: number,
  panelHeight: number,
  pieces: PanelPiece[]
): OptimizedPanel[] {
  const panels: OptimizedPanel[] = []
  
  // יצירת רשימת כל החתיכות (עם כמות)
  const piecesToPlace: Array<{ piece: PanelPiece; remaining: number }> = []
  pieces.forEach((piece) => {
    for (let i = 0; i < piece.quantity; i++) {
      piecesToPlace.push({ piece, remaining: 1 })
    }
  })

  // מיון לפי גודל (הגדול ביותר ראשון) - First Fit Decreasing
  piecesToPlace.sort((a, b) => {
    const areaA = a.piece.widthCm * a.piece.heightCm
    const areaB = b.piece.widthCm * b.piece.heightCm
    return areaB - areaA
  })

  // עבור כל חתיכה
  for (const { piece } of piecesToPlace) {
    let placed = false

    // נסה למצוא לוח קיים שמתאים
    for (const panel of panels) {
      const position = findBestFitPosition(panel, piece)
      if (position) {
        placePieceInPanel(panel, piece, position)
        placed = true
        break
      }
    }

    // אם לא נמצא מקום - צור לוח חדש
    if (!placed) {
      const newPanel = createNewPanel(panelWidth, panelHeight, panels.length + 1)
      const position = findBestFitPosition(newPanel, piece)
      if (position) {
        placePieceInPanel(newPanel, piece, position)
        panels.push(newPanel)
        placed = true
      }
    }
  }

  // חישוב פסולת לכל לוח
  panels.forEach((panel) => {
    const usedArea = panel.pieces.reduce((sum, p) => sum + p.width * p.height, 0)
    const totalArea = panel.width * panel.height
    panel.wasteArea = totalArea - usedArea
    panel.wastePercentage = (panel.wasteArea / totalArea) * 100
    panel.efficiency = usedArea / totalArea
  })

  return panels
}

function createNewPanel(
  width: number,
  height: number,
  id: number
): OptimizedPanel {
  return {
    id: `panel_${id}`,
    width,
    height,
    pieces: [],
    wasteArea: 0,
    wastePercentage: 0,
    efficiency: 0,
  }
}

interface Position {
  x: number
  y: number
  rotated: boolean
  waste: number // כמה פסולת יווצר אם נמקם כאן
}

/**
 * מוצא את המיקום הכי טוב לחתיכה בלוח
 * Best Fit - בוחר את המיקום שיוצר הכי פחות פסולת
 */
function findBestFitPosition(
  panel: OptimizedPanel,
  piece: PanelPiece
): Position | null {
  const candidates: Position[] = []

  // נסה ללא סיבוב
  const pos1 = findPositionForSize(panel, piece.widthCm, piece.heightCm, false)
  if (pos1) candidates.push(pos1)

  // נסה עם סיבוב (אם החתיכה לא ריבועית)
  if (piece.widthCm !== piece.heightCm) {
    const pos2 = findPositionForSize(panel, piece.heightCm, piece.widthCm, true)
    if (pos2) candidates.push(pos2)
  }

  if (candidates.length === 0) return null

  // בחר את המיקום שיוצר הכי פחות פסולת
  return candidates.reduce((best, current) =>
    current.waste < best.waste ? current : best
  )
}

function findPositionForSize(
  panel: OptimizedPanel,
  width: number,
  height: number,
  rotated: boolean
): Position | null {
  // רשימת נקודות אפשריות למקם את החתיכה
  const candidatePositions: Array<{ x: number; y: number }> = [
    { x: 0, y: 0 }, // פינה שמאלית-עליונה
  ]

  // הוסף נקודות בפינות של חתיכות קיימות
  panel.pieces.forEach((existingPiece) => {
    // פינה ימנית-עליונה
    candidatePositions.push({
      x: existingPiece.x + existingPiece.width,
      y: existingPiece.y,
    })
    // פינה שמאלית-תחתונה
    candidatePositions.push({
      x: existingPiece.x,
      y: existingPiece.y + existingPiece.height,
    })
  })

  let bestPosition: Position | null = null
  let minWaste = Infinity

  // נסה כל נקודה
  for (const pos of candidatePositions) {
    // בדוק אם החתיכה נכנסת מהנקודה הזו
    if (pos.x + width <= panel.width && pos.y + height <= panel.height) {
      // בדוק התנגשויות עם חתיכות קיימות
      const hasCollision = panel.pieces.some((existingPiece) => {
        return !(
          pos.x + width <= existingPiece.x ||
          pos.x >= existingPiece.x + existingPiece.width ||
          pos.y + height <= existingPiece.y ||
          pos.y >= existingPiece.y + existingPiece.height
        )
      })

      if (!hasCollision) {
        // חשב כמה פסולת יווצר
        const waste = calculateWasteForPosition(panel, pos.x, pos.y, width, height)
        
        if (waste < minWaste) {
          minWaste = waste
          bestPosition = { x: pos.x, y: pos.y, rotated, waste }
        }
      }
    }
  }

  return bestPosition
}

/**
 * מחשב כמה פסולת יווצר אם נמקם חתיכה במיקום מסוים
 */
function calculateWasteForPosition(
  panel: OptimizedPanel,
  x: number,
  y: number,
  width: number,
  height: number
): number {
  // שטח החתיכה
  const pieceArea = width * height

  // שטח פנוי סביב החתיכה (פסולת פוטנציאלית)
  // זה חישוב פשוט - בפועל צריך לחשב את השטח הפנוי המדויק
  const surroundingArea = calculateSurroundingWaste(panel, x, y, width, height)

  return surroundingArea
}

function calculateSurroundingWaste(
  panel: OptimizedPanel,
  x: number,
  y: number,
  width: number,
  height: number
): number {
  // חישוב פשוט של פסולת - שטח שלא ניתן להשתמש בו
  // בגלל שהחתיכה תופסת מקום
  let waste = 0

  // בדוק את השטח מימין לחתיכה
  const rightEdge = x + width
  if (rightEdge < panel.width) {
    // יש מקום מימין - זה פסולת פוטנציאלית
    waste += (panel.width - rightEdge) * height
  }

  // בדוק את השטח מתחת לחתיכה
  const bottomEdge = y + height
  if (bottomEdge < panel.height) {
    // יש מקום מתחת - זה פסולת פוטנציאלית
    waste += width * (panel.height - bottomEdge)
  }

  return waste
}

function placePieceInPanel(
  panel: OptimizedPanel,
  piece: PanelPiece,
  position: Position
): void {
  panel.pieces.push({
    piece,
    x: position.x,
    y: position.y,
    width: position.rotated ? piece.heightCm : piece.widthCm,
    height: position.rotated ? piece.widthCm : piece.heightCm,
    rotated: position.rotated,
    panelId: panel.id,
  })
}

/**
 * מחשב כמה לוחות צריך בדיוק
 */
export function calculateExactPanelsNeededAdvanced(
  panelWidth: number,
  panelHeight: number,
  pieces: PanelPiece[]
): {
  panels: OptimizedPanel[]
  totalPanels: number
  totalWaste: number
  averageEfficiency: number
  totalArea: number
  usedArea: number
} {
  const optimizedPanels = optimizeCuttingAdvanced(panelWidth, panelHeight, pieces)

  const totalWaste = optimizedPanels.reduce((sum, panel) => sum + panel.wasteArea, 0)
  const totalArea = optimizedPanels.reduce(
    (sum, panel) => sum + panel.width * panel.height,
    0
  )
  const usedArea = optimizedPanels.reduce(
    (sum, panel) => sum + panel.pieces.reduce((s, p) => s + p.width * p.height, 0),
    0
  )
  const averageEfficiency =
    optimizedPanels.length > 0
      ? optimizedPanels.reduce((sum, panel) => sum + panel.efficiency, 0) /
        optimizedPanels.length
      : 0

  return {
    panels: optimizedPanels,
    totalPanels: optimizedPanels.length,
    totalWaste,
    averageEfficiency,
    totalArea,
    usedArea,
  }
}

