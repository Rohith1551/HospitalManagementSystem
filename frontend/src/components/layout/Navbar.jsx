import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'

const ROUTE_TITLES = {
  '/dashboard':    'Dashboard',
  '/doctors':      'Doctors',
  '/patients':     'Patients',
  '/appointments': 'Appointments',
  '/profile':      'My Profile',
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const location          = useLocation()
  const toast             = useToast()

  const title = ROUTE_TITLES[location.pathname] ?? 'Hospital Management System'

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger — visible on mobile */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* User chip */}
        <span className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium text-slate-700">{user?.username}</span>
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn-secondary btn-sm flex items-center gap-1.5"
          title="Log out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
