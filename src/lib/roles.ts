import { MOCK_STAFF } from '@/lib/mock-data'

export type PortalRole = 'SUPER_ADMIN' | 'MANAGER' | 'SECRETARY' | 'STAFF' | 'FINANCE'

const SUPER_ADMIN_EMAILS = new Set(
  ['admin@ezraannex.com', 'james.k@ezraannex.com'].map((e) => e.toLowerCase())
)

const MANAGER_EMAILS = new Set(['manager@ezraannex.com', 'sarah.w@ezraannex.com'].map((e) => e.toLowerCase()))

const SECRETARY_EMAILS = new Set(['frontdesk@ezraannex.com', 'secretary@ezraannex.com'].map((e) => e.toLowerCase()))

const FINANCE_EMAILS = new Set(['finance@ezraannex.com', 'accounts@ezraannex.com'].map((e) => e.toLowerCase()))

/** Map demo inbox → portal role. */
export function resolveRoleFromEmail(email: string): PortalRole {
  const e = email.trim().toLowerCase()
  if (!e) return 'STAFF'
  if (SUPER_ADMIN_EMAILS.has(e)) return 'SUPER_ADMIN'
  if (FINANCE_EMAILS.has(e)) return 'FINANCE'
  if (SECRETARY_EMAILS.has(e)) return 'SECRETARY'
  if (MANAGER_EMAILS.has(e)) return 'MANAGER'
  const staff = MOCK_STAFF.find((s) => s.email.toLowerCase() === e)
  if (staff?.role === 'MANAGER') return 'MANAGER'
  return 'STAFF'
}

export function getStaffProfileByEmail(email: string) {
  const e = email.trim().toLowerCase()
  return MOCK_STAFF.find((s) => s.email.toLowerCase() === e) ?? null
}

export function staffAllowedServiceSlugs(email: string): string[] {
  return getStaffProfileByEmail(email)?.departments ?? []
}

export function defaultHomeForRole(role: PortalRole): string {
  if (role === 'FINANCE') return '/finance'
  if (role === 'SECRETARY') return '/secretary'
  return '/dashboard'
}

/** Path prefixes a role may access (exact or children). */
const PREFIXES: Record<Exclude<PortalRole, 'SUPER_ADMIN'>, string[]> = {
  MANAGER: [
    '/dashboard',
    '/bookings',
    '/pos',
    '/services',
    '/customers',
    '/staff',
    '/finance',
    '/analytics',
    '/communications',
    '/system/settings',
    '/system/audit-log',
  ],
  /** Front desk: operations without finance core or system administration. */
  SECRETARY: [
    '/dashboard',
    '/secretary',
    '/bookings',
    '/pos',
    '/services',
    '/customers',
    '/staff',
    '/communications',
    '/analytics',
  ],
  STAFF: [
    '/dashboard',
    '/bookings',
    '/pos/new',
    '/pos/transactions',
    '/services',
    '/staff',
    '/communications',
  ],
  FINANCE: ['/finance', '/pos/transactions'],
}

export function canAccessPath(role: PortalRole, pathname: string, email: string): boolean {
  const p = pathname === '' ? '/' : pathname

  if (p.startsWith('/system/users') && role !== 'SUPER_ADMIN') {
    return false
  }

  if (role === 'SUPER_ADMIN') return true

  if (role === 'FINANCE') {
    return PREFIXES.FINANCE.some((prefix) => p === prefix || p.startsWith(prefix + '/'))
  }

  if (role === 'STAFF') {
    if (p.startsWith('/system')) return false
    if (p.startsWith('/customers')) return false
    if (p.startsWith('/analytics')) return false
    if (p.startsWith('/finance')) return false
    if (p.startsWith('/pos/new')) return true
    if (p.startsWith('/pos/transactions')) return true
    if (p.startsWith('/bookings')) return true
    if (p.startsWith('/dashboard')) return true
    if (p.startsWith('/communications')) return true
    if (p.startsWith('/staff')) return true
    if (p.startsWith('/services/')) {
      const slug = p.split('/')[2]?.split('?')[0]
      if (!slug) return false
      const allowed = staffAllowedServiceSlugs(email)
      return allowed.includes(slug)
    }
    return false
  }

  if (role === 'MANAGER') {
    return PREFIXES.MANAGER.some((prefix) => p === prefix || p.startsWith(prefix + '/'))
  }

  if (role === 'SECRETARY') {
    if (p.startsWith('/system')) return false
    if (p.startsWith('/finance')) return false
    return PREFIXES.SECRETARY.some((prefix) => p === prefix || p.startsWith(prefix + '/'))
  }

  return false
}

export const ROLE_LABELS: Record<PortalRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'Manager',
  SECRETARY: 'Secretary / Front desk',
  STAFF: 'Staff',
  FINANCE: 'Finance',
}
