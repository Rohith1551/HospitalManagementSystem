/**
 * Animated circular spinner.
 * size  – 'sm' | 'md' | 'lg'
 * color – Tailwind text colour class, e.g. 'text-primary-600'
 *          or 'current' to inherit (useful inside buttons).
 */
export default function LoadingSpinner({ size = 'md', color = 'text-primary-600', className = '' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size] ?? 'w-6 h-6'
  const cl = color === 'current' ? 'text-current' : color

  return (
    <svg
      className={`animate-spin ${sz} ${cl} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  )
}

/** Full-page centered spinner overlay */
export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" />
    </div>
  )
}
