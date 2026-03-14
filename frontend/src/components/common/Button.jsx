import LoadingSpinner from './LoadingSpinner'

/**
 * Polymorphic button.
 *
 * Props:
 *  variant  – 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
 *  size     – 'sm' | 'md' | 'lg'
 *  loading  – show spinner and disable
 *  icon     – optional leading JSX element
 */
export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon,
  className = '',
  disabled,
  ...rest
}) {
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    success:   'btn-success',
    ghost:     'btn-ghost',
  }[variant] ?? 'btn-primary'

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size] ?? ''

  return (
    <button
      disabled={disabled || loading}
      className={`${variantClass} ${sizeClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <LoadingSpinner size="sm" color="current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
}
