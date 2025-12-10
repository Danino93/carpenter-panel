import { MaterialType } from '../calculators/types'

// מחירים לדוגמא בלבד – תעדכן לפי המחירון שלו
export const PANEL_PRICES_PER_SQM: Record<MaterialType, number> = {
  mdf: 90,       // מחיר למטר רבוע MDF
  plywood: 130,  // סנדוויץ'
  solid: 250     // עץ מלא
}

export const EDGE_BAND_PRICE_PER_METER = 3    // קנט למטר
export const DRAWER_SLIDES_PRICE_PER_SET = 25 // מסילות סט
export const HANDLE_PRICE = 8                 // ידית אחת
export const HINGE_PRICE = 12                 // ציר לדלת
export const SCREW_BOX_PRICE = 25            // קופסת ברגים כללית לעבודה
export const LABOR_PRICE_PER_HOUR = 160      // ש"ח לשעת עבודה

// חומרים נוספים
export const GLUE_PRICE_PER_KG = 45          // דבק עץ לק"ג
export const VARNISH_PRICE_PER_LITER = 80    // לכה לליטר
export const PAINT_PRICE_PER_LITER = 120     // צבע לליטר
export const SANDPAPER_PRICE_PER_SHEET = 3   // נייר זכוכית ליריעה
export const SCREWS_PRICE_PER_BOX = 25       // ברגים לקופסה

export const DEFAULT_PROFIT_MULTIPLIER = 1.35 // רווח 35%

// הערכות שימוש (לפי גודל עבודה)
export const GLUE_PER_SQM = 0.1 // ק"ג דבק למטר רבוע
export const VARNISH_PER_SQM = 0.15 // ליטר לכה למטר רבוע
export const PAINT_PER_SQM = 0.2 // ליטר צבע למטר רבוע
export const SANDPAPER_SHEETS_PER_JOB = 5 // יריעות נייר זכוכית לעבודה
