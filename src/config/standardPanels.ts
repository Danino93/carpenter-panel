/**
 * הגדרת לוחות סטנדרטיים בישראל
 * מידות נפוצות של לוחות MDF/סנדוויץ/עץ
 */

export interface StandardPanel {
  widthCm: number // רוחב בס"מ
  heightCm: number // גובה בס"מ
  thicknessMm: number // עובי במ"מ
  material: 'mdf' | 'plywood' | 'solid'
  name: string // שם הלוח
}

/**
 * לוחות סטנדרטיים נפוצים בישראל
 * פורמט: 244x122 ס"מ (8x4 רגל) - הכי נפוץ
 */
export const STANDARD_PANELS: StandardPanel[] = [
  // MDF 18mm - הכי נפוץ
  {
    widthCm: 244,
    heightCm: 122,
    thicknessMm: 18,
    material: 'mdf',
    name: 'MDF 18mm סטנדרטי (244x122)',
  },
  // MDF 25mm
  {
    widthCm: 244,
    heightCm: 122,
    thicknessMm: 25,
    material: 'mdf',
    name: 'MDF 25mm סטנדרטי (244x122)',
  },
  // MDF 16mm
  {
    widthCm: 244,
    heightCm: 122,
    thicknessMm: 16,
    material: 'mdf',
    name: 'MDF 16mm סטנדרטי (244x122)',
  },
  // סנדוויץ 18mm
  {
    widthCm: 244,
    heightCm: 122,
    thicknessMm: 18,
    material: 'plywood',
    name: 'סנדוויץ 18mm סטנדרטי (244x122)',
  },
  // סנדוויץ 25mm
  {
    widthCm: 244,
    heightCm: 122,
    thicknessMm: 25,
    material: 'plywood',
    name: 'סנדוויץ 25mm סטנדרטי (244x122)',
  },
  // לוחות קטנים יותר (למקרים מיוחדים)
  {
    widthCm: 183,
    heightCm: 122,
    thicknessMm: 18,
    material: 'mdf',
    name: 'MDF 18mm קטן (183x122)',
  },
  {
    widthCm: 122,
    heightCm: 122,
    thicknessMm: 18,
    material: 'mdf',
    name: 'MDF 18mm ריבוע (122x122)',
  },
]

/**
 * מצא לוחות סטנדרטיים שמתאימים לחומר ועובי מסוים
 */
export function getStandardPanelsForMaterial(
  material: 'mdf' | 'plywood' | 'solid',
  thicknessMm: number
): StandardPanel[] {
  return STANDARD_PANELS.filter(
    (panel) => panel.material === material && panel.thicknessMm === thicknessMm
  )
}

/**
 * מצא את הלוח הסטנדרטי הכי מתאים
 */
export function findBestStandardPanel(
  material: 'mdf' | 'plywood' | 'solid',
  thicknessMm: number
): StandardPanel | null {
  const panels = getStandardPanelsForMaterial(material, thicknessMm)
  // מחזיר את הלוח הכי גדול (הכי נפוץ)
  return panels.length > 0 ? panels[0] : null
}

