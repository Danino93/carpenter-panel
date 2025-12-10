/**
 * אופטימיזציה מתקדמת של חיתוכים
 * מחשב איך לחתוך לוח סטנדרטי בצורה הכי יעילה
 */

import { PanelPiece } from '../calculators/types'

export interface CutPiece {
  piece: PanelPiece
  x: number // מיקום X בלוח
  y: number // מיקום Y בלוח
  width: number
  height: number
  rotated: boolean // האם החתיכה מסובבת
}

export interface OptimizedCut {
  panelId: string
  width: number // רוחב הלוח
  height: number // גובה הלוח
  pieces: CutPiece[]
  wasteArea: number // פסולת בס"מ רבוע
  wastePercentage: number
  efficiency: number // יעילות (0-1)
}

/**
 * מחשב איך לחתוך לוח בצורה הכי יעילה
 * אלגוריתם Bin Packing פשוט (First Fit Decreasing)
 */
export function optimizePanelCutting(
  panelWidth: number,
  panelHeight: number,
  pieces: PanelPiece[]
): OptimizedCut[] {
  const cuts: OptimizedCut[] = []
  
  // מיון חתיכות לפי גודל (הגדול ביותר ראשון)
  const sortedPieces = [...pieces].sort((a, b) => {
    const areaA = a.widthCm * a.heightCm
    const areaB = b.widthCm * b.heightCm
    return areaB - areaA
  })

  // עבור כל חתיכה (עם כמות)
  const piecesToPlace: Array<{ piece: PanelPiece; remaining: number }> = []
  sortedPieces.forEach((piece) => {
    for (let i = 0; i < piece.quantity; i++) {
      piecesToPlace.push({ piece, remaining: 1 })
    }
  })

  let currentPanel = createNewPanel(panelWidth, panelHeight, cuts.length + 1)
  let totalAreaUsed = 0
  const totalArea = panelWidth * panelHeight

  piecesToPlace.forEach(({ piece }) => {
    let placed = false

    // נסה למקם את החתיכה בלוח הנוכחי
    if (canFit(currentPanel, piece.widthCm, piece.heightCm)) {
      const position = findBestPosition(currentPanel, piece.widthCm, piece.heightCm)
      if (position) {
        placePiece(currentPanel, piece, position.x, position.y, position.rotated)
        placed = true
      }
    } else {
      // נסה לסובב את החתיכה
      if (canFit(currentPanel, piece.heightCm, piece.widthCm)) {
        const position = findBestPosition(currentPanel, piece.heightCm, piece.widthCm)
        if (position) {
          placePiece(currentPanel, piece, position.x, position.y, true)
          placed = true
        }
      }
    }

    if (!placed) {
      // לא נכנס בלוח הנוכחי - צריך לוח חדש
      cuts.push(currentPanel)
      currentPanel = createNewPanel(panelWidth, panelHeight, cuts.length + 1)
      
      // נסה למקם בלוח החדש
      if (canFit(currentPanel, piece.widthCm, piece.heightCm)) {
        const position = findBestPosition(currentPanel, piece.widthCm, piece.heightCm)
        if (position) {
          placePiece(currentPanel, piece, position.x, position.y, false)
          placed = true
        }
      } else if (canFit(currentPanel, piece.heightCm, piece.widthCm)) {
        const position = findBestPosition(currentPanel, piece.heightCm, piece.widthCm)
        if (position) {
          placePiece(currentPanel, piece, position.x, position.y, true)
          placed = true
        }
      }
    }

    if (placed) {
      totalAreaUsed += piece.widthCm * piece.heightCm
    }
  })

  // הוסף את הלוח האחרון
  if (currentPanel.pieces.length > 0) {
    cuts.push(currentPanel)
  }

  // חישוב פסולת לכל לוח
  cuts.forEach((cut) => {
    const usedArea = cut.pieces.reduce(
      (sum, p) => sum + p.width * p.height,
      0
    )
    cut.wasteArea = totalArea - usedArea
    cut.wastePercentage = (cut.wasteArea / totalArea) * 100
    cut.efficiency = usedArea / totalArea
  })

  return cuts
}

function createNewPanel(
  width: number,
  height: number,
  id: number
): OptimizedCut {
  return {
    panelId: `panel_${id}`,
    width,
    height,
    pieces: [],
    wasteArea: 0,
    wastePercentage: 0,
    efficiency: 0,
  }
}

function canFit(
  panel: OptimizedCut,
  pieceWidth: number,
  pieceHeight: number
): boolean {
  // בדיקה פשוטה - האם החתיכה נכנסת בלוח
  // בפועל צריך לבדוק גם התנגשויות עם חתיכות קיימות
  return pieceWidth <= panel.width && pieceHeight <= panel.height
}

function findBestPosition(
  panel: OptimizedCut,
  pieceWidth: number,
  pieceHeight: number
): { x: number; y: number; rotated: boolean } | null {
  // אלגוריתם פשוט - מחפש מקום פנוי
  // נסה למקם בפינות פנויות
  
  // בדיקה בסיסית - האם החתיכה נכנסת בלוח
  if (pieceWidth > panel.width || pieceHeight > panel.height) {
    return null
  }

  // רשימת נקודות אפשריות למקם את החתיכה
  const candidatePositions: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }]

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

  // נסה כל נקודה
  for (const pos of candidatePositions) {
    // בדוק אם החתיכה נכנסת מהנקודה הזו
    if (
      pos.x + pieceWidth <= panel.width &&
      pos.y + pieceHeight <= panel.height
    ) {
      // בדוק התנגשויות עם חתיכות קיימות
      const hasCollision = panel.pieces.some((existingPiece) => {
        return !(
          pos.x + pieceWidth <= existingPiece.x ||
          pos.x >= existingPiece.x + existingPiece.width ||
          pos.y + pieceHeight <= existingPiece.y ||
          pos.y >= existingPiece.y + existingPiece.height
        )
      })

      if (!hasCollision) {
        return { x: pos.x, y: pos.y, rotated: false }
      }
    }
  }

  return null
}

function placePiece(
  panel: OptimizedCut,
  piece: PanelPiece,
  x: number,
  y: number,
  rotated: boolean
): void {
  panel.pieces.push({
    piece,
    x,
    y,
    width: rotated ? piece.heightCm : piece.widthCm,
    height: rotated ? piece.widthCm : piece.heightCm,
    rotated,
  })
}

/**
 * חישוב מדויק של כמה לוחות צריך
 */
export function calculateExactPanelsNeeded(
  panelWidth: number,
  panelHeight: number,
  pieces: PanelPiece[]
): {
  panels: OptimizedCut[]
  totalPanels: number
  totalWaste: number
  averageEfficiency: number
} {
  const optimizedCuts = optimizePanelCutting(panelWidth, panelHeight, pieces)

  const totalWaste = optimizedCuts.reduce((sum, cut) => sum + cut.wasteArea, 0)
  const averageEfficiency =
    optimizedCuts.reduce((sum, cut) => sum + cut.efficiency, 0) /
    optimizedCuts.length

  return {
    panels: optimizedCuts,
    totalPanels: optimizedCuts.length,
    totalWaste,
    averageEfficiency,
  }
}

