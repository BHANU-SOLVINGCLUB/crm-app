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

// ── backend returns { user, tokens } — extract tokens correctly ──
interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
}

export async function loginApi(email: string, password: string): Promise<AuthUser> {
  const res = await apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  // save tokens correctly from res.tokens not the whole res
  setTokens(res.tokens)

  // save user with organization as object
  const user = res.user
  setStoredUser(user)
  return user
}

export async function registerApi(payload: {
  email: string
  username: string
  password: string
  role?: 'admin' | 'manager' | 'sales'
}): Promise<AuthUser> {
  const res = await apiRequest<LoginResponse>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      email:    payload.email,
      username: payload.username,
      password: payload.password,
      role:     payload.role ?? 'admin',
    }),
  })

  // save tokens from register response directly
  // no need to call loginApi again — register already returns tokens
  setTokens(res.tokens)
  const user = res.user
  setStoredUser(user)
  return user
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