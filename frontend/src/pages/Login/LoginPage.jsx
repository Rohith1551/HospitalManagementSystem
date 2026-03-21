import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useToast } from '../../hooks/useToast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const validate = () => {
    const next = {}
    if (!username?.trim()) next.username = 'Username is required.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})
    try {
      const { data } = await authAPI.login({ username: username.trim(), password })
      const token = typeof data === 'string' ? data : data?.token ?? data
      if (!token) throw new Error('No token received')
      login(token)
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // Log full error for debugging (status, response data)
      // The axios response interceptor attaches `.status` and `.data` on the Error.
      // Show backend-provided message when available so the user sees the real reason.
      // eslint-disable-next-line no-console
      console.error('Login error:', err)
      const backendMessage = err?.data?.message ?? err?.data ?? err?.message ?? 'Login failed'
      setErrors({ submit: backendMessage })
      // Also show a toast so it's noticeable
      try { toast.error(backendMessage) } catch (_) {}
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-lg">
          <h1 className="page-title text-center mb-2">Sign in</h1>
          <p className="page-subtitle text-center mb-6">Hospital Management System</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
                {errors.submit}
              </p>
            )}
            <Input
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              required
              autoComplete="username"
              autoFocus
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
