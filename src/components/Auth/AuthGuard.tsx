import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseAvailable } from '../../services/supabase'
import { LoginScreen } from './LoginScreen'
import { User } from '@supabase/supabase-js'

interface Props {
  children: React.ReactNode
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    checkUser()

    // האזנה לשינויים במצב ההתחברות
    if (isSupabaseAvailable() && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setShowLogin(!session?.user)
      })

      return () => subscription.unsubscribe()
    } else {
      // אם אין Supabase - אפשר לעבוד בלי התחברות
      setLoading(false)
      setShowLogin(false)
    }
  }, [])

  const checkUser = async () => {
    if (!isSupabaseAvailable() || !supabase) {
      setLoading(false)
      setShowLogin(false)
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
      setShowLogin(!user)
    } catch (error) {
      console.error('Error checking user:', error)
      setShowLogin(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    checkUser()
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
      setShowLogin(true)
    }
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
      {user && (
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
          <span>👤 {user.email}</span>
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

