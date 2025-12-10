import { JobInput } from '../calculators/types'

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

/**
 * בדיקת validation מלאה לעבודה
 */
export function validateJobInput(input: JobInput): ValidationError[] {
  const errors: ValidationError[] = []

  // בדיקת שם פרויקט
  if (!input.title || input.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'שם הפרויקט הוא חובה',
      severity: 'error',
    })
  }

  // בדיקת מידות בסיסיות
  if (input.widthCm < 40) {
    errors.push({
      field: 'widthCm',
      message: 'רוחב קטן מדי (מינימום 40 ס״מ)',
      severity: 'error',
    })
  }

  if (input.widthCm > 300) {
    errors.push({
      field: 'widthCm',
      message: 'רוחב גדול מדי (מקסימום 300 ס״מ) - בדוק את המידות',
      severity: 'warning',
    })
  }

  if (input.depthCm < 40) {
    errors.push({
      field: 'depthCm',
      message: 'עומק קטן מדי (מינימום 40 ס״מ)',
      severity: 'error',
    })
  }

  if (input.depthCm > 150) {
    errors.push({
      field: 'depthCm',
      message: 'עומק גדול מדי (מקסימום 150 ס״מ) - בדוק את המידות',
      severity: 'warning',
    })
  }

  if (input.heightCm < 60) {
    errors.push({
      field: 'heightCm',
      message: 'גובה קטן מדי (מינימום 60 ס״מ)',
      severity: 'error',
    })
  }

  if (input.heightCm > 250) {
    errors.push({
      field: 'heightCm',
      message: 'גובה גדול מדי (מקסימום 250 ס״מ) - בדוק את המידות',
      severity: 'warning',
    })
  }

  // בדיקת יחסים הגיוניים
  if (input.heightCm < input.widthCm * 0.3) {
    errors.push({
      field: 'heightCm',
      message: 'גובה קטן מדי ביחס לרוחב - זה לא הגיוני',
      severity: 'warning',
    })
  }

  if (input.heightCm > input.widthCm * 2) {
    errors.push({
      field: 'heightCm',
      message: 'גובה גדול מדי ביחס לרוחב - בדוק את המידות',
      severity: 'warning',
    })
  }

  // בדיקת עובי לוח
  if (input.thicknessMm < 12) {
    errors.push({
      field: 'thicknessMm',
      message: 'עובי לוח קטן מדי (מינימום 12 מ״מ)',
      severity: 'error',
    })
  }

  if (input.thicknessMm > 50) {
    errors.push({
      field: 'thicknessMm',
      message: 'עובי לוח גדול מדי (מקסימום 50 מ״מ) - בדוק את המידות',
      severity: 'warning',
    })
  }

  // בדיקת עובי סטנדרטי
  const standardThicknesses = [12, 16, 18, 25, 30]
  if (!standardThicknesses.includes(input.thicknessMm)) {
    errors.push({
      field: 'thicknessMm',
      message: `עובי לא סטנדרטי. עוביים נפוצים: ${standardThicknesses.join(', ')} מ״מ`,
      severity: 'warning',
    })
  }

  // בדיקת מגירות
  if (input.drawers < 0) {
    errors.push({
      field: 'drawers',
      message: 'מספר מגירות לא יכול להיות שלילי',
      severity: 'error',
    })
  }

  if (input.drawers > 10) {
    errors.push({
      field: 'drawers',
      message: 'מספר מגירות גדול מדי - בדוק את המידות',
      severity: 'warning',
    })
  }

  // בדיקת דלתות
  if (input.doors < 0) {
    errors.push({
      field: 'doors',
      message: 'מספר דלתות לא יכול להיות שלילי',
      severity: 'error',
    })
  }

  if (input.doors > 8) {
    errors.push({
      field: 'doors',
      message: 'מספר דלתות גדול מדי - בדוק את המידות',
      severity: 'warning',
    })
  }

  // בדיקת שעות עבודה
  if (input.laborHours < 1) {
    errors.push({
      field: 'laborHours',
      message: 'שעות עבודה חייבות להיות לפחות 1',
      severity: 'error',
    })
  }

  if (input.laborHours > 200) {
    errors.push({
      field: 'laborHours',
      message: 'שעות עבודה גדולות מדי - בדוק את הערך',
      severity: 'warning',
    })
  }

  // בדיקת התאמה בין מגירות לגובה
  if (input.drawers > 0 && input.heightCm < input.drawers * 15) {
    errors.push({
      field: 'drawers',
      message: `גובה קטן מדי ל-${input.drawers} מגירות. נדרש לפחות ${input.drawers * 15} ס״מ`,
      severity: 'warning',
    })
  }

  return errors
}

/**
 * בדיקה אם יש שגיאות קריטיות
 */
export function hasCriticalErrors(errors: ValidationError[]): boolean {
  return errors.some((e) => e.severity === 'error')
}

/**
 * קבלת הודעות שגיאה לפי שדה
 */
export function getErrorsForField(
  errors: ValidationError[],
  field: string
): ValidationError[] {
  return errors.filter((e) => e.field === field)
}

