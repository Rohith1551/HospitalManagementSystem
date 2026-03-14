import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="text-slate-600 mt-2">Page not found</p>
      <p className="text-slate-500 text-sm mt-1">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  )
}
