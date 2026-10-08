import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingState } from '../components/StateViews'

export function ProtectedRoute({ role }) {
  const { isAuthenticated, role: currentRole } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && currentRole !== role) return <Navigate to={currentRole === 'ADMIN' ? '/admin' : '/app'} replace />
  return <Outlet />
}

export function AuthLoadingGuard() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <LoadingState label="Restoring your CivicFix session…" />
}
