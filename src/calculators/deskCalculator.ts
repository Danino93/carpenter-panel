import {
  JobInput,
  JobResult,
  PanelPiece,
  HardwareItem,
  CostBreakdown,
  ShoppingList,
  AdditionalMaterial,
} from './types'
import {
  PANEL_PRICES_PER_SQM,
  EDGE_BAND_PRICE_PER_METER,
  DRAWER_SLIDES_PRICE_PER_SET,
  HANDLE_PRICE,
  HINGE_PRICE,
  SCREW_BOX_PRICE,
  LABOR_PRICE_PER_HOUR,
  DEFAULT_PROFIT_MULTIPLIER,
  GLUE_PRICE_PER_KG,
  VARNISH_PRICE_PER_LITER,
  PAINT_PRICE_PER_LITER,
  SANDPAPER_PRICE_PER_SHEET,
  GLUE_PER_SQM,
  VARNISH_PER_SQM,
  PAINT_PER_SQM,
  SANDPAPER_SHEETS_PER_JOB,
} from '../config/pricing'
import {
  calculatePanelRequirements,
  calculatePanelCost,
} from '../utils/panelOptimizer'
import { findBestStandardPanel } from '../config/standardPanels'

const toSqm = (widthCm: number, heightCm: number): number => {
  return (widthCm / 100) * (heightCm / 100)
}

const perimeterMeters = (widthCm: number, heightCm: number): number => {
  return ((widthCm + heightCm) * 2) / 100
}

