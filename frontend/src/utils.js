import { normalizeIssues } from './api/issues'

export function deriveMetrics(rawIssues = []) {
  const issues = normalizeIssues(rawIssues)
  return { total: issues.length, reported: issues.filter((issue) => issue.status === 'REPORTED').length, inProgress: issues.filter((issue) => issue.status === 'IN_PROGRESS').length, resolved: issues.filter((issue) => issue.status === 'RESOLVED').length, high: issues.filter((issue) => issue.priority === 'HIGH').length }
}

export function categoryCounts(rawIssues = []) {
  const counts = {}
  normalizeIssues(rawIssues).forEach((issue) => { counts[issue.category] = (counts[issue.category] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

export function getDisplayName(user, fallback = 'Resident') { return user?.name || user?.full_name || user?.email?.split('@')[0] || fallback }
