import toast from 'react-hot-toast'

/**
 * Thin wrapper around react-hot-toast for consistent usage across the app.
 */
export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error:   (msg) => toast.error(msg),
    info:    (msg) => toast(msg, { icon: 'ℹ️' }),
    loading: (msg) => toast.loading(msg),
    dismiss: (id)  => toast.dismiss(id),
    /** Wraps a Promise and shows loading → success / error toasts automatically */
    promise: (p, msgs) => toast.promise(p, msgs),
  }
}