export function calculateDeskJob(input: JobInput): JobResult {
  const pieces: PanelPiece[] = []
  const hardware: HardwareItem[] = []
  const additionalMaterials: AdditionalMaterial[] = []

  const {
    widthCm,
    depthCm,
    heightCm,
    material,
    thicknessMm,
    drawers,
    doors,
    includeBackPanel,
    includeEdgeBanding,
    laborHours,
  } = input

  // 1. פלטה עליונה
  pieces.push({
    id: 'top',
    name: 'פלטה עליונה',
    widthCm,
    heightCm: depthCm,
    thicknessMm,
    quantity: 1,
    edgeBandSides: includeEdgeBanding ? 4 : 0,
  })

  // 2. רגליים צדדיות (2)
  const legHeight = heightCm - 3 // מרווח מהרצפה
  pieces.push({
    id: 'right_leg',
    name: 'צד ימין',
    widthCm: depthCm,
    heightCm: legHeight,
    thicknessMm,
    quantity: 1,
    edgeBandSides: includeEdgeBanding ? 2 : 0,
  })

  pieces.push({
    id: 'left_leg',
    name: 'צד שמאל',
    widthCm: depthCm,
    heightCm: legHeight,
    thicknessMm,
    quantity: 1,
    edgeBandSides: includeEdgeBanding ? 2 : 0,
  })

  // 3. פנלים למגירות – חישוב גס שמחלק את הרוחב לאזורים שווים
  if (drawers > 0) {
    const drawerSectionWidth = widthCm * 0.35
    const drawerWidth = drawerSectionWidth - 3 // קצת מרווח למסילות
    const drawerHeight = (heightCm * 0.5) / drawers // נגיד חצי גובה מוקצה למגירות
    const drawerDepth = depthCm - 5

    for (let i = 0; i < drawers; i++) {
      // חזית
      pieces.push({
        id: `drawer_front_${i + 1}`,
        name: `חזית מגירה ${i + 1}`,
        widthCm: drawerWidth,
        heightCm: drawerHeight,
        thicknessMm,
        quantity: 1,
        edgeBandSides: includeEdgeBanding ? 4 : 0,
      })

      // צדדים (2)
      pieces.push({
        id: `drawer_side_${i + 1}`,
        name: `צד מגירה ${i + 1}`,
        widthCm: drawerDepth,
        heightCm: drawerHeight - 3,
        thicknessMm,
        quantity: 2,
      })

      // גב
      pieces.push({
        id: `drawer_back_${i + 1}`,
        name: `גב מגירה ${i + 1}`,
        widthCm: drawerWidth - 3,
        heightCm: drawerHeight - 3,
        thicknessMm,
        quantity: 1,
      })

      // תחתית (נניח לוח דק יותר – פה אפשר בעתיד להפריד לחומר אחר)
      pieces.push({
        id: `drawer_bottom_${i + 1}`,
        name: `תחתית מגירה ${i + 1}`,
        widthCm: drawerWidth - 2,
        heightCm: drawerDepth - 2,
        thicknessMm: Math.max(thicknessMm - 6, 10),
        quantity: 1,
      })
    }

    // פרזול למגירות
    hardware.push({
      id: 'drawer_slides',
      name: 'מסילות טלסקופיות למגירות',
      quantity: drawers,
      unit: 'סטים',
      notes: 'סט אחד לכל מגירה',
    })

    hardware.push({
      id: 'drawer_handles',
      name: 'ידיות למגירות',
      quantity: drawers,
      unit: 'יחידות',
    })
  }

  // 4. דלתות (אם יש) - חישוב מדויק
  if (doors > 0) {
    // גובה דלת - כמעט כל הגובה פחות מרווחים
    const doorHeight = heightCm - 4 // 4 ס"מ מרווחים (2 למעלה, 2 למטה)
    // רוחב אזור דלתות - כ-50% מהרוחב, מינוס מרווחים
    const doorSectionWidth = widthCm * 0.5 - 6 // 6 ס"מ מרווחים כולל
    const doorWidth = Math.floor((doorSectionWidth - (doors - 1) * 2) / doors) // מינוס מרווחים בין דלתות

    for (let i = 0; i < doors; i++) {
      pieces.push({
        id: `door_${i + 1}`,
        name: `דלת ${i + 1}`,
        widthCm: doorWidth,
        heightCm: doorHeight,
        thicknessMm,
        quantity: 1,
        edgeBandSides: includeEdgeBanding ? 4 : 0,
      })
    }

    hardware.push({
      id: 'door_hinges',
      name: 'צירים לדלתות',
      quantity: doors * 2,
      unit: 'יחידות',
    })

    hardware.push({
      id: 'door_handles',
      name: 'ידיות לדלתות',
      quantity: doors,
      unit: 'יחידות',
    })
  }

  // 5. גב לשולחן / ארונית - חישוב מדויק
  if (includeBackPanel) {
    // הגב צריך להיות בגובה כמעט מלא, מינוס מרווחים
    const backPanelHeight = heightCm - 2 // 2 ס"מ מרווח למטה
    const backPanelWidth = widthCm - 4 // 4 ס"מ מינוס עובי צדדים (2 ס"מ כל צד)
    
    pieces.push({
      id: 'back_panel',
      name: 'גב',
      widthCm: backPanelWidth,
      heightCm: backPanelHeight,
      thicknessMm: Math.max(thicknessMm - 6, 10), // לוח דק יותר לגב
      quantity: 1,
    })
  }

  // 6. ברגים כלליים
  hardware.push({
    id: 'screws_box',
    name: 'קופסת ברגים כללית',
    quantity: 1,
    unit: 'קופסאות',
  })

  // 7. חומרים נוספים
  // חישוב שטח כולל לעבודה
  let totalAreaSqm = 0
  pieces.forEach((p) => {
    totalAreaSqm += toSqm(p.widthCm, p.heightCm) * p.quantity
  })

  // דבק עץ
  const glueNeeded = totalAreaSqm * GLUE_PER_SQM
  if (glueNeeded > 0) {
    additionalMaterials.push({
      id: 'glue',
      name: 'דבק עץ',
      quantity: Math.ceil(glueNeeded * 10) / 10, // עיגול ל-0.1 ק"ג
      unit: 'ק״ג',
      estimatedCost: Math.ceil(glueNeeded * GLUE_PRICE_PER_KG),
      notes: 'להדבקת חלקים',
    })
  }

  // לכה (אם צריך)
  const varnishNeeded = totalAreaSqm * VARNISH_PER_SQM
  if (varnishNeeded > 0) {
    additionalMaterials.push({
      id: 'varnish',
      name: 'לכה שקופה',
      quantity: Math.ceil(varnishNeeded * 10) / 10, // עיגול ל-0.1 ליטר
      unit: 'ליטר',
      estimatedCost: Math.ceil(varnishNeeded * VARNISH_PRICE_PER_LITER),
      notes: 'לציפוי סופי',
    })
  }

  // נייר זכוכית
  additionalMaterials.push({
    id: 'sandpaper',
    name: 'נייר זכוכית',
    quantity: SANDPAPER_SHEETS_PER_JOB,
    unit: 'יריעות',
    estimatedCost: SANDPAPER_SHEETS_PER_JOB * SANDPAPER_PRICE_PER_SHEET,
    notes: 'לליטוש',
  })

  // ===== חישובי עלות =====
  let panelsCost = 0
  let edgeBandMeters = 0

  const panelPricePerSqm = PANEL_PRICES_PER_SQM[material]

  pieces.forEach((p) => {
    const sqm = toSqm(p.widthCm, p.heightCm) * p.quantity
    panelsCost += sqm * panelPricePerSqm

    // חישוב קנטים מדויק - לפי מספר הצדדים שצריכים קנט
    if (p.edgeBandSides && includeEdgeBanding && p.edgeBandSides > 0) {
      // חישוב ההיקף של כל צד שצריך קנט
      // אם יש 4 צדדים: 2*(רוחב+גובה), אם יש 2 צדדים: רוחב או גובה (תלוי איזה)
      let metersPerPiece = 0
      
      if (p.edgeBandSides === 4) {
        // כל ההיקף
        metersPerPiece = perimeterMeters(p.widthCm, p.heightCm)
      } else if (p.edgeBandSides === 2) {
        // נניח שזה רוחב + גובה (2 צדדים נגדיים)
        metersPerPiece = (p.widthCm / 100) + (p.heightCm / 100)
      } else if (p.edgeBandSides === 1) {
        // צד אחד - נניח הרוחב
        metersPerPiece = p.widthCm / 100
      }
      
      edgeBandMeters += metersPerPiece * p.quantity
    }
  })

  // חישוב פסולת (15% מהחומר)
  const WASTE_PERCENTAGE = 0.15
  const materialWithWaste = panelsCost * (1 + WASTE_PERCENTAGE)
  
  const edgeBandCost = edgeBandMeters * EDGE_BAND_PRICE_PER_METER

  // עלות פרזול
  let hardwareCost = 0

  hardware.forEach((h) => {
    switch (h.id) {
      case 'drawer_slides':
        hardwareCost += h.quantity * DRAWER_SLIDES_PRICE_PER_SET
        break
      case 'drawer_handles':
      case 'door_handles':
        hardwareCost += h.quantity * HANDLE_PRICE
        break
      case 'door_hinges':
        hardwareCost += h.quantity * HINGE_PRICE
        break
      case 'screws_box':
        hardwareCost += SCREW_BOX_PRICE
        break
      default:
        break
    }
  })

  // עלות חומרים נוספים
  let additionalMaterialsCost = 0
  additionalMaterials.forEach((mat) => {
    additionalMaterialsCost += mat.estimatedCost
  })

  const laborCost = laborHours * LABOR_PRICE_PER_HOUR
  const wasteCost = materialWithWaste - panelsCost
  const totalCost =
    materialWithWaste +
    edgeBandCost +
    hardwareCost +
    additionalMaterialsCost +
    laborCost
  const suggestedPrice = totalCost * DEFAULT_PROFIT_MULTIPLIER

  const cost: CostBreakdown = {
    panelsCost: Math.round(panelsCost + edgeBandCost),
    wasteCost: Math.round(wasteCost),
    hardwareCost: Math.round(hardwareCost),
    additionalMaterialsCost: Math.round(additionalMaterialsCost),
    laborCost: Math.round(laborCost),
    totalCost: Math.round(totalCost),
    suggestedPrice: Math.round(suggestedPrice),
  }

  // חישוב רשימת קניות מפורטת - כמה לוחות סטנדרטיים צריך לקנות
  let shoppingList: ShoppingList | undefined
  try {
    const standardPanel = findBestStandardPanel(material, thicknessMm)
    if (standardPanel) {
      const panelRequirements = calculatePanelRequirements(pieces, material, standardPanel)
      const panelCost = calculatePanelCost(panelRequirements, panelPricePerSqm)

      const totalPanelsArea = panelRequirements.panels.reduce(
        (sum, p) => sum + (p.panel.widthCm * p.panel.heightCm * p.quantity) / 10000,
        0
      )

      shoppingList = {
        panels: panelRequirements.panels.map((p) => ({
          panelName: p.panel.name,
          panelSize: `${p.panel.widthCm}x${p.panel.heightCm} ס״מ`,
          thicknessMm: p.panel.thicknessMm,
          material: p.panel.material,
          quantity: p.quantity,
          totalArea: (p.panel.widthCm * p.panel.heightCm * p.quantity) / 10000, // למטר רבוע
        })),
        totalPanels: panelRequirements.totalPanels,
        totalWastePercentage:
          totalPanelsArea > 0
            ? (panelRequirements.totalWaste / totalPanelsArea) * 100
            : 0,
        overallEfficiency: panelRequirements.overallEfficiency,
      }
    }
  } catch (err) {
    console.warn('Error calculating shopping list:', err)
  }

  return {
    pieces,
    hardware,
    additionalMaterials: additionalMaterials.length > 0 ? additionalMaterials : undefined,
    cost,
    shoppingList,
  }
}
