import React, { useState } from 'react'
import { login } from '../../services/localAuth'

interface Props {
  onLoginSuccess: () => void
}

export const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const result = await login(username, password)
      
      if (!result.success) {
        setError(result.error || 'ארעה שגיאה בהתחברות')
        setLoading(false)
        return
      }

      setMessage('התחברת בהצלחה!')
      setTimeout(() => onLoginSuccess(), 1000)
    } catch (err: any) {
      setError(err.message || 'ארעה שגיאה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔒 פאנל נגרות</h1>
          <p className="muted">מערכת מקצועית לחישוב חומרים</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>👤 שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="הזן שם משתמש"
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
              placeholder="הזן סיסמה"
              required
            />
          </div>

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
                מתחבר...
              </>
            ) : (
              'התחבר'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
            הנתונים נשמרים מקומית על המכשיר שלך בלבד 🔒
          </p>
        </div>
      </div>
    </div>
  )
}

