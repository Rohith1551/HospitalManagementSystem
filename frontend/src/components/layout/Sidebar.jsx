import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../utils/constants'
import { getInitials } from '../../utils/helpers'

// ---------------------------------------------------------------------------
// Inline SVG icons (no external dependency)
// ---------------------------------------------------------------------------
const Icon = {
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Stethoscope: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Cross: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
}

// ---------------------------------------------------------------------------
// Nav items per role
// ---------------------------------------------------------------------------
const ALL_NAV = [
  { to: '/dashboard',    label: 'Dashboard',    Icon: Icon.Home,        roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'] },
  { to: '/doctors',      label: 'Doctors',      Icon: Icon.Stethoscope, roles: ['ROLE_ADMIN'] },
  { to: '/patients',     label: 'Patients',     Icon: Icon.Users,       roles: ['ROLE_ADMIN'] },
  { to: '/appointments', label: 'Appointments', Icon: Icon.Calendar,    roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'] },
  { to: '/profile',      label: 'My Profile',   Icon: Icon.User,        roles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'] },
]

export default function Sidebar({ onClose }) {
  const { user } = useAuth()
  const userRoles = user?.roles ?? []

  const navItems = ALL_NAV.filter(item =>
    item.roles.some(r => userRoles.includes(r))
  )

  const primaryRole = userRoles[0] ?? ''

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-slate-100 shadow-sm">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white shadow">
          <Icon.Cross />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">HMS</p>
          <p className="text-[11px] text-slate-400 leading-tight">Hospital Management</p>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, Icon: NavIcon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link${isActive ? ' active' : ''}`
            }
          >
            <NavIcon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User badge ── */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
            {getInitials(user?.username)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">{user?.username}</p>
            <p className="text-xs text-slate-400">{ROLE_LABELS[primaryRole] ?? primaryRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
