import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layout
import Layout from '../components/layout/Layout'

// Pages
import LoginPage        from '../pages/Login/LoginPage'
import RegisterPage     from '../pages/Register/RegisterPage'
import DashboardPage    from '../pages/Dashboard/DashboardPage'
import DoctorsPage      from '../pages/Doctors/DoctorsPage'
import PatientsPage     from '../pages/Patients/PatientsPage'
import AppointmentsPage from '../pages/Appointments/AppointmentsPage'
import ProfilePage      from '../pages/Profile/ProfilePage'
import NotFoundPage     from '../pages/NotFound/NotFoundPage'

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/** Redirects unauthenticated users to /login */
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.some(r => user?.roles?.includes(r))) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/** Redirects already-authenticated users away from login / register */
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* ── Protected (wrapped in sidebar/navbar Layout) ── */}
      <Route
        path="/"
        element={<ProtectedRoute><Layout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* All roles */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile"   element={<ProfilePage />} />

        {/* Admin only */}
        <Route
          path="doctors"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="patients"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin, Doctor, Patient – patients see only their own appointments */}
        <Route
          path="appointments"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT']}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
