// מערכת התחברות מקומית - שם משתמש וסיסמה קבועים
// הנתונים נשמרים ב-LocalStorage על הטלפון

const USER_STORAGE_KEY = 'carpenter_panel_user'
const SESSION_KEY = 'carpenter_panel_session'

// שם משתמש וסיסמה קבועים
const FIXED_USERNAME = 'טביעת עץ'
const FIXED_PASSWORD = '151548151548'

// התחברות
export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  // בדיקה נגד הערכים הקבועים
  if (username.trim() !== FIXED_USERNAME) {
    return { success: false, error: 'שם משתמש או סיסמה שגויים' }
  }

  if (password !== FIXED_PASSWORD) {
    return { success: false, error: 'שם משתמש או סיסמה שגויים' }
  }

  // שמירת מצב התחברות
  localStorage.setItem(USER_STORAGE_KEY, FIXED_USERNAME)
  localStorage.setItem(SESSION_KEY, 'authenticated')
  
  return { success: true }
}

// בדיקה אם המשתמש מחובר
export function isAuthenticated(): boolean {
  return localStorage.getItem(SESSION_KEY) === 'authenticated' && !!localStorage.getItem(USER_STORAGE_KEY)
}

// קבלת שם המשתמש הנוכחי
export function getCurrentUsername(): string | null {
  if (isAuthenticated()) {
    return FIXED_USERNAME
  }
  return null
}

// התנתקות
export function logout(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(SESSION_KEY)
}

// איפוס כל הנתונים (מחיקת כל הנתונים)
export function resetAllData(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(SESSION_KEY)
  // מחיקת כל הנתונים האחרים
  localStorage.removeItem('carpenter_panel_jobs')
  localStorage.removeItem('carpenter_panel_pricing')
  localStorage.removeItem('carpenter_panel_customers')
  localStorage.removeItem('carpenter_panel_templates')
}

