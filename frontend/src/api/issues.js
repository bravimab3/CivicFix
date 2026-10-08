import { API_PATHS, pickList, request, unwrapData } from './client'

export const ISSUE_CATEGORIES = [
  'Pothole',
  'Garbage',
  'Streetlight',
  'Water Supply',
  'Drainage',
  'Road Damage',
  'Other'
]

export const ISSUE_STATUSES = [
  'REPORTED',
  'IN_PROGRESS',
  'RESOLVED'
]

export const ISSUE_PRIORITIES = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
]

export async function listCitizenIssues() {
  return pickList(await request(API_PATHS.citizenIssues))
}

export async function listAdminIssues() {
  return pickList(await request(API_PATHS.adminIssues))
}

export async function getIssue(id) {
  const payload = await request(
    `${API_PATHS.issue}/${encodeURIComponent(id)}`
  )

  return unwrapData(payload)
}


// ===============================
// CITIZEN - CREATE ISSUE
// ===============================

export async function createIssue(fields) {
  const payload = {
    category: fields.category,
    title: fields.title,
    description: fields.description,
    latitude: fields.latitude
      ? Number(fields.latitude)
      : null,
    longitude: fields.longitude
      ? Number(fields.longitude)
      : null,
  }

  return request(API_PATHS.issue, {
    method: 'POST',
    body: payload,
  })
}


// ===============================
// ADMIN - UPDATE ISSUE STATUS
// ===============================

export async function updateIssueStatus(ticketId, status) {
  return request(
    `${API_PATHS.adminIssues}/${encodeURIComponent(ticketId)}/status`,
    {
      method: 'PUT',
      body: {
        status,
      },
    }
  )
}


// ===============================
// ADMIN - UPDATE ISSUE PRIORITY
// ===============================

export async function updateIssuePriority(ticketId, priority) {
  return request(
    `${API_PATHS.adminIssues}/${encodeURIComponent(ticketId)}/priority`,
    {
      method: 'PUT',
      body: {
        priority,
      },
    }
  )
}


// ===============================
// GENERIC UPDATE
// ===============================

export async function updateIssue(id, changes) {
  return request(
    `${API_PATHS.issue}/${encodeURIComponent(id)}`,
    {
      method: import.meta.env.VITE_API_UPDATE_METHOD || 'PATCH',
      body: changes
    }
  )
}


// ===============================
// NORMALIZE ISSUE
// ===============================

export function normalizeIssue(raw = {}) {
  return {
    ...raw,

    id:
      raw.id ??
      raw.issue_id ??
      raw.complaint_id ??
      raw.ticket_id,

    ticketId:
      raw.ticket_id ||
      raw.ticketId ||
      raw.reference ||
      (
        raw.id
          ? `CF-${String(raw.id).padStart(4, '0')}`
          : '—'
      ),

    title:
      raw.title ||
      raw.subject ||
      'Untitled issue',

    description:
      raw.description ||
      raw.details ||
      '',

    category:
      raw.category ||
      raw.issue_category ||
      'Other',

    status:
      String(
        raw.status ||
        raw.issue_status ||
        'REPORTED'
      ).toUpperCase(),

    priority:
      String(
        raw.priority ||
        'MEDIUM'
      ).toUpperCase(),

    createdAt:
      raw.created_at ||
      raw.createdAt ||
      raw.date_reported ||
      raw.reported_at ||
      null,

    latitude:
      raw.latitude ??
      raw.location?.latitude ??
      null,

    longitude:
      raw.longitude ??
      raw.location?.longitude ??
      null,

    imageUrl:
      raw.image_url ||
      raw.imageUrl ||
      raw.image ||
      null,

    citizen:
      raw.citizen ||
      raw.user ||
      raw.reporter ||
      null,
  }
}

export function normalizeIssues(items) {
  return items.map(normalizeIssue)
}