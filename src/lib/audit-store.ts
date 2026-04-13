export type AuditEntry = {
  id: string
  timestamp: string
  admin: string
  action: string
  entity: string
  entityId: string
  ip: string
  details: string
}

const STORAGE_KEY = 'ezra-admin-audit-log'

function loadCustom(): AuditEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AuditEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function appendAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): void {
  if (typeof window === 'undefined') return
  const full: AuditEntry = {
    id: entry.id || `a-custom-${Date.now()}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    admin: entry.admin,
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId,
    ip: entry.ip,
    details: entry.details,
  }
  const next = [full, ...loadCustom()]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 200)))
}

export function getCustomAuditEntries(): AuditEntry[] {
  return loadCustom()
}
