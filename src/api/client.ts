import type { ApiError, AuthTokens } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

const TOKENS_KEY = 'krisantec_auth_tokens'

export function getTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKENS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

export function setTokens(tokens: AuthTokens) {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  localStorage.removeItem(TOKENS_KEY)
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens()
  if (!tokens?.refresh) return null

  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: tokens.refresh }),
  })

  if (!res.ok) {
    clearTokens()
    return null
  }

  const data = (await res.json()) as { access: string; refresh?: string }
  setTokens({ access: data.access, refresh: data.refresh ?? tokens.refresh })
  return data.access
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const tokens = getTokens()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
    ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401 && retry && tokens?.refresh) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${newAccess}` },
      })
    }
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as ApiError
    throw { status: res.status, ...err }
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
