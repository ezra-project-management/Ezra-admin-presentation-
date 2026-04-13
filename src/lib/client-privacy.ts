import type { PortalRole } from '@/lib/roles'
import type { Booking, Transaction } from '@/lib/mock-data'

/** Roles that may see real guest names, email, and phone. */
export function canViewGuestIdentity(role: PortalRole | null): boolean {
  if (!role) return false
  return role === 'SUPER_ADMIN' || role === 'MANAGER' || role === 'SECRETARY'
}

/**
 * Per calendar day (booking.startAt date), assigns Client 1, Client 2, … by time order.
 * Stable for the same booking list.
 */
export function buildClientOrdinalMap(bookings: Booking[]): Map<string, number> {
  const map = new Map<string, number>()
  const byDay = new Map<string, Booking[]>()
  for (const b of bookings) {
    const day = b.startAt.slice(0, 10)
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day)!.push(b)
  }
  for (const list of byDay.values()) {
    const sorted = [...list].sort(
      (a, c) => new Date(a.startAt).getTime() - new Date(c.startAt).getTime()
    )
    sorted.forEach((b, i) => map.set(b.id, i + 1))
  }
  return map
}

export function guestDisplayName(
  booking: Booking,
  role: PortalRole | null,
  ordinalMap: Map<string, number>
): string {
  if (canViewGuestIdentity(role)) return booking.customer.name
  const n = ordinalMap.get(booking.id)
  return n != null ? `Client ${n}` : 'Guest'
}

export function guestDisplayPhone(
  booking: Booking,
  role: PortalRole | null
): string {
  if (canViewGuestIdentity(role)) return booking.customer.phone
  return 'Hidden'
}

export function guestDisplayEmail(
  booking: Booking,
  role: PortalRole | null
): string {
  if (canViewGuestIdentity(role)) return booking.customer.email
  return '—'
}

/** Avatar seed: real name for privileged roles; “C1” style for floor staff. */
export function guestAvatarSeed(
  booking: Booking,
  role: PortalRole | null,
  ordinalMap: Map<string, number>
): string {
  if (canViewGuestIdentity(role)) return booking.customer.name
  const n = ordinalMap.get(booking.id)
  return n != null ? `C${n}` : 'Guest'
}

/** Per calendar day (txn createdAt), first-seen customer label → Client 1, Client 2, … */
export function buildPosCustomerOrdinalMap(
  transactions: Pick<Transaction, 'customer' | 'createdAt'>[]
): Map<string, number> {
  const map = new Map<string, number>()
  const byDay = new Map<string, { customer: string; createdAt: string }[]>()
  for (const t of transactions) {
    const day = t.createdAt.slice(0, 10)
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day)!.push({ customer: t.customer, createdAt: t.createdAt })
  }
  for (const [day, list] of byDay) {
    const sorted = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    const seen = new Set<string>()
    let n = 0
    for (const row of sorted) {
      if (seen.has(row.customer)) continue
      seen.add(row.customer)
      n++
      map.set(`${day}::${row.customer}`, n)
    }
  }
  return map
}

export function posCustomerDisplayName(
  txn: Pick<Transaction, 'customer' | 'createdAt'>,
  role: PortalRole | null,
  map: Map<string, number>
): string {
  if (canViewGuestIdentity(role)) return txn.customer
  const day = txn.createdAt.slice(0, 10)
  const ord = map.get(`${day}::${txn.customer}`)
  return ord != null ? `Client ${ord}` : 'Guest'
}
