import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { adminAPI, patientAPI } from '../../services/api'
import { useToast } from '../../hooks/useToast'

const initialValues = {
  username: '',
  password: '',
  name: '',
  age: '',
  phone: '',
  problem: '',
  medicalHistory: '',
}

/**
 * Form to create or edit a patient.
 * For edit, pass initialData (without password).
 */
export default function PatientForm({ initialData, onSuccess, onCancel }) {
  const isEdit = Boolean(initialData?.id)
  const [form, setForm] = useState(() =>
    isEdit
      ? {
          name: initialData.name ?? '',
          age: String(initialData.age ?? ''),
          phone: initialData.phone ?? '',
          problem: initialData.problem ?? '',
          medicalHistory: initialData.medicalHistory ?? '',
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
    if (!form.phone?.trim()) next.phone = 'Phone is required.'
    const ageNum = parseInt(form.age, 10)
    if (!form.age?.trim()) next.age = 'Age is required.'
    else if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) next.age = 'Enter a valid age (0–150).'
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
        await patientAPI.updatePatient(initialData.id, {
          name: form.name.trim(),
          age: parseInt(form.age, 10),
          phone: form.phone.trim(),
          problem: form.problem?.trim() ?? '',
          medicalHistory: form.medicalHistory?.trim() ?? '',
        })
        toast.success('Patient updated successfully.')
      } else {
        await adminAPI.createPatient({
          username: form.username.trim(),
          password: form.password,
          name: form.name.trim(),
          age: parseInt(form.age, 10),
          phone: form.phone.trim(),
          problem: form.problem?.trim() ?? '',
          medicalHistory: form.medicalHistory?.trim() ?? '',
        })
        toast.success('Patient created successfully.')
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
      <Input
        label="Age"
        name="age"
        type="number"
        min={0}
        max={150}
        value={form.age}
        onChange={(e) => update('age', e.target.value)}
        error={errors.age}
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
        error={errors.phone}
        required
      />
      <Input
        label="Problem / chief complaint"
        name="problem"
        value={form.problem}
        onChange={(e) => update('problem', e.target.value)}
        placeholder="Brief description"
      />
      <Input
        label="Medical history"
        name="medicalHistory"
        type="textarea"
        rows={3}
        value={form.medicalHistory}
        onChange={(e) => update('medicalHistory', e.target.value)}
        placeholder="Optional"
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update patient' : 'Create patient'}
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
