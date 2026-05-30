import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'ai_interviewer_session'
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session?.user || !session?.expiresAt) return null
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session.user
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

function writeSession(user) {
  const session = { user, expiresAt: Date.now() + SESSION_TTL }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = readSession()
    setUser(savedUser)
    setLoading(false)
  }, [])

  const login = useCallback((userData) => {
    const safeUser = {
      name:  String(userData.name  ?? '').trim(),
      email: String(userData.email ?? '').trim().toLowerCase(),
      joinedAt: userData.joinedAt ?? new Date().toISOString(),
    }
    setUser(safeUser)
    writeSession(safeUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...patch }
      writeSession(updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}