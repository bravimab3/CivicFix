import { AlertCircle, Inbox, Loader2, RefreshCw } from 'lucide-react'

export function LoadingState({ label = 'Loading CivicFix…', compact = false }) {
  return <div className={`state-view ${compact ? 'state-compact' : ''}`}><Loader2 className="spin" size={compact ? 20 : 28} /><p>{label}</p></div>
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return <div className="state-view state-empty"><span className="state-icon"><Icon size={25} /></span><h3>{title}</h3>{description && <p>{description}</p>}{action}</div>
}

export function ErrorState({ message = 'Unable to load this CivicFix data. Please try again.', onRetry }) {
  return <div className="state-view state-error"><span className="state-icon"><AlertCircle size={25} /></span><h3>Something needs attention</h3><p>{message}</p>{onRetry && <button className="button button-secondary button-small" onClick={onRetry}><RefreshCw size={15} /> Retry</button>}</div>
}
