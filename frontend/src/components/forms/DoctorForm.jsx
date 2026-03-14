import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { adminAPI } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { SPECIALIZATIONS } from '../../utils/constants'

const initialValues = {
  username: '',
  password: '',
  name: '',
  specialization: '',
  phone: '',
}

/**
 * Form to create or edit a doctor.
 * For edit, pass initialData (without password) and omit password requirement.
 */
export default function DoctorForm({ initialData, onSuccess, onCancel }) {
  const isEdit = Boolean(initialData?.id)
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          name: initialData.name ?? '',
          specialization: initialData.specialization ?? '',
          phone: initialData.phone ?? '',
        }
      : { ...initialValues }
  )
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const next = {}
    if (!form.name?.trim()) next.name = 'Name is required.'
    if (!form.specialization?.trim()) next.specialization = 'Specialization is required.'
    if (!form.phone?.trim()) next.phone = 'Phone is required.'
    if (!isEdit) {
      if (!form.username?.trim()) next.username = 'Username is required.'
      if (!form.password) next.password = 'Password is required.'
      if (form.password && form.password.length < 4) next.password = 'Password must be at least 4 characters.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})
    try {
      if (isEdit) {
        await adminAPI.updateDoctor(initialData.id, {
          name: form.name.trim(),
          specialization: form.specialization.trim(),
          phone: form.phone.trim(),
        })
        toast.success('Doctor updated successfully.')
      } else {
        await adminAPI.createDoctor({
          username: form.username.trim(),
          password: form.password,
          name: form.name.trim(),
          specialization: form.specialization.trim(),
          phone: form.phone.trim(),
        })
        toast.success('Doctor created successfully.')
      }
      onSuccess?.()
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
          {errors.submit}
        </p>
      )}
      {!isEdit && (
        <>
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            error={errors.username}
            required
            autoComplete="username"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
            required
            autoComplete="new-password"
          />
        </>
      )}
      <Input
        label="Full name"
        name="name"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        required
      />
      <div>
        <label className="form-label">Specialization <span className="text-red-500">*</span></label>
        <select
          className="form-select"
          value={form.specialization}
          onChange={(e) => update('specialization', e.target.value)}
          aria-invalid={!!errors.specialization}
        >
          <option value="">Select specialization</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.specialization && <p className="form-error">{errors.specialization}</p>}
      </div>
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
        error={errors.phone}
        required
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update doctor' : 'Create doctor'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
