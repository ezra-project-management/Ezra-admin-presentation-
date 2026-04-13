import type { PortalRole } from '@/lib/roles'
import { resolveRoleFromEmail } from '@/lib/roles'

const EMAIL_KEY = 'ezra-admin-session-email'
const ROLE_KEY = 'ezra-admin-session-role'

export function setSession(email: string, role?: PortalRole): void {
  if (typeof window === 'undefined') return
  const e = email.trim()
  localStorage.setItem(EMAIL_KEY, e)
  const r = role ?? resolveRoleFromEmail(e)
  localStorage.setItem(ROLE_KEY, r)
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function getSessionEmail(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(EMAIL_KEY)?.trim() ?? ''
}

export function getSessionRole(): PortalRole | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(ROLE_KEY) as PortalRole | null
  if (
    raw === 'SUPER_ADMIN' ||
    raw === 'MANAGER' ||
    raw === 'SECRETARY' ||
    raw === 'STAFF' ||
    raw === 'FINANCE'
  )
    return raw
  const email = getSessionEmail()
  return email ? resolveRoleFromEmail(email) : null
}

export function getSessionAdminLabel(): string {
  return getSessionEmail() || 'Demo Admin'
}

export function hasSession(): boolean {
  return Boolean(getSessionEmail())
}

export function syncRoleFromEmail(): void {
  if (typeof window === 'undefined') return
  const email = getSessionEmail()
  if (email) localStorage.setItem(ROLE_KEY, resolveRoleFromEmail(email))
}
