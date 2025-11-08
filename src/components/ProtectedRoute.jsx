import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login, save intended location
    return <Navigate to="/login" state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
