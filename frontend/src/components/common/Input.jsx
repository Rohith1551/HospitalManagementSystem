/**
 * Reusable controlled input with label, error, and optional hint.
 * Supports text, email, password, number, and textarea.
 */
export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled = false,
  required = false,
  min,
  max,
  step,
  rows,
  className = '',
  ...rest
}) {
  const baseClass = 'form-input'
  const errorClass = error ? 'border-red-400 focus:ring-red-300 focus:border-red-500' : ''
  const id = rest.id ?? name

  const isTextarea = type === 'textarea' || (rows && rows > 1)
  const sharedProps = {
    id,
    name,
    value: value ?? '',
    onChange,
    onBlur,
    placeholder,
    disabled,
    required,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
    className: `${baseClass} ${errorClass} ${className}`.trim(),
    ...rest,
  }
  const inputProps = isTextarea
    ? { ...sharedProps, rows: rows ?? 3 }
    : { ...sharedProps, type, min, max, step }

  const inputEl = isTextarea ? (
    <textarea {...inputProps} />
  ) : (
    <input {...inputProps} />
  )

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {inputEl}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
