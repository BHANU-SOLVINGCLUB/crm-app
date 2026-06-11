import { apiRequest, clearTokens, setTokens } from './client'
import type { AuthTokens, AuthUser } from './types'

const USER_KEY = 'krisantec_auth_user'

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export async function loginApi(email: string, password: string): Promise<AuthUser> {
  const tokens = await apiRequest<AuthTokens>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setTokens(tokens)

  const user = await apiRequest<AuthUser>('/auth/me/')
  setStoredUser(user)
  return user
}

export async function registerApi(payload: {
  email: string
  username: string
  password: string
  role?: 'admin' | 'manager' | 'sales'
}): Promise<AuthUser> {
  await apiRequest('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      username: payload.username,
      password: payload.password,
      role: payload.role ?? 'admin',
    }),
  })
  return loginApi(payload.email, payload.password)
}

export async function fetchMe(): Promise<AuthUser> {
  const user = await apiRequest<AuthUser>('/auth/me/')
  setStoredUser(user)
  return user
}

export function logoutApi() {
  clearTokens()
  setStoredUser(null)
}
