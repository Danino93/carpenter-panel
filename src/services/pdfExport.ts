import jsPDF from 'jspdf'
import { Job, JobResult } from '../calculators/types'
import { formatCurrency, formatNumber } from '../utils/format'

export function generateCustomerPDF(job: Job, result: JobResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // הגדרות בסיסיות
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let yPos = margin

  // כותרת
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('הצעת מחיר', pageWidth - margin, yPos, { align: 'right' })
  yPos += 15

  // פרטי הפרויקט
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(`פרויקט: ${job.title}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 8

  if (job.customerName) {
    doc.text(`לקוח: ${job.customerName}`, pageWidth - margin, yPos, { align: 'right' })
    yPos += 8
  }

  doc.text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, pageWidth - margin, yPos, {
    align: 'right',
  })
  yPos += 15

  // קו מפריד
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // פרטי הפרויקט
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('פרטי הפרויקט:', pageWidth - margin, yPos, { align: 'right' })
  yPos += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const projectDetails = [
    `סוג עבודה: ${getProjectTypeLabel(job.projectType)}`,
    `מידות: ${job.widthCm}×${job.depthCm}×${job.heightCm} ס״מ`,
    `חומר: ${getMaterialLabel(job.material)}`,
    `עובי לוח: ${job.thicknessMm} מ״מ`,
    job.drawers > 0 ? `מספר מגירות: ${job.drawers}` : '',
    job.doors > 0 ? `מספר דלתות: ${job.doors}` : '',
  ].filter(Boolean)

  projectDetails.forEach((detail) => {
    doc.text(detail, pageWidth - margin, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 5

  // קו מפריד
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // סיכום עלויות
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('סיכום עלויות:', pageWidth - margin, yPos, { align: 'right' })
  yPos += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const costItems = [
    { label: 'עלות לוחות (כולל קנטים)', value: result.cost.panelsCost },
    result.cost.wasteCost > 0
      ? { label: 'עלות פסולת', value: result.cost.wasteCost }
      : null,
    { label: 'עלות פרזול', value: result.cost.hardwareCost },
    { label: 'עלות עבודה', value: result.cost.laborCost },
  ].filter(Boolean) as { label: string; value: number }[]

  costItems.forEach((item) => {
    doc.text(item.label, pageWidth - margin - 60, yPos, { align: 'right' })
    doc.text(formatCurrency(item.value), pageWidth - margin, yPos, { align: 'right' })
    yPos += 7
  })

  yPos += 3
  doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos)
  yPos += 7

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('סה״כ עלות:', pageWidth - margin - 60, yPos, { align: 'right' })
  doc.text(formatCurrency(result.cost.totalCost), pageWidth - margin, yPos, {
    align: 'right',
  })
  yPos += 10

  // מחיר מוצע
  doc.setFontSize(16)
  doc.setTextColor(34, 197, 94) // ירוק
  doc.text('מחיר מוצע ללקוח:', pageWidth - margin - 60, yPos, { align: 'right' })
  doc.text(formatCurrency(result.cost.suggestedPrice), pageWidth - margin, yPos, {
    align: 'right',
  })
  doc.setTextColor(0, 0, 0) // חזרה לשחור

  yPos += 15

  // הערות
  if (job.notes) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('הערות:', pageWidth - margin, yPos, { align: 'right' })
    yPos += 6
    doc.text(job.notes, pageWidth - margin, yPos, { align: 'right', maxWidth: contentWidth })
  }

  // תחתית
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(
    'הצעת מחיר זו תקפה ל-30 יום מיום הוצאתה',
    pageWidth / 2,
    pageHeight - margin,
    { align: 'center' }
  )

  // שמירה
  const fileName = `הצעת_מחיר_${job.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  doc.save(fileName)
}

export function generateInternalPDF(job: Job, result: JobResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPos = margin

  // כותרת
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('רשימת חיתוכים - פנימי', pageWidth - margin, yPos, { align: 'right' })
  yPos += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`פרויקט: ${job.title}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 15

  // טבלת חיתוכים
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('רשימת חיתוכים:', pageWidth - margin, yPos, { align: 'right' })
  yPos += 10

  // כותרות טבלה
  doc.setFontSize(9)
  const tableHeaders = ['קנטים', 'כמות', 'עובי', 'גובה', 'רוחב', 'שם חלק', '#']
  const colWidths = [15, 15, 15, 25, 25, 50, 10]
  let xPos = pageWidth - margin

  tableHeaders.forEach((header, idx) => {
    doc.setFont('helvetica', 'bold')
    doc.text(header, xPos, yPos, { align: 'right' })
    xPos -= colWidths[idx]
  })

  yPos += 6
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 5

  // שורות טבלה
  doc.setFont('helvetica', 'normal')
  result.pieces.forEach((piece, idx) => {
    if (yPos > 250) {
      // עמוד חדש
      doc.addPage()
      yPos = margin
    }

    xPos = pageWidth - margin
    const rowData = [
      piece.edgeBandSides ? `${piece.edgeBandSides} צדדים` : '-',
      piece.quantity.toString(),
      `${piece.thicknessMm} מ״מ`,
      `${formatNumber(piece.heightCm)} ס״מ`,
      `${formatNumber(piece.widthCm)} ס״מ`,
      piece.name,
      (idx + 1).toString(),
    ]

    rowData.forEach((data, dataIdx) => {
      doc.text(data, xPos, yPos, { align: 'right', maxWidth: colWidths[dataIdx] })
      xPos -= colWidths[dataIdx]
    })

    yPos += 7
  })

  yPos += 10

  // פרזול
  if (result.hardware.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('פרזול:', pageWidth - margin, yPos, { align: 'right' })
    yPos += 10

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    result.hardware.forEach((hw) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      doc.text(
        `${hw.name} - ${hw.quantity} ${hw.unit}${hw.notes ? ` (${hw.notes})` : ''}`,
        pageWidth - margin,
        yPos,
        { align: 'right' }
      )
      yPos += 6
    })
  }

  // שמירה
  const fileName = `חיתוכים_${job.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
  doc.save(fileName)
}

function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    desk: 'שולחן מחשב',
    cabinet: 'ארון קיר',
    sideboard: 'מזנון',
    dresser: 'שידה',
    shelf: 'מדף',
    custom: 'מותאם אישית',
  }
  return labels[type] || type
}

function getMaterialLabel(material: string): string {
  const labels: Record<string, string> = {
    mdf: 'MDF',
    plywood: 'סנדוויץ',
    solid: 'עץ מלא',
  }
  return labels[material] || material
}

