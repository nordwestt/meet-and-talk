export const ADMIN_STORAGE_KEY = 'meet-and-talk-admin'

export type AdminSettings = {
  baseUrl: string
  token: string
}

export const RESOURCES = [
  { id: 'cities', label: 'Cities', titleKey: 'name' },
  { id: 'venues', label: 'Venues', titleKey: 'name' },
  { id: 'events', label: 'Events', titleKey: 'title' },
  { id: 'organisers', label: 'Organisers', titleKey: 'name' },
  { id: 'topics', label: 'Topics', titleKey: 'name' },
  { id: 'faqs', label: 'FAQs', titleKey: 'question' },
  { id: 'testimonials', label: 'Testimonials', titleKey: 'name' },
  { id: 'press', label: 'Press', titleKey: 'title' },
] as const

export type ResourceId = (typeof RESOURCES)[number]['id']

export function defaultBaseUrl(): string {
  if (typeof window === 'undefined') return '/admin-api'
  // Same-origin Caddy proxy in production; local Go default for localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:3080'
  }
  return '/admin-api'
}

export function loadSettings(): AdminSettings {
  if (typeof window === 'undefined') {
    return { baseUrl: '/admin-api', token: '' }
  }
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AdminSettings>
      return {
        baseUrl: parsed.baseUrl || defaultBaseUrl(),
        token: parsed.token || '',
      }
    }
  } catch {
    /* ignore */
  }
  return { baseUrl: defaultBaseUrl(), token: '' }
}

export function saveSettings(settings: AdminSettings) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(settings))
}

function normalizeBase(baseUrl: string) {
  return baseUrl.replace(/\/$/, '')
}

export class AdminApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function adminFetch<T = unknown>(
  settings: AdminSettings,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const base = normalizeBase(settings.baseUrl)
  const headers = new Headers(init.headers)
  if (settings.token) {
    headers.set('Authorization', `Bearer ${settings.token}`)
  }
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`${base}${path}`, { ...init, headers })
  if (res.status === 204) return undefined as T
  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }
  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error: unknown }).error)
        : res.statusText
    throw new AdminApiError(res.status, msg || 'Request failed')
  }
  return data as T
}
