import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { normalizeIssue } from '../api/issues'
import { PriorityBadge, StatusBadge, TicketChip } from './UI'

export function IssueCard({ issue: rawIssue, admin = false }) {
  const issue = normalizeIssue(rawIssue)
  return <Link className="issue-card" to={`${admin ? '/admin/issues' : '/app/issues'}/${issue.id}`}><div className="issue-card-head"><TicketChip ticketId={issue.ticketId} compact /><StatusBadge status={issue.status} /></div><h3>{issue.title}</h3><p>{issue.description || 'No additional description provided.'}</p><div className="issue-card-meta"><span>{issue.category}</span><PriorityBadge priority={issue.priority} /><span className="issue-date">{formatDate(issue.createdAt)}</span></div><span className="issue-card-arrow"><ArrowUpRight size={16} /></span></Link>
}

export function IssueTable({ issues, admin = false, onStatusChange, onPriorityChange }) {
  return <div className="table-wrap"><table className="issue-table"><thead><tr><th>Ticket</th>{admin && <th>Citizen</th>}<th>Issue</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th>{admin && <th>Actions</th>}</tr></thead><tbody>{issues.map((rawIssue) => { const issue = normalizeIssue(rawIssue); return <tr key={issue.id || issue.ticketId}><td><Link className="table-ticket" to={`${admin ? '/admin/issues' : '/app/issues'}/${issue.id}`}><TicketChip ticketId={issue.ticketId} compact /></Link></td>{admin && <td><span className="citizen-cell"><span className="avatar avatar-tiny">{String(issue.citizen?.name || issue.citizen?.email || 'C').charAt(0).toUpperCase()}</span>{issue.citizen?.name || issue.citizen?.email || 'Citizen'}</span></td>}<td><Link className="table-title" to={`${admin ? '/admin/issues' : '/app/issues'}/${issue.id}`}>{issue.title}</Link></td><td>{issue.category}</td><td>{admin ? <select className="table-select" value={issue.priority} onChange={(e) => onPriorityChange?.(issue, e.target.value)} aria-label={`Priority for ${issue.ticketId}`}><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select> : <PriorityBadge priority={issue.priority} />}</td><td>{admin ? <select className="table-select" value={issue.status} onChange={(e) => onStatusChange?.(issue, e.target.value)} aria-label={`Status for ${issue.ticketId}`}><option>REPORTED</option><option>IN_PROGRESS</option><option>RESOLVED</option></select> : <StatusBadge status={issue.status} />}</td><td><span className="date-cell"><CalendarDays size={14} />{formatDate(issue.createdAt)}</span></td>{admin && <td><Link className="table-action" to={`/admin/issues/${issue.id}`} aria-label={`Open ${issue.ticketId}`}><ArrowUpRight size={16} /></Link></td>}</tr> })}</tbody></table></div>
}

export function StatusTimeline({ status }) {
  const current = ['REPORTED', 'IN_PROGRESS', 'RESOLVED'].indexOf(status)
  return <div className="status-timeline">{['REPORTED', 'IN_PROGRESS', 'RESOLVED'].map((step, index) => <div className={`timeline-step ${index <= current ? 'is-done' : ''} ${step === status ? 'is-current' : ''}`} key={step}><span className="timeline-node">{index < current ? '✓' : index + 1}</span><span><strong>{step === 'IN_PROGRESS' ? 'In progress' : step.charAt(0) + step.slice(1).toLowerCase()}</strong><small>{step === 'REPORTED' ? 'Report received' : step === 'IN_PROGRESS' ? 'City team is working on it' : 'Marked as resolved'}</small></span></div>)}</div>
}

export function formatDate(value) { if (!value) return 'Date unavailable'; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date) }
export function formatLocation(issue) { return issue.latitude != null && issue.longitude != null ? `${Number(issue.latitude).toFixed(4)}, ${Number(issue.longitude).toFixed(4)}` : 'Location not provided' }
