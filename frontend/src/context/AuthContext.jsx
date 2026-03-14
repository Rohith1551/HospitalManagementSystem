import { createContext, useContext, useState, useCallback } from 'react'
import { parseJwt, saveAuth, clearAuth, getStoredToken, getStoredUser } from '../utils/helpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user,  setUser]  = useState(() => getStoredUser())

  /**
   * Call after receiving the JWT string from POST /auth/login.
   * Decodes the payload, persists to localStorage, and updates state.
   */
  const login = useCallback((jwtToken) => {
    const payload = parseJwt(jwtToken)
    if (!payload) throw new Error('Received an invalid token from the server.')

    const roles = Array.isArray(payload.roles) ? payload.roles : []
    const userData = {
      username:    payload.sub,
      roles,
      primaryRole: roles[0] ?? '',
    }

    setToken(jwtToken)
    setUser(userData)
    saveAuth(jwtToken, userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    clearAuth()
  }, [])

  const isAuthenticated = Boolean(token)
  const isAdmin         = user?.roles?.includes('ROLE_ADMIN')  ?? false
  const isDoctor        = user?.roles?.includes('ROLE_DOCTOR') ?? false
  const isPatient       = user?.roles?.includes('ROLE_PATIENT') ?? false

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isAdmin, isDoctor, isPatient, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/** Must be used inside <AuthProvider> */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
