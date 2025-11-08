import { createContext, useContext, useReducer, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authApi } from '../services/authApi'

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, user: null, isAuthenticated: false }
    case 'REGISTER_START':
      return { ...state, loading: true, error: null }
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null }
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload, user: null, isAuthenticated: false }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

// Context
const AuthContext = createContext()

// Provider
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for persisted auth on load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || 'null')

      if (token && user) {
        // Check if token is still valid
        if (!isTokenExpired(token)) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        } else {
          // Try to refresh token
          try {
            const refreshResult = await authApi.refreshToken()
            localStorage.setItem('token', refreshResult.token)
            localStorage.setItem('refreshToken', refreshResult.refreshToken)
            dispatch({ type: 'LOGIN_SUCCESS', payload: user })
          } catch (error) {
            // Refresh failed, clear auth
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            dispatch({ type: 'LOGOUT' })
          }
        }
      }
    }

    initializeAuth()
  }, [])

  // Actions
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authApi.login(email, password)

      // Store tokens and user data
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))

      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message })
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' })
    try {
      const response = await authApi.register(userData)

      // Store tokens and user data
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))

      dispatch({ type: 'REGISTER_SUCCESS', payload: response.user })
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error.message })
    }
  }

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await authApi.logout()
    } catch (error) {
      console.warn('Logout error:', error)
    } finally {
      // Always clear local storage regardless of API call result
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' })

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
