import { useState, useEffect } from 'react'
import Button from '../common/Button'
import { adminAPI, appointmentAPI } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { toISODateTime } from '../../utils/helpers'

/**
 * Form to create an appointment: select patient, doctor, and datetime.
 * Requires doctors and patients lists (e.g. from parent).
 */
export default function AppointmentForm({ doctors = [], patients = [], onSuccess, onCancel }) {
  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const validate = () => {
    const next = {}
    if (!patientId) next.patientId = 'Please select a patient.'
    if (!doctorId) next.doctorId = 'Please select a doctor.'
    if (!appointmentTime?.trim()) next.appointmentTime = 'Appointment date and time is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})
    try {
      const isoTime = toISODateTime(appointmentTime)
      await appointmentAPI.create(Number(patientId), Number(doctorId), {
        appointmentTime: isoTime,
      })
      toast.success('Appointment created successfully.')
      onSuccess?.()
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  // Default to next hour
  useEffect(() => {
    if (!appointmentTime) {
      const d = new Date()
      d.setHours(d.getHours() + 1)
      d.setMinutes(0)
      setAppointmentTime(d.toISOString().slice(0, 16))
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
          {errors.submit}
        </p>
      )}
      <div>
        <label className="form-label">Patient <span className="text-red-500">*</span></label>
        <select
          className="form-select"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          aria-invalid={!!errors.patientId}
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.user?.username ? `(${p.user.username})` : ''}
            </option>
          ))}
        </select>
        {errors.patientId && <p className="form-error">{errors.patientId}</p>}
      </div>
      <div>
        <label className="form-label">Doctor <span className="text-red-500">*</span></label>
        <select
          className="form-select"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          aria-invalid={!!errors.doctorId}
        >
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} – {d.specialization}
            </option>
          ))}
        </select>
        {errors.doctorId && <p className="form-error">{errors.doctorId}</p>}
      </div>
      <div>
        <label className="form-label">Date & time <span className="text-red-500">*</span></label>
        <input
          type="datetime-local"
          className="form-input"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          aria-invalid={!!errors.appointmentTime}
        />
        {errors.appointmentTime && <p className="form-error">{errors.appointmentTime}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Create appointment
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
