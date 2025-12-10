import { PanelPiece } from '../calculators/types'
import { StandardPanel, findBestStandardPanel } from '../config/standardPanels'
import {
  calculateExactPanelsNeededAdvanced,
  OptimizedPanel,
} from './advancedCuttingOptimizer'

export interface PanelCut {
  panelId: string
  widthCm: number
  heightCm: number
  thicknessMm: number
  pieces: Array<{
    pieceId: string
    pieceName: string
    widthCm: number
    heightCm: number
    quantity: number
    x?: number // מיקום בלוח
    y?: number // מיקום בלוח
    rotated?: boolean // האם מסובב
  }>
  wastePercentage: number
  wasteArea: number // בס"מ רבוע
  efficiency: number // יעילות (0-1)
}

export interface ShoppingList {
  panels: Array<{
    panel: StandardPanel
    quantity: number // כמה לוחות צריך לקנות
    cuts: PanelCut[]
    totalWaste: number // פסולת בס"מ רבוע
    wastePercentage: number
    averageEfficiency: number
  }>
  totalPanels: number
  totalWaste: number
  totalCost: number
  overallEfficiency: number
}

/**
 * מחשב כמה לוחות סטנדרטיים צריך לקנות
 * ואיך לחתוך אותם בצורה יעילה - עם אופטימיזציה מתקדמת
 */
export function calculatePanelRequirements(
  pieces: PanelPiece[],
  material: 'mdf' | 'plywood' | 'solid',
  standardPanel?: StandardPanel
): ShoppingList {
  // מצא את הלוח הסטנדרטי המתאים
  const panel = standardPanel || findBestStandardPanel(material, pieces[0]?.thicknessMm || 18)

  if (!panel) {
    throw new Error('לא נמצא לוח סטנדרטי מתאים')
  }

  // קבץ חתיכות לפי עובי
  const piecesByThickness = new Map<number, PanelPiece[]>()
  pieces.forEach((piece) => {
    if (!piecesByThickness.has(piece.thicknessMm)) {
      piecesByThickness.set(piece.thicknessMm, [])
    }
    piecesByThickness.get(piece.thicknessMm)!.push(piece)
  })

  const shoppingList: ShoppingList = {
    panels: [],
    totalPanels: 0,
    totalWaste: 0,
    totalCost: 0,
    overallEfficiency: 0,
  }

  let totalEfficiency = 0
  let panelGroupsCount = 0

  // עבור כל עובי
  piecesByThickness.forEach((piecesForThickness, thicknessMm) => {
    const currentPanel = findBestStandardPanel(material, thicknessMm) || panel

    // שימוש באופטימיזציה מתקדמת
    const optimizedResult = calculateExactPanelsNeededAdvanced(
      currentPanel.widthCm,
      currentPanel.heightCm,
      piecesForThickness
    )

    // המרת OptimizedPanel ל-PanelCut
    const cuts: PanelCut[] = optimizedResult.panels.map((optPanel) => {
      // אגור חתיכות לפי ID ומיקום
      const piecesMap = new Map<
        string,
        {
          piece: PanelPiece
          positions: Array<{ x: number; y: number; rotated: boolean }>
        }
      >()

      optPanel.pieces.forEach((cutPiece) => {
        const key = cutPiece.piece.id
        if (!piecesMap.has(key)) {
          piecesMap.set(key, { piece: cutPiece.piece, positions: [] })
        }
        piecesMap.get(key)!.positions.push({
          x: cutPiece.x,
          y: cutPiece.y,
          rotated: cutPiece.rotated,
        })
      })

      return {
        panelId: optPanel.id,
        widthCm: optPanel.width,
        heightCm: optPanel.height,
        thicknessMm: currentPanel.thicknessMm,
        pieces: Array.from(piecesMap.values()).map(({ piece, positions }) => ({
          pieceId: piece.id,
          pieceName: piece.name,
          widthCm: piece.widthCm,
          heightCm: piece.heightCm,
          quantity: positions.length,
          x: positions[0]?.x,
          y: positions[0]?.y,
          rotated: positions[0]?.rotated,
        })),
        wastePercentage: optPanel.wastePercentage,
        wasteArea: optPanel.wasteArea,
        efficiency: optPanel.efficiency,
      }
    })

    const totalWasteArea = optimizedResult.totalWaste / 10000 // למטר רבוע
    const totalPanelsArea = optimizedResult.totalArea / 10000 // למטר רבוע
    const wastePercentage = totalPanelsArea > 0 
      ? (totalWasteArea / totalPanelsArea) * 100 
      : 0

    shoppingList.panels.push({
      panel: currentPanel,
      quantity: optimizedResult.totalPanels,
      cuts,
      totalWaste: totalWasteArea,
      wastePercentage,
      averageEfficiency: optimizedResult.averageEfficiency,
    })

    shoppingList.totalPanels += optimizedResult.totalPanels
    shoppingList.totalWaste += totalWasteArea
    totalEfficiency += optimizedResult.averageEfficiency
    panelGroupsCount++
  })

  shoppingList.overallEfficiency = panelGroupsCount > 0 
    ? totalEfficiency / panelGroupsCount 
    : 0

  return shoppingList
}

/**
 * מחשב את העלות הכוללת של הלוחות
 */
export function calculatePanelCost(
  shoppingList: ShoppingList,
  pricePerSqm: number
): number {
  let totalCost = 0

  shoppingList.panels.forEach((panelGroup) => {
    const panelArea = (panelGroup.panel.widthCm * panelGroup.panel.heightCm) / 10000
    totalCost += panelArea * panelGroup.quantity * pricePerSqm
  })

  return totalCost
}

