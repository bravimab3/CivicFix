import { ArrowUpRight, Loader2 } from 'lucide-react'

export function Button({ children, loading = false, variant = 'primary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} disabled={loading || props.disabled} {...props}>{loading ? <Loader2 size={16} className="spin" /> : null}{children}</button>
}

export function StatusBadge({ status }) {
  const label = String(status || 'REPORTED').replace('_', ' ')
  return <span className={`badge badge-status badge-${String(status || 'REPORTED').toLowerCase()}`}><span className="badge-dot" />{label}</span>
}

export function PriorityBadge({ priority }) {
  return <span className={`badge badge-priority priority-${String(priority || 'MEDIUM').toLowerCase()}`}>{priority || 'MEDIUM'}</span>
}

export function TicketChip({ ticketId, compact = false }) {
  return <span className={`ticket-chip ${compact ? 'ticket-chip-compact' : ''}`}><span className="ticket-pulse" />{ticketId || '—'}</span>
}

export function ArrowLink({ children, to, className = '' }) {
  return <a href={to} className={`arrow-link ${className}`}>{children}<ArrowUpRight size={15} /></a>
}
