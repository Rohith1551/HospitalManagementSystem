import { useState, useEffect, useMemo } from 'react'
import { patientAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { PageSpinner } from '../../components/common/Loader'
import PatientForm from '../../components/forms/PatientForm'
import { useToast } from '../../hooks/useToast'
import { useDebounce } from '../../hooks/useDebounce'

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const toast = useToast()

  const fetchPatients = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await patientAPI.getAll()
      setPatients(res.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filteredPatients = useMemo(() => {
    if (!debouncedSearch.trim()) return patients
    const q = debouncedSearch.toLowerCase()
    return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.problem?.toLowerCase().includes(q) ||
        p.user?.username?.toLowerCase().includes(q)
    )
  }, [patients, debouncedSearch])

  const handleCreate = () => {
    setEditingPatient(null)
    setModalOpen(true)
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setModalOpen(true)
  }

  const handleFormSuccess = () => {
    setModalOpen(false)
    setEditingPatient(null)
    fetchPatients()
  }

  const handleDeleteClick = (patient) => setDeleteTarget(patient)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await patientAPI.deletePatient(deleteTarget.id)
      toast.success('Patient deleted.')
      setDeleteTarget(null)
      fetchPatients()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'phone', label: 'Phone' },
    { key: 'problem', label: 'Problem' },
    {
      key: 'username',
      label: 'Username',
      render: (_, row) => row.user?.username ?? '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteClick(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage patients</p>
        </div>
        <Button onClick={handleCreate}>Add patient</Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <Card>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search by name, phone, problem, username…"
            className="form-input max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <PageSpinner />
        ) : (
          <Table
            columns={columns}
            data={filteredPatients}
            keyField="id"
            emptyMessage="No patients found. Add one to get started."
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPatient(null) }}
        title={editingPatient ? 'Edit patient' : 'Add patient'}
        size="lg"
      >
        <PatientForm
          initialData={editingPatient}
          onSuccess={handleFormSuccess}
          onCancel={() => { setModalOpen(false); setEditingPatient(null) }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete patient"
        message={deleteTarget ? `Are you sure you want to delete ${deleteTarget.name}?` : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
