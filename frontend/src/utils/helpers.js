import { TOKEN_KEY, USER_KEY } from './constants'

// ---------------------------------------------------------------------------
// JWT
// ---------------------------------------------------------------------------

/**
 * Decode the payload from a JWT without verifying the signature.
 * Returns null on failure.
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json      = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Date / time
// Spring Boot's default Jackson serialisation for LocalDateTime can produce
// either an ISO-8601 string ("2024-06-15T10:30:00") or a numeric array
// ([2024, 6, 15, 10, 30, 0]). We handle both.
// ---------------------------------------------------------------------------

function fromValue(value) {
  if (!value) return null
  if (Array.isArray(value)) {
    // [year, month (1-based), day, hour, minute, second, nano?]
    const [y, mo, d, h = 0, mi = 0] = value
    return new Date(y, mo - 1, d, h, mi)
  }
  return new Date(value)
}

/** Format LocalDateTime value as "Jun 15, 2024 10:30 AM" */
export function formatDateTime(value) {
  const date = fromValue(value)
  if (!date || isNaN(date)) return 'N/A'
  return date.toLocaleString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

/** Format LocalDateTime value as "Jun 15, 2024" */
export function formatDate(value) {
  const date = fromValue(value)
  if (!date || isNaN(date)) return 'N/A'
  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  })
}

/**
 * Convert a <input type="datetime-local"> value ("2024-06-15T10:30")
 * to an ISO-8601 string the backend can deserialise into LocalDateTime.
 */
export function toISODateTime(datetimeLocalValue) {
  if (!datetimeLocalValue) return null
  return datetimeLocalValue.length === 16
    ? datetimeLocalValue + ':00'
    : datetimeLocalValue
}

// ---------------------------------------------------------------------------
// Strings
// ---------------------------------------------------------------------------

/** Get up to 2 uppercase initials from a name string */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Capitalise the first letter of each word */
export function titleCase(str) {
  return str
    ? str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : ''
}

// ---------------------------------------------------------------------------
// LocalStorage auth helpers
// ---------------------------------------------------------------------------

export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}
