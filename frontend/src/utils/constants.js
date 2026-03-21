/** Backend base URL (Spring Boot runs on 8090) */
export const API_BASE_URL = "http://100.53.137.254:8090";
/** LocalStorage keys */
export const TOKEN_KEY = 'hms_token'
export const USER_KEY  = 'hms_user'

/** Role constants (match Spring Security role names) */
export const ROLES = {
  ADMIN:   'ROLE_ADMIN',
  DOCTOR:  'ROLE_DOCTOR',
  PATIENT: 'ROLE_PATIENT',
}

/** Human-readable role labels */
export const ROLE_LABELS = {
  ROLE_ADMIN:   'Administrator',
  ROLE_DOCTOR:  'Doctor',
  ROLE_PATIENT: 'Patient',
}

/** Appointment status values (match Java enum) */
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

/** Tailwind badge variant per status */
export const STATUS_BADGE = {
  SCHEDULED: 'badge-blue',
  COMPLETED: 'badge-green',
  CANCELLED: 'badge-red',
}

/** Medical specializations list */
export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Geriatrics',
  'Hematology',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Surgery',
  'Urology',
]
