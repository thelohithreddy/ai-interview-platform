import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './ui/Loader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: 'var(--app-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Loader />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
