import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, loginUser, normalizeSession, normalizeUser, registerUser } from '../api/auth'
import { clearSession, readSession, writeSession } from '../api/client'

const AuthContext = createContext(null)

function roleFrom(session, user) {
  return String(session?.role || user?.role || user?.user_type || user?.type || '').toUpperCase()
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => readSession())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) writeSession(session)
  }, [session])

  useEffect(() => {
    function handleUnauthorized() {
      setSession(null)
      navigate('/login', { replace: true, state: { sessionExpired: true } })
    }
    window.addEventListener('civicfix:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('civicfix:unauthorized', handleUnauthorized)
  }, [navigate])

  async function login(credentials) {
    setIsLoading(true)
    try {
      const raw = await loginUser(credentials)
      let next = normalizeSession(raw)
      if (!next.role) {
        try {
          const profile = normalizeUser(await getProfile())
          next = { ...next, user: profile, role: roleFrom(next, profile) }
        } catch {
          // Preserve token-only responses so the backend can still be adjusted in src/api.
        }
      }
      if (!next.role) throw new Error('The backend login response did not include a CITIZEN or ADMIN role.')
      setSession(next)
      writeSession(next)
      return next
    } finally {
      setIsLoading(false)
    }
  }

  async function register(payload) {
    setIsLoading(true)
    try {
      return await registerUser(payload)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    clearSession()
    setSession(null)
  }

  const user = session?.user || session?.account || session?.profile || session
  const role = roleFrom(session, user)
  const value = useMemo(() => ({ session, user, role, isLoading, isAuthenticated: Boolean(session), login, register, logout }), [session, user, role, isLoading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
