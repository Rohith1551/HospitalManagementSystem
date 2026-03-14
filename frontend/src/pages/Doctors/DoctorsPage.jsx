import { useState, useEffect, useMemo } from 'react'
import { adminAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { PageSpinner } from '../../components/common/Loader'
import DoctorForm from '../../components/forms/DoctorForm'
import { useToast } from '../../hooks/useToast'
import { useDebounce } from '../../hooks/useDebounce'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const toast = useToast()

  const fetchDoctors = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminAPI.getDoctors()
      setDoctors(res.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const filteredDoctors = useMemo(() => {
    if (!debouncedSearch.trim()) return doctors
    const q = debouncedSearch.toLowerCase()
    return doctors.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.specialization?.toLowerCase().includes(q) ||
        d.phone?.toLowerCase().includes(q) ||
        d.user?.username?.toLowerCase().includes(q)
    )
  }, [doctors, debouncedSearch])

  const handleCreate = () => {
    setEditingDoctor(null)
    setModalOpen(true)
  }

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor)
    setModalOpen(true)
  }

  const handleFormSuccess = () => {
    setModalOpen(false)
    setEditingDoctor(null)
    fetchDoctors()
  }

  const handleDeleteClick = (doctor) => setDeleteTarget(doctor)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await adminAPI.deleteDoctor(deleteTarget.id)
      toast.success('Doctor deleted.')
      setDeleteTarget(null)
      fetchDoctors()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'phone', label: 'Phone' },
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
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">Manage doctors</p>
        </div>
        <Button onClick={handleCreate}>Add doctor</Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <Card>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search by name, specialization, phone, username..."
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
            data={filteredDoctors}
            keyField="id"
            emptyMessage="No doctors found. Add one to get started."
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingDoctor(null) }}
        title={editingDoctor ? 'Edit doctor' : 'Add doctor'}
        size="md"
      >
        <DoctorForm
          initialData={editingDoctor}
          onSuccess={handleFormSuccess}
          onCancel={() => { setModalOpen(false); setEditingDoctor(null) }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete doctor"
        message={deleteTarget ? `Are you sure you want to delete ${deleteTarget.name}?` : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
