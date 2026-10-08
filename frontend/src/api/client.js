const STORAGE_KEY = 'civicfix_session'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010'
).replace(/\/$/, '')

export const API_PATHS = {
  register: import.meta.env.VITE_API_REGISTER_PATH || '/register',
  login: import.meta.env.VITE_API_LOGIN_PATH || '/login',
  profile: import.meta.env.VITE_API_PROFILE_PATH || '/me',
  citizenIssues:
    import.meta.env.VITE_API_CITIZEN_ISSUES_PATH || '/issues/my',
  adminIssues:
    import.meta.env.VITE_API_ADMIN_ISSUES_PATH || '/admin/issues',
  issue: import.meta.env.VITE_API_ISSUE_PATH || '/issues',
}

export function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAccessToken(session = readSession()) {
  return (
    session?.access_token ||
    session?.accessToken ||
    session?.token ||
    session?.data?.access_token ||
    ''
  )
}

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function toMessage(payload, fallback) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload?.detail) {
    if (Array.isArray(payload.detail)) {
      return payload.detail
        .map((item) => item.msg || item)
        .join(', ')
    }

    return String(payload.detail)
  }

  if (payload?.message) {
    return String(payload.message)
  }

  if (payload?.error) {
    return String(payload.error)
  }

  return fallback
}

async function parseResponse(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    signal,
    skipAuth = false,
  } = options

  const session = readSession()
  const token = getAccessToken(session)

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  let requestBody = body

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    typeof body !== 'string'
  ) {
    requestHeaders['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  if (!skipAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${path}`

  console.log('[CivicFix API]', method, url)

  let response

  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal,
    })
  } catch (error) {
    console.error('[CivicFix API] Network error:', error)

    throw new ApiError(
      `Could not reach CivicFix at ${API_BASE_URL}.`,
      0,
      error
    )
  }

  const payload = await parseResponse(response)

  console.log(
    '[CivicFix API] Response:',
    response.status,
    payload
  )

  if (!response.ok) {
    if (response.status === 401) {
      clearSession()

      window.dispatchEvent(
        new CustomEvent('civicfix:unauthorized')
      )
    }

    throw new ApiError(
      toMessage(
        payload,
        `CivicFix API request failed (${response.status}).`
      ),
      response.status,
      payload
    )
  }

  return payload
}

export function unwrapData(payload) {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    payload.data !== null
  ) {
    return payload.data
  }

  return payload
}

export function pickList(payload) {
  const value = unwrapData(payload)

  if (Array.isArray(value)) {
    return value
  }

  if (Array.isArray(value?.items)) {
    return value.items
  }

  if (Array.isArray(value?.issues)) {
    return value.issues
  }

  if (Array.isArray(value?.results)) {
    return value.results
  }

  return []
}

export { STORAGE_KEY }