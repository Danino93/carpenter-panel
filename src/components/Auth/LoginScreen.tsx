import React, { useState } from 'react'
import { supabase, isSupabaseAvailable } from '../../services/supabase'

interface Props {
  onLoginSuccess: () => void
}

export const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (!isSupabaseAvailable()) {
      setError('מסד נתונים לא מוגדר. אנא הגדר Supabase לפי ההוראות ב-DATABASE_SETUP.md')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // התחברות
        const { data, error } = await supabase!.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          setMessage('התחברת בהצלחה!')
          setTimeout(() => onLoginSuccess(), 1000)
        }
      } else {
        // הרשמה
        if (password !== confirmPassword) {
          setError('הסיסמאות לא תואמות')
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError('הסיסמה חייבת להכיל לפחות 6 תווים')
          setLoading(false)
          return
        }

        const { data, error } = await supabase!.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        setMessage('נרשמת בהצלחה! נא לבדוק את האימייל לאימות (אם נדרש)')
        setTimeout(() => {
          setIsLogin(true)
          setMessage('')
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message || 'ארעה שגיאה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  // אם אין Supabase - אפשר לעבוד בלי התחברות (LocalStorage בלבד)
  if (!isSupabaseAvailable()) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🔒 פאנל נגרות</h1>
            <p className="muted">מערכת מקצועית לחישוב חומרים</p>
          </div>
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#fbbf24', marginBottom: '12px' }}>
              ⚠️ <strong>מצב מקומי</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '16px' }}>
              המערכת עובדת במצב מקומי בלבד. הנתונים נשמרים רק בדפדפן זה.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              להגדרת מסד נתונים והתחברות מאובטחת, עיין ב-<code>DATABASE_SETUP.md</code>
            </p>
          </div>
          <button
            className="wizard-btn-primary"
            onClick={onLoginSuccess}
            style={{ width: '100%' }}
          >
            המשך ללא התחברות
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔒 פאנל נגרות</h1>
          <p className="muted">מערכת מקצועית לחישוב חומרים</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true)
              setError('')
              setMessage('')
            }}
          >
            התחברות
          </button>
          <button
            className={`login-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false)
              setError('')
              setMessage('')
            }}
          >
            הרשמה
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>📧 אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label>🔑 סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="login-field">
              <label>🔑 אימות סיסמה</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="הזן שוב את הסיסמה"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="login-error">
              ❌ {error}
            </div>
          )}

          {message && (
            <div className="login-message">
              ✅ {message}
            </div>
          )}

          <button
            type="submit"
            className="wizard-btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isLogin ? 'מתחבר...' : 'נרשם...'}
              </>
            ) : (
              isLogin ? 'התחבר' : 'הירשם'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
            {isLogin ? (
              <>אין לך חשבון? <button type="button" onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>הירשם כאן</button></>
            ) : (
              <>יש לך כבר חשבון? <button type="button" onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>התחבר כאן</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

