import type { Booking, Customer } from '@/lib/mock-data'
import type { PortalRole } from '@/lib/roles'

/** Only front-line staff must not see guest PII; managers and above retain full records. */
export function shouldMaskCustomerPii(role: PortalRole | null): boolean {
  return role === 'STAFF'
}

export function getCustomerIdentityKey(customer: Customer): string {
  const e = customer.email?.trim().toLowerCase()
  if (e) return `email:${e}`
  return `name:${customer.name.trim().toLowerCase()}`
}

export type ClientPrivacyRegistry = {
  /** Sorted unique identity keys → 1-based slot */
  keyToSlot: Map<string, number>
}

export function buildClientPrivacyRegistry(bookings: Booking[]): ClientPrivacyRegistry {
  const keys = [...new Set(bookings.map((b) => getCustomerIdentityKey(b.customer)))].sort((a, b) =>
    a.localeCompare(b)
  )
  const keyToSlot = new Map<string, number>()
  keys.forEach((k, i) => keyToSlot.set(k, i + 1))
  return { keyToSlot }
}

export type CustomerPresentation = {
  displayName: string
  /** Masked pseudo-ID for staff (e.g. CLI-0001); null when full PII shown */
  userId: string | null
  /** Primary subline under name (phone for full; user id for staff) */
  detailLine: string
  /** Second line (email for privileged roles only) */
  secondaryLine: string | null
  avatarLabel: string
  toastLabel: string
  searchBlob: string
}

export function getStaffSafeClientPresentation(
  booking: Booking,
  registry: ClientPrivacyRegistry
): CustomerPresentation {
  const key = getCustomerIdentityKey(booking.customer)
  const slot = registry.keyToSlot.get(key) ?? 1
  const userId = `CLI-${String(slot).padStart(4, '0')}`
  const displayName = `Client ${slot}`
  return {
    displayName,
    userId,
    detailLine: `User ID ${userId}`,
    secondaryLine: null,
    avatarLabel: `C${slot}`,
    toastLabel: displayName,
    searchBlob: `${booking.reference} ${displayName} ${userId} client ${slot}`.toLowerCase(),
  }
}

export function getFullCustomerPresentation(booking: Booking): CustomerPresentation {
  const c = booking.customer
  return {
    displayName: c.name,
    userId: null,
    detailLine: c.phone,
    secondaryLine: c.email,
    avatarLabel: c.name,
    toastLabel: c.name,
    searchBlob: `${booking.reference} ${c.name} ${c.phone} ${c.email}`.toLowerCase(),
  }
}

export function getCustomerPresentation(
  booking: Booking,
  registry: ClientPrivacyRegistry | null,
  mask: boolean
): CustomerPresentation {
  if (mask && registry) return getStaffSafeClientPresentation(booking, registry)
  return getFullCustomerPresentation(booking)
}

/** Stable Client N / CLI-XXXX for POS or other plain-string guest labels (not full Customer records). */
export function buildStringSlotRegistry(labels: Iterable<string>): Map<string, number> {
  const unique = [...new Set([...labels].map((s) => s.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  )
  const keyToSlot = new Map<string, number>()
  unique.forEach((s, i) => keyToSlot.set(s.toLowerCase(), i + 1))
  return keyToSlot
}

const POS_COUNTERPARTY_WHITELIST = new Set(['guest sale', 'walk-in', 'cash guest', 'anonymous'])

export function getMaskedCounterpartyLabel(raw: string, registry: Map<string, number>, mask: boolean): string {
  if (!mask) return raw
  const k = raw.trim().toLowerCase()
  if (!k || POS_COUNTERPARTY_WHITELIST.has(k)) return raw
  const slot = registry.get(k) ?? 1
  const userId = `CLI-${String(slot).padStart(4, '0')}`
  return `Client ${slot} · ${userId}`
}

const OCC_CURRENT_PUBLIC = new Set(['open', 'walk-in', 'coach session', 'guest'])

/** Hide first-name style occupant hints on floor plans for staff. */
export function maskOccupancyCurrentLabel(raw: string | null, mask: boolean): string | null {
  if (raw == null) return null
  if (!mask) return raw
  const t = raw.trim().toLowerCase()
  if (!t || OCC_CURRENT_PUBLIC.has(t)) return raw
  return 'Guest on-site'
}
