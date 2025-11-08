import axios from 'axios'

// Base URL for authentication API - update this with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token is expired and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { token, refreshToken: newRefreshToken } = response.data

          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', newRefreshToken)

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Mock data for fallback when backend is not available
const createMockUser = (userData) => ({
  id: Date.now(),
  ...userData
})

const createMockTokens = (user) => ({
  token: `mock-jwt-${user.id}-${Date.now()}`,
  refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
  user
})

// Authentication API service
export const authApi = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      // Fallback to mock authentication if backend not available
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.warn('Backend not available, using mock authentication')

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock validation
        if (email === 'user@example.com' && password === 'password') {
          const user = createMockUser({ email, name: 'Demo User' })
          return createMockTokens(user)
        } else {
          throw new Error('Invalid credentials')
        }
      }
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      // Fallback to mock registration if backend not available
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.warn('Backend not available, using mock registration')

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const user = createMockUser(userData)
        return createMockTokens(user)
      }
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile')
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post('/auth/refresh', { refreshToken })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token refresh failed')
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.warn('Server logout failed:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  },

  // Check if token is valid
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate')
      return response.data.valid
    } catch (error) {
      return false
    }
  }
}

export default authApi
