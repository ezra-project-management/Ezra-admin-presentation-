'use client'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { getSessionEmail, getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { getStaffProfileByEmail } from '@/lib/roles'
import type { StaffMember } from '@/lib/mock-data'
import { filterBookingsForStaffMember } from '@/lib/staff-bookings'
import { Eye, LogIn, X, LayoutList, Users, UserCircle } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_BOOKINGS, type Booking } from '@/lib/mock-data'
import { formatCurrency, formatDateTime, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { BookingFilters, DEFAULT_BOOKING_FILTERS, type BookingsFilterValues } from '@/components/bookings/BookingFilters'
import { BookingDetailDrawer } from '@/components/bookings/BookingDetailDrawer'
import {
  buildClientOrdinalMap,
  guestAvatarSeed,
  guestDisplayName,
  guestDisplayPhone,
} from '@/lib/client-privacy'

const SERVICE_COLORS: Record<string, string> = {
  'Salon & Spa': 'bg-teal-500',
  Boardroom: 'bg-blue-500',
  Ballroom: 'bg-amber-500',
  Gym: 'bg-green-500',
  Barbershop: 'bg-gray-700',
  'Swimming Pool': 'bg-cyan-500',
  'Banquet Hall': 'bg-orange-500',
}

type ViewMode = 'table' | 'byCustomer' | 'byStaff'

function matchesFilters(
  booking: Booking,
  f: BookingsFilterValues,
  portalRole: PortalRole | null,
  ordinalMap: Map<string, number>
): boolean {
  const q = f.search.trim().toLowerCase()
  if (q) {
    if (portalRole === 'STAFF') {
      const blob = `${booking.reference} ${booking.service} ${booking.staff} ${booking.status} ${guestDisplayName(booking, portalRole, ordinalMap)}`.toLowerCase()
      if (!blob.includes(q)) return false
    } else {
      const blob =
        `${booking.reference} ${booking.customer.name} ${booking.customer.phone} ${booking.customer.email} ${booking.service} ${booking.staff}`.toLowerCase()
      if (!blob.includes(q)) return false
    }
  }
  if (f.service && booking.service !== f.service) return false
  if (f.status && booking.status !== f.status) return false
  if (f.customer) {
    if (portalRole === 'STAFF') {
      if (guestDisplayName(booking, portalRole, ordinalMap) !== f.customer) return false
    } else if (booking.customer.name !== f.customer) {
      return false
    }
  }
  if (f.staff && booking.staff !== f.staff) return false
  if (f.dateFrom) {
    const start = new Date(booking.startAt)
    const from = new Date(f.dateFrom + 'T00:00:00')
    if (start < from) return false
  }
  if (f.dateTo) {
    const start = new Date(booking.startAt)
    const to = new Date(f.dateTo + 'T23:59:59')
    if (start > to) return false
  }
  return true
}

function BookingRow({
  booking,
  portalRole,
  ordinalMap,
  onOpen,
  onStatusChange,
}: {
  booking: Booking
  portalRole: PortalRole | null
  ordinalMap: Map<string, number>
  onOpen: (b: Booking) => void
  onStatusChange: (id: string, status: string) => void
}) {
  const gName = guestDisplayName(booking, portalRole, ordinalMap)
  const gPhone = guestDisplayPhone(booking, portalRole)
  const av = guestAvatarSeed(booking, portalRole, ordinalMap)
  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onOpen(booking)}>
      <td className="px-4 py-3 font-mono text-xs text-gray-500">{booking.reference}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={av} size="sm" />
          <div>
            <div className="text-sm font-medium text-gray-900">{gName}</div>
            <div className="text-xs text-gray-400">{gPhone}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{booking.staff}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', SERVICE_COLORS[booking.service] || 'bg-gray-400')} />
          <span className="text-sm text-gray-700">{booking.service}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(booking.startAt)}</td>
      <td className="px-4 py-3">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(booking.amount)}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            booking.paymentMethod === 'MPESA' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
          )}
        >
          {booking.paymentMethod}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => onOpen(booking)} className="p-1.5 text-gray-400 hover:text-brand rounded" aria-label="View">
            <Eye className="w-4 h-4" />
          </button>
          {booking.status === 'CONFIRMED' && (
            <button
              onClick={() => {
                onStatusChange(booking.id, 'CHECKED_IN')
                toast.success(`${gName} checked in`)
              }}
              className="p-1.5 text-gray-400 hover:text-green-600 rounded"
              aria-label="Check in"
            >
              <LogIn className="w-4 h-4" />
            </button>
          )}
          {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
            <button
              onClick={() => {
                onStatusChange(booking.id, 'CANCELLED')
                toast.error('Booking cancelled')
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function BookingsPage() {
  const [sessionReady, setSessionReady] = useState(false)
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null)
  const [staffProfile, setStaffProfile] = useState<StaffMember | null>(null)

  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<BookingsFilterValues>(DEFAULT_BOOKING_FILTERS)
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  useLayoutEffect(() => {
    const r = getSessionRole()
    const e = getSessionEmail()
    setPortalRole(r)
    setStaffProfile(r === 'STAFF' ? getStaffProfileByEmail(e) : null)
    setSessionReady(true)
  }, [])

  useEffect(() => {
    if (portalRole === 'STAFF' && viewMode === 'byStaff') {
      setViewMode('table')
    }
  }, [portalRole, viewMode])

  useEffect(() => {
    if (portalRole === 'STAFF') {
      setFilters(f => (f.customer ? { ...f, customer: '' } : f))
    }
  }, [portalRole])

  const poolBookings = useMemo(() => {
    if (portalRole === 'STAFF') {
      if (!staffProfile) return []
      return filterBookingsForStaffMember(bookings, staffProfile)
    }
    return bookings
  }, [bookings, portalRole, staffProfile])

  const isStaffPortal = portalRole === 'STAFF'

  const ordinalMap = useMemo(() => buildClientOrdinalMap(bookings), [bookings])

  const customerOptions = useMemo(() => {
    if (portalRole === 'STAFF') {
      return [...new Set(poolBookings.map(b => guestDisplayName(b, portalRole, ordinalMap)))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      )
    }
    return [...new Set(poolBookings.map(b => b.customer.name))].sort((a, b) => a.localeCompare(b))
  }, [poolBookings, portalRole, ordinalMap])
  const staffOptions = useMemo(
    () => [...new Set(poolBookings.map(b => b.staff))].sort((a, b) => a.localeCompare(b)),
    [poolBookings]
  )

  const filtered = useMemo(
    () => poolBookings.filter(b => matchesFilters(b, filters, portalRole, ordinalMap)),
    [poolBookings, filters, portalRole, ordinalMap]
  )

  const byCustomer = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of filtered) {
      const k = guestDisplayName(b, portalRole, ordinalMap)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(b)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
  }, [filtered, portalRole, ordinalMap])

  const byStaff = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of filtered) {
      const k = b.staff
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(b)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b)))
    setSelectedBooking(prev => (prev && prev.id === bookingId ? { ...prev, status: newStatus } : prev))
  }

  const openDrawer = (booking: Booking) => {
    setSelectedBooking(booking)
    setDrawerOpen(true)
  }

  const viewTabs: { id: ViewMode; label: string; icon: typeof LayoutList }[] = isStaffPortal
    ? [
        { id: 'table', label: 'My sessions', icon: LayoutList },
        { id: 'byCustomer', label: 'By guest', icon: Users },
      ]
    : [
        { id: 'table', label: 'All', icon: LayoutList },
        { id: 'byCustomer', label: 'By guest', icon: Users },
        { id: 'byStaff', label: 'By staff', icon: UserCircle },
      ]

  if (!sessionReady) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-sm text-gray-500">
        Loading bookings…
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isStaffPortal ? 'My bookings' : 'Bookings'}
        subtitle={
          isStaffPortal
            ? `${filtered.length} shown · your assigned sessions only — check in, complete, or cancel`
            : `${filtered.length} shown · ${bookings.length} total`
        }
        actions={
          !isStaffPortal ? (
            <button className="bg-brand text-white px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium hover:bg-brand-light">
              + New Booking
            </button>
          ) : undefined
        }
      />

      {isStaffPortal && (
        <div className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-[13px] px-4 py-3 mb-4 leading-relaxed">
          <span className="font-medium text-slate-900">Your view</span> — Assigned sessions only. New site-wide bookings require a manager or administrator.
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {viewTabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setViewMode(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                viewMode === tab.id ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <BookingFilters
        values={filters}
        onChange={setFilters}
        customerOptions={customerOptions}
        staffOptions={staffOptions}
        hideStaffFilter={isStaffPortal}
        hideCustomerFilter={isStaffPortal}
        searchPlaceholder={
          isStaffPortal ? 'Reference, service, guest label (Client 1…)…' : 'Reference, guest name, phone…'
        }
      />

      {viewMode === 'table' && (
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {isStaffPortal ? 'Guest' : 'Guest / name'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-500">
                      No bookings match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map(booking => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      portalRole={portalRole}
                      ordinalMap={ordinalMap}
                      onOpen={openDrawer}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Showing {filtered.length ? `1–${filtered.length}` : '0'} of {filtered.length} results
            </span>
            <div className="flex gap-2">
              <button
                disabled
                className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-[var(--btn-radius)] cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-[var(--btn-radius)] cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'byCustomer' && (
        <div className="space-y-4">
          {byCustomer.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12">No bookings match your filters.</p>
          ) : (
            byCustomer.map(([name, list]) => (
              <div key={name} className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/80">
                  <Avatar name={isStaffPortal ? guestAvatarSeed(list[0]!, portalRole, ordinalMap) : name} size="sm" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">
                      {list.length} booking{list.length === 1 ? '' : 's'} · {formatCurrency(list.reduce((s, b) => s + b.amount, 0))} total
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-[10px] font-semibold text-gray-500 uppercase">
                        <th className="px-4 py-2">Ref</th>
                        <th className="px-4 py-2">Staff</th>
                        <th className="px-4 py-2">Service</th>
                        <th className="px-4 py-2">When</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {list.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDrawer(b)}>
                          <td className="px-4 py-2 font-mono text-xs text-gray-500">{b.reference}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{b.staff}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{b.service}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{formatDateTime(b.startAt)}</td>
                          <td className="px-4 py-2">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-right">{formatCurrency(b.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === 'byStaff' && (
        <div className="space-y-4">
          {byStaff.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12">No bookings match your filters.</p>
          ) : (
            byStaff.map(([staffName, list]) => (
              <div key={staffName} className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{staffName}</div>
                    <div className="text-xs text-gray-500">
                      {list.length} booking{list.length === 1 ? '' : 's'} · {formatCurrency(list.reduce((s, b) => s + b.amount, 0))} attributed
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-[10px] font-semibold text-gray-500 uppercase">
                        <th className="px-4 py-2">Ref</th>
                        <th className="px-4 py-2">Guest</th>
                        <th className="px-4 py-2">Service</th>
                        <th className="px-4 py-2">When</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {list.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDrawer(b)}>
                          <td className="px-4 py-2 font-mono text-xs text-gray-500">{b.reference}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {guestDisplayName(b, portalRole, ordinalMap)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">{b.service}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{formatDateTime(b.startAt)}</td>
                          <td className="px-4 py-2">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-right">{formatCurrency(b.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <BookingDetailDrawer
        booking={selectedBooking}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
        portalRole={portalRole}
        ordinalMap={ordinalMap}
      />
    </div>
  )
}
