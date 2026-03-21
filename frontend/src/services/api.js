import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../utils/constants'

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ---------------------------------------------------------------------------
// Request interceptor — attach Bearer token
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ---------------------------------------------------------------------------
// Response interceptor — global error handling
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const data    = error.response?.data

    // No response = request never reached server (backend down, wrong URL, CORS, or network)
    const isNetworkError = !error.response

    // Spring Boot usually returns JSON like: { message: "...", status: 500, ... }
    const message =
      isNetworkError
        ? 'Cannot reach the server. Is the backend running at http://localhost:8090?'
        : typeof data === 'object' && data?.message
          ? data.message
          : typeof data === 'string' && data.length < 200
            ? data
            : error.message ?? 'An unexpected error occurred.'

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please log in again.')
        setTimeout(() => { window.location.href = '/login' }, 1200)
      }
    } else if (status === 403) {
      toast.error('Access denied — you do not have permission for this action.')
    } else if (status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (isNetworkError) {
      toast.error('Cannot reach the server. Is the backend running at http://localhost:8090?')
    }

    // Preserve status and response data on the rejected Error so callers
    // (pages/components) can inspect the HTTP status and backend message.
    const err = new Error(message)
    if (status) err.status = status
    if (data)   err.data = data
    return Promise.reject(err)
  },
)

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authAPI = {
  /** POST /auth/login  →  JWT string */
  login:    (body) => api.post('/auth/login', body),
  /** POST /auth/register  →  "User registered successfully" */
  register: (body) => api.post('/auth/register', body),
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const adminAPI = {
  /** GET /admin/doctors */
  getDoctors: () => api.get('/admin/doctors'),
  /** POST /admin/create-doctor */
  createDoctor: (body) => api.post('/admin/create-doctor', body),
  /** PUT /admin/doctor/{id} */
  updateDoctor: (id, body) => api.put(`/admin/doctor/${id}`, body),
  /** DELETE /admin/doctor/{id} */
  deleteDoctor: (id) => api.delete(`/admin/doctor/${id}`),
  /** POST /admin/create-patient */
  createPatient: (body) => api.post('/admin/create-patient', body),
  /** POST /admin/assign-appointment */
  assignAppointment: (body) => api.post('/admin/assign-appointment', body),
}

// ---------------------------------------------------------------------------
// Doctor
// ---------------------------------------------------------------------------
export const doctorAPI = {
  /** GET /doctor/profile */
  getProfile: () => api.get('/doctor/profile'),
  /** GET /doctor/appointments */
  getAppointments: () => api.get('/doctor/appointments'),
  /**
   * PUT /doctor/appointment/{id}/status?status=SCHEDULED|COMPLETED|CANCELLED
   * Uses request-param (not body) as the backend expects @RequestParam
   */
  updateAppointmentStatus: (id, status) =>
    api.put(`/doctor/appointment/${id}/status`, null, { params: { status } }),
}

// ---------------------------------------------------------------------------
// Patient
// ---------------------------------------------------------------------------
export const patientAPI = {
  /** GET /patient/profile  (ROLE_PATIENT) */
  getProfile: () => api.get('/patient/profile'),
  /** GET /patient/{id}     (ROLE_ADMIN) */
  getById:    (id) => api.get(`/patient/${id}`),
  /** GET /patient/all      (ROLE_ADMIN) */
  getAll:     () => api.get('/patient/all'),
  /** PUT /patient/{id}     (ROLE_ADMIN) */
  updatePatient: (id, body) => api.put(`/patient/${id}`, body),
  /** DELETE /patient/{id}  (ROLE_ADMIN) */
  deletePatient: (id) => api.delete(`/patient/${id}`),
}

// ---------------------------------------------------------------------------
// Appointment
// ---------------------------------------------------------------------------
export const appointmentAPI = {
  /** POST /appointment/patient/{patientId}/doctor/{doctorId} (ROLE_ADMIN) */
  create: (patientId, doctorId, body) =>
    api.post(`/appointment/patient/${patientId}/doctor/${doctorId}`, body),
  /** GET /appointment/all          (ROLE_ADMIN) */
  getAll: () => api.get('/appointment/all'),
  /** GET /appointment/{id}         (ROLE_ADMIN) */
  getById: (id) => api.get(`/appointment/${id}`),
  /** GET /appointment/doctor/{id}  (ROLE_ADMIN | ROLE_DOCTOR) */
  getByDoctor: (doctorId) => api.get(`/appointment/doctor/${doctorId}`),
  /** GET /appointment/patient/{id} (ROLE_ADMIN) */
  getByPatient: (patientId) => api.get(`/appointment/patient/${patientId}`),
  /** GET /appointment/me – current patient's appointments (ROLE_PATIENT) */
  getMyAppointments: () => api.get('/appointment/me'),
  /** PUT /appointment/{id} – update appointment time (ROLE_ADMIN) */
  update: (id, body) => api.put(`/appointment/${id}`, body),
  /**
   * PUT /appointment/{id}/status?status=...
   * (ROLE_ADMIN | ROLE_DOCTOR)
   */
  updateStatus: (id, status) =>
    api.put(`/appointment/${id}/status`, null, { params: { status } }),
  /** DELETE /appointment/{id}      (ROLE_ADMIN) */
  delete: (id) => api.delete(`/appointment/${id}`),
}

export default api
