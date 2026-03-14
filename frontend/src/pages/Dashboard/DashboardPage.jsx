import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminAPI, doctorAPI, patientAPI, appointmentAPI } from '../../services/api'
import Card from '../../components/common/Card'
import { PageSpinner } from '../../components/common/Loader'
import { formatDateTime } from '../../utils/helpers'
import { STATUS_BADGE } from '../../utils/constants'

export default function DashboardPage() {
  const { user, isAdmin, isDoctor } = useAuth()
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (isAdmin) {
          const [docRes, patRes, appRes] = await Promise.all([
            adminAPI.getDoctors(),
            patientAPI.getAll(),
            appointmentAPI.getAll(),
          ])
          if (!cancelled) {
            setStats({
              doctors: docRes.data?.length ?? 0,
              patients: patRes.data?.length ?? 0,
              appointments: appRes.data?.length ?? 0,
            })
            const list = appRes.data ?? []
            setRecentAppointments(list.slice(0, 5))
          }
        } else if (isDoctor) {
          const appRes = await doctorAPI.getAppointments()
          const list = appRes.data ?? []
          if (!cancelled) {
            setStats({ appointments: list.length })
            setRecentAppointments(list.slice(0, 5))
          }
        } else {
          setRecentAppointments([])
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [isAdmin, isDoctor])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.username}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding>
            <p className="text-slate-500 text-sm">Doctors</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.doctors}</p>
          </Card>
          <Card padding>
            <p className="text-slate-500 text-sm">Patients</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.patients}</p>
          </Card>
          <Card padding>
            <p className="text-slate-500 text-sm">Appointments</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.appointments}</p>
          </Card>
        </div>
      )}

      {isDoctor && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding>
            <p className="text-slate-500 text-sm">My appointments</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.appointments}</p>
          </Card>
        </div>
      )}

      <Card title="Recent appointments" subtitle={recentAppointments.length ? '' : 'No appointments yet.'}>
        {recentAppointments.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent appointments to show.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentAppointments.map((apt) => (
              <li key={apt.id} className="py-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-medium text-slate-800">
                  {apt.patient?.name ?? 'Patient'} with {apt.doctor?.name ?? 'Doctor'}
                </span>
                <span className="text-slate-500">{formatDateTime(apt.appointmentTime)}</span>
                <span className={STATUS_BADGE[apt.status] ?? 'badge-slate'}>{apt.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
