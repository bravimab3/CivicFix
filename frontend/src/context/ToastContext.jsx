import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((items) => [...items, { id, message, type }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4500)
  }, [])
  const dismiss = (id) => setToasts((items) => items.filter((item) => item.id !== id))
  return <ToastContext.Provider value={{ push }}>{children}<div className="toast-stack" aria-live="polite">{toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />)}</div></ToastContext.Provider>
}

function ToastItem({ toast, onDismiss }) {
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info
  return <div className={`toast toast-${toast.type}`} role="status"><Icon size={17} /><span>{toast.message}</span><button className="icon-button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification"><X size={15} /></button></div>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
