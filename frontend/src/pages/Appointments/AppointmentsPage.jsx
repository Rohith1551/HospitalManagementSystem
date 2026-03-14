import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminAPI, patientAPI, appointmentAPI, doctorAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { PageSpinner } from '../../components/common/Loader'
import AppointmentForm from '../../components/forms/AppointmentForm'
import { useToast } from '../../hooks/useToast'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDateTime } from '../../utils/helpers'
import { STATUS_BADGE, APPOINTMENT_STATUS } from '../../utils/constants'

const PAGE_SIZE = 10

export default function AppointmentsPage() {
  const { isAdmin, isDoctor } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterDoctor, setFilterDoctor] = useState('')
  const [filterPatient, setFilterPatient] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const toast = useToast()

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      if (isAdmin) {
        const res = await appointmentAPI.getAll()
        setAppointments(res.data ?? [])
      } else if (isDoctor) {
        const profileRes = await doctorAPI.getProfile()
        const doctorId = profileRes.data?.id
        if (doctorId) {
          const res = await appointmentAPI.getByDoctor(doctorId)
          setAppointments(res.data ?? [])
        } else {
          setAppointments([])
        }
      } else {
        setAppointments([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorsAndPatients = async () => {
    if (!isAdmin) return
    try {
      const [docRes, patRes] = await Promise.all([
        adminAPI.getDoctors(),
        patientAPI.getAll(),
      ])
      setDoctors(docRes.data ?? [])
      setPatients(patRes.data ?? [])
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [isAdmin, isDoctor])

  useEffect(() => {
    fetchDoctorsAndPatients()
  }, [isAdmin])

  const filtered = useMemo(() => {
    let list = appointments
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (a) =>
          a.patient?.name?.toLowerCase().includes(q) ||
          a.doctor?.name?.toLowerCase().includes(q)
      )
    }
    if (filterDoctor) list = list.filter((a) => String(a.doctor?.id) === filterDoctor)
    if (filterPatient) list = list.filter((a) => String(a.patient?.id) === filterPatient)
    if (filterStatus) list = list.filter((a) => a.status === filterStatus)
    return list
  }, [appointments, debouncedSearch, filterDoctor, filterPatient, filterStatus])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1

  const handleFormSuccess = () => {
    setModalOpen(false)
    fetchAppointments()
  }

  const handleCancelClick = (apt) => setCancelTarget(apt)

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return
    setCancelLoading(true)
    try {
      await appointmentAPI.updateStatus(cancelTarget.id, APPOINTMENT_STATUS.CANCELLED)
      toast.success('Appointment cancelled.')
      setCancelTarget(null)
      fetchAppointments()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCancelLoading(false)
    }
  }

  const handleDeleteClick = (apt) => setDeleteTarget(apt)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await appointmentAPI.delete(deleteTarget.id)
      toast.success('Appointment deleted.')
      setDeleteTarget(null)
      fetchAppointments()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      render: (_, row) => row.patient?.name ?? '—',
    },
    {
      key: 'doctor',
      label: 'Doctor',
      render: (_, row) => row.doctor?.name ?? '—',
    },
    {
      key: 'appointmentTime',
      label: 'Date & time',
      render: (val) => formatDateTime(val),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <span className={STATUS_BADGE[val] ?? 'badge-slate'}>{val}</span>,
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
              <div className="flex gap-2">
                {row.status === APPOINTMENT_STATUS.SCHEDULED && (
                  <Button size="sm" variant="danger" onClick={() => handleCancelClick(row)}>
                    Cancel
                  </Button>
                )}
                <Button size="sm" variant="danger" onClick={() => handleDeleteClick(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : [
          {
            key: 'actions',
            label: 'Actions',
            render: (_, row) =>
              row.status === APPOINTMENT_STATUS.SCHEDULED ? (
                <Button size="sm" variant="danger" onClick={() => handleCancelClick(row)}>
                  Cancel
                </Button>
              ) : null,
          },
        ]),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">{isAdmin ? 'Manage appointments' : 'Your appointments'}</p>
        </div>
        {isAdmin && <Button onClick={() => setModalOpen(true)}>New appointment</Button>}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="search"
            placeholder="Search patient or doctor…"
            className="form-input w-full sm:max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin && (
            <>
              <select
                className="form-select w-full sm:w-auto"
                value={filterDoctor}
                onChange={(e) => { setFilterDoctor(e.target.value); setPage(1) }}
              >
                <option value="">All doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                className="form-select w-full sm:w-auto"
                value={filterPatient}
                onChange={(e) => { setFilterPatient(e.target.value); setPage(1) }}
              >
                <option value="">All patients</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </>
          )}
          <select
            className="form-select w-full sm:w-auto"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          >
            <option value="">All statuses</option>
            <option value={APPOINTMENT_STATUS.SCHEDULED}>Scheduled</option>
            <option value={APPOINTMENT_STATUS.COMPLETED}>Completed</option>
            <option value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>

        {loading ? (
          <PageSpinner />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginated}
              keyField="id"
              emptyMessage="No appointments found."
            />
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
                <span>
                  Page {page} of {totalPages} ({filtered.length} total)
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {isAdmin && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New appointment" size="md">
          <AppointmentForm
            doctors={doctors}
            patients={patients}
            onSuccess={handleFormSuccess}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel appointment"
        message={cancelTarget ? 'Mark this appointment as cancelled?' : ''}
        confirmLabel="Cancel appointment"
        variant="danger"
        loading={cancelLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete appointment"
        message={deleteTarget ? 'Permanently delete this appointment?' : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
