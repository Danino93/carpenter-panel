/**
 * פורמט מספר עם פסיקים (1,234)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('he-IL').format(Math.round(num))
}

/**
 * פורמט מספר עם פסיקים ועם עשרוניים (1,234.56)
 */
export function formatNumberWithDecimals(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('he-IL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * פורמט כסף (₪ 1,234)
 */
export function formatCurrency(num: number): string {
  return `₪ ${formatNumber(num)}`
}

