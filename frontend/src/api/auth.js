import { API_PATHS, request, unwrapData } from './client'

const loginMode = import.meta.env.VITE_API_LOGIN_MODE || 'json'

export async function registerUser(payload) {
  return request(API_PATHS.register, { method: 'POST', body: payload, skipAuth: true })
}

export async function loginUser({ email, password }) {
  if (loginMode === 'form') {
    const form = new URLSearchParams({ username: email, password })
    return request(API_PATHS.login, { method: 'POST', body: form.toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, skipAuth: true })
  }

  try {
    return await request(API_PATHS.login, { method: 'POST', body: { email, password }, skipAuth: true })
  } catch (error) {
    if (![400, 415, 422].includes(error.status)) throw error
    const form = new URLSearchParams({ username: email, password })
    return request(API_PATHS.login, { method: 'POST', body: form.toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, skipAuth: true })
  }
}

export async function getProfile() {
  return request(API_PATHS.profile)
}

export function normalizeSession(payload) {
  const data = unwrapData(payload) || {}
  const user = data.user || data.account || data.profile || (data.email || data.name || data.role ? data : null)
  const role = String(data.role || user?.role || user?.user_type || user?.type || '').toUpperCase()
  return { ...data, user: user || undefined, role }
}

export function normalizeUser(payload) {
  const data = unwrapData(payload) || {}
  return data.user || data.account || data.profile || data
}
