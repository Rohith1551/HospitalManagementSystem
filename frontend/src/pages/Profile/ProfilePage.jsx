import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { doctorAPI, patientAPI } from '../../services/api'
import Card from '../../components/common/Card'
import { PageSpinner } from '../../components/common/Loader'
import { ROLE_LABELS } from '../../utils/constants'

export default function ProfilePage() {
  const { user, isDoctor, isPatient } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (isDoctor) {
          const res = await doctorAPI.getProfile()
          if (!cancelled) setProfile(res.data)
        } else if (isPatient) {
          const res = await patientAPI.getProfile()
          if (!cancelled) setProfile(res.data)
        } else {
          if (!cancelled) setProfile({ username: user?.username, role: 'Admin' })
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.username, isDoctor, isPatient])

  if (loading) return <PageSpinner />

  const primaryRole = user?.roles?.[0] ?? ''
  const roleLabel = ROLE_LABELS[primaryRole] ?? primaryRole

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Your account and role information</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <Card title="Account">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-slate-500 font-medium">Username</dt>
            <dd className="text-slate-800">{user?.username ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Role</dt>
            <dd className="text-slate-800">{roleLabel}</dd>
          </div>
        </dl>
      </Card>

      {profile && (profile.name !== undefined || profile.id) && (
        <Card title={isDoctor ? 'Doctor profile' : 'Patient profile'}>
          <dl className="space-y-3 text-sm">
            {profile.name != null && (
              <div>
                <dt className="text-slate-500 font-medium">Name</dt>
                <dd className="text-slate-800">{profile.name}</dd>
              </div>
            )}
            {isDoctor && profile.specialization != null && (
              <div>
                <dt className="text-slate-500 font-medium">Specialization</dt>
                <dd className="text-slate-800">{profile.specialization}</dd>
              </div>
            )}
            {profile.phone != null && (
              <div>
                <dt className="text-slate-500 font-medium">Phone</dt>
                <dd className="text-slate-800">{profile.phone}</dd>
              </div>
            )}
            {isPatient && profile.age != null && (
              <div>
                <dt className="text-slate-500 font-medium">Age</dt>
                <dd className="text-slate-800">{profile.age}</dd>
              </div>
            )}
            {isPatient && profile.problem != null && profile.problem !== '' && (
              <div>
                <dt className="text-slate-500 font-medium">Problem</dt>
                <dd className="text-slate-800">{profile.problem}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}
    </div>
  )
}
