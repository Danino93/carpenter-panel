export type ProjectType = 'desk' | 'cabinet' | 'sideboard' | 'dresser' | 'shelf' | 'custom'

export type MaterialType = 'mdf' | 'plywood' | 'solid'

export type JobStatus = 'draft' | 'sent' | 'approved' | 'completed' | 'cancelled'

export interface JobInput {
  projectType: ProjectType
  title: string
  customerName?: string
  widthCm: number
  depthCm: number
  heightCm: number
  material: MaterialType
  thicknessMm: number
  drawers: number
  doors: number
  includeBackPanel: boolean
  includeEdgeBanding: boolean
  laborHours: number
  notes?: string
}

export interface Job extends JobInput {
  id: string
  createdAt: number // timestamp
  updatedAt: number // timestamp
  completedAt?: number // timestamp - מתי הושלמה העבודה
  status: JobStatus
  result?: JobResult
}

export interface PanelPiece {
  id: string
  name: string
  widthCm: number
  heightCm: number
  thicknessMm: number
  quantity: number
  edgeBandSides?: number
}

export interface HardwareItem {
  id: string
  name: string
  quantity: number
  unit: string
  notes?: string
}

export interface AdditionalMaterial {
  id: string
  name: string
  quantity: number
  unit: string
  estimatedCost: number
  notes?: string
}

export interface CostBreakdown {
  panelsCost: number
  wasteCost: number // עלות פסולת
  hardwareCost: number
  additionalMaterialsCost: number // חומרים נוספים
  laborCost: number
  totalCost: number
  suggestedPrice: number
}

export interface ShoppingList {
  panels: Array<{
    panelName: string
    panelSize: string // "244x122 ס״מ"
    thicknessMm: number
    material: MaterialType
    quantity: number // כמה לוחות לקנות
    totalArea: number // שטח כולל במטר רבוע
  }>
  totalPanels: number
  totalWastePercentage: number
  overallEfficiency?: number // יעילות כוללת (0-1)
}

export interface JobResult {
  pieces: PanelPiece[]
  hardware: HardwareItem[]
  additionalMaterials?: AdditionalMaterial[] // חומרים נוספים (דבק, לכה, וכו')
  cost: CostBreakdown
  shoppingList?: ShoppingList // רשימת קניות מפורטת
}
