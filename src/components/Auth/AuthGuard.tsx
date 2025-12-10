import React, { useState, useEffect } from 'react'
import { isAuthenticated, getCurrentUsername, logout } from '../../services/localAuth'
import { LoginScreen } from './LoginScreen'

interface Props {
  children: React.ReactNode
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = () => {
    try {
      const authenticated = isAuthenticated()
      const currentUsername = getCurrentUsername()
      
      setUsername(currentUsername)
      setShowLogin(!authenticated)
    } catch (error) {
      console.error('Error checking user:', error)
      setShowLogin(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    checkUser()
  }

  const handleLogout = () => {
    logout()
    setUsername(null)
    setShowLogin(true)
  }

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="spinner" style={{ margin: '40px auto' }}></div>
          <p className="muted" style={{ textAlign: 'center' }}>טוען...</p>
        </div>
      </div>
    )
  }

  if (showLogin) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <>
      {username && (
        <div style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '12px',
          padding: '8px 16px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>👤 {username}</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            התנתק
          </button>
        </div>
      )}
      {children}
    </>
  )
}

